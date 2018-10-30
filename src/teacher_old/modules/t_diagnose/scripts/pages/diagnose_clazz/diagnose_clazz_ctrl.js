/**
 * Created by 邓小龙 on 2016/11/2.
 */
import $ from 'jquery';
import {Inject, View, Directive, select} from '../../module';

@View('home.diagnose_clazz', {
    url: '/diagnose_clazz',
    styles: require('./diagnose_clazz.less'),
    views: {
        "diagnose": {
            template: require('./diagnose_clazz.html'),
        }
    },
    inject: ['$scope', '$rootScope', '$log', '$state', '$timeout', "diagnoseService", 'commonService', '$ngRedux']
})

class DiagnoseClazzCtrl {
    $scope;
    $rootScope;
    $log;
    $state;
    $timeout;
    diagnoseService;
    commonService;
    $ngRedux;

    //loadingText='获取学生诊断信息中';

    initCtrl = false;//ctrl是否初始化

    @select(state=>state.diagnose_selected_clazz) diagnoseSelectedClazz;
    @select(state=>state.diagnose_unit_select_knowledge) unitSelectKnowledge;
    @select(state=>state.fetch_dianose_unit_knowledge_stati_processing) isLoadingProcessing;
    @select((state)=> {
        let unitSelectKnowledge_ = state.diagnose_unit_select_knowledge;
        let unitId = unitSelectKnowledge_.unitId;
        let clazzId = unitSelectKnowledge_.clazzId;
        let knowledgeStateKey = clazzId + '#' + unitId + '/' + unitSelectKnowledge_.knowledgeId;
        if (!unitId) return {};
        return state.knowledge_with_diagnose_stati[knowledgeStateKey];
    }) knowledgeWithDiagnose;

    constructor() {


    }

    back() {
        this.go('home.diagnose', 'back');
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>this.unitSelectKnowledge && this.unitSelectKnowledge.knowledgeId && !this.initCtrl)
            .then(()=>this.initCtrl = true)
            .then(()=>this.diagnoseService.fetchUnitKnowledgeDiagnose(this.unitSelectKnowledge))
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseClazzRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseClazzRequestList.splice(0, this.diagnoseService.cancelDiagnoseClazzRequestList.length);//清空请求列表
    }

    showStu(item) {
        let showFlag = item.showFlag;
        angular.forEach(this.knowledgeWithDiagnose.list, (stu)=> {
            stu.showFlag = false;
        })
        item.showFlag = !showFlag;
    }


    showQRecords(stu) {
        this.diagnoseService.diagnoseKnowledgeSelectStu(stu);
        this.go('home.diagnose_q_record', 'forward');
    }


}

export default DiagnoseClazzCtrl;






