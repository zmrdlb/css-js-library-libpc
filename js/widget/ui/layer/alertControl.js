/**
 * @fileoverview alert类创建的控制工厂，一般用于简单的alert信息提示
 * 注意：该alert控制的对象及dom在全局中唯一存在，如果想要创建多个，请使用layer/alert
 * @version 1.0.0 | 2015-09-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['layer/alertControl'],function($alertControl){
		$alertControl.setconfig({
			alert: {
				frametpl: [
				    '<div node="title"></div>',
					'<div node="content"></div>',
					'<div><a href="javascript:;" node="ok">好的</a></div>'
				].join('')
			}
		});
		$alertControl.getalert()； //layer/alert类对象
		$alertControl.show({
            content: '您还未登陆'
        },{
            ok: function(){
                console.log('点击好的');
            }
        });
   });
 * */
define(['layers/alert','base/checkDataType'],function($alert,$checkDataType){
    /**
     * alert工厂模型控制器
     */
	return {
		_alert: null, 
		_defaultopt: {}, //默认alert config配置参数
		_okcal: function(){}, // 点击确定按钮后的回调
		/**
		 *  参数说明请参见layer/alert里面的config说明
		 */
		setconfig: function(config){
			this.destroy();
			this._defaultopt = config;
		},
		/**
		 * 获取当前alert对象 
		 */
		getalert: function(){
			var that = this;
			if(this._alert == null){
				this._alert = new $alert(this._defaultopt);
				this._alert.okcal.add(function(e){
					that._okcal();
				});
			}
			return this._alert;
		},
		/**
		 * 显示弹层 
		 * @param {Object} *txt 文案配置,选填。如果setconfig调用设置的模板中还有其他node="其他值"，
         *      如node="other" 则可自行扩展
		 * {
		 * 	 content {String} node="content"节点里面的html
		 *   title {String} node="title"节点里面的html
		 *   ok {String} node="ok"节点里面的html
		 * }
		 * @param {Object} cal 回调配置
		 * {
		 * 	 ok {Function} 点击确定按钮后的回调
		 * }
		 */
		show: function(txt,cal){
			if(!$checkDataType.isObject(txt)){
				throw new Error('alertControl-show方法txt参数必须是json对象');
			}else{
				if($checkDataType.isObject(cal)){
					var funname = ['ok'];
					for(var i = 0, len = funname.length; i < len; i++){
						if($checkDataType.isFunction(cal[funname[i]])){
							this['_'+funname[i]+'cal'] = cal[funname[i]];
						}
						else{
							this['_'+funname[i]+'cal'] = function(){};
						}
					}
				}else{
					this._okcal = function(){};
				}
				//获取txt里面的键值
				var nodenamearr = [];
				for(var name in txt){
					nodenamearr.push(name);
				}
				this.getalert();
				var nodearr = this._alert.getNodes(nodenamearr);
				for(var name in nodearr){
					$checkDataType.isString(txt[name]) && nodearr[name].html(txt[name]);
				}
				this._alert.show();
			}
		},
		/**
		 * 销毁alert弹层 
		 */
		destroy: function(){
			if(this._alert != null){
				this._alert.destroy();
				this._alert = null;
			}
			this._defaultopt = {};
			this._okcal = function(){};
		}
	};
});
