/**
 * Created by ZL on 2018/3/28.
 */
import qqIcon from "./../../../../t_boot/tImages/qq.ico";
import weChatIcon from "./../../../../t_boot/tImages/wechat.ico";
import {Inject, View, Directive, select} from '../../module';

@View('work_statistics_report', {
    url: '/work_statistics_report/:paperInstanceId/:isNoPublish/:type',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: [
        '$scope'
        , '$state'
        , '$rootScope'
        , '$ionicScrollDelegate'
        , '$ngRedux'
        , '$timeout'
        , 'commonService'
        , 'workListService'
        , 'finalData'
        , '$ionicHistory'
        , '$ionicActionSheet'
    ]
})

class workStatisticsReportCtrl {
    workListService;
    $ionicActionSheet;
    commonService;
    paperInstanceId = this.getStateService().params.paperInstanceId;
    publishType = this.getStateService().params.type;
    @select(state=>state.profile_user_auth.user) user;
    @select(state=>state.wl_selected_clazz) currentClazz;

    initCtrl = false;
    statisticsInfo = {};
    shareUrl = 'http://www.xuexiv.com/work_report/index.html';

    morePraise = true;
    moreError = true;

    initData() {
        this.initCtrl = false;
        //TODO 假数据
        this.statisticsInfo = {
            instanceId: '',
            publishType: 6,
            type: '',
            paperName: '测试试卷',
            startTime: '',
            endTime: '',
            publishTime: '2018.3.29',
            subjects: {
                subjectId: '',
                subjectSymbol: '',
                type: '',
                submitNum: 13,
                totalNum: 30,
                score: 100
            },
            assigneeDisplaySet: ['A', 'B'],
            firstSubmitStudentList: [
                {
                    id: '',
                    name: '张航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                }
            ],
            firstGetFullScoreStudentList: [
                {
                    id: '',
                    name: '张航航哈',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                }
            ],
            errorCorrectStudentList: [
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                }
            ],
            notSubmitStudentList: [
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                },
                {
                    id: '',
                    name: '张航航',
                    loginName: '13880929277',
                    scores: '95',
                    status: '',
                    firstWasteTime: '1分30秒',
                    elapse: '',
                    reworkTimes: '2分45秒',
                    gender: '',
                }
            ]

        }
    }

    onAfterEnterView() {
        this.initData();
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.workListService.getStatisticsPaperReport(this.paperInstanceId, this.currentClazz.id, this.publishType).then((data)=> {
                if (data) {
                    this.statisticsInfo = data;
                    angular.forEach(this.statisticsInfo.promoteLatitudeStudentList, (v, k)=> {
                        let promoteLatitude = Number(this.statisticsInfo.promoteLatitudeStudentList[k].promoteLatitude);
                        this.statisticsInfo.promoteLatitudeStudentList[k].proLa = promoteLatitude.toFixed(2) + '%';
                    });
                    angular.forEach(this.statisticsInfo.getHighScoreStudentList, (v2, k2)=> {
                        let hWorkTime = Number(this.statisticsInfo.getHighScoreStudentList[k2].firstWasteTime);
                        this.statisticsInfo.getHighScoreStudentList[k2].workTime = this.conversionTime(hWorkTime);
                    });
                }
            })
        }
    }

    /**
     * 分享给家长
     */
    shareToParent() {
        let shareUrlStr = this.shareUrl + '?shardingId=' + this.currentClazz.id + '&businessType=qbu' + '&groupId=' + this.currentClazz.id + '&paperInstanceId=' + this.paperInstanceId +"&type="+this.publishType;
        if (!this.currentClazz.id) {
            this.commonService.alertDialog('未能获取到班级，暂时无法分享');
            return;
        }
        if (!this.paperInstanceId) {
            this.commonService.alertDialog('未能获取到试卷，暂时无法分享');
            return;
        }

        let title = '作业报告：';
        let gradeName = this.currentClazz.gradeName.replace('届', '级');
        let shareContent = '' + this.currentClazz.className + '   ' + gradeName + this.statisticsInfo.subjects[0].subjectSymbol + '学生作业详情，请家长们及时查看！';

        let teacherName = this.user.name;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="reward-share-btn weChat-share-img" src="${weChatIcon}">发到微信`},
                {text: `<img class="reward-share-btn qq-share-img" src="${qqIcon}" >发到QQ`}
            ],
            titleText: `<div><div class="reward-share-btn share-title" >${title}</div>
                        <div class="reward-share-btn share-content" >${shareContent}</div>
                    </div>`,
            cancelText: '取消',
            buttonClicked: (index) => {
                if (index == 1) {
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        title,
                        'http://xuexiv.com/img/icon.png',
                        shareUrlStr,
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
                            title: title,
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.LINK,
                                webpageUrl: shareUrlStr,
                                /*   type: Wechat.Type.IMAGE,
                                 image: base64Img,*/
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

    back() {
        this.getStateService().go("work_student_list", {
            paperInstanceId: this.paperInstanceId,
            isNoPublish: this.getStateService().params.isNoPublish
        });
    }

    showMorePraise() {
        this.morePraise = !this.morePraise;
    }

    showMoreError() {
        this.moreError = !this.moreError;
    }

    /**
     * 换算时间
     */
    conversionTime(time) {
        let s = time / 1000;
        let h = Math.floor(s / 60 / 60);
        let mm = Math.floor((s - h * 60 * 60) / 60);
        let ss = s - h * 60 * 60 - mm * 60;

        let tStr = '';
        if (h > 0) tStr += h + '时';
        if (mm > 0) tStr += mm + '分';
        if (ss > 0) tStr += ss + '秒';

        return tStr;
    }

}

export default workStatisticsReportCtrl;
