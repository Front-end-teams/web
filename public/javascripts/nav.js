/*
* @Author: Administrator
* @Date:   2016-04-17 14:23:24
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-18 09:56:32
*/

'use strict';
window.onload=function(){
	
	var login = document.getElementById("login");
	var reg = document.getElementById("reg");
	var close = document.getElementById("close");
	var tab = document.getElementById("tab");
	var mask = document.getElementById("mask");
	reg.onclick = function(){
		tab.className="show";
		mask.className="maskshow";
	};
	login.onclick=  function(){
		tab.className="show";
		mask.className="maskshow";
	}
	close.onclick = function(){
		tab.className= "hide";
		mask.className = "maskhide";
	}
	tabPanel({"panel":"tab"});//panel为必填项，default、defalutStyle、hoverStyle为选填项

	//表单验证注册页面
	var regForm = document.getElementById("regForm");
	var inp = regForm.querySelectorAll("input");
	console.log(inp);
	var checkResult = {
		right:false
	};
	var regsub = document.getElementById("regsub");
	regsub.onclick = function(){
		var right = true;
		for(var i=0;i<inp.length;i++){
			check(inp[i]);
			if (checkResult.right) {
			    input.style.border = '2px solid green';
			    span.style.color = 'green';
			} else {
			    input.style.border = '2px solid red';
			    span.style.color = 'red';
			    right = false;
			}
		};
	    if (right) {
	        alert('注册成功');
	    } else {
	        alert('注册失败，请检查输入');
	    }
	};
	for(var i=0;i<inp.length;i++){
		inp[i].addEventListener("focus",function(e){
			var ev = e||window.e;
			var target = ev.target||ev.srcElement;
			target.style.border = "1px solid yellow";
			target.nextElementSibling.style.display = "block";
		},false);
		inp[i].addEventListener("blur",function(e){
			var ev = e||window.e;
			var target = ev.target||ev.srcElement;
			target.style.border = "1px solid #1AE6E6";
			check(target);		
		},false)
	}
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
	            ele.nextElementSibling.className="show";
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

	}
}
