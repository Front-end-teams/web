var Post = require("../models/post.js");
//中间件multer的配置（实现上传功能）
var upload = require('../models/multerUtil');

var formidable = require("../models/formidable.js")
var Ques = require('../models/ask.js');
var quesComment = require('../models/quesComment.js');
var searchall=require('../models/searchAll.js')

var crypto = require('crypto'),
    User = require('../models/user.js'),
    Note = require('../models/note.js');

var jobHunting = require('../models/jobHunting');
var geolocation = require('../tools/city');
var pagination = require('express-paginate');

var area = require("../models/area.js");

var nodemailer = require('nodemailer');


var imghandle = require('../models/imgHandle.js');

var nodemailer = require('nodemailer');
var ejs = require('ejs');


module.exports = function(app) {

	app.post("/wangEditor",formidable);

  //上传的ajax触发的操作
	app.post('/upload1',function(req,res){
    
    //将信息存入文章数据库
    console.log(req.body);
   
    var artText=decodeURIComponent(req.body.post).substr(0,100);
    console.log(artText);
    var tags = decodeURIComponent(req.body.tags).split(",");
    
    var post = new Post(req.session.user.email, decodeURIComponent(req.body.title),tags,decodeURIComponent(req.body.post),decodeURIComponent(req.body.cates),artText);
      post.save(function (err) {
    
      if (err) {  
        console.log("error");
      }
     res.send({
                author: req.session.user.email,
                title: req.body.title,
                tags: req.body.tags,
                post: req.body.post,
                cates: req.body.cates
    });
  });  
	})
	//注册页面

  app.get('/reg', function (req, res) {
    res.render('reg/reg', {
      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

  });
  app.post('/reg/email', function (req, res) {
    var email = req.body.email;
    console.log(req.body);
    //检查email是否已经存在 
    User.getEmail(email, function (err, user) {
      if (err) {
        req.flash('error', err);
      }
      if (user) {
        res.send("reged");
        return;
        // return ;//返回注册页
      }
      res.send('success');//如果email不存在就返回
    });
  });  

  //注册页面submit时就新建一个用户，并将其存入数据库
  app.post('/reg',function(req,res){
    console.log(req.body);
    var email = decodeURIComponent(req.body.email);
    var password = decodeURIComponent(req.body.password);
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        email: email,
        password: password,
        bigimg: 'uploads/default200.jpg',
        middleimg: 'uploads/default100.jpg',
        smallimg: 'uploads/default30.jpg'         
    });
    console.log(newUser);
    newUser.save(function(err,user){
      if(err){
        req.flash('error', err);
      }

      req.session.user = newUser;//用户信息存入 session


      req.flash('success', '注册成功!');
      res.send("regsuccess");
      //res.redirect('/');//注册成功后跳转主页
    });
  });


  app.post('/login/password',function(req,res){
    var md5 = crypto.createHash('md5'),
        password = md5.update(decodeURIComponent(req.body.password)).digest('hex');   
    User.getEmail(decodeURIComponent(req.body.email),function(err,user){
      console.log(user);
      console.log(password);
      console.log(user.password);
      if(!user){     
        res.send("邮箱不存在！");
      }else{
        if(user.password!==password){
          res.send("邮箱与密码不一致");
        }else{
          res.send('match');
        }
      }
    });
      
  });

  app.post('/login', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(decodeURIComponent(req.body.password)).digest('hex');
    console.log(req.body);
    User.getEmail(decodeURIComponent(req.body.email),function(err,user){
      console.log(user);
      if(!user){     
        res.send("用户不存在！");
        return;
      }else{
        //用户名密码都匹配后，将用户信息存入 session
        console.log('ccc');
        req.session.user = user;
        req.session.save();
        //req.flash('success', '登陆成功!');
        res.send("loginsuccess");
        //res.redirect('/');//登陆成功后跳转到主页
      }
    });     
  });

  //退出页面
  app.get('/logout', checkLogin);
  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');//登出成功后跳转到主页
  });

   
//用户权限函数
function checkLogin(req, res, next) {
  if (!req.session.user) {
    
    res.redirect('/reg');
  } else {
    next();
  }
 
  
}


	//文章
		
	app.get('/', function(req, res, next) {

	  res.render('index', { title: '前端交流',
      user:req.session.user
	  				});
	});
	//文章二级页面
  app.get('/post',checkLogin);
  app.get('/post', function (req, res) {
  	var newPage = req.query.p ? parseInt(req.query.p) : 1;
    var hotPage = req.query.p ? parseInt(req.query.p) : 1;
    Post.countPost({author:req.session.user.email},function(err,count){
      if(err){
        console.log(err);
      }
      Post.getTen(null, newPage,{time:-1}, function (err, new_posts, new_total,new_userImg) {
        if (err) {
          new_posts = [];
        } 
        Post.getTen(null,hotPage,{pv:-1},function(err,hot_posts,hot_total,hot_userImg){
          if(err){
            hot_posts = [];
          }
          Post.getTen(null,hotPage,{agreeLength:-1,time:-1},function(err,recom_posts,recom_total,recom_userImg){
            if(err){
              console.log(err);
              return;
            }
           
            res.render('post/post', {
              title: '文章',
              new_posts:new_posts,
              hot_posts:hot_posts,
              count:count,
              newPage: newPage,
              hotPage: hotPage,
              user: req.session.user,
              new_userImg:new_userImg,
              hot_userImg:hot_userImg,
              recom_posts:recom_posts
            });
          })
          
        })
       
      });
    })   	
  });

