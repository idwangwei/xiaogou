/**
 * Created by ZL on 2017/10/20.
 */
import _each from 'lodash.foreach';
import {Inject, View, Directive, select} from '../../module';

@Directive({
    selector: 'oralAssemblePaper',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})
@View('oral_assemble_paper', {
    url: '/oral_assemble_paper/:from/:urlFrom',
    template: '<oral-assemble-paper></oral-assemble-paper>'
})
@Inject('$scope', 'commonService', 'workPaperBankService', '$ionicModal', '$state', '$ionicPopup', '$ngRedux', 'oralAssemblePaperService', '$rootScope')
class oralAssemblePaperCtrl {
    $ionicModal;
    $ionicPopup;
    commonService;
    workPaperBankService;
    oralAssemblePaperService;

    initCtrl = false;
    Modal = {};
    totalSelectQues = {};//此数据在点击组卷后缓存，发布作业后清空；
    @select(state=>state.wr_textbooks) textbooks;
    // @select("wr_selected_textbook") textbook;
    @select((state)=> {
        return state.wr_selected_textbook[state.wl_selected_clazz.id]
    }) textbook;
    @select(state=>state.compose_temp_oral_paper.tempPaperSetParams) localTotalSelectQues;
    @select(state=>state.compose_temp_oral_paper.selectBookText) selectBookText;
    @select(state=>state.wl_selected_clazz.teachingMaterial) teachingMaterial;
    getTextBookStatus = 'start';

    back = ()=> this.go('pub_work_type');//返回到worklist页面
    openModal = ()=> this.Modal.show();//打开教材选择modal
    closeModal = ()=> this.Modal.hide();//关闭教材modal
    // onBeforeLeaveView = ()=> this.Modal.remove();

    constructor() {
        this.initModal();
    }

    initData() {
        if (!this.localTotalSelectQues) this.totalSelectQues = [];
        angular.forEach(this.localTotalSelectQues, (v, k)=> {
            this.totalSelectQues[v.tagId] = this.localTotalSelectQues[k];
        })
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
            .then(()=> {
                this.guideFlag = this.commonService.getSimulationClazzLocalData();
                let flag = true;
                if (this.guideFlag && !this.guideFlag.hasPubedSimulationWork) {
                    flag = false;
                }
                this.workPaperBankService.getTextbookList((data)=> {
                    if (data) {
                        this.getTextBookStatus = 'success';
                        this.textbook && this.textbook.id ?
                            this.workPaperBankService.selectTextbook(this.textbook, flag) :
                            this.workPaperBankService.selectTextbook(null, flag);
                    } else {
                        this.getTextBookStatus = 'fail';
                    }


                }, 10);
            })
    }

    /**
     * 拉取教材版本
     */
    getTextbooks(){
        this.workPaperBankService.getTextbookList((data)=> {
            if (data) {
                this.getTextBookStatus = 'success';
                this.textbook && this.textbook.id ?
                    this.workPaperBankService.selectTextbook(this.textbook, flag) :
                    this.workPaperBankService.selectTextbook(null, flag);
            } else {
                this.getTextBookStatus = 'fail';
            }


        }, 10);
    }

    getTotalSelectNum() {
        this.totalSelectNum = 0;
        let allKeys = Object.keys(this.totalSelectQues);
        allKeys.forEach((v)=> {
            this.totalSelectNum += Number(this.totalSelectQues[v].questionNum);
        });
    }

    onAfterEnterView() {
        if (this.teachingMaterial != this.selectBookText) {
            this.oralAssemblePaperService.clearPaperDate().then((data)=> {
                this.initData();
                this.totalSelectNum = 0;
            });

        } else {
            this.initData();
            this.getTotalSelectNum();
        }
    }

    onBeforeEnterView() {
        this.guideFlag = this.commonService.getSimulationClazzLocalData();
        let flag = true;
        if (this.guideFlag && !this.guideFlag.hasPubedSimulationWork) {
            flag = false;
        }
      /*  if (this.getStateService().params.urlFrom === 'work_list') {
            this.initCtrl = true;
            this.workPaperBankService.getTextbookList(()=> {
                this.workPaperBankService.selectTextbook(this.textbook, flag);
            }, 10);
        }*/
    }


