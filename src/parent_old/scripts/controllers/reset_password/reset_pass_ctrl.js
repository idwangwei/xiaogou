/**
 * Created by 华海川on 2015/10/8.
 * description 重置密码第一步：提交要找回的账号
 */
import  controllers from './../index';
controllers.controller('resetPassCtrl', function ($scope, $state,$ionicHistory, $log,$ionicPopup, commonService, profileService,subHeaderService,$rootScope) {
    'ngInject';
    /**
     * 注册 表单数据
     */
    $scope.formData = {};
    $scope.securityFormData = {};
    subHeaderService.clearAll();
    $scope.formData.loginName=commonService.getLocalStorage("findPassLoginName");
    $scope.pStudentList=profileService.pStudentList;

    /**
     * 提交找回目标账号的表单
     */
    $scope.submitCellPhoneForm = function () {
        if (!$scope.formData.loginName || $scope.formData.loginName == "") {
            commonService.alertDialog("请填写要找回的账号!");
            return;
        }else if(!$scope.formData.loginName.match(/^1\d{10}(P|p|G|g)\d*$/g)){
            warning();
            return;
        }
        profileService.getUserPhoneAndChildren($scope.formData.loginName).then(function (data) {//根据登陆账号获取其关联的手机号
            var param = {
                loginName: $scope.formData.loginName
            };
            if (!data) {
                commonService.alertDialog('网络不畅，请稍后再试', 1500);
                return;
            }
            if (data.code == 604) {
                commonService.alertDialog(data.msg, 2000);
                return;
            }
            $scope.pStudentList.splice(0,$scope.pStudentList.length);
            angular.forEach(data.students,function (student) {
                $scope.pStudentList.push(student);
            });
            commonService.setLocalStorage("findPassLoginName",$scope.formData.loginName);
            param.phone = data.telephone;
            
            $state.go("reset_pass_apply", param);
        });
    };
    /**
     * 返回
     */
    $scope.back = function () {
        $state.go("system_login");
    };
    /*返回注册*/
    $rootScope.viewGoBack=$scope.back.bind($scope);
    /*
    * 账号格式提示
    * */
    function warning() {
        $ionicPopup.alert({
            title: '账号格式不正确',
            template: '<p>家长账号应是如下形式：</p>'
            + '<p>1.手机号+P<br/>或<br/>' +
            '2.手机号+P+数字<br/>或' +
            '<br/>3.手机号+G<br/>或' +
            '<br/>4.手机号+G+数字</p>' +
            '<p style="color:#6B94D6 ">例如：13666668888P</p>',
            okText: '确定'
        });
    }
    $scope.checkAccount = function () {

        return !$scope.formData.loginName || ($scope.formData.loginName && $scope.formData.loginName.match(/^1(3|4|5|7|8)\d{9}(p|g)\d*$/i));
    }
});

