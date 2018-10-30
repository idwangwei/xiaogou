/**
 * Author ww on 2016/12/1.
 * @description 错题集controller
 */

import {Inject, View, Directive, select} from '../../module';
import modalStr from './chapter_modal.html';
import _each from 'lodash.foreach';

@View('error_question_c', {
    url: '/error_question_c/:urlFrom',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:['$scope'
        , '$state'
        , '$rootScope'
        , '$ionicScrollDelegate'
        , '$ngRedux'
        , '$ionicSideMenuDelegate'
        , '$ionicModal'
        , '$timeout'
        , '$ionicLoading'
        , 'workListService'
        , 'workPaperBankService'
        , 'commonService'
        , 'subHeaderService'
    ]
})
export default class ErrorQuestionCollectionCtrl{
    $ionicModal;
    $timeout;
    commonService;
    $ionicScrollDelegate;
    $ionicSideMenuDelegate;
    workListService;
    workPaperBankService;
    $ionicLoading;
    subHeaderService;
    chapterSelectModal;
    initCtrl;

    @select(state=>state.clazz_list) clazzList;
    @select(state=>state.wl_selected_clazz) selectedClazz;
    @select(state=>state.wr_textbooks) textbooks;
    // @select(state=>state.wr_selected_textbook) textbook;
    @select((state)=>{return state.wr_selected_textbook[state.wl_selected_clazz.id]}) textbook;

    @select((state)=>{return state.eq_selected_chapter[state.wl_selected_clazz.id]}) selectedChapter;
    @select((state)=> {
        let chapter = state.eq_selected_chapter[state.wl_selected_clazz.id];
        return state.eq_redo_creating_paper[state.wl_selected_clazz.id + "/" + (chapter && chapter.id)]
    }) creatingPaperQuestionList;
    @select((state)=> {
        let chapter = state.eq_selected_chapter[state.wl_selected_clazz.id];
        return state.eq_data_with_clazz[state.wl_selected_clazz.id + "/" + (chapter && chapter.id)]
    }) errorQuestionInfoItems;
    @select((state)=> {
        let chapter = state.eq_selected_chapter[state.wl_selected_clazz.id];
        return state.eq_paper_with_clazz[state.wl_selected_clazz.id + "/" + (chapter && chapter.id)]
    }) minePaperList;

