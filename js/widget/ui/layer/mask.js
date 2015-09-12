/**
 * @fileoverview 遮罩类——创建遮罩并进行相关控制
 * @version 1.0 | 2015-08-15 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 遮罩对象
 * @example
 * requirejs(['$','layer/mask'],function($,$mask){
 * 	 var mask = new $mask($('body'));
 *   mask.show(); //显示遮罩
 *   mask.hide(); //隐藏遮罩
 *   mask.mask; //遮罩dom节点对象
 *   mask.container; //遮罩容器
 *   mask.destroy(); //销毁遮罩
 * });
 * */
define(['$','layer/positionBomb'],function($,$positionBomb){
	/**
	 * 遮罩类——创建遮罩dom并添加到指定容器中 
     * @param {Element} container 遮罩存放容器，默认为$('body')
     * @param {JSON} config 遮罩配置参数，默认信息及说明如下opt代码处
	 */
	function mask(container,config){
		container = container || $('body');
		var opt = $.extend({
			bgcolor: '#222', //背景色
			zIndex: 1, //遮罩z-index
			opacity: 0.5, //遮罩透明度
			show: false //创建遮罩后默认是否显示
		},config || {});
		var cssstr = 'background:'+opt.bgcolor+';'+opt.show?'':'display:none;'+'opacity:'+opt.opacity+';z-index'+opt.zIndex+';';
		this.container = container; //遮罩容器
		this.mask = $('<div style="'+cssstr+'"></div>');
		this.mask.appendTo(container);
		this.pos = new $positionBomb({layer:this.mask},{mode:'full'});
	}
	/**
	 * 显示遮罩 
	 */
	mask.prototype.show = function(){
		this.mask.show();
		this.pos.setpos();
	};
	/**
	 * 隐藏遮罩 
	 * @param {Boolean} destroy 是否销毁，默认不销毁
	 */
	mask.prototype.hide = function(destroy){
		if(destroy){
			this.destroy();
		}
		else{
			this.mask.hide();
		}
	};
	/**
	 * 销毁遮罩 
	 */
	mask.prototype.destroy = function(){
		if(this.mask != null){
			this.mask.remove();
			this.mask = null;
		}
	};
	return mask;
});
