/**
 * Created by 彭建伦 on 2016/4/29.
 */
export default class BaseService {
    constructor() {
        let injects = this.constructor.$inject;
        if (!injects || !(injects instanceof Array)) { //必须在class上指定“$inject”属性
            return console.error('the "$inject" property muse be specified on class ' + this.constructor.name);
        }
        this.setMethodsForInjects(arguments[0]);
    }

    setMethodsForInjects(args) {
        let me = this;
        this.constructor.$inject.forEach((val, idx) => {
            if (val == '$scope') {
                me.getScope = function () {
                    return args[idx];
                }
            } else if (val == '$rootScope') {
                me.getRootScope = function () {
                    return args[idx];
                }
            } else if (val == '$state') {
                me.getStateService = function () {
                    return args[idx];
                }
            } else {
                me[val] = args[idx];
            }
        });
    }
}
