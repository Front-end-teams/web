var filenode = document.getElementById("file"); 
filenode.onchange=function(){
    var xhr=createXHR();
    
    var filenode = document.getElementById("file");  

     
        //设置回调，当请求的状态发生变化时，就会被调用  
        xhr.onreadystatechange = function () { 
      
            //等待上传结果  
            if (xhr.readyState == 1) {  
                console.log("writing");
                filenode.parentNode.style.backgroundImage = "url('/images/tx2.jpg')";  
            }  
            //上传成功，返回的文件名，设置到div的背景中  
            if (xhr.readyState == 4 && xhr.status == 200) { 
                console.log("success"); 
                filenode.parentNode.style.backgroundImage = "url('/upload/" + xhr.responseText + "')";  
            }  
        }  
        //构造form数据  
        var data= new FormData();  
        console.log(filenode.files[0]);
        data.append("files", filenode.files[0]); 
       
        //设置请求（没有真正打开），true：表示异步  
        xhr.open("post", "/upload", true);
        //不要缓存  
        //xhr.setRequestHeader("If-Modified-Since", "0");  
        //提交请求  
        xhr.send(data);
        //清除掉，否则下一次选择同样的文件就进入不到onchange函数中了  
        filenode.value = null;  
      
      
}

var form=new FormData(document.forms[0]);

console.log(form);