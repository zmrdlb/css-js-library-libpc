/**
 * @fileoverview 横向分页。继承page
 * @version 1.0 | 2015-11-17 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 * @param {
 *    在基类page的参数基础上增加以下参数：
 *    noone: true //如果页码总数只有1页时，是否创建分页对象并渲染。true:否；false:是。默认true
 * }
 * @return page类分页对象。如果noone设置导致分页对象不创建，返回null
 * @example
 * requirejs(['$','demo/ui/page/horizontalpage'],function($,$page){
            $page({
                pageargs: {
                    pageCount: 100,
                    pageNum: 11,
                    cur: 1
                },
                con: $('#page'),
                //initFireChange: true,
                pagechangeCal: function(data){
                    console.log(data.cur);
                }
            });
        });
 * */
define(['$','libpage/page','demo/ui/page/horizontaltpl','libbase/checkDataType'], function($,$page,$tpl,$checkDataType){
  return function(opt){
    opt = $.extend({
        pageargs: {
           pageCount: 0 //页面总数
        },
        tpl: $tpl,
        noone: true
    },opt);
    var pageobj = null; //分页对象
    if(!$checkDataType.isBoolean(opt.noone) || opt.noone){ //少于1页不创建
        if(opt.pageargs.pageCount > 1){
            pageobj = new $page(opt);
        }
    }else{ //不做限制
        pageobj = new $page(opt);
    }
    return pageobj;
  };
});

