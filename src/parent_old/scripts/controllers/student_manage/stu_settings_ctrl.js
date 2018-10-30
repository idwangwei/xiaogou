/**
 * Created by 彭建伦 on 2015/7/28.
 */
import  controllers from './../index';

controllers.controller('stuSettingsCtrl', ['$scope', '$state', '$log', '$stateParams', 'studentService', 'commonService', 'profileService',
    'jPushManager',
    function ($scope, $state, $log, $stateParams, studentService, commonService, profileService, jPushManager) {

        /**
         * 编辑学生
         */
        $scope.editStu = function () {
            /* var param={};
             param.id=student.id;
             param.studentName=student.name;
             param.gender=student.gender;
             param.relationShip=student.relationShip;
             param.loginName = student.loginName;
             studentService.setStuEditParam(param);*/
            $state.go("edit_child");

        };


        /**
         * 真实删除学生
         * @param sid 学生id
         */
        $scope.delStu = function () {
            var stu = studentService.getStuEditParam();
            var tip = '你确定要删除' + stu.studentName + '吗？'
            commonService.showConfirm('信息提示', tip).then(function (res) {
                if (res) {
                    studentService.pDelete(stu.id).then(function (data) {
                        if (data) {
                            commonService.alertDialog("删除成功!");
                            $scope.studentList.splice($index, 1);
                            $state.go("home");
                            return;
                        }
                        commonService.alertDialog('网络不畅，请稍后再试', 1500);
                    });
                }
            });
        };

        /**
         * 学生班群管理
         */
        $scope.childClassList = function () {
            var stu = studentService.getStuEditParam();
            $state.go("child_class_list", {sid: stu.id});
        }
        /*注冊返回*/
        $rootScope.viewGoBack=function () {
            return "exit";
        }.bind(this)

    }]);


