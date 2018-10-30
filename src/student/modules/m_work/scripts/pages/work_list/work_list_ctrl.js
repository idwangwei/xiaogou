/**
 * Author 邓小龙 on 2015/9/15.
 * @description 作业列表
 */
import _find from 'lodash.find';
import _values from 'lodash.values';
import {Inject, View, Directive, select} from '../../module';

@View('home.work_list', {
    url: '/work_list/:needUpdate/:fromUrl',
    template: require('./work_list.html'),
    views: {
        "study_index": {
            template: require('./work_list.html')
        }
    },
    styles: require('./work_list.less'),
    inject: ['$scope'
        , '$state'
        , '$stateParams'
        , 'workStatisticsServices'
        , 'commonService'
        , 'profileService'
        , '$ngRedux'
        , 'pageRefreshManager'
        , '$ionicPopup'
        , 'paperService'
        , '$ionicTabsDelegate'
        , '$timeout'
        , 'finalData'
        , '$ionicSideMenuDelegate'
        , 'subHeaderService'
        , 'dateUtil'
        , 'pageRefreshManager'
        , '$rootScope'
        , '$ionicSlideBoxDelegate'
        , '$ionicTabsDelegate'
        , '$ionicPopover'
        , '$ionicScrollDelegate'
        , 'homeInfoService'
        , '$ionicPopover'
        , '$ionicHistory'
        , '$ionicModal'
        , 'olympicMathService'
        , '$interval']
})

class WorkListCtrl {
    constructor() {
        this.initFlags();
        this.initData();
        this.initTimeSelect();
    }

    timeCountCallBack(item) {
        let markFlag=(item.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS||item.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION)
        let paperTime = Number(!markFlag ?
            this.oralLimittimes[item.paperId] : this.finalAccessLimittimes[item.paperId]
        );
        if (paperTime && !paperTime.countDownTimer) {
            this.updateOralPaperLimitTime(item.paperId, null, this.stopTimer.timer);
        }
    }

    getCountDownStartTime(item) {
        let markFlag=(item.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS||item.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION)
        let paperTime = !markFlag ?
            this.oralLimittimes[item.instanceId] : this.finalAccessLimittimes[item.instanceId];
        if (!paperTime || paperTime && !paperTime.startTime) return 0;
        this.stopTimer.timer = paperTime.countDownTimer;
        let lastTime = Number(item.limitTime) * 60 - Math.round((Number(new Date().getTime()) - Number(paperTime.startTime)) / 1000);
        if (lastTime < 0) lastTime = 0;
        return lastTime;
    }