app.get('/postpage/new/:item',function(req,res){
  
  var newPage = req.params.item;
  Post.getTen(null, req.params.item,{time:-1}, function (err, new_posts, new_total,new_userImg) {
    
    if (err) {
      new_posts = [];
    }  
   var newPost = {
      new_posts:new_posts,     
      newPage: newPage,
      newIsFirstPage: (newPage - 1) == 0,
      newIsLastPage: ((newPage - 1) * 10 + new_posts.length) >= new_total,
      newLastPage:Math.ceil(new_total/10),
      new_userImg:new_userImg,
    };
    ejs.renderFile('./views/post/newpost.ejs',newPost,function(err,htmlres){
      if(err){
        console.log(err)
        return;
      }

      res.send({
        htmlres:htmlres,
        newIsLastPage:newPost.newIsLastPage
      });   
    })
  })   
})

app.get('/postpage/hot/:item',function(req,res){
  
  var hotPage = req.params.item;
  Post.getTen(null, req.params.item,{pv:-1}, function (err, hot_posts, hot_total,hot_userImg) {
    
    if (err) {
      new_posts = [];
    }  
    console.log(hot_posts);
   var hotPost = {
      new_posts:hot_posts,     
      newPage: hotPage,
      newIsFirstPage: (hotPage - 1) == 0,
      newIsLastPage: ((hotPage - 1) * 10 + hot_posts.length) >= hot_total,
      newLastPage:Math.ceil(hot_total/10),
      new_userImg:hot_userImg,
    };
    ejs.renderFile('./views/post/newpost.ejs',hotPost,function(err,htmlres){
      if(err){
        console.log(err)
        return;
      }
      
      res.send({
        htmlres:htmlres,
        hotIsLastPage:hotPost.newIsLastPage
      });   
    })
  })   
})
 /*需要写文章的页面*/
  app.get('/writePost',checkLogin);

	app.get('/writePost',function(req,res){
		Post.getTags({},function(err,tags){
			if(err){
				console.log(err);
				tags=[];
			}
			
			Post.getArchive({},function(err,cates){
				if(err){
					console.log("cates error");
					cates=[];
				}
				
				res.render('post/writePost',{
					user: req.session.user,
					title:"文章编辑",
					tags: tags,
          postTags: null,
          postTitle: null,
          post:null,
          art: null,
          postCates:null,
					cates: cates
				})
			})
			
		})
	})
		//查看文章详细信息
  app.get("/detail/:author/:title",function(req,res){
  	
    var isAgree = false;
    var isColl = false;
    var isAttention = false;
    
    Post.getOne({author: req.params.author,title: req.params.title}, function (err, post) {
      if (err) {
        req.flash('error', err); 
        
        console.log(err);
      }
      //判断是否已点赞
      if ( req.session.user && post.agree &&post.agree.indexOf(req.session.user.email)>=0 ) {
        isAgree = true;
      }
      //判断是否已收藏
      if ( req.session.user && post.postcoll.indexOf(req.session.user.email)>=0 ) {
        isColl = true;
      }
      User.getOne({email:req.params.author},function(err,author_detail){
        //------------------------------昵称问题--------------------------------
        if( req.session.user && req.session.user.attention && req.session.user.attention.indexOf(req.params.author) >=0){
          isAttention = true;
        }
       
      //获取作者的头像（昵称的问题）
        Post.getTen({tags:{$in:post.tags}},1,{pv:-1},function(err, posts, totle,userImg){
          if ( err ){
            console.log(err);
          }
          Post.countPost({author:req.session.user.email},function(err,count){
            if(err){
              console.log(err);
             }
          //访问量增加
          
          Post.viewNum( {author: req.params.author,title: req.params.title},function(err){
            Post.getArchive({author:req.session.user.email},function(err,docs){
              
              res.render('post/showPost', {
                title: req.params.title,
                post: post,
                relate: posts,
                cates: docs,
                count:count,
                user: req.session.user,
                author_detail:author_detail,
                isAgree : isAgree,
                isColl: isColl,
                isAttention:isAttention
              })
            });
          })
          })
        }) 
      })     
    });
  })

  // 文章删除
  app.get('/deletePost/:author/:title',function(req,res){
    console.log('delete');
    Post.remove(req.params,function(err){
      if(err){
        console.log(err);
        return
      }
      res.send('success');
    })
  })

  //文章修改
  app.get("/writePost/:author/:title",function(req,res){
   
    Post.getOne(req.params,function(err,post){
      if(err){
        console.log(err);
        return res.redirect('/');
      }
      Post.getTags({},function(err,tags){
      if(err){
        console.log(err);
        tags=[];
      }
      
      Post.getArchive({},function(err,cates){
        if(err){
          console.log("cates error");
          cates=[];
        }
      res.render("post/writePost",{
        title: "文章编辑",
        postTitle: post.title,
        user: req.session.user,
        postTags: post.tags,
        tags: tags,
        postCates:post.cates,
        cates: cates,
        post:post.post,
        art: post.art

      })
    })
    })
    }) 
  })

  //更新文章
  app.put('/post/update',function(req,res){
    var artText=decodeURIComponent(req.body.post).substr(0,200);
    
    var tags = decodeURIComponent(req.body.tags).split(",");
    
    Post.update({author:req.session.user.email,title:decodeURIComponent(req.body.title)},
                {post:decodeURIComponent(req.body.post),tags:tags,cates:decodeURIComponent(req.body.cates),art:artText},function(err){
                  if(err){
                    console.log(err);
                  }
                  console.log('update')
                  res.send({
                    author: req.session.user.email,
                    title: req.body.title,
                    tags: req.body.tags,
                    post: req.body.post,
                    cates: req.body.cates
                  })
  })
  })
  //文章点赞
  app.post("/agree/:author/:title", function(req,res){
    console.log("start");
    var agree = [];
    console.log(req.body);
    Post.getOne(req.body, function (err, post) {
      if (err) {
        req.flash('error', err);
         console.log("err:"+err);
        return res.redirect('/');
      }
    
      agree = post.agree;
   
    
    //console.log(agree);
   var jsonUpdate={
        author: req.body.author,
        title: req.body.title,
        user: req.session.user.email
      }
  
     if ( agree.indexOf(jsonUpdate.user) < 0 ){
      console.log("agree");
      Post.agree(jsonUpdate, function(err){
        if (err) {
          //req.flash('error', err);
          console.log(err);
        }
        //点赞
        //var temp=agree.length + 1;
        res.json({agree: agree.length+1,
                  isAgree: true}); 
      })
    } else {
      console.log("disagree");
      Post.disagree(jsonUpdate,function(err){
        if( err ) {
          console.log(err);
          res.send(false);
        }
        console.log(agree.length);
        
        res.json({agree:agree.length-1,
                  isAgree:false});
      })
    }  
  }) 
  });

  //文章收藏
  app.post("/collect/:author/:title",function(req,res){
    console.log("start");
    var coll = [];
    console.log(req.body);
    Post.getOne(req.body, function (err, post) {
      if (err) {
        req.flash('error', err);
         console.log("err:"+err);
        return res.redirect('/');
      }
      coll = post.postcoll;
       var jsonUpdate={
            author: req.body.author,
            title: req.body.title,
            user: req.session.user.email
          }
      
       res.setHeader('content-type', 'application/json');
      if ( coll.indexOf ( jsonUpdate.user ) < 0 ) {
        console.log("collection");
        Post.addCollect(jsonUpdate, function(err){
          console.log("add");
          if (err) {
            console.log("err");
            console.log(err);
          }
          User.getEmail(req.session.user.email,function(err,user){
            if(err){
              console.log(err);
            }
            
            req.session.user = user;
            req.session.save();
            console.log(req.session.user);
            res.json({isColl: true}); 
          })

        })
      } else {
        
        Post.deleteCollect(jsonUpdate,function(err){
          if( err ) {
            console.log(err);
          }
          User.getEmail(req.session.user.email,function(err,user){
            if(err){
              console.log(err);
            }
            console.log(user);
            req.session.user = user;
            req.session.save();
            console.log(req.session.user);
            res.json({isColl: false}); 


          })
          
        })
      }  
    }) 
  })
 
   //文章分类

  app.get('/cates',function(req,res){
    
    console.log("chegn");
    console.log({cates:req.query.cates,author:req.session.user.email});
    Post.getTen({cates:req.query.cates,author:req.session.user.email},1,{time:-1},function(err,docs,total,userImg){
      if(err){
        console.log(err);
      }
      Post.getArchive({author:req.session.user.email},function(err,cates){
        console.log(docs);
        res.render('post/cate', {
          title: '分类',
          post: docs,
          cates: cates,
          user: req.session.user,
        })
      })    
    })
  })

  //用户设置
  app.get("/userSet",function(req,res){
    User.getEmail(req.session.user.email,function(err,user){
      if(err){
        console.log(err);
      }
      console.log(user);
      res.render("user/userSet",{
      title: "用户设置",
      user:req.session.user
    })
    })
    
  })

