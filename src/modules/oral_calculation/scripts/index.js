/**
 * Created by WL on 2017/9/5.
 */

import 'ngDecorator/decoratorModule'; //装饰器

import './pages/index';
import './services/index';
import './directives/index';
import "./constants/index";
import oralCalculationReducers from './redux/index';

let oralCalculationModule = angular.module('oralCalculation', [
    'ngDecModule',
    'oralCalculation.controllers',
    'oralCalculation.services',
    'oralCalculation.directives',
    'oralCalculation.constants'
]);

oralCalculationModule.run(['$state','$rootScope','$window','$timeout',($state,$rootScope,$window,$timeout)=>{

    $rootScope.$on('$stateChangeSuccess', function (ev, toState,) {
        if(toState.name === 'system_login'){
            $rootScope.showOralCalculationGuideFlag = undefined;
        }
    });
}]);

export {oralCalculationModule,oralCalculationReducers}

