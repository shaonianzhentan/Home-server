const request = require('request')
    , { exec } = require('child_process');

const os = require('os');

module.exports = {
    init: (obj) => {
        res = obj.res;
        wsend = obj.wsend;
        value = obj.value;
        OS_STATUS = obj.OS_STATUS;
    },
    //设置状态
    setStatus: () => {
        for (var k in value) {
            OS_STATUS[k] = value[k];
        }
        res.send('success');
    },
    //获取状态
    status: () => {
        OS_STATUS.ServerTime = (new Date()).toLocaleString()
        if (res) res.json(OS_STATUS);
    },
    //增加声音
    vol_up: () => {
        os.setVolume(1).then(data => {

        })
        res.send('增加声音');
    },
    //减少声音
    vol_down: () => {
        os.setVolume(0).then(data => {

        })
        res.send('减少声音');
    },
    //校准时间
    date: () => {
        exec("sudo ntpd -s -d", function (err, stdout, stderr) { });
        res.send('success');
    },
    //重启
    reboot: () => {
        exec("sudo reboot", function (err, stdout, stderr) { });
        res.send('success');
    },
    //关机
    shutdown: () => {
        exec("sudo halt", function (err, stdout, stderr) { });
        res.send('success');
    },
    //红外线
    infrared: () => {
        OS_STATUS.infraredSwitch = value;
        res.send('success');
    },
    //重启程序
    reset: () => {
        exec("pm2 restart electron", function (err, stdout, stderr) {
            console.log(stdout);
        });
        res.send('success');
    },
    //重启服务
    reset_service: () => {
        exec("pm2 restart app", function (err, stdout, stderr) {
            console.log(stdout);
        });
        res.send('success');
    },
    //拍照
    picture: () => {
        var filename = 'zhaopian.jpg';
        exec("raspistill -o " + filename + " -q 5", function (err, stdout, stderr) {
            //var imageBuf = fs.readFileSync(filename);
            request.post({
                url: 'http://23.105.217.23:8081/jiluxinqingupload', formData: {
                    jiluxinqing: fs.createReadStream(filename),
                }
            }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    res.send(err);
                }
                res.send(body);
            });

            //res.send(imageBuf.toString("base64"));
        });
    }
}
