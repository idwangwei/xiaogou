/**
 * Created by ww on 2017/5/11.
 */

import {Inject, View, Directive, select} from '../../module';
import './qr';

@View('teacher_share_info', {
    url: '/teacher_share_info/:backUrl',
    template: require('./teacher_share_info.html'),
    style: require('./teacher_share_info.less'),
    inject:['$scope', '$rootScope', '$state', '$ngRedux', 'commonService','teacherShareService']
})
class clazzDetailCtrl {
    commonService;
    teacherShareService;

    @select(state=>state.profile_user_auth.user) user;
    @select(state=>state.teacher_share_info) teacherShare;

    qrCodeUrl; //二维码链接
    qrCodeImg;//二维码图片
    flowDetail = [
        {
            text: '您把链接分享到群'
        },
        {
            text: '其他老师通过链接下载注册'
        },
        {
            text: '他的学生加入班级（要求大于10人）'
        },
        {
            text: '您的学生获得“学霸驯宠记”使用特权'
        }
    ];
    flowStep = 1;
    mineStuVipTime = '2个月';
    shareInfoDetail = [];
    retFlag = false;
    backUrl = this.getStateService().params.backUrl || 'home.work_list';
    constructor(){
        /*后退注册*/
        
    }
    configDataPipe() {
        this.dataPipe.when(()=>!this.initCtrl)
            .then(()=>{
                this.initCtrl = true;
                this.qrCodeUrl = "http://www.xuexiv.com/register?invitationCode=" + this.user.userId; //二维码链接
                this.qrCodeImg = window.QRCode.generatePNG(this.qrCodeUrl, {modulesize: 6, margin: 6});//二维码图片
                this.teacherShareService.getTeacherShareInfo().then(()=>{
                    this.retFlag = true;
                });

            });
    }

    onAfterEnterView() {

    }


    /**
     * 推广到微信
     */
    shareToWeiXin() {
        if (!this.getRootScope().weChatInstalled) {
            this.commonService.showAlert("提示", "没有安装微信！");
            return;
        }
        let inviteContent = `${this.user.name}老师向您推荐智算365，点击下载安装。`;
        Wechat.share({
            scene: Wechat.Scene.SESSION,  // 分享到朋友或群
            message: {
                title: "智算365邀请",
                description: inviteContent,
                thumb: "http://xuexiv.com/img/icon.png",
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: this.qrCodeUrl
                }
            },
        }, ()=> {
            this.commonService.showAlert("提示", "邀请信息发送成功！");
            // this.$ngRedux.
            this.teacherShareService.modifyFlowStep(1);
        }, (reason)=> {
            this.commonService.showAlert("提示", reason);
        });
    };

    /**
     * 分享到朋友圈
     */
    shareToWeiXinFriendCyc(){
        if (!this.getRootScope().weChatInstalled) {
            this.commonService.showAlert("提示", "没有安装微信！");
            return;
        }
        let inviteContent = `${this.user.name}老师向您推荐智算365，点击下载安装。`;
        Wechat.share({
            scene: Wechat.Scene.TIMELINE ,  // 分享到朋友或群
            message: {
                title: "智算365邀请",
                description: inviteContent,
                thumb: "http://xuexiv.com/img/icon.png",
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                media: {
                    type: Wechat.Type.LINK,
                    webpageUrl:this.qrCodeUrl,
                }
            },
        }, ()=> {
            this.commonService.showAlert("提示", "邀请信息发送成功！");
            this.teacherShareService.modifyFlowStep(1);

        }, (reason)=> {
            this.commonService.showAlert("提示", reason);
        });
    }

    /**
     * 推广到QQ
     */
    shareToQQ() {
        if (!this.getRootScope().QQPluginInstalled) {
            this.commonService.showAlert("提示", "没有安装QQ插件！");
            return;
        }
        QQ.setOptions({
            appId: '1105576253',
            appName: 'XiaoGou',
            appKey: 'IaDN9O8abL0FJ6gT'
        });
        let inviteContent = `${this.user.name}老师向您推荐智算365，点击下载安装。`;
        QQ.share(inviteContent,
            '智算365邀请',
            'http://xuexiv.com/img/icon.png',
            this.qrCodeUrl,
            ()=> {
                this.commonService.showAlert("提示", "邀请信息发送成功！");
                this.teacherShareService.modifyFlowStep(1);

            }, (err)=> {
                this.commonService.showAlert("提示", err);
            });
    };


    //判断是否显示微信分享
    isShowInvite() {
        if (typeof Wechat == "undefined") return false; //插件不存在不显示
        if (this.commonService.judgeSYS() == 1) return true; //安卓系统显示
        if (this.commonService.judgeSYS() == 3) return false; //非移动端设备不显示

        let appNumVersion = this.commonService.getAppNumVersion();
        if (!appNumVersion)return false;

        let ver = "1.8.8";
        let verArr = ver.split(".");
        let appVerArr = appNumVersion.split(".");
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
    };

    back(){
        this.getStateService().go(this.backUrl);
    }
}

export default clazzDetailCtrl