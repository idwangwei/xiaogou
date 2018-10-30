/**
 * Created by qiyuexi on 2018/1/2.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
import finalSprintPaymentReducers from './redux/index';
import * as defaultStates from "./redux/default_states/index"


let finalSprintPaymentModule = angular.module('m_final_sprint_payment', []);
registerModule(finalSprintPaymentModule,finalSprintPaymentReducers, defaultStates);
finalSprintPaymentModule.run(['$state', '$rootScope', '$ngRedux', ($state, $rootScope, $ngRedux) => {
    /*$rootScope.loadFinalSprintPaymentImg = (imgUrl) => {
        return require('../images/' + imgUrl);
    };*/
    console.log('model final sprint payment install======================');
}]);
export {
    finalSprintPaymentModule
}
export * from 'ngDecoratorForStudent/ng-decorator';
