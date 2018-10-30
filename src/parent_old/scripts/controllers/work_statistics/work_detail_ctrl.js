/**
 * Author 邓小龙 on 2015/9/15.
 * @description 作业明细
 */
import $ from 'jquery';
import controllers from './../index';

controllers.controller('workDetailCtrl',
    function ($rootScope,$log, $scope, $state,$ionicScrollDelegate, workStatisticsServices, finalData, paperService, $ionicHistory,$ionicPopup,commonService) {
        "ngInject";
        $scope.showSummerWorkFlag=false;
        $scope.wData = workStatisticsServices.wData;
        $scope.data = paperService.data;
        $scope.getRankRetFlag=false;
        $scope.rankList=workStatisticsServices.rankList;
        $scope.workStatus= $state.params.workStatus||1;
        $scope.printTypeList = [{code: 1, name: '重新做题'}, {code: 2, name: '保持现状'}];
        if($scope.workStatus==2){
            $ionicPopup.alert({
                title: '信息提示',
                template: ' <p>您的孩子正在做作业，请稍后查看。</p>',
                okText:'确定'
            }).then(function(){
                $state.go('home.work_list');
            });
        }
        if ($state.params.workId && $state.params.workInstanceId) {//有参数情况
            paperService.clearData();//先清空共享数据
            var param = {
                id: $state.params.workId,
                paperInstanceId: $state.params.workInstanceId,
                sId: $scope.wData.currentWork.sId
            };
            paperService.getPaperById(param, $scope.workStatus,$scope.wData.currentWork.publishType).then(function (data) {
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

        var key1=$rootScope.user.userId+"workDetail1";
        $scope.alertTipInfo={
            workDetail:commonService.getLocalStorage(key1)
        };
        $scope.noTip={
            status:false
        };
        $scope.showTip =function(){
            if(!$scope.alertTipInfo.workDetail){
                $ionicPopup.alert({
                    title: '温馨提示',
                    template: '<p style="font-size:16px">家长端只能查看学生作业情况，不能做作业。只有切换到学生端才能做作业。</p> '+
                    '  <ion-checkbox ng-click="checkNoTip()"  style="border:none;background:none;font-size:14px">'+
                    '不再提示</ion-checkbox>',
                    scope:$scope,
                    okText:'确定'
                }).then(function(){
                    if( $scope.noTip.status)
                        commonService.setLocalStorage(key1,true)
                });
            }

        };


        var key2=$rootScope.user.userId+"workDetail2";
        $scope.alertTipInfo2={
            workDetail2:commonService.getLocalStorage(key2)
        };
        $scope.noTip2={
            status:false
        };
        $scope.showTip2 =function(){
            // if(!$scope.alertTipInfo2.workDetail2){
            //     var androidOrIosStr='<p style="font-size:16px" >极少的情况下，若APP出问题，' +
            //         '可先试试清理内存，再重启APP：</p> ';
            //     var computerStr='<p style="font-size:16px" >极少的情况下，若APP出问题，' +
            //         '可先试试关掉APP窗口，再重启APP。</p> '
            //     var sysType=commonService.judgeSYS();
            //     var sysTipStr="";
            //     switch (sysType){
            //         case 1:
            //             sysTipStr='<p style="font-size:16px">安卓系统有多种方式清除:</p>'+
            //                 '<p style="font-size:16px"><i class="icon ion-record"></i>&nbsp;长按home键，然后用手将智算365滑出屏幕。</p>'+
            //                 '<p style="font-size:16px"><i class="icon ion-record"></i>&nbsp;点击方框或双方框键，将智算365滑出屏幕。</p>'+
            //                 '<p style="font-size:16px"><i class="icon ion-record"></i>&nbsp;其他特有方式。</p>';
            //             sysTipStr=androidOrIosStr+sysTipStr;
            //             break;
            //         case 2:
            //             sysTipStr= '<p style="font-size:16px">苹果手机和平板，双击home键，用手滑动智算365清除。</p>';
            //             sysTipStr=androidOrIosStr+sysTipStr;
            //             break;
            //         case 3:
            //             sysTipStr=computerStr;
            //             break;
            //     }
            //     $ionicPopup.alert({
            //         title: '教你一招',
            //         template: sysTipStr+
            //         '<ion-checkbox ng-click="checkNoTip2()"  style="border:none;background:none;font-size:14px">'+
            //         '不再提示</ion-checkbox>',
            //         scope:$scope,
            //         okText:'我懂了'
            //     }).then(function(){
            //         if( $scope.noTip2.status)
            //             commonService.setLocalStorage(key2,true)
            //     });
            // }


        };
        if($scope.workStatus<3){
            $scope.showTip();
        }

        if($scope.workStatus>=3){
            $scope.showTip2();
        }

        $scope.checkNoTip=function () {
            $scope.noTip.status=!$scope.noTip.status;
        };

        $scope.checkNoTip2=function () {
            $scope.noTip2.status=!$scope.noTip2.status;
        };



        /**
         * 刷新排名
         */
        $scope.refreshRank=function(isRefresh){
            console.log("已刷新..........");
            var param = {
                id: $state.params.workId,
                paperInstanceId: $state.params.workInstanceId,
                sId: $scope.wData.currentWork.sId
            };
            $scope.rankList.splice(0,$scope.rankList.length);
            workStatisticsServices.getTopRank(param).then(function(data){
                if(data)
                    $scope.getRankRetFlag=true;
                else
                    $scope.getRankRetFlag=false;
                if(isRefresh)
                    $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.refreshRank();

        $scope.pullRefresh=function () {
            $scope.refreshRank(true);
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

        $scope.showAnsTip=function () {
            event.stopPropagation();
            commonService.showAlert('温馨提示','学生必须提交作业之后，家长才能看到答案');
        };

        /**
         * 返回
         */
        $scope.back = function () {
            $state.go(workStatisticsServices.workDetailUrlFrom || "home.work_list");
        };

        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);

        /**
         * 排名提示信息
         */
        $scope.help=function(){
            $ionicPopup.alert({
                title: '排行榜介绍',
                template: '<p>1. 以首次做的成绩为准</p>'
                +'<p>2. 根据学生提交情况实时更新</p>',
                okText:'确定'
            });
        };

        $scope.hideAllQ = function () {

            $.each(this.data.paper.bigQList, function (i1, e1) {
                $.each(e1.qsList, function (i2, e2) {

                    if(e2.smallQStuAnsMapList && e2.smallQStuAnsMapList.length != 0) {
                        $.each(e2.smallQStuAnsMapList, function (i3, e3) {
                            e3.showQFlag = false
                        })
                    }
                });
            });
//            this.scrollTop();
        };

        $scope.print=function () {
            //commonService.print();
            if($scope.workStatus==1){//未开始的作业
                commonService.printForNewPaper();
                return;
            }
            $scope.printType={
                selected:1
            };
            $ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
                template: require('partials/print_setting.html'),
                title: "打印设置",
                scope: $scope,
                buttons: [
                    {
                        text: "<b>确定</b>",
                        type: "button-positive",
                        onTap: function (e) {
                            switch ($scope.printType.selected){
                                case 1:
                                    commonService.printForOldPaper($scope);
                                    break;
                                case 2:
                                    commonService.printForNewPaper();
                                    break;
                                default:

                            }
                          
                        }
                    },
                    {
                        text: "取消",
                        onTap: function (e) {
                            return;
                        }
                    }

                ]
            });
        };

        $scope.goQFeedbackPage = function(questionId){
            workStatisticsServices.workDetailState.lastStateUrl = $state.current.name;
            workStatisticsServices.workDetailState.lastStateParams = $state.params;
            workStatisticsServices.QInfo.questionId = questionId;
            workStatisticsServices.QInfo.paperId = this.data.paper.paperId;
            $state.go('q_feedback');
        }
    });

