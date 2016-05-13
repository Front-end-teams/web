
	var selfInfoSave = document.getElementById("self-info-save");
	var province = document.getElementById("province-select");
	var citySelect = document.getElementById("city-select");
	var area = document.getElementById("area-select");
	var userImgUpload = document.getElementById("user-img-upload");
	var userImgShow = document.getElementById("user-img-show");
	console.log(userImgUpload);


	EventUtil.addHandler(userImgUpload, "change", function(e){
		var e = EventUtil.getEvent(e);
		imgData(e,200,200,function(dataBig,typeBig){
			imgData(e,100,100,function(dataMiddle,typeMiddle){
				imgData(e,50,50,function(dataSmall,typeSmall){
					//图片上传，将base64的图片转成二进制对象，塞进formdata上传
			
				//可以直接把Base64的字符串上传到服务器，然后由服务端解码为JPG图片，
				//也可以在前端解码上传。如果要在前端解码并以文件方式上传，
				//先要用atob函数把Base64解开，然后转换为ArrayBuffer，再用它创建一个Blob对象。
				var textBig = window.atob(dataBig.split(",")[1]);
				var bufferBig = new ArrayBuffer(textBig.length);
	      var ubufferBig = new Uint8Array(bufferBig);

				var textMiddle = window.atob(dataMiddle.split(",")[1]);
				var bufferMiddle = new ArrayBuffer(textMiddle.length);
	      var ubufferMiddle = new Uint8Array(bufferMiddle);

	      var textSmall = window.atob(dataSmall.split(",")[1]);
				var bufferSmall = new ArrayBuffer(textSmall.length);
	      var ubufferSmall = new Uint8Array(bufferSmall);
	      for (var i = 0; i < textBig.length; i++) {
	        ubufferBig[i] = textBig.charCodeAt(i);
	      }
	      for (var i = 0; i < textMiddle.length; i++) {
	        ubufferMiddle[i] = textMiddle.charCodeAt(i);
	      }
	      for (var i = 0; i < textSmall.length; i++) {
	        ubufferSmall[i] = textSmall.charCodeAt(i);
	      }
	      //创建blob对象
	      var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
	        var blobBig,blobMiddle,blobSmall;

	        if (Builder) {
	            var builderBig = new Builder();
	            builderBig.append(bufferBig);
	            blobBig = builderBig.getBlob(typeBig);

	            var builderMiddle = new Builder();
	            builderMiddle.append(bufferMiddle);
	            blobMiddle = builderBig.getBlob(typeMiddle);

	            var builderSmall = new Builder();
	            builderSmall.append(bufferSmall);
	            blobSmall = builderBig.getBlob(typeSmall);

	        } else {
	            blobBig = new window.Blob([bufferBig], {type: typeBig});
	            blobMiddle = new window.Blob([bufferMiddle], {type: typeMiddle});
	            blobSmall = new window.Blob([bufferSmall], {type: typeSmall});
	        }


	     // var buffer = new ArrayBuffer(text.length);
	      //建立8为不带符号的整数的视图
	       //var ubuffer = new Uint8Array(buffer);
	       var blob = [];
	       blob.push(blobBig);
	       blob.push(blobMiddle);
	       blob.push(blobSmall);
				var formd = new FormData();
				formd.append('files', blob);
				

				ajax("post","userSet/imgupload",null, formd, function(res){
					console.log(res);
					//userImgShow.src = JSON.parse(res).img;
				})
			
				})
			})

			
		
	})});


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
	
	EventUtil.addHandler(citySelect,"change",function(e){
		var e = EventUtil.getEvent(e);
		var target = EventUtil.getTarget(e);
		//取出选中的项
		var provValue = province.value;
		var cityvalue = citySelect.value;
		var sendValue = {};
		sendValue.province = provValue;
		sendValue.city = cityvalue;
		var cOpt = area.getElementsByTagName("option");

		for (var i = 1; i < cOpt.length-1; i++) {
			area.removeChild(cOpt[i]);
		}
		//ajax调用 取出该省对应的市
		ajax("post","user/info/area","application/json",JSON.stringify(sendValue),function(res){
			res = JSON.parse(res);
			var fragment = document.createDocumentFragment();
			for (var item in res) {
				console.log(res[item]);
				var opt = document.createElement("option");
				opt.innerHTML = res[item].county_name;
				fragment.appendChild(opt);
			}
			area.appendChild(fragment);
			
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

