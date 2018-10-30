/**
 * Created by 彭建伦 on 2016/1/11.
 *
 */
import _each from 'lodash.foreach';
import * as simulationData from '../../../../t_boot/json/simulationClazz/textbook_list_v2';
import {Inject, View, Directive, select} from '../../module';
@View('work_paper_bank', {
    url: '/work_paper_bank/:from/:urlFrom',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:[
        '$scope'
        , 'commonService'
        , 'workPaperBankService'
        , '$ionicModal'
        , '$state'
        , '$ionicPopup'
        , '$ngRedux'
        , '$rootScope'
    ]
})
class WorkPaperBankCtrl {
    $ionicModal;
    $ionicPopup;
    commonService;
    workPaperBankService;
    initCtrl = false;
    Modal = {};
    @select("wr_textbooks") textbooks;
    @select((state)=> {
        return state.wr_selected_textbook[state.wl_selected_clazz.id]
    }) textbook;
    back = ()=> this.go('pub_work_type');//返回到worklist页面
    openModal = ()=> this.Modal.show();//打开教材选择modal
    closeModal = ()=> this.Modal.hide();//关闭教材modal
    simulationPaper = simulationData.default;
    constructor() {
        this.initModal();
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
                this.workPaperBankService.getTextbookList(()=> {
                    this.textbook && this.textbook.id ?
                        this.workPaperBankService.selectTextbook(this.textbook, flag) :
                        this.workPaperBankService.selectTextbook(null, flag);
                });
            })
    }

    onBeforeEnterView() {
        this.guideFlag = this.commonService.getSimulationClazzLocalData();
        let flag = true;
        if (this.guideFlag && !this.guideFlag.hasPubedSimulationWork) {
            flag = false;
        }
        if (this.getStateService().params.urlFrom === 'work_list') {
            this.initCtrl = true;
            this.workPaperBankService.getTextbookList(()=> {
                this.workPaperBankService.selectTextbook(this.textbook, flag);
            });
        }

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


    /**
     * 点击问号弹出提示
     */
    help() {
        this.$ionicPopup.alert({
            title: '说明',
            template: '<p>1.针对教材的每单元每小节，“题库”中有对应的多个作业。</p>' +
            '<p>2.在一个作业中，既可以删除题，也可以选取指定知识点的相关题目加入进来。</p>' +
            '<p>3.按住任何一个作业项向左滑动，可以看到更多的功能选项。</p>' +
            '<p>4.点击右侧的三角形图标，可以收起所有的题库标签。</p>',
            okText: '确定'
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

    /**
     * 点击章节下的单元进入单元试卷列表
     */
    showDetailUnit(chapter, unit) {
        this.workPaperBankService.selectUnit(chapter.text, unit.id, unit.text, chapter.seq == 0 && unit.seq == 0);
        this.go('work_chapter_paper', {chapterId: unit.id});
    }

    getHighLightEle () {
        if (this.currentStep == 2) {
            this.currentShowEle = $(".lesson_bg").eq(1).parent();
            return;
        }
        this.currentStep = 1;
        this.currentShowEle =  $(".unit_bg").eq(0);
    }
}

export default WorkPaperBankCtrl;