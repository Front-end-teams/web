﻿var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');//解析json、url等的中间件
var session = require('express-session');
var domain = require('domain');
var nodemailer = require('nodemailer');

// var compression = require('compression');
//var domain = require('domain');
//connect-mongo包实现在一个数据库连接中需要另一个连接
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var routes = require('./routes/index');

// var users = require('./routes/users');

var app = express();
var settings = require('./settings');

var pagination = require('express-paginate');
//配置domain模块
// app.c(function(){
	/*app.use(function(req,res,next){
		var reqDomain = domain.create();
		reqDomain.on('error',function(err){
			console.log('捕获到错误');
			res.send(500,err.stack);
		});
		reqDomain.run(next);
	})*/
// })

process.on('uncaughtException',function(err){
	console.error('uncaughtExpection Error');
	if(typeof err === 'object') {
		console.error('error:'+err.message);
	}
	if(err.stack) {
		console.log(err.stack);
	}else {
		console.error('argument is not  an object');
	}
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 80);
// uncomment after placing your favicon in /public
// app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'favicon1.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ uploadDir: "./public/upload" })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: settings.cookieSecret,//防止篡改cookie
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));

app.use(flash());


routes(app);



// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;
