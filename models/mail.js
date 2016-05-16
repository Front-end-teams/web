/*
* @Author: Administrator
* @Date:   2016-05-13 22:10:01
* @Last Modified by:   Administrator
* @Last Modified time: 2016-05-16 21:27:22
*/

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 
    port: 25,
    auth: {
        user: 
    	pass: 
    }
});

var mailOptions = {
    from: '', // sender address
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