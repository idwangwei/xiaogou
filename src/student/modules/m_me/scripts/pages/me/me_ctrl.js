/**
 * Created by 彭建伦 on 2016/4/20.
 */
import qqIcon  from './../../../../m_global/sImages/qq.ico';
import weChatIcon  from './../../../../m_global/sImages/wechat.ico';
import friendCircle  from './../../../../m_global/sImages/friend-circle.png';
import qrCode  from './../../../../m_global/sImages/qrcode/officalSiteQrcode.png';

import {Inject, View, Directive, select} from '../../module';
@View('home.me', {
    url: '/me',
    styles: require('./me.less'),
    views: {
        "me": {
            template: require('./me.html'),
        }
    },
    inject: ['$scope',
        '$rootScope',
        '$timeout',
        '$ionicHistory',
        '$ngRedux',
        'commonService',
        'profileService',
        '$ionicPopup',
        '$ionicLoading',
        '$state',
        '$ionicActionSheet',
        'appInfoService',
        'finalData',
        '$ocLazyLoad']
})
class MeCtrl {
    qqIcon;
    weChatIcon;
    friendCircle;
    qrCode;
    appInfoService;

    constructor() {
        this.initData();
    }

    initData() {
        this.qqIcon = qqIcon; // this.getRootScope().loadImg('qq.ico');
        this.weChatIcon = weChatIcon; // this.getRootScope().loadImg('wechat.ico');
        this.friendCircle = friendCircle; // this.getRootScope().loadImg('friend-circle.png');
        this.qrCode = qrCode; // this.getRootScope().loadImg('qrcode/officalSiteQrcode.png');
    }

    getProgressWidth() {
        let widthPre = (Number(this.rewardData.experience) / Number(this.rewardData.levelUp)).toFixed(2) * 100;
        if (widthPre > 100) widthPre = 100;
        return widthPre;
    }

    getNextLevel(level) {
        return Number(level) + 1;
    }

    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    /**
     * 切换头像
     */
    changeHead() {
        this.getRootScope().showChangeHeadFlag = true;
    }


    onReceiveProps(selectedState, selectedAction) {
        Object.assign(this, selectedState, selectedAction);
    }

    onBeforeEnterView() {
        /*if(this.getRootScope().platform.IS_ANDROID)
         $('.me #me-content').attr('overflow-scroll',false);*/

    }

    onAfterEnterView() {
        this.bannerHeight = $('.me .bg-content-wrap').height();
        let me = this;
        $(window).on('orientationchange', () => {
            let height = window.innerWidth > 600 ? 200 : 150;
            me.bannerHeight = height;
            me.$timeout(() => {
                $('.me .bg-content-wrap').css({'height': `${height}` + 'px'});
            });

        });

        this.getRewardInfoServer();//获取积分相关的数据
        this.$ocLazyLoad.load("m_me_classes");
        this.$ocLazyLoad.load("m_home");
        this.$ocLazyLoad.load("m_reward");
        this.$ocLazyLoad.load("m_diagnose_pk");
        this.$ocLazyLoad.load("m_user_auth");
        this.$ocLazyLoad.load('m_diagnose_payment');
        this.$ocLazyLoad.load('m_improve');
        this.$ocLazyLoad.load("m_online_teaching");
    
    
    }

    getAvator() {
        if (this.rewardData.avator == 'default') return 1;
        return this.rewardData.avator||1;
    }

    mapStateToThis(state) {
        return {
            // levelAnalyzeData: state.level_name_list.levelAnalyzeData,
            rewardData: state.user_reward_base,
            name: state.profile_user_auth.user.name,
            // group: state.level_name_list_group.group,
            userGender: state.profile_user_auth.user.gender,
            loginName: state.profile_user_auth.user.loginName,
            appNumVersion: state.app_info.appVersion,
            // rewardData: state.reward_info
        }

    }

    mapActionToThis() {
        let ps = this.profileService;
        return {
            logout: ps.logout.bind(ps),
            getAppNumVersion: this.appInfoService.getAppNumVersion.bind(this.appInfoService),
            getRewardInfoServer: ps.getRewardInfoServer.bind(ps)
        }
    }

    appHelp() {
        if (window.cordova && window.cordova.InAppBrowser) {
            window.cordova.InAppBrowser.open('http://www.xuexiv.com/phone_index.html?showCommonQS=true', 'location=yes');
        } else {
            this.$ionicPopup.alert({
                title: '常见问题',
                template: `<p style="color: #377AE6">问：使用中有问题？</p>
                <p style="position: relative">答：1. 点击每个页面右上角的
                    <img ng-src="{{$root.loadImg('common/help_icon_new.png')}}" alt="" class="common-help-tip" style="top: -3px;left: 188px;"/>
                    <span style="margin-left: 27px">。</span>
                </p>
                <p>2. 还可用浏览器打开 <span style="-webkit-user-select:initial;">xuexiV.com</span>&nbsp;查看《常见问题》</p>
                `,
                okText: '确定'
            });
        }

    }

