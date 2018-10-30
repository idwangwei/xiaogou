/**
 * Created by WL on 2017/9/5.
 */
import _find from 'lodash.find';
import {Inject, View, Directive, select} from '../../../module';

@View('home.oral_calculation_work_list', {
    url: '/oral_calculation_work_list',
    views: {
        "study_index": {
            template: require('./page.html'),
            styles: require('./style.less')
        }
    },
    inject: ['$scope', '$state', '$stateParams', 'workStatisticsServices', 'commonService'
        , 'profileService', '$ngRedux', '$ionicPopup', 'paperService', '$ionicTabsDelegate', '$timeout'
        , 'finalData'
        , '$ionicSideMenuDelegate'
        , 'pageRefreshManager'
        , '$rootScope'
        , '$ionicSlideBoxDelegate'
        , '$ionicTabsDelegate'
        , '$ionicPopover'
        , '$ionicScrollDelegate'
        , '$interval'
    ]
})
class oralCalculationWorkList {
    $stateParams;
    workStatisticsServices;
    commonService;
    profileService;
    $ngRedux;
    pageRefreshManager;
    $ionicPopup;
    paperService;
    $ionicTabsDelegate;
    $timeout;
    finalData;
    $ionicSideMenuDelegate;
    $rootScope;
    $ionicSlideBoxDelegate;
    $ionicPopover;
    $ionicScrollDelegate;
    $interval;
    @select(state => state.profile_user_auth.user.name)userName;
    @select(state => state.profile_user_auth.user.userId)userId;
    @select(state => {
        let clazzList = state.profile_clazz.passClazzList;
        let newClazzList = [];
        if (state.work_list_route.urlFrom === 'olympic_math_t') {
            angular.forEach(clazzList, (item) => {
                if (item.type === 200) newClazzList.push(item);
            });
        } else {
            angular.forEach(clazzList, (item) => {
                if (item.type != 200) newClazzList.push(item);
            });
        }
        return newClazzList
    }) clazzList;

    @select(state => state.profile_clazz.selfStudyClazzList)selfStudyClazzList;
    @select(state => {
        return state.wl_selected_clazz
    }) wl_selected_clazz;
    @select(state => state.wl_pagination_info)wl_pagination_info;
    @select(state => {
        let userId = state.profile_user_auth.user.userId;
        let clzId = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom === 'olympic_math_s' ? userId : state.wl_selected_clazz.id;
        return state.work_list_route.urlFrom === 'olympic_math_s' ? state.wl_clazz_list_with_works[userId] : state.wl_clazz_list_with_works[clzId];
    })workList;
    @select(state => {
        let userId = state.profile_user_auth.user.userId;
        let clzId = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom === 'olympic_math_s' ? userId : state.wl_selected_clazz.id;
        let workList = state.work_list_route.urlFrom === 'olympic_math_s' ? state.wl_clazz_list_with_works[userId] : state.wl_clazz_list_with_works[clzId];
        return workList ? workList.length : 0
    })workListLen;
    @select(state => state.wl_is_worklist_loading)wl_is_worklist_loading;
    @select(state => state.wl_selected_work)wl_selected_work;
    @select(state => state.wl_is_fetch_status_loading)wl_is_fetch_status_loading;
    @select(state => state.app_info.onLine)onLine;
    @select(state => state.work_list_route.urlFrom)stateUrlFrom;
    @select(state => state.oral_calculation_limittime)oralLimittimes;
    @select(state => state.first_submit_work_after_update)isFirstSubmitWorkAfterUpdate;

    constructor() {
        this.initFlags();
    }

    timeCountCallBack(item) {
        let paperTime = Number(this.oralLimittimes[item.paperId]);
        if (paperTime && !paperTime.countDownTimer) {
            this.updateOralPaperLimitTime(item.paperId, null, this.stopTimer.timer);
        }
    }

