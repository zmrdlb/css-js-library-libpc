/**
 * @fileoverview confrim类创建的控制工厂，一般用于简单的confirm信息提示。
 * 注意：该confrim控制的对象及dom在全局中唯一存在，如果想要创建多个，请使用layer/confirm
 * @version 1.0.0 | 2015-09-16 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['layer/confirmControl'],function($confirmControl){
		$confirmControl.setconfig({
			confirm: {
				frametpl: [
					'<div node="content"></div>',
					'<div><a href="javascript:;" node="ok">好的</a><a href="javascript:;" node="cancel">等下说</a></div>'
				].join('')
			}
		});
		$confirmControl.getconfirm()； //layer/confirm类对象
		$confirmControl.show({
		    content: '您还未登陆'
		},{
		    ok: function(){
                console.log('点击好的');
            }
		});
   });
 * */
define(['layers/confirm','base/checkDataType'],function($confirm,$checkDataType){
    /**
     * confirm工厂模型控制器
     */
	return {
		_confirm: null, 
		_defaultopt: {}, //默认confirm config配置参数
		_okcal: function(){}, // 点击确定按钮后的回调
		_cancelcal: function(){}, //点击取消按钮后的回调
		/**
		 *  参数说明请参见layer/confirm里面的config说明
		 */
		setconfig: function(config){
			this.destroy();
			this._defaultopt = config;
		},
		/**
		 * 获取当前confirm对象 
		 */
		getconfirm: function(){
			var that = this;
			if(this._confirm == null){
				this._confirm = new $confirm(this._defaultopt);
				this._confirm.okcal.add(function(e){
					that._okcal();
				});
				this._confirm.cancelcal.add(function(e){
					that._cancelcal();
				});
			}
			return this._confirm;
		},
		/**
		 * 显示弹层 
		 * @param {Object} *txt 文案配置,选填。如果setconfig调用设置的模板中还有其他node="其他值"，
		 * 		如node="other" 则可自行扩展
		 * {
		 * 	 content {String} node="content"节点里面的html
		 *   title {String} node="title"节点里面的html
		 *   ok {String} node="ok"节点里面的html
		 *   cancel {String} node="cancel"节点里面的html
		 * }
		 * @param {Object} cal 回调配置
		 * {
		 * 	 ok {Function} 点击确定按钮后的回调
		 * }
		 */
		show: function(txt,cal){
			if(!$checkDataType.isObject(txt)){
				throw new Error('confirmControl-show方法txt参数必须是json对象');
			}else{
				if($checkDataType.isObject(cal)){
                    var funname = ['ok','cancel'];
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
                    this._cancelcal = function(){};
                }
                //获取txt里面的键值
                var nodenamearr = [];
                for(var name in txt){
                    nodenamearr.push(name);
                }
                this.getconfirm();
                var nodearr = this._confirm.getNodes(nodenamearr);
                for(var name in nodearr){
                    $checkDataType.isString(txt[name]) && nodearr[name].html(txt[name]);
                }
                this._confirm.show();
			}
		},
		/**
		 * 销毁confirm弹层 
		 */
		destroy: function(){
			if(this._confirm != null){
				this._confirm.destroy();
				this._confirm = null;
			}
			this._defaultopt = {};
			this._okcal = function(){};
			this._cancelcal = function(){};
		}
	};
});
