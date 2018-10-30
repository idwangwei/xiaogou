/**
 * Created by ZL on 2018/3/7.
 */
import {Inject, View, Directive, select} from '../../module';
import qqIcon from "./../../../../t_boot/tImages/qq.ico";
import weChatIcon from "./../../../../t_boot/tImages/wechat.ico";
import friendCircle from "./../../../../t_boot/tImages/friend-circle.png";
import qrCode from "./../../../../t_boot/tImages/qrcode/officalSiteQrcode.png";

@View('home.me', {
    url: '/me/:inviteFlag',
    cache: false,
    styles: require('./style.less'),
    views: {
        "me": {
            template: require('./page.html'),
        }
    },
    inject: ['$scope'
        , '$rootScope'
        , '$state'
        , '$ionicSideMenuDelegate'
        , '$ionicModal'
        , '$ionicHistory'
        , 'commonService'
        , 'profileService'
        , 'teacherProfileService'
        , '$ionicPopup'
        , '$ngRedux'
        , '$ionicActionSheet'
        , '$timeout'
        , 'finalData'
        , '$ocLazyLoad']
})
class meCtrl {
    $ionicSideMenuDelegate;
    commonService;
    profileService;
    $ionicHistory;
    teacherProfileService;
    $ionicPopup;
    $ionicActionSheet;
    $timeout;
    finalData;
    $ocLazyLoad;
    initCtrl = false;

    @select(state => state.profile_user_auth.user.gender) gender;
    @select(state => state.profile_user_auth.user.manager) isAdmin;
    @select(state => state.profile_user_auth.user.loginName) loginName;
    @select(state => state.profile_user_auth.user.name) name;
    @select(state => state.profile_user_auth.user.name) teacherName;
    @select(state => state.profile_user_auth.user.userId) teacherId;
    @select(state=>state.teacher_credits_detail) currentCredits;
    @select(state => {
        let user = state.profile_user_auth.user;
        return 'http://www.xuexiv.com/inviteV2?recommendUserId=' + user.userId + '&teacherName=' + encodeURI(user.name)
    }) shareUrl;
    @select("clazz_list") clazzList;

    /*shareUrl = "http://www.xuexiv.com/register?invitationCode="+ this.teacherId; //推广链接*/

    /**
     * 加载图片
     * @param imgUrl
     * @returns {Object}
     */
    loadHeadImg() {
        var headImg = "person/teacher-f.png";
        if (this.gender == '1') {
            headImg = "person/teacher-m.png";
        }
        return require('modules/t_boot/tImages/' + headImg);
    };

    /**
     * 跳转到教研圈
     */
    goToTeachingGroup() {
        if (this.isAdmin) { //是教研员
            this.go('teaching_group_list');
        } else { //不是教研员
            this.go('teacher_join_group');
        }
    }

    /**
     * 教你大招
     */
    appHelp() {
        if (window.cordova && window.cordova.InAppBrowser) {
            window.cordova.InAppBrowser.open('http://xuexiv.com/phone_index.html?showCommonQS=true', 'location=yes');
        } else {
            this.$ionicPopup.alert({
                title: '常见问题',
                template: `<p style="color: #377AE6">问：使用中有问题？</p>
                <p style="position: relative">答：1. 点击每个页面右上角的 
                    <img ng-src="{{$root.loadImg('common/help_icon.png')}}" alt="" class="common-help-tip" style="top: -3px;left: 188px;"/> 
                    <span style="margin-left: 27px">。</span>
                </p>
                <p>2. 还可用浏览器打开 <span style="-webkit-user-select:initial;">www.xuexiV.com</span>&nbsp;查看《使用指南》</p>
                `,
                okText: '确定'
            });
        }

    }

    goCommonProblem() {
        this.go('commonProblem');
    }

    showQQHelp() {
        this.$ionicPopup.alert({
            title: '温馨提示',
            template: ` 
                     <p style="text-align: center">遇到问题，请加入QQ群：</p>
                     <p><span style="-webkit-user-select:initial;">139549978</span>
                    (智算365使用指导群)，私信群里的指导老师，帮你解决问题。</p> `,
            okText: '确定'
        });
    }

    toProtectEyePage() {
        if (window.cordova && window.cordova.InAppBrowser) {
            cordova.InAppBrowser.open("http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg", "location=yes")
        } else {
            let alertTemplate = `<p>连续使用电脑15分钟，向窗外看一看可以缓解用眼疲劳哦~</p>`;
            this.commonService.showAlert("温馨提示", alertTemplate, "我知道了");
        }
    }