//修改用户地址(城市)
app.post("/user/info/city",function(req,res){
  console.log(req.body.province);
  area.getCity(req.body.province,function(err,city){
    if(err){
      console.log(err);
    }
    console.log(city);
    res.send(city.city);
  })

})

//修改用户地址(区县)
app.post("/user/info/area",function(req,res){
  console.log(req.body.city);
  console.log(req.body);
  area.getArea(req.body,function(err,area){
    if(err){
      console.log(err);
    }
    console.log(area);
    res.send(area);
  })


})
//用户头像上传
app.post('/userset/imgupload',upload.single("file"),function(req,res){
  
  console.log(req);
  
  //将信息存入文章数据库
  var path = "/uploads/"+req.file.filename;
  console.log("user");
  
  User.update({email: req.session.user.email},{img:path},function(err){
    if(err){
      console.log(err);
    }
    res.send({
      img: path
    })
  })
})
//用户email验证
app.post("/user/info/email",function(req,res){
  
   var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
      host: "smtp.163.com", 
      port: 25,
      auth: {
        user: 'chanda_yang@163.com',
        pass: 'yangchang8025'
      }
  });

  var mailOptions = {
      from: 'yang <chanda_yang@163.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world ✔', // plaintext body
      html: '<b>Hello world ✔</b>' // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
           console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      }
  });
    res.send('success');
})

