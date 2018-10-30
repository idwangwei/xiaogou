/**
 * Created by Administrator on 2017/5/16.
 */
import './style.less';
import signWarn from './signWarnImg/signWarn.png';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', '$ngRedux', 'rewardSystemService', function ($scope, $rootScope, $state, $ngRedux, rewardSystemService) {
            $scope.canSignIn = false;
            $scope.showSignInWarnAlert = false;

             let signTime = $ngRedux.getState().sign_in_status;
             let userName = $ngRedux.getState().profile_user_auth.user.loginName;;
             let nowTime = new Date();
             let newTimeStr = "" + userName + nowTime.getFullYear() + "/" + (nowTime.getMonth() + 1) + "/" + nowTime.getDate();

            $scope.hideSignWarn = function () {
                $scope.showSignInWarnAlert = false;
            };
            let getSignStatus = ()=> {
                if (signTime.date == newTimeStr) return;
                var getStatusServer = rewardSystemService.getSignInInfo();
                getStatusServer.then((data)=> {
                    if (data && data.code == 200) {
                        $scope.canSignIn = data.sign.canSignIn;
                        $scope.showSignInWarnAlert = true;
                    }
                })
            };
            getSignStatus();

            $scope.gotoSignIn = function ($event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
                $scope.showSignInWarnAlert = false;
                $state.go('reward_sign_in', {getDone: true,backUrl:'home.study_index'})
            };

            $scope.signWarn = signWarn;

        }],
        link: function ($scope, $element, $attrs) {

        }
    };
}