/**
 * Created by qiyuexi on 2018/3/7.
 */
import _each from 'lodash.foreach';
// import * as simulationData from './../../../json/simulationClazz/textbook_list_v2';
import {Inject, View, Directive, select} from '../../module';

@View('area_evaluation_work', {
    url: '/area_evaluation_work',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope', 'commonService', 'areaEvaluationService', '$ionicModal', '$state', '$ionicPopup', '$ngRedux', 'areaEvaluationPubService','$rootScope'
    ]
})
class areaEvaluationWorkCtrl {
    $ionicModal;
    $ionicPopup;
    commonService;
    areaEvaluationService;
    areaEvaluationPubService;
    initCtrl = false;
    Modal = {};
    totalSelectQues = {};//此数据在点击组卷后缓存，发布作业后清空；
    @select("ae_textbooks") textbooks;
    @select((state)=> {
        return state.ae_selected_textbook[state.wl_selected_clazz.id]
    }) textbook;
    @select(state=>{
        return state.ae_compose_temp_paper.tempPaperSetParams
    }) localTotalSelectQues;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    @select(state=>state.ae_auto_paper_list) autoPapers;
    back = ()=> this.go('pub_work_type');//返回到worklist页面
    openModal = ()=> this.Modal.show();//打开教材选择modal
    closeModal = ()=> this.Modal.hide();//关闭教材modal
    // simulationPaper = simulationData.default;
    // onBeforeLeaveView = ()=> this.Modal.remove();

    constructor() {
        this.initModal();
        this.selectAutoPaper={
            isOpened:false,
            data:[]
        };
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

                this.areaEvaluationService.getTextbookList(()=> {
                    this.textbook && this.textbook.id ?
                        this.areaEvaluationService.selectTextbook(this.textbook, flag) :
                        this.areaEvaluationService.selectTextbook(null, flag);
                    this.getAutoPaperList().then(()=>{
                        this.rebuildSelectAutoPaper();
                    })
                });
            })
    }

    getTotalSelectNum() {
        this.totalSelectNum = 0;
        let allKeys = Object.keys(this.totalSelectQues);
        allKeys.forEach((v)=> {
            this.totalSelectNum += Number(this.totalSelectQues[v].questionNum);
        });

    }

    onAfterEnterView() {
        this.initData();
        this.getTotalSelectNum();
    }
    onBeforeEnterView() {
        this.guideFlag = this.commonService.getSimulationClazzLocalData();
        let flag = true;
        if (this.guideFlag && !this.guideFlag.hasPubedSimulationWork) {
            flag = false;
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

    changeSelectNum(unit, type, $event) {
        if (typeof $event === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        if (type == 'add') {
            if (this.totalSelectNum >= 30) {
                this.commonService.alertDialog('一套试卷题量最多可选取30道题，先去组卷让学生练习吧!');
                return;
            }

            if (!this.totalSelectQues[unit.id]) {
                this.totalSelectQues[unit.id] = {
                    tagId: unit.id,
                    questionNum: 1,
                    includeQIds: [],
                    selectedQIds: []
                }
            } else {
                if (Number(this.totalSelectQues[unit.id].questionNum) >= 30) {
                    this.commonService.alertDialog('一个课时最多可选取30道题，从其他课时再添加一些题吧!');
                    return;
                }
                /*else if (this.totalSelectNum >= 30) {
                 this.commonService.alertDialog('一套试卷题量最多可选取30道题，先去组卷让学生练习吧!');
                 return;
                 }*/
                this.totalSelectQues[unit.id].questionNum = Number(this.totalSelectQues[unit.id].questionNum) + 1;
            }
            this.totalSelectNum += 1;
        } else {
            if (!this.totalSelectQues[unit.id]) return;
            if(Number(this.totalSelectQues[unit.id].questionNum) <=0) return;
            if (this.totalSelectQues[unit.id]) {
                this.totalSelectQues[unit.id].questionNum = Number(this.totalSelectQues[unit.id].questionNum) - 1;
            }
            this.totalSelectNum -= 1;

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
        if (this.totalSelectNum > 30) {
            this.commonService.alertDialog("一套试卷题量最多可选取30道题");
            return;
        }
        angular.forEach(Object.keys(this.totalSelectQues), (v, k)=> {
            if (this.totalSelectQues[v].questionNum == 0) {
                delete this.totalSelectQues[v];
            }
        });
        let allSelectUnit = Object.values(this.totalSelectQues);

        //调接口，保存返回结果
        this.areaEvaluationPubService.getComposePaperQues(allSelectUnit).then((data, msg)=> {
            if (data) { //接口成功就跳转到新的布置页面
                this.go('area_evaluation_check');
            } else {
                this.commonService.showAlert('警告', msg || '生成试卷失败');
            }
        });
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
        this.areaEvaluationService.selectTextbook(data, true);
        this.rebuildSelectAutoPaper();
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
    clickAutoPaper(ev) {
        var unit=this.selectAutoPaper;
        unit.isOpened = !unit.isOpened;
        if (!unit.isOpened) {
            return
        }
        $(ev.target).find('span').toggleClass('ion-chevron-down').toggleClass('ion-chevron-right');
    }

    getHighLightEle() {
        if (this.currentStep == 2) {
            this.currentShowEle = $(".lesson_bg").eq(1).parent();
            return;
        }
        this.currentStep = 1;
        this.currentShowEle = $(".unit_bg").eq(0);
    }

    /*获取自动组卷列表*/
    getAutoPaperList(){
        return this.areaEvaluationService.getAutoPaperList({
            groupId:this.clazzId,
            publishType:16
        })
    }
    rebuildSelectAutoPaper(){
        let codeArr=this.textbook.code.split("-");
        let itemArr=[];
        this.autoPapers.forEach((v)=>{
            if(v.teachingMaterial==codeArr[0]&&v.gradeName==Math.ceil(codeArr[1]/2)){
                itemArr.push(v)
            }
        })
        this.selectAutoPaper={
            isOpened:false,
            data:itemArr
        };
    }
    goToAutoPaperDetail(item){
        item.id=item.paperId;
        item.title=item.paperName;
        this.areaEvaluationService.selectedAutoDetailPaper(item)
        this.go('area_evaluation_paper_detail',{paperId:item.paperId});
    }
}

export default areaEvaluationWorkCtrl;