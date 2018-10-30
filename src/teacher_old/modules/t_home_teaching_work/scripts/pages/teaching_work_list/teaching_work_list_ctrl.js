/**
 * Author ww on 2016/9/28.
 * @description 作业列表controller
 */
import _find from 'lodash.find';

import {Inject, View, Directive, select} from '../../module';

@View('home.work_list', {
    url: '/work_list/:category/:workType/:refresh',
    styles: require('./teaching_work_list.less'),
    views: {
        "work_list": {
            template: require('./teaching_work_list.html')
        }
    },
    inject: ['$state',
        '$scope',
        '$rootScope',
        '$ionicLoading',
        '$ngRedux',
        '$ionicScrollDelegate',
        '$timeout',
        '$ionicSideMenuDelegate',
        '$ionicSlideBoxDelegate',
        'finalData',
        'commonService',
        'workListService',
        'subHeaderService',
        'profileService',
        'moreInfoManageService',
    'workChapterPaperService']
})

export default class WorkListCtrl {
    $ionicLoading;
    finalData;
    commonService;
    workListService;
    subHeaderService;
    $ionicScrollDelegate;
    $timeout;
    $ionicSideMenuDelegate;
    moreInfoManageService;
    workChapterPaperService;
    initCtrl = false; //初始化ctrl flag
    moreFlag = false; //加载更多作业列表flag
    retFlag = false; //数据获取完毕flag
    tip = this.finalData.WORK_TIP_WORD; //作业列表为空时,提示信息
    currentDate = new Date();
    selectDateObj = {
        year: this.currentDate.getFullYear(),
        month: this.currentDate.getMonth() + 1,
        updateFlag: true
    };
    screenWidth = window.innerWidth;
    isShowTrophyRank = false;
    isPC = this.commonService.isPC();
    isShowPersonalQb = false;
    hasMonitor=false;
    isShowHolidayWork=false;
    hasSheckClassStudentCount = false;
    @select(state => state.clazz_list) clazzList;
    @select(state => state.wl_selected_clazz) selectedClazz;
    @select((state, me) => state.wl_clazz_list_with_work[state.wl_selected_clazz.id]) workList;
    @select((state, me) => state.wl_clazz_ae_list_with_work[state.wl_selected_clazz.id]) workAEList;
    @select((state, me) => state.wl_fetch_work_list_processing) wlFetchWorkListProcessing;
    @select(state => state.trophy_selected_time) trophySelectedTime;
    @select((state) => {
        let trophy_selected_clazz = state.wl_selected_clazz;
        let trophy_selected_time = state.trophy_selected_time;
        let stateKey = trophy_selected_clazz.id + "#" + trophy_selected_time.startTime + "|" + trophy_selected_time.endTime;
        return state.clazz_year_with_trophy_rank[stateKey];
    }) trophyRankData;
    @select((state, me) => state.fetch_trophy_rank_data_processing) isTrophyLoading;
    @select(state => state.profile_user_auth.user.manager) isAdmin;
    @select((state, me) => {
        return state.profile_user_auth.user.config && state.profile_user_auth.user.config.areaTeachingResearch
    }) hasAreaEvaluation;
    @select(state => state.profile_user_auth.user.config && state.profile_user_auth.user.config.vacation) isShowHolidayWork;
    @select(state => state.profile_user_auth.user.config && state.profile_user_auth.user.config.areaAssessmentAdvertisement) hasMonitor;
    constructor() {
        this.subHeaderService.clearAll(); //初始化subHeader的tag选择为
        this.initData();
        //this.addWatchTimeFilter();
    }

