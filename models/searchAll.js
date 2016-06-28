var mongodb = require('./db');
function searchAll(content){
	this.content=content;
}
module.exports = searchAll;

searchAll.searchAll=function(name,callback){

 mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 questions 集合
    db.collection('questions', function (err, collection) {
      if (err) {
        mongodb.close();

        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //使用 count 返回特定查询的文档数 total
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果

        // collection.find(query, {
        //   skip: 0,
        //   limit: 10
        // }).sort({
        //   time: -1
        // }).toArray(function (err, docs) {
        //   mongodb.close();
        //   if (err) {
        //     return callback(err);
        //   }
        //   //解析 markdown 为 html
        //   // docs.forEach(function (doc) {
        //   //   doc.question = markdown.toHTML(doc.question);
        //   // }); 

        //   callback(null, docs, total);
        // });
        collection.ensureIndex({"$**":"text"});
        collection.runCommand("text",{search:"zhao"});
    });
  });
};
