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
        }  
