'use strict';

var request = require('request'),
	fs = require('fs'),
	cheerio = require('cheerio');
/*
var db;	
function InitData(){
	var file = "home.db";

	var exists = fs.existsSync(file);

	var sqlite3 = require('sqlite3').verbose();
	db = new sqlite3.Database(file);
	db.get("select count(*) as c from Sqlite_master where type ='table' and name =?",['tbAlarm'],function(err, row) {
		  if(row.c==0) db.run("CREATE TABLE tbAlarm (id INTEGER PRIMARY KEY,time TEXT,voice TEXT,count integer)");
	});		
}

InitData();


module.exports={
		get:function(){
			var promise = new Promise( function (resolve, reject) {
				db.all("SELECT * FROM tbAlarm order by time asc",function(err, rows) {
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
		save:function(id,time,voice,count){
			//保存到数据库
			
				var promise = new Promise( function (resolve, reject) {
					
					db.serialize(function() {
						
						if(id==""){
							db.run("INSERT INTO tbAlarm(time,voice,count) VALUES(?,?,?)",[time,voice,count],function(err, row) {
									if(err){
										reject('fail');
									}else{
										resolve('success');
									}
							});	
						}else{
							db.run("update tbAlarm set time=?,voice=?,count=? where id=?",[time,voice,count,id],function(err, row) {
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
					db.run("delete from tbAlarm where id = ?",[id],function(err,row){
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
	*/


module.exports = {
	get: function () {
		var promise = new Promise(function (resolve, reject) {

		});
		return promise;
	},
	//添加
	save: function (id, time, voice, count) {
		//保存到数据库

		var promise = new Promise(function (resolve, reject) {


		});
		return promise;
	},
	//删除
	del: function (id) {
		var promise = new Promise(function (resolve, reject) {

		});
		return promise;
	}
}