    timeEndCallBack(item) {
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
        this.initCModal = false;//是否已初始化modal
        this.initGradeFlag = false;
        this.showDiaglog = true;
        this.isVip = false;
        this.initCtrl = false;
        this.glitterFlag = false;
        this.showMsgButnFlag = false;
        this.stopTimer = {};
        this.isShowWorkListFlag = true;
        this.isFinalAccess = this.$stateParams.fromUrl && this.$stateParams.fromUrl.indexOf(this.finalData.URL_FROM.FINAL_ACCESS) > -1; //当前作业列表为期末测评
        this.isAreaEvaluation = this.$stateParams.fromUrl && this.$stateParams.fromUrl.indexOf(this.finalData.URL_FROM.AREA_EVALUATION) > -1; //当前作业列表为区域测评
        this.isFinalAccessStart = [];
        this.isOralWorkList = false;

        // this.finalAccessWorkList = [
        //     {
        //         "instanceId": "88998592-cc77-4be0-8a01-57eaceb4e8b8",
        //         "paperInfo": {
        //             "publishWeek": "",
        //             "publishType": 13,
        //             "showCss": "default-work-item",
        //             "publishTimeDate": "2017-12-08",
        //             "detailPublishTime": 1512699003000,
        //             "showTime": "2017-12-08  ",
        //             "instanceId": "88998592-cc77-4be0-8a01-57eaceb4e8b8",
        //             "paperId": "3bf30e1e-a6f0-4dfe-8cdb-888c72d92aae",
        //             "paperName": "小熊购物1-培优",
        //             "processName": "正确率",
        //             "worthScore": 100,
        //             "score": 0,
        //             "latestScore": 0,
        //             "processBar": "0.0%",
        //             "status": 2,
        //             "statusVo": "未提交",
        //             "encourage": {"eeb2b572-26fe-4429-aaf8-5c9951a5a32a": []},
        //             "img": "msg/default_cup.png",
        //             "studentPraise": null,
        //             "teacherPraise": null,
        //             "parentPraise": null,
        //             "masterNum": 0,
        //             "masterStatus": 0,
        //             "questionCount": 0,
        //             "limitTime": 0,
        //             "isFree": true,
        //             "startTime": "2017-12-22 00:00:00",//
        //             "limit": 30,//
        //             "systemTime": "2017-12-21 14:15:22", //
        //         },
        //         "canFetchPaper": true,
        //         "canFetchDoPaper": true
        //     }
        //
        // ];

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

    mapStateToThis(state) {
        let userId = state.profile_user_auth.user.userId;
        let clzId = (state.work_list_route && state.work_list_route.urlFrom) === 'olympic_math_t' ?
            state.olympic_math_selected_clazz.id
            : (state.work_list_route && state.work_list_route.urlFrom) === 'olympic_math_s' ? userId : state.wl_selected_clazz.id;
        let trophy_selected_time = state.trophy_selected_time;
        let stateKey = clzId + "#" + trophy_selected_time.startTime + "|" + trophy_selected_time.endTime;
        let trophyRankData = state.clazz_year_with_trophy_rank[stateKey];
        let workList = (state.work_list_route && state.work_list_route.urlFrom) === 'olympic_math_s' ?
            state.wl_clazz_list_with_works[userId] : state.wl_clazz_list_with_works[clzId];
        let clazzList = state.profile_clazz.passClazzList;
        let newClazzList = [];
        if (state.work_list_route && state.work_list_route.urlFrom === 'olympic_math_t') {
            angular.forEach(clazzList, (item)=> {
                if (item.type === 200) newClazzList.push(item);
            });
        } else {
            angular.forEach(clazzList, (item)=> {
                if (item.type != 200) newClazzList.push(item);
            });
        }
        let vips = state.profile_user_auth.user.vips;
        let olympicVip = null;
        angular.forEach(vips, (item, key)=> {
            if (item['mathematicalOlympiad']) olympicVip = item['mathematicalOlympiad'];
        });
        let pId = state.wl_selected_work.instanceId;
        let finalAccessPaperTime = state.oral_calculation_limittime[pId];
      /*  if(state.work_list_route.urlFrom=="area_evaluation"&&workList){
            workList.sort((a,b)=>{
                return a.paperInfo.startTime<b.paperInfo.startTime?1:-1
            })
        }*/
        return {
            olympicMathSelectedGrade: state.olympic_math_selected_grade,
            userName: state.profile_user_auth.user.name,
            userId: userId,
            clazzList: newClazzList,
            selfStudyClazzList: state.profile_clazz.selfStudyClazzList,
            wl_selected_clazz: state.wl_selected_clazz,
            wl_pagination_info: state.wl_pagination_info,
            workList: workList, //已发布作业列表
            workListLen: workList ? workList.length : 0, //已发布作业列表
            wl_is_worklist_loading: state.wl_is_worklist_loading,
            wl_selected_work: state.wl_selected_work,
            wl_is_fetch_status_loading: state.wl_is_fetch_status_loading,
            onLine: state.app_info.onLine,
            isTrophyLoading: state.fetch_trophy_rank_data_processing,
            trophyRankData: trophyRankData,
            stateUrlFrom: state.work_list_route.urlFrom,
            olympicVip: olympicVip,
            olympicMathSelectedClazz: state.olympic_math_selected_clazz,
            teacherCreateMsgInfo: state.teacher_create_msg_info,
            oralLimittimes: state.oral_calculation_limittime,
            finalAccessLimittimes: state.final_access_limittime,
            vips: vips,
            isFirstSubmitWorkAfterUpdate: state.first_submit_work_after_update,
            finalAccessPaperTime: finalAccessPaperTime
        };
    }

    mapActionToThis() {
        let ps = this.profileService;
        let his = this.homeInfoService;
        let olympicMathService = this.olympicMathService;
        return {
            fetchClazzList: ps.fetchClazzList.bind(ps),
            fetchWorkList: this.workStatisticsServices.fetchWorkList,
            removeWorkList: this.workStatisticsServices.removeWorkList,
            changeClazz: this.workStatisticsServices.changeClazz,
            changePaginationInfo: this.workStatisticsServices.changePaginationInfo,
            getFinishVacationMessages: this.workStatisticsServices.getFinishVacationMessages,
            getPaperStatus: this.workStatisticsServices.getPaperStatus,
            selectWork: this.paperService.selectWork,
            fetchTrophyData: his.fetchTrophyRankData.bind(his),
            changeTrophyTime: his.changeTrophyTime.bind(his),
            deleteSelfTrainWork: this.workStatisticsServices.deleteSelfTrainWork,
            fetchOlympicMathVips: this.workStatisticsServices.fetchOlympicMathVips.bind(this),
            changeGrade: olympicMathService.changeGrade.bind(olympicMathService),
            changeWorkReportPaperInfo: this.paperService.changeWorkReportPaperInfo,
            saveTeacherMsg: this.profileService.saveTeacherMsgInfo,
            updateOralPaperLimitTime: this.workStatisticsServices.updateLimitTimeByOralPaperId,
            deleteOralPaperLimitTime: this.workStatisticsServices.deleteLimitTimeByOralPaperId,
            changeFirstSubmitWorkAfterUpdateFlag: this.profileService.changeFirstSubmitWorkAfterUpdateFlag
        }
    }

    onBeforeEnterView() {
        let fromUrl = this.$stateParams.fromUrl || 'work_list';
        // this.isOralWorkList = fromUrl.indexOf(this.finalData.URL_FROM.ORAL_WORK) > -1; //是否显示口算作业
    }

    onReceiveProps() {
        this.initCount++;
        this.isVip = !!_find(_values(this.olympicVip), (v)=> {
            return v > -1
        });
        this.isFinalAccess = this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.FINAL_ACCESS) > -1; //当前作业列表为期末测评
        this.isAreaEvaluation = this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.AREA_EVALUATION) > -1; //当前作业列表为区域测评

