/**
 * Author 邓小龙 on 2015/8/26.
 * @description  作业service
 */

import _ from 'underscore';
import services from './index';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';

services.service('paperService',
    function ($log, $state, $q, serverInterface, commonService, finalData) {
        "ngInject";

        var me = this;

        this.data = {};//共享数据对象
        this.data.showQContext = {flag: false};
        this.data.nextBtnFlag = true;//默认下一题按钮可以使用
        this.data.preBtnFlag = true;//默认上一题按钮可以使用
        this.data.nextDis = {flag: false};
        this.data.from = 0; //0表示从home页过来，1表示从试卷状态也过来，2表示从试卷统计点击改错按钮过来的
        this.redoCount = 0;//改错的次数 0表示第一次做


        this.selectQList = [];//选题页面数组
        this.selectQListOne = [];//选题页面一维数组

        //=====================key为questionId,value是每个小题的状态  by 彭建伦===============================
        //=====================value: 0-未做 ，1-未改 ，2-未检查 ，3-已检查 ==================================
        this.data.statusMapForQuestions = {};
        this.data.WORK_STATUS = {
            NOT_STARTED: 0,
            NOT_CORRECTED: 1,
            NOT_CHECKED: 2,
            CHECKED: 3
        };


        //this.testData={};
        var paper = {
            title: "",//作业标题
            description: "",//作业描述
            paperScore: "",//作业总分
            type: "",//试卷类型。 1 试卷；2 作业；
            bigQIndex: "",//当前大题索引
            smallQIndex: "",//当前小题索引
            bigQList: [],//大题数组
            inputList: [],//所有需要输入答案的input框数组
            currentBigQ: {},//当前大题对象
            bigQScore: "",//当前大题分数
            currentBigQTitle: "",//当前大题名称
            currentQ: {},//当前小题对象
            smallQCount: "",//当前大题下的小题个数
            stuAnswer: {}//学生答案临时变量
        };

        /**
         * 清空共享数据
         */
        this.clearData = function () {
            //this.data = {};//共享数据对象
            this.data.paper = {};
            this.data.showQContext = {flag: false};
            this.data.nextBtnFlag = true;//默认下一题按钮可以使用
            this.data.preBtnFlag = true;//默认上一题按钮可以使用
            this.data.nextDis = {flag: false};
        };


        /**
         * 刷新按钮
         */
        this.refreshBtn = function () {
            var bigQListLength = me.data.paper.bigQList.length;
            var smallQListLength = me.data.paper.bigQList[me.data.paper.bigQIndex].qsList.length;
            if (me.data.paper.bigQIndex == 0 && me.data.paper.smallQIndex == 0) {
                me.data.preBtnFlag = false;//上一题按钮不可用
            } else if (me.data.paper.bigQIndex == bigQListLength - 1 && me.data.paper.smallQIndex == smallQListLength - 1) {
                me.data.nextBtnFlag = false;//下一题按钮不可用
            } else {
                me.data.nextBtnFlag = true;//下一题按钮可用
                me.data.preBtnFlag = true;//上一题按钮可用
            }
        };


        /**
         * 数组排序
         * @param array 目标数组
         * @param sortField 按目标字段
         * @param type 升降序
         * @returns {*} 返回排序的数组
         */
        function arraySort(array, sortField, type) {
            if (!array || array.length <= 0) {
                return [];
            }
            if (!sortField) {
                return array;
            }
            if (type == "1") {//排序类型，0为升序，1为降序
                return _.sortBy(array, function (data) {
                    return -data[sortField];
                });
            } else {
                return _.sortBy(array, function (data) {
                    return data[sortField];
                });
            }

        }

        /**
         * 处理选择项
         * @param referInputBoxes 映射的输入框
         * @param smallQ 当前小题
         */
        function selectItemParse(referInputBoxes, smallQ) {
            _.each(referInputBoxes, function (inputInfo) {
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
                _.each(scorePoint.referInputBoxes, function (inputBox, index) {
                    var spQInfo = {};//得分点下的输入框对象
                    if (spStu.answer && typeof spStu.answer == 'string') {
                        var stuAns = spStu.answer.split(finalData.ANSWER_SPLIT_FLAG);
                        spQInfo.inputBoxStuAns = stuAns[index];//当前学生的答案
                    } else if (spStu.answer && typeof spStu.answer == 'object') {
                        spQInfo.inputBoxStuAns = spStu.answer[inputBox.label];
                    } else {
                        spQInfo.inputBoxStuAns = "";//当前学生的答案
                    }
                    if (qType == "line-match" || qType == 'open_class_2') {
                        spQInfo.inputBoxStuAns = spStu.answer;
                    }
                    spQInfo.inputBoxUuid = inputBox.uuid;//当前输入框的id
                    spQInfo.scorePointId = scorePoint.uuid;//所属得分点id
                    spQInfo.scorePointQbuId = spStu.id;//qub存入该知识点答案表主键id
                    spQInfo.currentQSelectItem = smallQ.selectItem;//当前小题的选择项放在当前输入框对象中
                    spList.push(spQInfo);
                });
            }
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
         * 根据作业id和作业批次
         * 获取发布的作业
         * @param param 试卷信息
         * @param workStatus 试卷状态
         * @param publishType 试卷类别
         */
        this.getPaperById = function (param, workStatus, publishType) {
            var defer = $q.defer();
            paper.paperId = param.id;
            paper.paperInstanceId = param.paperInstanceId;
            var tempInfo = {
                "sIds": param.sId,
                "paper": {
                    "paperId": param.id,
                    "paperInstanceId": param.paperInstanceId
                }
            };
            var tranParam = {
                filter: JSON.stringify(tempInfo),
                publishType: publishType
            };
            var isStat = workStatus == 4 ? true : false;
            if (!isStat) {//不是批改统计情况，会有未开始和进行中，两种状态
                tranParam.method = workStatus == 1 ? 1003 : 1001
            }
            commonService.commonPost(serverInterface.PAPER_GET, tranParam).then(function (data) {
                if (data.code == 200) {
                    /**
                     *  将后端回传的做题时间（秒数），转换为分钟数加秒数
                     *  如 181 秒 转换为 3 分 1 秒
                     */
                    let parseWasteTime = (wasteTime) => {
                        wasteTime = parseInt(wasteTime);
                        if (isNaN(wasteTime)) return {minutes: 1, seconds: 0};
                        let minutes = Math.floor(wasteTime / 60);
                        let seconds = wasteTime % 60;
                        return {minutes, seconds};
                    };
                    data.history = data.history || {};
                    paper.redoCount = data.history.repeatSeq;
                    paper.title = data.basic.title;
                    paper.description = data.basic.description;
                    paper.paperScore = data.basic.score;
                    paper.type = data.type;
                    paper.bigQList = arraySort(data.qsTitles, finalData.BIG_Q_SORT_FIELD);
                    paper.history = data.history;
                    paper.wasteTime = parseWasteTime(data.history.wasteTime);
                    paper.questionHistory = data.history;
                    paper.paperStuScore = data.history.score;
                    paper.latestScore = data.history.latestScore;
                    paper.firstScore = data.history.firstScore;
                    paper.paperScoreRate = commonService.convertToPercent(paper.paperStuScore / data.basic.score, 0);
                    if (isStat) {
                        bigQListParseForStat.call(me, paper.bigQList, paper, param);
                    } else {
                        bigQListParse.call(me, paper.bigQList, paper, param);//大题内部数据解析
                    }
                    //paper.bigQArray = commonService.getRowColArray(paper.bigQList, 2);
                    paper.bigQArray = paper.bigQList;
                    paper.bigQIndex = me.data.paper.bigQIndex || 0;////当前大题索引
                    paper.smallQIndex = me.data.paper.smallQIndex || 0;//当前小题索引
                    paper.currentBigQ = paper.bigQList[paper.bigQIndex];//当前大题
                    var bigVoIndex = paper.currentBigQ.seqNum;
                    paper.bigQVoIndex = commonService.convertToChinese(bigVoIndex);
                    paper.currentBigQTitle = paper.bigQList[paper.bigQIndex].title;//当前大题名称
                    //paper.currentQ = paper.currentBigQ.qsList[paper.smallQIndex];//当前小题
                    //paper.smallQVoIndex = paper.currentQ.seqNum;//当前小题索引
                    //paper.smallQCount = paper.currentBigQ.qsList.length;//当前小题个数
                    paper.bigQScore = paper.currentBigQ.score;//当前大题下的小题个数
                    paper.firstSubmitTime = data.history.firstSubmitTime;
                    paper.latestSubmitTime = data.history.latestSubmitTime;
                    paper.reworkTimes = data.history.reworkTimes;


                    //TODO: ==start==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）
                    // paper.bigQList.length != 0 && paper.bigQList.forEach((bigQ)=>{
                    //     bigQ.qsList.length != 0 && bigQ.qsList.forEach((smallQ)=>{
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


                    me.data.paper = paper;
                    me.data.showQContext = {flag: true};
                    defer.resolve(true);
                }
                if (data.code == 10001) {
                    defer.resolve(false);
                }
            });
            return defer.promise;
        };

        /**
         * 解析大题数组
         * @param bigQList 大题数组
         * @param paper 对象
         */
        function bigQListParse(bigQList, paper, param) {
            var me = this;
            var smallQCountForP = 0;//在paper层面展示总小题数量
            _.each(bigQList, function (bigQ, index) {
                //处理大题额外的信息
                //bigQ.bigQStuScore = paper.history.id2QuestionGroupScore[bigQ.id].scores;//当前大题学生的得分

                //var tempScore = bigQ.bigQStuScore / bigQ.score;//大题得分率小数形式
                //bigQ.bigQScoreRate = commonService.convertToPercent(tempScore, 0);//平均得分

                bigQ.bigQVoIndex = commonService.convertToChinese(bigQ.seqNum + 1);//当前大题展示题号，如1映射为一。
                bigQ.qsListLength = bigQ.qsList.length;
                bigQ.qsList = arraySort(bigQ.qsList, finalData.SMALL_Q_SORT_FIELD);
                smallQCountForP += bigQ.qsList.length;
                smallQListParse.call(me, bigQ.id, bigQ.qsList, param);
            });
            paper.smallQCountForP = smallQCountForP;
        }

        /**
         * 解析小题数组
         * @param bigQId  大题id
         * @param smallQList 小题数组
         */
        function smallQListParse(bigQId, smallQList, param) {
            var me = this;
            _.each(smallQList, function (smallQ) {
                ////var stuAns = paper.stuAnswer.questionId2ScorePoint[smallQ.id];//当前小题的学生答案
                smallQ.qContext = smallQ.qContext.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
                var answerKey = JSON.parse(smallQ.answerKey);//当前试题答案
                ////smallQ.stuAns = stuAns;
                smallQ.inputList = [];//小题下的所有输入框得id

                smallQ.smallQStuAnsList = []; //做题次数
                var smallQList_ = [];  //做题次数

                try {
                    answerParse(bigQId, answerKey, smallQ);
                    me.data.statusMapForQuestions[smallQ.id] = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id];
                    smallQ.smallQStuScore = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id].score;//当前小题学生的得分
                    var tempScore = smallQ.smallQStuScore / smallQ.score;//大题得分率小数形式
                    smallQ.smallQScoreRate = commonService.convertToPercent(tempScore, 0);//平均得分
                } catch (e) {
                    $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id);
                }

            });
        }

        /**
         * 解析答案
         * @param bigQId 当前大题id
         * @param answerKey 目标答案
         * @param smallQ 小题
         */
        function answerParse(bigQId, answerKey, smallQ) {
            let addMatrixToVerticalFormulaService = (anskey) => {
                anskey.scorePoints.forEach(sp => {
                    let spInfo = {};
                    //当前得分点历史得分记录
                    spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                    spInfo.spList = [];
                    sp.referInputBoxes.forEach(inputbox => {
                        let uuid = inputbox.uuid;
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
                                            matrix: matrixInfo[uuid],
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
                                    type: anskey.type
                                };
                                spInfo.spList.push(spListItem);
                            }
                        } else {
                            spInfo.spList.push({
                                inputBoxUuid: uuid,
                                scorePointId: sp.uuid,
                                currentQSelectItem: inputbox.info.selectItem,
                            });
                        }
                    });
                    smallQ.inputList.push(spInfo);
                });
            };
            _.each(answerKey, function (ans) {//处理参考答案
                    //ans.type  3种类型题
                    if (ans.type == VERTICAL_CALC_SCOREPOINT_TYPE || ans.type == VERTICAL_ERROR_SCOREPOINT_TYPE || ans.type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE) { //竖式题
                        addMatrixToVerticalFormulaService(ans)
                    } else {
                        _.each(ans.scorePoints, function (sp, index) {//处理得分点
                            var spStu = null;
                            try {
                                spStu = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id].id2ScorePointScore[sp.uuid];//当前得分点
                            } catch (e) {
                                $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                                // sp.spStuScore = spStu.score;//当前得分点学生的得分
                                return true;
                            }

                            selectItemParse(sp.referInputBoxes, smallQ);//处理选择项
                            var spList = [];//小题封装的得分点数组
                            var spInfo = {};
                            spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                            spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                            spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                            spInfo.score = spStu.score;//该小题的得分点的得分
                            spInfo.answer = spStu.answer;//该小题的得分点的整个答案
                            spInfo.spList = spList;//该小题的得分点的所有输入框
                            referAnswer(sp, spStu, smallQ, spList, ans.type);//处理答案关联
                            smallQ.inputList.push(spInfo);

                        });
                    }
                }
            );
        }


        /**
         * 解析大题数组
         * @param bigQList 大题数组
         */
        function bigQListParseForStat(bigQList) {
            _.each(bigQList, function (bigQ, index) {
                //处理大题额外的信息
                //bigQ.bigQStuScore = paper.history.id2QuestionGroupScore[bigQ.id].score;//当前大题学生的得分
                try {
                    bigQ.bigQStuScores = paper.questionHistory.id2QuestionGroupScore[bigQ.id].scores;//新版接口--当前大题学生的得分
                } catch (e) {
                    $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQ.id);
                }
                //bigQ.bigQVoIndex = commonService.convertToChinese(index + 1);//当前大题展示题号，如1映射为一。
                bigQ.bigQVoIndex = commonService.convertToChinese(bigQ.seqNum + 1);//当前大题展示题号，如1映射为一。
                //var tempScore = bigQ.bigQStuScore/ bigQ.score;//大题得分率小数形式  //被新版接口注释
                //bigQ.bigQScoreRate= commonService.convertToPercent(tempScore, 0);//平均得分 //被新版接口注释
                bigQ.qsListNew = [];
                smallQListParseForStat(bigQ);
                bigQ.qsList = arraySort(bigQ.qsList, finalData.SMALL_Q_SORT_FIELD);
            });

        }

        /**
         * 解析小题数组
         * @param bigQ 大题
         */
        function smallQListParseForStat(bigQ) {
            var bigQId = bigQ.id;
            var smallQList = bigQ.qsList;
            _.each(smallQList, function (smallQ) {
                ////var stuAns = paper.stuAnswer.questionId2ScorePoint[smallQ.id];//当前小题的学生答案
                smallQ.qContext = smallQ.qContext.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
                var answerKey = JSON.parse(smallQ.answerKey);//当前试题答案
                ////smallQ.stuAns = stuAns;
                smallQ.inputList = [];//小题下的所有输入框得id
                smallQ.smallQStuAnsList = [];
                smallQ.seqNum = parseInt(smallQ.seqNum);
                var smallQList_ = [];
                try {
                    //被新版接口注释
                    //smallQ.smallQStuScore = paper.history.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id].score;//当前小题学生的得分
                    //var tempScore = smallQ.smallQStuScore/ smallQ.score;//大题得分率小数形式
                    //smallQ.smallQScoreRate=commonService.convertToPercent(tempScore, 0);//平均得分
                    //answerParse(bigQId, answerKey, smallQ);
                    smallQList_ = paper.questionHistory.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id];//当前小题学生的所做的答案数组
                } catch (e) {
                    $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id);
                }
                if (!smallQList_) {
                    $log.error("qbu的bug,这题学生一次没有做，不能传空数组!大题id:" + bigQId + "小题id:" + smallQ.id);
                    return false;
                }
                smallQ.smallQStuAnsMapList = smallQList_;
                sQansListParseForStat(bigQId, answerKey, smallQ);
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
            _.each(smallQ.smallQStuAnsMapList, function (stuQAns, index) {//stuQAns为学生做一次小题对象
                stuQAns.smallQScoreRate = commonService.convertToPercent(stuQAns.score / smallQ.score, 0);
                stuQAns.inputList = [];
                if (stuQAns.score == 0) {//最后一次为0分
                    stuQAns.passFlag = 0;
                } else if (stuQAns.score == smallQ.score) {//改正确了
                    stuQAns.passFlag = 2;
                } else {//半对
                    stuQAns.passFlag = 1;
                }
                isRemoveQFlag = stuQAns.ignore == 1 ? true : isRemoveQFlag;
                var isGriding = false;//正在批改中的标志
                /**
                 * 做竖式题时，将answerKey中的matrix信息保存到verticalService中去
                 * @param anskey
                 */
                let addMatrixToVerticalFormulaService = (anskey) => {
                    anskey.scorePoints.forEach(sp => {
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
                        sp.referInputBoxes.forEach(inputbox => {
                            let uuid = inputbox.uuid;
                            let answerMatrixList = [];
                            let answerMatrix = null;
                            if (stuQAns.id2ScorePointScore[sp.uuid]) {
                                try {
                                    answerMatrixList = JSON.parse(stuQAns.id2ScorePointScore[sp.uuid].answer);
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
                                                application: spStu.application,
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
                _.each(answerKey, function (ans, ansIndex) {//处理参考答案
                    if (ans.type == VERTICAL_CALC_SCOREPOINT_TYPE || ans.type == VERTICAL_ERROR_SCOREPOINT_TYPE || ans.type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE) { //竖式题
                        addMatrixToVerticalFormulaService(ans)
                    } else {
                        //ans.type  3种类型题
                        _.each(ans.scorePoints, function (sp) {//处理得分点
                            var spStu = null;
                            try {
                                spStu = stuQAns.id2ScorePointScore[sp.uuid];//每做一次的得分点
                                sp.spStuScore = spStu.score;//当前得分点学生的得分
                            } catch (e) {
                                $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                                return true;
                            }

                            selectItemParse(sp.referInputBoxes, smallQ);//处理选择项
                            isGriding = spStu.correctness == -1 ? true : isGriding;
                            var spList = [];//小题封装的得分点数组
                            var spInfo = {};
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
                stuQAns.passFlag = isGriding ? 3 : stuQAns.passFlag;

            });
            if (isRemoveQFlag) {
                var firstDoneArry = [];
                firstDoneArry.push(smallQ.smallQStuAnsMapList[0]);
                smallQ.smallQStuAnsMapList = firstDoneArry;
            }
        }

        /**
         * 根据paperId获取paper,只获取试题，不获取批改信息
         */
        this.getPaperForShow = function (workId) {
            var param = {
                id: workId
            };
            commonService.commonPost(serverInterface.PAPER_GET_DETAIL, param).then(function (data) {
                if (data.code == 200) {
                    me.data.paper = data;
                    me.data.paper.bigQList = arraySort(data.qsTitles, finalData.BIG_Q_SORT_FIELD);
                    _.each(me.data.paper.bigQList, function (bigQ) {
                        bigQ.bigQVoIndex = commonService.convertToChinese(bigQ.seqNum + 1);
                        bigQ.qsList = arraySort(bigQ.qsList, finalData.SMALL_Q_SORT_FIELD);
                    })
                }
            });
        };

    }
)
;
