const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3001

require('dotenv').config();

const workers = require('./service/workers');

// DB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true }, function (err, db) {
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

// Routes
//

app.get('*', function (req, res) {
    res.status(404).send('');
})

workers.init();

app.listen(port, () => console.log(`Uptimedown Worker Server listening on port ${port}!`))