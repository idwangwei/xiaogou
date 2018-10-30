/**
 * Created by qiyuexi on 2018/1/4.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
import mathGameReducers from './redux/index';
import * as defaultStates from './redux/default_states/index';

let mathGameModule = angular.module('m_math_game', [
    /* 'mathGame.directives',*/
]);
registerModule(mathGameModule,mathGameReducers, defaultStates);
mathGameModule.run(['$state', '$rootScope', '$ngRedux', ($state, $rootScope, $ngRedux) => {
    /*$rootScope.loadMathGameImg = (imgUrl) => {
        return require('../images/' + imgUrl);
    };*/
    console.log('model math game install======================');
}]);
export {
    mathGameModule
}
export * from 'ngDecoratorForStudent/ng-decorator';