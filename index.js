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

/*******引入功能模块*******/
const os = require('./service/os.js'),
	Volume = require('./service/volume.js'),
	Clock = require('./service/clock.js'),
	Music = require('./service/music.js'),
	Picture = require('./service/picture.js');

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
			switch (obj.k) {
				case 'status':
					for (var k in obj.v) {
						OS_STATUS[k] = obj.v[k];
					}
					break;
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


/*************express**********************/
app.get('/', function (req, res) {
	res.send('hello world');
});

//系统状态
var OS_STATUS = {
	ip: os.ip,
	BootTime: (new Date()).toLocaleString(),
	ServerTime: (new Date()).toLocaleString(),
	infraredSwitch: '开',
	volume: '',
	screenshots: ''
}

//操作系统
app.post('/os', function (req, res) {
	var obj = req.body;
	switch (obj.key) {
		case 'status': //获取状态
			wsend({ type: 'program', result: 'status' })
			OS_STATUS.ServerTime = (new Date()).toLocaleString()
			OS_STATUS.volume = Volume.get();
			console.log(OS_STATUS.volume);
			res.json(OS_STATUS)
			break;
		case 'sensor': //传感器数据
			for (var k in obj.value) {
				OS_STATUS['sensor_' + k] = obj.value[k];
			}
			res.send('success');
			break;
		case 'vol_up': //增加声音
			res.send(Volume.plus());
			break;
		case 'vol_down': //减少声音
			res.send(Volume.minus());
			break;
		case 'date': //校准时间
			exec("sudo ntpd -s -d", function (err, stdout, stderr) { });
			res.send('success');
			break;
		case 'reboot': //重启
			exec("sudo reboot", function (err, stdout, stderr) { });
			res.send('success');
			break;
		case 'shutdown': //关机
			exec("sudo halt", function (err, stdout, stderr) { });
			res.send('success');
			break;
		case 'infrared': //红外线
			OS_STATUS.infraredSwitch = obj.value;
			res.send('success');
			break;
		case 'reset': //重启程序
			exec("pm2 restart electron", function (err, stdout, stderr) {
				console.log(stdout);
			});
			res.send('success');
			break;
		case 'reset_service': //重启服务
			exec("pm2 restart app", function (err, stdout, stderr) {
				console.log(stdout);
			});
			res.send('success');
			break;
		case 'picture': //拍照
			var filename = 'zhaopian.jpg';
			exec("raspistill -o " + filename + " -q 5", function (err, stdout, stderr) {
				//var imageBuf = fs.readFileSync(filename);
				request.post({
					url: 'http://23.105.217.23:8081/jiluxinqingupload', formData: {
						jiluxinqing: fs.createReadStream(filename),
					}
				}, function optionalCallback(err, httpResponse, body) {
					if (err) {
						res.send(err);
					}
					res.send(body);
				});

				//res.send(imageBuf.toString("base64"));
			});
			break;
	}
});

//客户端程序
app.post('/program', function (req, res) {
	var obj = req.body;
	switch (obj.key) {
		case 'reload': //刷新程序
			wsend({ type: 'program', result: 'reload' })
			res.send('success')
			break;
		case 'screenshots': //截图
			wsend({ type: 'program', result: 'screenshots' })
			res.send('success')
			break;
		case 'speak': //说话
			wsend({ type: 'program', result: 'speak', msg: obj.value })
			res.send('success')
			break;
		case 'voice': //声音
			wsend({ type: 'program', result: 'voice', msg: obj.value })
			res.send('success')
			break;
		case 'write': //输入
			wsend({ type: 'program', result: 'write', msg: obj.value })
			res.send('success')
			break;
		case 'screenshots-up':
			request.post({
				url: 'http://23.105.217.23:8081/jiluxinqingupload', formData: {
					jiluxinqing: fs.createReadStream(obj.value),
				}
			}, function optionalCallback(err, httpResponse, body) {
				if (err) {
					console.log(err);
				}
				OS_STATUS.screenshots = body;
			});
			res.send('success')
			break;
	}
});

//音乐
app.post('/music', function (req, res) {
	var obj = req.body;
	switch (obj.key) {
		case 'load': //载入链接
			wsend({ type: 'music', result: 'load', msg: obj.value })
			res.send('success')
			break;
		case 'play': //播放
			wsend({ type: 'music', result: 'play', msg: '播放' })
			res.send('success')
			break;
		case 'prev': //上一曲
			wsend({ type: 'music', result: 'prev', msg: '上一曲' })
			res.send('success')
			break;
		case 'next': //下一曲
			wsend({ type: 'music', result: 'next', msg: '下一曲' })
			res.send('success')
			break;
		case 'pause': //暂停
			wsend({ type: 'music', result: 'pause', msg: '暂停' })
			res.send('success')
			break;
		case 'random': //随机播放
			wsend({ type: 'music', result: 'random', msg: '随机播放' })
			res.send('success')
			break;
		case 'save': //添加音乐
			var args = obj.value;
			Music.save(args.id, args.type, args.link, args.title).then(function (data) {
				res.send(data);
			}, function (data) {
				res.send(data);
			});
			break;
		case 'del': //删除音乐
			var args = obj.value;
			Music.del(args).then(function (data) {
				res.send(data);
			}, function (data) {
				res.send(data);
			});
			break;
		case 'get': //获取音乐
			Music.get().then(function (data) {
				res.send(data);
			});
			break;
	}
});

//闹钟
app.post('/clock', function (req, res) {
	var obj = req.body;
	switch (obj.key) {
		case 'save': //添加
			var args = obj.value;
			Clock.save(args.id, args.time, args.voice, args.count).then(function (data) {
				wsend({ type: 'program', result: 'refresh' })
				res.send(data);
			});
			break;
		case 'del': //删除
			var args = obj.value;
			Clock.del(args).then(function (data) {
				wsend({ type: 'program', result: 'refresh' })
				res.send(data);
			});
			break;
		case 'baoshi': //报时
			wsend({ type: 'program', result: 'baoshi', msg: obj.value || '' })
			res.send('success');
			break;
		case 'get':
			Clock.get().then(function (arr) {
				res.jsonp(arr);
			});
			break;
	}
});

//相片
app.post('/picture', function (req, res) {
	var obj = req.body;
	switch (obj.key) {
		case 'del':
			var args = obj.value;
			Picture.del(args.id).then(function (data) {
				res.send(data);
			});
			break;
		case 'top':
			var args = obj.value;
			Picture.top(args.id).then(function (data) {
				res.send(data);
			});
			break;
		case 'add':
			var args = obj.value;
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
			break;
		case 'get':
			var args = obj.value;
			Picture.get(args.uid).then(function (arr) {
				res.jsonp(arr);
			});
			break;
	}
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
		OS_STATUS.infraredSwitch = OS_STATUS.infraredSwitch == '开' ? '关' : '开';
		wsend({ type: 'program', result: 'speak', msg: '红外控制' + OS_STATUS.infraredSwitch });
	},
	KEY_LEFT: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'music', result: 'prev', msg: '上一曲' })
	},
	KEY_RIGHT: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'music', result: 'next', msg: '下一曲' })
	},
	KEY_VOLUMEUP: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'program', result: 'tips', msg: Volume.plus() });
	},
	KEY_VOLUMEDOWN: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'program', result: 'tips', msg: Volume.minus() });
	},
	KEY_ENTER: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'music', result: 'play', msg: '播放' })
	},
	KEY_BACK: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'music', result: 'pause', msg: '暂停' })
	},
	KEY_HOME: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'program', result: 'reload' })
	},
	KEY_UP: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'music', result: 'up', msg: '播放广播' })
	},
	KEY_DOWN: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'music', result: 'down', msg: '播放音乐' })
	},
	KEY_WWW: () => {
		if (OS_STATUS.infraredSwitch == '开') wsend({ type: 'voice', result: 'start' })
	}
});
