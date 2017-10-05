let fs = require('fs');
let record = require('node-record-lpcm16');
let { Detector, Models } = require('snowboy');
const request = require('request');
var fetch = require('node-fetch');

process.on('uncaughtException', (err) => {

  voiceServer = new VoiceServer();

  console.error('全局错误信息：', err);
});


class VoiceServer {

  constructor() {
    this.recordFile = 'test.wav';
    this.recognitionFile = 'test1.wav';
    this.listen();
  }

  listen() {

    let models = new Models();
    models.add({ file: 'snowboy.umdl', sensitivity: '0.5', hotwords: 'snowboy' });

    const detector = new Detector({
      resource: "common.res",
      models: models,
      audioGain: 2.0
    });

    detector.on('error', () => {
      console.log('error')
    })

    detector.on('hotword', (index, hotword) => {
      console.log(hotword);
      if (hotword === 'snowboy') {
        record.stop();
        this.ding().then(() => {

          this.record().then(() => {

            this.dong().then(() => {
              //结束了
            })

          })

        })

      }
    });

    record.start({
      sampleRate: 16000,
      threshold: 0,
    }).pipe(detector);

    console.log('listening...');
  }

  //记录
  record() {
    console.log('speaking');

    return new Promise((resolve, reject) => {

      var file = fs.createWriteStream(this.recordFile, { encoding: 'binary' })
      record.start({
        sampleRate: 16000,
        threshold: 0,
      }).pipe(file);

      setTimeout(() => {
        console.log('speak end...');
        record.stop()
        resolve();
      }, 5000)

    })
  }

  ding() {
    return new Promise((resolve, reject) => {

      request.post({
        url: 'http://localhost:8888/audio', form: {
          key: "ding"
        }
      }, (err, httpResponse, body) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(body);
        resolve(body);
      });

    })
  }

  dong() {
    return new Promise((resolve, reject) => {

      request.post({
        url: 'http://localhost:8888/audio', form: {
          key: "dong"
        }
      }, (err, httpResponse, body) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(body);
        resolve(body);
      });

    })
  }


}

var voiceServer = new VoiceServer();