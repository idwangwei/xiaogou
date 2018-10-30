/**
 * Created by qiyuexi on 2018/1/13.
 */
import _find from 'lodash.find';
const typeXS = 'XS'; //教材版本为西师版
import {Inject, View, Directive, select} from '../../module';

@View('home.diagnose02', {
    url: '/diagnose02/:backWorkReportUrl/:isIncreaseScore/:isIncreaseScorePaySuccess',
    views: {
        "study_index": {
            template: require('./page.html')
        }
    },
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , '$ngRedux'
        , '$ionicModal'
        , 'commonService'
        /*  , 'pageRefreshManager'*/
        , '$timeout'
        , '$ionicSideMenuDelegate'
        , 'diagnoseService'
        , '$location'
        , '$anchorScroll'
        ,'$timeout'
        ,'$ionicScrollDelegate'
        ,'$ocLazyLoad'
        ,'$ionicTabsDelegate'
    ]
})
class Diagnose02Ctrl {
    $ionicTabsDelegate
    constructor() {
        this.backUrl = this.getStateService().params.backWorkReportUrl || null;
        this.getRootScope().isIncreaseScore = this.isIncreaseScore = this.getStateService().params.isIncreaseScore == 'true';
        this.initFlags();
        this.initData();
    }

    initFlags() {
        this.onLine = true;
        this.initCModal = false;//是否已初始化modal
        this.initCtrl = false;//是否已初始化ctrl
        this.initServerDataFlag = false;//是否已初始化接口数据
        this.initGradeFlag = false;
        this.showDiaglog = true;
        this.screenWidth = window.innerWidth;
        this.isShowAdWord = true;
        this.isIncreaseScorePaySuccess = this.$stateParams.isIncreaseScorePaySuccess;
    }

    initData() {
        this.loadingText = '获取诊断信息中';
        let modalStyle = "top: 20%!important;right: 20%!important;bottom: 20%!important;left: 20%!important;min-height: 240px!important;width: 60%!important;height: auto;";
        this.modalStyle = this.screenWidth >= 680 ? modalStyle : '';
        this.Grades = [
            {"num": 1, "name": "一年级上册"},
            {"num": 2, "name": "一年级下册"},
            {"num": 3, "name": "二年级上册"},
            {"num": 4, "name": "二年级下册"},
            {"num": 5, "name": "三年级上册"},
            {"num": 6, "name": "三年级下册"},
            {"num": 7, "name": "四年级上册"},
            {"num": 8, "name": "四年级下册"},
            {"num": 9, "name": "五年级上册"},
            {"num": 10, "name": "五年级下册"},
            {"num": 11, "name": "六年级上册"},
            {"num": 12, "name": "六年级下册"}
        ];
    }

    back() {
        if(this.getRootScope().showPetEnterGuide){
            this.getRootScope().showPetEnterGuide = false;
            this.getRootScope().$digest();
        }else if(this.getRootScope().showDiagnoseAdFlag){
            this.getRootScope().showDiagnoseAdFlag = false;
            this.getRootScope().$digest();
        }else if(this.backUrl =="diagnose-ad-dialog"){
            if(this.getRootScope().isIncreaseScore){
                this.go('home.study_index', 'back');
            }else{
                this.go('home.improve', 'back');
            }

        }else {
            if(this.getRootScope().isIncreaseScore){
                this.go(this.backUrl||'home.study_index', 'back');
            }else{
                this.go(this.backUrl||'home.improve', 'back');
            }
        }
    }

    showWinterAd() {
        this.getRootScope().showDiagnoseAdFlag = true;
    }

