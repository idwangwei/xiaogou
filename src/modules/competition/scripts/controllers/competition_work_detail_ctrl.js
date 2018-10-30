/**
 * Created by ww on 2017/3/18.
 */
import BaseController from 'base_components/base_ctrl';
import _find from 'lodash.find';

class CompetitionWorkListCtrl extends BaseController {
    constructor() {
        super(arguments);


    }
    back(){
        this.go('home.work_list','back');
    }
    onReceiveProps() {
        this.ensurePaperFetched();
    }

    loadCallback() {
        this.getScope().$broadcast('scroll.refreshComplete');
    }

    pullRefresh() {
        this.fetchPaper('false', true,this.loadCallback.bind(this)).then(()=> {
            //从localStore中获取需要显示的试卷信息
            if (this.paper && this.paper.bigQList)

            {
                let tempWork = this.ngLocalStore.getStateWork();
                if (tempWork.id == this.paper.bigQList) {
                    this.qsList = tempWork.qsList;
                }
            }
        });
    }

    onAfterEnterView() {
    }

    onBeforeEnterView(){
        this.paperFetched = false;
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
        this.isIos=this.getRootScope().platform.IS_IPHONE||this.getRootScope().platform.IS_IPAD;

    }

    ensurePaperFetched() {
        //初始化Ctrl时执行,向服务器获取试卷信息,因为每次进入都需要强制获取服务器作业，屏蔽canFetchPaper
        if (!this.paperFetched && !this.isLoadingProcessing && this.selectedWork && this.selectedWork.paperId) {
            this.paperFetched = true;
            this.fetchPaper('false', true,null).then((data)=> {
                this.retFlag = true;
                //从localStore中获取需要显示的试卷信息
                if (data && this.paper && this.paper.bigQList) {
                    let tempWork = this.ngLocalStore.getStateWork();
                    if (tempWork.id == this.paper.bigQList) {
                        this.qsList = tempWork.qsList;
                    }
                }
            });
        }

        if (!this.paperFetched && !this.onLine && this.selectedWork && this.selectedWork.paperId) {
            this.paperFetched = true;
            this.ngLocalStore.paperStore.getItem(this.loginName + "/" + this.selectedWork.instanceId).then((res)=> {
                this.retFlag = true;
                this.getScope().$apply(()=>this.qsList = res);
            })
        }
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
                console.log('smallQStuAnsMapList',e2.smallQStuAnsMapList);
                if(!e2.smallQStuAnsMapList) e2.smallQStuAnsMapList={};
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


    mapActionToThis() {
        return {
            fetchPaper: this.paperService.fetchPaper,
            getPaperStatus:this.workStatisticsServices.getPaperStatus
        }
    }
    mapStateToThis(state) {
        let userId = state.profile_user_auth.user.userId;
        let clzId = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom ==='olympic_math_s' ? userId:state.wl_selected_clazz.id;
        let workList = state.wl_clazz_list_with_works[clzId];
        let selectedWork = state.wl_selected_work;
        let userName = state.profile_user_auth.user.name;
        let paper = workList && _find(workList,{instanceId:selectedWork.instanceId});
        if(!paper) return {};
        let clzName = state.work_list_route.urlFrom === 'olympic_math_t' ?state.olympic_math_selected_clazz.name:state.wl_selected_clazz.name;
        return {
            isLoadingProcessing: state.wl_is_fetch_paper_loading,
            urlFrom: state.work_list_route.urlFrom,
            clzName: clzName,
            selectedWork: selectedWork,
            paper: paper && paper.paperInfo.paper,
            canFetchPaper: paper && paper.canFetchPaper,
            title: paper && paper.paperInfo.paper && paper.paperInfo.paper.title,
            loginName: state.profile_user_auth.user.loginName,
            userName: userName,
            userId: userId,
            user:state.profile_user_auth.user,
            onLine: state.app_info.onLine
        }
    }
}
CompetitionWorkListCtrl.$inject = [
    '$scope'
    , '$rootScope'
    , '$ngRedux'
    , '$state'
    , '$ionicScrollDelegate'
    , '$ionicPopup'
    , 'paperService'
    , 'workStatisticsServices'
    , 'ngLocalStore'
    , 'commonService'
];
export default CompetitionWorkListCtrl;