var exec = require('child_process').exec;
const PythonShell = require('python-shell');

//获取本机IP地址
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

var ip = getIPAdress();
//语音服务开启状态
var VoiceServerRunStatus = true;

module.exports = {
    ip: ip,
    getcpu: () => {
        return new Promise(function (resolve, reject) {
            PythonShell.run('../sensor/sensor-os.py', function (err, results) {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    var obj = JSON.parse(results[0]);
                    resolve(obj);
                } catch (ex) {
                    reject(ex);
                }
                console.log('results: %j', results);
            });
        });
    },
    getTemperature: () => {
        return new Promise(function (resolve, reject) {
            PythonShell.run('../sensor/sensor-temperature.py', function (err, results) {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    var obj = JSON.parse(results[0]);
                    console.log("温度", obj.temperature);
                    console.log("湿度", obj.humidity);

                    resolve(obj);
                } catch (ex) {
                    reject(ex);
                }
                console.log('results: %j', results);
            });
        });
    },
    //设置声音
    setVolume: (type) => {
        return new Promise(function (resolve, reject) {
            //获取当前声音大小
            exec("amixer cget numid=6,iface=MIXER,name='Speaker Playback Volume'", function (err, stdout, stderr) {
                if (err) {
                    reject(err);
                    return;
                }
                try {

                    /*numid=6,iface=MIXER,name='Speaker Playback Volume'
  ; type=INTEGER,access=rw---R--,values=2,min=0,max=30,step=0
  : values=3,3
  | dBminmax-min=-45.00dB,max=0.00dB
 */
                    var min = 0;
                    var max = parseInt(stdout.match(/max=(\d+)/)[1]);
                    var volume_value = parseInt(stdout.match(/values=\d+,(\d+)/)[1]);
                    console.log(max, volume_value);
                    if (type == 1) {
                        //增加声音  
                        volume_value += 3;
                        if (volume_value >= max) volume_value = max;
                    } else {
                        //减少声音
                        volume_value -= 3;
                        if (volume_value < 3) volume_value = 3;
                    }

                    //外置小音响的音量处理
                    exec("amixer set Speaker " + volume_value, function (err, stdout, stderr) {
                        if (err) console.error('找不到设备1', err);
                    });

                    //系统自带的音量处理
                    exec("amixer set PCM " + volume_value, function (err, stdout, stderr) {
                        if (err) console.error('找不到设备2', err);
                    });

                    resolve({
                        min: 0,
                        max: max,
                        value: volume_value
                    });
                    /*
                    Volume.index = Math.floor(parseInt(RegExp.$1) / 2);                    
                    */
                } catch (ex) {
                    reject(err);
                }
            });
        });
    },
    /*************************************以下方法有依赖项目，特定环境下才能运行************************************* */
    StartVoiceServer: () => {
        if (VoiceServerRunStatus == false) return;
        VoiceServerRunStatus = false;
        exec("pm2 restart voiceServer", function (err, stdout, stderr) {
            console.log('reset complate');
            VoiceServerRunStatus = true;
        });
        console.log('reset VoiceServer...');
    }
}