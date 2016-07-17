var mongodb=require('./db');
function Post(author,title,tags,post,cates,art){
  this.author=author;
  this.title=title;
  this.tags=tags;
  this.post=post;
  this.cates=cates;
  this.art=art;
}

module.exports=Post;
//存储一篇文章及其相关信息
Post.prototype.save=function(callback){
  var date=new Date();
  //存储各种事件格式 方便以后扩展
  var time={
    date: date,
    year: date.getFullYear(),
    month: date.getMonth()+1,
    day: (date.getDate()<10?'0'+date.getDate():date.getDate()),
    hour: (date.getHours()<10?'0'+date.getHours():date.getHours()),
    minute: (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
  }
  // pv记录了访问量
  var post={
    author: this.author,
    title: this.title,
    time: time.year+'-'+time.month+'-'+time.day+'-'+time.hour+'-'+time.minute,
    tags: this.tags,
    cates: this.cates,
    post: this.post,
    art: this.art,
    
    postcoll: [],
    comments: [],
    agree: [],
    pv: 0

  };
  //console.log(post);
  //打开数据库
  mongodb.open(function(err,db){
    if(err){
      console.log("open error");
      return callback(err);
    }
    //读取posts数据库中的数据
    db.collection('posts',function(err,collection){
      if(err){
        console.log("read error")
        mongodb.close();
        return callback(err);
      }
      //插入

      console.log(post);
      collection.insert(post,/*{
        safe: true
      },*/function(err){
        mongodb.close();
        if(err){
          return callback(err);
        }

        callback(null);
      })
      //console.log("dddd");
    })
  })
}
  //一次获取十篇文章(query为查询条件 是一个json对象)
Post.getTen=function(query,page,order_rule,callback){
  //打开数据库
 
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
  	db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        console.log(err);
        return callback(err);
      }
   
    	collection.count(query,function(err,total){
      	//根据query条件查询 并跳过前(page-1)*10个结果，返回之后的10个结果
      	collection.find(query,{
        	skip: (page-1)*10,
        	limit: 10
      	}).sort(order_rule).toArray(function(err,docs){
       
        	if(err){
          	return callback(err);
        	}

	        /*var result = [];*/
	    		var usernames = [];
			    for (var i = 0; i < docs.length; i++) {
			      var item = docs[i];
			      var username = item.author;
			      usernames.push(username);
			    }
	   			var op = {email: {"$in": usernames}};
   			 	//查看B表中这条数据
    			db.collection('users',function(err,coll){
    				if(err){
    					mongodb.close();
    					console.log(err);
    					return callback(err);
    				}
    				var authorImg = [];
    				/*
    				for(var i = 0;i < docs.length; i++){
  						coll.findOne({email:docs[i].author},function(err,user){
  							if(err){
  								mongodb.close();
  								console.log(err);
  								return callback(err);
  							}
  							console.log(user);
  							authorImg[i] = user.smallimg;
  						})
  					}
  					console.log(authorImg);
  					callback(null,docs,total);*/
    				console.log(docs);
    				console.log(op);
    				coll.find(op).toArray(function(err, bdata){
    					if(err){
    						mongodb.close();
    						console.log(err);
    						return callback(err);
    					}
    					mongodb.close();
      				console.log(bdata);
      				console.log(docs);
      				for(var i = 0; i< docs.length; i++){
      					for(var j = 0; j< bdata.length;j++){
      						if(docs[i].author == bdata[j].email){
      							authorImg[i] = bdata[j];
      						}
      					}
      				}
      				console.log(authorImg);
        		  callback(null,docs,total,authorImg);  
      			})
    			})  
      	})
    	})
  	})
	})
}

//获取一篇文章
Post.getOne = function(query,callback) {
  console.log("getone");

  //打开数据库
  //mongodb.close();
  mongodb.open(function (err, db) {
    if (err) {
      console.log(err);

      return callback(err);
    }
    console.log("open");
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne(query, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        mongodb.close();
        

          callback(null, doc);//返回查询的一篇文章
        //}
      });
    });
  });
};

//返回原始发表的内容
Post.edit = function(query, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne(query, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc);//返回查询的一篇文章（markdown 格式）
      });
    });
  });
};

//更新一篇文章及其相关信息
Post.update = function(query, updateJson,callback) {
  console.log(query);
  console.log(updateJson);
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log('post update')
      //更新文章内容
      collection.update(query, {
        $set: updateJson
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });

  });
};

//删除一篇文章
Post.remove = function(query, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //删除转载来的文章所在的文档
      collection.remove(query, {
        w: 1
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
      
    });
  });
};

