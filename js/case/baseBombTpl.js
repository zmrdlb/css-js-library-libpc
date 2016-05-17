/**
 * @fileoverview 基本的弹层模板 
 * @version 1.0.0 | 2015-11-06 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * */
define({
   /*
    * 全局弹层基础框架
    */
   layer: [
        '<div class="header"><span node="title"></span><a href="javascript:" node="close" title="close" class="close">×</a></div>',
        '<div class="body" node="content"></div>',
        '<div class="footer"><button class="cancel" node="cancel">取消</button><button class="ok" node="ok">确定</button></div>'
    ].join('') 
});
