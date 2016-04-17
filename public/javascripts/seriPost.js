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
	var span=tagsDiv.getElementsByTagName("span");
	for (var k = 0; k < span.length; k++) {
				parts.push("tags"+"="+encodeURIComponent(span[k].innerHTML));
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