var script = document.createElement("script")
script.src="http://cdn.bootcss.com/datejs/1.0/date.min.js";
script.onload = function(){
	var timer = setInterval(function(){
		document.querySelector(".order").innerHTML = "<font size='4'>" + Date.today().toString('yyyy年M月d日，dddd') + "</font><br/>" + new Date().toString('HH - mm - ss') +"";
	},1000);
}
document.body.appendChild(script);
//clearInterval(timer);

//每一个小时，刷新页面，更新天气信息
setTimeout(function(){
	location.reload();
},1000 * 60 * 60);