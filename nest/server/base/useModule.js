'use strict'
const Base = require('./base');
let jsDepCache = {};
let isFirst = true;

function useModule(modules) {
    if (!Array.isArray(modules)) {
        modules = [modules];
    }

    if (isFirst) {
        isFirst = false;
        modules = this._JSLinks.concat(modules);
        this._JSLinks.length = 0;
    }

    let len = modules.length;

    let fullModulesInvoke = modules.map(mod => {
        return `fml.use('${mod.trim()}');`
    })

    this._JSstack = this._JSstack.concat(fullModulesInvoke);

    if (!SITE.JS_Defer) {
        return;
    }

    let blockKey = Base.md5(modules.toString()),
        getAllModules = mod => {
            this._JSmods.push(mod);
            if (!ETC.combo) {
                this._JSLinks.push(mod);
                this._JSmods.length = 0;
            }
        };

    if (jsDepCache.hasOwnProperty(blockKey)) {
        let jss = jsDepCache[blockKey];
        if (false !== jss) {
            jss.map(getAllModules)
        }
        return;
    }

    jsDepCache[blockKey] = len ? modules : false;
    modules.forEach(getAllModules);
}
module.exports = useModule;