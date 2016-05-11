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
//取出一条评论的所有回复
quesComment.getAllReplyOfOneComment = function(name, day, title, commentid,callback) {
  //打开数据库
  console.log('1111111111111');
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    console.log('22222222222222');
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log('3333333333333');
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "quesTitle": title,
      },{"comments":{"$slice":[commentid,1]}},function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
          //解析 markdown 为 html
          // doc.post = markdown.toHTML(doc.post);
          // doc.comments.forEach(function (comment) {
          //   comment.content = markdown.toHTML(comment.content);
          // });
          callback(null, doc);//返回查询的一篇文章
        
        console.log('4444444444444');
      });
    });
  });
};
quesComment.commentreply = function(name, day, title, commentid, commentreply,callback) {
  //打开数据库
  console.log('1111111111111');
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    console.log('22222222222222');
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log('3333333333333');
      //根据用户名、发表日期及文章名进行查询
      var query={};
      query["comments."+commentid+".reply"]=commentreply;
      console.log('query:'+query);
      collection.update({
        "name": name,
        "time.day": day,
        "quesTitle": title,
      },{"$push":query},function (err) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
          //解析 markdown 为 html
          // doc.post = markdown.toHTML(doc.post);
          // doc.comments.forEach(function (comment) {
          //   comment.content = markdown.toHTML(comment.content);
          // });
          callback(null);//返回查询的一篇文章
        
        console.log('4444444444444');
      });
    });
  });
};