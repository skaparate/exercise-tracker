'use strict';
// https://fuschia-custard.glitch.me/
// Test user: 9qkwljqda3
// User id: HydnJjD8N

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const exerciseRoutes = require('./exercise');
const dbManager = require('./db')(mongoose);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(function (req, res, next) {
    console.info(`Request: [${req.ip} - ${req.path}]`);
    next();
});

// Apply the exercise routes:
app.use('/api/exercise',
    cors({
        optionSuccessStatus: 200
    }), dbManager.open, function (req, res, next) { // Close the database connection at the end of the request?
        console.log('hit exercise');
        next();
    }, exerciseRoutes, dbManager.close);

// Respond to not found routes.
app.use(function (req, res, next) {
    if (req.method.toLowerCase() === 'options') {
        res.end();
    } else {
        res.status(404).type('txt').send('Not Found');
    }
});

// Error handling
app.use(function (err, req, res, next) {
    if (err) {
        res.status(err.status || 500)
            .type('txt')
            .send(err.message || 'SERVER ERROR');
    }
});



// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});