    initModal() {
        //初始化modal页
        this.$ionicModal.fromTemplateUrl('textbookSelect.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> this.Modal = modal);
        this.getScope().$on('$destroy', ()=> {
            this.Modal.remove()
        })
    }

    changeSelectNum(unit, type, $event) {
        if (typeof $event === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        if (type == 'add') {
            if (this.totalSelectNum >= 100) {
                this.commonService.alertDialog('一套试卷题量最多可选取100道题，先去组卷让学生练习吧!');
                return;
            }

            if (!this.totalSelectQues[unit.id]) {
                this.totalSelectQues[unit.id] = {
                    tagId: unit.id,
                    questionNum: 5,
                    includeQIds: [],
                    selectedQIds: []
                }
            } else {
                if (Number(this.totalSelectQues[unit.id].questionNum) >= 30) {
                    this.commonService.alertDialog('一个课时最多可选取30道题，从其他课时再添加一些题吧!');
                    return;
                }
                this.totalSelectQues[unit.id].questionNum = Number(this.totalSelectQues[unit.id].questionNum) + 5;
            }
            this.totalSelectNum += 5;
        } else {
            if (!this.totalSelectQues[unit.id]) return;
            if (Number(this.totalSelectQues[unit.id].questionNum) <= 0) return;
            if (this.totalSelectQues[unit.id]) {
                this.totalSelectQues[unit.id].questionNum = Number(this.totalSelectQues[unit.id].questionNum) - 5;
                if (this.totalSelectQues[unit.id].questionNum < 0) this.totalSelectQues[unit.id].questionNum = 0;
            }
            this.totalSelectNum -= 5;
            if (this.totalSelectNum < 0) this.totalSelectNum = 0;

            if (!this.totalSelectQues[unit.id].questionNum)
                delete this.totalSelectQues[unit.id];
        }
    }

    /**
     * 去组卷
     * */
    gotoMackPaper() {
        if (!this.totalSelectNum) {
            this.commonService.alertDialog("请先选择组卷的单元与题数");
            return;
        }
        if (this.totalSelectNum > 100) {
            this.commonService.alertDialog("一套试卷题量最多可选取100道题");
            return;
        }
        angular.forEach(Object.keys(this.totalSelectQues), (v, k)=> {
            if (this.totalSelectQues[v].questionNum == 0) {
                delete this.totalSelectQues[v];
            }
        });
        let allSelectUnit = Object.values(this.totalSelectQues);
        //调接口，保存返回结果
        this.oralAssemblePaperService.getComposePaperQues(allSelectUnit).then((data, msg)=> {
            if (data) { //接口成功就跳转到新的布置页面
                this.go('oral_assemble_preview');
            } else {
                this.commonService.showAlert('警告', msg || '生成试卷失败');
            }
        });
    }

    /**
     * 收起所有展开的章节列表
     */
    hideAllData() {
        _each(this.textbook.subTags, function (chapter) {
            chapter.isOpened = false;
        });
    }

    /**
     * 选择教材,根据该教材ID,获取教材下所有的章节和单元
     * @param data
     */
    selectCurrentTextbook(data) {
        this.workPaperBankService.selectTextbook(data, true);
        this.closeModal();
    }

    /**
     * 显示当前章节下的单元
     * @param unit
     * @param ev
     */
    clickUnit(unit, ev) {
        unit.isOpened = !unit.isOpened;
        if (!unit.isOpened) {
            return
        }
        unit.retFlag = false;
        $(ev.target).find('span').toggleClass('ion-chevron-down').toggleClass('ion-chevron-right');
        if (this.guideFlag && !this.guideFlag.hasPubedSimulationWork) {
            this.currentStep = 2;
        }
    }

    getHighLightEle() {
        if (this.currentStep == 2) {
            this.currentShowEle = $(".lesson_bg").eq(1).parent();
            return;
        }
        this.currentStep = 1;
        this.currentShowEle = $(".unit_bg").eq(0);
    }
}

export default oralAssemblePaperCtrl;