/**
 * Created by ww on 2018/2/28.
 */
import qqIcon from "modules/t_boot/tImages/qq.ico";
import weChatIcon from "modules/t_boot/tImages/wechat.ico";
import friendCircle from "modules/t_boot/tImages/friend-circle.png";
import {View, select} from '../../module';

@View('home', {
    url: '/home',
    styles: require('./home.less'),
    template: require('./home.html'),
    inject: ['$scope',
        '$state',
        '$rootScope',
        '$timeout',
        '$ionicTabsDelegate',
        '$ngRedux',
        '$ionicActionSheet',
        'commonService',
        'finalData',
        'moreInfoManageService',
        '$ocLazyLoad'
    ],
})
class TeacherHomeCtrl {
    finalData;
    commonService;
    moreInfoManageService;
    $ocLazyLoad;
    @select(state=>state.wl_selected_clazz)selectedClazz;
    @select(state=>state.profile_user_auth.user)user;
    @select(state=>state.trophy_selected_time)trophySelectedTime;
    initCtrl = false;

    constructor() {
        this.initData();
    }

    initData() {
        this.isIos = this.commonService.judgeSYS() === 2;
        this.isPC = this.commonService.isPC();
        this.msgItemLine = window.innerWidth < 768 ? 4 : 2; //根据屏幕尺寸显示每一条轮播信息的行数
        this.guideFlag = this.commonService.getSimulationClazzLocalData();
        this.getRootScope().showTopTaskFlag = true;
        this.getScope().$on('$ionicView.loaded', ()=> {
            if (this.$ionicTabsDelegate._instances.length)
                this.$ionicTabsDelegate._instances[0].showBar(true);
        });
    }

    onAfterEnterView() {
        this.$ocLazyLoad.load('t_classes');
        this.$ocLazyLoad.load('t_credits_store');
        this.$ocLazyLoad.load('t_me');
        this.$ocLazyLoad.load('t_game');
        this.$ocLazyLoad.load('t_home_teaching_work');
        this.$ocLazyLoad.load('t_compute');
        this.$ocLazyLoad.load('t_diagnose');
        this.$ocLazyLoad.load("t_user_auth");
        this.$ocLazyLoad.load("t_area_evaluation");

    }

    configDataPipe() {
        this.dataPipe.when(()=>!this.initCtrl && this.trophySelectedTime)
            .then(()=> {
                this.initCtrl = true;
                this.initTimeSelect();
            })
    }


    bottomTabClick() {
        let currentUrl = this.getStateService().current.name;
        if (currentUrl === 'home.me' || currentUrl === 'home.math_oly' || currentUrl === 'home.clazz_manage' || currentUrl === 'home.official_accounts') {
            let studyStateLastStateUrl = this.commonService.getLocalStorage('studyStateLastStateUrl') || 'home.work_list';
            this.$ionicTabsDelegate.select(0);
            this.getStateService().go(studyStateLastStateUrl, "none");
        }
    };

    topTabClick(urlRoute) {
        if (urlRoute && urlRoute != this.getStateService().current.name) {
            this.getStateService().go(urlRoute, "none");
        }
    };


    hideWinterAd() {
        this.getRootScope().showWinterWorkFlag = false;
    };

    hideWinterBroadcast(event) {
        if ($(event.target).hasClass('work-backdrop'))
            this.getRootScope().showWinterBroadcast = false;
    };

    hideDiagnoseAd() {
        this.getRootScope().showDiagnoseAdFlag = false;
    };

    /**
     * 点击奖杯排行榜外的灰色区域关闭排行榜
     * @param event
     */
    closeTrophyRankData(event) {
        if ($(event.target).hasClass('work-backdrop'))
            this.getRootScope().isShowTrophyRank = false;
    };

