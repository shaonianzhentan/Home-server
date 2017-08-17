let fs = require('fs')
let record = require('node-record-lpcm16');
let {Detector, Models} = require('snowboy');
const request = require('request');

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
        record.stop()
        request.post({url: 'http://localhost:8888/program', form: {
		key:"openvoice"
            }
        }, function(err, httpResponse, body) {
            if (err) {
                console.log(err);
		return;
            }
	    console.log(body);
        });

/*
    let file = fs.createWriteStream('command.wav', { encoding: 'binary' })
	    record.stop()
	setTimeout(function() {
		record.start({
      sampleRate: 16000,
	threshold: 0,
	verbose: true
    }).pipe(file);
	}, 250)


	setTimeout(function() {
		record.stop()
console.log("stopped recording");
	}, 5000)
*/
  }
});

module.exports = {
	start:()=>{
		record.start({
		  sampleRate: 16000,
		  threshold: 0,
		}).pipe(detector);
	}
};
