/**
 * Created by WangLu on 2017/1/11.
 */
import  controllers from './../index';

controllers.controller('promoteAssetsCtrl', ['$scope','$rootScope', '$state', '$log', 'commonService', 'promoteService',
    function ($scope, $rootScope,$state, $log, commonService,promoteService) {

        $scope.user = $rootScope.user;
        $scope.money = 0;
        promoteService.personDirectPagePosition = 0;

        $scope.firstPromote = {registerCount:0,payCount:0,money:0};
        $scope.secondPromote = {registerCount:0,payCount:0,money:0};

        $scope.getPromoteAsset=function (uId) {
            promoteService.getPromoteDetails(uId).then(data=>{
                if(data.code != 200){
                    commonService.alertDialog(data.msg || "网络连接不畅，请稍后重试...");
                    return;
                }

                $scope.money = data.totalProfit;
                $scope.firstPromote.registerCount = data.directReg;
                $scope.firstPromote.payCount = data.directPay;
                $scope.firstPromote.money = data.directProfit;
                $scope.secondPromote.registerCount = data.indirectReg;
                $scope.secondPromote.payCount = data.indirectPay;
                $scope.secondPromote.money = data.indirectProfit;
            })
        };

        $scope.clickWithdrawCashBtn = function () {
            let messageStr;
            if($scope.money<200){
                messageStr = '首次满200才可提现'
            }else{
                messageStr = '请拨打电话028-86956907，进行人工提现。'
            }
            commonService.showAlert(
                '提示信息',
                `<p style="text-align: center">${messageStr}</p>`
            );
        };

        $scope.getPromoteAsset($scope.user.userId);

        $scope.back=function () {
            $state.go("promote_agency_home")
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);
