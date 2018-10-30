/**
 * Author 邓小龙 on 2015/9/2.
 * @description 批改某个试题 controller
 */
import  controllers from './../index'
controllers.controller('workCorrectCtrl',
    function ($scope, $log, $state, $ionicModal,commonService, dateUtil, workStatisticsServices, $ionicHistory,$timeout) {
        'ngInject';

        if (!$state.params.bigQId || !$state.params.smallQId||!$state.params.bigQSeq) {
            $log.error("没有传入参数!");
            return;
        }
        $scope.bigQSeq =commonService.convertToChinese(parseInt($state.params.bigQSeq)+1) ;//大题序号
        $scope.smQSeq = parseInt($state.params.smQSeq);//小题序号
        $scope.data = workStatisticsServices.data;//共享的数据
        $scope.correctData={};
        $scope.bigQ=$scope.data.paper.bigQList[$state.params.bigQSeq];
        $scope.smallQ=$scope.data.paper.bigQList[$state.params.bigQSeq].qsList[$state.params.smQSeq];
        var  param={
            paperId:$scope.data.paper.paperId,
            questionGroupId:$state.params.bigQId,
            questionId:$state.params.smallQId
        };
        $scope.correctData.showCorrectFlag=false;
        $scope.data.referAnswers={};
        workStatisticsServices.getQReferAnswer(param).then(function(data){
            if(data){
                $timeout(function () {//让ng-if重新判断，生效
                    $scope.correctData.showCorrectFlag = true;
                });
            }
        });

        /**
         * 返回作业明细
         */
        $scope.back = function () {
            $scope.data.goCorrectQFlag=true;
            $state.go("work_detail");
        };

    }
);