//用户更改密码
app.post("/user/info/oldpw",function(req,res){
  var curpw = req.session.user.password;
  var oldpw = req.body.oldpw;
  if(curpw ==oldpw){
    res.send('密码正确');
  }else{
    res.send('密码不正确');
  }
})


app.post("/user/info/newpw",function(req,res){
  var newpw = req.body.newpw;
  console.log(newpw);
  User.update({email: req.session.user.email},{password:newpw},function(err){
    if(err){
      console.log(err);
    }else{
      res.send('成功更改密码');
    }
  })
})


//用户头像上传
  app.post('/userset/imgupload',upload.single("file"),function(req,res){
    console.log("file");
    console.log(req.body);
    //将信息存入文章数据库
    var path = "/uploads/"+req.file.filename;
    console.log("user");
  
    User.update({email: req.session.user.email},{img:path},function(err){
      if(err){
        console.log(err);
      }
      res.send({
        img: path
      })
    })
  })
  //用户头像剪切
  app.post("/upload/imgupload/size",function(req,res){
    console.log("size");

    User.getEmail(req.session.user.email, function(err, user){
      if(err){
        console.log(err);
      }
      

      imghandle.imgCrop({path:user.img,
        width:req.body.w,
        height:req.body.h,
        x:req.body.x,
        y:req.body.y,
        rWidth:200,
        rHeight:200
      },function(err,bigpath){
      
        imghandle.imgResize({path:bigpath,rWidth:100,rHeight:100},function(err,middlepath){
          console.log(middlepath);
          imghandle.imgResize({
            path:middlepath,
            rWidth:30,
            rHeight:30
          },function(err,smallpath){
          

            User.update({email: req.session.user.email},{bigimg:bigpath,middleimg:middlepath,smallimg:smallpath},function(err){
              if(err){
                console.log(err);
              };
              User.getEmail(req.session.user.email, function(err, user){
                req.session.user = user;
                req.session.save();
                res.send({
                  bigimg: bigpath,
                  smallimg: smallpath
                })
              })
            })
          })
        })
   
      });

    })

  })


app.post("/user/info/newpw",function(req,res){
  var newpw = req.body.newpw;

  User.update({email: req.session.user.email},{password:newpw},function(err){
    if(err){
      console.log(err);
    }else{
      res.send('成功更改密码');
    }
    
  })
})

app.post("/user/info",function(req,res){
  User.update({email:req.session.user.email},
  {
      nick:req.body.nick,
      position:req.body.position,
      sex:req.body.sex,
      aboutme:req.body.aboutme,
  },
  function(err){
    if(err){
      console.log(err);
    }else{
      res.send('个人资料保存成功');
    }
  })
})
 
// 发布问题
  app.get('/ask', checkLogin);
  app.get('/ask',function(req,res){
    console.log("ask");
    res.render('qa/ask',{
      title:'ask',
      user: req.session.user
    });
  });
  app.post('/ask', checkLogin);
  app.post('/ask',function(req,res){
    var currentUser = req.session.user,
        quesTitle = req.body.quesTitle,
        email = currentUser.email,
        head = currentUser.head,
        quesDetail=req.body.quesDetail,
        tags=req.body.tags,
        questionDetail=new Ques(email, head, quesTitle,quesDetail,tags);
        questionDetail.save(function(err){
         if (err) {
          req.flash('error', err); 
          return res.redirect('/');
         } 
         //res.redirect('/question');
         res.send('发布成功!');

         //发表成功跳转到主页
        });
  });

//实现点赞
app.post('/agree',function(req,res){
  console.log(333);
  var email=req.body.email; 
  var day=req.body.day;
  var quesTitle=req.body.quesTitle;
  console.log(444); 
  Ques.agree(email, day, quesTitle,function(err,question) {
        if (err) {
          req.flash('error', err);
          console.log(err);
        }else{
          if (question instanceof Object) {
            var temp=parseInt(question.agree.length)+1;
            console.log("temp1:"+temp);
            res.send(temp.toString());
          }else{
            var temp=question;
            console.log("temp1:"+temp);
            res.send(temp.toString());
          }        
        }
      });
});
//实现点踩=
app.post('/disagree',function(req,res){
  console.log(333);
  var email=req.body.email; 
  var day=req.body.day;
  var quesTitle=req.body.quesTitle;
  console.log(444); 
  Ques.disagree(email, day, quesTitle,function(err,question) {
        if (err) {
          req.flash('error', err);
          console.log(err);
        }else{
          if (question instanceof Object) {
            var temp=parseInt(question.disagree.length)+1;
            console.log("temp1:"+temp);
            res.send(temp.toString());
          }else{
            var temp=question;
            console.log("temp1:"+temp);
            res.send(temp.toString());
          }        
        }
      });
});


  //------------------------------------显示问题(按最新排序)
