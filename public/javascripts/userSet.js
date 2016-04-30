(function(){
	var selfInfoSave = document.getElementById("self-info-save");
	
	EventUtil.addHandler(selfInfoSave,"click",function(e){
		var e=EventUtil.getEvent(e);
		EventUtil.preventDefault(e);
		var target = EventUtil.getTarget(e);
		var infoForm = document.getElementById("info-form");
		var parts=seriPost(infoForm);
		var result={};
		//console.log(resultJson);
		for(var i = 0; i < parts.length; i++){
			var val = parts[i].split("=");
			result[val[0]]=val[1];
		};
		
		ajax("post","user/info","application/json",JSON.stringify(result),function(res){
			console.log(res);
		})
	})
	
})()