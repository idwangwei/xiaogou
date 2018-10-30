/**
 * Created by ZL on 2017/8/11.
 */
import {Inject, View, Directive, select} from '../../module';
import '../../diagnoseChampionMusic/diagnoseChampionBgMusic.mp3';
import html2canvas from 'html2canvas/dist/html2canvas';
import weChatIcon from '../../images/wechat.ico';
import friendCircle from '../../images/friend-circle.png';
import rewardPromptBg from '../../images/rewardPromptBg.png';
@View('home.diagnose_pk', {
    url: '/diagnose_pk',
    views: {
        "study_index": {
            template: require('./page.html'),
            styles: require('./style.less'),
        }
    },
    inject:['$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$window',
        '$ngRedux',
        '$ionicHistory',
        '$ionicLoading',
        'commonService',
        '$ionicActionSheet',
        '$ionicSlideBoxDelegate',
        '$timeout',
        'diagnosePkService',
        '$ionicTabsDelegate',
        '$ocLazyLoad']
})

class diagnosePkCtrl {
    $ocLazyLoad;
    commonService;
    $ionicActionSheet;
    $ionicSlideBoxDelegate;
    $timeout;
    $window;
    $state;
    $ionicTabsDelegate;
    diagnosePkService;
    preLastChampion;
    lastChampion;
    currentUserScore;
    liveData = [];
    top5OfTodayList = [];
    animationFlag = false;
    animationCount = 0;
    bgMusic;
    dialogFlag = false;
    selectChampoin;
    currentGrade = 0;
    showAwardDescFlag = false;
    showAwardFlag = false;
    showAwardErrorFlag = false;
    rewardPromptBg = rewardPromptBg;
    tatalEnergyValue = '';
    awardList = [];
    isWin = this.commonService.judgeSYS() === 3;
    msgItemLine = window.innerWidth < 768 ? 4 : 2;
    currentTime = '';

    awardDesc = [
        {ranking: '第一名', award: '1000'},
        {ranking: '第二名', award: '500'},
        {ranking: '第三名', award: '300'},
        {ranking: '第四名', award: '200'},
        {ranking: '第五名', award: '100'},
    ];
    awardDescLast = '征服超过20个考点，奖励50';

    lastTopfive = [
        {avator: 1, grade: 2, name: '张三', schoolName: '爱里尔小学', quantityOfPet: 50},
        {avator: 2, grade: 2, name: '张三三', schoolName: '爱里尔小学', quantityOfPet: 48},
        {avator: 3, grade: 2, name: '张三四', schoolName: '爱里尔小学', quantityOfPet: 45},
        {avator: 4, grade: 2, name: '张三五', schoolName: '爱里尔小学', quantityOfPet: 40},
        {avator: 5, grade: 2, name: '张三六', schoolName: '爱里尔小学', quantityOfPet: 30},
    ];

    preLstTopFIve = [
        {avator: 21, grade: 2, name: '李四二', schoolName: '爱里尔小学', quantityOfPet: 50},
        {avator: 22, grade: 2, name: '李四三', schoolName: '爱里尔小学', quantityOfPet: 48},
        {avator: 23, grade: 2, name: '李四四', schoolName: '爱里尔小学', quantityOfPet: 45},
        {avator: 14, grade: 2, name: '李四五', schoolName: '爱里尔小学', quantityOfPet: 40},
        {avator: 15, grade: 2, name: '李四六', schoolName: '爱里尔小学', quantityOfPet: 30},
    ];

    @select(state=>state.profile_user_auth.user.name) userName;