// app.get('/question', function (req, res) {
//     //判断是否是第一页，并把请求的页数转换成 number 类型
//     var page = req.query.p ? parseInt(req.query.p) : 1;
//     //查询并返回第 page 页的 10 篇文章
//     Ques.getTen(null, page, function (err, questions, total) {
//       if (err) {
//         questions = [];
//       } 
//       Ques.getMostHot(null,function(err, questionsHot){
//       if (err) {
//         questionsHot = [];
//       }
//       res.render('qa/question', {
//         questionsHot: questionsHot,
//         title: '问题',
//         questions: questions,
//         page: page,
//         isFirstPage: (page - 1) == 0,
//         isLastPage: ((page - 1) * 2 + questions.length) == total,
//         LastPage:Math.ceil(total/2),
//         user: req.session.user,
//         success: req.flash('success').toString(),
//         error: req.flash('error').toString()
//       });
//     });
//     });
//   });
app.get('/question',checkLogin);
app.get('/question', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    var num=8;
Ques.getTen(null, page, num, function (err, questions, total,authorImg) {
      if (err) {
        questions = [];
      } 
  Ques.getTags(function(err, tags){
      if (err) {
        tags = [];
      }
    Ques.getTen(req.session.user.email,null,null,function(err,userQuestions,userQuestionsTotal,userImg){
      quesComment.getAllCommentsOfOne(req.session.user.email,null,null,function(err,userComments,userCommentsTotal){
        var arr=[];
        for(var i=0,leng=userComments.length;i<leng;i++){
          for(var j=0,len=userComments[i].comments.length;j<len;j++){
            if (req.session.user.email==userComments[i].comments[j].email) {
              arr.push({
                  quesTitle:userComments[i].quesTitle,
                  comments:userComments[i].comments[j]
                });
            }
          }
        }
      res.render('qa/question', {
        tags: tags,
        title: '问题',
        questions: questions,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * num + questions.length) == total,
        LastPage:Math.ceil(total/num),
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        userQuestionsTotal:userQuestionsTotal,
        userCommentsTotal:arr.length,
        authorImg:authorImg,
      });
      });
    });
    });
    });
  });

//---------------------------------显示问题(按最热排序)
app.get('/questionHot', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    var num=8;
Ques.getMostHot(null, page, num, function (err, questions, total,authorImg) {
      if (err) {
        questions = [];
      } 
  Ques.getTags(function(err, tags){
      if (err) {
        tags = [];
      }

    Ques.getMostHot(req.session.user.email,null,null,function(err,userQuestions,userQuestionsTotal,userImg){
      quesComment.getAllCommentsOfOne(req.session.user.email,null,null,function(err,userComments,userCommentsTotal){
        console.log(userComments);
        var arr=[];
        for(var i=0,leng=userComments.length;i<leng;i++){
          console.log("userComments.length:"+userComments.length);
          for(var j=0,len=userComments[i].comments.length;j<len;j++){
            if (req.session.user.email==userComments[i].comments[j].email) {
              arr.push({
                  quesTitle:userComments[i].quesTitle,
                  comments:userComments[i].comments[j]
                });
            }
          }
        }
      res.render('qa/questionHot', {
        tags: tags,
        title: '问题',
        questions: questions,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * num + questions.length) == total,
        LastPage:Math.ceil(total/num),
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        userQuestionsTotal:userQuestionsTotal,
        userCommentsTotal:arr.length,
        authorImg:authorImg,
      });
      });
    });
    });
    });
  });
//----------------------------显示问题(按没有回答的问题最新排序)
app.get('/questionNoAnswer', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    var num=8;
Ques.getNoAnswer(null, page, num, function (err, questions, total,authorImg) {
      if (err) {
        questions = [];
      } 
  Ques.getTags(function(err, tags){
      if (err) {
        tags = [];
      }

    Ques.getNoAnswer(req.session.user.email,null,null,function(err,userQuestions,userQuestionsTotal,userImg){
      quesComment.getAllCommentsOfOne(req.session.user.email,null,null,function(err,userComments,userCommentsTotal){
        console.log(userComments);
        var arr=[];
        for(var i=0,leng=userComments.length;i<leng;i++){
          console.log("userComments.length:"+userComments.length);
          for(var j=0,len=userComments[i].comments.length;j<len;j++){
            if (req.session.user.email==userComments[i].comments[j].email) {
              arr.push({
                  quesTitle:userComments[i].quesTitle,
                  comments:userComments[i].comments[j]
                });
            }
          }
        }
      res.render('qa/questionNoAnswer', {
        tags: tags,
        title: '问题',
        questions: questions,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * num + questions.length) == total,
        LastPage:Math.ceil(total/num),
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        userQuestionsTotal:userQuestionsTotal,
        userCommentsTotal:arr.length,
        authorImg:authorImg,
      });
      });
    });
    });
    });
  });
