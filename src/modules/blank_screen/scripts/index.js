/**
 * Created by ZL on 2017/10/19.
 */
import 'ngDecorator/decoratorModule';

// import './pages/index';
import './services/index';
// import rewardReducers from './redux/index';
import './directives/index';
// import "./constants/index";
import "./constants/constant";

let blankScreenModule = angular.module('blackScreen', [
    'ngDecModule',
    'blackScreen.services',
    'blackScreen.directives',
    'blackScreen.constants'
]);
blankScreenModule.run(['$rootScope', '$timeout', 'blankScreenService', '$ngRedux', ($rootScope, $timeout, blankScreenService, $ngRedux)=> {
    $rootScope.loadBlankScreenImg = (imgUrl)=> {
        return require('../images/' + imgUrl);
    };

    /**
     * 每隔一秒钟发送请求
     */
    function checkBackStatus() {
        // debugger
        let userInfo = $ngRedux.getState().profile_user_auth;
        $timeout(()=> {
            if (userInfo && userInfo.user && userInfo.user.userId && $rootScope.isBlankScreen) {
                blankScreenService.getBlankStatus().then((data)=> {
                    if (data && data != -1) {
                        $rootScope.blackScreenFlag = true;
                    } else {
                        $rootScope.blackScreenFlag = false;
                    }
                    checkBackStatus();
                });
            } else {
                checkBackStatus();
            }

        }, 5000);

    }

    checkBackStatus();

}]);
// export {rewardModule,rewardReducers}
export {blankScreenModule}

