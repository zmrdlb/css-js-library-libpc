/**
 * * @fileoverview 类似于百度百科的侧边号航 。请参考init方法中的opt变量里面的参数来识别以下说明：
 * 	 从anchorConNode指定的容器里，读取anchorSelector选择器指定的dom节点数据，根据传入的tpl模板来生成侧边导航，并加入body中。导航中的锚点指向anchorSelector选择器指定的dom节点。
 * 
 * 	 特别说明：
 *   1. anchorSelector选择器指定的dom节点必须符合以下特点：
 * 		1) 具有id；
 * 		2) innerHTML的内容为生成的侧边导航的锚点文案
 * @version 1.0.0 | 2015-10-23 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 侧边导航生成方法
 * @example
 *   requirejs(['$','module/ui/nav/sidenav'],function($,$sidenav){
    		$sidenav({ //参数说明详见方法init中的opt变量
    			referNode: $('#pl_refer'),
    			anchorConNode: $('#pl_anchor')
    		});
     });
 */
define(['$','dom/posWinScroll','base/template'],function($,$posWinScroll,$template){
	/**
	 * 导航模板，数据说明
	 * item.id 锚点id
	 * item.txt 锚点文本
	 * curclass 对应参数opt.curclass
	 */
	var tpl = [
		'<div>',
		'<ul>',
		'{{each list as item i}}',
			'{{if i == 0}}',
			'<li class="{{curclass}}"><a href="#{{item.id}}">{{item.txt}}</a></li>',
			'{{else}}',
			'<li><a href="#{{item.id}}">{{item.txt}}</a></li>',
			'{{/if}}',
		'{{/each}}',
		'</ul>',
		'</div>'
	].join('');
	
	return function(opt){
		var anchorttArr = []; //锚点位置信息
		var anchorCount = 0; //锚点个数
		var anchorNodes = null; //锚点节点
		//侧边导航节点
		var navnode = null;
		//anchorConNode容器定位事件处理
		function anchorPos(pos,node){
			anchorttArr.push([pos.tt,node]);
			if(anchorttArr.length == anchorCount){ //说明所有锚点的位置信息都搜集完成，开始处理
				anchorttArr.sort(function(x,y){return x[0]-y[0];}); //从小到大排序
				var curindex = 0; //待高亮的锚点的索引
				$.each(anchorttArr,function(index,arr){
					if(arr[0] <= opt.anchortt){
						curindex = index;
					}else{
					    if(index == anchorCount - 1 && arr[0] <= $(window).height()){ //说明已经遍历到最后一项，并且最后一项在窗口可视区域内
					        curindex = index;
					    }
						return false;
					}
				});
				//高亮操作
				var id = anchorttArr[curindex][1].attr('id');
				navnode.find('[href^="#"]').closest(opt.navitemSelector).removeClass(opt.curclass);
				navnode.find('[href="#'+id+'"]').closest(opt.navitemSelector).addClass(opt.curclass);
				//清除数据
				anchorttArr = [];
			}
		}
		//绑定相关事件
		function bindEvt(){
			//控制侧边栏显示隐藏事件
			$posWinScroll.listenPos({
				node: opt.referNode,
				call: function(pos){
					if(pos.bt <= opt.referbt){ //参考节点不在可视区则侧边栏显示
						navnode.show();
					}else{
						navnode.hide();
					}
				}
			});
			//控制侧边栏锚点定位事件
			anchorNodes.each(function(){
				$posWinScroll.listenPos({
					node: $(this),
					call: anchorPos
				});
			});
		}
		//创建侧边栏html并添加到页面
		function createHtml(){
			//获取锚点信息
			var anchorArr = [];
			anchorNodes.each(function(){
				var node = $(this);
				anchorArr.push({
					id: node.attr('id'),
					txt: node.html()
				});
			});
			//生成模板填充锚点
			var render = $template.compile(opt.tpl);
			navnode = $(render({
				curclass: opt.curclass,
				list: anchorArr
			})).appendTo(opt.navcon);
		}
		//初始化
		function init(){
			opt = $.extend({
				//必填项
				referNode: null, //侧边导航是否显示的参考区节点
				//选填项
				tpl: tpl, //侧边导航模板，格式请参考顶部的tpl变量制定的模板
				navcon: $('body'), //存放侧边导航的容器，默认为$('body')
				navitemSelector: 'li', //侧边导航单项锚点容器选择器。例如tpl中的li
				curclass: 'cur', //侧边导航当前锚点高亮时，给navitemSelector制定的祖先元素添加classname
				anchorConNode: $('body'), //从anchorConNode指定的容器里的配置，生成侧边导航锚点。没有则为$('body')
				anchorSelector: '[anchor-slidenav]', //anchorConNode中要生成侧边锚点的dom的识别表达
				referbt: 0, //参考区节点底部距离window顶部距离<=referbt，侧边导航显示，反之隐藏
				anchortt: 300 //anchorSelector距离window顶部距离<=anchortt时，则侧边导航指向该锚点的元素高亮，添加curclass
			},opt);
			if(!opt.referNode || opt.referNode.size() == 0){
				throw new Error('sidenav组件参数的参数referNode无效');
			}
			anchorNodes = opt.anchorConNode.find(opt.anchorSelector);
			anchorCount = anchorNodes.size();
			if(anchorCount == 0){
				return;
			}
			createHtml();
			bindEvt();
		}
		init();
	};
});
