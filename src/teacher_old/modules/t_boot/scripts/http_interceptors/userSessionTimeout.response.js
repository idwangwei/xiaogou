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
            // let profileService = $injector.get('profileService');
            let teacherProfileService = $injector.get('teacherProfileService');
            let $ngRedux = $injector.get('$ngRedux');
            if (res.data.code == 603) {
                $rootScope.needAutoLogin = true;
                res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                // let user = $ngRedux.getState().profile_user_auth.user;
                // profileService.handleAutoLogin().then(()=>{
                teacherProfileService.handleAutoLogin().then(()=>{
                    deferred.reject(res);
                });
            } else {
                deferred.resolve(res);
            }
            return deferred.promise;
        }
    }
};
userSessionTimeout.$inject = ['$q', '$injector'];
export default userSessionTimeout;

