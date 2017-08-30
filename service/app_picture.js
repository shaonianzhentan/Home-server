const Storage = require('./storage.js').init('picture.json');

class Action {

    constructor(args) {
        this.wsend = args.wsend;
    }

    //添加
    save() {
        var oldname = this.req.files.picfile.path;
        var newname = (new Date()).getTime() + '.png';
        fs.rename(oldname, 'public/pic/' + newname, err => {
            if (err) {
                this.res.status(500).send(err)
                return;
            }
            console.log('upload success');

            Storage.save({
                id: Storage.identity,
                source: this.value.source,
                pic: newname
            }).then(data => {
                this.wsend({ type: 'program', result: 'refresh' })
                this.res.send(data);
            })

        })
    }

    //删除
    del() {
        Storage.del(this.value.id).then(data => {
            this.res.send(data);
        }).catch(err => {
            this.res.status(500).send(err)
        })
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