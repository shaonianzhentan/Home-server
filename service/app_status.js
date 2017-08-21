//程序运行的所有状态，都在这里
const os = require('./os.js');

var APP_STATUS = {
	init: (obj) => {
		wsend = obj.wsend;
	},
	//系统状态
	OS_STATUS: {
		ip: os.ip,
		BootTime: (new Date()).toLocaleString(),
		ServerTime: (new Date()).toLocaleString(),
		infraredSwitch: '开',
		volume: '',
		screenshots: '',
		sensor_temperature: '', //温度
		sensor_humidity: '' //湿度
	}
}

//监听变量
Object.defineProperty(APP_STATUS.OS_STATUS, 'sensor_temperature', {
	get: function () {
		return this._sensor_temperature;
	},
	set: function (newValue) {
		this._sensor_temperature = newValue;
		//推送到界面		
	}
});

//监听红外线开关
Object.defineProperty(APP_STATUS.OS_STATUS, 'infraredSwitch', {
	get: function () {
		return this._infraredSwitch;
	},
	set: function (newValue) {
		this._infraredSwitch = newValue;
		//推送到界面
		wsend({ type: 'program', result: 'speak', msg: '红外控制' + newValue });
	}
});

module.exports = APP_STATUS;