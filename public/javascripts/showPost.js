// 点击点赞按钮时应该响应的功能
var agreeB = document.getElementById("agree");
var flag = false;
EventUtil.addHandler(agreeB, "click", agree);
function agree(e){
	var agreeNum = document.getElementById("agree-num");
	var title = document.getElementById("post-title").innerHTML;
	var author = document.getElementById("post-author").innerHTML;
	var e = EventUtil.getEvent(e);
	var target = EventUtil.getTarget(e);
	
	var agreeurl = "/agree/" + author + "/" + title;
	var disagreeurl="/disagree/" + author + "/" + title;
	var mes =JSON.stringify({author: author, title: title}) ;
	/*if ( !flag ) {*/
		//实现点赞 点赞时需要记录点赞人
		ajax( "post", agreeurl, "application/json", mes, function(res){
				console.log(JSON.parse(res).agree);
				agreeNum.innerHTML =  parseInt(JSON.parse(res).agree);
			
		})
	/*	flag = true;
	} else {
		//实现取消点赞
		ajax("post", disagreeurl, "application/json", mes, function(res){
			console.log("disagree");
			if( res ){
				 agreeNum.innerHTML = parseInt(agreeNum.innerHTML) - 1;
			} else {
				alert("弹出框");
			}
		})
		flag = false;
	}*/
}