    getCountDownStartTime(item) {
        let paperTime = this.oralLimittimes[item.instanceId];
        if (!paperTime || paperTime && !paperTime.startTime) return 0;
        this.stopTimer.timer = paperTime.countDownTimer;
        let lastTime = Number(item.limitTime) * 60 - Math.round((Number(new Date().getTime()) - Number(paperTime.startTime)) / 1000);
        if (lastTime < 0) lastTime = 0;
        return lastTime;
    }


    initFlags() {
        this.onLine = true;
        this.isIos = this.commonService.judgeSYS() === 2;
        this.isPC = this.commonService.isPC();
        this.screenWidth = window.innerWidth;
        this.selectedClazzInitlized = false; //ctrl初始化后，是否已经选择过一次班级
        this.workListInitlized = false; //ctrl初始化后，是否已经加载过一次作业列表
        this.loadMoreExecuteCount = 0; //从ion-infinite-scroll调用加载列表方法的次数
        this.SHOW_NAME = {P: "家长", S: '学生', T: '老师'};//在评价明细页面显示的名称
        this.moreFlag = false;//是否出现加载更多的指令
        this.moreFlagMapForEveryClazz = {};
        this.initCount = 0;
        this.workStatisticsServices.routeInfo.urlFrom = this.stateUrlFrom;
        this.initGradeFlag = false;
        this.showDiaglog = true;
        this.initCtrl = false;
        this.glitterFlag = false;
        this.stopTimer = {};
        this.isShowWorkListFlag = undefined;
    }

    initData() {
        let modalStyle = "top: 20%!important;right: 20%!important;bottom: 20%!important;left: 20%!important;min-height: 240px!important;width: 60%!important;height: auto;";
        this.modalStyle = this.screenWidth >= 680 ? modalStyle : '';
        this.Grades = [
            /*   {"num": 1, "name": "一年级上册"},
             {"num": 2, "name": "一年级下册"},
             {"num": 3, "name": "二年级上册"},
             {"num": 4, "name": "二年级下册"},*/
            {"num": 5, "name": "三年级上册"},
            /*{"num": 6, "name": "三年级下册"},
             {"num": 7, "name": "四年级上册"},
             {"num": 8, "name": "四年级下册"},
             {"num": 9, "name": "五年级上册"},
             {"num": 10, "name": "五年级下册"},
             {"num": 11, "name": "六年级上册"},
             {"num": 12, "name": "六年级下册"}*/
        ];
    }


    mapActionToThis() {
        let ps = this.profileService;
        return {
            fetchClazzList: ps.fetchClazzList.bind(ps),
            fetchWorkList: this.workStatisticsServices.fetchWorkList,
            removeWorkList: this.workStatisticsServices.removeWorkList,
            changeClazz: this.workStatisticsServices.changeClazz,
            changePaginationInfo: this.workStatisticsServices.changePaginationInfo,
            getPaperStatus: this.workStatisticsServices.getPaperStatus,
            selectWork: this.paperService.selectWork,
            changeWorkReportPaperInfo: this.paperService.changeWorkReportPaperInfo,
            updateOralPaperLimitTime: this.workStatisticsServices.updateLimitTimeByOralPaperId,
            deleteOralPaperLimitTime: this.workStatisticsServices.deleteLimitTimeByOralPaperId,
            changeFirstSubmitWorkAfterUpdateFlag: this.profileService.changeFirstSubmitWorkAfterUpdateFlag
        }
    }

    onBeforeEnterView() {
        let fromUrl = this.$stateParams.fromUrl || 'work_list';
    }

    onReceiveProps() {
        this.initCount++;
        this.ensurePageData();
    }

    ensurePageData() {
        this.ensureSelectedClazz();
        this.ensureWorkList();
    }

    /**
     * 保证首次进入ctrl选择班级
     */
    ensureSelectedClazz() {
        //确保选择的班级信息为最新班级列表中的信息
        if (this.clazzList && this.clazzList.length != 0 && !this.selectedClazzInitlized) {
            let clazz,
                currentSelectClazz = this.wl_selected_clazz.id ? _find(this.clazzList, {id: this.wl_selected_clazz.id}) : undefined;
            if (!currentSelectClazz) {
                clazz = this.clazzList[0];
            }
            else {
                clazz = currentSelectClazz;
            }
            this.selectedClazzInitlized = true;
            this.changeClazz(clazz);
            if (clazz.id && this.moreFlagMapForEveryClazz[clazz.id] == undefined) {
                this.moreFlagMapForEveryClazz[clazz.id] = true;
                this.moreFlag = true;
            }
        }
    }

