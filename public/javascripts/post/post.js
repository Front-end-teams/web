
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


	var pageIndex = {
		newPage : 1,
		hotPage:1
	}
	var scrollFlag = {
		newFlag: true,
		hotFlag: true,
	}

	var subNavNew = document.getElementById('sub-nav-new');
	var subNavHot = document.getElementById('sub-nav-hot');

	/*function defaultScroll(){
		if(newPost){
			scrollE(newPost,'new');
		}
	}*/
		//EventUtil.addHandler(window,'scroll',defaultScroll);

		EventUtil.addHandler(subNavNew,'mouseover',function(){
			var newPost = document.getElementById('new-post');
			//EventUtil.removeHandler(window,'scroll',defaultScroll);
			EventUtil.addHandler(window,'scroll',function(){
				scrollE(newPost,'new');
			})
		})
		console.log(subNavHot);
		EventUtil.addHandler(subNavHot,'mouseover',function(){
			var hotPost = document.getElementById('hot-post');
			console.log(hotPost);
			//EventUtil.removeHandler(window,'scroll',defaultScroll);
			EventUtil.addHandler(window,'scroll',function(){
				scrollE(hotPost,'hot');
			})
		})
		

		
	


function scrollE(ele,str){
	var totalHeight = document.documentElement.scrollTop + document.body.scrollTop + document.documentElement.clientHeight ;
	
		if(totalHeight > ele.offsetTop + ele.offsetHeight) {
			if(scrollFlag[str + "Flag"]){
				scrollFlag[str + "Flag"] = false ;
				if(pageIndex[str + "Page"]< 10) {
					pageIndex[str + "Page"]++;

					var xhr=createXHR();
					var postHtml = ele.innerHTML;
					xhr.onreadystatechange=function(){
						
						if(xhr.readyState==1){
							ele.innerHTML = postHtml + '<div class = "loading"><div class="load-info"><span class="load-img"></span>我去拿数据 等我一会儿</div></div>'
						}
						if (xhr.readyState == 4) {
							if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
								var res = xhr.responseText;
								res = JSON.parse(res);
								
								ele.innerHTML = postHtml + res.htmlres;

								if(res[str+'IsLastPage']){
									ele.innerHTML = ele.innerHTML+'<div class = "final-page"><span>别拉啦 我已经加载完了<span></div>'
								} else {
									scrollFlag[str + "Flag"] = true;
								}
							
							}else{

								console.log("request was unsuccessful:"+xhr.status);
							}
						}
					}
					xhr.open('GET','postpage/' + str + '/' + pageIndex[str + "Page"],true);
					xhr.send();	
				}	
			}			
		}		
}
})();