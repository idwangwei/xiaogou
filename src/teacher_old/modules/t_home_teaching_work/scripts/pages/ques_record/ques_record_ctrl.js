/**
 * Created by ZL on 2017/6/2.
 */
import {Inject, View, Directive, select} from '../../module';

@View('ques_record', {
    url: '/ques_record/:pointInfo/:stuId',
    template: require('./ques_record.html'),
    styles: require('./ques_record.less'),
    inject:[
        '$scope'
        , '$state'
        , 'commonService'
        , '$ngRedux'
        , 'stuWorkReportService'
    ]
})

class quesRecordCtrl {

    @select(state => state.wl_selected_work.paperName) paperName;
    @select(state => state.wl_selected_work.instanceId) paperInstanceId;
    @select(state => state.wl_selected_clazz.id) clazzId;
    @select(state => state.knowledge_with_report) workReports;
    @select(state => state.stu_work_report[state.wl_selected_work&&state.wl_selected_work.instanceId]) classReport;

    diagnoseReport;
    report;
    qRecords;
    knowledgeTitle = {index:'',text:''};

    constructor() {
        this.pointInfo = JSON.parse(this.getStateService().params.pointInfo);
        this.stuId = this.getStateService().params.stuId;
        this.getKnowledgeTxt();
    }

    getKnowledgeTxt() {
        var strArr = this.pointInfo.text.split('.');
        if (strArr.length == 2) {
            this.knowledgeTitle.index = strArr[0];
            this.knowledgeTitle.text = strArr[1];
            return;
        }
        this.knowledgeTitle.text = strArr[0];
    }

    configData() {
        if (!this.pointInfo.knowledgeId) return {};
        this.diagnoseReport = this.workReports[this.pointInfo.knowledgeId];
        this.qRecords = this.diagnoseReport ? this.diagnoseReport.qRecords : null;
    }

    checkQuesFromThisPaper(item) {
        let thisQIdAndInstanceId = item.id + this.paperInstanceId;
        return item.quesIdAndInstanceId == thisQIdAndInstanceId;
    }

    checkThisPaperQues(item, index) {
        if (this.checkQuesFromThisPaper(item)) {
            let qSeq = +this.quesRecord[this.pointInfo.knowledgeId].questionDict[item.id].qSeq;
            let qgSeq = +this.quesRecord[this.pointInfo.knowledgeId].questionDict[item.id].qgSeq;

            let qgSeqStr = this.commonService.convertToChinese(qgSeq + 1);
            return qgSeqStr + '、' + (qSeq + 1);
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
        this.configData();
        this.firstLoading = true;
        this.loadingText = '获取考点诊断中';
        this.showBottomFlag = this.getStateService().params.urlFrom != 'diagnose_do_question02';
        this.quesRecord = this.analysisQuesRecordData();
    }


    analysisQuesRecordData() {
        this.knowledgeArr = this.classReport.knowledgeQuestionDict;
        this.currentStuWorkInfo = this.classReport.stuId2KnowledgeMasterDict[this.stuId].quantityOfMasterLevel;
        let quesRecord = {};
        let knowledgeIdArr = Object.values(this.currentStuWorkInfo);
        let knowledges = [];
        angular.forEach(knowledgeIdArr, (v, k) => {
            knowledges = knowledges.concat(knowledgeIdArr[k]);
        });
        angular.forEach(knowledges, (value, key) => {
            quesRecord[knowledges[key]] = this.knowledgeArr[knowledges[key]];
        });

        return quesRecord;
    }

    onAfterEnterView() {
        this.initData();
        this.initFlags();

        if (this.pointInfo) {
            this.initCtrl = true;
            this.getRemoteData(false, this.loadCallback.bind(this), this.clazzId, this.stuId, this.pointInfo);
            return;
        }
    }

    onBeforeLeaveView() {
        this.showDiaglog = false;
    }

    hideAllQ() {
        this.qRecords.forEach((record) => {
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
        if (this.pointInfo && !this.initCtrl) {
            this.initCtrl = true;
            this.getRemoteData(false, this.loadCallback.bind(this), this.clazzId, this.stuId, this.pointInfo);
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
            this.getRemoteData(true, this.loadCallback.bind(this), this.clazzId, this.stuId, this.pointInfo);
        this.loadMoreExecuteCount++;
    }

    pullRefresh() {
        this.getRemoteData(false, this.loadCallback.bind(this), this.clazzId, this.stuId, this.pointInfo);

    }


    goBack() {
        this.go('stu_work_report', {stuId:this.stuId});

    }

    onBeforeLeaveView() {
        this.stuWorkReportService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.stuWorkReportService.cancelRequestList.splice(0, this.stuWorkReportService.cancelRequestList.length);
    }

    getRemoteData(flag, callback, clazzId, stuId, pointInfo) {
        this.stuWorkReportService.fetchDiagnoseReportForWork(flag, callback, clazzId, stuId, pointInfo);
    }

}
export default quesRecordCtrl
