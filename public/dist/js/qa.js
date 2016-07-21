(function(){
	var tag=document.getElementById('tags')
	if(tag){
		var tags = tag.getElementsByTagName('a');
		var count=0;
//选择标签并且最多只能选三项
for(var i=0,leng=tags.length;i<leng;i++)
{	
		tags[i].onclick=function()
	{
			if(count<=2)
	    {
			if ($(this).hasClass('active'))
			{
				$(this).removeClass('active');
				count--;
				console.log('count:'+count);
			}
			else
			{
				$(this).addClass('active');
				count++;
				console.log('count:'+count);
			}		
		}
		else
		{
			if ($(this).hasClass('active'))
			{
				$(this).removeClass('active');
				count--;
				console.log('count:'+count);
            }
		}
	};    
}
}
if(document.getElementById('pubQues')) {
	$('#pubQues').click(function(){
	var quesTitle=$('#ques_Title').val(),
	    content=$('#content').val();
	if (!quesTitle||!content){
		alert("内容不能为空哟~");
	}else if(count===0)
	{
	  alert("请至少选择一个标签~");
	}else{
	var tags=[];
	var tagsSelected=$('.active');
	for(var i=0,leng=tagsSelected.length;i<leng;i++)
	{
	    tags.push(tagsSelected[i].innerText);
	}
	var params={
		quesTitle:$('#ques_Title').val(),
		quesDetail:$('#content').val(),
		tags:tags
	};
	console.log(params);
	$.ajax({
                data: params,
                url: '/ask',
                type:'post',
                jsonpCallback: 'callback',
                success: function(data){
                	var pop2 = document.querySelector('.p2');			
					var p2 = Popuper({
					    wrap: pop2,
					    type: 'success',
					    confirm: function() {
					    		//继续发布问题
					         var confirm=document.querySelector('.confirm');
					         confirm.setAttribute('href',"/ask");
					        //window.location="localhost:3008/ask";
					    },
					    cancel: function() {
					    	//查看博客
					        var cancel=document.querySelector(".cancel");
					        cancel.setAttribute("href","/question");
					    }

					}).edit({

					    title: '提示',
					    content: '问题发布成功'

					}).show();

					p2.toggle().edit({
			        type: 'info'
			    });
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert('error ' + textStatus + " " + errorThrown);  
                }
            });}
});
}
	



})()

if(document.getElementById('windsTagBall')) {
   $("#windsTagBall").windstagball({
            radius:120,
            speed:10
     });
    function agree(email,day,quesTitle){
            var params ={
                "email":email,
                "day":day,
                "quesTitle":quesTitle,
            };
            
            $.ajax({
                data: params,
                url: '/agree',
                type:'post',
                jsonpCallback: 'callback',
                success: function(data){
                    console.log('这是data');
                    console.log(data);
                    console.log('这是data');
                   
                  $('#agree'+email+day+quesTitle).html("赞 "+data);
                  
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert('error ' + textStatus + " " + errorThrown);  
                }
            });
            console.log(222);
        }
        function disagree(email,day,quesTitle){
            var params ={
                "email":email,
                "day":day,
                "quesTitle":quesTitle,
            };
            
            $.ajax({
                data: params,
                url: '/disagree',
                type:'post',
                jsonpCallback: 'callback',
                success: function(data){
                    console.log('这是data');
                    console.log(data);
                    console.log('这是data');
                   
                  $('#disagree'+email+day+quesTitle).html("踩 "+data);
                  
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert('error ' + textStatus + " " + errorThrown);  
                }
            });
            console.log(222);
        } 
}

