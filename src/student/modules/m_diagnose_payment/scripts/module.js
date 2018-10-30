/**
 * Created by ZL on 2018/1/13.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import rewardReducers from './redux/index';
import * as defaultStates from './redux/default_states/index';

let m_diagnose_payment = angular.module('m_diagnose_payment', [
]);
registerModule(m_diagnose_payment,rewardReducers,defaultStates);
export {m_diagnose_payment};
export * from 'ngDecoratorForStudent/ng-decorator';