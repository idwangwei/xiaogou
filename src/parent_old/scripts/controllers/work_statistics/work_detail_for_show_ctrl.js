/**
 * Author 邓小龙 on 2015/9/15.
 * @description 作业明细之整个作业查看
 */
import $ from 'jquery';
import controllers from './../index';

controllers.controller('workDetailForShowCtrl',
    function ($log, $scope, $state, workStatisticsServices, finalData, paperService, $ionicHistory,$ionicPopup,$rootScope) {
        "ngInject";
        $scope.wData = workStatisticsServices.wData;
        $scope.data = paperService.data;
        if ($state.params.workId && $state.params.workInstanceId) {//有参数情况
            paperService.clearData();//先清空共享数据
            var param = {
                id: $state.params.workId,
                paperInstanceId: $state.params.workInstanceId,
                sId: $scope.wData.currentWork.sId
            };
            paperService.getPaperById(param, false).then(function (data) {
                if(!data){
                    $ionicPopup.alert({
                        title: '信息提示',
                        template: ' <p>作业已经被老师回收或删除.</p>',
                        okText:'确定'
                    }).then(function(){
                        $state.go('home.work_list');
                    });
                }
            });//获取试卷信息
        }

        /**
         * 返回
         */
        $scope.back = function () {
            $ionicHistory.goBack(-1);//返回到列表展示
        };


        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);

    });

