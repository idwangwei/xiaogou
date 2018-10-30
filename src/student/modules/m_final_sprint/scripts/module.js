/**
 * Created by qiyuexi on 2018/1/2.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
import finalSprintReducers from './redux/index';
import * as defaultStates from "./redux/default_states/index"

let finalSprintModule = angular.module('m_final_sprint', [
    'm_final_sprint.directives',
]);
registerModule(finalSprintModule,finalSprintReducers, defaultStates);
finalSprintModule.config(["$ngReduxProvider",function ($ngReduxProvider) {
    console.log($ngReduxProvider);
}]);
finalSprintModule.run(['$state', '$rootScope', '$ngRedux', ($state, $rootScope, $ngRedux) => {
    /*$rootScope.loadFinalSprintImg = (imgUrl) => {
        return require('../images/' + imgUrl);
    };*/
    // $ngRedux.mergeReducer(finalSprintReducers, defaultStates, $rootScope.loginName);
    console.log('model final sprint install======================');
}]);
export {
    finalSprintModule
}
export * from 'ngDecoratorForStudent/ng-decorator';
