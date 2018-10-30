/**
 * Created by WL on 2017/6/1.
 */

import shareImg from "./../../../../t_boot/tImages/diagnose/share_img_to_p.png";
import {Inject, View, Directive, select} from '../../module';

@View('work_stu_diagnose_report', {
    url: '/work_stu_diagnose_report',
    template: require('./work_stu_diagnose_report.html'),
    styles: require('./work_stu_diagnose_report.less'),
    inject:[
        '$scope'
        , '$rootScope'
        , '$state'
        , '$timeout'
        , 'commonService'
        , '$ngRedux'
        , 'stuWorkReportService'
        , 'diagnoseService'
        , 'finalData'

    ]
})
class WorkStuDiagnoseReportCtrl {
    $scope;
    $rootScope;
    $state;
    $timeout;
    commonService;
    $ngRedux;
    stuWorkReportService;
    diagnoseService;
    finalData;

    initCtrl = false;//ctrl是否初始化
    @select(state => state.wl_selected_work) currentWork;
    @select(state => state.fetch_stu_work_report_processing) isLoadingProcessing;
    @select((state) => {
        return state.stu_work_report[state.wl_selected_work&&state.wl_selected_work.instanceId];
    }) currentReport;

    constructor() {
        
        
    }

    configDataPipe() {
        this.dataPipe
            .when(()=> {
                return !this.initCtrl
            })
            .then(()=> {
                this.initCtrl = true;
            })
    }

    onAfterEnterView() {
        this.getReportData();
        this.isFinalAccess = this.currentWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS;
    }

    onBeforeLeaveView() {
        if (this.alertTimer) this.$timeout.cancel(this.alertTimer);
        this.stuWorkReportService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.stuWorkReportService.cancelRequestList.splice(0, this.stuWorkReportService.cancelRequestList.length);
    }

    getReportData() {
        this.stuWorkReportService.getStuWorkReport();
    }


    showStuReport(name) {
        this.getStateService().go('stu_work_report', {
            stuId: name
        });
        console.log(name);
    }

    clickDeletedStu() {
        this.commonService.alertDialog('该学生信息有误。');
    }

    back() {
        this.getStateService().go('work_student_list');
    }

    /**
     * 发送题型个学生；分享
     */
    sendMsgTostu() {
        this.diagnoseService.sendMsgTostudent();
        this.commonService.alertDialog('提醒已发送到学生端', 1000);
        this.alertTimer = this.$timeout(()=> {
            this.diagnoseService.shareImage(shareImg, this);
            this.$timeout.cancel(this.alertTimer);
        }, 1000);
    }
}

export default WorkStuDiagnoseReportCtrl;