    constructor(){
        this.initFlags();
    }
    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过
    }

    isMobile() {
        return this.getRootScope().platform.isMobile() && this.getRootScope().weChatPluginInstalled;
    }

    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    onBeforeLeaveView() {
        if (this.currentTimer) this.$timeout.cancel(this.currentTimer);
        if (this.animationCountTimer) this.$timeout.cancel(this.animationCountTimer);
        this.animationFlag = false;
        this.pauseMusic();
        this.$window.document.removeEventListener("resume", this.playMusic);
        this.$window.document.removeEventListener("pause", this.pauseMusic);
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
    }

    onAfterEnterView() {
        this.getRootScope().bgMusic = this.bgMusic = document.getElementById('diagnose_champion_bg_music');
        this.getScope().$on("$ionicNavView.leave", this.onBeforeLeaveView.bind(this));

        this.setWindowEventListener();
        this.playMusic();
        // this.realTime();
        // this.setRefreshInfo();
        this.diagnosePkService.getDiagnosePkInfo(this.analysisData.bind(this));
        this.diagnosePkService.getDiagnosePkLiveInfo(this.analysisLiveData.bind(this));
        this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').stop();
        let timeId = this.$timeout(()=> {
            this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').start();
            this.$timeout.cancel(timeId);
        }, 3000);
        this.$ocLazyLoad.load("m_me");
        this.$ocLazyLoad.load("m_user_auth");
    }

    analysisData(data) {
        if (data && data.code == 200) {
            this.preLastChampion = data.report.championOfDayBeforeYesterday || {};
            this.lastChampion = data.report.championOfYesterday || {};
            this.currentUserScore = data.report.myself || {};
            this.top5OfTodayList = data.report.top5OfToday || [];

            this.currentGrade = this.currentGrade || this.currentUserScore.grade;
            this.currentGrade = this.currentGrade || this.preLastChampion.grade;
            this.currentGrade = this.currentGrade || this.lastChampion.grade;

            this.preLastChampion.avator = this.preLastChampion.avator || 1;
            this.lastChampion.avator = this.lastChampion.avator || 1;
            this.top5OfTodayList.forEach((v, k)=> {
                this.top5OfTodayList[k].avator = this.top5OfTodayList[k].avator || 1;
                this.currentGrade = this.currentGrade || this.top5OfTodayList[k].grade;
            })
        }
    }

    analysisLiveData(data) {
        if (data && data.code == 200) {
            this.liveData = data.list;
            this.liveData = this.dealLiveData(this.liveData);
        }
    }

    dealLiveData(data) {
        data.forEach((v, k)=> {
            data[k].type = 7;
            data[k].avator = data[k].avator || 1;
        });
        return data;
    }

    configDataPipe() {
    }

    /**
     *刷新排名数据
     */
    refreshRangkingData() {
        this.$timeout.cancel(this.currentTimer);
        this.animationFlag = true;
        // this.diagnosePkService.getDiagnosePkInfo(this.analysisData.bind(this));
        this.setRefreshInfo();
        this.setAnimationIndex();
    }

    setRefreshInfo() {
        if (this.currentTimer) this.$timeout.cancel(this.currentTimer);
        this.currentTimer = this.$timeout(()=> {
            this.refreshRangkingData();
        }, 15 * 1000);
    }

    /**
     * 暂停滚动
     * @param event
     */
    setInfoScroll(event) {
        event.stopPropagation();
        event.currentTarget.flag = !event.currentTarget.flag;
        event.currentTarget.flag ? event.currentTarget.stop() : event.currentTarget.start();
    }

    setAnimationIndex() {
        if (this.animationCount == 5) {
            this.animationCount = 0;
            this.$timeout.cancel(this.animationCountTimer);
            this.animationFlag = false;
            return;
        }
        this.animationCount += 1;
        this.animationIndex();
    }

    animationIndex() {
        if (this.animationCountTimer) this.$timeout.cancel(this.animationCountTimer);
        this.animationCountTimer = this.$timeout(()=> {
            this.setAnimationIndex();
        }, 500);
    }

    getAvator(avator) {
        if (avator == 'default' || !avator) return 1;
        return avator||1;
    }

    getCurrentGrade(num) {
        if (!num && num != 0) return '';
        return this.commonService.convertToChinese(num);
    }

    showDialog(str) {
        if (str == 'preLast') {
            this.selectChampoin = this.preLastChampion;
            // TODO 掉接口 GET_LAST_TOP_FIVE
            if (!this.lastTopfive) this.lastTopfive = [];
            this.lastTopfive.length = 0;
            this.diagnosePkService.getLastDiagnoseTop5(this.currentGrade, 2, this.analysisLastTopfiveData.bind(this));
        } else {
            this.selectChampoin = this.lastChampion;
            // TODO 掉接口 GET_LAST_TOP_FIVE
            if (!this.lastTopfive) this.lastTopfive = [];
            this.lastTopfive.length = 0;
            this.diagnosePkService.getLastDiagnoseTop5(this.currentGrade, 1, this.analysisLastTopfiveData.bind(this));
        }
        if (!this.selectChampoin.name) return;
        this.dialogFlag = true;
    }

    //TODO
    analysisLastTopfiveData(data) {
        if (!data) return;
        this.lastTopfive = data.trainerList;
        if (!this.lastTopfive) this.lastTopfive = [];
        this.lastTopfive.forEach((v, k)=> {
            this.lastTopfive[k].avator = this.lastTopfive[k].avator || 1;
        })

    }

    hideDialog() {
        this.dialogFlag = false;
    }

    setWindowEventListener() {
        this.$window.document.removeEventListener("resume", this.playMusic);
        this.$window.document.removeEventListener("pause", this.pauseMusic);
        this.$window.document.addEventListener("resume", this.playMusic.bind(this));
        this.$window.document.addEventListener("pause", this.pauseMusic.bind(this));
    }

    playMusic() {
        if (this.getStateService().current.name == 'home.diagnose_pk') {
            this.bgMusic.play();
        }
    }

    pauseMusic() {
        this.bgMusic.pause();
    }

    /**
     * 分享截图
     */
    clickShareButn() {
        $(".share-butn").hide();
        $(".share-qr").show();
        let me = this;
        this.$ionicTabsDelegate.showBar(false);
        html2canvas(document.body).then((canvas) => {
            $(".share-qr").hide();
            $(".share-butn").show();
            this.$ionicTabsDelegate.showBar(true);
            me.shareScore(canvas.toDataURL("image/png"));
        });
    }

    /**
     * 分享图集
     * @param atlas
     */
    shareScore(atlas) {
        let teacherName = this.userName + "同学：";
        let shareContent = `我夺得了“驯宠霸主”，小伙伴们一起来战！`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="reward-share-btn weChat-share-img" src="${weChatIcon}">分享到微信`},
                {text: `<img class="reward-share-btn friend-circle-share-img" src="${friendCircle}">分享到朋友圈`},
                /* {text: `<img class="reward-share-btn qq-share-img" src="${qqIcon}" >分享到QQ`}*/
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
                                image: atlas,
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
                                image: atlas,
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
    };

    showAwardDescDialog() {
        this.showAwardDescFlag = true;
    }

    hideAwardDescDialog() {
        this.showAwardDescFlag = false;
    }

    showAwardDialog() {
        this.hideAwardDescDialog();
        this.diagnosePkService.getDiagnoseTop5Award(this.currentGrade, this.dealDiagnoseTop5List.bind(this));
    }

    dealDiagnoseTop5List(data) {
        if (data.code == 200) {
            this.analysisAwardData(data);
        }
        // this.showAwardErrorDialog();//TODO
        // this.showAwardFlag = true; //TODO
    }

    hideAwardDialog() {
        this.showAwardFlag = false;
    }

    showAwardErrorDialog() {
        this.showAwardErrorFlag = true;
    }

    hideAwardErrorDialog() {
        this.showAwardErrorFlag = false;
    }

    stopClickEvent($event) {
        if (typeof $event === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }
    }

    analysisAwardData(data) {
        try {
            if (this.awardList) this.awardList.length = 0;
            // this.awardList.length = 0;
            this.awardList = data.creditList;
            this.tatalEnergyValue = data.totalCreditValue || 0;
            if (this.awardList && this.awardList.length > 0) {
                this.showAwardFlag = true;
            } else {
                this.showAwardErrorDialog();
            }
        } catch (err) {
            console.error(err);
        }

    }

    showOptionsButn() {
        this.showOptionsButnFlag = true;
    }

    gotoDiagnose() {
        this.pauseMusic();
        this.go('home.diagnose02', {backWorkReportUrl: 'diagnose-ad-dialog'});
        this.hideOptionsButn();
    }

    gotoTiFen() {
        this.pauseMusic();
        this.go('home.diagnose02', {backWorkReportUrl: 'diagnose-ad-dialog', isIncreaseScore: true});
        this.hideOptionsButn();
    }

    hideOptionsButn() {
        this.showOptionsButnFlag = false;
    }

    back() {
        if (this.dialogFlag) {
            this.dialogFlag = false;
        }else if (this.showAwardDescFlag) {
            this.showAwardDescFlag = false;
        }else if (this.showAwardFlag) {
            this.showAwardFlag = false;
        }else if (this.showOptionsButnFlag) {
            this.showOptionsButnFlag = false;
        }else if(this.showAwardErrorFlag){
            this.showAwardErrorFlag = false;
        } else {
            this.go("home.me")
            return;
        }
        this.getScope().$digest();
    }
}
