const Storage = require('./storage.js').init('music.json');


class Action {

    constructor(args) {
        this.wsend = args.wsend;
    }
    //载入歌单
    load() {
        this.wsend({ type: 'music', result: 'load', msg: this.value })
        this.res.send('success')
    }
    //播放
    play() {
        this.wsend({ type: 'music', result: 'play', msg: '播放' })
        this.res.send('success')
    }
    //上一曲
    prev() {
        this.wsend({ type: 'music', result: 'prev', msg: '上一曲' })
        this.res.send('success')
    }
    //下一曲
    next() {
        this.wsend({ type: 'music', result: 'next', msg: '下一曲' })
        this.res.send('success')
    }
    //暂停
    pause() {
        this.wsend({ type: 'music', result: 'pause', msg: '暂停' })
        this.res.send('success')
    }
    //随机播放
    random() {
        this.wsend({ type: 'music', result: 'random', msg: '随机播放' })
        this.res.send('success')
    }
    //添加音乐
    save() {
        Storage.save({
            id: this.value.id || Storage.identity,
            type: this.value.type,
            link: this.value.link,
            title: this.value.title
        }).then(data => {
            this.res.send(data);
        }).catch(err => {
            this.res.status(500).send(err)
        })
    }
    //删除音乐
    del() {
        Storage.del(this.value.id).then(data => {
            this.res.send(data);
        }).catch(err => {
            this.res.status(500).send(err)
        })
    }
    //获取音乐
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



module.exports = function (args) {
    return new Action(args);
}