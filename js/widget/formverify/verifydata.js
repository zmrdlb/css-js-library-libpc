/**
 * Copyright (c) 2012 - 2013, Sina Inc. All rights reserved.
 * @fileoverview Sina 根据根节点对符合条件的组件进行数据验证
 * @version 1.0 | 2013-08-12 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 * @param {JqueryElement} root 根节点
 * @param {Boolean} all 是否全部检测，如果为true，则遇到错误也会全部检测。如果为false,则有错就不会继续检测下去
 *  默认为false
 * 符合条件的节点具有如下属性：
 * 验证数字: verify="verifytype=num&require=true&min=1&max=100&numtype=1" 
 *         表示数字在1～100之间，包括两端的数字，此项必填，是整数
 * 验证字符串: verify="verifytype=string&require=true&min=1&max=100&regular=\\d+&pattern=g"
 *          表示验证字符串，控制字符范围在1～100之间包括两端数字，此外所填数据必须是数字，全局匹配模式
 *          此项必填
 * 以上属性，如果哪些范围不需要可去掉相应属性
 * verifytype没有则默认为string
 * 特别说明，如果除了这些基本验证外还需要自定义的验证方法，则在verify属性里面&name=当前验证名，具体
 * 使用见返回that.otherVerify
 * 如果需要显示错误信息，则许给定errormsg属性，如：errormsg="此项必填"
 * 如果具有placeholder属性，则输入框的value值为placeholder指定的值，也视为输入无效
 */
$Import('widget.extra.verify.baseVerify');
SVK.register('widget.extra.verify.verifydata',function($){
  var $baseVerify = $.widget.extra.verify.baseVerify;
  
  return function(root,all){
    var data = []; //存放待验证的数据
    
    var init = function(){
      if(!root || root.length == 0){
        return;
      }
      if(typeof all != 'boolean'){
        all = false;
      }
      root.find('[verify]').each(function(){
        var node = $(this);
        var json = $.queryToJson(node.attr('verify'));
        if(typeof json.min != 'undefined'){
          json.min = parseInt(json.min);
        }
        if(typeof json.max != 'undefined'){
          json.max = parseInt(json.max);
        }
        if(typeof json.require != 'undefined'){
          json.require = Boolean(json.require);
        }
        json.node = node;
        data.push(json);
      });
    };
    
    init();
  
    var that = {
      /**
       * 数据验证，返回
       * {
       *   result 验证结果true|false
       *   msg {Array} 错误信息，读取errormsg属性值
       * } 
       */
      verify: function(){
        var result = true;
        var msgarr = []; //存放错误提示信息
        for(var i = 0, len = data.length; i < len; i++){
          var json = data[i];
          var obj = {
            result: true, //当前检验验证结果
            node: json.node //当前节点
          };
          var msg = '';
          json.val = $.trim(json.node.val());
          //等于默认提示文案视为无效
          if(json.val == json.node.attr('placeholder')){
            json.val = '';
          }
          obj.result = $baseVerify.doverify(json);
          if(obj.result && json.name){
            that.otherVerify.fire(json.name,obj);
          }
          result = result && obj.result;
          if(!obj.result){
            if(msg = json.node.attr('errormsg')){
              msgarr.push(msg);
            }
            if(!all){
              break;
            }
          }
        }
        return{
          msg: msgarr,
          result: result
        }
      },
      /**
       * 如果用户需要自行验证函数，则加入回调方法
       * 传入数据为
       * @param {String} name 节点中verify属性中设置的name值，如verify="name=feedback"
       * @param {Object} obj
       *    {
       *       result: true|false  当前从节点中verify属性给出的验证方法验证的结果，用户可通过自定义验证方法改变此值
       *       node: 当前节点引用
       *    } 
       */
      otherVerify: $.Callbacks()
    };
    return that;
  }
});
