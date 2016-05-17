/**
 * @fileoverview Sina 简单音频插件
 * @version 1.0 | 2015-06-17 版本信息
 * @author Zhang Mingrui
 * @param {Object} *config
 *    {
 * 	     *container: 存放音频dom的容器id
 * 	     *url: '' 媒体资源
 *       *id: '', video或audio的id
 *       width: 200,
 *       height: 200,
 *       *custom: {
 * 	     	*filetype: 'wav' //文件类型
 *       	*alltime: 2, //总共时长，秒
 * 		 }
 *       h5attr: {
 *          autoplay: false  //是否自动播放
 *          controls: true //是否显示控制条
 *          loop: false
 *          preload: 'auto'
 *       },
 *       flashvars:{},
         params: {},
         attributes: {}
 *    }
 */
define(['$','libmedia/buildH4','libmedia/buildH5','libmedia/mediatype'],function($,H4,H5,$mediatype){
	var tdom = document.createElement('audio');
	function audioplayer(config){
		var hasaudio =(!!tdom.canPlayType && tdom.canPlayType($mediatype[config.custom.filetype].h5type) != '');
		var container = $('#'+config.container);
		if(hasaudio){
			container.html(H5(config,config.custom.filetype,'audio'));
			this.elem = $('#'+config.id);
		}
		this.hasaudio = hasaudio;
		this.container = container;
		this.config = config;
		this.playing = false; //是否正在播放
	};
	audioplayer.prototype.play = function(){
		if(this.playing){
			return;
		}
		this.playing = true;
		if(this.hasaudio){
			this.elem[0].play();
		}
		else{
			this.container.html(H4(this.config,this.config.custom.filetype));
			this.elem = $('#'+this.config.id);
		}
		this.start();
	};
	audioplayer.prototype.start = function(){
		var that = this;
		setTimeout(function(){
			that.playing = false;
		},this.config.custom.alltime*1000);
	};
	return function(config){
		return new audioplayer(config);
	};
});
