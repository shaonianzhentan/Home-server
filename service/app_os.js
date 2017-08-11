
var res = null, wsend = null, OS_STATUS = null;

module.exports = {
    init: (_res, _wsend, _args) => {
        res = _res;
        wsend = _wsend;
        OS_STATUS = _args;
    },
    //获取状态
    status: () => {
        wsend({ type: 'program', result: 'status', msg: OS_STATUS })
        OS_STATUS.ServerTime = (new Date()).toLocaleString()
        //OS_STATUS.volume = Volume.get();
        if (res) res.json(OS_STATUS);
    },
    //传感器数据
    sensor: () => {
        for (var k in obj.value) {
            OS_STATUS['sensor_' + k] = obj.value[k];
        }
        res.send('success');
    },
    //增加声音
    vol_up: () => {
        res.send(Volume.plus());
    },
    //减少声音
    vol_down: () => {
        res.send(Volume.minus());
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
        OS_STATUS.infraredSwitch = obj.value;
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
