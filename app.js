const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const { handleErrorResponse } = require('./middlewares');

// init
const app = express();
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Auth Route
app.use('/login', require('./routes/auth.routes'));

// Routes
app.use('/cases', require('./routes/case.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/rules', require('./routes/rule.routes'));
app.use('/areas', require('./routes/area.routes'));
app.use('/institutions', require('./routes/institution.routes'));

// handle status 500 exception response
app.use(handleErrorResponse);

module.exports = app;
