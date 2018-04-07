var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var colors = require('colors');
var passport = require('passport');
var session = require('express-session')



mongoose.Promise = global.Promise;

mongoose.connect(config.database);

mongoose.connection.once('open', function(){
  console.log('Conenction to the database successful!'.cyan);
});

var app = express();

// required for passport
app.use(session({ secret: 'goforthandsettheworldonfire' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(logger('dev'));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes.js')(app, passport);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Initialize passport
app.use(passport.initialize());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
