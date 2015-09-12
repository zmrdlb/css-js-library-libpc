/**
 * @fileoverview 检测flash插件支持情况
 * @version 1.0 | 2015-06-17 版本信息
 * @author Zhang Mingrui
 * @example
 */
define([],function(){
	  var that = {};
	  that.maxversion = 0; //flash大版本号
	  that.minversion = 0; //flash小版本号
	  that.flash = false; //是否安装了flash
	  that.flashtype = ''; //flash构建类型，是embed还是object
	  /**
	   * 获取flash版本号
	   * @param {String} des flash描述
	   * @return {
	   *   max: {Number} 大版本号
	   *   min: {Number} 小版本号
	   * }
	   */
	  function getFLashVersion(des){
	    var result = {
	      max: -1,
	      min: -1
	    };
	    des = des.replace(/,/g,'.');
	    var version = des.match(/\d+.\d+/);
	    if(version){
	      version = version[0];
	      var varr = version.split('.');
	      result.max = parseInt(varr[0] || 0);
	      result.min = parseInt(varr[1] || 0);
	    }
	    return result;
	  }
	  
	  function check(){
	    try{
	      if(navigator.plugins && navigator.plugins["Shockwave Flash"]) {
	          that.flash = true;
	          that.flashtype = 'embed';
	          var swf=navigator.plugins["Shockwave Flash"];
	          var result = getFLashVersion(swf.description);
	          that.maxversion = result.max;
	          that.minversion = result.min;
	      }
	      else if(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")){
	          that.flash = true;
	          that.flashtype = 'object';
	          var flashIE = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
	          var result = getFLashVersion(flashIE.GetVariable("$version"));
	          that.maxversion = result.max;
	          that.minversion = result.min;
	      }
	    }
	    catch(e){}
	  }
	  
	  check();
	  
	  /**
	   * 检测是否支持当前版本flash 
	   * max {Int} 大版本号 *
	   * min {Int} 小版本号
	   */
	  that.support = function(max,min){
	    if(that.flash){
	      if(that.maxversion > max){
	        return true;
	      }
	      else if(that.maxversion == max){
	        if(min){
	          if(that.minversion >= min){
	            return true;
	          }
	          return false;
	        }
	      }
	      else{
	        return false;
	      }
	    }
	    else{
	      return false;
	    }
	  };
	  return that;
});