//统计用户的文章分类
Post.total = function(quary,callback) {
  mongodb.open(function(err,db) {
    if (err) {
      return callback;
    }
    db.collection('posts',function(err,collection){
      if ( err ) {
        mongodb.close();
        //return callback(err);
      }
      console.log(collection);
      collection.aggregate([{$match:quary},
                            {$group: {set_id:"cates",count: {$sum: 1 }}}]).toArray(function(err,result){
                               mongodb.close();
                               if (err) {
                                mongodb.close();
                                return callback(err);
                                }
                              console.log(result);
                            })
    })
  })
}
//返回所有文章存档信息
Post.getArchive = function(quary,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //返回只包含 name、time、title 属性的文档组成的存档数组
      collection.find(quary, {
        "time": 1,
        "title": 1,
        "cates":1
      }).sort({
        time: -1
      },function(err,docs){
        
        collection.distinct("cates", function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
       console.log(docs);
        callback(null, docs);
      });
    });
  });
  })
};

//返回所有标签
Post.getTags = function(query,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
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
        console.log(docs);
        callback(null, docs);

      });
    });
  });
};

//返回含有特定标签的所有文章
Post.getTag = function(tag, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询所有 tags 数组内包含 tag 的文档
      //并返回只含有 name、time、title 组成的数组
      collection.find({
        "tags": tag
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};

//返回通过标题关键字查询的所有文章信息
Post.search = function(keyword, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var pattern = new RegExp(keyword, "i");
      collection.find({
        "title": pattern
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
         return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};


//文章点赞功能
Post.agree = function(query, callback) {
  //打开数据库
  mongodb.close();
console.log("mongo start");//成功
console.log(query);//成功
  mongodb.open( function (err, db) {
    console.log(err);
    if (err) {
      console.log(err);
      return callback(err);
    }
    //读取 posts 集合
    console.log("posts read");
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      console.log("update");
      collection.update({author: query.author,title: query.title}, {
        $push: {"agree": query.user}
      }, function (err) {
        
        if (err) {
          mongodb.close();
          return callback(err);
        }
        mongodb.close();
        callback(null);  
      });
    });
 });
};
Post.disagree = function(query, callback) {
  //打开数据库
  mongodb.open(function (err, db) {

    if (err) {
      return callback(err);
    }

    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log("update");

      //更新文章内容
      collection.update({author: query.author,title: query.title}, {
        $pull: {"agree": query.user}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }

        callback(null);
      });
    });
 });
};
//文章访问量的更新
Post.viewNum = function(query, callback) {
   //打开数据库
  mongodb.open(function (err, db) {

    if (err) {
      return callback(err);
    }

    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log("update");

     //更新文章内容
      collection.update({author: query.author,title: query.title}, {
        $inc: {"pv": 1}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
 });

}; 
//文章收藏功能
Post.addCollect = function(query,callback){

  mongodb.close();

  mongodb.open(function(err,db){
   

    if(err){
      console.log(err);
      return callback(err);
    }

    db.collection('posts',function(err,collection){
      if(err){
        console.log(err);
        return callback(err);
      }
      console.log(query);
      collection.update({author: query.author,title: query.title},{
        $push: {"postcoll": query.user}
      }, function (err) {
        console.log("update");
        if (err) {
          mongodb.close();
          console.log("err");
          return callback(err);
        }
        console.log("success");
        //mongodb.close();
        //callback(null);  
      })
    })
     db.collection("users",function(err,collection){
      if(err){
        console.log(err);
        return callback(err);
      }
      collection.update({email:query.user},{
        $push: {"postcoll": {author:query.author,title:query.title}}
      }, function (err) {
        
        if (err) {
          mongodb.close();
          return callback(err);
        }

        mongodb.close();
        callback(null);
    })
  })
})  
}

//文章取消收藏功能
Post.deleteCollect= function(query,callback){
  mongodb.open(function(err,db){
    if(err){
      console.log(err);
      return callback(err);
    }
    db.collection('posts',function(err,collection){
      if(err){
        console.log(err);
        return callback(err);
      }

      collection.update({author: query.author,title: query.title},{
        $pull: {"postcoll": query.user}
      }, function (err) {
        
        if (err) {
          mongodb.close();
          return callback(err);
        }

        //mongodb.close();
        //callback(null);  
      })
    })
  
    db.collection("users",function(err,collection){
      console.log("error")
      if(err){
        console.log(err);
        return callback(err);
      }
      console.log("update");
      collection.update({email:query.user},{
        $pull: {"postcoll": {author:query.author,title:query.title}}
      }, function (err) {
        
        if (err) {
          mongodb.close();
          return callback(err);
        }

        mongodb.close();
        callback(null);
    })
  })
})
}

// 统计作者写的总文章数
Post.countPost = function(query,callback){
  //打开数据库
  mongodb.open(function (err, db) {

    if (err) {
      return callback(err);
    }

    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log("update");

     //更新文章内容
      collection.count(query, function (err,count) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null,count);
      });
    });
 });
}