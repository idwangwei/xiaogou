/**
 * Created by ZL on 2017/12/19.
 */
import {Inject, View, Directive, select} from './../../module';


@View('mirc_ques_records', {
    url: '/mirc_ques_records',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$state'
        , '$stateParams'
        , 'commonService'
        , '$ngRedux'
        , '$ionicPopup'
        , '$ionicTabsDelegate'
        , '$timeout'
        , '$ionicSideMenuDelegate'
        , 'subHeaderService'
        , 'dateUtil'
        , 'tabItemService'
        , '$rootScope'
        , 'microlectureService'
        , '$ionicHistory'
    ]
})

class mircoQuesRecordsCtrl {
    commonService;
    microlectureService;
    $ionicHistory;
    @select(state=>state.micro_select_example_item) examSelectPoint;
    @select((state)=> {
        let examSelectPoint = state.micro_select_example_item;
        if (!examSelectPoint.groupId) return {};
        let questionInfo = state.example_with_question[examSelectPoint.groupId];//根据例从本地拉取题目信息
        if (!questionInfo) return {};
        return questionInfo
    }) questionInfo;

    constructor() {
    }

    /**
     * 初始化ctrl中的一些 flag
     */
    initFlags() {
        this.errorQRecordsInitlized = false; //ctrl初始化后，是否已经加载过一次错题记录
    }

    initData() {
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    callBack(data) {
        this.record = data[0];
    }

    onAfterEnterView() {
        if (this.questionInfo) {
            this.errorQRecordsInitlized = true;
            this.microlectureService.fetchErrorQRecords(this.questionInfo, this.callBack.bind(this));
            return;
        }
    }

    ensurePageData() {
        if (this.questionInfo && !this.errorQRecordsInitlized) {
            this.errorQRecordsInitlized = true;
            this.microlectureService.fetchErrorQRecords(this.questionInfo, this.callBack.bind(this));
        }
    }

    back() {
        /* if(this.backWorkReportUrl){
         this.go('diagnose_do_question02','back',{'pointName':this.diagnoseService.pointNameFormat(this.chapterSelectPoint),'backWorkReportUrl':this.backWorkReportUrl})
         }else{
         this.go('diagnose_do_question02','back',{'pointName':this.diagnoseService.pointNameFormat(this.chapterSelectPoint)})
         }*/
        if (this.$ionicHistory.backView() !== null) {
            this.$ionicHistory.goBack()
        } else {
            if (this.examSelectPoint.stepMark == 1) {
                this.go('example_do_question', 'back');
            } else {
                this.go('exercise_exam_do_question', 'back');
            }
        }
    }

    onBeforeLeaveView() {
    }
}

export default mircoQuesRecordsCtrl;





