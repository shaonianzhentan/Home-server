const Picture = require('./picture.js');

module.exports = {
    init: (obj) => {
        res = obj.res;
        wsend = obj.wsend;
        value = obj.value;
    },
    //添加
    add: () => {
        var args = value;
        var oldname = req.files.picfile.path;
        var newname = (new Date()).getTime() + '.png';
        fs.rename(oldname, 'public/data/' + newname, function (err) {
            if (err) {
                throw err;
            }
            console.log('upload success');
            Picture.add(args.uid, args.source, newname).then(function (data) {
                console.log(data);
                res.send('success');
            });
        })
    },
    //删除
    del: () => {
        var args = value;
        Picture.del(args.id).then(function (data) {
            res.send(data);
        });
    },
    //置顶
    top: () => {
        var args = value;
        Picture.top(args.id).then(function (data) {
            res.send(data);
        });
    },
    get: () => {
        var args = value;
        Picture.get(args.uid).then(function (arr) {
            res.jsonp(arr);
        });
    }
}