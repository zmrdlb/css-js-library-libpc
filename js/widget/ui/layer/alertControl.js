﻿/**
 * @fileoverview alert的工厂控制器，集成baseControl
 * 应用场景：针对频繁更改弹层里某些节点的内容，以及更改点击"确定"按钮后的回调事件
 * @version 1.0.0 | 2016-01-26 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['layers/alertControl'],function($alertControl){
		var curlayer = new $alertControl();
		curlayer.setconfig({
			alert: {
				frametpl: [
				    '<div node="title"></div>',
					'<div node="content"></div>',
					'<div><a href="javascript:;" node="ok">好的</a></div>'
				].join('')
			}
		});
		curlayer.getlayerobj()； //layer/alert类对象
		curlayer.show({
            content: '您还未登陆'
        },{
            ok: function(){
                console.log('点击好的');
            }
        });
   });
 * */
define(['layers/alert','layers/baseControl','inherit/extendClass'],function($alert,$baseControl,$extendClass){
    /**
     * alert工厂控制器
     */
	function AlertControl(){
		AlertControl.superclass.constructor.call(this);
		this._okcal = function(){}; //点击ok的回调私有存储器
		this._funarr = ['ok']; //可控制的回调方法名
	}
	$extendClass(AlertControl,$baseControl);
	/**
	 * 获取alert弹层
	 */
	AlertControl.prototype.getlayerobj = function(){
		var that = this;
		if(this._layerobj == null){
			this._layerobj = new $alert(this._defaultopt);
			this._layerobj.okcal.add(function(e){
				that._okcal();
			});
		}
		return this._layerobj;
	};
	/**
	 * 销毁alert弹层
	 */
	AlertControl.prototype.destroy = function(){
		AlertControl.superclass.destroy.call(this);
		this._okcal = function(){};
	};
	return AlertControl;
});