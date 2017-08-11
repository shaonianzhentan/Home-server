const lirc_node = require('lirc_node');
const domain = require('domain');
const d = domain.create();

//监听domain的错误事件
d.on('error', function (err) {
    console.log('红外控制出现错误');
    //d.dispose();
});

module.exports = {
    init: function (obj) {
        d.run(function () {

            lirc_node.init();
            console.log(lirc_node.remotes);
            console.log("红外控制开启...");
            // 监听按键命令
            var listenerId = lirc_node.addListener(function (data) {
                var key = data.key;
                console.log("Received IR keypress '" + key + "'' from remote '" + data.remote + "'");

                if ((typeof obj[key]) === "function") {
                    obj[key]();
                }
            });

            /*
            lirc_node.addListener('KEY_UP', 'remote1', function (data) {
                console.log(data);
                console.log("Received IR keypress 'KEY_UP' from remote 'remote1'");
                // data also has `code` and `repeat` properties from the output of `irw`
                // The final argument after this callback is a throttle allowing you to 
                // specify to only execute this callback once every x milliseconds.
            }, 400);
            */
        });
    }
}
