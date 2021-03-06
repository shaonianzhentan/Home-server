﻿class Music {
	constructor() {
		this.api_url = 'http://' + location.hostname + ':3000/';
		this.video = document.createElement('video');
		this.video.style.display = 'none';
		this.video.controls = true;
		this.video.autoplay = true;
		this.video.onerror = () => {
			console.log('play error');
			this.setStatus('出现错误');
		}

		this.video.oncanplay = () => {
			console.log('can play');
			this.play();
		}

		this.video.ontimeupdate = () => {
			if (this.lrc) {
				var obj = this.lrc.get(Math.floor(this.video.currentTime) + 1);
				if (obj && obj.txt) {
					home.text.show(obj.txt)
				}
			}
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

		return new Promise((resolve, reject) => {
			fetch(this.api_url + 'search' + args).then((res) => {

				res.json().then((data) => {

					var arr = [];

					if (!type || type == 1) {
						//单曲搜索
						data.result.songs.forEach((ele) => {
							arr.push({
								id: ele.id,
								title: ele.name,
								name: ele.artists[0].name
							});
						})
						this.musicList = arr;

						resolve();
					} else if (type == 100) {
						//歌手搜索
						if (data.result.artistCount) {
							var id = data.result.artists[0].id;
							fetch(this.api_url + 'artists?id=' + id).then(res => {
								res.json().then((data) => {

									data.hotSongs.forEach((ele) => {
										arr.push({
											id: ele.id,
											title: ele.name,
											name: ele.ar[0].name
										});
									})
									this.musicList = arr;

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
							this.musicList = arr;
							resolve();
						}
					} else if (type == 1000) {
						//歌单
						if (data.result.playlistCount) {
							var id = data.result.playlists[0].id;
							this.playlist(id).then(() => {
								resolve();
							});
						}
					}
				});


			}).catch((err) => {
				this.setStatus('搜索失败');
				console.log('Fetch Error : %S', err);
				reject(err);
			})
		})
	}

	//播放歌单
	playlist(id) {
		return new Promise((resolve, reject) => {
			fetch(this.api_url + 'playlist/detail?id=' + id).then(res => {
				res.json().then((data) => {
					var arr = [];
					data.playlist.tracks.forEach((ele) => {
						arr.push({
							id: ele.id,
							title: ele.name,
							name: ele.ar[0].name
						});
					})
					this.musicList = arr;
					resolve();
				})
			}).catch(err => {
				this.setStatus('获取歌单失败');
				reject(err);
			});
		})
	}

	//收音机
	fm() {
		return new Promise((resolve, reject) => {
			fetch('/radio.json').then(res => {
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
					this.musicList = arr;
					resolve();
				})
			}).catch(err => {
				reject(err);
			})
		})
	}

	load() {
		if (this.musicList.length == 0) return;

		this.video.onended = () => {
			console.log('play end');
			this.next();
		}

		if (this.isLoading) return;
		this.isLoading = true;
		var obj = this.musicList[this.musicIndex];

		var video = this.video;

		//支付m3u8格式
		if (obj['m3u8']) {
			return new Promise((resolve, reject) => {
				home.text.start();
				this.isLoading = false;
				if (Hls.isSupported()) {
					var hls = new Hls();
					hls.loadSource(obj['m3u8']);
					hls.attachMedia(video);
					hls.on(Hls.Events.MANIFEST_PARSED, () => {
						this.play();
						resolve();
					});
					hls.on(Hls.Events.ERROR, (event, data) => {
						console.warn(data);

						switch (data.details) {
							case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
							case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
							case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
								this.next();
								break;
						}

						if (data.fatal) {
							//console.log('fatal error :' + data.details);
							switch (data.type) {
								case Hls.ErrorTypes.MEDIA_ERROR:
									this.next();
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
			fetch(this.api_url + 'music/url?id=' + obj.id).then(res => {
				res.json().then(data => {
					//console.log(data);
					var url = data.data[0].url;
					if (url) video.src = url;
					else this.next();
					//this.play();

					this.isLoading = false;
					resolve();

					//获取歌词					
					fetch(this.api_url + 'lyric?id=' + obj.id).then(res => {
						res.json().then((data) => {

							home.text.stop();
							try {
								this.lrc = new Lrc(data.lrc.lyric, (line, extra) => {

								});
							} catch (ex) {
								home.text.start();
								this.lrc = null;
							}

						})
					}).catch(err => {
						home.text.start();
						this.lrc = null;
					})
				})

			}).catch(err => {
				this.setStatus('获取音乐失败');
				console.log('Fetch Error : %S', err);
				this.isLoading = false;
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

		setTimeout(() => {
			//发送状态信息到服务器
			home.http_os('setStatus', {
				MusicTitle: this.title,
				MusicStatus: this.status,
				MusicUrl: this.url,
				MusicTime: this.optime
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
