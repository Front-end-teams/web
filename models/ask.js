var mongodb = require('./db');
function Ques(name, head, quesTitle, quesDetail,tags) {
  this.name = name;
  this.head = head;
  this.quesTitle = quesTitle;
  this.quesDetail = quesDetail;
  this.tags=tags;
}
module.exports = Ques;
//存储一篇问题及其内容
Ques.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  //要存入数据库的文档
  var question = {
      name: this.name,
      head: this.head,
      time: time,
      quesTitle:this.quesTitle,
      quesDetail: this.quesDetail,
      comments: [],
      agree:[],
      disagree:[],
      agreeNum:0,
      disagreeNum:0,
      tags:this.tags,
      pv:0
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 questions 集合
      collection.insert(question, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null);//返回 err 为 null
      });
    });
  });
};
//一次获取十篇问题
Ques.getTen = function(name, page, num, callback) {
  //打开数据库
  // mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();

        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
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
};
//获取最热文章
Ques.getMostHot = function(name, page, callback) {
  //打开数据库
  // mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();

        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function (err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果

        collection.find(query, {
          skip: (page - 1)*2,
          limit: 2
        }).sort({
          pv: -1
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
};
//获取没有回答的问题
Ques.getNoAnswer = function(name, page, callback) {
  //打开数据库
  // mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();

        return callback(err);
      }
      var query = {
        comments:[]
      };
      if (name) {
        query.name = name;

      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function (err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果

        collection.find(query, {
          skip: (page - 1)*2,
          limit: 2
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
};
//获取一篇
Ques.getOne = function(name, day, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "quesTitle": title
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        if (doc) {
          //每访问 1 次，pv 值增加 1
          collection.update({
            "name": name,
            "time.day": day,
            "quesTitle": title
          }, {
            $inc: {"pv": 1}
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
          callback(null, doc);//返回查询的一篇文章
        }
      });
    });
  });
};
//返回所有标签
Ques.getTags = function(callback) {
  //打开数据库
  mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //distinct 用来找出给定键的所有不同值
      collection.distinct("tags", function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};
//获取某个标签的所有问题
Ques.getTag = function(tag, page, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
      console.log("openErr:"+err);
    }
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        console.log("getTagErr:"+err);
        return callback(err);   
      }
      //查询所有 tags 数组内包含 tag 的文档
      //并返回只含有 name、time、title 组成的数组
      var query={"tags":tag};
      collection.count(query, function (err, total) { 
      collection.find(query,{
          skip: (page - 1)*2,
          limit: 2
        }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          console.log("err111:"+err);
          return callback(err);
        }
        callback(null, docs, total);
      });
    });
    });
  });
};
//获取某个标签的信息
Ques.getTagInfo = function(tag,callback) {
  // mongodb.close();
  console.log("tag111");
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
      console.log("openErr:"+err);
    }
    console.log("tag222");
    db.collection('tags', function (err, collection) {
      if (err) {
        mongodb.close();
        console.log("getTagErr:"+err);
        return callback(err);   
      }
      console.log("tag333");
      //查询所有 tags 数组内包含 tag 的文档
      //并返回只含有 name、time、title 组成的数组
      var query={"tagName":tag};
      console.log("tag444");
      collection.findOne({"tagName":tag},function (err, docs) {
        mongodb.close();
        console.log("tag555");
        if (err) {
          console.log("err111:"+err);
          return callback(err);
        }
        console.log("tag666");
        callback(null, docs);
        console.log("tag777");
      });
    });
  });
};
// Ques.agree = function(name, day, title, callback) {
//   //打开数据库
//   console.log(777); 
//   mongodb.close(); 
//   console.log(7777777);
//   mongodb.open(function (err, db) {
//     console.log('看看进来没');
//     if (err) {
//       return callback(err);
//       console.log('x1x1x1');
//     }
//     console.log(888);
//     //读取 posts 集合
//     db.collection('questions', function (err, collection) {
//       if (err) {
//         mongodb.close();
//         return callback(err);
//       }
//       console.log(999);
//       //更新文章内容
//       collection.update({
//         "name":name,
//         "time.day":day,
//         "quesTitle":title
//       }, {
//         $push: {"agree": name},
//         $inc: {"agreeNum":1}
//       }, function (err) {
//         mongodb.close();
//         if (err) {
//           return callback(err);
//         }

//         console.log(1212);
//         callback(null);
//         console.log(1313);
//       });
//     });
//  });
// };
Ques.agree = function(name, day, title, callback) {
  //打开数据库
  mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "quesTitle": title
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        if (doc) {
          //每访问 1 次，pv 值增加 1
          var temp=doc;
          console.log("temp:"+temp);
          if (temp.agree.indexOf(name) < 0) {
          collection.update({
            "name": name,
            "time.day": day,
            "quesTitle": title
          }, {
            $push: {"agree": name},
            $inc: {"agreeNum":1}
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
            callback(null, doc);//返回查询的一篇文章
          }else
          {
              var temp=doc.agree.length;
              callback(null, temp);
          }
        }

      });
    });
  });
};
Ques.disagree = function(name, day, title, callback) {
  //打开数据库
  mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "quesTitle": title
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        if (doc) {
          //每访问 1 次，pv 值增加 1
          var temp=doc;
          console.log("temp:"+temp);
          if (temp.disagree.indexOf(name) < 0) {
          collection.update({
            "name": name,
            "time.day": day,
            "quesTitle": title
          }, {
            $push: {"disagree": name},
            $inc: {"disagreeNum":1}
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
            callback(null, doc);//返回查询的一篇文章
          }else
          {
             var temp=doc.disagree.length;
             callback(null, temp);
          }
        }

      });
    });
  });
};