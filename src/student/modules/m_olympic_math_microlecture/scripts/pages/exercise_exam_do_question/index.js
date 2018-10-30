/**
 * Created by ZL on 2017/12/18.
 */
import $ from 'jquery';
import {Inject, View, Directive, select} from './../../module';

@View('exercise_exam_do_question', {
    url: '/exercise_exam_do_question',
    template: require('./page.html'),
    styles: require('./style.less'),
    controllerAs: 'doQCtrl',
    inject:[
        '$scope'
        , '$rootScope'
        , '$state'
        , '$stateParams'
        , '$ionicScrollDelegate'
        , 'commonService'
        , '$interval'
        , '$ngRedux'
        , '$ionicPopup'
        , '$ionicTabsDelegate'
        , '$timeout'
        , '$ionicSideMenuDelegate'
        , '$ionicSlideBoxDelegate'
        , 'subHeaderService'
        , 'dateUtil'
        , 'workStatisticsServices'
        , 'microlectureService'
        , 'microUnitService'
    ]
})

class exerciseExamDoQuestionCtrl {
    commonService;
    subHeaderService;
    workStatisticsServices;
    $ionicSlideBoxDelegate;
    $timeout;
    $interval;
    $ionicScrollDelegate;
    microlectureService;
    microUnitService;
    doneQuesCount = 1;
    isSubmitted = false;
    hasCorrect = false;
    @select(state=>state.tiny_class_ques_submit_processing) quesSubmitProcessing;
    @select(state=>state.fetch_exam_with_ques_processing) isLoadingProcessing;
    @select(state=>state.micro_select_example_item) examSelectPoint;
    @select((state)=> {
        let examSelectPoint = state.micro_select_example_item;
        if (!examSelectPoint.groupId) return {};
        let questionInfo = state.example_with_question[examSelectPoint.groupId];//根据例从本地拉取题目信息
        if (questionInfo && questionInfo.qsTitle) questionInfo.qsTitle.qContext = questionInfo.qsTitle.question;
        return questionInfo
    }) questionInfo;
    questionDataInitlized = false; //ctrl初始化后，是否已经加载过一次试题

    initFlags() {
        this.isVertical = false;
        this.showDiaglog = true;
        this.noQuestionTip = true;
    }

    initData() {
        this.pointName = this.getStateService().params.pointName;
        this.configKeyboardOnMobile(); //调整在键盘在手机上的位置
        this.isIos = this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
        this.loadingNewQText = '获取试题中';
        this.submitText = '正在提交';
        this.smallQ = {
            qContext: null
        };
        this.slideBoxDataList = [1, 2, 3, 4];
        this.solidBoxInfo = {
            currentIndex: 0
        };
        this.workStr = '还不够牢固';
        if (!this.examSelectPoint.groupId) this.examSelectPoint = {};
        this.doneQuesCount = this.examSelectPoint.rightQuestion;
        this.microlectureService.quesPointIndex = this.doneQuesCount;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        //examSelectPoint选择例，且还没加载过题目信息
        if (this.examSelectPoint && !this.questionDataInitlized && this.doneQuesCount < 5) {
            this.questionDataInitlized = true;
            if(this.doneQuesCount==4){
                this.isSubmitted = true;
            }else{
                this.isSubmitted = false;
            }
            this.microlectureService.fetchQuestionNew(this.questionInfo, 1, ()=> {
                this.hasCorrect = this.questionInfo.canCorrect;
            });
        }
    }

    onBeforeLeaveView() {
        this.showDiaglog = false;
        this.$interval.cancel(this.intervalInfo);
        if (this.intervalInfo)
            this.$interval.cancel(this.intervalInfo);
    }

    /**
     * 显示做题记录
     */
    showErrorRecords() {
        this.saveQReferAns();
        this.go('mirc_ques_records', 'forward');
    }

    back() {
        if (this.showDraft) {
            this.getRootScope().$broadcast('draft.hide');
            this.showDraft = false;
            return;
        }

        if (angular.element($('.diagnose-dialog-box').eq(0)).scope()
            && angular.element($('.diagnose-dialog-box').eq(0)).scope().showDiagnoseDialogFalg) {
            this.getScope().$emit('diagnose.dialog.hide');
            return;
        }
        if (this.doneQuesCount === 4) {//已掌握情况点击按钮
            this.getRootScope().$broadcast('draft.hide');
            this.microlectureService.resetExamQuestion(this.examSelectPoint);//清空一下试题内容
            this.go('micro_example_detail', 'back');
            return;
        }
        let callback = ()=> {
            if (!this.isSubmitted && this.questionInfo) { //做了题未提交，则需要保存答案到本地
                this.microlectureService.saveQuestionLocal(this.questionInfo, this.examSelectPoint);
            }
            this.getRootScope().$broadcast('draft.hide');
            this.go('micro_example_detail', 'back');

        };
        this.getScope().$emit('diagnose.dialog.show',
            {
                'showType': 'confirm',
                'comeFrom': 'mircorlecture',
                'content': '举一反三还没完成，确定要退出？',
                'title':'小提示',
                'confirmCallBack': callback.bind(this)
            }
        );
    }