//显示某个标签的所有问题
app.get('/questionTags', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var tag = req.query.tag;
    //查询并返回第 page 页的 10 篇文章
    Ques.getTags(function(err, tags){ 
      if (err) {
        tags = [];
      }
     Ques.getTag(tag, page, function (err, questions,total) {
      if (err) {
        req.flash('error',err); 
        return res.redirect('/');
      }
    
     Ques.getTagInfo(tag,function(err,tagInfo){
        if (err) {
        req.flash('error',err); 
        return res.redirect('/');
       }
       console.log(tagInfo);
       res.render('qa/questionTags', {
        tags:tags,
        tag:tag,
        tagInfo:tagInfo,
        title: 'TAG:' + tag,
        questions: questions,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 2 + questions.length) == total,
        LastPage:Math.ceil(total/2),
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
     });
     });
   });
  });

//------------------------------显示问题具体内容
  app.get('/questionDetail', function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var num=8;
    Ques.getOne(req.query.email, req.query.day, req.query.quesTitle, function (err, question) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }

      res.render('qa/questionDetail', {
        title:"具体问题",
        quesTitle: req.query.quesTitle,
        quesDetail: question.quesDetail,
        day:question.time.day,
        email:question.email,
        user: req.session.user,
        comments:question.comments,
        commentsLength:question.comments.length,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        page:page,
        isFirstPage: (page-1)== 0,
        isLastPage: (page*num)>=(question.comments.length),
        LastPage:Math.ceil(question.comments.length/num),
        num:num
      });
    });
  });
//----------------------------------显示某个问题的某个评论的具体内容----------
app.post('/getReplyOfComment',function(req,res){
  var email=req.body.email,
      day=req.body.day,
      questitle=req.body.quesTitle,
      commentid=req.body.commentId;
  console.log("email:"+email);
  console.log("day:"+day);
  console.log("quesTitle:"+questitle);
  console.log("commentId:"+commentid);
  quesComment.getReplyOfComment(email, day, questitle, commentid, function(err,question){
         var reply=question.comments[0].reply;
         console.log('reply:'+reply);
         res.send(reply);
  });
});
//-----------------------------回答问题------------------------
app.post('/questionDetail', function (req, res) {
    var date = new Date();
    var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  };
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
        head = "images/7.jpg"; 
    var comment = {
        email: req.body.email,
        head: head,
        website: req.body.website,
        time:time,
        content: req.body.content,       
        reply:[],
        agreeNum:0,
        agree:[],
        disagreeNum:0,
        disagree:[]
    };
    var email=req.query.email,
        day=req.query.day,
        quesTitle=req.query.quesTitle; 
    var newQuesComment = new quesComment(email, day, quesTitle, comment);
    newQuesComment.save(function (err) {
      if (err) {
        console.log(err);
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', '留言成功!');
      res.redirect('back');
    });
  });
//-----------------------------回复评论------------------------
app.post('/commentReply',function(req,res){
  var email=req.body.email,
      day=req.body.day,
      quesTitle=req.body.quesTitle,
      commentReplyFromName=req.body.commentReplyFromName,
      commentReplyToName=req.body.commentReplyToName,
      commentReplyContent=req.body.commentReplyContent,
      commentId=req.body.commentId;
      
  var date = new Date();
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  };
  var commentreply={
      "commentReplyFromName":commentReplyFromName,
      "commentReplyToName":commentReplyToName,
      "commentReplyContent":commentReplyContent,
      "time":time
  };
    quesComment.commentreply(email,day,quesTitle,commentId,commentreply,function(err){
        if (err) {
        req.flash('error', err); 
        console.log("err:"+err);
        return res.redirect('/');
      }      
      res.send(commentreply);
  });
});
//----------------------------------------评论的点赞
  app.post("/commentAgree",function(req,res){
  var email=req.body.email,
      day=req.body.day,
      quesTitle=req.body.quesTitle,
      commentId=req.body.commentId;
    console.log(333);
    console.log("email:"+email);
    console.log("day:"+day);
    console.log("quesTitle:"+quesTitle);
    console.log("commentId:"+commentId);
    quesComment.commentAgree(email,day,quesTitle,commentId,function(err,question){
        if (err) {
          req.flash('error', err);
          console.log(err);
        }else{
          if (question instanceof Object) {
            var temp=parseInt(question.comments[commentId].agree.length)+1;
            console.log("temp1:"+temp);
            res.send(temp.toString());
          }else{
            var temp=question;
            console.log("temp1:"+temp);
            res.send(temp.toString());
          }
        }
    });
  });
