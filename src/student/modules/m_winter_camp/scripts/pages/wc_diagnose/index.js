/**
 * Created by qiyuexi on 2018/1/11.
 */
import {Inject, View, Directive, select} from '../../module';
@View('wc_diagnose_do_question', {
    url: '/wc_diagnose_do_question/:urlFrom/:pointName/:pointIndex/:backWorkReportUrl',
    template: require('./page.html'),
    styles: require('./style.less'),
    controllerAs:"doQCtrl",
    inject:[
        '$scope',
        '$rootScope'
        , '$state'
        , '$stateParams'
        , '$ionicScrollDelegate'
        , 'commonService'
        , 'profileService'
        , '$interval'
        , '$ngRedux'
        //, 'pageRefreshManager'
        , '$ionicPopup'
        , '$ionicTabsDelegate'
        , '$timeout'
        , '$ionicSideMenuDelegate'
        , '$ionicSlideBoxDelegate'
        , 'subHeaderService'
        , 'dateUtil'
        , 'diagnoseService'
        , 'workStatisticsServices'
        , 'tabItemService'
    ]
})
class DiagnoseDoQuestion02Ctrl{
    constructor(){
        this.pointName=this.getStateService().params.pointName;
        this.backWorkReportUrl=this.getStateService().params.backWorkReportUrl;
        this.configKeyboardOnMobile(); //调整在键盘在手机上的位置
        this.$timeout(()=> {
            this.$ionicSlideBoxDelegate.enableSlide(false); //静止左右滑动slide页面
        }, 500);
        this.initFlags();
        this.initData();
    }

    initFlags(){
        this.questionDataInitlized = false; //ctrl初始化后，是否已经加载过一次试题
        this.showDraft=true;
        this.isVertical=false;
        this.showDiaglog=true;
        this.noQuestionTip=true;
        this.firstBloodFull = false; //初始化页面时第一颗心是否点亮
        this.secondBloodFull = false; //初始化页面时第二颗心是否点亮
        this.thirdBloodFull = false; //初始化页面时第三颗心是否点亮(掌握之后还可以做题)
        this.enterPageHasErrorQuestionNum = 0;
    }

    initData(){
        this.isIos=this.getRootScope().platform.IS_IPHONE||this.getRootScope().platform.IS_IPAD||this.getRootScope().platform.IS_MAC_OS;
        this.loadingNewQText='获取试题中';
        this.submitText='正在提交';
        this.smallQ={
            qContext:null
        };
        this.slideBoxDataList=[1,2,3,4];
        this.solidBoxInfo = {
            currentIndex: 0
        };
        this.showRightAnimateFlag=false;
        this.showWrongAnimateFlag=false;
        this.showWordAnimateFlag=false;
        //this.getRightAnimate();
        this.workStr = '还不够牢固';
        this.isFromFinalSprint=this.getStateService().params.backWorkReportUrl==='wc_train';
        /* this.$ionicSlideBoxDelegate.enableSlide(false);*/
    }

    getRightAnimate(){
        if(this.masterCode===4){
            /*$('.balloons-wrap').css({'display':'block'});
             $('.balloons').each((index,item)=>{
             $(item).css({'left': Math.random()*90+'%'});
             $(item).delay(index*30).animate({
             bottom: window.innerHeight+200+"px"
             },3000,'linear',null);
             });*/
            this.showMasterActFlag=true;
            return;
        }
        this.showRightAnimateFlag=true;
        this.$timeout(()=>{
            this.showSecondImgFlag=true;
        },1000);
        this.$timeout(()=>{
            let targetEleOffset=$('#master-img-btn').offset(),
                sourceEleOffset=$('.test-wrap .second-img').offset(),
                targetHeight=$('#master-img-btn').height(),
                targetWidth=$('#master-img-btn').width();
            $('#second-img').css({  'visibility':'visible',"zIndex": 800,top:sourceEleOffset.top,left:sourceEleOffset.left});
            $('.test-wrap .second-img').css({'display':'none'});
            $('#second-img').animate({
                top:targetEleOffset.top+"px",
                left:targetEleOffset.left +"px",
                height:targetHeight+'px',
                width:targetWidth+'px'
            },1000,'swing',()=>{
                this.getScope().$apply(()=>{
                    this.showRightAnimateFlag=false;
                    /*$('.balloons-wrap').css({'display':'none'});
                     $('.balloons').each((index,item)=>{
                     $(item).css({'left': '-200px','bottom':'0'});
                     });*/
                });
            })
        },2000);
    }

