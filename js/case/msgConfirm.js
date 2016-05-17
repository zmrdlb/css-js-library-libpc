/**
 * @fileoverview 全局消息提示confirm
 * 注意：该confrim控制的对象及dom在全局中唯一存在，如果想要创建多个，请使用layer/confirm
 * @version 1.0.0 | 2015-11-06 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['layer/msgConfirm'],function($msgConfirm){
        $msgConfirm.singleMsg({ //一般单行消息提示
            msg: '确认举报？'
        },{
            ok: function(){
                console.log('点击确定');
            }
        });
   });
 * */
define(['liblayers/confirmControl','libbase/checkDataType','case/baseBombTpl'],function($confirmControl,$checkDataType,$tpl){
    $confirmControl.setconfig({
        confirm: {
            frametpl: $tpl.layer
        },
        layer: {
            classname: 'msg-confirm',
            zIndex: 999
        },
        mask: {
            bgcolor: '#666',
            zIndex: 998
        }
    });
    
    var that = {
        controlobj: $confirmControl, //confirm工厂控制器对象
        /**
         * 重新设置 node="content"内容填充区里面的模板 
         * @param {String} tpl
         */
        _resetBodyTpl: function(tpl){
            if($checkDataType.isString(tpl) && tpl != ''){
                var confirmobj = $confirmControl.getconfirm();
                confirmobj.setConfirmContent(tpl);
            }
        },
        /**
         *  一般单行消息提示，参数说明见layer/confirmControl的show方法
         */
        singleMsg: function(txt,cal){
            this._resetBodyTpl('<p node="msg" class="single"></p>');
            $confirmControl.show.apply($confirmControl,arguments);
        }
    };
    return that;
});