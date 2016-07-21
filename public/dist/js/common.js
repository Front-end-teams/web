var EventUtil={  
            //添加句柄  
            addHandler:function(elem,type,handler){  
                if (elem.addEventListener) {  
                    elem.addEventListener(type,handler,false);  
                } else if(elem.attachEvent){  
                    elem.attachEvent("on"+type,handler);  
                }else{  
                    elem["on"+type]=handler;  
                }  
            },  
            //删除句柄  
            removeHandler:function(elem,type,handler){  
                if (ele.removeEventListener) {  
                    elem.removeEventListener(type,handler,false);  
                } else if(elem.detachEvent){  
                    elem.detachEvent("on"+type,handler);  
                }else{  
                    elem["on"+type]=null;  
                }  
            },  
            //获取事件  
            getEvent:function(event){  
                return event?event:window.event;  
            },  
            getTarget:function(event){  
                return event.target||event.srcElement;  
            } ,
            //阻止事件的默认行为  
            preventDefault:function(event){  
                if(event.preventDefault){  
                    event.preventDefault();  
                }else{  
                    event.returnValue=false;  
                }  
            },  
            //阻止事件的冒泡  
            stopPropagation:function(event){  
                if(event.stopPropagation){  
                    event.stopPropagation();  
                }else{  
                    event.cannelBubble=true;  
                }  
            }  
        };  

// 创建一个序列化表单的函数
function seriPost(form){
	
	var parts=[],
	field=null,
	i,
	len,
	j,
	optLen,
	option,
	optValue,
	tags=[];

	var tagsDiv=document.getElementById("tags-div");
	if(tagsDiv){
		var span=tagsDiv.getElementsByTagName("span");
		for (var k = 0; k < span.length; k++) {
				parts.push("tags"+"="+encodeURIComponent(span[k].innerHTML));
		}
	}
	
	

	for (i = 0; i < form.elements.length; i++) {
		field=form.elements[i];
		switch(field.type){
			case "select-one": 
			case "select-multiple":
			if(field.name.length){
				for(j=0,optLen=field.options.length;j<optLen;j++){
					option=field.options[j];
					if(option.selected){
						optValue="";
						if(option.hasAttribute){
							optValue=(option.hasAttribute("value")?option.value:option.text);
						}else{
							optValue=(option.attributes["value"].specified?option.value:option.text);
						}
						parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(optValue));
					}

				}
			}
			break;

			case undefined:
			
			case "reset":
			case "button":
			case "file":
			break;
			case "radio":
			case "checkbox":
			if(!field.checked){
				break;
			}
			default:
			if(field.name.length){
				parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(field.value));
			}
		}
	}
	return parts;
}
function createXHR(){
		if(typeof XMLHttpRequest!="undefined"){
			return new XMLHttpRequest();
		}else if(typeof ActiveXObject!="undefined"){
			if(typeof arguments.callee.activeXString!="string"){
				var versions=[
					"MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"
				],
				i,len;
				for ( i = 0,len=versions.length; i < len; i++) {
					try{
						new ActiveXObject(versions[i]);
						arguments.callee.activeXString=versions[i];
						break;
					}catch(ex){

					}
				}
			}
			return new ActiveXObject(arguments.callee.activeXString);
		}else{
			throw new Error("no XHR Object available");
		}

	}

	var ajax=function(met,url,head,mes,callback){
		var xhr=createXHR();
		xhr.onreadystatechange=function(){
			if(xhr.readyState==1){
				//console.log("writing");
			}
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
					callback(xhr.responseText);
				
				}else{
					console.log(xhr.responseText);
					console.log("request was unsuccessful:"+xhr.status);
				}
			}
		}
		xhr.open(met,url,true);
		if(head){
			xhr.setRequestHeader("Content-Type",head);
		}

		//xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(mes);

	}