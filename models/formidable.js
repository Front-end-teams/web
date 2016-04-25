var fs=require('fs');

var formidable = require('formidable');

var uploadImg = function(req,res){
		//formidable.IncomingForm.UPLOAD_DIR = "./tmp/"
		//var uploadfolderpath = path.join(__dirname, uploadfoldername);
 		var form=new formidable.IncomingForm();
 		form.keepExtensions = true;//使用原来的扩展名
 		form.uploadDir='./tmp/';
 		//处理request
 		form.parse(req,function(err,fields,files){
 			if(err){
 				return console.log('formidable,form parse err');
 			}
 			console.log('formidable,form.parse ok');

 			console.log('显示上传的参数begin');
 			console.log(fields);

 			var item;
 			var length=0;
 			for(item in files){
 				length++;
 			}
 			if(length===0){
 				console.log('files no data');
 				return;
 			}
 			console.log(length);
 			for(item in files){
 				var file=files[item];
 				//formidable会将上传的文件存储为一个临时文件，现在获取文件的目录
 				
 				
 				//file.path='./tmp/'+file.name;
 				var tempfilepath=file.path;
 				console.log(tempfilepath);
 				//获取文件类型
 				var type=file.type;
 				console.log(type);
 				//获取文件名，并根据文件名获取扩展名
 				var filename = file.name;
 				var extname = filename.lastIndexOf('.')>0?filename.slice(filename.lastIndexOf('.')-filename.length):'';
 				//文件名没有扩展名时，则从文件类型中取扩展名
 				if(extname===''&&type.indexOf('/')>=0){
 					extname='.'+type.split('/')[1];
 				}
 				//将文件名重新赋值为一个随机数（避免文件重名）	
 				filename=Math.random().toString().slice(2)+extname;
 				//构建将要存储的文件路径(?????)
 				var filenewpath = "./public/uploads/"+filename;
 				//将临时文件保存为正式文件
 				fs.rename(tempfilepath,filenewpath,function(err){
 					console.log(filenewpath);
 					//存储结果
 					var result = '';
 					if (err) {
 						console.log(err);
 						console.log('fs.rename err');
 						result = 'err|save error';
 					}else{
 						//保存成功
 						console.log('fs rename done');
 						//拼接图片url地址
 						result = '/uploads/'+filename;

 					}
 					//返回结果
 					res.writeHead(200,{"Content-type":"text/html"});
 					res.end(result);
 				})

 			}
 		})
 }

module.exports = uploadImg;