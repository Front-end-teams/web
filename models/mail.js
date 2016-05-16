/*
* @Author: Administrator
* @Date:   2016-05-13 22:10:01
* @Last Modified by:   Administrator
* @Last Modified time: 2016-05-15 12:27:22
*/

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 25,
    auth: {
        user: 'wy_zhou@163.com',
    	pass: '13959960865'
    }
});

var mailOptions = {
    from: 'zhou <wy_zhou@163.com> ', // sender address
    to: '1013717388@qq.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
         console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});