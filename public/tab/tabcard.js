/*
* @Author: Administrator
* @Date:   2016-04-17 18:11:12
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-17 20:52:11
*/

'use strict';
function tabPanel(param){
	var defaultIndex=param["default"]||0,//设置显示的页面
		panelobj=param["panel"],//设置tab容器
		defalutClass=param["defalutStyle"]||"",//设置tab菜单项的普通样式
		hoverClass=param["hoverStyle"]||"hover",//设置鼠标移到tab菜单项的样式
		currentIndex=defaultIndex,
		menus=_$(panelobj).getElementsByTagName("ul")[0].getElementsByTagName("li"),
		contents=_$(panelobj).getElementsByTagName("ul")[1].getElementsByTagName("li"),
		menuNumber=menus.length,
		hidden="hidden";
	for(var i=0;i<menuNumber;i++){
		_setClass(contents[0],hoverClass);
		_setClass(contents[i],hidden);
		_setClass(menus[i],defalutClass);
		(function(i){
			menus[i].onmouseover=function(){
				var old=menus[currentIndex];
				_setClass(old,defalutClass);
				_setClass(contents[currentIndex],hidden);
				var cur=menus[i];
				_setClass(cur,hoverClass);
				currentIndex=i;
				_setClass(contents[i],"");
			};
		})(i);
	}
	_setClass(menus[currentIndex],hoverClass);
	_setClass(contents[currentIndex],"");
	//便利函数
	function _setClass(obj,className){obj.className=className}
	function _$(oid){return typeof(oid) == "string"?document.getElementById(oid):oid}
}