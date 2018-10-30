/**
 * Created by qiyuexi on 2018/3/7.
 */

import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import {Inject, View, Directive, select} from '../../module';

@View('area_evaluation_check', {
    url: '/area_evaluation_check',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$rootScope', '$scope', '$state', '$ionicPopup', '$timeout', '$ionicScrollDelegate', '$ngRedux', 'finalData', 'commonService', 'ngLocalStore'
        , 'workStatisticsService', 'areaEvaluationPubService'
    ]
})
class areaEvaluationCheckCtrl {
    $ionicPopup;
    $ionicScrollDelegate;
    $timeout;
    finalData;
    commonService;
    ngLocalStore;
    workStatisticsService;
    areaEvaluationPubService;
    isEditFlag = false;
    chapterName = [];
    gotoPubButnFlag = true;
    paperName="区域测评"
    @select(state => state.profile_user_auth.user.name) userName;
    @select(state => state.profile_user_auth.user.userId) userId;
    @select(state => state.ae_compose_temp_paper.tempPaperSetParams) setParams;
    @select(state => state.ae_compose_temp_paper.quesList) tempqslist;
    // @select(state => state.ae_compose_temp_paper.paperName) paperName;
    constructor(){


    }
    initData() {
        this.isShowKAD = true;
        this.isIOS = this.commonService.judgeSYS() == 2;
        this.isShowTips = false;
        this.initCtrl = false;
        this.isLoadingProcessing = true;
        this.gotoPubButnFlag = true;
        this.setChapterName();
    }

    setChapterName() {
        let chapterName = [];
        angular.forEach(this.tempqslist, (v, k) => {
            let cnStrArr = this.tempqslist[k].knowledge[0].code.split(/\.|\，/);
            let cnStr = "";
            let cnMarkStr = '';
            if (cnStrArr && cnStrArr.length > 1) {
                cnStr = cnStrArr.slice(1).join(',');
                cnMarkStr = cnStrArr[0].split('-').pop();
            }
            cnStr = cnStr.replace(/\-[a-zA-Z]\d+/g, '');
            cnStr = cnStr.replace(/\-[a-zA-Z]/g, '');
            cnStr = cnMarkStr + '.' + cnStr;
            if (chapterName.indexOf(cnStr) == -1) {
                this.tempqslist[k].chapterName = cnStr;
                chapterName.push(cnStr);
            }
        });
    }

