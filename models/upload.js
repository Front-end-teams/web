exports.upload = function (req, res) {  
	console.log("upload");
	console.log(req);
    console.log(req.files);  
    var patharray = req.files.file.path.split("\\");  
    res.send(patharray[patharray.length-1]);  
}  