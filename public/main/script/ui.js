/***************菜单***********************/
$('.BackHome').click(function () {
	location.reload();
});

//$('html,body').css('cursor', 'url(favicon.ico),auto');
$('.linkAction').click(function () {
	var type = $(this).data('type');
	switch (type) {
		case 'cursor':
			var cursor = $('html,body').css('cursor');
			if (cursor == 'auto') {
				cursor = 'url(favicon.ico),auto';
			} else {
				cursor = 'auto';
			}
			$('html,body').css('cursor', cursor);
			break;
	}
});

/***************动画插件定义***********************/
$.fn.extend({
	animateCss: function (animationName) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		$(this).addClass('animated ' + animationName).one(animationEnd, function () {
			$(this).removeClass('animated ' + animationName);
		});
	}
});

/***************文本显示***********************/
class HomeText {
	constructor() {
		this.textList = [
			"墨写的谎言掩盖不了血写的事实", "哀其不幸，怒其不争", "待我成尘时，你将见我的微笑", "没有思索和悲哀，就不会有文学", "人最苦的是梦醒了却无路可走", "读死书是害己，一开口就害人", "谦以待人，虚以接物", "删夷枝叶的人，决定得不到花果", "不满足是向上的车轮", "有一分热，发一分光", "人必生活着，爱才有所附丽", "凡事总需研究，才会明白", "人生得一知己足矣", "石在，火种是不会绝的.", "改造自己，总比禁止别人来得难", "与其找糊涂导师，倒不如自己走", "单是说不行，要紧的是做", "辱骂与恐吓不是战斗", "旧朋云散尽，余亦等轻尘", "爱情必须时时更新、生长、创造", "你可知道“茴”字有几种写法？", "革命是要人生，不是要人死！", "梦想家的缺点是害怕命运", "史家之绝唱，无韵之离骚", "虽生之日，犹死之年", "梦是好的，否则，钱是要紧的", "凡事以理想为因,实行为果", "读书应自己思索，自己做主", "长歌当哭，是必须在痛定之后的", "倘只看书，便变成书橱", "人生最苦痛的是梦醒了无路可走", "不满是向上的车轮", "人何必增添末路的人的苦恼", "飞蛾死在灯上", "自杀是卑怯的行为", "倘能生存，我当然仍要学习", "欲温而和畅，不欲察察而明切也", "读书人窃书不为偷", "生活如花，姹紫嫣红；", "唱戏凭嗓子，锄地凭膀子", "让他们怨恨去，我一个都不宽恕", "金子做了骨髓，也还是站不直", "要用眼睛去读社会这部书", "时光永是流逝，街市依旧太平", "唯沉默是最高的轻蔑", "不革新，是生存也为难的", "叭儿狗往往比它的主人更严厉", "无怨的恕，说谎罢了", "从来如此，就对吗？", "花开花落两由之", "我不是高僧，没有涅槃的自由", "晴，大风吹雪盈空寂", "牛羊才成群结队，猛兽都是独行", "沉默就是最高的轻蔑", "诚信为人之本", "一直走，不回头", "日暮客愁集，烟深人语喧", "两间余一卒，荷戟独彷徨"
		];
		this.textIndex = 0;
		this.timer = null;
		this.start();
	}

	show(msg) {
		if (this.timer) clearInterval(this.timer);
		$('#welcome').text(msg).animateCss('fadeInDown');
	}

	start() {
		if (this.timer) clearInterval(this.timer);
		var textArr = this.textList,
			textIndex = this.textIndex;

		this.timer = setInterval(() => {
			$('#welcome').text(textArr[textIndex]).animateCss('fadeInDown');
			textIndex += 1;
			if (textIndex >= textArr.length) {
				textIndex = 0;
			}
		}, 5000);
	}

	stop() {
		clearInterval(this.timer);
	}
}

var app = new Vue({
	el: '#MainPage',
	data: {
		weather: {
			wendu: '',
			shidu: '',
			quality: '',
			pm25: '',
			notice: ''
		},
		city: '上海',
		list: [],
		date: '',
		time: '',
		online: false,
		ip: '0.0.0.0'
	},
	watch: {
		online: (newVal, oldVal) => {
			if (newVal) {
				Vue.http.post('/os', {
					key: 'status'
				}).then((res) => {
					var obj = res.body;
					app.ip = obj.ip;
					console.log(obj.ip);
				})
			}
		}
	},
	methods: {
		init() {
			app.online = navigator.onLine;

			var index = 0;
			setInterval(() => {

				this.date = Date.today().toString('yyyy年M月d日，dddd');
				this.time = new Date().toString('HH : mm : ss');
				if (index == 1800) {
					index = 0;
					this.get();
				}
				index++;

			}, 1000);
			this.get();
		},
		get() {
			this.$http.get('http://jiluxinqing.top:4000/weather?py=shanghai').then(function (res) {
				var obj = res.data;
				this.city = obj.city;
				var arr = [];
				for (var i = 0; i < 3; i++) {
					var item = obj.data[i]
					item.pic = item.pic.replace('tianqibig', 'tqicon1');
					arr.push(item);
				}
				this.list = arr;
				//console.log(res.data);
			}, function (error) {

			});

			this.$http.get('http://www.sojson.com/open/api/weather/json.shtml?city=上海').then(function (res) {
				var obj = res.data.data;
				this.weather.wendu = obj.wendu;
				this.weather.shidu = obj.shidu;
				this.weather.pm25 = obj.pm25;
				this.weather.quality = obj.quality;
				this.weather.notice = obj.forecast[0].notice;
				//console.log(res.data);
			}, function (error) {

			});
		}
	}
})

app.init();


//离线
window.onoffline = function () {
	app.online = false;
}
//在线
window.ononline = function () {
	setTimeout(() => {
		app.online = true;
	}, 5000)
}