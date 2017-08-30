class Music {
	constructor() {
		this.video = document.createElement('video');
		this.video.style.display = 'none';
		this.video.controls = true;
		this.video.autoplay = true;
		var _self = this;
		this.video.onerror = function () {
			console.log('play error');
			_self.setStatus('出现错误');
		}
		this.video.oncanplay = function () {
			console.log('can play');
			_self.play();
		}
		document.body.appendChild(this.video);
		this.isLoading = false;
	}

	//音乐列表
	get musicList() {
		try {
			var ml = localStorage["MUSIC-LIST"];
			if (ml) {
				return JSON.parse(ml);
			}
		} catch (ex) {

		}
		return [];
	}
	set musicList(value) {
		if (Array.isArray(value)) {
			localStorage["MUSIC-LIST"] = JSON.stringify(value);
			this.musicIndex = 0;
		}
	}
	//音乐列表索引
	get musicIndex() {
		try {
			return parseInt(localStorage["MUSIC-INDEX"]) || 0;
		} catch (ex) {
			return 0;
		}
		return [];
	}
	set musicIndex(value) {
		localStorage["MUSIC-INDEX"] = value;
	}

	//搜索
	/*
	1: 单曲
	10: 专辑
	100: 歌手
	1000: 歌单
	1002: 用户
	1004: MV
	1006: 歌词
	1009: 电台 
	*/
	search(keywords, type, limit, offset) {
		var args = '?keywords=' + keywords;
		if (type) args += '&type=' + type;
		if (limit) args += '&limit=' + limit;
		if (offset) args += '&type=' + offset;

		var _self = this;

		return new Promise((resolve, reject) => {
			fetch('http://localhost:3000/search' + args).then(function (res) {

				res.json().then(function (data) {

					var arr = [];

					if (!type || type == 1) {
						//单曲搜索
						data.result.songs.forEach(function (ele) {
							arr.push({
								id: ele.id,
								title: ele.name,
								name: ele.artists[0].name
							});
						})
						_self.musicList = arr;

						resolve();
					} else if (type == 100) {
						//歌手搜索
						if (data.result.artistCount) {
							var id = data.result.artists[0].id;
							fetch('http://localhost:3000/artists?id=' + id).then(res => {
								res.json().then(function (data) {

									data.hotSongs.forEach(function (ele) {
										arr.push({
											id: ele.id,
											title: ele.name,
											name: ele.ar[0].name
										});
									})
									_self.musicList = arr;

									resolve();

								})
							}).catch(err => {

							});
						}
					} else if (type == 1009) {
						//电台搜索
						if (data.result.djprogramCount) {
							data.result.djprograms.forEach(ele => {
								arr.push({
									id: ele.mainSong.id,
									title: ele.name,
									name: ele.radio.name
								});
							})
							_self.musicList = arr;
							resolve();
						}
					} else if (type == 1000) {
						//歌单
						if (data.result.playlistCount) {
							var id = data.result.playlists[0].id;
							_self.playlist(id).then(() => {
								resolve();
							});
						}
					}
				});


			}).catch(function (err) {
				console.log('Fetch Error : %S', err);
				reject(err);
			})
		})
	}

	//播放歌单
	playlist(id) {
		var _self = this;
		return new Promise((resolve, reject) => {
			fetch('http://localhost:3000/playlist/detail?id=' + id).then(res => {
				res.json().then(function (data) {
					var arr = [];
					data.playlist.tracks.forEach(function (ele) {
						arr.push({
							id: ele.id,
							title: ele.name,
							name: ele.ar[0].name
						});
					})
					_self.musicList = arr;
					resolve();
				})
			}).catch(err => {
				reject(err);
			});
		})
	}

	//收音机
	fm() {
		var _self = this;
		return new Promise((resolve, reject) => {
			fetch('http://localhost:8888/radio.json').then(res => {
				res.json().then(data => {
					var arr = [];
					for (var k in data) {
						data[k].forEach(function (ele) {
							arr.push({
								title: ele.title,
								name: k,
								m3u8: ele.url
							})
						})
					}
					_self.musicList = arr;
					resolve();
				})
			}).catch(err => {
				reject(err);
			})
		})
	}

	load() {
		if (this.musicList.length == 0) return;

		this.video.onended = function () {
			console.log('play end');
			_self.next();
		}

		if (this.isLoading) return;
		this.isLoading = true;
		var obj = this.musicList[this.musicIndex];

		var _self = this;
		var video = this.video;

		//支付m3u8格式
		if (obj['m3u8']) {
			return new Promise((resolve, reject) => {
				home.text.start();
				_self.isLoading = false;
				if (Hls.isSupported()) {
					var hls = new Hls();
					hls.loadSource(obj['m3u8']);
					hls.attachMedia(video);
					hls.on(Hls.Events.MANIFEST_PARSED, function () {
						_self.play();
						resolve();
					});
					hls.on(Hls.Events.ERROR, function (event, data) {
						console.warn(data);

						switch (data.details) {
							case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
							case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
							case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
								_self.next();
								break;
						}

						if (data.fatal) {
							//console.log('fatal error :' + data.details);
							switch (data.type) {
								case Hls.ErrorTypes.MEDIA_ERROR:
									_self.next();
									break;
								case Hls.ErrorTypes.NETWORK_ERROR:
									//$("#HlsStatus").append(",network error ...");
									break;
							}
						}
					});
				}
			});
		}
		//网易云音乐
		return new Promise((resolve, reject) => {
			//获取音乐地址
			fetch('http://localhost:3000/music/url?id=' + obj.id).then(function (res) {
				res.json().then(function (data) {
					//console.log(data);
					var url = data.data[0].url;
					if (url) video.src = url;
					else _self.next();
					//_self.play();

					_self.isLoading = false;
					resolve();

					//获取歌词					
					fetch('http://localhost:3000/lyric?id=' + obj.id).then(function (res) {
						res.json().then(function (data) {
							home.text.showlrc(data.lrc.lyric);
						})
					})
				})

			}).catch(function (err) {
				console.log('Fetch Error : %S', err);
				_self.isLoading = false;
				reject(err);
			})
		})
	}

	play() {
		if (!this.video.src) {
			this.load();
		} else {
			this.video.play();
			this.setStatus('正在播放');
			console.log('playing');
		}
	}

	pause() {
		this.video.pause();
		this.setStatus('暂停音乐');
	}

	next() {
		this.musicIndex++;

		if (this.musicIndex >= this.musicList.length) {
			this.musicIndex = 0;
		}

		this.setStatus('下一曲');
		this.load();
	}

	prev() {
		this.musicIndex--;
		if (this.musicIndex < 0) {
			this.musicIndex = this.musicList.length - 1;
		}
		this.setStatus('上一曲');
		this.load();
	}

	setStatus(ss) {
		this.status = ss;
		this.optime = (new Date()).toLocaleString();
		var _self = this;
		setTimeout(function () {
			//发送状态信息到服务器
			home.http_os('setStatus', {
				MusicTitle: _self.title,
				MusicStatus: _self.status,
				MusicUrl: _self.url,
				MusicTime: _self.optime
			}).then(result => {
				console.log(result);
			})
		}, 1000);

		var obj = this.musicList[this.musicIndex];
		if (obj) {
			document.getElementById("music-title").innerHTML = this.status + '：    ' + obj.title + " - " + obj.name;
		} else {
			document.getElementById("music-title").innerHTML = '没有音乐';
		}
	}

	random() {
		var len = this.musicList.length;
		var index = Math.round(Math.random() * len);
		if (index == len) index = 0;
		this.musicIndex = index;
		this.setStatus('随机播放');
		this.load();
	}

	set(url) {
		return new Promise((resolve, reject) => {
			this.video.onended = function () {
				resolve();
			}
			this.video.src = url;
		})
	}
}
