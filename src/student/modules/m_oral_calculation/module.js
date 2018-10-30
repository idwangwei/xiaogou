import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import "./scripts/directives/index";
import reducers from "./scripts/redux/index";
import * as defaultStates from './scripts/redux/default_states/index';

let oralCalculationModule = angular.module('m_oral_calculation', [
    'm_oral_calculation.directives'
]);
registerModule(oralCalculationModule,reducers,defaultStates);
oralCalculationModule.run(['$state', '$rootScope', '$window', '$timeout', ($state, $rootScope, $window, $timeout) => {
    $rootScope.$on('$stateChangeSuccess', function (ev, toState,) {
        if (toState.name === 'system_login') {
            $rootScope.showOralCalculationGuideFlag = undefined;
        }
    });
}]).run(['$ngRedux','$rootScope', ($ngRedux,$rootScope) => {
    console.log('module oral_calculation install======================');
}]);
export {oralCalculationModule}
export * from 'ngDecoratorForStudent/ng-decorator'
