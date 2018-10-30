/**
 * Created by ZL on 2018/1/16.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
let t_home_teaching_work = angular.module('t_home_teaching_work', [
    't_home_teaching_work.services'
]);
registerModule(t_home_teaching_work);
export {t_home_teaching_work};
export * from 'ngDecoratorForStudent/ng-decorator';