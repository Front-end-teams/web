var mongodb = require('./db');

var getCity = function( province,callback){
	mongodb.open(function(err,db){
    if(err){
      console.log("open error");
      return callback(err);
    }
      db.collection("prov",function(err,collection){
      	if (err) {
	        mongodb.close();
	        console.log(err);
	        return callback(err);
	      }
      	collection.findOne({"prov":province},{"city.city_name":1},function(err,city){
        	mongodb.close();
        	if(err){
        		console.log(err);
          	return callback(err);
        	}
      
        callback(null,city);
      })
      //console.log("dddd");
    })
    })
}
var getArea = function(query,callback){
	mongodb.open(function(err,db){
    if(err){
      console.log("open error");
      return callback(err);
    }
      db.collection("city",function(err,collection){
      	if (err) {
	        mongodb.close();
	        console.log(err);
	        return callback(err);
	      }
      	collection.findOne({"prov":query.province},{"city.city_name":'1',"city.county_name":1},function(err,area){
        	mongodb.close();
        	if(err){
        		console.log(err);
          	return callback(err);
        	}
          
          var re_area = area.city.filter(function(item,index,array){
            console.log(item);
            return (item.city_name == query.city);
          })


          callback(null,re_area);
      })
      //console.log("dddd");
    })
    })
}
module.exports = {
	getCity:getCity,
	getArea:getArea
}