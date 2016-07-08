(function(){
	var tags=document.getElementById('tags').getElementsByTagName('a');
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
	}    
}
  var editor=new wangEditor("content");
  editor.config.uploadImgUrl="/wangEditor"
  editor.config.uploadParams={
    token: "abcd",
    name: 'wang'
  }
  editor.create();
$('#pubQues').click(function(){
	var quesTitle=$('#ques_Title').val(),
	    content=$('#content').val();
	if (!quesTitle||!content){
		alert("内容不能为空哟~");
	}else if(count==0)
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


})()
