

(function(){

	
		
		//var mask = document.getElementById("mask");
		var regtab = document.getElementById("regtab");
		var tabcard = new TabCard("regtab","defaultStyle","clickStyle");
			tabcard.clear();
	   		tabcard.click();


	  var regForm = document.getElementById("regForm");
	  var loginForm = document.getElementById("loginForm");
	

	  if(regForm || loginForm) {
			var login = document.getElementById("login");
			var reg = document.getElementById("reg");
			var close = document.getElementById("close");
			var regtab = document.getElementById("regtab");
			var reginp = regForm.querySelectorAll("input");
			var regtips = regForm.querySelectorAll(".tip");
			var regsub = document.getElementById("regsub");
			var logininp = loginForm.querySelectorAll("input");
			var logintips = loginForm.querySelectorAll(".tip");
			var loginsub = document.getElementById("loginsub");

		var regfn=function(e){
			var ev = e||window.e;
			var target = ev.target||ev.srcElement;
			var nextTarget = target.nextElementSibling||target.nextSibling;
			target.style.border = "1px solid yellow";
			nextTarget.style.display = "block";
			check(target);
		}

		if(reg!==null){
			 //reg.onclick = function(){
				regtab.className="show";
				//mask.className="maskshow";
	   		var tabPanel = tabcard.panel;
	   		var input = tabPanel.querySelectorAll("input");
	   		for(var i=0;i<input.length;i++){
	   			input[i].value="";
	   		}
	   		var tips = tabPanel.querySelectorAll(".tip");
	   		for(var i=0;i<tips.length;i++){
	   			tips[i].innerHTML="";
	   		}
	   		var firstUl = tabPanel.firstElementChild||tabPanel.firstChild;
	   		var tabNav = firstUl.getElementsByTagName("li");
	   		tabNav[0].className = "defaultStyle";
	   		tabNav[1].className = "clickStyle";
	   		var lastUl = tabPanel.lastElementChild||tabPanel.lastChild;
	   		var tabBd = lastUl.getElementsByTagName("li");
	   		tabBd[0].className = "tabhide";
	   		tabBd[1].className = "tabshow";

	   		

	   		//监听注册页面文本框内value变化时tip的变化
	   		for(var i=0;i<reginp.length;i++){
	   			if(!!window.ActiveXObject){
	   				reginp[i].onpropertychange = regfn;
	   			}else{
	   				
	   				// EventUtil.addHandler(reginp[2],"input",regfn);
	   			}
	   			EventUtil.addHandler(reginp[i],"blur",function(e){
	   				var ev = e||window.e;
	   				var target = ev.target||ev.srcElement;
	   				target.style.border = "1px solid #1AE6E6";								
	   			});
			  };
			  EventUtil.addHandler(reginp[0],"input",regfn);
		  	EventUtil.addHandler(reginp[0],"blur",regCheckExist);

		  	EventUtil.addHandler(reginp[1],"input",regfn);
			//};
		
			
	  };
	  
	  //验证邮箱是否已注册
		function regCheckExist(e){
			console.log("lig");
			var e = EventUtil.getEvent(e);
			var ele = EventUtil.getTarget(e);
			var str = ele.value;
			var emailjson= {email:str};
			var emailinfo = JSON.stringify(emailjson);

			var nextEle=ele.nextElementSibling||ele.nextSibling;

			console.log(emailinfo);
				ajax("post","/reg/email","application/json",emailinfo,function(res){
				console.log("pot");
				console.log(res);
				if(res=="reged"){
					nextEle.innerHTML = "已注册";
					nextEle.style.color = "red";
					regResult.emails=false;
				}else if(res=="success"){
					nextEle.innerHTML = '邮箱可用';
					nextEle.style.color = "green";
					//regResult.emails=true;
				}
			});
   	}
		if(login!==null){
			 //login.onclick=  function(){

				regtab.className="show";
				//mask.className="maskshow";
				loginForm.className = 'navform';
		   		var tabPanel = tabcard.panel;
		   		var input = tabPanel.querySelectorAll("input");
		   		for(var i=0;i<input.length;i++){
		   			input[i].value="";
		   		}
		   		var tips = tabPanel.querySelectorAll(".tip");
		   		for(var i=0;i<tips.length;i++){
		   			tips[i].innerHTML="";
		   		}
		   		var firstUl = tabPanel.firstElementChild||tabPanel.firstChild;
		   		var tabNav = firstUl.getElementsByTagName("li");
		   		tabNav[1].className = "defaultStyle";
		   		tabNav[0].className = "clickStyle";
		   		var lastUl = tabPanel.lastElementChild||tabPanel.lastChild;
		   		var tabBd = lastUl.getElementsByTagName("li");
		   		tabBd[0].className = "tabshow";
		   		tabBd[1].className = "tabhide";



		   		//登录页面表单focus与blur时候的不同表现
		   		for(var i=0;i<logininp.length;i++){
		   			
	   				if(!!window.ActiveXObject){
	   					logininp[i].onpropertychange = loginfn;
	   				}else{
	   					//console.log(logininp[i]);
	   					// EventUtil.addHandler(logininp[0],"input",loginfn);

	   					// EventUtil.addHandler(logininp[1],"input",loginfn);
	   				}
	   				
	   				EventUtil.addHandler(logininp[i],"blur",function(e){
	   					var ev = e||window.e;
	   					var target = ev.target||ev.srcElement;
	   					target.style.border = "1px solid #1AE6E6";								
		   			});
		   		}
	   			
			// };
		};
		
		// close.onclick = function(){
		// 	regtab.className= "hide";
		// 	mask.className = "maskhide";
		// };

		//注册的验证函数
		var regResult={
			emails:false,
			passwords:false,
			validate:false
		};
		function check(ele){
			var str = ele.value;
			var nextEle=ele.nextElementSibling||ele.nextSibling;
			//console.log(ele.nextSibling);
			if(str.length===0){
				nextEle.innerHTML="输入不能为空";
				nextEle.style.color = "red";
				return;
			}

			if(ele.id=="reg-email"){

				var reg = new RegExp('^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', 'i');
				var emailjson= {email:str};
				var emailinfo = JSON.stringify(emailjson);
				console.log(emailinfo);
				console.log(str);
				console.log(reg.test(str));
				if (reg.test(str)){
					nextEle.innerHTML = '邮箱格式正确';
					nextEle.style.color = "green";
					regResult.emails=true;
				}else{
					nextEle.innerHTML = '请输入正确的邮箱';
				  nextEle.style.color = "red";
				  regResult.emails=false;
				}
			};
			if(ele.id=="reg-password"){
				if (str.match(/^[a-zA-Z0-9]{6,16}$/)) {
		            nextEle.innerHTML= '密码格式正确';
		            nextEle.style.color = "green";
		            regResult.passwords=true;
		        } else { 
		            nextEle.innerHTML = '请输入6到16位字符且只能为数字和字母';
		            nextEle.style.color = "red";
		            regResult.passwords=false;
		        }
			};
		};


		//登录的验证函数
		var logResult={
			emails:false,
			passwords:false,
		};
		function checkLog(e){
			EventUtil.preventDefault(e);
			var email_str = document.getElementById('log-email').value;
			var pass_str = document.getElementById('log-password').value;
			var tip = document.querySelector('.tip')
			if(email_str.length === 0 || pass_str.length === 0){
				tip.style.display = 'block';
				tip.innerHTML="用户名和密码不能为空";
				tip.style.color = "red";
				return;
			}
			

			var totaljson= {email:email_str,password:pass_str};
			var totalinfo = JSON.stringify(totaljson);
			
			ajax("post","/login/password","application/json",totalinfo,function(res){
				if(res!=="match"){
					tip.style.display = 'block';
					//tip.innerHTML = '用户名与密码不一致';
					tip.innerHTML = res;
					tip.style.color = "red";
					// logResult.passwords=false;
					return;
				}else{
					console.log("ccc");
					// logResult.passwords=true;
					// if(logResult.emails == true && logResult.passwords == true){
						console.log("ddd");
						var target = EventUtil.getTarget(e);
						EventUtil.preventDefault(e);
						var form=target.parentNode.parentNode;
						var resultJ=seriPost(form);
						var resultJson={};
						for(var i = 0; i < resultJ.length; i++){
							var val = resultJ[i].split("=");
							resultJson[val[0]]=val[1];
						};
						var str =JSON.stringify(resultJson);
						console.log(resultJson);
						ajax("post","/login","application/json",str,function(res){
							console.log(res);
							if(res == "loginsuccess"){
								window.location.href = '/';
							}else{
								return;
							}
						});
					
				}
			});		
		}

		//注册表单提交时需要先验证再用ajax提交数据
		EventUtil.addHandler(regsub,"click",function(e){

			
			if(regResult.emails==true&&regResult.passwords==true){

				var target = EventUtil.getTarget(e);
				EventUtil.preventDefault(e);
				var form=target.parentNode.parentNode;
				var result=seriPost(form);
				var resultJson={};
				for(var i = 0; i < result.length; i++){
					var val = result[i].split("=");
					resultJson[val[0]]=val[1];
				};
				var str =JSON.stringify(resultJson);
				console.log(str);
				ajax("post","/reg","application/json",str,function(res){
					if(res=="regsuccess"){
						var regsuccess=document.getElementById("regsuccess");
						var regform = document.getElementById("regForm");
						regform.className = "hide";
						regsuccess.className="tabshow";
						//倒计时的实现，然后跳转到填写个人资料的页面
						var myspan = document.getElementById("countdown");
						var timer=5;
						function countdown(){
							timer = timer-1;
							myspan.innerHTML = timer;
							if(timer==0){
								location.href="/userSet";
								clearInterval(flag);
							}
						}
						var flag=setInterval(countdown,1000);
					}else{
						return;
					}
				});
			}else{
				alert("请检查输入");
			}
		});
		

		EventUtil.addHandler(loginsub,"click",checkLog);

	  };
		

  

   
		

		


	
})();

