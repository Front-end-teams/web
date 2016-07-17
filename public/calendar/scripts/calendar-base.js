define("base",function(){
/*定义数组 每个值是一个17位的二进制数
17位表示是否闰月的天数 0表示29天 1表示30天
16-5表示每月的天数 0表示29天 1表示30天
1-4表示闰月的月数*/
 var lunarInfo=new Array(
0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0)

//阳历天数
var solarMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
var Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
var Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
var Animals=new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪");

//节气数据
var solarTerm = new Array("小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至");
var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758);

var nStr1 = new Array('日','一','二','三','四','五','六','七','八','九','十' ,'十一','十二');
var nStr2 = new Array('初','十','廿','卅','　');


//国历节日 *表示放假日
var sFtv = new Array(
"0101* 元旦",
"0214 情人节",
"0308 妇女节",
"0312 植树节",
"0315 消费者权益日",
"0317 St. Patrick's",
"0401 愚人节",
"0422 世界地球日",
"0501 劳动节",
"0504 青年节",
"0512 护士节",
"0512 茵生日",
"0601 儿童节",
"0614 Flag Day",
"0623 国际奥林匹克日",
"0701 建党节 香港回归纪念",
"0703 炎黄在线诞辰",
"0718 托普诞辰",
"0801 建军节",
"0808 父亲节",
"0909 毛泽东逝世纪念",
"0910 教师节",
"0928 孔子诞辰",
"1001*国庆节",
"1006 老人节",
"1024 联合国日",
"1111 Veteran's / Remembrance Day",
"1112 孙中山诞辰纪念",
"1220 澳门回归纪念",
"1225 Christmas Day",
"1226 毛泽东诞辰纪念")

//农历节日 *表示放假日
var lFtv = new Array(
"0101*春节",
"0115 元宵节",
"0505 端午节",
"0707 七夕情人节",
"0715 中元节",
"0815 中秋节",
"0909 重阳节",
"1208 腊八节",
"1224 小年",
"0100*除夕")

//某月的第几个星期几
var wFtv = new Array(
"0131 Martin Luther King Day",
"0231 President's Day",
"0520 母亲节",
"0530 Armed Forces Day",
"0531 Victoria Day",
"0716 合作节",
"0730 被奴役国家周",
"0811 Civic Holiday",
"0911 Labor Holiday",
"1021 Columbus Day",
"1144 Thanksgiving")


//====================================== 传回农历 y年的总天数
function lYearDays(y) {
   var i, sum = 348;
   //判断lunarInfo数组中的值 判断月份的天数 若为30天 则将sum加1
   for(i=0x8000; i>0x8; i>>=1){
   		sum += (lunarInfo[y-1900] & i)? 1: 0;
   	}
   //十二月的天数加上闰月的天数 为一年的整天数
   return(sum+leapDays(y));
}

//====================================== 传回农历 y年闰月的天数
function leapDays(y) {

   if(leapMonth(y)){
   		return((lunarInfo[y-1900] & 0x10000)? 30: 29);
   }
   else{
   		return(0);
   	}
}

//====================================== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
function leapMonth(y) {
   return(lunarInfo[y-1900] & 0xf);
}

//====================================== 传回农历 y年m月的总天数
function monthDays(y,m) {
   return( (lunarInfo[y-1900] & (0x10000>>m))? 30: 29 )
}

//====================================== 算出农历, 传入日期物件, 传回农历日期物件
//                                       该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
function Lunar(objDate) {
  

   	var i, leap=0, temp=0;
   	//基于1990.1.31 （农历正月初一）
   	var baseDate = new Date(1900,0,31);
   	//天数
   	var offset   = (objDate - baseDate)/86400000;

   	this.dayCyl = offset + 40;
   	this.monCyl = 14;

   for(i=1900; i<2050 && offset>0; i++) {
    	temp = lYearDays(i);//第i年的天数
    	offset -= temp;//偏移量减去i年的天数
    	this.monCyl += 12;//月数加12
   }
   //如果偏移量为负值 加上上一年的天数 年数减一 月数减12
   	if(offset<0) {
      	offset += temp;
      	i--;
        this.monCyl -= 12;
   	}

   	this.year = i;//该年的年数
   	this.yearCyl = i-1864;

   	leap = leapMonth(i); //i年闰哪个月
   	this.isLeap = false;//表示是否闰月

   	for(i=1; i<13 && offset>0; i++) {
      //闰月
      	if(leap>0 && i==(leap+1) && this.isLeap==false){
      		--i; 
         	this.isLeap = true;
         	temp = leapDays(this.year); 
      	}else{
          	temp = monthDays(this.year, i);//存储的该年第i个月的天数
        }

      	//解除闰月
      	if(this.isLeap==true && i==(leap+1)){
      		this.isLeap = false;
      	} 

      	offset -= temp;//偏移量减去i月的天数

      	if(this.isLeap == false){
      		this.monCyl ++;
      	} 
   }
   //如果偏移量为0 有闰月 并且月份等于闰月的月份
   	if(offset==0 && leap>0 && i==leap+1){
      	//如果是闰月的第二个月
      	if(this.isLeap){
      		this.isLeap = false;
      	}
      	else{ 
         	//闰月的第一个
         	this.isLeap = true;
         	--i; 
         	--this.monCyl;
        }
    }

      

   	if(offset < 0){ 
   		offset += temp;
   		--i; 
   		--this.monCyl; 
   	}

   this.month = i;
   this.day = offset + 1;
}


//==============================传回公历 y年某m+1月的天数
function solarDays(y,m) {
   	if(m==1){

      	return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
   	}else{
   	
      	return(solarMonth[m]);
    }
}
//============================== 传入 offset 传回干支, 0=甲子
function cyclical(num) {
   return(Gan[num%10]+Zhi[num%12]);
}
//===== 某年的第n个节气为几日(从0小寒起算)
function sTerm(y,n) {
   var offDate = new Date( ( 31556925974.7*(y-1900) + sTermInfo[n]*60000  ) + Date.UTC(1900,0,6,2,5) );
   return(offDate.getUTCDate());
}
//====================== 中文日期
function cDay(d){
    var s;

    switch (d) {
        case 10:
          s = '初十'; break;
        case 20:
          s = '二十'; break;
        case 30:
          s = '三十'; break;
        default :
          s = nStr2[Math.floor(d/10)];
          s += nStr1[d%10];
   }
   return(s);
}
return{
  solarMonth:solarMonth,
  Gan: Gan,
  Zhi: Zhi,
  Animals: Animals,
  solarTerm:solarTerm,
  sTermInfo:sTermInfo,
  nStr1:nStr1,
  sFtv:sFtv,
  lFtv:lFtv,
  wFtv:wFtv,

  lYearDays:lYearDays,
  leapDays: leapDays,
  leapMonth:leapMonth,
  
  monthDays:monthDays,
  Lunar:Lunar,
  solarDays:solarDays,
  cyclical:cyclical,
  cDay:cDay,
  sTerm:sTerm


}
})
