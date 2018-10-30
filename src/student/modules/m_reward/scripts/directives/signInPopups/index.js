/**
 * Created by Administrator on 2017/5/16.
 */
import './style.less';
import template from './page.html';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: template,
        controller: ['$scope', '$rootScope', 'commonService', 'homeInfoService','$timeout','$ngRedux',function($scope, $rootScope, commonService, homeInfoService,$timeout,$ngRedux){
            const me = this;
            this.getCapacity = 0;
            this.signItemArr = [
                {signIn:false,canSignIn:false,title:"第一天",text:"能量+",imgUrl:"signIn/sign_credits1.png",signInImg:"signIn/sign_get.png"},
                {signIn:false,canSignIn:false,title:"第二天",text:"能量+",imgUrl:"signIn/sign_credits1.png",signInImg:"signIn/sign_get.png"},
                {signIn:false,canSignIn:false,title:"第三天",text:"能量+",imgUrl:"signIn/sign_credits2.png",signInImg:"signIn/sign_get.png"},
                {signIn:false,canSignIn:false,title:"第四天",text:"能量+",imgUrl:"signIn/sign_credits3.png",signInImg:"signIn/sign_get.png"},
                {signIn:false,canSignIn:false,title:"第五天",text:"能量+",imgUrl:"signIn/sign_credits4.png",signInImg:"signIn/sign_get.png"},
                {signIn:false,canSignIn:false,title:"第六天",text:"能量+",imgUrl:"signIn/sign_credits5.png",signInImg:"signIn/sign_get.png"},
                {signIn:false,canSignIn:false,title:"第七天",text:"能量+",imgUrl:"signIn/sign_credits6.png",signInImg:"signIn/sign_get.png"}
            ];
            this.checkSignInFlag = ()=>{
                homeInfoService.getSignInInfo($ngRedux.dispatch,$ngRedux.getState).then((data)=>{
                    if(data && data.sign){
                        for(let k in data.sign.credits){
                            if(data.sign.credits.hasOwnProperty(k)){
                                me.signItemArr[k-1].text += data.sign.credits[k];
                                if(k-1 == data.sign.signed)me.getCapacity = data.sign.credits[k];
                            }
                        }

                        me.signItemArr.forEach((item,index)=>{
                            if(index<data.sign.signed){
                                item.signIn = true;
                            }
                        });
                        if(data.sign.canSignIn && !$rootScope.hasShowSignInPopup){
                            me.signItemArr[data.sign.signed].canSignIn = true;
                            $scope.alertPopupFlag = true;
                            $rootScope.hasShowSignInPopup = true;
                        }
                    }

                },()=>{
                    $scope.alertPopupFlag = false;
                });
            };
            this.hidePopup = (e)=>{
                e.preventDefault();
                if($(e.target).hasClass("sign-in-popups-backdrop")){
                    $scope.alertPopupFlag = false;
                }
            };
            this.clickItem = (item)=>{

                if(item.canSignIn){
                    homeInfoService.doneSignIn($ngRedux.dispatch,$ngRedux.getState).then((data)=>{
                        if(data && data.code == 200){
                            item.signIn = true;
                            item.canSignIn = false;
                            $rootScope.showRewardPrompt = true;

                            let timer = $timeout(()=>{
                                $scope.$apply(()=>{
                                    $scope.alertPopupFlag = false;
                                    $rootScope.showRewardPrompt = false;
                                });
                                $timeout.cancel(timer);
                            },1500);
                        }
                    },()=>{
                        commonService.alertDialog('签到失败，稍后再试',1000);
                    })
                }else{
                    commonService.alertDialog(item.signIn?'已签到':'未到领取时间',1000);
                }
            }
        }],
        link: function ($scope, $element, $attrs, ctrl) {
            $scope.ctrl = ctrl;

            ctrl.checkSignInFlag();


        }
    };
}