    onAfterEnterView() {
        this.initData();
        this.paperEdit('done');
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

    /**
     * 返回
     */
    back() {
        // this.go('work_chapter_paper', {chapterId: this.selectUnit.unitId});
        this.go('area_evaluation_work');
    };

    /**
     * 显示小题的知识点和难度
     * @param record
     * @returns {string}
     */
    showKnowledgeAndDifficulty(record, $event) {
        if ((typeof $event === 'undefined' ? 'undefined' : typeof($event)) === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        let str1 = record.knowledge[0].content.replace(/^[a-z]\d+\./i, '');
        let str2 = record.difficulty < 40 ? '基础' : record.difficulty > 70 ? '拓展' : '变式'; //难度
        return str1 + ' - ' + str2;
    }

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
        if (this.tempqslist.length <= 0) {
            this.commonService.showAlert('温馨提示', '没有题目可布置，可点左上角返回添加');
            return;
        }
        this.gotoPubButnFlag = false;
        /*this.workChapterPaperService.checkClassStudentCount(false).then((data) => {
            if (!data || data && data.code != 200) {
                this.gotoPubButnFlag = true;
                this.commonService.showAlert('温馨提示', data.msg || '老师所带的班级中，没有一个班级的人数是大于等于10，则不能够布置作业')
            } else {
                this.changePaperName();
            }
        });*/
        this.changePaperName();
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
                        me.areaEvaluationPubService.changePaperName(this.paperName);
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
        let params = {};
        params.uId = this.userId;
        params.tagId = this.setParams[this.setParams.length - 1].tagId;
        params.paperName = this.paperName;
        let qIds = [];
        angular.forEach(this.tempqslist, (v, k) => {
            qIds.push(this.tempqslist[k].id);
        });
        params.qIds = JSON.stringify(qIds);
        this.areaEvaluationPubService.composePaper(params).then((data, msg) => {
            this.gotoPubButnFlag = true;
            if (data) {
                this.goToPub();
            } else {
                this.commonService.showAlert('警告', msg || '组卷失败');
            }
        });
    };

    goToPub() {
        this.go("area_evaluation_build");
    }

    /**
     * 点击编辑
     * @returns {boolean}
     */
    paperEdit(type) {
        if (type == 'edit') {
            this.isEditFlag = true;
            $('.text-div-adapt-ion-checkbox').show();
            $('.text-adapt').hide();
        } else {
            this.isEditFlag = false;
            $('.text-div-adapt-ion-checkbox').hide();
            $('.text-adapt').show();
        }
    };

    /**
     * 错题反馈
     * @param $event
     * @param questionId
     */
    goQFeedbackPage($event, questionId) {
        $event.stopPropagation();
        this.workStatisticsService.workDetailState.lastStateUrl = this.getStateService().current.name;
        this.workStatisticsService.workDetailState.lastStateParams = this.getStateService().params;
        this.workStatisticsService.QInfo.questionId = questionId;
        this.workStatisticsService.QInfo.paperId = '';//this.selectPaperInfo.id;
        this.getStateService().go('q_feedback');
    }

    mapActionToThis() {
        return {}
    }

    createPaperName() {
        let date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();
        if (Number(h) < 10) h = '0' + h;
        if (Number(m) < 10) m = '0' + m;

        this.paperName = '区域测评'
            + date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate() + " "
            + h + ":" + m;
    }

    selectQues(ques, $event) {
        if ((typeof $event === 'undefined' ? 'undefined' : typeof($event)) === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        ques.selected = !ques.selected;
    }

    /**
     * 选择的题目
     */
    getSelectArr() {
        let deleteArr = [];
        let deleteQuesIndexs = [];
        angular.forEach(this.tempqslist, (v, k) => {
            if (this.tempqslist[k].selected) {
                deleteArr.push(this.tempqslist[k].id);
                deleteQuesIndexs.push(Number(k));
            }
        });
        if (deleteArr.length == 0) {
            this.commonService.showAlert('提示', '请勾选题号前面的圆圈，再进行操作');
            return false;
        }

        return {deleteArr: deleteArr, deleteQuesIndexs: deleteQuesIndexs};
    }

    /**
     * 删除选择的题目
     */
    deleteQues() {
        let deleteObj = this.getSelectArr();
        if (!deleteObj) return;

        let deleteArr = deleteObj.deleteArr;
        let deleteQuesIndexs = deleteObj.deleteQuesIndexs;
        let nextTempQsList = [];
        this.tempqslist.forEach((qs, idx) => {
            if (deleteQuesIndexs.indexOf(idx) === -1) {
                nextTempQsList.push(qs);
            }
        });
        this.tempqslist.length = 0;
        nextTempQsList.forEach(qs => {
            this.tempqslist.push(qs);
        });
        // angular.forEach(deleteQuesIndexs, (v, k) => {
        //     this.tempqslist.splice(v, 1);
        // });

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
        this.areaEvaluationPubService.deleteSelectQues(this.setParams, this.tempqslist);
        this.setChapterName();
        this.commonService.alertDialog('已删除');
    }

    /**
     * 改变难度,同类替换
     */
    changeDifficulty(type) {
        let deleteObj = this.getSelectArr();
        if (!deleteObj) return;
        let deleteArr = deleteObj.deleteArr;
        angular.forEach(deleteArr, (v, k) => {
            angular.forEach(this.setParams, (v1, k1) => {
                if (v1.includeQIds) {
                    if (v1.includeQIds.indexOf(v) != -1) {
                        v1.selectedQIds.push(v);
                    }
                }
            })
        });
        let paramType = 2;
        let successMag = "操作成功";
        if (type == 'up') {
            successMag = "难度已提升";
            paramType = 2;
        } else if (type == 'down') {
            successMag = "难度已降低";
            paramType = 3;
        } else {
            successMag = "已替换成同类题";
            paramType = 4;
        }
        this.areaEvaluationPubService.getComposePaperQues(this.setParams, paramType)
            .then((data, msg) => {
                if (data) {
                    this.setChapterName();
                    this.commonService.alertDialog(successMag);
                    this.$timeout(()=> {
                        if (this.isEditFlag) {
                            $('.text-div-adapt-ion-checkbox').show();
                            $('.text-adapt').hide();
                        } else {
                            $('.text-div-adapt-ion-checkbox').hide();
                            $('.text-adapt').show();
                        }
                    });
                } else {
                    this.commonService.alertDialog('msg' || '操作失败');
                }
            })
    }

    getSubjectiveReferAnswer(record) {
        var param = {
            questionId: record.id
        };
        this.workStatisticsService.getQReferAnswer(param, true).then((data) => {
            if (data) {
                //判断答案是否是空对象 和 是不是学霸解答
                if (Object.keys(data.referAnswers || {}).length == 0) {
                    this.commonService.showAlert("信息提示", "<div>亲，目前还没有学霸解答此题，请再等一等。</div>");
                    return;
                }

                if (data.referAnswers && record.type.indexOf('vertical') > -1) {
                    debugger
                    record.inputList = record.inputList || [];
                    record.inputList = this.clearVerticalQAns(record.inputList, record.answerKey);
                    record.inputList = this.mapVerticalQAns(data.referAnswers, record.inputList);
                }

                record.reload = true;
                record.referAns = data.referAnswers;
                this.$timeout(() => {
                    record.reload = false;
                }, 100);
            }
        });
    }

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

export default areaEvaluationCheckCtrl;