    getWrongAnimate(){
        this.showWrongAnimateFlag=true;
        this.$timeout(()=>{
            this.showSecondImgFlag=true;
        },1000);

        this.$timeout(()=>{
            let targetEleOffset=$('#master-img-btn').offset(),
                sourceEleOffset=$('.test-wrap .second-img').offset(),
                targetHeight=$('#master-img-btn').height(),
                targetWidth=$('#master-img-btn').width();
            $('#second-img').css({  'visibility':'visible',"zIndex": 800,top:sourceEleOffset.top,left:sourceEleOffset.left});
            $('.test-wrap .second-img').css({'display':'none'});
            $('#second-img').animate({
                top:targetEleOffset.top+"px",
                left:targetEleOffset.left +"px",
                height:targetHeight+'px',
                width:targetWidth+'px'
            },1000,'swing',()=>{
                this.getScope().$apply(()=>{
                    this.showWrongAnimateFlag=false;
                });
            })
        },2000);
    }

    /**
     * @param isErrorQuestion 错题还没有改完，答对了显示'答对了！还未掌握'
     */
    getWordAnimate(isErrorQuestion){
        this.workStr = isErrorQuestion ? '还未掌握':'还不牢固';
        this.showWordAnimateFlag=true;
        this.$timeout(()=>{
            this.showWordAnimateFlag=false;
        },2500);
    }

    onReceiveProps(){
        this.ensurePageData();
    }

    ensurePageData(){
        if(this.chapterSelectPoint&&!this.questionDataInitlized){
            this.questionDataInitlized=true;
            this.fetchQuestionNew(this.questionInfo,(param)=>{
                this.firstBloodFull = param.error === 0 && param.new != 3;
                this.enterPageHasErrorQuestionNum = param.error;
                this.secondBloodFull = param.new < 2;
                this.thirdBloodFull = param.new == 0
            });
        }
    }

    onBeforeLeaveView() {
        this.showDiaglog=false;
        this.$interval.cancel(this.intervalInfo);
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseDoRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseDoRequestList.splice(0, this.diagnoseService.cancelDiagnoseDoRequestList.length);//清空请求列表
        if(this.intervalInfo)
            this.$interval.cancel(this.intervalInfo);
    }

    getCorrectQ(){
        this.questionInfo.hasNoSubmit=false;
        this.goToDoQuestion(this.suggestCode);
        this.fetchQuestion(this.unitSelectKnowledge,this.suggestCode);
    }

    showErrorRecords(){
        this.saveQReferAns();
        if(this.backWorkReportUrl){
            this.go('wc_error_records','forward',{backWorkReportUrl:this.backWorkReportUrl});
        }else{
            this.go('wc_error_records','forward');
        }
    }

    back(){
        if(this.draftShow){
            this.draftShow = false;
            this.getRootScope().$broadcast('draft.hide');
            // this.getScope().$digest();
            return;
        }

        if($('.keyboard')[0].hidden===false&&$('.keyboard')[0].style.display!='none'){
            this.getScope().$broadcast('keyboard.hide');
            return;
        }
        if (angular.element($('.diagnose-dialog-box').eq(0)).scope()
            && angular.element($('.diagnose-dialog-box').eq(0)).scope().showDiagnoseDialogFalg) {
            this.getScope().$emit('diagnose.dialog.hide');
            return;
        }

        if(this.masterCode===4) {//已掌握情况点击按钮
            this.getRootScope().$broadcast('draft.hide');
            this.resetKnowledgeQuestion(this.chapterSelectPoint);//清空一下试题内容
            /*期末冲刺新增*/
            if(this.backWorkReportUrl=="wc_train"){
                this.go("wc_train")
                return;
            }
            return;
        }
        let callback=()=>{
            let slideBoxDelegate=this.$ionicSlideBoxDelegate.$getByHandle('diagnose-do-quetison-slidebox');
            if(!this.isSubmitted&&this.questionInfo)
                this.saveQuestionLocal(this.questionInfo,this.chapterSelectPoint,slideBoxDelegate.currentIndex());
            this.getRootScope().$broadcast('draft.hide');
            /*期末冲刺新增*/
            this.go("wc_train")

        };
        this.getScope().$emit('diagnose.dialog.show',
            {
                'showType':'confirm',
                'comeFrom':'diagnose',
                'content':this.getRootScope().isIncreaseScore?'此考点还未掌握，确定要退出？':'此考点萌宠还未驯服，确定要退出？',
                'confirmCallBack':callback.bind(this)}
        );
    }

