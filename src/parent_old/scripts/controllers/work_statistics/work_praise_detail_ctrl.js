/**
 * Author 邓小龙 on 2015/9/2.
 * @description 表扬 controller
 */
import  controllers from './../index';
import  _ from 'underscore';
controllers.controller('workPraiseDetailCtrl',
    function ($scope, $log, $state, $ionicModal, $rootScope, commonService, workStatisticsServices, finalData, $ionicHistory) {
        'ngInject';

        $scope.wData = workStatisticsServices.wData;//共享作业的数据
        workStatisticsServices.getPraiseDetail($scope.wData.correctedPraise.showType);//获取评价列表
        $scope.studentName=workStatisticsServices.pubWorkStudent.name;
        /**
         * 返回作业列表展示
         */
        $scope.back = function () {
            $state.go("home.work_list");
        };

        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);

    });
