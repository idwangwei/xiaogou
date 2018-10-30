/**
 * Created by WL on 2017/6/6.
 */
import {Inject, View, Directive, select} from '../../module';

@View('stu_work_report', {
    url: '/stu_work_report/:stuId',
    template: require('./stu_work_report.html'),
    styles: require('./stu_work_report.less'),
    inject:[
        '$scope'
        , '$rootScope'
        , '$state'
        , 'commonService'
        , '$ngRedux'
        , '$stateParams'
        , 'stuWorkReportService'
    ]
})
class StuWorkReportCtrl {
    commonService;
    stuWorkReportService;
    $stateParams;
    currentStuId = this.$stateParams.stuId;

    @select(state => state.wl_selected_work) currentWork;
    @select(state => state.stu_work_report[state.wl_selected_work&&state.wl_selected_work.instanceId]) classReport;

    constructor(){
        
        
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>{return !this.initCtrl})
            .then(()=>{
                this.initCtrl = true;
            })
    }

    onBeforeLeaveView() {
        this.stuWorkReportService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.stuWorkReportService.cancelRequestList.splice(0, this.stuWorkReportService.cancelRequestList.length);
    }

    onAfterEnterView(){
        this.initData();
        this.quesRecord = this.analysisQuesRecordData();
        this.resuleList = this.getAllPointsQuesList();
    }

    initData(){
        this.knowledgeArr = this.classReport.knowledgeQuestionDict;
        this.currentStuWorkInfo = this.classReport.stuId2KnowledgeMasterDict[this.currentStuId].quantityOfMasterLevel;
        this.currentStuInfo = this.classReport.stuId2KnowledgeMasterDict[this.currentStuId].profile;
        this.currentStuData = this.classReport.stuId2KnowledgeMasterDict[this.currentStuId].myData;
    }

    analysisQuesRecordData() {
        let quesRecord = {};
        let knowledgeIdArr = Object.values(this.currentStuWorkInfo);
        let knowledges = [];
        angular.forEach(knowledgeIdArr, (v, k)=> {
            knowledges = knowledges.concat(knowledgeIdArr[k]);
        });
        angular.forEach(knowledges, (value, key)=> {
            quesRecord[knowledges[key]] = this.knowledgeArr[knowledges[key]];
        });

        return quesRecord;
    }


    getAllPointsQuesList() {
        let masterPoints = this.currentStuWorkInfo['4']; //掌握
        let insecurePoints = this.currentStuWorkInfo['3'];//不牢固
        let notMasterPoints = this.currentStuWorkInfo['2'];//未掌握
        let notDone = this.currentStuWorkInfo['1'];//未做题
        let quesList = [];
        angular.forEach(masterPoints, (v, k)=> {
            quesList.push(this.quesRecord[masterPoints[k]]);
            quesList[quesList.length - 1].masterStatus = 4;
        });
        angular.forEach(insecurePoints, (v, k)=> {
            quesList.push(this.quesRecord[insecurePoints[k]]);
            quesList[quesList.length - 1].masterStatus = 3;
        });
        angular.forEach(notMasterPoints, (v, k)=> {
            quesList.push(this.quesRecord[notMasterPoints[k]]);
            quesList[quesList.length - 1].masterStatus = 2;
        });
        angular.forEach(notDone, (v, k)=> {
            quesList.push(this.quesRecord[notDone[k]]);
            quesList[quesList.length - 1].masterStatus = 2;
        });

        angular.forEach(quesList,(item)=>{
             this.getCheckPointsQues(item);
        });
        return quesList;

    }



    getCheckPointsQues(item) {
        let knowNameArr = item.knowledgeTxt.split(".");
        knowNameArr.pop();
        item.knowledgePoint = knowNameArr.join("");
        //let resultStr ="考点"+ knowNameArr.join("") + "：";
        let resultStr = "";
        let quesList = Object.values(item.questionDict);
        angular.forEach(quesList, (v, k)=> {
            if (k == 0 || k != 0 && quesList[k].qgSeq != quesList[k - 1].qgSeq) {
                if (k != 0) {
                    resultStr = resultStr.slice(0, resultStr.length - 1);
                    resultStr += ';';
                }
                // resultStr += this.numWords[quesList[k].qgSeq] + '.';
                resultStr += this.commonService.convertToChinese(quesList[k].qgSeq + 1) + '.';
            }
            resultStr += (quesList[k].qSeq + 1) + ',';
        });
        resultStr = resultStr.slice(0, resultStr.length - 1);
        resultStr += ';';
        resultStr = resultStr.replace(/\s/g, "");
        item.knowledgeAndQues = resultStr;

    }

    showRecommend(){
        this.getScope().$broadcast("recommend.show",this.currentStuId);
    }

    back() {
        this.getStateService().go('work_stu_diagnose_report');
    }

    goToPointPage(item){
        let pointInfo = {
            knowledgeId:item.knowledgeId,
            text:item.knowledgeTxt,
            unitId:item.unitId,
            num:item.num
        };
        this.getStateService().go('ques_record',{pointInfo:JSON.stringify(pointInfo),stuId:this.currentStuId});
    }

}

export default StuWorkReportCtrl
