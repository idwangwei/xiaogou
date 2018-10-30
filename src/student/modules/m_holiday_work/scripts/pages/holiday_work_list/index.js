/**
 * Author ww on 2018/1/5.
 * @description 假期作业列表
 */
import _find from 'lodash.find';
import {Inject, View, Directive, select} from './../../module';

import '../../../../m_global/sImages/holiday_work_list/holiday_work_gold_cup.png';
import '../../../../m_global/sImages/holiday_work_list/holiday_work_silvery_cup.png';
import '../../../../m_global/sImages/holiday_work_list/holiday_work_coppery_cup.png';
import '../../../../m_global/sImages/holiday_work_list/holiday_work_default_cup.png';

@View('holiday_work_list', {
    url: '/holiday_work_list',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: [ '$scope'
        , '$state'
        , '$stateParams'
        , 'workStatisticsServices'
        , 'commonService'
        , 'profileService'
        , '$ngRedux'
        , 'paperService'
        , '$timeout'
        , 'finalData'
        , '$ionicSideMenuDelegate'
        , '$ionicHistory'
        , '$interval'
        , '$rootScope'
        , 'holidayWorkService']
})

class HolidayWorkListCtrl{
    paperService;
    commonService;
    profileService;
    holidayWorkService;
    workStatisticsServices;
    @select(state=>state.profile_user_auth.user.config&&state.profile_user_auth.user.config.vacation) vacation;
    @select(state=>state.profile_user_auth.user.userId) userId;
    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.fetch_holiday_work_list_processing) isLoading;
    @select(state=>state.wl_is_fetch_status_loading) isFetchStatusLoading;
    @select(state=>state.wl_selected_work) selectedWork;
    @select(state=>state.wl_selected_clazz) selectedClazz;
    @select((state)=>{
        let clzId = state.wl_selected_clazz.id;
        return state.wl_clazz_list_with_works[clzId];

    }) workList;
    @select((state)=>{
        let clazzList = state.profile_clazz.passClazzList;
        let newClazzList = [];
        if(clazzList&&clazzList.length!=0){
            clazzList.forEach((item)=> {
                if (item.type != 200) newClazzList.push(item);
            });
        }
        return newClazzList;
    }) clazzList;
    retFlag = false;

    constructor() {
        this.systemTime = new Date().getTime();
        this.openingTime = new Date("2018/07/01 0:0:0").getTime();
        this.limitQuery = {lastKey:"",quantity:32}; //分页加载的分页信息
        this.moreFlag = true; //可以上拉加载更多
        this.initFlags();
    }
    initFlags() {


        // this.isIos = this.commonService.judgeSYS() === 2;
        // this.isPC = this.commonService.isPC();
        // this.selectedClazzRefresh = false;
        // this.workListInitlized = false; //ctrl初始化后，是否已经加载过一次作业列表
        this.SHOW_NAME = {P: "家长", S: '学生', T: '老师'};//在评价明细页面显示的名称
        this.moreFlag = false;//是否出现加载更多的指令
        // this.moreFlagMapForEveryClazz = {};
        // this.initCModal = false;//是否已初始化modal
        // this.initGradeFlag = false;
        this.showDiaglog = true;
        // this.isVip = false;
        this.initCtrl = false;
        // this.glitterFlag = false;
        // this.Grades = [
        //     {"num": 5, "name": "三年级上册"},
        // ];
    }

    mapActionToThis() {
        let ps = this.profileService;
        return {
            changeClazz: this.workStatisticsServices.changeClazz,
            // fetchWorkList: this.workStatisticsServices.fetchWorkList,
            getPaperStatus: this.workStatisticsServices.getPaperStatus,
            selectWork: this.paperService.selectWork,
            changeWorkReportPaperInfo: this.paperService.changeWorkReportPaperInfo,
        }
    }

    onBeforeEnterView() {
        let fromUrl = this.$stateParams.fromUrl || 'work_list';
        this.isOralWorkList = fromUrl.indexOf(this.finalData.URL_FROM.ORAL_WORK) > -1; //是否显示口算作业
    }
    onBeforeLeaveView() {
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
        if(this.retFlag){
            this.pullRefresh()
        }
    }

    back() {
        this.go('home.study_index');
        this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');
    }

    configDataPipe(){
        this.dataPipe.when(()=>!this.initCtrl)
            .then(()=>{
                this.initCtrl = true;
                this.ensureSelectedClazz(); //ctrl初始化时，刷新本地选择的班级信息，（修改班级后回到该页面选择的班级信息及时变更）
                this.getRootScope().selectedClazz = this.selectedClazz;
                this.pullRefresh();
            })
    }


    /**
     * 保证本地选择班级信息为修改后最新信息
     */
    ensureSelectedClazz() {
        //确保选择的班级信息为最新班级列表中的信息------寒假作业优先普通班级
        if (this.clazzList && this.clazzList.length != 0) {
            let clazz,
                currentSelectClazz = _find(this.clazzList, {type: 100});
            if (!currentSelectClazz) {
                clazz = this.clazzList[0];
            }
            else {
                clazz = currentSelectClazz;
            }
            this.changeClazz(clazz);
        }
    }


    /**
     * 下拉刷新作业列表
     */
    pullRefresh() {
        if (!this.isLoading && this.selectedClazz && this.selectedClazz.id) {
            this.limitQuery.lastKey = "";
            this.holidayWorkService.getHolidayWorkListFromServer(this.selectedClazz.id, this.limitQuery).then((res)=>{
                if(res && res.moreFlag !== undefined){
                    this.moreFlag = res.loadMore;
                }
                if(res && res.lastKey){
                    this.limitQuery.lastKey = res.lastKey;
                }
                if(res && res.systemTime){
                    this.systemTime = res.systemTime;
                }
                this.getScope().$broadcast('scroll.refreshComplete');
                this.retFlag = true;
                
            });
        }else {
            this.getScope().$broadcast('scroll.refreshComplete');
        }
    }
    /**
     *  上拉作业列表加载更多
     */
    fetWorkListWithLoadMore() {
        if (!this.isLoading && this.selectedClazz && this.selectedClazz.id) {
            this.holidayWorkService.getHolidayWorkListFromServer(this.selectedClazz.id, this.limitQuery).then((res)=>{
                if(res && res.moreFlag !== undefined){
                    this.moreFlag = res.loadMore;
                }
                if(res && res.lastKey){
                    this.limitQuery.lastKey = res.lastKey;
                }
                this.getScope().$broadcast('scroll.infiniteScrollComplete');
            });
        }else {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        }
    }


    /**
     * 显示评价具体内容
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
        this.go("work_praise_detail", "forward",{urlFrom:'holiday_work_list'});

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
            urlFrom:'holiday_work_list'
        };
        work.paperIndex = $index;
        this.selectWork(work);
        this.go("work_praise", param);
    }

    /**
     * 显示作业明细统计
     */
    showWorkDetail(col, $index) {
        if (this.isFetchStatusLoading) return;
        this.selectWork(col.paperInfo);
        let param = {
            paperId: col.paperInfo.paperId,
            paperInstanceId: col.paperInfo.instanceId
        };
        this.getPaperStatus(param, null, this.getPaperStatusCallBack.bind(this), col, $index);

    };
    getPaperStatusCallBack(param, col, $index, sysTime) {
        if (this.selectedWork.failMsg) {
            this.commonService.alertDialog(this.selectedWork.failMsg, 1500);
            return;
        }
        if (this.selectedWork.status == -1) {//表示该作业已经被老师删除
            this.commonService.showAlert('信息提示', '该作业已经被老师删除').then(function () {
                this.workList.splice($index, 1);
            });
            return;
        }

        //如果服务器时间小于该套时间的布置时间，则提示“改作业于param.publishTime开启”
         if (this.selectedWork.status == 1 && sysTime && this.selectedWork.publishTime) {
            let publishTime = this.selectedWork.publishTime.replace(/-/g, '/');
            if(Date.parse(publishTime) - sysTime > 0){
                this.commonService.alertDialog(`作业开启时间还未到哦~`,2000);
                return
            }
        }

        if (this.selectedWork.status < 3) {//1作业还没开始做,2作业部分完成，未提交的问题可以修改
            param = {
                paperId: col.paperInfo.paperId,
                paperInstanceId: col.paperInfo.instanceId,
                redoFlag: 'false', //是否是提交后再进入select_question做题
                urlFrom: 'holidayWorkList',
            };
            col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入selectedWork中
            this.go("holiday_select_question", param); //返回做题
            return;
        }
        if (this.selectedWork.status == 3) {//作业已提交但未批改
            this.commonService.alertDialog("作业正在批改中", 1500);
            return;
        }
        col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入当前试卷中
        this.go("holiday_work_detail", param);
    }

    gotoWorkReport(item, $event) {
        if (typeof $event === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        let paperInfo = {
            paperId: item.paperInfo.paperId,
            instanceId: item.instanceId,
            paperName: item.paperInfo.paperName,
            totalScore: item.paperInfo.worthScore,
            publishType: item.paperInfo.publishType
        };
        this.changeWorkReportPaperInfo(paperInfo);
        this.go("work_report", {urlFrom:'holiday_work_list'});
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

    ifShow($index) {
        try {
            if (!this.workList || !this.workList.length) return false;
            if($index === 0)return true;
            let currentItem = this.workList[$index];
            let previousItem = this.workList[$index - 1];
            let currentMonth = currentItem.paperInfo.publishWeek;
            let previousMonth = previousItem.paperInfo.publishWeek;
            return currentMonth != previousMonth;
        } catch (err) {
        }
    }

}

export default HolidayWorkListCtrl;





