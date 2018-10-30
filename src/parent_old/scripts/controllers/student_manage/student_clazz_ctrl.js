/**
 * Created by 彭建伦 on 2015/7/28.
 */

import  controllers from './../index';

controllers.controller('studentClassCtrl',function ($rootScope,$scope,$ionicHistory, $state, $stateParams, $log, studentService, commonService,profileService) {
    'ngInject';
    $scope.classList = studentService.clazzList;
    $scope.tip="点击右上角的加号添加班级";
    $scope.retFlag=false;
    /**
     * 获取参数判断
     */
    if (!($scope.sid = $stateParams.sid)) {
        $log.error('sid is undefined!');
        return;
    }
    studentService.updateStuClasses();

    studentService.pGetStuClasses($scope.sid).then(function (data) { //获取学生参加的班级或已申请的班级
        if (!data) {
            commonService.alertDialog('服务器忙，code'+data.code, 1500);
            return;
        }
        $scope.retFlag=true;
    });

    /**
     * 家长真实删除学生班级
     * @param sid 学生id
     */
    $scope.delStuClass = function (sid, classId, $index,clazz) {
        var templete='<div><p>你确定要删除该班级吗？</p><p style="color: red"' +
            '>删除后，孩子将收不到该班级的作业和游戏了。</p></div>';
        commonService.showConfirm('信息提示', templete).then(function (res) {
            if (res) {
                studentService.pDelStuClass(sid, classId).then(function (data) {
                    if (data.code == 200) {
                        commonService.alertDialog("删除成功!");
                        $scope.classList.splice($index, 1);
                        profileService.changeRootStuClazzList(sid,clazz,2);//更新rootScope上的stu信息。
                        return;
                    }
                    commonService.alertDialog('网络不畅，请稍后再试', 1500);
                });
            }
        });
    };

    /**
     * 返回
     */
    $scope.back = function () {
        $state.go("home.child_index");
    };
    /*返回注册*/
    $rootScope.viewGoBack=$scope.back.bind($scope);
});

