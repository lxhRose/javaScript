// 向闭包中传入模块管理器对象F（~屏蔽压缩文件时，前面漏写;报错）
~(function(F) {
    /**
     * 创建或调用模块方法
     * @param url         参数为模块url
     * @param modDeps     参数为依赖模块
     * @param modCallback 参数为模块主函数
     */
    F.module = function(url, modDeps, modCallback) {
            // 将参数转化为数组
        var args = [].slice.call(arguments),
            // 获取模块构造函数（参数数组中最后一个参数成员）
            callback = args.pop(),
            // 获取依赖模块（紧邻回调函数参数，且数据类型为数组）
            deps = (args.length && args[args.length - 1] instanceof Array) ? args.pop() : [],
            // 该模块url（模块ID）
            url = args.length ? args.pop() : null,
            // 依赖模块序列
            params = [],
            // 未加载的依赖模块数量统计
            depsCount = 0,
            // 依赖模块序列中索引值
            i = 0,
            // 依赖模块序列长度
            len;
        // 赋值，获取依赖模块长度，并判断其有值
        if (len = deps.length) {
            // 遍历依赖模块
            while(i < len) {
                // 闭包保存i
                (function(i) {
                    // 增加未加载依赖模块数量统计
                    depsCount++;
                    // 异步加载依赖模块
                    loadModule(deps[i], function(mod) {
                        // 依赖模块序列中添加依赖模块接口引用
                        params[i] = mod;
                        depsCount--;
                        // 如果依赖模块全部加载
                        if(depsCount === 0) {
                            // 在模块缓存器中矫正该模块，并执行构造函数
                            setModule(url, params, callback);
                        }
                    });
                })(i);
                // 遍历下一依赖模块
                i++;
            }
        // 无依赖模块，直接执行回调函数
        } else {
            // 在模块缓存器中矫正该模块，并执行构造函数
            setModule(url, [], callback);
        }
    }
        // 模块缓存器，存储已创建模块
    var moduleCache = {},
    /**
     * 设置模块并执行模块构造函数
     * @param moduleName 模块ID名称
     * @param params     依赖模块
     * @param callback   模块构造函数
     */
    setModule = function(moduleName, params, callback) {
        console.log('setModule:'+moduleName)
        // 模块容器，模块文件加载完成回调函数
        var _module, fn;
        // 如果模块被调用过
        if(moduleCache[moduleName]) {
            // 获取模块
            _module = moduleCache[moduleName];
            // 设置模块为已经加载完成（注：之所以实现异步，是因为在index.html页面中使用模块时先执行 loadModule函数，缓存了模块；
            // 等模块文件加载进来以后又执行了setModule 函数，即执行到此处）
            _module.status = 'loaded';
            // 矫正模块接口
            _module.exports = callback ? callback.apply(_module, params) : null;
            // 执行模块文件加载完成回调函数
            while(fn = _module.onload.shift()) {
                fn(_module.exports);
            }
        } else {
            // 模块不存在（匿名模块，如index.html中使用情况），则直接执行构造函数
            callback && callback.apply(null, params);
        }
    },
    /**
     * 异步加载依赖模块所在文件
     * @param moduleName 模块路径（ID）
     * @param callback   模块加载完成回调函数
     */
    loadModule = function(moduleName, callback) {
        console.log('loadModule:'+moduleName)
        // 依赖模块
        var _module;
        // 如果依赖模块被加载过
        if(moduleCache[moduleName]) {
            // 获取该模块信息
            _module = moduleCache[moduleName];
            // 如果模块加载完成
            if(_module.status === 'loaded') {
                // 执行模块加载完成回调函数
                setTimeout(callback(_module.exports), 0);
            } else {
                // 缓存该模块所处文件加载完成回调函数
                _module.onload.push(callback);
            }
        // 模块第一次被依赖引用
        } else {
            // 缓存该模块初始化信息
            moduleCache[moduleName] = {
                moduleName: moduleName, // 模块ID
                status: 'loading',      // 模块对应文件加载状态（默认加载中）
                exports: null,          // 模块接口
                onload: [callback]      // 模块对应文件加载完成回调函数缓冲器
            };
            // 加载模块对应文件
            loadScript(getUrl(moduleName));
        }
    },
    getUrl = function(moduleName) {
        return String(moduleName).replace(/\.js$/g, '') + '.js';
    },
    loadScript = function(src) {
        var _script = document.createElement('script');
        _script.type = 'text/JavaScript';
        _script.charset = 'UTF-8';
        _script.async = true;// 异步加载
        _script.src = src;
        document.getElementsByTagName('head')[0].appendChild(_script);
    };
})((function() {
    // 创建模块管理器对象F，并保存在全局作用域中
    return window.F = {};
})());