~(function() { // ~屏蔽压缩报错
    // 在闭包中获取全局变量
    var window = this || (0, eval)('this');
    // 获取页面字体大小，作为创建页面UI的参照物
    var FONTSIZE = function() {
        return parseInt(document.body.currentStyle ? document.body.currentStyle['fontSize'] : getComputedStyle(document.body, false)['fontSize']);
    }();
    console.log(FONTSIZE);

    // 视图模型对象
    var VM = function() {
        // 组件创建策略对象
        var Method = {
            progressbar: function(dom, data) { // 进度条组件创建方法
                var progress = document.createElement('div'),
                    param = data.data;
                progress.style.width = (param.position || 100) + '%';
                progress.className = 'ui-progressbar';
                dom.appendChild(progress);
            },
            slider: function(dom, data) { // 滑动条组件创建方法

            }
        }

        // 获取视图层组件渲染数据的映射信息 
        // dom  组件元素
        function getBindData(dom) {
            var type = dom.getAttribute('data-type');
            var data = dom.getAttribute('data-data');
            var dataStr = `type: '${type}', data: ${data}`;
            console.log(dataStr);
            // 将自定义的data-bind值转化为对象
            return !!dataStr && (new Function("return ({" + dataStr + "})"))();
        }

        // 组件实例化方法
        return function() {
            // 获取页面中所有元素
            var doms = document.body.getElementsByTagName('*'),
                // 元素自定义数据句柄
                ctx = null;
            for(var i = 0; i < doms.length; i++) {
                ctx = getBindData(doms[i]);
                console.log(ctx);
                ctx.type && Method[ctx.type] && Method[ctx.type](doms[i], ctx);
            }
        }
    }(); // 立即执行，返回 return function() {...}，当外部调用VM()时，执行该函数。 利用了闭包
    // 将视图模型绑定在window上，供外部获取
    window.VM = VM;
})(); // function() {}(); 定义后立即执行

window.onload = function() {
    VM();
}
