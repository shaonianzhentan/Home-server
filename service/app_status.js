//程序运行的所有状态，都在这里
const os = require('./os.js');

class StatusOS {
	constructor() {
		//私有变量
		this._infraredSwitch = 1;
		this._sensor_temperature = '';



		this.ip = os.ip;
		this.BootTime = (new Date()).toLocaleString();
		this.ServerTime = (new Date()).toLocaleString();
		this.volume = '';
		this.screenshots = '';
		this.sensor_humidity = ''; //湿度
	}

	//温度
	get sensor_temperature() {
		return this._sensor_temperature;
	}
	set sensor_temperature(newValue) {
		this._sensor_temperature = newValue;
		//推送到界面
	}

	//监听红外线开关
	get infraredSwitch() {
		return this._infraredSwitch;
	}

	set infraredSwitch(newValue) {
		this._infraredSwitch = newValue;
		//推送到界面
		wsend({ type: 'program', result: 'speak', msg: '红外控制' + (newValue ? '开' : '关') });
	}
}


module.exports = {
	init: (obj) => {
		wsend = obj.wsend;
	},
	//系统状态
	OS_STATUS: new StatusOS()
}