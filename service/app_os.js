const request = require('request')
    , { exec } = require('child_process');
const os = require('./os.js');

class Action {

    constructor(args) {
        this.wsend = args.wsend;
        this.OS_STATUS = args.OS_STATUS;
    }

    //设置状态
    setStatus() {
        for (var k in this.value) {
            this.OS_STATUS[k] = this.value[k];
        }
        this.res.json(this.OS_STATUS);
    }
    //获取状态
    status() {
        this.OS_STATUS.ServerTime = (new Date()).toLocaleString()
        this.res.json(this.OS_STATUS);
    }
    //增加声音
    vol_up() {
        os.setVolume(1).then(data => {
            this.OS_STATUS.volume = data.value;
            this.res.json(data);
        })
    }
    //减少声音
    vol_down() {
        os.setVolume(0).then(data => {
            this.OS_STATUS.volume = data.value;
            this.res.json(data);
        })
    }
    //校准时间
    date() {
        exec("sudo ntpd -s -d", (err, stdout, stderr) => { });
        this.res.send('success');
    }
    //重启
    reboot() {
        exec("sudo reboot", (err, stdout, stderr) => { });
        this.res.send('success');
    }
    //关机
    shutdown() {
        exec("sudo halt", (err, stdout, stderr) => { });
        this.res.send('success');
    }
    //红外线
    infrared() {
        this.OS_STATUS.infraredSwitch = this.value;
        this.res.send('success');
    }
    //重启程序
    reset() {
        exec("pm2 restart electron", (err, stdout, stderr) => {
            console.log(stdout);
        });
        this.res.send('success');
    }
    //重启服务
    reset_service() {
        exec("pm2 restart app", (err, stdout, stderr) => {
            console.log(stdout);
        });
        this.res.send('success');
    }
    //拍照
    picture() {
        var filename = 'zhaopian.jpg';
        exec("raspistill -o " + filename + " -q 5", (err, stdout, stderr) => {
            //var imageBuf = fs.readFileSync(filename);
            request.post({
                url: 'http://23.105.217.23:8081/jiluxinqingupload', formData: {
                    jiluxinqing: fs.createReadStream(filename),
                }
            }, (err, httpResponse, body) => {
                if (err) {
                    this.res.send(err);
                }
                this.res.send(body);
            });

            //res.send(imageBuf.toString("base64"));
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

module.exports = args => {
    return new Action(args);
}