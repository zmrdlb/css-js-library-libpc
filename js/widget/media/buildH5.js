/**
 * @fileoverview 构建html5媒体方法
 * @version 1.0 | 2015-06-17 版本信息
 * @author Zhang Mingrui
 * @param {Object} *config
 *    {
 * 	     *url: '' 媒体资源
 *       *id: '', video或audio的id
 *       width: 200,
 *       height: 200,
 *       h5attr: {
 *          autoplay: false  //是否自动播放
 *          controls: true //是否显示控制条
 *          loop: false
 *          preload: 'auto'
 *       }
 *    }
 * @param {String} *filetype 文件类型 对应mediatype里面的键值
 * @param {String} *mediatype 媒体类型 audio或video
 */
define(['$','libmedia/mediatype'],function($,$mediatype){
	function getWH(args){
		if(args == undefined){
			return '';
		}
		else{
			if(isNaN(args)){
				return args;
			}
			return args+'px';
		}
	}
  return function(config,filetype,mediatype){
  	  if(!$mediatype[filetype]){
  		  throw new Error('构建媒体插件H5传入的媒体类型不存在');
  	  }
  	  var conf = {
	    autoplay: false, //是否自动播放
	    controls: true, //是否显示控制条
	    loop: false, //是否循环播放
	    preload: 'auto'
	  };
	  $.extend(conf, config.h5attr || {});
	  var att = [];
	  for(var name in conf){
	  	if(typeof conf[name] == 'boolean'){
	  		if(conf[name]){
	  			att.push(name);
	  		}
	  	}
	  	else{
	  		att.push(name+'='+conf[name]);
	  	}
	  }
	  var width = getWH(config.width);
	  var height = getWH(config.height);
	  return [
	    '<'+mediatype+' id="'+config.id+'" name="'+config.id+'" ',
	    width? 'width="'+config.width+'" ': '',
	    height? 'height="'+config.height+'" ': '',
	    'style="',
	    width? 'width:'+width+';': '',
	    height? 'height:'+height+';': '',
	    '" ',
	    att.join(' ')+'>',
	    config.url? '<source src="'+config.url+'" type="'+$mediatype[filetype].h5type+'">': '',
	    '</'+mediatype+'>'
	  ].join("");
  };
});
