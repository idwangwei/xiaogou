/**
 * Created by ZL on 2018/1/15.
 */
/**
 * Author 邓小龙 on 2015/9/15.
 * @description 作业明细之整个作业查看
 */
import _find from 'lodash.find';
import {Inject, View, Directive, select} from '../../module';

@View('olympic_math_work-detail', {
    url: '/olympic_math_work-detail/:paperId/:paperInstanceId',
    template: require('./olympic_math_work_detail.html'),
    styles: require('./olympic_math_work_detail.less'),
    inject:['$scope'
        , '$rootScope'
        , '$ngRedux'
        , '$state'
        , '$ionicScrollDelegate'
        , '$ionicPopup'
        , '$ionicHistory'
        , 'paperService'
        , 'workStatisticsServices'
        , '$ionicTabsDelegate'
        , 'ngLocalStore'
        , '$timeout'
        , 'commonService'
        , 'pageRefreshManager'
        , 'finalData'
        , 'olympicMathService'
        , 'subHeaderService']
})
class WorkDetailCtrl {
    constructor() {
        this.initFlags();
        this.initData();
    }

    onReceiveProps() {
        this.ensurePaperFetched();
    }

    onUpdate() {
        // this.paperFetched = false;
        // this.retFlag = false;
        // this.ensurePaperFetched();
    }

    loadCallback() {
        this.getScope().$broadcast('scroll.refreshComplete');
    }

    pullRefresh() {
        this.fetchPaper('false', true, this.loadCallback.bind(this)).then(() => {
            //从localStore中获取需要显示的试卷信息
            if (this.paper && this.paper.bigQList) {
                let tempWork = this.ngLocalStore.getStateWork();
                this.parseWasteTime(this.paper.wasteTime);
                if (tempWork.id == this.paper.bigQList) {
                    this.qsList = tempWork.qsList;
                }
            }
        });
    }

    onAfterEnterView() {
        this.showTip();
        // this.paperFetched = false;
        // this.ensurePaperFetched();
    }

    initFlags() {
        this.paperFetched = false;
        this.tabFlags = {
            WORK_DETAIL: 'work_detail',
            WORK_STAR: 'work_star'
        };
        this.onLine = true;
        this.currentTab = this.tabFlags.WORK_DETAIL;

        this.qsList = [];
        this.alertTipInfo = {
            workDetail: this.commonService.getLocalStorage(this.getState().profile_user_auth.user.userId + "workDetail")
        };
        this.noTip = {
            status: false
        };
        this.retFlag = false;

    }

    initData() {
        this.isIos = this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD;
        this.WORK_TYPE = this.finalData.WORK_TYPE;
    }

    checkNoTip() {
        this.noTip.status = !this.noTip.status;
    }

    ensurePaperFetched() {
        //初始化Ctrl时执行,向服务器获取试卷信息,因为每次进入都需要强制获取服务器作业，屏蔽canFetchPaper
        if (!this.paperFetched && !this.isLoadingProcessing && this.selectedWork && this.selectedWork.paperId) {
            this.paperFetched = true;
            this.fetchPaper('false', true, null).then((data) => {
                this.retFlag = true;
                //从localStore中获取需要显示的试卷信息
                if (data && this.paper && this.paper.bigQList) {
                    let tempWork = this.ngLocalStore.getStateWork();
                    this.parseWasteTime(this.paper.wasteTime);
                    if (tempWork.id == this.paper.bigQList) {
                        this.qsList = tempWork.qsList;
                    }
                }
            });
        }

        //初始化Ctrl时执行,向服务器获取试卷信息,因为每次进入都需要强制获取服务器作业，屏蔽canFetchPaper
        // if (!this.paperFetched && this.selectedWork && this.selectedWork.paperId) {
        //     this.ngLocalStore.paperStore.getItem(this.loginName + "/" + this.selectedWork.instanceId).then((res)=> {
        //         this.paperFetched = true;
        //         this.getScope().$apply(()=>this.qsList = res);
        //     })
        // }

        if (!this.paperFetched && !this.onLine && this.selectedWork && this.selectedWork.paperId) {
            this.paperFetched = true;
            this.ngLocalStore.paperStore.getItem(this.loginName + "/" + this.selectedWork.instanceId).then((res) => {
                this.retFlag = true;
                this.getScope().$apply(() => this.qsList = res);
            })
        }
    }

    /**
     *  将后端回传的做题时间（秒数），转换为分钟数加秒数
     *  如 181 秒 转换为 3 分 1 秒
     */
    parseWasteTime(wasteTime) {
        wasteTime = parseInt(wasteTime);
        let minutes = Math.floor(wasteTime / 60);
        let seconds = wasteTime % 60;
        this.paper.wasteTime = {minutes, seconds};
    }

    /**
     * 显示或隐藏试题试题
     */
    showQ(doneInfo, event) {
        doneInfo.showQFlag = !doneInfo.showQFlag;
        event.stopPropagation();
    }

