class Clock {
	constructor(home) {
		this.home = home;
		this.clockToggle = 1;
		this.ClockDataAlarm = [];
		if (localStorage["ClockData-Alarm"]) {
			this.ClockDataAlarm = JSON.parse(localStorage["ClockData-Alarm"]);
		}
		this.load();
	}

	load() {
		var _self = this;
		$.post("http://localhost:8888/clock", { key: "get" }, function (data) {
			_self.ClockDataAlarm = data;
			localStorage["ClockData-Alarm"] = JSON.stringify(data);
		});
	}

	start() {
		if (this.clockToggle) {
			var _self = this;
			var today = new Date()
				, h = today.getHours()
				, m = today.getMinutes()
				, s = today.getSeconds();

			try {
				if (this.ClockDataAlarm.length == 0) return;
				//判断当前时间是否在数据库中
				this.ClockDataAlarm.forEach(function (ele) {
					var arr = ele.time.split(':');
					if (arr[0] == h && arr[1] == m && s == 0) {
						if (ele.voice.indexOf('http://') == 0) _self.home.media.play(ele.voice);
						else _self.play(ele.voice);
					}
				});
			} catch (ex) {
				console.log(ex);
			}
		}
	}
	//报时
	play(msg) {
		if (msg == null) msg = "";
		var today = new Date();
		this.home.media.ShowMsg(msg + "现在开始报时啦 " + today.getHours() + "点" + today.getMinutes() + "分");
	}
}