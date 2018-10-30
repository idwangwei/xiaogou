/**
 * Created by 彭建伦 on 2015/7/28.
 */

import  controllers from './../index';

/**
 * 申请学生班级controller
 */
controllers.controller('studentClassApplyCtrl',
    function ($scope, $state, $stateParams, $log, $ionicLoading, $interval, studentService, commonService,$ionicHistory,profileService,$rootScope) {
        /**
         * 表单数据
         */
        $scope.formData = {};
        /**
         * 获取参数判断
         */
        if (!$stateParams.sid) {
            $log.error('sid is undefined');
            return;
        }
        /**
         * @description 发起申请加入班级的申请
         */
        function sendApply() {
            commonService.validateImageVCode($scope.formData.vCode).then(function (data) {//先验证图形验证码是否正确
                if (data && data.code == 200) {//正确
                    $scope.formData.sid = $stateParams.sid;
                    studentService.sendAddClassApply($scope.formData).then(function (data) {
                        if (data.code == 200) {
                            try{
                                //自学班号 大于 90000000
                                if( Number($scope.formData.classNumber ) > 90000000 ) {
                                    commonService.alertDialog('恭喜您，学生已加入自学班级!',2500);
                                }else{
                                    commonService.alertDialog('恭喜您，学生已加入该班级!',2500);
                                }
                            }catch(err){
                                console.error(err);
                            }


                            if(data.clazz){
                                data.clazz.status=0;
                                profileService.changeRootStuClazzList($scope.formData.sid,data.clazz,1);
                            }
                            $state.go('home.child_index', {sid: $scope.formData.sid});
                        } else if(data.code==30003){                 //处理班级有相同姓名的学生
                            var obj = data.data;
                            var msg=data.msg
                            for(var key in obj){
                                msg+='<br/>学生账号: '+key+'<br/>家长名: '+obj[key];
                            }
                            msg+='<br/>点击确定将会申请，点击取消放弃申请';
                            commonService.showConfirm('信息提示',msg).then(function(data){
                                if(data){
                                    $scope.formData.force=true;
                                    sendApply();
                                }
                            });
                        }
                        else {
                            commonService.alertDialog(data.msg, 2500);
                        }
                    });
                    return;
                }
                if (data.msg) {
                    commonService.alertDialog(data.msg);
                    $scope.getValidateImage();
                    return;
                }
            });
        }

        /**
         * 获取图片验证码
         */
        $scope.getValidateImage = function () {
            commonService.getValidateImageUrl().then(function (data) {
                $scope.validateImageUrl = data;
                $scope.imgVSuccess = false;
            });
        };

        $scope.getValidateImage();
        $scope.formData = {}; //表单数据

        $scope.handleSubmit = function () {
            var form = this.classApplyForm;
            if (form.$valid) { //表单数据合法，发起登录请求
                if($scope.formData.classNumber.toString().match(/^\d{6,9}$/)){
                    sendApply();
                }else {
                    commonService.alertDialog('班级号格式错误');
                }
            } else { //表单数据不合法，显示错误信息
                var formParamList = ['classNumber', 'vCode']; //需要验证的字段
                var errorMsg = commonService.showFormValidateInfo(form, formParamList);
                commonService.alertDialog(errorMsg);
            }
        }

        /**
         * 返回
         */
        $scope.back = function () {
            $state.go("home.child_index");
        };
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
        $scope.justNumber = function(){
            if(typeof $scope.formData.classNumber !== 'string') return;
            $scope.formData.classNumber = $scope.formData.classNumber.replace(/[^0-9]/g, '');
        }

    });

