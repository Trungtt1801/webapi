require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('./mongo/category.model');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');
var cartRouter = require('./routes/cart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var cors = require('cors');

var corsOptionsDelegate = function (req, callback) {
  var corsOptions= { origin: true };
  callback(null, corsOptions);
}
app.use(cors(corsOptionsDelegate));
// const cors = require('cors');
// app.use(cors());
// kết nối database mogoose
mongoose.connect('mongodb://localhost:27017/ASM')
.then(() => console.log('Kết nối Database thành công'))
.catch(err=> console.log(err))

// định nghĩa
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
// app.use('/cart', cartRouter);

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
