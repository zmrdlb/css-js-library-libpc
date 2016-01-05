/**
 * * @fileoverview 详情页侧边导航
 * @version 1.0.0 | 2015-11-16 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 
 * @example
 *   requirejs(['$','module/ui/nav/sidenav'],function($,$sidenav){
            $sidenav({ //参数说明详见方法init中的opt变量
                referNode: $('#pl_navrefer'),
                anchorConNode: $('#pl_anchor')
            });
     });
 */
define(['$','module/ui/nav/sidenav','css!./css/sidenav'],function($,$sidenav){
    var tpl = [ //侧边导航模板
        '<div class="sidenav-wrapper">',
                    '<div class="bar"></div>',
                    '<ul>',
                        '{{each list as item i}}',
                            '{{if i == 0}}',
                            '<li class="{{curclass}}"><i>●</i><a href="#{{item.id}}">{{item.txt}}</a></li>',
                            '{{else}}',
                            '<li><i>●</i><a href="#{{item.id}}">{{item.txt}}</a></li>',
                            '{{/if}}',
                        '{{/each}}',
                    '</ul>',
                '</div>'
        ].join('');
    return function(opt){
        var conf = {
            //必填项
            referNode: null, //侧边导航是否显示的参考区节点
            //选填项
            tpl: tpl,
            navitemSelector: 'li',
            curclass: 'cur'
            //navcon: $('body'), //存放侧边导航的容器，默认为$('body')
            //anchorConNode: $('body'), //从anchorConNode指定的容器里的配置，生成侧边导航锚点。没有则为$('body')
            //anchorSelector: '[anchor-slidenav]', //anchorConNode中要生成侧边锚点的dom的识别表达
            //referbt: 0, //参考区节点底部距离window顶部距离<=referbt，侧边导航显示，反之隐藏
            //anchortt: 300 //anchorSelector距离window顶部距离<=anchortt时，则侧边导航指向该锚点的元素高亮，添加curclass
        };
        $.extend(conf,opt);
        $sidenav(conf);
    };
});
