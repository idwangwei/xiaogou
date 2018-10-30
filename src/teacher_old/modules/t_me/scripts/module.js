/**
 * Created by ZL on 2018/3/7.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';

let t_me = angular.module('t_me', []);
registerModule(t_me);
t_me.run(['$state', '$rootScope', ($state, $rootScope)=> {
}]);
export {t_me};
export * from 'ngDecoratorForStudent/ng-decorator';