/***************菜单***********************/
$('.BackHome').click(function () {
	location.reload();
});

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
		this.textList = ['下雨天了怎么办', '我好想你', '不敢打给你', '我找不到原因', '什么失眠的声音', '变得好熟悉', '沉默的场景 做你的代替', '陪我听雨滴', '期待让人越来越沉溺'];
		this.textIndex = 0;
		this.timer = null;
		this.lrc = null;
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

	showlrc(lrc) {
		try {
			if (this.lrc) this.lrc.stop();
			console.log('show lrc');
			this.lrc = new Lrc(lrc, (line, extra) => {
				//console.log(line)
				this.show(line);
			});
			this.lrc.play();
		} catch (ex) {
			this.start();
		}
	}
}

var weatherApp = new Vue({
	el: '#weather-panel',
	data: {
		city: '上海',
		list: [],
		date: '',
		time: ''
	},
	methods: {
		init() {
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
				console.log(res.data);
			}, function (error) {

			});
		}
	}
})

weatherApp.init();



