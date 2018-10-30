/**
 * Author 邓小龙 on 2015/11/5.
 * @description 家长确认表扬
 */

import  _  from 'underscore';
import  controllers from './../index';

controllers.controller('workPraiseCtrl',
    function ($log, $scope, $state, $ionicModal,$rootScope,$ionicNavBarDelegate, commonService, workStatisticsServices, $ionicHistory) {
        'ngInject';

        $scope.wData = workStatisticsServices.wData;

        $scope.wData.selectedPraise = "常用评价语！";
        workStatisticsServices.praiseInit();

        /**
         * 确认评价
         */
        $scope.comfirmPraise = function () {
            var content = "";

            var encourage = [];
            _.each($scope.wData.praiseTypeList, function (praise) {
                if (praise.selected) {
                    content += praise.msg;
                    encourage.push(praise.type);
                }
            });
            var parentPraise=document.getElementById("parentPraise").value||"";
            content=parentPraise==""?content:parentPraise;
            if(content!=""){
                encourage.push(10);
            }
            /*if (content == "") {
                commonService.alertDialog("请选择一个评价!", 1500);
                return;
            }*/
            var stuId = $scope.wData.queryParams.sId;
            workStatisticsServices.pConfirmA(stuId, content, encourage);
        };

        /**
         * 选择表扬类型
         * @param praiseType
         */
        $scope.selectPraiseType = function (praiseType) {

            if (praiseType.selected) {
                _.each($scope.wData.praiseTypeList, function (praiseType) {
                    praiseType.selected = false;
                });
            } else {
                _.each($scope.wData.praiseTypeList, function (praiseType) {
                    praiseType.selected = false;
                });
                praiseType.selected = true;
            }
        };

        /**
         * @description 初始化表扬语modal页
         */
        $ionicModal.fromTemplateUrl('selectPraise.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.praiseModal = modal;
            $rootScope.modal.push(modal);
        });

        /**
         * @description 打开表扬语modal
         *
         */
        $scope.openPraiseModal = function () {
            $scope.praiseModal.show();
        };

        /**
         * @description 关闭表扬语modal
         */
        $scope.closePraiseModal = function () {
            $scope.praiseModal.hide();
        };

        /**
         * 选择表扬语
         * @param rec 所选择的表扬语
         */
        $scope.selectedPraise = function (rec) {
            //$scope.data.currentStu.selectedPraise = rec.value;
            var parentPraise = document.getElementById("parentPraise");
            parentPraise.value = parentPraise.value + rec.value;
            $scope.praiseModal.hide();
        };

        /**
         * 返回
         */
        $scope.back = function () {
            $state.go("home.work_list");
        };
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
        $scope.handleClick= function(praiseType){
            $scope.wData.praiseTypeList.forEach(function(item){
                if(item != praiseType){
                    item.selected=false;
                }
            });
        };
    });
