  $(function() {
    $.datepicker.regional["zh-CN"] = 
    { 
    	 closeText: "关闭",
    	 prevText: "&#x3c;上月", 
    	 nextText: "下月&#x3e;", 
    	 currentText: "今天", 
    	 monthNames: 
    	 ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], 
    	 monthNamesShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"], 
    	 dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], 
    	 dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], 
    	 dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"], 
    	 weekHeader: "周", 
    	 dateFormat: "yy-mm-dd", 
    	 firstDay: 1, 
    	 isRTL: !1, 
    	 showMonthAfterYear: !0, 
    	 yearSuffix: "年" 
    };
    $.datepicker.setDefaults($.datepicker.regional["zh-CN"]);
    var datePicker = $("#dl").datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true
        });
    var editor = new wangEditor('jobDetail');
    editor.create();
 });

window.onload=function(){
  var recruitType=document.getElementById('recruitType');
  var workPlace=document.getElementById('workPlace');
  var experience=document.getElementById('experience');
  var rank=document.getElementById('rank');

  var recruitType_ul=document.getElementById('recruitType_ul');
  var workPlace_ul=document.getElementById('workPlace_ul');
  var experience_ul=document.getElementById('experience_ul');
  var rank_ul=document.getElementById('rank_ul');

  var recruitType_ul_li=recruitType_ul.getElementsByTagName('li');
  var workPlace_ul_li=workPlace_ul.getElementsByTagName('li');
  var experience_ul_li=experience_ul.getElementsByTagName('li');
  var rank_ul_li=rank_ul.getElementsByTagName('li');

  window.onclick=function(){
  	recruitType_ul.style.display='none';
  	workPlace_ul.style.display='none';
  	experience_ul.style.display='none';
  	rank_ul.style.display='none';
  };
  recruitType.addEventListener('click',function(event){
  	recruitType_ul.style.display='block';
    workPlace_ul.style.display='none';
    experience_ul.style.display='none';
    rank_ul.style.display='none';
  	event.stopPropagation();
  },false);

  workPlace.addEventListener('click',function(event){
  	recruitType_ul.style.display='none';
    workPlace_ul.style.display='block';
    experience_ul.style.display='none';
    rank_ul.style.display='none';
  	event.stopPropagation();
  },false);
  experience.addEventListener('click',function(event){
  	recruitType_ul.style.display='none';
    workPlace_ul.style.display='none';
    experience_ul.style.display='block';
    rank_ul.style.display='none';
  	event.stopPropagation();
  },false);
  rank.addEventListener('click',function(event){
  	recruitType_ul.style.display='none';
    workPlace_ul.style.display='none';
    experience_ul.style.display='none';
    rank_ul.style.display='block';
  	event.stopPropagation();
  },false);


  for(var i=0;i<recruitType_ul_li.length;i++)
  {
  	recruitType_ul_li[i].onclick=function(){
  		if(this.innerText=="请选择"){
  			recruitType.value="";
  		}
  		else
  		{
  			recruitType.value=this.innerText;
  		}
  		
  		recruitType_ul.style.display='none';
  	};
  }
   for(var i=0;i<workPlace_ul_li.length;i++)
  {
  	workPlace_ul_li[i].onclick=function(){
  		if(this.innerText=="请选择"){
  			workPlace.value="";
  		}
  		else
  		{
  			workPlace.value=this.innerText;
  		}
  		workPlace_ul.style.display='none';
  	};
  }

 for(var i=0;i<experience_ul_li.length;i++)
  {
  	experience_ul_li[i].onclick=function(){
  		if(this.innerText=="请选择"){
  			experience.value="";
  		}
  		else
  		{
  			experience.value=this.innerText;
  		}
  		experience_ul.style.display='none';
  	};
  }
   for(var i=0;i<rank_ul_li.length;i++)
  {
  	rank_ul_li[i].onclick=function(){
  		if(this.innerText=="请选择"){
  			rank.value="";
  		}
  		else
  		{
  			rank.value=this.innerText;
  		}
  		rank_ul.style.display='none';
  	};
  }

};
