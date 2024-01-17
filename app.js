var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var brandRouter = require('./routes/brand');
var categoryRouter = require('./routes/category');
var cartRouter = require('./routes/cart');
var orderRouter = require('./routes/order');
var productRouter = require('./routes/product');
var membershipRouter = require('./routes/membership');
var initRouter = require('./routes/init');
var searchRouter = require('./routes/search');
var rolesRouter = require('./routes/roles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.use('/membership', membershipRouter);
app.use('/init', initRouter);
app.use('/search', searchRouter);
app.use('/roles', rolesRouter);


app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

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

var db = require("./models");

// Synchronize Sequelize models with the database
db.sequelize.sync({ force: false })

module.exports = app;