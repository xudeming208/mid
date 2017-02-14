'use strict'
global.CONFIG = require('./config.json');
global.ETC = CONFIG.etc;
global.PATH = CONFIG.path;
global.SITE = CONFIG.site;
global.HOST = CONFIG.host;
global.API = CONFIG.api;
// TOOLS(常用的工具函数集合)，代码和模板中都可以使用，例如：TOOLS.md5(str)
global.TOOLS = {};