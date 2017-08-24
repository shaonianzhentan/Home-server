/***************菜单***********************/
$('.BackHome').click(function () {
	location.reload();
});

$('.linkAction').click(function () {
	var type = $(this).data('type');
	switch (type) {
		case 'back':
			home.music.wv.goBack();
			break;
		case 'forward':
			home.music.wv.goForward();
			break;
		case 'reload':
			home.music.wv.reload();
			break;
		case 'dev':
			ipcRenderer.send('system', 'dev');
			break;
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

/***************天气预报***********************/
function LoadWeather() {
	var doc = document.querySelector("#weather").contentWindow.document;

	doc.querySelectorAll("a").forEach(function (ele) {
		ele.removeAttribute('target');
		ele.removeAttribute('href');
	});

	var link = doc.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = "http://localhost:8888/weather/weather.css";
	doc.head.appendChild(link);

	var script = doc.createElement("script")
	script.src = "http://localhost:8888/weather/weather.js";
	doc.body.appendChild(script);

}

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

		this.timer = setInterval(function () {
			$('#welcome').text(textArr[textIndex]).animateCss('fadeInDown');
			textIndex += 1;
			if (textIndex >= textArr.length) {
				textIndex = 0;
			}
		}, 5000);
	}

	showlrc(lrc){
		var self = this;
		try {			
			if(this.lrc) this.lrc.stop();
			console.log('show lrc');
			this.lrc = new Lrc(lrc, (line, extra) => {
				//console.log(line)
				self.show(line);
			});
			this.lrc.play();
		} catch (ex) {
			self.start();
		}
	}
}