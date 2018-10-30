/**
 * Created by 邓小龙 on 2015/2/01.
 */

import  controllers from './../index';

controllers.controller('aboutCtrl', ['$scope', '$state', '$rootScope', 'commonService',
    function ($scope, $state, $rootScope, commonService) {

        $scope.appNumVersion = commonService.getAppNumVersion();

        $scope.clickCount = 0;

        $scope.changeLog = commonService.getChangeLog();
        $scope.back=function () {
            $state.go("home.person_index")
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
        $scope.clickImg = function () {
            $scope.clickCount++;
        };

    }]);

