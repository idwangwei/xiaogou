/**
 * Author ww on 2016/12/1.
 * @description 错题集controller
 */

import {Inject, View, Directive, select} from '../../module';
import _each from 'lodash.foreach';
import _indexOf from 'lodash.indexof';
@View('eqc_redo_paper', {
    url: '/eqc_redo_paper/:urlFrom/:selectPaperId',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:['$scope'
        , '$state'
        , '$rootScope'
        , '$ionicScrollDelegate'
        , 'workListService'
        , '$ngRedux'
        , 'commonService'
        , '$ionicLoading'
        , 'workManageService'
        , 'ngLocalStore'
        , '$ionicPopup'
        , '$timeout'
    ]
})

export default class EqcRedoPaperCtrl{
    commonService;
    $ionicScrollDelegate;
    workListService;
    $ionicLoading;
    workManageService;
    ngLocalStore;
    $ionicPopup;
    $timeout;

    initCtrl;

    @select(state=>state.wl_selected_clazz) selectedClazz;
    @select(state=>state.eq_selected_redo_paper[state.wl_selected_clazz.id]) selectedRedoPaper;
    @select((state)=>{return state.eq_selected_chapter[state.wl_selected_clazz.id]}) selectedChapter;
    @select((state)=> {
        let chapter = state.eq_selected_chapter[state.wl_selected_clazz.id];
        return state.eq_redo_creating_paper[state.wl_selected_clazz.id + "/" + (chapter && chapter.id)]
    }) creatingRedoPaperQsList;


    screenWidth = window.innerWidth;
    isIos = this.commonService.judgeSYS() == 2;
    urlFrom = this.getStateService().params.urlFrom;
    selectPaperId = this.getStateService().params.selectPaperId;
    paper = null;
    paperName = null;
    retFlag = this.urlFrom != 'paper';

