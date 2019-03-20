const User = require('../models/User');
const Logs = require('../models/Logs');
const _ = require('lodash');
const moment = require('moment')


// Checks - GET
// Required data: id
// Optional data: none
exports.getLogData = async (req, res, next) => {
  try {
    // Check that the id is valid
    const id = typeof(req.params.id) == 'string' && req.params.id.trim().length == 24 ? req.params.id.trim() : false;

    if(id) {
      const logs = await Logs.find({'checkId': req.params.id, "createdAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}}).sort({"createdAt": 1});
      const weekLogs = await Logs.find({'checkId': req.params.id, "createdAt":{$gt:new Date(Date.now() - 7*24*60*60 * 1000)}}).sort({"createdAt": 1});
      const monthLogs = await Logs.find({'checkId': req.params.id, "createdAt":{$gt:new Date(Date.now() - 30*24*60*60 * 1000)}}).sort({"createdAt": 1});

      if(!logs || logs.length === 0) {
        return res.status(400).json({success: false, message: 'The log was not found'})
      }

      let dailyAvg = 0, dailyCount = 0;
      let hourlyAvg = {};
      let hourlyCount = {};
      let hourlySum = _.times(24, _.constant(0));
      let hours = [];

      for (let log of logs) {
        if (log.responseTime > 0) {
          dailyAvg += log.responseTime;
          dailyCount++;
        }

        let hour = parseInt( moment(log.createdAt).format("H") );
        hourlyCount[hour] = 0;

        if( ! hours.includes(hour) )
          hours.push(hour);
      }

      for(let log of logs) {
        if (log.responseTime > 0) {
          let hour = parseInt( moment(log.createdAt).format("H") );
          hourlySum[hour] += log.responseTime;
          hourlyCount[hour]++;
        }
      }

      for (let hour in hourlyCount) {
        hourlyAvg[hour] = hourlyCount[hour] != 0 ? Math.round(hourlySum[hour] / hourlyCount[hour]) : 0;
      }

      dailyAvg = dailyAvg / dailyCount;

      // Weekly average by days
      let weekDayAvg = 0, weekCount = 0;
      let hourlyAvg2 = {};
      let hourlyCount2 = {};
      let hourlySum2 = _.times(7, _.constant(0));
      let days = [];

      for (let weekLog of weekLogs) {
        if (weekLog.responseTime > 0) {
          weekDayAvg += weekLog.responseTime;
          weekCount++;
        }

        let day = parseInt(moment(weekLog.createdAt).format("d"));

        hourlyCount2[day] = 0;

        if( ! days.includes(day) )
          days.push(day);
      }

      for(let weekLog of weekLogs) {
        if (weekLog.responseTime > 0) {
          let day = parseInt(moment(weekLog.createdAt).format("d"));
          hourlySum2[day] += weekLog.responseTime;
          hourlyCount2[day]++;
        }
      }

      for (let day in hourlyCount2) {
        hourlyAvg2[day] = hourlyCount2[day] != 0 ? Math.round(hourlySum2[day] / hourlyCount2[day]) : 0;
      }


      // Weekly average
      let weeklyAvg = 0, weeklyCount = 0;

      for (let weekLog of weekLogs) {
        if (weekLog.responseTime > 0) {
          weeklyAvg += weekLog.responseTime;
          weeklyCount++;
        }
      }

      weeklyAvg = weeklyAvg / weeklyCount;

      // Monthly average
      let monthlyAvg = 0, monthlyCount = 0;

      for (let monthLog of monthLogs) {
        if (monthLog.responseTime > 0) {
          monthlyAvg += monthLog.responseTime;
          monthlyCount++;
        }
      }

      monthlyAvg = monthlyAvg / monthlyCount;

      res.status(200).json({
        success: true,
        message: 'Here is the avg hour response time log',
        hours: hours,
        hour: hourlyAvg,
        dailyAvg: dailyAvg,
        weeklyAvg: weeklyAvg,
        monthlyAvg: monthlyAvg,
        days: days,
        weekDayAvg: hourlyAvg2
      })


    } else {
      const usersChecks = await User.findById(req.decoded.user._id).populate('checks');
      if(!usersChecks){
        return res.status(400).json({success: false, message: 'The user was not found'})
      }

      res.status(200).json({
        success: true,
        message: 'Here are all of the checks of the user: ' + req.decoded.user.username,
        checks: usersChecks.checks
      })
    }
  } catch(err){
    next(err)
  }
}

// Checks - GET
// Required data: id
// Optional data: none
exports.getLogDataStats = async (req, res, next) => {
  try {
    // Check that the id is valid
    const id = typeof(req.params.id) == 'string' && req.params.id.trim().length == 24 ? req.params.id.trim() : false;

    if(id) {
      const dayLogs = await Logs.find({'checkId': req.params.id, "createdAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}}).sort({"createdAt": 1});
      const weekLogs = await Logs.find({'checkId': req.params.id, "createdAt":{$gt:new Date(Date.now() - 7*24*60*60 * 1000)}}).sort({"createdAt": 1});
      const monthLogs = await Logs.find({'checkId': req.params.id, "createdAt":{$gt:new Date(Date.now() - 30*24*60*60 * 1000)}}).sort({"createdAt": 1});

      if(!dayLogs || dayLogs.length === 0 || !weekLogs || weekLogs.length === 0 || !monthLogs || monthLogs.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'The log was not found',
          dayUpAvg: 'wait...',
          dayDownAvg: 'wait...',
          weekUpAvg: 'wait...',
          weekDownAvg: 'wait...',
          monthUpAvg: 'wait...',
          monthDownAvg: 'wait...'
        })
      }

      const dayUpTotal = dayLogs.filter((dayLog) => {
          return dayLog.state === 'up'
      })

      const dayDownTotal = dayLogs.filter((dayLog) => {
          return dayLog.state === 'down'
      })

      const dayLogsTotal = dayLogs.map((dayLog) => {
          return dayLog.state
      })

      const dayUpAvg = Math.round((dayUpTotal.length / dayLogsTotal.length) * 100);
      const dayDownAvg = Math.round((dayDownTotal.length / dayLogsTotal.length) * 100) ;
      ///////////////////////////////////////////////

      const weekUpTotal = weekLogs.filter((weekLog) => {
          return weekLog.state === 'up'
      })

      const weekDownTotal = weekLogs.filter((weekLog) => {
          return weekLog.state === 'down'
      })

      const weekLogsTotal = weekLogs.map((weekLog) => {
          return weekLog.state
      })

      const weekUpAvg = Math.round((weekUpTotal.length / weekLogsTotal.length) * 100);
      const weekDownAvg = Math.round((weekDownTotal.length / weekLogsTotal.length) * 100);
      ///////////////////////////////////////////////

      const monthUpTotal = monthLogs.filter((monthLog) => {
          return monthLog.state === 'up'
      })

      const monthDownTotal = monthLogs.filter((monthLog) => {
          return monthLog.state === 'down'
      })

      const monthLogsTotal = monthLogs.map((monthLog) => {
          return monthLog.state
      })

      const monthUpAvg = Math.round((monthUpTotal.length / monthLogsTotal.length) * 100);
      const monthDownAvg = Math.round((monthDownTotal.length / monthLogsTotal.length) * 100);

      res.status(200).json({
        success: true,
        message: 'Here are the stats',
        dayUpAvg: dayUpAvg,
        dayDownAvg: dayDownAvg,
        weekUpAvg: weekUpAvg,
        weekDownAvg: weekDownAvg,
        monthUpAvg: monthUpAvg,
        monthDownAvg: monthDownAvg
      })


    } else {
      const usersChecks = await User.findById(req.decoded.user._id).populate('checks');
      if(!usersChecks){
        return res.status(400).json({success: false, message: 'The user was not found'})
      }

      res.status(200).json({
        success: true,
        message: 'Here are all of the checks of the user: ' + req.decoded.user.username,
        checks: usersChecks.checks
      })
    }
  } catch(err){
    next(err)
  }
}