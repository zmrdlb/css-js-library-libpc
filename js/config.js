(function(){
	/**
	* 1. baseUrl不建议使用相对路径，因为此时是相对于config.js当前所在的页面路径。一般页面和js,css不放在一起，所以不建议填写相对路径。
	* 2. 写入buildcode参数可以访问打包后build中的代码。页面上js,css的路径也可通过后端技术人员的配合，按照此规则进行适配。
	*/
	var baseUrl = 'http://www.libpc.com/js/'; //指向开发环境
	//设置requirejs的相关配置
	var mod = {
		baseUrl: baseUrl, //这个是相对于当前静态页面所处的目录
		paths: {
			'jquery': baseUrl+'core/jquery/jquery-1.11.3.min', //采用绝对路径方式引用，js打包不将此文件打包
			'io': 'widget/io',
			'media': 'widget/media',
			'json': 'widget/util/json',
			'channel': 'widget/util/channel',
			'extra': 'widget/util/extra',
			'layer': 'widget/ui/layer',
			'inherit': 'widget/util/inherit',
			'evt': 'widget/util/evt',
			'compatible': 'widget/util/compatible',
			'bigpipe': 'widget/bigpipe',
			'load': 'widget/util/load',
			'base': 'widget/util/base',
			'classdesign': 'widget/util/classdesign'
		}
	};
	requirejs.config(mod);
})();
/**
 * 定义模块名为$的模块，意为js框架引用。所有的其他js调用js框架均使用define(['$'])来调用。
 * 这样做是为了解决js框架和核心代码库libpc之间的耦合，便于将js框架替换成不是jquery但是api使用方法类似于jquery的 js框架。如替换成zepto等
 */
define('$',['jquery'],function($){
	return $;
});