    /**
     * 保证首次进入ctrl加载作业列表
     */
    ensureWorkList() {
        //如果作业列表正在加载或者如果没有选择班级,则return，防止重复加载
        if (!this.wl_selected_clazz || !this.wl_selected_clazz.id || !this.selectedClazzInitlized) return;

        if (!this.workListInitlized) {
            this.workListInitlized = true;
            this.getRootScope().selectedClazz = this.wl_selected_clazz;
            if (!this.$ngRedux.getState().wl_is_worklist_loading) {
                console.warn('================' + '初始化获取');
                let limitQuery;
                this.fetchWorkList(false, this.loadCallback.bind(this), this.wl_selected_clazz, limitQuery);
                if (!this.initCtrl) {
                    this.initCtrl = true
                }
            }
        }
    }

    onBeforeLeaveView() {
        if (this.stopTimer.timer) this.$interval.cancel(this.stopTimer.timer);
        if (this.glitterTimer) this.$timeout.cancel(this.glitterTimer);
        this.isShowTrophyRank = false;
        this.showDiaglog = false;
        this.$ionicSideMenuDelegate.toggleLeft(false);
        //离开当前页面时，cancel由所有当前页发起的请求
        this.workStatisticsServices.cancelRequestDeferList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
    }

    onAfterEnterView() {
        this.glitterFlag = true;
        this.showDiaglog = true;
        this.workListInitlized = false;
        this.getRootScope().studyStateLastStateUrl = this.getStateService().current.name;
        this.commonService.setLocalStorage('studyStateLastStateUrl', this.getRootScope().studyStateLastStateUrl);
        //如果班级列表为空 当前选择班级置为空
        // if (!this.clazzList || this.clazzList.length == 0) {
        //     this.changeClazz();
        //     return;
        // }
        // if (!this.wl_selected_clazz || (this.wl_selected_clazz && !this.wl_selected_clazz.id)) {
        //     this.changeClazz();
        //     return;
        // }
        // this.clazzList.find(item => {
        //     if (item.id === this.wl_selected_clazz.id) {
        //         this.changeClazz(item);
        //         return true;
        //     }
        // })
    }

    back() {
        if (this.getRootScope().showDiagnoseAdDialogFlag) {
            this.getRootScope().showDiagnoseAdDialogFlag = false;
            this.getRootScope().$digest();
        } else if (this.getRootScope().showGameAdDialogFlag) {
            this.getRootScope().showGameAdDialogFlag = false;
            this.getRootScope().$digest();
        } else if (this.isShowTrophyRank) {
            this.isShowTrophyRank = false;
            this.getScope().$digest();
        } else if (this.getRootScope().msgDialogFlag) {
            this.getRootScope().msgDialogFlag = false;
            this.getRootScope().$digest();
        } else if (this.getRootScope().showOralCalculationGuideFlag) {
            this.getRootScope().showOralCalculationGuideFlag = false;
            this.getRootScope().$digest();
        } else {
            this.go('home.study_index', 'back');
        }
    }

    /**
     * 点击班级右滑出班级列表
     */
    showMenu() {
        this.$ionicSideMenuDelegate.toggleLeft();
    }


    /**
     * 去选择班级
     */
    workListSelectClazz(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft(false);
        if (clazz.id === this.wl_selected_clazz.id) return; //如果选择班级和当前选中班级一致就不处理
        this.changeClazz(clazz);
        if (this.moreFlagMapForEveryClazz[clazz.id] != undefined) {
            this.moreFlag = this.moreFlagMapForEveryClazz[clazz.id];

        } else {
            this.moreFlagMapForEveryClazz[clazz.id] = false;
            this.moreFlag = false;
        }

        this.selectedClazzInitlized = false; //ctrl初始化后，是否已经选择过一次班级
        this.workListInitlized = false; //ctrl初始化后，是否已经加载过一次作业列表
        this.getScope().$emit('fetch_competition_info_from_server');
    }

