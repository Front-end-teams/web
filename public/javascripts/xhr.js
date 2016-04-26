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

	/**
	 * ajax请求的方法
	 * @param  {string}   met      发送请求的类型 值为'post'或‘get’等ajax能接受的请求类型
	 * @param  {string}   url      请求的url
	 * @param  {string}   head     请求头的设置
	 * @param  {string/json/formdata}   mes      发送请求时的请求信息
	 * @param  {Function} callback 请求成功之后需要调用的回调函数
	 * @return 处理请求后的结果
	 */		


	var ajax=function(met,url,head,mes,callback){

		var xhr=createXHR();
		xhr.onreadystatechange=function(){
			if(xhr.readyState==1){
				console.log("writing");
			}
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
					callback(xhr.responseText);
				
				}else{
					console.log("request was unsuccessful:"+xhr.status);
				}
			}
		}
		xhr.open(met,url,false);
		if(head){
			xhr.setRequestHeader("Content-Type",head);
		}
		xhr.send(mes);

	}