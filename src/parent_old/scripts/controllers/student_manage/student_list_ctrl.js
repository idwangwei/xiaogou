/**
 * Created by 彭建伦 on 2015/7/28.
 */
import  controllers from './../index';

controllers.controller('studentListCtrl', ['$scope', '$state', '$log', '$timeout', '$stateParams','$ionicPopup','finalData',
    'studentService', 'commonService', 'profileService', 'uuid4', 'QRCodeScaner', '$ionicModal', '$rootScope', 'gameService', '$ionicSideMenuDelegate', 'jPushManager','subHeaderService',
    function ($scope, $state, $log, $timeout, $stateParams,$ionicPopup, finalData,studentService, commonService, profileService, uuid4, QRCodeScaner,
              $ionicModal, $rootScope, gameService, $ionicSideMenuDelegate, jPushManager,subHeaderService) {
        subHeaderService.clearAll();
        $scope.studentList = studentService.studentList;
        $scope.flag = false;

        if (!$rootScope.jPushInitFlag && $rootScope.user.userId) {
            try {
                jPushManager.jPushInit();
            } catch (e) {
                $log.log("jPushManager init error!");
            }
        }
        $scope.tip = "点击右上角的“＋”添加孩子";
        studentService.getStudentList().then(function (data) {//获取学生列表
            if (!data) {
                commonService.alertDialog('网络不畅，请稍后再试', 1500);
                return;
            }
            var student = commonService.getLocalStorage('student');
            if (student) {
                $scope.studentList.forEach(function (item) {
                    if (item.id == student.id) {
                        item.isClicked = true;
                    }
                });
            }
            $scope.flag=true;
        });
        studentService.updateStuClasses();

        $scope.toggleRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };

        /**
         * 编辑学生
         */
        $scope.edit = function (student) {
            var param = {};
            param.id = student.id;
            param.studentName = student.name;
            param.gender = student.gender;
            param.relationShip = student.relationShip;
            param.loginName = student.loginName;
            studentService.setStuEditParam(param);
            $state.go("edit_child");

        };


        /**
         * 跳转到学生设置页面
         */
        $scope.showStuSettings = function (student) {
            var param = {};
            param.id = student.id;
            param.studentName = student.name;
            param.gender = student.gender;
            param.relationShip = student.relationShip;
            param.loginName = student.loginName;
            studentService.setStuEditParam(param);
            $state.go("edit_child");
        };

        /**
         * 查看班级详情
         */
        $scope.goClazzDetail=function(student,clazzId,$index,clazz){
            studentService.selectedClazz=clazz;
            studentService.selectedClazz.student=student;
            $state.go("child_class_detail");
        };

        /**
         * 消息列表展示
         */
        $scope.showMessageList = function () {
            /*var senderInfo={senderId: "15475e75-4dbb-4943-b180-fb3b2301ccc5", senderName: "德玛", senderRole: "C"};
             var msgInfo={
             msgId: "8888888-8117-4c7a-9c0a-d3685bf7c2b3",
             senderId: "15475e75-4dbb-4943-b180-fb3b2301ccc5",
             otherData: '{"instanceId":"526243a5-dc1f-4244-bee5-7460f543732…,"workId":"7155b34d-e3b5-4253-8546-10cd129ce326"}", msgContent: "您的孩子【德玛】已经提交作业，请对作业进行确认评价，给您的孩子点个赞吧:)',
             msgContent: "您的孩子【德玛】已经提交作业，请对作业进行确认评价，给您的孩子点个赞吧:)",
             msgDateTime: "2016-01-12 14:58:25",
             magStatus: 1};
             var contactDb=new indexedDbUtil.Db("contacts",1);
             var messageDb=new indexedDbUtil.Db("message",1);
             contactDb.open(function(){
             $log.log("open contact success!");

             });
             $timeout(function(){
             var saveFlag=true;
             contactDb.getAll(function(data){
             _.each(data,function(sender){
             if(sender.senderId==senderInfo.senderId){
             saveFlag=false;
             return true;
             }
             });
             });
             contactDb.save(senderInfo,saveFlag,function(){
             $log.log("added a contact");
             });
             },200);

             messageDb.open(function(){$log.log("open msg success!")});
             $timeout(function(){
             messageDb.save(msgInfo,function(){
             $log.log("added a msg");
             });
             },200);*/


            $state.go("message_list");
        };


        $scope.goGameList = function (student) {  //去游戏列表页
            gameService.student.id = student.id;
            gameService.student.name = student.name;
            $state.go('game_list');
        };

        $scope.$on('scanQrCode', function () {
            $scope.scanQRCode();
        });
        $scope.$on('logout', function () {
            $scope.logout();
        });


        /**
         * 真实删除学生
         * @param sid 学生id
         */
        $scope.delStu = function ($index, id, studentName) {
            var tip = '你确定要删除' + studentName + '吗？'
            commonService.showConfirm('信息提示', tip).then(function (res) {
                if (res) {
                    studentService.pDelete(id).then(function (data) {
                        if (data.code == 200) {
                            commonService.alertDialog("删除成功!");
                            $scope.studentList.splice($index, 1);
                            commonService.getStudentList();//重置学生列表
                            return;
                        }
                        commonService.alertDialog('网络不畅，请稍后再试', 1500);
                    });
                }
            });
        };


        $scope.add_child=function(){
            if($scope.studentList.length>=2){
                commonService.alertDialog("您最多只能添加两个孩子.");
                return;
            }
            $state.go("add_child");
        }

        $scope.clickResetPassword=function (stu) {
            $scope.formData={
                newPass:'',
                confirmPassword:'',
                loginName:stu.loginName
            };
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
            $ionicModal.fromTemplateUrl('reset_child_password.html', { //初始化modal页
                scope: $scope
            }).then(function (modal) {
                $scope.resetChildPasswordModal = modal;
                $rootScope.modal.push(modal);
                $scope.resetChildPasswordModal.show();
            });

        }

        
        $scope.handlePwd=function () {
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
                commonService.alertDialog("保存成功!",1500);
                $scope.resetChildPasswordModal.hide();
                $state.go('home.child_index');
            });
        }

        $scope.help1=function(){
            $ionicPopup.alert({
                title: '常见问题',
                template: `
                <p style="color: #377AE6">问：孩子加错了班级，怎么办？</p>
                 <p>答：删除该班级，点“+添加班级”重新申请正确的班级。</p>`,
                okText: '确定'
            });
        }

        $scope.help2=function(){
            $ionicPopup.alert({
                title: '常见问题',
                template: `
                <p style="color: #377AE6">问：老师错误拒绝了申请，如何重新申请？</p>
                 <p>答：删除该班级，点“+添加班级”重新申请。</p>`,
                okText: '确定'
            });
        }

        /*注冊返回*/
        $rootScope.viewGoBack=function () {
            return "exit";
        }.bind(this)

    }]);

