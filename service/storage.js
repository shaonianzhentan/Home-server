const fs = require('fs');

class Storage {

    constructor(file) {
        this.file = file;
        let path = 'public/data/' + file;
        if (fs.existsSync(path) == false) {
            fs.writeFileSync(path, "[]");
        }
        this.path = path;
    }

    get identity() {
        return (new Date()).getTime();
    }

    //读取数据
    read() {
        var _self = this;
        return new Promise((resolve, reject) => {
            try {
                var obj = JSON.parse(fs.readFileSync(_self.path, 'utf8'));
                resolve(obj);
            } catch (ex) {
                reject(ex);
            }
        })
    }
    //写入数据
    write(data) {
        var _self = this;
        return new Promise((resolve, reject) => {
            try {
                if (Array.isArray(data)) {
                    fs.writeFileSync(_self.path, JSON.stringify(data));
                    resolve(data);
                } else {
                    reject('保存数据不是数组');
                }
            } catch (ex) {
                reject(ex);
            }
        })
    }
    //添加数据
    save(data) {
        var _self = this;
        return new Promise((resolve, reject) => {

            _self.read().then(arr => {

                //找到索引
                var index = arr.findIndex((value, index, arr) => {
                    return value.id == data.id;
                });

                if(index < 0 ){
                    arr.push(data);
                }else{
                    arr[index] = data;
                }                

                //保存
                _self.write(arr).then(() => {
                    resolve(arr);
                }).catch(err => {
                    reject(ex);
                })

            }).catch(err => {
                reject(ex);
            })
        })
    }
    //删除数据
    del(id) {
        var _self = this;
        return new Promise((resolve, reject) => {

            _self.read().then(arr => {
                //找到索引
                var index = arr.findIndex((value, index, arr) => {
                    return value.id == id;
                });

                if (index >= 0) {
                    //删除对象
                    arr.splice(index, 1)
                    //保存
                    _self.write(arr).then(() => {
                        resolve(arr);
                    }).catch(err => {
                        reject(ex);
                    })
                } else {
                    reject('没有找到对象');
                }
            }).catch(err => {
                reject(ex);
            })

        })
    }
}

module.exports = {
    init: (file) => {
        return new Storage(file)
    }
};