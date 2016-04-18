window.onload=function(){
     // var searchJob=document.getElementById('searchJob');
     // var input=searchJob.getElementsByTagName('input');
     // var options=searchJob.getElementsByTagName('ul');
     // var option=options.querySelectorAll('li');
 
     // for(var i=0;i<input.length;i++)
     // {
     // 	input[i].onclick=function(){
     // 		option[i].style.display='block';
     // 	};
     // }



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
	event.stopPropagation();
},false);

workPlace.addEventListener('click',function(event){
	workPlace_ul.style.display='block';
	event.stopPropagation();
},false);
experience.addEventListener('click',function(event){
	experience_ul.style.display='block';
	event.stopPropagation();
},false);
rank.addEventListener('click',function(event){
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