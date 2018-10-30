/**
 * Created by ZL on 2018/3/6.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';

import creditsStoreReducers from './redux/index';
import * as defaultStates from './redux/default_states/index';

let t_credits_store = angular.module('t_credits_store', [
    't_credits_store.directives',
]);
registerModule(t_credits_store, creditsStoreReducers, defaultStates);
/*t_credits_store.run(['$state', '$rootScope', ($state, $rootScope)=> {
    $rootScope.loadCreditsStoreImg = (imgUrl)=> {
        return require('../images/' + imgUrl);
    };
}]);*/
export {t_credits_store};
export * from 'ngDecoratorForStudent/ng-decorator';