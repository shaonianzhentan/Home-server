const request = require('request');

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
