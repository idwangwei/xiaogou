/**
 * Created by ZL on 2018/3/9.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import creditsStoreReducers from './redux/index';
import * as defaultStates from './redux/default_states/index';

let t_work_publish4 = angular.module('t_work_publish4', []);
registerModule(t_work_publish4, creditsStoreReducers, defaultStates);
export {t_work_publish4};
export * from 'ngDecoratorForStudent/ng-decorator';