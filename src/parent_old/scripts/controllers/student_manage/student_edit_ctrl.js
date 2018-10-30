/**
 * Created by 邓小龙 on 2015/8/5.
 * @description
 */
import  controllers from './../index';

controllers.controller('studentEditCtrl',
    function ($scope, $state, $log, $ionicHistory, $ionicLoading, $interval, $window, studentService, commonService,finalData,$rootScope) {
        'ngInject';
        /**
         * 修改--初始化表单数据
         */
        $scope.formData = studentService.getStuEditParam();
        $scope.pageStatus = 1;

        $scope.passwordSetting={
            model:$scope.formData,
            placeholder:'新密码 (限6个字符)',
            modelName:'newPass',
            name:'newPass'
        };
        $scope.passwordConfirmSetting={
            model:$scope.formData,
            modelName:'confirmPassword',
            placeholder:'再次输入密码 (限6个字符)',
            name:'confirmPassword'
        };

        $scope.getValidateImage = function () {
            commonService.getValidateImageUrl().then(function (data) { //获取验证码
                $scope.validateImageUrl = data;
                $scope.imgVSuccess = false;
            });
        }
        $scope.getValidateImage();
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
         * @description 发起用户登录请求并处理返回结果
         */
        function editStudent() {
            commonService.validateImageVCode($scope.formData.vCode).then(function (data) {//先验证图形验证码是否正确
                if (data.code == 200) {      //正确
                    studentService.editStudent($scope.formData).then(function (data) {
                        if (data&&data.code==200) {
                            commonService.alertDialog("保存成功!");
                            studentService.setStuEditParam({});
                            commonService.getStudentList();//重置学生列表
                            $state.go('home.child_index');
                        } else {
                            commonService.showAlert('提示',data.msg);
                        }
                    });
                    return;
                }
                commonService.alertDialog(data.msg, 1500);
                $scope.getValidateImage();
            });

        }

        /**
         * 提交
         */
        $scope.handleSubmit = function () {
            var form = this.studentRegisterForm;
            if (form.$valid) { //表单数据合法，发起登录请求
                editStudent();
            } else { //表单数据不合法，显示错误信息
                var formParamList = ['studentName', 'vCode']; //需要验证的字段
                var errorMsg = commonService.showFormValidateInfo(form, formParamList);
                commonService.alertDialog(errorMsg);
            }
        };

        /**
         * @description 处理性别选择的checkbox点击
         * @param ev 点击事件
         */
        $scope.handleGenderSelect = function (type) {
            if (type == $scope.formData.gender) {
                $scope.formData.gender = !type;
            } else {
                $scope.formData.gender = type;
            }
        };

        $scope.handlePwd = function () {   //验证密码是否填写
            var form = this.resetPassForm;
            if (form.$valid) { //表单数据合法，发起登录请求
                if($scope.formData.newPass!=$scope.formData.confirmPassword){
                    commonService.alertDialog(finalData.VALIDATE_MSG_INFO.confirmPassword.confirmPass);
                    return;
                }
                resetPwd();
            } else { //表单数据不合法，显示错误信息
                var formParamList = ['newPass', 'confirmPassword']; //需要验证的字段
                var errorMsg = commonService.showFormValidateInfo(form, formParamList);
                commonService.alertDialog(errorMsg);
            }
        };

        function resetPwd() {
            studentService.resetPwd($scope.formData.loginName, $scope.formData.newPass).then(function (data) {
                if (!data) {
                    commonService.alertDialog('网络不畅，请稍后再试', 1500);
                    return;
                }
                if (data.code == 300) {
                    commonService.alertDialog(data.msg, 1500);
                    return;
                }
                commonService.alertDialog("保存成功!");
                $state.go('home.child_index');
            });
        }

        /**
         * 返回
         */
        $scope.back = function () {
            $state.go("home.child_index");
        };
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    });

