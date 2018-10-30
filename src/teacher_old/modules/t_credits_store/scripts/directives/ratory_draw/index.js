/**
 * Created by qiyuexi on 2017/11/8.
 */
import './style.less';
import {initRotate} from  './tools/jquery-rotate'
import {drawWheelCanvas,getAwardInfo} from './tools/draw'
export default function () {
    return {
        restrict: 'AE',
        scope: {
            text:"=",
            afterLeave:"&"
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope','ratoryInfoService','$ionicLoading','$ngRedux', ($scope, $rootScope,ratoryInfoService,$ionicLoading,$ngRedux) => {
            /*定义变量*/
            var canvasObj={},
                mockObj={
                    goods:[],//奖品列表text img id
                    outsideRadius:0,//大转盘外圆的半径
                    textRadius:0,//大转盘文字位置距离圆心的距离
                    insideRadius:20,//大转盘内圆的半径
                    startAngle:0,//渲染开始角度
                    bRotate:false//false:停止;ture:旋转
                };
            $scope.isFinish=true;
            $scope.isFirst=true;
            !$scope.text&&($scope.text="邀请老师成功")
            $scope.num=0;
            $scope.rewardType=1;//1代表智算365币,2代表奖品,3代表谢谢参与
            $scope.showRewardInfo=false;//显示中奖信息

            $scope.runDraw=function () {
                if(!$scope.isFinish) return;
                if($scope.num<=0) {
                    $ionicLoading.show({
                        template: '不好意思,抽奖次数已经用完啦~',
                        duration: 2000
                    });
                    return ;
                };
                if($scope.showRewardInfo){
                    $ionicLoading.show({
                        template: '请您先确认中奖信息后再次抽奖!',
                        duration: 2000
                    });
                    return ;
                }
                if(!$scope.isFirst){
                    canvasObj.reDraw();
                }
                $scope.isFinish=false;
                var AAA=initRotate(window.jQuery);
                var $btn=AAA("#wheelBox");
                $btn.rotate({
                    angle:0,
                    duration: 5000,
                    animateTo: 360*6,
                    easing: AAA.easing.easeInOutExpo,
                    callback:function(){
                        $scope.isFinish=true;
                        $ionicLoading.show({
                            template: '服务器异常',
                            duration: 2000
                        });
                    }
                });
                ratoryInfoService.fetchRatoryInfo({})
                    .then((data)=>{
                        let realAngle=0,awardInfo={};
                        if(data){
                            awardInfo=getAwardInfo(data.id,mockObj.goods);//获取中奖的角度
                            realAngle=360*5+awardInfo.angle
                        }else{
                            realAngle=360*5
                        }

                        $scope.num--;//成功后减一次
                        $btn.stopRotate();
                        $btn.rotate({
                            angle:0,
                            duration: 5000,
                            animateTo: realAngle,
                            easing: AAA.easing.easeInOutExpo,
                            callback:function(){
                                $scope.isFinish=true;
                                if(realAngle==360*5){
                                    $ionicLoading.show({
                                        template: '服务器异常',
                                        duration: 2000
                                    });
                                    return;
                                }
                                $scope.$apply(function () {
                                    $scope.isFirst=false;
                                    $scope.text=awardInfo.good.text;
                                    $scope.showRewardInfo=true;
                                    canvasObj.drawOne(awardInfo.index,true);
                                    if(awardInfo.good.text.indexOf("币")!=-1){
                                        $scope.rewardType=1
                                    }else if(awardInfo.good.text.indexOf("谢谢参与")!=-1){
                                        $scope.rewardType=3
                                    }else{
                                        $scope.rewardType=2
                                    }
                                });
                            }
                        });
                    })
            }
            /*初始化数据*/
            function init() {
                // var data=$ngRedux.getState().teacher_ratory_info;
                ratoryInfoService.fetchRatoryList({}).then((data)=>{
                    $scope.num=data.lottoCount;//获取当前抽奖次数
                    data.lottoItemList.map((x)=>{
                        x.text=x.name;
                        x.img=x.imgUrl;
                        delete x.name;
                        delete x.imgUrl;
                        return x;
                    })
                    //获取奖品信息放到goods里面
                    mockObj.goods=data.lottoItemList;
                    canvasObj=new drawWheelCanvas(mockObj);
                })
            }
            init();
        }],
        link: function ($scope, $elem, $attrs, ctrl) {

        }
    };
}