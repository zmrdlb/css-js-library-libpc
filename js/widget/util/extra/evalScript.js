/**
 * @fileoverview 手动执行js代码
 * @version 1.0 | 2015-07-01 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['extra/evalScript'],function($evalScript){
 * 	 $evalScript('console.log(1)');
 * });
 * */
define(function(){
	return function(src) {
	    if (window.execScript) {
	        window.execScript(src);
	        return;
	    }
	    window.eval.call(window,src);
	};
});
