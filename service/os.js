const PythonShell = require('python-shell');

//获取本机IP地址
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

var ip = getIPAdress();

module.exports = {
    ip: ip,
    getcpu: () => {
        return new Promise(function (resolve, reject) {
            PythonShell.run('../sensor/sensor-os.py', function (err, results) {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    var obj = JSON.parse(results[0]);
                    resolve(obj);
                } catch (ex) {
                    reject(ex);
                }
                console.log('results: %j', results);
            });
        });
    },
    getTemperature: () => {
        return new Promise(function (resolve, reject) {
            PythonShell.run('../sensor/sensor-temperature.py', function (err, results) {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    var obj = JSON.parse(results[0]);
                    console.log("温度", obj.temperature);
                    console.log("湿度", obj.humidity);

                    resolve(obj);
                } catch (ex) {
                    reject(ex);
                }
                console.log('results: %j', results);
            });
        });
    }
}