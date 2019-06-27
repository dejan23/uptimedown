// WORKER-RELATED TASKS

// Dependencies
const url = require('url');
const util = require('util');
const debug = util.debuglog('workers');
const Checks = require('../models/Check');
const Events = require('../models/Events');
const User = require('../models/User');
const Logs = require('../models/Logs');
const schedule = require('node-schedule');
const request = require('request');

const nodemailer = require('nodemailer');
const sparkPostTransport = require('nodemailer-sparkpost-transport');
const transporter = nodemailer.createTransport(
  sparkPostTransport({
    sparkPostApiKey: process.env.SPARKPOST_API_KEY
  })
);

// Instantiate the worker object
const workers = {};

// Init script
workers.init = function() {
  // Send to console, in yellow
  console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');

  // Execute all the checks
  schedule.scheduleJob('*/15 * * * * *', function() {
    console.log('===========================');
    workers.gatherAllChecks();
  });
};

// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = async () => {
  try {
    // Get all the checks
    const checks = await Checks.find({ pause: false });

    if (!checks) {
      return console.log('Error: Could not find any checks to process');
    }

    if (checks && checks.length > 0) {
      checks.map(originalCheckData => {
        if (
          Date.now() - originalCheckData.lastChecked >=
          originalCheckData.interval * 1000 * 60
        ) {
          workers.validateCheckData(originalCheckData);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Sanity-check the check-data
workers.validateCheckData = function(originalCheckData) {
  originalCheckData =
    typeof originalCheckData == 'object' && originalCheckData !== null
      ? originalCheckData
      : {};
  originalCheckData.protocol =
    typeof originalCheckData.protocol == 'string' &&
    ['http', 'https'].indexOf(originalCheckData.protocol) > -1
      ? originalCheckData.protocol
      : false;
  originalCheckData.url =
    typeof originalCheckData.url == 'string' &&
    originalCheckData.url.trim().length > 0
      ? originalCheckData.url.trim()
      : false;
  originalCheckData.method =
    typeof originalCheckData.method == 'string' &&
    ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1
      ? originalCheckData.method
      : false;
  originalCheckData.successCodes =
    typeof originalCheckData.successCodes == 'object' &&
    originalCheckData.successCodes instanceof Array &&
    originalCheckData.successCodes.length > 0
      ? originalCheckData.successCodes
      : false;
  originalCheckData.interval =
    typeof originalCheckData.interval == 'number' &&
    originalCheckData.interval % 1 === 0 &&
    originalCheckData.interval >= 1 &&
    originalCheckData.interval <= 5
      ? originalCheckData.interval
      : false;

  // Set the keys that may not be set (if the workers have never seen this check before)
  originalCheckData.state =
    typeof originalCheckData.state == 'string' &&
    ['up', 'down', 'wait...'].indexOf(originalCheckData.state) > -1
      ? originalCheckData.state
      : 'down';
  originalCheckData.lastChecked =
    typeof originalCheckData.lastChecked == 'string' &&
    originalCheckData.lastChecked.length > 0
      ? originalCheckData.lastChecked
      : false;

  // If all the checks pass, pass the data along to the next step in the process
  if (
    originalCheckData.protocol &&
    originalCheckData.url &&
    originalCheckData.method &&
    originalCheckData.successCodes &&
    originalCheckData.interval
  ) {
    workers.performCheck(originalCheckData);
  } else {
    debug('Error: One of the checks is not properly formatted. Skipping it.');
  }
};

// Perfrom the check, send the originalCheckData and the outcome of the check process, to the next step in the process
workers.performCheck = async originalCheckData => {
  // Prepare the initial check outcome
  let checkOutcome = {
    error: false,
    responseCode: false,
    responseTime: false
  };

  // Mark tat the outcome has not been sent yet
  let outcomeSent = false;

  // Parse the hostname and the path out of the original check data
  const parsedUrl = url.parse(
    originalCheckData.protocol + '://' + originalCheckData.url
  );

  // Construct the request
  const requestDetails = {
    method: originalCheckData.method.toUpperCase(),
    uri: parsedUrl.href,
    timeout: originalCheckData.timeoutSeconds * 1000,
    time: true
  };

  // Instantiate the request object
  const req = request(requestDetails, function(error, res) {
    // Grab the status of the sent request
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    }
    let status = '';
    let responseTime = '';
    let responseTimeInt = null; //i use this for log / avrage response because it needs to be an integer

    if (!res) {
      status = 'no response';
      responseTime = 'no response';
    } else {
      status = res.statusCode;
      responseTime = res.elapsedTime + ' ms';
      responseTimeInt = res.elapsedTime;
    }

    console.log(parsedUrl.href, ' - ', status, responseTime);

    // Update the checkoutcome and pass the data along
    checkOutcome.responseCode = status;
    checkOutcome.responseTime = responseTime;
    if (!outcomeSent) {
      workers.processCheckOutcome(
        originalCheckData,
        checkOutcome,
        responseTimeInt
      );
      outcomeSent = true;
    }
  });

  // Bind to the error event so it doesnt get thrown
  req.on('error', function(e) {
    // Update the checkoutcome and pass the data along
    checkOutcome.error = {
      error: true,
      value: e
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // Bind to the timeout event
  req.on('timeout', function(e) {
    // Update the checkoutcome and pass the data along
    checkOutcome.error = {
      error: true,
      value: 'timeout'
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });
};

// Process the check outcome, update the check data as needed, trigger an alert if needed
// Special logic for accomodating a check that has never been tested before (dont alert on that one)
workers.processCheckOutcome = async (
  originalCheckData,
  checkOutcome,
  responseTimeInt
) => {
  const currentEvent = await Events.findOne({
    checkId: originalCheckData._id
  }).sort({ createdAt: -1 });

  // Decide if the check is considered up or down
  const state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
      ? 'up'
      : 'down';

  // Decide if an alert is warranted
  let alertWarranted = false;
  if (currentEvent.state !== 'started') {
    console.log('alert', originalCheckData.state, state);
    console.log(
      'alert',
      originalCheckData.lastChecked && originalCheckData.state !== state
        ? true
        : false
    );
    alertWarranted =
      originalCheckData.lastChecked && originalCheckData.state !== state
        ? true
        : false;
  }

  // Log the outcome of the check
  const timeOfCheck = Date.now();

  const newCheckData = originalCheckData;

  // Create new log
  const log = new Logs();
  log.userId = originalCheckData.userId;
  log.checkId = originalCheckData._id;
  log.url = originalCheckData.url;
  log.responseTime = responseTimeInt;
  log.time = timeOfCheck;
  log.state = state;

  await log.save();

  // Create new event if first time down or up
  const event = new Events();

  if (
    (state === 'up' && currentEvent.state === 'started') ||
    (state === 'up' && currentEvent.state === 'down') ||
    (state === 'up' && currentEvent.state === 'paused') ||
    (state === 'up' && currentEvent.state === 'restarted')
  ) {
    event.userId = originalCheckData.userId;
    event.checkId = originalCheckData._id;
    event.url = originalCheckData.url;
    event.state = 'up';
    event.responseCode = checkOutcome.responseCode;
    await newCheckData.events.push(event);

    currentEvent.duration = Date.now() - currentEvent.createdAt;
    await currentEvent.save();

    await event.save();
  }

  let response = 'no response';
  originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
    ? null
    : (response = 'wrong response');
  if (!!checkOutcome.error) {
    if (checkOutcome.error.value.code === 'ESOCKETTIMEDOUT')
      response = 'Connection Timeout';
    if (checkOutcome.error.value.code === 'ENOTFOUND') response = 'Not Found';
    if (checkOutcome.error.value.code === 'ETIMEDOUT')
      response = 'Connection Timeout';
  }

  if (
    (state === 'down' && currentEvent.state === 'started') ||
    (state === 'down' && currentEvent.state === 'up') ||
    (state === 'down' && currentEvent.state === 'paused') ||
    (state === 'down' && currentEvent.state === 'restarted')
  ) {
    event.userId = originalCheckData.userId;
    event.checkId = originalCheckData._id;
    event.url = originalCheckData.url;
    event.state = 'down';
    event.responseCode = response;
    await newCheckData.events.push(event);

    currentEvent.duration = Date.now() - currentEvent.createdAt;
    await currentEvent.save();

    await event.save();
  }

  // Update the check data
  newCheckData.state = state;
  newCheckData.lastChecked = timeOfCheck;
  newCheckData.responseTime = checkOutcome.responseTime;
  newCheckData.responseCode = checkOutcome.responseCode;
  newCheckData.logs.push(log);

  await Checks.findByIdAndUpdate(originalCheckData._id, newCheckData);

  if (alertWarranted) {
    workers.alertUserToStatusChange(newCheckData, response);
  } else {
    debug('Check outcome has not changed, no alert needed');
  }
};

// Alert the user as to a change in their check status
workers.alertUserToStatusChange = async (newCheckData, response) => {
  const user = await User.findOne({ _id: newCheckData.userId });

  const msgWReason =
    'Alert: Your check for ' +
    newCheckData.method.toUpperCase() +
    ' ' +
    newCheckData.protocol +
    '://' +
    newCheckData.url +
    ' is currently ' +
    newCheckData.state +
    '. Reason - "' +
    response +
    '" <br /> Uptimedown <br /> Web: https://uptimedown.net <br /> Email: dejan.dvte@gmail.com';
  const msgWOReason =
    'Alert: Your check for ' +
    newCheckData.method.toUpperCase() +
    ' ' +
    newCheckData.protocol +
    '://' +
    newCheckData.url +
    ' is currently ' +
    newCheckData.state +
    '. <br /> Uptimedown <br /> Web: https://uptimedown.net <br /> Email: dejan.dvte@gmail.com';
  const msg = response === 'no response' ? msgWOReason : msgWReason;
  const email = !user.email ? 'the_bra1n@live.com' : user.email;
  console.log(email);

  transporter.sendMail(
    {
      from: 'Uptimedown <no-reply@mail.uptimedown.net>',
      to: email,
      subject: 'Server state changed - Uptimedown',
      html: msg
    },
    (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    }
  );
};

// Export the module
module.exports = workers;
