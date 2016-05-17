/**
 * * @fileoverview 对于异步数据请求渲染列表这类应用场景，统一处理状态显示。
 * 1. 应用场景：
 *      1) 一次性渲染的列表数据。即每次渲染的数据都直接覆盖容器，不会添加到容器后面保留旧数据。
 *      2) 瀑布流方式的数据渲染。即每次请求回来的新数据都添加到旧数据后面，这样的话，每次状态提示的位置都不同。
 *    此组件对于以上2种场景都适用。
 * 
 * 2. 优点：
 *      1) 信息提示位置固定在container中
 * 
 * @version 1.0.0 | 2015-11-02 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 各种状态处理方法
 * @example
 *   requirejs(['libbase/fallMsgTips'],function($fallMsgTips){
 *     var container = $('#myMsgContainer');
 *     var msgtips = new $fallMsgTips({
 *          container: container
 *     });
        node.click(function(){
            msgtips.bindError(function(e){console.log('点击了请重试按钮');});
            msgtips.loading();
            msgtips.error();
            msgtips.empty();
            msgtips.clear(); //清空提示消息
            msgtips.other({msg:'其他模板的信息提示'},tpl: '<p>这是我自定义的模板类型：{{msg}}</p>');
        });
     });
 */
define(['$','libbase/checkDataType','libcompatible/deviceevtname','libbase/template'],function($,$checkDataType,$deviceevtname,$template){
    var tpl = {
        loading: [
            '<p class="g-msg-tips loading">',
                '<img src="'+$SCOPE.asset_basepath+'/page/common/img/loading-circle-16.gif" alt="">',
                '<span>{{msg}}</span>',
            '</p>'
        ].join(''),
        error: [
            '<p class="g-msg-tips retry">',
                '{{msg}}<a href="javascript:;" node="retry">{{retrymsg}}</a>',
            '</p>'
        ].join(''),
        empty: [ //数据为空状态提示
            '<p class="g-msg-tips empty">',
                '{{msg}}',
            '</p>'
        ].join('')
    };
    
    /**
     * 瀑布流状态提示类
     * @param {Object} opt
     */
    function FallMsgTips(opt){
        var conf = {
            container: null, //存放状态提示信息的容器
            tpl: tpl //模板
        };
        $.extend(true,this,conf,opt);
        if(!$checkDataType.isValidJqueryDom(this.container)){
            throw new Error('组件fallMsgTips传入的container容器无效');
        }
    }
    
    /*
     * 私有渲染模板的方法
     * @param msgopt 信息提示配置
     * @param tpl 模板
     */
    FallMsgTips.prototype._render = function(msgopt,tpl){
        var render = $template.compile(tpl);
        var html = render(msgopt);
        this.container.html(html);
    };
    
    /**
     * 清空状态提示信息 
     */
    FallMsgTips.prototype.clear = function(){
        this.container.empty();
    };
    
    /**
     * loading 状态提示 
     * @param {Object} msgopt 信息提示配置
     */
    FallMsgTips.prototype.loading = function(msgopt){
        var defmsg = {
            msg: '正在加载数据...'
        };
        $.extend(defmsg,msgopt);
        this._render(defmsg,this.tpl.loading);
    };
    
    /**
     * error 状态提示 
     * @param {Object} msgopt 信息提示配置
     */
    FallMsgTips.prototype.error = function(msgopt){
        var defmsg = {
            msg: '加载数据失败！',
            retrymsg: '点击重新加载'
        };
        $.extend(defmsg,msgopt);
        this._render(defmsg,this.tpl.error);
    };
    
    /**
     * empty 状态提示 
     * @param {Object} msgopt 信息提示配置
     */
    FallMsgTips.prototype.empty = function(msgopt){
        var defmsg = {
            msg: '还未有任何数据'
        };
        $.extend(defmsg,msgopt);
        this._render(defmsg,this.tpl.empty);
    };
    
    /**
     * 绑定提示error信息时，点击node="retry"(请重试)按钮的事件
     * @param {Function} call "请重试"按钮点击后的回调事件
     */
    FallMsgTips.prototype.bindError = function(call){
        if(!$checkDataType.isFunction(call)){
            throw new Error('组件fallMsgTips-bindError传入参数错误');
        }
        this.container.on($deviceevtname.click,'[node="retry"]',function(e){
            call(e);
        });
    };
    
    /**
     * 为了防止除了loading,error,empty，用户还需要其他的模板配置来提示状态信息功能。则提供此方法供用户自行扩展
     * @param {Object} msgopt
     * @param tpl 模板
     */
    FallMsgTips.prototype.other = function(msgopt,tpl){
        this._render(msgopt,tpl);
    };
    
    return FallMsgTips;
});