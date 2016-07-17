//============================== 月历属性
define('data',['base'],function(base){
  
  var Today = new Date();
  var tY = Today.getFullYear();
  var tM = Today.getMonth();
  var tD = Today.getDate();


  function calElement(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,cYear,cMonth,cDay){

      this.isToday    = false;
      //国历
      this.sYear      = sYear;
      this.sMonth     = sMonth;
      this.sDay       = sDay;
      this.week       = week;
      //农历
      this.lYear      = lYear;
      this.lMonth     = lMonth;
      this.lDay       = lDay;
      this.isLeap     = isLeap;
      //干支
      this.cYear      = cYear;
      this.cMonth     = cMonth;
      this.cDay       = cDay;

      this.color      = '';

      this.lunarFestival = ''; //农历节日
      this.solarFestival = ''; //国历节日
      this.solarTerms    = ''; //节气

}

//============================== 传回月历物件 (y年,m+1月)
function calendar(y,m) {

    var sDObj, lDObj, lY, lM, lD=1, lL, lX=0, tmp1, tmp2;
    var lDPOS = new Array(3);
    var n = 0;
    var firstLM = 0;

    sDObj = new Date(y,m,1);            //当月一日日期

    this.length    = base.solarDays(y,m);    //国历当月天数
    this.firstWeek = sDObj.getDay();    //国历当月1日星期几


    for(var i=0;i<this.length;i++) {

        if(lD>lX) {
          sDObj = new Date(y,m,i+1);    //当月一日日期
          lDObj = new base.Lunar(sDObj);     //农历
         
          lY    = lDObj.year;           //农历年
          lM    = lDObj.month;          //农历月
          lD    = lDObj.day;            //农历日
          lL    = lDObj.isLeap;         //农历是否闰月
          lX    = lL? base.leapDays(lY): base.monthDays(lY,lM); //农历当月最後一天

          if(n==0) {
            firstLM = lM;
          }
          lDPOS[n++] = i-lD+1;

        }
      
        this[i] = new calElement(y, m+1, i+1, base.nStr1[(i+this.firstWeek)%7],
                               lY, lM, lD++, lL,
                               base.cyclical(lDObj.yearCyl) ,base.cyclical(lDObj.monCyl), base.cyclical(lDObj.dayCyl++) );


        if((i+this.firstWeek)%7==0||(i+this.firstWeek)%7==6){
          this[i].color = '#9F1A1A';  //周日颜色
        }
    }

    //节气(每个月大概有两个节气)
    tmp1=base.sTerm(y,m*2  )-1;
    tmp2=base.sTerm(y,m*2+1)-1;
    
    this[tmp1].solarTerms = base.solarTerm[m*2];
    this[tmp2].solarTerms = base.solarTerm[m*2+1];
    

   //国历节日
    for(i in base.sFtv){

      if(base.sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))

          if(Number(RegExp.$1)==(m+1)) {
            
              this[Number(RegExp.$2)-1].solarFestival += RegExp.$4 + ' ';
              
         }
    }

    //月周节日
    for(i in base.wFtv){
        if(base.wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/)){
          if(Number(RegExp.$1)==(m+1)) {
              tmp1=Number(RegExp.$2);
              tmp2=Number(RegExp.$3);

              this[((this.firstWeek>tmp2)?7:0) + 7*(tmp1-1) + tmp2 - this.firstWeek].solarFestival += RegExp.$5 + ' ';
          }
        }
          
    }

    //农历节日
    for(i in base.lFtv){
        if(base.lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
          tmp1=Number(RegExp.$1)-firstLM;
          if(tmp1==-11){
            tmp1=1;
          } 
          
          if(tmp1 >=0 && tmp1<n) {
              tmp2 = lDPOS[tmp1] + Number(RegExp.$2) -1;
              
            
              if( tmp2 >= 0 && tmp2<this.length) {
                
                  this[tmp2].lunarFestival += RegExp.$4 + ' ';
                
                  
              }
         
          }
    }
  }
  //今日
  if(y==tY && m==tM){
    this[tD-1].isToday = true;
  }
}
function initShow(cont){
    var caption = '<caption><div class="year-month"><div class="year"><span class="control" rel="prev" id="year-left"></span>'+
            '<select class="year" id="year"></select><span  class="control" rel="next" id="year-right"></span></div>'+
            '<div class="month"><span class="control" rel="prev" id="month-left"></span><select class="month" id="month">'+  
            '</select>'+
            '<span class="control" rel="next" id="month-right"></span>'+
            '</div></div>'+
            '<div class="time"><span>北京时间 </span><span id="now"></span></div></caption>  ';
    var weekday = ['sun','mon','tue','wed','tur','fri','sat'];
    var weekstr = '';
    var thead = '';
    var tbody = '';
    var table = '';
    var calcont = '';

    for(var i = 0; i < 7; i++ ){
      weekstr += '<th scope="col">'+ weekday[i] +'</th>' ;
    }
    thead = '<thead><tr>' +　weekstr + '</tr></thead>';
    tbody = '<tbody id="cal">'
    for(var i = 0; i < 42; i++) {
      

      if(i % 7 == 0 )  {
        console.log('0')
        tbody += '<tr><td><span class="solar"></span><div class="lunar"></div></td>';
      }else if(i % 7 == 6) {
        console.log('6')
        tbody += '<td><span class="solar"></span><div class="lunar"></div></td></tr> ';

      } else {
        console.log('ooo');
        tbody += '<td><span class="solar"></span><div class="lunar"></div></td> ';
      }
    }
    console.log(tbody);
    tbody += '</tbody>';

    table = '<table <table cellspacing="0" class="cal" summary="a calendar style date picker">'+ caption + thead + tbody +'</table>';
    aside = '<aside class="show-detail"><div class="sunlar" id="sunlar">2016</div>'+
    '<div class="sunlar-day" id="sunlar-day">3</div>'+
    '<div class="lunar" id="lunar"></div>'+
    '<div class="cycle" id="cycle"></div>'+
    '<div class="ani-year" id="ani-year"></div>'+
    '<div class="festival" id="festival"></div>'+
    '</aside>';
    calcont = table + aside ;
    cont.innerHTML = calcont;
  }
return {
  calendar:calendar,
  Today:Today,
  initShow:initShow,
  
  
}
});