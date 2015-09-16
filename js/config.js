(function(){
	/**
	* 1. baseUrl不建议使用相对路径，因为此时是相对于config.js当前所在的页面路径。一般页面和js,css不放在一起，所以不建议填写相对路径。
	* 2. 写入buildcode参数可以访问打包后build中的代码。页面上js,css的路径也可通过后端技术人员的配合，按照此规则进行适配。
	*/
	var baseUrl = 'http://www.libpc.com/js/'; //指向开发环境
	if(/buildcode/.test(location.search)){
		baseUrl = 'http://www.libpc.com/build/js/'; //指向自己测试打包后代码的路径
	}
	//设置requirejs的相关配置
	var mod = {
		baseUrl: baseUrl, //这个是相对于当前静态页面所处的目录
		paths: {
			'jquery': baseUrl+'core/jquery/jquery-1.11.3.min', //采用绝对路径方式引用，js打包不将此文件打包
			'io': 'widget/io',
			'media': 'widget/media',
			'json': 'widget/util/json',
			'channel': 'widget/util/channel',
			'layer': 'widget/ui/layer',
			'inherit': 'widget/util/inherit',
			'evt': 'widget/util/evt',
			'compatible': 'widget/util/compatible',
			'bigpipe': 'widget/bigpipe',
			'load': 'widget/util/load',
			'base': 'widget/util/base',
			'classdesign': 'widget/util/classdesign',
			'tpl': 'widget/util/tpl'
		}
	};
	requirejs.config(mod);
})();

define('$',['jquery'],function($){
	return $;
});
