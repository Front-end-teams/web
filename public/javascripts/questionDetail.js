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
            "name":that.getAttribute('data-name'),
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
                        li.innerHTML="<div class='commentReplyFromNamePic'><a href='#'><img src='images/9.png'></a></div>"+"<div  class='commentReplyFromName'><a href='#'>"+data[i].commentReplyFromName+"</a>"+" 回复 "+"<a href='#'>"+data[i].commentReplyToName+"</a>"+"<span class='time'>"+data[i].time.minute+"</span>"+"</div>"+"<div class='commentReplyContent'>"+data[i].commentReplyContent+"</div>"+
                        "<a onclick=replyAction(this) data-fromName='"+data[i].commentReplyFromName+"'>回复</a>";
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
        "name":that.getAttribute('data-name'),
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
                    li.innerHTML="<div class='commentReplyFromNamePic'><a href='#'><img src='images/9.png'></a></div>"+"<div class='commentReplyFromName'><a href='#'>"+data.commentReplyFromName+"</a>"+" 回复 "+"<a href='#'>"+data.commentReplyToName+"</a>"+"<span class='time'>"+data.time.minute+"</span>"+"</div>"+"<div class='commentReplyContent'>"+data.commentReplyContent+"</div>"+
                    "<a onclick=replyAction() data-fromName='"+data.commentReplyFromName+"'>回复</a>";
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
}