    initModal() {
        //初始化教材modal页
        this.$ionicModal.fromTemplateUrl('textbookSelect.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        })
            .then((modal) => {
                this.textbookSelectModal = modal;
            });
        //初始化年级modal页
        this.$ionicModal.fromTemplateUrl('gradesSelect.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        })
            .then((modal) => {
                this.gradesSelectModal = modal;
            });
        this.getScope().$on('$destroy', () => {
            this.textbookSelectModal.remove();
            this.gradesSelectModal.remove();
        });
    }

    /**
     * 打开教材选择modal
     */
    openTextbookSelectModal(tag, type) {
        this.textbookSelectModal.show();
    }

    /**
     * 打开年级选择modal
     */
    openGradesSelectModal(tag, type) {
        this.gradesSelectModal.show();
    }

    /**
     * 关闭教材modal
     */
    closeTextbookSelectModal() { //关闭modal
        this.textbookSelectModal.hide();
    }

    /**
     * 关闭年级modal
     */
    closeGradesSelectModal() { //关闭modal
        this.gradesSelectModal.hide();
    }


    onAfterEnterView() {
        this.$ionicTabsDelegate.$getByHandle("allere-index-tabs").showBar(false);
        if(this.backUrl
            && (this.backUrl =="diagnose-ad-dialog" || this.backUrl == "work_report")
            && (this.selfStudyClazzList.length || this.clazzList.length)
        // && !this.isTypeXS
        // && !this.isIncreaseScore
        ){
            this.showFindProcess = true; //是否需要显示搜索过程
            this.getRootScope().showFindWeakFlag = true;
        }
        //this.pieChartRedraw(true);
        this.getRootScope().studyStateLastStateUrl = this.getStateService().current.name;
        // this.commonService.setLocalStorage('studyStateLastStateUrl', 'home.diagnose02');
       /* if(this.getRootScope().isIncreaseScore){
            this.commonService.setLocalStorage('studyStateLastStateUrl', 'home.study_index');
        }else{
            this.commonService.setLocalStorage('studyStateLastStateUrl', 'home.diagnose02');
        }*/

        this.isShowAdWord = true;
        this.getRootScope().showPetEnterGuide = this.isIncreaseScore && !!this.petEnterGuideFlag;
        this.$ocLazyLoad.load('m_diagnose_payment');
        if(this.isIncreaseScore){
            this.$ocLazyLoad.load('m_increase_score_payment');
        }
        this.$ocLazyLoad.load('m_pet_page');
    }
    onBeforeEnterView(){
    }
    onBeforeLeaveView() {
        this.glitterUnitId = null;
        this.initGradeFlag = false;
        $(".circle-position").hide();
        this.$ionicSideMenuDelegate.toggleLeft(false);
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseRequestList.splice(0, this.diagnoseService.cancelDiagnoseRequestList.length);//清空请求列表
        // angular.forEach(this.$ionicSideMenuDelegate._instances,instance=>instance.close());
    }

    onReceiveProps() {
        // this.$ionicTabsDelegate.$getByHandle("allere-index-tabs").showBar(false);
        this.ensurePageData();
    }

    getTextbookCallBack(data) {
        if (data) {
            this.textbooks = data;
            if (!this.diagnoseSelectedTextbook.id && data && data.length) {
                let teachingMaterialCode = this.diagnoseSelectedClazz.teachingMaterial ? this.diagnoseSelectedClazz.teachingMaterial.split('-')[0] : null;
                let findTextbook;
                if (teachingMaterialCode) findTextbook = _find(data, {code: teachingMaterialCode});
                let defaultTextBook = findTextbook ? findTextbook : data[0];
                this.changeTextBook(defaultTextBook);
                this.getServiceData();
            }
        } else
            this.textbooks = [];
    }

    getAllGradesCallBack(data) {
        if (data) {
            this.Grades = data.Grades;
            this.diagnoseSelectedGrade = data && data.Grades.length ? data.Grades[0] : null;
        } else
            this.Grades = [];
    }

    showMenu() {
        this.$ionicSideMenuDelegate.toggleLeft();
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
        if (!this.initCModal) {
            this.initCModal = true;
            this.initModal();
            this.diagnoseService.getTextbookList(this.getTextbookCallBack.bind(this));
        }
        if (this.selfStudyClazzList && this.selfStudyClazzList.length != 0 && this.clazzList.length == 0 && !this.initCtrl) {
            this.initCtrl = true;
            this.changeClazz(this.selfStudyClazzList[0]);
            return;
        }
        if (this.clazzList && this.clazzList.length != 0 && !this.initCtrl) {
            this.initCtrl = true;
            if (!this.diagnoseSelectedClazz.id) {
                let clazz = this.clazzList[0];
                this.changeClazz(clazz);
                return;
            }
            let clazz = _find(this.clazzList, {id: this.diagnoseSelectedClazz.id});
            if (clazz) {
                this.changeClazz(clazz);
            }else {
                this.changeClazz(this.clazzList[0]);
            }
            return
        }
        if (!this.initGradeFlag&&this.vipKnowledgeGradeArr) {
            let clazzGrade = this.diagnoseSelectedGrade.num || this.diagnoseSelectedClazz.grade * 2;
            if(this.isIncreaseScorePaySuccess && this.vipKnowledgeGradeArr.length!=0){
                clazzGrade = this.vipKnowledgeGradeArr.slice(-1)[0];
            }
            let findGrade = _find(this.Grades, {num: clazzGrade});
            this.initGradeFlag = true;
            this.changeGrade(findGrade);
        }

        if (this.diagnoseSelectedClazz.id && this.diagnoseSelectedTextbook.id && this.diagnoseSelectedGrade.num && !this.initServerDataFlag) {
            this.initServerDataFlag = true;
            this.fetchHomeDiagnose().then(()=>{
                this.$ionicTabsDelegate.$getByHandle("allere-index-tabs").showBar(false);
            });
        }
    }

    /**
     * 去选择班级
     */
    diagnoseSelectClazz(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft(false);
        if (clazz.id === this.diagnoseSelectedClazz.id)  return; //如果选择班级和当前选中班级一致就不处理
        this.changeClazz(clazz);
        this.getServiceData();
    }

    /**
     * 去选择教材
     */
    diagnoseSelectTextBook(textBook) {
        this.closeTextbookSelectModal();
        if (textBook.id === this.diagnoseSelectedTextbook.id)  return; //如果选择教材和当前选中教材一致就不处理
        this.changeTextBook(textBook);
        this.isTypeXS = textBook.code === typeXS;
        this.getServiceData();
    }

    /**
     * 去选择年级
     */
    diagnoseSelectGrade(grade) {
        this.closeGradesSelectModal();
        if (grade.num === this.diagnoseSelectedGrade.num)  return; //如果选择年级和当前选中年级一致就不处理
        this.changeGrade(grade);
        this.getServiceData();
    }

    getServiceData() {
        if (this.diagnoseSelectedClazz.id && this.diagnoseSelectedTextbook.text && this.diagnoseSelectedGrade.num) {
            this.fetchHomeDiagnose();
        }
    }

    onTouch($event) {
        /*  $event.stopPropagation();
         $event.preventDefault();*/
        this.ox = $event.target.parentElement.offsetLeft;
        this.oy = $event.target.parentElement.offsetTop;
    }

    onDrag($event) {
        /* $event.stopPropagation();
         $event.preventDefault();*/
        let el = $event.target.parentElement,
            dx = $event.gesture.deltaX,
            dy = $event.gesture.deltaY;
        let canMoveWitdh = window.innerWidth - $(el).width();
        let canMoveHeightMin = 44;
        let canMoveHeightMax = window.innerHeight - $(el).height() - 44;
        let moveX = this.ox + dx, moveY = this.oy + dy;

        /*if (moveX < 0)
         el.style.left = 0 + 'px';
         else if (moveX > canMoveWitdh)
         this.handleImgStop(el);//el.style.left = canMoveWitdh + 'px';
         else
         el.style.left = this.ox + dx + "px";*/

        if (moveY < canMoveHeightMin)
            el.style.top = canMoveHeightMin + "px";
        else if (moveY > canMoveHeightMax)
            el.style.top = canMoveHeightMax + "px";
        else
            el.style.top = this.oy + dy + "px";
    };


    showKnowledge(item, $index) {
        if(!item.hasKnowledgePoint){
            this.commonService.showAlert('提示','<p style="text-align: center">即将开放</p>');
            return
        }
        this.homeSelectChapter(item);
        let param = {};
        //显示搜索过程，在知识点页面就需要跳转到制定知识点
        if(this.showFindProcess) param.backWorkReportUrl = "scrollToKnowledge";
        if(this.isIncreaseScore) param.isIncreaseScore = true;
        this.go('diagnose_knowledge02', 'forward',param);
    }


    hideAdWord() {
        this.isShowAdWord = false;

    }

    mapStateToThis(state) {
        let clazz = state.diagnose_selected_clazz||{},
            diagnose_selected_textbook = state.diagnose_selected_textbook||{},
            diagnose_selected_grade = state.diagnose_selected_grade||{},
            diagnose_home_with_statistic = state.diagnose_home_with_statistic||{};
        let textBookCode = diagnose_selected_textbook.code;
        let homeDiagnoseList = diagnose_home_with_statistic[clazz.id + '#' + textBookCode + '#' + diagnose_selected_grade.num] || [];
        let newClazzList = [];
        angular.forEach(state.profile_clazz.passClazzList, (item) => {
            if (item.type === 100) newClazzList.push(item);
        });

        let isTypeXS = false;
        if(!!clazz.teachingMaterial) isTypeXS = textBookCode === typeXS || !!clazz.teachingMaterial.match(typeXS);

        //解析当前选择的年级是否是考点特权购买的年级
        let currentGradeIsVip2 = false,
            vipKnowledgeGradeArr = [],
            vips = state.profile_user_auth.user.vips;
        vips&&vips.forEach((item)=> {
            if(item.hasOwnProperty('raiseScore2')){
                vipKnowledgeGradeArr = item['raiseScore2'];
                if(item['raiseScore2'].indexOf(diagnose_selected_grade.num)!=-1){
                    currentGradeIsVip2 = true;
                }
            }
        });
        return {
            diagnoseSelectedTextbook: diagnose_selected_textbook,
            diagnoseSelectedGrade: state.diagnose_selected_grade,
            diagnoseSelectedClazz: clazz,
            selfStudyClazzList: state.profile_clazz.selfStudyClazzList,
            clazzList: newClazzList,
            diagnoseHomeWithStatistic: diagnose_home_with_statistic,
            isLoadingProcessing: state.fetch_home_stati_processing,
            homeDiagnoseList: homeDiagnoseList,
            userName: state.profile_user_auth.user.name,
            diagnose_clazz_with_unit: state.diagnose_clazz_with_unit,
            onLine: state.app_info.onLine,
            isTypeXS:isTypeXS,
            petEnterGuideFlag:state.pet_info.firstGuide,
            currentGradeIsVip2:currentGradeIsVip2,
            vipKnowledgeGradeArr:vipKnowledgeGradeArr
        };
    }

    mapActionToThis() {
        let diagnoseService = this.diagnoseService;
        return {
            changeClazz: diagnoseService.changeClazz.bind(diagnoseService),
            changeTextBook: diagnoseService.changeTextBook.bind(diagnoseService),
            changeGrade: diagnoseService.changeGrade.bind(diagnoseService),
            homeSelectChapter: diagnoseService.homeSelectChapter.bind(diagnoseService),
            fetchHomeDiagnose: diagnoseService.fetchHomeDiagnose.bind(diagnoseService),
        }
    }

    /**
     * 查找需要亮起的章节
     */
    /*getGiltterUnitId() {
     let maxPercentNum = 0;
     let percentNum = 0;
     this.glitterUnitId = null;
     angular.forEach(this.homeDiagnoseList, (item) => {
     percentNum = item.masterNumber / item.totalMasterNumber;
     if (!this.glitterUnitId) {
     this.glitterUnitId = item.id;
     maxPercentNum = percentNum < 1 ? percentNum : maxPercentNum;
     return;
     }

     if (percentNum < 1 && percentNum > maxPercentNum) {
     this.glitterUnitId = item.id;
     maxPercentNum = percentNum;
     }
     })
     }*/
    /**
     * 查找需要亮起的章节
     * 规则：计算两个知识点的不牢固和未掌握知识点之和与总的知识点之比，
     * 取比值大的数据
     * 当所有章节都没有未掌握和不牢固的知识点时，取掌握章节比例最小的
     */
    getGiltterUnitId(){
        let preUnit = null;
        let tempDifference = 0.4;
        this.glitterUnitId = null;
        angular.forEach(this.homeDiagnoseList, function (item) {
            item.notFirmNumber =   item.notFirmNumber || 0;
            item.notMasterNumber = item.notMasterNumber || 0;

            let currentUnit = {
                ratio: (item.notFirmNumber + item.notMasterNumber) / item.totalMasterNumber ,
                totalNum: item.totalMasterNumber,
                unMasterSum: item.notFirmNumber + item.notMasterNumber,
                masterNum:item.masterNumber,
                unDoOrMasterNumRatio: (item.totalMasterNumber-item.masterNumber)/item.totalMasterNumber,
                id: item.id
            };
            if (!preUnit) {
                preUnit = currentUnit;
                return;
            }
            if(currentUnit.unMasterSum == 0 && preUnit.unMasterSum == 0){ //两个章节都没有未掌握和不牢固的知识点时，取掌握章节比例最小的
                if(currentUnit.unDoOrMasterNumRatio == preUnit.unDoOrMasterNumRatio){ //两个章节没有做题、未掌握和不牢固的考点比例相同
                    return;
                }else if(preUnit.unDoOrMasterNumRatio != 1 && currentUnit.unDoOrMasterNumRatio ==1){
                    return;
                }else if(preUnit.unDoOrMasterNumRatio == 1 && currentUnit.unDoOrMasterNumRatio !=1){
                    preUnit = currentUnit;
                    return;
                }
                preUnit = currentUnit.unDoOrMasterNumRatio > preUnit.unDoOrMasterNumRatio ? currentUnit : preUnit;
                return;
            }

            preUnit = preUnit.ratio >= currentUnit.ratio ? preUnit : currentUnit;

            /* let difference = Math.abs(currentUnit.ratio - preUnit.ratio);
             if (difference < tempDifference) {//差值小于2/5的取分子较大的（分子相同，取比值较大的）
             if(preUnit.unMasterSum == currentUnit.unMasterSum){
             preUnit = preUnit.ratio >= currentUnit.ratio ? preUnit : currentUnit;
             return;
             }
             preUnit = preUnit.unMasterSum >= currentUnit.unMasterSum ? preUnit : currentUnit;
             } else {//差值大于2/5的取比值较大的，
             preUnit = preUnit.ratio >= currentUnit.ratio ? preUnit : currentUnit;
             }*/
        });
        this.glitterUnitId = preUnit ? preUnit.id : null;
    }

    clickFindBtn(){
        this.$timeout(()=>{
            this.getGiltterUnitId();
            this.pointScroll();
            $(".circle-position").show();
        },2000);
    }

    pointScroll() {
        this.getRootScope().showFindWeakFlag = false;
        if(!this.glitterUnitId){
            return;
        }
        this.$location.hash(this.glitterUnitId);
        this.$anchorScroll();
        let height = $('#'+this.glitterUnitId).height();
        this.$ionicScrollDelegate.scrollBy(0,-height);
    }


}
export default Diagnose02Ctrl