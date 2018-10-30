/**
 * Created by qiyuexi on 2018/2/2.
 */


import weChatIcon  from './../../../../m_global/sImages/wechat.ico';
import friendCircle  from './../../../../m_global/sImages/friend-circle.png';
import qrCode  from './../../../../m_global/sImages/qrcode/officalSiteQrcode.png';
import {Inject, View, Directive, select} from '../../module';


@View('bargain_index', {
    url: 'bargain_index/:id/:oldTotal/:title/:maxDis',
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
        "commonService",
        "finalData",
        "$ionicActionSheet",
        "bargainService"
    ]
})

class bargainIndexCtrl {
    $ionicHistory
    $ionicLoading
    @select(state=>state.profile_user_auth.user.name) userName;

    onBeforeLeaveView() {
        /*this.finalSprintService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.finalSprintService.cancelRequestList.length = 0;*/
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
        // this.resetKnowledgeInfo = [];//重组后的考点返回数据
        this.weChatIcon = weChatIcon;
        this.friendCircle = friendCircle;
        this.qrCode = qrCode;
    }

    /*初始化页面*/
    initData() {
        this.params=this.getStateService().params;
        this.taskInfo={};//任务的信息
    }

    initFn() {

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
                this.createBargain().then((data1)=>{
                    let url="http://www.xuexiv.com/bargain/index.html#/home?id="+data1.id+"&name="+encodeURIComponent(this.userName)
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
                })
                return true;
            }
        });
    }
    createBargain(){
        let obj={
            goodsId:this.params.id,
            goodsName:this.params.title,
            oldTotal:this.params.oldTotal
        };

        return this.bargainService.createBargainTask(obj)
    }
}

export default bargainIndexCtrl