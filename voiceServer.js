let fs = require('fs');
let record = require('node-record-lpcm16');
let { Detector, Models } = require('snowboy');
const request = require('request');
var mpg = require('mpg123');
var player = new mpg.MpgPlayer();

let models = new Models();
models.add({ file: '魔镜魔镜.pmdl', sensitivity: '0.5', hotwords: '魔镜魔镜' });

const detector = new Detector({
  resource: "common.res",
  models: models,
  audioGain: 2.0
});

detector.on('hotword', function (index, hotword) {
  console.log(hotword);
  if (hotword === '魔镜魔镜') {

    player.play('https://ai.baidu.com/aidemo?type=tns2&idx=1&tex=' +
      encodeURIComponent('你好啊')
      + '&cuid=baidu_speech_demo&cod=2&lan=zh&ctp=1&pdt=1&spd=5&per=4&vol=5&pit=5');

    //record.stop();

    /*
        var AipSpeech = require("baidu-ai").speech;    
        // 设置APPID/AK/SK
        var APP_ID = "你的 App ID";
        var API_KEY = "你的 Api ID";
        var SECRET_KEY = "你的 Secret Key";
        var client = new AipVoice(APP_ID, API_KEY, SECRET_KEY);
    
        let voice = fs.readFileSync('assets/voice/16k_test.pcm');
        let voiceBuffer = new Buffer(voice);
        // 识别本地文件 
        client.recognize(voiceBuffer, 'pcm', 16000).then(function (result) {
            console.log('<recognize>: ' + JSON.stringify(result));
        }, function(err) {
            console.log(err);
        });
    */


    /*
        request.post({
          url: 'http://localhost:8888/program', form: {
            key: "openvoice"
          }
        }, function (err, httpResponse, body) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(body);
        });
    
    */


    setTimeout(function () {
      console.log('reseting...');
    }, 30000);
  }
});

record.start({
  sampleRate: 16000,
  threshold: 0,
}).pipe(detector);

console.log('listening...');
//通知客户端已经准备好了
request.post({
  url: 'http://localhost:8888/program', form: {
    key: "readyvoice"
  }
}, function (err, httpResponse, body) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("readyvoice");
});
