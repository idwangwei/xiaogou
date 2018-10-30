/**
 * Created by ZL on 2018/3/15.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';

let t_user_auth = angular.module('t_user_auth', []);
registerModule(t_user_auth);
export {t_user_auth};
export * from 'ngDecoratorForStudent/ng-decorator';