    /**
     * slideBox列表变化回调,根据最新slide页面的下标,判断是下一页还是上一页,保存当前slide页中的题目数据到paperData中,并更新slideBox中的题目数据
     * @param newIndex
     */
    slideChange(newIndex) {
        let slideBoxDelegate=this.$ionicSlideBoxDelegate.$getByHandle('diagnose-do-quetison-slidebox');
        this.solidBoxInfo.currentIndex = slideBoxDelegate.currentIndex();
    };


    showAnalysis(){
        this.showAnalysisFlag=!this.showAnalysisFlag;
        if(this.showAnalysisFlag&&this.questionInfo.analysisImgUrl){
            this.questionInfo.analysisImgUrl=this.commonService.replaceAnalysisImgAddress(this.questionInfo.analysisImgUrl);
        }
        this.timeCount = 0;
        if(!this.showAnalysisFlag){
            //this.isVertical=false;
            this.$interval.cancel(this.intervalInfo);
        }else{
            this.smallQ.qContext=angular.copy(this.questionInfo.question);
            this.referAnsHandle();
        }
    }

    goToShowReport(){
        this.saveQReferAns();
        let pointIndex=""
        if(this.chapterSelectPoint.pointIndex!==undefined){
            pointIndex=this.chapterSelectPoint.pointIndex + 1
        }
        this.go('wc_report', 'forward', {
            urlFrom: 'diagnose_do_question02',
            pointIndex: pointIndex,
            backWorkReportUrl: this.backWorkReportUrl
        })
    }

    saveQReferAns(){
        let slideBoxDelegate=this.$ionicSlideBoxDelegate.$getByHandle('diagnose-do-quetison-slidebox');
        if(!this.isSubmitted&&this.questionInfo)
            this.saveQuestionLocal(this.questionInfo,this.chapterSelectPoint,slideBoxDelegate.currentIndex());
        this.goToErrorQRecords(this.questionInfo,this.knowledgeStateKey);
        this.getScope().$root.$broadcast('draft.hide');
    }

    showMasterTip(){
        let formatTipText=()=>{
            switch (this.chapterSelectPoint.level){
                case 1:
                    return '小伙伴，我看好你哦！';
                case 2:
                    return '仔细一点，加油哦！';
                case 3:
                    return '我有点犹豫要不要被你领养...';
                case 4:
                    return '太赞了，主人求带走！';
            }
        };
        this.getScope().$emit('diagnose.dialog.show',
            {'comeFrom':'diagnose','content':formatTipText()}
        );
    }



    getReferAns(event){
        if(this.hasShowDiaglog) return;
        event.stopPropagation();
        if (this.timeCount > 0) {
            this.hasShowDiaglog=true;
            let callback=()=>{
                this.hasShowDiaglog=false;
            };
            this.getScope().$emit('diagnose.dialog.show',{'showType':'confirm','comeFrom':'diagnose','content': '同学，请先看下这个解答，才能再点击"学霸解答"哦。','confirmCallBack':callback});
            return;
        }
        if (this.intervalInfo)
            this.$interval.cancel(this.intervalInfo);
        this.timeCount = 5;
        this.intervalInfo = this.$interval(()=> {
            this.timeCount--;
        }, 1000);
        var param = {
            questionId: this.questionInfo.id
        };
        this.workStatisticsServices.getQReferAnswer(param, true).then((data) =>{
            if(!data.referAnswers||JSON.stringify(data.referAnswers) == "{}"){//这一次没有获取到学霸解答，需要判断特殊处理，根据上一次是否已经获取到了学霸解答处理。
                if(this.questionInfo.referAnswers&&angular.isObject(this.questionInfo.referAnswers)){
                    // if(JSON.stringify(this.questionInfo.referAnswers).indexOf('学霸解答')>-1)
                        this.getScope().$emit('diagnose.dialog.show', {'comeFrom':'diagnose','content':'同学，目前暂无学霸解答，无法展示详细的解题过程，请稍后再试。'});
                }
                return ;
            }
            this.questionInfo.referAnswers=data.referAnswers;
            this.referAnsHandle();
        });
    }

