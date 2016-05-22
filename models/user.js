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
      nick:this.nick,
      position:this.position,
      sex:this.sex,
      aboutme:this.aboutme,
      postcoll:[]
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
       console.log("2222111");
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

User.update = function(query, set, callback){
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
