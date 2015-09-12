/**
 * @fileoverview 弹层定位方法
 * 		注意：调用此方法前，必须是待定位层和定位参考容器的display不为null的情况下
 * @version 1.0 | 2015-08-15 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 弹层定位方法
 * @example
 * requirejs(['layer/positionBomb'],function($positionBomb){
 * 	 var pos = new $positionBomb({layer:层dom节点});
 * });
 * */
define(['$','compatible/csssuport','evt/winresize','evt/winscroll','evt/resize','evt/scroll'],function($,$csssuport,$winresize,$winscroll,$resize,$scroll){
	//判断是否可以使用position:fixed方式定位
    var canFix = $csssuport.fixed;
	/**
	 * 定位算法 
	 */
	function setpos(domopt,posopt){
		console.log('开始定位');
		var cssopt = {},layer = domopt.layer,offcon = domopt.offcon;
		var marginLeft = 0, marginTop = 0;
		if(domopt.position == 'absolute'){
			marginLeft = offcon.scrollLeft();
			marginTop = offcon.scrollTop();
		}
		switch (posopt.mode){
			case 'c': //居中定位
				marginLeft -= (layer.outerWidth()/2+config.offset[0]);
				marginTop -= (layer.outerHeight()/2+config.offset[1]);
				cssopt.top = '50%';
				cssopt.left = '50%';
				break;
			case 'full': //满屏定位，占满整个定位容器
				cssopt.top = '0';
				cssopt.left = '0';
				cssopt.bottom = '0';
				cssopt.right = '0';
				break;
		}
		cssopt.marginLeft = marginLeft+'px';
		cssopt.marginTop = marginTop+'px';
		layer.css(cssopt);
		console.log('结束定位');
	}
	/**
	 * 定位类
     * @param {JSON} doms 定位dom相关信息
     * 		{
     * 			layer: null, //{JQueryElement|String节点选择器} 待定位层节点
				offcon: window //{JQueryElement|String节点选择器} 定位参考容器,默认是window
     *      }
     * @param {JSON} config 层定位配置参数，默认信息及说明如下posopt代码处
	 */
	function position(doms,config){
		if(arguments.length == 0){
			throw new Error('必须传入相关定位的dom参数');
		}
		var domopt = $.extend({
			layer: null, //待定位层节点
			offcon: window, //定位容器
			offpage: true //说明相对于当前页面定位
		},doms || {});
		if(domopt.layer && typeof domopt.layer == 'string'){
			domopt.layer = $(domopt.layer);
		}
		if(!domopt.layer || domopt.layer.size() == 0){
			throw new Error('传入的定位层节点无效');
		}
		if(!domopt.offcon || $.isWindow(domopt.offcon)){
			domopt.offcon = $(window);
		}else{
			domopt.offcon = $(domopt.offcon);
			if(domopt.offcon.size() == 0){
				throw new Error('传入的定位容器节点无效');
			}else{
				var tag = domopt.offcon.get(0).tagName.toLowerCase();
				if(tag == 'body' || tag == 'html'){
					domopt.offcon = $(window);
				}else{
					domopt.offpage = false;
				}
			}
		}
		var posopt = $.extend({
			fixed: true, //是否将弹层始终定位在可视窗口区域，默认为true
			mode: 'c', //定位模式，枚举。c:中间
			offset: [0,0] //定义后偏移尺寸 [x轴,y轴]。对于mode是full的模式无效
		},config || {});
		var that = this;
		//设置基本定位信息
		if(domopt.offpage && posopt.fixed && canFix){ //如果定位容器是当前页面、固定定位、可使用fixed定位。则用fixed定位
			domopt.position = 'fixed';
		}
		else{ //不管定位容器是body还是其他容器。如果是absolute，都得监听resize和scroll事件
			domopt.position = 'absolute';
			var listencall = {
				call: function(){
					console.log('触发resize或scroll');
					that.setpos();
				}
			};
			if(domopt.offpage){
				console.log('相对于页面定位');
				$winresize.listen(listencall);
				$winscroll.listen(listencall);
			}
			else{
				console.log('相对于其他容器定位');
				var resize = new $resize(domopt.offcon);
				resize.listen(listencall);
				var scroll = new $resize(domopt.offcon);
		 		scroll.listen(listencall);
			}
		}
		this.domopt = domopt; //dom参数
		this.posopt = posopt; //定位参数
		domopt.layer.css('position',domopt.position);
	};
	/**
	 * 进行定位
	 * @return {Boolean} 是否定位成功
	 */
	position.prototype.setpos = function(){
		if(this.domopt.layer.css('display') == 'none' || this.domopt.offcon.css('display') == 'none'){
			return false;
		}
		else{
			setpos(this.domopt,this.posopt);
			return true;
		}
	};
	return position;
});
