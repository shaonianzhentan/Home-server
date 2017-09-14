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
			"其实地上本没有路，走的人多了，也便成了路", "墨写的谎言掩盖不了血写的事实", "不在沉默中爆发，就在沉默中灭亡", "哀其不幸，怒其不争", "度尽劫波兄弟在，相逢一笑泯恩仇", "岂有豪情似旧时,花开花落两由之", "待我成尘时，你将见我的微笑", "心事浩茫连广宇，于无声处听惊雷   ", "死者倘不埋在活人的心中,那就真的死掉了.", "寄意寒星荃不察，我以我血荐轩辕", "事实是毫无情面的东西，它能够将空言打得粉碎", "无情未必真豪杰，怜子如何不丈夫", "做一件事，无论大小，倘无恒心，是很不好的 ", "横眉冷对千夫指，俯首甘为孺子牛   ", "没有思索和悲哀，就不会有文学", "自由固不是钱所能买到的，但能够为钱而卖掉", "人最苦的是梦醒了却无路可走", "读死书是害己，一开口就害人", "人生得一知己足矣，斯世当以同怀视之", "谦以待人，虚以接物", "删夷枝叶的人，决定得不到花果", "震骇一时的牺牲，不如深沉的韧性的战斗", "不满足是向上的车轮", "有一分热，发一分光", "人必生活着，爱才有所附丽", "凡事总需研究，才会明白", "悲剧就是把美好的东西毁灭给人看", "扶着叛徒的尸体哭泣的人，才是真脊梁", "人生最大的痛苦莫过于梦醒时发现无路可走", "其实先驱者本是容易变成绊脚石的", "只要能培一朵花，就不妨做做会朽的腐草", "悲剧是将人生有价值的东西毁灭给人看", "忍看朋辈成新鬼，怒向刀丛觅小诗", "意图生存，而太卑怯，结果就得死亡", "人生得一知已足矣，斯世当以同怀视之", "无穷的远方，无数的人们，都和我有关", "那是孤独的雪，是死掉的雨，是雨的精魂！", "躲进小楼成一统,管他冬夏与春秋.", "新年对我来说，就是离死亡又近了一年", "人生得一知己足矣", "石在，火种是不会绝的.", "改造自己，总比禁止别人来得难", "与其找糊涂导师，倒不如自己走", "单是说不行，要紧的是做", "生活太安逸了，工作就被生活所累", "辱骂与恐吓不是战斗", "血沃中原肥劲草，寒凝大地发春华", "一定要有自信的勇气，才会有工作的勇气", "虫蛆也许是不干净的，但它们并没有自鸣清高", "一个人如果不活在别人心里，那他就真的死了", "有一游魂，化为长蛇，不以啮人，自啮其身", "旧朋云散尽，余亦等轻尘", "爱情必须时时更新、生长、创造", "绝望正与希望相同，大恨恰恰是大爱的起点", "你可知道“茴”字有几种写法？", "抉心自食,欲知本味,创痛酷烈,本味何能知?", "革命是要人生，不是要人死！", "墨写的谎说，决掩不住血写的事实", "人类的悲欢并不相通，我只觉得他们吵闹", "梦想家的缺点是害怕命运", "史家之绝唱，无韵之离骚", "人类是一种使思想开花结果的植物", "他们应该有新的生活,为我们所未经生活过的.", "虽生之日，犹死之年", "我好象一只牛，吃的是草，挤出的是奶、血", "梦是好的，否则，钱是要紧的", "唯独革命家，无论他生或死，都能给大家以幸福", "不知怎地我们便都笑起来，是互相的嘲弄和悲哀", "中国的哭和拜，什么时候才完呢？", "凡事以理想为因,实行为果", "读书应自己思索，自己做主", "无论她有多大错，她哭的一霎那，都是我的错", "长歌当哭，是必须在痛定之后的", "残象，已使我目不忍视\n流言，犹使我耳不忍闻", "倘只看书，便变成书橱", "人生最苦痛的是梦醒了无路可走", "不满是向上的车轮", "言太夸则实难副，\n志极高而心不专", "“我们先前比你阔多啦，你算是什么东西！”", "人何必增添末路的人的苦恼", "飞蛾死在灯上", "此后如竟没有炬火：我便是唯一的光", "自杀是卑怯的行为", "仁厚黑暗的地母呵，愿在你怀里永安她的魂灵！", "谣言世家的子弟是以谣言杀人，也以谣言被杀的", "倘有陌生的声音叫你的名字，你万不可答应它", "倘能生存，我当然仍要学习", "可是我实在无话可说我只觉得所住的并非人间。", "心事浩茫连广宇，于无声处听惊雷", "欲温而和畅，不欲察察而明切也", "读书人窃书不为偷", "生活如花，姹紫嫣红；", "我向来不惮以最坏的恶意揣测中国人", "唱戏凭嗓子，锄地凭膀子", "让他们怨恨去，我一个都不宽恕", "生活太安逸了，工作就会被生活所累 ", "我心里想着两个人，一个是他，另一个还是他", "金子做了骨髓，也还是站不直", "要用眼睛去读社会这部书", "你的心意我无从知晓，\n但我势必选择孤独上路", "激烈得快的，也平和得快，甚至于也颓废得快", "中国人越是懦夫越会欺负比自己更加弱小的人群", "时光永是流逝，街市依旧太平", "唯沉默是最高的轻蔑", "从喷泉里出来的都是水，从血管里出来的都是血", "不革新，是生存也为难的", "叭儿狗往往比它的主人更严厉", "早已成为渣滓，只值得烦厌和唾弃", "无怨的恕，说谎罢了", "有存在，便有希望有希望，便有光明", "从来如此，就对吗？", "花开花落两由之", "自由固不是钱所买到的，但能够为钱而卖掉", "红肿之处,艳若桃李;溃烂之时,美如醴酪", "取下假面，真诚地，深入地，大胆地看取人生", "人生最大的痛苦是梦醒了无路可走", "我不是高僧，没有涅槃的自由", "晴，大风吹雪盈空寂", "牛羊才成群结队，猛兽都是独行", "奴才总不过是寻人诉苦只要这样，也只能这样。", "游戏是儿童最正当的行为， 玩具是儿童的天使", "中国是世界上国耻纪念最多的国家", "沉默就是最高的轻蔑", "诚信为人之本", "一直走，不回头", "无穷远的地方，无数的人，都与我有关", "日暮客愁集，烟深人语喧", "两间余一卒，荷戟独彷徨", "可惜他们之中很有不少是不平家，不像批评家"
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
			quality:'',
			pm25:'',
			notice:''
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
				this.weather.pm25=obj.pm25;
				this.weather.quality=obj.quality;
				this.weather.notice = obj.forecast[0].notice;
				console.log(res.data);
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
	app.online = true;
}