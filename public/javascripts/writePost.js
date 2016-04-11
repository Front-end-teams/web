var tagsInput=document.getElementById("tags-input");
var commonShow=document.getElementById("common-tags");

var tagsDiv=document.getElementById("tags-div");
var tags=document.getElementById("tags");
var postTags=document.getElementById("post-tags");

var catesInput=document.getElementById("cates-input");

var commonCates=document.getElementById("common-cates");
var catesTable=document.getElementById("cates-table");

var submit=document.getElementById("submit");

// 给标签文本框添加事件 当获取焦点时 显示常用标签栏
EventUtil.addHandler(tagsInput,"focus",tagsShow);
function tagsShow(e){
	commonShow.style.display="block";

}
//点击除常用标签以外的其他文档元素 常用标签隐藏 并将input中输入的值改变样式
EventUtil.addHandler(document,"click",tagsHidden);
function tagsHidden(e){
	var flag=false;
	var target=e.target;
	
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
					span.className="tag-style";
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
	var e=EventUtil.getEvent();
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



// 给分类文本框添加事件 当获取焦点时 显示个人分类
EventUtil.addHandler(catesInput,"focus",catesShow);
function catesShow(e){
	commonCates.style.display="block";

}

var input_arr=[];
EventUtil.addHandler(catesTable,"click",function(e){
	var e=EventUtil.getEvent(e);
	var target=EventUtil.getTarget(e);
	var checkbox=document.forms[0].elements["cates"];
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
		
		var val=target.value;
		
		if(target.checked==true){	
			input_arr.push(val);
			

		}else{
			input_arr.splice(input_arr.indexOf(val),1);
		}
		
		catesInput.value=input_arr.join(",");

	}
	if(target.tagName.toLowerCase()=="td"){
		
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


EventUtil.addHandler(submit,"click",function(e){

	EventUtil.preventDefault(e);
	var form=document.forms[0];
	var result=seriPost(form);
	console.log(result);
	ajax("post","showPost.ejs",result,function(res){

	})

})
