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
            return cookies[name];
        },
        clear: function(name) {
            return set(name, '');
        }
    }
    
    return cookie;
})