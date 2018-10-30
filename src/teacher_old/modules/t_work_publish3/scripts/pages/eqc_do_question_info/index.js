/**
 * Author ww on 2016/12/1.
 * @description 错题集controller
 */

import {Inject, View, Directive, select} from '../../module';
@View('eqc_do_question_info', {
    url: '/eqc_do_question_info/:stuId/:questionId',
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

export default class EqcDoQuestionInfoCtrl{
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
    errorInfo = null;
    retFlag = false;

    constructor(){
        
        
    }
    back() {this.$ionicHistory.goBack();}
    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
            .then(()=> {
                this.workListService.getStudentErrorInfo({
                    classId:this.selectedClazz.id,
                    questionId:this.getStateService().params.questionId,
                    studentId:this.getStateService().params.stuId,
                }).then((res)=>{
                    if(res){this.errorInfo = res}
                    this.retFlag = true;
                });
            })
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        if(this.workListService.getStudentErrorInfoRequest){this.workListService.getStudentErrorInfoRequest.resolve()}
    }
}