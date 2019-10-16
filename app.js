var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

const passport = require('./passport');
require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const auth = require('./routes/auth');

var app = express();
//console.log(typeof usersRouter)

//connect to database 

const connStr = `mongodb+srv://${process.env.DB_USER}:${
  process.env.DB_PASS
  }@${process.env.DB_URL}/${process.env.DB_NAME}`;


mongoose.connect(connStr, err => {
  if (err) fail(err);
  else console.log("Connected database!");

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/ ', passport.authenticate('jwt', { session: false }), indexRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), auth);

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
  res.render('error');
});

module.exports = app;
