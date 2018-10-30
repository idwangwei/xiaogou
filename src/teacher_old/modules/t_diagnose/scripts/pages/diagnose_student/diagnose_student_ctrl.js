/**
 * Created by 邓小龙 on 2016/12/27.
 */
import $ from 'jquery';
import {Inject, View, Directive, select} from '../../module';

@View('home.diagnose_student', {
    url: '/diagnose_student',
    styles: require('./diagnose_student.less'),
    views: {
        "diagnose": {
            template: require('./diagnose_student.html')
        }
    },
    inject: ['$scope', '$rootScope', '$log', '$state', '$timeout', "diagnoseService", 'commonService', '$ngRedux']
})
class DiagnoseStudentCtrl {
    $scope;
    $rootScope;
    $log;
    $state;
    $timeout;
    diagnoseService;
    commonService;
    $ngRedux;

    onLine = true;
    initCtrl = false; //ctrl初始化后，是否已经加载过一次数据
    screenWidth = window.innerWidth;
    pieChart = {            //饼图插件对象
        instance: null
    };
    showPieChartFlag = false;
    loadingText = '获取诊断信息中';
    isIos = this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;

    @select(state=>state.stu_with_diagnose_stati) stu_with_diagnose_stati;
    @select(state=>state.diagnose_selected_unit) selectedUnit;
    @select(state=>state.fetch_student_diagnose_statistic_processing) isLoadingProcessing;
    @select(state=>state.diagnose_unit_select_stu) diagnose_unit_select_stu;
    // @select(state=>state.app_info.onLine) onLine;

    constructor() {


    }

    back() {
        this.go('home.diagnose', 'back');
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>this.diagnose_unit_select_stu && !this.initCtrl)
            .then(()=>this.initCtrl = true)
            .then(()=>this.initStuDiagnoseData())
    }

    initStuDiagnoseData() {
        this.diagnoseService.fetchStudentDiagnose(this.diagnose_unit_select_stu, this.loadCallback.bind(this));
        return
    }

    onAfterEnterView() {
        //this.pieChartRedraw(true);
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseStuRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseStuRequestList.splice(0, this.diagnoseService.cancelDiagnoseStuRequestList.length);//清空请求列表
    }

    pieChartRedraw(refleshFlag) {
        if (this.stu_with_diagnose_stati && this.stu_with_diagnose_stati.pieChart && this.pieChart.instance) {
            if (refleshFlag) {
                this.showPieChartFlag = false;
                this.$timeout(()=> {
                    this.showPieChartFlag = true;
                });
            }
        }
    }

    showChapter(unit, $event) {
        let showChapCter_ = unit.showChapCter;
        angular.forEach(this.stu_diagnose.list, (unitItem)=> {
            unitItem.showChapCter = false;
        });
        unit.showChapCter = !showChapCter_;


    }

    showKnowledgeStati(knowledgePoint) {
        let stu = this.diagnose_unit_select_stu;
        stu.knowledgePoint = knowledgePoint;
        this.diagnoseService.unitSelectStu(stu);
        this.go('home.diagnose_q_record', 'forward');
    }

    /**
     * 加载完毕的回调
     */
    loadCallback(data) {
        this.showPieChartFlag = true;
        this.stu_diagnose = this.stu_with_diagnose_stati[this.diagnose_unit_select_stu.studentId];
        this.pieChartRedraw(true);
    }


    formatLevel(currentLevel) {

    }

}

export default DiagnoseStudentCtrl;