    /**
     * 显示题目解析
     */
    showAnalysis() {
        this.showAnalysisFlag = !this.showAnalysisFlag;
        if (this.showAnalysisFlag && this.questionInfo.analysisImgUrl) {
            this.questionInfo.analysisImgUrl = this.commonService.replaceAnalysisImgAddress(this.questionInfo.analysisImgUrl);
        }
        this.timeCount = 0;
        if (!this.showAnalysisFlag) {
            this.$interval.cancel(this.intervalInfo);
        } else {
            this.smallQ.qContext = angular.copy(this.questionInfo.question);
            this.referAnsHandle();
        }
    }


    saveQReferAns() {
        if (!this.isSubmitted && this.questionInfo)
            this.microlectureService.saveQuestionLocal(this.questionInfo, this.examSelectPoint);
        this.getScope().$root.$broadcast('draft.hide');
    }

    getReferAns(event) {
        if (this.hasShowDiaglog) return;
        event.stopPropagation();
        if (this.timeCount > 0) {
            this.hasShowDiaglog = true;
            let callback = ()=> {
                this.hasShowDiaglog = false;
            };
            this.getScope().$emit('diagnose.dialog.show', {
                'showType': 'confirm',
                'comeFrom': 'mircorlecture',
                'content': '同学，请先看下这个解答，才能再点击"学霸解答"哦。',
                'title':'小提示',
                'confirmCallBack': callback
            });
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
        //匹配输入框和答案
        this.workStatisticsServices.getQReferAnswer(param, true).then((data) => {
            if (!data.referAnswers) {//这一次没有获取到学霸解答，需要判断特殊处理，根据上一次是否已经获取到了学霸解答处理。
                if (this.questionInfo.referAnswers && angular.isObject(this.questionInfo.referAnswers)) {
                    if (JSON.stringify(this.questionInfo.referAnswers).indexOf('学霸解答') > -1)
                        this.getScope().$emit('diagnose.dialog.show', {
                            'comeFrom': 'mircorlecture',
                            'title':'小提示',
                            'content': '同学，目前暂无学霸解答，无法展示详细的解题过程，请稍后再试。'
                        });
                }
                return;
            }
            this.questionInfo.referAnswers = data.referAnswers;
            this.referAnsHandle();
        });
    }

    referAnsHandle() {
        this.parsedInputList = null;
        this.showCorrectFlag = false;
        let analysisImgTop = $('.cheats-btn-wrap').offset().top;
        let analysisImgBottom = window.innerHeight - analysisImgTop;
        this.$timeout(()=> {
            try {
                this.showCorrectFlag = true;
                //TODO:竖式特殊处理
                if (this.questionInfo.referAnswers && this.questionInfo.referAnswers.vertical) {
                    this.isVertical = true;
                    this.parsedInputList = this.clearVerticalQAns(angular.copy(this.questionInfo.inputList));
                    return;
                }
                if (this.isVertical && this.questionInfo.referAnswers) {
                    this.parsedInputList = this.mapVerticalQAns(this.questionInfo.referAnswers, angular.copy(this.questionInfo.inputList));
                    return;
                }
                if (analysisImgBottom < window.innerHeight / 2) {
                    let currentPointTop = this.$ionicScrollDelegate.getScrollPosition().top;
                    this.$ionicScrollDelegate.scrollBy(0, currentPointTop + window.innerHeight / 2 - 100);
                }
            } catch (e) {
                console.error('竖式改错参考答案有问题', e);
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
            this.showDraft = true;
        }
        else {
            console.log('draft.hide');
            this.getRootScope().$broadcast('draft.hide');
            this.showDraft = false;
        }
    };

    mapVerticalQAns(referAns, inputList) {
        let inputAns, inputBoxStuAns, matrixAnsArray;
        angular.forEach(inputList, (sp)=> {
            angular.forEach(sp.spList, (scorePoint)=> {
                try {
                    inputAns = referAns[scorePoint.inputBoxUuid];
                    if (inputAns.indexOf("id") === -1) {
                        scorePoint.inputBoxStuAns = inputAns;
                    } else if (inputAns.indexOf("id") > -1) {
                        matrixAnsArray = JSON.parse(inputAns);
                        //TODO：一个得分点映射多个矩阵的，目前还没有这种题型
                        angular.forEach(matrixAnsArray, function (matrix) {
                            if (matrix.id === scorePoint.inputBoxUuid)
                                scorePoint.matrix = matrix.matrix;
                        })
                    }
                } catch (e) {
                    console.error('qbuBug', e);
                }
            });
        });
        return inputList;
    }

    clearVerticalQAns(inputList) {
        let inputAns, inputBoxStuAns, matrixAnsArray;
        angular.forEach(inputList, (sp)=> {
            angular.forEach(sp.spList, (scorePoint)=> {
                if (scorePoint.hasOwnProperty('inputBoxStuAns')) {
                    scorePoint.inputBoxStuAns = "";
                } else if (scorePoint.hasOwnProperty('matrix')) {
                    scorePoint.matrix = [{}];
                }
            });
        });
        return inputList;
    }

    /**
     * suggestCode === 2 正取
     * @param retValue
     */
    submitCallBack(retValue) {
        if (angular.isString(retValue)) {//code:20002 msg:"该题已经提交过，请重新获取题"
            let callBack = ()=> {
                this.getRootScope().$broadcast('draft.hide');
                this.microlectureService.resetExamQuestion(this.examSelectPoint);
                this.go('micro_example_detail', 'back');
            };
            this.getScope().$emit('diagnose.dialog.show',
                {'comeFrom': 'mircorlecture', 'content': retValue, 'title':'小提示','confirmCallBack': callBack}
            );
            return;
        }
        this.knowledgePointShowImg = retValue.knowledgePointShowImg;
        this.showNextQFlag = retValue.suggestCode === 2;//是否正确
        /*更新rightquestion*/
        if(this.showNextQFlag){
            let param=this.examSelectPoint;
            param.rightQuestion++;
            this.microUnitService.selectMicroExampleItem(param);//储存起来
        }
        console.log('suggestCode#################################:', retValue.suggestCode);
        this.isSubmitted = true;
        //进度条动画
        this.bloodAnimation(retValue);
    }

    /**
     * 进度动画
     */
    bloodAnimation(submitResult) {
        if (this.showNextQFlag) {//完成一道题加心
            this.doneQuesCount += 1;
            this.microlectureService.modifyExamRightQuestionNum(this.doneQuesCount);
            this.microlectureService.quesPointIndex = this.doneQuesCount;
        }
    }

    submitQ() {
        debugger;
        if (this.isLoadingProcessing || this.quesSubmitProcessing) return;
        this.getRootScope().$broadcast('keyboard.hide.change.question');
        $(document).trigger('click');//保存答案前，触犯一次点击事件，清除掉空分数。
        this.getRootScope().$broadcast('draft.hide');

        if (!this.isSubmitted&&!this.hasCorrect) {//提交答案
            this.microlectureService.submitQuestion(this.questionInfo
                , this.examSelectPoint
                , this.submitCallBack.bind(this)
                , this.getRootScope()
            );
            return;
        }

        if (this.doneQuesCount == 4) {//已掌握情况点击按钮
            this.microlectureService.resetExamQuestion(this.examSelectPoint);//清空一下试题内容
            this.go('mirco_all_ques_records', 'forward');
            return;
        }

        if (this.isSubmitted && !this.showNextQFlag || this.hasCorrect) {//改错
            this.showAnalysisFlag = false;
            this.isSubmitted = false;
            // this.microlectureService.resetExamQuestion(this.examSelectPoint);
            this.microlectureService.fetchQuestionNew(this.questionInfo, 2, ()=> {
                this.hasCorrect = false;
            });
            this.$ionicScrollDelegate.scrollTop();
            return;
        }

        if (this.isSubmitted && this.showNextQFlag) {//下一题
            this.showAnalysisFlag = false;
            this.isVertical = false;
            this.isSubmitted = false;
            this.questionInfo = null;
            this.microlectureService.fetchQuestionNew(this.questionInfo, 1, ()=> {
                this.hasCorrect = false;
            });
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

    onAfterEnterView() {
        this.initData();
        this.initFlags();
        if (this.questionDataInitlized&&this.isSubmitted) {
            this.microlectureService.fetchQuestionNew(this.questionInfo, 1, (param)=> {
                this.hasCorrect = this.questionInfo.canCorrect;
            });
        }
    }

    /**
     * 第一步例题显示思路导航弹框
     */
    showExamGuid() {
        this.showAnalysisFlag = true;
        $('.example-guid').addClass('example-guid-show');
    }

    /**
     * 第一步例题隐藏思路导航弹框
     */
    hideExamGuid() {
        $('.example-guid').removeClass('example-guid-show');
        $('.example-guid').addClass('example-guid-hide');
        this.$timeout(()=> {
            $('.example-guid').removeClass('example-guid-hide');
            this.showAnalysisFlag = false;
        }, 500);
    }
}
export default exerciseExamDoQuestionCtrl;