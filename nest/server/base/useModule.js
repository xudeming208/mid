'use strict'
let jsDepCache = {};

function useModule(modules) {
    if (!Array.isArray(modules)) {
        modules = [modules]
    }

    modules.map((mod) => {
        let use=`fml.use('${mod.trim()}');`;
        if (!this._JSstack.includes(use)) {
            this._JSstack.push(use)
        }
    })

    // this._JSstack.push(...fullModulesInvoke)
    // this._JSstack = TOOLS.unique(this._JSstack)

    if (!SITE.jsDefer) return

    var blockKey = TOOLS.md5(modules.toString()),
        getAllModules = (mod) => {
            !this._JSmods.includes(mod) && this._JSmods.push(mod);
            // combo
            if (ETC.debug) {
                !this._JSLinks.includes(mod) && this._JSLinks.push(mod);
                this._JSmods.length = 0;
            }
        }

    if (jsDepCache.hasOwnProperty(blockKey)) {
        var jss = jsDepCache[blockKey]
        if (false !== jss) jss.map(getAllModules)
        return
    }

    jsDepCache[blockKey] = modules.length ? modules : false
    modules.forEach(getAllModules)
}
module.exports = useModule;