/**
 * @fileoverview 构建H4媒体插件方法。
 * @version 1.0 | 2015-06-17 版本信息
 * @author Zhang Mingrui
 * @example
 */
define(['$','libjson/jsonToQuery','libmedia/mediatype'],function($,jsonToQuery,mediatype){
  /**
   * 构建meidia dom
   * @param {Object} att attribute属性
   * @param {Object} par 构建params
   * @param {Object} typeobj 当前媒体类型相关配置
   */
  var createMediaHTML = function(attObj,parObj,typeobj){
  	//构建embed标签
  	var _embedhtml = ['<embed pluginspage="'+typeobj.pluginpage+'" type="'+typeobj.h4type+'"'];
      for(var i in attObj){ //构建attribute
      	var ii = i.toLowerCase();
        if (attObj.propertyIsEnumerable(i)) { // filter out prototype additions from other potential libraries
			if (ii == "data") {
				_embedhtml.push('src="'+attObj[i]+'"');
			}
			else if (ii == "styleclass") { // 'class' is an ECMA4 reserved keyword
				_embedhtml.push('class="' + attObj[i] + '"');
			}
			else if (ii != "classid" && ii != 'id' && ii != 'name') {
				_embedhtml.push(i + '="' + attObj[i] + '"');
			}
		}
      }
	  for (var p in parObj) { //构建param
	      if(parObj.propertyIsEnumerable(p)){
	          _embedhtml.push(p+'="'+parObj[p]+'"');
	      }
	  }
      _embedhtml.push("/>");
      _embedhtml = _embedhtml.join(' ');
      //构建object
      var att = [];
		for (var i in attObj) { //构建attribute
			if (attObj.propertyIsEnumerable(i)) { // filter out prototype additions from other potential libraries
				if (i.toLowerCase() == "data") {
					var cururl = attObj[i];
					for(var m = 0, mlen = typeobj.keysattribute.length; m < mlen; m++){
						att.push(typeobj.keysattribute[m]+'="' + cururl + '"');
					}
					for(var n = 0, nlen = typeobj.keysparam.length; n < nlen; n++){
						parObj[typeobj.keysparam[n]] = cururl;
					}
				}
				else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
					att.push('class="' + attObj[i] + '"');
				}
				else if (i.toLowerCase() != "classid") {
					att.push(i + '="' + attObj[i] + '"');
				}
			}
		}
		var par = [];
		for (var j in parObj) { //构建param
			if (parObj.propertyIsEnumerable(j)) { // filter out prototype additions from other potential libraries
				par.push('<param name="' + j + '" value="' + parObj[j] + '" />');
			}
		}
	return '<object classid="'+typeobj.classid+'" codebase="'+typeobj.pluginpage+'" type="'+typeobj.h4type+'" '+att.join(' ')+'>'+par.join(' ')+_embedhtml+'</object>';
 };
  /**
   * 获得媒体插件的html 
   * @param {Object} args 媒体配置参数，如下opt
   * @param {String} type 媒体类型,flash等，要喝mediatype.js里面的键值对应
   */
  return function(args,type){
  	var typeobj = mediatype[type];
  	if(!typeobj){
  		throw new Error('构建媒体插件H4传入的媒体类型不存在');
  	}
    var opts = {
      url:"", //媒体资源地址
      id: new Date().getTime(), // 播放器ID
      //需求问题，高和宽的话如果不给定就不设定
      //width: 640, // 播放器宽度 
      //height: 480, // 播放器高度
      // flash 播放器相关参数开始
      flashvars:{},
      params: {
        allowNetworking: "all",
        allowScriptAccess: "always",
        wmode: "transparent",
        allowFullScreen: "true",
        quality: "high",
        bgcolor: "#000000"
      },
      attributes: {}
    };
    $.extend(true,opts,args);
    var att = opts.attributes,par = opts.params;
    att.data = opts.url;
    if(typeof opts.width != 'undefined'){
      att.width = opts.width+"";
    }
    if(typeof opts.height != 'undefined'){
      att.height = opts.height+"";
    }
    att.id = opts.id;
    att.name = opts.id;
    par.flashvars = jsonToQuery(opts.flashvars||{},false);
    return createMediaHTML(att,par,typeobj);
  };
});
