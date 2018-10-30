/**
 * Created by qiyuexi on 2018/1/12.
 */
import {Inject, View, Directive, select} from '../../module';
@View('final_sprint_error_records', {
    url: '/final_sprint_error_records/:pointName/:backWorkReportUrl',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$state'
        , '$stateParams'
        , '$ngRedux'
        /*, 'pageRefreshManager'*/
        , 'diagnoseService'
        , '$rootScope'
    ]
})
class DiagnoseErrorQRecordsCtrl{
    constructor() {
        this.backWorkReportUrl=this.getStateService().params.backWorkReportUrl;
        this.initFlags()
        this.initData()
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

    callBack(data){
        this.record=data[0];
    }

    onAfterEnterView(){
        if(this.questionInfo){
            this.errorQRecordsInitlized=true;
            this.fetchErrorQRecords(this.questionInfo,this.callBack.bind(this));
            return;
        }
    }

    ensurePageData() {
        if (this.questionInfo&&!this.errorQRecordsInitlized) {
            this.errorQRecordsInitlized=true;
            this.fetchErrorQRecords(this.questionInfo,this.callBack.bind(this));
        }
    }

    back(){
        let pointName=this.diagnoseService.pointNameFormat(this.chapterSelectPoint)
        pointName=pointName.replace("NaN","");
        if(this.backWorkReportUrl){
            this.go('final_sprint_diagnose_do_question','back',{'pointName':pointName,'backWorkReportUrl':this.backWorkReportUrl})
        }else{
            this.go('final_sprint_diagnose_do_question','back',{'pointName':pointName})
        }

    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseErrorQRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseErrorQRequestList.splice(0, this.diagnoseService.cancelDiagnoseErrorQRequestList.length);//清空请求列表
    }


    mapStateToThis(state) {
        let chapterSelectPoint=state.chapter_select_point;
        if(!chapterSelectPoint.knowledgeId) return{};
        let questionInfo=state.knowledge_with_question[chapterSelectPoint.knowledgeId];
        return {
            chapterSelectPoint:chapterSelectPoint,
            questionInfo:questionInfo
        };
    }

    mapActionToThis() {
        let diagnoseService= this.diagnoseService;
        return {
            fetchErrorQRecords:diagnoseService.fetchErrorQRecords.bind(diagnoseService)
        }
    }
}
export default DiagnoseErrorQRecordsCtrl





