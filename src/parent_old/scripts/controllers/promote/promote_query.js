/**
 * Created by WangLu on 2017/1/16.
 */
import  controllers from './../index';

controllers.controller('promoteQueryCtrl', ['$scope','$rootScope', '$state', '$log', 'commonService', 'promoteService','$ionicPopup',
    function ($scope, $rootScope,$state, $log, commonService,promoteService,$ionicPopup) {

        $scope.user = $rootScope.user;
        $scope.money = 0;
        $scope.firstPromote = {registerCount:0,payCount:0,money:0};
        $scope.secondPromote = {registerCount:0,payCount:0,money:0};
        $scope.queriedPersonId = "";
        $scope.retFlag = false;
        $scope.personName = '';

        $scope.queryOtherPersonAssets=function () {
            $scope.retFlag = false;
            if(!$scope.checkUserName()) return;
            promoteService.queryPersonDetails($scope.queriedPersonId).then(data=>{
                $scope.initPersonDetails();
                if(data.code != 200){
                    commonService.alertDialog(data.msg || "网络连接不畅，请稍后重试...",2000);
                    return;
                }

                $scope.money = data.totalProfit;
                $scope.firstPromote.registerCount = data.directReg;
                $scope.firstPromote.payCount = data.directPay;
                $scope.firstPromote.money = data.directProfit;
                $scope.secondPromote.registerCount = data.indirectReg;
                $scope.secondPromote.payCount = data.indirectPay;
                $scope.secondPromote.money = data.indirectProfit;
                $scope.retFlag = true;
            })
        };

        $scope.queryAccountChange = function () {
            $scope.retFlag = false;
        };

        $scope.checkUserName = function () {
            $scope.queriedPersonId = $("#personId").val();
            var userName = $scope.queriedPersonId;
            if (!userName)return false;
            if (!userName.match(/^1\d{10}(P|G|T)\d*$/gi)) {
                warning();
                return false;
            } else {
                return true;
            }

            function warning() {
                $ionicPopup.alert({
                    title: '账号格式不正确',
                    template: '<p>家长账号应是如下形式：</p>'
                    + '<p>1.手机号+P<br/>或<br/>' +
                    '2.手机号+P+数字<br/>或' +
                    '<br/>3.手机号+G<br/>或' +
                    '<br/>4.手机号+G+数字</p>' +
                    '<br/>5.手机号+T<br/>或' +
                    '<br/>6.手机号+T+数字</p>' +
                    '<p style="color:#6B94D6 ">例如：13812345678P</p>',
                    okText: '确定'
                });
            }
        };

        $scope.initPersonDetails =function () {
            $scope.money = 0;
            $scope.firstPromote = {registerCount:0,payCount:0,money:0};
            $scope.secondPromote = {registerCount:0,payCount:0,money:0};
        }

        $scope.back=function () {
            $state.go("promote_agency_home")
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);
