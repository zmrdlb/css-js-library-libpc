/**
 * @fileoverview bigpipe js 端实现库，引用github:https://github.com/linares/bigpipe
 * 更多bigpipe的介绍参加：http://www.searchtb.com/2011/04/an-introduction-to-bigpipe.html
 * 
 * 对原作者的bigpipe.js做出了如下改进：
 * 1. 增加css加载完成判断；
 * 2. js加载完成判断方式进行修改：
 *    原方式：所有js资源里最后都必须有代码 if (BigPipe != undefined) { BigPipe.fileLoaded("geodata.js"); }
 *          来通知js加载完成；
 * 		坏处：依赖于js资源里面需添加规定代码，有时候加载的js资源是外部项目的资源无法添加规定的代码，有一定局限性；
 *      好处：兼容ie8及以下当加载资源不存在也会通知onload、onerror和onreadystatechange说明资源加载完成；
 *    现方式：监听js的onload、onerror和onreadystatechange进行判断；
 *      好处：加载的js资源里不需要添加规定代码，可加载任何js，无局限性；
 *      坏处：ie8及以下即使资源不存在也会检测到资源加载完成；
 * 3. pagelet的id不是必填项
 * 4. pagelet的js_code是function，调用传入的参数是当前的id，没有则为null
 * 5. 就算某个pagelet的资源加载失败了也不会阻塞后面pagelet资源的请求
 * 6. 对于一个pagelet里面如果有多个css或js,css和js各自按照队列顺序加载（因为这样写一般文件之间有依赖关系）
 * 
 * 相关其他说明：
 * 7. 文件去重（避免文件重复加载）的识别标识为：文件名+后缀。
 * 如以下几组情况识别为同一种文件：
 * 	1) http://www.libpc.com/js/demo/bigpipe/rangeslider.css?v=1.0和http://www.libpc.com/js/demo/bigpipe/rangeslider.css?v=2.0
 *     均识别为同一个文件：rangeslider.css
 *  2) http://www.libpc.com/js/demo/bigpipe/rangeslider.css?v=1.0和http://www.aa.com/js/bigpipe/rangeslider.css?v=1.0
 *     均识别为同一个文件：rangeslider.css
 * 
 * 注意项：
 * 1. css和js的资源文件名不能相同，即使全路径不同。例如：
 *    http://baidu.com/my.js和http://www.libpc.com/my.js的资源文件名都是my.js，重复了，错误使用！
 *    应该改为：
 *    http://baidu.com/my1.js和http://www.libpc.com/my2.js，资源文件名分别是my1.js和my2.js
 * 
 * bigpipe.js功能说明：
 *    页面拆分成不同的pagelet，每接收一个pagelet就启动加载相关css资源，css加载完毕后添加配置的html;
 *    当页面所有的pagelet都已添加完html，则启动加载每个pagelet配置的js资源；
 *    pagelet的所有js资源加载完成后则执行pagelet配置的js代码js_code
 * @version 1.0 | 2015-06-30 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example·
 * 	  请见demo/bigpipe/bigpipe.html
 * */
