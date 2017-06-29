'use strict'

// global.CONFIG = require('./config.json');

const {
	etc,
	path,
	site,
	host,
	api
} = require('./config.json');

global.ETC = etc;
global.PATH = path;
global.SITE = site;
global.HOST = host;
global.API = api;
// UTILS(常用的工具函数集合)，只能用于nodeJS端，比如server代码或者模板中，例如：UTILS.md5(str)
global.UTILS = {};