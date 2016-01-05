/**
 * Copyright (c) 2013 - 2014, Sina Inc. All rights reserved.
 * @fileoverview Sina 上一页，下一页切换按钮滚动(上一页下一页按钮样式初始化要设置为不可点击状态)
 * 支持jquery和zepto
 * @version 1.0 | 2015-01-07 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn 
 * @param {
 *      *nodes: {
          *scrollNode: null, //待滚动区域容器
          *conNode: null, //展示区域容器
          *prevNode: null, //上一页按钮
          *nextNode: null //下一页按钮
        },
        scrolllen: null, //待滚动区域的长度|宽(x轴)或者高(y轴)，如果设立此值就覆盖掉了根据scrollNode算的长度
        type: 'x', //滚动类型 x轴滚动或者y轴滚动
        change: false, //滚动区域是否会根据窗口大小改变
        evtname: 'click', //按钮切换触发事件
        disclass: '', //按钮不可点击class
        animateOption: { //滚动动画相关配置参数，参考jquery.animate方法的第二个参数options
          duration: 400
        }
 * }
 * @return scroll/scroll类的对象
 */
$Import('widget.scroll.scroll');
$Import('widget.extra.dom.checknode');
SVK.register('widget.scroll.manubutScroll', function($){
  var $scroll = $.widget.scroll.scroll;
  var $checknode = $.widget.extra.dom.checknode;
  
  return function(opt){
    var conf = {};
    var scrollObj = null; //滚动对象
    
    /**
     * 根据滚动计算的数据设置上一页，下一页的状态 
     */
    var setbutState = function(){
      var status = {cur: scrollObj.getIndex(), count: scrollObj.count};
      //说明有上一页
      if(status.cur > 1){
        conf.nodes.prevNode.removeClass(conf.disclass);
      }
      //无上一页
      else{
        conf.nodes.prevNode.addClass(conf.disclass);
      }
      //说明有下一页
      if(status.cur < status.count){
        conf.nodes.nextNode.removeClass(conf.disclass);
      }
      //无下一页
      else{
        conf.nodes.nextNode.addClass(conf.disclass);
      }
    };
    
    //绑定dom事件
    var bindDomEvt = function(){
      //上一页事件
      conf.nodes.prevNode.bind(conf.evtname, function(e){
        e.preventDefault();
        e.stopPropagation();
        if(scrollObj.getIndex() == 1){
          return;
        }
        scrollObj.prev();
        setbutState();
      });
      //下一页事件
      conf.nodes.nextNode.bind(conf.evtname, function(e){
        e.preventDefault();
        e.stopPropagation();
        if(scrollObj.getIndex() == scrollObj.count){
          return;
        }
        scrollObj.next();
        setbutState();
      });
    };
    
    //初始化
    var init = function(){
      conf = $.extend(true,{
        nodes: {
          scrollNode: null, //待滚动区域容器
          conNode: null, //展示区域容器
          prevNode: null, //上一页按钮
          nextNode: null //下一页按钮
        },
        scrolllen: 0, //待滚动区域的长度|宽(x轴)或者高(y轴)，如果设立此值就覆盖掉了根据scrollNode算的长度
        type: 'x', //滚动类型 x轴滚动或者y轴滚动
        change: false, //滚动区域是否会根据窗口大小改变
        evtname: 'click', //按钮切换触发事件
        disclass: '', //按钮不可点击class
        animateOption: { //滚动动画相关配置参数，参考jquery.animate方法的第二个参数options
          duration: 400
        }
      }, opt || {});
      $checknode(conf.nodes,'参数nodes中的节点无效');
      scrollObj = new $scroll(conf);
      if(scrollObj.canscroll){
        setbutState();
        //事件绑定
        bindDomEvt();
      }
    };
    
    init();
    
    return scrollObj;
  };
});
