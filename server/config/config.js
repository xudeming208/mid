'use strict'
const events = require("events");
const mEmitter = new events.EventEmitter;
mEmitter.setMaxListeners(0);

global.CONFIG = require('./config.json');
global.ETC = CONFIG.etc;
global.PATH = CONFIG.path;
global.SITE = CONFIG.site;
global.HOST = CONFIG.host;

