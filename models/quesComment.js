var mongodb = require('./db');

function quesComment(email, day, title, comment) {
  this.email = email;
  this.day = day;
  this.title = title;
  this.comment = comment;
}

module.exports = quesComment;

//存储一条留言信息
quesComment.prototype.save = function(callback) {
  console.log('aaa');
  var email = this.email,
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
        "email": email,
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
quesComment.getReplyOfComment = function(email, day, questitle, commentid,callback) {
  //打开数据库
  console.log('1111111111111');
  mongodb.close();
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
      var index=parseInt(commentid);
      collection.findOne({
        "email": email,
        "time.day": day,
        "quesTitle": questitle
      },{"comments":{"$slice":[index,1]}},function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }

          callback(null, doc);//返回查询的一篇文章
        
        console.log('4444444444444');
      });
    });
  });
};
//对评论进行回复
quesComment.commentreply = function(email, day, title, commentid, commentreply,callback) {
  //打开数据库
  console.log('1111111111111');
  mongodb.close();
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
        "email": email,
        "time.day": day,
        "quesTitle": title,
      },{"$push":query},function (err) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
          callback(null);//返回查询的一篇文章
        
        console.log('4444444444444');
      });
    });
  });
};
//取出某人在所有问题中的评论
quesComment.getAllCommentsOfOne=function(email,page,num,callback){
  mongodb.close();
  mongodb.open(function(err,db){
    if (err) {
      return callback(err);
    }
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();

        return callback(err);
      }
      var query = { 
        "comments":{"$elemMatch":{"email":email}}
      };
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function (err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果

        collection.find(query, {
          skip: (page - 1)*num,
          limit: num
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          //解析 markdown 为 html
          // docs.forEach(function (doc) {
          //   doc.question = markdown.toHTML(doc.question);
          // }); 

          callback(null, docs, total);
        });
      });
    });
  });
}
//评论的点赞
quesComment.commentAgree=function(email,day,title,commentid,callback){
    //打开数据库
  console.log("哈哈哈111");
  mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
          db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log("哈哈哈333");
      //根据用户名、发表日期及文章名进行查询
      collection.find({
        "email": email,
        "time.day": day,
        "quesTitle": title
      }, {"comments":1},function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        console.log("哈哈哈444");
        console.log("doc:"+doc);
        if (doc) {
          //每访问 1 次，pv 值增加 1
          var temp=doc;
          console.log("temp:"+temp);
          if (temp.comments[commentid].agree.indexOf(email) < 0) {
            var query={},
                query1={};
            query["comments."+commentid+".agree"]=email;
            query1["comments."+commentid+".agreeNum"]=1;
            console.log('query:'+query);
          collection.update({
            "email": email,
            "time.day": day,
            "quesTitle": title
          }, {
            $push: query,
            $inc: query1
          }, function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
          });
          //解析 markdown 为 html
          // doc.post = markdown.toHTML(doc.post);
          // doc.comments.forEach(function (comment) {
          //   comment.content = markdown.toHTML(comment.content);
          // });
          console.log("哈哈哈555");
            callback(null, doc);//返回查询的一篇文章
          }else
          {
              var temp=doc.comments[commentid].agree.length;
              callback(null,temp);
          }
        }

      });
    });
    }
    console.log("哈哈哈222");
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log("哈哈哈333");
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "email": email,
        "time.day": day,
        "quesTitle": title
      }, {"comments":1},function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        console.log("哈哈哈444");
        console.log("doc:"+doc);
        if (doc) {
          //每访问 1 次，pv 值增加 1
          var temp=doc;
          console.log("temp:"+temp);
          if (temp.comments[commentid].agree.indexOf(email) < 0) {
            var query={},
                query1={};
            query["comments."+commentid+".agree"]=email;
            query1["comments."+commentid+".agreeNum"]=1;
            console.log('query:'+query);
          collection.update({
            "email": email,
            "time.day": day,
            "quesTitle": title
          }, {
            $push: query,
            $inc: query1
          }, function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
          });
          //解析 markdown 为 html
          // doc.post = markdown.toHTML(doc.post);
          // doc.comments.forEach(function (comment) {
          //   comment.content = markdown.toHTML(comment.content);
          // });
          console.log("哈哈哈555");
            callback(null, doc);//返回查询的一篇文章
          }else
          {
              var temp=doc.comments[commentid].agree.length;
              callback(null,temp);
          }
        }

      });
    });
  });
};
//评论的点踩
quesComment.commentDisagree=function(email,day,title,commentid,callback){
    //打开数据库
  console.log("哈哈哈111");
  mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    console.log("哈哈哈222");
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log("哈哈哈333");
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "email": email,
        "time.day": day,
        "quesTitle": title
      },function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        console.log("哈哈哈444");
        console.log("doc:"+doc);
        if (doc) {
          //每访问 1 次，pv 值增加 1
          var temp=doc;
          console.log("temp:"+temp);
          if (temp.comments[commentid].disagree.indexOf(email) < 0) {
            var query={},
                query1={};
            query["comments."+commentid+".disagree"]=email;
            query1["comments."+commentid+".disagreeNum"]=1;
            console.log('query:'+query);
          collection.update({
            "email": email,
            "time.day": day,
            "quesTitle": title
          }, {
            $push: query,
            $inc: query1
          }, function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
          });
          //解析 markdown 为 html
          // doc.post = markdown.toHTML(doc.post);
          // doc.comments.forEach(function (comment) {
          //   comment.content = markdown.toHTML(comment.content);
          // });
            console.log("哈哈哈555");
            callback(null, doc);//返回查询的一篇文章
          }else
          {
               var temp=doc.comments[commentid].disagree.length;
              callback(null, temp);
          }
        }

      });
    });
  });
};