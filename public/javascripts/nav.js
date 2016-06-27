 /*
* @Author: Administrator
* @Date:   2016-04-17 14:23:24
* @Last Modified by:   Administrator
<<<<<<< HEAD
* @Last Modified time: 2016-05-22 19:12:36
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
		var searchAll=document.getElementById('searchAll');
		var searchAllAction=document.getElementById('searchAllAction');
		if(reg!==null){
			reg.onclick = function(){
				regtab.className="show";
				mask.className="maskshow";
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
		   				EventUtil.addHandler(reginp[0],"input",regfn);
		   				EventUtil.addHandler(reginp[1],"input",regfn);
		   				// EventUtil.addHandler(reginp[2],"input",regfn);
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


			};
		};
		if(login!==null){
			login.onclick=  function(){
				regtab.className="show";
				mask.className="maskshow";
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
	   					EventUtil.addHandler(logininp[0],"input",loginfn);
	   					EventUtil.addHandler(logininp[1],"input",loginfn);
	   				}
	   				var loginfn=function(e){
	   					var ev = e||window.e;
	   					var target = ev.target||ev.srcElement;
	   					var nextTarget = target.nextElementSibling||target.nextSibling;
	   					target.style.border = "1px solid yellow";
	   					nextTarget.style.display = "block";
	   					checkLog(target);
	   				}
	   				EventUtil.addHandler(logininp[i],"blur",function(e){
	   					var ev = e||window.e;
	   					var target = ev.target||ev.srcElement;
	   					target.style.border = "1px solid #1AE6E6";								
		   			});
		   		}
	   			
			};
		};
		
		close.onclick = function(){
			regtab.className= "hide";
			mask.className = "maskhide";
		};
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
			if(ele.id=="email"){
				var reg = new RegExp('^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', 'i');
				var emailjson= {email:str};
				var emailinfo = JSON.stringify(emailjson);
				console.log(emailinfo);
				console.log(str);
				console.log(reg.test(str));
				if (reg.test(str)){
					ajax("post","/reg/email","application/json",emailinfo,function(res){
						if(res=="reged"){
							nextEle.innerHTML = "已注册";
							nextEle.style.color = "red";
							regResult.emails=false;
						}else if(res=="success"){
							nextEle.innerHTML = '邮箱可用';
							nextEle.style.color = "green";
							regResult.emails=true;
						}
					});
				}else{
					nextEle.innerHTML = '请输入正确的邮箱';
				    nextEle.style.color = "red";
				    regResult.emails=false;
				}
			};
			if(ele.id=="password"){
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


		// //登录页面验证码函数
		// var canvas=document.querySelector("#valCanvas");
		// var context=canvas.getContext("2d");
		// var strEnd="";
		// function start(){
		// 	try{
		// 		function drawscreen(){
		// 			context.fillStyle="#A2A2A2";
		// 			context.fillRect(0,0,100,35);	
		// 			context.strokeStyle="#DDDDDD";
		// 			context.strokeRect(0,0,100,35);
		// 		};
		// 		function write_text(str){
		// 			context.fillStyle="#000000";
		// 			context.font="20px _sans";
		// 			context.textBaseline="top";
		// 			context.fillText(str,30,10);
		// 		};
		// 		function getabc(){
		// 			var str="a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9";
		// 			var strArray=str.split(",");
		// 			strEnd="";
		// 			for(i=0;i<4;i++){
		// 				var rnd=Math.floor(Math.random()*strArray.length);
		// 				strEnd+=strArray[rnd];
		// 			};
		// 		};
		// 		drawscreen();
		// 		getabc();
		// 		write_text(strEnd);
		// 	}catch(e){
		// 		alert(e);	
		// 	}
		// };
		// start();
		//登录的验证函数
		var logResult={
			emails:false,
			passwords:false,
		};
		function checkLog(ele){
			var str = ele.value;
			var nextEle=ele.nextElementSibling||ele.nextSibling;
			if(str.length===0){
				nextEle.innerHTML="输入不能为空";
				nextEle.style.color = "red";
				return;
			}
			if(ele.id=="email"){
				var emailjson= {email:str};
				var emailinfo = JSON.stringify(emailjson);
				
				ajax("post","/login/email","application/json",emailinfo,function(res){
					if(res!=="exist"){
						nextEle.innerHTML = '邮箱不存在';
						nextEle.style.color = "red";
						logResult.emails=false;
					}else{
						nextEle.innerHTML ="";
						logResult.emails=true;
					}
				});

			};


			if(logResult.emails==true){
				var emailstr = document.getElementById("email").value;
				if(ele.id=="password"){
					var totaljson= {email:emailstr,password:str};
					var totalinfo = JSON.stringify(totaljson);
					
					ajax("post","/login/password","application/json",totalinfo,function(res){
						if(res!=="match"){
							nextEle.innerHTML = '用户名与密码不一致';
							nextEle.style.color = "red";
							logResult.passwords=false;
						}else{
							nextEle.innerHTML ="";
							logResult.passwords=true;
						}
					});
				}
			};
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
				alert("请检查输入信息！");
			}
		});
		
		// 登录表单提交时需要先验证再用ajax提交数据
		EventUtil.addHandler(loginsub,"click",function(e){
			EventUtil.preventDefault(e);
				if(logResult.emails==true&&logResult.passwords==true){
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
		EventUtil.addHandler(searchAllAction,'click',function(e){
			var searchContent=searchAll.value;
			$.ajax({
               url:"/searchall?keyword="+searchContent,
               type:'get',
               success:function(data){
                    console.log('这是data');
                    console.log(data);
                    console.log("这是data");
               },
               err:function(jqXHR, textStatus, errorThrown){
                  alert('error ' + textStatus + " " + errorThrown); 
              }
             });
		});
});

