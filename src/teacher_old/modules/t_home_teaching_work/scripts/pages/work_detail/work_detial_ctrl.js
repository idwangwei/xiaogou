/**
 * Author 邓小龙 on 2015/8/31.
 * @description 某个学生的作业 controller
 */


import $ from 'jquery';
import _each from 'lodash.foreach';
import {Inject, View, Directive, select} from '../../module';

@View('work_detail', {
    url: '/work_detail/:user',
    styles: require('./work_detial.less'),
    template: require('./work_detail.html'),
    inject: [
        '$scope'
        ,'$ionicHistory'
        ,'$ionicPopup'
        ,'$ionicNavBarDelegate'
        ,'$log'
        ,'$state'
        ,'$compile'
        ,'$ionicModal'
        ,'$ionicLoading'
        ,'$ionicScrollDelegate'
        ,'$anchorScroll'
        ,'$location'
        ,'$timeout'
        ,'$rootScope'
        ,'$ngRedux'
        ,'dateUtil'
        ,'workStatisticsService'
        ,'commonService'
        ,'finalData'
   ]
})

class WorkDetailCtrl{
    finalData;
    workStatisticsService;
    commonService;
    me = this;
    @select(state => state.wl_selected_work.publishType) publishType;
    @select(state => state.wl_selected_work) selectWork;
    @select((state,me) => state.wl_selected_work.publishType == me.finalData.WORK_TYPE.MATCH_WORK) isCompetitionPaper;
    @select(state => state.wl_selected_work.paperName) papaerName;
    @select((state,me) => state.wl_selected_work.publishType == me.finalData.WORK_TYPE.FINAL_ACCESS ) isFinalAccess;
    initCtrl = false;

    constructor(){
        this.initData();
    }

    initData(){
        this.checkBox = false;//选择框
        this.showFlag = true;//试题显示
        this.showScore = true;//是否显示试题分数
        this.showCorrectScore = true;//是否显示批改的分数
        this.WORK_TYPE = this.finalData.WORK_TYPE;

        this.alertTipInfo={
            workDetail:this.commonService.getLocalStorage(this.getRootScope().user.userId+"workDetail")
        };
        this.noTip={
            status:false
        };
        this.hasFetchAns = false;
        this.wData = this.workStatisticsService.wData;//共享作业的数据
        this.data = this.workStatisticsService.data;//共享的数据
        this.goToStatisPage = this.workStatisticsService.goToStatisPage;
        this.showQFlag = true;//是否展示试题
        this.showAssistBtnText = "开启选择区域功能";

    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;
                if (!this.data.goCorrectQFlag) {
                    this.workStatisticsService.getPaperStusAns(this.selectWork).then(result=>{
                        this.hasFetchAns = result;
                    });//新版接口
                }
            })
    }

    /**
     * 显示或隐藏试题试题
     */
    showQ (doneInfo, event) {
        doneInfo.showQFlag = !doneInfo.showQFlag;
        event.stopPropagation();
    };

    /**
     * 滚动到顶部
     */
    scrollTop () {
        this.$ionicScrollDelegate.scrollTop(true);
    };

    onAfterEnterView(){
        this.scrollDom = $('.scrollToTop');
    }

    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition () {
        this.moveData = this.$ionicScrollDelegate.getScrollPosition().top;
        if (this.moveData >= 250) {
            this.scrollDom.fadeIn();
        } else if (this.moveData < 250) {
            this.scrollDom.fadeOut();
        }
    };

    back () {
        this.data.goCorrectQFlag = false;
        this.$ionicHistory.goBack();
    };

    hideAllQ () {
        _each(this.data.paper.qsTitles, function (bigQ, bigQIndex) {
            _each(bigQ.qsList, function (smallQ,smallQIndex) {
                smallQ.showQFlag = false;
                if(smallQ.smallQStuAnsMapList){
                    _each(smallQ.smallQStuAnsMapList, function (ans,index) {ans.showQFlag = false});
                }
            });
        });
    };
    /**
     * 又上角提示
     */
    help (){
        this.$ionicPopup.alert({
            title: '信息提示',
            template: '<p>若发现任一试题有问题,点击试题旁边的报错图标,并选择相应操作即可。</p>' ,
            okText:'确定'
        });
    };

    goQFeedbackPage (questionId){
        this.workStatisticsService.workDetailState.lastStateUrl = this.getStateService().current.name;
        this.workStatisticsService.workDetailState.lastStateParams = this.getStateService().params;
        this.workStatisticsService.QInfo.questionId = questionId;
        this.workStatisticsService.QInfo.paperId = this.data.paper.paperId;
        this.go('q_feedback');
    }

}

export default WorkDetailCtrl;