    /**
     * 折叠所有试题
     */
    hideAllQ() {
        $.each(this.qsList, function (i1, e1) {
            $.each(e1.qsList, function (i2, e2) {
                console.log('smallQStuAnsMapList', e2.smallQStuAnsMapList);
                if (!e2.smallQStuAnsMapList) e2.smallQStuAnsMapList = {};
                $.each(e2.smallQStuAnsMapList, function (i3, e3) {
                    e3.showQFlag = false
                })
            });
        });
    }

    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition() {
        let $scope = this.getScope();
        $scope.moveData = this.$ionicScrollDelegate.getScrollPosition().top;
        if ($scope.moveData >= 250) {
            $('.scrollToTop').fadeIn();
        } else if ($scope.moveData < 250) {
            $('.scrollToTop').fadeOut();
        }
    }


    /**
     * 滚动到顶部
     */
    scrollTop() {
        this.$ionicScrollDelegate.scrollTop(true);
    }

    goOlympicMathWorkList() {
        this.go('olympic_math_work_list', 'back', {urlFrom: this.workStatisticsServices.routeInfo.urlFrom});
    }

    /**
     * 重做该试卷
     */
    redoWork() {
        let commonService = this.commonService;
        // col.paperInfo.canFetchDoPaper=col.canFetchDoPaper;
        // col.paperInfo.canFetchPaper=col.canFetchPaper;
        let param = {
            paperId: this.selectedWork.paperId,
            paperInstanceId: this.selectedWork.instanceId
        };
        if (this.selectedWork.failMsg) {
            this.selectedWork.failMsg = "";
        }
        this.getPaperStatus(param, true);
        if (this.selectedWork.failMsg) {
            commonService.alertDialog(this.selectedWork.failMsg, 1500);
            return;
        }
        if (this.selectedWork.status == -1) {//表示该作业已经被老师删除
            commonService.showAlert('信息提示', '该作业已经被老师删除').then(function () {
                this.workList.splice($index, 1);
            });
            return;
        }

        if (this.selectedWork.status == 3) {//作业已提交但未批改
            $ionicPopup.alert({
                title: '信息提示',
                template: '<p>您上次提交的答案还在批改中，等批改结果出来后，再进行改错！</p>',
                okText: '确定'
            });
            return;
        }
        if (this.selectedWork.status == 4) {//作业已经被批改。

        }

        var selectQuestionParam = {
            paperId: this.selectedWork.paperId,
            paperInstanceId: this.selectedWork.instanceId,
            redoFlag: 'true',
            urlFrom: 'detail',
            //questionIndex: this.selectedWork.paperIndex //当前试卷在work_list试卷列表中的下标
        };
        /*新增期末冲刺逻辑*/
        if (this.getStateService().params.urlFrom == "finalSprint") {
            selectQuestionParam.urlFromMark = 'finalSprint';
        }
        this.getRootScope().selectQuestionUrlFrom = 'detail';
        this.go("select_question", selectQuestionParam); //返回做题
    }

    mapActionToThis() {
        return {
            changeUrlFromForStore: this.olympicMathService.changeUrlFromForStore.bind(this.olympicMathService),
            fetchPaper: this.paperService.fetchPaper,
            getPaperStatus: this.workStatisticsServices.getPaperStatus
        }
    }

    mapStateToThis(state) {
        let userId = state.profile_user_auth.user.userId;
        let clzId = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom === 'olympic_math_s' ? userId : state.wl_selected_clazz.id;
        let comeFromOlympicMathS = state.work_list_route.urlFrom === 'olympic_math_s';
        let workList = state.wl_clazz_list_with_works[clzId];
        let selectedWork = state.wl_selected_work;
        // let idx = selectedWork.paperIndex;
        let userName = state.profile_user_auth.user.name;
        let paper = workList && _find(workList, {instanceId: selectedWork.instanceId});
        if (!paper) return {};
        let clzName = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.name : state.wl_selected_clazz.name;
        let isFinalSprint=false;
        if(state.wl_selected_work.publishType=="12"){
            isFinalSprint=true;
        }
        return {
            isLoadingProcessing: state.wl_is_fetch_paper_loading,
            comeFromOlympicMathS: comeFromOlympicMathS,
            urlFrom: state.work_list_route.urlFrom,
            clzName: clzName,
            selectedWork: selectedWork,
            isFinalSprint:isFinalSprint,
            paper: paper && paper.paperInfo.paper,
            canFetchPaper: paper && paper.canFetchPaper,
            title: paper && paper.paperInfo.paper && paper.paperInfo.paper.title,
            loginName: state.profile_user_auth.user.loginName,
            userName: userName,
            userId: userId,
            user: state.profile_user_auth.user,
            onLine: state.app_info.onLine
        }
    }

    back() {
        /*新增期末冲刺逻辑*/
        if (this.getStateService().params.urlFrom == "finalSprint") {
            this.go("final_sprint_check");
            return;
        }
        let fromUrl = "work_list";
        if (this.selectedWork.publishType == this.WORK_TYPE.ORAL_WORK || this.selectedWork.publishType == this.WORK_TYPE.ORAL_WORK_KEYBOARD) {
            fromUrl = 'oral_work';
        }
        if(this.selectedWork.publishType == this.WORK_TYPE.FINAL_ACCESS){
            fromUrl = this.finalData.URL_FROM.FINAL_ACCESS;
        }
        this.changeUrlFromForStore(fromUrl);
        this.go('home.work_list', 'back', {fromUrl: fromUrl});
    }

    onBeforeEnterView() {
        this.subHeaderService.save({
                id: 'oral_calculation_work_detail_subheader',
                activeEle: 'oral_calculation_after_correct'
            }
        );
    }
}