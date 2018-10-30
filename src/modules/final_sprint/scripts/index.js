/**
 * Created by qiyuexi on 2017/12/7.
 */
import 'ngDecorator/decoratorModule';
import './pages/index';
import './services/index';
import './directives/index';
import "./constants/index";
import finalSprintReducers from './redux/index';

let finalSprintModule = angular.module('finalSprint', [
    'ngDecModule',
    'finalSprint.controllers',
    'finalSprint.services',
    'finalSprint.directives',
    'finalSprint.constants'
]);
finalSprintModule.run(['$state', '$rootScope', '$window', '$timeout', ($state, $rootScope, $window, $timeout)=> {
    $rootScope.loadFinalSprintImg = (imgUrl)=> {
        return require('../images/' + imgUrl);
    };

    $rootScope.$on('$stateChangeSuccess', function (ev, toState) {

    });
    console.log('model final sprint install======================');
}]);
export {finalSprintReducers}