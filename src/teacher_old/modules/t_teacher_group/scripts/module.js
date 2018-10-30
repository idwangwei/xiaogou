/**
 * Created by ZL on 2018/3/13.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';

let t_teacher_group = angular.module('t_teacher_group', []);
registerModule(t_teacher_group);
t_teacher_group.run(['$state', '$rootScope', ($state, $rootScope)=> {
}]);
export {t_teacher_group};
export * from 'ngDecoratorForStudent/ng-decorator';