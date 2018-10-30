/**
 * Created by qiyuexi on 2018/1/13.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
import "./directives";
import diagnoseReducers from './redux/index';
import * as defaultStates from "./redux/default_states/index"

let diagnoseModule = angular.module('m_diagnose', [
    'm_diagnose.directives',
]);
registerModule(diagnoseModule,diagnoseReducers,defaultStates);
diagnoseModule.run(['$state', '$rootScope', '$ngRedux', ($state, $rootScope, $ngRedux) => {
    /*$rootScope.loadDiagnoseImg = (imgUrl) => {
        return require('../images/' + imgUrl);
    };*/
    // $ngRedux.mergeReducer(diagnoseReducers, {}, $rootScope.loginName);
    console.log('model diagnose install======================');
}]);
export {
    diagnoseModule
}
export * from 'ngDecoratorForStudent/ng-decorator';