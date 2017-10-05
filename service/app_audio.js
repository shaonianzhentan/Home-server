var mpg = require('mpg123');
let fs = require('fs');

class Action {

    constructor(args) {
        this.wsend = args.wsend;
        this.recordFile = 'test.wav';
        this.recognitionFile = 'test1.wav';
    }
    //开始录音
    ding() {
        this.wsend({ type: 'music', result: 'pause', msg: '暂停' })
        setTimeout(() => {

            this.play(__dirname + '/' + "ding.mp3").then(() => {
                this.res.send('success')
            });

        }, 1000)
    }
    //结束录音
    dong() {
        if (fs.existsSync(this.recognitionFile)) fs.unlinkSync(this.recognitionFile);
        fs.linkSync(this.recordFile, this.recognitionFile)
        this.play(__dirname + '/' + "dong.mp3").then(() => {
            this.recognition().then(data => {
                var msg = data.result[0];
                console.log(msg);

                this.speak(msg).then(() => {
                    this.sendvoice(msg);
                    //this.close();
                }).catch(() => {
                    //this.close();
                })

            }).catch(err => {

                this.speak('对不起，我没有听清楚').then(() => {
                    //this.close();
                }).catch(() => {
                    //this.close();
                })

            })
        });

        this.res.send('success')
    }

    speak(msg) {
        var mp3Url = "http://tts.baidu.com/text2audio?idx=1&tex=" + encodeURIComponent(msg) + "&cuid=baidu_speech_demo&cod=2&lan=zh&ctp=1&pdt=1&spd=5&per=0&vol=5&pit=5"
        return this.play(mp3Url)
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

    action(req, res) {
        var obj = req.body;
        this.req = req;
        this.res = res;
        this.key = obj.key;
        this.value = obj.value;

        if ((typeof this[this.key]) === "function") {
            this[this.key]();
        } else {
            this.res.send('404');
        }
    }
}



module.exports = function (args) {
    return new Action(args);
}