
var container=document.getElementById("img-cont");
var prev=document.getElementById("prev");
var next=document.getElementById("next");
var list=document.getElementById("list");

// console.log(list.offsetLeft);
var button=document.getElementById("buttons")
var buttons=document.getElementById("buttons").getElementsByTagName("span");
var imgs=list.getElementsByTagName("li");
var animated = false;
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

	animated = true;
	var timer = null;
	clearInterval(timer);
	timer = setInterval(function(){
		//console.log(ele.offsetLeft);
		//速度随着现有偏移量和目标偏移量的距离的改变而改变
		var speed=Math.floor((end-ele.offsetLeft)/2);
		
		if ((speed>0&&parseInt(ele.style.left)<end)||(speed<0&&parseInt(ele.style.left)>end)){
			ele.style.left=ele.offsetLeft+speed+'px';
	
		}else{
			
			clearInterval(timer);
			ele.style.left = end + 'px';
      if(parseInt(ele.style.left)>-1350){
          ele.style.left = "-4050px" ;
      }
      if(parseInt(ele.style.left)<-4050) {
          ele.style.left = '-1350px';
      }
      animated = false;
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
	if (animated) {
   return;
  }
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
	if (animated) {
    return;
  }
	animate(list,parseInt(list.style.left)+1350);
	if (index==1) {
		index=3
	}else{
		index-=1;
	}
	
	showButton();
}
EventUtil.addHandler(button,"click",function(e){
	//点击span元素时 出现相应的图片 并改变相应span的背景色
	if (animated) {
    return;
  }
	var target=e.target;
	if ((target.tagName).toLowerCase()=="span") {
		index=target.getAttribute("index");
		showButton();
		animate(list,-1350*index);
		}
});

//-------------------------------动画的实现

$(window).scroll(function(event) {
	/* Act on the event */
	//三个图标的显示
	if($(window).scrollTop() + $(window).height()  >$(".character-wrap").offset().top+ 1/2*$(".icon1").height()) {

		$(".character-wrap>div").eq(0).animate({top:"30px",opacity:1},500,function(){
			
			$(".character-wrap>div").eq(1).animate({top:"30px",opacity:1},500,function(){
				
				$(".character-wrap>div").eq(2).animate({top:"30px",opacity:1},500)
			});
		});
	
	}
	//介绍一的显示
	if($(window).scrollTop() + $(window).height()  >$(".intro1").offset().top+ 1/2*$(".intro1").height()) {
		$(".intro1 .intro1-text").animate({opacity: 1}, 1000);
		$(".intro1 .intro1-img").animate({top:"5px",opacity:1},500);
	}

	//介绍二的显示
	if($(window).scrollTop() + $(window).height() >$(".intro2").offset().top+ 1/2*$(".intro2").height() ) {
		$(".intro2 .intro2-text").animate({opacity: 1}, 1000);
		$(".intro2 .intro2-img").animate({top:"-30px",opacity:1},500);
	}

	if($(window).scrollTop() + $(window).height() >$(".intro3").offset().top+ 1/2*$(".intro3").height() ) {
		$(".intro3 .intro3-text").animate({opacity: 1}, 1000);
		$(".intro3 .intro3-img").animate({top:"5px",opacity:1},500);
	}
	

});