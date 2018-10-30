/**
 * Created by 邓小龙 on 2015/7/28.
 * @description  家长登录ctrl
 */
import  controllers from './../index';
import userManifest from './../../user_manifest';
import _uniqBy from 'lodash.uniqby';
import DTMgr from 'TdBase/index.js'
controllers.controller('parentLoginCtrl', ['$scope', '$log', '$state', '$ionicLoading', '$ionicPopup',
    '$interval', 'profileService', 'commonService', '$rootScope', 'jPushManager', 'finalData', '$window', '$timeout',
    function ($scope, $log, $state, $ionicLoading, $ionicPopup, $interval, profileService, commonService, $rootScope, jPushManager, finalData, $window, $timeout) {

        $scope.needQRCode = false;

        profileService.getSessionId().then(function (data) {
            if (data.code == 200) {
                console.log($rootScope.platform.type);
//                    if($rootScope.platform.type!=1){ 如果是非手机设备，就要扫码登录
//                        $scope.needQRCode=true;
//                        $scope.getQRcode();
//                    }
            }
        });


        $scope.telVcBtnText = "点击获取";//按钮文字显示

        $scope.telVcBtn = false;//按钮不可以点击状态

        $scope.needTelVC = false;//展示手机验证标志

        $scope.isIos = $rootScope.platform.IS_IPHONE || $rootScope.platform.IS_IPAD || $rootScope.platform.IS_MAC_OS;


        /**
         * 是否需要图形验证码 默认不需要
         */
        $scope.needVCode = false;

        $scope.imgVSuccess = false;

        $scope.USER_MANIFEST_P = userManifest.getUserManifest()||{};
        $scope.USER_MANIFEST_P.userList=_uniqBy($scope.USER_MANIFEST_P.userList,'loginName');

        /**
         * 初始图片验证码
         */
        $scope.initImage = commonService.getValidateImageUrl().then(function (data) {
            $scope.validateImageUrl = data;
        });
        /**
         * login 表单数据
         */
        $scope.formData = {
            //userName:'15882314444P',
            //userName: '13888888888P',
            //userName: '15882314664P',
            //userName:'13882955701P3',
            //password: '1'
        };
        $scope.isBackspace = false;
        $scope.savePWflag = false;


        var user = commonService.getLocalStorage('P_user');
        if (user && user.loginName) {
            $scope.formData.userName = user.loginName;
            let pw = userManifest.getPassWordByLoginName($scope.formData.userName);
            $scope.formData.password = pw;
            if(pw)$scope.savePWflag = true;
        }





        /**
         * 根据localStorage，是否显示忘记账号
         */
        $scope.showForgetUserName = function () {
            var pUserNameList = commonService.getLocalStorage("pUserNameList") || [];
            $scope.showForgetFlag = pUserNameList.length != 0
        };

        $scope.showForgetUserName();


        /**
         * 获取图片验证码
         */
        $scope.getValidateImage = function () {
            commonService.getValidateImageUrl().then(function (data) {
                $scope.validateImageUrl = data;
            });
        };
        /**
         * 登录（提交表单处理）
         */
        $scope.handleSubmit = function () {
            let nameValid = $scope.checkUserName();
            if (!nameValid)return;
            var form = this.loginForm;
            if (form.$valid) {//表单数据合法，就登录
                login();
            } else {//不合法就提示相关信息
                var formParamList;
                if ($scope.needVCode) {
                    formParamList = ['userName', 'password', 'vCode'];//需要验证的字段
                } else {
                    formParamList = ['userName', 'password'];//需要验证的字段
                }
                var errorMsg = commonService.showFormValidateInfo(form, formParamList);
                commonService.alertDialog(errorMsg);
            }
        };
        /**
         * 验证图形验证码
         */
        $scope.validateImageVCode = function () {
            if ($scope.formData.vCode) {
                commonService.validateImageVCode($scope.formData.vCode).then(function (data) {
                    if (data.code = 200) {
                        $scope.imgVSuccess = true;
                    } else {
                        $scope.imgVSuccess = false;
                    }
                });
            }
        };


        /**
         * 登陆处理
         */
        function loginHandle() {
            loadingScene.show();
            var param = {
                loginName: $scope.formData.userName,
                password: $scope.formData.password,
                //deviceId: commonService.getDeviceId(),
                deviceId: '11',
                //deviceType: $rootScope.platform.type
                deviceType: 1
            };
            profileService.login(param).then(function (data) {
                if (!data)data = {};
                data.loginName = param.loginName;
                if (!data) {
                    commonService.alertDialog(data.msg, 1500);
                    return;
                }
                if (data && data.code == 200) {//登陆成功
                    $scope.$emit('loginSuccess', data);//发给 onresumeHandler 处理自动登录等功能
                    $rootScope.user = {
                        loginName: $scope.formData.userName,
                        name: data.name,
                        gender: data.gender,
                        userId: data.userId,
                        agent:data.agent
                    };
                    $rootScope.config = data.config;
                    commonService.setLocalStorage('P_user', {loginName: $scope.formData.userName});
                    $scope.savePassword();
                    userManifest.setDefaultUser($scope.formData.userName.toUpperCase());
                    userManifest.addUserToUserList($rootScope.user);
                    profileService.loginSuccessAndGoHome();
                    loadingScene.hide();
                    DTMgr.send(data.login,data.loginName);
                    return;
                }
                if (data && (data.code == 601 || data.code == 609)) {//601第一监护人首次登陆 609个人信息没有完善
                    $scope.$emit('loginSuccess', data);//发给 onresumeHandler 处理自动登录等功能
                    $rootScope.user = {loginName: $scope.formData.userName, userId: data.userId};
                    commonService.setLocalStorage('P_user', {loginName: $scope.formData.userName});
                    userManifest.setDefaultUser($scope.formData.userName.toUpperCase());
                    userManifest.addUserToUserList($rootScope.user);
                    $state.go('basic_info_first');
                    return;
                }

                $scope.$emit('loginFail', data);//发给 onresumeHandler 处理自动登录等功能

                if (data && (data.code == 602 || data.code == 604)) {
                    commonService.alertDialog(data.msg, 2000);
                    $scope.getValidateImage();
                    $scope.needVCode = true;
                    if (data.code == 604)  $state.go('system_login');
                    return;
                }
                if (data && data.code == 553) {//第二监护人首次登陆需要手机短信验证码
                    debugger;
                    $rootScope.user = {
                        loginName: $scope.formData.userName,
                        name: data.name,
                        gender: data.gender,
                        userId: data.userId
                    };
                    $rootScope.secondLoginName = $scope.formData.userName;
                    $rootScope.secondPassword = $scope.formData.password;
                    userManifest.setDefaultUser($scope.formData.userName.toUpperCase());
                    userManifest.addUserToUserList($rootScope.user);
                    commonService.setLocalStorage('P_user', {loginName: $scope.formData.userName});
                    $state.go("second_p_first");
                    return;
                }
                if (data && data.code == 606) {//更换设备
                    $rootScope.user = {
                        loginName: $scope.formData.userName,
                        name: data.name,
                        gender: data.gender,
                        userId: data.userId
                    };
                    $rootScope.loginName = $scope.formData.userName;
                    $rootScope.password = $scope.formData.password;
                    commonService.setLocalStorage('P_user', {loginName: $scope.formData.userName});
                    $state.go("change_device_login");
                    return;
                }
                if (data && data.code == 651)return;//用户主动退出，不提示
                commonService.alertDialog(data.msg, 1500);
            });
        }


        /**
         * 发起用户登录请求并处理返回结果
         */
        function login() {
            if (!$scope.needVCode) {//如果不需要验证码
                loginHandle();
            } else {//需要验证码的情况
                //显示载入指示器
                $ionicLoading.show({
                    template: "正在处理，请稍后..."
                });
                commonService.validateImageVCode($scope.formData.vCode).then(function (data) {//先验证图形验证码是否正确
                    //隐藏载入指示器
                    $ionicLoading.hide();
                    if (data.code == 200) {//正确
                        loginHandle();
                        return;
                    } else {
                        commonService.alertDialog(data.msg, 1500);
                        $scope.getValidateImage();
                        return;
                    }
                });
            }
        }

        $scope.getQRcode = function () { //获取二维码
            commonService.getQRcodeUrl().then(function (data) {
                $scope.QRcode = data;
                $scope.allowDevice();
            });
        };

        $scope.allowDevice = function () {     //轮询，看是否扫描了二维码
            $scope.interval = $interval(function () {
                profileService.allowDevice().then(function (data) {
                    if (data.code == 200) {
                        $state.go('home');
                        return;
                    }
                    if (data.code == 608) {
                        $scope.msg = data.msg;
                        return;
                    }
                    if (data.code == 607) {
                        commonService.alertDialog('当前设备已被拒绝登录', 1500);
                        $scope.msg = data.msg;
                    }
                });
            }, 1000);
        };

        $scope.$on('$destroy', function () {    //当离开controller就取消定时器
            $interval.cancel($scope.interval);
        });

        /**
         * 返回至系统选择界面
         */
        $scope.handleSystemSelect = function () {
            $window.localStorage.removeItem('currentSystem');
            $window.localStorage.removeItem('profileInfo');
            $window.location.href = "./index.html";
        };

        // if ($rootScope.needAutoLogin && $scope.formData.userName) {
        //     $timeout(function () {
        //         if ($rootScope.sessionID) {
        //             loginHandle({
        //                 loginName: $rootScope.profile.loginName
        //             })
        //         } else {
        //             profileService.getSessionId().then(function () {
        //                 loginHandle({
        //                     loginName: $rootScope.profile.loginName
        //                 })
        //             });
        //         }
        //     }, 200);
        // } else {
            $scope.$emit('loginFail', {});//发给 onresumeHandler 处理自动登录等功能
        // }
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
        };

        $scope.changeInputName = function () {
            $scope.wantToChangeLoginName = true;
            let userNameEle = document.getElementById('userName');
            $timeout(() => {
                $scope.showInputHelpFlag = false;
                $scope.formData.userName = '';
                $scope.formData.password = '';
                //userNameEle.focus();
                //不是ios系统就自动获取焦点
                if (!$scope.isIos) userNameEle.focus();
            }, 300);
        };
        $scope.checkUserName = function () {
            //$scope.showInputHelpFlag = false;
            var userName = $scope.formData.userName;
            if (!userName)return;
            if(!$scope.showInputHelpFlag && userName.match(/^1\d{10}$/g)){
                $scope.formData.userName+="P";
                return true;
            }
            if (!$scope.showInputHelpFlag && !userName.match(/^1\d{10}(P|p|G|g)\d*$/g) && !userName.match(/^1\d{10}(P|p|G|g)\d*(@super|@Super|@SUPER)$/g)) {
                warning();
                return false;
            } else {
                return true;
            }
        };
        $scope.goPage = function(state){
            $scope.isWarning=false;
            let timeoutFlag;
            $state.go(state).then(() => {
                clearTimeout(timeoutFlag);
                timeoutFlag = setTimeout(
                    () =>{$scope.isWarning=true}, 500);
            });
        }
        /*$scope.isWarning 处理输入框失去焦点马上点击进入其他页面后 仍然显示这个页面警告框的问题*/
        $scope.isWarning=true;
        function warning() {
            if ($scope.isWarning){
                $ionicPopup.alert({
                    title: '账号格式不正确',
                    template: '<p>家长账号应是如下形式：</p>'
                    + '<p>1.手机号+P<br/>或<br/>' +
                    '2.手机号+P+数字<br/>或' +
                    '<br/>3.手机号+G<br/>或' +
                    '<br/>4.手机号+G+数字</p>' +
                    '<p style="color:#6B94D6 ">例如：13812345678P</p>',
                    okText: '确定'
                })
            }
        }

        $scope.forgetLoginName = function () {
            if($scope.showInputHelpFlag) return;//已经显示了账号列表就返回
            $scope.userList=$scope.USER_MANIFEST_P.userList;
            if($scope.userList&&$scope.userList.length){
                $scope.showInputHelpFlag = true;
                //todo: 账号列表的特殊样式
                return;
            }
            commonService.showAlert("温馨提示", "家长账号是您注册时用的手机号码后面加p，如：13812345678p。<br/><br/>如果您是“第二监护人”，账号是您的手机号后面加g，如：13900000000g");
            // if ($scope.showForgetFlag) {
            //     $state.go("forget_user_name");
            //     return;
            // }

        };

        $scope.checkAccount = function () {
            return !$scope.formData.userName || ($scope.formData.userName && $scope.formData.userName.match(/^1(3|4|5|7|8)\d{9}(p|g)\d*$/i));
        }


        $scope.autoCompleteName = function (person) {
            $scope.formData.userName = person.hasOwnProperty('gender') ? person.loginName : person;
            let pw = userManifest.getPassWordByLoginName($scope.formData.userName);
            $scope.formData.password = pw;
            if(pw)$scope.savePWflag = true;

            let passEle = document.getElementById('password');
            $timeout(() => {
                $scope.showInputHelpFlag = false;
                // passEle.focus();
                //不是ios系统就自动获取焦点
                if (!$scope.isIos) passEle.focus();
            }, 300);
        };

        $scope.showInputHelp = function (handleType) {

            if (handleType === 'focus') {
                if ($scope.formData.userName) return;
                $scope.userList = $scope.USER_MANIFEST_P.userList;
                if ($scope.when_input_null_only_show_once_count !== 0
                    && $scope.when_input_null_only_show_once_count !== undefined) return;
                if ($scope.userList && $scope.userList.length && !$scope.wantToChangeLoginName) {
                    $scope.showNameList();
                    /*hack windows端 focus click事件bug 描述：点击输入框触发了focus事件后，弹出层仍然触发了click事件*/
                    $scope.hackWindowsClick = true;
                    $timeout.cancel($scope.hackClickTimeout);
                    $scope.hackClickTimeout = $timeout(() => $scope.hackWindowsClick = false, 1200);
                }
                return;
            }
            if (!$scope.USER_MANIFEST_P) {
                $scope.showInputHelpFlag = false;
                return;
            }

            if ($scope.formData.userName && $scope.formData.userName.match(/^1\d{10}/g)) {
                let pw = userManifest.getPassWordByLoginName($scope.formData.userName);
                $scope.formData.password = pw;
            }

            if ($scope.formData.userName && !$scope.formData.userName.match(/^1\d{10}/g) && (!$scope.USER_MANIFEST_P.userList || !$scope.USER_MANIFEST_P.userList.length)) {
                $scope.showInputHelpFlag = false;
                return;
            }
            if (!$scope.formData.userName) {
                $scope.userList = $scope.USER_MANIFEST_P.userList;
                if ($scope.userList && $scope.userList.length && !$scope.wantToChangeLoginName)   $scope.showNameList();
                return;
            }
            if ($scope.formData.userName.match(/^1\d{10}$/g)) {
                if ($scope.isBackspace) return;  //如果是退格操作，不显示inputHelp
                let phone = angular.copy($scope.formData.userName).substr(0, 11);
                profileService.getUserListByPhone(phone, $scope.getUserListCallBack);
                return;
            }
            $scope.showInputHelpFlag = false;
        };


        $scope.hideInputHelp = function (ev) {
            /*hack windows端 focus click事件bug 描述：输入框触发了focus事件后，弹出层仍然触发了click事件*/
            if ($scope.hackWindowsClick) {
                $scope.hackWindowsClick = false;
                return;
            }
            if (!$scope.formData.userName) {
                $scope.when_input_null_only_show_once_count++;
            } else {
                $scope.when_input_null_only_show_once_count = 0;
            }
            if (ev.target.dataset.areaName === 'floating-layer') {
                $scope.showInputHelpFlag = false;
            }
        }
        /**
         * userName input 退格是否显示InputHelp的处理
         * @param ev
         */
        $scope.handleKeyBackspace = function (ev) {
            ev.keyCode === 8 ? $scope.isBackspace = true : $scope.isBackspace = false;
        }
        $scope.getUserListCallBack = function (userList) {
            if ($scope.formData.userName && $scope.formData.userName.match(/^1\d{10}/g) && userList && userList.length) {
                $scope.userList = userList;
                $scope.showNameList();
            }
        };

        $scope.showNameList = function () {
            $scope.showInputHelpFlag = true;
            let timeSpan = this.isIos ? 300 : 0;
            $timeout(()=> {
                //$('body').trigger('click');//让输入框失去焦点，隐藏键盘
                $('#userName')[0].blur();//让输入框失去焦点，隐藏键盘
            }, timeSpan);
        };

        $scope.showHowToDo = function () {
            var alertContent = `
           <p>1.在家长登录页面，点击“注册”，一键注册家长账号和学生账号。</p>
           <p>2.切换到学生登录页面，用学生账号和密码登录。</p>
           <p>3.点击“学霸驯宠记”，即可开始体验。</p>
        `;
            commonService.showAlert("想要马上体验学生做题？", alertContent);
        }


        /**
         * 保存密码
         */
        $scope.savePasswordFlag = function() {
            $scope.savePWflag = !$scope.savePWflag;
        };

        $scope.savePassword = function() {
            if ($scope.savePWflag) $rootScope.user.passWord = $scope.formData.password;//this.student.password;
            $rootScope.user.savePWflag = $scope.savePWflag;
        };
        /*注冊返回*/
        $rootScope.viewGoBack=function () {
            return "exit";
        }.bind(this)
    }]);
