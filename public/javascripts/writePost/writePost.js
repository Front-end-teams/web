(function(){
var tagsInput=document.getElementById("tags-input");
var commonShow=document.getElementById("common-tags");

var tagsDiv=document.getElementById("tags-div");
var tags=document.getElementById("tags");
var postTags=document.getElementById("post-tags");

var catesInput=document.getElementById("cates-input");

var commonCates=document.getElementById("common-cates");
var catesTable=document.getElementById("cates-table");
var upload=document.getElementById("upload");




// 给标签文本框添加事件 当获取焦点时 显示常用标签栏
EventUtil.addHandler(tagsInput,"focus",tagsShow);
function tagsShow(){
	commonShow.style.display="block";

}
//点击除常用标签以外的其他文档元素 常用标签隐藏 并将input中输入的值改变样式
EventUtil.addHandler(document,"click",tagsHidden);
function tagsHidden(e){
	var flag=false;
	var e=EventUtil.getEvent(e);
	var target=EventUtil.getTarget(e);

		while(target){
			
			if(target!= postTags){
				target=target.parentNode;
				}else{
					flag=true;
					break;
				}
			}
			if(!flag){
				commonShow.style.display="none";
				//将input中的输入元素加入到div中
				var value=tagsInput.value;
				var arr_val=value.split(",");
				var fragment=document.createDocumentFragment();
				if(value){
					for (var i = 0; i < arr_val.length; i++) {
						var span=document.createElement("span");
						span.className="tag-style ";
						span.backgroundColor="#EEEB7E";
						span.innerHTML=arr_val[i];
						fragment.appendChild(span);
					}
				tagsInput.value="";
				tagsDiv.appendChild(fragment);

				var divWidth=tagsDiv.offsetWidth;
				tagsInput.style.paddingLeft=divWidth+5+"px";
				}
			}
		}

			
		

	//事件代理 给常用标签所在的tr添加点击事件给常用标签添加事件 
	EventUtil.addHandler(tags,"click",writeTags);
	function writeTags(e){
		var e=EventUtil.getEvent(e);
		var target=EventUtil.getTarget(e);
		// 当点击span标签时 文本框中出现该标签
		if(target.tagName.toLowerCase()=="span"){
		
			showTags(target);
		}
	}


	//点击常用标签 将常用标签显示到输入框的功能实现
	function showTags(target){
		var tags_length=tagsNum();
		var ele=null;
		var span=tagsDiv.getElementsByTagName("span");
		for (var i = 0; i < span.length; i++) {

			if(span[i].innerHTML==target.innerHTML){
				ele=span[i];
				
				break;
			}
		}
		//当该标签存在时 点击该标签删除
		if(ele){
			target.style.backgroundColor="";
			tagsDiv.removeChild(ele);

		}else if(tags_length){
			//判断标签的个数 当个数小于5时 添加节点
			target.style.backgroundColor="#EEEB7E";
			//先克隆节点 再将节点插入到相应的元素中
			var tar_ele=target.cloneNode(true);
			tagsDiv.appendChild(tar_ele);
		}
		var divWidth=tagsDiv.offsetWidth;
		tagsInput.style.paddingLeft=divWidth+5+"px";
	}

	//定义标签输入时按下按键时的操作
	EventUtil.addHandler(tagsInput,"keydown",delTags);
	function delTags(e){
		var e=EventUtil.getEvent(e);
		var tags_num=tagsNum();
		//当按下backspace键时 删除标签
		if(e.keyCode==8&&tagsInput.value==""){
			tagsDiv.removeChild(tagsDiv.lastChild);
			var divWidth=tagsDiv.offsetWidth;
			tagsInput.style.paddingLeft=divWidth+5+"px";
		}
		//当标签数达到上限时，给出提醒
		if(tags_num===false){
			alert('标签数已达上限');
		}
	}
	//定义点击div中的span元素 删除span元素的事件
	EventUtil.addHandler(tagsDiv,"click",function(e){
		var e=EventUtil.getEvent(e);
		var target=EventUtil.getTarget(e);
		if(target.tagName.toLowerCase()=="span"){
			tagsDiv.removeChild(target);
		}
	})


	// 给分类文本框添加事件 当获取焦点时 显示个人分类
	EventUtil.addHandler(catesInput,"focus",catesShow);
	function catesShow(){
		commonCates.style.display="block";

	}

	var input_arr=[];
	EventUtil.addHandler(catesTable,"click",function(e){

		console.log(editor.value);
		var e=EventUtil.getEvent(e);
		var target=EventUtil.getTarget(e);
		
		var checkbox=document.getElementById("form-article").elements["cates"];
		
		var flag=false;
		for(var i=0;i<checkbox.length;i++){
			if(target==checkbox[i]){
				flag=true;
			}
		}
		//如果是复选框 执行下列操作
		if(flag){
			
			if(input_arr.length>0){

				input_arr=catesInput.value.split(",");
			}
			console.log(input_arr);
			for(var i = 0; i < input_arr.length; i++){
				if(!input_arr[i].trim()){
					input_arr.splice(i,1);
				}
			
			}
			
			var val=target.value;
			
			if(target.checked==true){	
				input_arr.push(val);
				

			}else{
				input_arr.splice(input_arr.indexOf(val),1);
			}
			
			catesInput.value=input_arr.join(",");
			console.log(catesInput.value);

		}

	})

	function tagsNum(){
		var span=tagsDiv.getElementsByTagName("span");
		var value=tagsInput.value;
		var arr_val=value.split(",");
		var total=span.length+arr_val.length;
		if(total>5){
			return false;
		}else{
			return true;
		}
	}


	if(document.getElementById("submit")){


	var submit = document.getElementById("submit");
	EventUtil.addHandler(submit,"click",function(e){
		var e = EventUtil.getEvent(e);
		EventUtil.preventDefault(e);
		EventUtil.stopPropagation(e);
		var form = document.getElementById("form-article");
		var result = seriPost(form);
		var sendResult = {}
		console.log(result);



		var postCont=document.getElementById("pop-cont");
	


		for(var i = 0; i < result.length; i++){
			var val = result[i].split("=");
			sendResult[val[0]] = val[1];
			
		}
		console.log(decodeURIComponent(sendResult.post));
	
		

		ajax("post","/upload1","application/json",JSON.stringify(sendResult),function(res){
			console.log(res);
			
			var pop2 = document.querySelector('.p2');
			
			var p2 = Popuper({
			    wrap: pop2,
			    type: 'success',
			    confirm: function() {
			    		//继续写博客
			        //window.location="localhost:3008/showPost?author="+author;
			    },
			    cancel: function() {
			    	//查看博客
			        var cancel=document.querySelector(".cancel");
			        cancel.setAttribute("href","/detail/"+ JSON.parse(res).author+'/'+form.elements["title"].value);
			    }

			}).edit({

			    title: '提示',
			    content: '文章上传成功'

			}).show();

			p2.toggle().edit({
	        type: 'info'
	    });
		})

	})
}
if(document.getElementById('save')){
	var save = document.getElementById('save');
	EventUtil.addHandler(save,"click",function(e){
		var e = EventUtil.getEvent(e);
		EventUtil.preventDefault(e);
		EventUtil.stopPropagation(e);
		var form = document.getElementById("form-article");
		var result = seriPost(form);
		var sendResult = {}
		console.log(result);

		var postCont=document.getElementById("pop-cont");

		for(var i = 0; i < result.length; i++){
			var val = result[i].split("=");
			sendResult[val[0]] = val[1];

		}
		console.log(sendResult);
		
		ajax("post","/post/update","application/json",JSON.stringify(sendResult),function(res){
			console.log(res);
			
			var pop2 = document.querySelector('.p2');
			
			var p2 = Popuper({
			    wrap: pop2,
			    type: 'success',
			    confirm: function() {
			    		//继续写博客
			        //window.location="localhost:3008/showPost?author="+author;
			    },
			    cancel: function() {
			    	//查看博客
			        var cancel=document.querySelector(".cancel");
			        cancel.setAttribute("href","/detail/"+ JSON.parse(res).author+'/'+form.elements["title"].value);
			    }

			}).edit({

			    title: '提示',
			    content: '文章保存成功'

			}).show();

			p2.toggle().edit({
	        type: 'info'
	    });
		})

	})

}

})();
