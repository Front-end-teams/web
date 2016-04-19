/*
* @Author: Administrator
* @Date:   2016-04-17 18:11:12
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-19 15:50:55
*/

'use strict';
function TabCard(panel,deS,clS,moS){
	this.panel = document.getElementById(panel);
	this.defaultStyle = deS;
	this.clickStyle = clS;
	this.mouseStyle = moS;	
	this.inps = this.panel.querySelectorAll("input");
}
TabCard.prototype.clear = function(){
	//console.log(this.inps);
	for(var i=0;i<this.inps.length;i++){
		this.inps[i].value="";
		//console.log(this.inps);
	}
}
TabCard.prototype.click = function(){
	var tabPanel = this.panel;
	var firstUl = tabPanel.firstElementChild;
	var tabNav = firstUl.getElementsByTagName("li");
	var lastUl = tabPanel.lastElementChild;
	var tabBd = lastUl.getElementsByTagName("li");
	var that=this;
	for(var i=0;i<tabNav.length;i++){
		tabNav[i].index = i;
		tabNav[i].onclick = function(){
			for(var i=0;i<tabNav.length;i++){
				tabNav[i].className=that.defaultStyle;
			}
			this.className= that.clickStyle;
			for(var i=0;i<tabBd.length;i++){
				tabBd[i].className= "tabhide";
			}
			tabBd[this.index].className="tabshow";
		}
	};
};
TabCard.prototype.mouseover = function(){
	var tabPanel = this.panel;
	var firstUl = tabPanel.firstElementChild;
	var tabNav = firstUl.getElementsByTagName("li");
	var lastUl = tabPanel.lastElementChild;
	var tabBd = lastUl.getElementsByTagName("li");
	var that=this;
	for(var i=0;i<tabNav.length;i++){
		tabNav[i].index = i;
		tabNav[i].onmouseover = function(){
			for(var i=0;i<tabNav.length;i++){
				tabNav[i].className=that.defaultStyle;
			}
			this.className= that.mouseStyle;
			for(var i=0;i<tabBd.length;i++){
				tabBd[i].className= "tabhide";
			}
			tabBd[this.index].className="tabshow";
		}

	};
};