/**
 * Created by 彭建伦 on 2016/6/7.
 * 处理 code : 651
 */
import {PROFILE} from './../redux/actiontypes/actiontypes';
let userLogoutBySelf = function ($q, $injector) {
    return {
        response: function (res) {
            var deferred = $q.defer();
            let commonService = $injector.get('commonService');
            let $rootScope = $injector.get('$rootScope');
            let $state = $injector.get('$state');
            let $ngRedux = $injector.get('$ngRedux');
            let $ionicLoading = $injector.get('$ionicLoading');
            $ionicLoading.hide();
            if (res.data.code == 651) {
                $ngRedux.dispatch({type: PROFILE.USER_LOGOUT_BY_SELF});
                res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                $state.go('system_login');
                deferred.reject(res);
            } else {
                deferred.resolve(res);
            }
            return deferred.promise;
        }
    }
};
userLogoutBySelf.$inject = ['$q', '$injector'];
export default userLogoutBySelf;
