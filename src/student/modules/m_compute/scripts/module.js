/**
 * Created by qiyuexi on 2018/1/8.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
import computeReducers from './redux/index';
import * as defaultStates from "./redux/default_states/index"

let computeModule = angular.module('m_compute', []);
registerModule(computeModule,computeReducers, defaultStates);
computeModule.run(['$state', '$rootScope', '$ngRedux', ($state, $rootScope, $ngRedux) => {
    /*$rootScope.loadComputeImg = (imgUrl) => {
        return require('../images/' + imgUrl);
    };*/
    console.log('model compute install======================');
}]);
export {
    computeModule
}
export * from 'ngDecoratorForStudent/ng-decorator';