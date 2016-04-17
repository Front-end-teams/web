/*
* @Author: Administrator
* @Date:   2016-03-22 15:28:20
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-16 10:03:11
*/


//tab选项卡的实现
$(function(){
	var $tags_li = $(".fastSectionNavBar li");
	$tags_li.click (function(){
		$(this).addClass("selected")
		.siblings().removeClass("selected");
		var index = $tags_li.index(this);
		console.log(index);
		$(".tags_box>div").eq(index).show().siblings().hide();
	});

})
alert(window.location);