    initTimeSelect() {
        this.termData = {nowTerm: '', terms: []};   //本学年，选择学年
        this.START_YEAR = 2015;                  //起始年份
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (1 <= month && month < 9) {
            year = year - 1;
        }
        for (var i = this.START_YEAR; i <= year; i++) {
            var temp = (i) + '-' + (i + 1) + ' 学年';
            this.termData.terms.push(temp);
        }
        if (this.trophySelectedTime.startTime) {
            let matchYear = this.trophySelectedTime.startTime.match(/^\d{4}/);
            year = matchYear ? +matchYear[0] : year;
        }
        this.termData.nowTerm = (year) + '-' + (year + 1) + ' 学年';

        this.startTime = this.termData.nowTerm.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(this.termData.nowTerm.substring(0, 4)) + 1) + '-08-31';
        if (!this.trophySelectedTime.startTime) {
            this.moreInfoManageService.changeTrophyTime(this.startTime, this.endTime);
        }
    };

    /**
     * 获取奖杯排行榜数据
     */
    getTrophyRankData() {
        if (!this.selectedClazz || !this.selectedClazz.id) {
            return;
        }
        if (this.getRootScope().isTrophyLoading) {
            return;
        }

        this.startTime = this.termData.nowTerm.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(this.termData.nowTerm.substring(0, 4)) + 1) + '-08-31';
        this.moreInfoManageService.changeTrophyTime(this.startTime, this.endTime);

        let stateKey = this.selectedClazz.id + "#" + this.startTime + "|" + this.endTime;
        let param = {
            startTime: this.startTime,
            endTime: this.endTime,
            clazzId: this.selectedClazz.id,
            stateKey: stateKey
        };
        this.moreInfoManageService.fetchTrophyRankData(param);
    };


    getHighLightEle() {
        if (this.guideFlag && this.guideFlag.hasPubedSimulationWork) {
            this.getScope().currentShowEle = $(".list ");
            this.getScope().showTipContent = "布置给模拟班的作业已有35人提交了，点进去查看详情。";
            return;
        }

        this.getScope().currentShowEle = $(".work_list_file[nav-view = 'active'] .work_pub");
        this.getScope().showTipContent = this.user.name + "老师，欢迎您使用智算365，先用模拟班体验布置作业吧!";
    };

    /**
     * 打开邀请
     */
    showInvite() {
        let teacherName = this.user.name;
        let shareContent = `使用“学霸驯宠记”能让学生在每个知识点达到举一反三，建议有条件的家长自愿付费开通此功能。`;
        $ionicActionSheet.show({
            buttons: [
                {text: `<img class="weChat-share-img" src="${weChatIcon}">推荐到微信`},
                {text: `<img class="friend-circle-share-img" src="${friendCircle}">推荐到朋友圈`},
                {text: `<img class="qq-share-img" src="${qqIcon}" >推荐到QQ`}
            ],
            titleText: `<div style="text-align: center;">
                <div class="share-title">${teacherName}老师建议：</div>
                    <div class="share-content">${shareContent}</div>
                     
                </div>`,
            cancelText: '取消',
            buttonClicked: (index)=> {
                if (index == 2) {
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        teacherName + '老师建议：',
                        'http://xuexiv.com/img/icon.png',
                        this.finalData.GONG_ZHONG_HAO_QRIMG_URL,
                        ()=> {
                            this.commonService.showAlert("提示", "邀请信息发送成功！");
                        }, (err)=> {
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
                            title: teacherName + '老师建议：',
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
                    }, ()=> {
                        this.commonService.showAlert("提示", "邀请信息发送成功！");
                    }, (reason)=> {
                        this.commonService.showAlert("提示", reason);
                    });
                }
                if (index == 1) {//点击分享到微信
                    if (!this.getRootScope().weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                        message: {
                            title: teacherName + '老师建议：',
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.LINK,
                                webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
                            }
                        },
                    }, ()=> {
                        this.commonService.showAlert("提示", "邀请信息发送成功！");
                    }, (reason)=> {
                        this.commonService.showAlert("提示", reason);
                    });
                }

                return true;
            }
        });
    };

    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    };

    closeDiagnoseAdAndShowInvite() {
        this.hideDiagnoseAd();
        this.getScope().$emit("recommend.show");
    };

    shareDeal(base64Img) {
        this.hideDiagnoseAd();

        if (this.getRootScope().platform.IS_WINDOWS || this.getRootScope().platform.IS_MAC_OS) {
            this.commonService.alertDialog('学生端的“诊断提分”功能能诊断孩子还有哪些考点未掌握，并可快速提分。去免费领取该功能三年使用权，家长自愿开通。', 3500);
            return
        }


        let teacherName = this.user.name;
        let shareContent = `根据最近作业完成情况，有部分孩子考点掌握不理想。请到学生端“诊断提分”版块去查看孩子还有多少考点未掌握，不牢固，并让TA做到掌握。`;

        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="weChat-share-img" src="${weChatIcon}">发到到微信`},
                {text: `<img class="friend-circle-share-img" src="${friendCircle}">发到到朋友圈`},
                {text: `<img class="qq-share-img" src="${qqIcon}" >发到到QQ`}
            ],
            titleText: `<div style="text-align: center;">
                <!--<div class="share-title">${teacherName}老师：</div>-->
                <div class="share-title">各位家长：</div>
                    <div class="share-content">${shareContent}</div>
                     
                </div>`,
            cancelText: '取消',
            buttonClicked: (index)=> {
                if (index == 2) {
                    if (!this.getRootScope().QQPluginInstalled) {
                        this.commonService.showAlert("提示", "移动设备没有安装QQ！");
                        return;
                    }
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        teacherName + '老师：',
                        'http://xuexiv.com/img/icon.png',
                        this.finalData.GONG_ZHONG_HAO_QRIMG_URL,
                        ()=> {
                            this.commonService.showAlert("提示", "邀请信息发送成功！");
                        }, (err)=> {
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
                            title: teacherName + '老师：',
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
                    }, ()=> {
                        this.commonService.showAlert("提示", "邀请信息发送成功！");
                    }, (reason)=> {
                        this.commonService.showAlert("提示", reason);
                    });
                }
                if (index == 1) {//点击分享到微信
                    if (!this.getRootScope().weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                        message: {
                            title: teacherName + '老师：',
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
                    }, ()=> {
                        this.commonService.showAlert("提示", "邀请信息发送成功！");
                    }, (reason)=> {
                        this.commonService.showAlert("提示", reason);
                    });
                }

                return true;
            }
        });
    };

    showOralPublishGuide() {
        if (!this.getRootScope().isAdmin && (!this.selectedClazz || !this.selectedClazz.id)) {
            let template = '<p>您还没有创建班级，点击“班级”，然后再点击“+”创建班级</p>';
            this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
            return;
        }
        this.getStateService().go("pub_work_type");
    }

    gotoPageClazz(){
        this.go('home.clazz_manage','none');
    }
    gotoPageMe(){
        // home.me({inviteFlag:false})
        this.go('home.me','none',{inviteFlag:false});
    }

}
export default TeacherHomeCtrl;

