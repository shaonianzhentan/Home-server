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
	db.get("select count(*) as c from Sqlite_master where type ='table' and name ='tbPicture'",function(err, row) {
		  if(row.c==0) db.run("CREATE TABLE tbPicture (id INTEGER PRIMARY KEY,uid integer,type TEXT,src TEXT,\
		  sortDate TIMESTAMP default (datetime('now', 'localtime'))   )");
	});		
}

InitData();


//图片管理
module.exports={
		get:function(uid){
			var promise = new Promise( function (resolve, reject) {
				
				db.all("SELECT * FROM tbPicture where uid = ? order by sortDate desc",[uid],function(err, rows) {
					  //console.log(rows);
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
		add:function(uid,type,src){
			
			
			var promise = new Promise( function (resolve, reject) {
				//保存到数据库
				db.serialize(function() {
					db.run("INSERT INTO tbPicture(uid,type,src) VALUES(?,?,?)",[uid,type,src],function(err,row){
						if(err){
							reject('fail');
						}else{
							resolve('success');
						}
						
					});
				});	
			});
			return promise;
		},
		//删除
		del:function(id){
			
			var promise = new Promise( function (resolve, reject) {
				db.serialize(function() {
					db.run("delete from tbPicture where id = ?",[id],function(err,row){
						if(err){
							reject('fail');
						}else{
							resolve('success');
						}
					});
				});
				
			});
			return promise;
		},
		//置顶
		top:function(id){

			
			var promise = new Promise( function (resolve, reject) {
				db.serialize(function() {
				db.run("update tbPicture set sortDate=datetime('now', 'localtime') where id = ?",[id],function(err,row){
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