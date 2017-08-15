const Clock = require('./clock.js');

module.exports = {
    init: (obj) => {
        res = obj.res;
        wsend = obj.wsend;
        value = obj.value;
    },
    //添加
    save: () => {
        var args = value;
        Clock.save(args.id, args.time, args.voice, args.count).then(function (data) {
            wsend({ type: 'program', result: 'refresh' })
            res.send(data);
        });
    },
    //删除
    del: () => {
        var args = value;
        Clock.del(args).then(function (data) {
            wsend({ type: 'program', result: 'refresh' })
            res.send(data);
        });
    },
    //报时
    baoshi: () => {
        wsend({ type: 'program', result: 'baoshi', msg: value || '' })
        res.send('success');
    },
    get: () => {
        Clock.get().then(function (arr) {
            res.jsonp(arr);
        });
    }
}