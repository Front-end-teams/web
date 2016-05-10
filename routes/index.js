var Post = require("../models/post.js");
//中间件multer的配置（实现上传功能）
var upload = require('../models/multerUtil');

var formidable = require("../models/formidable.js")
var Ques = require('../models/ask.js');
var quesComment = require('../models/quesComment.js');

var crypto = require('crypto'),
    User = require('../models/user.js'),
    Note = require('../models/note.js');

var jobHunting = require('../models/jobHunting');
var geolocation = require('../tools/city');
var pagination = require('express-paginate');

var area = require("../models/area.js");



module.exports = function(app) {

	app.post("/wangEditor",formidable);

  //上传的ajax触发的操作
	app.post('/upload1',upload.single("file"),function(req,res){
    
    //将信息存入文章数据库
    var path = "/uploads/"+req.file.filename;
    var artText=decodeURIComponent(req.body.post).substr(0,200);
    console.log(artText);
    var post = new Post("cheng", decodeURIComponent(req.body.title), req.body.tags,decodeURIComponent(req.body.post),req.body.cates,path,artText);
      post.save(function (err) {
    
      if (err) {  
        console.log("error");
      }
     res.send({
                author: req.session.user,
                title: req.body.title,
                tags: req.body.tags,
                post: req.body.post,
                cates: req.body.cates
    });
  });  
	})

	//注册页面

  app.get('/reg', function (req, res) {
    res.render('/reg', {

      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

  });


  app.post('/', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
   	    repassword = req.body.repassword;
    //检验用户两次输入的密码是否一致
    if (repassword!== password) {
      req.flash('error', '两次输入的密码不一致!'); 
      return res.redirect('/');//返回注册页
    }
  });

  app.post('/reg/name', function (req, res) {
    res.setHeader('content-type', 'application/json');
    //console.log(req.body);
    var name = req.body.name;
    //检查用户名是否已经存在 
    User.getName(encodeURIComponent(name), function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
     //console.log(user);
      if (user) {
        res.send("用户已存在！");
        return ;//返回注册页
      }
      res.send('success');//如果该用户不存在就返回
      });
  });
  app.post('/reg/email', function (req, res) {
    res.setHeader('content-type', 'application/json');
    var email = req.body.email;
    //检查email是否已经存在 
    User.getEmail(encodeURIComponent(email), function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      if (user) {
        res.send("email已经使用过！");
        return ;//返回注册页
      }
      res.send('success');//如果email不存在就返回
    });
  });



  //前端页面submit时就新建一个用户，并将其存入数据库
  app.post('/reg',function(req,res){
    //console.log(req.body);
    //res.setHeader('content-type', 'application/json');
    var name = encodeURIComponent(req.body.name);
    var password = encodeURIComponent(req.body.password);
    var repassword = encodeURIComponent(req.body.repassword);
    var email = encodeURIComponent(req.body.email);
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
        //repassword = md5.update(req.body.repassword).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: email
    });
    //console.log(newUser);
    newUser.save(function(err,user){
      if(err){
        req.flash('error', err);
      }
      req.session.user = newUser.name;//用户信息存入 session
     // console.log("cunjinlaile")
      req.flash('success', '注册成功!');
      res.send("regsuccess");
      //res.redirect('/');//注册成功后跳转主页
    });
  });


  //登录页面
  app.get('/login', function (req, res) {
    res.render('/login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
	});
  app.post('/login/name',function(req,res){

    User.getName(encodeURIComponent(req.body.name),function(err,user){
     // console.log("1111");
      if(!user){     
        res.send("用户不存在！");
      }else{
        res.send("exist");
      }
      
    });
  });
  app.post('/login/password',function(req,res){
    var md5 = crypto.createHash('md5'),
        password = md5.update(encodeURIComponent(req.body.password)).digest('hex');   
    User.getName(encodeURIComponent(req.body.name),function(err,user){
      if(!user){     
        res.send("用户不存在！");
      }else{
          console.log("exist");
        if(user.password!==password){
          res.send("用户名与密码不一致");
        }else{
          res.send('match');
        }
           
      }
      
    });
      
  });
  app.post('/login', checkNotLogin);
  app.post('/login', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(encodeURIComponent(req.body.password)).digest('hex');
    User.getName(encodeURIComponent(req.body.name),function(err,user){

      if(!user){     
        res.send("用户不存在！");
      }else{
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        req.flash('success', '登陆成功!');
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
    /*res.render('/nav',{
      user:flase
    });*/
    res.redirect('/');//登出成功后跳转到主页
  });

   
//用户权限函数
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    //res.redirect('user/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    //res.redirect('back');//返回之前的页面
  }
  next();//执行下一个路由
}

	//文章
		
	app.get('/', function(req, res, next) {

	  res.render('index', { title: 'Express',
	  						name: "cheng",
	  						author: '0001',
	  						tag: 'fort',
						    time: 'now',
						    user: req.session.user,
						    Browse: 100,
						    agree: 90,
						    review: 23,
						    post: 'hello world' });
	});
	//文章二级页面

  app.get('/post', function (req, res) {
  	var page = req.query.p ? parseInt(req.query.p) : 1;

   	Post.getTen(null, page, function (err, posts, total) {
      if (err) {
        posts = [];
      } 
     
      res.render('post/post', {
        title: '文章',
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
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
					user: "cc",
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
    Post.getOne({author: req.params.author,title: req.params.title}, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      console.log("render");
      //判断是否已点赞
      if ( req.session.user && post.agree.indexOf(req.session.user.name)>=0 ) {
        isAgree = true;
      }
      if ( req.session.user && post.postcoll.indexOf(req.session.user.name)>0 ) {
        isColl = true;
      }
      //访问量增加
      console.log(isAgree);
      Post.viewNum( {author: req.params.author,title: req.params.title},function(err){
          res.render('post/showPost', {
          title: req.params.title,
          post: post,
          user: req.session.user,
          success: req.flash('success').toString(),
          error: req.flash('error').toString(),
          isAgree : isAgree,
          isColl: isColl
        });
      } )

      
    });
  })
	
  //显示写完后的文章
	app.get('/showPost',function(req,res){
		var post=req.flash("success");
		console.log(Object.prototype.toString.call(post));
		res.render("post/showPost",{
			title: "文章",
      user: "cheng",
			author: "cheng",
			title: "post[0].title",
			post: "post[0].post",
			tag: "wenzhang",
			Browse: '0',
			agree: '0',
			time: '0'

		}

		);
	})

  //文章修改
  app.get("/writePost/:author/:title",function(req,res){
    console.log(req.params);
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
        user: post.author,
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
      console.log("post:"+post);
      agree = post.agree;
      console.log("agree:"+agree);
    
    //console.log(agree);
   var jsonUpdate={
        author: req.body.author,
        title: req.body.title,
        user: req.session.user.name
      }
      console.log(jsonUpdate);
      console.log(agree.indexOf(req.session.user.name));
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
            user: req.session.user.name
          }
      console.log(jsonUpdate);
     if ( coll.indexOf( jsonUpdate.user ) < 0 ){
      console.log("collection");
      Post.addCollect(jsonUpdate, function(err){
        console.log("add");
        if (err) {
          console.log("err");
          console.log(err);
        }
        res.json({isColl: true}); 
      })
    } else {
      console.log("disagree");
      Post.deleteCollection(jsonUpdate,function(err){
        if( err ) {
          console.log(err);
          res.send(false);
        }
        
        res.json({isColl:false});
      })
    }  
  }) 
  })
  //用户设置
  app.get("/userSet",function(req,res){
    console.log(req.session.user);
    User.get(req.session.user.name,function(err,user){
      if(err){
        console.log(err);
      }
      console.log(user);
      res.render("user/userSet",{
      title: "用户设置",
      user:user
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
  area.getArea(req.body,function(err,area){
    if(err){
      console.log(err);
    }
    console.log(area);
    res.send(area.city);
  })


})

//用户个人信息设置
app.post("/user/info",function(req,res){
  console.log(req.body);
})
//用户头像上传

  app.post('/userset/imgupload',upload.single("file"),function(req,res){
    console.log("file");
    console.log(req);
    
    //将信息存入文章数据库
    var path = "/uploads/"+req.file.filename;
    console.log("user");
    console.log(req.session.user);
    User.update({name: req.session.user.name},{img:path},function(err){
      if(err){
        console.log(err);
      }
      res.send({
        img: path
      })
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
        name = currentUser.name,
        head = currentUser.head,
        quesDetail=req.body.quesDetail,
        tags=req.body.tags,
        questionDetail=new Ques(name, head, quesTitle,quesDetail,tags);
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
  var name=req.body.name; 
  var day=req.body.day;
  var quesTitle=req.body.quesTitle;
  console.log(444); 
  Ques.getOne(name, day, quesTitle, function (err, question) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      
      console.log("question:"+(parseInt(question.agree.length)+1));
      var temp=parseInt(question.agree.length)+1;
      // if ( question.agree.indexOf(name) < 0 ){
      Ques.agree(name, day, quesTitle,function(err) {
        if (err) {
          req.flash('error', err);
          console.log(err);
        }
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        console.log("temp:"+temp);
        res.send(temp.toString());
        // res.json({temp:temp});
      });
//    }
    });

});
//实现点踩
app.post('/disagree',function(req,res){
  console.log(333);
  var name=req.body.name;
  console.log('name:'+name); 
  var day=req.body.day;
  console.log('day:'+day); 
  var quesTitle=req.body.quesTitle;
  console.log('quesTitle:'+quesTitle); 
  console.log(444); 
  Ques.getOne(name, day, quesTitle, function (err, question) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      
      console.log("question:"+(parseInt(question.disagree.length)+1));
      var temp=parseInt(question.disagree.length);
      // if ( question.agree.indexOf(name) < 0 ){
      Ques.disagree(name, day, quesTitle,function(err) {
        if (err) {
          req.flash('error', err);
          console.log(err);
        }
        
        //res.writeHead(200, { 'Content-Type': 'text/plain' });
        console.log("temp:"+temp);
        res.send(temp.toString());
        // res.json({temp:temp+1});
      });
//    }
    });

});


  //------------------------------------显示问题
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
app.get('/question', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    Ques.getTen(null, page, function (err, questions, total) {
      if (err) {
        questions = [];
      } 
      Ques.getTags(function(err, tags){
      if (err) {
        tags = [];
      }
      res.render('qa/question', {
        tags: tags,
        title: '问题',
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
//显示某个标签的所有问题
app.get('/questionTags', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var tag = req.query.tag;
    //查询并返回第 page 页的 10 篇文章
    Ques.getTag(tag, page, function (err, questions,total) {
      if (err) {
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('qa/questionTags', {
        tag:tag,
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
//------------------------------显示问题具体内容
  app.get('/questionDetail', function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var num=2;
    Ques.getOne(req.query.name, req.query.day, req.query.quesTitle, function (err, question) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('qa/questionDetail', {
        title:"具体问题",
        quesTitle: req.query.quesTitle,
        quesDetail: question.quesDetail,
        day:question.time.day,
        name:question.name,
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
//-----------------------------回答问题
app.post('/questionDetail', function (req, res) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
               date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
        head = "images/7.jpg"; 
    var comment = {
        name: req.body.name,
        head: head,
        email: req.body.email,
        website: req.body.website,
        time:time,
        content: req.body.content,
        agreeNum:req.body.num?req.body.num:0,
        reply:[]
    };
    var name=req.query.name,
        day=req.query.day,
        quesTitle=req.query.quesTitle; 
    var newQuesComment = new quesComment(name, day, quesTitle, comment);
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
//-----------------------------回复评论
app.post('/commentReply',function(req,res){
  var name=req.body.name,
      day=req.body.day,
      quesTitle=req.body.quesTitle,
      commentReplyFromName=req.body.commentReplyFromName,
      commentReplyToName=req.body.commentReplyToName,
      commentReplyContent=req.body.commentReplyContent,
      commentId=req.body.commentId;
      console.log(name);
      console.log(day);
      console.log(quesTitle);
      console.log(commentReplyFromName);
      console.log(commentReplyToName);
      console.log(commentReplyContent);
      console.log(commentId);
      // console.log(req.query.params);
    quesComment.getOne(name,day,quesTitle,commentId,function(err,comment){
        if (err) {
        req.flash('error', err); 
        console.log("err:"+err);
        return res.redirect('/');
      }
      console.log("comment:"+comment);
      res.send("成功取出！");
  });

});
 /*...............................................以下模块(dev by liangtan).............................................................*/

   app.get('/saveArticle',function(req,res){
     res.render('post/writePost', {
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
   })
  app.post('/saveArticle', function (req, res) {
    //记得同时要get/post
     var user=req.session.user;
     //在session中
     var body=req.body;
     //获取消息体,封装到Article对象上面UID, title, tag, time, Browse,agree,review,content
    var article=new Article(user,body.title,body.tag,new Date(),body.Browse,body.agree,body.review,body.content);
    //实例对象直接调用save方法
    article.save(function(err){
          if(err){
             req.flash('error',err);
             return res.redirect('/');
          }
          req.flash('success','文章保存成功');
          //把success的键值发送到主页
            res.redirect('/');
    });
  });
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
      //获取工作的具体的id
      jobHunting.getSpecial(id,function(job){
          //console.log(job.companyName);
          //req.flash("jobs",job);
          res.render("job/job-detail-show",{
            user: req.session.user,
            title: "工作",
            jobs:job});
      });
 })
/*------------------工作条件查询-----------------*/
  //app.post('/job-search', checkNotLogin);
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
           res.render("job/job-search",{
               title:'工作',
               watch:'根据您输入的条件没有任何招聘信息!',
               user:req.session.user
           });
           return;
       }else{
          req.flash("jobs",jobs);
          res.render("job/job-search",{
            user: req.session.user,
            title:"工作",
            watch:'',
            jobs:req.flash('jobs')});
       }
     });
  });
  /*------------------工作插入-----------------*/
 //app.post('/job-insert', checkNotLogin);
   //如果没有登陆那么直接回到主页
  app.post('/job-insert',function(req,res){
     if(!req.session.user){
       res.redirect('user/login');
     }
      //这里我们把需要的数据全部保存到数据库中jobHunting(UID, companyName, companyLocation, workLocation, jobType,jobNum,workTime,jobTime,jobDetail) 
      var body=req.body,jobD=new jobHunting(req.session.user,body.companyName,body.companyLocation,body.workLocation,body.jobType,body.jobNum,body.workTime,body.jobTime,body.jobDetail);
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
  //app.get('/job-insert', checkNotLogin);
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
app.get('/job-top5',function(req,res){
  jobHunting.Top5('北京',function(jobs){
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
              jobs:req.flash('top5')
            });
    }
  });
});
/*-----------------用户界面路由部分---------------------*/
app.get("/user",function(req,res){
	res.render("user/user",{
		title: "用户",
		user: "cheng"
	});
})


}