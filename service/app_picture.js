const Storage = require('./storage.js').init('picture.json');

module.exports = {
    init: (obj) => {
        res = obj.res;
        wsend = obj.wsend;
        value = obj.value;
    },
    //添加
    save: () => {

        var oldname = req.files.picfile.path;
        var newname = (new Date()).getTime() + '.png';
        fs.rename(oldname, 'public/pic/' + newname, function (err) {
            if (err) {
                throw err;
            }
            console.log('upload success');

            Storage.save({
                id: Storage.identity,
                source: value.source,
                pic: newname
            }).then(data => {
                wsend({ type: 'program', result: 'refresh' })
                res.send(data);
            })

        })
    },
    //删除
    del: () => {
        Storage.del(value.id).then(function (data) {
            res.send(data);
        }).catch(err => {
            res.status(500).send(err)
        })
    },
    get: () => {
        Storage.read().then(data => {
            res.json(data);
        }).catch((err) => {
            res.status(500).send(err)
        })
    }
}