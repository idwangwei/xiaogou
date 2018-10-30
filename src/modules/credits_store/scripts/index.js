/**
 * Created by ZL on 2017/11/6.
 */
import 'ngDecorator/decoratorModule';
import './pages/index';
import './services/index';
import './directives/index';
import "./constants/index";
import creditsStoreReducers from './redux/index';

let creditsStoreModule = angular.module('creditsStore', [
    'ngDecModule',
    'creditsStore.controllers',
    'creditsStore.services',
    'creditsStore.directives',
    'creditsStore.constants'
]);
creditsStoreModule.run(['$state', '$rootScope', '$window', '$timeout', ($state, $rootScope, $window, $timeout)=> {
    $rootScope.loadCreditsStoreImg = (imgUrl)=> {
        return require('../images/' + imgUrl);
    };

    $rootScope.$on('$stateChangeSuccess', function (ev, toState) {

    });
    console.log('model credits store install======================');
}]);
export {creditsStoreModule, creditsStoreReducers}