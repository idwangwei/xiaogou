/**
 * Created by Administrator on 2016/8/3.
 */
import _each from 'lodash.foreach';
import _find from 'lodash.find';
import {Inject, View, Directive, select} from '../../module';
const SUBHEADER_TEXT='选择考点获取相关题目';
@View('work_paper_points_edit', {
    url: '/work_paper_points_edit/:bigQIndex',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:[
        '$rootScope'
        ,'$scope'
        ,'$state'
        ,'$ionicHistory'
        ,'$ionicScrollDelegate'
        ,'$ngRedux'
        ,'commonService'
        ,'workChapterPaperService'
        ,'ngLocalStore'
        ,'$ionicPopup'
    ]
})
class WorkPaperPointsEditCtrl{
    constructor(){
        this.showTips();
        this.initData();
    }
    initData(){
        this.isEdit = true;
        this.subHeaderText = SUBHEADER_TEXT;
        this.initCtrl = false;
        this.pointsList = [];
        this.isIos = this.commonService.judgeSYS() === 2;
        this.headerText = '';
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData(){
        if(!this.initCtrl && this.pointsList.length == 0 ){
            let paperData = this.ngLocalStore.getTempPaper();
            this.headerText = paperData.data.basic.title;
            this.parsePoints(paperData.data);
        }
    }


    back(){
        this.$ionicHistory.goBack();
    }
    help(){
        this.$ionicPopup.alert({
            title: '知识点信息',
            template: '<p>1.展示的信息为本试卷所包含的知识点。</p>' +
            '<p>2.点击知识点可从题库中获取相关的题目。</p>'+
            '<p>3.知识点描述后的数字为本试卷中不同难度的题目数量。</p>',

            okText: '确定'
        });
    }
    /**
     * 显示引导
     */
    showTips(){
        let key = this.getRootScope().user.loginName + "filterSmallQ";
        this.isShowTips = this.commonService.getLocalStorage(key);
        if (!this.isShowTips) {
            this.$ionicPopup.alert({
                title: '温馨提示',
                template: '<p style="font-size:16px">1. 点击具体知识点，可根据该知识点从题库中查询相关题目。</p> ' +
                '<p style="font-size:16px">2. 点击右上角的“?”了解更多。</p>' +
                '  <ion-checkbox ng-click="ctrl.isShowTips = !ctrl.isShowTips"  style="border:none;background:none;font-size:14px">不再提示</ion-checkbox>',
                scope: this.getScope(),
                okText: '确定'
            }).then(()=> {
                if (this.isShowTips){this.commonService.setLocalStorage(key, true)}
            });
        }
    }

    /**
     * 滚动到顶部
     */
    scrollTop () {
        this.$ionicScrollDelegate.scrollTop(true);
    };
    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition () {
        if (this.$ionicScrollDelegate.getScrollPosition().top>= 250) {
            $('.scrollToTop').fadeIn();
        }
        else {
            $('.scrollToTop').fadeOut();
        }
    };
    /**
     * 进入题目筛选页面
     */
    gotoFilterQ(childPoint){
        this.selectKnowledge({
            id:childPoint.id,
            text:childPoint.text
        });
        this.go('work_filter_smallq',{knowledgeId:childPoint.id, bigQIndex:this.getStateService().params.bigQIndex});
    }


    /**
     * 提出试卷中所有题目的知识点，对应单元知识点列表，返回层级结构的知识点列表数组
     */
    parsePoints(paperData){
        //没获取到试卷内容或者单元知识点中列表,不执行
        if(!paperData || !this.selectUnitPoints){return}

        this.pointsList = this.selectUnitPoints.slice();
        _each(this.pointsList,(bigP)=>{
            bigP.typesNum = {
                base: 0,
                general: 0,
                hard: 0
            };
            _each(bigP.subTags,(smallP)=>{
                smallP.typesNum = {
                    base: 0,
                    general: 0,
                    hard: 0
                }
            })
        });

        //遍历试卷中所有小题的知识点
        _each(paperData.qsTitles,(bigQ)=>{
            _each(bigQ.qsList,(smallQ)=>{
                let point = smallQ.knowledge[0];
                if(!point || !point.id){console.error('小题没有知识点');return}
                addSmallQPointNumInUnitPoints.call(this,point,smallQ.difficulty);
            })
        });



        /**
         * 在单元知识点中列表中查找该小题知识点的父级知识点
         * @param point
         * @param difficulty
         * @returns {{id: *, text: *, isOpened: boolean, subTags: *[]}}
         */
        function addSmallQPointNumInUnitPoints(point,difficulty){
            let parentP = {typesNum:{base:0,hard:0,general:0}};
            let addSmallP = {typesNum:{base:0,hard:0,general:0}};
            _find(this.pointsList,(bigP)=>{
                let result = _find(bigP.subTags,{id:point.id});
                if(result){
                    addSmallP = result;
                    parentP = bigP;
                    return true
                }
            });

            if(difficulty < 40){
                addSmallP.typesNum.base += 1;
                parentP.typesNum.base += 1;
            }
            else if(difficulty >= 70){
                addSmallP.typesNum.hard += 1;
                parentP.typesNum.hard += 1;
            }
            else{
                addSmallP.typesNum.general += 1;
                parentP.typesNum.general += 1;
            }
        }
    }


    mapStateToThis(state) {
        let unitPoints = state.wr_unit_points;
        let selectUnit = state.wr_selected_unit;
        let selectUnitPoints = unitPoints && unitPoints[selectUnit.unitId];
        // let headerText = state.wr_selected_paper && state.wr_selected_paper.title;
        return {
            selectPaper:state.wr_selected_paper,
            unitPoints:state.wr_unit_points,
            selectUnit:state.wr_selected_unit,
            // headerText:headerText,
            selectUnitPoints:selectUnitPoints
        }
    }
    mapActionToThis() {
        return {
            selectKnowledge: this.workChapterPaperService.selectKnowledge
        }
    }
}
export default WorkPaperPointsEditCtrl;