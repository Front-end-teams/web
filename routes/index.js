
var Post=require("../models/post.js");
var upload = require('../models/upload.js');
var Ques=require('../models/ask.js');
var quesComment=require('../models/quesComment.js');

var crypto = require('crypto'),
    User = require('../models/user.js'),
    Note = require('../models/note.js');

var jobHunting=require('../models/jobHunting');
var geolocation=require('../tools/city');
var pagination=require('express-paginate');
var util=require('util');




module.exports = function(app) {
	app.post('/upload', upload.upload);  
	app.get("/upload",function(req,res){

		res.render("upload",{});
	})
	app.get('/', function(req, res, next) {

	  res.render('index', { title: 'Express',
	  						author: '0001',
	  						tag: 'fort',
						    time: 'now',
						    Browse: 100,
						    user: req.session.user,
						    agree: 90,
						    review: 23,
						    post: 'hello world' });
	});

	//注册页面
  app.get('/reg', function (req, res) {
     res.render('user/reg', {
      title: '注册',
      user: req.session.user,
    });
   });
  app.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
   	repassword = req.body.repassword;
    //检验用户两次输入的密码是否一致
    if (repassword!= password) {
      req.flash('error', '两次输入的密码不一致!'); 
      return res.redirect('/');//返回注册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        repassword:repassword,
        email: req.body.email
    });
    //检查用户名是否已经存在 
    User.get(newUser.name, function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if (user) {
        req.flash('error', '用户已存在!');
        return res.redirect('user/reg');//返回注册页
      }
      //如果不存在则新增用户
      newUser.save(function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('user/reg');//注册失败返回主册页
        }
        req.session.user = newUser;//用户信息存入 session
        req.flash('success', '注册成功!');
        res.redirect('/');//注册成功后返回主页
      });
    });
  });


  //登录页面
   app.get('/login', function (req, res) {
    res.render('user/login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
	});
  app.post('/login', function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!'); 
      return res.redirect('user/login');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.password != password) {
      req.flash('error', '密码错误!'); 
      return res.redirect('user/login');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });
});

   //登出页面
  app.get('/logout', function (req, res) {
  	req.session.user = null;
  	req.flash('success', '登出成功!');
  	res.redirect('/');//登出成功后跳转到主页
	});

   //读书笔记页面
   
   app.get('/reading', function (req, res) {

    res.render('note/reading', {
      title: '笔记',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
       });
  });
   

 	app.get('/note', function (req, res) {

    res.render('note/note', {
      title: '笔记',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/note', function (req, res) {
        note = new Note("nina", req.body.notetitle, req.body.note);
    note.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      req.flash('success', '发布成功!');
      //res.redirect('/');//发表成功跳转到主页
    });
  });

