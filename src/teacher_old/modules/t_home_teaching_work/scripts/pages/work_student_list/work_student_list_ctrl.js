/**
 * Author ww on 2015/10/10.
 * @description 作业学生列表(未提交、已提交、未批改统计页面)controller
 */
import modalHtml from './sortSetting.html';
import * as simulationData from '../../../../t_boot/json/simulationClazz/index';
import {Inject, View, Directive, select} from '../../module';
import _each from 'lodash.foreach';
import _findIndex from 'lodash.findindex';
import _sortBy from 'lodash.sortby';
import _pluck from 'lodash.pluck';

/**
 *  页面中显示选择footer的不同条件
 * @type {string}
 */
const COLLECT_PAPER = 'collectPaper'; //点击的强制回收作业,显示选择的footer
const PRAISE_CORRECTED = 'praiseCorrected'; //点击已批改页中的评价,显示选择的footer
const PRAISE_UN_SUBMITTED = 'praiseUnSubmitted'; //点击未提交页中的评价,显示选择的footer
const SUB_HEADER_ITEM = {
    CORRECTED: "corrected",
    UN_SUBMITTED: "un_submitted",
    NOT_CORRECTED: "not_corrected"
}; //sub-header标签名

@View('work_student_list', {
    url: '/work_student_list/:paperInstanceId/:isNoPublish',
    template: require('./work_student_list.html'),
    styles: require('./work_student_list.less'),
    inject: [
        '$scope'
        , '$state'
        , '$rootScope'
        , '$ionicModal'
        , '$ionicScrollDelegate'
        , '$timeout'
        , '$interval'
        , '$ionicPopup'
        , '$ngRedux'
        , 'commonService'
        , 'finalData'
        , 'sortConfig'
        , 'workListService'
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
    sortConfig;
    workStatisticsService;
    @select(state=>state.wl_selected_work) currentWork;
    @select(state=>state.wl_fetch_student_list_processing) isLoadingProcessing;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    sortModal = null; //已批改的学生列表排序设置modal
    initCtrl = false; //初始化ctrl flag
    retFlag = false;
    isSimplePattern = false; //展示未提交的学生列表是否是简易模式
    isShowSelectBox = false; //是否显示选项框
    isPullRefresh = false; //<loading-processing>是否显示的flag,如果是下拉刷新则不显示
    selectStuAllFlag = false; //点击底部评价按钮后,全选列表中的学生flag
    showSelectBoxFrom = ''; //页面中触发显示选择footer的条件
    selectStuArrFromCollectPaper = []; //回收作业选择的学生列表
    selectStuArrFromPraiseCorrected = []; //评价已批改选择的学生列表
    selectStuArrFromPraiseUnSubmitted = []; //评价未提交选择的学生列表
    SHOW_NAME = {P: "家长", S: '学生', T: '老师'};//在评价明细页面显示的名称
    isCompetitionPaper = false; //是否是竞赛试卷
    wData = this.workStatisticsService.wData;
    showOpenFlag = true;
    sectionData = this.workStatisticsService.sectionData;
    simulationWorkInstanceId = simulationData.default.work_list.paperList[0].instanceId;
    isShowReportBtn = false;
    isNoPublish = this.getStateService().params.isNoPublish;
    pieChart = {
        settings: {
            data: {
                "content": []
            },
            labels: {
                "outer": {
                    "format": "none"
                },
                "percentage": {
                    "color": "#ffffff",
                    "fontSize": 14,
                }
            },
        },
        chartObj: {}
    }; //饼状图
    finalAccessStuAverageScore = {
        districtAveScores: undefined,
        nationalAveScores: undefined
    };

    constructor() {
        this.initModal();
        this.initReportBtn()

    }

    showSectionList(isFirst, selectSection) {
        this.workStatisticsService.wData.currentWork = this.currentWork;
        this.workStatisticsService.wData.queryParam.paperId = this.currentWork.paperId;
        this.workStatisticsService.wData.queryParam.paperInstanceId = this.currentWork.instanceId;

        this.sectionData.label = (isFirst ? '首次做' : '改错后') + '成绩在' + selectSection.label + '内';
        this.sectionData.sectionStudentList = isFirst ? selectSection.firstStudentList : selectSection.latestStudentList;

        this.go("section_student_list");
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> {
                this.isCompetitionPaper = this.currentWork.publishType == 8 || this.currentWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS; //是否是竞赛试卷
                this.isShowReportBtn = this.simulationWorkInstanceId != this.currentWork.instanceId; //是否是模拟班数据
                this.initCtrl = true;
                this.workListService.getPaperById(this.currentWork).then((res)=> {
                    if (res) {
                        _each(res.qsTitles, (bigQ)=> {
                            bigQ.bigQVoIndex = this.commonService.convertToChinese(bigQ.seqNum + 1);//当前大题展示题号，如1映射为一。
                        });
                    }
                    this.workStatisticsService.data.paper = res;
                });
                this.workListService.getWorkStuList(()=> {
                    this.retFlag = true;
                    this.pieChart.settings.data.content = this.currentWork.stu.correctedStusLevel;
                });
                //期末测评试卷获取学生全区|全国的平均分
                if (this.currentWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS) {
                    this.workListService.getFinalAccessStuAverageScore({
                        paperName: this.currentWork.paperName
                    }).then((res)=> {
                        if (res.districtAveScores !== undefined)this.finalAccessStuAverageScore.districtAveScores = res.districtAveScores;
                        if (res.nationalAveScores !== undefined)this.finalAccessStuAverageScore.nationalAveScores = res.nationalAveScores;
                    })
                }
                //期末测评试卷获取学生全区|全国的平均分
                debugger
                if (this.currentWork.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION) {
                    this.workListService.getAreaEvaluationStuAverageScore({
                        filter: JSON.stringify({
                            "type": 16,
                            "paper": {
                                "paperInstanceId": this.currentWork.paperId,
                                "paperId": this.currentWork.paperId
                            }
                        }),
                        shardingId: this.clazzId,
                        publishType: 16
                    }).then((res)=> {
                        if (res.rank !== undefined)this.finalAccessStuAverageScore.districtAveScores = res.rank.firstAverage;
                        this.stopTime=res.rank.stopTime;
                    })
                }
            });
    }

    onAfterEnterView() {
        this.isShowReportBtn = this.isShowReportBtn && this.currentWork.publishType != 4 && this.currentWork.publishType != 9 && this.currentWork.publishType != 8 && this.currentWork.publishType != 10 && this.currentWork.publishType != 11&& this.currentWork.publishType != 21; //不显示作业报告
        this.wData.scoreDistList = [];
        this.workStatisticsService.getScoreDist(this.currentWork.instanceId, this.currentWork.paperId);
        this.isFinalAccess = this.currentWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS;
    }

    initModal() {
        this.sortModal = this.$ionicModal.fromTemplate(modalHtml, {scope: this.getScope()});
        this.getScope().$on('$destroy', ()=> {
            this.sortModal.remove();
        })
    }

    back() {
        let url = this.getRootScope().workStuListBackUrl || 'home.work_list';
        let param = url === 'home.work_list' ? {category: 2, workType: 2, refresh: 'yes'} : {};
        this.getStateService().go(url, param);
    }

    help() {
        this.$ionicPopup.alert({
            title: '信息提示',
            template: '<p>点击已批改学生右侧图标，可对学生提供评价等。</p>',
            okText: '确定'
        });
    }

    onBeforeEnterView() {
        this.guideFlag = this.commonService.getSimulationClazzLocalData();

        if (this.initCtrl && this.retFlag) {
            this.retFlag = false;
            this.workListService.getWorkStuList(()=> {
                this.retFlag = true
            });


            this.handleUndoBtnClick();
        }
        //如果是测评可能需要及时刷新，後來都需要刷新
        if(this.currentWork&&this.currentWork.publishType==16){
            this.initCtrl=false;//每次进来拿一下数据
        }
    }

    pullRefresh() {
        this.isPullRefresh = true;
        this.isShowSelectBox = false;
        this.workListService.getWorkStuList(callback.bind(this));
        this.workStatisticsService.getScoreDist(this.currentWork.instanceId, this.currentWork.paperId);
        function callback() {
            this.getScope().$broadcast('scroll.refreshComplete');
            this.$ionicScrollDelegate.scrollTop(true);
            this.isPullRefresh = false;
        }
    }

    /**
     * 统计:　点击统计按钮,进入统计展示页
     */
    handleStatisticBtnClick() {
        if (!this.currentWork.stu.correctedStusLength || this.currentWork.stu.correctedStusLength == 0) {//当前没有已批改的学生
            this.commonService.alertDialog("没有已批改的学生作业！", 1500);
            return;
        }

        if (this.guideFlag && !this.guideFlag.isGuideAnimationEnd) {
            this.guideFlag.isGuideAnimationEnd = true;
            //window.localStorage.setItem("teachingGuideFlag",JSON.stringify(this.guideFlag));
            this.commonService.saveSimulationClazzLocalData(this.guideFlag);
        }

        this.getStateService().go("work_statistics");
    }

    /**
     * 分布: 分数区间的人数分布
     */
    handleScoreDisBtnClick() {
        this.workStatisticsService.wData.queryParam.paperId = this.currentWork.paperId;
        this.workStatisticsService.wData.queryParam.paperInstanceId = this.currentWork.instanceId;
        this.getStateService().go("score_distribution");
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
        window.localStorage.setItem('showGreenIcon', this.sortConfig.showGreenIcon.flag);
        //设置排序类型
        window.localStorage.setItem('sortBy', this.sortConfig.sortBy);

        this.currentWork.stu.correctedStus = _sortBy(this.currentWork.stu.correctedStus, (v)=> {
            let sortParam;
            if (this.sortConfig.sortBy == 1) {
                sortParam = v.scores[0];
            }
            else if (this.sortConfig.sortBy == 2) {
                sortParam = v.elapse;
            }
            else if (this.sortConfig.sortBy == 4) {
                sortParam = v.scores[1];
            }
            else if (this.sortConfig.sortBy == 6) {
                //将日期中的-替换为/ 兼容ios
                sortParam = new Date(v.latestSubmitTime.slice(0, -4).replace(/-/g, '/')).getTime();
            }
            return this.sortConfig.sortOrder == 'down' ? -sortParam : sortParam;
        });

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
     * 评价已批改的学生
     * @param isCorrectedPage 点击footer中的评价按钮的subHeader id
     */
    handlePraiseBtnClick(isCorrectedPage) {
        this.isShowSelectBox = true;
        this.showSelectBoxFrom = isCorrectedPage ? PRAISE_CORRECTED : PRAISE_UN_SUBMITTED;
    }

    setSystermPraise() {
        this.go('auto_evaluate');
    }

    isPpecialWork() {
        return this.currentWork.publishType === this.finalData.WORK_TYPE.SUMMER_WORK || this.currentWork.publishType === this.finalData.WORK_TYPE.WINTER_WORK;
    }

    /**
     * 强制回收作业
     */
    handleCollectPaperBtnClick() {
        if (this.guideFlag && !this.guideFlag.isGuideEnd) {//模拟班不能强制回收作业
            this.commonService.alertDialog('模拟班的学生不能强制收作业哦。');
            return;
        }
        this.isShowSelectBox = true;
        this.showSelectBoxFrom = COLLECT_PAPER;
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

    /**
     * 查看试卷内容: 跳转到指定学生的作业
     * @param stu 指定的学生
     */
    goWorkDetail(stu) {
        if (stu.gender == '-1') {
            this.commonService.showConfirm('信息提示', '<p style="text-align: center">该学生已不在此班级中。</p>');
            return
        }

        this.workStatisticsService.wData.queryParam.paperId = this.currentWork.paperId;
        this.workStatisticsService.wData.queryParam.paperInstanceId = this.currentWork.instanceId;
        this.workStatisticsService.data.currentStu = {
            stuId: stu.id,
            stuName: stu.name
        };


        this.getStateService().go("work_detail", {user: stu.id});
    };

//===========================点击(强制回收作业|评价)后显示的最新选择footer中的按钮点击回调=========================================

    /**
     * 点击评价后显示最新的选择footer中点击确定
     */
    handleSureBtnClick() {
        //批量强制回收作业
        if (this.showSelectBoxFrom == COLLECT_PAPER) {
            if (this.selectStuArrFromCollectPaper.length == 0) {
                this.commonService.alertDialog("请先选择学生，然后回收他们的作业!");
                return;
            }
            var title = "信息提示";
            var contentTemplate = "<p style='text-align: center'>确定要强制回收所选学生的作业吗？</p>";
            this.commonService.showConfirm(title, contentTemplate).then((res)=> {
                if (res) {
                    var param = {
                        paperInstanceId: this.currentWork.instanceId,
                        subjectId: this.currentWork.paperId,
                        subjectType: 1, //作业
                        sIds: _pluck(this.selectStuArrFromCollectPaper, 'id').join(",")
                    };
                    this.workListService.compelSubmitWork(param).then((data)=> {
                        if (data.code == 200) {
                            this.commonService.alertDialog("所选学生的作业已成功被强制回收!");
                            this.workListService.getWorkStuList();

                            this.handleUndoBtnClick();
                        }
                    });
                }
            });
        }
        //批量评价
        else {
            this.workStatisticsService.data.currentStu = null;
            this.workStatisticsService.data.stu.stuSelectedList = [];
            if (this.showSelectBoxFrom == PRAISE_CORRECTED) {
                this.workStatisticsService.data.stu.stuSelectedList = this.selectStuArrFromPraiseCorrected.slice(0);
            } else {
                this.workStatisticsService.data.stu.stuSelectedList = this.selectStuArrFromPraiseUnSubmitted.slice(0);
            }

            if (this.workStatisticsService.data.stu.stuSelectedList.length <= 0) {
                this.commonService.alertDialog("请先勾选学生!", 1500);
                return false;
            }
            //以下刷新学生列表，
            this.workStatisticsService.data.getWorkStuListFlag = false;
            // this.workStatisticsService.data.praiseFlag = false;//是否点击了评价按钮
            this.workStatisticsService.wData.currentWork = this.currentWork;
            this.workStatisticsService.wData.queryParam.paperId = this.currentWork.paperId;
            this.workStatisticsService.wData.queryParam.paperInstanceId = this.currentWork.instanceId;

            this.getStateService().go('work_praise');
        }
    }

    /**
     * 选择footer中点击全选|取消全选
     */
    handleSelectAllBtnClick() {
        this.selectStuAllFlag = !this.selectStuAllFlag;
        switch (this.showSelectBoxFrom) {
            case PRAISE_CORRECTED:
                //取消全选
                this.selectStuArrFromPraiseCorrected.length = 0;
                //全选
                if (this.selectStuAllFlag) {
                    _each(this.currentWork.stu.correctedStus, (stu)=> {
                        this.selectStuArrFromPraiseCorrected.push(stu);
                    });
                }
                break;
            case PRAISE_UN_SUBMITTED:
                this.selectStuArrFromPraiseUnSubmitted.length = 0;
                if (this.selectStuAllFlag) {
                    _each(this.currentWork.stu.notSubStus, (stu)=> {
                        this.selectStuArrFromPraiseUnSubmitted.push(stu);
                    });
                }
                break;
            case COLLECT_PAPER:
                this.selectStuArrFromCollectPaper.length = 0;
                if (this.selectStuAllFlag) {
                    _each(this.currentWork.stu.notSubStus, (stu)=> {
                        this.selectStuArrFromCollectPaper.push(stu);
                    });
                }
                break;
            default:
        }
    }

    /**
     * 选择footer中点击取消
     */
    handleUndoBtnClick() {
        this.selectStuAllFlag = false;//取消所用的选项框
        this.isShowSelectBox = false; //隐藏选项框

        switch (this.showSelectBoxFrom) {
            case PRAISE_CORRECTED:
                this.selectStuArrFromPraiseCorrected.length = 0;
                break;
            case PRAISE_UN_SUBMITTED:
                this.selectStuArrFromPraiseUnSubmitted.length = 0;
                break;
            case COLLECT_PAPER:
                this.selectStuArrFromCollectPaper.length = 0;
                break;
            default:
        }
    }

//===========================点击学生列表右侧的图标进行评价|查看评价==========================================================
    /**
     * 修改评价
     * @param correctedStu
     * @param notSubmitFlag
     */
    editPraise(correctedStu, notSubmitFlag) {
        if (correctedStu.gender == '-1') {
            this.commonService.showConfirm('信息提示', '<p style="text-align: center">该学生已不在此班级中。</p>');
            return
        }

        correctedStu.selected = true;
        this.workStatisticsService.data.currentStu = {};
        this.workStatisticsService.data.currentStu.stuId = correctedStu.id;
        this.workStatisticsService.data.stu.stuSelectedList = [correctedStu];
        //以下刷新学生列表，
        this.workStatisticsService.data.getWorkStuListFlag = false;
        this.workStatisticsService.wData.queryParam.paperId = this.currentWork.paperId;
        this.workStatisticsService.wData.queryParam.paperInstanceId = this.currentWork.instanceId;

        this.getStateService().go('work_praise');
    }

    /**
     * 显示信封具体内容
     * @param correctedStu 当前学生
     * @param showType  展示区分  1为学生2为老师3家长
     */
    showPraiseDetail(correctedStu, showType) {
        if (correctedStu.gender == '-1') {
            this.commonService.showConfirm('信息提示', '<p style="text-align: center">该学生已不在此班级中。</p>');
            return
        }

        this.workStatisticsService.data.correctedPraise = {};
        this.workStatisticsService.data.correctedPraise.correctedStu = correctedStu;
        this.workStatisticsService.data.correctedPraise.showType = showType;
        this.workStatisticsService.wData.queryParam.paperId = this.currentWork.paperId;
        this.workStatisticsService.wData.queryParam.paperInstanceId = this.currentWork.instanceId;
        switch (showType) {
            case 1:
                this.workStatisticsService.data.correctedPraise.showName = this.SHOW_NAME.S;
                break;
            case 2:
                this.workStatisticsService.data.correctedPraise.showName = this.SHOW_NAME.T;
                break;
            case 3:
                this.workStatisticsService.data.correctedPraise.showName = this.SHOW_NAME.P;
                break;
            default:
                this.workStatisticsService.data.correctedPraise.showName = "";
        }
        this.getStateService().go("work_praise_detail");
    }

//===========================学生选择操作
    /**
     * 检查该学生是否被选择
     * @param currentStu
     */
    checkStuSelected(currentStu) {
        //选择的学生集合
        let stuArr = this.showSelectBoxFrom == PRAISE_CORRECTED ?
            this.selectStuArrFromPraiseCorrected : this.showSelectBoxFrom == PRAISE_UN_SUBMITTED ?
            this.selectStuArrFromPraiseUnSubmitted : this.selectStuArrFromCollectPaper;

        return _findIndex(stuArr, {id: currentStu.id}) != -1;
    }

    /**
     * 点击学生的选项框,选择或取消选择
     * @param currentStu
     */
    clickSelectBox(currentStu) {
        //选择的学生集合
        let stuArr = this.showSelectBoxFrom == PRAISE_CORRECTED ?
            this.selectStuArrFromPraiseCorrected : this.showSelectBoxFrom == PRAISE_UN_SUBMITTED ?
            this.selectStuArrFromPraiseUnSubmitted : this.selectStuArrFromCollectPaper;

        let index = _findIndex(stuArr, {id: currentStu.id});
        //取消选择
        if (index != -1) {
            stuArr.splice(index, 1);
        }
        //选择
        else {
            stuArr.push(currentStu);
        }
    }

    getHighLightEle() {
        this.currentShowEle = $('#workStuListBtn'); //进入作业后“统计”高亮
    }


    goToDiagnoseReport() {
        this.getStateService().go("work_stu_diagnose_report");
    }

    gotoWorkStatisticsReport() {
        if(!this.currentWork.stu.correctedStusLength){
            this.commonService.showAlert('信息提示', '<p style="text-align: center">还没有学生提交作业，无法查看作业报告。</p>');
            return;
        }
        this.getStateService().go("work_statistics_report", {
            paperInstanceId: this.getStateService().params.paperInstanceId,
            isNoPublish: this.getStateService().params.isNoPublish,
            type:this.currentWork.publishType
        });
    }
    /*去测评报告页面*/
    toReport(){
        if(!this.stopTime) return;
        let stopTime=new Date(this.stopTime.replace(/-/g,'/')).getTime();
        let now=new Date().getTime();
        this.areaEvaluationService.getAllReportInfo({
            instanceId:this.currentWork.paperId,
            groupId:this.clazzId
        }).then(()=>{
            this.go('area_evaluation_report',{paperId:this.currentWork.paperId});
        }).catch(()=>{
            if((now-stopTime)<1000*60*60*24*3){
                this.$ionicPopup.alert({
                    title: '信息提示',
                    template: '<p>测评结束三天后才能查看测评报告</p>',
                    okText: '确定'
                });
            }else{
                this.$ionicPopup.alert({
                    title: '信息提示',
                    template: '<p>该测评无人参与</p>',
                    okText: '确定'
                });
            }
        })

    }
    initReportBtn(){
        $(".area_evaluation_report_btn").off("touchmove").on("touchmove",function (e) {
            let data=e.originalEvent.targetTouches[0];
            let height=$(this).height()
            let width=$(this).width()
            var x,y;
            if(data.clientX<width/2){
                x=0
            }else if(data.clientX>window.innerWidth-width){
                x=window.innerWidth-width
            }else{
                x=data.clientX-width/2
            }
            if(data.clientY<height/2){
                y=0
            }else if(data.clientY>window.innerHeight-height){
                y=window.innerHeight-height
            }else{
                y=data.clientY-height/2
            }
            $(this).css({
                left:x,
                top:y,
            })
            e.preventDefault()
        })
    }
}
