"use strict";

var sendevent = require('sendevent');
var watch = require('watch');
var uglify = require('uglify-js');
//加载js压缩控件
var fs = require('fs');
var ENV = process.env.NODE_ENV || 'development';
// create static JS file to be included in the page
var polyfill = fs.readFileSync(__dirname + '/assets/eventsource-polyfill.js', 'utf8');
var clientScript = fs.readFileSync(__dirname + '/assets/client-script.js', 'utf8');
//这里是eventsource-polyfill.js和client-script.js
var script = uglify.minify(polyfill + clientScript, { fromString: true }).code;
//把这里的两个js文件全部压缩了
function reloadify(app, dir) {
  if (ENV !== 'development') {
    app.locals.watchScript = '';
    return;
  }
  // create a middlware that handles requests to `/eventstream`
  var events = sendevent('/eventstream');
  //这里处理了对/eventstream路径的请求，并作为中间件的而存在
  app.use(events);
//发送广播，要求重新加载
  watch.watchTree(dir, function (f, curr, prev) {
    events.broadcast({ msg: 'reload' });
  });
  // assign the script to a local var so it's accessible in the view
  app.locals.watchScript = '<script>' + script + '</script>';
  //在app.locals域中加入我们压缩后的js代码。在html中可以直接引入
}

module.exports = reloadify;