//用户权限函数
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    res.redirect('user/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    res.redirect('back');//返回之前的页面
  }
  next();
}

	//文章
	app.post('/upload', upload.upload);  
	app.get("/upload",function(req,res){

		res.render("post/upload",{

      user: req.session.user,
    });
	})
	app.get('/', function(req, res, next) {

	  res.render('index', { title: 'Express',
	  						author: '0001',
	  						tag: 'fort',
						    time: 'now',
						    user: req.session.user,
						    Browse: 100,
						    agree: 90,
						    review: 23,
						    post: 'hello world' });
	});
	/*需要写文章的页面*/
    app.get('/post', function (req, res) {
    
    res.render('post/post', {
      title: '文章',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

	app.get('/writePost',function(req,res){
		Post.getTags(function(err,tags){
			if(err){
				console.log(err);
				tags=[];
			}
			
			Post.getArchive(function(err,cates){
				if(err){
					console.log("cates error");
					cates=[];
				}
				
				res.render('post/writePost',{
					user: req.session.user,
					title:"文章编辑",
					author: "cheng",
					tags: tags,
					cates: cates
				})
			})
			
		})
	})
		

	/*写完文章后的跳转页面*/
	app.post('/writePost',function(req,res){
    	//console.log(req);
        var tags = [req.body.tag1, req.body.tag2, req.body.tag3],
        	post = new Post("cheng", req.body.title, tags, req.body.post);
	    	post.save(function (err) {
	    	console.log(post);
	      if (err) {
	        // req.flash('error', err); 
	        console.log("error");
	        return res.redirect('/');
	      }
	      // req.flash('success', '发布成功!');
	      req.flash('success',post);
	      res.redirect('post/showPost');//发表成功跳转到主页
	    });
  });
  //显示写完后的文章
	app.get('/showPost',function(req,res){
		var post=req.flash("success");
		console.log(Object.prototype.toString.call(post));
		res.render("post/showPost",{
			title: "文章",
      user: req.session.user,
			author: post[0].author,
			title: post[0].title,
			post: post[0].post,
			tag: "wenzhang",
			Browse: '0',
			agree: '0',
			time: '0'

		}

		);
	})

// 发布问题
	//app.get('/ask', checkLogin);
  app.get('/ask',function(req,res){
  	console.log("ask");
    res.render('ask',{
    	title:'ask'
    });
  });
  app.post('/ask', checkLogin);
  app.post('/ask',function(req,res){
    var currentUser = req.session.user,
        quesTitle=req.body.quesTitle,
        quesDetail=new Ques(currentUser.name, currentUser.head, req.body.quesTitle, req.body.quesDetail);
    quesDetail.save(function(err){
         if (err) {
        req.flash('error', err); 
        return res.redirect('/');
         } 
         req.flash('success', '发布成功!');
         res.redirect('qa/question');//发表成功跳转到主页
        });
  });

  //------------------------------------显示问题
app.get('/question', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    Ques.getTen(null, page, function (err, questions, total) {
      if (err) {
        questions = [];
      } 
      res.render('qa/question', {
        title: '问题',
        questions: questions,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + questions.length) == total,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
//------------------------------显示问题具体内容
  app.get('/questionDetail', function (req, res) {
    Ques.getOne(req.query.name, req.query.day, req.query.quesTitle, function (err, question) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('qa/questionDetail', {
        quesTitle: req.query.quesTitle,
        quesDetail: question.quesDetail,
        day:question.time.day,
        name:question.name,
        user: req.session.user,
        comments:question.comments,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
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
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48"; 

    var comment = {
        name: req.body.name,
        head: head,
        email: req.body.email,
        website: req.body.website,
        time:time,
        content: req.body.content,
    };
 
    var newQuesComment = new quesComment(req.param('name'), req.param('day'), req.param('quesTitle'), comment);

    newQuesComment.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }

      req.flash('success', '留言成功!');
      res.redirect('back');

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
           req.flash("jobs","没有相关的招聘信息,您可以继续输入条件进行查询!");
           res.render("job-search-err",{jobs:req.flash('jobs')});
           return;
      }
          req.flash("jobs",jobs);
          res.render("job-search",{
            user: req.session.user,
            title:"工作",
            jobs:req.flash('jobs')});
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
           return res.redirect('job/job-insert-error');
         }
          res.redirect('job/job-insert-succ');
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
  //res.render('job-insert-succ', { messages: req.flash('success') });
    res.setHeader('content-type', 'text/html;charset=utf-8');
    //定时器修改DOM的代码,没间隔一秒我们刷新一次页面
    var str="<script>var count=5,href='/job-insert';function show(){var dom=document.getElementById('timer');if(count){dom.innerHTML=count;count--;}else{location.href=href;}} setInterval(show,1000);</script>";
    res.write("招聘信息发布成功,<span id='timer' style='color:red;font-weight:bold;'>5</span>秒后跳转到招聘信息发布页面"+str);
   // res.write('<meta http-equiv="refresh" content="5;url=/job-insert"></meta>');
    res.end();
});
  /*------------------工作前5条迭代查询(正在开发中)-----------------*/
//下面模块用获取前5条招聘信息,不用登陆就可以查看的招聘信息
app.get('/job-top5',function(req,res){

  //首先查询前5条的招聘信息，这五条招聘信息全部会返回到job-top5页面进行渲染
  //获取到前端传入到这里的地址，如本地就是"大连"
  jobHunting.Top5('北京',function(jobs){
     req.flash('top5',jobs);

     res.render('job/find-job-top5',{
      user: req.session.user,
      title:"工作",
      jobs:req.flash('top5')
    });
  });
});


/*app.get('/job', function (req, res) {
  var result=geolocation('202.118.66.66',function(err,msg){
    //  console.log('城市: ' + msg.city);
    //console.log('msg: ' + util.inspect(msg, true, 8));
       jobHunting.Top5(msg.city,function(jobs){
       req.flash('top5',jobs);
       res.render('find-job-top5',{jobs:req.flash('top5')});
    });
  });
  });*/
/*----------------------/job-top5/:name为待开发模块---------------------------*/


}
