F.module('module/lib/event', ['module/lib/dom'], function(dom) {// 创建event模块，依赖dom模块
    return {
        /**
         * @param id  元素id
         * @param type 事件类型
         * @param callback 回调函数
         */
        on: function(id, type, callback) {
            dom.g(id)['on' + type] = callback;
        }
    }
});
