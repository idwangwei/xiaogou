/**
 * Author 邓小龙 on 2015/9/15.
 * @description 作业明细之整个作业查看
 */


import $ from 'jquery';
import controllers from './../index';
controllers.controller('workDetailForStatCtrl',
    function ($log, $state, $scope, $ionicScrollDelegate, $location, $ionicLoading, $timeout, $rootScope, commonService,
              workStatisticsServices, finalData, paperService, $ionicHistory,$ionicPopup) {
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
            paperService.getPaperById(param, true).then(function(){
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
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
        $timeout(function () {
            $ionicLoading.hide();
            /* _.each($scope.data.paper.bigQList,function(bigQ){
             _.each(bigQ.qsList,function(smallQ){
             _.each(smallQ.smallQStuAnsMapList, function (doneInfo) {
             doneInfo.showQFlag=true;
             });
             });
             });*/
        }, 1500);


        /**
         * 查看试题
         */
        $scope.viewQ = function (smallQ, doneIndex, bigQIndex) {
            //跳转前先设置打开试题
            $scope.data.paper.bigQList[bigQIndex].qsList[smallQ.seqNum - 1].smallQStuAnsMapList[doneIndex].showQFlag = true;
            //_.each($scope.data.paper.bigQList,function(bigQ){
            //    _.each(bigQ.qsList,function(smallQ){
            //        _.each(smallQ.smallQStuAnsMapList, function (doneInfo) {
            //            doneInfo.showQFlag=true;
            //        });
            //    });
            //});
            $location.hash(smallQ.id + doneIndex + '|paper');
            $ionicScrollDelegate.anchorScroll(true);
        };

        /**
         * 到顶部
         */
        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop(true);
        };

        /**
         * 显示/隐藏滚动到顶部的按钮
         */
        $scope.getScrollPosition = function () {
            $scope.moveData = $ionicScrollDelegate.getScrollPosition().top;
            if ($scope.moveData >= 250) {
                $('.scrollToTop').fadeIn();
            } else if ($scope.moveData < 250) {
                $('.scrollToTop').fadeOut();
            }
        };

        /**
         * 显示或隐藏试题试题
         */
        $scope.showQ = function (doneInfo, event) {
            doneInfo.showQFlag = !doneInfo.showQFlag;
            event.stopPropagation();
        };

        /**
         * 返回
         */
        $scope.back = function () {
            $state.go("home.work_list");
        };

        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);

    });
