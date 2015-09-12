/**
 * Copyright (c) 2015 - 2016, Sina Inc. All rights reseved.
 * @fileoverview 
 *   给指定元素创建scroll事件监听类
 * @author mingrui| mingrui@staff.sina.com.cn
 * @version 1.0 | 2015-08-27
 * @return scroll类
 * @example
 *  requirejs(['$','evt/scroll'],function($,$scroll){
 * 		var scroll = new $scroll($(window));
 * 		scroll.listen({call:function(){console.log('窗口scroll');}});
 *  });
 */
define(['$','evt/delayevt'],function($,$delayevt){
	/**
	 * @param {Element} *node 元素节点
	 * @param {JSON} config 延迟配置。同evt/delayevt类的初始化参数 
	 */
	function scroll(node,config){
		if(node.size() == 0){
			return;
		}
		this.delay = new $delayevt(config);
		var that = this;
		node.on('scroll',function(){
			that.delay.start();
		});
	}
	/** 
	 * 添加scroll事件监听
     * @param {JSON} opt 
     * {
     *   call: function//事件发生时触发的回调
	 *   filter: function //过滤条件。filter返回为true则才触发call。不填此项则默认不过滤
	 * }
     */
	scroll.prototype.listen = function(opt){
		this.delay.subscribe(opt);
	};
	return scroll;
});
