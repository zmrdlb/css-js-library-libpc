/**
 * @fileoverview 
 *   窗口滚动事件监听
 * @author mingrui| mingrui@staff.sina.com.cn
 * @version 1.0 | 2015-08-27
 * @return 滚动监听对象
 * @example
 * 	requirejs(['$','evt/winscroll'],function($,$winscroll){
 * 		$winscroll.listen({call:function(){console.log('窗口scroll');}});
 *  });
 */
define(['$','evt/scroll'],function($,$scroll){
	var scroll = new $scroll($(window));
	return scroll;
});
