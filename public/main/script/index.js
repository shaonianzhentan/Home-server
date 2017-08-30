class HOME {
	constructor() {
		this.music = new Music();
		this.media = new Media(this);
		this.clock = new Clock(this);
		this.conn();
		this.tick();
		this.voice = new Voice(this);
		this.text = new HomeText();
	}
	conn() {
		this.ws = new WebSocket('ws://localhost:8888');
		this.ws.onmessage = (data) => {
			try {
				var obj = JSON.parse(data.data);
				switch (obj.type) {
					//音乐控制
					case 'music':
						var result = obj.result;
						switch (result) {
							case 'load': //播放歌单
								var id = obj.msg;
								this.music.playlist(id).then(() => {
									this.music.load();
								});
								return;
							case 'loadlist': //播放歌单								
								this.music.musicList = JSON.parse(obj.msg);
								this.music.load();								
								return;
							case 'play':
								this.music.play();
								break;
							case 'random':
								this.music.random();
								break;
							case 'up':
								this.music.fm().then(() => {
									this.music.load();
								});
								break;
							case 'down':
								this.music.random();
								break;
							case 'prev':
								this.music.prev();
								break;
							case 'next':
								this.music.next();
								break;
							case 'pause':
								this.music.pause();
								break;
						}
						this.media.ShowMsg(obj.msg);
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
								this.clock.load();
								break;
							case 'screenshots'://截图

								break;
							case 'baoshi':
								this.clock.play(obj.msg);
								break;
							case 'lock': //锁屏

								break;
							case 'tips': //提示信息
								this.media.ShowTips(obj.msg);
								break;
							case 'speak': //说话
								this.media.ShowMsg(obj.msg);
								break;
							case 'voice': //声音
								this.media.play(obj.msg);
								break;
							case 'write': //输入
								clipboard.writeText(obj.msg);
								setTimeout(function () {
									this.music.wv.paste();
								}, 1000);
								break;
						}
						break;
					//语音控制
					case 'voice':
						switch (obj.result) {
							case 'start':
								this.voice.start();
								break;
							case 'listen': //显示听到的文字
								this.voice.listen(obj.msg);
								break;
							case 'end': //结束聆听
								this.voice.end(obj.msg);
								break;
						}
						break;
				}
			} catch (ex) {

			}
			console.log(data);
		}
		this.ws.onerror = (err) => {
			console.log(err);
		}

		this.ws.onopen = () => {
			this.media.PlayMsg('连接成功');
		}

		this.ws.onclose = () => {
			this.media.PlayMsg('连接关闭，30秒后重新连接');
			setTimeout(() => {
				this.conn();
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
		return new Promise((resolve, reject) => {
			$.post('http://localhost:8888/os', { key: key, value: value }, (data) => {
				resolve(data);
			})
		})
	}

	http_program(key, value) {
		return new Promise((resolve, reject) => {
			$.post('http://localhost:8888/program', { key: key, value: value }, (data) => {
				resolve(data);
			})
		})
	}

	//定时器，每秒触发一次
	tick() {
		setTimeout(() => {

			setInterval(() => {
				this.clock.start();
			}, 1000);

		}, 1000);
	}
}

var home = new HOME();