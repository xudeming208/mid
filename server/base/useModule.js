'use strict'
let jsDepCache = {};

function useModule(modules) {
    if (!Array.isArray(modules)) {
        modules = [modules]
    }

    // modules.map((mod) => {
    //     let use=`fml.use('${mod.trim()}');`;
    //     if (!this._JSstack.includes(use)) {
    //         this._JSstack.push(use)
    //     }
    // })

    // this._JSstack.push(...fullModulesInvoke)
    // this._JSstack = UTILS.unique(this._JSstack)

    if (!SITE.jsDefer) return

    modules.forEach((mod, index) => {
        // merge
        if (!ETC.merge) {
            !this._JSLinks.includes(mod) && this._JSLinks.push(mod);
            this._JSmods.length = 0;
        } else {
            !this._JSmods.includes(mod) && this._JSmods.push(mod);
            this._JSLinks.length = 0;
        }
    })

}
module.exports = useModule;