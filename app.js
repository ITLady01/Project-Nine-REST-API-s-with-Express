'use strict';
// load modules
const express = require('express');
const morgan = require('morgan');
const models = require("./models");
const Sequelize = require('sequelize');
const routeIndex = require('./routes/index');
const routerUsers= require('./routes/users');
const routerCourses = require('./routes/courses');
const options = {
  dialect: 'sqlite',
  storage: './fsjstd-restapi.db',
  // This option configures Sequelize to always force the synchronization
  // of our models by dropping any existing tables.
  sync: { force: true },
  define: {
    // This option removes the `createdAt` and `updatedAt` columns from the tables
    // that Sequelize generates from our models. These columns are often useful
    // with production apps, so we'd typically leave them enabled, but for our
    // purposes let's keep things as simple as possible.
    timestamps: false,
  },
};

// construct the database
const db = new Sequelize(options);

console.log('Testing the connection to the database...');

// Test the connection to the database
  db.authenticate()
    .then(() => {
      console.log('Connected to database.');
      return db.sync();
    })
    .catch(err => console.error('The connection failed.'));


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

//JSON parser
app.use(express.json());

// TODO setup your api routes here
app.use('/',routeIndex);
app.use('/api/users',routerUsers);
app.use('/api/courses', routerCourses);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});