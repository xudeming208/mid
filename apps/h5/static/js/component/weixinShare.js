/**
 * 此组件是个性化定制微信分享及其他功能（包括是否隐藏右上角菜单接口，是否隐藏所有非基础按钮接口，批量隐藏功能按钮接口）；
 * 由于微信对域名的限制，域名必须是微信开发平台申请的域名
 * 用此组件之前别忘记在模板里面引入微信的JS，如http://res.wx.qq.com/open/js/jweixin-1.0.0.js
 * @author xudeming208@126.com
 * @param {opts} Object
 * 每个平台的每个字段都可以单独设置。如果分享的数据是一样的，只需要填写weixin一项即可
 *  {
        // 通用配置
        commonConfig: {
            // 显示隐藏右上角菜单接口
            "hideOptionMenu": false,
            "hideAllNonBaseMenuItem": false,
            // 隐藏的功能菜单，具体查看微信JDK
            "menuList": []
        },
        // 分享标题，默认为document.title
        title: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 分享描述，默认为"描述"
        desc: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 分享链接，默认为location.href
        link: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 分享图标，默认为logo
        imgUrl: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 分享类型，可为music、video或link，默认为link
        type: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 如果type是music或video，则要提供数据链接，默认为空
        dataUrl: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 接口调用成功时执行的回调函数,默认为空函数
        success: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 接口调用失败时执行的回调函数,默认为空函数
        fail: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 接口调用完成时执行的回调函数，无论成功或失败都会执行,默认为空函数
        complete: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到,默认为空函数
        cancel: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        },
        //  监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口,默认为空函数
        trigger: {
            "weixin": "",
            "weixin_timeline": "",
            "qzone": "",
            "weibo": "",
            "qq": ""
        }
     }
*/
function weixinShare(opts) {
    opts = opts || {
        'title': {},
        'desc': {},
        'link': {},
        'imgUrl': {},
        'type': {},
        'dataUrl': {},
        'success': {},
        'fail': {},
        'complete': {},
        'cancel': {},
        'trigger': {}
    };
    var objKey = ['title', 'desc', 'link', 'imgUrl', 'type', 'dataUrl', 'success', 'fail', 'complete', 'cancel', 'trigger'];
    objKey.forEach(function(key) {
        if (!opts[key]) {
            opts[key] = {};
        }
    })
    opts.commonConfig = opts.commonConfig || {};
    $.ajax({
        //签名后端的接口
        url: 'http://www.xxx.com',
        data: {
            url: window.location.href
        },
        dataType: 'jsonp',
        type: 'get',
        success: function(data) {
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            });
        }
    })
    wx.ready(function() {
        var channels = ["weixin", "weixin_timeline", "qq", "weibo", "qzone"];
        var weixinShareObj = {};
        channels.forEach(function(chan) {
            weixinShareObj[chan] = {
                "title": opts["title"][chan] || opts["title"]['weixin'] || document.title,
                "desc": opts["desc"][chan] || opts["desc"]['weixin'] || "描述",
                "link": opts["link"][chan] || opts["link"]['weixin'] || location.href,
                "imgUrl": opts["imgUrl"][chan] || opts["imgUrl"]['weixin'] || "https://www.baidu.com/img/bd_logo1.png",
                "type": opts["type"][chan] || opts["type"]['weixin'] || "link",
                "dataUrl": opts["dataUrl"][chan] || opts["dataUrl"]['weixin'] || "",
                "success": opts["success"][chan] || opts["success"]['weixin'] || function(res) {},
                "fail": opts["fail"][chan] || opts["fail"]['weixin'] || function(res) {},
                "complete": opts["complete"][chan] || opts["complete"]['weixin'] || function(res) {},
                "cancel": opts["cancel"][chan] || opts["cancel"]['weixin'] || function(res) {},
                "trigger": opts["trigger"][chan] || opts["trigger"]['weixin'] || function(res) {}
            };
        });
        //weixin
        wx.onMenuShareAppMessage(weixinShareObj["weixin"]);
        //weixin_timeline
        wx.onMenuShareTimeline(weixinShareObj["weixin_timeline"]);
        //QQ
        wx.onMenuShareQQ(weixinShareObj["qq"]);
        //weibo
        wx.onMenuShareWeibo(weixinShareObj["weibo"]);
        //qzone
        wx.onMenuShareQZone(weixinShareObj["qzone"]);
        // 是否隐藏右上角菜单接口
        if (opts.commonConfig.hideOptionMenu) {
            wx.hideOptionMenu();
        }
        // 是否隐藏所有非基础按钮接口
        if (opts.commonConfig.hideAllNonBaseMenuItem) {
            wx.hideAllNonBaseMenuItem();
        }
        // 批量隐藏功能按钮接口
        if (opts.commonConfig.menuList.length) {
            wx.hideMenuItems({
                menuList: opts.commonConfig.menuList
            });
        }
    });
    wx.error(function(res) {
        alert('微信错误：' + res.errMsg);
    });
}
return weixinShare;