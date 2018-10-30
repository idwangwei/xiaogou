/**
 * Author 邓小龙 on 2015/8/28.
 * @description  统计service
 */

import services from './index';
import _ from 'underscore';
import _pluck from 'lodash.pluck';

import $ from 'jquery';
import _sortby from 'lodash.sortby';
import _findIndex from 'lodash.findindex';

import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import {
    FETCH_STUDY_STATIS
    ,FETCH_STUDY_STATIS_SUCCESS
    ,FETCH_STUDY_STATIS_FAILURE
    ,CHANGE_STUDY_STATIS_PARAMS
} from '../redux/action_typs';

services.service('workStatisticsService',
    function ($q, $log, $rootScope, $state, $ionicActionSheet, $ionicHistory, serverInterface, commonService, dateUtil, finalData,verticalService) {
        'ngInject';

        var me = this;

        this.limitQuery = {lastKey: '', quantity: 16}
        this.data = {//共享数据对象
            getWorkStuListFlag: false,//是否已调用后台接口获取作业学生的标志。
            getWorkFlag: false,//是否已调用后台接口获取作业学生答案的标志。
            showHandle: true,//是否显示统计操作按钮
            showQContext: {flag: false}, //是否加载试题内容
            stu:{}
        };
        this.wData = {//共享作业数据对象
            correctedPageScrollPosition: 0,
            unSubmittedPageScrollPosition: 0,
            notCorrectedPageScrollPosition: 0,
            clazzList: [],//班级列表
            queryParam: {},//查询参数公共对象
            queryWorkStuListParam: {},//查询参数作业学生列表对象
            queryErrorStuListParam: {},//查询参数作业学生列表对象
            rankListShow: {},//排名列表展示方式对象（作业|大题|小题）
            workList: [] //作业列表

        };
        this.sectionData = {};//区间学生共享数据
        this.studyStatisData = {};//学生统计对象
        this.scoreDistList = [];//成绩分布列表
        this.goToStatisPage = {//作业学生列表页面跳转到统计页面的标志 注意打开/关闭
            flag: false
        };
        this.data.showQContext = {flag: false};
        this.finishVacationMessages = [];//暑假作业消息列表数组

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

        this.clazzList = [];  //班级列表
        this.clazzArray = [];//班级数组
        this.pubWorkClazz = {name: null, id: null};

        this.selectAppraiseList = null;


        var SELECT_PRAISE_TIP = "请选择......";

        var SORT_NAME = {//班级学情的排序字段
            LEVEL: "level",
            UN_SUB: "unSubNum",
            UN_MISTAKE: "unMistakeNum",
            COMPLETE_CORRECT: "fullMarksNum",
            FIRST_FULL_MARKS: "firstFullMarksNum"
        };
        this.workDetailState = {};//作业详情页面State信息
        this.QInfo = {};//作业详情页面State信息

        /* /!**
         * 清空共享数据
         *!/
         this.clearData = function () {
         this.data = {};//共享数据对象
         };*/

        /**
         * 根据paperId获取paper
         */
        this.getPaperById = function () {
            var url = serverInterface.WORK_STU_DETAIL;
            var param = {
                id: me.wData.queryParam.paperId,
                publishType: me.wData.queryParam.publishType
            };

            if (param.publishType == 6) {
                url = serverInterface.FETCH_EDIT_PAPER_DETAIL;
                param.sourceId = param.id;
                delete param.id;
            }

            debugger
            commonService.commonPost(url, param).then(function (data) {
                if (data.code == 200) {
                    me.wData.currentWork.paper = data;
                    parseQuestion(data);

                    let paper = {};
                    paper.title = data.basic.title;
                    paper.description = data.basic.description;
                    paper.paperScore = data.basic.score;
                    paper.type = data.type;
                    paper.bigQList = data.qsTitles;

                    //TODO: ==start==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）
                    // paper.bigQList.length != 0 && paper.qsTitles.forEach((bigQ)=>{
                    //     bigQ.qsList.length != 0 && bigQ.qsList.forEach((smallQ)=>{
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
                }
            });
        };

        function parseQuestion (paper){
            paper.qsTitles = _sortby(paper.qsTitles, 'seqNum');
            paper.qsTitles.forEach((item)=> {
                item.bigQVoIndex = commonService.convertToChinese(item.seqNum + 1);
                item.qsList = _sortby(item.qsList, 'seqNum');
                item.qsList.forEach(qs=> {
                    qs.inputList=[];
                    let answerKey = JSON.parse(qs.answerKey);
                    let isVerticalSp = type=>type == VERTICAL_CALC_SCOREPOINT_TYPE || type == VERTICAL_ERROR_SCOREPOINT_TYPE || type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE;
                    let addMatrixToVerticalFormulaService = (anskey)=> {
                        anskey.scorePoints.forEach(sp=> {
                            let spInfo = {};
                            spInfo.spList = [];
                            sp.referInputBoxes.forEach(inputbox=> {
                                let uuid = inputbox.uuid;
                                let answerMatrixList = [];
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
                            qs.inputList.push(spInfo);
                        });
                    };
                    answerKey.forEach((ans)=> {
                        if (isVerticalSp(ans.type))
                            addMatrixToVerticalFormulaService(ans);
                    });
                });
            });
        }



        /**
         * 新版接口--根据目标作业下所有学生的答案
         */
        this.getPaperStusAns = function (selectWork) {
            me.data.getWorkFlag = true;//是否已调用后台接口获取作业学生答案的标志。
            paper.paperId = me.wData.queryParam.paperId;
            paper.paperInstanceId = me.wData.queryParam.paperInstanceId;
            var tempInfo = {
                "sIds": me.data.currentStu&&me.data.currentStu.stuId,
                "paper": {
                    "paperId": me.wData.queryParam.paperId,
                    "paperInstanceId": me.wData.queryParam.paperInstanceId
                }
            };
            /*测评需要传入type区分*/
            if(selectWork.publishType==16){
                tempInfo.paper.type=selectWork.paperType;
            }
            var tranParam = {
                filter: JSON.stringify(tempInfo)
            };
            var defer = $q.defer();
            commonService.commonPost(serverInterface.GET_STUDENT_ANS, tranParam).then(function (data) {
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
                    paper.title = data.basic.title;
                    paper.description = data.basic.description;
                    paper.paperScore = data.basic.score;
                    paper.type = data.type;
                    paper.qsTitles = arraySort(data.qsTitles, finalData.BIG_Q_SORT_FIELD);

                    paper.questionHistory = data.history;
                    paper.paperStuScores = paper.questionHistory.scores;//数组
                    paper.repeatSeq = data.history.repeatSeq;
                    bigQListParse(paper.qsTitles);//大题内部数据解析
                    paper.bigQArray = commonService.getRowColArray(paper.qsTitles, 2);
                    paper.bigQIndex = me.wData.rankListShow.bigQIndex || 0;//当前大题索引
                    paper.smallQIndex = me.wData.rankListShow.smallQIndex || 0;//当前小题索引
                    paper.bigQVoIndex = commonService.convertToChinese(paper.bigQIndex + 1);
                    paper.currentBigQ = paper.qsTitles[paper.bigQIndex];//当前大题
                    paper.currentBigQTitle = paper.qsTitles[paper.bigQIndex].title;//当前大题名称
                    paper.currentQ = paper.currentBigQ.qsList[paper.smallQIndex];//当前小题
                    paper.smallQCount = paper.currentBigQ.qsList.length;//当前小题个数
                    paper.bigQScore = paper.currentBigQ.score;//当前大题下的小题个数
                    paper.latestScore = data.history.latestScore;
                    paper.firstScore = data.history.firstScore;
                    paper.submitTime = data.history.submitTime;
                    paper.latestSubmitTime = data.history.latestSubmitTime;
                    paper.firstSubmitTime = data.history.firstSubmitTime;
                    paper.wasteTime = parseWasteTime(data.history.wasteTime);
                    paper.reworkTimes = data.history.reworkTimes;
                    //TODO: ==start==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）
                    // paper.qsTitles.length != 0 && paper.qsTitles.forEach((bigQ)=>{
                    //     bigQ.qsList.length != 0 && bigQ.qsList.forEach((smallQ)=>{
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
                    return
                }
                defer.resolve(false)
            });
            return defer.promise;
        };



        /**
         * 获取输入框和答案
         */
        this.getQReferAnswer = function (param,savantAnsFlag) {
            var defer = $q.defer();
            // var url = newAnsFlag ? serverInterface.GET_Q_REFER_ANSWER_FOR_NEW : serverInterface.GET_Q_REFER_ANSWER;
            var url = savantAnsFlag ? serverInterface.GET_Q_REFER_ANSWER_SAVANT : serverInterface.GET_Q_REFER_ANSWER_FOR_NEW;
            commonService.commonPost(url, param).then(function (data) {
               // console.log(data);
                if (data.code == 200) {
                    //me.data.referAnswers=data.referAnswers;
                    defer.resolve(data);
                    return;
                }
                defer.resolve(null);
            });
            return defer.promise;
        };

        /**
         * 根据作业id和作业批次
         * 获取发布的作业
         */
        this.getWork = function () {
            me.data.getWorkFlag = true;//是否已调用后台接口获取作业学生答案的标志。
            paper.paperId = me.wData.queryParam.paperId;
            paper.paperInstanceId = me.wData.queryParam.paperInstanceId;
            var tempInfo = {
                "sIds": me.data.currentStu.stuId,
                "paper": {
                    "paperId": me.wData.queryParam.paperId,
                    "paperInstanceId": me.wData.queryParam.paperInstanceId
                }
            };
            var tranParam = {
                filter: JSON.stringify(tempInfo)
            };
            commonService.commonPost(serverInterface.GET_STUDENT_ANS, tranParam).then(function (data) {
                if (data.code == 200) {
                    paper.title = data.basic.title;
                    paper.description = data.basic.description;
                    paper.paperScore = data.basic.score;
                    paper.type = data.type;
                    paper.bigQList = arraySort(data.qsTitles, finalData.BIG_Q_SORT_FIELD);
                    paper.history = data.history;
                    paper.paperStuScore = data.history.score;
                    paper.paperScoreRate = commonService.convertToPercent(data.history.score / data.basic.score, 0);
                    bigQListParse(paper.bigQList);//大题内部数据解析
                    paper.bigQArray = commonService.getRowColArray(paper.bigQList, 2);
                    paper.bigQIndex = me.wData.rankListShow.bigQIndex || 0;//当前大题索引
                    paper.smallQIndex = me.wData.rankListShow.smallQIndex || 0;//当前小题索引
                    paper.bigQVoIndex = commonService.convertToChinese(paper.bigQIndex + 1);
                    paper.currentBigQ = paper.bigQList[paper.bigQIndex];//当前大题
                    paper.currentBigQTitle = paper.bigQList[paper.bigQIndex].title;//当前大题名称
                    paper.currentQ = paper.currentBigQ.qsList[paper.smallQIndex];//当前小题
                    paper.smallQCount = paper.currentBigQ.qsList.length;//当前小题个数
                    paper.bigQScore = paper.currentBigQ.score;//当前大题下的小题个数
                    me.data.paper = paper;
                    me.data.showQContext = {flag: true};
                }
            });
        };
        /**
         * 为新加班级的学生重新发布之前发布过的作业
         */
        this.reDeliverWork = function (param) {
            let defer = $q.defer();
            commonService.commonPost(serverInterface.RE_DELIVER, param).then((res)=> {
                defer.resolve(res);
            });
            return defer.promise;
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
            if (type == "1") {//排序类型，0为降序，1为升序
                return _.sortBy(array, function (data) {
                    return -data[sortField];//降序
                });
            } else {
                return _.sortBy(array, function (data) {
                    return data[sortField];//升序
                });
            }

        }


        /**
         * 解析大题数组
         * @param bigQList 大题数组
         */
        function bigQListParse(bigQList) {

            _.each(bigQList, function (bigQ, index) {
                try {
                    bigQ.bigQStuScores = paper.questionHistory.id2QuestionGroupScore[bigQ.id].scores;//新版接口--当前大题学生的得分
                } catch (e) {
                    $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQ.id);
                }
                bigQ.bigQVoIndex = commonService.convertToChinese(bigQ.seqNum + 1);//当前大题展示题号，如1映射为一。
                bigQ.qsListNew = [];
                smallQListParse(bigQ);
                bigQ.qsList = arraySort(bigQ.qsList, finalData.BIG_Q_SORT_FIELD);
            });

        }

        /**
         * 解析小题数组
         * @param bigQ 大题
         */
        function smallQListParse(bigQ) {
            var bigQId = bigQ.id;
            var smallQList = bigQ.qsList;
            _.each(smallQList, function (smallQ) {
                ////var stuAns = paper.stuAnswer.questionId2ScorePoint[smallQ.id];//当前小题的学生答案
                smallQ.qContext = smallQ.qContext.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
                var answerKey = JSON.parse(smallQ.answerKey);//当前试题答案
                ////smallQ.stuAns = stuAns;
                smallQ.inputList = [];//小题下的所有输入框得id
                smallQ.smallQStuAnsList = [];
                smallQ.seqNum=parseInt(smallQ.seqNum);
                var smallQList_ = [];
                try {
                    smallQList_ = paper.questionHistory.id2QuestionGroupScore[bigQId].id2QuestionScore[smallQ.id];//当前小题学生的所做的答案数组
                } catch (e) {
                    $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id);
                }
                if (!smallQList_) {
                    $log.error("qbu的bug,这题学生一次没有做，不能传空数组!大题id:" + bigQId + "小题id:" + smallQ.id);
                    return false;
                }
                smallQ.smallQStuAnsMapList = smallQList_;
                sQansListParse(bigQId, answerKey, smallQ);
                var tempArray = [];
                _.each(smallQ.smallQStuAnsMapList, function (data) {
                    tempArray.push(data);
                });
                if (tempArray.length > 0) {
                    var lastDone = tempArray[tempArray.length - 1];
                    if (lastDone.score == 0) {//最后一次为0分
                        smallQ.passFlag = 0;
                    } else if (lastDone.score == smallQ.score) {//改正确了
                        smallQ.passFlag = 2;
                    } else {//半对
                        smallQ.passFlag = 1;
                    }
                }

            });
        }

        /**
         * 新接口--针对做了多次试题
         * @param bigQId
         * @param answerKey
         * @param smallQ
         */
        function sQansListParse(bigQId, answerKey, smallQ) {
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
                let addMatrixToVerticalFormulaService = (anskey)=> {
                    anskey.scorePoints.forEach(sp=> {
                        let spInfo = {};
                        //当前得分点历史得分记录
                        var spStu =  {};
                        try {
                            spStu = stuQAns.id2ScorePointScore[sp.uuid];
                            sp.spStuScore = spStu.score;//当前得分点学生的得分
                            spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                            spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                            spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                            spInfo.score = spStu.score;//该小题的得分点的得分
                        } catch (e) {
                            $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                            return true;
                        }
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
                                                matrix: matrixInfo[uuid],
                                                application:spStu.application,
                                                matrix:answerMatrix?answerMatrix: matrixInfo[uuid],
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
                                    inputBoxStuAns:spStu.answer
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
                            referAnswer(sp, spStu, smallQ, spList,ans.type);//处理答案关联
                            stuQAns.inputList.push(spInfo);
                            smallQ.inputList.push(spInfo);
                        });
                        //公开课测量尺寸，添加题型信息到小题中
                        if(ans.type === 'open_class_2' || ans.type === 'picture-drawing'){
                            smallQ.isOpenClass = true;
                        }
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
         * 解析答案 为统计
         * @param bigQId 当前大题id
         * @param answerKey 目标答案
         * @param smallQ 小题
         * @pram currentQAns 当前小题学生答案
         * @param inputList
         */
        function answerParseForStat(bigQId, answerKey, smallQ, currentQAns, inputList) {
            _.each(answerKey, function (ans, ansIndex) {//处理参考答案
                //ans.type  3种类型题
                _.each(ans.scorePoints, function (sp) {//处理得分点
                    var spStu = null;
                    try {
                        spStu = currentQAns.id2ScorePointScore[sp.uuid];//当前得分点
                        sp.spStuScore = spStu.score;//当前得分点学生的得分

                    } catch (e) {
                        $log.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
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
                    referAnswer(sp, spStu, smallQ, spList,ans.type);//处理答案关联
                    inputList.push(spInfo);

                });
            });
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
        function referAnswer(scorePoint, spStu, smallQ, spList,qType) {
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
                    if(qType=="line-match" || qType == 'open_class_2'){
                        spQInfo.inputBoxStuAns = spStu.answer;
                        // spQInfo.reverse = spStu.application;
                    }
                    // if(spStu.reverse) spQInfo.reverse = spStu.reverse;
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
            me.data.paper.bigQVoIndex = commonService.convertToChinese(bigQIndex + 1);//显示中文
        };

        /**
         * 获取已发布的作业列表
         */
        this.getPubedWorkList = function (archivedStatus) {
            var defer = $q.defer();
            var param = handlePubbedWorkListQuery(archivedStatus);//处理已发布的作业列表参数
            commonService.commonPost(serverInterface.PUBED_WORK_LIST, param).then(function (data) {
                if (data.code == 200) {
                    me.limitQuery.lastKey = data.lastKey;
                    me.wData.workList = me.wData.workList || [];
                    //var workList = [];
                    var workListLength = 0;
                    var lastSummerWorkIndex = -1;
                    angular.forEach(data.paperList, function (paperPub) {
                        angular.forEach(paperPub.subjects, function (paper) {
                            var paperInfo = {};
                            paperInfo.instanceId = paperPub.instanceId;
                            paperInfo.groupId = paperPub.groupId;
                            paperInfo.groupName = paperPub.groupName;
                            paperInfo.paperId = paper.subjectId;
                            paperInfo.isNew = paperPub.isNew;
                            //paperInfo.paperName = commonService.interceptName(paper.subjectSymbol, 10);
                            paperInfo.paperName = paper.subjectSymbol;
                            paperInfo.createTime = paperPub.createTime;
                            paperInfo.publishType = paperPub.publishType;
                            //paperInfo.publishType = workListLength<3?4:0;
                            paperInfo.publishWeek = paperPub.publishWeek;
                            paperInfo.submitNum = paper.submitNum;//提交的人数
                            paperInfo.totalNum = paper.totalNum;//总的人数
                            paperInfo.questionCount = paperPub.questionCount;//口算题的题量
                            paperInfo.limitTime = paperPub.limitTime;//口算题的时间
                            paperInfo.assigneeDisplay = paperPub.assigneeDisplaySet.length > 0 ? paperPub.assigneeDisplaySet.join("|") : "";//分层信息
                            me.wData.workList.push(paperInfo);
                            workListLength++;
                            //workList.push(paperInfo);
                        });
                    });
                    var newCount = 0;
                    angular.forEach(me.wData.workList, function (work, workIndex) {
                        work.isLastSummerWork = false;
                        if (work.isNew == 1)
                            newCount++;
                        if (lastSummerWorkIndex == -1)
                            lastSummerWorkIndex = work.publishType == 4 ? workIndex : lastSummerWorkIndex;
                    });
                    if (lastSummerWorkIndex > -1) {
                        var lastSummerWork = me.wData.workList[lastSummerWorkIndex];
                        lastSummerWork.createTime = lastSummerWork.createTime ? lastSummerWork.createTime.substring(0, 10) : lastSummerWork.createTime;
                        var workDate = new Date(lastSummerWork.createTime);
                        var lastDay = workDate.setDate(workDate.getDate() + 3);//3天后
                        var formatStr = dateUtil.dateFormat.prototype.DEFAULT_CHINA_DAY_FORMAT;//格式成“08月01日”
                        var lastDayFormatStr = dateUtil.dateFormat.prototype.format(new Date(lastDay), formatStr);
                        var showStr = "下次作业将于" + lastDayFormatStr + "发布";
                        lastSummerWork.lastSummerWork = showStr;
                        me.wData.workList.splice(lastSummerWorkIndex, 1, lastSummerWork);
                    }
                    defer.resolve(workListLength);
                    //me.wData.workList = commonService.getRowColArray(workList, 2);
                    //me.wData.workList = workList;
                    //if (data.paperList.length > 0) {
                    //    defer.resolve(true);
                    //} else {
                    //    defer.resolve(false);
                    //}
                } else {
                    defer.resolve(null);
                }
            });
            return defer.promise;

        };

        /**
         * 处理作业列表查询条件
         * return 返回查询条件
         */
        function handlePubbedWorkListQuery(archivedStatus) {
            var now = new Date();//当前时间
            var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATETIME_FORMAT;//格式成“2015-08-11”
            var nowDate = dateUtil.dateFormat.prototype.format(now, formatStr); //当前日期
            var firstDayOfMonth = me.getFirstDayOfMonth();
            var lastDayOfMonth = me.getLastDayOfMonth();
            var filter = {
                status: archivedStatus
                ///type: me.wData.queryParam.category //课堂还是家庭
            };
//            var timeObj = {};
//            var startTime = me.wData.queryParam.startTime;
//            var endTime = me.wData.queryParam.endTime;
//            if ((!startTime || startTime == "") && (!endTime || endTime == "")) {//开始日期和endTime都为空，
//                timeObj.startTime = "1990-01-01";
//                timeObj.endTime = nowDate;
//            } else if (startTime && (!endTime || endTime == "")) {
//                timeObj.startTime = me.wData.queryParam.startTime;
//                timeObj.endTime = nowDate;
//            } else if (endTime && (!startTime || startTime == "")) {
//                timeObj.startTime = "1990-01-01";
//                timeObj.endTime = me.wData.queryParam.endTime;
//            } else {
//                timeObj.startTime = me.wData.queryParam.startTime;
//                timeObj.endTime = me.wData.queryParam.endTime;
//            }
//            if (me.wData.queryParam.startTime) {//如果不过滤日期
//                if (me.wData.queryParam.clazzId) {//如果过滤班级不过滤日期
//                    filter.groupId = me.wData.queryParam.clazzId;
//                }
//            }
//            filter.time = timeObj;
            if (me.wData.queryParam.clazzId) {//如果过滤班级
                filter.groupId = me.wData.queryParam.clazzId;
            }
            filter.limitQuery = me.limitQuery;
            var param = {
                filter: JSON.stringify(filter)
            };
            return param;
        }

        /**
         * 获取当前日期
         */
        this.getCurrentDay = function () {
            var now = new Date();//当前时间
            var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATE_FORMAT;//格式成“2015-08”
            return dateUtil.dateFormat.prototype.format(now, formatStr); //当前月份
        };


        /**
         * 获取当前月份的第一天
         */
        this.getFirstDayOfMonth = function () {
            var firstDate = new Date();
            firstDate.setDate(1); //第一天
            var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATETIME_FORMAT;//格式成“2015-08-11”
            return dateUtil.dateFormat.prototype.format(firstDate, formatStr); //当前月份
        };

        /**
         * 获取当前月份的最后一天
         */
        this.getLastDayOfMonth = function () {
            var firstDate = new Date();
            firstDate.setDate(1); //第一天
            var endDate = new Date(firstDate);
            endDate.setMonth(firstDate.getMonth() + 1);
            endDate.setDate(0);
            var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATETIME_FORMAT;//格式成“2015-08-11”
            var lastDayOfMonth = dateUtil.dateFormat.prototype.format(endDate, formatStr); //当前月份的第一天
            return lastDayOfMonth; //当前月份
        };

        /**
         * 获取班级列表
         */
        this.getClassList = function () {
            commonService.commonPost(serverInterface.SELECT_CLAZZ_LIST).then(function (data) {
                me.wData.clazzList = data.classes;
            });
        };


        /**
         * 清空共享作业数据
         */
        this.clearAllData = function () {
            //this.wData = {};
            this.data = {//共享数据对象
                stu: {
                    notSubStus: [],//未提交的数组
                    correctedStus: [],//已批改的数组
                    notCorrectStus: [],//未批改的数组
                    correctedStusHigh: [],//已批改成绩高-低
                    correctedStusLow: []//已批改成绩低-高
                },
                getWorkStuListFlag: false,//是否已调用后台接口获取作业学生的标志。
                getWorkFlag: false,//是否已调用后台接口获取作业学生答案的标志。
                showQContext: {flag: false} //是否加载试题内容
            };
            this.wData = {//共享作业数据对象
                correctedPageScrollPosition: 0,
                unSubmittedPageScrollPosition: 0,
                notCorrectedPageScrollPosition: 0,
                clazzList: [],//班级列表
                queryParam: {},//查询参数对象
                queryWorkStuListParam: {},//查询参数作业学生列表对象
                rankListShow: {},//排名列表展示方式对象（作业|大题|小题）
                workList: [] //作业列表
            };
        };

        /**
         * 清空共享作业数据
         */
        this.clearData = function () {
            //this.wData = {};
            this.data.stu.notSubStus = [];//未提交的数组
            this.data.stu.correctedStus = [];//已批改的数组
            this.data.stu.notCorrectStus = [];//未批改的数组
            this.data.stu.correctedStusHigh = [];//已批改成绩高-低
            this.data.stu.correctedStusLow = [];//已批改成绩低-高
            this.data.paper = {};
            this.data.getWorkStuListFlag = false;//是否已调用后台接口获取作业学生的标志。
            this.data.getWorkFlag = false;//是否已调用后台接口获取作业学生答案的标志。this.data.showHandle:false,//是否显示统计操作按钮
            this.data.showQContext = {flag: false}; //是否加载试题内容
            /*this.data = {//共享数据对象
             stu:{
             notSubStus:[],//未提交的数组
             correctedStus:[],//已批改的数组
             notCorrectStus:[]//未批改的数组
             },
             getWorkStuListFlag:false,//是否已调用后台接口获取作业学生的标志。
             getWorkFlag:false,//是否已调用后台接口获取作业学生答案的标志。
             showHandle:false,//是否显示统计操作按钮
             showQContext:{flag: false} //是否加载试题内容
             };*/
        };


        /**
         * 获取某个作业下的学生列表
         */
        this.getWorkStuList = function () {
            var defer = $q.defer();
            me.data.getWorkStuListFlag = true;
            var param = handleWorkStuListQuery();//处理“获取某个作业下的学生列表”的参数
            commonService.commonPost(serverInterface.WORK_STU_LIST, param).then(function (data) {
                me.data.stu = {
                    notSubStus: [],//未提交的数组
                    correctedStus: [],//已批改的数组
                    notCorrectStus: [],//未批改的数组
                    correctedStusHigh: [],//已批改成绩高-低
                    correctedStusLow: []//已批改成绩低-高
                };
                if (data.code == 200) {
                    me.data.stu.totalScore = data.rank.totalScore;//总分
                    me.data.stu.average = data.rank.average;//平均分
                    angular.forEach(data.rank.rankList, function (item, index) {
                        item.studentPraise = null;
                        item.teacherPraise = null;
                        item.parentPraise = null;
                        _.each(item.encourage, function (praise) {
                            _.each(finalData.PRAISE_TYPE_LIST, function (info) {
                                handlePraisePriority(info, praise, item);
                            });
                        });
                        if (item.status == "4") {//已批改
                            item.first = item.scores[0];//第一次得分
                            item.last = item.scores[item.scores.length - 1];//最近一次得分
                            item.subCount = item.reworkTimes;//提交次数
                            item.reworkTimesVo = item.reworkTimes - 1;//改错次数
                            item.reworkTimesVo = item.reworkTimesVo <= 0 ? 0 : item.reworkTimesVo;
                            me.data.stu.correctedStus.push(item);
                        } else if (item.status == "3") {//未批改
                            me.data.stu.notCorrectStus.push(item);
                        } else {
                            me.data.stu.notSubStus.push(item);
                        }
                    });
                    me.data.stu.stuCount = data.rank.rankList.length;
                    me.data.stu.notSubStusLength = me.data.stu.notSubStus.length;
                    me.data.stu.correctedStusLength = me.data.stu.correctedStus.length;
                    me.data.stu.notCorrectStusLength = me.data.stu.notCorrectStus.length;
                    if (me.data.stu.correctedStusLength && me.data.stu.correctedStusLength > 0) {//如果已批改人数大于0,显示统计操作
                        me.data.showHandle = true;
                    }
                    //构造两个成绩排序数组，高-低 和 低-高
                    var tempHigh = _.sortBy(me.data.stu.correctedStus, function (data) {
                        return -data.updateTime;
                    });
                    me.data.stu.correctedStusHigh = tempHigh;
                    var tempLow = _.sortBy(me.data.stu.correctedStus, function (data) {
                        return data.updateTime;
                    });
                    me.data.stu.correctedStusLow = tempLow;
                    me.refreshStuList();
                    //var colCount = commonService.getFlexRowColCount();
                    //me.data.stu.notSubStus = commonService.getRowColArray(me.data.stu.notSubStus, colCount);
                    //me.data.stu.correctedStus = tempHigh;
                    //me.data.stu.notCorrectStus = commonService.getRowColArray(me.data.stu.notCorrectStus, colCount);
                    me.data.stu.totalNum = data.rank.totalNum;//参与统计的人数

                }
                defer.resolve(true);
            });
            return defer.promise;
        };

        /**
         * 处理评价的优先级，即又奖励又有评价反馈，默认奖励
         * @info 码表对象
         * @praise 接口存储评价对象
         * @item 目标存储对象
         */
        function handlePraisePriority(info, praise, item) {
            if (info.type == praise) {
                if (info.type >= 1 && info.type <= 5) {
                    item.teacherPraise = info;
                } else if (info.type == 6 && !item.teacherPraise) {
                    item.teacherPraise = info;
                } else if (info.type >= 7 && info.type <= 9) {
                    item.parentPraise = info;
                } else if (info.type == 10 && !item.parentPraise) {
                    item.parentPraise = info;
                } else if (info.type >= 102 && info.type <= 105) {
                    item.studentPraise = info;
                } else if (info.type >= 101 && !item.studentPraise) {
                    item.studentPraise = info;
                }
            }
        }

        /**
         * 处理“获取某个作业下的学生列表”的参数
         * return 返回参数
         */
        function handleWorkStuListQuery() {
            var filter = {
                paper: me.wData.queryWorkStuListParam
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            return param;
        }


        /**
         * 获取试题下的错误学生列表
         */
        this.getErrorStuList = function () {
            me.wData.workErrorStu = {};//作业错误学生对象
            var filter = {
                paper: me.wData.queryWorkStuListParam
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            commonService.commonPost(serverInterface.WORK_STU_LIST, param).then(function (data) {
                if (data.code == 200) {
                    me.wData.workErrorStu.totalScore = data.rank.totalScore;//总分
                    me.wData.workErrorStu.average = data.rank.average;//平均分
                    me.wData.workErrorStu.errorStuList = [];//错误学生列表
                    angular.forEach(data.rank.rankList, function (item, index) {
                        if (item.status == "4" && item.score != data.rank.totalScore) {//已批改,并且没有得满分的情况
                            me.wData.workErrorStu.errorStuList.push(item);
                        }
                    });
                    //构造两个成绩排序数组，高-低 和 低-高
                    var tempHigh = _.sortBy(me.wData.workErrorStu.errorStuList, function (data) {
                        return -data.score;
                    });
                    me.wData.workErrorStu.errorStuListHigh = tempHigh;
                    var tempLow = _.sortBy(me.wData.workErrorStu.errorStuList, function (data) {
                        return data.score;
                    });
                    me.wData.workErrorStu.errorStuListLow = tempLow;
                    me.wData.workErrorStu.totalNum = data.rank.totalNum;//参与统计的人数


                }
            });
        };

        /**
         * 老师回收作业
         */
        /*this.cellectPaperByT=function(){
         var title="信息提示";
         var contentTemplate="确定要回收这个作业吗？";
         commonService.showConfirm(title,contentTemplate).then(function(res){
         if(res){
         var param={
         paperInstanceId:me.wData.queryParam.paperInstanceId,
         subjectId:me.wData.queryParam.paperId,
         subjectType:1
         };
         commonService.commonPost(serverInterface.PAPER_SUBMIT,param).then(function(data){
         if(data.code==200){
         commonService.alertDialog("这个作业已回收成功!");
         //以下刷新学生列表，刷新失效
         //以下刷新学生列表，
         me.data.getWorkStuListFlag=false;
         me.wData.queryWorkStuListParam={};//查询参数作业学生列表对象
         me.wData.queryWorkStuListParam.paperId=me.wData.queryParam.paperId;
         me.wData.queryWorkStuListParam.paperInstanceId=me.wData.queryParam.paperInstanceId;
         me.wData.queryParam.showTipName="整个作业";
         me.clearData();//先初始化data
         me.getWorkStuList();//重新加载学生列表
         me.wData;
         me.data;
         //$state.go("work_student_list");
         }
         });
         }
         });
         };*/

        /**
         * 老师回收作业
         * @param param
         * @returns {promise}
         */
        this.paperSubmit = function (param) {
            return commonService.commonPost(serverInterface.PAPER_SUBMIT, param);
        };

        /**
         * 跳转到作业批改页面，参数刷新
         * @param record 当前小题内容
         * @param seqnum 当前小题索引
         * @param bigQSeqnum 当前大题索引
         * @param bigQindexVo_ 当前大题展示号
         */
        this.refreshCorrectQ = function (record, seqnum, bigQSeqnum, bigQindexVo_, doneIndex, doneInfo, key) {
            me.data.paper.currentQ = record;
            me.data.paper.currentQ.inputList = record.smallQStuAnsMapList[key].inputList;
            me.data.paper.smallQIndex = seqnum;
            me.data.paper.doneIndex = doneIndex;
            me.data.paper.bigQIndex = bigQSeqnum;
            me.data.paper.currentQStuScore = doneInfo.score;
            var str = " 或者 ";
            if (bigQSeqnum == 'false') {
                me.data.paper.bigQIndexVo = bigQindexVo_;
            } else {
                me.data.paper.bigQIndexVo = commonService.convertToChinese(bigQSeqnum + 1);
            }
            var answerKey = JSON.parse(record.answerKey);
            me.data.paper.currentQ.ans = {//当前小题的参考答案对象
                match: false,//题型是否为匹配型
                rowArray: []//答案列表
            };
            for (var i = 0; i < answerKey.length; i++) {
                var ansKey = answerKey[i];
                if (ansKey.type == "difference") {
                    for (var j = 0; j < ansKey.answerList.length; j++) {
                        var ans = ansKey.answerList[j].expr;
                        var rolArray = [];//列数组
                        //rolInfo.rolArray=ans.split("#");
                        var tempArray = ans.split("#");
                        _.each(tempArray, function (item, index) {
                            rolArray.push(item);
                        });

                        me.data.paper.currentQ.ans.rowArray.push(rolArray);
                    }
                } else if (ansKey.type == "standalone") {
                    for (var l = 0; l < ansKey.scorePoints.length; l++) {
                        var scorePoints = ansKey.scorePoints[l];
                        if (scorePoints.answerList.length > 0) {
                            var rolArray = [];//列数组
                            var ansValue = "";
                            for (var k = 0; k < scorePoints.answerList.length; k++) {
                                var ans = scorePoints.answerList[k];
                                var colInfo = {};
                                var tempArray = ans.expr.split("#");
                                /* var tempArray=ans.split("#");
                                 if(tempArray.length>0){
                                 _.each(tempArray,function(item,index){
                                 var colInfo={};
                                 colInfo.index=index;
                                 colInfo.value=item;
                                 rolArray.push(colInfo);
                                 });
                                 }*/
                                _.each(tempArray, function (item, index) {
                                    ansValue += item + " ";
                                });
                                ansValue += str;
                                /*  colInfo.index=index;
                                 colInfo.value=ans.expr;
                                 rolArray.push(colInfo);*/
                            }
                            ansValue = ansValue.substring(0, ansValue.length - str.length);
                            rolArray.push(ansValue);
                            me.data.paper.currentQ.ans.rowArray.push(rolArray);
                        }
                    }
                } else if (ansKey.type == "match") {
                    me.data.paper.currentQ.ans.match = true;
                    for (var g = 0; g < ansKey.answerList.length; g++) {
                        var ans = ansKey.answerList[g];
                        var rolArray = [];//列数组
                        for (var h = 0; h < ans.length; h++) {
                            rolArray.push(ans[h].expr);
                        }
                        //$scope.answer+=ans;
                        me.data.paper.currentQ.ans.rowArray.push(rolArray);

                    }
                }

            }
        };

        /**
         * 作业详情设置锚点
         * @param id
         */
        this.setWorkDatailAnchorId = function (id) {
            if (id) {
                if (!me.wData.rankListShow.showTipType || me.wData.rankListShow.showTipType == "1") {
                    return id + "|paper";
                }
                if (me.wData.rankListShow.showTipType == "2") {
                    return id + "|bigQ";
                }
                if (me.wData.rankListShow.showTipType == "3") {
                    return id + "|smallQ";
                }
            }

        };

        this.getPraiseList = function () {
            commonService.commonPost(serverInterface.SELECT_APPRAISE_LIST).then(function (data) {
                if (data.code == 200) {
                    me.selectAppraiseList = data.default;
                }
            });
        };

        /**
         * 获取评价反馈明细
         */
        this.getPraiseDetail = function (showType) {
            var paramInfo = {
                "workInstanceId": me.wData.queryParam.paperInstanceId,
                "workId": me.wData.queryParam.paperId
            };
            var filter = {
                work: paramInfo,
                sIds: me.data.correctedPraise.correctedStu.id
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            var url = "";
            if (showType == 1) {
                url = serverInterface.GET_APPRAISE_DATA_S;
            }
            if (showType == 3) {
                url = serverInterface.GET_APPRAISE_DATA_P;
            }
            commonService.commonPost(url, param).then(function (data) {
                if (data.code == 200) {
                    var lastPraise = data.appraises[0];
                    if (!lastPraise) {
                        $log.error("点击获取评价明细，最近一次评价给空");
                        return;
                    }
                    if (showType == 3) {
                        var messagePList = JSON.parse(lastPraise.messageP);
                        me.data.correctedPraise.parentMsgList = [];
                        _.each(messagePList, function (messageInfo) {
                            var pMsgInfo = {};
                            pMsgInfo.pName = messageInfo.username;
                            pMsgInfo.message = decodeURI(messageInfo.message);
                            pMsgInfo.gender = messageInfo.parentGender;
                            pMsgInfo.headImg = messageInfo.parentGender == '0' ? finalData.PARENT_F_IMG : finalData.PARENT_M_IMG;
                            me.data.correctedPraise.parentMsgList.push(pMsgInfo);
                        });
                    } else if (showType == 1) {
                        me.data.correctedPraise.stuMsgList = [];
                        angular.forEach(lastPraise.encourage, function (code) {
                            if (code <= 105 && code >= 102)
                                angular.forEach(finalData.PRAISE_TYPE_LIST, function (praise) {
                                    if (praise.type == code) {
                                        var stuInfo = {};
                                        stuInfo.stuName = lastPraise.studentName;
                                        stuInfo.message = praise.msg;
                                        stuInfo.gender = lastPraise.studentGender;
                                        stuInfo.headImg = lastPraise.studentGender == '0' ? finalData.STU_F_IMG : finalData.STU_M_IMG;
                                        me.data.correctedPraise.stuMsgList.push(stuInfo);
                                    }
                                });
                        });
                        if (lastPraise.messageS) {
                            var stuInfo = {};
                            stuInfo.stuName = lastPraise.studentName;
                            stuInfo.message = decodeURI(lastPraise.messageS);
                            stuInfo.gender = lastPraise.studentGender;
                            stuInfo.headImg = lastPraise.studentGender == '0' ? finalData.STU_F_IMG : finalData.STU_M_IMG;
                            me.data.correctedPraise.stuMsgList.push(stuInfo);
                        }

                    }
                }
            });
        };

        /**
         * 获取评价选择语
         */
        this.getPraiseSelectList = function () {
            me.data.praiseTypeList = [];//老师表扬类型，来自于PRAISE_TYPE_LIST的1-5
            me.data.currentStu.praiseTempList = me.selectAppraiseList;
            me.data.currentStu.praiseList = [];
            var paramInfo = {
                //"workType": me.wData.queryParam.workType,
                //"appraiseType": me.data.currentStu.appraiseType,
                "workInstanceId": me.wData.queryParam.paperInstanceId,
                "workId": me.wData.queryParam.paperId
            };
            var filter = {
                work: paramInfo,
                sIds: me.data.currentStu.stuId
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            commonService.commonPost(serverInterface.GET_APPRAISE_DATA, param).then(function (data) {
                if (data.code == 200) {
                    if (data.appraises && data.appraises.length > 0) {
                        var praiseInfo = data.appraises[0];//取的最近一次的表扬。
                        me.data.currentStu.praiseId = praiseInfo.id;//评价表主键
                        if (praiseInfo.encourage && praiseInfo.encourage.length > 0) {
                            try {
                                praiseInfo.messageT = praiseInfo.messageT || "";
                                document.getElementById("teacherPraise").value = decodeURI(praiseInfo.messageT);
                                _.each(finalData.PRAISE_TYPE_LIST, function (item) {
                                    item.selected = false;
                                });
                                _.each(finalData.PRAISE_TYPE_LIST, function (item) {
                                    if (item.type <= 5) {
                                        var tempFlag = false;
                                        _.each(praiseInfo.encourage, function (data) {
                                            if (item.type == data) {
                                                tempFlag = true;
                                                return true;
                                            }
                                        });
                                        if (tempFlag) {
                                            var temp = {};
                                            temp.type = item.type;
                                            temp.text = item.text;
                                            temp.img = item.img;
                                            temp.selected = true;
                                            me.data.praiseTypeList.push(temp);
                                        } else {
                                            me.data.praiseTypeList.push(item);
                                        }
                                    }
                                });
                            } catch (e) {
                                $log.log("解析表扬错误!");
                            }
                        } else {
                            if (!me.data.praiseTypeList || me.data.praiseTypeList.length <= 0) {
                                _.each(finalData.PRAISE_TYPE_LIST, function (item) {
                                    if (item.type <= 5) {
                                        item.selected = false;
                                        me.data.praiseTypeList.push(item);
                                    }
                                });
                            }
                        }
                    } else {
                        _.each(finalData.PRAISE_TYPE_LIST, function (item) {
                            if (item.type <= 5) {
                                item.selected = false;
                                me.data.praiseTypeList.push(item);
                            }
                        });
                    }
                }
            });
            angular.forEach(me.data.currentStu.praiseTempList, function (item, index) {
                var info = {};
                info.id = index;
                info.value = item;
                me.data.currentStu.praiseList.push(info);
            });
        };

        /**
         * 保存评价
         * @param content 评价内容
         */
        this.savePraise = function (content) {
            var personCount = me.data.stu.stuSelectedList.length;
            var validateFlag = true;
            if (personCount <= 0) {
                commonService.alertDialog("没有要评价的学生!");
                return false;
            }
            if (personCount > 5 && me.cBAmazingFlag) {//最大进步奖提示
                var comfirmData = "你确定要将最大进步奖发给" + me.data.stu.stuSelectedList.length + "个人";
                commonService.showConfirm(undefined, comfirmData).then(function (res) {
                    if (res) {

                    } else {
                        validateFlag = false;
                    }
                });
            }
            if (!validateFlag) {
                return false;
            }
            var saveContent = content || "";
            var appraisedId = _pluck(me.data.stu.stuSelectedList,'id').join(',');
            var encourage = [];
            var contentMsg = "";
            _.each(me.data.praiseTypeList, function (praiseType) {
                if (praiseType.selected) {
                    encourage.push(praiseType.type);
                    contentMsg = praiseType.msg;
                }
            });
            if (saveContent && saveContent != "") {
                encourage.push(6);//表示有评价语
            }
            saveContent = saveContent.trim() == "" ? contentMsg : saveContent;

            if(!saveContent || !encourage.length){return commonService.alertDialog("评价为空!");}

            var appraise = {
                "studentIds": appraisedId,      //被评价人
                "workInstanceId": me.wData.queryParam.paperInstanceId,   //评价相关作业试卷游戏的批次
                "workId": me.wData.queryParam.paperId,   //作业/游戏组ID
                "messageT": encodeURI(saveContent),  //评价内容，可以是评语或者声音文件路径
                "encourage": encourage    //奖励[鼓励]方式列表
            };
            var tranParam = {
                appraise: JSON.stringify(appraise)
            };
            commonService.commonPost(serverInterface.SAVE_APPRAISE, tranParam).then(function (data) {
                if (data.code == 200) {
                    commonService.alertDialog("发送成功!");
                    $ionicHistory.goBack();
                }
            });
        };

        /**
         * 获取作业统计信息
         */
        this.getWorkStatistics = function () {
            var filter = {
                "paper": {
                    "paperInstanceId": me.wData.queryParam.paperInstanceId,
                    "paperId": me.wData.queryParam.paperId
                }
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            commonService.commonPost(serverInterface.ANALYSIS_PAPER, param).then(function (data) {
                if (data.code == 200) {
                    var workAnalysis = {};//作业统计对象
                    workAnalysis.paperTitle = data.basic.title;//作业标题
                    workAnalysis.paperScore = data.basic.score;//作业分数
                    workAnalysis.bigQCount = data.qsTitles.length;//作业里的大题个数
                    workAnalysis.stuCount = data.analysis.totalNum;//班级人数
                    workAnalysis.totalNum = data.analysis.gradedNum;//统计人数，即批改人数
                    workAnalysis.average = data.analysis.average;//平均分数
                    workAnalysis.bigQList = arraySort(data.qsTitles, finalData.BIG_Q_SORT_FIELD);
                    bigQAnalysis(workAnalysis.bigQList, data.analysis);
                    me.wData.workAnalysis = workAnalysis;
                }
            });
        };
        /**
         * 获取作业统计信息
         */
        this.getWorkStatisticsRepeat = function () {
            var filter = {
                "paper": {
                    "paperInstanceId": me.wData.queryParam.paperInstanceId,
                    "paperId": me.wData.queryParam.paperId
                }
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            commonService.commonPost(serverInterface.ANALYSIS_PAPER_REPEAT, param).then(function (data) {
                if (data.code == 200) {
                    var paperData = me.wData.currentWork.paper;
                    var workAnalysis = {};//作业统计对象totalNum\
                    workAnalysis.totalNum = data.totalNum;
                    workAnalysis.paper = paperData;
                    workAnalysis.first = data.first;
                    workAnalysis.latest = data.latest;
                    workAnalysis.first.average = workAnalysis.first.average.toFixed(1);
                    workAnalysis.latest.average = workAnalysis.latest.average.toFixed(1);
                    workAnalysis.first.averageRate = commonService.convertToPercent(workAnalysis.first.average / paperData.basic.score, 1);
                    workAnalysis.latest.averageRate = commonService.convertToPercent(workAnalysis.latest.average / paperData.basic.score, 1)
                    workAnalysis.bigQList = arraySort(workAnalysis.paper.qsTitles, finalData.BIG_Q_SORT_FIELD);
                    bigQAnalysis(workAnalysis.bigQList, data);
                    me.wData.workAnalysis = workAnalysis;
                }
            });
        };

        /**
         * 作业下的大题统计分析
         * @param bigQList 传入的大题列表
         * @param analysisData 统计的信息
         */
        function bigQAnalysis(bigQList, analysisData) {
            _.each(bigQList, function (bigQ) {
                bigQ.firstAverage = analysisData.first.questionGroups[bigQ.id].average.toFixed(1);
                bigQ.latestAverage = analysisData.latest.questionGroups[bigQ.id].average.toFixed(1);
                bigQ.firstAverageRate = commonService.convertToPercent(bigQ.firstAverage / bigQ.score, 1);
                bigQ.latestAverageRate = commonService.convertToPercent(bigQ.latestAverage / bigQ.score, 1)
                bigQ.smallQCount = bigQ.qsList.length;//小题个数
                bigQ.showNum = commonService.convertToChinese(bigQ.seqNum + 1);
                bigQ.qsList = arraySort(bigQ.qsList, finalData.BIG_Q_SORT_FIELD);
                smallQAnalysis(bigQ.qsList, analysisData, bigQ.id);
            });
        }

        /**
         * 作业下的某一个大题下的小题统计分析
         * @param smallQList 传入的小题列表
         * @param analysisData 统计的信息
         * @param bigQId 当前大题id
         */
        function smallQAnalysis(smallQList, analysisData, bigQId) {
            var firstData = analysisData.first.questionGroups[bigQId];
            var latestData = analysisData.latest.questionGroups[bigQId];
            _.each(smallQList, function (smallQ) {
                smallQ.statList = [];
                var firstInfo = {};
                var latestInfo = {};
                firstInfo.showText = "首次做";
                latestInfo.showText = "改错后";
                firstInfo.averageScore = firstData.questions[smallQ.id].averageScore.toFixed(1);//平均得分
                latestInfo.averageScore = latestData.questions[smallQ.id].averageScore.toFixed(1);//平均得分
                firstInfo.scoreRate = commonService.convertToPercent(smallQ.firstAverageScore / smallQ.score, 1);//平均得分率
                latestInfo.scoreRate = commonService.convertToPercent(smallQ.latestAverageScore / smallQ.score, 1);//平均得分率
                firstInfo.correctNum = firstData.questions[smallQ.id].correctNum;//得满分的人数
                latestInfo.correctNum = latestData.questions[smallQ.id].correctNum;//得满分的人数
                firstInfo.wrongNum = firstData.questions[smallQ.id].wrongNum;//全错的人数
                firstInfo.incorrectScale = firstData.questions[smallQ.id].incorrectScale;//全错的人数所占的百分比
                latestInfo.incorrectScale = latestData.questions[smallQ.id].incorrectScale;//全错的人数所占的百分比
                latestInfo.wrongNum = latestData.questions[smallQ.id].wrongNum;//全错的人数
                firstInfo.wrongStus = firstData.questions[smallQ.id].wrongStus;//错误学生列表
                latestInfo.wrongStus = latestData.questions[smallQ.id].wrongStus;//错误学生列表
                if (firstInfo.averageScore == smallQ.score || latestInfo.averageScore == smallQ.score) {//如果都相等
                    smallQ.passFlag = 2;
                } else if (latestInfo.averageScore == 0) {
                    smallQ.passFlag = 0;
                } else {
                    smallQ.passFlag = 1;
                }
                firstInfo.index = 1;
                latestInfo.index = 2;
                smallQ.statList.push(firstInfo);
                smallQ.statList.push(latestInfo);
            });
        }

        /**
         * 获取错误学生列表的试题
         * @param smallQ
         * @param bigQ当前大题
         * @param stat
         */
        this.getErrorStusQ = function (smallQ, bigQ, stat) {
            var sIds = "";
            _.each(me.wData.currentWrongStus, function (stu, index) {
                sIds += index + ",";
            });
            sIds = sIds.substring(0, sIds.length - 1);
            var filter = {
                sIds: sIds,
                paper: {
                    "paperInstanceId": me.wData.queryParam.paperInstanceId,
                    "paperId": me.wData.queryParam.paperId,
                    "questionId": smallQ.id
                }
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            commonService.commonPost(serverInterface.GET_ERROR_STU_Q, param).then(function (data) {
                if (data.code == 200) {
                    smallQ.qContext = smallQ.qContext.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
                    var answerKey = JSON.parse(smallQ.answerKey);//当前试题答案
                    /*  me.wData.currentWrongStus=_.sortBy(me.wData.currentWrongStus,function(data){
                     return -data.score;
                     });*/
                    _.each(me.wData.currentWrongStus, function (stu, index) {
                        //debugger;
                        stu.currentQ = smallQ;
                        stu.inputList = [];
                        //stu.currentQ=smallQ;
                        //stu.currentQ.inputList = [];//小题下的所有输入框得id
                        var smallQDoneTimes = data[index].id2QuestionGroupScore[bigQ.id].id2QuestionScore[smallQ.id];
                        var temp = [];
                        _.each(smallQDoneTimes, function (data) {
                            temp.push(data);
                        });
                        if (stat.index == 1) {//表示第一次
                            stu.showStatus = 1;
                            stu.currentQAns = temp[0];

                        } else {//最后一次
                            stu.showStatus = 2;
                            stu.currentQAns = temp[temp.length - 1];
                        }
                        answerParseForStat(bigQ.id, answerKey, stu.currentQ, stu.currentQAns, stu.inputList);
                    });
                }
            });
        };

        /**
         * 显示学生列表排序
         * @param info 展示对象
         */
        this.showStuListSort = function (info) {
            var hideSheet = $ionicActionSheet.show(info);
        };

        /**
         * 显示大题排序
         */
        this.showPaperBigQSort = function () {
            var hideSheet = $ionicActionSheet.show({
                /* titleText: "学生成绩排序",*/
                buttons: [
                    {text: "<b class='ion-arrow-down-c'>先看错的</b>"},
                    {text: "<b class='ion-arrow-up-c'>先看对的</b>"},
                    /* {text: "<b class='ion-arrow-up-c'>正常</b>"}*/
                ],
                buttonClicked: function (index) {
                    hideSheet();//点击编辑菜单后，就隐藏编辑菜单。
                    if (index == 0) {//说明点击了“先看错的”排序
                        me.data.paper.bigQListCopy = me.data.paper.bigQList;
                        var temp = _.sortBy(me.data.paper.bigQListCopy, function (data) {
                            return data.bigQStuScore / data.score;
                        });
                        me.data.paper.bigQList = temp;
                    } else if (index == 1) {
                        me.data.paper.bigQListCopy = me.data.paper.bigQList;
                        var temp = _.sortBy(me.data.paper.bigQListCopy, function (data) {
                            return -(data.bigQStuScore / data.score);
                        });
                        me.data.paper.bigQList = temp;
                    } else {
                        me.data.paper.bigQList = me.data.paper.bigQListCopy;
                    }
                },
                cancelText: "<b class='ion-forward'>取消</b>"
            });
        };

        /**
         * 显示更多的操作选项
         */
        this.workStuMoreHandle = function () {
            var hideSheet = $ionicActionSheet.show({
                /* titleText: "学生成绩排序",*/
                buttons: [
                    {text: "<b class='ion-arrow-down-c'>强制回收作业</b>"},
                    {text: "<b class='ion-arrow-up-c'>通知回收作业</b>"},
                    {text: "<b class='ion-ios-loop-strong'>开启列表刷新</b>"}
                ],
                buttonClicked: function (index) {
                    hideSheet();//点击编辑菜单后，就隐藏编辑菜单。
                    if (index == 0) {//说明点击了“先看错的”排序
                        me.handleCellectPaperBtnClick();
                        return;
                    } else if (index == 2) {
                        me.data.refreshListFlag = true;
                    } else {
                        return;
                    }
                },
                cancelText: "<b class='ion-forward'>取消</b>"
            });
        }

        /**
         * 作业学生评价，勾选学生点击确定，事件处理
         * @param notSubmitFlag 已批改标志
         */
        this.handlePraiseSureBtn = function (notSubmitFlag) {
            me.data.stu.stuSelectedList = [];
            if (notSubmitFlag) {
                _.each(me.data.stu.notSubStus, function (stu) {
                    if (stu.selected) {
                        me.data.stu.stuSelectedList.push(stu);
                    }
                });
            } else {
                _.each(me.data.stu.correctedStus, function (stu) {
                    if (stu.selected) {
                        me.data.stu.stuSelectedList.push(stu);
                    }
                });
            }

            if (me.data.stu.stuSelectedList.length <= 0) {
                commonService.alertDialog("请先勾选学生!", 1500);
                return false;
            }
            /* _.each(me.data.stu.correctedStus,function(stu){//所有学生都隐藏选择框
             stu.praiseFlag=false;
             stu.selected=false;
             });*/
            //以下刷新学生列表，
            me.data.getWorkStuListFlag = false;
            me.wData.queryWorkStuListParam = {};//查询参数作业学生列表对象
            me.wData.queryWorkStuListParam.paperId = me.wData.queryParam.paperId;
            me.wData.queryWorkStuListParam.paperInstanceId = me.wData.queryParam.paperInstanceId;
            me.wData.queryParam.showTipName = "整个作业";
            this.clearData();//先初始化data
            me.data.praiseFlag = false;//是否点击了评价按钮
            $state.go('work_praise');
        };

        /**
         * 评价学生点击取消,事件处理
         */
        this.handlePraiseUndoBtn = function () {
            me.data.praiseFlag = false;//是否点击了评价按钮
            _.each(me.data.stu.correctedStus, function (stu) {//取消的时候，就将之前所选设为初始化
                stu.selected = false;
                stu.praiseFlag = false;
            });
            _.each(me.data.stu.notSubStus, function (stu) {
                stu.selected = false;
            });
            _.each(me.sectionData.sectionStudentList,(stu)=>{
                stu.selected = false;
            });
        };


        /**
         * 评价学生,勾选了多个，但点击了某一个学生进行修改
         */
        this.selectOnePraise = function (currentStu) {
            _.each(me.data.stu.correctedStus, function (stu) {//将不是当前学生的，进行初始化
                if (stu.id != currentStu.id) {
                    stu.selected = false;
                    stu.praiseFlag = false;
                }
            });

        };

        /**
         * 评价学生点击全选,事件处理
         */
        this.handlePraiseAllBtn = function (notSubmitFlag,sectionStuList) {
            if (notSubmitFlag) {
                _.each(me.data.stu.notSubStus, function (stu) {
                    stu.selected = sectionStuList ? _findIndex(sectionStuList,{id:stu.id}) != -1 :true;
                });
            } else {
                _.each(me.data.stu.correctedStus, function (stu) {
                    stu.selected = sectionStuList ? _findIndex(sectionStuList,{id:stu.id}) != -1 :true;
                });
                _.each(me.sectionData.sectionStudentList,(stu)=>{
                    stu.selected = sectionStuList ? _findIndex(sectionStuList,{id:stu.id}) != -1 :true;
                });
            }
        };
        /**
         * 评价学生点击取消全选,事件处理
         */
        this.handleUndoPraiseAllBtn = function (notSubmitFlag) {
            if (notSubmitFlag) {
                _.each(me.data.stu.notSubStus, function (stu) {
                    stu.selected = false;
                });
            } else {
                _.each(me.data.stu.correctedStus, function (stu) {
                    stu.selected = false;
                });
                _.each(me.sectionData.sectionStudentList,(stu)=>{
                    stu.selected = false;
                });
            }
        };


        /**
         * 显示大题排序
         */
        this.showErrorStuListSort = function () {
            var hideSheet = $ionicActionSheet.show({
                /* titleText: "学生成绩排序",*/
                buttons: [
                    {text: "<b class='ion-arrow-down-c'>分数(高-低)</b>"},
                    {text: "<b class='ion-arrow-up-c'>分数(低-高)</b>"}
                ],
                buttonClicked: function (index) {
                    hideSheet();//点击编辑菜单后，就隐藏编辑菜单。
                    if (index == 0) {//说明点击了“先看错的”排序
                        me.wData.currentWrongStusCopy = me.wData.currentWrongStus;
                        var temp = _.sortBy(me.wData.currentWrongStusCopy, function (data) {
                            return -data.score;
                        });
                        me.wData.currentWrongStus = temp;
                    } else {
                        me.wData.currentWrongStusCopy = me.wData.currentWrongStus;
                        var temp = _.sortBy(me.wData.currentWrongStusCopy, function (data) {
                            return data.score;
                        });
                        me.wData.currentWrongStus = temp;
                    }
                },
                cancelText: "<b class='ion-forward'>取消</b>"
            });
        }

        /**
         * 成绩分布
         */
        this.getScoreDist = function (paperInstanceId,paperId) {
            var filter = {
                "paper": {
                    "paperInstanceId":paperInstanceId,
                    "paperId": paperId
                }
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            me.wData.totalNum = 0;
            commonService.commonPost(serverInterface.GET_SCORE_DIST, param).then(function (data) {
                if (data && data.code == 200) {
                    me.wData.totalNum = data.totalNum;
                    let arr=["满分","优秀","良","及格","不及格"];
                    data.scoreDistribution && data.scoreDistribution.forEach((v,k)=>{
                        v.labelCN=arr[k];
                    });
                    me.wData.scoreDistList = data.scoreDistribution;
                }
            });
        }

        /**
         * 作业学生列表初始化
         */
        this.workStuListShowFlagInit = function () {
            if (me.data.workSort) {
                me.data.workSort.showSubDown = true;//展示提交次数向下的箭头
                me.data.workSort.showSubFlag = false;//展示提交次数的箭头
                me.data.workSort.showElapseDown = true;//展示用时向下的箭头
                me.data.workSort.showElapseFlag = false;//展示用时的箭头
                me.data.workSort.showFirstDown = true;//展示第一次向下的箭头
                me.data.workSort.showFirstFlag = false;//展示第一次的箭头
                me.data.workSort.showLastDown = true;//展示最后一次向下的箭头
                me.data.workSort.showLastFlag = false;//展示最后一次的箭头
                me.data.workSort.showFirstSubTimeDown = true;//展示第一次提交时间向下的箭头
                me.data.workSort.showFirstSubTimeFlag = false;//展示第一次提交时间的箭头
                me.data.workSort.showLastSubTimeDown = true;//展示最近一次提交时间向下的箭头
                me.data.workSort.showLastSubTimeFlag = false;//展示最近一次提交时间的箭头
            }

        };

        /**
         * 作业学生排序
         */
        this.refreshStuList = function () {
            me.workStuListShowFlagInit();
            switch (me.data.workSort.sortBy && me.data.workSort.sortBy.selected.toString()) {
                case '1'://得分排序
                    var temp = handleSort('first');
                    me.data.stu.correctedStus = temp;
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showFirstFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showFirstDown = false;
                        } else {
                            me.data.workSort.showFirstDown = true;
                        }
                    }
                    break;
                case '2'://用时排序
                    var temp = handleSort('elapse');
                    me.data.stu.correctedStus = temp;
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showElapseFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showElapseDown = false;
                        } else {
                            me.data.workSort.showElapseDown = true;
                        }
                    }
                    break;
                case '3': //改错排序
                    var temp = handleSort('subCount');
                    me.data.stu.correctedStus = temp;
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showSubFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showSubDown = false;
                        } else {
                            me.data.workSort.showSubDown = true;
                        }
                    }
                    break;
                case '4': //改错后得分排序
                    var temp = handleSort('last');
                    me.data.stu.correctedStus = temp;
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showLastFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showLastDown = false;
                        } else {
                            me.data.workSort.showLastDown = true;
                        }
                    }
                    break;
                case '5': //第一次提交时间排序
                    var temp = handleSort('firstSubmitTime');
                    me.data.stu.correctedStus = temp;
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showFirstSubTimeFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showFirstSubTimeDown = false;
                        } else {
                            me.data.workSort.showFirstSubTimeDown = true;
                        }
                    }
                    break;
                case '6': //最近一次提交时间排序
                    var temp = handleSort('latestSubmitTime');
                    me.data.stu.correctedStus = temp;
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showLastSubTimeFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showLastSubTimeDown = false;
                        } else {
                            me.data.workSort.showLastSubTimeDown = true;
                        }
                    }
                    break;
            }

            if (me.data.refreshListFlag) {
                me.workStuListShowFlagInit();
                var temp = handleSort('updateTime');
                me.data.stu.correctedStus = temp;
                if (me.data.workSort.showGreenIcon.flag) {
                    me.data.workSort.showLastFlag = true;
                    if (me.data.workSort.sortOrderSelected == "up") {
                        me.data.workSort.showLastDown = false;
                    } else {
                        me.data.workSort.showLastDown = true;
                    }
                }
            }
        };

        /**
         * 返回作业学生列表页面的刷新
         */
        this.refreshStuListForBack = function () {
            me.workStuListShowFlagInit();
            switch (me.data.workSort.sortBy.selected.toString()) {
                case '1'://得分排序
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showFirstFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showFirstDown = false;
                        } else {
                            me.data.workSort.showFirstDown = true;
                        }
                    }
                    break;
                case '2'://用时排序
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showElapseFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showElapseDown = false;
                        } else {
                            me.data.workSort.showElapseDown = true;
                        }
                    }
                    break;
                case '3': //改错排序
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showSubFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showSubDown = false;
                        } else {
                            me.data.workSort.showSubDown = true;
                        }
                    }
                    break;
                case '4': //改错后得分排序
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showLastFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showLastDown = false;
                        } else {
                            me.data.workSort.showLastDown = true;
                        }
                    }
                    break;
                case '5': //第一次提交时间排序
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showFirstSubTimeFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showFirstSubTimeDown = false;
                        } else {
                            me.data.workSort.showFirstSubTimeDown = true;
                        }
                    }
                    break;
                case '6': //最近一次提交时间排序
                    if (me.data.workSort.showGreenIcon.flag) {
                        me.data.workSort.showLastSubTimeFlag = true;
                        if (me.data.workSort.sortOrderSelected == "up") {
                            me.data.workSort.showLastSubTimeDown = false;
                        } else {
                            me.data.workSort.showLastSubTimeDown = true;
                        }
                    }
                    break;
            }
        };

        /**
         * 排序处理
         * @param sortBy 排序类型
         */
        function handleSort(sortBy) {
            var temp = _.sortBy(me.data.stu.correctedStus, function (data) {
                if (sortBy.toUpperCase().indexOf("TIME") > 0 && data[sortBy].toString().indexOf("-") > 0) {
                    data[sortBy] = data[sortBy].substring(0, data[sortBy].length - 4);
                    var date = new Date(data[sortBy]);
                    data[sortBy] = date.getTime();
                }
                if (me.data.workSort.sortOrderSelected == "up") {//升序
                    return data[sortBy];
                } else {
                    return -data[sortBy];
                }
            });
            return temp;
        }

        this.delWork = function (paperInstanceId, paperId) {
            var param = {
                paperInstanceId: paperInstanceId,
                paperId: paperId
            }
            return commonService.commonPost(serverInterface.DEL_PUB_WORK, param);
        }

        this.archivedWork = function (paperInstanceId, paperId) {
            var param = {
                paperInstanceId: paperInstanceId,
                paperId: paperId
            }
            return commonService.commonPost(serverInterface.ARCHIVED_PUB_WORK, param);
        };

        /**
         * 获取暑假作业的完成信息
         */
        this.getFinishVacationMessages = function () {
            var defer = $q.defer();
            var param = {
                limit: 30,
                minScore: 0
            };
            me.finishVacationMessages.splice(0, me.finishVacationMessages.length);
            commonService.commonPost(serverInterface.GET_FINISH_VACATION_MESSAGE, param).then(function (data) {
                defer.resolve(true);
                if (data && data.code == 200) {
                    angular.forEach(data.list, function (item) {
                        me.finishVacationMessages.push(item);
                    })
                }
            }, function () {
                defer.resolve(true);
            });
            return defer.promise;
        }

        function handleWorkNumFormat(tempData) {
            var workNumArr = [];
            for (var i in tempData) {
                switch (i) {
                    case "all":
                        workNumArr.push({"name": "发布作业次数", "num": tempData[i]});
                        break;
                    case "A":
                    case "B":
                    case "C":
                    case "D":
                        workNumArr.push({"name": (i + "层"), "num": tempData[i]});
                        break;
                    case "summer":
                        workNumArr.push({"name": "暑假作业", "num": tempData[i]});
                        break;
                    case "winter":
                        workNumArr.push({"name": "寒假作业", "num": tempData[i]});
                        break;
                }
            }
            return workNumArr;
        }

        /**
         * 修改store上面的保存
         */
        this.changeStudyStatisParams=(classId,selectedTime,selectedType)=>{
            let selectedParams=selectedTime+'#'+selectedType;
            return (dispatch, getState) =>{
                dispatch({type: CHANGE_STUDY_STATIS_PARAMS, payload: {classId:classId,selectedParams:selectedParams}});
            }
        };

        /**
         * 根据班级id获取班级学情
         * @param clazzId
         */
        this.getStudyStatisData = function (clazzId,selectedTime,selectedType) {
            me.studyStatisData.studentStudyList = null;
            let params={
                classId: clazzId,
                type:selectedType
            }
            if(selectedTime&&selectedTime.indexOf('-')>-1) {
                let startTime=selectedTime.split('-')[0];
                let endTime=selectedTime.split('-')[1];
                params.startTime=startTime;
                params.endTime=endTime;
            }
            return (dispatch, getState) =>{
                dispatch({type: FETCH_STUDY_STATIS});
                return commonService.commonPost(serverInterface.GET_CLAZZ_STUDY_STATISC_NEW, params).then((data)=>{
                    if (data && data.code == 200) {
                        me.studyStatisData.workNum = handleWorkNumFormat(data.workNum);
                        var listSorted = _.sortBy(data.list, function (item) {
                            return item.level;
                        });
                        var groupArray = getLevelGroup(listSorted, false);
                        me.studyStatisData.studentStudyList = [];
                        var sortName = SORT_NAME.UN_SUB;
                        me.studyStatisData.currentSortName = sortName;
                        sortGroupArray(me.studyStatisData.studentStudyList, groupArray, false, sortName, true);
                        dispatch({type: FETCH_STUDY_STATIS_SUCCESS, data: me.studyStatisData});
                    }else{
                        dispatch({type: FETCH_STUDY_STATIS_FAILURE})
                    }
                })
            }
        };

        /**
         * 处理将分层进行分组
         * @param list
         * @param levelDown
         * @returns {*}
         */
        function getLevelGroup(list, levelDown) {
            var sortedList = _.sortBy(list, function (item) {
                var ret;
                if (item[SORT_NAME.LEVEL].length === 1)
                    ret = levelDown ? -item[SORT_NAME.LEVEL].charCodeAt() : item[SORT_NAME.LEVEL].charCodeAt();
                else
                    ret = (levelDown ? '-' : '') + item[SORT_NAME.LEVEL];//todo:还没有想到一种处于字符串倒序的思路
                return ret;
            });
            var groupArray = _.groupBy(sortedList, function (item) {
                return item[SORT_NAME.LEVEL];
            });
            return groupArray;
        }

        /**
         * 将分组的数组再次排序
         * @param list html展示的数组
         * @param groupArray 分层后的数组
         * @param isCurrentLevel 当前是否为level排序
         * @param sortName 根据此字段排序数组
         * @param isDown true为降序，反之升序
         */
        function sortGroupArray(list, groupArray, isCurrentLevel, sortName, isDown) {
            if (isCurrentLevel) {
                _.each(groupArray, function (group) {
                    _.each(group, function (item) {
                        list.push(item);
                    });
                });
                return;
            }
            var tempArray;
            _.each(groupArray, function (group) {
                tempArray = _.sortBy(group, function (item) {
                    var ret;
                    try {
                        ret = isDown ? -parseInt(item[sortName]) : parseInt(item[sortName]);
                    } catch (e) {
                        ret = (isDown ? '-' : '') + item[sortName];
                    }
                    return ret;
                });
                _.each(tempArray, function (item) {
                    list.push(item);
                });
            });
        }

        /**
         * 排序班级学情
         * @param list 目标数组
         * @param sortName 根据这个排序
         * @param isDown true表示降序，反之升序
         * @param levelDown 当前列表的分层排序
         */
        this.sortClazzStudyList = function (data, sortName, isDown, levelDown) {
            var list = data.studentStudyList;
            var listCopy = angular.copy(list);
            var groupArray;
            data.currentSortName = sortName === SORT_NAME.LEVEL ? data.currentSortName : sortName;
            list.splice(0, list.length);
            switch (sortName) {
                case SORT_NAME.LEVEL:
                    groupArray = getLevelGroup(listCopy, isDown);
                    sortGroupArray(list, groupArray, true);
                    break;
                default:
                    data.currentSortName = sortName;
                    groupArray = getLevelGroup(listCopy, levelDown);
                    sortGroupArray(list, groupArray, false, sortName, isDown);
                    break;
            }
        }

        this.getPraiseList();

    });
