const Music = require('./music.js')

var res = null, wsend = null, args = null;

module.exports = {
    init: (obj) => {
        res = obj.res;
        wsend = obj.wsend;
        args = obj.value;
    },
    //载入链接
    load: () => {
        wsend({ type: 'music', result: 'load', msg: args })
        res.send('success')
    },
    //播放
    play: () => {
        wsend({ type: 'music', result: 'play', msg: '播放' })
        res.send('success')
    },
    //上一曲
    prev: () => {
        wsend({ type: 'music', result: 'prev', msg: '上一曲' })
        res.send('success')
    },
    //下一曲
    next: () => {
        wsend({ type: 'music', result: 'next', msg: '下一曲' })
        res.send('success')
    },
    //暂停
    pause: () => {
        wsend({ type: 'music', result: 'pause', msg: '暂停' })
        res.send('success')
    },
    //随机播放
    random: () => {
        wsend({ type: 'music', result: 'random', msg: '随机播放' })
        res.send('success')
    },
    //添加音乐
    save: () => {
        Music.save(args.id, args.type, args.link, args.title).then(function (data) {
            res.send(data);
        }, function (data) {
            res.send(data);
        });
    },
    //删除音乐
    del: () => {
        Music.del(args).then(function (data) {
            res.send(data);
        }, function (data) {
            res.send(data);
        });
    },
    //获取音乐
    get: () => {
        Music.get().then(function (data) {
            res.send(data);
        });
    }
}
