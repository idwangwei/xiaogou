/**
 * Created by pengjianlun on 15-12-24.
 * 教师，学生，家长端 onresume时，判断session是否过期
 * 如果过期，则自动重新登录
 */
var onresumeHandler = angular.module('onresumeHandler', []);
onresumeHandler.run(['$window', '$log', '$http', '$rootScope', '$state', 'serverInterface', '$timeout', 'commonService',
    function ($window, $log, $http, $rootScope, $state, serverInterface, $timeout, commonService) {
        window.loadingScene = window.loadingScene || {hide:$.noop, show:$.noop};
        // if(!$rootScope.homeOrClazz)$rootScope.homeOrClazz={type:2};
        $rootScope.$on('loginSuccess', function (ev, data) {
            var profileInfo = {
                loginName: data.loginName,
                sessionID: $rootScope.sessionID
            };
            $window.localStorage.setItem('profileInfo', JSON.stringify(profileInfo));
            //如果有加载界面，则隐藏
            $timeout(function () {
                loadingScene.hide();
            }, 1000);
        });

        $rootScope.$on('loginFail', function () {
            //如果有加载界面，则隐藏
            loadingScene.hide();
        });

        if (!serverInterface || !serverInterface.CHECK_ISVALID_SESSION) {
            $log.error('找不到serverInterface,或者serverInterface下没有CHECK_ISVALID_SESSION常量！');
            return;
        }

        //$window.document.addEventListener("resume", onResume, false);
        ///**
        // * 处理onresume事件
        // */
        //function onResume() {
        //    var profileInfo = getProfileInfo();
        //    if (!profileInfo) return;
        //    if (!$rootScope.sessionID)$rootScope.sessionID = profileInfo.sessionID;
        //
        //    commonService.commonPost(serverInterface.CHECK_ISVALID_SESSION).then(function (data) {
        //        if (data && data.code == 603 && $rootScope.user && $rootScope.user.loginName) { //表示session已过期
        //            //$state.go('system_login');
        //            $rootScope.needAutoLogin = true;
        //            $rootScope.profile = profileInfo;
        //            commonService.commonPost(serverInterface.LOGIN,{
        //                loginName: $rootScope.user.loginName,
        //                deviceId: '11',
        //                deviceType: $rootScope.platform.type
        //            }, true).then(function (data) {
        //                if(data.code==200){
        //                    $rootScope.sessionID = data.jsessionid;
        //                }else{
        //                    $state.go('system_login');
        //                    $rootScope.needAutoLogin = false;
        //                }
        //            });
        //        }
        //    });
        //}

        /**
         * 获取localStorage中保存的sessionId和登录名
         */
        function getProfileInfo() {
            var profileInfo;
            var profileInfoStr = $window.localStorage.getItem('profileInfo');
            if (!profileInfoStr)return null;
            try {
                profileInfo = JSON.parse(profileInfoStr);
            } catch (e) {
                $log.error(e);
            }
            return profileInfo;
        }

        var profileInfo = getProfileInfo();
        loadingScene.hide();
        if (profileInfo && profileInfo.loginName) {
            loadingScene.show();
            // $state.go('system_login');
            $rootScope.needAutoLogin = true;
            $rootScope.profile = profileInfo;
        }
    }]);