    /**
     * 退出登录
     */
    logOut() {
        this.commonService.showConfirm('信息提示', '你确定要退出当前账号吗？').then((res) => {
            if (!res) return;
            this.teacherProfileService.logout((success) => {
                if (success) {
                    this.loginOutClearData();
                    this.go('system_login', 'forward');
                    return;
                }
                this.commonService.showConfirm("信息提示", "退出失败，请稍后再试!");
            });
        });
    }

    goToClazzManage() {
        this.go('home.clazz_manage');
    }


    /**
     * 打开邀请
     */
    showInvite() {
        // let shareContent = `${this.teacherName}老师向您推荐智算365，点击下载安装。`;
        let shareContent = `真的不错！智算365能自动批改主客观各种题型！\n 我有更多的时间去研究教学了，你也试试吧，点击注册。`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="weChat-share-img" src="${weChatIcon}">推荐到微信`},
                {text: `<img class="friend-circle-share-img" src="${friendCircle}">推荐到朋友圈`},
                {text: `<img class="qq-share-img" src="${qqIcon}" >推荐到QQ`}
            ],
            titleText: `<div style="text-align: center;">
                    <div class="share-title">智算365邀请：</div>
                        <div class="share-content">${shareContent}</div>
                        <img class="share-qrcode" src="${qrCode}" width="40%">
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
                        '智算365邀请',
                        'http://xuexiv.com/img/icon.png',
                        this.shareUrl,
                        /* 'http://a.app.qq.com/o/simple.jsp?pkgname=com.allere.eclass',*/
                        () => {
                            this.commonService.showAlert("提示", "邀请信息发送成功！");
                        }, (err) => {
                            this.commonService.showAlert("提示", err);
                        });
                }
                if (index == 0) {//点击分享到微信
                    if (!this.getScope().$root.weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                        message: {
                            title: "智算365邀请",
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                /* webpageUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.allere.eclass",*/
                                webpageUrl: this.shareUrl
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
                            title: "智算365邀请",
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.LINK,
                                /* webpageUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.allere.eclass"*/
                                webpageUrl: this.shareUrl
                            }
                        },
                    }, () => {
                        this.commonService.showAlert("提示", "邀请信息发送成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }

                return true;
            }
        });
    }

    isShowIosShare() {
        return this.commonService.judgeAppVersion();
    }

    /**
     * 教师端学生超过20人显示推广协议
     * @returns {boolean}
     */
    isShowPromoteProtocol() {
        let stuCount = 0;
        angular.forEach(this.clazzList, function (clazz) {
            if (clazz.checkedNum) {
                stuCount += clazz.checkedNum;
            }
        });
        return stuCount > 20;
    };

    loginOutClearData() {
        this.$ionicHistory.clearCache();
        this.$ionicHistory.clearHistory();
        this.getScope().$emit('clear_competition_info');
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    logOutToStudent() {
        this.commonService.showConfirm('信息提示', '你确定要退出当前账号，进入到学生登录界面吗？').then((res) => {
            if (!res) return;
            this.teacherProfileService.logout((success) => {
                if (success) {
                    this.loginOutClearData();
                    this.$timeout(() => {
                        window.location.href = './student_index.html';
                    }, 100);
                    return;
                }
                this.commonService.showConfirm("信息提示", "退出失败,请稍后再试!");
            });
        });
    }

    gotoMyTask() {
        this.go('credits_store_task', {fromUrl: 'home.me'});
    }

    gotoCreditsStore() {
        this.go('credits_store', {fromUrl: 'home.me'});
    }

    gotoCreditsList() {
        this.go('credits_list', {fromUrl: 'home.me'});
    }

    onAfterEnterView() {
        if (this.isAdmin) {
            this.$ocLazyLoad.load('t_teacher_group');
        }
        //到主页面时清除$ionicHistory
        this.$ionicHistory.clearHistory();
        if (this.getStateService().params.inviteFlag == 'yes') {
            this.showInvite();
        }
        this.$ocLazyLoad.load("t_online_teaching");

    }

    back() {
        return 'exit';
    }
    
    gotoOnlineTeachingIndexPage(){
        this.go('online_teaching_index');
    }
}

export default meCtrl