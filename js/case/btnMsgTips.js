/**
 * * @fileoverview 对于点击按钮，触发异步交互需要等待的这类应用场景，统一处理状态显示。
 * @version 1.0.0 | 2015-10-27 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 各种状态处理方法
 * @example
 *   requirejs(['base/btnMsgTips'],function($btnMsgTips){
    	node.click(function(){
    		$btnMsgTips.start($(this),'loading'); //开始交互
    		$btnMsgTips.end($(this),'loading'); //结束交互
    		$btnMsgTips.error('投票失败'); //错误提示
    	});
     });
 */
define(['base/checkDataType'],function($checkDataType){
	return {
		/**
		 * 开始交互，给node添加classname 
		 * @param {Element} *node
		 * @param {String} *classname
		 */
		start: function(node,classname){
			if(arguments.length == 2 && $checkDataType.isValidJqueryDom(node) && classname != ''){
				node.addClass(classname);
			}
		},
		/**
		 * 结束交互，给node移除classname 
		 * @param {Element} *node
		 * @param {String} *classname
		 */
		end: function(node,classname){
			if(arguments.length == 2 && $checkDataType.isValidJqueryDom(node) && classname != ''){
				node.removeClass(classname);
			}
		},
		/**
		 * 交互失败，信息提示 
 		 * @param {String} msg 提示信息
		 */
		error: function(msg){
			msg = msg || '操作失败，请稍后再试';
			alert(msg);
		}
	};
});
