/**
 * Created by 邓小龙 on 2015/8/5.
 * @description 注册成功提示 ctrl
 */
import  controllers from './../index';


controllers.controller('registerSuccess', function ($rootScope,$scope, $state,$ionicHistory,$log, $stateParams,commonService,dateUtil) {
    'ngInject';
    if ($stateParams) {
        $scope.loginName = $stateParams.loginName;
        $scope.flag = $stateParams.flag;
        var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATE_TIME_CN_FORMAT;//格式成“2016年5月13日 11:30”
        var now = new Date();
        var createTime = dateUtil.dateFormat.prototype.format(now, formatStr); //当前日期
        var pUserNameList=commonService.getLocalStorage("pUserNameList")||[];
        var pUserNameInfo={};
        pUserNameInfo.pUserName=$scope.loginName;
        pUserNameInfo.createTime=createTime;
        pUserNameInfo.students=$rootScope.students;
        pUserNameList.push(pUserNameInfo);
        commonService.setLocalStorage("pUserNameList",pUserNameList);
    } else {
        $log.error("param is undefined！");
        return;
    }

    $scope.goToLoginStu=function(){
        window.localStorage.setItem('currentSystem', JSON.stringify({id: 'student'}));
        window.location.href = './student_index.html';
    };

    /**
     * 返回
     */
    $scope.back = function () {
        // $ionicHistory.goBack();
        $state.go("system_login")
    };
    /*返回注册*/
    $rootScope.viewGoBack=$scope.back.bind($scope);
});