    initData() {
        this.getRootScope().winterBroadcastLoading = false;
        this.getRootScope().winterBroadcastData = [];
        this.getRootScope().showOralCalculationGuideFlag=false;
        this.showAllAEList=false;
        this.registerSlideEvent()
    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => this.initCtrl = true)
            .then(() => {
                if (!this.clazzList || (this.clazzList && this.clazzList.length == 0)) { //班级不存在时不走引导的流程
                    this.commonService.closeSimulationGuide();
                } else {
                    if(this.getRootScope().isShowHolidayHomeworkAdFlag){
                        this.guideFlag = false;
                    }else {
                        this.guideFlag = this.commonService.getSimulationClazzLocalData();
                    }
                }
                this.checkLocalSelectedClazz();
                this.workListService.setWorkListPageInfo();//重置分页信息
                this.loadMore();


                /**
                 * 检查班级人数是都满10|5人
                 */
                this.workChapterPaperService.checkClassStudentCount(false).then((data)=> {
                    this.hasSheckClassStudentCount=true;
                    //当刚开始小于3个的时候 用this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').update();还是会多出自带的
                    if(data&&data.code==200){
                        if (data.teacherDbView) {
                            this.isShowPersonalQb = false;
                        } else {
                            this.isShowPersonalQb = true;
                        }
                    }
                }, ()=> {
                    this.isShowPersonalQb = false;

                });
            })
    }
    /*
    slide点击逻辑
    为2时复制多出来的点不动
    */
    registerSlideEvent(){
      let _self=this;
      $(document).off("click",".slide-mark").on("click",".slide-mark",function () {
        let mark=$(this).data("mark");
        _self.clickActivePage(mark);
        _self.getRootScope().$digest();
        _self.getScope().$digest();
      })
    }
    /**
     * 游戏列表根据时间过滤
     */
    addWatchTimeFilter() {
        this.getScope().$watch('ctrl.selectDateObj.year', this.gameListTimeFilter);
        this.getScope().$watch('ctrl.selectDateObj.month', this.gameListTimeFilter);
    }

    gameListTimeFilter(newValue, oldValue, scope) {
        let _this = scope.ctrl;
        if (newValue == oldValue || !_this.selectDateObj.updateFlag) {
            return;
        }
        _this.selectDateObj.updateFlag = false;
        _this.workListService.setWorkListPageInfo();
        this.$ionicSideMenuDelegate.toggleLeft(false);


        _this.moreFlag = false;
        _this.retFlag = false;
        _this.loadMore();

        console.log(arguments);
        console.log("update!!!!!");
    }

    /**
     * 进入页面前初始化班级列表modal
     */
    onLoadedView() {
    }

    onAfterEnterView() {
        this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').update();
        this.getRootScope().showTopTaskFlag=true;//显示任务列表指令
        if (this.guideFlag) {
            this.getSimulationWork();
        }
        this.getRootScope().shardingClazz = this.finalData.URL_FROM.ORDINARY_WORK;
        this.checkLocalSelectedClazz();
        if (this.selectedClazz.id && !this.wlFetchWorkListProcessing && this.workList === undefined) {
            this.workListService.setWorkListPageInfo();//重置分页信息
            this.loadMore();
        }


        if (this.initCtrl && this.retFlag && this.getStateService().params.refresh == 'yes') {
            this.pullRefresh();
        }
        if(!this.isAdmin){
            this.getRootScope().$broadcast('allAwardFlag');
        }

    }

    onBeforeLeaveView() {
        this.getRootScope().showTopTaskFlag=false;//显示任务列表指令
        this.$ionicSideMenuDelegate.toggleLeft(false);

    }


    /**
     * 确保之前退出选择的班级是否还存在,存在则使用,否则默认为班级列表中第一个班级
     */
    checkLocalSelectedClazz() {
        //班级列表中有班级&&选择了班级&&选择的班级在最新的班级列表中
        if (this.clazzList && this.clazzList.length && this.selectedClazz.id) {
            let clazz = _find(this.clazzList, {id: this.selectedClazz.id});
            if (clazz) {
                this.workListService.changeAndSaveSelectedClazz(clazz);
                return
            }
        }
        this.selectClazz();
    }

    /**
     * 切换并保存班级
     * @param clazz
     */
    selectClazz(clazz) {
        //选择的班级没有变化
        if (clazz && clazz.id == this.selectedClazz.id) {
            this.$ionicSideMenuDelegate.toggleLeft(false);
            return
        }

        //切换班级时,将班级列表分页查询lastKey置为空
        this.workListService.setWorkListPageInfo();
        //保存选择的班级到store中
        this.workListService.changeAndSaveSelectedClazz(clazz);
        this.$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
        //用户切换班级
        if (clazz) {
            this.$ionicSideMenuDelegate.toggleLeft(false);

            this.moreFlag = false;
            this.retFlag = false;
            this.$timeout(() => {
                this.loadMore(null, '');
            }, 400);
        }
        this.getScope().$emit('fetch_competition_info_from_server');
    }

    /**
     * 跳转到作业明细统计
     * @param paper 作业对象
     */
    paperDetail(paper) {
        debugger
        if(paper.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS||paper.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION){
            let nowTime = new Date().getTime();
            let startTime = Date.parse(paper.startTime.replace(/-/g,'/'));
            if(startTime > nowTime){
                this.commonService.showAlert('温馨提示','<p style="text-align: center">答题时间还未到，无法查看试卷！</p>');
                return
            }
        }

        //选择并保存当前试卷
        this.workListService.selectPublishWork(paper);
        this.getRootScope().workStuListBackUrl = 'home.work_list';
        if (paper.startTime && this.checkStartTime(paper.startTime)) {
            this.getStateService().go("work_student_list", {paperInstanceId: paper.instanceId, isNoPublish: 1});
        } else {
            this.getStateService().go("work_student_list", {paperInstanceId: paper.instanceId});
        }
    }

    /**
     * 归档一个作业
     */
    archivedWork(paperInstanceId, paperId) {
        var title = '信息提示';
        var info = '<p>归档此次发布的作业？</p><p>注: 归档的作业需要在档案夹查看</p>';
        this.commonService.showConfirm(title, info).then((res) => {
            if (!res) {
                return
            }

            this.workListService.archivedWork(paperInstanceId, paperId).then(() => {
                if (this.workList.length == 0) {
                    this.loadMore(true);
                }
            });
        });
    }

    /**
     * 下拉刷新
     */
    pullRefresh() {
        let refreshComplete = () => {
            this.$timeout(() => this.getScope().$broadcast('scroll.refreshComplete'), 10)
        };
        if (!this.clazzList || this.clazzList.length == 0) {
            // this.getScope().$broadcast('scroll.refreshComplete');
            refreshComplete();
            this.moreFlag = false;
            return
        }

        this.workListService.setWorkListPageInfo();
        this.workListService.fetchPublishedWorkList().then((moreFlag) => {
            this.moreFlag = moreFlag;
            refreshComplete();
        }, () => {
            refreshComplete();
        });
        if (this.getRootScope().hasCompetition) {
            this.getScope().$emit("fetch_competition_info_from_server");//刷新竞赛试卷信息
        }
    }

    /**
     * 加载更多
     */
    loadMore(isLoadMore, lastKey) {
        //没有班级就返回
        if (!this.clazzList || !this.clazzList.length || !this.selectedClazz.id) {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
            this.retFlag = true;
            this.moreFlag = false;
            return;
        }

        this.workListService.fetchPublishedWorkList(isLoadMore, lastKey).then((moreFlag) => {
            this.moreFlag = moreFlag;
            this.retFlag = true;
            this.selectDateObj.updateFlag = true;
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        }, () => {
            this.retFlag = true;
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        });
    };

    /**
     * 对于后加入的学生，老师补发之前发布到该学生所在班级及所在层次的作业
     */
    rePublishWork(work) {

        this.commonService.showConfirm("补发作业", `将本作业补发给新加入“${work.groupName}”的学生？`, "确定").then((yes) => {
            //点击取消
            if (!yes) {
                return
            }
            this.$ionicLoading.show({template: '补发中...'});
            this.workListService.reDeliverWork({paperInstanceId: work.instanceId,rowId:work.rowId}).then((res) => {
                this.$ionicLoading.hide();
                if (res.code == 30007) {//没有需要补发的学生
                    this.commonService.showAlert("提示", "<p style='text-align: center'>没有需要补发作业的学生</p>");
                }
                else if (res.code == 200) {
                    this.commonService.showAlert("提示", `<p style='text-align: center'>已成功为${res.newTotalNum - work.totalNum}个学生补发作业!</p>`);
                    work.totalNum = res.newTotalNum;
                }
            }, () => {
                this.$ionicLoading.hide();
            });
        });
    }

    /**
     * 查看学情
     */
    showStudy() {
        if (!this.getRootScope().isAdmin && !this.clazzList.length) {
            let template = '<p>您还没有创建班级，点击“班级”，然后再点击“+”创建班级</p>';
            this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
            return;
        }

        if (!this.retFlag || this.workList.length == 0) {
            let template = '<p>想查看班级学情，解决方案如下：</p>' +
                '<p>1、若已布置作业，请稍等；</p>' +
                '<p>2、若还没有布置作业，请点击右侧的“布置”按钮，布置作业。</p>';
            this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
            return;
        }
        this.getStateService().go('clazz_study_statistics');
    }

    goErrorQuestionCollection() {

        this.getStateService().go('error_question_c', {urlFrom: "work_list"});
    }

    /**
     * 去题库发布作业
     */
    goWorkPaperBank() {
        if (!this.getRootScope().isAdmin && !this.clazzList.length) {
            let template = '<p>您还没有创建班级，点击“班级”，然后再点击“+”创建班级</p>';
            this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
            return;
        }
        this.getStateService().go("pub_work_type");
    };

    showMenu() {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    ifShow($index) {
        if (!this.workList || !this.workList.length) return false;
        if(this.workList[$index].publishType == this.finalData.WORK_TYPE.FINAL_ACCESS)return false;
        if ($index == 0) return true;
        let currentItem = this.workList[$index];
        let previousItem = this.workList[$index - 1];
        let currentMonth = currentItem.createTime.split('-')[1];
        let previousMonth = previousItem.createTime.split('-')[1];
        return currentMonth != previousMonth;
    }

    getMonth(listItem) {
        try {
            return Number(listItem.createTime.split('-')[1]);
        } catch (err) {
            console.error('游戏列表分月信息解析失败', err);
        }
    }

    checkData(data) {
        try {
            if (data[0].paperId) return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * 判断是否是假期作业
     * @param list
     * @returns {boolean}
     */
    isPpecialWork(list) {
        return list.publishType === this.finalData.WORK_TYPE.SUMMER_WORK || list.publishType === this.finalData.WORK_TYPE.WINTER_WORK;
    }

    isSummerHolidayHomework(list) {
        return list.publishType === this.finalData.WORK_TYPE.SUMMER_WORK
    }

    /**
     * 寒假作业
     * @param list
     * @returns {boolean}
     */
    isWinterHolidayHomework(list) {
        return list.publishType === this.finalData.WORK_TYPE.WINTER_WORK
    }

    isOralArithmeticWork(list) {
        return list.publishType === this.finalData.WORK_TYPE.ORAL_WORK || list.publishType === this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
    }

    showWinterBroadcast() {
        console.log('page2');
        this.getRootScope().showWinterBroadcast = true;
        this.getRootScope().winterBroadcastLoading = true;
        this.profileService.fetchWinterBroadcastData().then((res) => {
            this.getRootScope().winterBroadcastLoading = false;

            if (!res) {
                this.getRootScope().winterBroadcastData = "error";
            } else {
                this.getRootScope().winterBroadcastData = res.list;
            }

        }, () => {
            this.getRootScope().winterBroadcastLoading = false;
            this.getRootScope().winterBroadcastData = "error";
        })
    }

    showHolidayHomeworkAd() {
        this.getRootScope().isShowHolidayHomeworkAdFlag = true;
    }

    showOralCalculationGuide() {
        this.getRootScope().showOralCalculationGuideFlag = true;
    }

    showTeacherQbAd(){
        this.getRootScope().tPersonalQbAdFlag = true;
    }

    clickActivePage(type) {
        switch (type){
          case "monitor":
            this.getRootScope().showMonitorAd = true;
            break;
          case "slide-holiday-homework":
            this.showHolidayHomeworkAd();
            break;
          case "oral-calculation":
            this.showOralCalculationGuide();
            break;
          case "winter-holidays":
            this.showWinterBroadcast();
            break;
          case "teacher_personal_qb_home":
            this.showTeacherQbAd()
            break;
        }
    }

    showCompetitionAd() {
        this.getRootScope().isShowSeeBtnFlag = false;
        this.getRootScope().showCompetitionAdFlag = true;
    }

    showTrophyRankData() {
        this.getTrophyRankData();
        this.getRootScope().isShowTrophyRank = true;
    }

    /**
     * 获取奖杯排行榜数据
     */
    getTrophyRankData() {
        if (!this.selectedClazz || !this.selectedClazz.id) {
            return;
        }
        if (this.isTrophyLoading) {
            return;
        }

        let startTime = this.trophySelectedTime.startTime;
        let endTime = this.trophySelectedTime.endTime;

        let stateKey = this.selectedClazz.id + "#" + startTime + "|" + endTime;
        let param = {
            startTime: startTime,
            endTime: endTime,
            clazzId: this.selectedClazz.id,
            stateKey: stateKey,
            scope: this.getScope()
        };
        this.moreInfoManageService.fetchTrophyRankData(param);
    };

    /**
     * 删除一个作业
     */
    delWork(paperInstanceId, paperId,rowId) {
        var title = '信息提示';
        var info = '<p>删除此次发布的作业？</p><p>注: 学生端作业会相应被删除</p>';
        this.commonService.showConfirm(title, info).then((res) => {
            if (!res) {
                return
            }

            this.workListService.deleteWork(paperInstanceId, paperId,rowId).then(() => {
                //已经删除了所有拉取的归档作业
                if (this.workList.length == 0) {
                    this.loadMore();
                }
            });
        });
    }

    checkStartTime(time) {
        let selectTimeStr = time;
        //解决ios Data识别不了时间格式为‘-’的问题,由2017-12-19 14:24:01转换为2017/12/19 14:24:01
        if (this.commonService.judgeSYS() === 2) {
            selectTimeStr = selectTimeStr.replace(/\-/g, '/')
        }
        return new Date(selectTimeStr).getTime() > new Date().getTime();
    }

    getWeekDay(time) {
        let d = new Date(time).getDay();
        if (d == 1) {
            return '星期一';
        } else if (d == 2) {
            return '星期二';
        } else if (d == 3) {
            return '星期三';
        } else if (d == 4) {
            return '星期四';
        } else if (d == 5) {
            return '星期五';
        } else if (d == 6) {
            return '星期六';
        } else {
            return '星期日';
        }
    }


    /**
     * 教师端首次登录自动引导，作业列表使用保存在本地的数据
     */
    getSimulationWork() {
        this.simulationWorkList = this.workListService.fetchSimulationWorkList();

    }

    back(){
        /*首页中可能弹窗 所以返回键需要先关闭弹窗*/
        if(this.getRootScope().isShowTrophyRank ==true){
            this.getRootScope().isShowTrophyRank = false;
        }else if(this.getRootScope().showOralCalculationGuideFlag == true){
            this.getRootScope().showOralCalculationGuideFlag = false
        }else if(this.getRootScope().showWinterBroadcast == true){
            this.getRootScope().showWinterBroadcast = false;
        }else if(this.getRootScope().isShowHolidayHomeworkAdFlag == true){
            this.getRootScope().isShowHolidayHomeworkAdFlag = false;
        }else if(this.getRootScope().showCompetitionAdFlag == true){
            this.getRootScope().showCompetitionAdFlag = false;
        }else if(this.getRootScope().getTeacherRewardFlag == true){
            this.getRootScope().getTeacherRewardFlag = false;
        }else if(this.getRootScope().tPersonalQbAdFlag == true){
            this.getRootScope().tPersonalQbAdFlag = false;
        }else{
            return "exit";
        }
        this.getRootScope().$digest();
    }

    goHolidayWorkList(){
        this.getStateService().go("holiday_work_list");
    }
    goAreaEvaluationList(){
        this.getStateService().go("area_evaluation_list");
    }
    toggleAEBox(){
        this.showAllAEList=!this.showAllAEList;
        if(this.showAllAEList){
            this.$ionicScrollDelegate.$getByHandle('mainScroll').resize();
        }else{
            this.$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
        }
    }
}

