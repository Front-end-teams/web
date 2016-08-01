
var fs = require('fs');
var gm = require('gm').subClass({imageMagick:true});
var path = require('path');

function newPath(oldpath,rWidth){
	var imgdir = path.dirname(oldpath);

	var base = path.basename(oldpath);
	var filename = base.split('.')[0];
	var newfile = filename + rWidth;
	var newpath = path.join(imgdir,newfile+path.extname(oldpath));
	return newpath;
}

function imgCrop(param,callback){
	
	var newpath = newPath(param.path,param.rWidth);
	// var cropImg = function(){
		gm(path.join("./public", param.path))

			.crop(param.width,param.height,param.x,param.y)
			.resize(param.rWidth,param.rHeight)
			.stream(function(err,stdout){
				if(err){
					throw err;
				}
				var writeStream = fs.createWriteStream(path.join("./public", newpath));
				stdout.pipe(writeStream).on('finish',function(){
					console.log("ccc");
					callback(null,newpath.replace(/\\/g,"\/"));
				})
					

			})
		}

	function imgResize(param,callback){
		console.log('imgresize');
		var newpath = newPath(param.path, param.rWidth);
		gm(path.join("./public", param.path))
			.resize(param.rWidth,param.rHeight)
			.stream(function(err,stdout){
				if(err){
					throw err;
				}
				var writeStream = fs.createWriteStream(path.join("./public", newpath));
				stdout.pipe(writeStream).on('finish',function(){
					callback(null,newpath.replace(/\\/g,"\/"));
				})
			})
	}


module.exports = {
	imgCrop:imgCrop,
	imgResize:imgResize
}


