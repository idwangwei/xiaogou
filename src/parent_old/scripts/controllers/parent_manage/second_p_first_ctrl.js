/**
 * Created by 邓小龙 on 2015/11/26.
 * 第二监护人首次登陆
 */
import  controllers from './../index';

    controllers.controller('secondPFirstCtrl', ['$scope', '$state', '$log','$rootScope', '$interval', '$ionicLoading','$ionicPopup',
        'profileService', 'commonService', 'jPushManager','finalData',
        function ($scope, $state, $log,$rootScope, $interval, $ionicLoading,$ionicPopup, profileService, commonService, jPushManager,finalData) {

            $scope.telVcBtnText = "点击获取";//按钮文字显示

            $scope.telVcBtn = false;//按钮不可以点击状态

            $scope.formData={};

            /**
             * 提交手机验证码验证
             */
            $scope.checkTelVcSubmit=function(){
                var param = {
                    loginName: $rootScope.secondLoginName,
                    password: $rootScope.secondPassword,
                    //deviceId:commonService.getDeviceId(),
                    deviceId:1,
                    deviceType:'11',
                    //deviceType:'11',
                    telVC:$scope.formData.telVC
                };
                profileService.login(param).then(function (data) {
                    if (!data) {
                        commonService.alertDialog('网络不畅，请稍后再试', 1500);
                        return;
                    }
                    if (data && data.code == 200) {
                        $rootScope.user.name=data.name;
                        $rootScope.user.gender=data.gender;
                        $rootScope.user.userId=data.userId;
                        $state.go('home.work_list');
                        return;
                    }
                    if (data && data.code == 601) {
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
                    if(data&&data.code==551){
                        commonService.alertDialog('手机验证码！', 1500);
                        return;
                    }
                },()=>{
                    $rootScope.needAutoLogin = false;
                    $state.go('system_login');
                });
            };

            /**
             * 获取手机验证码
             */
            $scope.getTelVC = function () {
                if(!$rootScope.secondLoginName){
                    commonService.alertDialog("没有获取到账号信息,请重新登录！",1500);
                    $log.error("第二监护人首次登陆，下发短信时没有其账号信息");
                    $state.go("system_login");
                    return ;
                }
                var phone=$rootScope.secondLoginName.substring(0,11);
                var msgText="短信验证码已下发到"+phone+",请查收!";
                showTextForWait();
                commonService.getTelVC(phone).then(function (data) {
                    if (data && data.code == 200) {
                        commonService.alertDialog(msgText, 1500);
                        $log.error("tvc:" + data.telRC);
                    }else if(data && data.code == 552){
                        $scope.formData.telVC = data.telVC;
                        $ionicPopup.alert({
                            title: '温馨提示',
                            template: '<p>手机验证码已收到并已自动填入</p>',
                            okText: '确定'
                        });
                    }else{
                        commonService.alertDialog(data.msg, 1500);
                    }
                });
            };

            /**
             * 发送手机验证码后等待60秒
             */
            function showTextForWait() {
                var count = 60;
                $scope.telVcBtn = true;
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
                if($scope.interval){
                    $interval.cancel($scope.interval);
                }
            });
            /**
             * 返回上一页
             */
            $scope.back = function(){
                $rootScope.needAutoLogin = false;
                $state.go('system_login');
            }
            /*返回注册*/
            $rootScope.viewGoBack=$scope.back.bind($scope);
        }]);
