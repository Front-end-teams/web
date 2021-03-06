var mongodb = require('./db')
var mongo=require('mongodb');
 //发布者ID(UID)，公司名称(companyName),公司地点(companyLocation)，工作地点(workLocation)，
 //招聘类型(校园jobType)，招聘人数(jobNum)，工作年限(workTime)，发布时间(jobTime)，要求(jobDetail)
function jobHunting(UID, companyName, companyLocation, workLocation, jobType,jobNum,workTime,jobTime,jobDetail,pay,xueli,ave,tim,we,wl,pep,dl) {
  this.UID = UID;
  this.companyName = companyName;
  this.companyLocation = companyLocation;
  this.workLocation = workLocation;
  this.jobType=jobType;
  this.jobNum=jobNum;
  this.workTime=workTime;
  this.jobTime=jobTime;

  this.jobDetail=jobDetail;

  this.pay=pay?pay:'无';
  this.xueli=xueli?xueli:'无';
  this.ave=ave?ave:'无';
  this.tim=tim?tim:'无';
  this.we=we?we:'无';
  this.wl=wl?wl:'无';
  this.pep=pep?pep:'无';
  this.dl=dl?dl:'无';
}
module.exports = jobHunting;
//构建一个save函数，把数据保存到数据库中
jobHunting.prototype.save = function(callback) {
  //要存入数据库的文章信息
  var Article = {
      UID: this.UID,
      companyName:this.companyName,
      companyLocation:this.companyLocation,
      workLocation:this.workLocation,
      jobType:this.jobType,
      jobNum:this.jobNum,
      workTime:this.workTime,
      jobTime:this.jobTime,
      jobDetail:this.jobDetail,
      pay:this.pay,
      xueli:this.xueli,
      ave:this.ave,
      tim:this.tim,
      we:this.we,
      wl:this.wl,
      pep:this.pep,
      dl:this.dl
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //打开数据库中的Article
    db.collection('jobHunting', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log('要插入的数据如下....................');
      console.log(Article);
      //将文档插入Article 集合
      collection.insert(Article, {
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

/*-------------正在开发------------*/
//一次获取前5条招聘信息,但是因为后面我们可能智能识别用户的地址，所以我们查询本地的前5条招聘信息
jobHunting.Top5= function(location,callback) {
  console.log(location);
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
       console.log('err0');
      return callback(err);
    }
    //读取 jobHunting 集合
    db.collection('jobHunting', function (err, collection) {
      if (err) {
        mongodb.close();
        //return callback(err);
        console.log('err1');
      }
      var query = {};
      if (location) {
        query.workLocation = location;
      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function (err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
        collection.find(query, {
         // skip: (page - 1)*10,
         // limit: 10
         limit:10
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
         callback.call(null, docs);
        });
      });
    });
  });
};
/*..........................数据库查询,根据多个字段进行查询....................................*/
//获取一篇文章
jobHunting.search = function(jobH, callback) {
 //jobH.jobType=body.recruitType;
    //jobH.workLocation=body.workPlace;
    //jobH.workTime=body.experience;  //工作年限
    //jobH.rank=body.rank;   
   mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('jobHunting', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //工作类型
        if(!jobH.jobType){
           var pattern1=/(\S)*/;
      }else{
            var pattern1=new RegExp(jobH.jobType, "i");
      }
      //工作地点
      if(!jobH.workLocation){
           var pattern2=/(\S)*/;
      }else{
            var pattern2=new RegExp(jobH.workLocation, "i");
      }
      //工作经验
       if(!jobH.workTime){
           var pattern3=/(\S)*/;
      }else{
            var pattern3=new RegExp(jobH.workTime, "i");
      }
      collection.find({
          "jobType": pattern1,//关键字成了RegExp了
          "workLocation":pattern2,
          'workTime':pattern3
      }, {
       // "name": 1,
        //"time": 1,
        //"title": 1
      }).sort({
       // time: -1
      }).toArray(function (err, docs) {
          callback.call(null, docs);
        mongodb.close();
        if (err) {
         return callback(err);
        }
      });
    });
  });
};
/*.......................................根据id来查询工作.........................*/
jobHunting.getSpecial = function(id, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('jobHunting', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var BSON = mongo.BSONPure;
      var objectId = BSON.ObjectID.createFromHexString(id);
      //ObjectId("56fc7ff4b04a69ec06a13561")
      collection.find({
          "_id":objectId
      }, {
      }).sort({
      
      }).toArray(function (err, docs) {
        var job=docs[0];
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback.call(null, job);
      });
    });
  });
};
/*....................................获取所有的jobHunting信息............................*/
jobHunting.getAllJob = function(callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 jobHunting 集合
    db.collection('jobHunting', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.find({}, {
      }).sort({
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(docs);
      });
    });
  });
};