require(["commonFunc","data","render"],function(commonFunc,data,render){


var cld;

var Today = new Date();
var tY = Today.getFullYear();
var tM = Today.getMonth();
var tD = Today.getDate();
var dataCal={
  year: tY,
  month: tM
};


var tbody=document.getElementById("cal");

var yearLeft = document.getElementById("year-left");
var yearRight=document.getElementById("year-right");
var monthLeft=document.getElementById("month-left");
var monthRight=document.getElementById("month-right");
var now=document.getElementById("now");

var monthShow=document.getElementById("month");
var yearShow=document.getElementById("year");

var yearSelect='';
var monthSelect='';

function init(){

  //年选择框的显示
  for (var i = 0; i < 150; i++) {
    var options="<option>"+(1901+i)+"年";
    yearSelect+=options;
  }

  yearShow.innerHTML = yearSelect;
  
  //月选择框的显示
  for(var i=0;i<12;i++){
    var options="<option>"+(1+i)+"月";
    monthSelect+=options;

  }
  monthShow.innerHTML=monthSelect;
  

  t=setTimeout(render.showTime,0);

  render.show(dataCal.year,dataCal.month);

  render.showDetail(tY,tM,tD-1);
  // 年数改变时触发的事件
commonFunc.addHandler(yearShow,"change",function(e){
 
  var value=parseInt(this.value);
  dataCal.year=value;
  render.show(dataCal.year,dataCal.month);
  
})

commonFunc.addHandler(yearLeft,"click",function(e){
  data.year-=1;
  if(year<1901){
    dataCal.year=1901;
  }

  
  render.show(dataCal.year,dataCal.month);
  
})

commonFunc.addHandler(yearRight,"click",function(e){
  

  dataCal.year+=1;
  if(year>2049){
    data.year=2049;
  }
  render.show(dataCal.year,dataCal.month);
  
})

commonFunc.addHandler(monthLeft,"click",function(e){

  dataCal.month-=1;
  if(dataCal.month>11){
    dataCal.month=1;
  }
  if(dataCal.month<0){
    dataCal.month=11;
  }
  
  render.show(dataCal.year,dataCal.month);
  
})


commonFunc.addHandler(monthRight,"click",function(e){
  

  dataCal.month+=1;
  if(dataCal.month>11){
    data.month=1;
  }
  if(dataCal.month<0){
    dataCal.month=11;
  }
  render.show(dataCal.year,dataCal.month);
  
})

//月数改变时触发的事件
commonFunc.addHandler(monthShow,"change",function(e){
  
  var value=parseInt(this.value);

  dataCal.month=value-1;

  render.show(dataCal.year,dataCal.month);
  
})


//点击日期时触发的事件

commonFunc.addHandler(tbody,"click",function(e){
  
  var e = commonFunc.getEvent(e);
  var target=commonFunc.getTarget(e);
  var flag=false;
  while(target){
    if(target.tagName.toLowerCase() == "td"){
      flag=true;
      break;
    }else{
      target=target.parentNode;
    }
  }

  if(flag&&target.className!="nonMonth"){
    var calD = target.getElementsByTagName("span")[0].innerHTML;
    render.showDetail(parseInt(yearShow.value),parseInt(monthShow.value),calD-1);
  }
  
})
}

  init();




})
