var exec = require('child_process').exec;

//调节声音大小
var Volume={
	value:['10%','15%','25%','35%','45%','55%','65%','70%','75%','80%','85%','90%','95%','100%','110%','120%'],
	index:0,
	get:()=>{
		return Volume.value[Volume.index];
	},
	set:()=>{
		
		exec("amixer set Speaker " + Volume.value[Volume.index],function(err, stdout, stderr){
			if(err) console.log(err);
		});
		
		console.log('当前音量',  Volume.value[Volume.index]);
		/*
		exec("amixer set PCM " + Volume.value[Volume.index],function(err, stdout, stderr){
			if(err) console.log(err);
		});
		*/
	},
	minus:function(){
		Volume.index--;
		if(Volume.index < 0){
		   Volume.index = 0;		  
		}
		Volume.set();
		return "减少音量";
	},
	plus:function(){
		Volume.index++;
		if(Volume.index >= Volume.value.length) {
			Volume.index = Volume.value.length - 1;		
		}
		Volume.set();
		return "增加音量";
	}
}

module.exports = Volume;


exec("amixer cget numid=6,iface=MIXER,name='Speaker Playback Volume'",function(err, stdout, stderr){
		if(err){ 
			console.log(err);
			return;
		}
		try{
			stdout.match(/max=(\d+)/);
			Volume.index = Math.floor(parseInt(RegExp.$1)/2);
		    console.log('volume', Volume.index);
		}catch(ex){
			
		}
	});
