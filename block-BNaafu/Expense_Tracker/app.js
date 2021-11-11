var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var passport = require('passport');


// configure .env file
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientRouter = require('./routes/client');
var incomeRouter = require('./routes/income');
var expenseRouter = require('./routes/expense');
var auth = require('./middleware/auth')

var app = express();

mongoose.connect('mongodb://localhost/Expense_Tracker',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => console.log(err ? err : "Connected true")
);
  
// stragety defined inside passport.js file
require('./modules/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session middleware must always be set after cookiesParser has been added as middleware
app.use(session({
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));

// Connect to flash error message
// setting up of middleware and always be set up after the session middleware
app.use(flash());


app.use(auth.userInfo);
app.use(passport.initialize());

app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/client', clientRouter)

app.use('/income', incomeRouter);
app.use('/expense', expenseRouter);

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
  res.render('error');
});

module.exports = app;