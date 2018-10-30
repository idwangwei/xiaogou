/**
 * Created by 华海川 on 2015/10/8.
 */
import  controllers from './../index';

controllers.controller('studentRegisteCtrl', ['$scope', '$state', '$log', '$ionicLoading', '$interval', 'profileService',
    'studentService', 'commonService', function ($scope, $state, $log, $ionicLoading, $interval, profileService, studentService, commonService) {
        $scope.formData = studentService.studentInfo;
        $scope.formData.relationShip = 0;
        $scope.formData.gender = 1; //初始为儿子，男性

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
         * 初始化验证图片
         */
        $scope.getValidateImage();

        /**
         * @description 发起用户登录请求并处理返回结果
         */
        function register() {
            $ionicLoading.show({
                template: "正在处理，请稍后..."
            });
            commonService.validateImageVCode($scope.formData.vCode).then(function (data) {//先验证图形验证码是否正确
                //隐藏载入指示器
                $ionicLoading.hide();
                if (data.code == 200) {//正确
                    studentService.registerStudent().then(function (data) {
                        if (data && data.code == 200) {
                            studentService.clearStuInfo();
                            commonService.alertDialog('添加成功');
                            $state.go('home.child_index');
                        } else if (data && data.code == 100) {
                            commonService.alertDialog(data.msg, 1500);
                        } else {
                            commonService.alertDialog(data.msg, 1500);
                        }
                    });
                    return;
                }
                if (data.code == 605) {
                    commonService.alertDialog("验证码不正确!");
                    $scope.getValidateImage();
                    return;
                }
                commonService.alertDialog(data.msg, 1500);
            });

        }

        /**
         * 提交
         */
        $scope.handleSubmit = function () {
            var form = this.studentRegisterForm;
            if (form.$valid) { //表单数据合法，发起登录请求
                register();
            } else { //表单数据不合法，显示错误信息
                var formParamList = ['studentName', 'password', 'confirmPassword', 'vCode']; //需要验证的字段
                var errorMsg = commonService.showFormValidateInfo(form, formParamList);
                commonService.alertDialog(errorMsg);
            }
        };

        /**
         * @description 处理性别选择的checkbox点击
         * @param ev 点击事件
         */
        $scope.handleGenderSelect = function (type) {
            $scope.formData.gender = type;
        }

    }]);

