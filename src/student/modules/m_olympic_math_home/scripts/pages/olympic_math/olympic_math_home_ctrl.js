/**
 * Author 邓小龙 on 2017/3/2.
 * @description 新版诊断
 */
import _each from "lodash.foreach";
import _values from 'lodash.values';
import _find from 'lodash.find';
import {Inject, View, Directive, select} from '../../module';

@View('home.olympic_math_home', {
    url: '/olympic_math_home',
    views: {
        "study_index": {
            template: require('./olympic_math_home.html'),
        }
    },
    styles: require('./olympic_math_home.less'),
    inject:['$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , '$ionicModal'
        , 'commonService'
        , 'profileService'
        , '$ngRedux'
        , '$ionicPopup'
        , '$ionicTabsDelegate'
        , '$timeout'
        , '$ionicSideMenuDelegate'
        , 'subHeaderService'
        , 'dateUtil'
        , 'olympicMathService'
        , 'finalData'
        , 'tabItemService']
})
class OlympicMathHomeCtrl{
    constructor() {
        this.initFlags();
        this.initData();
    }

    initFlags() {
        this.onLine = true;
        // this.initCModal = false;//是否已初始化modal
        this.initCtrl = false;//是否已初始化ctrl
        this.initServerDataFlag = false;//是否已初始化接口数据
        this.initGradeFlag = false;
        this.showDiaglog = true;
        this.screenWidth = window.innerWidth;
        this.canEnterMagicTask = this.profileService.checkStudentOlyAuthorityFromTeacher();
    }

    initData() {
        this.loadingText = '获取诊断信息中';
        let modalStyle = "top: 20%!important;right: 20%!important;bottom: 20%!important;left: 20%!important;min-height: 240px!important;width: 60%!important;height: auto;";
        this.modalStyle = this.screenWidth >= 680 ? modalStyle : '';
        this.Grades = [
            {"num": 1, "name": "一年级上册","showText":'一 · 上'},
            {"num": 2, "name": "一年级下册","showText":'一 · 下'},
            {"num": 3, "name": "二年级上册","showText":'二 · 上'},
            {"num": 4, "name": "二年级下册","showText":'二 · 上'},
            {"num": 5, "name": "三年级上册","showText":'三 · 上'},
            {"num": 6, "name": "三年级下册","showText":'三 · 上'},
            {"num": 7, "name": "四年级上册","showText":'四 · 上'},
            {"num": 8, "name": "四年级下册","showText":'四 · 上'},
            {"num": 9, "name": "五年级上册","showText":'五 · 上'},
            {"num": 10, "name": "五年级下册","showText":'五 · 上'},
            {"num": 11, "name": "六年级上册","showText":'六 · 上'},
            {"num": 12, "name": "六年级下册","showText":'六 · 上'}
        ];
    }

    back() {
        if (angular.element($('.diagnose-dialog-box').eq(0)).scope()
            && angular.element($('.diagnose-dialog-box').eq(0)).scope().showDiagnoseDialogFalg) {
            this.getScope().$emit('diagnose.dialog.hide');
        }else if(this.getRootScope().showOlympicMathAdFlag){
            this.getRootScope().showOlympicMathAdFlag = false;
            this.getRootScope().$digest();
        }else{
            this.go('home.study_index', 'back');
        }

    }

    //
    // initModal() {
    //     //初始化年级modal页
    //     this.$ionicModal.fromTemplateUrl('gradesSelect.html', {
    //         scope: this.getScope(),
    //         animation: 'slide-in-up'
    //     }).then((modal) => {
    //         this.gradesSelectModal = modal;
    //     });
    //     this.getScope().$on('$destroy', ()=> {
    //         this.gradesSelectModal.remove();
    //     });
    // }

    /**
     * 打开年级选择modal
     */
    // openGradesSelectModal(tag, type) {
    //     this.gradesSelectModal.show();
    // }

    /**
     * 关闭年级modal
     */
    // closeGradesSelectModal() { //关闭modal
    //     this.gradesSelectModal.hide();
    // }

    /**
     * 去选择年级
     */
    // olympicMathSelectGrade(grade) {
    //     this.closeGradesSelectModal();
    //     if (grade.num === this.olympicMathSelectedGrade.num)  return; //如果选择年级和当前选中年级一致就不处理
    //     this.changeGrade(grade);
    //     this.fetchOlympicMathHomeData();
    // }

    onAfterEnterView() {
        //this.pieChartRedraw(true);
        this.showDiaglog = true;
        this.getRootScope().studyStateLastStateUrl = this.getStateService().current.name;
        this.commonService.setLocalStorage('studyStateLastStateUrl', 'home.olympic_math_home');
    }

