/*
* @Author: Administrator
* @Date:   2016-03-22 15:28:20
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-18 22:56:39
*/
window.onload=function(){
	if(document.getElementById('maincard')){
		var maincard = new TabCard('maincard','defaultStyle',null,"mouseStyle");
		maincard.mouseover();
	}
	if(document.getElementById('sidetab')){
		var postcard = new TabCard("sidetab","defaultStyle",null,"mouseStyle");
    postcard.mouseover();
	}
	
};

(function(){
	var newPost = document.getElementById('new-post');
	var newPostPage = 1;
	EventUtil.addHandler(window,'scroll',function(e){
		
		var totalHeight = document.documentElement.scrollTop + document.body.scrollTop + document.documentElement.clientHeight ;
	
		if(totalHeight > newPost.offsetTop + newPost.offsetHeight) {
			console.log('ddd');
			if(newPostPage < 10) {
				newPostPage++;
				ajax('GET','/postpage/new/'+ newPostPage,null,null,function(res){
					console.log(res);
				})
			}			
		}
	})
})();