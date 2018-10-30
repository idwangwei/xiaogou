/**
 * Created by qiyuexi on 2018/3/12.
 */
/**
 * edit Author ww on 2015/10/10.
 * @description 作业学生列表(未提交、已提交、未批改统计页面)controller
 */
import modalHtml from './sortSetting.html';
import {Inject, View, Directive, select} from '../../module';
import _each from 'lodash.foreach';
import _findIndex from 'lodash.findindex';
import _sortBy from 'lodash.sortby';
import buildCfg from "default";

@View('area_evaluation_detail', {
    url: '/area_evaluation_detail/:paperInstanceId',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$state'
        , '$rootScope'
        , '$ionicModal'
        , '$ionicScrollDelegate'
        , '$timeout'
        , '$interval'
        , '$ionicPopup'
        , 'commonService'
        , 'finalData'
        , 'workListService'
        , '$ngRedux'
        , 'workStatisticsService'
        , 'areaEvaluationService'
    ]
})
export default class WorkStudentListCtrl {
    $ionicModal;
    $ionicScrollDelegate;
    $timeout;
    $interval;
    $ionicPopup;
    commonService;
    finalData;
    workListService;
    sortConfig={
        sortByList: [
            {code: 1, name: '得分'}
            , {code: 2, name: '用时'}
            , {code: 6, name: '最近一次提交时间'}
        ],
        sortBy: window.localStorage.getItem('sortBy') || 1,//排序类型，默认为'得分'
        sortUpOrDown: [
            {
                type: 'down',
                name: '降序',
                selected: window.localStorage.getItem('sortOrder') == 'down'
            }, {
                type: 'up',
                name: '升序',
                selected: window.localStorage.getItem('sortOrder') != 'down'
            }
        ],
        sortOrder:window.localStorage.getItem('sortOrder') ||'up', //排列顺序，默认升序
    }
    workStatisticsService;
    areaEvaluationService
    sortModal = null; //已批改的学生列表排序设置modal
    initCtrl = false; //初始化ctrl flag
    @select(state=>state.ae_score_type_list) AEScoreTypeList;
    @select(state=>state.ae_statics_info) AEStaticsInfo;
    @select(state=>state.ae_paper_clazz_list) AEPaperClazzList;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    @select(state=>state.wl_selected_work) currentWork;
    constructor() {
        this.initModal();

    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> {
                this.initCtrl = true;
                this.paperId = this.getStateService().params.paperInstanceId
                this.workListService.getPaperById(this.currentWork).then((res)=> {
                    if (res) {
                        _each(res.qsTitles, (bigQ)=> {
                            bigQ.bigQVoIndex = this.commonService.convertToChinese(bigQ.seqNum + 1);//当前大题展示题号，如1映射为一。
                        });
                    }
                    this.workStatisticsService.data.paper = res;
                });
                this.getScoreTypeList();
                this.getStaticsInfo();
                this.getClazzList();
            });
    }
    onAfterEnterView() {

    }

    initModal() {
        this.sortModal = this.$ionicModal.fromTemplate(modalHtml, {scope: this.getScope()});
        this.getScope().$on('$destroy', ()=> {
            this.sortModal.remove();
        })
    }

    back() {
        this.go("area_evaluation_list");
    }

    help() {
        if(this.AEPaperClazzList.length>0){
            var msg='<p>点击下载成绩单按钮，再复制链接到浏览器打开，就可以下载所有学生的成绩单。</p>'
        }else{
            var msg='<p>还暂无学生提交哦。</p>'
        }
        this.$ionicPopup.alert({
            title: '信息提示',
            template: msg,
            okText: '确定'
        });
    }

    onBeforeEnterView() {

    }

    pullRefresh() {
        this.getScoreTypeList();
        this.getStaticsInfo();
        this.getClazzList().then(()=>{
            this.getScope().$broadcast('scroll.refreshComplete');
        });
    }

    /**
     * 统计:　点击统计按钮,进入统计展示页
     */
    handleStatisticBtnClick() {
        if (false) {//当前没有已批改的学生
            this.commonService.alertDialog("没有已批改的学生作业！", 1500);
            return;
        }

        this.getStateService().go("work_statistics");
    }


    /**
     * 排序: 学生列表排序设置
     */
    handleSortConfigClick() {
        this.sortModal.show();
    }

    /**
     * 排序: 排序设置modal中点击'返回'按钮
     */
    closeSortModal() {
        this.sortModal.hide();
    }

    /**
     * 排序: 确定操作
     */
    confirmSortModal() {
        //设置排序顺序升|降
        _each(this.sortConfig.sortUpOrDown, (data)=> {
            if (data.selected) {
                window.localStorage.setItem('sortOrder', data.type);
            }
        });
        //设置绿色箭头显示|隐藏
        // window.localStorage.setItem('showGreenIcon', this.sortConfig.showGreenIcon.flag);
        //设置排序类型
        window.localStorage.setItem('sortBy', this.sortConfig.sortBy);
        let paramIn={
            sortScore:false,
            sortTime:false,
            sortLastTime:false,
            sort:'asc'
        };
        if (this.sortConfig.sortBy == 1) {
            paramIn.sortScore=true;
        }
        else if (this.sortConfig.sortBy == 2) {
            paramIn.sortTime=true;
        }
        else if (this.sortConfig.sortBy == 6) {
            paramIn.sortLastTime=true;
        }
        if (this.sortConfig.sortOrder == 'down') {
            paramIn.sort='desc';
        }
        this.getClazzList(paramIn);
        this.sortModal.hide();
    }

    /**
     * 排序: 选择排序顺序为升序|降序
     * @param sort 选中的对象
     */
    selectSortUpOrDown(sort) {
        sort.selected = true;
        this.sortConfig.sortOrder = sort.type;
        _each(this.sortConfig.sortUpOrDown, (data)=> {
            if (data.type != sort.type) {
                data.selected = false;
            }
        });
    }


    /**
     * 未提交列表显示模式切换
     */
    changeShowModel() {
        this.isSimplePattern = !this.isSimplePattern;
        this.$ionicScrollDelegate.scrollTop(true);
    }

    /**
     * sub-header切换点击
     * @param tabType
     */
    tabClick(tabType) {
        if (tabType == this.getScope().subHeaderInfo.activeEle) {
            return
        }

        this.selectStuAllFlag = false;//取消所用的选项框
        this.isShowSelectBox = false; //隐藏选项框
        this.selectStuArrFromPraiseCorrected.length = 0;
        this.selectStuArrFromPraiseUnSubmitted.length = 0;
        this.selectStuArrFromCollectPaper.length = 0;
        this.$ionicScrollDelegate.scrollTop(true);

        //todo 回到之前的滚动位置
        // switch (tabType) {
        //     case SUB_HEADER_ITEM.CORRECTED:
        //         if ($scope.wData.correctedPageScrollPosition) {
        //             $ionicScrollDelegate.scrollBy(0, $scope.wData.correctedPageScrollPosition);
        //         }
        //         break;
        //     case SUB_HEADER_ITEM.UN_SUBMITTED:
        //         if ($scope.wData.unSubmittedPageScrollPosition) {
        //             $ionicScrollDelegate.scrollBy(0, $scope.wData.unSubmittedPageScrollPosition);
        //         }
        //         break;
        //     case SUB_HEADER_ITEM.NOT_CORRECTED:
        //         if ($scope.wData.notCorrectedPageScrollPosition) {
        //             $ionicScrollDelegate.scrollBy(0, $scope.wData.notCorrectedPageScrollPosition);
        //         }
        //         break;
        // }
    }


    /**
     * 查看试卷内容: 点击查看试卷内容的回调函数
     */
    showPaperData() {
        this.workStatisticsService.data.goCorrectQFlag = true;

        this.workStatisticsService.wData.queryParam.paperId = this.currentWork.paperId;
        this.workStatisticsService.wData.queryParam.paperInstanceId = this.currentWork.instanceId;
        this.workStatisticsService.data.currentStu = {};
        this.getStateService().go("work_detail");
    }

    /*获取分数区间列表*/
    getScoreTypeList() {
        this.areaEvaluationService.getScoreTypeList({
            filter: JSON.stringify({
                "type": 16,
                "paper": {
                    "paperInstanceId": this.paperId,
                    "paperId": this.paperId
                }
            })
        })
    }
    /*获取平均分信息*/
    getStaticsInfo(){
        this.areaEvaluationService.getStaticsInfo({
            filter: JSON.stringify({
                "type": 16,
                "paper": {
                    "paperInstanceId": this.paperId,
                    "paperId": this.paperId
                }
            }),
            shardingId:this.clazzId,
            publishType:16
        })
    }
    /*获取班级信息*/
    getClazzList(param){
        param||(param={
            sortScore:true,
            sortTime:false,
            sortLastTime:false,
            sort:'desc'
        })
        param.paperId=this.paperId;
        param.publishType=16;
        return this.areaEvaluationService.getClazzList(param)
    }
    /*下载报表*/
    downloadReport(){
        this.areaEvaluationService.getExcelInfo({
            paperId:this.paperId
        }).then((data)=>{
            if(data.isExport){
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '<p>长按全选复制该链接</p><textarea style="color: #6EAAE0;background: transparent" rows="4">'+buildCfg.img_server+'/excel/areaTeachingExcel/'+data.excelName+'</textarea><p>用浏览器下载<span style="color: red">学生成绩表</span></p>'
                })
            }else{
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '<p style="text-align: center">测评还未结束，请结束后再来</p><p style="text-align: center">下载<span style="color: red">学生成绩表</span></p>'
                })
            }
        })
    }
}
