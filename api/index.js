const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
mongoose.Promise = global.Promise;

const workers = require('./middlewares/workers');

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
require('dotenv').config();

// if (process.env.NODE_ENV === 'production') {
//   whitelist = ['https://uptimedown.net', 'https://www.uptimedown.net']
// } else {
//   whitelist = ['http://localhost:8080', 'http://localhost:5000']
// }

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// DB setup
mongoose.connect(process.env.MONGO_URI, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log(`Connection established to the "${db.name}" mongoDB.`);
  }
});

mongoose.connection
  .once('open', () => console.log('DB, good to go!'))
  .on('error', error => {
    console.warn('Warning', error);
  });

// App setup
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))

// Routes
require('./routes/accountRoutes')(app);
require('./routes/checkRoutes')(app);
require('./routes/logRoutes')(app);
require('./routes/eventRoutes')(app);

app.get('*', function (req, res) {
  res.status(404).send('');
})

workers.init();

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} locally`);
});
