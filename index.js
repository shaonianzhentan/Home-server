var express = require('express')
	, WebSocket = require('ws')
	, request = require('request')
	, http = require('http')
	, url = require('url')
	, fs = require('fs')
	, app = express()
	, bodyParser = require('body-parser')
	, multer = require('multer')
	, upload = multer({ dest: 'uploads/' })
	, cors = require('cors')
	, port = 8888
	, { exec } = require('child_process');

process.on('uncaughtException', (err) => {
	console.error('全局错误信息：', err);
});

/*******引入功能模块*******/
const os = require('./service/os.js');

//让网站跨域访问
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//创建HTTP服务，WebSocket服务
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


/*************WebSocket**********************/
wss.on('connection', function connection(ws) {

	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		try {
			var obj = JSON.parse(message);
			if (obj['type'] == 'voice' && obj.result == 'end') {
				os.StartVoiceServer();
			}
			//推送信息
			wsend(obj);
		} catch (ex) {
			console.log(ex);
		}
	});
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};

function wsend(data) {
	wss.broadcast(JSON.stringify(data));
}

//初始化全局变量数据
var APP_STATUS = require('./service/app_status.js');
APP_STATUS.init({
	wsend: wsend
});

/*************express**********************/

app.get('/', function (req, res) {
	res.redirect('/index.html');
	//res.send('hello world');
});

//操作系统
var app_os = require('./service/app_os.js')({
	wsend: wsend,
	OS_STATUS: APP_STATUS.OS_STATUS
});
app.post('/os', (req, res) => {
	app_os.action(req, res);
});

//客户端程序
var app_program = require('./service/app_program.js')({
	wsend: wsend
});
app.post('/program', (req, res) => {
	app_program.action(req, res);
});

//音乐
var app_music = require('./service/app_music.js')({
	wsend: wsend
});
app.post('/music', (req, res) => {
	app_music.action(req, res);
});

//闹钟
var app_clock = require('./service/app_clock.js')({
	wsend: wsend
});
app.post('/clock', (req, res) => {
	app_clock.action(req, res);
});

//相片
var app_picture = require('./service/app_picture.js')({
	wsend: wsend
});
app.post('/picture', (req, res) => {
	app_picture.action(req, res);
});

//获取css,js,image文件
app.get('*', function (req, res) {
	var pathname = url.parse(req.url).pathname;
	fs.exists("public" + pathname, function (exists) {
		if (!exists) res.status(404).send('404未找到当前页面');
		else res.sendfile("public" + pathname);
	});
});

server.listen(port, function listening() {
	console.log('当前IP地址：%s，监听端口 %d', os.ip, server.address().port);
});

/**********************************红外线接收模块**********************************************/
const sensor_lirc = require('./sensor/sensor-lirc.js');
sensor_lirc.init({
	KEY_X: () => {
		APP_STATUS.OS_STATUS.infraredSwitch = !APP_STATUS.OS_STATUS.infraredSwitch;
	},
	KEY_LEFT: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch) wsend({ type: 'music', result: 'prev', msg: '上一曲' })
	},
	KEY_RIGHT: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch) wsend({ type: 'music', result: 'next', msg: '下一曲' })
	},
	KEY_VOLUMEUP: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch)
			os.setVolume(1).then(data => {
				wsend({ type: 'program', result: 'tips', msg: '增加音量：' + data.value });
			})
	},
	KEY_VOLUMEDOWN: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch)
			os.setVolume(0).then(data => {
				wsend({ type: 'program', result: 'tips', msg: '减少音量：' + data.value });
			})
	},
	KEY_ENTER: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch) wsend({ type: 'music', result: 'play', msg: '播放' })
	},
	KEY_BACK: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch) wsend({ type: 'music', result: 'pause', msg: '暂停' })
	},
	KEY_HOME: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch) wsend({ type: 'program', result: 'reload' })
	},
	KEY_UP: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch) wsend({ type: 'music', result: 'up', msg: '播放广播' })
	},
	KEY_DOWN: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch) wsend({ type: 'music', result: 'down', msg: '播放音乐' })
	},
	KEY_WWW: () => {
		if (APP_STATUS.OS_STATUS.infraredSwitch) wsend({ type: 'voice', result: 'start' })
	}
});