//--------------------------------------评论的点踩
  app.post("/commentDisagree",function(req,res){
  var email=req.body.email,
      day=req.body.day,
      quesTitle=req.body.quesTitle,
      commentId=req.body.commentId;
    console.log(333);
    console.log("email:"+email);
    console.log("day:"+day);
    console.log("quesTitle:"+quesTitle);
    console.log("commentId:"+commentId);
    quesComment.commentDisagree(email,day,quesTitle,commentId,function(err,question){
        if (err) {
          req.flash('error', err);
          console.log(err);
        }else{
          if (question instanceof Object) {
            
            var temp=parseInt(question.comments[commentId].disagree.length)+1;       
            res.send(temp.toString());
          }else{
            var temp=question;
            console.log("temp1:"+temp);
            res.send(temp.toString());
          }
        }
    });
  });
 /*...............................................以下模块(dev by liangtan).............................................................*/

  //  app.get('/saveArticle',function(req,res){
  //    res.render('post/writePost', {
  //     title: '发表',
  //     user: req.session.user,
  //     success: req.flash('success').toString(),
  //     error: req.flash('error').toString()
  //   });
  //  })
  // app.post('/saveArticle', function (req, res) {
  //   //记得同时要get/post
  //    var user=req.session.user;
  //    //在session中
  //    var body=req.body;
  //    //获取消息体,封装到Article对象上面UID, title, tag, time, Browse,agree,review,content
  //   var article=new Article(user,body.title,body.tag,new Date(),body.Browse,body.agree,body.review,body.content);
  //   //实例对象直接调用save方法
  //   article.save(function(err){
  //         if(err){
  //            req.flash('error',err);
  //            return res.redirect('/');
  //         }
  //         req.flash('success','文章保存成功');
  //         //把success的键值发送到主页
  //           res.redirect('/');
  //   });
  // });
 /*-----------------产生分页的模块,jobs表示数据库返回的jobs集合-------------*/

 app.get('/job-page',function(req,res){
    jobHunting.getAllJob(function(jobs){
       console.log(req.query.page);
       //默认是第一页
        console.log(req.query.limit);
        //默认每一页是10
              jobHunting.paginate({}, { page: req.query.page, limit: req.query.limit }, function(err, users, pageCount, itemCount) {
              if (err) return next(err);
              res.format({
                html: function() {
                  res.render('job/jobs', {
                    title:"工作",
                    user: req.session.user,
                    users: users,
                    pageCount: pageCount,
                    itemCount: itemCount,
                    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                  });
                },
                json: function() {
                  // inspired by Stripe's API response for list objects 
                  res.json({
                    object: 'list',
                    has_more: paginate.hasNextPages(req)(pageCount),
                    data: users
                  });
                }
              });
           
            });
     })
 })

 /*------------------工作的详细的信息-----------*/
 app.get('/job-detail',function(req,res){
      var id=(req.query.id);
      console.log("ID:"+id);
      //获取工作的具体的id
      jobHunting.getSpecial(id,function(job){
          //console.log(job.companyName);
          //req.flash("jobs",job);
          res.render("job/job-detail-show",{
            user: req.session.user,
            title: "工作",
            jobs:job
          });
      });
 })
/*------------------工作条件查询-----------------*/
  //app.post('/job-search', checkLogin);
//下面是工作模块,根据用户输入的信息去数据库查询信息
  app.post('/job-search',function(req,res){
      console.log('job-search被调用');
    var body=req.body;
  //构建需要查询的对象
    var jobH=new jobHunting();
    //没有定义的属性默认是空字符串而不是undefined!
    for(var name in jobH){
      if(!jobH[name]){
         jobH[name]="";
      }
    }
    jobH.jobType=body.recruitType;
    jobH.workLocation=body.workPlace;
    jobH.workTime=body.experience;  //工作年限
    jobH.rank=body.rank;   
     //对结果排名，用于数据的查询语句中
     jobHunting.search(jobH,function(jobs){
      if(!jobs.length){
        console.log('获取到的工作的数量为0！');
           res.render("job/find-job-top5",{
               title:'工作',
               watch:'根据您输入的条件没有任何招聘信息!',
               user:req.session.user
           });
           return;
       }else{
          req.flash("jobs",jobs);
          res.render("job/find-job-top5",{
            user: req.session.user,
            title:"工作",
            watch:'',
            jobs:req.flash('jobs')});
       }
     });
  });
  /*------------------工作插入-----------------*/
 //app.post('/job-insert', checkLogin);
   //如果没有登陆那么直接回到主页
  app.post('/job-insert',function(req,res){
     if(!req.session.user){
       res.redirect('user/login');
     }
      //这里我们把需要的数据全部保存到数据库中jobHunting(UID, companyName, companyLocation, workLocation, jobType,jobNum,workTime,jobTime,jobDetail) 
    var date = new Date();
    var jobTime = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  };
      var body=req.body,
      jobD=new jobHunting(req.session.user,body.companyName,body.companyLocation,body.workLocation,body.jobType,body.jobNum,body.workTime,jobTime,body.jobDetail,body.pay,body.xueli,body.ave,body.tim,body.we,body.wl,body.pep,body.dl);
       jobD.save(function(err){
         //如果出错了那么我们直接报错
         if(err){
           req.flash('error',error);
           return res.redirect('/job-insert-error');
         }
         console.log('-----------------------1');
          res.redirect('/job-insert-succ');
       });
  });
  //app.get('/job-insert', checkLogin);
  //这里是渲染一个页面用于插入数据
  app.get('/job-insert',function(req,res){
    res.render('job/job-insert',{
      user: req.session.user,
      title:"工作"
    });
  });
