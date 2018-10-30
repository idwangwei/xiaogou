/**
 * Created by qiyuexi on 2018/1/12.
 */
import {Inject, View, Directive, select} from '../../module';
@View('final_sprint_report', {
    url: '/final_sprint_report/:urlFrom/:pointIndex/:pointName/:backWorkReportUrl',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$state'
        ,'$rootScope'
        , '$stateParams'
        , 'commonService'
        , 'profileService'
        , '$ngRedux'
        , 'diagnoseService'
    ]
})
class DiagnoseReportCtrl {
    constructor() {
        this.pointIndex=this.getStateService().params.pointIndex;
        this.backWorkReportUrl=this.getStateService().params.backWorkReportUrl;
        this.initFlags()
        this.initData()
    }

    /**
     * 初始化ctrl中的一些 flag
     */
    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过一次做题记录
        this.loadMoreExecuteCount = 0; //从ion-infinite-scroll调用加载列表方法的次数
        this.moreFlag = false;//是否出现加载更多的指令
        this.showDiaglog=true;
    }


    initData() {
        this.firstLoading=true;
        this.loadingText='获取考点诊断中';
        this.showBottomFlag=false;
    }

    onBeforeEnterView() {
    }


    onAfterEnterView(){
        this.backWorkReportUrl=this.getStateService().params.backWorkReportUrl;
        if(this.chapterSelectPoint){
            this.initCtrl=true;
            this.fetchDiagnoseReport(false,this.loadCallback.bind(this),this.getRootScope().isIncreaseScore);
            return;
        }
    }

    onBeforeLeaveView(){
        this.showDiaglog=false;
    }

    hideAllQ(){
        this.qRecords.forEach((record)=>{
            for(let key in record.smallQStuAnsMapList){
                record.smallQStuAnsMapList[key].showQFlag=false;
            }
        })
    }

    hasNoRecords(){
        return  this.initCtrl&&!this.firstLoading&&(!this.qRecords||!this.qRecords.length);
    }



    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (this.chapterSelectPoint&&!this.initCtrl) {
            this.initCtrl=true;
            this.fetchDiagnoseReport(false,this.loadCallback.bind(this),this.getRootScope().isIncreaseScore);
        }
    }

    showMasterTip(){
        let formatTipText=()=>{
            switch (this.chapterSelectPoint.level){
                case 1:
                    return '小伙伴，我看好你哦！';
                case 2:
                    return '仔细一点，加油哦！';
                case 3:
                    return '我有点犹豫要不要被你领养...';
                case 4:
                    return '太赞了，主人求带走！';
            }
        };
        this.getScope().$emit('diagnose.dialog.show',
            {'comeFrom':'diagnose','content':formatTipText()}
        );
    }

    /**
     * 加载列表完毕的回调
     * @param loadMore 是否是上划刷新的情况
     * @param loadAllComplete 对应班级下的游戏列表是否全部加载完毕
     */
    loadCallback(loadMore, loadAllComplete) {
        this.moreFlag = !loadAllComplete;
        this.firstLoading=false;

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
            this.fetchDiagnoseReport(true, this.loadCallback.bind(this),this.getRootScope().isIncreaseScore);
        this.loadMoreExecuteCount++;
    }

    pullRefresh() {
        this.fetchDiagnoseReport(false, this.loadCallback.bind(this),this.getRootScope().isIncreaseScore);
    }


    back(){
        if (this.backWorkReportUrl) {
            this.go('final_sprint_diagnose_do_question', 'forward', {
                'pointName': this.getStateService().params.pointName,
                'backWorkReportUrl': this.backWorkReportUrl
            });
        } else {
            this.go('final_sprint_diagnose_do_question', 'forward', {'pointName': this.getStateService().params.pointName});
        }
    }

    gotoDiagnoseDoQues(){
        if(this.backWorkReportUrl){
            this.go('final_sprint_diagnose_do_question','farword',{'pointName':this.getStateService().params.pointName,'backWorkReportUrl':this.backWorkReportUrl});
        }else{
            this.go('final_sprint_diagnose_do_question','farword',{'pointName':this.getStateService().params.pointName});
        }

    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseReportRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseReportRequestList.splice(0, this.diagnoseService.cancelDiagnoseReportRequestList.length);//清空请求列表
    }

    mapStateToThis(state) {
        let chapterSelectPoint=state.chapter_select_point;
        if(!chapterSelectPoint.knowledgeId) return{};
        let diagnoseReport=state.knowledge_with_report[chapterSelectPoint.knowledgeId];
        let report=diagnoseReport?diagnoseReport.report:null;
        let qRecords=diagnoseReport?diagnoseReport.qRecords:null;
        return {
            chapterSelectPoint:chapterSelectPoint,
            diagnoseReport:diagnoseReport,
            report:report,
            qRecords:qRecords,
            isLoadingProcessing:state.fetch_diagnose_report_processing
        };
    }

    mapActionToThis() {
        let diagnoseService= this.diagnoseService;
        return {
            fetchDiagnoseReport:diagnoseService.fetchDiagnoseReport.bind(diagnoseService)
        }
    }
}
export default DiagnoseReportCtrl;