(function(){
var page=document.getElementById('commentsLength').dataset.page;
var num=document.getElementById('commentsLength').dataset.num;
var length=document.getElementById('commentsLength').dataset.length;
function replyAction(pointer)
  {
    var that=pointer;
    var textarea=that.parentNode.parentNode.nextElementSibling.getElementsByTagName('textarea')[0];
    var str=that.getAttribute('data-fromName');
    textarea.value="回复 "+str+"：";
  } 
if(page) {
  for(var i=(page-1)*num;i<length;i++)
{

  $('#reply_'+i).bind('click',function(){
    var that=this;
    if (that.parentNode.parentNode.nextElementSibling.style.display=="block") 
    {
      that.parentNode.parentNode.nextElementSibling.style.display="none";
      that.parentNode.parentNode.nextElementSibling.firstElementChild.innerHTML="";
    }
    else
    {
        that.parentNode.parentNode.nextElementSibling.style.display="block";
        replyAction(that);
        var params={
            "email":that.getAttribute('data-name'),
            "day":that.getAttribute('data-day'),
            "quesTitle":that.getAttribute('data-questitle'),
            "commentId":that.getAttribute('data-commentid')
        };
        $.ajax({
          data:params,
          url:"/getReplyOfComment",
          type:'post',
          jsonpCallback: 'callback',
          success:function(data){
                    console.log('这是data');
                    console.log(data);
                    var fragment=document.createDocumentFragment(),
                        ul=that.parentNode.parentNode.nextElementSibling.firstElementChild; 
                    for(var i=0,leng=data.length;i<leng;i++)
                      {
                        li=document.createElement('li');
                        li.innerHTML=
                        "<div class='commentReplyFromNamePic'><a href='#'><img src='images/9.png'></a></div>"+
                        "<div  class='commentReplyFromName'><a href='#'>"+
                        data[i].commentReplyFromName+"</a>"+
                        " 回复 "+"<a href='#'>"+data[i].commentReplyToName+"</a>"+
                        "<span class='commTime'>"+data[i].time.minute+"</span>"+
                        "</div>"+
                        "<div class='commentReplyContent'>"+data[i].commentReplyContent+"</div>"+
                        "<a onclick=replyAction(this) class='replyAction action' data-fromName='"+data[i].commentReplyFromName+"'>回复</a>";
                        fragment.appendChild(li);
                      }; 
                    ul.appendChild(fragment);
                    console.log("这是data");
            },
          err:function(jqXHR, textStatus, errorThrown){
                  alert('error ' + textStatus + " " + errorThrown); 
              }
        });
    }

  });
  $('#comment_reply_btn_'+i).bind('click',function(){
      var that=this, 
          temp=that.previousElementSibling.value,
          indexstart=temp.indexOf(" "),
          indexend=temp.indexOf('：'),
          commentreplytoname=temp.substring(indexstart,indexend);
          commentReplyContent=temp.substring(indexend+1);
      var params={
        "email":that.getAttribute('data-name'),
        "day":that.getAttribute('data-day'),
        "quesTitle":that.getAttribute('data-questitle'),
        "commentReplyFromName":that.getAttribute('data-commentreplyfromname'),
        "commentReplyToName":commentreplytoname,
        "commentReplyContent":commentReplyContent,
        "commentId":that.getAttribute('data-commentid')
      };
      console.log(commentReplyContent);
      console.log(that.getAttribute('data-name'));
      console.log(that.getAttribute('data-day'));
      console.log(that.getAttribute('data-questitle'));
      console.log(that.getAttribute('data-commentreplyfromName'));
      console.log(that.getAttribute('data-commentreplytoName'));
      $.ajax({
        data:params,
        url:"/commentReply",
        type:'post',
        jsonpCallback: 'callback',
        success:function(data){
                console.log('这是data');
                console.log(data);
                var fragment=document.createDocumentFragment(),
                    ul=that.parentNode.parentNode.parentNode.previousElementSibling,
                    li=document.createElement('li');
                    li.innerHTML=
                    "<div class='commentReplyFromNamePic'><a href='#'><img src='images/9.png'></a></div>"+
                    "<div class='commentReplyFromName'><a href='#'>"+
                    data.commentReplyFromName+"</a>"+" 回复 "+
                    "<a href='#'>"+data.commentReplyToName+"</a>"+
                    "<span class='commTime'>"+data.time.minute+"</span>"+
                    "</div>"+
                    "<div class='commentReplyContent'>"+data.commentReplyContent+"</div>"+
                    "<a onclick=replyAction() class='replyAction action' data-fromName='"+data.commentReplyFromName+"'>回复</a>";
                fragment.appendChild(li);
                ul.appendChild(fragment);
                that.previousElementSibling.value="";
                console.log("这是data");
        },
        err:function(jqXHR, textStatus, errorThrown){
              alert('error ' + textStatus + " " + errorThrown);  
          }
      });
    });
   $('#commentAgree_'+i).bind("click",function(){
    var that=this;
    var params ={
                "email":that.getAttribute('data-name'),
                "day":that.getAttribute('data-day'),
                "quesTitle":that.getAttribute('data-questitle'),
                "commentId":that.getAttribute('data-commentid')
            };
         console.log(111);    
            $.ajax({
                data: params,
                url: '/commentAgree',
                type:'post',
                jsonpCallback: 'callback',
                success: function(data){
                  console.log('这是data');
                  console.log(data);
                  console.log('这是data');
                   
                 that.innerHTML="赞同 "+data;
                  
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert('error ' + textStatus + " " + errorThrown);  
                }
            });
            console.log(222);
   });
   $('#commentDisagree_'+i).bind("click",function(){
    var that=this;
     var params ={
                "email":that.getAttribute('data-name'),
                "day":that.getAttribute('data-day'),
                "quesTitle":that.getAttribute('data-questitle'),
                "commentId":that.getAttribute('data-commentid')
            };
         console.log(111);    
            $.ajax({
                data: params,
                url: '/commentDisagree',
                type:'post',
                jsonpCallback: 'callback',
                success: function(data){
                  console.log('这是data');
                  console.log(data);
                  console.log('这是data');
                   
                  that.innerHTML="反对 "+data;
                  
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert('error ' + textStatus + " " + errorThrown);  
                }
            });
            console.log(222);
   });
}  
}

})()
