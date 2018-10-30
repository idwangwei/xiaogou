/**
 * Created by 彭建伦 on 2016/6/7.
 * 处理 code : 603
 */
let userSessionTimeout = function ($q, $injector) {
    return {
        response: function (res) {
            var deferred = $q.defer();
            let commonService = $injector.get('commonService');
            let $rootScope = $injector.get('$rootScope');
            let $state = $injector.get('$state');
            let profileService = $injector.get('profileService');
            let $ngRedux = $injector.get('$ngRedux');
            let serverInterface = $injector.get('serverInterface');
            let $ionicLoading = $injector.get('$ionicLoading');
            $ionicLoading.hide();
            if (res.data.code == 603) {
                if (res.config.url.indexOf(serverInterface.LOGOUT) != -1) {
                    $state.go('system_login');
                    deferred.reject(res);
                } else {
                    let user = $ngRedux.getState().profile_user_auth.user;
                    profileService.handleAutoLogin(user).then(()=> {
                        deferred.reject(res);
                    });
                }
            } else {
                deferred.resolve(res);
            }
            return deferred.promise;
        }
    }
};
userSessionTimeout.$inject = ['$q', '$injector'];
export default userSessionTimeout;

