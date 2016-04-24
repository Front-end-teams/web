//选项卡
var oTable=document.getElementById("table");
var aLi=oTable.getElementsByTagName("li");
var oDiv=oTable.getElementsByTagName("div");
//console.log(oDiv);
for(var i=0,len=aLi.length;i<len;i++){
    aLi[i].id=i;
    aLi[i].onclick=function(){
        for(var j=0,len=aLi.length;j<len;j++){
            aLi[j].className="";
            oDiv[j].style.display="none";
        }
    this.className="active";
    oDiv[this.id].style.display="block";
    }
}

var container=document.getElementById("img-cont");
var prev=document.getElementById("prev");
var next=document.getElementById("next");
var list=document.getElementById("list");

// console.log(list.offsetLeft);
var button=document.getElementById("buttons")
var buttons=document.getElementById("buttons").getElementsByTagName("span");
var imgs=list.getElementsByTagName("li");

var time=null;

var index=1;
// span的背景色改变
function showButton(){
	for (var i = 0; i < buttons.length; i++) {
		if(buttons[i].className=="on"){
			buttons[i].className="";
			break;
		}
	}
	buttons[index-1].className='on';
}

//定义动画函数 
function animate(ele,end){

	
	var timer=null;
	clearInterval(timer);
	timer=setInterval(function(){
		//console.log(ele.offsetLeft);
		//速度随着现有偏移量和目标偏移量的距离的改变而改变
		var speed=Math.floor((end-ele.offsetLeft)/2);
		
		if ((speed>0&&parseInt(ele.style.left)<end)||(speed<0&&parseInt(ele.style.left)>end)){
			ele.style.left=ele.offsetLeft+speed+'px';
	
		}else{
			//当偏移量大于-600或小于-3000时的处理方式
			clearInterval(timer);
			ele.style.left = ele.offsetLeft + 'px';
            if(parseInt(ele.style.left)>-1350){
                ele.style.left = "-4050px" ;
            }
            if(parseInt(ele.style.left)<-4050) {
                ele.style.left = '-1350px';
            }
		}
	},50);

}


function play(){
	time=setInterval(function(){
		next.onclick();
	},3000);
}

function stop(){
	clearInterval(time);
}
//当鼠标离开容器时 图片自动播放
container.onmouseover=stop;
// 当鼠标离开容器时 图片停止自动播放
container.onmouseout=play;

next.onclick=function(){
	//console.log("next run");
	if(index==3){
		index=1;
	}else{
		index+=1;
	}
	
	animate(list,parseInt(list.style.left)-1350);
	showButton();
}

prev.onclick=function(){
	animate(list,parseInt(list.style.left)+1350);
	if (index==1) {
		index=3
	}else{
		index-=1;
	}
	
	showButton();
}
EventUtil.addHandler("button","click",function(e){
	//点击span元素时 出现相应的图片 并改变相应span的背景色
	var target=e.target;
	if ((target.tagName).toLowerCase()=="span") {
		index=target.getAttribute("index");
		showButton();
		animate(list,-1350*index);
		}
});

