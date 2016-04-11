/*
* @Author: Administrator
* @Date:   2016-04-07 19:05:05
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-09 10:04:13
*/
//左上的滚动
	 var area = document.getElementById('rollBox');
	 var con1 = document.getElementById('con1');
	 var con2 = document.getElementById('con2');
	 var speed = 50;
	 area.scrollTop = 0;
	 con2.innerHTML = con1.innerHTML;
	 function scrollUp(){
		 if(area.scrollTop >= con1.scrollHeight) {
			 area.scrollTop = 0;
			 }else{
			   area.scrollTop ++; 
			 } 
	}
	var myScroll = setInterval("scrollUp()",speed);
	area.onmouseover = function(){
		 clearInterval(myScroll);
		}
	area.onmouseout = function(){
		 myScroll = setInterval("scrollUp()",speed);
		}


// 富文本编辑器中的div提交数据
var btn= document.getElementById("submit"); 
btn.onclick = function(){
	if(window.ActiveXObject){
		xhr = new ActiveXObject("Microsoft.XMLHTTP"); 
	}else if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}
	if(null != xhr){
		xhr.open("POST","./models/note.js");
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		var data = $('#edit #fr-view').froalaEditor('html.get');
		
console.log(data);
		xhr.send(data);
		xhr.onreadystatechange=function(){
			if(xhr.readyState ===4){
				if(xhr.status===200){
			var  content = JSON.stringify(data);
			console.log(content);
					return content;
				}
			}
		}
	}
	
}
