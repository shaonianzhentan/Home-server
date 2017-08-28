const request = require('request');
const os = require('./os.js');

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
        wsend({ type: 'voice', result: 'start' });
        res.send('success')
    },
    //通知可以使用魔镜命令了
    readyvoice: () => {
        wsend({ type: 'voice', result: 'listen', msg: '请说出咒语”魔镜魔镜”，来召唤我吧' });
        res.send('success')
    },
    //重置魔镜
    resetvoice: () => {
        wsend({ type: 'voice', result: 'listen', msg: '魔镜正在重新启动中...' });
        os.StartVoiceServer().then(() => {
            wsend({ type: 'voice', result: 'listen', msg: '魔镜重启完成，快念出咒语召唤我吧！' });
        });
        res.send('success')
    },
    //给魔镜发送命令
    sendvoice: () => {
        wsend({ type: 'voice', result: 'end', msg: value });
        res.send('success')
    },
    //输入
    write: () => {
        wsend({ type: 'program', result: 'write', msg: value })
        res.send('success')
    }
}
