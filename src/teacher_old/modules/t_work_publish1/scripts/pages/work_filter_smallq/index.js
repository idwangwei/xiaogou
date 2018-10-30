/**
 * Created by Administrator on 2016/8/3.
 */

import _assign from 'lodash.assign';
import _each from 'lodash.foreach';
import _find from 'lodash.find';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import {Inject, View, Directive, select} from '../../module';
@View('work_filter_smallq', {
    url: '/work_filter_smallq/:knowledgeId/:bigQIndex',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:[
        '$rootScope'
        , '$scope'
        , '$state'
        , '$ionicHistory'
        , '$ionicPopup'
        , '$ionicScrollDelegate'
        , '$ngRedux'
        , 'commonService'
        , 'workChapterPaperService'
        , 'questionType'
        , 'ngLocalStore'
        , "workStatisticsService"
    ]
})
class WorkFilterSmallQCtrl{
    constructor() {
        this.showTips();
        this.initData();
    }

    initData() {
        this.initCtrl = false;
        this.canLoadMore = false;
        this.filtrate = [
            {
                text: '题型',
                name: 'type',
                selected: "",
                options: [
                     {val: ""        , text: '不限'}
                    ,{val: this.questionType.FILL_BLANKS        , text: '填空'}
                    ,{val: this.questionType.OPTIONS            , text: '选择'}
                    ,{val: this.questionType.VERTICAL_EXP_CALC  , text: '竖式计算'}
                    ,{val: this.questionType.VERTICAL_EXP_ERROR , text: '竖式改错'}
                    ,{val: this.questionType.VERTICAL_EXP_BLANK , text: '竖式填空'}
                    ,{val: this.questionType.JUDGEMENT          , text: '判断'}
                    ,{val: this.questionType.SOLVE_PROBLEM      , text: '解决问题'}
                    ,{val: this.questionType.SOLVE_VARIABLE     , text: '解方程'}
                    ,{val: this.questionType.PULL_EXP_CALC      , text: '脱式计算'}
                ]
            },
            {
                text: '难度',
                name: 'difficulty',
                selected: '',
                options: [
                     {val: '', text: '不限'}
                    ,{val: '40-', text: '简单'}
                    ,{val: '40,70', text: '普通'}
                    ,{val: '70,100', text: '困难'}
                ]
            }
        ];
        this.queryParams = {
            tagIds: [this.getStateService().params.knowledgeId], //知识点id
            page:{
                "curPage": 1,    //查询的当前页
                "perSize": 8     //每页显示的数目
            }, //查询翻页信息
            type: '', //默认题型为填空题
            difficulty:''  //简单
        };
        this.type = '不限';
        this.difficulty = '不限';
        this.knowledgeText = '';
        this.smallQList = [
            //{
            //    answerKey: '[{"type":"standalone","scorePoints":[{"uuid":"79a562b2-3639-4b43-97cb-37ba2070e8ed","label":"得分点1","referInputBoxes":[{"label":1,"uuid":"688b33b3-8140-45a7-a40a-d44abb39bdf3","info":{"type":{"name":"underline","val":"下划线","$$hashKey":"object:677"},"selectItem":[{"expr":"东"},{"expr":"西"},{"expr":"南"},{"expr":"北"}]}}],"answerList":[{"expr":"东","uuid":"29612c5a-3990-4cda-b73f-1482233b9c67","label":1}]},{"uuid":"171cda49-3440-43f9-a71b-67468faf6500","label":"得分点2","referInputBoxes":[{"label":2,"uuid":"381eb730-ec4e-4be5-871d-22cd00ab91e2","info":{"type":{"name":"underline","val":"下划线","$$hashKey":"object:677"},"selectItem":[{"expr":"东"},{"expr":"西"},{"expr":"南"},{"expr":"北"}]}}],"answerList":[{"expr":"西","uuid":"b9b52335-af0d-4cae-9c82-f603e0689dad","label":1}]}]}]',
            //    id: "1dc197b8-4d3f-40e5-93fe-de85e79c8cc5",
            //    qContext: '<div class="layout-box"><p>太阳从<span id="688b33b3-8140-45a7-a40a-d44abb39bdf3" class="appTextarea input-area select-input-area underline-select-input-area" style="display: inline-block; width: 49px; height: 30px; margin: 0px 2px; border-style: none none solid; border-bottom-width: 1px; border-bottom-color: black; background: rgb(172, 234, 243);"></span>方升起；&nbsp;<span style="line-height: 1.42857143;">在</span><span id="381eb730-ec4e-4be5-871d-22cd00ab91e2" class="appTextarea input-area select-input-area underline-select-input-area" style="width: 50px; height: 30px; margin-right: 2px; margin-left: 2px; border-style: none none solid; border-bottom-width: 1px; border-bottom-color: black; background: rgb(172, 234, 243);"></span><span style="line-height: 1.42857143;">方落下。</span></p></div>',
            //    score: 6,
            //    scorePointUUID: Array[2],
            //    selected: false,
            //    seqNum: 0
            //}
        ];
        this.isNoQuestion = false;

        this.paper = null;
        this.isShowTips = false; //进入页面是否显示提示
        this.allSmallQInfoList = [];
        this.retFlag = false;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        //获取知识点相关的小题集合
        if(!this.initCtrl){
            this.initCtrl = true;
            this.getSmallQList().then(()=>{this.retFlag = true});
        }

        //获取当前编辑的试卷
        if(!this.paper){
            let temp = this.ngLocalStore.getTempPaper();
            this.paper = temp && temp.data;

            _each(this.paper.qsTitles||[],(bigQ,bigQIndex)=>{
                _each(bigQ.qsList,(smallQ,smallQIndex)=>{
                    this.allSmallQInfoList.push({
                        id:smallQ.id,
                        bigQIndex:bigQIndex,
                        smallQIndex:smallQIndex
                    });
                })
            });
        }
    }

