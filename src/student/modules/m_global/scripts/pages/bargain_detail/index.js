/**
 * Created by qiyuexi on 2018/2/2.
 */
import {Inject, View, Directive, select} from '../../module';
import weChatIcon  from './../../../../m_global/sImages/wechat.ico';
import friendCircle  from './../../../../m_global/sImages/friend-circle.png';
import qrCode  from './../../../../m_global/sImages/qrcode/officalSiteQrcode.png';

@View('bargain_detail', {
    url: 'bargain_detail/:id/:goodsId/:oldTotal/:title/:payUrl/:maxDis',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: [
        '$scope',
        '$state',
        '$ngRedux',
        '$stateParams',
        '$ionicHistory',
        '$rootScope',
        "$ionicLoading",
        "bargainService",
        "commonService",
        "finalData",
        "$ionicActionSheet",
        "$ionicScrollDelegate",
    ]
})

class bargainIndexCtrl {
    $ionicHistory
    $ionicLoading
    bargainService
    $ionicScrollDelegate
    @select(state=>state.bargain_detail) allBargainDetail;
    @select(state=>state.profile_user_auth.user.name) userName;

    onBeforeLeaveView() {
        this.bargainService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.bargainService.cancelRequestList.length = 0;
        clearInterval(this.timer);
    }

    onAfterEnterView() {
        this.initData();
        this.initFn();
    }

    back() {
        // this.go("final_sprint_home");
        this.$ionicHistory.goBack();
    }

    constructor() {
        this.resetBargainDetail = {};//重组后的砍价详情
        this.resetBargainList=[];// 邀请列表
        this.weChatIcon = weChatIcon;
        this.friendCircle = friendCircle;
        this.qrCode = qrCode;
        this.timer={};//倒计时对象
    }

    /*初始化页面*/
    initData() {
        this.params=this.getStateService().params;
        this.loadCount=1;
        this.isLoadFinish=false;
        this.countDownTxt="00:00:00";
        this.starArr=[1];
        this.starText="深藏不露";
    }

