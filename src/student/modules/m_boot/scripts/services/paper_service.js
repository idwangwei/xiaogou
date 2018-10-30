/**
 * Author 邓小龙 on 2015/8/26.
 * @description  作业service
 */
import services from './index';
import _each from 'lodash.foreach';
import _find from 'lodash.find';
import * as types from '../redux/actiontypes/actiontypes';
import TimeCollector from './../utils/TimeCollector';
import LocalStorageUtil from './../utils/LocalStorageUtil';
import localStore from "local_store/localStore";
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';

const FIRST_ANS_VERSION_DIFF = 5000; //试卷第一次进入时，后端才会写人该试卷，返回该试卷后再存入数据库的时间延迟

services.service('paperService', [
    "$log"
    , "$state"
    , "$q"
    , "$rootScope"
    , "serverInterface"
    , "commonService"
    , "finalData"
    , "$ionicPopup"
    , "ngLocalStore"
    , "ngWorkerRunner"
    , "$timeout"
    , function ($log, $state, $q, $rootScope, serverInterface, commonService,finalData, $ionicPopup, ngLocalStore, ngWorkerRunner, $timeout) {
        this.data = {};//共享数据对象
        this.data.nextDis = {flag: false};
        this.units = [];//取答卷所需的单位
        this.timeCollector = new TimeCollector(); //试卷计时器
        this.LocalStorageUtil = new LocalStorageUtil(); //localStorage操作工具类
        this.selectQList = [];//选题页面数组
        this.selectQListOne = [];//选题页面一维数组
        this.startPaperTimeCollectorFlag = false;
        //比赛作业对象
        this.matchPaper = {
            localVvailableTimeShow: null,
            localVvailableTime: null
        }
        this.postsInfo = {};

        this.data.WORK_STATUS = {
            NOT_STARTED: 0,
            NOT_CORRECTED: 1,
            NOT_CHECKED: 2,
            CHECKED: 3
        };
        var me = this;


        /**
         * 处理选择项
         * @param referInputBoxes 映射的输入框
         * @param smallQ 当前小题
         */
        function selectItemParse(referInputBoxes, smallQ) {
            _each(referInputBoxes, function (inputInfo) {
                if (inputInfo.info) {
                    smallQ.selectItem = inputInfo.info.selectItem;//选择内容
                }
            });
        }

        /**
         * 将学生答案关联到输入框
         * @param scorePoint  得分点
         * @param spStu 学生得分点
         * @param smallQ 当前小题
         * @param spList 小题封装的得分点数组
         */
        function referAnswer(scorePoint, spStu, smallQ, spList, qType) {
            if (scorePoint.openStyle) {
                try {
                    spStu.answer = JSON.parse(spStu.answer);
                } catch (e) {
                    console.log(e);
                }
            }
            if (scorePoint.referInputBoxes && scorePoint.referInputBoxes.length > 0) {
                _each(scorePoint.referInputBoxes, function (inputBox, index) {
                    var spQInfo = {};//得分点下的输入框对象
                    if (spStu.answer && typeof spStu.answer == 'string') {
                        var stuAns = spStu.answer.split(finalData.ANSWER_SPLIT_FLAG);
                        spQInfo.inputBoxStuAns = stuAns[index];//当前学生的答案
                    }
                    else if (spStu.answer && typeof spStu.answer == 'object') {
                        spQInfo.inputBoxStuAns = spStu.answer[inputBox.label];
                    }
                    else {
                        spQInfo.inputBoxStuAns = "";//当前学生的答案
                    }
                    if (qType == "line-match" || qType == 'open_class_2') {
                        spQInfo.inputBoxStuAns = spStu.answer;
                    }

                    // if (spStu.reverse) spQInfo.reverse = spStu.reverse;
                    spQInfo.label = inputBox.label;//当前输入框的label
                    spQInfo.inputBoxUuid = inputBox.uuid;//当前输入框的id
                    spQInfo.scorePointId = scorePoint.uuid;//所属得分点id
                    spQInfo.scorePointQbuId = spStu.id;//qub存入该知识点答案表主键id
                    spQInfo.currentQSelectItem = smallQ.selectItem;//当前小题的选择项放在当前输入框对象中
                    if (inputBox.info) {
                        spQInfo.currentQSelectItem = inputBox.info.selectItem; //选择型输入框的选项
                    }
                    spList.push(spQInfo);
                });
            }
        }


        function getSelectedClazzId(state) {
            let userId = state.profile_user_auth.user.userId;
            let clzId = state.work_list_route.urlFrom === finalData.URL_FROM.OLYMPIC_MATH_T ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom === finalData.URL_FROM.OLYMPIC_MATH_S ? userId : state.wl_selected_clazz.id;
            return clzId;
        }

        function isOlympicMathS(state) {
            return state.work_list_route.urlFrom && state.work_list_route.urlFrom.indexOf(finalData.URL_FROM.OLYMPIC_MATH_S) > -1
        }

        function isOlympicMath(state) {
            return state.work_list_route.urlFrom && state.work_list_route.urlFrom.indexOf(finalData.URL_FROM.OLYMPIC_MATH) > -1
        }


        /**
         * 根据大题索引、小题索引刷新试题
         */
        this.refreshQ = function () {
            var bigQIndex = me.data.paper.bigQIndex;
            var smallQIndex = me.data.paper.smallQIndex;
            me.data.paper.currentBigQ = me.data.paper.bigQList[bigQIndex];//当前大题
            me.data.paper.currentBigQTitle = me.data.paper.bigQList[bigQIndex].title;//当前大题名称
            me.data.paper.currentQ = me.data.paper.currentBigQ.qsList[smallQIndex];//当前小题
            me.data.paper.smallQCount = me.data.paper.currentBigQ.qsList.length;//当前小题个数
            me.data.paper.bigQScore = me.data.paper.currentBigQ.score;//当前大题下的小题个数
            me.data.paper.bigQVoIndex = commonService.convertToChinese(me.data.paper.currentBigQ.seqNum + 1);//显示中文
            me.data.paper.smallQVoIndex = paper.smallQVoIndex = paper.currentQ.seqNum;//当前小题索引
        };

        /**
         * 选题页面初始化
         */
        this.selectQDataInit = function () {
            var bigQList = me.data.paper.bigQList;
            _each(bigQList, function (bigQ, index) {
                var bigQIndex = index;
                _each(bigQ.qsList, function (smallQ, smallQIndex) {
                    if (smallQ.info)return;
                    var info = {};
                    info.bigQIndex = bigQIndex;
                    info.smallQIndex = smallQIndex;
                    info.checkFlag = false;
                    info.seqNum = smallQ.seqNum;//qub传过来的试卷有可能seqNum都为0,就会出现bug，顺号暂为数组遍历index代替
                    smallQ['info'] = info;
                    //qList.push(info);
                })
            });
        };

        /**
         * 检查作业提交
         * @param qlist
         * @return 返回错误次数
         */
        this.checkPaperPost = function (qList) {
            var errorCount = 0;//错误次数
            _each(qList, function (item) {
                _each(item, function (q) {
                    if (!q.doneFlag) {//该题有空没有填写
                        errorCount++;
                    }
                });
            });
            return errorCount;
        };

        /**
         * 选择作业
         * @param work 作业对象
         */
        this.selectWork = (work)=>(dispatch)=> {
            dispatch({type: types.WORK_LIST.WORK_LIST_SELECT_WORK, payload: work});
        };
        /**
         * 进入指定的题目,开始做题或改题
         * @param bigQ  大题对象
         * @param smallQ  小题对象
         */
        this.checkAssignedQuestion = (bigQ, smallQ)=>(dispatch, getState)=> {
            let data = {}, state = getState();
            let selectedWork = getState().wl_selected_work;

            let clzId = getSelectedClazzId(state);

            data.bigQIndex = smallQ.bigQArrayIndex; //保存当前大题在整个试卷中的下标
            data.smallQIndex = smallQ.smallQArrayIndex; //保存当前小题在该大题中的下标
            data.from = "select"; //保存上一个页面信息
            data.clzId = clzId;
            data.instanceId = selectedWork.instanceId;
            dispatch({type: types.WORK_LIST.SELECT_QUESTION_CHECK_ASSIGNED_QUESTION, payload: data});
        };

        //===========================================do_question====================================


        /**
         * 将试题中需要随时使用/更新的数据解析保存在paper,bigQList,smallQ的相应位置
         * @param paper
         * @param modifyQuestionStatus 首次获取/提交后再次获取题目状态更新本地的题目状态
         * @param localAns 该试卷在本地保存的答案
         */
        function parsePaperData(paper, modifyQuestionStatus, localAns) {
            try {
                bigQListParse(paper.bigQList);
            } catch (e) {
                console.error('parse Paper Error:', e);
            }

            /**
             * 解析大题数组,对其包含的小题排序,保存该大题的 中文题号 和 小题个数
             * @param bigQList 答题集合
             */
            function bigQListParse(bigQList) {
                _each(bigQList, function (bigQ, bigQIdx) {
                    bigQ.bigQVoIndex = commonService.convertToChinese(bigQ.seqNum + 1);//当前大题中文题号(如:一)
                    bigQ.qsListLength = bigQ.qsList.length; //当前大题包含的小题个数
                    smallQListParse(bigQ, bigQ.seqNum);
                });
            }

            /**
             * 解析小题集合 ,解析小题内容smallQ.qContent, 保存当前小题所在的大题信息, 保存小题的状态和小题在服务器的主键ID
             * @param bigQ  大题
             * @param bigQIdx  大题下标
             */
            function smallQListParse(bigQ, bigQIdx) {
                debugger
                _each(bigQ.qsList, function (smallQ, smallQIdx) {
                    //调整题目内容
                    smallQ.qContext = smallQ.qContext.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
                    smallQ.bigQseqNum = bigQIdx;
                    smallQ.bigQTitle = commonService.interceptName(bigQ.title, 10);
                    let answerKey = JSON.parse(smallQ.answerKey);

                    !paper.statusMapForQuestions&&(paper.statusMapForQuestions=[]);
                    !paper.serverIdForQuestions&&(paper.serverIdForQuestions=[]);
                    if (modifyQuestionStatus) {
                        paper.statusMapForQuestions[smallQ.id] = paper.history.id2QuestionGroupScore[bigQ.id].id2QuestionScore[smallQ.id].workStatus;
                    }

                    //当前试题答案集合
                    paper.serverIdForQuestions[smallQ.id] = paper.history.id2QuestionGroupScore[bigQ.id].id2QuestionScore[smallQ.id].id;
                    smallQ.ansVersion = paper.history.id2QuestionGroupScore[bigQ.id].id2QuestionScore[smallQ.id].version || 0;
                    answerParse(bigQ.id, answerKey, smallQ);
                });
            }

            /**
             * 解析答案 从smallQ中的answerKey字段中解析得分点存入smallQ.inputList中
             * @param bigQId 当前大题id
             * @param answerKey 目标答案
             * @param smallQ 小题
             */
            function answerParse(bigQId, answerKey, smallQ) {
                smallQ.inputList = [];//小题下的所有得分点的集合
                /**
                 * 做竖式题时，将answerKey中的matrix信息保存到verticalService中去
                 * @param anskey
                 */
                let addMatrixToVerticalFormulaService = (anskey)=> {
                    anskey.scorePoints.forEach(sp=> {
                        let spInfo = {};
                        //当前得分点历史得分记录
                        let spStu = null;
                        let spStuVersion = 0;
                        try {
                            spStu = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id].id2ScorePointScore[sp.uuid];
                            spStuVersion = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id].version || 0;
                        } catch (e) {
                            $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                            return true;
                        }
                        sp.spStuScore = spStu.score;//当前得分点学生的得分
                        spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                        spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                        spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                        spInfo.score = spStu.score;//该小题的得分点的得分
                        spInfo.type = anskey.type;//得分点类型
                        spInfo.spList = [];


                        //进入select_question页面,服务器保存的答案version与本地保存的答案version对比,高则使用服务器的答案,否则使用本地的答案
                        if (localAns) {
                            let smallQAns = _find(localAns, {currentQIdInPaper: smallQ.id});
                            if (smallQAns && (smallQAns.ansVersion == undefined || spStuVersion - smallQAns.ansVersion < FIRST_ANS_VERSION_DIFF)) {
                                spStu.answer = _find(smallQAns.answers, {uuid: spStu.id}).answer;
                            }
                        }
                        sp.referInputBoxes.forEach(inputbox=> {
                            let uuid = inputbox.uuid;
                            let answerMatrixList = [];
                            let answerMatrix = null;
                            if (spStu.answer) {
                                try {
                                    answerMatrixList = JSON.parse(spStu.answer);
                                    answerMatrixList.forEach(answerMatrixInfo=> {
                                        if (answerMatrixInfo.id == uuid)
                                            answerMatrix = answerMatrixInfo.matrix;
                                    });
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                            let presetMatrix = null;//竖式改错的矩阵
                            let getPresetMatrix = (matrixInfo)=> {
                                let rt = null;
                                Object.keys(matrixInfo).forEach(key=> {
                                    if (key != 'preset' && matrixInfo[key] instanceof Array) {
                                        rt = {verticalId: key, matrix: matrixInfo[key]};
                                    }
                                });
                                return rt;
                            };
                            if (!inputbox.info) { //如果不是竖式改错打勾叉
                                let vfMatrix = anskey.vfMatrix;
                                if (vfMatrix && vfMatrix.length) {
                                    vfMatrix.forEach(matrixInfo=> {
                                        if (matrixInfo.preset)
                                            presetMatrix = getPresetMatrix(matrixInfo);
                                    });
                                    vfMatrix.forEach(matrixInfo=> {
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
                        smallQ.inputList.push(spInfo)
                    });
                };


                //处理参考答案
                _each(answerKey, function (ans) {
                    if (ans.type == VERTICAL_CALC_SCOREPOINT_TYPE || ans.type == VERTICAL_ERROR_SCOREPOINT_TYPE || ans.type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE) { //竖式题
                        addMatrixToVerticalFormulaService(ans)
                    } else {
                        //ans.type  3种类型题
                        _each(ans.scorePoints, function (sp, inputListIndex) {//处理得分点
                            //当前得分点历史得分记录
                            var spStu = null;
                            let spStuVersion = 0;
                            try {
                                spStu = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id].id2ScorePointScore[sp.uuid];
                                spStuVersion = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id].version || 0;
                            } catch (e) {
                                $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                                return true;
                            }

                            sp.spStuScore = spStu.score;//当前得分点学生的得分
                            selectItemParse(sp.referInputBoxes, smallQ);//处理选择项
                            var spInfo = {};//

                            if (ans.type == "application") {
                                spInfo.answerInfo = ans.answerList[0];
                            }
                            spInfo.openStyle = sp.openStyle;//是否是开放型得分点
                            spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                            spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                            spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                            spInfo.score = spStu.score;//该小题的得分点的得分

                            let spList = [];//该得分点关联的输入框数组

                            //进入select_question页面,服务器保存的答案version与本地保存的答案version对比,高则使用服务器的答案,低则使用本地的答案
                            if (localAns) {
                                let smallQAns = _find(localAns, {currentQIdInPaper: smallQ.id});
                                if (smallQAns && (smallQAns.ansVersion == undefined || spStuVersion - smallQAns.ansVersion < FIRST_ANS_VERSION_DIFF)) {
                                    spStu.answer = _find(smallQAns.answers, {uuid: spStu.id}).answer;
                                }
                            }
                            spInfo.answer = spStu.answer || "";//该小题的得分点的整个答案
                            spInfo.spList = spList;//该小题的得分点的所有输入框
                            referAnswer(sp, spStu, smallQ, spList, ans.type);//处理答案关联,将该得分点关联的输入框 push进spList中
                            smallQ.inputList.push(spInfo);//该小题的得分点的所有输入框
                        });
                    }
                });
            }
        }

        /**
         * 解析大题数组
         * @param paper 试卷
         * @param localHansPaper 本地保存了paper
         */
        function bigQListParseForStat(paper) {
            _each(paper.bigQList, function (bigQ) {
                //处理大题额外的信息
                try {
                    bigQ.bigQStuScores = paper.history.id2QuestionGroupScore[bigQ.id].scores;//新版接口--当前大题学生的得分
                } catch (e) {
                    $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQ.id);
                }
                bigQ.bigQVoIndex = commonService.convertToChinese(bigQ.seqNum + 1);//当前大题展示题号，如1映射为一。

                bigQ.qsListNew = [];
                smallQListParseForStat(bigQ, paper);
            });

            /**
             * 解析小题数组
             * @param bigQ 大题
             * @param paper
             */
            function smallQListParseForStat(bigQ, paper) {
                var bigQId = bigQ.id;
                var smallQList = bigQ.qsList;
                _each(smallQList, function (smallQ) {
                    smallQ.qContext = smallQ.qContext.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
                    var answerKey = JSON.parse(smallQ.answerKey);//当前试题答案
                    smallQ.inputList = smallQ.inputList || [];//小题下的所有输入框得id
                    smallQ.smallQStuAnsList = [];
                    var smallQList_ = [];
                    try {
                        smallQList_ = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id];//当前小题学生的所做的答案数组
                    } catch (e) {
                        $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id);
                    }
                    if (!smallQList_) {
                        $log.error("qbu的bug,这题学生一次没有做，不能传空数组!大题id:" + bigQId + "小题id:" + smallQ.id);
                        return false;
                    }
                    smallQ.smallQStuAnsMapList = smallQList_;
                    try {
                        sQansListParseForStat(bigQId, answerKey, smallQ);
                    } catch (e) {
                        $log.log("bigQ.id:" + bigQ.id + "    smallQId:" + smallQ.id);
                    }

                });
            }

            /**
             * 新接口--针对做了多次试题
             * @param bigQId
             * @param answerKey
             * @param smallQ
             */
            function sQansListParseForStat(bigQId, answerKey, smallQ) {
                var isRemoveQFlag = false;
                _each(smallQ.smallQStuAnsMapList, function (stuQAns, index) {//stuQAns为学生做一次小题对象
                    stuQAns.smallQScoreRate = commonService.convertToPercent(stuQAns.score / smallQ.score, 0);
                    stuQAns.inputList = stuQAns.inputList || [];
                    if (stuQAns.score == 0) {//最后一次为0分
                        stuQAns.passFlag = 0;
                    }
                    else if (stuQAns.score == smallQ.score) {//改正确了
                        stuQAns.passFlag = 2;
                    }
                    else {//半对
                        stuQAns.passFlag = 1;
                    }
                    isRemoveQFlag = stuQAns.ignore == 1 ? true : isRemoveQFlag;
                    var isGrading = false;//正在批改中的标志
                    /**
                     * 做竖式题时，将answerKey中的matrix信息保存到verticalService中去
                     * @param anskey
                     */
                    let addMatrixToVerticalFormulaService = (anskey)=> {
                        anskey.scorePoints.forEach(sp=> {
                            let spInfo = {};
                            //当前得分点历史得分记录
                            var spStu = null;
                            try {
                                spStu = stuQAns.id2ScorePointScore[sp.uuid];
                            } catch (e) {
                                $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                                return true;
                            }
                            sp.spStuScore = spStu.score;//当前得分点学生的得分
                            spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                            spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                            spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                            spInfo.score = spStu.score;//该小题的得分点的得分
                            spInfo.spList = [];
                            sp.referInputBoxes.forEach(inputbox=> {
                                let uuid = inputbox.uuid;
                                let answerMatrixList = [];
                                let answerMatrix = null;
                                if (stuQAns.id2ScorePointScore[sp.uuid]) {
                                    try {
                                        answerMatrixList = JSON.parse(stuQAns.id2ScorePointScore[sp.uuid].answer);
                                        answerMatrixList.forEach(answerMatrixInfo=> {
                                            if (answerMatrixInfo.id == uuid)
                                                answerMatrix = answerMatrixInfo.matrix;
                                        });
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                                let presetMatrix = null;//竖式改错的矩阵
                                let getPresetMatrix = (matrixInfo)=> {
                                    let rt = null;
                                    Object.keys(matrixInfo).forEach(key=> {
                                        if (key != 'preset' && matrixInfo[key] instanceof Array) {
                                            rt = {verticalId: key, matrix: matrixInfo[key]};
                                        }
                                    });
                                    return rt;
                                };
                                if (!inputbox.info) { //如果不是竖式改错打勾叉
                                    let vfMatrix = anskey.vfMatrix;
                                    if (vfMatrix && vfMatrix.length) {
                                        vfMatrix.forEach(matrixInfo=> {
                                            if (matrixInfo.preset)
                                                presetMatrix = getPresetMatrix(matrixInfo);
                                        });
                                        vfMatrix.forEach(matrixInfo=> {
                                            if (matrixInfo[uuid]) {
                                                let spListItem = {
                                                    inputBoxUuid: uuid,
                                                    scorePointId: sp.uuid,
                                                    scorePointQbuId: spStu.id,
                                                    matrix: answerMatrix ? answerMatrix : matrixInfo[uuid],
                                                    type: anskey.type
                                                };
                                                if (presetMatrix && presetMatrix.matrix && presetMatrix.matrix.length)
                                                    spListItem.presetMatrixInfo = presetMatrix;
                                                spInfo.spList.push(spListItem);
                                            }
                                        });
                                    } else {
                                        let spListItem = {
                                            inputBoxUuid: uuid,
                                            scorePointId: sp.uuid,
                                            scorePointQbuId: spStu.id,
                                            type: anskey.type
                                        };
                                        if (answerMatrix)
                                            spListItem.matrix = answerMatrix;
                                        spInfo.spList.push(spListItem);
                                    }
                                } else {
                                    spInfo.spList.push({
                                        inputBoxUuid: uuid,
                                        scorePointId: sp.uuid,
                                        scorePointQbuId: spStu.id,
                                        currentQSelectItem: inputbox.info.selectItem,
                                        inputBoxStuAns: spStu.answer
                                    });
                                }
                            });
                            smallQ.inputList.push(spInfo);
                            stuQAns.inputList.push(spInfo);
                        });
                    };
                    _each(answerKey, function (ans, ansIndex) {//处理参考答案
                        if (ans.type == VERTICAL_CALC_SCOREPOINT_TYPE || ans.type == VERTICAL_ERROR_SCOREPOINT_TYPE || ans.type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE) { //竖式题
                            addMatrixToVerticalFormulaService(ans)
                        } /*else if (ans.type == VERTICAL_CALC_SCOREPOINT_TYPE) {
                         let lm_spStu = ans.scorePoints;

                         }*/ else {
                            //ans.type  3种类型题
                            _each(ans.scorePoints, function (sp, inputListIndex) {//处理得分点
                                var spStu = null;
                                try {
                                    spStu = stuQAns.id2ScorePointScore[sp.uuid];//每做一次的得分点
                                } catch (e) {
                                    $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                                    return true;
                                }
                                sp.spStuScore = spStu.score;//当前得分点学生的得分
                                selectItemParse(sp.referInputBoxes, smallQ);//处理选择项
                                isGrading = spStu.correctness == -1 ? true : isGrading;
                                var spList = [];//小题封装的得分点数组
                                var spInfo = {};
                                spInfo.openStyle = sp.openStyle;//是否是开放型得分点
                                spInfo.index = index;//表示当前第几次重做
                                spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                                spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                                spInfo.reverse = spStu.application;
                                spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                                spInfo.score = spStu.score;//该小题的得分点的得分
                                spInfo.answer = spStu.answer;//该小题的得分点的整个答案
                                spInfo.spList = spList;//该小题的得分点的所有输入框
                                if (ans.type == "application" && ansIndex > 0) {//如果是应用题且有多个问题
                                    spInfo.multiQIndex = ansIndex;
                                }
                                referAnswer(sp, spStu, smallQ, spList, ans.type);//处理答案关联
                                stuQAns.inputList.push(spInfo);
                                smallQ.inputList.push(spInfo);
                            });
                        }
                    });
                });
            }
        }

        /**
         * 进入do_question页面生成题目slide列表
         */
        this.fillSlideBoxData = (qsList, ischeck, slideIndex)=>(dispatch, getState)=> {
            // callback = callback || angular.noop;
            let state = getState();
            let slideBoxDataList = []; //do_question页面,题目详情slide列表
            let clazzListWithWorks = state.wl_clazz_list_with_works; //班级试卷列表集合
            let selectedClazzId = getSelectedClazzId(getState()); //当前班级
            // let selectedPaperIndex = state.wl_selected_work.paperIndex; //当前试卷
            let paperInstanceId = state.wl_selected_work.instanceId; //当前试卷

            let bigQList = qsList; //当前试卷所有大题集合
            let currentPaper = _find(clazzListWithWorks[selectedClazzId], {instanceId: paperInstanceId});

            let bigQIndex = currentPaper.paperInfo.doPaper.bigQIndex; //当前大题在试卷中的下标
            let smallQIndex = currentPaper.paperInfo.doPaper.smallQIndex; //当前小题在其大题中的下标

            let currentSmallQ = bigQList[bigQIndex].qsList[smallQIndex];//当前试题

            //下一试题
            let nextSmallQ;
            if (currentSmallQ.isLastOfAllQ)
                nextSmallQ = currentSmallQ;
            else if (currentSmallQ.isLastOfBigQ)
                nextSmallQ = bigQList[currentSmallQ.bigQArrayIndex + 1].qsList[0];
            else
                nextSmallQ = bigQList[bigQIndex].qsList[currentSmallQ.smallQArrayIndex + 1];
            //上一试题
            let preSmallQ;
            if (currentSmallQ.isFirstOfAllQ)
                preSmallQ = currentSmallQ;
            else if (currentSmallQ.isFirstOfBigQ) {
                let perBigQ = bigQList[currentSmallQ.bigQArrayIndex - 1];
                preSmallQ = perBigQ.qsList[perBigQ.qsList.length - 1];
            } else
                preSmallQ = bigQList[bigQIndex].qsList[currentSmallQ.smallQArrayIndex - 1];


            if (ischeck) {
                slideBoxDataList[slideIndex] = {displayData: currentSmallQ}; //slide检查答案当前页
                slideBoxDataList[(3 + slideIndex - 1) % 3] = {displayData: nextSmallQ || currentSmallQ}; //slide前一页
                slideBoxDataList[(slideIndex + 1) % 3] = {displayData: preSmallQ || currentSmallQ};//slide后一页
            } else {
                //将当前点击的题目放入slideBox第一页, 总共3个slide页面
                slideBoxDataList.push({displayData: currentSmallQ}); //slide第一页
                slideBoxDataList.push({displayData: nextSmallQ || currentSmallQ}); //slide第二页
                slideBoxDataList.push({displayData: preSmallQ || currentSmallQ});//slide第三页
            }

            dispatch({
                type: types.WORK_LIST.DO_QUESTION_FILL_SLIDE_BOX_DATA, payload: {
                    clzId: selectedClazzId,
                    slideBoxDataList: slideBoxDataList,
                    instanceId: paperInstanceId
                }
            });
            // callback.call(this);
            // });

        };
        /**
         * 题目slide页面切换时,更新slideBox中的题目
         */
        this.refreshSlideBoxList = (newIndex)=>(dispatch, getState)=> {
            let state = getState();
            let clazzListWithWorks = state.wl_clazz_list_with_works; //班级试卷列表集合
            let selectedClazzId = getSelectedClazzId(getState()); //当前班级
            let paperInstanceId = state.wl_selected_work.instanceId; //当前试卷

            let bigQList = localStore.getTempWork().qsList;
            let currentPaper = _find(clazzListWithWorks[selectedClazzId], {instanceId: paperInstanceId});
            let bigQIndex = currentPaper.paperInfo.doPaper.bigQIndex; //当前大题在试卷中的下标
            let smallQIndex = currentPaper.paperInfo.doPaper.smallQIndex; //当前小题在其大题中的下标

            let currentSmallQ = bigQList[bigQIndex].qsList[smallQIndex];//当前试题
            //下一试题
            let nextSmallQ;
            if (currentSmallQ.isLastOfAllQ)
                nextSmallQ = currentSmallQ;
            else if (currentSmallQ.isLastOfBigQ)
                nextSmallQ = bigQList[currentSmallQ.bigQArrayIndex + 1].qsList[0];
            else
                nextSmallQ = bigQList[bigQIndex].qsList[currentSmallQ.smallQArrayIndex + 1];
            //上一试题
            //let preSmallQ = bigQList[bigQIndex].qsList[smallQIndex - 1] || (bigQList[bigQIndex - 1] && bigQList[bigQIndex - 1].qsList.slice(-1)[0]);//上一个试题
            let preSmallQ;
            if (currentSmallQ.isFirstOfAllQ)
                preSmallQ = currentSmallQ;
            else if (currentSmallQ.isFirstOfBigQ) {
                let qsList = bigQList[currentSmallQ.bigQArrayIndex - 1].qsList;
                preSmallQ = qsList[qsList.length - 1];
            }
            else
                preSmallQ = bigQList[bigQIndex].qsList[currentSmallQ.smallQArrayIndex - 1];

            let slideBoxDataList = [];
            slideBoxDataList[newIndex] = {displayData: currentSmallQ};//slide当前页
            slideBoxDataList[(newIndex + 1) % 3] = {displayData: nextSmallQ || currentSmallQ};//slide下一页
            slideBoxDataList[(newIndex + 2) % 3] = {displayData: preSmallQ || currentSmallQ};//slide前一页
            dispatch({
                type: types.WORK_LIST.DO_QUESTION_REFRESH_SLIDE_BOX_LIST,
                payload: {
                    slideBoxDataList: slideBoxDataList,
                    clzId: selectedClazzId,
                    instanceId: paperInstanceId
                }
            });
        };
        /**
         * slideBox中的slide页面切换时,利用新slide页面中的题目数据更新paperData中的当前问题信息
         */
        this.refreshCurrentSmallQByNewSlide = (currentSmallQRefreshData)=>(dispatch, getState)=> {
            let selectedWork = getState().wl_selected_work;
            let clzId = getSelectedClazzId(getState());

            dispatch({
                type: types.WORK_LIST.DO_QUESTION_REFRESH_CURRENT_SMALL_Q,
                payload: {
                    bigQIndex: currentSmallQRefreshData.bigQIndex,
                    smallQIndex: currentSmallQRefreshData.smallQIndex,
                    instanceId: selectedWork.instanceId,
                    clzId: clzId
                },
                withoutWebWorker: true
            });
        };


        /**
         * 获取试卷
         * @param redoFlag 是否重做
         * @param isStat
         */
        this.fetchPaper = (redoFlag, isStat, loadCallback)=>(dispatch, getState)=> {
            let callBack = angular.isFunction(loadCallback) ? loadCallback : angular.noop();
            let deferred = $q.defer();
            let selectedWork = getState().wl_selected_work;
            let loginName = getState().profile_user_auth.user.loginName + '/';
            let clzId = getSelectedClazzId(getState());
            let paperAnsArr = getState().wl_paper_answer;
            var param = {
                publishType: selectedWork.publishType,
                filter: JSON.stringify({
                    paper: {
                        paperId: selectedWork.paperId,
                        paperInstanceId: selectedWork.instanceId,
                        name:selectedWork.paperName
                    }
                })
            };
            if(selectedWork.publishType == finalData.WORK_TYPE.ORAL_WORK){
                param.paperSource='pqb';
            }
            if(selectedWork.publishType == finalData.WORK_TYPE.LIVE){
                param.filter=JSON.stringify({
                    paper: {
                        paperId: selectedWork.paperId,
                        paperInstanceId: selectedWork.instanceId,
                        name:selectedWork.paperName
                    },
                    type:2
                })
            }
            if(selectedWork.publishType == finalData.WORK_TYPE.AREA_EVALUATION){
                if(selectedWork.paperType==2){
                    param.filter=JSON.stringify({
                        paper: {
                            paperId: selectedWork.paperId,
                            paperInstanceId: selectedWork.instanceId,
                            name:selectedWork.paperName
                        },
                        type:2
                    })
                }else{
                    param.filter=JSON.stringify({
                        paper: {
                            paperId: selectedWork.paperId,
                            paperInstanceId: selectedWork.instanceId,
                            name:selectedWork.paperName
                        },
                        type:6
                    })
                    param.paperSource='pqb';
                }
            }
            if (isStat) {
                ngLocalStore.paperStore.keys().then((keys)=> {
                    if (keys.indexOf(loginName + selectedWork.instanceId) == -1) {
                        getPaperContentFromLocalStoreFail(callBack);
                    } else {
                        ngLocalStore.paperStore.getItem(loginName + selectedWork.instanceId).then((paperContent)=> {
                            getPaperContentFromLocalStoreSuccess(paperContent, callBack);
                        })
                    }
                });
            }
            else {
                param.method = redoFlag === 'false' ? 1001 : 1002;
                let paperStore = redoFlag === 'false' ? ngLocalStore.doPaperStore : ngLocalStore.paperStore;
                paperStore.keys().then((keys)=> {
                    if (keys.indexOf(loginName + selectedWork.instanceId) == -1) {
                        getPaperContentFromLocalStoreFail(callBack);
                    } else {
                        paperStore.getItem(loginName + selectedWork.instanceId).then((paperContent)=> {
                            getPaperContentFromLocalStoreSuccess(paperContent, callBack);
                        })
                    }
                });
            }
            return deferred.promise;


            /**
             * 从本地加载试卷内容成功
             * @param paperContent 试卷内容,该内容包含试卷的大题和小题的HTML内容等，他对应了获取试卷接口[serverInterface.PAPER_GET]返回的 “qsTitles”字段
             */
            function getPaperContentFromLocalStoreSuccess(paperContent, callBack) {
                getPaperInfoFromServer(paperContent, callBack);
            }

            /**
             * 从本地加载试卷内容失败
             */
            function getPaperContentFromLocalStoreFail(callBack) {
                getPaperInfoFromServer(null, callBack);
            }

            /**
             * 从服务器加载试卷
             * @param paperContent
             */
            function getPaperInfoFromServer(paperContent, callBack) {
                isStat ?
                    dispatch({type: types.WORK_LIST.WORK_LIST_FETCH_PAPER_START}) :
                    dispatch({type: types.WORK_LIST.WORK_LIST_FETCH_DO_PAPER_START});
                let paperInstanceId = selectedWork.instanceId;
                let currentPaper = _find(getState().wl_clazz_list_with_works[clzId], {instanceId: paperInstanceId});
                let localPaper = currentPaper&&currentPaper.paperInfo.paper;
                let localDoPaper = currentPaper&&currentPaper.paperInfo.doPaper;


                var paper = {
                    bigQIndex: 0, //当前大题在整个试卷中的下标
                    smallQIndex: 0, //当前小题在该大题中的下标
                    from: '', //上一个页面信息
                    bigQScore: '', //当前大题分数
                    currentBigQTitle: '', //当前大题名称
                    slideBoxDataList: [], //作业列表slide
                    inputList: [], //所有需要输入答案的input框数组
                    statusMapForQuestions: {}, //该试卷所有试题的状态
                    //modifyStatusMap:true, //更新试卷的题目状态
                    serverIdForQuestions: {}  //该试卷所有试题在服务器表中的主键
                };

                if (isStat) {
                    paper = localPaper || paper
                }
                else {
                    paper = localDoPaper || paper
                }

                if (paperContent) {  //再次进入作业需要去后端获取更新该作业的状态(本地提交后作业状态会变为"已改")
                    param.withoutPaperContent = true;
                }
                let url = isOlympicMathS(getState()) ? serverInterface.OLYMPIC_MATH_PAPER_GET : serverInterface.PAPER_GET;
                commonService.commonPost(url, param, false).then((data) => {
                    if (data.code == 200) {
                        if (redoFlag === 'false') {
                            paper.id = data.basic.id; //试卷ID
                            paper.title = data.basic.title; //试卷标题
                            paper.description = data.basic.description;//试卷描述
                            paper.type = data.type || 1; //试卷类型, 1:试卷,2:作业
                            paper.paperScore = data.basic.score || 1; //试卷总分
                        }

                        paper.firstScore = data.history.firstScore || 0;
                        paper.latestScore = data.history.latestScore || 0;
                        paper.paperScoreRate = commonService.convertToPercent(paper.latestScore / paper.paperScore, 0);
                        paper.firstSubmitTime = data.history.firstSubmitTime;
                        paper.latestSubmitTime = data.history.latestSubmitTime;
                        paper.wasteTime = data.history.wasteTime || 1;
                        paper.reworkTimes = data.history.reworkTimes;
                        paper.redoFlag = redoFlag;
                        paper.history = data.history;
                        paper.availableTime = data.availableTime;
                        /*   if($rootScope.competition&&$rootScope.competition.paper&&data.availableTime)
                         if(countDownService)countDownService.updateTime(Math.ceil(data.availableTime/1000));
                         */

                        parseBigQListByQsTitles(paper, data, paperContent, finalData.BIG_Q_SORT_FIELD, finalData.SMALL_Q_SORT_FIELD).then(()=> {
                            //TODO: ==start==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）
                            // _each(paper.bigQList,(bigQ)=>{
                            //     _each(bigQ.qsList,(smallQ)=>{
                            //
                            //         if(smallQ.qContext.match(/\{reduc\}/)){
                            //             smallQ.qContext = smallQ.qContext.replace(/\{reduc\}/,'');
                            //
                            //             let $qContext = $(smallQ.qContext);
                            //             let $span = $qContext.find('.appTextarea');
                            //             $span.replaceWith(
                            //                 $(`<simplify id="${$span.attr('id')}" label="${$span.attr('label')}"></simplify>`)
                            //                     .attr('style','width:310px;min-height:100px')
                            //             );
                            //             smallQ.qContext = $qContext[0].outerHTML;
                            //         }
                            //     });
                            // });
                            //TODO: ==end==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）

                            if (isStat) {
                                bigQListParseForStat(paper);
                                ngLocalStore.setStateWork(selectedWork.instanceId, paper.bigQList);
                                savePaperContentToLocalStore(paper.bigQList);
                                paper.bigQList = selectedWork.instanceId;
                                dispatch({
                                    type: types.WORK_LIST.WORK_LIST_FETCH_PAPER_SUCCESS, payload: {
                                        paper: paper,
                                        instanceId: selectedWork.instanceId,
                                        clzId: clzId
                                    }
                                });
                                dispatch({
                                    type: types.APP_FLAG.CAN_FETCH_PAPER_FALSE, payload: {
                                        instanceId: selectedWork.instanceId,
                                        clzId: clzId
                                    }
                                });

                                deferred.resolve(true);
                            }
                            else {
                                //查寻有答案保存在本地的试卷
                                let localAns = paperAnsArr[loginName + selectedWork.instanceId];

                                //解析服务器获取回来的题目数据
                                parsePaperData(
                                    paper
                                    , !localAns//该试卷是否有最新答案保存在本地: false(第一次开始取题/每次改错第一次取题)-->题目状态更改为服务返回的状态, true-->题目状态不变
                                    , localAns
                                );

                                ngLocalStore.setTempWork(selectedWork.instanceId, paper.bigQList);
                                saveDoPaperContentToLocalStore(paper.bigQList);
                                paper.bigQList = selectedWork.instanceId;
                                dispatch({
                                    type: types.WORK_LIST.WORK_LIST_FETCH_DO_PAPER_SUCCESS, payload: {
                                        paper: paper,
                                        // paperIndex: selectedWork.paperIndex,
                                        instanceId: selectedWork.instanceId,
                                        clzId: clzId
                                    }
                                });
                                dispatch({
                                    type: types.APP_FLAG.CAN_FETCH_DOPAPER_FALSE,
                                    payload: {
                                        instanceId: selectedWork.instanceId,
                                        clzId: clzId
                                    }
                                });
                                deferred.resolve(true);
                            }
                        });
                    }
                    else {
                        if (isStat) {
                            dispatch({type: types.WORK_LIST.WORK_LIST_FETCH_PAPER_FAILED});
                        } else {
                            dispatch({type: types.WORK_LIST.WORK_LIST_FETCH_DO_PAPER_FAILED});
                        }
                        deferred.resolve(false);
                    }

                    if (angular.isFunction(callBack)) callBack(data.availableTime);
                }, (res)=> {
                    if (angular.isFunction(callBack)) callBack();
                    isStat ?
                        dispatch({type: types.WORK_LIST.WORK_LIST_FETCH_PAPER_FAILED}) :
                        dispatch({type: types.WORK_LIST.WORK_LIST_FETCH_DO_PAPER_FAILED});
                    deferred.reject(res);
                });
            }

            /**
             * 根据服务器返回的数据及本地存储的数据获取大题列表
             * @param vmPaper 需要传递给redux store的paper对象
             * @param serverRespData 服务端返回的数据
             * @param paperContent 本地存储的试卷内容
             * @param bigQSortField 大题排序字段
             * @param smallQSortField 小题排序字段
             */
            function parseBigQListByQsTitles(vmPaper, serverRespData, paperContent, bigQSortField, smallQSortField) {
                let defer = $q.defer();
                if (typeof  paperContent == "string")
                    paperContent = serverRespData.qsTitles;
                ngWorkerRunner.runTask('getBigQList', [serverRespData, paperContent, bigQSortField, smallQSortField]).then((qsTitles)=> {
                    vmPaper.bigQList = qsTitles;
                    defer.resolve(true);
                });
                return defer.promise;
            }

            /**
             * 存储试卷内容到local store
             * @param paperContent
             */
            function savePaperContentToLocalStore(paperContent) {
                ngLocalStore.paperStore.setItem(loginName + selectedWork.instanceId, paperContent).then(()=> {
                    console.log('save papercontent to local store success!')
                });
            }

            function saveDoPaperContentToLocalStore(paperContent) {
                ngLocalStore.doPaperStore.setItem(loginName + selectedWork.instanceId, paperContent).then(()=> {
                    console.log('save papercontent to local store success!')
                });
            }
        };

        /**
         * 保存题目答案
         * @param currentQ //要保存答案的当前小题
         * @param checkFlag //是否是检查答案保存
         * @param isAllInputBoxesEmpty 小题答案是否为空
         * @param currentQInputListClone 小题最新inputList对象
         * @param ansStrArray //该小题最新的答案
         */
        this.savePaper = (currentQ, checkFlag, isAllInputBoxesEmpty, ansStrArray)=>(dispatch, getState)=> {
            //*保存答案*/
            let state = getState();
            let clazzListWithWorks = state.wl_clazz_list_with_works;//班级试卷列表集合

            let selectedClazzId = getSelectedClazzId(getState()); //当前班级
            let selectedWork = state.wl_selected_work; //当前选择试卷
            // let selectedPaperIndex = selectedWork.paperIndex; //当前试卷在work_list中的下标
            let paperInstanceId = selectedWork.instanceId; //当前试卷
            let paperData = _find(clazzListWithWorks[selectedClazzId], {instanceId: paperInstanceId}).paperInfo.doPaper; //当前试卷内容
            let redoFlag = paperData.redoFlag;
            let loginName = getState().profile_user_auth.user.loginName + '/';

            //*变更当前小题的状态*/
            let workStatus = paperData.statusMapForQuestions[currentQ.id];
            //点击[检查]保存试题, 状态改为[已检查]
            if (checkFlag) {
                workStatus = finalData.WORK_STATUS.CHECKED
            }
            //当前小题为空, 试卷未提交状态改为[未做]/试卷已批改状态改为[未改]
            if (isAllInputBoxesEmpty) {
                workStatus = redoFlag === 'true' ? finalData.WORK_STATUS.NOT_CORRECTED : finalData.WORK_STATUS.NOT_STARTED
            }
            //当前小题不为空且不是点击[检查]保存试题, 状态改为[未检查]
            if (!isAllInputBoxesEmpty && workStatus != finalData.WORK_STATUS.CHECKED) {
                workStatus = finalData.WORK_STATUS.NOT_CHECKED
            }
            dispatch({
                type: types.WORK_LIST.DO_QUESTION_MODIFY_QUESTION_STATUS, payload: {
                    clzId: selectedClazzId,
                    instanceId: paperInstanceId,
                    currentSmallQId: currentQ.id,
                    workStatus: workStatus
                }
            });
            //当前小题的答案信息
            let currentAnsObj = {
                currentQIdInPaper: currentQ.id, //小题在试卷中的uuid,存入本地
                questionId: paperData.serverIdForQuestions[currentQ.id], //小题在服务器的主键ID,每次改错取题都会变化
                workStatus: workStatus, //小题状态
                answers: ansStrArray, //小题所有得分点的答案,已"#"分隔的字符串
                ansVersion: currentQ.ansVersion
            };
            dispatch({
                type: types.APP_FLAG.NEED_SAVE_LOCAL_ANS_TO_SERVER,
                payload: {paperInstanceId: selectedWork.instanceId}
            });
            dispatch({
                type: types.SELECT_QUESTION.MODIFY_PAPER_ANSWER, payload: {
                    userPaperInstanceId: loginName + selectedWork.instanceId,
                    ans: currentAnsObj
                }
            });
        };

        /**
         * 保存在本地的答案提交到服务器保存
         */
        this.postAnsToServer = ()=>(dispatch, getState)=> {
            let defer = $q.defer();
            let state = getState();
            let paperId = state.wl_selected_work.paperId;
            let selectedWork = state.wl_selected_work; //当前选择试卷
            let paperInstanceId = state.wl_selected_work.instanceId;
            let loginName = getState().profile_user_auth.user.loginName + '/';
            let paperLocalAns = state.wl_paper_answer[loginName + paperInstanceId];
            let param = {
                subjectId: paperId, //试卷ID
                paperInstanceId: paperInstanceId, //试卷批次号
                subjectType: 1 //作业类型为试卷
            };


            //store上没有保存的该试卷答案,则返回
            try {
                if (!paperLocalAns) {
                    defer.resolve(true);
                    return defer.promise
                }
                param.answer = JSON.stringify(paperLocalAns);
            } catch (e) {
                console.error('postAnsToServer: parse local ans data to json fail')
            }
            param.intervalTime = me.timeCollector.getIntervalTime(selectedWork.instanceId);
            if(selectedWork.publishType === finalData.WORK_TYPE.ORAL_WORK||selectedWork.publishType === finalData.WORK_TYPE.ORAL_WORK_KEYBOARD||selectedWork.publishType === finalData.WORK_TYPE.FINAL_ACCESS||selectedWork.publishType === finalData.WORK_TYPE.AREA_EVALUATION){
                param.intervalTime = 0; //键盘输入保存答案时，时间忽略不计（+0s），以最终提交倒计时时间为准
            }
            dispatch({
                type: types.APP_FLAG.SAVE_LOCAL_ANS_TO_SERVER,
                payload: {paperInstanceId: selectedWork.instanceId}
            });
            dispatch({type: types.SELECT_QUESTION.POST_ANSWER_START});
            let url = isOlympicMathS(state) ? serverInterface.OLYMPIC_MATH_POST_ANSWER : serverInterface.POST_ANSWER;
            commonService.commonPost(url, param).then(function (data) {
                let msg;
                if (data.code == 200) {
                    console.log('作业答案保存到服务器成功');
                    dispatch({type: types.SELECT_QUESTION.POST_ANSWER_SUCCESS});
                    //删除之前保存的答案
                    dispatch({
                        type: types.SELECT_QUESTION.CLEAR_PAPER_ANSWER,
                        payload: {userPaperInstanceId: loginName + paperInstanceId}
                    });

                    defer.resolve(true);
                    return;
                }
                else if (data.code == 10001) {
                    msg = '<p>找不到试卷</p>';
                    printMsg('信息提示', msg);
                }
                else if (data.code == 10006) {
                    msg = '<p>作业已经被老师删除</p>';
                    printMsg('信息提示', msg);
                }
                else if (data.code == 10007) {
                    msg = '<p>作业状态有误</p>';
                    printMsg('信息提示', msg);
                }
                else if (data.code == 30006 || data.code == 10008) {
                    msg = '<p>作业已经被提交了，可能的原因:</p>' +
                        '<p>1. 老师收了你的作业</p>' +
                        '<p>2. 你的帐号在其他设备上已提交了作业</p>';
                    printMsg('信息提示', msg);
                }
                else {
                    printMsg('信息提示', `${data.msg} code:${data.code}`);
                }
                dispatch({
                    type: types.APP_FLAG.NEED_SAVE_LOCAL_ANS_TO_SERVER,
                    payload: {paperInstanceId: selectedWork.instanceId}
                });
                dispatch({type: types.SELECT_QUESTION.POST_ANSWER_FAILED});
                defer.resolve(false);
            }, (res)=> {
                dispatch({type: types.SELECT_QUESTION.POST_ANSWER_FAILED});
                dispatch({
                    type: types.APP_FLAG.NEED_SAVE_LOCAL_ANS_TO_SERVER,
                    payload: {paperInstanceId: selectedWork.instanceId}
                });
                defer.reject(res);
            });

            return defer.promise;
        };

        /**
         * 处理提交的错误
         */
        function handleSubmitError(dispatch, hansAns, paperInstanceId) {
            if (hansAns) {
                dispatch({
                    type: types.APP_FLAG.NEED_SAVE_LOCAL_ANS_TO_SERVER,
                    payload: {paperInstanceId: paperInstanceId}
                });
            }
            dispatch({type: types.SELECT_QUESTION.POST_ANSWER_FAILED});
            dispatch({type: types.SELECT_QUESTION.SUBMIT_PAPER_FAILED});
        }

        /**
         * 提交作业(包含提交答案)
         */
        this.submitAnsAndPaper = (submitCallback, timeEndFlag, selectedMatchWork, spentTime,redoFlag)=>(dispatch, getState)=> {
            let state = getState();
            let selectedWork = selectedMatchWork ? selectedMatchWork : state.wl_selected_work; //当前选择试卷
            let paperId = selectedWork.paperId;
            // let paperIndex = state.wl_selected_work.paperIndex;
            let paperInstanceId = selectedWork.instanceId;
            let clzId = selectedMatchWork ? selectedMatchWork.clzId : getSelectedClazzId(getState());
            let loginName = state.profile_user_auth.user.loginName + '/';
            let paperLocalAns = state.wl_paper_answer[loginName + paperInstanceId];
            let param = {
                subjectId: paperId, //试卷ID
                paperInstanceId: paperInstanceId, //试卷批次号
                subjectType: 1 ,//作业类型为试卷
                intervalTime:1
            };


            if (paperLocalAns) {
                try {
                    dispatch({
                        type: types.APP_FLAG.SAVE_LOCAL_ANS_TO_SERVER,
                        payload: {paperInstanceId: selectedWork.instanceId}
                    });
                    param.answer = JSON.stringify(paperLocalAns);
                } catch (e) {
                    console.error('submitAnsAndPaper: parse local ans data to json fail')
                }
            }

            //口算作业允许提交空白试卷
            if(selectedWork.publishType == finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
                || selectedWork.publishType == finalData.WORK_TYPE.ORAL_WORK
                || selectedWork.publishType == finalData.WORK_TYPE.FINAL_ACCESS
                || selectedWork.publishType == finalData.WORK_TYPE.AREA_EVALUATION
            ){
                param.forceSubmit = true
            }
            /*区域测评能提交白卷 但是改错不能提交白卷*/
            if(selectedWork.publishType == finalData.WORK_TYPE.AREA_EVALUATION&&redoFlag=="true"){
                param.forceSubmit = false;
            }

            if (typeof spentTime === "number" && spentTime!==0) {
                param.intervalTime = spentTime;
            } else {
                param.intervalTime = me.timeCollector.getIntervalTime(selectedWork.instanceId);
            }
            dispatch({type: types.SELECT_QUESTION.SUBMIT_PAPER_START});
            let url = clzId && clzId.length > 10 ? serverInterface.OLYMPIC_MATH_SUBMIT_PAPER_AND_ANS : serverInterface.SUBMIT_PAPER_AND_ANS;
            commonService.commonPost(url, param).then((data)=> {
                let msg;
                //成功提交
                if (data.code == 200) {
                    dispatch({type: types.SELECT_QUESTION.POST_ANSWER_SUCCESS});
                    //删除之前保存的答案
                    dispatch({
                        type: types.SELECT_QUESTION.CLEAR_PAPER_ANSWER,
                        payload: {userPaperInstanceId: loginName + paperInstanceId}
                    });

                    //修改整张试卷状态为已提交
                    dispatch({
                        type: types.WORK_LIST.SUBMIT_PAPER_MODIFY_PAPER_STATUS, payload: {
                            status: 3,
                            instanceId: paperInstanceId,
                            clzId: clzId
                        }
                    });
                    dispatch({
                        type: types.APP_FLAG.CAN_FETCH_PAPER_TRUE, payload: {
                            instanceId: paperInstanceId,
                            clzId: clzId
                        }
                    });
                    dispatch({
                        type: types.APP_FLAG.CAN_FETCH_DOPAPER_TRUE, payload: {
                            instanceId: paperInstanceId,
                            clzId: clzId
                        }
                    });

                    dispatch({type: types.SELECT_QUESTION.SUBMIT_PAPER_SUCCESS});
                    submitCallback();
                    return;
                }
                let isStay;
                //提交错误
                if (data.code == 10001) {
                    msg = '<p>找不到试卷</p>';
                    printMsg('信息提示', msg, null, state);
                }
                else if (data.code == 10006) {
                    msg = '<p>作业已经被老师删除</p>';
                    printMsg('信息提示', msg, null, state);
                }
                else if (data.code == 10007) {
                    msg = '<p>作业状态有误</p>';
                    printMsg('信息提示', msg, null, state);
                }
                else if (data.code == 30006) {
                    msg = '<p>作业已经被提交了，可能的原因:</p>' +
                        '<p>1. 老师收了你的作业</p>' +
                        '<p>2. 你的帐号在其他设备上已提交了作业</p>';
                    printMsg('信息提示', msg, null, state);
                }
                else if (data.code == 30004) {
                    msg = '<p>改错未做题，不能提交。</p>';
                    printMsg('信息提示', msg, true, state);
                }
                else if (data.code == 30011) {
                    msg = '<p>不能提交空白试卷，请先答题</p>';
                    isStay = selectedWork.publishType === finalData.WORK_TYPE.MATCH_WORK ? null : true;
                    printMsg('信息提示', msg, isStay, state);
                }
                else {
                    msg = '<p>作业提交失败,重试一下</p>';
                    if (timeEndFlag) {
                        submitCallback(msg);
                        return;
                    }
                    printMsg('信息提示', msg, true, state);
                }
                handleSubmitError(dispatch, !!paperLocalAns, selectedWork.instanceId);
            }, ()=> {
                if (timeEndFlag) {
                    submitCallback(true);
                    return;
                }
                handleSubmitError(dispatch, !!paperLocalAns, selectedWork.instanceId);
            });
        };


        /**
         * 提交作业
         */
        this.submitPaper = ()=>(dispatch, getState)=> {
            let defer = $q.defer();
            let state = getState();
            let selectedWork = state.wl_selected_work; //当前选择试卷
            let paperId = state.wl_selected_work.paperId;
            // let paperIndex = state.wl_selected_work.paperIndex;
            let paperInstanceId = state.wl_selected_work.instanceId;
            let clzId = getSelectedClazzId(getState());
            let param = {
                subjectId: paperId, //试卷ID
                paperInstanceId: paperInstanceId, //试卷批次号
                subjectType: 1 //作业类型为试卷
            };

            //修改整张试卷状态为已提交
            dispatch({
                type: types.WORK_LIST.SUBMIT_PAPER_MODIFY_PAPER_STATUS, payload: {
                    status: 3,
                    instanceId: paperInstanceId,
                    clzId: clzId
                }
            });
            dispatch({type: types.SELECT_QUESTION.SUBMIT_PAPER_START});
            dispatch({
                type: types.APP_FLAG.CAN_FETCH_PAPER_TRUE, payload: {
                    instanceId: paperInstanceId,
                    clzId: clzId
                }
            });
            dispatch({
                type: types.APP_FLAG.CAN_FETCH_DOPAPER_TRUE, payload: {
                    instanceId: paperInstanceId,
                    clzId: clzId
                }
            });

            param.intervalTime = me.timeCollector.getIntervalTime(selectedWork.instanceId);
            commonService.commonPost(serverInterface.PAPER_SUBMIT, param).then(function (data) {
                if (data.code == 200) {
                    dispatch({type: types.SELECT_QUESTION.SUBMIT_PAPER_SUCCESS});
                }
                else if (data.code == 100) {
                    dispatch({type: types.SELECT_QUESTION.SUBMIT_PAPER_FAILED});
                    alert("该作业已经被老师回收了!");
                }
                else {
                    dispatch({type: types.SELECT_QUESTION.SUBMIT_PAPER_FAILED});
                    $log.error("提交作业出现错误!", data);
                }

                defer.resolve(true);
            });

            return defer.promise;
        };
        /**
         * 学生确认评价
         */
        this.stuConfirmA = (work, encourage, content)=> {
            return (dispatch, getState)=> {
                var appraise = {
                    "workInstanceId": work.instanceId,//作业批次号
                    "workId": work.paperId,//作业id
                    "encourage": encourage,
                    "messageS": encodeURI(content)
                };
                var param = {
                    appraise: JSON.stringify(appraise)
                };
                dispatch({type: types.WORK_LIST.CONFIRM_STU_PRAISE_START});
                this.postsInfo[serverInterface.S_CONFIRM_APPRAISE] = commonService.commonPost(serverInterface.S_CONFIRM_APPRAISE, param, true);
                this.postsInfo[serverInterface.S_CONFIRM_APPRAISE].requestPromise.then((data)=> {
                    if (!data || data.code != 200) {
                        dispatch({type: types.WORK_LIST.CONFIRM_STU_PRAISE_FAILED, errorInfo: data});
                        return;
                    }
                    if (data && data.code == 200) {//成功
                        dispatch({type: types.WORK_LIST.CONFIRM_STU_PRAISE_SUCCESS});
                        if (isOlympicMath(getState()))//入口缓存了urlFrom，表明作业列表是从奥数进入的
                            $state.go("olympic_math_work_list", {urlFrom: getState().work_list_route.urlFrom});//改错后返回试卷列表
                        else if(work.publishType == finalData.WORK_TYPE.WINTER_WORK||work.publishType == finalData.WORK_TYPE.SUMMER_WORK){
                            $state.go("holiday_work_list");
                        }
                        else if(work.publishType == finalData.WORK_TYPE.ORAL_WORK||work.publishType == finalData.WORK_TYPE.ORAL_WORK_KEYBOARD){
                            $state.go("home.oral_calculation_work_list");
                        }
                        else
                            $state.go("home.work_list");//改错后返回试卷列表
                    }
                });
            }
        };
        /**
         * 从do_question页面点击返回按钮返回到select_页面
         */
        this.doQuestionBackToSelect = ()=>(dispatch, getState)=> {

            let selectedClazzId = getSelectedClazzId(getState()); //当前班级
            let paperInstanceId = getState().wl_selected_work.instanceId; //当前试卷

            dispatch({
                type: types.WORK_LIST.DO_QUESTION_BACK_TO_SELECT, payload: {
                    clzId: selectedClazzId,
                    instanceId: paperInstanceId,
                    from: 'do_question'
                }
            });
        };
        /**
         * 检查小题答案完成,保存小题答案,并跳转页面: 从do_question页面回到select_页面
         */
        this.questionCheckOkGoToSelect = ()=>(dispatch, getState)=> {

            let selectedClazzId = getSelectedClazzId(getState());//当前班级
            let paperInstanceId = getState().wl_selected_work.instanceId; //当前试卷

            //更改paperData.from的值
            dispatch({
                type: types.WORK_LIST.DO_QUESTION_CHECK_QUESTION_OK, payload: {
                    clzId: selectedClazzId,
                    instanceId: paperInstanceId,
                    from: 'do_question'
                }
            });
        };
        function printMsg(title, msg, isStay, state) {
            $ionicPopup.alert({
                title: title || '信息提示',
                template: msg,
                okText: '确定'
            }).then(function () {
                if (!isStay) {
                    let isOlympicMathSValue = isOlympicMath(state);
                    if (isOlympicMathSValue)//入口缓存了urlFrom，表明作业列表是从奥数进入的
                        $state.go("olympic_math_work_list", {urlFrom: state.work_list_route.urlFrom});//改错后返回试卷列表
                    else
                        $state.go("home.work_list");//改错后返回试卷列表
                }
            });
        }

        this.changeWorkReportPaperInfo = (paperInfo)=>(dispatch, getState)=> {
            let param = {
                paperId: paperInfo.paperId,
                instanceId: paperInfo.instanceId,
                paperName: paperInfo.paperName,
                totalScore: paperInfo.totalScore,
                publishType: paperInfo.publishType
            };

            dispatch({type: types.WORK_REPORT.CHANGE_WORK_REPORT_PAPER_INFO, payload: param});
        };

        return Object.assign({}, this);
    }]
);
