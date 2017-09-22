let fs = require('fs');
let record = require('node-record-lpcm16');
let { Detector, Models } = require('snowboy');
const request = require('request');
var mpg = require('mpg123');
var fetch = require('node-fetch');

process.on('uncaughtException', (err) => {

  voiceSErver = new VoiceServer();

  console.error('全局错误信息：', err);
});


class VoiceServer {

  constructor() {
    this.player = null;
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

        this.stop().then(() => {
          this.ding().then(() => {
            this.record().then(() => {

              this.dong().then(() => {

                this.recognition().then(data => {

                  var msg = data.result[0];
                  console.log(data.result[0]);

                  this.speak(msg).then(() => {
                    this.sendvoice(msg);
                    this.close();
                  }).catch(() => {
                    this.close();
                  })

                  /*
                  this.robot(data.result[0]).then(data => {
  
  
                    this.play(data).then(() => {
  
  
                      this.listen();
  
                    })
  
                  })
                  */

                }).catch(err => {

                  this.speak('对不起，我没有听清楚').then(() => {
                    this.close();
                  }).catch(() => {
                    this.close();
                  })

                })
              });

            });

          }).catch((err) => {
            console.log('出现错误', err)
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

  ding() {
    return this.play(__dirname + '/' + "ding.mp3");
  }

  dong() {
    if (fs.existsSync(this.recognitionFile)) fs.unlinkSync(this.recognitionFile);
    fs.linkSync(this.recordFile, this.recognitionFile)
    return this.play(__dirname + '/' + "dong.mp3");
  }

  speak(msg) {
    var mp3Url = "http://tts.baidu.com/text2audio?idx=1&tex=" + encodeURIComponent(msg) + "&cuid=baidu_speech_demo&cod=2&lan=zh&ctp=1&pdt=1&spd=5&per=0&vol=5&pit=5"

    return this.play(mp3Url)
  }
  //播放
  play(mp3Url) {
    return new Promise((resolve, reject) => {

      if (this.player) {
        this.player.close();
      }

      this.player = new mpg.MpgPlayer();
      this.player.play(mp3Url);
      this.player.on('end', function (data) {
        console.log('play end');
        resolve();
      })
      this.player.on('error', function (data) {
        reject(data);
      })
    })
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

  //识别结果
  recognition() {
    console.log('recogintion...');
    return new Promise((resolve, reject) => {

      var AipSpeech = require("baidu-ai").speech;
      // 设置APPID/AK/SK
      var APP_ID = "8710852";
      var API_KEY = "OZPUQYgZwwUKyzfLrCRv0Iyp";
      var SECRET_KEY = "46ff3de5f40a8289cffa1e8feefdbb4d";
      var client = new AipSpeech(APP_ID, API_KEY, SECRET_KEY);

      let voice = fs.readFileSync(this.recognitionFile);
      let voiceBuffer = new Buffer(voice);
      // 识别本地文件 
      client.recognize(voiceBuffer, 'wav', 16000).then(function (result) {
        resolve(result);
        console.log('<recognize>: ' + JSON.stringify(result));
      }, function (err) {
        reject(err);
        console.log(err);
      });

    })

  }

  //机器人
  robot(msg) {
    return new Promise((resolve, reject) => {
      fetch('http://www.tuling123.com/openapi/api', {
        method: "POST",
        headers: {
          'Content-Type': 'x-www-form-urlencoded;charset=utf-8'
        },
        body: JSON.stringify({
          key: 'b1a4b4c8964b4d0b82dd013acef45f33',
          info: encodeURIComponent(msg),
          userid: '9527'
        })
      }).then((res) => {
        res.json().then((data) => {
          //console.log(data);
          resolve(data.text);
        })
      }).catch((ex) => {
        reject(ex);
      });
    })
  }

  stop() {
    return new Promise((resolve, reject) => {

      request.post({
        url: 'http://localhost:8888/music', form: {
          key: "pause"
        }
      }, (err, httpResponse, body) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(body);
        setTimeout(() => {
          resolve(body);
        }, 1000)
      });

    })
  }

  sendvoice(msg) {

    request.post({
      url: 'http://localhost:8888/program', form: {
        key: "sendvoice",
        value: msg
      }
    }, function (err, httpResponse, body) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(body);
    });
  }

  close() {

    this.player.close();

    console.log('close....');
    voiceServer = new VoiceServer();
  }
}

var voiceServer = new VoiceServer();