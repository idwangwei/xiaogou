/**
 * Created by ZL on 2017/12/25.
 */
import {Inject, View, Directive, select} from './../../module';

@View('mirco_all_ques_records', {
    url: '/mirco_all_ques_records',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$rootScope'
        , '$state'
        , '$stateParams'
        , '$ionicScrollDelegate'
        , 'commonService'
        , '$interval'
        , '$ngRedux'
        , '$ionicPopup'
        , '$ionicTabsDelegate'
        , '$timeout'
        , 'microlectureService'

    ]
})

class mircoAllQuesRecordsCtrl {
    commonService;
    microlectureService;

    @select(state=>state.micro_select_example_item) examSelectPoint;
    @select(state=>state.fetch_micro_all_ques_records_processing) isLoadingProcessing;
    @select((state)=> {
        let examSelectPoint = state.micro_select_example_item;
        if (!examSelectPoint.groupId) return {};
        let mircoAllReport = state.mirco_with_report[examSelectPoint.groupId];//根据例从本地拉取题目信息
        let qRecords = mircoAllReport ? mircoAllReport.qRecords : null;
        return qRecords
    }) qRecords;

    initData() {
        this.initCtrl = false;
        this.firstLoading = true;
        this.loadingText = '加载中';
    }

    /**
     * 初始化ctrl中的一些 flag
     */
    initFlags() {
        this.loadMoreExecuteCount = 0; //从ion-infinite-scroll调用加载列表方法的次数
        this.moreFlag = false;//是否出现加载更多的指令
        this.showDiaglog = true;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (this.examSelectPoint && !this.initCtrl) {
            this.initCtrl = true;
            this.microlectureService.fetchMicroAllReport(false, this.loadCallback.bind(this));
        }
    }


    onAfterEnterView() {
        this.initData();
        this.initFlags();
    }

    onBeforeEnterView() {
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

    /**
     * 加载列表完毕的回调
     * @param loadMore 是否是上划刷新的情况
     * @param loadAllComplete 对应班级下的游戏列表是否全部加载完毕
     */
    loadCallback(loadMore, loadAllComplete) {
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
            this.microlectureService.fetchMicroAllReport(true, this.loadCallback.bind(this));
        this.loadMoreExecuteCount++;
    }

    pullRefresh() {
        this.microlectureService.fetchMicroAllReport(false, this.loadCallback.bind(this));
    }


    back() {
        this.go('micro_example_detail', 'back');
    }

}
export default mircoAllQuesRecordsCtrl;