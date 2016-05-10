// 点击点赞按钮时应该响应的功能
var agreeB = document.getElementById("agree");
var agreeIcon = agreeB.getElementsByTagName("i");
var collect = document.getElementById("collect"); 
var collectIcon = collect.getElementsByTagName("i");

var isAgree = agreeB.getAttribute("data");
var isColl = collect.getAttribute("data");

if( isAgree == "true" ){
	agreeIcon[0].style.color = "#EF5959";
}

if( isColl == "true" ){
	agreeIcon[0].style.color = "#EF5959";
}


EventUtil.addHandler(agreeB, "click", agree);
function agree(e){
	var agreeNum = document.getElementById("agree-num");
	var title = document.getElementById("post-title").innerHTML;
	var author = document.getElementById("post-author").innerHTML;
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
					agreeIcon[0].style.color = "";
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
					collectIcon[0].style.color = "";
				}
			
		})
}