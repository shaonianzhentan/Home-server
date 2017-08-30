//语音控制类
class Voice {

	constructor(home) {
		this.home = home;
		this.isListening = false;
		this.isLoading = false;
		this.timer = null;
	}

	start() {
		//发送信息，开始监听		
		document.getElementById("voiceFrame").contentWindow.startButton();
		this.text('魔镜魔镜，正在聆听...');
		//5秒后，还没有听到任何内容就重置
		setTimeout(() => {
			if (this.isListening == false) {
				//通知服务重启热词监听，因为没听到任何数据，
				this.home.http_program('resetvoice', '').then(res => {
					this.reset();
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
		clearInterval(this.timer);
		this.isLoading = false;

		var singer = msg.match(/播放([^.]+)的歌/) || msg.match(/我想听([^.]+)的歌/);
		var song = msg.match(/来一首([^.]+)/) || msg.match(/我想听([^.]+)/);
		var radio = msg.match(/我想听电台([^.]+)/);
		var songList = msg.match(/打开歌单([^.]+)/) || msg.match(/我想听歌单([^.]+)/);

		if (songList) {
			var key = songList[1];
			this.home.music.search(key, 1000).then(() => {
				this.isLoading = true;
			});
			this.home.media.PlayMsg('正在为你播放歌单,' + key).then(() => {
				this.timer = setInterval(() => {
					if (this.isLoading) {
						this.home.music.load();
						clearInterval(this.timer);
					}
				}, 1000)
			});

		} else if (singer) {
			var key = singer[1];
			this.home.music.search(key, 100).then(() => {
				this.isLoading = true;
			});
			this.home.media.PlayMsg('正在为你播放' + key + '的歌').then(() => {
				this.timer = setInterval(() => {
					if (this.isLoading) {
						this.home.music.load();
						clearInterval(this.timer);
					}
				}, 1000)
			});

		} else if (radio) {
			var key = radio[1];
			this.home.music.search(key, 1009).then(() => {
				this.isLoading = true;
			});
			this.home.media.PlayMsg('正在为你播放' + key).then(() => {
				this.timer = setInterval(() => {
					if (this.isLoading) {
						this.home.music.load();
						clearInterval(this.timer);
					}
				}, 1000)
			});

		} else if (song) {
			var key = song[1];
			this.home.music.search(key).then(() => {
				this.isLoading = true;
			});
			this.home.media.PlayMsg('正在为你播放' + key).then(() => {
				this.timer = setInterval(() => {
					if (this.isLoading) {
						this.home.music.load();
						clearInterval(this.timer);
					}
				}, 1000)
			});

		} else if (/(刷新页面)/.test(msg)) {
			location.reload();
		} else if (/(大点声|增加音量|大声一点)/.test(msg)) {
			this.home.http_os('vol_up', '').then(data => {
				this.home.media.ShowMsg('增加音量' + data.value);
			});
		} else if (/(小点声|减少音量|小声一点)/.test(msg)) {
			this.home.http_os('vol_down', '').then(data => {
				this.home.media.ShowMsg('减少音量' + data.value);
			});
		} else if (/(收音机|打开广播|播放广播)/.test(msg)) {
			this.home.music.fm().then(() => {
				this.isLoading = true;
			});

			this.home.media.PlayMsg('播放收音机').then(() => {
				this.timer = setInterval(() => {
					if (this.isLoading) {
						this.home.music.load();
						clearInterval(this.timer);
					}
				}, 1000)
			});

		} else if (/(暂停)/.test(msg)) {
			this.home.music.pause();
			this.home.media.ShowMsg('暂停音乐');
		} else if (/(播放)/.test(msg)) {
			this.home.music.play();
			this.home.media.ShowMsg('播放音乐');
		} else if (/(上一曲)/.test(msg)) {

			this.home.media.PlayMsg('上一曲').then(() => {
				this.home.music.prev();
			});
		} else if (/(下一曲)/.test(msg)) {
			this.home.media.PlayMsg('下一曲').then(() => {
				this.home.music.next();
			});
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
			}).then((res) => {
				res.json().then((data) => {
					//console.log(data);
					this.home.media.PlayMsg(data.text);
				})
			}).catch((ex) => {

			});
		}
		setTimeout(() => {
			this.reset();
		}, 3000);
	}

	//还原
	reset() {
		this.text('我是语音助手小白，现在立刻马上为您服务');
		this.isListening = false;
	}
}
