/**
 * @fileoverview 弹层定位方法
 * 		注意：调用此方法前，必须是待定位层的display不为null的情况下
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
		var cssopt = {},layer = domopt.layer,offcon = domopt.offcon;
		layer.css('position',domopt.position);
		var marginLeft = 0, marginTop = 0;
		if(domopt.position == 'absolute'){
			marginLeft = offcon.scrollLeft();
			marginTop = offcon.scrollTop();
		}
		switch (posopt.mode){
			case 'c': //居中定位
				marginLeft -= (layer.outerWidth()/2+posopt.offset[0]);
				marginTop -= (layer.outerHeight()/2+posopt.offset[1]);
				cssopt.top = '50%';
				cssopt.left = '50%';
				break;
			case 'full': //满屏定位，占满整个定位容器。本来不设置width和height，设置了right和bottom。但是偶发margin不起作用，此时读取的元素尺寸为0.
			    cssopt.width = '100%';
                cssopt.height = '100%';
				cssopt.top = '0';
				cssopt.left = '0';
				break;
		}
		cssopt.marginLeft = marginLeft+'px';
		cssopt.marginTop = marginTop+'px';
		layer.css(cssopt);
	}
	/**
	 * 定位类
     * @param {JSON} doms 定位dom相关信息
     * 		{
     * 			layer: null //{JQueryElement|String节点选择器} 待定位层节点
     *      }
     * @param {JSON} config 层定位配置参数，默认信息及说明如下posopt代码处
	 */
	function position(doms,config){
		//参数检测与设置
		if(arguments.length == 0){
			throw new Error('必须传入相关定位的dom参数');
		}
		var domopt = $.extend({
			layer: null, //待定位层节点
			offpage: false //说明相对于当前页面定位
		},doms || {});
		if(domopt.layer && typeof domopt.layer == 'string'){
			domopt.layer = $(domopt.layer);
		}
		if(!domopt.layer || domopt.layer.size() == 0){
			throw new Error('传入的定位层节点无效');
		}
		var posopt = $.extend({
			fixed: true, //是否将弹层始终定位在可视窗口区域，默认为true
			mode: 'c', //定位模式，枚举。c:中间
			offset: [0,0] //定义后偏移尺寸 [x轴,y轴]。对于mode是full的模式无效
		},config || {});
		var that = this;
		//初步检测定位参考容器
		domopt.offcon = domopt.layer.offsetParent();
		var tagname = domopt.offcon.get(0).tagName.toLowerCase();
		if(tagname == 'body' || tagname == 'html'){ //说明相对于页面定位
		    domopt.offcon = $('body');
			domopt.offpage = true;
		}
		if(domopt.offpage && posopt.fixed && canFix){ //如果定位容器是当前页面、固定定位、可使用fixed定位。则用fixed定位
			domopt.position = 'fixed';
		}
		else{ 
			domopt.position = 'absolute';
			if(posopt.fixed) { //如果固定定位，则监听scroll事件
			    var listencall = {
                    call: function(){
                        that.setpos();
                    }
                };
                if(domopt.offpage){
                    $winscroll.listen(listencall);
                }
                else{
                    var scroll = new $resize(domopt.offcon);
                    scroll.listen(listencall);
                }
			}
		}
		this.domopt = domopt; //dom参数
		this.posopt = posopt; //定位参数
		this.destroy = function(){ //组件销毁方法
			this.domopt = null;
			this.posopt = null;
			if(listencall){
				if(domopt.offpage){
					$winscroll.unlisten(listencall);
				}else{
					scroll.unlisten(listencall);
				}
			}
		};
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
