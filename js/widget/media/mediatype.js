/**
 * @fileoverview 构建媒体插件时用，对于不同媒体类型文件用的不同的参数配置
 * @version 1.0 | 2015-06-17 版本信息
 * @author Zhang Mingrui
 * @example
 */
define([],function(){
	return {
		flash: {
			h4type: 'application/x-shockwave-flash',
			h5type: '',
			pluginpage: 'http://www.macromedia.com/go/getflashplayer',
			classid: 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
			keysparam: ['movie'], //对于object类型需要把媒体资源url设置到param的键值
			keysattribute: ['data'] //对于object类型需要把媒体资源url设置到attribute的键值
		},
		wav: {
			h4type: 'audio/wav',
			h5type: 'audio/wav',
			pluginpage: '',
			classid: 'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B',
			keysparam: ['src'],
			keysattribute: []
		}
	};
});