    /**
     *  上拉作业列表加载更多
     */
    fetWorkListWithLoadMore() {
        if (!this.$ngRedux.getState().wl_is_worklist_loading) {
            this.fetchWorkList(true, this.loadCallback.bind(this), this.wl_selected_clazz)
        } else {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        }
    }

    /**
     * 加载作业列表完毕的回调
     * @param loadMore 是否是上划刷新的情况
     * @param loadAllComplete 对应班级下的作业列表是否全部加载完毕
     */
    loadCallback(loadMore, loadAllComplete) {
        this.isShowWorkList(); //判断是否显示作业列表
        this.moreFlag = !loadAllComplete;
        this.$timeout(() => {
            loadMore ?
                this.getScope().$broadcast('scroll.infiniteScrollComplete') :
                this.getScope().$broadcast('scroll.refreshComplete');
        }, 20);
    }

    /**
     * 显示信封具体内容
     * @param correctedStu 当前学生
     * @showType  展示区分  1为学生2为老师3家长
     */
    showPraiseDetail(work, showType, $event) {
        $event.stopPropagation();
        let $scope = this.getScope();
        let workStatisticsServices = this.workStatisticsServices;
        $scope.wData = workStatisticsServices.wData;
        $scope.wData.correctedPraise = {};
        $scope.wData.correctedPraise.work = work;
        $scope.wData.correctedPraise.showType = showType;
        switch (showType) {
            case 1:
                $scope.wData.correctedPraise.showName = this.SHOW_NAME.S;
                break;
            case 2:
                $scope.wData.correctedPraise.showName = this.SHOW_NAME.T;
                break;
            case 3:
                $scope.wData.correctedPraise.showName = this.SHOW_NAME.P;
                break;
            default:
                $scope.wData.correctedPraise.showName = "";
        }
        this.go("work_praise_detail", "forward", {urlFrom: 'home.oral_calculation_work_list'});

    }

    /**
     * 学生去评价反馈
     * @param work 当前作业
     * @param $index 当前试卷在列表中的下标
     */
    goPraise(work, $index, $event) {
        $event.stopPropagation();
        let param = {
            workId: work.paperId,
            workInstanceId: work.instanceId,
            urlFrom: 'home.oral_calculation_work_list'

        };
        work.paperIndex = $index;
        this.selectWork(work);
        this.go("work_praise", 'forward', param);
    }

    getPaperStatusCallBack(param, col, $index, currentServerTime) {
        if (this.wl_selected_work.failMsg) {
            this.commonService.alertDialog(this.wl_selected_work.failMsg, 1500);
            return;
        }
        if (this.wl_selected_work.status == -1) {//表示该作业已经被老师删除
            this.commonService.showAlert('信息提示', '该作业已经被老师删除').then(function () {
                this.workList.splice($index, 1);
            });
            return;
        }
        if (this.wl_selected_work.status < 3) {//1作业还没开始做,2作业部分完成，未提交的问题可以修改
            param = {
                paperId: col.paperInfo.paperId,
                paperInstanceId: col.paperInfo.instanceId,
                redoFlag: 'false', //是否是提交后再进入select_question做题
                urlFrom: 'workList',
                // questionIndex: $index
            };
            col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入selectedWork中
            this.getRootScope().selectQuestionUrlFrom = 'workList';
            this.go("oral_calculation_select_question", "forward", param); //返回做题
            return;
        }
        if (this.wl_selected_work.status == 3) {//作业已提交但未批改
            this.commonService.alertDialog("作业正在批改中", 1500);
            return;
        }
        col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入当前试卷中
        this.getRootScope().selectQuestionUrlFrom = 'detail';
        this.go("oral_calculation_work_detail", "forward", param);
    }

