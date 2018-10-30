import _each from 'lodash.foreach';
import {Inject, View, Directive, select} from '../../module';

@View('select_unit', {
    url: '/select_unit',
    styles: require('./select_unit.less'),
    template: require('./select_unit.html'),
    inject:["$scope","$ngRedux","$state","$ionicModal","$timeout","diagnoseService",'commonService',"$rootScope"]
})
class SelectUnitCtrl {
    $ionicModal;
    $timeout;
    commonService;
    diagnoseService;
    initCtrl = false;
    Modal = {};
    @select(state=>state.diagnose_selected_unit) diagnoseSelectedUnit;
    @select(state=>state.diagnose_textbooks) textbooks;
    @select((state)=>{
        return state.diagnose_selected_textbook[state.diagnose_selected_clazz.id]
    }) textbook;
    @select(state=>state.fetch_diagnose_textbook_processing) isLoadingProcessing;

    back = ()=> this.go("home.diagnose", 'back');
    openModal = ()=> this.Modal.show();//打开教材选择modal
    closeModal = ()=> this.Modal.hide();//关闭教材modal

    constructor() {
        this.initModal();
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
            .then(()=> {
                this.diagnoseService.getTextbookList(this.loadCallback.bind(this));
            })
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelUnitRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelUnitRequestList.splice(0, this.diagnoseService.cancelUnitRequestList.length);//清空请求列表
    }

    /**
     * 加载完毕的回调
     */
    loadCallback() {
        let param=this.textbook&&this.textbook.subTags?this.textbook:null;
        this.diagnoseService.selectTextbook(param);
    }

    initModal() {
        //初始化modal页
        this.$ionicModal.fromTemplateUrl('textbookSelect.html', {
                scope: this.getScope(),
                animation: 'slide-in-up'
            }) .then((modal) =>{
                this.Modal = modal;
            });
        this.getScope().$on('$destroy', ()=> {
            this.Modal.remove();
        });
    }


    /**
     * 收起所有展开的章节列表
     */
    hideAllData () {
        _each(this.textbook.subTags,function(chapter){
            chapter.isOpened=false;
        });
    }

    /**
     * 选择教材,根据该教材ID,获取教材下所有的章节和单元
     * @param data
     */
    selectCurrentTextbook (data) {
        if(this.isLoadingProcessing){//还在加载过程中，就不能点击
            return;
        }
        this.diagnoseService.selectTextbook(data);
        this.closeModal();
    }

    /**
     * 显示当前章节下的单元
     * @param unit
     * @param ev
     */
    clickUnit (unit, ev, index) {
        if(!this.diagnoseSelectedUnit||this.diagnoseSelectedUnit.id!=unit.id){
            unit.retFlag=false;
            unit.textbookName=this.textbook.name;
            this.diagnoseService.changeUnit(unit);
        }
        this.back();
    }

}

export default SelectUnitCtrl;




