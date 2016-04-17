/*
* @Author: Administrator
* @Date:   2016-04-09 12:48:15
* @Last Modified by:   Administrator
* @Last Modified time: 2016-04-16 22:24:00
*/

'use strict';
//链接跳转
$(function(){
	$(".regTitle a").click(function(){
		
	});
});
 

//最右端tip的替换
$(function(){
    	$(".rfm td input").focus(function(){
    		$(this).parent().next().children("i").show();
    	})
    	$(".rfm td input").blur(function(){
    		$(this).parent().next().children("i").hide();
    	})
});


