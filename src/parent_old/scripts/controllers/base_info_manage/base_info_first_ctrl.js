/**
 * Created by 邓小龙 on 2015/7/31.
 * @description 个人信息维护
 * 华海川（重构） 2015/10/8
 */
import  controllers from './../index';

controllers.controller('baseInfoFirstCtrl', ['$scope', '$rootScope', '$log', '$state', 'baseInfoService', 'commonService', 'profileService','$ionicHistory',
    function ($scope, $rootScope, $log, $state, baseInfoService, commonService, profileService,$ionicHistory) {
        $scope.qList = baseInfoService.qList;//密保问题列表

        $scope.qBackList = baseInfoService.qBackList;//多余的密保问题列表
        /**
         * 表单数据
         */
        $scope.formData = baseInfoService.baseInfo;
        /**
         * 性别 男为1 女为0 ，不选则为-1
         */
        $scope.formData.gender = -1;
        /**
         * 页面状态 默认为1
         */
        $scope.pageStatus = 1;
        
        $scope.passwordSetting={
            model:$scope.formData,
            placeholder:'密码 (限6个字符)',
            modelName:'password',
            name:'password'
        };
        $scope.passwordConfirmSetting={
            isConfirm:true,
            model:$scope.formData,
            modelName:'confirmPassword',
            placeholder:'再次输入密码 (限6个字符)',
            name:'confirmPassword'
        };
        /**
         * 数据初始化
         */
        baseInfoService.getPwProQuestion().then(function (data) {
            if (!data) {
                commonService.alertDialog('网络不畅，请稍后再试', 1500);
            }
        });

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
         * 保存用户基本信息
         */
        function saveBaseInfo() {
            if ($scope.formData.gender == -1) {
                commonService.alertDialog("请选择性别！");
                return;
            }
            baseInfoService.saveBaseInfo().then(function (data) {
                if (data.code==200) {
                    commonService.alertDialog("基本信息保存成功!",1500);
                    $rootScope.user.name=$scope.formData.name;
                    $rootScope.user.gender=$scope.formData.gender;
                    profileService.loginSuccessAndGoHome();
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
                if (data.code==200) {
                    commonService.alertDialog("密保信息保存成功!");
                    profileService.loginSuccessAndGoHome();
                }else{
                    commonService.alertDialog(data.msg, 1500);
                }
            });
        };

        /**
         * 返回
         */
        $scope.back = function () {
            $state.go("system_login");//返回到列表展示
        };
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);
