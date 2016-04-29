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
$('#submitQues').click(function(){
	var tags=[];
	var tagsSelected=$('.active');
	for(var i=0,leng=tagsSelected.length;i<leng;i++)
	{
	    tags.push(tagsSelected[i].innerText);
	}
	var params={
		quesTitle:$('#ques-Title').val(),
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
                	console.log('这是data');
                	console.log(data);
                	console.log('这是data');
                	document.getElementById('#callback').innerText=data;
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert('error ' + textStatus + " " + errorThrown);  
                }
            });
});

