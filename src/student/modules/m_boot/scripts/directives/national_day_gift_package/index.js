/**
 * Created by ww 2017/8/9.
 */

import temp from './index.html';
import './index.less';
import {PROFILE} from '../../redux/actiontypes/actiontypes'
export default ()=> {
    return {
        restrict: 'E',
        template: temp,
        scope:{
            showType:'='
        },
        controller: ['$state', '$scope', '$rootScope','$ngRedux', function($state, $scope, $rootScope,$ngRedux){

            this.showPackage = true;
            this.clickGiftPackage = ()=>{
                $scope.showFirstGiftBox = true;
                this.showPackage = false;
                // $ngRedux.dispatch({type: PROFILE.CLICK_NATIONAL_DAY_GIFT_PACKAGE});
                $ngRedux.dispatch({type: PROFILE.CLICK_NATIONAL_DAY_GIFT_PACKAGE_11_11});
            };
            this.gotoPlanA = ()=>{
                let xlyVipFlag = false;
                if ($ngRedux.getState().profile_user_auth.user.vips) {
                    angular.forEach($ngRedux.getState().profile_user_auth.user.vips, (v, k)=> {
                        if ($ngRedux.getState().profile_user_auth.user.vips[k].xly) xlyVipFlag = true
                    });
                }
                if (xlyVipFlag) {
                    $state.go('smart_training_camp',{backUrl:'home.study_index'});
                } else {
                    $state.go('xly_select',{backUrl:'home.study_index'});
                }
                $rootScope.$injector.get('$ionicViewSwitcher').nextDirection('forward');
                this.hideAd();
            };
            this.hideAd = ()=>{
                this.showPackage = true;
            };
        }],
        link: function ($scope, element, attrs, ctrl) {
            $scope.ctrl = ctrl;
            $scope.showFirstGiftBox = $scope.showType;
        }
    }
}
