/**
 * Created by 邓小龙 on 2015/08/05.
 */

import  controllers from './../index';

controllers.controller('studentClazzDetailCtrl',function ($scope, $ionicHistory,$state, $log, $stateParams,profileService, studentService, commonService,$rootScope) {
    'ngInject';
    $scope.clazzInfo = studentService.clazzInfo;
    $scope.selectedClazz=studentService.selectedClazz;
    // /**
    //  * 获取参数判断
    //  */
    // if (!$stateParams.cid) {
    //     $log.error('cid is undefined');
    //     return;
    // }
    /**
     * 根据班级id获取详细信息
     */
    studentService.getClassInfo($scope.selectedClazz.id).then(function (data) {
        if (!data) {
            commonService.alertDialog('网络不畅，请稍后再试', 1500);
            return;
        }
    });

    /**
     * 家长真实删除学生班级
     * @param sid 学生id
     */
    $scope.deleteClazz = function () {
        let showMsg = $scope.selectedClazz.type !== 900
            ? `<div><p>你确定要删除该班级吗？</p><p style="color: #c33600">删除后，孩子将收不到该班级的作业和游戏了。</p></div>`
            : `<div style="color: #c33600">
                    <p>删除自学班，孩子在
                        <span style="color: #6b94d6;font-weight: bold;">速算</span>和
                        <span style="color: #6b94d6;font-weight: bold;">学霸驯宠记</span>的自学班做题记录都会被相应删除！
                    </p>
                    <p style="text-align:center">确定删除吗？</p>
                </div>`;



        commonService.showConfirm('信息提示', showMsg).then(function (res) {
            if (res) {
                studentService.pDelStuClass($scope.selectedClazz.student.id, $scope.selectedClazz.id).then(function (data) {
                    if (data.code == 200) {
                        commonService.alertDialog("删除成功!");
                        //student.clazzs.splice($index, 1);

                        let clazz = {id:$scope.selectedClazz.id}
                        profileService.changeRootStuClazzList($scope.selectedClazz.student.id,clazz,2);//更新rootScope上的stu信息。
                        $scope.back();
                        return;
                    }
                    commonService.alertDialog('服务器忙Code:'+data.code, 1500);
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


