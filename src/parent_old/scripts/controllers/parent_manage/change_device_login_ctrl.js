/**
 * Created by 邓小龙 on 2015/11/26.
 * 更换设备登陆
 */
import  controllers from './../index';

controllers.controller('changeDetviceLoginCtrl', ['$scope', '$state', '$log', '$rootScope', '$interval', '$ionicLoading',
    'profileService', 'commonService', 'jPushManager', 'finalData',
    function ($scope, $state, $log, $rootScope, $interval, $ionicLoading, profileService, commonService, jPushManager, finalData) {

        $scope.telVcBtnText = "点击获取";//按钮文字显示

        $scope.telVcBtn = false;//按钮不可以点击状态

        $scope.formData = {};

        /**
         * 提交手机验证码验证
         */
        $scope.checkTelVcSubmit = function () {
            var param = {
                loginName: $rootScope.loginName,
                password: $rootScope.password,
                //deviceId:commonService.getDeviceId(),
                deviceId: '11',
                //deviceType: finalData.DEVICE_TYPE,
                deviceType: 1,
                telVC: $scope.formData.telVC
            };
            profileService.login(param).then(function (data) {
                if (!data) {
                    commonService.alertDialog('网络不畅，请稍后再试', 1500);
                    return;
                }
                if (data && data.code == 200) {
                    $rootScope.user = {
                        loginName: $scope.formData.userName,
                        name: data.name,
                        gender: data.gender,
                        userId: data.userId
                    };
                    profileService.loginSuccessAndGoHome();
                    return;
                }
                if (data && (data.code == 601 || data.code == 609)) {//601第一监护人首次登陆 609个人信息没有完善
                    $rootScope.user.name=data.name;
                    $rootScope.user.gender=data.gender;
                    $rootScope.user.userId=data.userId;
                    $state.go('basic_info_first');
                    return;
                }
                if (data && data.code == 602) {
                    commonService.alertDialog('账号或密码错误', 1500);
                    return;
                }
                if (data && data.code == 551) {
                    commonService.alertDialog('手机验证码错误！', 1500);
                    return;
                }
                commonService.alertDialog(data.msg, 1500);
            });
        };

        /**
         * 获取手机验证码
         */
        $scope.getTelVC = function () {
            if (!$rootScope.loginName) {
                commonService.alertDialog("没有获取到账号信息,请重新登录！", 1500);
                $log.error("更换设备登陆，下发短信时没有其账号信息");
                $state.go("system_login");
                return;
            }
            var phone = $rootScope.loginName.substring(0, 11);
            var msgText = "短信验证码已下发到" + phone + ",请查收!";
            showTextForWait();
            commonService.getChangingDevVC(phone).then(function (data) {
                if (data && data.code == 200) {
                    commonService.alertDialog(msgText, 1500);
                    $log.error("tvc:" + data.telRC);
                } else {
                    commonService.alertDialog(data.msg, 1500);
                }
            });
        };

        /**
         * 发送手机验证码后等待60秒
         */
        function showTextForWait() {
            $scope.telVcBtn = true;
            var count = 60;
            $scope.interval = $interval(function () {
                if (count == 0) {
                    $scope.telVcBtnText = "点击获取";
                    $scope.telVcBtn = false;
                    $interval.cancel($scope.interval);
                } else {
                    $scope.telVcBtnText = count + "秒";
                    count--;
                }
                $log.log(count + '.......');
            }, 1000)
        }

        /**
         * 当离开controller就取消定时器
         */
        $scope.$on('$destroy', function () {
            if ($scope.interval) {
                $interval.cancel($scope.interval);
            }

        });
        /**
         * 切换系统
         * @param name 系统名称[教师|学生|家长]
         */
        $scope.switchSystem = function (name) {
            switch (name) {
                case "teacher":
                    window.localStorage.setItem('currentSystem', JSON.stringify({id: 'teacher'}));
                    window.location.href = './teacher_index.html';
                    break;
                case "student":
                    window.localStorage.setItem('currentSystem', JSON.stringify({id: 'student'}));
                    window.location.href = './student_index.html';
                    break;
                case "parent":
                    window.localStorage.setItem('currentSystem', JSON.stringify({id: 'parent'}));
                    window.location.href = './parent_index.html'
            }
        }
        /*注冊返回*/
        $rootScope.viewGoBack=function () {
            return "exit";
        }.bind(this)
    }]);