    /**
     * 显示作业明细统计
     */
    showWorkDetail(col, $index) {
        if (this.wl_is_fetch_status_loading) return;
        this.selectWork(col.paperInfo);
        let param = {
            paperId: col.paperInfo.paperId,
            paperInstanceId: col.paperInfo.instanceId
        };
        this.getPaperStatus(param, null, this.getPaperStatusCallBack.bind(this), col, $index);

    };

    /**
     * 下拉刷新作业列表
     */
    pullRefresh() {
        if (!this.$ngRedux.getState().wl_is_worklist_loading) {
            console.warn('================' + '下拉刷新');
            this.fetchWorkList(false, this.loadCallback.bind(this), this.wl_selected_clazz);
        } else {
            this.getScope().$broadcast('scroll.refreshComplete');
        }
    }

    ifShow($index) {
        try {
            if (!this.workList || !this.workList.length) return false;

            let currentItem = this.workList[$index];
            let previousItem = this.workList[$index - 1];
            if ($index == 0) {
                return currentItem.paperInfo.publishType !== 8
            }
            if (previousItem.paperInfo.publishType === 8) return true;
            let currentMonth = currentItem.paperInfo.publishTimeDate.split('-')[1];
            let previousMonth = previousItem.paperInfo.publishTimeDate.split('-')[1];
            return currentMonth != previousMonth;
        } catch (err) {
        }
    }

    getMonth(listItem) {
        try {
            return Number(listItem.paperInfo.publishTimeDate.split('-')[1]);
        } catch (err) {
            console.error('作业列表分月信息解析失败', err);
        }
    }

    alertInfo() {
        this.commonService.showAlert(
            '自学班能干什么？',
            `<p>自学班仅用于个人自学，可以玩速算（免费）、诊断提分（免费模式）、魔力闯关等版块。</p>
             <p>要想做作业，须加入数学老师开通的智算365班级，请推荐数学老师使用智算365。</p>`
        )
    }

    signWork(listItem, $event) {
        $event.stopPropagation();
        listItem.selected = !listItem.selected;
        if (listItem.selected) {
            this.showDeleteBarFlag = true;
        }
        let flag = _find(this.workList, {selected: true});
        if (!flag) this.showDeleteBarFlag = false;
    }

    showHomeDiagnoseAds() {
        this.getRootScope().showGameAdDialogFlag = false;
        this.getRootScope().showDiagnoseAdDialogFlag = true;
        this.getRootScope().firstShowDignoseAdDialog = true;
    }

    /**
     * 全部掌握的作业，随机显示四种中的一种鼓励语
     * @param paperInfo
     * @returns {string}
     */
    getReportBtnBg(paperInfo) {
        let classStr = 'work-report-btn-bg' + paperInfo.masterStatus;
        if (paperInfo.masterStatus == 4) {
            classStr += paperInfo.instanceId.match(/\d/)[0] % 4;
        }
        return classStr;
    }

    /**
     * 是否有口算作业
     */
    isShowWorkList() {
        if (!this.workList) {
            this.isShowWorkListFlag = false;
            return;
        }
        let hasOralWork = false;
        let hasWork = true;
        let oralWorkCount = 0;
        angular.forEach(this.workList, (work) => {
            if (work.paperInfo.publishType == this.finalData.WORK_TYPE.ORAL_WORK || work.paperInfo.publishType == this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD) {
                oralWorkCount++;
            }
        });
        if (oralWorkCount > 0) {
            hasOralWork = true;
        }
        if (oralWorkCount == this.workList.length) {
            hasWork = false;
        }
        if (hasOralWork || hasWork && this.workList.length > 0) {
            this.isShowWorkListFlag = true;
        } else {
            this.isShowWorkListFlag = false;
        }
    }

    /**
     * 口算作业：点击轮播图显示口算广告
     */
    clickOralActivePage() {
        this.getRootScope().showOralCalculationGuideFlag = true;
    }

    showTimer(listItem) {
        return listItem.paperInfo.limitTime != -1 && this.oralLimittimes
            && this.oralLimittimes[listItem.paperInfo.paperId]
            && this.oralLimittimes[listItem.paperInfo.paperId].countDownTimer
            && listItem.paperInfo.status == 2
    }
}










