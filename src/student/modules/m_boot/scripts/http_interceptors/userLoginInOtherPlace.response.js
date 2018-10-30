/**
 * Created by 彭建伦 on 2016/6/7.
 * 处理 code : 650 用户在其他地方登录
 */
import * as types from './../redux/actiontypes/actiontypes';
let userLoginInOtherPlace = function ($q, $injector) {
    return {
        response: function (res) {
            var deferred = $q.defer();
            let commonService = $injector.get('commonService');
            let $rootScope = $injector.get('$rootScope');
            let $state = $injector.get('$state');
            let $ngRedux=$injector.get('$ngRedux');
            let profileService = $injector.get('profileService');
            let $ionicLoading = $injector.get('$ionicLoading');
            $ionicLoading.hide();
            if (res.data.code == 650) {
                res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                $ngRedux.dispatch({type:types.PROFILE.USER_LOGOUT_BY_SELF});
                /*commonService.showAlert('信息提示', res.data.msg).then(function () {
                    $state.go('system_login');
                });*/
               commonService.showPopup({
                       title: '提示',
                       template: res.data.msg,
                       buttons: [{
                           text: '退出',
                           type: 'button-default',
                           onTap: (e)=> {
                               $state.go('system_login');
                           }
                       }, {
                           text: '重新登录',
                           type: 'button-positive',
                           onTap: (e)=>{
                              profileService.handleAutoLogin($ngRedux.getState().profile_user_auth.user);
                           }
                       }]
                   });
                deferred.reject(res);
            } else {
                deferred.resolve(res);
            }
            return deferred.promise;
        }
    }
};
userLoginInOtherPlace.$inject = ['$q', '$injector'];
export default userLoginInOtherPlace;

