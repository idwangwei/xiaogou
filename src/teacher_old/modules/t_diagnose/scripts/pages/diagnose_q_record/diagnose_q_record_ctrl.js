/**
 * Created by 邓小龙 on 2016/11/2.
 */
import $ from 'jquery';
import {Inject, View, Directive, select} from '../../module';

@View('home.diagnose_q_record', {
    url: '/diagnose_q_record',
    styles: require('./diagnose_q_record.less'),
    views: {
        "diagnose": {
            template: require('./diagnose_q_record.html')
        }
    },
    inject: ['$scope', '$rootScope', '$log', '$state', '$timeout', "diagnoseService", 'commonService', '$ngRedux']
})

class DiagnoseQRecordCtrl {
    $scope;
    $rootScope;
    $log;
    $state;
    $timeout;
    diagnoseService;
    commonService;
    $ngRedux;

    initCtrl = false;//ctrl是否初始化
    loadMoreExecuteCount = 0; //从ion-infinite-scroll调用加载列表方法的次数
    moreFlag = false;//是否出现加载更多的指令
    firstLoading = true;
    loadingText = '获取做题记录中';

    levelValueArr = ["未做题", "未掌握", "不牢固", "牢固"];

    @select(state=>state.diagnose_unit_select_stu) diagnose_unit_select_stu;
    @select(state=>state.diagnose_selected_clazz) diagnoseSelectedClazz;
    @select(state=>state.diagnose_unit_select_knowledge) unitSelectKnowledge;
    @select(state=>state.fetch_diagnose_q_records_processing) isLoadingProcessing;
    @select((state)=> {
        let diagnoseUnitSelectStu = state.diagnose_unit_select_stu;
        let stu = state.diagnose_unit_select_stu;
        let unitId = diagnoseUnitSelectStu.selectedUnitId;
        let clazzId = diagnoseUnitSelectStu.selectedClazzId;
        if (diagnoseUnitSelectStu.knowledgePoint) {
            let knowledgeId = diagnoseUnitSelectStu.knowledgePoint.knowledgeId;
            let knowledgeStateKey = clazzId + '#' + unitId + '/' + knowledgeId;
            return state.stu_with_records_diagnose[knowledgeStateKey + '/' + stu.studentId];
        }
    }) stuWithRecordsDiagnose;

    constructor() {


    }

    back() {
        if ($(".recommend-training-back-drop").css("display") === "block") {
            this.getScope().$emit("recommend.hide");
        } else {
            this.go('home.diagnose_student', 'back')
        }
        // this.getScope().$digest();
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>(this.unitSelectKnowledge && !this.initCtrl))
            .then(()=>this.initCtrl = true)
            .then(()=>this.diagnoseService.fetchQRecords(false, this.loadCallback.bind(this)))
    }

    hideAllQ() {
        this.stuWithRecordsDiagnose.qRecords.forEach((record)=> {
            for (let key in record.smallQStuAnsMapList) {
                record.smallQStuAnsMapList[key].showQFlag = false;
            }
        })
    }

    hasNoRecords() {
        return this.initCtrl && this.stuWithRecordsDiagnose && (!this.stuWithRecordsDiagnose.qRecords || !this.stuWithRecordsDiagnose.qRecords.length);
    }


    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseQRecordRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseQRecordRequestList.splice(0, this.diagnoseService.cancelDiagnoseQRecordRequestList.length);//清空请求列表
    }


    /**
     * 加载列表完毕的回调
     * @param loadMore 是否是上划刷新的情况
     * @param loadAllComplete 对应班级下的游戏列表是否全部加载完毕
     */
    loadCallback(loadMore, loadAllComplete) {
        this.firstLoading = false;
        this.moreFlag = !loadAllComplete;

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
            this.diagnoseService.fetchQRecords(true, this.loadCallback.bind(this));
        this.loadMoreExecuteCount++;
    }

    pullRefresh() {
        this.diagnoseService.fetchQRecords(false, this.loadCallback.bind(this));
    }


}

export default DiagnoseQRecordCtrl;






