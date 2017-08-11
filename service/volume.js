var exec = require('child_process').exec;

//调节声音大小
var Volume = {
	value: ['10%', '15%', '25%', '35%', '45%', '55%', '65%', '70%', '75%', '80%', '85%', '90%', '95%', '100%', '110%', '120%'],
	index: 0,
	init:() =>{
		exec("amixer cget numid=6,iface=MIXER,name='Speaker Playback Volume'", function (err, stdout, stderr) {
			if (err) {
				console.log(err);
				return;
			}
			try {
				stdout.match(/max=(\d+)/);
				Volume.index = Math.floor(parseInt(RegExp.$1) / 2);
				console.log('volume', Volume.index);
			} catch (ex) {

			}
		});
	},
	get: () => {		
		return Volume.value[Volume.index];
	},
	set: (volume_value) => {

		//外置小音响的音量处理
		exec("amixer set Speaker " + volume_value, function (err, stdout, stderr) {
			if (err) console.error('找不到设备1',err);
		});

		//系统自带的音量处理
		exec("amixer set PCM " + volume_value, function (err, stdout, stderr) {
			if (err) console.error('找不到设备2',err);
		});

		console.log('当前音量', Volume.get());
	},
	//减少音量
	minus: function () {
		Volume.index--;
		if (Volume.index < 0) {
			Volume.index = 0;
		}
		Volume.set(Volume.value[Volume.index]);
		return "减少音量";
	},
	//增加音量
	plus: function () {
		Volume.index++;
		if (Volume.index >= Volume.value.length) {
			Volume.index = Volume.value.length - 1;
		}
		Volume.set(Volume.value[Volume.index]);
		return "增加音量";
	}
}

Volume.init();

module.exports = Volume;