        this.ensurePageData();
    }

    ensurePageData() {
        if (!this.initCModal) {
            this.initCModal = true;
            //todo:默认年级，没有购买就默认他的班级所属年级
            let findGrade = _find(this.Grades, {num: 5});
            this.changeGrade(findGrade);
            /*由于期末冲刺 所有要清空一下list*/
            this.removeWorkList(this.getSelectedClazz().id)
        }
        if (this.isComeFromOlympicMathTeacher()) {
            this.ensureWorkListForOlympicMathTeacher();
            return;
        }
        if (this.isFromSelfTrain()) {
            this.ensureWorkListForOlympicMathSelf();
            return;
        }
        this.ensureSelectedClazz();
        this.ensureWorkList();

    }

    isComeFromOlympicMath() {
        return (this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH) > -1)
    }

    isComeFromOlympicMathTeacher() {
        return (this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH_T) > -1)
    }

    isFromSelfTrain() {
        return this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH_S) > -1;
    }

    getSelectedClazz() {
        if (this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH_T) > -1)
            return this.olympicMathSelectedClazz;
        else if (this.isFromSelfTrain())
            return {id: this.userId};
        return this.wl_selected_clazz;
    }

    onUpdate() {
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
        if (!this.wl_selected_clazz || !this.wl_selected_clazz.id || !this.selectedClazzInitlized)return;

        if (!this.workListInitlized) {
            this.workListInitlized = true;
            this.getRootScope().selectedClazz = this.wl_selected_clazz;
            if (!this.$ngRedux.getState().wl_is_worklist_loading) {
                console.warn('================' + '初始化获取');

                let limitQuery;
                this.fetchWorkList(false, this.loadCallback.bind(this), this.wl_selected_clazz, limitQuery);
                this.initShowMsgFromTeacherFlag();
                if (!this.initCtrl) {
                    this.initCtrl = true
                }
            }
        }
    }

    /**
     * 保证首次进入ctrl加载作业列表  针对奥数来自于教师的作业
     */
    ensureWorkListForOlympicMathTeacher() {
        //如果作业列表正在加载或者如果没有选择班级,则return，防止重复加载
        if (!this.olympicMathSelectedClazz || !this.olympicMathSelectedClazz.id || this.selectedClazzInitlized)return;

        if (!this.workListInitlized) {
            this.workListInitlized = true;
            this.getRootScope().selectedClazz = this.olympicMathSelectedClazz;
            if (!this.$ngRedux.getState().wl_is_worklist_loading) {
                console.warn('================' + '奥数初始化获取');

                this.fetchWorkList(false, this.loadCallback.bind(this), this.getSelectedClazz())
            }
        }
    }

    /**
     * 保证首次进入ctrl加载作业列表  针对奥数来自于自主训练的作业
     */
    ensureWorkListForOlympicMathSelf() {

        if (!this.workListInitlized) {
            this.workListInitlized = true;
            if (!this.$ngRedux.getState().wl_is_worklist_loading) {
                console.warn('================' + '奥数自主训练初始化获取');

                this.fetchWorkList(false, this.loadCallback.bind(this), this.getSelectedClazz())
            }
        }
    }

    onBeforeLeaveView() {
        if (!this.isFinalAccess&&!this.isAreaEvaluation && this.stopTimer.timer) this.$interval.cancel(this.stopTimer.timer);
        if (this.glitterTimer) this.$timeout.cancel(this.glitterTimer);
        this.isShowTrophyRank = false;
        this.showDiaglog = false;
        this.$ionicSideMenuDelegate.toggleLeft(false);
        //离开当前页面时，cancel由所有当前页发起的请求
        this.workStatisticsServices.cancelRequestDeferList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        // angular.forEach(this.$ionicSideMenuDelegate._instances, instance=>instance.close());
    }

    onAfterEnterView() {
        let fromUrl = this.stateUrlFrom || 'work_list';
        // this.isOralWorkList = fromUrl.indexOf(this.finalData.URL_FROM.ORAL_WORK) > -1; //是否显示口算作业
        this.glitterFlag = true;
        this.showDiaglog = true;
        this.workListInitlized = false;
        if (this.wl_selected_clazz.id)
            this.initShowMsgFromTeacherFlag();
        this.getRootScope().studyStateLastStateUrl = this.getStateService().current.name;

        this.commonService.setLocalStorage('studyStateLastStateUrl', 'home.work_list');
        // if (this.$ionicHistory.backView() && (this.$ionicHistory.backView().stateName === 'select_question')) {//如果改错返回就刷新一次
        //     this.selectedClazzInitlized = true;
        //     this.pullRefresh();
        // }
        if (!this.isComeFromOlympicMath()) {//不是来自奥数的时候，会涉及到班级刷新
            //如果班级列表为空 当前选择班级置为空
            if (!this.clazzList || this.clazzList.length == 0) {
                this.changeClazz();
                return;
            }
            if (!this.wl_selected_clazz || (this.wl_selected_clazz && !this.wl_selected_clazz.id)) {
                this.changeClazz();
                return;
            }
            this.clazzList.find(item => {
                if (item.id === this.wl_selected_clazz.id) {
                    this.changeClazz(item);
                    return true;
                }
            })
        } else {
            this.$ionicSideMenuDelegate.canDragContent(false);//来自班级的时候，禁止划动
        }

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
            if (this.isComeFromOlympicMath()) {
                this.backOlympicMathHome();
                return;
            }
            this.go('home.study_index', 'back');
        }
    }

    backOlympicMathHome() {
        this.go('home.olympic_math_home', 'back');
    }

    /**
     * 点击班级右滑出班级列表
     */
    showMenu() {
        // if (this.wl_selected_clazz.type === 900) return;
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    goStuSituation() {
        let flag = this.isFromSelfTrain();
        if ((this.olympicMathSelectedClazz && this.olympicMathSelectedClazz.id) || flag) {
            this.go('personal-math', 'forward', {from: flag ? 'from-self' : 'from-teacher'});
            return;
        }
        this.getScope().$emit('diagnose.dialog.show', {
            'comeFrom': 'olympic-math',
            'title': '温馨提示',
            'content': '你没有加入奥数班级，暂时没有个人学情。'
        });
    }


    /**
     * 去选择班级
     */
    workListSelectClazz(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft(false);
        if (clazz.id === this.wl_selected_clazz.id)  return; //如果选择班级和当前选中班级一致就不处理
        this.changeClazz(clazz);
        this.initShowMsgFromTeacherFlag();
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
            console.warn('================' + '上拉加载');

            this.fetchWorkList(true, this.loadCallback.bind(this), this.getSelectedClazz())
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
        this.$timeout(()=> {
            loadMore ?
                this.getScope().$broadcast('scroll.infiniteScrollComplete') :
                this.getScope().$broadcast('scroll.refreshComplete');
        }, 20);

        //回到work_list页面之前提交了试卷，随机（1/4）概率显示去诊断的提示框
        if (this.getRootScope().isAfterSubmitPaperBackToWorkList && !this.isComeFromOlympicMath()) {//奥数提交作业后，不应该开通诊断
            //用户是否开通了诊断提分
            let vipDiagnose = _find(this.vips, (v)=> {
                return v.hasOwnProperty('raiseScore') ||
                    v.hasOwnProperty('raiseScore2') ||
                    v.hasOwnProperty('raiseScore2Key');
            });

            this.getRootScope().isAfterSubmitPaperBackToWorkList = false;
            /*if (this.isFirstSubmitWorkAfterUpdate) { //不需要这个逻辑了
             this.getRootScope().showDiagnoseGuide = !vipDiagnose;
             this.changeFirstSubmitWorkAfterUpdateFlag();
             } else {*/
            this.getRootScope().showDiagnoseGuide = !vipDiagnose && Number(Math.random() * 4 + 1).toFixed() === '3';
            // }
        }

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
        let $state = this.$state;
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
        this.go("work_praise_detail", "forward");

    }

    /**
     * 学生去评价反馈
     * @param work 当前作业
     * @param $index 当前试卷在列表中的下标
     */
    goPraise(work, $index, $event) {
        if (this.isComeFromOlympicMathTeacher() && !this.isVip && !work.isFree) {
            this.goToPay();
            return;
        }

        $event.stopPropagation();
        let param = {
            workId: work.paperId,
            workInstanceId: work.instanceId
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

        //期末测评作业
        if (col.paperInfo.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS||col.paperInfo.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION) {
            //测评时间已过
            let systemTime = Date.parse(col.paperInfo.systemTime.replace(/-/g, '/')),
                localNowTime = currentServerTime || new Date().getTime(),
                endTime = Date.parse(col.paperInfo.endTime.replace(/-/g, '/')),
                startTime = Date.parse(col.paperInfo.startTime.replace(/-/g, '/'));
            //测评时间未到
            if (currentServerTime < startTime && col.paperInfo.status == 1) {
                this.commonService.showAlert('温馨提示', '<p style="text-align: center">试卷按时开启之后，才可以答题！</p>');
                return
            }

            if ((col.paperInfo.status == 1 && (systemTime > endTime || localNowTime > endTime)) //没点开过的试卷，超时不能再做
                || (col.paperInfo.status == 2 && !this.finalAccessLimittimes[col.paperInfo.paperId] && (systemTime > endTime || localNowTime > endTime)) //点开后没有计时的试卷，超时也不能再做(点开后已经开始计时，超时后还可以做)
            ) {
                this.commonService.showAlert('温馨提示', '<p style="text-align: center">答题时间已过，无法作答！</p>');
                return
            }
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
            this.go("select_question", "forward", param); //返回做题
            return;
        }
        if (this.wl_selected_work.status == 3) {//作业已提交但未批改
            this.commonService.alertDialog("作业正在批改中", 1500);
            return;
        }
        col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入当前试卷中
        this.getRootScope().selectQuestionUrlFrom = 'detail';


        if (this.isComeFromOlympicMath())
            this.go("olympic_math_work-detail", "forward", param);
        else if (col.paperInfo.publishType == 8) {
            this.go("competition_work_detail", "forward", param);
        }
        else {
            this.go("work_detail", "forward", param);
        }
    }

    /**
     * 显示作业明细统计
     */
    showWorkDetail(col, $index) {
        if (this.wl_is_fetch_status_loading) return;
        if (this.isComeFromOlympicMathTeacher() && !this.isVip && !col.paperInfo.isFree) {
            this.goToPay();
            return;
        }

        // let commonService = this.commonService;
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

            this.fetchWorkList(false, this.loadCallback.bind(this), this.getSelectedClazz());
        } else {
            this.getScope().$broadcast('scroll.refreshComplete');
        }
        if (this.getRootScope().hasCompetition) {
            this.getScope().$emit("fetch_competition_info_from_server");//刷新竞赛试卷信息
        }
    }

    /**
     * 显示作业预告
     * @param work
     */
    showWorkNotice(work, event) {
        event.stopPropagation();
        if (work.nextPublishTime) {
            let showStr = "下次作业将于" + work.nextPublishTime + "发布";
            this.commonService.showAlert("温馨提示", showStr);
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
            return Number((listItem.paperInfo.publishTimeDate || "").split('-')[1]);
        } catch (err) {
            console.error('作业列表分月信息解析失败', err);
        }
    }

    /**
     * 判断作业是否为寒假||暑假作业
     * @param list
     * @returns {boolean}
     */
    isPpecialWork(list) {
        return list.publishType === this.finalData.WORK_TYPE.SUMMER_WORK
            || list.publishType === this.finalData.WORK_TYPE.WINTER_WORK;
    }
    isSpecialWork(list) {
        return list.publishType === this.finalData.WORK_TYPE.SUMMER_WORK
            || list.publishType === this.finalData.WORK_TYPE.WINTER_WORK
            || list.publishType === this.finalData.WORK_TYPE.PERSONAL_QB;
    }

    isSummerHolidayHomework(list) {
        return list.publishType === this.finalData.WORK_TYPE.SUMMER_WORK;
    }

    isWinterHolidayHomework(list) {
        return list.publishType === this.finalData.WORK_TYPE.WINTER_WORK;
    }


    /**
     * 显示作业奖杯排行榜
     */
    showStuTrophyRank() {
        this.getTrophyRankData();
        this.isShowTrophyRank = true;
    }

    initTimeSelect() {
        this.termData = {nowTerm: {}, terms: []};   //本学年，选择学年
        this.START_YEAR = 2015;                  //起始年份
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (1 <= month && month < 9) {
            year = year - 1;
        }
        // this.termData.nowTerm = {name:(year) + '-' + (year + 1) + ' 学年',value:0};
        for (var i = this.START_YEAR, j = 0; i <= year; i++, j++) {
            var temp = (i) + '-' + (i + 1) + ' 学年';
            // this.termData.terms.push(temp);
            this.termData.terms.push({name: temp, value: j});
        }
        let itm = this.termData.terms[this.termData.terms.length - 1];
        this.termData.nowTerm = {
            name: itm.name,
            value: itm.value
        };
        let selectTime = _find(this.termData.terms, {value: this.termData.nowTerm.value}) || {};
        this.startTime = selectTime.name.substring(0, 4) + '-09-01';//this.termData.nowTerm.value.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(selectTime.name.substring(0, 4)) + 1) + '-08-31';//(parseInt(this.termData.nowTerm.value.substring(0, 4)) + 1) + '-08-31';
    }

    /**
     * 获取奖杯排行榜数据
     */
    getTrophyRankData = (value)=> {
        value = value || this.termData.terms.length - 1;
        let selectedClazz = this.getSelectedClazz();
        if (!selectedClazz || !selectedClazz.id) {
            return;
        }
        if (this.$ngRedux.getState().fetch_trophy_rank_data_processing) {
            return;
        }
        // let selectTime =  _find(this.termData.terms, {value: this.termData.nowTerm.value})||{};
        let selectTime = _find(this.termData.terms, {value: value}) || {};
        this.startTime = selectTime.name.substring(0, 4) + '-09-01';//this.termData.nowTerm.value.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(selectTime.name.substring(0, 4)) + 1) + '-08-31';//(parseInt(this.termData.nowTerm.value.substring(0, 4)) + 1) + '-08-31';
        this.changeTrophyTime(this.startTime, this.endTime);

        let param = {
            startTime: this.startTime,
            endTime: this.endTime,
            clazzId: selectedClazz.id,
            stateKey: selectedClazz.id + "#" + this.startTime + "|" + this.endTime,
            scope: this.getScope()
        };
        this.fetchTrophyData(param);
        this.$ionicScrollDelegate.scrollTop(true);
    }

    /**
     * 点击奖杯排行榜外的灰色区域关闭排行榜
     * @param event
     */
    closeTrophyRankData(event) {
        if ($(event.target).hasClass('work-backdrop'))
            this.isShowTrophyRank = false;
    }

    alertInfo() {
        this.commonService.showAlert(
            '自学班能干什么？',
            `<p>自学班仅用于个人自学，可以玩速算（免费）、诊断提分（免费模式）、魔力闯关等版块。</p>
             <p>要想做作业，须加入数学老师开通的智算365班级，请推荐数学老师使用智算365。</p>`
        )
    }


    showDeleteIcon() {
        this.showDeleteFlag = !this.showDeleteFlag;
        if (!this.showDeleteFlag) {
            angular.forEach(this.workList, (item)=> {
                item.selected = false;
            });
            this.showDeleteBarFlag = false;
        }
    }

    goToPay(goToCreatePaperFlag) {
        let diaglogCallback = ()=> {
            this.go('wp_good_select', {urlFrom: 'olympic_math_work_list'});
        };
        // let content=goToCreatePaperFlag?'付费后才能自己组卷练习，要开通三年级上册的奥数权限吗? ':'马上激活'+this.olympicMathSelectedGrade.name+'的奥数权限，就能完成该任务!';
        let content = '马上激活' + this.olympicMathSelectedGrade.name + '的奥数权限，就能完成该任务!';
        this.getScope().$emit('diagnose.dialog.show', {
            'showType': 'confirm',
            'comeFrom': 'olympic-math',
            'content': content,
            'confrimBtnText': '去激活',
            'cancelBtnText': '再看看',
            'confirmCallBack': diaglogCallback
        });
    }

    createPaper() {
        let callback = (data)=> {
            // if(data&&data[this.olympicMathSelectedGrade.num]>0){
            //     this.go('organize-paper','forward');
            // }else{
            //    this.goToPay(true);
            // }
        };
        this.fetchOlympicMathVips(callback.bind(this));
        this.go('organize-paper', 'forward');
    }

    signWork(listItem, $event) {
        $event.stopPropagation();
        listItem.selected = !listItem.selected;
        if (listItem.selected) {
            this.showDeleteBarFlag = true;
        }
        let flag = _find(this.workList, {selected: true});
        if (!flag)  this.showDeleteBarFlag = false;
    }

    deleteCallback() {
        angular.forEach(this.workList, (item)=> {
            item.selected = false;
        });
        this.showDeleteBarFlag = false;
        this.showDeleteFlag = false;
    }

    deleteWork() {
        let callback = ()=> {
            let instanceIds = [];
            angular.forEach(this.workList, (item)=> {
                if (item.selected) instanceIds.push(item.instanceId);
            });
            if (instanceIds.length)
                this.deleteSelfTrainWork(instanceIds, this.workList, this.deleteCallback.bind(this));
        };
        this.getScope().$emit('diagnose.dialog.show', {
            'showType': 'confirm',
            'comeFrom': 'olympic-math',
            'content': '您确定要删除这些作业吗？',
            'confirmCallBack': callback
        });
    }

    showCompetitionAd() {
        this.getRootScope().showCompetitionAdFlag = true;
        this.getRootScope().isShowSeeBtnFlag = false;
    }

    showHomeDiagnoseAds() {
        this.getRootScope().showGameAdDialogFlag = false;
        this.getRootScope().showDiagnoseAdDialogFlag = true;
        this.getRootScope().firstShowDignoseAdDialog = true;
    }

    clickActivePage() {
        let index = this.$ionicSlideBoxDelegate.$getByHandle('work-list-slide-box').currentIndex();
        let len = this.$ionicSlideBoxDelegate.$getByHandle('work-list-slide-box').slidesCount();
        len = Number(len);
        if (index % len == 0) {
            // this.showHomeDiagnoseAds();
            this.showStuTrophyRank();
        } else if (index % len == 1) {
            this.showStuTrophyRank();
        }
        // else if(index % len == 2){
        //     this.clickOralActivePage();
        // }
        else {
            this.showCompetitionAd();
        }
    }

    gotoWorkReport(item, $event) {
        if (typeof $event === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        if(item.paperInfo.publishType==21) return;
        
        let paperInfo = {
            paperId: item.paperInfo.paperId,
            instanceId: item.instanceId,
            paperName: item.paperInfo.paperName,
            totalScore: item.paperInfo.worthScore,
            publishType: item.paperInfo.publishType
        };
        this.changeWorkReportPaperInfo(paperInfo);
        this.go("work_report", "forward");
        // this.go("select_question", "forward", param); //返回做题
    }

    showReportFlag(listItem, index) {
        if (listItem.paperInfo.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS||listItem.paperInfo.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION) {
            return true
        }
        return listItem.paperInfo.publishType != 4
            && listItem.paperInfo.publishType != 5
            && listItem.paperInfo.publishType != 8
            && listItem.paperInfo.publishType != 10 && this.workListLen > 2;
    }


    getWorkClass(listItem) {
        let className = listItem.paperInfo.showCss ? listItem.paperInfo.showCss : "";
        className += listItem.paperInfo.status != 4 || (!this.showReportFlag(listItem)) ?
            ((listItem.paperInfo.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS||listItem.paperInfo.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION  || listItem.paperInfo.publishType == this.finalData.WORK_TYPE.ORAL_WORK || listItem.paperInfo.publishType == this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD) ? ' ' : ' my-work-item-no-btn')
            : ' my-work-item-has-btn';
        className += this.isSummerHolidayHomework(listItem.paperInfo) ? ' summer-work-item' : ''; //暑假作业样式
        return className;
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

    initShowMsgFromTeacherFlag() {
        if (this.isOralWorkList)return;

        let createTime = -1;
        //请求最新老师发的信
        this.profileService.getMsgFormTeacher(this.wl_selected_clazz.id).then((data)=> {
            if (!data || data && data.code != 200 || data && data.functions.length == 0) this.showMsgButnFlag = false;
            else this.showMsgButnFlag = true;
            angular.forEach(data.functions, (v, k)=> {
                if (data.functions[k].function == "promotion") {
                    createTime = data.functions[k].version;
                }
            });
            if (createTime != -1 && createTime != this.teacherCreateMsgInfo.createTime&&!this.isAreaEvaluation) {//不一样则显示；然后修改本地数据
                this.showMsgFromTeacher();
                this.saveTeacherMsg(createTime);
            }
        });
    }

    /**
     * 显示来自老师的信息弹出框
     */
    showMsgFromTeacher() {
        this.glitterTimer = this.$timeout(()=> {
            this.glitterFlag = false;
            this.$timeout.cancel(this.glitterTimer);
        }, 2000);

        this.getRootScope().msgDialogFlag = true;
    }

    /**
     * 是否是口算作业
     * @param list
     * @returns {boolean}
     */
    isOralHomework(list) {
        return list.publishType === this.finalData.WORK_TYPE.ORAL_WORK || list.publishType === this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD;
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
        angular.forEach(this.workList, (work)=> {
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

        if ((this.isOralWorkList && hasOralWork) || (!this.isOralWorkList && hasWork) && this.workList.length > 0) {
            this.isShowWorkListFlag = true;
        } else {
            this.isShowWorkListFlag = false;
        }

        // this.isShowWorkListFlag = this.workList.length > 0;
    }

    /**
     * 口算作业：点击轮播图显示口算广告
     */
    clickOralActivePage() {
        this.getRootScope().showOralCalculationGuideFlag = true;
    }

    showCorrectWorkType(listItem) {
        let isNormal = !this.isOralWorkList
            && listItem.paperInfo.publishType != this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
            && listItem.paperInfo.publishType != this.finalData.WORK_TYPE.ORAL_WORK
            && listItem.paperInfo.publishType != this.finalData.WORK_TYPE.MATCH_WORK;
        let isOral = this.isOralWorkList
            && (listItem.paperInfo.publishType == this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
            || listItem.paperInfo.publishType == this.finalData.WORK_TYPE.ORAL_WORK);

        return isNormal || isOral;
    }

    showTimer(listItem) {
        if (listItem.paperInfo.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS||listItem.paperInfo.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION) {
            return listItem.paperInfo.limitTime != -1 && this.finalAccessLimittimes
                && this.finalAccessLimittimes[listItem.paperInfo.paperId]
                && this.finalAccessLimittimes[listItem.paperInfo.paperId].countDownTimer
                && listItem.paperInfo.status == 2

        }

        return listItem.paperInfo.limitTime != -1 && this.oralLimittimes
            && this.oralLimittimes[listItem.paperInfo.paperId]
            && this.oralLimittimes[listItem.paperInfo.paperId].countDownTimer
            && listItem.paperInfo.status == 2
    }

    getFinalAccessCountDownStartTime(paperInfo) {
        let countDownTimes = 0, systemTime, startTime;
        if (paperInfo.systemTime && paperInfo.startTime) {
            systemTime = paperInfo.systemTime.replace(/-/g, '/');
            startTime = paperInfo.startTime.replace(/-/g, '/');
            countDownTimes = Date.parse(startTime) - Date.parse(systemTime);
        }
        return Math.floor(countDownTimes / 1000);
    }

    finalAccessStart() {
        this.isFinalAccessStart[arguments[0]] = true;
    }
 /*   areaEvaluationStart() {
        this.isAreaEvaluationStart = true;
    }*/

    /**
     * 返回测评试卷做题时间段
     * @param listItem
     * @returns {string}
     */
    showTimeStr(listItem) {
        if (!listItem.paperInfo.endTime) {
            return listItem.paperInfo.startTime
        }
        return listItem.paperInfo.startTime.replace(/^(.+):\d{2}$/, "$1")
            + '-'
            + listItem.paperInfo.endTime.replace(/.+(\d{2}:\d{2}):\d{2}/, "$1")
    }
}