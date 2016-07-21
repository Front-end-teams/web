# 前端交流网站
## 1 基本介绍
本项目主要是由四人开发的前端交流网站。主要功能时博客查看与发表、问题的提问与回答、互联网招聘与经验分享。所使用的技术有HTML/css/JavaScript/NodeJS/MongoDB等。由于四人都是初步探索NodeJS、MongoDB的使用，有些地方可能实现方法不太好
##2 主要实现的功能
*  文章的上传以及文章的浏览与编辑以及文章访问量、点赞量的统计
*  用户的注册与登录
*  用户的头像裁切与上传 用户基本信息的修改
*  问答问题的回答与评价
*  工作的发布与浏览
##3 主要使用nodejs工具
* 框架：express 4.13.1
* 中间件：bodyparser、session、favicon、cookie-parser、express-session、morgan(服务器生成请求日志)
* 基本模块：http fs querystring  path  
* 调试模块：node-inspector、debug
* 上传文件模块：multer、formidable
* 图像裁切处理模块：gm  imageick  前端库jcrop
* 连接数据库的模块：mongodb
* 防止程序崩溃模块:forever
