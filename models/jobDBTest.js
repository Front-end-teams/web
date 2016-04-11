var jobHunting=require('./jobHunting');
jobHunting.getSpecial("",function(docs){
	console.log(docs);
});

  //"jobType": pattern1,//关键字成了RegExp了
    //     "workLocation":pattern2,
       //  'workTime':pattern3