/**
 * Created by 彭建伦 on 2016/6/7.
 * 处理 code : 100
 */
let unExpectedServerError = function ($q, $injector) {
    return {
        response: function (res) {
            var deferred = $q.defer();
            let commonService = $injector.get('commonService');
            let $rootScope = $injector.get('$rootScope');
            let $state = $injector.get('$state');
            let $ngRedux = $injector.get('$ngRedux');
            let profileService = $injector.get('profileService');
            let $ionicLoading = $injector.get('$ionicLoading');
            $ionicLoading.hide();
            if (res.data.code == 604) { //更新后自动登录不需要输入密码
                /*$rootScope.needAutoLogin = false;
                res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                $state.go('system_login');
                if (res.data.code == 604) {
                    commonService.alertDialog(res.data.msg, 2000);
                }
                deferred.reject(res);*/

                $rootScope.needAutoLogin = false;
                res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                commonService.alertDialog(res.data.msg, 2000);
                deferred.resolve(res);
               /* let user = $ngRedux.getState().profile_user_auth.user;
                profileService.handleAutoLogin(user).then(()=> {
                    deferred.reject(res);
                });*/
            }
            else if (res.data.code == 300) { //接口地址或者参数不对
                console.error('该请求参数不全！');
                res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                deferred.reject(res);
            }
            else if (res.data.code == 100) { //服务器错误
                res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                commonService.showAlert("信息提示", `
                                   <div style="text-align: center;width: 100%">
                                      <div>服务器忙</div>
                                      <div>code:${res.data.code}</div>
                                   </div>
                                `);
                deferred.reject(res);
            }
            else {
                deferred.resolve(res);
            }
            return deferred.promise;
        }
    }
};
unExpectedServerError.$inject = ['$q', '$injector'];
export default unExpectedServerError;

