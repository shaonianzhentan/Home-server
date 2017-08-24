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
	ShowMsg(msg) {
		this.ShowTips(msg);
	}

	ShowTips(msg) {
		Messenger().post(msg);
	}

	PlayMsg(msg) {
		var _self = this;
		var vcn = 'yefang',
			ssb_param = { "appid": '577ca2ac', "appkey": "9a77addd1154848d", "synid": "12345", "params": "ent=aisound,appid=577ca2ac,aue=lame,vcn=" + vcn };

		return new Promise((resolve, reject) => {
			_self.session.start(ssb_param, msg, function (err, obj) {
				
				_self.ShowTips(msg);
				
				var audio_url = audioPalyUrl + obj.audio_url;
				if (audio_url != null && audio_url != undefined) {
					_self.home.music.set(audio_url).then(() => {
						resolve();
					})
				}else{
					resolve();
				}
			});

		})
	}
}