    screenWidth = window.innerWidth;
    isIos = this.commonService.judgeSYS() == 2;
    size = 10;
    lastKey = null;
    canLoadMore = true;
    initErrorInfo = true;
    initPaperList = true;
    initErrorInfoMsg = '';
    isFetchTextbookProcessing = false;
    lastSortOut = {}; //各个班级的各单元错题总览整理时间
    initErrorInfoFail = false;
    currentChooseTextbook = {id:""};
    constructor(){
        this.initChapterSelectModal();
        this.subHeaderService.clearAll();
        
        
    }
    // back() {this.getStateService().go('home.work_list', {category: 2, workType: 2});}
    back() {this.getStateService().go('pub_work_type')}
    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> {
                this.initCtrl = true;
                this.initPageData();
            });
    }
    onBeforeLeaveView() {
        this.$ionicSideMenuDelegate.toggleLeft(false);
        // _each(this.$ionicSideMenuDelegate._instances,instance=>instance.close());

        //离开当前页面时，cancel由所有当前页发起的请求
        _each(this.workListService.eqcRequestList,(cancelDefer)=>{
            cancelDefer.resolve(true);
        });
        this.workListService.eqcRequestList.length = 0;//清空请求列表
    }
    onBeforeEnterView(){
        if(this.initCtrl && this.getStateService().params.urlFrom == 'eqc_redo_paper'){
            this.getMainPaperList();
        }
        if(this.initCtrl && this.getStateService().params.urlFrom == 'work_list' && this.selectedClazz.id){
            this.isFetchTextbookProcessing = true;
            this.workPaperBankService.getTextbookList(()=>{
                this.isFetchTextbookProcessing = false;
                this.workPaperBankService.selectTextbook();
                this.currentChooseTextbook.id = this.textbook.id;

            });
        }
    }
    onAfterEnterView(){
        if(this.getStateService().params.urlFrom == 'eqc_redo_paper'||this.getStateService().params.urlFrom == 'work_pub'){
            this.$timeout(()=>{
                $('#eqc_mine').click();
            },0);
        }
    }
    initPageData(){
        if(!this.selectedClazz || !this.selectedClazz.id){return}

        this.isFetchTextbookProcessing = true;
        this.workPaperBankService.getTextbookList((isSuccess)=> {
            this.isFetchTextbookProcessing = false;
            this.workPaperBankService.selectTextbook();
            this.getErrorInfoWithChapter();
            this.getMainPaperList();
            this.currentChooseTextbook.id = this.textbook.id;
        });
    }
    openClazzSelect(){
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    /**
     * 选择班级
     * @param clazz
     */
    selectClazz(clazz){
        //选择的班级没有变化
        if(clazz && clazz.id == this.selectedClazz.id){
            // this.clazzSelectModal.hide();
            this.$ionicSideMenuDelegate.toggleLeft(false);
            return
        }

        //保存选择的班级到store中
        this.workListService.changeAndSaveSelectedClazz(clazz);
        this.$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
        //用户切换班级
        if (clazz) {
            this.$ionicSideMenuDelegate.toggleLeft(false);
            this.$timeout(()=>{
                this.initPageData();
            },400);
        }
    }

    /**
     * 单元选择modal
     */
    initChapterSelectModal(){
        this.chapterSelectModal = this.$ionicModal.fromTemplate(modalStr, {
            scope:this.getScope()
        });
        this.getScope().$on('$destroy',()=>{this.chapterSelectModal.remove();})
    }
    openChapterSelect(){
        this.chapterSelectModal.show();
    }
    closeChapterSelect(){
        this.chapterSelectModal.hide();
    }
    clickChapter(event,chapter){
        if(event){event.stopPropagation()}
        this.chapterSelectModal.hide();
        this.workListService.selectErrorQuestionChapter(chapter);
        this.getErrorInfoWithChapter();
        this.getMainPaperList();
    }


    /**
     * 获取选定班级选定单元的错题总览信息
     */
    getErrorInfoWithChapter(){
        if(!this.selectedChapter || !this.selectedClazz.id){return}

        let key = this.selectedClazz.id+'/'+this.selectedChapter.id;
        let param = {
            chapterId:this.selectedChapter.id,
            classId:this.selectedClazz.id,
        };
        //如果30S前才整理过错题总览，则不整理
        if(new Date().valueOf() - this.lastSortOut[key] < 30*1000){param.type = 1}
        //向服务器获取错题概述
        this.initErrorInfo = false;
        this.initErrorInfoFail = false;
        return this.workListService.getErrorQuestionInfo(param, key).then((res)=>{
            this.initErrorInfo = true;
            if(res.res){this.lastSortOut[key] = new Date().valueOf()}
            else {
                this.initErrorInfoFail = true;
                this.initErrorInfoMsg = res.msg;
            }
        },()=>{
            this.initErrorInfo = true;
            this.initErrorInfoFail = true;
        })
    }
    getMainPaperList(){
        if(!this.selectedChapter || !this.selectedClazz.id){
            return
        }

        //向服务器获取错题试卷列表
        let param = {
            chapterId:this.selectedChapter.id,
            classId:this.selectedClazz.id,
            size:this.size,
            type:7,
        };
        this.initPaperList = false;
        this.workListService.getErrorRedoPaperList(param, this.selectedClazz.id+'/'+this.selectedChapter.id).then((res)=>{
            if(res){
                this.lastKey = res.lastKey;
                this.canLoadMore = res.papers.length >= this.size;
            }
            this.initPaperList = true;
        },()=>{this.initPaperList = true;});
    }
    showMainPaperDetail(paper){
        this.workListService.selectRedoPaper(paper);
        this.workListService.eqcCurrentClickPaper = paper.id;
        this.getStateService().go('eqc_redo_paper',{urlFrom:'paper',selectPaperId:paper.id});
    }


    /**
     * 显示重练试卷中加入的小题信息
     */
    showPaperQuestion(){
        this.getStateService().go('eqc_redo_paper',{urlFrom:'question'});
    }

    /**
     * 显示该单元下所有的错题内容
     * @param item
     */
    goAndShowQuestion(item){
        if(item){
            this.workListService.eqcCurrentClickTag = item.id;
            this.getStateService().go('eqc_detail',{unitId:item.id});
            return
        }
        //如果是查看单元汇总的错题列表，传入chapter:2作为查询单元错题列表接口的参数type值
        this.getStateService().go('eqc_detail',{unitId:this.selectedChapter.id,chapter:2})
    }

    /**
     * 删除重练试卷
     * @param paperId
     */
    deleteMinePaper(paperId){
        this.commonService.showConfirm('温馨提示','确认删除该重练试卷？').then((res)=>{
            if(!res){return}
            this.$ionicLoading.show({template:'试卷删除中...'});
            this.workListService.deletePaper(paperId, this.selectedClazz.id+'/'+this.selectedChapter.id).then((data)=>{
                if(data.code == 200){
                    this.$timeout(()=>{
                        this.$ionicLoading.show({template:'<p style="color: #afff33">试卷删除成功</p>',duration: 1500});
                    },500);
                }
                else{
                    this.$timeout(()=>{
                        this.$ionicLoading.show({template:'<p style="color: #FF5F3A">试卷删除失败</p>',duration: 1500});
                    },500);
                }
            },()=>{
                this.$timeout(()=>{
                    this.$ionicLoading.show({template:'<p style="color: #FF5F3A">试卷删除失败</p>',duration: 1500});
                },500);
            })
        });
    }

    loadMore(){
        let param = {
            chapterId:this.selectedChapter.id,
            classId:this.selectedClazz.id,
            size:this.size,
            type:7,
            lastKey:this.lastKey
        };
        this.workListService.getErrorRedoPaperList(param, this.selectedClazz.id+'/'+this.selectedChapter.id, true).then((res)=>{
            if(res){
                this.getScope().$broadcast('scroll.infiniteScrollComplete');
                this.lastKey = res.lastKey;
                this.canLoadMore = res.papers.length >= this.size;
            }
        },()=>{
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        });
    }

    showLoadingIcon(subHeaderInfo){
        let result = (subHeaderInfo.activeEle == 'eqc_overview' && !this.errorQuestionInfoItems && !this.initErrorInfo)
            || (subHeaderInfo.activeEle == 'eqc_mine' && !this.minePaperList && !this.initPaperList);
        console.warn('ng-if:',result);

        return result
    }

    clickTextbook(textbookItem){
        this.$ionicScrollDelegate.$getByHandle('textbookModal').scrollTop(false);
        if(textbookItem.id != this.currentChooseTextbook.id){
            this.currentChooseTextbook.id = textbookItem.id;
            if(textbookItem.id != this.textbook.id){
                this.workPaperBankService.selectTextbook(textbookItem);
            }
        }else {
            this.currentChooseTextbook.id = "";
        }
    }
}