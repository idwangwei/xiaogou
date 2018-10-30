/**
 * Created by 邓小龙 on 2015/8/5.
 * @description 注册成功提示 ctrl
 */
import  controllers from './../index';

controllers.controller('forgetUserNameCtrl', function ($rootScope,$scope,$state, $ionicHistory,$log, $stateParams,commonService) {
    'ngInject';

    $scope.pUserNameList=commonService.getLocalStorage("pUserNameList")||[];
    /**
     * 返回
     */
    $scope.back = function () {
        $state.go('system_login');
    };
    /*返回注册*/
    $rootScope.viewGoBack=$scope.back.bind($scope);
});
