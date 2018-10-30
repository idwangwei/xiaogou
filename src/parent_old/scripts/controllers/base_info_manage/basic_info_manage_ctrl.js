/**
 * Created by 邓小龙 on 2015/7/31.
 * @description 个人中心
 * 华海川（重构）2015/10/8
 */
import  controllers from './../index';

controllers.controller('baseInfoManageCtrl', ['$scope', '$rootScope', '$log', '$state', '$interval','$ionicPopup', 'baseInfoService', 'commonService', 'profileService','finalData','workStatisticsServices',
    function ($scope, $rootScope, $log, $state, $interval, $ionicPopup,baseInfoService, commonService, profileService,finalData,workStatisticsServices) {
        debugger;
        $scope.loginType = profileService.getLoginType();//获取登录类型
        $scope.formData = baseInfoService.baseInfo;
     //baseInfoService.clearSecondPData();
        $scope.secondP = baseInfoService.secondP;//第二监护人对象
        //$scope.secondP.secondGender==1;
        $scope.qList = baseInfoService.qList;//密保问题列表
        $scope.qBackList = baseInfoService.qBackList;//密保问题列表

        $scope.telVcBtnText = "点击获取";//按钮文字显示

        $scope.telVcBtn = false;//按钮不可以点击状态
        // $scope.secondP.secondRelationShip='-1';

        $scope.$on('$ionicView.beforeLeave', ()=> {
            baseInfoService.secondP={
                first:true
            };
        });

        $scope.passwordSetting={
            model:$scope.secondP,
            placeholder:'密码 (限6个字符)',
            modelName:'secondPassword',
            name:'secondPassword'
        };
        $scope.passwordConfirmSetting={
            model:$scope.secondP,
            modelName:'confirmPass',
            placeholder:'再次输入密码 (限6个字符)',
            name:'confirmPassword'
        };
        //$scope.secondP.first=true;
        /**
         * 初始化基本信息表单
         */
        baseInfoService.getBaseInfo().then(function (data) {        //获取基本信息
            if (!data) {
                commonService.alertDialog('网络不畅，请稍后再试', 1500);
            }
        });

        /**
         * 获取密保问题
         */
        baseInfoService.getPwProQuestion().then(function (data) {   //获取密保问题
            if (!data) {
                commonService.alertDialog('网络不畅，请稍后再试', 1500);
            }
        });

        /**
         * 获取第二监护人信息
         */
        baseInfoService.getSecondPInfo().then(function (data) {        //获取基本信息
            if (!data) {
                commonService.alertDialog('网络不畅，请稍后再试', 1500);
            }
        });

        /**
         * 页面状态 默认为1
         */
        $scope.pageStatus = 1;
        /**
         * 页面tab 点击事件
         * @param event  点击对象
         * @param pageStatus 页面状态
         */
        $scope.handleTabBtnClick = function (event, pageStatus) {
            var el = document.querySelector(".not-active");
            angular.element(el).addClass("active");
            angular.element(el).removeClass("not-active");
            angular.element(event.target).removeClass("active");
            angular.element(event.target).addClass("not-active");
            $scope.pageStatus = pageStatus;
        };
        /**
         * 处理性别选择
         * @param event 点击事件
         * @param checkStatus 选择状态
         */
        $scope.handleCheck = function (event, checkStatus) {
            if (checkStatus == $scope.formData.gender) {
                $scope.formData.gender = !checkStatus;
            } else {
                $scope.formData.gender = checkStatus;
            }
        };
        /**
         * 初始图片验证码
         */
        $scope.initImage = commonService.getValidateImageUrl().then(function (data) {
            $scope.validateImageUrl = data;
        });
        /**
         * 获取图片验证码
         */
        $scope.getValidateImage = function () {
            commonService.getValidateImageUrl().then(function (data) {
                $scope.validateImageUrl = data;
                $scope.imgVSuccess = false;
            });
        };
        /**
         * 验证图形验证码
         */
        $scope.validateImageVCode = function () {
            if (this.formData.vCode) {
                commonService.validateImageVCode(this.formData.vCode).then(function (data) {
                    if (data) {
                    }
                });
            }
        };
        /**
         * 获取手机验证码
         */
        $scope.getTelVC = function () {
            if ($scope.formData.tel) {
                showTextForWait();
                commonService.getTelVC($scope.formData.tel).then(function (data) {
                    if (data && data.code == 200) {
                        commonService.alertDialog("短信验证码已下发,请查收!", 1500);
                        $log.error("tvc:" + data.telRC);
                    }else if(data && data.code == 552){
                        $scope.formData.telVC = data.telVC;
                        //$scope.telVcServerVal = data.telVC;
                        $ionicPopup.alert({
                            title: '温馨提示',
                            template: '<p>手机验证码已收到并已自动填入，可以点击“提交”了</p>',
                            okText: '确定'
                        });
                    }else {
                        commonService.alertDialog(data.msg, 1500);
                    }
                });
            } else {
                commonService.alertDialog("请先填写正确的手机号!");
            }
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
         * 保存用户基本信息
         */
        function saveBaseInfo() {
            if ($scope.formData.gender == -1) {
                commonService.alertDialog("请选择性别！");
                return;
            }
            baseInfoService.saveBaseInfo().then(function (data) {
                if (data.code==200) {
                    $rootScope.user.name=$scope.formData.name;
                    $rootScope.user.gender=$scope.formData.gender;
                    commonService.alertDialog("信息保存成功");

                } else {
                    commonService.alertDialog(data.msg, 1500);
                }
            });
        }

        /**
         * 基本信息提交
         */
        $scope.handleBaseInfoSubmit = function () {

            var form = this.baseInfoForm;
            if (form.$valid) {
                saveBaseInfo();
            } else {
                var formParamList = ['realName'];//需要验证的字段
                var errorMsg = commonService.showFormValidateInfo(form, formParamList);
                commonService.alertDialog(errorMsg);
            }
        };
        /**
         * 密保信息提交
         */
        $scope.submitSecurityInfoForm = function () {
            for (var i = 0; i < $scope.qList.length; i++) {
                if (!$scope.qList[i].answer) {
                    commonService.alertDialog("问题" + $scope.qList[i].num + "，没有答案，请填写!");
                    return;
                }
            }
            baseInfoService.savePwProQuestion().then(function (data) {
                if (data) {
                    commonService.alertDialog("信息保存成功!");
                }
            });
        };
        /**
         * 关联手机提交
         */
        $scope.submitReferCellphoneForm = function () {
            var form = this.cellphoneResetForm;
            var param = {
                telephone:$scope.formData.tel,
                telVC: $scope.formData.telVC
            };
            if(!$scope.formData.tel){
                commonService.alertDialog("手机号码不能为空!");
                return;
            }
            if(!$scope.formData.telVC){
                commonService.alertDialog("手机验证码不能为空!");
                return;
            }
            $log.log("phone:"+$scope.formData.tel+" telVC:"+$scope.formData.telVC);
            if (form.$valid) {
                baseInfoService.resetTelephone(param).then(function (data) {
                    if (data.code == 200) {
                        commonService.alertDialog("更换关联手机成功!");
                        //$state.go('home.me');
                    }else{
                        commonService.alertDialog(data.msg);
                    }
                });
            }
        };

        /**
         * 保存密保设置
         */
        function saveSecurityInfo() {
            commonService.alertDialog("信息保存成功！");
        }

        /**
         * 设置第二监护人
         */
        $scope.settingSecondSubmit = function () {
            var form = this.setSecondPForm;
            if (form.$valid) {
                debugger;
                if ($scope.secondP.secondGender==undefined) {
                    commonService.alertDialog("请选择性别！", 1500);
                    return;
                }
                // if ($scope.secondP.secondRelationShip=='-1') {
                //     commonService.alertDialog("请选择与学生的关系！", 1500);
                //     return;
                // }
                if($scope.secondP.secondPassword!=$scope.secondP.confirmPass){
                    commonService.alertDialog(finalData.VALIDATE_MSG_INFO.confirmPassword.confirmPass);
                    return;
                }
                $scope.secondP.secondRelationShip = $scope.secondP.secondGender;
                $scope.secondP.secondName = workStatisticsServices.pubWorkStudent.name + '家长'; //指定监护人姓名

                baseInfoService.saveSecondP();
            } else {
                var formParamList = ['secondPhone', 'secondPassword', 'confirmPassword'];//需要验证的字段
                var errorMsg = commonService.showFormValidateInfo(form, formParamList);
                commonService.alertDialog(errorMsg, 1500);
            }
        };

        /**
         * 第二监护人性别选择
         * @param $event
         * @param type
         */
        $scope.handleSecondGCheck = function ($event, type) {
            if (type == $scope.secondP.secondGender) {
                $scope.secondP.secondGender = !type;
            } else {
                $scope.secondP.secondGender = type;
            }
        } 
        /*
        * 删除第二监护人
        * */
        $scope.handleDelSecond = function(){
            let params = {
                secondUserId:$scope.secondP.id
            };
            baseInfoService.delSecond(params).then(function(data){
                if(data.code == 200){
                    commonService.alertDialog("删除成功");
                    //返回设置第二监护人页面时 重置表单数据为空
                    $scope.secondP.first = true;
                    $scope.secondP.secondName = '';
                    $scope.secondP.secondPhone = '';
                    $scope.secondP.secondGender = '-1';
                    $scope.secondP.secondRelationShip = '-1';
                    $scope.secondP.secondPassword = '';
                    $scope.secondP.confirmPass = '';
                }else{
                    commonService.alertDialog(data.msg);
                }
            })
        }
        /*返回按钮*/
        $scope.back=function () {
            $state.go("home.person_index")
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);
