/*弹层类*/
define(['$','layer/layer','layer/mask','inherit/extendClass','layer/positionBomb'],function($,$layer,$mask,$extendClass,$positionBomb){
	/**
	 * 弹层类——创建并添加到指定容器中
     * @param {Element} container 弹层存放容器，默认为$('body')
     * @param {JSON} config 弹层配置参数 
     * 		{
     * 	       pos:{}, //定位参数，具体说明可见方法layer/positionBomb中的config说明
     *         layer: { //弹层信息参数，具体说明可见方法layer/layer中的config说明。在此基础上进行以下扩展
     * 			  hidedestroy: false //弹层隐藏后是否销毁,true:销毁；false:不销毁。默认为false
     *         },
     * 		   mask: { //遮罩信息参数
     * 			  mask: true, //是否显示遮罩
     *            cmlhide: false //点击遮罩是否关闭弹层
     * 		   }
     *      }
	 */
	function bombLayer(container,config){
		container = container || $('body');
		var that = this;
		config = config || {};
		//初始化基类
		bombLayer.superclass.constructor.call(this,container,$.extend(true,{position:'fixed'},config.layer));
		//创建定位类对象
		this.pos = new $positionBomb({
			layer: that.layer
		},config.pos);
	}
	$extendClass(bombLayer,$layer);
	return bombLayer;
});
