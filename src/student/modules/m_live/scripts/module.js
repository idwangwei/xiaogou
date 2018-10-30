/**
 * Created by qiyuexi on 2018/4/25.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
import liveReducers from './redux/index';
import * as defaultStates from "./redux/default_states/index"

let liveModule = angular.module('m_live', [
]);
registerModule(liveModule,liveReducers, defaultStates);
liveModule.config(["$ngReduxProvider",function ($ngReduxProvider) {
    console.log($ngReduxProvider);
}]);
liveModule.run(['$state', '$rootScope', '$ngRedux', ($state, $rootScope, $ngRedux) => {
    console.log('model live install======================');
}]);
export {
    liveModule
}
export * from 'ngDecoratorForStudent/ng-decorator';