    referAnsHandle(){
        this.parsedInputList=null;
        this.showCorrectFlag=false;
        let analysisImgTop=$('.cheats-btn-wrap').offset().top;
        let analysisImgBottom=window.innerHeight- analysisImgTop;
        this.$timeout(()=> {
            try{
                this.showCorrectFlag = true;
                //TODO:竖式特殊处理
                if(this.questionInfo.referAnswers&&this.questionInfo.referAnswers.vertical){
                    this.isVertical=true;
                    this.parsedInputList=this.clearVerticalQAns(angular.copy(this.questionInfo.inputList));
                    return;
                }
                if(this.isVertical&&this.questionInfo.referAnswers){
                    this.parsedInputList=this.mapVerticalQAns(this.questionInfo.referAnswers,angular.copy(this.questionInfo.inputList));
                    return;
                }
                if(analysisImgBottom<window.innerHeight/2){
                    let currentPointTop=  this.$ionicScrollDelegate.getScrollPosition().top;
                    this.$ionicScrollDelegate.scrollBy(0, currentPointTop+window.innerHeight/2-100);
                }
            }catch (e){
                console.error('竖式改错参考答案有问题',e);
            }

        }, 100);
    }

    /**
     * 点击草稿按钮回调: 处理草稿板显示
     */
    handleDraft() {
        if ($('.draft_container').css('display') === 'none') {
            console.log('draft.show');
            this.getRootScope().$broadcast('draft.show');
            this.draftShow = true;
        }
        else {
            console.log('draft.hide');
            this.getRootScope().$broadcast('draft.hide');
            this.draftShow = false;
        }
    };

    mapVerticalQAns(referAns,inputList){
        let inputAns,inputBoxStuAns,matrixAnsArray;
        angular.forEach(inputList,(sp)=>{
            angular.forEach(sp.spList,(scorePoint)=>{
                try{
                    inputAns=referAns[scorePoint.inputBoxUuid];
                    if(inputAns.indexOf("id")===-1){
                        scorePoint.inputBoxStuAns=inputAns;
                    }else if(inputAns.indexOf("id")>-1){
                        matrixAnsArray=JSON.parse(inputAns);
                        //TODO：一个得分点映射多个矩阵的，目前还没有这种题型
                        angular.forEach(matrixAnsArray,function (matrix) {
                            if(matrix.id===scorePoint.inputBoxUuid)
                                scorePoint.matrix=matrix.matrix;
                        })

                    }
                }catch (e){
                    console.error('qbuBug',e);
                }

            });
        });
        return inputList;
    }

    clearVerticalQAns(inputList){
        let inputAns,inputBoxStuAns,matrixAnsArray;
        angular.forEach(inputList,(sp)=>{
            angular.forEach(sp.spList,(scorePoint)=>{
                if(scorePoint.hasOwnProperty('inputBoxStuAns')){
                    scorePoint.inputBoxStuAns="";
                }else if(scorePoint.hasOwnProperty('matrix')){
                    scorePoint.matrix=[{}];
                }
            });
        });
        return inputList;
    }


    submitCallBack(retValue){
        if(angular.isString(retValue)){//code:20002 msg:"该题已经提交过，请重新获取题"
            let callBack=()=>{
                this.getRootScope().$broadcast('draft.hide');
                this.resetKnowledgeQuestion(this.chapterSelectPoint);
                this.go("wc_train")

            };
            this.getScope().$emit('diagnose.dialog.show',
                {'comeFrom':'diagnose','content':retValue,'confirmCallBack':callBack}
            );
            return;
        }
        this.knowledgePointShowImg=retValue.knowledgePointShowImg;
        this.showNextQFlag = retValue.suggestCode===2&&retValue.master!=4; //在不是“掌握”状态下，需要获取新题

        if(retValue.master!=4){
            this.pointName=this.diagnoseService.pointNameFormat(this.chapterSelectPoint);
            this.pointName=this.pointName.replace(/NaN/g,"");
        }

        if(retValue.rightAnimateFlag===1){
            this.getRightAnimate();
        }
        else if(retValue.rightAnimateFlag===-1){
            retValue.suggestCode == 2 ? this.getWordAnimate(true): this.getWrongAnimate();
        }
        else{
            this.getWordAnimate();
        }

        //进度条动画
        this.bloodAnimation(retValue);
    }

