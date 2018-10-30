/**
 * Created by 彭建伦 on 2016/5/13.
 * service基类
 */
export default class BaseService {
    constructor() {
        BaseService.bindInjectVariablesToThis(this, arguments);
        BaseService.initSharedDataForThis(this);
    }

    static bindInjectVariablesToThis(me, args) {
        let injects = me.constructor.$inject;
        if (!injects || !(injects instanceof Array)) { //必须在class上指定“$inject”属性
            return console.error('the "$inject" property muse be specified on class ' + me.constructor.name);
        }
        injects.forEach((val, idx)=> {
            if (val == '$scope') {
                me.getScope = function () {
                    return args[idx];
                }
            } else if (val == '$rootScope') {
                me.getRootScope = function () {
                    return args[idx];
                }
            } else {
                me[val] = args[idx];
            }
        });
    }

    static initSharedDataForThis(me) {
        me.initSharedData = me.initSharedData || BaseService.noop;
        me.initSharedData();
    }

    static noop() {
        //null function
    }
}
