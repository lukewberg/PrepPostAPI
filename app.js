const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors');
const config = require('./config.json')



mongoose.Promise = global.Promise;

mongoose.connect(config.env.DB_ADDRESS, {useNewUrlParser: true});

mongoose.connection.once('open', function () {
  console.log('Connection to the database successful!'.cyan);
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(bodyparser.urlencoded({
  extended: false
}));
app.use(bodyparser.json())
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/schedule', require('./routes/schedule'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;