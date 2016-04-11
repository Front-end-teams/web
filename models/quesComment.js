var mongodb = require('./db');

function quesComment(name, day, title, comment) {
  this.name = name;
  this.day = day;
  this.title = title;
  this.comment = comment;
}

module.exports = quesComment;

//存储一条留言信息
quesComment.prototype.save = function(callback) {
  console.log('aaa');
  var name = this.name,
      day = this.day,
      title = this.title,
      comment = this.comment;
  //打开数据库
  console.log('bbb');
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    console.log('ccc');
    //读取 posts 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log('ddd');
      //通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档的 comments 数组里
      collection.update({
        "name": name,
        "time.day": day,
        "quesTitle": title
      }, {
        $push: {"comments": comment}
      } , function (err) {
        console.log('eee');
          mongodb.close();
          if (err) {
            return callback(err);
          }
          console.log('fff');
          callback(null);
          console.log('ggg');
      });   
    });
  });
};