app.get('/job-insert-succ', function(req, res){
  console.log('-------------------------');
  //res.render('job-insert-succ', { messages: req.flash('success') });
    res.setHeader('content-type', 'text/html;charset=utf-8');
    //定时器修改DOM的代码,没间隔一秒我们刷新一次页面
    var str="<script>var count=5,href='/job-insert';function show(){var dom=document.getElementById('timer');if(count){dom.innerHTML=count;count--;}else{location.href=href;}} setInterval(show,1000);</script>";
    res.write("招聘信息发布成功,<span id='timer' style='color:red;font-weight:bold;'>5</span>秒后跳转到招聘信息发布页面"+str);
   // res.write('<meta http-equiv="refresh" content="5;url=/job-insert"></meta>');
    res.end();
});
  /*------------------工作前5条迭代查询(正在开发中)-----------------*/
app.get('/job-top5',checkLogin);
app.get('/job-top5',function(req,res){
  jobHunting.Top5('',function(jobs){
    //console.assert(jobs,'这里出错了.....');
    if((jobs instanceof Array)&&jobs.length==0){
      res.render('job/find-job-top5',{
         user:req.session.user,
         watch:'亲，您所在的城市没有任何招聘信息!',
         title:"工作"
      })
      return;
    }else{
           req.flash('top5',jobs);
           res.render('job/find-job-top5',{
              user: req.session.user,
              title:"工作",
              jobs:req.flash('top5'),
              watch:''
            });
    }
  });
});

/*-----------------用户界面路由部分---------------------*/
app.get("/user",function(req,res){
  console.log(req.session.user);
  Post.getTen({author:req.session.user.email},1,{time:-1},function(err,docs,total){
    if(err){
      console.log(err);
      return;
    }
    Ques.getTen(req.session.user.email,1,10,function(err,asks,total){
      if(err){
        console.log(err);
        return;
      }
      console.log(docs);
      console.log("cccc");
      console.log(req.session.user);
      quesComment.getAllCommentsOfOne(req.session.user.email,1,10,function(err,userComments,userCommentsTotal){
        console.log(userComments);
        var arr=[];
        for(var i=0,leng=userComments.length;i<leng;i++){
          console.log("userComments.length:"+userComments.length);
          for(var j=0,len=userComments[i].comments.length;j<len;j++){
            if (req.session.user.email==userComments[i].comments[j].email) {
              arr.push({
                  quesTitle:userComments[i].quesTitle,
                  time:userComments[i].time,
                  email:userComments[i].email,
                  comments:userComments[i].comments[j]
                });
            }
          }
        }
       res.render("user/user",{
        asks:asks,
        post: docs,
        userComments:arr,
        title: "用户",
        user: req.session.user
      });
});
    })
    
  })
	
})
//我的提问
app.get("/myAllAsk",function(req,res){
   var email=req.session.user.email;
   Ques.getTen(email,null,null,function(err,userQuestions,userQuestionsTotal){
      if (err) {
        questions = [];
      } 
      res.json(JSON.stringify(userQuestions));
   });
});
//我的回答
app.get("/myAllComment",function(req,res){
    quesComment.getAllCommentsOfOne(req.session.user.email,null,null,function(err,userComments,userCommentsTotal){
        console.log(userComments);
        var arr=[];
        for(var i=0,leng=userComments.length;i<leng;i++){
          console.log("userComments.length:"+userComments.length);
          for(var j=0,len=userComments[i].comments.length;j<len;j++){
            if (req.session.user.email==userComments[i].comments[j].email) {
              arr.push({
                  quesTitle:userComments[i].quesTitle,
                  time:userComments[i].time,
                  email:userComments[i].email,
                  comments:userComments[i].comments[j]
                });
            }
          }
        }
      res.json(arr);
      });
});

// -------------------------添加关注路由---------------------------
  app.post('/attention/:author', checkLogin);
  app.post('/attention/:author',function(req,res){
    console.log(req.params);
    console.log(req.session.user);
    if(req.session.user.attention && req.session.user.attention.indexOf(req.params.author) >=0 ){
      User.deleteAttention({email:req.session.user.email},{email:req.body.author},function(err){
        if(err){
          console.log(err);
          return
        }
        User.getOne({email:req.session.user.email},function(err,user){
          if(err){
            console.log(err);
            return
          }
          req.session.user = user;
          req.session.save();
          res.send({isAttention:'delete'});
        })
        
      })
    } else {
      User.addAttention({email:req.session.user.email},{email:req.body.author},function(err){
        if(err){
          console.log(err);
          return
        }
        User.getOne({email:req.session.user.email},function(err,user){
          if(err){
            console.log(err);
            return
          }
          
          req.session.user = user;
          req.session.save();
          res.send({isAttention:'add'});
        })        
      })       
    }    
  });

  // 取消收藏
  app.get("/deletecoll/:author/:title",function(req,res){
    var jsonColl = {author:req.params.author,title:req.params.title,user:req.session.user.email};
    Post.deleteCollect(jsonColl,function(err){
      if( err ) {
        console.log(err);
      }
      User.getEmail(req.session.user.email,function(err,user){
        if(err){
          console.log(err);
        }
        console.log(user);
        req.session.user = user;
        req.session.save();
        console.log(req.session.user);
        res.json({isColl: false}); 
      })      
    })
  })
  
//--------------------------全局搜索
    app.get("/searchall",function(req,res){
      var searchAllContent=req.query.keyword;
      console.log("searchAllContent:"+searchAllContent);
      searchall.searchAll(null,function(err,questions,total){
        console.log("what:"+questions);
      });
    });

}