    initFn() {
        this.fetchBargainDetail().then(()=>{
            this.resetBargain();
            this.setCountDown();
            this.setPopular();
        })
    }
    fetchBargainDetail(){
        return this.bargainService.fetchBargainDetail({
            bargainId:this.params.id
        })
    }
    resetBargain() {
        this.allBargainDetail.result.sort((a,b)=>{
            return b.totalDiscount-a.totalDiscount
        })
        this.resetBargainDetail = this.allBargainDetail;
        if(this.resetBargainDetail.totalMoney/100-this.params.maxDis>0){
            this.resetBargainDetail.totalMoney=(this.params.maxDis-0)*100;
        }
        this.resetBargainDetail.newTotal=this.resetBargainDetail.oldTotal-this.resetBargainDetail.totalMoney;
        this.resetBargainList = this.resetBargainDetail.result.slice(0, 5);
        if(this.allBargainDetail.result.length<=5){
            this.isLoadFinish=true;
        }
    }
    setCountDown(){
        let start=this.resetBargainDetail.startTime.replace(/-/g,"/");
        let end=this.resetBargainDetail.systemTime.replace(/-/g,"/");
        let dis=new Date(end).getTime()-new Date(start).getTime();
        if(dis>=24*60*60*1000){
            this.resetBargainDetail.status=1;
            return ;
        }
        this.countDown(dis);
        this.timer=setInterval(()=>{
            dis=dis+1000;
            this.countDown(dis);
            if(dis>24*24*60*60*1000){
                this.resetBargainDetail.status=1;
                clearInterval(this.timer);
            }
            this.getScope().$digest();
        },1000)
    }
    countDown(dis){
        dis=24*60*60*1000-dis;
        let h=Math.floor(dis/(60*60*1000));
        let m=Math.floor(dis%(60*60*1000)/(60*1000));
        let s=Math.floor(dis%(60*1000)/1000);
        if(h<10) h="0"+h;
        if(m<10) m="0"+m;
        if(s<10) s="0"+s;
        this.countDownTxt=`${h}:${m}:${s}`;
    }
    setPopular(){
        let val=this.resetBargainDetail.totalInvitors;
        if(val>=40){
            this.starText="万众瞩目"
            this.starArr.length=5
        }else if(val>=30){
            this.starText="一呼百应"
            this.starArr.length=4
        }else if(val>=20){
            this.starText="人品爆表"
            this.starArr.length=3
        }else if(val>=5){
            this.starText="初露锋芒"
            this.starArr.length=2
        }else{
            this.starText="深藏不露"
            this.starArr.length=1
        }
    }
    loadMore(){
        this.loadCount++;
        this.resetBargainList = this.resetBargainDetail.result.slice(0, 5*this.loadCount);
        if(this.loadCount*5>=this.resetBargainDetail.result.length){
            this.isLoadFinish=true;
        }
        setTimeout(()=>{
            this.$ionicScrollDelegate.$getByHandle('bargain_detail').resize();
        },100)
    }
    goToPay(){
        this.go(this.params.payUrl,{cut:this.resetBargainDetail.totalMoney/100});
    }
    /**
     * 分享
     */
    showShare() {
        let shareTitle = `老铁们快来帮忙砍价啦！`;
        let shareContent = `《智算365》对我孩子的学习很有帮助，请朋友们助力，动动手指，立减现金！`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="weChat-share-img" src="${this.weChatIcon}">分享到微信`},
                {text: `<img class="friend-circle-share-img" src="${this.friendCircle}">分享到朋友圈`},
            ],
            titleText: `<div style="text-align: center">
                    <div class="share-title">分享砍价：</div>
                        <div class="share-content">${shareContent}</div>
                    </div>`,
            cancelText: '取消',
            buttonClicked: (index) => {
                let url="http://www.xuexiv.com/bargain/index.html#/home?id="+this.params.id+"&name="+encodeURIComponent(this.userName)
                let fn=()=>{
                    if (index == 0) {//点击分享到微信
                        if (!this.getScope().$root.weChatInstalled) {
                            this.commonService.showAlert("提示", "没有安装微信！");
                            return;
                        }
                        Wechat.share({
                            scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                            message: {
                                title: shareTitle,
                                description: shareContent,
                                thumb: "http://xuexiv.com/img/icon.png",
                                mediaTagName: "TEST-TAG-001",
                                messageExt: "这是第三方带的测试字段",
                                messageAction: "<action>dotalist</action>",
                                media: {
                                    type: Wechat.Type.WEBPAGE,
                                    webpageUrl: url
                                }
                            },
                        }, () => {
                            this.commonService.showAlert("提示", "邀请信息发送成功！");
                        }, (reason) => {
                            this.commonService.showAlert("提示", reason);
                        });
                    }
                    if (index == 1) {//点击分享到微信
                        if (!this.getScope().$root.weChatInstalled) {
                            this.commonService.showAlert("提示", "没有安装微信！");
                            return;
                        }
                        Wechat.share({
                            scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                            message: {
                                title: shareTitle,
                                description: shareContent,
                                text: shareContent,
                                thumb: "http://xuexiv.com/img/icon.png",
                                mediaTagName: "TEST-TAG-001",
                                messageExt: "这是第三方带的测试字段",
                                messageAction: "<action>dotalist</action>",
                                media: {
                                    type: Wechat.Type.LINK,
                                    webpageUrl: url
                                }
                            },
                        }, () => {
                            this.commonService.showAlert("提示", "邀请信息发送成功！");
                        }, (reason) => {
                            this.commonService.showAlert("提示", reason);
                        });
                    }
                }
                if(this.resetBargainDetail.status==1){
                    this.createBargain().then((data1)=>{
                        url="http://www.xuexiv.com/bargain/index.html#/home?id="+data1.id+"&name="+encodeURIComponent(this.userName)
                        fn()
                    })
                }else{
                    fn();
                }
                return true;
            }
        });
    }
    createBargain(){
        let obj={
            goodsId:this.params.goodsId,
            goodsName:this.params.title,
            oldTotal:this.params.oldTotal
        };

        return this.bargainService.createBargainTask(obj)
    }
}

export default bargainIndexCtrl