    goCommonProblem() {
        this.go('common-problem');
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

    onTouch($event) {
        this.ox = $event.target.offsetLeft;
        this.oy = $event.target.offsetTop;
    }

    onDrag($event) {
        let dy = $event.gesture.deltaY;
        this.setDomScale(-dy);
        $('.me #me-content .scroll')[0].style.transform = 'translate3d(0px, ' + dy + 'px, 0px)  scale(1)';
    }

    onRelease($event) {
        $('.me .bg-content-wrap').css({
            height: `${this.bannerHeight}` + 'px',
            'transform': ` scale(1),'-webkit-transform':'scale(1)'`
        });
        $('.me #me-content .scroll').css({'transform': 'scale(1)', '-webkit-transform': 'scale(1)'});
        //$('.me #me-content .scroll')[0].style.transform='translate3d(0px, 0px, 0px)  scale(1)';
    }

    setDomScale(topValue) {
        if (topValue > 0) return;
        let adaptValue = topValue / (3 * this.bannerHeight);
        let scaleValue = (1 - adaptValue).toFixed(2);
        let wrapHeight = this.bannerHeight + (1 + adaptValue) * Math.abs(topValue);
        if (wrapHeight <= this.bannerHeight) return;
        $('.me .bg-content-wrap').css({
            height: `${wrapHeight}` + 'px',
            'transform': ` scale(${scaleValue}),'-webkit-transform':'scale(${scaleValue})'`
        });
    }


    onScrolling(el) {
        let topValue = el.scrollCtrl.getScrollPosition().top;
        this.setDomScale(topValue);
    }

    completeScroll(el) {
        let topValue = el.scrollCtrl.getScrollPosition().top;
        if (topValue > 0) return;
        $('.me .bg-content-wrap').css({
            height: this.bannerHeight,
            'transform': 'scale(1)',
            '-webkit-transform': 'scale(1)'
        });
        $('.me #me-content .scroll').css({'transform': 'scale(1)', '-webkit-transform': 'scale(1)'});
        //$('.me #me-content .scroll').css({top: this.bannerHeight});
    }


    /**
     * 使用技巧提示
     */
    help() {
        this.$ionicPopup.alert({
            title: '使用技巧',
            template: `<p style="color: #377AE6">问：如何重置密码？</p>
                <p>答：让家长登录家长端，进入“孩子”页面去修改。</p>
                <p style="color: #377AE6">问：如何增加或删除班级？</p>
                <p>答：让家长登录家长端，进入“孩子”页面去修改。</p>
                `,
            okText: '确定'
        });
    }

    /**
     * 退出登录就清空数据
     */
    loginOutClearData() {
        this.getRootScope().unPassedClazzListShown = false;
        this.getRootScope().showDiagnoseAdDialogFlag = undefined;
        this.getRootScope().isIncreaseScore = undefined;
        this.getRootScope().compileMicrolectureAdToHomePage = undefined;
        this.getRootScope().compileWinterCampAdToHomePage = undefined;
        this.$ionicHistory.clearCache();
        this.$ionicHistory.clearHistory();
        // this.wxPayService.invite.inviteAccount = '';
        // this.wxPayService.invite.inviteUserId = '';

    }

    toProtectEyePage() {
        if (window.cordova && window.cordova.InAppBrowser) {
            cordova.InAppBrowser.open("http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg", "location=yes");
        } else {
            let alertTemplate = `<p>连续使用电脑15分钟，向窗外看一看可以缓解用眼疲劳哦~</p>`;
            this.commonService.showAlert("温馨提示", alertTemplate, "我知道了");
        }
    }

    userLogout() {
        let that = this;
        this.commonService.showConfirm('信息提示', '你确定要退出当前账号吗？').then((res) => {
            if (!res) return;
            that.logout((success) => {
                if (success) {
                    that.loginOutClearData();
                    this.getScope().$emit('clear_competition_info');
                    that.go('system_login', 'forward');
                } else {
                    that.commonService.showConfirm("信息提示", "退出失败,请稍后再试!");
                }
            });
        });
    }

    userLogoutToParent() {
        "use strict";
        let that = this;
        this.commonService.showConfirm('信息提示', '你确定要退出当前账号，进入到家长登录界面吗？').then((res) => {
            if (!res) return;
            that.logout((success) => {
                if (success) {
                    that.loginOutClearData();
                    that.$timeout(() => {
                        window.location.href = './parent_index.html';
                    }, 100);

                    return;
                }
                that.commonService.showConfirm("信息提示", "退出失败,请稍后再试!");
            });
        });
    }

    /**
     * 打开邀请
     */
    showInvite() {
        let shareContent = `${this.name}同学向您推荐智算365，点击下载安装。`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="weChat-share-img" src="${this.weChatIcon}">推荐到微信`},
                {text: `<img class="friend-circle-share-img" src="${this.friendCircle}">推荐到朋友圈`},
                {text: `<img class="qq-share-img" src="${this.qqIcon}" >推荐到QQ`}
            ],
            titleText: `<div style="text-align: center">
                    <div class="share-title">智算365邀请：</div>
                        <div class="share-content">${shareContent}</div>
                        <img class="share-qrcode" src="${this.qrCode}" width="40%">
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
                        this.finalData.GONG_ZHONG_HAO_QRIMG_URL,
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
                                webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
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
                            text: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.LINK,
                                webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
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

    isShowInvite() {
        if (typeof Wechat == "undefined") return false; //插件不存在不显示
        if (this.commonService.judgeSYS() == 1) return true; //安卓系统显示
        if (this.commonService.judgeSYS() == 3) return false; //非移动端设备不显示
        if (!this.getAppNumVersion) return;

        if (!this.appNumVersion) {
            this.getAppNumVersion();
        }

        if (!this.appNumVersion) return false;

        let ver = "1.8.8";
        let verArr = ver.split(".");
        let appVerArr = this.appNumVersion.split(".");
        while (appVerArr.length < verArr.length) {
            appVerArr.push(0);
        }
        let isShow = true;
        for (let i = 0; i < appVerArr.length; i++) {
            if (Number(appVerArr[i]) > Number(verArr[i])) {
                break;
            } else if (Number(appVerArr[i]) < Number(verArr[i])) {
                isShow = false;
                break;
            }
        }
        return isShow;
    }

    /**
     * 打开在线客服
     */
    goToOnlineService() {
        $('#YSF-BTN-HOLDER').click();
    }


    goToSignIn() {
        this.go("reward_sign_in");

    }

    goToLevelName() {
        this.go("reward_level_name");

    }

    goToScoreStore() {
        this.$ocLazyLoad.load('m_pet_page').then(()=> {
            this.go("reward_score_store");
        });


    }

    goToDayTask() {
        this.go("reward_day_task");
    }

    creditsDialog() {
        this.getRootScope().showRewardDialogFlag = true;
        this.getRootScope().dialogType = 'credits';
        this.getRewardInfoServer();
    }

    scoreDetails() {
        let img = this.getRootScope().loadImg('reward_system/reward_money.png');
        let template = "<div style='text-align: center;width: 100%;height: 300px;overflow: scroll'>" +
            "<p style='width: 100%;text-align: left;color: #0a9dc7'>能量有什么用？</p>" +
            "<p style='width: 100%;text-align: left'>&nbsp;&nbsp;可以到能量中心里去兑换能量道具</p>" +
            "<p style='width: 100%;text-align: left;color: #0a9dc7'' >如何获得能量？</p>" +
            "<p style='width: 100%;text-align: left'>&nbsp;&nbsp;完成每日任务或者推广注册智算365可以获得能量</p>" +
            "<p style='width: 100%;text-align: left;color: #0a9dc7''>经验获得规则：</p>" +
            "<p style='width: 100%;text-align: left'>&nbsp;&nbsp;做作业每获得一次金杯，奖励5点经验。</p>" +
            "<p style='width: 100%;text-align: left'>&nbsp;&nbsp;玩游戏两星通关，奖励2点经验；两星半通关，奖励3点经验；三星通关，奖励5点经验。</p>" +
            "<p style='width: 100%;text-align: left'>&nbsp;&nbsp;玩速算两星通关，奖励2点经验；两星半通关，奖励3点经验；速算每挑战成功一名玩家，奖励5点经验。</p>" +
            "<p style='width: 100%;text-align: left'>&nbsp;&nbsp;牢固驯服一只新萌宠，奖励5点经验。</p></div>";
        this.commonService.showAlert('能量、经验说明', template);
    }

    back() {
        if (this.getRootScope().showChangeHeadFlag) {
            this.getRootScope().showChangeHeadFlag = false;
        } else if (this.getRootScope().showRewardDialogFlag) {
            this.getRootScope().showRewardDialogFlag = false
        } else {
            return 'exit';
        }
        this.getRootScope().$digest();
    }
    goToDignosePK(){
        this.go('home.diagnose_pk');
    }
    /**
     * 我的班级
     */
    gotoClazzManage() {
        this.go('clazz_manage');
    }
    
    
    gotoOnlineTeachingIndexPage(){
        // if(!this.onLineCount || !this.onLineCount.match(/^1\d{10}[TtSs]\d?$/)){
        //     this.commonService.alertDialog('请正确输入与你连线的账号',3000);
        // }else {
        //     let onLine = +this.onLineCount.match(/\d+/)>+this.loginName.match(/\d+/)?
        //         `${this.onLineCount}-${this.loginName}`:
        //         `${this.loginName}-${this.onLineCount}`;
            this.go('online_teaching_index');
        // }
    }
}
