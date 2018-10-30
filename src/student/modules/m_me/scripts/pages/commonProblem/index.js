/**
 * Created by ZL on 2017/7/20.
 */
import {Inject, View, Directive, select} from '../../module';
@View('common-problem', {
    url: '/common-problem',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ["$scope", "$rootScope", "$state", "$timeout", "$ngRedux", "commonService", "$ionicActionSheet"]
})
class CommonProblem{
    $rootScope;
    commonService;
    $ionicActionSheet;
    $ngRedux;
    $state;
    weChatIcon;
    friendCircle;
    shareImg;
    constructor(){
        this.initData();
    }

    initData(){
        this.weChatIcon = this.getRootScope().loadImg('wechat.ico');
        this.friendCircle = this.getRootScope().loadImg('friend-circle.png');
        this.shareImg = this.getRootScope().loadImg('officialAccounts/official_accounts_share_img.png');
    }

    onAfterEnterView(){
    }

    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    }

    shareOfficialAccounts() {
        let image = new Image();
        image.src = this.shareImg;
        let me = this;
        image.onload = ()=> {
            var dataURL = me.getBase64Image(image);
            this.shareDeal(dataURL);
        }
    }

    shareDeal(base64Img) {
        let userName = this.$ngRedux.getState().profile_user_auth.user.name;
        let teacherName = userName + "：";
        let shareContent = `我在“智算365”里获得了超多名校资讯和智算365福利，小伙伴们快来加入啊！`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="reward-share-btn weChat-share-img" src="${this.weChatIcon}">分享到微信`},
                {text: `<img class="reward-share-btn friend-circle-share-img" src="${this.friendCircle}">分享到朋友圈`},
            ],
            titleText: `<div>
                    <div class="reward-share-btn share-title" >${teacherName}</div>
                        <div class="reward-share-btn share-content" >${shareContent}</div>                   
                    </div>`,
            cancelText: '取消',
            buttonClicked: (index) => {
                if (index == 2) {
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        teacherName,
                        'http://xuexiv.com/img/icon.png',
                        $scope.shareUrl,
                        () => {
                            this.commonService.showAlert("提示", "分享信息发送成功！");
                        }, (err) => {
                            this.commonService.showAlert("提示", err);
                        });
                }
                if (index == 0) {//点击分享到微信
                    if (!this.getRootScope().weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                        message: {
                            title: teacherName,
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.IMAGE,
                                image: base64Img,
                            }
                        },
                    }, () => {
                        this.commonService.showAlert("提示", "分享信息发送成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }

                if (index == 1) {//点击分享到微信朋友圈
                    if (!this.getRootScope().weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                        message: {
                            title: teacherName,
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.IMAGE,
                                image: base64Img,
                            }
                        },
                    }, () => {
                        this.commonService.showAlert("提示", "分享信息发送成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }
                return true;
            }
        });
    }

    isMobile() {
        return this.getRootScope().platform.isMobile() && this.getRootScope().weChatPluginInstalled;
    }
    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }
    mapStateToThis(state) {
        return {
        }
    }
    mapActionToThis(){
        return {
        }
    }

    back() {
        this.go('home.me');
    }

}