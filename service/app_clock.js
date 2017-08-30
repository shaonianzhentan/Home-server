const Storage = require('./storage.js').init('clock.json');


class Action {

    constructor(args) {
        this.wsend = args.wsend;
    }

    //添加
    save() {

        Storage.save({
            id: Storage.identity,
            time: this.value.time,
            voice: this.value.voice
        }).then(data => {
            this.wsend({ type: 'program', result: 'refresh' })
            this.res.send(data);
        })
    }
    //删除
    del() {
        Storage.del(this.value.id).then(data => {
            this.wsend({ type: 'program', result: 'refresh' })
            this.res.send(data);
        }).catch(err => {
            this.res.status(500).send(err)
        })
    }
    //报时
    baoshi() {
        this.wsend({ type: 'program', result: 'baoshi', msg: this.value || '' })
        this.res.send('success');
    }

    get() {
        Storage.read().then(data => {
            this.res.json(data);
        }).catch((err) => {
            this.res.status(500).send(err)
        })
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

