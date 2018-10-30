/**
 * Created by ww on 2018/1/5.
 */
import {Inject, Service, actionCreator} from '../module';
import {QUESTION_EVERY_DAY} from './../redux/action_types/index'
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import * as MIRCORLECTURE from "../../../m_olympic_math_microlecture/scripts/redux/action_types";

@Service('questionEveryDayService')
@Inject('$q'
    , '$ngRedux'
    , '$rootScope'
    , 'commonService'
    , 'questionEveryDayInterface'
    , 'olympicMathMicrolectureInterface'
    , 'serverInterface'
    , 'finalData'
    , 'ngWorkerRunner'
    , 'diagnoseService'
)
class QuestionEveryDayService {
    $q;
    finalData;
    $rootScope;
    commonService;
    serverInterface;
    ngWorkerRunner;
    diagnoseService;
    questionEveryDayInterface;
    olympicMathMicrolectureInterface;

    constructor() {
        this.cancelRequestDeferList = []
    }

    answerKeyFormatJson(smallQ) {
        smallQ.question = smallQ.question.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
        return JSON.parse(smallQ.answerKey);//当前试题答案
    }

    /**
     * 将学生答案关联到输入框
     * @param scorePoint  得分点
     * @param spStu 学生得分点
     * @param smallQ 当前小题
     * @param spList 小题封装的得分点数组
     * @param qType 得分点类型
     */
    referAnswer(scorePoint, spStu, smallQ, spList, qType) {
        let me = this;
        if (scorePoint.openStyle) {
            try {
                spStu.answer = JSON.parse(spStu.answer);
            } catch (e) {
                console.log(e);
            }
        }
        if (scorePoint.referInputBoxes && scorePoint.referInputBoxes.length > 0) {
            scorePoint.referInputBoxes.forEach((inputBox, index) => {
                var spQInfo = {};//得分点下的输入框对象
                if (spStu.answer && typeof spStu.answer == 'string') {
                    var stuAns = spStu.answer.split(me.finalData.ANSWER_SPLIT_FLAG);
                    spQInfo.inputBoxStuAns = stuAns[index];//当前学生的答案
                }
                else if (spStu.answer && typeof spStu.answer == 'object') {
                    spQInfo.inputBoxStuAns = spStu.answer[inputBox.label];
                }
                else {
                    spQInfo.inputBoxStuAns = "";//当前学生的答案
                }

                spQInfo.label = inputBox.label;//当前输入框的label
                spQInfo.inputBoxUuid = inputBox.uuid;//当前输入框的id
                spQInfo.scorePointId = scorePoint.uuid;//所属得分点id
                spQInfo.scorePointQbuId = spStu.id;//qub存入该知识点答案表主键id
                spQInfo.currentQSelectItem = smallQ.selectItem;//当前小题的选择项放在当前输入框对象中
                if (inputBox.info) {
                    spQInfo.currentQSelectItem = inputBox.info.selectItem; //选择型输入框的选项
                }
                if (qType == "line-match" || qType == 'open_class_2') {
                    spQInfo.inputBoxStuAns = spStu.answer;
                }
                spList.push(spQInfo);
            });
        }
    }

