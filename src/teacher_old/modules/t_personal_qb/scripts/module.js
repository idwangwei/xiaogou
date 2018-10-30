/**
 * Created by ZL on 2018/3/19.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import personalQBReducers from './redux/index';
import * as defaultStates from './redux/default_states/index';

let t_personal_qb = angular.module('t_personal_qb', [
    't_personal_qb.directive'
]);
registerModule(t_personal_qb, personalQBReducers, defaultStates);
export {t_personal_qb};
export * from 'ngDecoratorForStudent/ng-decorator';