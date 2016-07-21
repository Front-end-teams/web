(function(){
// 点击点赞按钮时应该响应的功能
var agreeB = document.getElementById("agree");

var collect = document.getElementById("collect"); 

var attention = document.getElementById('attention');
var authorEl = document.getElementById("post-author")
if(authorEl){
	var author = authorEl.innerHTML;
}

if(agreeB){
	var isAgree = agreeB.getAttribute("data");
	var agreeIcon = agreeB.getElementsByTagName("i");
	if( isAgree == "true" ){
		agreeIcon[0].style.color = "#EF5959";
	}

}
if(collect){
	var isColl = collect.getAttribute("data");
	var collectIcon = collect.getElementsByTagName("i");
	if( isColl == "true" ){
		collectIcon[0].style.color = "#EF5959";
	}
}


var deletePost = document.getElementById('post-delete');



if(attention){
	var isAttention = attention.getAttribute('data');
	if(isAttention && isAttention == 'true'){
		attention.innerHTML = '取消关注';
	}
}


EventUtil.addHandler(agreeB, "click", agree);
function agree(e){
	var agreeNum = document.getElementById("agree-num");
	var title = document.getElementById("post-title").innerHTML;

	var e = EventUtil.getEvent(e);
	var target = EventUtil.getTarget(e);
	
	var agreeurl = "/agree/" + author + "/" + title;
	var mes =JSON.stringify({author: author, title: title}) ;
	/*if ( !flag ) {*/
		//实现点赞 点赞时需要记录点赞人
		ajax( "post", agreeurl, "application/json", mes, function(res){
				console.log(JSON.parse(res).agree);
				agreeNum.innerHTML =  parseInt(JSON.parse(res).agree);
				if ( JSON.parse( res ).isAgree ) {
					agreeIcon[0].style.color = "#EF5959";
				} else {
					agreeIcon[0].style.color = "#ccc";
				}
			
		})
};

EventUtil.addHandler(collect,"click",collection);
function collection(e){
	console.log("collection");
	var title = document.getElementById("post-title").innerHTML;
	var author = document.getElementById("post-author").innerHTML;
	var e = EventUtil.getEvent(e);
	var target = EventUtil.getTarget(e);
	
	var collurl = "/collect/" + author + "/" + title;
	var mes =JSON.stringify({author: author, title: title}) ;

		ajax( "post", collurl, "application/json", mes, function(res){
				

				if ( JSON.parse( res ).isColl) {
					collectIcon[0].style.color = "#EF5959";
				} else {
					collectIcon[0].style.color = "#ccc";
				}
			
		})
}
// 添加关注
if(attention){
	EventUtil.addHandler(attention,'click',attentionFunc);
}

function attentionFunc(e){
	console.log("collection");
	var title = document.getElementById("post-title").innerHTML;
	var author = document.getElementById("post-author").innerHTML;
	/*var e = EventUtil.getEvent(e);
	var target = EventUtil.getTarget(e);*/
	
	var collurl = "/attention/" + author;
	var mes =JSON.stringify({author: author}) ;

		ajax( "post", collurl, "application/json", mes, function(res){
				
			console.log(typeof res);
				if ( JSON.parse( res ).isAttention == 'add') {
					console.log("qquxia");
					attention.innerHTML = '取消关注';
				} else {
					console.log("ia");
					attention.innerHTML = '关注';
				}
			
		})
}

console.log(deletePost);
EventUtil.addHandler(deletePost,'click',function(){
	var pop2 = document.querySelector('.p2');
			
			var p2 = Popuper({
			    wrap: pop2,
			    type: 'success',
			    confirm: function() {
		    		//继续写博客
		        //window.location="localhost:3008/showPost?author="+author;
		        //var confirm = document.querySelector(".confirm");
		        //confirm.setAttribute("href","/deletePost/<% decodeURIComponent(post.author) %>/<% decodeURIComponent(post.title) %>");
			    },
			    cancel: function() {
			    	//查看博客
			    }

			}).edit({

			    title: '提示',
			    content: '是否删除该文章'

			}).show();

			p2.toggle().edit({
	        type: 'info'
	    });
})
})();
