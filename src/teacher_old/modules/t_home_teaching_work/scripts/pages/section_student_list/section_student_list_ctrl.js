/**
 * Author 邓小龙 on 2016/6/25.
 * @description 成绩区间controller
 */

import _ from 'underscore';
import {Inject, View, Directive, select} from '../../module';

const SHOW_NAME={P:"家长", S:'学生',T:'老师'};//在评价明细页面显示的名称


@View('section_student_list', {
    url: '/section_student_list',
    styles: require('./section_student_list.less'),
    template: require('./section_student_list.html'),
    inject: [
        '$scope'
        , '$state'
        , '$ionicHistory'
        , '$ionicScrollDelegate'
        , '$rootScope'
        , '$timeout'
        , '$ngRedux'
        , 'commonService'
        , 'workStatisticsService'
        , 'finalData'
        , 'workListService'
    ]
})

class SectionStudentListCtrl{
    finalData;
    commonService;
    workListService;
    workStatisticsService;

    constructor(){
        this.isRefresh=false; //如果是下拉刷新就隐藏公共的转圈，默认不隐藏
        this.wData = this.workStatisticsService.wData;//共享作业的数据
        this.data = this.workStatisticsService.data;//共享的数据
        this.data.workSort = {};
        this.pageStatus = 2;//tab页面状态，1为未提交，2为已批改，3为未批改
        this.data.showHandle = true;//由于默认已批改页面显示操作菜单
        this.moreFlag = true;//显示更多操作选项的标志
        this.selectStuAllFlag=true;//评价学生，全选标志
        this.pullRefreshFlag=false;
        this.colCount=this.commonService.getFlexRowColCount();
        this.showSelectedFlag=false;//未提交页面展示勾选状态。
        this.sectionData=this.workStatisticsService.sectionData;
        this.showData={
            stuList:[]
        };
        this.model={
            isEasy:null
        };

        this.isFinalAccess = this.wData.currentWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS;
        this.isSummerWork=this.wData.currentWork.publishType&&this.wData.currentWork.publishType==4;
        this.isCompetitionPaper = this.wData.currentWork.publishType == 8;
    }


    onBeforeEnterView() {
        this.handlePraiseUndoBtnClick();
        this.workListService.getWorkStuList(()=> {
            this.data.stu = this.$ngRedux.getState().wl_selected_work.stu;
            this.dataInit();//ctrl数据初始化
        });
    };
    showDeleteStuClickTip() {
        this.commonService.showConfirm('信息提示','该学生已不在此班级中。');
    };


    //下拉刷新
    doRefresh(){
        this.isRefresh=true; //下拉刷新就隐藏公共的转圈
        this.data.getWorkStuListFlag=false;
        this.dataInit();
    };

    mapShowStuData(){
        for(var i=0;i<this.sectionData.sectionStudentList.length;i++){
            for(var j=0;j<this.data.stu.correctedStus.length;j++){
                if(this.sectionData.sectionStudentList[i].id===this.data.stu.correctedStus[j].id){
                    this.showData.stuList.push(this.data.stu.correctedStus[j]);
                    break;
                }
            }
        }
        _.each(this.data.stu.correctedStus, function (stu) {
            stu.selected = false;
        });
        _.each(this.sectionData.sectionStudentList,(stu)=>{
            stu.selected = false;
        });
    }

    /**
     * 数据初始化
     */
    dataInit() {
        this.showData.stuList.splice(0,this.showData.stuList.length);

        this.mapShowStuData();

        $timeout(()=>{
            this.$ionicScrollDelegate.scrollBy(0,this.wData.correctedPageScrollPosition);
        },200);

    }

    /**
     * 跳转到指定学生的作业
     * @param stu 指定的学生
     */
    goWorkDetail(stu) {
        if(stu.gender=='-1'){
            this.showDeleteStuClickTip();
            return
        }
        this.data.currentStu = {
            stuId: stu.id,
            stuName: stu.name
        };
        this.go("work_detail");
    };

    /**
     * 评价学生作业按钮被点击
     */
    handlePraiseBtnClick(notSubmitFlag) {
        this.notSubmitFlag=notSubmitFlag;
        this.showSelectedFlag=true;
        this.data.praiseFlag = true;
    };

    /**
     * 返回作业列表展示
     */
    back () {
        this.$ionicHistory.goBack();//返回到列表展示
    };

    /**
     * 点击确定
     */
    handleSureBtnClick() {
        this.data.currentStu=null;
        _.each(this.sectionData.sectionStudentList,(stu1)=>{
            if(stu1.selected){
                let stu2 = _.find(this.data.stu.correctedStus,{id:stu1.id});
                if(stu2){stu2.selected=true}
            }
        });

        this.workStatisticsService.handlePraiseSureBtn(this.notSubmitFlag);

    };

    /**
     * 评价学生选中所有
     */
    handlePraiseAllBtnClick() {
        if( this.selectStuAllFlag){
            this.workStatisticsService.handlePraiseAllBtn(this.notSubmitFlag,this.showData.stuList);
            this.selectStuAllFlag=false;
        }else{
            this.workStatisticsService.handleUndoPraiseAllBtn(this.notSubmitFlag);
            this.selectStuAllFlag=true;
        }

    };

    /**
     * 记住滚动的位置
     */
    rememberScrollPosition(){
        this.wData.correctedPageScrollPosition = this.$ionicScrollDelegate.getScrollPosition().top;
    };

    /**
     * 评价学生点击取消
     */
    handlePraiseUndoBtnClick() {
        this.workStatisticsService.handlePraiseUndoBtn();
        this.showSelectedFlag=false;
        this.selectStuAllFlag=true;
        this.CollectPaperFlag=false;
    };

    /**
     * 修改评价
     * @param correctedStu
     * @param notSubmitFlag
     */
    editPraise(correctedStu,notSubmitFlag) {
        if(correctedStu.gender=='-1'){
            this.showDeleteStuClickTip();
            return
        }
        correctedStu.selected = true;
        _.each(this.data.stu.correctedStus,(stu1)=>{
            if(correctedStu.id === stu1.id){stu1.selected=true}
        });
        this.data.currentStu = {};
        this.data.currentStu.stuId = correctedStu.id;
        this.workStatisticsService.handlePraiseSureBtn(notSubmitFlag);
    };

    /**
     * 显示信封具体内容
     * @param correctedStu 当前学生
     * @param showType  展示区分  1为学生2为老师3家长
     */
    showPraiseDetail(correctedStu,showType){
        if(correctedStu.gender=='-1'){
            this.showDeleteStuClickTip();
            return
        }
        this.data.correctedPraise={};
        this.data.correctedPraise.correctedStu=correctedStu;
        this.data.correctedPraise.showType=showType;
        switch (showType){
            case 1:
                this.data.correctedPraise.showName=SHOW_NAME.S;
                break;
            case 2:
                this.data.correctedPraise.showName=SHOW_NAME.T;
                break;
            case 3:
                this.data.correctedPraise.showName=SHOW_NAME.P;
                break;
            default:
                this.data.correctedPraise.showName="";
        }
        this.go("work_praise_detail");
    }


}
export default SectionStudentListCtrl;


