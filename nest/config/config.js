'use strict'
global.CONFIG = require('./config.json');
global.ETC = CONFIG.etc;
global.PATH = CONFIG.path;
global.SITE = CONFIG.site;
global.HOST = CONFIG.host;
global.API = CONFIG.api;
// TOOLS(常用的工具函数集合)，只能用于nodeJS端，比如server代码或者模板中，例如：TOOLS.md5(str)
global.TOOLS = {};