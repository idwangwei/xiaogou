/**
 * Created by qiyuexi on 2018/1/2.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
import areaEvaluationReducers from './redux/index';
import * as defaultStates from "./redux/default_states/index"

let areaEvaluationModule = angular.module('t_area_evaluation', [
    // 't_area_evaluation.directives',
]);
registerModule(areaEvaluationModule,areaEvaluationReducers, defaultStates);
areaEvaluationModule.config(["$ngReduxProvider",function ($ngReduxProvider) {
    console.log($ngReduxProvider);
}]);
areaEvaluationModule.run(['$state', '$rootScope', '$ngRedux', ($state, $rootScope, $ngRedux) => {
    console.log('model area evaluation install======================');
}]);
export {
    areaEvaluationModule
}
export * from 'ngDecoratorForStudent/ng-decorator';