    /**
     * 血条进度动画
     */
    bloodAnimation(submitResult){
        if(submitResult.suggestCode == 2){
            this.answerRightBloodUp();
        }else {
            this.answerWrongBloodDown();
        }
    }

    answerRightBloodUp(){
        let bloodWrapDom = $('.diagnose_do_question_file_02 .page_footer .blood-box-wrap');
        let bloodBoxDom = bloodWrapDom.children('.blood-box');

        //错题改错（第一颗心加一部分）加血方式
        if(this.enterPageHasErrorQuestionNum != 0 && this.questionInfo.errorQuestionNum > 0){
            let darkBloodDom = bloodBoxDom.eq(0).children('img:last-child');
            let imgWidth = darkBloodDom.width();
            let imgHeight = darkBloodDom.height();
            let percent = 1;
            if(this.questionInfo.errorQuestionNum == this.enterPageHasErrorQuestionNum){
                percent = 1- 1/this.enterPageHasErrorQuestionNum;
            }else if(this.questionInfo.errorQuestionNum == 1){
                percent = 0;
            }else{
                percent = this.questionInfo.errorQuestionNum / this.enterPageHasErrorQuestionNum;
            }

            darkBloodDom.css('clip', `rect(0,${imgWidth}px,${imgHeight * percent}px,0)`);
            return
        }

        //加满整颗心的加血方式
        for (let i = 0, len = bloodBoxDom.length; i < len; i++) {
            let darkBloodDom = bloodBoxDom.eq(i).children('img:last-child');
            let clipValue = darkBloodDom.css('clip');
            let imgWidth = darkBloodDom.width();
            let imgHeight = darkBloodDom.height();

            if (clipValue.match(/\d+/g)[2] > 0) {
                darkBloodDom.css('clip',`rect(0,${imgWidth}px,0,0)`);
                return
            }
        }
    }
    answerWrongBloodDown(){
        let bloodWrapDom = $('.diagnose_do_question_file_02 .page_footer .blood-box-wrap');
        let bloodBoxDom = bloodWrapDom.children('.blood-box');

        for (let i = 0, len = bloodBoxDom.length; i < len; i++) {
            let darkBloodDom = bloodBoxDom.eq(i).children('img:last-child');
            let clipValue = darkBloodDom.css('clip');
            let imgWidth = darkBloodDom.width();
            let imgHeight = darkBloodDom.height();
            if (clipValue.match(/\d+/g)[2] >= imgHeight) {
                return
            }
            darkBloodDom.css('clip',`rect(0,${imgWidth}px,${imgHeight}px,0)`);
        }
    }

    submitQ(){
        if(this.isLoadingProcessing||this.diagnose_submit_q_processing) return;
        this.getRootScope().$broadcast('keyboard.hide.change.question');
        $(document).trigger('click');//保存答案前，触犯一次点击事件，清除掉空分数。
        this.getRootScope().$broadcast('draft.hide');
        let slideBoxDelegate=this.$ionicSlideBoxDelegate.$getByHandle('diagnose-do-quetison-slidebox');

        if(!this.isSubmitted){//提交答案
            this.submitQuestion(this.questionInfo
                ,this.chapterSelectPoint
                ,slideBoxDelegate.currentIndex()
                ,this.submitCallBack.bind(this)
                ,this.getRootScope()
                ,this.getRootScope().isIncreaseScore
            );
            return;
        }

        if(this.masterCode===4){//已掌握情况点击按钮
            this.resetKnowledgeQuestion(this.chapterSelectPoint);//清空一下试题内容
            this.go("wc_train")
            return;
        }

        if(this.isSubmitted&&!this.showNextQFlag){//改错
            this.showAnalysisFlag=false;
            this.resetKnowledgeQuestion(this.chapterSelectPoint);
            this.fetchQuestionNew();
            this.$ionicScrollDelegate.scrollTop();
            return;
        }

        if(this.isSubmitted&&this.showNextQFlag){//下一题
            this.showAnalysisFlag=false;
            this.isVertical=false;
            this.isSubmitted=false;
            this.questionInfo=null;
            slideBoxDelegate.next();
            this.fetchQuestionNew();
            this.$ionicScrollDelegate.scrollTop();
            return;
        }



    }

