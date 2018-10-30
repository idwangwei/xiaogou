/**
 * Created by qiyuexi on 2018/1/11.
 */
import {Inject, View, Directive, select} from '../../module';

@View('wc_ques_record', {
    url: '/wc_ques_record/:pointIndex/:urlFrom/:formText',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope', '$state', '$rootScope','$ngRedux', 'commonService',  'diagnoseService'
    ]
})
class quesRecordCtrl {
    @select(state=>state.select_work_knowledge) chapterSelectPoint;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    @select(state=>state.knowledge_with_report) workReports;
    @select(state=>state.work_report_info.paperName) paperName;
    @select(state=>state.work_report_info.instanceId) paperInstanceId;
    @select(state=>state.work_report_info.select_work_knowledge) knowledgeName;
    @select(state=>state.ques_record) allPointsQues;
    diagnoseReport;
    report;
    qRecords;

    constructor() {
        // super(arguments);
        this.pointIndex = this.getStateService().params.pointIndex;
        this.initData();
        this.initFlags();
    }
    closeFinalSprintCheck(){
        this.isFinalSprintCheckFlag=false;
        jQuery(".work_report_ques_record .final_sprint_check").hide();/*有动画 不知道哪里设置了*/
    }
    getKnowledgeTxt() {
        var strArr = this.chapterSelectPoint.knowledgeTxt.split('.');
        if (strArr.length == 2) return strArr[1];
        return this.chapterSelectPoint.knowledgeTxt;
    }

    configData() {
        if (!this.chapterSelectPoint.knowledgeId) return {};
        this.diagnoseReport = this.workReports[this.chapterSelectPoint.knowledgeId];
        this.qRecords = this.diagnoseReport ? this.diagnoseReport.qRecords : null;
    }

    checkQuesFromThisPaper(item) {
        let thisQIdAndInstanceId = item.id + this.paperInstanceId;
        return item.quesIdAndInstanceId == thisQIdAndInstanceId;
    }

    checkThisPaperQues(item, index) {
        if (this.checkQuesFromThisPaper(item)) {
            try{
                let qSeq = +this.allPointsQues[this.chapterSelectPoint.knowledgeId].questionDict[item.id].qSeq;
                let qgSeq = +this.allPointsQues[this.chapterSelectPoint.knowledgeId].questionDict[item.id].qgSeq;

                let qgSeqStr = this.commonService.convertToChinese(qgSeq + 1);
                return qgSeqStr + '、' + (qSeq + 1);
            }catch(e) {
                return '第' + index + '题'
            }
        } else {
            return '第' + index + '题'
        }
    }


    /**
     * 初始化ctrl中的一些 flag
     */
    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过一次做题记录
        this.loadMoreExecuteCount = 0; //从ion-infinite-scroll调用加载列表方法的次数
        this.moreFlag = false;//是否出现加载更多的指令
        this.showDiaglog = true;
    }


    initData() {
        this.firstLoading = true;
        this.loadingText = '获取考点诊断中';
        this.showBottomFlag = this.getStateService().params.urlFrom != 'diagnose_do_question02';
        this.formText=this.getStateService().params.formText||"作业"
        this.isFinalSprintCheckFlag=this.getStateService().params.urlFrom=="winter_camp_home"
    }

    onBeforeEnterView() {
    }


    onAfterEnterView() {
        this.configData();
        this.pointIndex = this.getStateService().params.pointIndex;
        if (this.chapterSelectPoint) {
            this.initCtrl = true;
            this.fetchDiagnoseReport(false, this.loadCallback.bind(this), this.chapterSelectPoint.knowledgeId, this.clazzId);
            return;
        }
    }

    onBeforeLeaveView() {
        this.showDiaglog = false;
    }

    hideAllQ() {
        this.qRecords.forEach((record)=> {
            for (let key in record.smallQStuAnsMapList) {
                record.smallQStuAnsMapList[key].showQFlag = false;
            }
        })
    }

    hasNoRecords() {
        return this.initCtrl && !this.firstLoading && (!this.qRecords || !this.qRecords.length);
    }


    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (this.chapterSelectPoint && !this.initCtrl) {
            this.initCtrl = true;
            this.fetchDiagnoseReport(false, this.loadCallback.bind(this), this.chapterSelectPoint.knowledgeId, this.clazzId);
        }
    }

    /**
     * 加载列表完毕的回调
     * @param loadMore 是否是上划刷新的情况
     * @param loadAllComplete 对应班级下的游戏列表是否全部加载完毕
     */
    loadCallback(loadMore, loadAllComplete) {
        this.configData();
        this.moreFlag = !loadAllComplete;
        this.firstLoading = false;

        loadMore ?
            this.getScope().$broadcast('scroll.infiniteScrollComplete') :
            this.getScope().$broadcast('scroll.refreshComplete');
    }


    /**
     *  该方法适用于：在加载更多列表内容时，将该方法传递给ion-infinite-scroll指令，
     *  由于在ion-infinite-scroll初始化的时候就会调用该方法去加载对应的列表内容，
     *  为了避免这种情况，在方法内部使用了 loadMoreExecuteCount 进行记数，只有其
     *  值大于0时才执行加载过程
     */
    fetchQRecordsWithLoadMore() {
        if (this.loadMoreExecuteCount == 0)
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        if (this.loadMoreExecuteCount > 0)
            this.fetchDiagnoseReport(true, this.loadCallback.bind(this), this.chapterSelectPoint.knowledgeId, this.clazzId);

        this.loadMoreExecuteCount++;
    }

    pullRefresh() {
        this.fetchDiagnoseReport(false, this.loadCallback.bind(this), this.chapterSelectPoint.knowledgeId, this.clazzId);

    }


    back() {
        if (this.getStateService().params.urlFrom === 'winter_camp_home') {
            this.go('home.winter_camp_home');
            return;
        }
        if (this.getStateService().params.urlFrom === 'wc_train') {
            this.go('wc_train');
            return;
        }
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseReportRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseReportRequestList.splice(0, this.diagnoseService.cancelDiagnoseReportRequestList.length);//清空请求列表
    }

    mapActionToThis() {
        let diagnoseService = this.diagnoseService;
        return {
            fetchDiagnoseReport: diagnoseService.fetchDiagnoseReportForWork.bind(diagnoseService)
        }
    }
}
export default quesRecordCtrl