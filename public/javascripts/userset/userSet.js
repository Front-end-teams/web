
	var selfInfoSave = document.getElementById("self-info-save");
	var province = document.getElementById("province-select");
	var citySelect = document.getElementById("city-select");
	var area = document.getElementById("area-select");
	var userImgUpload = document.getElementById("user-img-upload");


	

	// span.innerHTML = reginp[0].value;

	EventUtil.addHandler(userImgUpload, "change", function(e){

		//上传图片 当上传成功后  触发弹出框
		var formd = new FormData();
			formd.append("file",this.files[0]);
			ajax("post","userSet/imgupload", null, formd, function(res){
				var str = "<div class='img-wrap'><div class='upload-origin'><img id='upload-img' src="+JSON.parse(res).img+"></img></div><div class='pre-img'><span id='pre-big'><img id='crop-pre-big' src="
								+JSON.parse(res).img+"></span><span id='pre-middle'><img id='crop-pre-middle' src="+JSON.parse(res).img+"></span><span id='pre-small'><img id='crop-pre-small' src="+JSON.parse(res).img+
								"></span></div><input type='hidden' id='x' name='x' />"+
	                  "<input type='hidden' id='y' name='y' />"+
	                  "<input type='hidden' id='w' name='w' />"+
	                  "<input type='hidden' id='h' name='h' />";
	    //Popular为弹出框类
  		var pop2 = document.querySelector('.p2');
	  	var p2 = Popuper({
		    wrap: pop2,
		    type: 'success',
		   	//confirm: function(){},
		    cancel: function() {
		      alert('cancel callback');
		    }

			}).edit({

		    title: '头像上传',
		    content: str
			}).show();
			p2.toggle().edit({
				type:'info'
			});
  	
  	//当图片加载完后增加jcrop类
	
			$("#upload-img").on("load",function(){
				var api = $.Jcrop("#upload-img",{
					boxWidth:300,
					boxHeight:300,
					onChange:showPreview,
					onSelect:showPreview,
				})
				//初始化选区框的宽高为min（width，height）
				api.setSelect([$("#upload-img").width()>$("#upload-img").height()?1/2*($("#upload-img").width()-$("#upload-img").height()):0,
											$("#upload-img").width()>$("#upload-img").height()?0:1/2*($("#upload-img").height()-$("#upload-img").width()),
											$("#upload-img").width()>$("#upload-img").height()?1/2*($("#upload-img").width()+$("#upload-img").height()):$("#upload-img").height(),
											$("#upload-img").width()>$("#upload-img").height()?$("#upload-img").height():1/2*($("#upload-img").height()+$("#upload-img").width())]);	
			})
		})	
	})
		//当选区框改变时触发的操作
		function showPreview(coords){
			//coords返回的是相对于原图像裁切的宽高信息
					$("#x").val(coords.x);
					$("#y").val(coords.y);
					$("#w").val(coords.w);
					$("#h").val(coords.h);
					//预览图的生成 通过改变图片的宽高
					if(parseInt(coords.w)>0){
						var bigRx = $("#pre-big").width()/coords.w;
						var bigRy = $("#pre-big").height()/coords.h;
						
						$("#crop-pre-big").css({
							width:Math.round(bigRx*$("#upload-img").width())+"px",
							height:Math.round(bigRy*$("#upload-img").height())+"px",
							marginLeft:"-"+Math.round(bigRx*coords.x)+"px",
							marginTop:"-"+Math.round(bigRy*coords.y)+"px"
						})

						var middleRx = $("#pre-middle").width()/coords.w;
						var middleRy = $("#pre-middle").height()/coords.h;
						$("#crop-pre-middle").css({
							width:Math.round(middleRx*$("#upload-img").width())+"px",
							height:Math.round(middleRy*$("#upload-img").height())+"px",
							marginLeft:"-"+Math.round(middleRx*coords.x)+"px",
							marginTop:"-"+Math.round(middleRy*coords.y)+"px"
						})

						var smallRx = $("#pre-small").width()/coords.w;
						var smallRy = $("#pre-small").height()/coords.h;
						$("#crop-pre-small").css({
							width:Math.round(smallRx*$("#upload-img").width())+"px",
							height:Math.round(smallRy*$("#upload-img").height())+"px",
							marginLeft:"-"+Math.round(smallRx*coords.x)+"px",
							marginTop:"-"+Math.round(smallRy*coords.y)+"px"
						})
					}
				}
			
		$('#crop-form').submit(function(event) {
			event.preventDefault() 
		});
   //点击提交按钮时 将form表单以ajax方式提交 
   
		$("#upload-submit").on("click",function(e){
			e.stopPropagation();

			$(".p2").css("display","none");

			$.ajax({
				url:"/upload/imgupload/size",
				type:"POST",
				data:$("#crop-form").serialize(),
				success:function(data){
					console.log(data);
					$("#user-img-show").prop('src',data.bigimg );
					$('.user-small-img').prop('src',data.smallimg);
					console.log($("#user-img-show"));
				}
			})

			
		})
		
	EventUtil.addHandler(province,"change",function(e){
		var e = EventUtil.getEvent(e);
		var target = EventUtil.getTarget(e);
		//取出选中的项
		var value = province.value;
		var sendValue = {};
		sendValue.province = value;
		var cOpt = citySelect.getElementsByTagName("option");
		citySelect.innerHTML = '<option>请输入城市</option>';
		area.innerHTML = '<option>请输入县区</option>';

		/*console.log(cOpt);
		for (var i = 1; i < cOpt.length - 1; i++) {
			console.log(i);
			citySelect.removeChild(cOpt[i]);
		}*/
		console.log(cOpt);
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
		console.log(sendValue);
		var cOpt = area.getElementsByTagName("option");
		area.innerHTML = '<option>请输入县区</option>'

		/*for (var i = 1; i < cOpt.length-1; i++) {
			area.removeChild(cOpt[i]);
		}*/
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
		console.log(JSON.stringify(result));
		ajax("post","user/info","application/json",JSON.stringify(result),function(res){
			alert("设置成功");
			console.log(res);
		})
	}) 

	//邮箱验证功能

	var verifybox = document.getElementById("verifyBox");
	var email = verifybox.querySelectorAll('span')[0];
	var mailVerify = document.getElementById("js-verify");
	EventUtil.addHandler(mailVerify,"click",function(e){
		var e=EventUtil.getEvent(e);
		EventUtil.preventDefault(e);
		var str = email.innerHTML;
		var emailjson= {email:str};
		var emailinfo = JSON.stringify(emailjson);
		console.log(emailinfo);
		ajax("post","user/info/email","application/json",emailinfo,function(res){
			console.log(res);
		})
	}) 


	//更改密码功能
	var reset = document.getElementsByClassName('reset-inp');
	var resetTip = document.getElementsByClassName('reset-tip-wrap');
	var setResult = {
		old:false,
		new:false,
		renew:false
	};
	console.log(reset[0]);
	EventUtil.addHandler(reset[0],'blur',function(e){
		var e=EventUtil.getEvent(e);
		EventUtil.preventDefault(e);
		var str = reset[0].value;
		var strjson= {password:str};
		var strinfo = JSON.stringify(strjson);
		ajax("post","user/info/oldpw","application/json",strinfo,function(res){
			if(res=="密码正确"){
				resetTip[0].innerHTML= res;
	        	resetTip[0].style.color = "green";
	        	setResult.old=true;
			}else if(res=="密码不正确"){
				resetTip[0].innerHTML= '密码格式正确';
				resetTip[0].style.color = "red";
				setResult.old=false;
			}else{
				console.log(res);
				alert("修改成功");
			}
		})
	})

	EventUtil.addHandler(reset[1],'blur',function(e){
		var str=reset[1].value;
		if (str.match(/^[a-zA-Z0-9]{6,16}$/)) {
	        resetTip[1].innerHTML= '密码格式正确';
	        resetTip[1].style.color = "green";
	        setResult.new=true;
	    } else { 
	        resetTip[1].innerHTML = '请输入6到16位字符且只能为数字和字母';
	        resetTip[1].style.color = "red";
	        setResult.new=false;
	    }
	})
	
	EventUtil.addHandler(reset[2],'blur',function(e){
		var e=EventUtil.getEvent(e);
		EventUtil.preventDefault(e);
		if(reset[1].value==reset[2].value){
			resetTip[2].innerHTML='输入正确';
			resetTip[2].style.color = "green";
			setResult.renew=true;
		}else{
			resetTip[2].innerHTML='两次密码输入不一致';
			resetTip[2].style.color = "red";
			setResult.renew=false;
		}
	})
	var save = document.getElementById("resetpw-btn-save");
	EventUtil.addHandler(save,'click',function(e){
		var e=EventUtil.getEvent(e);
		EventUtil.preventDefault(e);
		var str = reset[1].value;
		var strjson= {newpw:str};
		var strinfo = JSON.stringify(strjson);
		ajax("post","user/info/newpw","application/json",strinfo,function(res){
			console.log(res);
		})
	})