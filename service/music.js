'use strict';

var request = require('request'),
	fs = require('fs'),	
	cheerio = require('cheerio');

var db;	
function InitData(){
	var file = "home.db";

	var exists = fs.existsSync(file);

	var sqlite3 = require('sqlite3').verbose();
	db = new sqlite3.Database(file);
	db.get("select count(*) as c from Sqlite_master where type ='table' and name =?",['tbMusicList'],function(err, row) {
		  if(row.c==0) db.run("CREATE TABLE tbMusicList (id INTEGER PRIMARY KEY,type TEXT,link TEXT,title TEXT,sortDate TIMESTAMP default (datetime('now', 'localtime')) )");
	});		
}

InitData();


module.exports={
		get:function(){
			var promise = new Promise( function (resolve, reject) {
				db.all("SELECT * FROM tbMusicList order by sortDate desc",function(err, rows) {
					  if(err){
						reject(err);
						return;						
					  }					  
					  resolve(rows);
				});				
			});
			return promise;
		},
		//添加
		save:function(id,type,link,title){
			//保存到数据库
			
				var promise = new Promise( function (resolve, reject) {
					
					db.serialize(function() {
						
						if(id==""){
							db.run("INSERT INTO tbMusicList(type,link,title) VALUES(?,?,?)",[type,link,title],function(err, row) {
									if(err){
										reject('fail');
									}else{
										resolve('success');
									}
							});	
						}else{
							db.run("update tbMusicList set type=?,link=?,title=? where id=?",[type,link,title,id],function(err, row) {
									if(err){
										reject('fail');
									}else{
										resolve('success');
									}
							});
						}
				
			});
					
			
			});
			return promise;
		},
		//删除
		del:function(id){
			var promise = new Promise( function (resolve, reject) {
				db.serialize(function() {
					db.run("delete from tbMusicList where id = ?",[id],function(err,row){
						if(err){
							reject('fail');
						}else{
							resolve('success');
						}
					});
				});
			});
			return promise;
		}

}