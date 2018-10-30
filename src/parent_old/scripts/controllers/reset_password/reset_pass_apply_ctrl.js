/**
 * Created by 彭建伦 on 2015/7/27.
 * @description 找回密码
 * 华海川（重构） 2015/10/8
 */
import  controllers from "./../index";

controllers.controller('resetPassApplyCtrl', function ($scope, $state, $ionicHistory, $log, $rootScope, $interval, $ionicLoading, baseInfoService, profileService, commonService,$ionicPopup,finalData) {
    'ngInject';
    $scope.telVcBtnText = "点击获取";
    if (!$state.params.loginName || !$state.params.phone) {
        $log.log("没有参数!");
        return;
    }

    $scope.loginName = $state.params.loginName;//账号
    $scope.phone = $state.params.phone;//账号所关联的手机号码
    $scope.pageStatus = 3;//初始页面状态
    $scope.phoneStatus = 3;
    $scope.data={
        pStudentList:profileService.pStudentList
    };

    /**
     * 注册 表单数据
     */
    $scope.formData = {};
    $scope.securityFormData = {};
    $scope.passwordByPhoneSetting={
        model:$scope.formData,
        placeholder:'新密码 (限6个字符)',
        modelName:'newPass',
        name:'newPass'
    };
    $scope.passwordConfirmByPhoneSetting={
        model:$scope.formData,
        modelName:'confirmPassword',
        placeholder:'再次输入密码 (限6个字符)',
        name:'confirmPassword'
    };

    $scope.passwordBySecuritySetting={
        model:$scope.securityFormData,
        placeholder:'新密码 (限6个字符)',
        modelName:'newPass',
        name:'newPass'
    };
    $scope.passwordConfirmBySecuritySetting={
        model:$scope.securityFormData,
        modelName:'confirmPassword',
        placeholder:'再次输入密码 (限6个字符)',
        name:'confirmPassword'
    };


    /**
     * 初始图片验证码
     */
    $scope.initImage = commonService.getValidateImageUrl().then(function (data) {
        $scope.validateImageUrl = data;
        $scope.validateImageUrl2 = data;
    });

    $scope.qList = baseInfoService.qList;

    /**
     * 数据初始化
     */
    baseInfoService.getPwProQuestion({loginName: $state.params.loginName}).then(function (data) {
        if (!data) {
            commonService.alertDialog('网络不畅，请稍后再试', 1500);
        }
    });


    /**
     * 获取图片验证码
     */
    $scope.getValidateImage = function (type) {
        if (type == 1) {
            commonService.getValidateImageUrl().then(function (data) {
                $scope.validateImageUrl = data;
            });
        } else {
            commonService.getValidateImageUrl().then(function (data) {
                $scope.validateImageUrl2 = data;
            });
        }
    };
    /**
     * 验证图形验证码
     */
    $scope.validateImageVCode = function (vCode) {
        commonService.validateImageVCode(vCode).then(function (data) {
            if (data.code == 200) {
                $scope.imgVSuccess = true;
            }
        });
    };

    /**
     * 校验手机短信验证码
     */
    function validateTelVC() {
        commonService.validateTelVC($scope.formData.telVC).then(function (data) {
            if (data) {
                $scope.pageStatus = 5;
            } else {
                $log.error(JSON.stringify(data.msg));
            }
        });
    }

    /**
     * 根据登陆账号获取手机验证码
     */
    $scope.getTelVCByLoginName=function() {
        showTextForWait();
        profileService.getTelVCByLoginName($scope.loginName).then(function (data) {
            if (data.code==200) {
                commonService.alertDialog("短信验证码已下发,请查收!",2000);
            } else if(data.code==552){
                $scope.formData.telVC =data.telVC;
            }else{
                commonService.alertDialog(data.msg, 1500);
            }
        });
    }

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
        }, 1000);
    }

    /**
     * 获取所选学生的id
     * @returns {Array}
     */
    function getSelectStuIds(){
        var selectedArr=[];
        angular.forEach($scope.data.pStudentList,function (stu) {
            if(stu.selected)
                selectedArr.push(stu.id);
        });
        return selectedArr;
    }

    /**
     * 重置密码--通过手机验证码
     */
    function resetPassByVCode() {
        var stuIdsArr=getSelectStuIds();
        profileService.resetPassWordByVCode($state.params.loginName, $scope.formData.newPass, $scope.formData.telVC,stuIdsArr).then(function (data) {
            if (data&&data.code==200) {
                var template=stuIdsArr.length?'<p>家长和孩子的密码重置成功!</p>':'<p>家长的密码重置成功!</p>';
                $ionicPopup.alert({
                    title: '信息提示',
                    template: template,
                    okText:'确定'
                });
                $state.go('system_login');
            }else if(data&&data.code==551){
                $ionicPopup.alert({
                    title: '信息提示',
                    template: '<p>短信验证码错误!</p>',
                    okText:'确定'
                });
            } else {
                $ionicPopup.alert({
                    title: '信息提示',
                    template: '<p>家长密码重置失败!</p>',
                    okText:'确定'
                });
            }
        });

    }

    /**
     * 处理tab 按钮点击事件
     * @param $event 事件
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
     * 提交确认手机号码表单 (即pageStatus=2下提交表单)
     */
    $scope.submitCellPhoneConfirmForm = function () {
        $scope.pageStatus = 3;
        $scope.phoneStatus = 3;
        $scope.getTelVCByLoginName();
    };

    /**
     * 提交验证手机验证码校验表单
     */
    $scope.submitCellPhoneTelVCForm = function () {
        var form = this.CellPhoneTelVCForm;
        if (form.$valid) {
            validateTelVC();
        } else {
            var formParamList = ['telVC'];
            var errorMsg = commonService.showFormValidateInfo(form, formParamList);
            commonService.alertDialog(errorMsg);
        }
    };
    /**
     * 提交密保找回表单
     */
    $scope.submitSecurityForm = function () {
        var flag = true;
        for(var i=0;i<$scope.qList.length;i++){
            var item=$scope.qList[i];
            if (!item.answer) {
                commonService.alertDialog("问题" + item.num + "，没有答案，请填写!");
                flag = false;
                break;
            }
        }
        if (!flag) {
            return;
        }
        baseInfoService.checkPwProQuestion($state.params.loginName).then(function (data) {
            if (data.code==200) {
                $scope.pageStatus = 5;//密保验证成功
                return;
            }
            commonService.alertDialog(data.msg);
            $scope.getValidateImage(2);
        });
    };
    /**
     * 提交密码找回--通过手机验证码的表单
     */
    $scope.submitResetPassByVCodeForm = function () {
        var form = this.resetPassByVCodeForm;
        if (form.$valid) {
            if($scope.formData.newPass!=$scope.formData.confirmPassword){
                commonService.alertDialog(finalData.VALIDATE_MSG_INFO.confirmPassword.confirmPass);
                return;
            }
            resetPassByVCode();
        } else {
            var formParamList = ['newPass', 'confirmPassword', 'telVC'];
            var errorMsg = commonService.showFormValidateInfo(form, formParamList);
            commonService.alertDialog(errorMsg);

        }
    };
    /**
     * 提交密码找回--通过密保的表单
     */
    $scope.submitResetPassBySecurityForm = function () {
        var form = this.resetPassBySecurityForm;
        if (form.$valid) {
            if($scope.securityFormData.newPass!=$scope.securityFormData.confirmPassword){
                commonService.alertDialog(finalData.VALIDATE_MSG_INFO.confirmPassword.confirmPass);
                return;
            }
            resetPassBySecurity();
        } else {
            var formParamList = ['newPass', 'confirmPassword'];
            var errorMsg = commonService.showFormValidateInfo(form, formParamList);
            commonService.alertDialog(errorMsg);
        }
    };

    /**
     * 重置密码--通过密保
     */
    function resetPassBySecurity() {
        var stuIdsArr=getSelectStuIds();
        profileService.resetPassWordBySecurity($state.params.loginName, $scope.securityFormData.newPass,stuIdsArr).then(function (data) {
            if (data) {
                var template=stuIdsArr.length?'<p>家长和孩子的密码重置成功!</p>':'<p>家长的密码重置成功!</p>';
                $ionicPopup.alert({
                    title: '信息提示',
                    template: template,
                    okText:'确定'
                });
                $state.go('system_login');
            } else {
                $ionicPopup.alert({
                    title: '信息提示',
                    template: '<p>家长密码重置失败!</p>',
                    okText:'确定'
                });
            }
        });

    }

    /**
     * 返回
     */
    $scope.back = function () {
        $state.go("reset_pass");
    };

});