(function(){
	/**
	 * 给数组添加遍历功能
	 */
	Array.prototype.each = function(fun){
		for(var i = 0, len = this.length; i < len; i++){
			fun(this[i],i);
		}
	};
	/**
	 * 给一个函数指定上下文
	 */
	Function.prototype.bind = function(context){
		var that = this;
		return function(){
			var args = Array.prototype.slice.call(arguments, 0);
			that.apply(context,args);
		};
	};
	/**
	 * json对象遍历 
	 * @param {JSON} *hash 当前json对象
	 * @param {Function} *fun 遍历回调
	 */
	function hashEach(hash,fun){
		for(var name in hash){
			fun(hash[name],name);
		}
	};
	/**
	 * 检测data是否是类型type,如果不是则给出默认值 defaultvalue
	 * @param {*} data 待检测数据
	 * @param {*} type 数据类型
	 * @param {*} defaultvalue 默认值
	 */
	function formatDataByType(data,type,defaultvalue){
		if(!data || data.constructor != type){
			return defaultvalue;
		}
		return data;
	}
	/******资源加载方法处理模块 begin*******/
	//插入资源的head节点
	var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement; //资源插入的区域
	/**
	 * 资源加载方法
	 */
	function loadResource(config){
		var ref = null, timer = null;
		function complete(){ //资源加载完成执行的方法
			// Handle memory leak in IE
			ref.onload = ref.onerror = ref.onreadystatechange = null;
			// 移除资源
			if (ref.parentNode) {
				ref.parentNode.removeChild(ref);
			}
			ref = null;
			if(typeof config.oncomplete == 'function'){
				config.oncomplete();
			}
		}
		if (config.type == 'css') {
			ref = document.createElement('link');
			ref.setAttribute('rel', 'stylesheet');
			ref.setAttribute('type', 'text/css');
			ref.href = config.file;
		}
		if (config.type == 'js') {
			ref = document.createElement('script');
			ref.setAttribute('type', 'text/javascript');
			ref.async = true;
			ref.src = config.file;
		}
		if(ref){
			if(config.charset){
				ref.charset = config.charset;
			}
			ref.onload = ref.onerror = ref.onreadystatechange = function() { //检测资源加载状况
				if (!ref.readyState || /loaded|complete/.test( ref.readyState ) ) { //不支持onreadystatechange的浏览器没有script.readyState属性
					if(timer){clearTimeout(timer);}
					complete();
				}
			};
			head.insertBefore(ref,head.firstChild);
			if(config.timeout && typeof config.timeout == 'number' && config.timeout > 0){
				timer = setTimeout(function(){
					complete();
				},config.timeout);
			}
		}
	};
	/******资源加载方法处理模块 end*******/
	/**
	 * pagelet资源类，对每个css或js资源进行封装
	 * @param {String} *file 完整的资源文件path http://www.mycode.com/js/widget/bigpipe/bigpipe.js
	 * @param {String} *name 资源文件名称不包含完成的path bigpipe.js
	 * @param {String} *type 文件类型 js|css
	 * @param {String} charset 文件编码
	 */
	function PageletResource(file, name, type, charset){
		this.file = file || null;
		this.name = name || null;
		this.type = type || null;
		this.charset = charset || null;
		this.belongs = []; //当资源被加载完的回调函数存储区
		this.phase = 0; //资源状态 0:未开始 1:开始加载 2:加载完成
		BigPipe.debug("Pagelet " + name + " created as type " + type + " with file ", file);
	}
	/**
	 * 添加回调函数到belongs。当资源加载完成会触发回调callback
	 * @param {Function} *callback 资源加载完成的回调函数
	 */
	PageletResource.prototype.attachToPagelet = function(callback) {
		this.belongs.push(callback);
	};
	/**
	 * 启动资源加载
	 */
	PageletResource.prototype.startLoading = function() {
		if (this.phase == 2) { //说明该资源已全部加载完成，直接通知
			this.onComplete();
			return;
		}else if(this.phase != 0){ //说明已经启动了资源加载，返回
			return;
		}
		this.phase = 1;
		var that =  this;
		if (this.type == 'css' || this.type == 'js') {
			BigPipe.debug("Started loading " + this.type + " resource:", this.file);
			loadResource({
				type: this.type,
				file: this.file,
				charset: this.charset,
				timeout: BigPipe.timeout,
				oncomplete: function(){
					that.onComplete(); //资源加载完成
				}
			});
		}
	};
	//通知资源加载完成
	PageletResource.prototype.onComplete = function() {
		this.phase = 2;
		BigPipe.debug("resource " + this.file + " loaded");
		this.belongs.each(function(x){
			x(this);
		}.bind(this));
	};
	
	/**
	 * pagelet类。每个pagelet渲染和资源加载如下：
	 * 1) css加载
	 * 2) html渲染
	 * 3) js 加载
	 * 4) 所有js加载完成后执行js_code
	 * @param {JSON} *json pagelet配置项
	 * {
	 * 	 {String} *id pagelet容器id,
	 *   {Array} *css_files css文件地址列表 [{path:'css地址，必填',charset:'css编码，可选'}]
	 *   {Array} *js_files js文件地址列表 [{path:'js地址，必填',charset:'js编码，可选'}]
	 *   {Function} js_code js_files加载完成后，执行的js函数。传入的参数是当前容器的id
	 *   {String} innerHTML pagelet容器中需要添加的html
	 *   {Boolean} is_last 是否是页面上最后一个pagelet
	 * }
	 */
	function Pagelet(json){
		this.id = json.id || null;
		/**
		 * pagelet状态
		 * 0: 未开始
		 * 1: 正在加载css
		 * 2: css加载完成，正在添加innerHTML
		 * 3: innerHTML添加完成
		 * 4: 正在加载js
		 * 5: js资源加载并执行完成，正在执行js_code
		 * 6: js_code执行完成，整个pagelet执行完毕
		 */
		this.phase = 0;
		this.json = json;
		this.jsCode = json.js_code || null;
		this.innerHTML = json.innerHTML || '';
		this.cssResources = []; //css PageletResource对象缓存 [css resource对象]
		this.jsResources = []; //js PageletResource对象缓存 [js resource对象]
		this.json.css_files = formatDataByType(this.json.css_files,Array,[]);
		this.json.js_files = formatDataByType(this.json.js_files,Array,[]);
	}
	/**
	 * 启动pagelet资源加载
	 */
	Pagelet.prototype.start = function() {
		if(this.phase != 0){return;}
		//读取css资源并创建PageletResource css资源对象(已做去重处理)，并添加css资源加载完成回调，并缓存到this.cssResources
		this.json.css_files.each(function(x) {
			var cssResource = BigPipe.pageletResourceFactory(x.path, 'css', x.charset);
			this.attachCssResource(cssResource);
		}.bind(this));
		//读取css资源并创建PageletResource js资源对象(已做去重处理)，并添加js资源加载完成回调，并缓存到this.jsResources
		this.json.js_files.each(function(x) {
			var jsResource = BigPipe.pageletResourceFactory(x.path, 'js', x.charset);
			this.attachJsResource(jsResource);
		}.bind(this));
		//启动css加载
		this.startCssLoad();
	};
	/**
	 * 加载css队列
	 * @param {PageletResource} x css资源对象 
	 */
	Pagelet.prototype.cssLoadQueue = function(x){
		if(this.cssResources.length == 0){ //说明无css资源，直接添加html
			this.onCssOnload();
		}else{
			this.cssResources.shift().startLoading();
		}
	};
	/**
	 * 加载js队列
	 * @param {PageletResource} x js资源对象 
	 */
	Pagelet.prototype.jsLoadQueue = function(x){
		if(this.jsResources.length == 0){ //说明无js资源
			this.onJsOnload();
		}else{
			this.jsResources.shift().startLoading();
		}
	};
	/**
	 * 启动css资源加载。如果有多个css资源则按队列顺序加载（一般多个会有依赖关系） 
	 */
	Pagelet.prototype.startCssLoad = function(x){
		if(this.phase >= 1){return;}
		this.phase = 1;
		this.cssLoadQueue();
	};
	/**
	 * 启动js资源加载 。如果有多个js资源则按队列顺序加载（一般多个会有依赖关系） 
	 */
	Pagelet.prototype.startJsLoad = function(x){
		if(this.phase >= 4){return;}
		this.phase = 4;
		this.jsLoadQueue();
	};
	/**
	 * 对css PageletResource对象添加css加载完成的回调处理
	 * @param {PageletResource} resource
	 */
	Pagelet.prototype.attachCssResource = function(resource) {
		BigPipe.debug("Attaching CSS resource " + resource.file + " to pagelet " + this.id, null);
		resource.attachToPagelet(this.cssLoadQueue.bind(this));
		this.cssResources.push(resource);
	};
	/**
	 * 对js PageletResource对象添加js加载完成的回调处理
	 * @param {PageletResource} resource
	 */
	Pagelet.prototype.attachJsResource = function(resource) {
		BigPipe.debug("Attaching JS resource " + resource.file + " to pagelet " + this.id, null);
		resource.attachToPagelet(this.jsLoadQueue.bind(this));
		this.jsResources.push(resource);
	};
	/**
	 * 当pagelet中的一个js资源加载完成则调用此函数
	 */
	Pagelet.prototype.onJsOnload = function() {
		if (this.phase >= 5) { //说明所有js资源已全部加载并执行完成
			return;
		}
		var allLoaded = true; //pagelet的所有js是否全部加载完成
		this.jsResources.each(function(pair) {
			if (pair.phase != 2) { //检测每个js资源是否加载完成
				allLoaded = false;
			}
		});
		if (!allLoaded) {
			return;
		}
		//说明所有js资源已全部加载并执行完成，开始执行js_code
		this.phase = 5;
		BigPipe.debug("pagelet " + this.id + ": All JS resources are loaded");
		if (typeof this.jsCode == 'function') { //如果需要执行额外的js代码则执行
			try {
				BigPipe.debug("evaluating js code: ", this.jsCode);
				this.jsCode(this.id);
			} catch (e) {
				BigPipe.debug("Error while evaluating " + e);
			}
		}
		this.phase = 6; //设置pagelet状态完毕
	};
	/**
	 * 当pagelet中的一个css资源加载完成则调用此函数
	 */
	Pagelet.prototype.onCssOnload = function() {
		if(this.phase >= 2){ //说明所有css已全部加载完成
			return; 
		}
		BigPipe.debug("pagelet " + this.id + " got notified that CSS resource is loaded: ");
		var allLoaded = true; //pagelet的所有css是否全部加载完成
		this.cssResources.each(function(pair) {
			if (pair.phase != 2) {
				allLoaded = false;
			}
		});
		if (!allLoaded) {
			return;
		}
	    //说明所有css资源已加载完成，开始添加html
	    this.phase = 2;
		BigPipe.debug("all resources loaded", this);
		//添加html
		this.injectInnerHTML();
	};
	
	/**
	 * 给pagelet容器添加html
	 */
	Pagelet.prototype.injectInnerHTML = function() {
		if(this.phase >= 3){return;}
		BigPipe.debug("injecting innerHTML to " + this.id, this);
		if (this.id && typeof this.innerHTML == "string" && this.innerHTML != "") {
			var div = document.getElementById(this.id);
			if(div){
				div.innerHTML = this.innerHTML;
			}
		}
		this.phase = 3;
		BigPipe.pageletHTMLInjected(this); //通知BigPipe当前pagelet的html已添加完成
	};
	
	/**
	 * BigPipe类，管理多个pagelet
	 */
	var BigPipe = {
	    /**
	     * PageletResource资源resource缓存 {resource.name:resource}.如：{'bigpipe.js':bigpipe.js的PageletResource对象}
	     */
		pageletResources: {},
	    /**
	     * Pagelet对象缓存 [pagelet对象]
	     */
		pagelets: [],
	    /**
	     * Bigpipe状态
	     * 0: pagelet正在载入
	     * 1: 最后一个pagelet已经通过onArrive接收
	     * 2: 开始加载js
	     */
		phase: 0,
		/**
		 * 是否打印调试信息
		 */
		_debug: false,
		/**
		 * css和js资源加载的超时时间，默认为null，不检测超时
		 */
		timeout: null,
		/**
		 * 服务端server调用此方法来载入pagelet配置
		 * <script>BigPipe.onArrive({资源配置})</script>
		 * @param {JSON} data Pagelet配置资源
		 */
		onArrive: function(data) {
			this.debug("Pagelet arrived: ", data);
			//判断是否是最后一个pagelet
			if (data.is_last != undefined && data.is_last) {
				this.debug("This pagelet was last:", data);
				this.phase = 1;
			}
			var pagelet = new Pagelet(data);
			this.pagelets.push(pagelet);
			pagelet.start(); //启动当前pagelet资源加载
		},
	    /**
	     * 每个pagelet的html渲染完成就会调用此方法。
	     * 检测是否所有的pagelet都已渲染完成。完成则启动js加载++
	     */
		pageletHTMLInjected: function(pagelet) {
			var allLoaded = true;
			this.debug("pageletHTMLInjected", pagelet);
			this.pagelets.each(function(pair) {
				if (pair.phase < 3) { //说明此pagelet的html还未添加完成
					this.debug("pageletHTMLInjected pagelet still not loaded", pair);
					allLoaded = false;
				}
			}.bind(this));
			if (!allLoaded) {
				return;
			}
			if (this.phase == 1) { //说明所有的pagelet的html已添加完成并且最后一个pagelet已接收
				this.loadJSResources();
			}
		},
	    /**
	     * 启动js资源加载。没有必要再通知Bigpipe是否所有的Js都已加载完成
	     */
		loadJSResources: function() {
			this.phase = 2;
			this.debug("Starting to load js resources...");
			this.pagelets.each(function(pair) {
				pair.startJsLoad();
			});
		},
	    /**
	     * 打印调试信息
	     */
		debug: function(funcName, data) {
			if (BigPipe._debug && typeof console != 'undefined' && typeof console.log != 'undefined') {
				console.log('BigPipe.' + funcName, data);
			}
		},
	    /**
	     * 返回一个PageletResource对象
	     * @param {String} *file 完整的资源路径
	     * @param {String} *type 文件类型 css|js
	     * @param {String} charset 文件编码
	     */
		pageletResourceFactory: function(file, type, charset) {
			if(!file){
				BigPipe.debug('资源文件路径无效');
			}
			var re = new RegExp("(?:.*\/)?(.+"+type+")"); //从资源全路径中读取文件名。如返回bigpipe.js、main.css等
			var m = re.exec(file);
			var name = file;
			if (m) {
				name = m[1];
			}
			var res = this.pageletResources[name]; //从缓存中看是否已经加载过此资源
			if (res == null) { //如果没有加载过则创建一个新的资源对象
				res = new PageletResource(file, name, type, charset);
				this.pageletResources[name] = res;
			}
			return res;
		}
	};
	window.BigPipe = BigPipe;
})();