    onBeforeLeaveView() {
        this.showDiaglog = false;
        //离开当前页面时，cancel由所有当前页发起的请求
        this.olympicMathService.cancelOlympicMathHomeRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.olympicMathService.cancelOlympicMathHomeRequestList.splice(0, this.olympicMathService.cancelOlympicMathHomeRequestList.length);//清空请求列表
        // angular.forEach(this.$ionicSideMenuDelegate._instances,instance=>instance.close());
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    /**
     * 加载完毕的回调
     */
    loadCallback(data) {
        /* let homeDiagnose=this.unit_with_diagnose_stati[this.diagnose_selected_clazz.id+'#'+this.selectedUnit.id];
         angular.forEach(unit_diagnose.list,(unit)=>{
         unit.showChapCter=false;
         if(unit.id===this.unit_select_chapter.id){
         unit.showChapCter=true;
         }
         });
         this.unit_diagnose=unit_diagnose;
         this.pieChartRedraw(true);*/
    }

    ensurePageData() {
        // if (!this.initCModal) {
        //     this.initCModal = true;
        //     this.initModal();
        // }
        if(!this.initCtrl){this.initCtrl = true}
        if (!this.olympicMathSelectedGrade.num && !this.initGradeFlag) {
            this.initGradeFlag = true;
            let clazzGrade = this.olympicMathSelectedClazz.grade * 2;
            let findGrade = _find(this.Grades, {num: clazzGrade});
            this.changeGrade(findGrade);
        }
        if(this.olympicMathSelectedGrade.num && !this.initServerDataFlag){
            this.initServerDataFlag = true;
            this.fetchOlympicMathHomeData();//todo: 主要获取教师发布的奥数，小红点展示或者不同教材下的权限不同。
        }
    }

    hasOlympicClazz(){
        return  _find(this.clazzList,{type:200});
    }

    showOlympicMathAd(){
        this.getRootScope().showOlympicMathAdFlag=true;

    }


    goTWorkList(){
        let olympicClazz=this.hasOlympicClazz();
        if(!this.canEnterMagicTask||!olympicClazz){
            this.getScope().$emit('diagnose.dialog.show', {'comeFrom':'olympic-math','title':'温馨提示','content': '还未加入奥数老师的班级。'});
            return;
        }
        this.changeClazz(olympicClazz);
        this.changeUrlFromForStore(this.finalData.URL_FROM.OLYMPIC_MATH_T);
        this.go('olympic_math_work_list','forward',{'urlFrom':this.finalData.URL_FROM.OLYMPIC_MATH_T});
    }
    goSWorkList(){
        this.changeUrlFromForStore(this.finalData.URL_FROM.OLYMPIC_MATH_S);
        this.go('olympic_math_work_list','forward',{'urlFrom':this.finalData.URL_FROM.OLYMPIC_MATH_S});
    }

    formatVipTitle(key,value){
        if(!key) return "";
        let findGrade = _find(this.Grades, {num: parseInt(key)});
        return '已开通'+findGrade.showText+'奥数';
    }

    showWaitMsg(){
        this.getScope().$emit('diagnose.dialog.show', {'comeFrom':'olympic-math','title':'温馨提示','content': '本功能即将开放，敬请期待。'});
    }

    // hasVip(){
    //     return Object.keys(this.olympicVip).length;
    // }


    mapStateToThis(state) {
        let vips=state.profile_user_auth.user.vips;
        let olympicVip={};
        let hasVip = false;
        angular.forEach(vips,(item,key)=>{
            if(item['mathematicalOlympiad']){
                olympicVip=item['mathematicalOlympiad'];
                hasVip = !!_find(_values(olympicVip),(item)=>{return item > -1});
            }
        });
        return {
            olympicMathSelectedClazz: state.olympic_math_selected_clazz,
            olympicMathSelectedGrade: state.olympic_math_selected_grade,
            clazzList: state.profile_clazz.passClazzList,
            passClazzList: state.profile_clazz.passClazzList,
            isLoadingProcessing: state.fetch_home_stati_processing,
            userName: state.profile_user_auth.user.name,
            onLine: state.app_info.onLine,
            olympicVip:olympicVip,
            hasVip:hasVip
        };
    }

    mapActionToThis() {
        let olympicMathService = this.olympicMathService;
        return {
            changeGrade: olympicMathService.changeGrade.bind(olympicMathService),
            changeClazz: olympicMathService.changeClazz.bind(olympicMathService),
            changeUrlFromForStore: olympicMathService.changeUrlFromForStore.bind(olympicMathService),
            fetchOlympicMathHomeData: olympicMathService.fetchOlympicMathHomeData.bind(olympicMathService)
        }
    }
}