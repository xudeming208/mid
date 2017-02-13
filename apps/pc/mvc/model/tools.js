exports.getBrowser = function(req) {
    let browser = {},
        ua = req.headers['user-agent'];
    if (!ua) return browser;
    if (/msie/i.test(ua)) {
        browser.msie = true;
        if (/6.0/i.test(ua)) browser.version = '6.0';
        else if (/7.0/i.test(ua)) browser.version = '7.0';
        else if (/8.0/i.test(ua)) browser.version = '8.0';
        else if (/9.0/i.test(ua)) browser.version = '9.0';
    } else if (/chrome/i.test(ua)) {
        browser.chrome = true;
    } else if (/safari/i.test(ua)) {
        browser.safari = true;
    } else if (/firefox/i.test(ua)) {
        browser.firefox = true;
    }
    return browser;
}