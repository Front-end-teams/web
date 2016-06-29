window.onload=function(){
	var user_wrap= new TabCard('user-wrap','defaultStyle',null,"mouseStyle");
	user_wrap.mouseover();	

	var del_coll = document.querySelectorAll('.del-coll');
	var user_coll = document.getElementById('user-coll')
	console.log(del_coll);

	for(var i = 0; i < del_coll.length; i++){
		(function(){
			var temp = i;
			del_coll[i].onclick = function(e){
				console.log(del_coll[temp]);
				var author = del_coll[temp].getAttribute('data-author');
				var title = del_coll[temp].getAttribute('data-title');

				var del_url = 'deletecoll/' + author +'/' + title;
				ajax('get',del_url,null,null,function(res){
					console.log(JSON.parse(res).isColl);
					if(JSON.parse(res).isColl == false){
						console.log("delete");
						user_coll.removeChild(del_coll[temp].parentNode);
					}
				})
			}
		})()
		
	}
}

