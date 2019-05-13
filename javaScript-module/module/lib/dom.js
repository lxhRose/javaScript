F.module('module/lib/dom', function() {
    return {
        /**
         * 
         * @param {*} id 元素id
         */
        g: function(id) {
            return document.getElementById(id);
        },
        /**
         * 
         * @param {*} id 元素id
         * @param {*} html 要设置的内容
         */
        html: function(id, html) {
            if (html) {
                this.g(id).innerHTML = html;
            } else {
                return this.g(id).innerHTML;
            }
        }
    }
});
