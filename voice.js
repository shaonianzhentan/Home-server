let fs = require('fs')
let record = require('node-record-lpcm16');
let {Detector, Models} = require('snowboy');
const request = require('request');

module.exports = {
	start:(cb)=>{
		console.log('listening...');
	try{
		let models = new Models();

		models.add({file: '魔镜魔镜.pmdl', sensitivity: '0.5', hotwords : '魔镜魔镜'});

		const detector = new Detector({
		  resource: "common.res",
		  models: models,
		  audioGain: 2.0
		});

		detector.on('hotword', function (index, hotword) {
		  console.log(hotword);
		  if(hotword === '魔镜魔镜') {
			record.stop();
			cb(record);
		  }
		});

		record.start({
		  sampleRate: 16000,
		  threshold: 0,
		}).pipe(detector);
}catch(ex){
   console.log(ex);
}
	}
};
