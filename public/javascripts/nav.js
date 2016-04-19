/*
* @Author: Administrator
* @Date:   2016-04-17 14:23:24
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-19 12:41:13
*/


	$(function(){

			var login = document.getElementById("login");
			var reg = document.getElementById("reg");
			var close = document.getElementById("close");
			var regtab = document.getElementById("regtab");
			var mask = document.getElementById("mask");
			//var regForm = document.getElementById("regForm");
			//var loginForm = document.getElementById("loginForm");
			var tabcard = new TabCard("regtab","defaultStyle","clickStyle");
				tabcard.clear();
		   		tabcard.click();

			reg.onclick = function(){
				regtab.className="show";
				mask.className="maskshow";
		   		var tabPanel = tabcard.panel;
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
		   		var firstUl = tabPanel.firstElementChild;
		   		var tabNav = firstUl.getElementsByTagName("li");
		   		tabNav[1].className = "defaultStyle";
		   		tabNav[0].className = "clickStyle";
		   		var lastUl = tabPanel.lastElementChild;
		   		var tabBd = lastUl.getElementsByTagName("li");
		   		tabBd[0].className = "tabshow";
		   		tabBd[1].className = "tabhide";
			}
			close.onclick = function(){
				regtab.className= "hide";
				mask.className = "maskhide";
			}
			

			//表单验证注册页面
			var regForm = document.getElementById("regForm");
			var inp = regForm.querySelectorAll("input");
			var checkResult = {
				right:false
			};
			var regsub = document.getElementById("regsub");
			regsub.onclick = function(){
				var right = true;
				for(var i=0;i<inp.length;i++){
					check(inp[i]);
					console.log(checkResult.right);
					if (checkResult.right) {
					    // //input.style.border = '1px solid green';
					    // span.style.color = 'green';
					    right = true;
					} else {
					    // input.style.border = '1px solid red';
					    // span.style.color = 'red';
					    right = false;
					}
					console.log(right);
				};
			    if (right) {
			        alert('注册成功');
			    } else {
			        alert('注册失败，请检查输入');
			    }
			 
			 	// if(inp[0].style.borderColor=="green"&&inp[1].style.borderColor=="green"&&inp[2].style.borderColor=="green"&&inp[3].style.borderColor=="green"){
			 	// 	alert("注册成功");
			 	// }else{
			 	// 	alert("注册失败，请检查输入");
			 	// }
			};
			for(var i=0;i<inp.length;i++){
				inp[i].addEventListener("focus",function(e){
					var ev = e||window.e;
					var target = ev.target||ev.srcElement;
					target.value = "";
					target.style.border = "1px solid yellow";
					target.nextElementSibling.style.display = "block";
				},false);
				inp[i].addEventListener("blur",function(e){
					var ev = e||window.e;
					var target = ev.target||ev.srcElement;
					target.style.border = "1px solid #1AE6E6";
					check(target);		
				},false)
			};
			function check(ele){
				var str = ele.value;
				if(str.length===0){
					ele.nextElementSibling.innerHTML="输入不能为空";
					ele.nextElementSibling.style.color = "red";
					return;
				}
				if(ele.id==="name"){
					var len = str.replace(new RegExp('[\u4e00-\u9fa5]', 'g'), 'aa').length;
			        if (len >= 4 && len <= 16) {
			        	checkResult.right = true;
			            ele.nextElementSibling.innerHTML = '名称可用';
			            ele.nextElementSibling.style.color = "green";
			       } else {
			       		checkResult.right = false;
			            ele.nextElementSibling.innerHTML = '请检查名称字符数';
			            ele.nextElementSibling.style.color = "red";
			       }
				}
				if(ele.id==="password"){
					if (str.match(/^[a-zA-Z0-9]{6,16}$/)) {
			            checkResult.right = true;
			            ele.nextElementSibling.innerHTML= '密码格式正确';
			            ele.nextElementSibling.style.color = "green";
			        } else {
			            checkResult.right = false;
			            ele.nextElementSibling.innerHTML = '请输入6到16位字符且只能为数字和字母';
			            ele.nextElementSibling.style.color = "red";
			        }
				}
				if(ele.id==="repassword"){
					if (str === inp[1].value) {
			            checkResult.right = true;
			            ele.nextElementSibling.innerHTML = '密码正确';
			            ele.nextElementSibling.style.color = "green";
			        } else {
			            checkResult.right = false;
			            ele.nextElementSibling.innerHTML = '两次密码输入要相同';
			            ele.nextElementSibling.style.color = "red";
			        }
				}
				if(ele.id==="email"){
					var reg = new RegExp('^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', 'i');
					if (str.match(reg)) {
					    checkResult.right = true;
					    ele.nextElementSibling.innerHTML = '邮箱可用';
					    ele.nextElementSibling.style.color = "green";
					} else {
					    checkResult.right = false;
					    ele.nextElementSibling.innerHTML = '邮箱格式错误';
					    ele.nextElementSibling.style.color = "red";
					}
				}

			};

	})
	