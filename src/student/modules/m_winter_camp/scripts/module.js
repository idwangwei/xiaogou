/**
 * Created by ZL on 2018/1/29.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import rewardReducers from './redux/index';
import * as defaultStates from './redux/default_states/index';


let m_winter_camp = angular.module('m_winter_camp', [
    'm_winter_camp.constants',
    'm_winter_camp.directives',
    'm_winter_camp.services',
]);
registerModule(m_winter_camp, rewardReducers, defaultStates);
m_winter_camp.run(['$rootScope', '$compile', '$ngRedux' , '$interval', '$timeout', ($root, $compile, $ngRedux, $interval, $timeout)=> {
    console.log('model winter camp install======================');
}]);
export {m_winter_camp};
export * from 'ngDecoratorForStudent/ng-decorator';