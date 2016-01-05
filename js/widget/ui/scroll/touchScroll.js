/**
 * Copyright (c) 2012 - 2014, Sina Inc. All rights reserved.
 * @fileoverview Sina H5 滑动slide
 * @version 1.0 | 15-01-07 版本信息
 * @author @mayloveless | lingfei2@staff.sina.com.cn
 *
css:
.screen{ width: 100%; height:100%; position: absolute; top:0; left:0;overflow: hidden; z-index: 9;}
.screen:nth-child(1){ z-index:10; }
.screen:nth-child(n+1){ display:none; }
#wrapper{overflow:hidden;position: relative}

js:
var scroll = $.widget.scroll.touchScroll({
    slide_during : 600,
    sceneDom : $('.screen'),
    wrapperDom : $('#wrapper'),
    callback:function(){},
    isLoop:true
});

$('[node-type=aaa]').bind('click',scroll.next)
$('[node-type=bbb]').bind('click',scroll.prev)

scroll.jumpTo(index); 
or
html : <a action-data = 'scene_1'></a>
$('#ccc').bind('click',scroll.jumpTo)


需要懒加载的图片src => _src

 */


SVK.register('widget.scroll.touchScroll',function($){ 


    var PREFIX = /^(Moz|(w|W)ebkit|O|ms)(?=[A-Z])/;
    var ANIMATION_END_NAMES = {
        "moz" : "animationend"
        ,"webkit" : "webkitAnimationEnd"
        ,"ms" : "MSAnimationEnd"
        ,"o" : "oAnimationEnd"
    };
    
    var Css3Sheet = function(){
        var cssDom = document.createElement('style');
        var cssId = 'CSS3_' + (+new Date());
        var cssSheet = null;
        var that = {};
        cssDom.setAttribute('type','text/css');
        cssDom.setAttribute('id', cssId);
        document.head.appendChild(cssDom);
        for(var i = 0,len = document.styleSheets.length; i < len; i += 1){
            if(document.styleSheets[i].ownerNode.id === cssId){
                cssSheet = document.styleSheets[i];
                break;
            }
        }
        
        that.getCssSheet = function(){
            return cssSheet;
        };
        
        that.addRule = function(selector, cssText){ 
            var rules = cssSheet.rules || cssSheet.cssRules;
            if(cssSheet.insertRule){
                cssSheet.insertRule(selector + ' {' + cssText + '}', rules.length);
            }else if(cssSheet.addRule){
                cssSheet.addRule(selector, cssText, rules.length);
            }
        };
        
        that.destory = function(){
            document.head.removeChild(cssDom);
            cssDom = null;
            cssSheet = null;
            cssId = null;
        };
        
        return that;
    };

    
   
    var addPrefix = function(text){
        for ( var p in $('div')[0].style ) {
            if( PREFIX.test(p) ) {
                var pre = p.match(PREFIX)[0];
                var css3Text = '-'+pre+'-'+text;
                return [css3Text,pre];
            }
        }
        return [text,''];
    };

    return function(opts){
        var CONF = {
            slide_during : 600,
            sceneDom : $('.screen'),
            wrapperDom : $('#wrapper'),
            callback:function(){},
            isLoop:true
        };
        var that = {};
        var curIndex = 1 ;
        var lastIndex = 0;

        var SCENE =[],SCRITS={};
        var isAniBusy = false; 
       
        var sheet = Css3Sheet();
        var $slideCSS= function( node,cb ){
            var transition_cube = node.clone( )[0];
            $(transition_cube).css('z-index','11')
            transition_cube.style.cssText = addPrefix('transform')[0]+':translate(0px,-100%);';
            CONF.wrapperDom.append(transition_cube);

            //加入动画方法
            sheet.addRule( '@'+addPrefix('keyframes')[0]+' STKANI_SLIDE', '100% { '+addPrefix('transform')[0]+': translate(0px,0%);}');
            aniCss = addPrefix('animation')[0]+': STKANI_SLIDE '+CONF.slide_during/1000+'s ease-in-out;';
            transition_cube.setAttribute('style',aniCss);
          
            //終わり
            var eventType =  ANIMATION_END_NAMES[addPrefix('animation')[1].toLowerCase()];
            if(eventType){
                $(transition_cube).bind( eventType, function(){
                    $(transition_cube).unbind(eventType).remove();
                    cb && cb();
                });
            }else{
                var AniEndtimer = setTimeout(function(){
                    $(transition_cube).remove();
                     cb && cb();
                    window.clearTimeout(Anitimer);
                    AniEndtimer = null;
                },conf.duration);
            }

        };

        var $imageLoad = function( $imgWrapper ){
            var imgDomList = $imgWrapper.find('img');
            $.each(imgDomList,function(i,v){
                var _src  =  $(v).attr('_src'); 
                var wrapperDom = $(v).parent();
                if( _src ){
                    $(v).attr('src',_src);
                   // $(v).attr('ssss','ssss');
                    $(v).removeAttr('_src');
                }
            });
        };

        var fixHeight = function(){
            var winHeight = $(window).height(),winWidth = $(window).width();
            CONF.wrapperDom.height(winHeight);
        };

        var evtNext = function(e){
            if ( isAniBusy ) return false;

            if( (curIndex === CONF.scene_num) && CONF.isLoop ){ 
                lastIndex = curIndex;
                curIndex = 1;
                scollFn();
            }else if( curIndex < CONF.scene_num ){ 
                lastIndex = curIndex;
                ++curIndex;
                scollFn();
            }
            
            e && e.stopPropagation();
        };

        var evtPrev = function(e){
            if ( isAniBusy ) return false;

            if( (curIndex === 1) && CONF.isLoop){ 
                lastIndex = curIndex;
                curIndex = CONF.scene_num ;
                scollFn();
            }else if( curIndex > 1 ){ 
                lastIndex = curIndex;
                --curIndex;
                scollFn();
            }
           
            e && e.stopPropagation();
        };

        var evtJumpTo = function(idx){
            if ( isAniBusy ) return false;
            var index = !!Number(idx) ? idx : Number( $(this).attr('action-data').split('scene_')[1] ) ;
            if( curIndex === index ) return false;
            lastIndex = curIndex;
            curIndex = index;
            scollFn();
        };

        var scollFn = function(evt){
            if( isAniBusy ){return false;}
            isAniBusy = true;

            // 滚一幕
            var next = $(CONF.sceneDom[curIndex-1]);
            var cur =  $(CONF.sceneDom[lastIndex-1]);

            var derection  = curIndex > lastIndex ? 1:-1;

            next.css('top',derection*100+'%').css('z-index','11').show();
            cur.css('z-index','10');
     
            setTimeout(function(){
                next.animate({
                    top: 0
                },{
                    duration: CONF.slide_during,
                    easing : 'ease-in-out',
                    complete:function(){
                        //恢复z-index
                        cur.css('z-index','9');
                        isAniBusy = false;
                    }
                });

            },0);

            
            /*next.css('z-index','11').show();
            cur.css('z-index','10');
            $slideCSS(next,function(){
                cur.css('z-index','9');
                next.css('z-index','10');
                isAniBusy = false;
            });
*/
            
            //loagImg
            $imageLoad( next );
            //load next Img 
            ( curIndex < CONF.scene_num )  && $imageLoad( $(CONF.sceneDom[curIndex+1]) );
           
            //fix height
            fixHeight();

            //callback
            CONF.callback(curIndex);
            //场景转换
            //showScene(curIndex);
        };

        var bind = function(){
            $(window).on('resize',function(){
                fixHeight();
            });
            //touch event
            var isDrag = false;
            var pointerPosY = 0;
            $(document).on('touchstart', function(e){
                if ( !isAniBusy ) {
                    isDrag = true;
                    pointerPosY = e.changedTouches[0].pageY;
                    e.stopPropagation();
                }
            });  

            $(document).on('touchmove', function(e){
                if( isDrag ) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }); 

            $(document).on('touchend', function(e){ 
                var newPointerPosY = e.changedTouches[0].pageY;
                if( isDrag && Math.abs(newPointerPosY - pointerPosY) >50 ){
                    
                    if( newPointerPosY < pointerPosY ){
                        evtNext();
                    }else {
                        evtPrev()
                    }
                    e.stopPropagation();
                    isDrag = false;
                }
            }); 
        };

        var init = function(){
            opts &&　$.extend(CONF,opts);
            CONF.scene_num = CONF.sceneDom.length;
            fixHeight();
            bind();
        };

        init();

        that.destroy = function(){
           $(document).off('touchstart');
           $(document).off('touchmove');
           $(document).off('touchend');
        };
        that.next = evtNext;
        that.prev = evtPrev;
        that.jumpTo = evtJumpTo;

        return that;
    };
});