    /**
     * 在手机上显示键盘时,键盘位置调整(键盘距离输入框底部60), 在super中被调用
     * */
    configKeyboardOnMobile() {
        let me = this;
        this.getScope().$on('keyboard.show', (ev, info)=> {
            me.$timeout(()=> {
                var $currentEle = $(info.ele);
                var keyboardTop = $('.keyboard').offset().top;
                var currentEleTop = $currentEle.offset().top;
                var offset = currentEleTop + $currentEle.height() - keyboardTop + 60;
                if (offset > 0)
                    me.$ionicScrollDelegate.scrollBy(0, offset);
            }, 50);
        });
    }

    masterActEndCallBack(){
        this.getScope().$apply(()=>{
            this.showMasterActFlag=false;
            this.showMasterRightAnimateFlag=true;
            this.showSecondImgFlag=true;
            this.$timeout(()=>{
                let targetEleOffset=$('#master-img-btn').offset(),
                    sourceEleOffset=$('.test-wrap .second-img').offset(),
                    targetHeight=$('#master-img-btn').height(),
                    targetWidth=$('#master-img-btn').width();
                $('#second-img').css({  'visibility':'visible',"zIndex": 800,top:sourceEleOffset.top,left:sourceEleOffset.left});
                $('.test-wrap .second-img').css({'display':'none'});
                $('#second-img').animate({
                    top:targetEleOffset.top+"px",
                    left:targetEleOffset.left +"px",
                    height:targetHeight+'px',
                    width:targetWidth+'px'
                },1000,'swing',()=>{
                    this.getScope().$apply(()=>{
                        this.showMasterRightAnimateFlag=false;
                    });
                })
            },1000);
        })
    }

    onAfterEnterView(){
        this.initData()
        this.initFlags()
        this.backWorkReportUrl=this.getStateService().params.backWorkReportUrl;
    }

    mapStateToThis(state){
        let chapterSelectPoint=state.chapter_select_point;
        if(!chapterSelectPoint.knowledgeId) return{};
        let questionInfo=state.knowledge_with_question[chapterSelectPoint.knowledgeId];
        if(questionInfo&&questionInfo.qsTitle)questionInfo.qsTitle.qContext=questionInfo.qsTitle.question;
        let isSubmitted=questionInfo?questionInfo.isSubmitted:false;
        let masterDegreeUrl=chapterSelectPoint.showImg, masterCode=chapterSelectPoint.level;
        return {
            chapterSelectPoint:chapterSelectPoint,
            questionInfo:questionInfo,
            isSubmitted:isSubmitted,
            masterDegreeUrl:masterDegreeUrl,
            masterCode:masterCode,
            gender:state.profile_user_auth&&state.profile_user_auth.user.gender,
            isLoadingProcessing:state.fetch_diagnose_question_processing,
            diagnose_submit_q_processing:state.diagnose_submit_q_processing
            /*knowledgeStateKey:knowledgeStateKey,
             goToDoQuestionType:state.go_to_do_question.type,
             goToDoQuestionTitle:state.go_to_do_question.title,

             noQuestionTip:stateKnowledge.noQuestionTip,
             suggestCode:suggestCode,
             questionInfo:questionInfo,
             isSubmitted:isSubmitted,
             isLoadingProcessing:state.fetch_diagnose_question_processing,
             diagnose_submit_q_processing:state.diagnose_submit_q_processing*/
        };
    }

    mapActionToThis(){
        let diagnoseService= this.diagnoseService;
        return {
            fetchQuestionNew:diagnoseService.fetchQuestionNew.bind(diagnoseService),
            submitQuestion:diagnoseService.submitQuestion.bind(diagnoseService),
            resetKnowledgeQuestion:diagnoseService.resetKnowledgeQuestion.bind(diagnoseService),

            goToDoQuestion:diagnoseService.goToDoQuestion.bind(diagnoseService),
            saveQuestionLocal:diagnoseService.saveQuestionLocal.bind(diagnoseService),
            clearKnowledgeQ:diagnoseService.clearKnowledgeQ.bind(diagnoseService),
            goToErrorQRecords:diagnoseService.goToErrorQRecords.bind(diagnoseService)

        }
    }
}

export default DiagnoseDoQuestion02Ctrl;