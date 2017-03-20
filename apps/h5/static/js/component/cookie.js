fml.define('component/cookie', [], function(require, exports) {

    'use strict'
    var cookie = {
        set: function(name, val, expires) {
            if (!expires) {
                // 没设置过期时间默认为30天
                var days = 30;
                expires = new Date();
                expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            }
            document.cookie = name + "=" + encodeURIComponent(val) + ';expires=' + expires.toGMTString() + ';';
        },
        get: function(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); //正则匹配
            if (arr = document.cookie.match(reg)) {
                return decodeURIComponent(arr[2]);
            } else {
                return null;
            }
        },
        del: function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.get(name);
            if (cval != null) {
                this.set(name, cval, exp);
            }
        }
    }

    return cookie;
})