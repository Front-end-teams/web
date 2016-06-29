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