    answerParse(answerKey, smallQ, stuQAns) {
        let me = this, spStu, spList, spInfo;
        /**
         * 做竖式题时，将answerKey中的matrix信息保存到verticalService中去
         * @param anskey
         */
        let addMatrixToVerticalFormulaService = (anskey) => {
            anskey.scorePoints.forEach(sp => {
                let spInfo = {};
                let spStu = stuQAns ? stuQAns.id2ScorePointScore[sp.uuid] : {};
                sp.spStuScore = spStu.score;//当前得分点学生的得分
                spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                spInfo.score = spStu.score;//该小题的得分点的得分
                spInfo.type = anskey.type;//得分点类型
                spInfo.spList = [];


                sp.referInputBoxes.forEach(inputbox => {
                    let uuid = inputbox.uuid;
                    let answerMatrixList = [];
                    let answerMatrix = null;
                    if (spStu.answer) {
                        try {
                            answerMatrixList = JSON.parse(spStu.answer);
                            answerMatrixList.forEach(answerMatrixInfo => {
                                if (answerMatrixInfo.id == uuid)
                                    answerMatrix = answerMatrixInfo.matrix;
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    let presetMatrix = null;//竖式改错的矩阵
                    let getPresetMatrix = (matrixInfo) => {
                        let rt = null;
                        Object.keys(matrixInfo).forEach(key => {
                            if (key != 'preset' && matrixInfo[key] instanceof Array) {
                                rt = {verticalId: key, matrix: matrixInfo[key]};
                            }
                        });
                        return rt;
                    };
                    if (!inputbox.info) { //如果不是竖式改错打勾叉
                        let vfMatrix = anskey.vfMatrix;
                        if (vfMatrix && vfMatrix.length) {
                            vfMatrix.forEach(matrixInfo => {
                                if (matrixInfo.preset)
                                    presetMatrix = getPresetMatrix(matrixInfo);
                            });
                            vfMatrix.forEach(matrixInfo => {
                                if (matrixInfo[uuid]) {
                                    let spListItem = {
                                        inputBoxUuid: uuid,
                                        scorePointId: sp.uuid,
                                        scorePointQbuId: spStu.id,
                                        matrix: answerMatrix ? answerMatrix : matrixInfo[uuid],
                                        application: spStu.application,
                                        type: anskey.type
                                    };
                                    if (presetMatrix && presetMatrix.matrix && presetMatrix.matrix.length)
                                        spListItem.presetMatrixInfo = presetMatrix;
                                    spInfo.spList.push(spListItem);
                                }
                            });
                        } else {
                            spInfo.spList.push({
                                inputBoxUuid: uuid,
                                scorePointId: sp.uuid,
                                matrix: answerMatrix ? answerMatrix : '',
                                scorePointQbuId: spStu.id,
                                type: anskey.type
                            });
                        }
                    } else {
                        spInfo.spList.push({
                            inputBoxUuid: uuid,
                            scorePointId: sp.uuid,
                            scorePointQbuId: spStu.id,
                            currentQSelectItem: inputbox.info.selectItem,
                            inputBoxStuAns: spStu.answer,
                            matrix: answerMatrix ? answerMatrix : ''
                        });
                    }
                });
                if (stuQAns && stuQAns.inputList) stuQAns.inputList.push(spInfo);
                smallQ.inputList.push(spInfo)
            });
        };
        answerKey.forEach((ans) => {//处理参考答案
            if (ans.type == VERTICAL_CALC_SCOREPOINT_TYPE
                || ans.type == VERTICAL_ERROR_SCOREPOINT_TYPE
                || ans.type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
            ) { //竖式题
                addMatrixToVerticalFormulaService(ans)
            } else {
                //ans.type  3种类型题
                ans.scorePoints.forEach((sp, index) => {//处理得分点
                    spStu = stuQAns ? stuQAns.id2ScorePointScore[sp.uuid] : {};
                    sp.spStuScore = spStu.score;//当前得分点学生的得分
                    me.selectItemParse(sp.referInputBoxes, smallQ);//处理选择项
                    if (stuQAns)
                        stuQAns.isGrading = spStu.correctness == -1 ? true : stuQAns.isGrading;
                    spList = [];//小题封装的得分点数组
                    spInfo = {};
                    spInfo.index = index;//表示当前第几次重做
                    if (ans.type == "application") {
                        spInfo.answerInfo = ans.answerList[0];
                    }
                    spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                    spInfo.openStyle = sp.openStyle;//是否是开放型得分点
                    spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                    spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                    spInfo.score = spStu.score;//该小题的得分点的得分
                    spInfo.answer = spStu.answer || "";//该小题的得分点的整个答案
                    spInfo.spList = spList;//该小题的得分点的所有输入框
                    me.referAnswer(sp, spStu, smallQ, spList, ans.type);//处理答案关联
                    if (stuQAns)
                        stuQAns.inputList.push(spInfo);
                    smallQ.inputList.push(spInfo);
                })
            }

        });
    }

    /**
     * 处理选择项
     * @param referInputBoxes 映射的输入框
     * @param smallQ 当前小题
     */
    selectItemParse(referInputBoxes, smallQ) {
        referInputBoxes.forEach((inputInfo) => {
            if (inputInfo.info) {
                smallQ.selectItem = inputInfo.info.selectItem;//选择内容
            }
        });
    }

    smallQParse(smallQ) {
        let me = this, answerKey;
        answerKey = this.answerKeyFormatJson(smallQ);//当前试题答案
        smallQ.inputList = [];//小题下的所有输入框得id
        smallQ.smallQStuAnsMapList = []; //做题次数
        me.answerParse(answerKey, smallQ);
    }

    smallQParseForStat(smallQ, history, repeatData) {
        let answerKey = this.answerKeyFormatJson(smallQ);//当前试题答案
        smallQ.smallQStuAnsMapList = history;
        smallQ.inputList = [];//小题下的所有输入框得id
        this.sQansListParseForStat(answerKey, smallQ);
        if (repeatData)
            repeatData.inputListForCorrect = angular.copy(smallQ.inputList);
    }

    sQansListParseForStat(answerKey, smallQ) {
        let me = this, isRemoveQFlag = false, stuQAns;
        for (let key in smallQ.smallQStuAnsMapList) {
            stuQAns = smallQ.smallQStuAnsMapList[key];//stuQAns为学生做一次小题对象
            stuQAns.innerCreateTime = stuQAns.createTime || '';
            stuQAns.innerCreateTime = stuQAns.innerCreateTime.replace(/\-/g, "/");//safari不认识new Date('2016-10-22 14:00')
            stuQAns.innerCreateTimeCount = (new Date(stuQAns.innerCreateTime)).getTime();
            stuQAns.smallQScoreRate = me.commonService.convertToPercent(stuQAns.score / smallQ.score, 0);
            stuQAns.inputList = [];
            isRemoveQFlag = stuQAns.ignore == 1 ? true : isRemoveQFlag;
            stuQAns.isGrading = false;//正在批改中的标志
            me.answerParse(answerKey, smallQ, stuQAns);
            stuQAns.passFlag = stuQAns.isGrading ? 3 : stuQAns.passFlag;
        }
        if (isRemoveQFlag) {
            var firstDoneArry = [];
            firstDoneArry.push(smallQ.smallQStuAnsMapList[0]);
            smallQ.smallQStuAnsMapList = firstDoneArry;
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
        let isVerticalScorePointType = (type) => {
            return type == VERTICAL_CALC_SCOREPOINT_TYPE || type == VERTICAL_ERROR_SCOREPOINT_TYPE || type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
        };
        //遍历当前小题得分点, 将玩家输入的答案存入ansStrArray,
        //并给得分点对应的输入框spInfo[inputInfo].inputBoxStuAns赋值,
        //并保存该答案到得分点的临时变量spInfo.answerDo
        currentQInputList.forEach((spInfo) => {
            //存入本地或服务器的小题答案: 输入框对应的答案信息和输入框uuid
            let ansInfo = {answer: spInfo.openStyle ? spInfo.answer : "", uuid: ""};
            let openStyleAnsObj = {}; //存储开放型得分点的答案
            //得分点关联的输入框
            spInfo.spList.forEach((inputInfo, idx) => {
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

    @actionCreator
    getListFromServer(params, clazzId, clazzGrade) {
        let defer = this.$q.defer();
        return (dispatch, getState) => {
            dispatch({type: QUESTION_EVERY_DAY.FETCH_QUESTION_EVERY_DAY_LIST_START});
            let postInfo = this.commonService.commonPost(this.questionEveryDayInterface.GET_QUESTION_LIST_DATA, params, true);
            this.cancelRequestDeferList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data) => {
                if (!data || data.code != 200) {
                    dispatch({type: QUESTION_EVERY_DAY.FETCH_QUESTION_EVERY_DAY_LIST_FAIL, errorInfo: data});
                    defer.resolve()
                }
                else {
                    let questionArr = [];
                    if (data.qsTitles && data.qsTitles.length) {

                        data.qsTitles.forEach((question) => {
                            questionArr.push({
                                questionGroupId: question.questionGroupId,
                                questionId: question.questionId,
                                time: question.time,
                                timeStr: question.time.substr(4, 2) + "月" + question.time.substr(6, 2),
                                stateStr: question.state == -1 ? '未做' : question.state == 2 ? '已完成' : '改错',
                                grade: this.commonService.convertToChinese(clazzGrade) + '年级',
                                questionTrunk: question.questionContent.questionBody.match(/<p>(.*?)<\/p>/)[1]
                            })
                        })
                    }
                    // //为显示答案
                    // if (data.list) {
                    // 	let repeatData = {};
                    // 	try {
                    // 		this.smallQParseForStat(data.qsTitle, data.list, repeatData);
                    // 		data.qsTitle.inputListForCorrect = repeatData.inputListForCorrect;
                    // 	} catch (e) {
                    // 		console.error('诊断做题提交后', e);
                    // 	}
                    // }
                    questionArr.sort((v1, v2) => {
                        return v2.time - v1.time
                    });
                    dispatch({
                        type: QUESTION_EVERY_DAY.FETCH_QUESTION_EVERY_DAY_LIST_SUCCESS,
                        payload: {clzId: clazzId, list: questionArr}
                    });
                    defer.resolve()
                }
            }, () => {
                dispatch({type: QUESTION_EVERY_DAY.FETCH_QUESTION_EVERY_DAY_LIST_FAIL, errorInfo: data});
                defer.reject()
            });
            return defer.promise;
        }
    }

    @actionCreator
    changeSelectedWork(params) {
        return (dispatch, getState) => {
            dispatch({type: QUESTION_EVERY_DAY.CHANGE_QUESTION_EVERY_DAY_SELECTED_WORK, payload: params});
        }
    }

    @actionCreator
    getQuestionInfoFromServer(params) {
        let defer = this.$q.defer();
        return (dispatch, getState) => {
            let postInfo = this.commonService.commonPost(this.questionEveryDayInterface.TINY_CLASS_GET_QUES, params, true);
            this.cancelRequestDeferList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data) => {
                if (!data || data.code != 200) {
                    defer.reject();
                    return;
                }
                if (data && data.code === 200) {
                    this.smallQParse(data.qsTitle);
                    //为显示答案
                    if (data.list) {
                        let repeatData = {};
                        try {
                            this.smallQParseForStat(data.qsTitle, data.list, repeatData);
                        } catch (e) {
                            console.error('诊断做题提交后', e);
                        }
                        data.qsTitle.inputListForCorrect = repeatData.inputListForCorrect;
                    }
                    defer.resolve(data.qsTitle);
                }
            }, (res) => {
                defer.reject()
            });
            return defer.promise;
        }
    }

    @actionCreator
    submitQuestion(questionInfo, callback, scope) {
        callback = callback || angular.noop;
        let me = this, userAns,
            params = {
                instanceId: questionInfo.paperInstanceId,
                type: 1,  //该题的类型  1=例题  2=后三道题
            };
        userAns = this.getQAns(questionInfo);
        //答案
        params.answer = JSON.stringify({questionId: questionInfo.id, workStatus: 0, answers: userAns.ansStrArray});
        return (dispatch, getState) => {
            if (userAns.isAllInputBoxesEmpty) {
                scope.$emit('diagnose.dialog.show',
                    {'comeFrom': 'diagnose', 'content': '小伙伴，不能提交空白答案的哦！'}
                );
                return;
            }
            let url = me.questionEveryDayInterface.TINY_CLASS_POST_QUES_ANS;
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelRequestDeferList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data) => {
                if (!data || data.code != 200) {
                    if (data.code === 20002) {
                        callback(data.msg);
                        return;
                    }
                    callback(false);
                    return;
                }

                if (data && data.code === 200) {
                    let repeatData = {};
                    try {
                        me.smallQParseForStat(questionInfo, data.list, repeatData);
                    } catch (e) {
                        console.error('诊断做题提交后', e);
                    }
                    questionInfo.inputListForCorrect = repeatData.inputListForCorrect;
                    questionInfo.isSubmitted = true;
                    questionInfo.hasLocalAnswer = false;
                    if (data.list[data.list.length - 1]) {
                        questionInfo.suggestCode = data.list[0].passFlag;
                    }
                    let retValue = {
                        suggestCode: questionInfo.suggestCode,
                    };

                    callback(retValue);
                    return;
                }
            }, (res) => {
                callback(false);
            });
        }
    }

    @actionCreator
    fetchQuestionNew(questionInfo) {
        let defer = this.$q.defer();
        let state, params = {};
        return (dispatch, getState) => {
            state = getState();
            // params.instanceId = questionInfo.paperInstanceId;
            params.instanceId = "eee8e86e-55c5-4f78-8024-9c36f15df2b2";
            params.questionId = "6122e22e-7586-40ba-9148-61a1ea820936";
            let postInfo = this.commonService.commonPost(this.questionEveryDayInterface.TINY_CLASS_CORRECT_QUES, params, true);
            this.cancelRequestDeferList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data) => {
                if (!data || data.code != 200) {
                    defer.reject();
                    return;
                }
                if (data && data.code === 200) {
                    this.smallQParse(data.qsTitle);
                    //为显示答案
                    if (data.list) {
                        let repeatData = {};
                        try {
                            this.smallQParseForStat(data.qsTitle, data.list, repeatData);
                        } catch (e) {
                            console.error('诊断做题提交后', e);
                        }
                        data.qsTitle.inputListForCorrect = repeatData.inputListForCorrect;
                    }
                    defer.resolve(data.qsTitle);
                }
            }, (res) => {
                defer.reject()
            });
            return defer.promise;
        }
    }

    @actionCreator
    fetchErrorQRecords(questionInfo, loadCallback) {
        loadCallback = loadCallback || angular.noop;
        let me = this;
        return (dispatch, getState) => {
            let url = me.olympicMathMicrolectureInterface.TINY_CLASS_GET_QUES_HISTORY,
                userId = getState().profile_user_auth.user.userId,
                params = {
                    classId: getState().diagnose_selected_clazz.id,
                    questionId: questionInfo.id
                };
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelRequestDeferList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data) => {
                if (!data || data.code != 200) {
                    return;
                }
                if (data && data.code === 200) {

                    let smallQ = angular.copy(questionInfo);
                    if (!data.qsTitles || !data.qsTitles.length) {
                        return;
                    }
                    let qRecords = me.diagnoseService.smallQListParse(data.qsTitles, true, data.history[userId], true);
                    loadCallback(qRecords);
                }
            }, (res) => {
            });
        }
    }
}

export default QuestionEveryDayService;