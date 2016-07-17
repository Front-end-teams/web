
define('render',['data','base'],function(data,base){
	data.initShow(document.querySelector('.cal-cont'));
	var monthShow=document.getElementById("month");
	var yearShow=document.getElementById("year");

	var td=document.getElementsByTagName("td");

	var span=cal.getElementsByTagName("span");


	var div=cal.getElementsByTagName("div");




	function subShow(cld,i,sD){


	if(cld[sD].isToday) {
		td[i].className = 'todayColor'; //今日颜色
	}else{
		td[i].className="";
	}

	td[i].style.color = cld[sD].color; //国定假日颜色

	if(cld[sD].lDay==1){
		//显示农历月
	div[i].innerHTML = '<b>'+(cld[sD].isLeap?'闰':'') + cld[sD].lMonth + '月' + (base.monthDays(cld[sD].lYear,cld[sD].lMonth)==29?'小':'大')+'</b>';
	}else {
		//显示农历日
		div[i].innerHTML = base.cDay(cld[sD].lDay);
	}

	s=cld[sD].lunarFestival;

	
	if(s.length>0) { //农历节日
	if(s.length>6){
		s = s.substr(0, 4)+'…';

	}
	//农历节日颜色为红色
	s = s.fontcolor('red');

	}else {
		//国历节日
	s=cld[sD].solarFestival;
	if(s.length>0) {
   	size = (s.charCodeAt(0)>0 && s.charCodeAt(0)<128)?8:4;
   	if(s.length>size+2) {
   		s = s.substr(0, size)+'…';
   	}
   	//国历节日颜色为蓝色
   	s = s.fontcolor('blue');
	}else { //廿四节气
   		s=cld[sD].solarTerms;
   		if(s.length>0) {
   			//二十四节气颜色为绿色
   			s = s.fontcolor('limegreen');
   		}
	}

	}
	
	if(s.length>0) {
		div[i].innerHTML = s;
	}

}

//日历内容信息
function show(SY,SM){

	
	yearShow.value=SY+"年";
	monthShow.value=(SM+1)+"月";

	
	var lastCld;
	var nextCld;
   	var i,sD,s,size;
   	cld = new data.calendar(SY,SM);
   	
   	switch ( SM ) {
   		case 11 : { nextCld=new data.calendar(SY+1,0); lastCld=new data.calendar(SY,SM-1)}; break;
   		case 0 : { lastCld=new data.calendar(SY-1,11);nextCld=new data.calendar(SY,SM+1);};break;
   		default : { lastCld=new data.calendar(SY,SM-1);nextCld=new data.calendar(SY,SM+1);}
   	}
   	for(i=0;i<42;i++) {
   		td[i].className="";
      	sD = i - cld.firstWeek;
      	//从sD>-1的表格处开始写
      	if(sD>-1 && sD<cld.length) { //日期内
      		span[i].innerHTML = sD+1;
      		subShow(cld,i,sD);
         
      	}else if(sD<0) { 
      		//上月日期
      		var lsD=lastCld.length+sD;
         	span[i].innerHTML = lsD;
         	subShow(lastCld,i,lsD);
         	td[i].className='nonMonth';

         	
      	}else{
      		//下月日期
      		var nsD=i-cld.length-cld.firstWeek+1;
      		
         	span[i].innerHTML = nsD;
         	//subShow(nextCld,i,nsD);
         	td[i].className='nonMonth';
        }
   	}
}

//详细信息的显示
function showDetail(SY,SM,calD){
	var asideSunlar=document.getElementById("sunlar");
	var sunlarDay=document.getElementById("sunlar-day");
	var asideLunar=document.getElementById("lunar");
	var asideCycle=document.getElementById("cycle");
	var aniYear=document.getElementById("ani-year");
	var festival=document.getElementById("festival");
	
	
	asideSunlar.innerHTML=cld[calD].sYear+"年"+cld[calD].sMonth+"月"+(cld[calD].sDay)+"日"+" 星期"+cld[calD].week;
	sunlarDay.innerHTML=cld[calD].sDay;
	asideLunar.innerHTML="农历"+base.nStr1[cld[calD].lMonth]+"月"+base.cDay(cld[calD].lDay);
	asideCycle.innerHTML=cld[calD].cYear+"年"+cld[calD].cMonth+"月"+cld[calD].cDay+"日";
	aniYear.innerHTML=base.Animals[(cld[calD].sYear-4)%12]+"年";
	if(cld[calD].solarFestival||cld[calD].lunarFestival||cld[calD].solarTerms
){
		festival.innerHTML=cld[calD].solarFestival||cld[calD].lunarFestival||cld[calD].solarTerms;
	}else{
		festival.innerHTML="";
	}
	

}
//时间的显示
function formatTime(num){
	if(num<10){
		num="0"+num;
		
	}
	return num;
}
function showTime(){
    clearTimeout(t);//清除定时器
      
	var date=new Date();
  
	var dateH=date.getHours();  
	var dateMs=date.getMinutes();  
	var dateS=date.getSeconds();  
	now.innerHTML=formatTime(dateH)+":"+formatTime(dateMs)+":"+formatTime(dateS);  
	t=setTimeout(showTime,500); 
}


return{
	show:show,
	showDetail:showDetail,
	showTime:showTime,
	
}
})
	