    constructor(){
        
        
    }
    back() {this.getStateService().go('error_question_c');}
    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl && this.urlFrom == 'paper')
            .then(()=> {
                this.initCtrl = true;
                //向服务器获取试卷,失败则使用本地试卷
                this.workListService.fetchRedoPaper(this.selectPaperId).then((data)=>{
                    this.paper = data;
                    this.retFlag = true;
                },()=>{
                    getPaperDataFromLocal.call(this).then(()=>{
                        this.retFlag = true;
                    });
                });
            });

        function getPaperDataFromLocal() {
            return this.ngLocalStore.paperStore.keys().then((keys)=>{
                let key = this.getRootScope().user.loginName+'/'+this.selectPaperId; //key
                let temp = this.ngLocalStore.getTempPaper(); //
                let index = _indexOf(keys,key);
                console.log('获取本地试卷内容开始');
                if(temp.id == key){
                    this.getScope().$apply(()=>{
                        this.paper = temp.data;
                    });
                }
                else if(index != -1){
                    let defer = this.$q.defer();
                    this.ngLocalStore.paperStore.getItem(key).then((paperData)=>{
                        this.getScope().$apply(()=>{
                            this.paper = paperData;
                            //设置试卷内容为tempPaper的值
                            this.workChapterPaperService.savePaperDataToLocal(this.paper,true);
                            console.log('获取本地试卷内容结束');
                            defer.resolve();
                        });
                    });
                    return defer.promise;
                }
            });
        }
    }
    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        _each(this.workListService.eqcRedoPaperRequestList,(cancelDefer)=>{
            cancelDefer.resolve(true);
        });
        this.workListService.eqcRedoPaperRequestList.length = 0;//清空请求列表
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
    showKnowledgeAndDifficulty(smallQ){
        let str1 = smallQ.knowledgeName.replace(/^[a-z]\d+\./i,'');
        let str2 = smallQ.difficulty < 40 ? '基础' : smallQ.difficulty > 70 ? '拓展' : '变式'; //难度
        return str1 + ' - ' + str2;
    }
    showKnowledgeAndDifficultyPaper(smallQ){
        let str1 = smallQ.knowledge[0].content.replace(/^[a-z]\d+\./i,'');
        let str2 = smallQ.difficulty < 40 ? '基础' : smallQ.difficulty > 70 ? '拓展' : '变式'; //难度
        return str1 + ' - ' + str2;
    }

    /**
     * 移除小题到组卷重练
     * @param questionId
     */
    removeQuestion(questionId){
        let key = this.selectedClazz.id + '/' +this.selectedChapter.id;

        //从该单元正在组卷的试卷中移除
        this.workListService.removeQuestionOfRedoPaper(key,{questionId:questionId});
        this.$ionicLoading.show({
            template: '<p style="color: #ffc125">【-】 已从组卷重练移除</p>',
            duration: 1500
        });
    }


    getBigQText(bigQ){
        return this.commonService.convertToChinese(+bigQ.seqNum + 1) + '、' + bigQ.title
    }

    /**
     * 布置作业
     */
    workPub() {
        //保存当前试卷，并进入到布置
        if(this.urlFrom == 'paper'){
            goWorkPub.call(this);
        }else {
            this.savePaper(goWorkPub.bind(this))
        }


        function goWorkPub() {
            this.workManageService.backupWork.id= this.paper.basic.id;
            this.workManageService.backupWork.name= this.paper.basic.title;
            this.workManageService.libWork.name=this.paper.basic.title;
            this.workManageService.libWork.type=this.paper.basic.type;
            this.go("work_pub3", {from: 'eqc_redo_paper'});
        }
    };

    /**
     * 打印试卷
     */
    paperPrint() {
        this.commonService.print();
    }

    /**
     * 点击保存，创建一张重练试卷
     */
    savePaper(callback){
        //该单元下还没有题目加入要创建的重练试卷中
        if(!this.creatingRedoPaperQsList || !this.creatingRedoPaperQsList.length){
            this.$ionicPopup.alert({
                title:'温馨提示',
                template:'<p>请选择课时中错题，加入组卷</p>'
            })
        }
        //创建重练试卷
        else {
            let date = new Date();
            this.paperName = this.selectedChapter.text+(+date.getMonth()+1)+'-'+date.getDate()+'_'+date.toString().match(/\d+:\d+:\d+/); //一认识更大的数12-9_17:35:29
            this.$ionicPopup.show({
                title: '组卷重练',
                scope: this.getScope(),
                template: '请给试卷命名：<input type="text" ng-model="ctrl.paperName">',
                buttons: [
                    {
                        text: '<b>确定</b>',
                        onTap: clickSure.bind(this,callback)
                    },
                    { text: '取消' }
                ]
            });
        }

        //点击确认处理
        function clickSure(callback) {
            let param = {
                paperName:'',
                classId:this.selectedClazz.id,
                questionIdList:[],
                type:7,
                tagId:this.selectedChapter.id
            };
            let questionIdList = [];
            //试卷名字为空
            if (!this.paperName || !this.paperName.trim()) {
                return
            }
            _each(this.creatingRedoPaperQsList,(v)=>{
                questionIdList.push({questionId:v.questionId,score:v.score})
            });
            param.paperName = this.paperName;
            param.questionIdList = JSON.stringify(questionIdList);

            this.$ionicLoading.show({
                template: '<p>正在创建重练试卷...</p>',
            });
            this.workListService.createRedoPaper(this.selectedClazz.id + '/' + this.selectedChapter.id, param).then((res)=>{
                if(res){
                    this.$ionicLoading.show({
                        template: '<p style="color: #afff33">创建重练试卷成功</p>',
                        duration: 1500
                    });

                    this.$timeout(()=>{
                        if(callback){
                            this.paper = {basic:res.paper};
                            callback.call(this);
                            return;
                        }
                        this.getStateService().go('error_question_c',{urlFrom:'eqc_redo_paper'});
                    },1500);
                }else {
                    this.$ionicLoading.show({
                        template: '<p style="color: #ffc125">创建重练试卷失败</p>',
                        duration: 1500
                    });
                }
            },()=>{
                this.$ionicLoading.show({
                    template: '<p style="color: #ffc125">创建重练试卷失败</p>',
                    duration: 1500
                });
            });
        }
    }
}