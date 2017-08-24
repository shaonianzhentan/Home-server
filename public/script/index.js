class HOME {
	constructor() {		
		this.media = new Media(this);
		this.clock = new Clock(this);
		this.music = new Music();
		this.conn();
		this.tick();
		this.voice = new Voice(this);
		this.text = new HomeText();
	}
	conn() {
		var _self = this;
		this.ws = new WebSocket('ws://localhost:8888');
		this.ws.onmessage = function (data) {
			try {
				var obj = JSON.parse(data.data);
				switch (obj.type) {
					//音乐控制
					case 'music':
						var result = obj.result;
						switch (result) {
							case 'load':
								_self.music.load(obj.msg);
								return;
							case 'play':
								_self.music.play();
								break;
							case 'random':
								_self.music.random();
								break;
							case 'up':
								_self.music.fm().then(function () {
									_self.music.load();
								});
								break;
							case 'down':
								_self.music.random();
								break;
							case 'prev':
								_self.music.prev();
								break;
							case 'next':
								_self.music.next();
								break;
							case 'pause':
								_self.music.pause();
								break;
						}
						_self.media.ShowMsg(obj.msg);
						break;
					//程序控制
					case 'program':
						switch (obj.result) {
							case 'reload':
								location.reload();
								break;
							case 'menu-click': //菜单切换
								$(".NavPanel").fadeToggle();
								break;
							case 'refresh': //更新配置数据								
								_self.clock.load();
								break;
							case 'screenshots'://截图
								
								break;
							case 'baoshi':
								_self.clock.play(obj.msg);
								break;
							case 'lock': //锁屏

								break;
							case 'tips': //提示信息
								_self.media.ShowTips(obj.msg);
								break;
							case 'speak': //说话
								_self.media.ShowMsg(obj.msg);
								break;
							case 'voice': //声音
								_self.media.play(obj.msg);
								break;
							case 'write': //输入
								clipboard.writeText(obj.msg);
								setTimeout(function () {
									_self.music.wv.paste();
								}, 1000);
								break;
						}
						break;
					//语音控制
					case 'voice':
						switch (obj.result) {
							case 'ready':
								_self.voice.isReady = true;
								_self.voice.text('语音助手小白已经准备好了~');
								ipcRenderer.send('system', 'top');
								break;
							case 'alive':
								_self.voice.isReady = true;
								_self.voice.text('主人，小白还活着，赶快来召唤我吧~');
								ipcRenderer.send('system', 'top');
								break;
							case 'start':
								_self.voice.start();
								break;
							case 'listen': //显示听到的文字
								_self.voice.listen(obj.msg);
								break;
							case 'end': //结束聆听
								_self.voice.end(obj.msg);
								break;
						}
						break;
				}
			} catch (ex) {

			}
			console.log(data);
		}
		this.ws.onerror = function (err) {
			console.log(err);
		}

		this.ws.onopen = function () {
			_self.media.ShowMsg('连接成功');
		}

		this.ws.onclose = function () {
			_self.media.ShowMsg('连接关闭，30秒后重新连接');
			setTimeout(function () {
				_self.conn();
			}, 30000);
		}

	}

	send(data) {
		try {
			if (this.ws && this.ws.readyState == 1) this.ws.send(JSON.stringify(data));
		} catch (ex) {
			console.log(ex);
		}
	}

	http_os(key, value) {
		return new Promise(function (resolve, reject) {
			$.post('http://localhost:8888/os', { key: key, value: value }, function (data) {
				resolve(data);
			})
		})
	}

	http_program(key, value) {
		return new Promise(function (resolve, reject) {
			$.post('http://localhost:8888/program', { key: key, value: value }, function (data) {
				resolve(data);
			})
		})
	}

	//定时器，每秒触发一次
	tick() {
		var _self = this;
		setTimeout(function () {

			setInterval(function () {
				_self.clock.start();
			}, 1000);

		}, 1000);
	}
}

var home = new HOME();