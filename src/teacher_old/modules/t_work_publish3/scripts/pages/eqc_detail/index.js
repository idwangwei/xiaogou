/**
 * Author ww on 2016/12/1.
 * @description 错题集controller
 */

import {Inject, View, Directive, select} from '../../module';
import _find from 'lodash.find';
import _assign from 'lodash.assign';
@View('eqc_detail', {
    url: '/eqc_detail/:unitId/:chapter',
    cache:true,
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:['$scope'
        , '$state'
        , '$rootScope'
        , '$ionicScrollDelegate'
        , '$ngRedux'
        , 'workListService'
        , 'commonService'
    ]
})

export default class EqcDetailCtrl {
    commonService;
    $ionicScrollDelegate;
    workListService;

    initCtrl;
    lastKey = 0;
    pageNum = 1;
    quantity = 8;
    value = '0';
    canLoadMore = false;

    @select(state=>state.wl_selected_clazz) selectedClazz;
    @select((state)=> {
        return state.eq_selected_chapter[state.wl_selected_clazz.id]
    }) selectedChapter;
    @select((state)=> {
        let chapter = state.eq_selected_chapter[state.wl_selected_clazz.id];
        return state.eq_redo_creating_paper[state.wl_selected_clazz.id + "/" + (chapter && chapter.id)]
    }) creatingPaperQuestionList;

    screenWidth = window.innerWidth;
    isIos = this.commonService.judgeSYS() == 2;
    currentUnit = {};
    serverData = {
        eqcSortL:{},
        eqcSortM:{},
        eqcSortR:{}
    };
    retFlag = false; //初始化数据时，获取数据完毕flag
    getDataError = false; //初始化数据时，获取数据失败flag
    sortCondition = {
        currentRule:'eqcSortL'
    };
    isShowSortRule = false; //显示排序条件框
    isFlyBox = false;
    currentClickErrorQuestionId = "";
    isLoadingProcessing = false;
    constructor() {
        
        
    }

    back() {
        this.getStateService().go('error_question_c');
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
            .then(()=> {
                //获取班级在该单元的错题集合
                let key = this.sortCondition.currentRule == 'eqcSortL' ?
                    '1' : (this.sortCondition.currentRule == 'eqcSortM' ? '2' : '0');

                //赋值当前查看章节的单元信息
                let type = this.getStateService().params.chapter;
                if(type){
                    this.currentUnit = this.selectedChapter;
                }else {
                    this.currentUnit = _find(this.selectedChapter.subTags, {id: this.getStateService().params.unitId});
                }
                this.isLoadingProcessing = true;
                this.workListService.getErrorQuestionDetail({
                    unitId: this.getStateService().params.unitId,
                    classId: this.selectedClazz.id,
                    quantity: this.quantity,
                    keyValue: JSON.stringify({key:key,value:this.value}),
                    pageNum:this.pageNum,
                    type: type || 1
                }).then((res)=> {
                    if(res.code == 200){
                        console.log('res',res);
                        this.serverData[this.sortCondition.currentRule] = res;
                        this.canLoadMore = res.qsTitles.length >= this.quantity;
                    }
                    else {
                        this.getDataError = res.msg;
                    }

                    this.isLoadingProcessing = false;
                    this.retFlag = true;
                }, ()=> {
                    this.retFlag = true;
                    this.getDataError = true;
                    this.canLoadMore = true;
                    this.isLoadingProcessing = false;
                })
            })
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        if(this.workListService.eqcDetailRequest){this.workListService.eqcDetailRequest.resolve()}
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
     * 获取小题的知识点和难度
     * @param smallQ
     * @returns {string}
     */
    showKnowledgeAndDifficulty(smallQ) {
        let str1 = smallQ.knowledgeName.replace(/^[a-z]\d+\./i, '');
        let str2 = smallQ.difficulty < 40 ? '基础' : smallQ.difficulty > 70 ? '拓展' : '变式'; //难度
        return str1 + ' - ' + str2;
    }

    /**
     * 添加|移除小题到组卷重练
     * @param question
     */
    clickSmallQTitle(question) {
        let key = this.selectedClazz.id + '/' + this.selectedChapter.id;

        //加入该单元正在组卷的试卷中
        if (question.isChecked) {
            this.workListService.addQuestionToRedoPaper(key, {
                questionId: question.id,
                score: 10,
                question: question.question,
                knowledgeName: question.knowledgeName,
                difficulty: question.difficulty,
                inputList:question.inputList
            });
            this.isFlyBox = true;
            this.currentClickErrorQuestionId = question.id;
        }

        //从组卷重练中移除该小题
        else {
            //从该单元正在组卷的试卷中移除
            this.workListService.removeQuestionOfRedoPaper(key, {questionId: question.id});
        }
    }

    loadMore(){
        let key = this.sortCondition.currentRule == 'eqcSortL' ?
            '1' : (this.sortCondition.currentRule == 'eqcSortM' ? '2' : '0');
        let type = this.getStateService().params.chapter;
        this.workListService.getErrorQuestionDetail({
            unitId: this.getStateService().params.unitId,
            classId: this.selectedClazz.id,
            quantity: this.quantity,
            keyValue: JSON.stringify({key:key,value:this.value}),
            pageNum:++this.pageNum,
            type:type || 1
        }).then((res)=> {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');

            if(res.code==200){
                this.serverData[this.sortCondition.currentRule].qsTitles = this.serverData[this.sortCondition.currentRule].qsTitles.concat(res.qsTitles);
                this.serverData[this.sortCondition.currentRule].similar = _assign(this.serverData[this.sortCondition.currentRule].similar,res.similar);
                this.canLoadMore = res.qsTitles.length >= this.quantity;
            }else {
                this.canLoadMore = false;
            }
        }, ()=> {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        })
    }

    /**
     * 显示该错题的学生列表
     * @param questionId
     */
    showErrorStudentList(questionId) {
        this.getStateService().go('eqc_student_list', {questionId: questionId})
    }

    /**
     * 显示重练试卷中加入的小题信息
     */
    showPaperQuestion(){
        this.getStateService().go('eqc_redo_paper',{urlFrom:'question'});
    }

    /**
     * 点击筛选条件tab,重新获取错题信息
     */
    changeSortRule(sortStr){
        this.sortCondition.currentRule = sortStr;

        //如果该排序条件已经有数据，不再向服务器获取
        this.$ionicScrollDelegate.scrollTop(false);
        this.getDataError = false;
        if(this.serverData[this.sortCondition.currentRule].qsTitles){
            return
        }
        this.canLoadMore = false;
        //获取班级在该单元的错题集合
        let key = this.sortCondition.currentRule == 'eqcSortL' ? '1' : (this.sortCondition.currentRule == 'eqcSortM' ? '2' : '0');
        let type = this.getStateService().params.chapter;
        this.retFlag = false;
        this.getDataError = null;
        this.isLoadingProcessing = true;
        this.workListService.getErrorQuestionDetail({
            unitId: this.getStateService().params.unitId,
            classId: this.selectedClazz.id,
            quantity: this.quantity,
            keyValue: JSON.stringify({key:key,value:this.value}),
            pageNum: 1,
            type:type || 1
        }).then((res)=> {
            if(res.code == 200){
                this.serverData[this.sortCondition.currentRule] = res;
                this.canLoadMore = res.qsTitles.length >= this.quantity;
            }
            else {
                this.getDataError = res.msg;
            }
            this.retFlag = true;
            this.isLoadingProcessing = false;
        }, ()=> {
            this.retFlag = true;
            this.getDataError = true;
            this.canLoadMore = true;
            this.isLoadingProcessing = false;

        })
    }
}