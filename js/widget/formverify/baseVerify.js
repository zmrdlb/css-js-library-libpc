/**
 * Copyright (c) 2012 - 2013, Sina Inc. All rights reserved.
 * @fileoverview Sina 通用数据验证方法
 * @version 1.0 | 2013-08-12 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 */
SVK.register('widget.extra.verify.baseVerify',function($){
  return {
    /**
     * 做验证返回验证结果,true|false 
     * {
     *   require: true|false 指定是否是必填参数
     *   val {String|Num} 输入值
     *   verifytype: 'num'|'string' 数据验证类型  数字或字符串
     *    verifytype为string对应的验证属性
     *      min: 0 指定最小填写的字符数，不限则不填写
     *      max: 200 指定最大填写的字符数，不限则不填写
     *      numtype: 数字类型， 1：整数 2：小数 3：整数或小数。默认是1，可选
     *      regular: 正则表达式
     *      pattern: 正则匹配模式，第二个参数，如g
     *    verifytype为num对应的验证属性
     *      min: 0 所填数字>=min 无此属性则不限
     *      max: 100 所填数字<=max 无此属性则不限
     *      如果对于数字范围没要求则这两个属性全不必填写
     * }
     */
    doverify: function(opt){
      if(!opt){
        return false;
      }
      opt.val = opt.val.toString();
      opt.verifytype = opt.verifytype || 'string';
      //不为空，检测
      if(opt.val != ''){
        switch(opt.verifytype){
          case 'num':
            opt.numtype = opt.numtype || 1;
            //验证数字类型
            if(opt.numtype == 3){ //小数或整数
              var result = /^\d+$|^\d+\.\d+$/.test(opt.val);
            }
            else if(opt.numtype == 2){
              var result = /^\d+\.\d+$/.test(opt.val);
            }
            else{
              var result = /^\d+$/.test(opt.val);
            }
            if(result){
              //正确则进行最大值最小值检测
              opt.val = parseFloat(opt.val);
              if(typeof opt.min != 'undefined' && opt.min > opt.val){
                return false;
              }
              if(typeof opt.max != 'undefined' && opt.max < opt.val){
                return false;
              }
            }
            else{
              return false;
            }
            break;
          case 'string':
            var len = $.bLength(opt.val);
            if(typeof opt.min != 'undefined'){
              if(opt.min < 0){
                opt.min = 0;
              }
              if(len < opt.min){
                return false;
              }
            }
            if(typeof opt.max != 'undefined'){
              if(opt.max < 0){
                opt.max = 0;
              }
              if(len > opt.max){
                return false;
              }
            }
            if(opt.regular){
              if(opt.pattern){
                var reg = new RegExp(opt.regular,opt.pattern);
              }
              else{
                var reg = new RegExp(opt.regular);
              }
              if(!reg.test(opt.val)){
                return false;
              }
            }
            break;
        }
      }
      //为空
      else{
        //必填
        if(opt.require){
          return false;
        }
      }
      return true;
    }
  };
});
