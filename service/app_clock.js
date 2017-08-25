const Storage = require('./storage.js');
Storage.init('clock.json');


module.exports = {
    init: (obj) => {
        res = obj.res;
        wsend = obj.wsend;
        value = obj.value;
    },
    //添加
    save: () => {

        Storage.save({
            id: Storage.identity,
            time: value.time,
            voice: value.voice
        }).then(data => {
            wsend({ type: 'program', result: 'refresh' })
            res.send(data);
        })
    },
    //删除
    del: () => {
        Storage.del(value.id).then(function (data) {
            wsend({ type: 'program', result: 'refresh' })
            res.send(data);
        }).catch(err=>{
            res.status(500).send(err)
        })
    },
    //报时
    baoshi: () => {
        wsend({ type: 'program', result: 'baoshi', msg: value || '' })
        res.send('success');
    },
    get: () => {
        Storage.read().then(data => {
            res.json(data);
        }).catch((err) => {
            res.status(500).send(err)
        })
    }
}