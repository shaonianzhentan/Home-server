var audioPalyUrl = "http://h5.xf-yun.com/audioStream/";
/**
  * 初始化Session会话
  * url                 连接的服务器地址（可选）
  * reconnection        客户端是否支持断开重连
  * reconnectionDelay   重连支持的延迟时间   
  */

class Media {
	constructor(home) {
		this.home = home;
		this.audio = document.createElement('audio');
		this.audio.style.display = 'none';
		this.audio.controls = true;
		this.audio.onend = function () {

		}
		this.audio.oncanplay = function () {
			this.play();
		}

		document.body.appendChild(this.audio);

		this.session = new IFlyTtsSession({
			'url': 'ws://h5.xf-yun.com/tts.do',
			'reconnection': true,
			'reconnectionDelay': 30000
		});


		Messenger.options = {
			extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
			theme: 'flat'
		}
	}
	ShowMsg(msg, time, callback) {
		var _self = this;
		try {

			var vcn = 'yefang',
				ssb_param = { "appid": '577ca2ac', "appkey": "9a77addd1154848d", "synid": "12345", "params": "ent=aisound,appid=577ca2ac,aue=lame,vcn=" + vcn };

			this.session.start(ssb_param, msg, function (err, obj) {
				var audio_url = audioPalyUrl + obj.audio_url;
				if (audio_url != null && audio_url != undefined) {
					_self.play(audio_url);
				}
			});

			//play(msg, 'vivixiaoxin')
			//play(msg, 'yefang');
			/*
			  this.audio.src="http://tts.baidu.com/text2audio?idx=1&tex="+msg+"&cuid=baidu_speech_demo&cod=2&lan=zh&ctp=1&pdt=1&spd=5&per=0&vol=5&pit=5";
			  this.audio.play();	
			*/
		} catch (ex) {

		}

		this.ShowTips(msg);

		if (callback != null) callback();
	}

	play(url) {
		this.audio.src = url;
	}

	ShowTips(msg) {
		Messenger().post(msg);
	}
}