/*
* @Author: Administrator
* @Date:   2016-03-22 15:28:20
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-18 22:56:39
*/
window.onload=function(){
	if(document.getElementById('maincard')){
		var maincard = new TabCard('maincard','defaultStyle',null,"mouseStyle");
		maincard.mouseover();
	}
	if(document.getElementById('sidetab')){
		var postcard = new TabCard("sidetab","defaultStyle",null,"mouseStyle");
    postcard.mouseover();
	}
	
};
