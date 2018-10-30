/**
 * Created by ZL on 2017/10/24.
 */
import _find from 'lodash.find';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';

import {Inject, View, Directive, select} from '../../module';

@Directive({
    selector: 'oralAssemblePreview',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('oral_assemble_preview', {
    url: 'oral_assemble_preview',
    template: '<oral-assemble-preview></oral-assemble-preview>'
})

@Inject('$rootScope', '$scope', '$state', '$ionicPopup', '$timeout', '$ionicScrollDelegate', '$ngRedux', 'finalData', 'commonService', 'workChapterPaperService', 'ngLocalStore'
    , 'workManageService', 'workStatisticsService', 'oralAssemblePaperService')
class oralAssemblePreviewCtrl {
    $ionicPopup;
    $ionicScrollDelegate;
    $timeout;
    finalData;
    commonService;
    workChapterPaperService;

    workManageService;
    ngLocalStore;
    workStatisticsService;
    oralAssemblePaperService;
    isEditFlag = false;
    chapterName = [];
    gotoPubButnFlag = true;
    bigQList = [];
    showOralList = false;

    @select(state => state.profile_user_auth.user.name) userName;
    @select(state => state.profile_user_auth.user.userId) userId;
    @select(state => state.compose_temp_oral_paper.tempPaperSetParams) setParams;
    @select(state => state.compose_temp_oral_paper.paperName) paperName;
    @select(state => state.compose_temp_oral_paper.periodQuestionMapItems) periodQuestionMapItems;

    constructor() {

    }

    initData() {
        this.isShowKAD = true;
        this.isIOS = this.commonService.judgeSYS() == 2;
        this.isShowTips = false;
        this.initCtrl = false;
        this.isLoadingProcessing = true;
        this.gotoPubButnFlag = true;
        this.setQuesList();
        this.showOralList = true;
    }

    setQuesList() {
        this.bigQList.length = 0;
        if (this.periodQuestionMapItems) {
            angular.forEach(this.periodQuestionMapItems, (v, k)=> {
                this.periodQuestionMapItems[k].id = this.periodQuestionMapItems[k].periodTagId;
                this.periodQuestionMapItems[k].qsList = [];
                this.periodQuestionMapItems[k].qsList.lenght = 0;
                angular.forEach(this.periodQuestionMapItems[k].questions, (v1, k1)=> {
                    if (!this.periodQuestionMapItems[k].qsList[k1]) this.periodQuestionMapItems[k].qsList[k1] = {};
                    this.periodQuestionMapItems[k].qsList[k1].id = v1.integrateQuestionItem.id;
                    this.periodQuestionMapItems[k].qsList[k1].inputList = [];
                    this.periodQuestionMapItems[k].qsList[k1].answerKey = v1.answerKey;
                    this.periodQuestionMapItems[k].qsList[k1].capability = v1.qCapabilityMap.capability;
                    this.periodQuestionMapItems[k].qsList[k1].knowledge = v1.qCapabilityMap.knowledge;
                    this.periodQuestionMapItems[k].qsList[k1].qContext = v1.integrateQuestionItem.questionBody;
                    this.periodQuestionMapItems[k].qsList[k1].seqNum = k1;
                });
                this.bigQList[k] = [];
                this.bigQList[k].length = 0;
                this.bigQList[k].push(this.periodQuestionMapItems[k]);
            });
        }
    }

    onAfterEnterView() {
        this.initData();
    }

    onBeforeEnterView() {
        this.showOralList = false;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
    }

    /**
     * 判断是否是主观题
     */
    checkQuestionTypeKey(record) {
        if (record.questionTypeKey == 'notSubjective') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 显示引导
     */
    /*
     showTips() {
     let key = this.getRootScope().user.loginName + "workPaperDetail";
     this.isShowTips = this.commonService.getLocalStorage(key);
     if (!this.isShowTips) {
     this.$ionicPopup.alert({
     title: '温馨提示',
     template: `<p style="font-size:16px">教师端不能做作业，只能查看作业、增删试题、布置作业等。</p>
     <p style="font-size:16px">想要体验学生做作业，可以布置作业后用您的体验账号登录学生端</p>
     <p style="font-size:16px">点击右上角的“?”了解更多。</p>
     <ion-checkbox ng-click="ctrl.isShowTips = !ctrl.isShowTips"  style="border:none;background:none;font-size:14px">不再提示</ion-checkbox>`,
     scope: this.getScope(),
     okText: '确定'
     }).then(() => {
     if (this.isShowTips) {
     this.commonService.setLocalStorage(key, true)
     }
     });
     }
     }
     */

    /**
     * 返回
     */
    back() {
        this.go('oral_assemble_paper');
    };

    /**
     * 获取该大题的中文题号和名称并返回
     * @param bigQ
     * @returns {*}
     */
    /* getBigQText(bigQ) {
     return this.workChapterPaperService.getBigQText(bigQ);
     }*/

    /**
     * 显示小题的知识点和难度
     * @param record
     * @returns {string}
     */
    /*showKnowledgeAndDifficulty(record, $event) {
     if ((typeof $event === 'undefined' ? 'undefined' : typeof($event)) === 'object' && $event.stopPropagation) {
     $event.stopPropagation();
     } else if (event && event.stopPropagation) {
     event.stopPropagation();
     }
     let str1 = record.knowledge[0].content.replace(/^[a-z]\d+\./i, '');
     let str2 = record.difficulty < 40 ? '基础' : record.difficulty > 70 ? '拓展' : '变式'; //难度
     return str1 + ' - ' + str2;
     }*/

    /**
     * 滚动到顶部
     */
    scrollTop() {
        this.$ionicScrollDelegate.scrollTop(true);
    };

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
    };

    /**
     * 去发布
     */
    gotoPublishWorkPaper() {
        if (!this.gotoPubButnFlag) return;
        if (this.periodQuestionMapItems.length <= 0) {
            this.commonService.showAlert('温馨提示', '没有题目可布置，可点左上角返回添加');
            return;
        }
        this.gotoPubButnFlag = false;
        this.workChapterPaperService.checkClassStudentCount(false).then((data) => {
            if(data&&data.code){
                if (data.normalPaperView) {
                    this.gotoPubButnFlag = true;
                    this.commonService.showAlert('温馨提示', data.normalPaperView || '老师所带的班级中，没有一个班级的人数是大于等于5，则不能够布置作业')
                } else {
                    this.changePaperName();
                }
            }else{
                this.commonService.alertDialog(data.msg||'班级校验失败');
            }
        });
    }

    /**
     * 修改试卷名
     */
    changePaperName() {
        let me = this;
        var refuseConfirm = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: '<input ng-model="ctrl.paperName" />',
            title: "试卷名称",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: e => {
                        me.oralAssemblePaperService.changePaperName(this.paperName);
                        return true;
                    }
                },
                {
                    text: "取消",
                    type: "",
                    onTap: function (e) {
                        me.gotoPubButnFlag = true;
                        return false;
                    }
                }

            ]
        });
        refuseConfirm.then(res => {
            if (res) {
                this.workPub();
            }
        });
    }

    /**
     * 布置作业
     */
    workPub() {
        this.gotoPubButnFlag = true;
        this.goToPub();
    };

    goToPub() {
        this.go("pub_oral_assemble_paper");
    }

    /**
     * 点击编辑
     * @returns {boolean}
     */
    /* paperEdit(type) {
     if (type == 'edit') {
     this.isEditFlag = true;
     $('.checkbox-content').show();
     } else {
     this.isEditFlag = false;
     $('.checkbox-content').hide();
     }
     };
     */
    mapActionToThis() {
        return {}
    }

    /*createPaperName() {
     let date = new Date();
     let h = date.getHours();
     let m = date.getMinutes();
     if (Number(h) < 10) h = '0' + h;
     if (Number(m) < 10) m = '0' + m;

     this.paperName = '复习巩固'
     + date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate() + " "
     + h + ":" + m;
     }*/

    /*  selectQues(ques, $event) {
     ques.selected = !ques.selected;
     if (ques.selected) {
     $('.' + ques.id + ' .selected').show();
     $('.' + ques.id + ' .unselected').hide();
     } else {
     $('.' + ques.id + ' .unselected').show();
     $('.' + ques.id + ' .selected').hide();
     }

     }*/

    /**
     * 选择的题目
     */
    /* getSelectArr() {
     let deleteArr = [];
     let deleteQuesIndexs = [];
     angular.forEach(this.periodQuestionMapItems, (v, k)=> {
     angular.forEach(this.periodQuestionMapItems[k].qsList, (v1, k1) => {
     if (v.qsList[k1].selected) {
     deleteArr.push(v.qsList[k1].id);
     }
     });
     });
     if (deleteArr.length == 0) {
     this.commonService.showAlert('提示', '请勾选题号前面的圆圈，再进行操作');
     return false;
     }

     return deleteArr;
     }*/

    /**
     * 删除选择的题目
     */
    /*deleteQues() {
     let deleteArr = this.getSelectArr();
     if (!deleteArr) return;

     angular.forEach(this.periodQuestionMapItems, (v, k)=> {
     let nextTempQsList = [];
     this.periodQuestionMapItems[k].questions.forEach((qs, idx) => {
     if (deleteArr.indexOf(qs.id) === -1) {
     nextTempQsList.push(qs);
     }
     });
     this.periodQuestionMapItems[k].questions.length = 0;
     nextTempQsList.forEach(qs => {
     this.periodQuestionMapItems[k].questions.push(qs);
     });
     })

     this.periodQuestionMapItems = _find(this.periodQuestionMapItems, (v)=> {
     return v.qsList.length > 0;
     });

     let deletePaprams = [];
     angular.forEach(deleteArr, (v, k) => {
     angular.forEach(this.setParams, (v1, k1) => {
     if (v1.includeQIds) {
     let index = v1.includeQIds.indexOf(v);
     if (index != -1) {
     v1.includeQIds.splice(index, 1);
     v1.questionNum -= 1
     }
     if (v1.questionNum <= 0) {
     deletePaprams.push(Number(k));
     }
     }
     })
     });
     angular.forEach(deletePaprams, (v, k) => {
     this.setParams.splice(v, 1);
     });
     this.oralAssemblePaperService.deleteSelectQues(this.setParams, this.periodQuestionMapItems)
     .then(()=> {
     this.setQuesList();
     });
     this.commonService.alertDialog('已删除');
     }*/

    clearVerticalQAns(inputList, answerKey) {
        let inputBoxStuAns;
        let anskey = JSON.parse(answerKey);
        let fillVerticalBlank = function (uuid) {
            try {
                let vfMatrix = _find(anskey, {type: VERTICAL_FILLBLANKS_SCOREPOINT_TYPE});
                let matrixInfo = _find(vfMatrix.vfMatrix, uuid);
                return matrixInfo ? matrixInfo[uuid] : [{}];
            } catch (e) {
                return [{}];
            }
        };

        angular.forEach(inputList, (sp)=> {
            angular.forEach(sp.spList, (scorePoint)=> {
                if (scorePoint.hasOwnProperty('inputBoxStuAns')) {
                    scorePoint.inputBoxStuAns = "";
                } else if (scorePoint.hasOwnProperty('matrix')) {
                    scorePoint.matrix = fillVerticalBlank(scorePoint.inputBoxUuid);
                }
            });
        });
        return inputList;
    }

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
}

export default oralAssemblePreviewCtrl;