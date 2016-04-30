 /*
* @Author: Administrator
* @Date:   2016-04-17 14:23:24
* @Last Modified by:   Administrator
<<<<<<< HEAD
* @Last Modified time: 2016-04-24 22:59:44
=======
* @Last Modified time: 2016-04-24 12:25:36
>>>>>>> origin/master
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
		function getNextElement(node){
		        var NextElementNode = node.nextSibling;
		        while(NextElementNode.nodeValue != null){
		            NextElementNode = NextElementNode.nextSibling
		        }
		        return NextElementNode;
		}

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
	   		var firstUl = tabPanel.firstElementChild||tabPanel.firstChild;
	   		var tabNav = firstUl.getElementsByTagName("li");
	   		tabNav[0].className = "defaultStyle";
	   		tabNav[1].className = "clickStyle";
	   		var lastUl = tabPanel.lastElementChild||tabPanel.lastChild;
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
	   		var firstUl = tabPanel.firstElementChild||tabPanel.firstChild;
	   		var tabNav = firstUl.getElementsByTagName("li");
	   		tabNav[1].className = "defaultStyle";
	   		tabNav[0].className = "clickStyle";
	   		var lastUl = tabPanel.lastElementChild||tabPanel.lastChild;
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
			var nextEle=ele.nextElementSibling||ele.nextSibling;
			console.log(ele.nextSibling);
			if(str.length===0){
				nextEle.innerHTML="输入不能为空";
				nextEle.style.color = "red";
				return;
			}
			console.log(ele.id);
			if(ele.id==="name"){
				var len = str.replace(new RegExp('[\u4e00-\u9fa5]', 'g'), 'aa').length;
				var namejson= {name:str};
				var nameinfo = JSON.stringify(namejson);
				ajax("post","/reg/name","application/json",nameinfo,function(res){
					if(res!=="success"){
						nextEle.innerHTML = res;
						nextEle.style.color = "red";
					}else{
						if(len >= 4 && len <= 16){
							nextEle.innerHTML = '名称可用';
						    nextEle.style.color = "green";
						}else{
							nextEle.innerHTML = '请检查名称字符数';
						    nextEle.style.color = "red";
						}
					}
		
				});
  
			}
			if(ele.id==="password"){
				if (str.match(/^[a-zA-Z0-9]{6,16}$/)) {
		        
		            nextEle.innerHTML= '密码格式正确';
		            nextEle.style.color = "green";
		        } else {
		            //checkResult.right = false;
		            nextEle.innerHTML = '请输入6到16位字符且只能为数字和字母';
		            nextEle.style.color = "red";
		        }
			}
			if(ele.id==="repassword"){
				if (str === reginp[1].value) {
		            //checkResult.right = true;
		            nextEle.innerHTML = '密码正确';
		            nextEle.style.color = "green";
		        } else {
		            //checkResult.right = false;
		            nextEle.innerHTML = '两次密码输入要相同';
		            nextEle.style.color = "red";
		        }
			}
			if(ele.id==="email"){
				var reg = new RegExp('^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', 'i');
				var emailjson= {email:str};
				var emailinfo = JSON.stringify(emailjson);
				ajax("post","/reg/email","application/json",emailinfo,function(res){
					console.log(res);
					if(res!=="success"){
						nextEle.innerHTML = res;
						nextEle.style.color = "red";
					}else{
						if (str.match(reg)) {
						    //checkResult.right = true;
						    nextEle.innerHTML = '邮箱可用';
						    nextEle.style.color = "green";
						} else {
						    //checkResult.right = false;
						    nextEle.innerHTML = '邮箱格式错误';
						    nextEle.style.color = "red";
						}
					}
				});
			};
		};


		//登录页面验证码函数
		var canvas=document.querySelector("#valCanvas");
		var context=canvas.getContext("2d");
		var strEnd="";
		function start(){
			try{
				function drawscreen(){
					context.fillStyle="#A2A2A2";
					context.fillRect(0,0,100,35);	
					context.strokeStyle="#DDDDDD";
					context.strokeRect(0,0,100,35);
				};
				function write_text(str){
					context.fillStyle="#000000";
					context.font="20px _sans";
					context.textBaseline="top";
					context.fillText(str,30,10);
				};
				function getabc(){
					var str="a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9";
					var strArray=str.split(",");
					strEnd="";
					for(i=0;i<4;i++){
						var rnd=Math.floor(Math.random()*strArray.length);
						strEnd+=strArray[rnd];
					};
				};
				drawscreen();
				getabc();
				write_text(strEnd);
			}catch(e){
				alert(e);	
			}
		};
		start();
		//登录的验证函数
		var result={
			names:false,
			passwords:false,
			validate:false
		};
		function checkLog(ele){
			var str = ele.value;
			var nextEle=ele.nextElementSibling||ele.nextSibling;
			if(str.length===0){
				nextEle.innerHTML="输入不能为空";
				nextEle.style.color = "red";
				return;
			}
			if(ele.id=="name"){
				var namejson= {name:str};
				var nameinfo = JSON.stringify(namejson);
				
				ajax("post","/login/name","application/json",nameinfo,function(res){
					if(res!=="exist"){
						nextEle.innerHTML = '用户名不存在';
						nextEle.style.color = "red";
						result.names=false;
					}else{
						nextEle.innerHTML ="";
						result.names=true;
					}
				});

			};


			if(result.names===true){
				var namestr = document.getElementById("name").value;
				if(ele.id=="password"){
					var totaljson= {name:namestr,password:str};
					var totalinfo = JSON.stringify(totaljson);
					
					ajax("post","/login/password","application/json",totalinfo,function(res){
						if(res!=="match"){
							nextEle.innerHTML = '用户名与密码不一致';
							nextEle.style.color = "red";
							result.passwords=false;
						}else{
							nextEle.innerHTML ="";
							result.passwords=true;
						}
					});
				}
			};
			if(ele.id=="validate"){
				if(str!==strEnd){
					document.getElementById("validatetip").innerHTML = '验证码不正确';
					document.getElementById("validatetip").style.color = "red";
					result.validate=false;
				}else{
					document.getElementById("validatetip").innerHTML = "";
					result.validate=true;
				}
				
			};
			

		}
		//监听注册页面文本框内value变化时tip的变化
		for(var i=0;i<reginp.length;i++){
			if(!!window.ActiveXObject){
				reginp[i].onpropertychange = regfn;
			}else{
				EventUtil.addHandler(reginp[0],"input",regfn);
				EventUtil.addHandler(reginp[i],"input",regfn);
			}
			var regfn=function(e){
				var ev = e||window.e;
				var target = ev.target||ev.srcElement;
				var nextTarget = target.nextElementSibling||target.nextSibling;
				target.style.border = "1px solid yellow";
				nextTarget.style.display = "block";
				check(target);
			}
			EventUtil.addHandler(reginp[i],"blur",function(e){
				var ev = e||window.e;
				var target = ev.target||ev.srcElement;
				target.style.border = "1px solid #1AE6E6";								
			});
		};
		//登录页面表单focus与blur时候的不同表现
		for(var i=0;i<logininp.length;i++){
			if(!!window.ActiveXObject){
				logininp[i].onpropertychange = loginfn;
			}else{
				EventUtil.addHandler(logininp[0],"input",loginfn);
				EventUtil.addHandler(logininp[1],"input",loginfn);
				EventUtil.addHandler(logininp[2],"input",loginfn);
			}
			var loginfn=function(e){
				var ev = e||window.e;
				var target = ev.target||ev.srcElement;
				var nextTarget = target.nextElementSibling||target.nextSibling;
				target.style.border = "1px solid yellow";
				nextTarget.style.display = "block";
				document.getElementById("validatetip").style.display = "block";
				checkLog(target);
			}
			EventUtil.addHandler(logininp[i],"blur",function(e){
				var ev = e||window.e;
				var target = ev.target||ev.srcElement;
				target.style.border = "1px solid #1AE6E6";								
			});
		};

		//注册表单提交时需要先验证再用ajax提交数据
		EventUtil.addHandler(regsub,"click",function(e){

				if(regtips[0].style.color=="green"&&regtips[1].style.color=="green"&&regtips[2].style.color=="green"&&regtips[3].style.color=="green"){
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
									location.href="/";
									clearInterval(flag);
								}
							}
							var flag=setInterval(countdown,1000);
						}else{
							return;
						}
					});
				}else{
					alert("请检查输入信息！");
				}
		});
		
		// 登录表单提交时需要先验证再用ajax提交数据
		EventUtil.addHandler(loginsub,"click",function(e){
			EventUtil.preventDefault(e);
			console.log(this);
				if(result.names==true&&result.passwords==true&&result.validate==true){
					var target = EventUtil.getTarget(e);
					EventUtil.preventDefault(e);
					var form=target.parentNode.parentNode;
					var resultJ=seriPost(form);
					var resultJson={};
					//console.log(resultJson);
					for(var i = 0; i < resultJ.length; i++){
						var val = resultJ[i].split("=");
						resultJson[val[0]]=val[1];
					};
					var str =JSON.stringify(resultJson);
					ajax("post","/login","application/json",str,function(res){
						if(res=="loginsuccess"){
							location.href="/";
						}else{
							return;
						}
					});
				}else{
					alert("请检查输入");
				}		
		});

});

