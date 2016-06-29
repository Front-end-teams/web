/*
* @Author: Administrator
* @Date:   2016-04-09 13:02:40
* @Last Modified by:   Administrator
* @Last Modified time: 2016-05-22 20:56:20
*/

'use strict';
var mongodb = require('./db');

function User(user) {
  this.email = user.email;
  this.password = user.password;
  this.img = '';
  this.bigimg = user.bigimg,
  this.middleimg = user.middleimg,
  this.smallimg = user.smallimg,
  this.nick = user.nick;
  this.position = user.position;
  this.sex = user.sex;
  this.aboutme = user.aboutme;
}

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
  //要存入数据库的用户文档
  var user = {
      email: this.email,
      password: this.password,
      img:'',
      bigimg : this.bigimg,
      middleimg : this.middleimg,
      smallimg : this.smallimg,
      nick:this.nick,
      position:this.position,
      sex:this.sex,
      aboutme:this.aboutme,
      postcoll:[],
      attention:[],
      fans:[]
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//错误，返回 err 信息
        }
        callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};


User.update = function(query, set, callback){
  mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update(query, {
        $set: set
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        
        callback(null);
      });
    });
  });
}



//读取email用户信息
User.getEmail = function(email, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      console.log("1111111");
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找email值为 email 一个文档

      collection.findOne({
        email: email
      }, function (err, user) {
        mongodb.close();

        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        console.log("33311");
        
        callback(null, user);//成功！返回查询的用户信息
      });
    });
  });
};
/**
 * 添加关注执行的操作
 * @param {json} follower 执行关注操作的人{user:name}
 * @param {json} fans     关注的人{author:name}
 */
User.addAttention = function(follower,host,callback){
  console.log("attention");
  mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新user内容
      collection.update(follower, {
        $push: {attention:host.email}
      }, function (err) {
        //mongodb.close();
        if (err) {
          return callback(err);
        }
        collection.update(host,{
          $push:{fans:follower.email}
        },function(err){
          mongodb.close();
          console.log("attention");
          if (err) {
            return callback(err);
          }
          
          callback(null);
        })
        
      });
    });
  });
}
// 取消关注
User.deleteAttention = function(follower,host,callback){
  console.log("deleteattention");
  mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新user内容
      collection.update(follower, {
        $pull: {attention:host.email}
      }, function (err) {
        //mongodb.close();
        if (err) {
          return callback(err);
        }
        collection.update(host,{
          $pull:{fans:follower.email}
        },function(err){
          mongodb.close();
          if (err) {
            return callback(err);
          }

          callback(null);
        })
        
      });
    });
  });
}
//
User.getOne = function(query, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      console.log("1111111");
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找email值为 email 一个文档

      collection.findOne(query, function (err, user) {
        mongodb.close();

        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        console.log("33311");

        callback(null, user);//成功！返回查询的用户信息
      });
    });
  });
};