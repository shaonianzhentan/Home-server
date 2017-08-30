const request = require('request')
    , { exec } = require('child_process')
    , os = require('./os.js');

class Action {

    constructor(args) {
        this.wsend = args.wsend;
    }
    //刷新程序
    reload() {
        this.wsend({ type: 'program', result: 'reload' })
        this.res.send('success')
    }
    //截图
    screenshots() {
        this.wsend({ type: 'program', result: 'screenshots' })
        this.res.send('success')
    }
    //说话
    speak() {
        this.wsend({ type: 'program', result: 'speak', msg: this.value })
        this.res.send('success')
    }
    //声音
    voice() {
        this.wsend({ type: 'program', result: 'voice', msg: this.value })
        this.res.send('success')
    }
    //唤醒语音识别
    openvoice() {
        this.wsend({ type: 'voice', result: 'start' });
        this.res.send('success')
    }
    //通知可以使用魔镜命令了
    readyvoice() {
        this.wsend({ type: 'voice', result: 'listen', msg: '请说出咒语”魔镜魔镜”，来召唤我吧' });
        this.res.send('success')
    }
    //重置魔镜
    resetvoice() {
        this.wsend({ type: 'voice', result: 'listen', msg: '魔镜正在重新启动中...' });
        os.StartVoiceServer().then(() => {
            this.wsend({ type: 'voice', result: 'listen', msg: '魔镜重启完成，快念出咒语召唤我吧！' });
        });
        this.res.send('success')
    }
    //给魔镜发送命令
    sendvoice() {
        this.wsend({ type: 'voice', result: 'end', msg: this.value });
        this.res.send('success')
    }
    //输入
    write() {
        this.wsend({ type: 'program', result: 'write', msg: this.value })
        this.res.send('success')
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