//语音控制类
class Voice {

	constructor(h) {
		this.home = h;
		this.isListening = false;
	}

	ready() {

	}

	start() {
		//发送信息，开始监听		
		this.home.send({ type: 'voice-remote', result: 'open' });
		this.text('开始聆听...');
		var _self = this;
		//5秒后，还没有听到任何内容就重置
		setTimeout(function () {
			if (_self.isListening == false) {
				//通知服务重启热词监听，因为没听到任何数据，
				this.home.http_program('resetvoice', '').then(res => {
					_self.reset();
				})				
			}
		}, 5000);
	}

	//设置显示文本
	text(msg) {
		document.querySelector(".speech-text").innerHTML = msg;
	}

	//聆听与显示
	listen(msg) {
		document.querySelector(".speech-text").innerHTML = msg;
		this.isListening = true;
	}

	//理解与执行
	end(msg) {
		this.text(msg);
		var _self = this;

		var singer = msg.match(/播放([^.]+)的歌/) || msg.match(/我想听([^.]+)的歌/);
		var song = msg.match(/来一首([^.]+)/) || msg.match(/我想听([^.]+)/);
		var radio = msg.match(/我想听电台([^.]+)/);
		var songList = msg.match(/打开歌单([^.]+)/) || msg.match(/我想听歌单([^.]+)/);

		if (songList) {
			var key = songList[1];
			this.home.music.search(key, 1000).then(function () {
				_self.home.music.load();
			});
			_self.home.media.ShowMsg('正在为你播放歌单,' + key);

		} else if (singer) {
			var key = singer[1];
			this.home.music.search(key, 100).then(function () {
				_self.home.music.load();
			});
			_self.home.media.ShowMsg('正在为你播放' + key + '的歌');

		} else if (radio) {
			var key = radio[1];
			this.home.music.search(key, 1009).then(function () {
				_self.home.music.load();
			});
			_self.home.media.ShowMsg('正在为你播放' + key);
		} else if (song) {
			var key = song[1];
			this.home.music.search(key).then(function () {
				_self.home.music.load();
			});
			_self.home.media.ShowMsg('正在为你播放' + key);

		} else if (/(刷新页面)/.test(msg)) {
			location.reload();
		} else if (/(大点声|增加音量|大声一点)/.test(msg)) {
			this.home.http_os('vol_up', '');
			this.home.media.ShowMsg('增加音量');
		} else if (/(小点声|减少音量|小声一点)/.test(msg)) {
			this.home.http_os('vol_down', '');
			this.home.media.ShowMsg('减少音量');
		} else if (/(收音机|打开广播|播放广播)/.test(msg)) {
			this.home.music.fm().then(function () {
				_self.home.music.load();
			});
			this.home.media.ShowMsg('播放收音机');
		} else if (/(暂停)/.test(msg)) {
			this.home.music.pause();
			this.home.media.ShowMsg('暂停音乐');
		} else if (/(播放)/.test(msg)) {
			this.home.music.play();
			this.home.media.ShowMsg('播放音乐');
		} else if (/(上一曲)/.test(msg)) {
			this.home.music.prev();
			this.home.media.ShowMsg('上一曲');
		} else if (/(下一曲)/.test(msg)) {
			this.home.music.next();
			this.home.media.ShowMsg('下一曲');
		} else {

			fetch('http://www.tuling123.com/openapi/api', {
				method: "POST",
				headers: {
					'Content-Type': 'x-www-form-urlencoded;charset=utf-8'
				},
				body: JSON.stringify({
					key: 'b1a4b4c8964b4d0b82dd013acef45f33',
					info: encodeURIComponent(msg),
					userid: '9527'
				})
			}).then(function (res) {
				res.json().then(function (data) {
					//console.log(data);
					_self.home.media.ShowMsg(data.text);
				})
			}).catch(function (e) {

			});
		}
		setTimeout(function () {
			_self.reset();
		}, 3000);
	}

	//关闭语音识别
	close() {
		this.home.send({ type: 'voice-remote', result: 'close' });
	}

	//还原
	reset() {
		this.text('我是语音助手小白，现在立刻马上为您服务');
		this.isListening = false;
	}
}
