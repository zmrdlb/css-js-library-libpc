/**
 * @fileoverview 检测数据类型
 * @version 1.0.0 | 2015-09-07 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * */
define(function(){
	return {
		/**
		 * data是否是无效字段。即是null|undefined|''
         * @param {Object} data
		 */
		isInvalid: function(data){
			if(data == null || data == ''){
				return true;
			}
			return false;
		},
		/**
		 * 是否是object 
         * @param {Object} data
		 */
		isObject: function(data){
			return Object.prototype.toString.call(data) == '[object Object]';
		},
		/**
		 * 是否是function 
         * @param {Object} data
		 */
		isFunction: function(data){
			return typeof data == 'function';
		},
		/**
		 * 是否是Array
         * @param {Object} data
		 */
		isArray: function(data){
			return Object.prototype.toString.call(data) == '[object Array]';
		},
		/**
		 * 是否是boolean
         * @param {Object} data
		 */
		isBoolean: function(data){
			return typeof data == 'boolean';
		},
		/**
		 * 是否是String
         * @param {Object} data
		 */
		isString: function(data){
			return typeof data == 'string';
		}
	};
});
