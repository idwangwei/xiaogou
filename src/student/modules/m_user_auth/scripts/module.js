/**
 * Created by qiyuexi on 2018/1/8.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
// import userAuthReducers from './redux/index';

let userAuthModule = angular.module('m_user_auth', []);
registerModule(userAuthModule);
userAuthModule.run(['$state', '$rootScope','$ngRedux', ($state, $rootScope,$ngRedux)=> {
    $rootScope.loadUserAuthImg = (imgUrl)=> {
        return require('../images/' + imgUrl);
    };
    // $ngRedux.mergeReducer(userAuthReducers);
    console.log('model userAuth install======================');
}]);
export {
    userAuthModule
}
export * from 'ngDecoratorForStudent/ng-decorator';