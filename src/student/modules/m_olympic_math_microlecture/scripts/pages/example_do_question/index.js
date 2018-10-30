/**
 * Created by ZL on 2017/11/29.
 */
import {Inject, View, Directive, select} from './../../module';

@View('example_do_question', {
    url: '/example_do_question',
    template: require('./page.html'),
    styles: require('./style.less'),
    controllerAs: 'doQCtrl',
    inject: [
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


class exampleDoQuestionCtrl {
    commonService;
    subHeaderService;
    workStatisticsServices;
    $ionicSlideBoxDelegate;
    $timeout;
    $interval;
    $ionicScrollDelegate;
    microlectureService;
    microUnitService;
    $ionicPopup;
    questionDataInitlized = false;
    hasCorrect = false;//显示改错
    hasDone = false;//已完成例题
    isFirst = true;
    @select(state=>state.tiny_class_ques_submit_processing) quesSubmitProcessing;
    @select(state=>state.fetch_exam_with_ques_processing) isLoadingProcessing;
    @select(state=>state.micro_select_example_item) examSelectPoint;
    @select((state)=> {
        let examSelectPoint = state.micro_select_example_item;
        if (!examSelectPoint.groupId) return {};
        let questionInfo = state.example_with_question[examSelectPoint.groupId];//根据例从本地拉取题目信息
        if (!questionInfo) return {};
        if (questionInfo && questionInfo.qsTitle)questionInfo.qsTitle.qContext = questionInfo.qsTitle.question;
        return questionInfo
    }) questionInfo;
    @select((state)=> {
        let examSelectPoint = state.micro_select_example_item;
        if (!examSelectPoint.groupId) return false;
        let questionInfo = state.example_with_question[examSelectPoint.groupId];//根据例从本地拉取题目信息
        if (!questionInfo) return false;
        return questionInfo.isSubmitted;
    }) isSubmitted;

    initFlags() {
        this.isVertical = false;
        this.showDiaglog = true;
    }

    initData() {
        this.hasCorrect = this.questionInfo.canCorrect && this.examSelectPoint.rightQuestion < 1;
        this.hasDone = this.examSelectPoint.rightQuestion > 0;
        this.isFirst = !this.hasCorrect;

        this.pointName = this.getStateService().params.pointName;
        this.configKeyboardOnMobile(); //调整在键盘在手机上的位置
        this.isIos = this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
        this.loadingNewQText = '获取试题中';
        this.submitText = '正在提交';
        this.smallQ = {
            qContext: null
        };
        if (!this.examSelectPoint.groupId) this.examSelectPoint = {};
        this.masterCode = this.examSelectPoint.level;
        this.isSubmitted = this.questionInfo ? this.questionInfo.isSubmitted : false;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        //examSelectPoint选择例，且还没加载过题目信息
        if (this.examSelectPoint && !this.questionDataInitlized) {
            this.questionDataInitlized = true;
            this.microlectureService.fetchQuestionNew(this.questionInfo, 1, (param)=> {
                this.hasCorrect = this.questionInfo.canCorrect && this.examSelectPoint.rightQuestion < 1;
                this.isFirst = !this.hasCorrect;
            });
        }
    }

    onBeforeLeaveView() {
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
        if (this.showAnalysisFlag) {
            this.hideExamGuid();
            return;
        }
        if (angular.element($('.diagnose-dialog-box').eq(0)).scope()
            && angular.element($('.diagnose-dialog-box').eq(0)).scope().showDiagnoseDialogFalg) {
            this.getScope().$emit('diagnose.dialog.hide');
            return;
        }
        if (this.showNextQFlag || this.examSelectPoint.rightQuestion > 0 || this.hasDone) {//已掌握情况点击按钮
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
        if(!this.isSubmitted&&!this.hasCorrect){
            this.getScope().$emit('diagnose.dialog.show',
                {
                    'showType': 'confirm',
                    'comeFrom': 'mircorlecture',
                    'content': '例题还未提交，确定要退出？',
                    'title':'小提示',
                    'confirmCallBack': callback.bind(this)
                }
            );
        }else{
            callback();
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
     * //4：掌握；3：不牢固；2：未掌握
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
        this.showNextQFlag = retValue.suggestCode === 2;//是否正确
        /*更新rightquestion*/
        if(this.showNextQFlag){
            let param=this.examSelectPoint;
            param.rightQuestion=1;
            this.microUnitService.selectMicroExampleItem(param);//储存起来
        }else if(!this.examSelectPoint.isWatch){
            this.getScope().$emit('diagnose.dialog.show',
                {
                    'showType': 'confirm',
                    'comeFrom': 'mircorlecture1',
                    'content': '有点难？可以先去“交互辅导”中学习一下',
                    'title':'小提示',
                    'confrimBtnText':'前往',
                    'confirmCallBack': ()=>{
                        this.go('micro_example_detail', 'back');
                    }
                }
            );
        }
        console.log('isSubmitted---02:', this.isSubmitted)
    }

    submitQ() {
        if (this.isLoadingProcessing || this.quesSubmitProcessing) return;
        if (!this.isSubmitted && this.isFirst) {
            this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
                template: '<p>认真思考，仔细检查后再提交哦。</p>',
                title: "小提示",
                scope: this.getScope(),
                buttons: [
                    {
                        text: "<b>确定提交</b>",
                        type: "button-positive",
                        onTap: e => {
                            this.submitMQ();
                        }
                    },
                    {
                        text: "再检查一下",
                        type: "",
                        onTap: function (e) {
                            return false;
                        }
                    }

                ]
            });
        } else {
            this.submitMQ();
        }

    }

    submitMQ() {
        this.getRootScope().$broadcast('keyboard.hide.change.question');//隐藏键盘
        $(document).trigger('click');//保存答案前，触犯一次点击事件，清除掉空分数。
        this.getRootScope().$broadcast('draft.hide');//隐藏草稿板
        if (!this.isSubmitted && !this.hasCorrect) {//提交答案
            this.microlectureService.submitQuestion(this.questionInfo
                , this.examSelectPoint
                , this.submitCallBack.bind(this)
                , this.getRootScope()
            );
            return;
        }

        if (this.isSubmitted && this.showNextQFlag) {
            this.showAnalysisFlag = false;
            this.isVertical = false;
            this.isSubmitted = false;
            this.questionInfo = null;
            this.go('micro_example_detail', 'back');
            return
        }

        if (this.isSubmitted && !this.showNextQFlag || this.hasCorrect) {//改错
            this.showAnalysisFlag = false;
            // this.microlectureService.resetExamQuestion(this.examSelectPoint);
            this.microlectureService.fetchQuestionNew(this.questionInfo, 2, ()=> {
                this.hasCorrect = false;
                this.isFirst = false;
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
        if (this.questionDataInitlized&&!this.isSubmitted) {
            this.microlectureService.fetchQuestionNew(this.questionInfo, 1, (param)=> {
                this.hasCorrect = this.questionInfo.canCorrect && this.examSelectPoint.rightQuestion < 1;
                this.isFirst = !this.hasCorrect;
            });
        }
    }

    /**
     * 第一步例题显示思路导航弹框
     */
    showExamGuid() {
        if (this.showAnalysisFlag) {
            this.hideExamGuid();
        } else {
            // $('.example_do_question .exam-guid').hide();
            this.showAnalysisFlag = true;
            $('.example-guid').addClass('example-guid-show');
        }
    }

    /**
     * 第一步例题隐藏思路导航弹框
     */
    hideExamGuid() {
        $('.example-guid').removeClass('example-guid-show');
        $('.example-guid').addClass('example-guid-hide');
        this.$timeout(()=> {
            $('.example-guid').removeClass('example-guid-hide');
            // $('.example_do_question .exam-guid').show();
            this.showAnalysisFlag = false;
        }, 300);
    }
}
export default exampleDoQuestionCtrl;