/**
 * Created by ZL on 2017/12/18.
 */
import _sortby from 'lodash.sortby';
import {Inject, actionCreator,Service} from '../module';
import * as MIRCORLECTURE from './../redux/action_types';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
@Service('microlectureService')
@Inject('$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state', '$ionicBackdrop', 'olympicMathMicrolectureInterface', 'diagnoseService','serverInterface')
class microlecture_service {
    cancelDiagnoseDoRequestList = [];
    olympicMathMicrolectureInterface;
    diagnoseService;
    quesPointIndex = 0;

    /**
     * 获取微课的题目
     * @param questionInfo
     * @param callback
     * @returns {function(*=, *)}
     */
    @actionCreator
    fetchQuestionNew(questionInfo, type, callback) {
        let me = this, state, url, params = {};
        return (dispatch, getState)=> {
            state = getState();
            let examSelectPoint = state.micro_select_example_item;//选择的例
            if (examSelectPoint.stepMark == 1) {
                params.questionId = examSelectPoint.questionIds[0].questionId;
            } else {
                let mark=this.quesPointIndex;
                if(mark==4) mark=3
                params.questionId = examSelectPoint.questionIds[mark].questionId;//完成到第几题
            }

            if (type == 1) {//做题
                url = me.olympicMathMicrolectureInterface.TINY_CLASS_GET_QUES;
                params.questionGroupId = examSelectPoint.groupId;
            } else {//改错
                url = me.olympicMathMicrolectureInterface.TINY_CLASS_CORRECT_QUES;
                params.instanceId = questionInfo.paperInstanceId;
            }

            let fetchQuestionServerNew = ()=> {
                dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_START});
                let postInfo = me.commonService.commonPost(url, params, true);
                me.cancelDiagnoseDoRequestList.push(postInfo.cancelDefer);
                postInfo.requestPromise.then((data)=> {
                    if (!data || data.code != 200) {
                        dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_FAIL});
                        return;
                    }
                    if (data && data.code === 200) {
                        if (angular.isArray(data.qsTitle) && !data.qsTitle.length) {
                            data.qsTitle = {};
                        } else {
                            me.diagnoseService.smallQParse(data.qsTitle);
                        }
                        data.qsTitle.canCorrect = data.canCorrect;
                        if (data.qsTitle.analysisImgUrl) {
                            data.qsTitle.analysisImgUrl = me.commonService.replaceAnalysisImgAddress(data.qsTitle.analysisImgUrl);
                        }
                        //为显示答案
                        if (data.list) {
                            let repeatData = {};
                            try {
                                me.diagnoseService.smallQParseForStat(data.qsTitle, data.list, repeatData);
                            } catch (e) {
                                console.error('诊断做题提交后', e);
                            }
                            data.qsTitle.inputListForCorrect = repeatData.inputListForCorrect;
                        }

                        dispatch({
                            type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_SUCCESS,
                            payload: {
                                examSelectPoint: examSelectPoint,
                                questionInfo: data.qsTitle,
                            }
                        });
                        if (angular.isFunction(callback)) {
                            callback();
                        }
                    }
                }, (res)=> {
                    dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_FAIL});
                });
            }
            fetchQuestionServerNew();
        }
    }

    /**
     * 提交 题目答案
     * @param questionInfo 题目信息
     * @param examSelectPoint 选择的例
     * @param slideIndex slide页号
     * @param callback
     * @param scope
     * @returns {function(*, *)}
     */
    @actionCreator
    submitQuestion(questionInfo, examSelectPoint, callback, scope) {
        callback = callback || angular.noop;
        let me = this, userAns,
            params = {
                instanceId: questionInfo.paperInstanceId,
                type: 1,  //该题的类型  1=例题  2=后三道题
            };
        userAns = this.getQAns(questionInfo);
        //答案
        params.answer = JSON.stringify({questionId: questionInfo.id, workStatus: 0, answers: userAns.ansStrArray});
        return (dispatch, getState)=> {
            if (userAns.isAllInputBoxesEmpty) {
                scope.$emit('diagnose.dialog.show',
                    {'comeFrom': 'diagnose', 'content': '小伙伴，不能提交空白答案的哦！'}
                );
                return;
            }
            let url = me.olympicMathMicrolectureInterface.TINY_CLASS_POST_QUES_ANS;
            dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.TINY_CLASS_DIAGNOSE_SUBMIT_QUES_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseDoRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    if (data.code === 20002) {
                        dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.TINY_CLASS_DIAGNOSE_SUBMIT_QUES_FAIL});
                        callback(data.msg);
                        return;
                    }
                    dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.TINY_CLASS_DIAGNOSE_SUBMIT_QUES_FAIL});
                    callback(false);
                    return;
                }

                if (data && data.code === 200) {
                    let repeatData = {};
                    try {
                        me.diagnoseService.smallQParseForStat(questionInfo, data.list, repeatData);
                    } catch (e) {
                        console.error('诊断做题提交后', e);
                    }
                    questionInfo.inputListForCorrect = repeatData.inputListForCorrect;
                    questionInfo.isSubmitted = true;
                    questionInfo.hasLocalAnswer = false;
                    if (data.list[0]) {
                        questionInfo.suggestCode = data.list[0].passFlag;
                    }

                    data.numIndex = getState().chapter_select_point.numIndex;
                    let retValue = {
                        suggestCode: questionInfo.suggestCode,
                    };
                    dispatch({
                        type: MIRCORLECTURE.MIRCORLECTURE_QUES.TINY_CLASS_DIAGNOSE_SUBMIT_QUES_SUCCESS,
                        payload: examSelectPoint
                    });
                    callback(retValue);
                    return;
                }
            }, (res)=> {
                dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.TINY_CLASS_DIAGNOSE_SUBMIT_QUES_FAIL});
                callback(false);
            });
        }
    }

    /**
     * 重置例上的试题
     * @param reSelectGrade
     * @returns {function()}
     */
    @actionCreator
    resetExamQuestion(examSelectPoint, question) {
        debugger
        let payload = {
            examSelectPoint: examSelectPoint,
            questionInfo: null
        };
        return (dispatch, getState)=> {
            dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_SUCCESS, payload: payload});
        };
    }

    /**
     * 做题后提交前 保存题目信息到本地
     * @param questionInfo
     * @param examSelectPoint
     * @param slideIndex
     * @returns {function(*, *)}
     */
    @actionCreator
    saveQuestionLocal(questionInfo, examSelectPoint) {
        if (!questionInfo) return;
        questionInfo.spStu = questionInfo.spStu ? questionInfo.spStu : {};
        questionInfo.inputList = questionInfo.inputList ? questionInfo.inputList : [];
        questionInfo.spStu.answer = this.getQAns(questionInfo).ansStrArray;
        questionInfo.hasLocalAnswer = true;
        //this.smallQParse(questionInfo);
        return (dispatch, getState)=> {
            dispatch({
                type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_SUCCESS,
                payload: {
                    examSelectPoint: examSelectPoint,
                    questionInfo: questionInfo
                }
            });
        }
    }

    /**
     * 获取做题记录
     * @param questionInfo
     * @param loadCallback
     * @returns {function(*, *)}
     */
    @actionCreator
    fetchErrorQRecords(questionInfo, loadCallback) {
        loadCallback = loadCallback || angular.noop;
        let me = this;
        return (dispatch, getState)=> {
            let url = me.olympicMathMicrolectureInterface.TINY_CLASS_GET_QUES_HISTORY,
                userId = getState().profile_user_auth.user.userId,
                params = {
                    classId: getState().diagnose_selected_clazz.id,
                    questionId: questionInfo.id
                };
            dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUES_RECORDS_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            // me.cancelDiagnoseErrorQRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUES_RECORDS_FAIL});
                    return;
                }
                if (data && data.code === 200) {

                    let smallQ = angular.copy(questionInfo);
                    if (!data.qsTitles || !data.qsTitles.length) {
                        return;
                    }
                    // me.smallQParseForStat(smallQ, data.history);
                    let qRecords = me.diagnoseService.smallQListParse(data.qsTitles, true, data.history[userId], true);
                    dispatch({
                        type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUES_RECORDS_SUCCESS
                    });
                    loadCallback(qRecords);
                }
            }, (res)=> {
                dispatch({type: MIRCORLECTURE.MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUES_RECORDS_FAIL});
            });
        }
    }

    /**
     * 获取全部的做题记录
     */
    @actionCreator
    fetchMicroAllReport(loadMore, loadMoreCallback) {
        loadMoreCallback = loadMoreCallback || angular.noop;
        let me = this;
        return (dispatch, getState)=> {
            let state = getState();
            //如果这个单元没有试题列表，无需加载更多数据
            let userId = state.profile_user_auth.user.userId;
            let examSelectPoint = state.micro_select_example_item;//选择的例
            let mircoReportStoreValue = state.mirco_with_report[examSelectPoint.groupId] || {};
            let qRecords = mircoReportStoreValue.qRecords;
            let report = mircoReportStoreValue.report || {};
            let url = me.olympicMathMicrolectureInterface.TINY_CLASS_GET_QUES_GROUP_HISTORY;
            if (loadMore && (!qRecords || qRecords.length === 0))return;
            if (!loadMore) { //如果没有加载更多的选项，则表示更新列表下所有的内容，则需要重新设置分页信息
                dispatch({
                    type: MIRCORLECTURE.MICRO_ALL_QUES_RECORDS.CHANGE_ALL_QUES_RECORDS_PAGINATION_INFO,
                    payload: {
                        pageNum: 0,
                        pageSize: 16
                    }
                });
            }

            state = getState(); //刷新 state
            let limitQuery = state.micro_all_ques_records_pagination_info;
            let params = {
                questionGroupId: examSelectPoint.groupId,
                pageNum: limitQuery.pageNum,
                pageSize: limitQuery.pageSize,
            };
            dispatch({type: MIRCORLECTURE.MICRO_ALL_QUES_RECORDS.FETCH_ALL_QUES_RECORDS_REPORT_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            // me.cancelDiagnoseReportRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    dispatch({type: MIRCORLECTURE.MICRO_ALL_QUES_RECORDS.FETCH_ALL_QUES_RECORDS_REPORT_FAIL});
                    return;
                }
                if (data && data.code === 200) {
                    let qRecords = null;
                    if (data.qsTitles) {
                        qRecords = me.diagnoseService.smallQListParse(data.qsTitles, true, data.history[userId], false);
                        qRecords = _sortby(qRecords, [function (item) {
                            return item.innerCreateTimeCount;
                        }]);
                        dispatch({
                            type: MIRCORLECTURE.MICRO_ALL_QUES_RECORDS.CHANGE_ALL_QUES_RECORDS_PAGINATION_INFO,
                            payload: {
                                pageNum: params.pageNum + qRecords.length,
                                pageSize: 16
                            }
                        });
                    }
                    report.allMsg = data.allMsg ? data.allMsg : report.allMsg;
                    report.masterList = data.list ? data.list : report.masterList;
                    dispatch({
                        type: MIRCORLECTURE.MICRO_ALL_QUES_RECORDS.FETCH_ALL_QUES_RECORDS_REPORT_SUCCESS,
                        payload: {
                            examSelectPoint: examSelectPoint,
                            qRecords: qRecords,
                            loadMore: loadMore,
                            report: report,
                            mircoReportStoreValue: mircoReportStoreValue
                        }
                    });

                    if (!qRecords || (loadMore && qRecords.length < limitQuery.quantity) || (!loadMore && qRecords.length < 16))
                        loadMoreCallback(loadMore, true);
                    else
                        loadMoreCallback(loadMore);
                }
            }, (res)=> {
                dispatch({type: MIRCORLECTURE.MICRO_ALL_QUES_RECORDS.FETCH_ALL_QUES_RECORDS_REPORT_FAIL});
            });
        }
    }

    /**
     * 获取当前要保存答案的小题 的最新答案
     */
    getQAns(currentQ) {
        let currentQInputList = currentQ.inputList,//获取当前小题得分点的复本
            ansStrArray = [], //答案集合
            isAllInputBoxesEmpty = true,//答案输入框是否为空
            hasChangeAnsFlag = false, //答案是否有变化
            parentELe = $($('.do_question_content')).find('div[compile-html]');
        let isVerticalScorePointType = (type)=> {
            return type == VERTICAL_CALC_SCOREPOINT_TYPE || type == VERTICAL_ERROR_SCOREPOINT_TYPE || type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
        };
        //遍历当前小题得分点, 将玩家输入的答案存入ansStrArray,
        //并给得分点对应的输入框spInfo[inputInfo].inputBoxStuAns赋值,
        //并保存该答案到得分点的临时变量spInfo.answerDo
        currentQInputList.forEach((spInfo)=> {
            //存入本地或服务器的小题答案: 输入框对应的答案信息和输入框uuid
            let ansInfo = {answer: spInfo.openStyle ? spInfo.answer : "", uuid: ""};
            let openStyleAnsObj = {}; //存储开放型得分点的答案
            //得分点关联的输入框
            spInfo.spList.forEach((inputInfo, idx)=> {
                //该得分点ID
                ansInfo.uuid = inputInfo.scorePointId;
                //输入框对象
                let inputBox = parentELe.find('#' + inputInfo.inputBoxUuid);
                if (isVerticalScorePointType(inputInfo.type)) { //竖式矩阵输入框
                    /*    let verticalBox = parentELe.find('[uuid="'+inputInfo.inputBoxUuid+'"]');*/
                    let domScope = angular.element(inputBox).scope();
                    inputInfo.matrix = domScope.getVerticalAnswerMatrix(inputInfo.inputBoxUuid);
                    ansInfo.answer += JSON.stringify([{id: inputInfo.inputBoxUuid, matrix: inputInfo.matrix}]);
                    hasChangeAnsFlag = true;
                    if (isAllInputBoxesEmpty) {
                        isAllInputBoxesEmpty = !domScope.isAnswerMatrixModified(inputInfo.matrix, inputInfo.inputBoxUuid);
                    }
                    return;
                }

                //输入框不存在
                if (!inputBox || inputBox.length == 0) {
                    console.error("出题bug,试题内容和答案所映射的输入框不匹配!输入框id:" + inputInfo.inputBoxUuid);
                    return true;
                }
                //*获取输入框中的内容*/
                let val =
                    angular.element(inputBox).scope().textContent.expr ? //输入框为MathJax对象而非<input>
                        angular.element(inputBox).scope().textContent.expr :
                        $(inputBox).val();
                if (val) {
                    isAllInputBoxesEmpty = false
                }
                if (spInfo.openStyle) {
                    openStyleAnsObj[inputInfo.label] = val;
                } else {  //*拼接该得分点输入的答案, 如果该得分点对应多个输入框,答案以"#"隔开*/
                    if (idx == 0) {
                        ansInfo.answer = val
                    }
                    else {
                        ansInfo.answer += "#" + val
                    }
                }
                //给得分点(spInfo)下对应的输入框内容赋值
                inputInfo.inputBoxStuAns = val;
            });
            //*根据得分点上定义的临时变量answerDo, 判断当前输入的答案较之前是否有改动*/
            if (spInfo.answer != ansInfo.answer && !spInfo.openStyle) {
                hasChangeAnsFlag = true;
                spInfo.answer = ansInfo.answer;
            } else if (spInfo.answer != JSON.stringify(openStyleAnsObj) && spInfo.openStyle) {
                hasChangeAnsFlag = true;
                spInfo.answer = ansInfo.answer = JSON.stringify(openStyleAnsObj);
            }
            ansStrArray.push(ansInfo);
        });

        return {
            ansStrArray: ansStrArray,
            isAllInputBoxesEmpty: isAllInputBoxesEmpty,
            canModifyStatus: hasChangeAnsFlag
        }
    };

    getVideoConfigData(param){
        let defer = this.$q.defer();
        this.commonService.commonPost(this.olympicMathMicrolectureInterface.GET_VIDEO_CONFIG, param).then((data) =>{
            if (data.code == 200) {
                if(data.result[0]){
                    data.result[0].solution = data.result[0].solution.replace('${ip}:90',this.serverInterface.IMG_SERVER)
                }
                defer.resolve(data.result[0]);
            }
            else {
                defer.resolve(false);
            }
        },()=>{
            defer.resolve(false);
        });

        return defer.promise;
    };
    saveInteractionInfo(param){
        let defer = this.$q.defer();
        this.commonService.commonPost(this.olympicMathMicrolectureInterface.SAVE_VIDEO_INTERACTION_INFO, param).then((data) =>{
            if (data.code == 200) {
                defer.resolve(true);
            }
            else {
                defer.resolve(false);
            }
        },()=>{
            defer.resolve(false);
        });

        return defer.promise;
    }

    /**
     * 更新举一反三列题正确数
     * @param count
     * @returns {function()}
     */
    @actionCreator
    modifyExamRightQuestionNum(count) {
        return (dispatch)=> {
            dispatch({type: MIRCORLECTURE.MICRO_EXAMPLE_LIST.MODIFY_SELECT_MICRO_EXAMPLE_ITEM, payload: count});
        };
    }

}

export default microlecture_service;