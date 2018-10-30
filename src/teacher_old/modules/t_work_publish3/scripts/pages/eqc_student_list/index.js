/**
 * Author ww on 2016/12/1.
 * @description 错题集controller
 */

import {Inject, View, Directive, select} from '../../module';

@View('eqc_student_list', {
    url: '/eqc_student_list/:questionId',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:['$scope'
        , '$state'
        , '$rootScope'
        , '$ionicScrollDelegate'
        , 'workListService'
        , '$ngRedux'
        , '$ionicSideMenuDelegate'
        , '$ionicModal'
        , 'workPaperBankService'
        , '$timeout'
        , 'commonService'
        , '$ionicLoading'
        , '$ionicHistory'
        , 'subHeaderService'
    ]
})

export default class EqcDetailCtrl{
    $ionicModal;
    $timeout;
    commonService;
    $ionicScrollDelegate;
    $ionicSideMenuDelegate;
    workListService;
    workPaperBankService;
    $ionicLoading;
    subHeaderService;

    initCtrl;

    @select(state=>state.wl_selected_clazz) selectedClazz;

    screenWidth = window.innerWidth;
    isIos = this.commonService.judgeSYS() == 2;
    studentList = null;
    retFlag = false;

    constructor(){
        
        
    }
    back() {this.$ionicHistory.goBack();}
    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
            .then(()=> {
                this.workListService.getErrorStudentList({
                    classId:this.selectedClazz.id,
                    questionId:this.getStateService().params.questionId,
                    type:1
                }).then((res)=>{
                    if(res){this.studentList = res}
                    this.retFlag = true;
                });
            })
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        if(this.workListService.eqcErrorStudentRequest){this.workListService.eqcErrorStudentRequest.resolve()}
    }

    showStudentErrorInfo(stu){
        this.workListService.eqcCurrentClickStudent = stu.studentId;
        this.getStateService().go('eqc_do_question_info',{questionId:this.getStateService().params.questionId, stuId:stu.studentId})
    }
}