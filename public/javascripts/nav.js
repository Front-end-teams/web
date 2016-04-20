/*
* @Author: Administrator
* @Date:   2016-04-17 14:23:24
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-20 18:04:10
*/


$(function(){
		var login = document.getElementById("login");
		var reg = document.getElementById("reg");
		var close = document.getElementById("close");
		var regtab = document.getElementById("regtab");
		var mask = document.getElementById("mask");
		var tabcard = new TabCard("regtab","defaultStyle","clickStyle");
			tabcard.clear();
	   		tabcard.click();


	   	var regForm = document.getElementById("regForm");
		var reginp = regForm.querySelectorAll("input");
		var regtips = regForm.querySelectorAll(".tip");
		var regsub = document.getElementById("regsub");

	   	var loginForm = document.getElementById("loginForm");
		var logininp = loginForm.querySelectorAll("input");
		var logintips = loginForm.querySelectorAll(".tip");
		var loginsub = document.getElementById("loginsub");
		//console.log(regtips);
	

		reg.onclick = function(){
			regtab.className="show";
			mask.className="maskshow";
	   		var tabPanel = tabcard.panel;
	   		var input = tabPanel.querySelectorAll("input");
	   		for(var i=0;i<input.length;i++){
	   			input[i].value="";
	   		}
	   		var tips = tabPanel.querySelectorAll(".tips");
	   		for(var i=0;i<tips.length;i++){
	   			tips[i].innerHTML="";
	   		}
	   		var firstUl = tabPanel.firstElementChild;
	   		var tabNav = firstUl.getElementsByTagName("li");
	   		tabNav[0].className = "defaultStyle";
	   		tabNav[1].className = "clickStyle";
	   		var lastUl = tabPanel.lastElementChild;
	   		var tabBd = lastUl.getElementsByTagName("li");
	   		tabBd[0].className = "tabhide";
	   		tabBd[1].className = "tabshow";
		};
		login.onclick=  function(){
			regtab.className="show";
			mask.className="maskshow";
	   		var tabPanel = tabcard.panel;
	   		var input = tabPanel.querySelectorAll("input");
	   		for(var i=0;i<input.length;i++){
	   			input[i].value="";
	   		}
	   		var tips = tabPanel.querySelectorAll(".tips");
	   		for(var i=0;i<tips.length;i++){
	   			tips[i].innerHTML="";
	   		}
	   		var firstUl = tabPanel.firstElementChild;
	   		var tabNav = firstUl.getElementsByTagName("li");
	   		tabNav[1].className = "defaultStyle";
	   		tabNav[0].className = "clickStyle";
	   		var lastUl = tabPanel.lastElementChild;
	   		var tabBd = lastUl.getElementsByTagName("li");
	   		tabBd[0].className = "tabshow";
	   		tabBd[1].className = "tabhide";
		};
		close.onclick = function(){
			regtab.className= "hide";
			mask.className = "maskhide";
		};
		//注册的验证函数
		function check(ele){
			var str = ele.value;
			if(str.length===0){
				ele.nextElementSibling.innerHTML="输入不能为空";
				ele.nextElementSibling.style.color = "red";
				return;
			}
			if(ele.id==="name"){
				var len = str.replace(new RegExp('[\u4e00-\u9fa5]', 'g'), 'aa').length;
				var namejson= {name:str};
				var nameinfo = JSON.stringify(namejson);
				ajax("post","/reg/name","application/json",nameinfo,function(res){
					if(res!=="success"){
						ele.nextElementSibling.innerHTML = res;
						ele.nextElementSibling.style.color = "red";
					}else{
						if(len >= 4 && len <= 16){
							ele.nextElementSibling.innerHTML = '名称可用';
						    ele.nextElementSibling.style.color = "green";
						}else{
							ele.nextElementSibling.innerHTML = '请检查名称字符数';
						    ele.nextElementSibling.style.color = "red";
						}
					}
		
				});
  
			}
			if(ele.id==="password"){
				if (str.match(/^[a-zA-Z0-9]{6,16}$/)) {
		            //checkResult.right = true;
		            ele.nextElementSibling.innerHTML= '密码格式正确';
		            ele.nextElementSibling.style.color = "green";
		        } else {
		            //checkResult.right = false;
		            ele.nextElementSibling.innerHTML = '请输入6到16位字符且只能为数字和字母';
		            ele.nextElementSibling.style.color = "red";
		        }
			}
			if(ele.id==="repassword"){
				if (str === reginp[1].value) {
		            //checkResult.right = true;
		            ele.nextElementSibling.innerHTML = '密码正确';
		            ele.nextElementSibling.style.color = "green";
		        } else {
		            //checkResult.right = false;
		            ele.nextElementSibling.innerHTML = '两次密码输入要相同';
		            ele.nextElementSibling.style.color = "red";
		        }
			}
			if(ele.id==="email"){
				var reg = new RegExp('^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', 'i');
				var emailjson= {email:str};
				var emailinfo = JSON.stringify(emailjson);
				ajax("post","/reg/email","application/json",emailinfo,function(res){
					console.log(res);
					if(res!=="success"){
						ele.nextElementSibling.innerHTML = res;
						ele.nextElementSibling.style.color = "red";
					}else{
						if (str.match(reg)) {
						    //checkResult.right = true;
						    ele.nextElementSibling.innerHTML = '邮箱可用';
						    ele.nextElementSibling.style.color = "green";
						} else {
						    //checkResult.right = false;
						    ele.nextElementSibling.innerHTML = '邮箱格式错误';
						    ele.nextElementSibling.style.color = "red";
						}
					}
				});
			};
		};
		//登录的验证函数
		var names=false;
		var emails=false;
		function checkLog(ele){
			var str = ele.value;
			if(str.length===0){
				ele.nextElementSibling.innerHTML="输入不能为空";
				ele.nextElementSibling.style.color = "red";
				return;
			}
			if(ele.id=="name"){
				var namejson= {name:str};
				var nameinfo = JSON.stringify(namejson);
				
				ajax("post","/login/name","application/json",nameinfo,function(res){
					if(res!=="exist"){
						ele.nextElementSibling.innerHTML = '用户名不存在';
						ele.nextElementSibling.style.color = "red";
						names=false;
					}else{
						ele.nextElementSibling.innerHTML ="";
						names=true;
					}
				});
			}
			
			if(ele.id=="email"){
				var emailjson= {email:str};
				var emailinfo = JSON.stringify(emailjson);
				
				ajax("post","/login/email","application/json",emailinfo,function(res){
					if(res!=="match"){
						ele.nextElementSibling.innerHTML = '用户名与密码不一致';
						ele.nextElementSibling.style.color = "red";
						emails=false;
					}else{
						ele.nextElementSibling.innerHTML ="";
						emails=true;
					}
				});
			}

		}
		//注册页面表单focus与blur时候的不同表现
		for(var i=0;i<reginp.length;i++){
			reginp[i].addEventListener("focus",function(e){
				var ev = e||window.e;
				var target = ev.target||ev.srcElement;
				target.value = "";
				target.style.border = "1px solid yellow";
				target.nextElementSibling.style.display = "block";
			},false);
			reginp[i].addEventListener("blur",function(e){
				var ev = e||window.e;
				var target = ev.target||ev.srcElement;
				target.style.border = "1px solid #1AE6E6";		
				check(target);	//失去焦点时候就要check表单是否正确	
			},false)
		};
		//登录页面表单focus与blur时候的不同表现
		for(var i=0;i<logininp.length;i++){
			logininp[i].addEventListener("focus",function(e){
				var ev = e||window.e;
				var target = ev.target||ev.srcElement;
				target.value = "";
				target.style.border = "1px solid yellow";
				target.nextElementSibling.style.display = "block";
			},false);
			logininp[i].addEventListener("blur",function(e){
				var ev = e||window.e;
				var target = ev.target||ev.srcElement;
				target.style.border = "1px solid #1AE6E6";
				checkLog(target);	//失去焦点时候就要checklog表单是否正确	
			},false)
		};

		//注册表单提交时需要先验证再用ajax提交数据
		EventUtil.addHandler(regsub,"click",function(e){
			//console.log("0000");
			//console.log(regtips);
			for(var i=0;i<regtips.length;i++){
				if(regtips[i].style.color!=="green"||regtips[i].style.color==""){
					alert("输入有误");
				};
				//console.log("11111");
				var target = EventUtil.getTarget(e);
				EventUtil.preventDefault(e);
				var form=target.parentNode.parentNode;
				var result=seriPost(form);
				var resultJson={};
				//console.log(resultJson);
				for(var i = 0; i < result.length; i++){
					var val = result[i].split("=");
					resultJson[val[0]]=val[1];
				};
				var str =JSON.stringify(resultJson);
				//console.log(str);
				ajax("post","/reg","application/json",str,function(res){
					console.log(res);
				});
			}

		});
		//登录表单提交时需要先验证再用ajax提交数据
		EventUtil.addHandler(loginsub,"click",function(e){
				if(names=="true"&&emails=="true"){
					var target = EventUtil.getTarget(e);
					EventUtil.preventDefault(e);
					var form=target.parentNode.parentNode;
					var result=seriPost(form);
					var resultJson={};
					//console.log(resultJson);
					for(var i = 0; i < result.length; i++){
						var val = result[i].split("=");
						resultJson[val[0]]=val[1];
					};
					var str =JSON.stringify(resultJson);
					ajax("post","/login","application/json",str,function(res){
						console.log(res);
					});
				}
				
		});
		
});

