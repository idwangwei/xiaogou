/**
 * Created by ZL on 2017/11/8.
 */
import './style.less';
export default function () {
    return {
        restrict: 'E',
        scope: {
            rewards: '=',
            allAwardFlag: '=',
            refresh: '&'
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', 'commonService', '$ionicPopup', 'creditsStoreService', 'ratoryInfoService',
            function ($scope, $rootScope, $state, commonService, $ionicPopup, creditsStoreService, ratoryInfoService) {
                $scope.rewardList = [];
                $scope.gotReward = 0;
                $scope.showRotaryDraw = false;//是否展示抽奖
                if ($scope.rewards && $scope.rewards.rewardList) {
                    $scope.rewardList = $scope.rewards.rewardList;
                    $scope.gotReward = $scope.rewards.gotReward;
                    $scope.awardId = $scope.rewards.awardId;
                }
                $scope.allReward = [];
                $scope.allRewardIds = [];

                $scope.hideGetRewardDialog = function () {
                    let awardIds = $scope.awardId;//||"3a298e3d-a153-469c-8466-927edc4da5fe"
                    if ($scope.allAwardFlag) awardIds = $scope.allRewardIds.join(',');
                    creditsStoreService.getTaskAward(awardIds).then((data)=> {
                        if (data.code==200) {
                            commonService.alertDialog('领取成功');
                            $scope.refresh();
                            if(data.lottoTimes>0){
                                $scope.showRotaryDraw = true;
                            }else{
                                // $scope.showRotaryDraw = true;
                                $rootScope.getTeacherRewardFlag = false;
                            }
                            /*ratoryInfoService.fetchRatoryList({})
                                .then((data)=> {
                                    if (data.lottoCount > 0) {

                                    } else {

                                    }
                                }).catch((err)=> {
                                $rootScope.getTeacherRewardFlag = false;
                            })*/
                        } else if(data.code==3002){
                            commonService.alertDialog('已经领取过了!')
                            $rootScope.getTeacherRewardFlag = false;
                        }else {
                            commonService.alertDialog('领取失败')
                            $rootScope.getTeacherRewardFlag = false;
                        }
                    });
                };
                $scope.leaveRotaryDraw = function () {
                    $scope.showRotaryDraw = false;
                    $rootScope.getTeacherRewardFlag = false;
                }

                // if ($scope.allAwardFlag) {
                //     creditsStoreService.getAwardList().then((data)=> {
                //         if (data) {
                //             $scope.allReward = data.result;
                //             $scope.gotReward = 0;
                //             $scope.rewardList = [];
                //             angular.forEach($scope.allReward, (v, k)=> {
                //                 $scope.gotReward += Number($scope.allReward[k].credits);
                //                 $scope.rewardList.push($scope.allReward[k].detail);
                //                 $scope.allRewardIds.push($scope.allReward[k].id);
                //             });
                //             if ($scope.allReward && $scope.allReward.length > 0)
                //                 $rootScope.getTeacherRewardFlag = true;
                //         }
                //     });
                // }
                $scope.getAwardList=()=>{
                    creditsStoreService.getAwardList().then((data)=> {
                        if (data) {
                            $scope.allReward = data.result;
                            $scope.gotReward = 0;
                            $scope.rewardList = [];
                            angular.forEach($scope.allReward, (v, k)=> {
                                $scope.gotReward += Number($scope.allReward[k].credits);
                                $scope.rewardList.push($scope.allReward[k].detail);
                                $scope.allRewardIds.push($scope.allReward[k].id);
                            });
                            if ($scope.allReward && $scope.allReward.length > 0)
                                $rootScope.getTeacherRewardFlag = true;
                        }
                    });

                }
                $scope.rewardFirst=$scope.rewardList[0];
                $scope.afterLeave=function () {
                    $rootScope.getTeacherRewardFlag = false;
                }
                //调试转盘用 漆跃希
                /*ratoryInfoService.fetchRatoryList({})
                 .then((data)=>{
                 if(data.lottoCount>0){
                 $scope.showRotaryDraw=true;
                 }
                 })*/
            }],
        link: function ($scope, $element, $attrs,ctrl) {
            $scope.$on('allAwardFlag',$scope.getAwardList)
        }
    };
}