    onAfterEnterView(){
        //if(this.paper){
        //    _each(this.paper.qsTitles,(bigQ,bigQIndex)=>{
        //        _each(bigQ.qsList,(smallQ,smallQIndex)=>{
        //            this.allSmallQInfoList.push({
        //                id:smallQ.id,
        //                bigQIndex:bigQIndex,
        //                smallQIndex:smallQIndex
        //            });
        //        })
        //    });
        //}
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
                template: '<p style="font-size:16px">1. 点击右上角的“?”了解更多。</p>' +
                '  <ion-checkbox ng-click="ctrl.isShowTips = !ctrl.isShowTips"  style="border:none;background:none;font-size:14px">不再提示</ion-checkbox>',
                scope: this.getScope(),
                okText: '确定'
            }).then(()=> {
                if (this.isShowTips){this.commonService.setLocalStorage(key, true)}
            });
        }
    }
    help () {
        this.$ionicPopup.alert({
            title: '知识点信息',
            template: '<p>1.题目为相关考点的题目。</p>' +
            '<p>2.勾选小题后，点击确定可将小题添加进指定的大题中。</p>',
            okText: '确定'
        });
    }
    back() {
        this.$ionicHistory.goBack();
    }


    /**
     * 滚动到顶部
     */
    scrollTop() {
        this.$ionicScrollDelegate.scrollTop(true);
    }

    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition() {
        if (this.$ionicScrollDelegate.getScrollPosition().top >= 250) {
            $('.scrollToTop').fadeIn();
        }
        else {
            $('.scrollToTop').fadeOut();
        }
    }

    /**
     * 打开筛选条件Modal
     */
    openFilterCondition() {
        //获取打开筛选条件时的条件初始值
        let defaultParam = _assign({},this.queryParams);

        //弹出条件筛选框
        this.$ionicPopup.show({
            templateUrl: 'filtrateSQ.html',
            title: '筛选条件',
            scope: this.getScope(),
            buttons: [
                {
                    text: '<b>确认</b>',
                    type: 'button-positive',
                    onTap: (e) => {
                        let hasChange = _find(this.filtrate, (v)=> {return v.selected != defaultParam[v.name]});

                        //使用最新的筛选条件向服务器获取相关小题集合
                        if (hasChange) {
                            _each(this.filtrate,(v)=>{
                                this.queryParams[v.name] = v.selected;
                                this[v.name] = _find(v.options,{val:v.selected}).text;
                            });
                            this.queryParams.page.curPage = 1;
                            this.smallQList = [];
                            this.getSmallQList();
                        }
                    }
                }
            ]
        });
    }

    getSmallQList(isLoadMore){
        return this.workChapterPaperService.getSmallQListByKnowledgeId(this.queryParams).then((data)=>{
            if(data && data.code &&  data.code != 200){
                this.canLoadMore = false;
                this.isNoQuestion = isLoadMore ? this.isNoQuestion:true;
                this.getScope().$broadcast('scroll.infiniteScrollComplete');
                return
            }
            if(data && data.items && data.items.length>0){
                //过滤掉已经添加了的小题
                console.log(data.items);
                this.canLoadMore = data.total >= this.queryParams.page.perSize * this.queryParams.page.curPage;
                this.queryParams.page.curPage += 1;
                _each(data.items,(obj)=>{
                    let repeatSamllQ = _find(this.allSmallQInfoList, {id: obj.id});
                    if (!repeatSamllQ) {
                        obj.selected = false;
                        obj.score = 1;
                        let parseSmallQ=(qs)=>{
                            qs.inputList=[];
                            let answerKey = JSON.parse(qs.answerKey);

                            //TODO: ==start==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）
                            // if(qs.qContext.match(/\{reduc\}/)){
                            //     qs.qContext = qs.qContext.replace(/\{reduc\}/,'');
                            //
                            //     let $qContext = $(qs.qContext);
                            //     let $span = $qContext.find('.appTextarea');
                            //     $span.replaceWith(
                            //         $(`<simplify id="${$span.attr('id')}" label="${$span.attr('label')}"></simplify>`)
                            //             .attr('style','width:310px;min-height:100px')
                            //     );
                            //     qs.qContext = $qContext[0].outerHTML;
                            // }
                            //TODO: ==end==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）



                            let isVerticalSp = type=>type == VERTICAL_CALC_SCOREPOINT_TYPE || type == VERTICAL_ERROR_SCOREPOINT_TYPE || type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE;
                            let addMatrixToVerticalFormulaService = (anskey)=> {
                                anskey.scorePoints.forEach(sp=> {
                                    let spInfo = {};
                                    spInfo.spList = [];
                                    sp.referInputBoxes.forEach(inputbox=> {
                                        let uuid = inputbox.uuid;
                                        let answerMatrixList = [];
                                        let presetMatrix = null;//竖式改错的矩阵
                                        let getPresetMatrix = (matrixInfo)=> {
                                            let rt = null;
                                            Object.keys(matrixInfo).forEach(key=> {
                                                if (key != 'preset' && matrixInfo[key] instanceof Array) {
                                                    rt = {verticalId: key, matrix: matrixInfo[key]};
                                                }
                                            });
                                            return rt;
                                        };
                                        if (!inputbox.info) { //如果不是竖式改错打勾叉
                                            let vfMatrix = anskey.vfMatrix;
                                            if (vfMatrix && vfMatrix.length) {
                                                vfMatrix.forEach(matrixInfo=> {
                                                    if (matrixInfo.preset)
                                                        presetMatrix = getPresetMatrix(matrixInfo);
                                                });
                                                vfMatrix.forEach(matrixInfo=> {
                                                    if (matrixInfo[uuid]) {
                                                        let spListItem = {
                                                            inputBoxUuid: uuid,
                                                            scorePointId: sp.uuid,
                                                            matrix: matrixInfo[uuid],
                                                            type: anskey.type
                                                        };
                                                        if (presetMatrix && presetMatrix.matrix && presetMatrix.matrix.length)
                                                            spListItem.presetMatrixInfo = presetMatrix;
                                                        spInfo.spList.push(spListItem);
                                                    }
                                                });
                                            } else {
                                                let spListItem = {
                                                    inputBoxUuid: uuid,
                                                    scorePointId: sp.uuid,
                                                    type: anskey.type
                                                };
                                                spInfo.spList.push(spListItem);
                                            }
                                        } else {
                                            spInfo.spList.push({
                                                inputBoxUuid: uuid,
                                                scorePointId: sp.uuid,
                                                currentQSelectItem: inputbox.info.selectItem,
                                            });
                                        }
                                    });
                                    qs.inputList.push(spInfo);
                                });
                            };
                            answerKey.forEach((ans)=> {
                                if (isVerticalSp(ans.type))
                                    addMatrixToVerticalFormulaService(ans);
                            });
                        };
                        parseSmallQ(obj);
                       this.smallQList.push(obj);
                    }
                });
                if(this.smallQList.length !=0 ) this.isNoQuestion = false;
                if(!this.canLoadMore) this.isNoQuestion = (this.smallQList.length == 0 );
            }
            else if(isLoadMore && data.items && !data.items.length){
                this.canLoadMore = false;
            }
            else{
                this.smallQList = [];
                this.isNoQuestion = true;
                this.canLoadMore = false;
            }
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        },(data)=>{
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        })
    }

    /**
     * 添加选择的小题到试卷中
     */
    addQ(){
        let currentBigQ = this.paper.qsTitles[+this.getStateService().params.bigQIndex];
        let isAdded = false;
        let selectSmallQList = [];
        _each(this.smallQList,(smallQ,index)=>{
            if(smallQ.selected){
                selectSmallQList.push({
                    index:index,
                    smallQ:smallQ
                });
            }
        });

        var newSmallQIndex,
            firstSmallQIndex;
        if(selectSmallQList.length > 0){
            firstSmallQIndex = selectSmallQList[0].smallQ.id;
            newSmallQIndex =  currentBigQ.qsList.length;
            isAdded = true;
            _each(selectSmallQList,(obj)=>{
                obj.smallQ.seqNum = newSmallQIndex;
                // obj.smallQ.score = 1;
                newSmallQIndex++;
                currentBigQ.qsList.push(obj.smallQ);
            })
        }
        currentBigQ.score += selectSmallQList.length;
        this.paper.basic.score += selectSmallQList.length;
        this.go("work_paper_edit",{
               isAddedSmallQ:isAdded,
               firstSmallQIndex
        });
    }

    loadMore(){
        this.getSmallQList(true);
    }

    /**
     * 显示小题的知识点和难度
     * @param record
     * @returns {string}
     */
    showKnowledgeAndDifficulty(record) {
        // let str1 = record.knowledge[0].code.match(/-(\w+)$/)[1]; //知识点
        let str1 = record.knowledge[0].content.replace(/^[a-z]\d+\./i,'');
        let str2 = record.difficulty < 40 ? '基础' : record.difficulty > 70 ? '拓展' : '变式'; //难度
        //return str1 + ' - ' + str2;
        return str1 +' -'+str2;
    }

    goQFeedbackPage (questionId){
        this.workStatisticsService.workDetailState.lastStateUrl = this.getStateService().current.name;
        this.workStatisticsService.workDetailState.lastStateParams = this.getStateService().params;
        this.workStatisticsService.QInfo.questionId = questionId;
        this.workStatisticsService.QInfo.paperId = this.selectPaper.id;
        this.getStateService().go('q_feedback');
    }


    mapStateToThis(state) {
        return {
            selectPaper: state.wr_selected_paper,
            selectKnowledge:state.wr_selected_knowledge
        }
    }

    mapActionToThis() {
        return {
        }
    }
}
export default WorkFilterSmallQCtrl;