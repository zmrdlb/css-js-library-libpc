/**
 * Copyright (c) 2015 - 2016, Sina Inc. All rights reseved.
 * @fileoverview 
 *   监听window resize。只支持PC
 * @author mingrui| mingrui@staff.sina.com.cn
 * @version 1.0 | 2015-08-27
 * @example
 * requirejs(['$','evt/winresize'],function($,$winresize){
 * 		$winresize.listen({call:function(){console.log('窗口resize');}});
 * });
 */
define(['$','evt/resize'],function($,$resize){
	var resize = new $resize($(window));
	return resize;
});
