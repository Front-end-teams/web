
	var selfInfoSave = document.getElementById("self-info-save");
	var province = document.getElementById("province-select");
	var citySelect = document.getElementById("city-select");

	EventUtil.addHandler(province,"change",function(e){
		var e = EventUtil.getEvent(e);
		var target = EventUtil.getTarget(e);
		//取出选中的项
		var value = province.value;
		var sendValue = {};
		sendValue.province = value;
		var cOpt = citySelect.getElementsByTagName("option");

		for (var i = 1; i < cOpt.length-1; i++) {
			citySelect.removeChild(cOpt[i]);
		}
		//ajax调用 取出该省对应的市
		ajax("post","user/info/city","application/json",JSON.stringify(sendValue),function(res){
			res = JSON.parse(res);
			var fragment = document.createDocumentFragment();
			for (var item in res) {
				console.log(res[item]);
				var opt = document.createElement("option");
				opt.innerHTML = res[item].city_name;
				fragment.appendChild(opt);
			}
			citySelect.appendChild(fragment);
			
		})
	})
	
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
	