/**
 * Created by WangLu on 2017/1/11.
 */
import  controllers from './../index';

controllers.controller('promoteDirectPersonCtrl',  ['$scope','$rootScope', '$state', '$log', 'commonService', 'promoteService','$ionicScrollDelegate',
    function ($scope, $rootScope,$state, $log, commonService,promoteService,$ionicScrollDelegate) {
        $scope.user = $rootScope.user;
        $scope.lastPosition = promoteService.personDirectPagePosition;
        $scope.promotePersonList = [
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一一1',
            //     directExtCount:'145',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一2',
            //     directExtCount:'145',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"333",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一3',
            //     directExtCount:'145',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"33",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一4',
            //     directExtCount:'145',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"33",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一5',
            //     directExtCount:'145',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"33",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一6',
            //     directExtCount:'1',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"33",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一7',
            //     directExtCount:'1',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一8',
            //     directExtCount:'14',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一9',
            //     directExtCount:'15',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一10',
            //     directExtCount:'45',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一11',
            //     directExtCount:'5',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一12',
            //     directExtCount:'5',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一13',
            //     directExtCount:'5',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
            // {
            //     userId:"15208207983S1",
            //     userAccount:"15208207983S1",
            //     userName:'王一14',
            //     directExtCount:'5',
            //     isPay:false,
            //     payMoney:198,
            //     teacherId:"",
            // },
        ];
        $scope.page = {
            curPage:1,
            perSize:10,
            sort   :"desc",
            order  :"createdTime"
        };
        $scope.canLoadMore = true;
        $scope.nameExp = /^[\u4e00-\u9fa5]?/;
        $scope.accountExp = /^(\d{3}).+(\d{4})/;

        $scope.getPersonList=function (uId,page) {
            promoteService.getPromotePersonList(uId,JSON.stringify(page)).then(data=>{
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if(data.code != 200){
                    $scope.canLoadMore = false;
                    commonService.alertDialog(data.msg || "网络连接不畅，请稍后重试...");
                    return;
                }
                if(data.detail.length < $scope.page.perSize){$scope.canLoadMore = false}
                else {$scope.page.curPage++}


                // data.detail.forEach((item)=>{
                    // item.userName = item.userName.replace($scope.nameExp,'*');
                    // item.userAccount = item.userAccount.replace($scope.accountExp,'$1****$2');
                    // if(item.fans){
                        // item.fans.forEach((stu)=>{
                            // stu.userName = stu.userName.replace($scope.nameExp,'*');
                            // stu.userAccount = stu.userAccount.replace($scope.accountExp,'$1****$2');
                        // })
                    // }
                // });
                $scope.promotePersonList = $scope.promotePersonList.concat(data.detail);
                // console.log(data);
            })
        };

        $scope.goToIndirectPage = function (person) {
            // $scope.rememberScrollPosition();
            promoteService.setSelectPerson(person); //保存选择的用户信息
            $state.go("promote_person_indirect");
        };

        $scope.rememberScrollPosition = function () {
            promoteService.personDirectPagePosition = $ionicScrollDelegate.getScrollPosition().top; //记住当前页面的位置
        };

        // $scope.getPersonList($scope.user.userId,$scope.page);

        let me = $scope;
        window.parent.setTimeout(function () {
            $ionicScrollDelegate.scrollBy(0, me.lastPosition );
        },0);

        $scope.loadMore = function(){
            $scope.getPersonList($scope.user.userId,$scope.page);
        }
        $scope.back=function () {
            $state.go("promote_assets")
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);
