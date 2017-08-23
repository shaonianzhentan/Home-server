const request = require('request');
const os = require('os');

module.exports = {
    init: (obj) => {
        res = obj.res;
        wsend = obj.wsend;
        value = obj.value;
    },
    //刷新程序
    reload: () => {
        wsend({ type: 'program', result: 'reload' })
        res.send('success')
    },
    //截图
    screenshots: () => {
        wsend({ type: 'program', result: 'screenshots' })
        res.send('success')
    },
    //说话
    speak: () => {
        wsend({ type: 'program', result: 'speak', msg: value })
        res.send('success')
    },
    //声音
    voice: () => {
        wsend({ type: 'program', result: 'voice', msg: value })
        res.send('success')
    },
    //唤醒语音识别
    openvoice: () => {
        wsend({ type: 'voice', result: 'listen', msg: '魔镜魔镜，开始聆听...' });
        wsend({ type: 'voice-remote', result: 'open' });
        res.send('success')
    },
    //通知可以使用魔镜命令了
    readyvoice: () => {
        wsend({ type: 'voice', result: 'listen', msg: '请说出咒语”魔镜魔镜”，来召唤我吧' });
        res.send('success')
    },
    //重置魔镜
    resetvoice: () => {
        os.StartVoiceServer();
        res.send('success')
    },
    //输入
    write: () => {
        wsend({ type: 'program', result: 'write', msg: value })
        res.send('success')
    },
    "screenshots-up": () => {
        /*
        request.post({
            url: 'http://23.105.217.23:8081/jiluxinqingupload', formData: {
                jiluxinqing: fs.createReadStream(value),
            }
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                console.log(err);
            }
            OS_STATUS.screenshots = body;
        });
        */
        res.send('success')
    }
}
