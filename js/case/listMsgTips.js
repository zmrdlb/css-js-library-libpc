/**
 * * @fileoverview 对于异步数据请求渲染列表这类应用场景，统一处理状态显示。
 * @version 1.0.0 | 2015-11-02 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 各种状态处理方法
 * @example
 *   requirejs(['base/btnMsgTips'],function($btnMsgTips){
    	node.click(function(){
    		$btnMsgTips.start($(this),'loading'); //开始交互
    		$btnMsgTips.end($(this),'loading'); //结束交互
    		$btnMsgTips.error('投票失败'); //错误提示
    	});
     });
 */
define(['$','base/checkDataType','compatible/deviceevtname','base/template'],function($,$checkDataType,$deviceevtname,$template){
    var tpl = {
        loading: [
            '<p node="listmsgstate_loading" class="g-msg-tips loading">',
                '<img src="'+$SCOPE.asset_basepath+'/page/common/img/loading-circle-16.gif" alt="">',
                '<span>{{msg}}</span>',
            '</p>'
        ].join(''),
        error: [
            '<p node="listmsgstate_error" class="g-msg-tips retry">',
                '{{msg}}<a href="javascript:;" node="retry">{{retrymsg}}</a>',
            '</p>'
        ].join(''),
        empty: [
            '<p node="listmsgstate_empty" class="g-msg-tips empty">',
                '{{msg}}',
            '</p>'
        ].join('')
    };
	return {
		/**
		 * 渲染
		 */
		_render: function(opt,defmsg,tpl){
			if(!$checkDataType.isObject(opt) || !$checkDataType.isValidJqueryDom(opt.container)){
				throw new Error('组件listMsgTips传入参数错误');
			}
			if($checkDataType.isInvalid(opt.msg)){
                opt.msg = defmsg;
            }
            var render = $template.compile(tpl);
            var html = render(opt);
			if(!$checkDataType.isBoolean(opt.append)){
				opt.append = false;
			}
			if(opt.append){
				opt.container.append(html);
			}else{
				opt.container.html(html);
			}
		},
		/**
		 * 开始请求，给container添加loading样式的HTML
		 * opt {
		 * 		@param {Element} *container 容器
		 * 		@param {String} msg loading文案，替换默认文案：'正在加载数据...'
		 * 		@param {Boolean} append true: msg填充container; false:msg添加到container后面。默认是false
		 * }
		 */
		loading: function(opt){
			var defmsg = '正在加载数据...';
			this._render(opt,defmsg,tpl.loading);
		},
		/**
		 * 请求出错，给container添加error样式的HTML
		   opt {
		 * 		@param {Element} *container 容器
		 * 		@param {String} msg 替换默认文案：'加载数据失败！'
		 *      @param {String} retrymsg 替换默认文案：'点击重新加载'
		 * 		@param {Boolean} append true: msg填充container; false:msg添加到container后面。默认是false
		 * }
		 */
		error: function(opt){
			var def = {
			    msg: '加载数据失败！',
			    retrymsg: '点击重新加载'
			};
			if($checkDataType.isInvalid(opt.retrymsg)){
                opt.retrymsg = def.retrymsg;
            }
			this._render(opt,def.msg,tpl.error);
		},
		/**
		 * 绑定提示error信息时，点击node="retry"(请重试)按钮的事件
		 * {
		 *     @param {Element} *container 容器
		 *     @param {Function} *call "请重试"按钮点击后的回调事件
		 * } 
		 */
		bindError: function(opt){
		    if(!$checkDataType.isValidJqueryDom(opt.container) || !$checkDataType.isFunction(opt.call)){
		        throw new Error('组件listMsgTips-bindError传入参数错误');
		    }
		    opt.container.on($deviceevtname.click,'[node="retry"]',function(e){
		        opt.call();
		    });
		},
		/**
         * 数据为空提示信息，给container添加empty样式的HTML
           opt {
         *      @param {Element} *container 容器
         *      @param {String} msg empty文案，替换默认文案：'您还未有任何数据'
         *      @param {Boolean} append true: msg填充container; false:msg添加到container后面。默认是false
         * }
         */
		empty: function(opt){
		    var defmsg = '还未有任何数据';
            this._render(opt,defmsg,tpl.empty);
		},
		/**
		 * 从容器中移除制定类型的状态提示 
         * {
         *     @param {Element} *container 容器节点
         *     @param {String} *type 枚举：loading,error,empty
         * }
		 */
		remove: function(opt){
		    if(!$checkDataType.isValidJqueryDom(opt.container) || !$checkDataType.isString(opt.type)){
                throw new Error('组件listMsgTips-remove传入参数错误');
            }
		    opt.container.children('[node="listmsgstate_'+opt.type+'"]').remove();
		}
	};
});
