/**
 * Created by LuoWen on 2016/11/25.
 */

export default class Debugger {
    constructor() {
    }

    static instance() {
        if(window.DEBUG) return;

        let obj = window;
        // obj.D_NOOP = 4;
        obj.D_VERB = 3;
        obj.D_DEBUG = 2;
        obj.D_ERROR = 1;
        // obj.D_FATAL = 0;
        obj.D_USING = obj.D_USING || obj.D_ERROR;
        // obj.USE_D_NOOP = ()=>obj.D_USING = obj.D_NOOP;
        obj.USE_D_VERB = ()=>obj.D_USING = obj.D_VERB;
        obj.USE_D_DEBUG = ()=>obj.D_USING = obj.D_DEBUG;
        obj.USE_D_ERROR = ()=>obj.D_USING = obj.D_ERROR;
        // obj.USE_D_FATAL = ()=>obj.D_USING = obj.D_FATAL;

        let getter = debugLevel => Object.assign({}, {
            enumerable: true,
            configurable: true,
            get: () => {
                return obj.D_USING === undefined
                    ? !0 : (obj.D_USING >= debugLevel);
            }
        });

        Object.defineProperties(obj, {
            VERB: getter(obj.D_VERB),
            DEBUG: getter(obj.D_DEBUG),
            ERROR: getter(obj.D_ERROR),
            // FATAL: getter(obj.D_FATAL)
        });

        // var property = Object.getOwnPropertyDescriptor(obj, key);
        // if (property && property.configurable === false) {
        //     return
        // }
        // // cater for pre-defined getter/setters
        // var getter = property && property.get;
        // var setter = property && property.set;

        // Object.defineProperty(obj, 'DEBUG', {
        //     enumerable: true,
        //     configurable: true,
        //     get: function() {
        //
        //         return window.D_USE;
        //     },
        //     set: function (newVal) {
        //         var value = getter ? getter.call(obj) : window.D_USE;
        //         if (newVal === value && !window.isNaN(newVal)) {
        //             return;
        //         }
        //
        //         window.D_USE = newVal;
        //     }
        // });
        //

    }
}