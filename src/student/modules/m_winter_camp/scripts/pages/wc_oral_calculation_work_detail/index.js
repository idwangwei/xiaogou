/**
 * Created by WL on 2017/9/5.
 */
import _find from 'lodash.find';
import {Inject, View, Directive, select} from '../../module';

@View('wc_oral_calculation_work_detail', {
    url: '/wc_oral_calculation_work_detail/:paperId/:paperInstanceId',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ['$scope'
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
        , 'subHeaderService'
    ]
})
class oralCalculationWorkDetail {
    $ionicScrollDelegate;
    commonService;
    ngLocalStore;

    @select(state => state.wl_is_fetch_paper_loading)isLoadingProcessing;
    @select(state => state.work_list_route.urlFrom)urlFrom;
    @select(state => state.wl_selected_clazz.name)clzName;
    @select(state => state.wl_selected_work)selectedWork;
    @select(state => {
        let clzId = state.wl_selected_clazz.id;
        let workList = state.wl_clazz_list_with_works[clzId];
        let selectedWork = state.wl_selected_work;
        let paper = workList && _find(workList, {instanceId: selectedWork.instanceId});
        return paper && paper.paperInfo.paper
    })paper;
    @select(state => {
        let clzId = state.wl_selected_clazz.id;
        let workList = state.wl_clazz_list_with_works[clzId];
        let selectedWork = state.wl_selected_work;
        let paper = workList && _find(workList, {instanceId: selectedWork.instanceId});
        return paper && paper.canFetchPaper
    })canFetchPaper;
    @select(state => {
        let clzId = state.wl_selected_clazz.id;
        let workList = state.wl_clazz_list_with_works[clzId];
        let selectedWork = state.wl_selected_work;
        let paper = workList && _find(workList, {instanceId: selectedWork.instanceId});
        return paper && paper.paperInfo.paper && paper.paperInfo.paper.title
    })title;
    @select(state => state.profile_user_auth.user.loginName)loginName;
    @select(state => state.profile_user_auth.user.name)userName;
    @select(state => state.profile_user_auth.user.userId)userId;
    @select(state => state.profile_user_auth.user)user;
    @select(state => state.app_info.onLine)onLine;

    constructor() {
        this.initData();
    }

    onAfterEnterView() {
        this.initFlags();
    }

    onReceiveProps() {
        this.ensurePaperFetched();
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

    initFlags() {
        this.paperFetched = false;
        this.onLine = true;
        this.qsList = [];
        this.retFlag = false;
    }

    initData() {
        this.isIos = this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD;
    }

    ensurePaperFetched() {
        //初始化Ctrl时执行,向服务器获取试卷信息,因为每次进入都需要强制获取服务器作业，屏蔽canFetchPaper
        if (!this.paperFetched /*&& !this.isLoadingProcessing*/ && this.selectedWork && this.selectedWork.paperId) {
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

    /**
     * 重做该试卷
     */
    redoWork() {
        let commonService = this.commonService;
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
        let selectQuestionParam = {
            paperId: this.selectedWork.paperId,
            paperInstanceId: this.selectedWork.instanceId,
            redoFlag: 'true',
            urlFrom: 'detail',
        };
        this.getRootScope().selectQuestionUrlFrom = 'detail';
        this.go("wc_oral_calculation_select_question", selectQuestionParam); //返回做题
    }

    mapActionToThis() {
        return {
            fetchPaper: this.paperService.fetchPaper,
            getPaperStatus: this.workStatisticsServices.getPaperStatus
        }
    }

    back() {
        this.go('home.winter_camp_home', 'back');
    }

    onBeforeEnterView() {
        this.subHeaderService.save({
                id: 'oral_calculation_work_detail_subheader',
                activeEle: 'oral_calculation_after_correct'
            }
        );
    }
}










