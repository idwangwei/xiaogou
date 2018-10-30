/**
 * Created by ZL on 2018/1/16.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
let t_home = angular.module('t_home', ['t_home.directives','t_home.services']);
registerModule(t_home);
export {t_home};
export * from 'ngDecoratorForStudent/ng-decorator';