/*---------------------实现图片的压缩----------------------------------*/
//获取图片数据
 function imgData(e,maxWidth,maxHeight,callback) {
    
    
    var target = EventUtil.getTarget(e);
    /*var maxsize =50 * 1024;*/
    console.log(target);
        if (!target.files.length) return;

        var files = Array.prototype.slice.call(target.files);

        files.forEach(function (file, i) {
            if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
            //创建FileReader()对象，使用FileReader对象,web应用程序可以异步的读取存储在用户计算机上的文件(或者原始数据缓冲)内容,可以使用File对象或者Blob对象来指定所要处理的文件或数据
            var reader = new FileReader();


           /* var li = document.createElement("li");
            li.innerHTML = '<div class="progress"><span></span></div>';
            $(".img-list").append($(li));*/
            //文件读取完成时触发
            reader.onload = function () {
                //如果读取失败，则 result 的值为 null ，否则即是读取的结果，绝大多数的程序都会在成功读取文件的时候，抓取这个值。
                var result = this.result;
                var img = new Image();
                img.src = result;

                //如果图片大小小于200kb，则直接上传
                /*if (result.length <= maxsize) {
                    //$(li).css("background-image", "url(" + result + ")");
                    img = null;
                    //直接上传
                    callback(result);
                    return;
                }*/

                //图片加载完毕之后进行压缩，然后上传
                if (img.complete) {
                   compress(img,maxWidth,maxHeight,callback);
                   
                } else {
                    img.onload = compress(img,maxWidth,maxHeight,callback);
                }

                function compress(Img, maxWidth, maxHeight,callback) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var tCanvas = document.createElement("canvas");
        var tctx = tCanvas.getContext("2d");
        var initSize = Img.src.length;

         if (Img.width>maxWidth || Img.height>maxHeight) {
                var bili = Math.max(Img.width/maxWidth, Img.height/maxHeight);
                canvas.width = Img.width/bili;
                canvas.height = Img.height/bili;
            }else{
                canvas.width = Img.width;
                canvas.height = Img.height;
            }
            //如果图片像素大于100万则使用瓦片绘制
            var count;
            if ((count = Img.width * Img.height / 1000000) > 1) {
                count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

                //计算每块瓦片的宽和高
                var nw = ~~(Img.width / count);//取整
                var nh = ~~(Img.height / count);

                tCanvas.width = nw;
                tCanvas.height = nh;

                for (var i = 0; i < count; i++) {
                    for (var j = 0; j < count; j++) {
                        tctx.drawImage(Img, i * nw * bili, j * nh * bili, nw * bili, nh * bili, 0, 0, nw, nh);

                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                    }
                }
            } else {
                ctx.drawImage(Img, 0, 0, Img.width,Img.height);
            }
            ctx.drawImage(Img, 0, 0, Img.width, Img.height, 0, 0, canvas.width, canvas.height);

        //进行最小压缩
        //对图像数据做出修改以后，可以使用toDataURL方法，将Canvas数据重新转化成一般的图像文件形式
        //在Data URL协议中，图片被转换成base64编码的字符串形式，并存储在URL中，冠以mime-type
        //第二个参数的值在0-1之间，则表示JPEG的质量等级，否则使用浏览器内置默认质量等级
        var ndata = canvas.toDataURL('image/jpeg', 0.7);

        console.log('压缩前：' + initSize);
        console.log('压缩后：' + ndata.length);
        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

        callback(ndata,file.type);
    }

            };
            //该方法将文件读取为一段以 data: 开头的字符串，这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html 等格式的文件。
            reader.readAsDataURL(file);
        })

     

    };

   

   /* // 图片上传，将base64的图片转成二进制对象，塞进formdata上传
    function upload(basestr, type, $li) {
        //Window.atob() 函数用来解码一个已经被base-64编码过的数据。
        var text = window.atob(basestr.split(",")[1]);
        var buffer = new ArrayBuffer(text.length);
        var ubuffer = new Uint8Array(buffer);
        var pecent = 0 , loop = null;

        for (var i = 0; i < text.length; i++) {
            ubuffer[i] = text.charCodeAt(i);
        }

        var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var blob;

        if (Builder) {
            var builder = new Builder();
            builder.append(buffer);
            blob = builder.getBlob(type);
        } else {
            blob = new window.Blob([buffer], {type: type});
        }

        var xhr = new XMLHttpRequest();
        var formdata = new FormData();
        formdata.append('imagefile', blob);

        xhr.open('post', '/cupload');

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('上传成功：' + xhr.responseText);

                clearInterval(loop);

                //当收到该消息时上传完毕
                $li.find(".progress span").animate({'width': "100%"}, pecent < 95 ? 200 : 0, function () {
                    $(this).html("上传成功");
                });

                $(".pic-list").append('<a href="' + xhr.responseText + '">' + xhr.responseText + '<img src="' + xhr.responseText + '" /></a>')
            }
        };

        //数据发送进度，前50%展示该进度
        xhr.upload.addEventListener('progress', function (e) {
            if (loop) return;

            pecent = ~~(100 * e.loaded / e.total) / 2;
            $li.find(".progress span").css('width', pecent + "%");

            if (pecent == 50) {
                mockProgress();
            }
        }, false);

        //数据后50%用模拟进度
        function mockProgress() {
            if (loop) return;

            loop = setInterval(function () {
                pecent++;
                $li.find(".progress span").css('width', pecent + "%");

                if (pecent == 99) {
                    clearInterval(loop);
                }
            }, 100)
        }

        xhr.send(formdata);
    }*/

   