/**
 * Created by 邓小龙 on 2016/8/15.
 */
import _sortby from 'lodash.sortby';
import _find from 'lodash.find';
import _each from 'lodash.foreach';
import {
    SELECT_DIAGNOSE_TEXTBOOK_WORK
    , FETCH_DIAGNOSE_TEXTBOOK_LIST_START
    , FETCH_DIAGNOSE_TEXTBOOK_LIST_SUCCESS
    , FETCH_DIAGNOSE_TEXTBOOK_LIST_FAIL
    , CHANGE_DIAGNOSE_UNIT
    , CHANGE_DIAGNOSE_CLAZZ
    , RESET_DIAGNOSE_UNIT_STATUS
    , FETCH_DIAGNOSE_UNIT_STATISTIC_START
    , FETCH_DIAGNOSE_UNIT_STATISTIC_SUCCESS
    , FETCH_DIAGNOSE_UNIT_STATISTIC_FAIL
    , DIAGNOSE_UNIT_SELECT_STU
    , DIAGNOSE_UNIT_SELECT_KNOWLEDGE
    , FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_START
    , FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_SUCCESS
    , FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_FAIL
    , FETCH_STUDENT_DIAGNOSE_STATISTIC_START
    , FETCH_STUDENT_DIAGNOSE_STATISTIC_SUCCESS
    , FETCH_STUDENT_DIAGNOSE_STATISTIC_FAIL
    , CHANGE_DIAGNOSE_Q_RECORDS_PAGINATION_INFO
    , FETCH_DIAGNOSE_Q_RECORDS_START
    , FETCH_DIAGNOSE_Q_RECORDS_SUCCESS
    , FETCH_DIAGNOSE_Q_RECORDS_FAIL
    , DIAGNOSE_KNOWLEDGE_SELECT_STU
} from './../redux/action_typs';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';

import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import logger from 'log_monitor';

import qqIcon from "./../../tImages/qq.ico";
import weChatIcon from "./../../tImages/wechat.ico";
import friendCircle from "./../../tImages/friend-circle.png";

@Inject("$ngRedux", "$q", "$timeout", "serverInterface", "verticalService", "commonService", "finalData",'$ionicActionSheet')

class DiagnoseService {
    $q;
    $timeout;
    serverInterface;
    verticalService;
    commonService;
    $ionicActionSheet;
    finalData;
    //color等级低到高，对应掌握程度低到高
    COLOR = {
        LEVEL_ONE: {
            CLASS: "level-one",
            STYLE: "#CCCCCC"
        },
        LEVEL_TWO: {
            CLASS: "level-two",
            STYLE: "#F26666"
        },
        LEVEL_THREE: {
            CLASS: "level-three",
            STYLE: "#FEB05A"
        },
        LEVEL_FOUR: {
            CLASS: "level-four",
            STYLE: "#6AF420"
        },
        LEVEL_FIVE: {
            CLASS: "level-five",
            STYLE: "#20CC61"
        }
    };
    cancelDiagnoseRequestList = []; //诊断主页的请求
    cancelDiagnoseStuRequestList = []; //诊断学生主页的请求
    cancelDiagnoseClazzRequestList = []; //诊断班级的请求
    cancelDiagnoseQRecordRequestList = []; //诊断做题记录的请求
    cancelUnitRequestList = []; //诊断选择单元的请求


    handleLevelStati(info, totalStatistics) {
        let me = this, typeList = [], pieChartData = [], totalNum = 0;
        if (angular.isArray(totalStatistics)) {
            /* unitDiagnoseStati.masterNumberMaxLength=1;*/
            totalStatistics.forEach((item, index)=> {
                switch (item.level) {
                    case 1:
                        item.colorClass = me.COLOR.LEVEL_ONE.CLASS;
                        item.color = me.COLOR.LEVEL_ONE.STYLE;
                        break;
                    case 2:
                        item.colorClass = me.COLOR.LEVEL_TWO.CLASS;
                        item.color = me.COLOR.LEVEL_TWO.STYLE;
                        break;
                    case 3:
                        item.colorClass = me.COLOR.LEVEL_THREE.CLASS;
                        item.color = me.COLOR.LEVEL_THREE.STYLE;
                        break;
                    case 4:
                        item.colorClass = me.COLOR.LEVEL_FOUR.CLASS;
                        item.color = me.COLOR.LEVEL_FOUR.STYLE;
                        break;
                    case 5:
                        item.colorClass = me.COLOR.LEVEL_FIVE.CLASS;
                        item.color = me.COLOR.LEVEL_FIVE.STYLE;
                        break;
                    default:
                        item.colorClass = me.COLOR.LEVEL_ONE.CLASS;
                        item.color = me.COLOR.LEVEL_ONE.STYLE;
                        break;
                }
                if (item.masterRate != 0) {
                    let pieChartDataInfo = {};
                    pieChartDataInfo.label = item.key;
                    pieChartDataInfo.value = item.masterNumber;
                    pieChartDataInfo.showvalue = item.masterScoreRate;
                    pieChartDataInfo.color = item.color;
                    pieChartData.push(pieChartDataInfo);
                }
                /*    if((item.masterNumber+'').length>unitDiagnoseStati.masterNumberMaxLength)
                 unitDiagnoseStati.masterNumberMaxLength=(item.masterNumber+'').length;*/
                item.showText = item.key + "(" + item.masterScoreRate + ')';
                totalNum += item.masterNumber;
                typeList.push(item);
            });
        }
        typeList = typeList.sort((a, b)=> {
            return b.level - a.level;
        });
        typeList = this.commonService.getRowColArray(typeList, 2);
        info.totalStatistics = typeList;
        info.pieChartData = pieChartData;
        info.totalNum = totalNum;
    }

    pieChartInit(info) {
        info.pieChart = {
            settings: {
                instance: null,
                labels: {
                    outer: {
                        format: "none"
                    },
                    /*inner: {
                     format: "value"
                     },*/
                    percentage: {
                        fontSize: 13,
                        color: "#000000"
                    },
                    /*value: {
                     fontSize: 13,
                     color: "#000000"
                     }*/

                },
                data: {
                    sortOrder: "label-asc",
                    content: info.pieChartData
                },
                tooltips: {
                    enabled: true,
                    type: "placeholder",
                    string: "{label}({percentage}%)",
                    placeholderParser: function (index, data) {
                        //data.value = data.value+"/"+unitDiagnoseStati.totalNum;
                    }
                }
            }
        };
    }

    handleTagStructure(data, selectedUnit) {
        let retArray = [];
        data.forEach((material)=> {
            material.subTags.forEach((subTag, index)=> {
                console.log("index:", index);
                subTag.parentTagText = material.text;
                if (!selectedUnit && index == 0)
                    subTag.selected = true;
                if (selectedUnit && selectedUnit.unitTagId === subTag.id)
                    subTag.selected = true;
                retArray.push(subTag);
            });
        });
        return retArray;
    }


    /**
     * 获取所有的教材列表
     * @returns {promise}
     */
    @actionCreator
    getTextbookList(loadCallback) {
        loadCallback = loadCallback || angular.noop;
        return (dispatch, getState)=> {
            let diagnose_selected_clazz = getState().diagnose_selected_clazz;
            dispatch({type: FETCH_DIAGNOSE_TEXTBOOK_LIST_START});
            let postInfo = this.commonService.commonPost(this.serverInterface.GET_TEXTBOOK_LIST_V2,
                {
                    /*grade: diagnose_selected_clazz.grade,*/
                    depth: 4,
                    book: diagnose_selected_clazz.teachingMaterial.split('-')[0].trim()
                },
                true);
            this.cancelUnitRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {

                if (data.code === 200) {
                    _each(data.detail, (v)=> {//每一个教材版本设置展开flag(展开教材)
                        v.isOpened = false;
                        v.subTags = _sortby(v.subTags, 'seq'); //教材以seq排序
                        _each(v.subTags, (v2)=> { //每一个教材设置带版本的显示名字
                            v2.name = '【' + v.text + '】 ' + v2.text;
                            v2.subTags = _sortby(v2.subTags, 'seq');//教材章节以seq排序
                            _each(v2.subTags, function (v3) {
                                v3.subTags = _sortby(v3.subTags, 'seq'); //章节的单元以seq排序
                                v3.isOpened = false
                            });//每个教材下的单元设置展开flag(展开知识章节)
                        })

                    });
                    dispatch({type: FETCH_DIAGNOSE_TEXTBOOK_LIST_SUCCESS, payload: data.detail});
                    loadCallback(data.detail);
                }
                else {
                    dispatch({type: FETCH_DIAGNOSE_TEXTBOOK_LIST_FAIL});
                }
            }, ()=> {
                dispatch({type: FETCH_DIAGNOSE_TEXTBOOK_LIST_FAIL});
            });
        }
    }

    /**
     * 选择教材
     */
    @actionCreator
    selectTextbook(textbook) {
        return (dispatch, getState)=> {
            let textbooks = getState().diagnose_textbooks;
            let selectedClazz = getState().diagnose_selected_clazz;
            let currentTextbook = null;
            let bookVersion;
            let currentMonth = new Date().getMonth();
            let currentBookName = this.commonService.convertToChinese(selectedClazz.grade) + "年级";

            //没有指定教材就默认选择第一个版本的第一本教材
            if (!textbook) {
                // currentTextbook = textbooks[0] && textbooks[0]['subTags'] && textbooks[0]['subTags'][0];
                try {
                    bookVersion = _find(textbooks, {code: selectedClazz.teachingMaterial.split('-')[0]});
                    currentTextbook = _find(bookVersion.subTags, (book)=> {
                        return book.text.match(currentBookName + ((currentMonth > 0 && currentMonth < 8) ? "下" : "上"))
                    });
                } catch (e) {
                    currentTextbook = textbooks[0] && textbooks[0]['subTags'] && textbooks[0]['subTags'][0];
                }

            }
            //指定了教材id
            else {
                _find(textbooks, (version)=> {
                    return currentTextbook = _find(version.subTags, {id: textbook.id});
                });

                _each(currentTextbook.subTags, (serverUnit)=> {
                    let localUnit = _find(textbook.subTags, {id: serverUnit.id});
                    serverUnit.isOpened = localUnit && localUnit.isOpened;
                })
            }

            dispatch({
                type: SELECT_DIAGNOSE_TEXTBOOK_WORK,
                payload: {clazzId: selectedClazz.id, textbook: currentTextbook}
            });
            return currentTextbook && currentTextbook.id
        }
    }


    @actionCreator
    changeUnit(reSelectUnit) {
        return (dispatch)=> {
            dispatch({
                type: CHANGE_DIAGNOSE_UNIT,
                unit: reSelectUnit
            });
        }
    }


    @actionCreator
    changeClazz(reSelectClazz) {
        return (dispatch, getState)=> {     //改变班级
            if (!reSelectClazz)
                reSelectClazz = getState().clazzList[0];
            dispatch({type: CHANGE_DIAGNOSE_CLAZZ, payload: reSelectClazz});
        };
    }

    @actionCreator
    resetUnitSelectedStatus() {
        return (dispatch)=> {
            dispatch({type: RESET_DIAGNOSE_UNIT_STATUS});
        };
    };

    formatLevel(levelList, item) {
        angular.forEach(levelList, (level)=> {
            switch (level.sort) {
                case 1:
                    item["levelOne"] = parseFloat(level.value) * 100 + '%';
                    break;
                case 2:
                    item["levelTwo"] = parseFloat(level.value) * 100 + '%';
                    break;
                case 3:
                    item["levelThree"] = parseFloat(level.value) * 100 + '%';
                    break;
                case 4:
                    item["levelFour"] = parseFloat(level.value) * 100 + '%';
                    break;
                default:
                    item["levelOne"] = parseFloat(level.value) * 100 + '%';
                    break;
            }
        });
    }

    @actionCreator
    fetchUnitDiagnose(unitId, loadCallback) {
        let me = this;
        loadCallback = loadCallback || angular.noop;
        return (dispatch, getState)=> {
            let classId = getState().diagnose_selected_clazz.id,
                selectedUnit = getState().diagnose_selected_unit,
                url = me.serverInterface.FETCH_UNIT_DIAGNOSE,
                params = {chapterId: unitId, classId: classId};
            dispatch({type: FETCH_DIAGNOSE_UNIT_STATISTIC_START});

            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: FETCH_DIAGNOSE_UNIT_STATISTIC_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let unitDiagnoseStati = {};
                    unitDiagnoseStati.tableTitleList = _sortby(data.keyValuePairsList, [(item)=> {
                        me.handleLevelColor('sort', item);

                        return -item.sort;
                    }]);
                    unitDiagnoseStati.tableTitleList[0].showSortFlag = true;
                    unitDiagnoseStati.tableTitleList[0].sortUp = true;
                    unitDiagnoseStati.stuList = data.list;
                    if (data.list && data.list.length) {
                        let temp = 0, numList = data.list[0].master2Number;
                        for (var i in numList) {
                            temp += numList[i];
                        }
                        unitDiagnoseStati.totalPointNum = temp;

                    } else {
                        unitDiagnoseStati.totalPointNum = 0;
                    }


                    dispatch({
                        type: FETCH_DIAGNOSE_UNIT_STATISTIC_SUCCESS,
                        payload: {
                            classId: classId,
                            selectedUnit: selectedUnit,
                            unitId: unitId,
                            unitDiagnoseStati: unitDiagnoseStati
                        }
                    });
                    loadCallback(unitDiagnoseStati.totalStatistics);
                }
            }, (res)=> {
                dispatch({type: FETCH_DIAGNOSE_UNIT_STATISTIC_FAIL});
            });

        };
    }

    handleLevelColor(level, item) {
        switch (item[level]) {
            case 1:
                item.colorClass = this.COLOR.LEVEL_ONE.CLASS;
                item.color = this.COLOR.LEVEL_ONE.STYLE;
                break;
            case 2:
                item.colorClass = this.COLOR.LEVEL_TWO.CLASS;
                item.color = this.COLOR.LEVEL_TWO.STYLE;
                break;
            case 3:
                item.colorClass = this.COLOR.LEVEL_THREE.CLASS;
                item.color = this.COLOR.LEVEL_THREE.STYLE;
                break;
            case 4:
                item.colorClass = this.COLOR.LEVEL_FOUR.CLASS;
                item.color = this.COLOR.LEVEL_FOUR.STYLE;
                break;
            case 5:
                item.colorClass = this.COLOR.LEVEL_FIVE.CLASS;
                item.color = this.COLOR.LEVEL_FIVE.STYLE;
                break;
            default:
                item.colorClass = this.COLOR.LEVEL_ONE.CLASS;
                item.color = this.COLOR.LEVEL_ONE.STYLE;
                break;
        }
    }

    @actionCreator
    unitSelectKnowledge(knowledgePoint) {
        knowledgePoint.type2MasterRateList = _sortby(knowledgePoint.type2MasterRateList, 'sort');
        angular.forEach(knowledgePoint.type2MasterRateList, (item)=> {
            this.handleLevelColor('sort', item);
        });
        knowledgePoint.showImgMap = this.commonService.getRowColArray(knowledgePoint.type2MasterRateList, 2);
        return (dispatch)=> {
            dispatch({
                type: DIAGNOSE_UNIT_SELECT_KNOWLEDGE,
                payload: knowledgePoint
            });
        };
    }

    @actionCreator
    unitSelectStu(stu) {
        return (dispatch)=> {
            dispatch({
                type: DIAGNOSE_UNIT_SELECT_STU,
                payload: {stu: stu}
            });
        };
    }

    @actionCreator
    fetchUnitKnowledgeDiagnose(knowledgePoint) {
        let me = this;
        return (dispatch, getState)=> {
            let userId = getState().profile_user_auth.user.userId,
                url = me.serverInterface.FETCH_UNIT_KNOWLEDGE_DIAGNOSE,
                params = {knowledgeId: knowledgePoint.knowledgeId, classId: getState().diagnose_selected_clazz.id};
            dispatch({type: FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseClazzRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_FAIL});
                    return;
                }
                if (data.code === 200) {
                    //data.list.unshift({key:'学习要点',value:knowledgePoint.knowledgeName});
                    let info, showList = [];
                    data.list = _sortby(data.list, [(item)=> {
                        return -item.keyValuePairs.sort;
                    }]);
                    angular.forEach(data.list, (item)=> {
                        info = {
                            key: item.keyValuePairs.key,
                            value: item.keyValuePairs.value,
                            sort: item.keyValuePairs.sort,
                            stuList: item.masterStatisticsDetailMsgDTOList
                        };
                        showList.push(info);
                    });


                    let knowledgeDiagnoseStati = {};
                    knowledgeDiagnoseStati.list = showList;
                    dispatch({
                        type: FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_SUCCESS,
                        payload: {
                            selectedKnowpoint: knowledgePoint,
                            knowledgeDiagnoseStati: knowledgeDiagnoseStati
                        }
                    });
                    return;
                }
            }, (res)=> {
                dispatch({type: FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_FAIL});
            });
        }
    }

    @actionCreator
    diagnoseKnowledgeSelectStu(stu) {
        return (dispatch, getState)=> {
            let selectedKnowpoint = getState().diagnose_unit_select_knowledge;
            dispatch({
                type: DIAGNOSE_KNOWLEDGE_SELECT_STU,
                payload: {selectedKnowpoint: selectedKnowpoint, stu: stu}
            });
        };
    }


    @actionCreator
    fetchStudentDiagnose(stu, loadCallback) {
        let me = this;
        loadCallback = loadCallback || angular.noop;
        return (dispatch, getState)=> {
            let classId = getState().diagnose_selected_clazz.id,
                url = me.serverInterface.FETCH_STUDENT_DIAGNOSE,
                params = {chapterId: stu.selectedUnitId, classId: classId, studentId: stu.studentId};
            dispatch({type: FETCH_STUDENT_DIAGNOSE_STATISTIC_START});

            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseStuRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: FETCH_STUDENT_DIAGNOSE_STATISTIC_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let stuDiagnoseStati = {};
                    me.handleLevelStati(stuDiagnoseStati, data.totalStatistics);
                    me.pieChartInit(stuDiagnoseStati);
                    stuDiagnoseStati.totalKnowledgeNumber = data.totalKnowledgeNumber;
                    angular.forEach(data.list, (unit)=> {
                        me.formatLevel(unit.keyValuePairsListRate, unit);
                        unit.fatherCustomizationDTOList = _sortby(unit.fatherCustomizationDTOList, 'content');
                        angular.forEach(unit.fatherCustomizationDTOList, (chapter)=> {
                            chapter.customizationDTOList = _sortby(chapter.customizationDTOList, 'knowledgeName');
                            /* angular.forEach(chapter.customizationDTOList,(item)=>{
                             me.formatLevel(item.type2MasterRateList,item);
                             })*/
                        });
                    });
                    stuDiagnoseStati.list = data.list;
                    dispatch({
                        type: FETCH_STUDENT_DIAGNOSE_STATISTIC_SUCCESS,
                        payload: {
                            stuId: stu.studentId,
                            stuDiagnoseStati: stuDiagnoseStati
                        }
                    });
                    loadCallback(stuDiagnoseStati.totalStatistics);
                }
            }, (res)=> {
                dispatch({type: FETCH_STUDENT_DIAGNOSE_STATISTIC_FAIL});
            });

        };
    }

    @actionCreator
    fetchQRecords(loadMore, loadMoreCallback) {
        loadMoreCallback = loadMoreCallback || angular.noop;
        let me = this;
        return (dispatch, getState)=> {
            let state = getState();
            //如果这个单元没有试题列表，无需加载更多数据
            let diagnoseUnitSelectStu = state.diagnose_unit_select_stu;
            let knowledgeId = diagnoseUnitSelectStu.knowledgePoint.knowledgeId;
            let unitId = diagnoseUnitSelectStu.selectedUnitId;
            let clazzId = diagnoseUnitSelectStu.selectedClazzId;
            let knowledgeStateKey = clazzId + '#' + unitId + '/' + knowledgeId;
            let stuId = diagnoseUnitSelectStu.studentId;
            let qRecords = state.stu_with_records_diagnose[knowledgeStateKey + '/' + stuId].qRecords;
            let url = me.serverInterface.FETCH_UNIT_Q_RECORDS;
            if (loadMore && (!qRecords || qRecords.length === 0))return loadMoreCallback(loadMore);
            if (!loadMore) { //如果没有加载更多的选项，则表示更新列表下所有的内容，则需要重新设置分页信息
                dispatch({
                    type: CHANGE_DIAGNOSE_Q_RECORDS_PAGINATION_INFO,
                    payload: {
                        lastKey: 0,
                        quantity: 16
                    }
                });
            }

            state = getState(); //刷新 state
            let limitQuery = state.diangnose_q_records_pagination_info;
            let params = {
                knowledgeId: knowledgeId,
                studentId: diagnoseUnitSelectStu.studentId,
                classId: state.diagnose_selected_clazz.id,
                lastKey: limitQuery.lastKey,
                quantity: limitQuery.quantity,
                countNum: (qRecords && Math.floor(qRecords.length/limitQuery.quantity)) || 0
            };
            dispatch({type: FETCH_DIAGNOSE_Q_RECORDS_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseQRecordRequestList.push(postInfo.cancelDefer);
            let handleMasterLevelText = (level, item)=> {
                switch (item[level]) {
                    case 'first':
                        item.showImg = 'diagnose/diagnose_report_right.png';
                        break;
                    case "mistake":
                        item.showImg = 'diagnose/diagnose_report_edit.png';
                        break;
                    case "error":
                        item.showImg = 'diagnose/diagnose_report_error.png';
                        break;
                    case "master":
                        me.handleLevelText('value', item);
                        break;
                }
            }
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    dispatch({type: FETCH_DIAGNOSE_Q_RECORDS_FAIL});
                    return;
                }
                if (data && data.code === 200) {

                    /*dispatch({
                     type: DIAGNOSE.FETCH_Q_RECORDS_SUCCESS,
                     payload: {selectedKnowpoint:unitSelectKnowledge_,qRecords: data.qsTitles,loadMore:loadMore}
                     });*/
                    let qRecords = null;
                    if (data.qsTitles) {
                        qRecords = me.smallQListParse(data.qsTitles, true, data.history[stuId]);
                        qRecords = _sortby(qRecords, [function (item) {
                            return -item.innerCreateTimeCount;
                        }]);
                        dispatch({
                            type: CHANGE_DIAGNOSE_Q_RECORDS_PAGINATION_INFO,
                            payload: {
                                lastKey: data.lastKey,
                                quantity: 16
                            }
                        });
                    }
                    let knowledgeDiagnoseStati = {}, text = "";
                    angular.forEach(data.list, (item)=> {
                        text += item.value + ',';
                    });
                    let reponseData = {};
                    reponseData.showListText = text ? text.substring(0, text.length - 1) : text;
                    reponseData.lastKey = data.lastKey;
                    reponseData.qRecords = qRecords;
                    reponseData.signalGraph = {};
                    reponseData.signalGraph.allMsg = data.allMsg ? data.allMsg : reponseData.signalGraph.allMsg;
                    let showTextStr = data.allMsg ? reponseData.signalGraph.allMsg.value + '，' : '';
                    angular.forEach(data.list, (item)=> {
                        if (item.key === 'master') {
                            reponseData.signalGraph.levelValue = item.value;
                        } else
                            showTextStr += item.value + '，';

                    });
                    if (showTextStr) {
                        reponseData.signalGraph.showTextStr = showTextStr.substring(0, showTextStr.length - 1);
                    }
                    dispatch({
                        type: FETCH_DIAGNOSE_Q_RECORDS_SUCCESS,
                        payload: {
                            selectedKnowpoint: diagnoseUnitSelectStu.knowledgePoint,
                            stu: diagnoseUnitSelectStu,
                            reponseData: reponseData,
                            loadMore: loadMore
                        }
                    });

                    if (!qRecords || (loadMore && qRecords.length < limitQuery.quantity) || (!loadMore && qRecords.length < 16))
                        loadMoreCallback(loadMore, true);
                    else
                        loadMoreCallback(loadMore);
                }
            }, (res)=> {
                dispatch({type: FETCH_DIAGNOSE_Q_RECORDS_FAIL});
            });
        }
    }


    /**
     * 根据qsTitles为主，history为辅，暂时不用了
     * @param smallQList
     * @param isStat
     * @param userHistory
     */
    smallQListParseTemp(smallQList, isStat, userHistory) {
        let me = this;
        if (!angular.isArray(smallQList)) {
            console.error("smallQList must be a array !");
            return;
        }
        if (isStat) {
            //let userHistory=history[userId];
            smallQList.forEach((smallQ)=> {
                try {
                    let smallQHistory = userHistory[smallQ.id];
                    for (let key in smallQHistory) {
                        me.smallQParseForStat(smallQ, smallQHistory[key]);
                        smallQ.quesIdAndInstanceId = key;
                    }
                } catch (e) {
                    console.error('qbu结构错误！', e);
                }
            });
            return;
        }
        smallQList.forEach((smallQ)=> {
            me.smallQParse(smallQ);
        });
    }

    /**
     * 根据history为辅为主，qsTitles
     * @param smallQList
     * @param isStat
     * @param userHistory
     */
    smallQListParse(smallQList, isStat, userHistory) {
        let me = this, smallQ, qRecords = [], doneInfo, newSmallQList = [];
        if (!angular.isArray(smallQList)) {
            console.error("smallQList must be a array !");
            return;
        }
        if (isStat) {
            //let userHistory=history[userId];
            try {
                for (let qKey in userHistory) {
                    for (let i = 0; i < smallQList.length; i++) {
                        if (qKey === smallQList[i].id) {
                            smallQ = smallQList[i];
                            break;
                        }
                    }
                    let smallQHistory = userHistory[qKey];
                    for (let key in smallQHistory) {
                        me.smallQParseForStat(smallQ, smallQHistory[key]);
                        smallQ.innerCreateTime = smallQ.smallQStuAnsMapList[0].createTime || '';
                        smallQ.innerCreateTimeCount = (new Date(smallQ.innerCreateTime)).getTime();
                        smallQ.quesIdAndInstanceId = key;
                        smallQ.quesFrom = Object.keys(smallQHistory[key]);
                        if (smallQ.quesFrom && smallQ.quesFrom.length) {
                            smallQ.quesFrom = smallQ.quesFrom[0];
                        }

                        newSmallQList.push(angular.copy(smallQ));
                        /*angular.forEach(smallQ.smallQStuAnsMapList,(item)=>{
                         doneInfo={};
                         doneInfo.doneInfo=item;
                         doneInfo.inputList=smallQ.inputList;
                         qRecords.push(doneInfo);
                         newSmallQList.push(smallQ);
                         })*/
                    }
                }
            } catch (e) {
                return newSmallQList;
                console.error('qbu结构错误！', e);
            }
            return newSmallQList;
        }
        smallQList.forEach((smallQ)=> {
            me.smallQParse(smallQ);
        });
    }

    answerKeyFormatJson(smallQ) {
        smallQ.question = smallQ.question.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
        return JSON.parse(smallQ.answerKey);//当前试题答案
    }

    smallQParseForStat(smallQ, history, repeatData) {
        let answerKey = this.answerKeyFormatJson(smallQ);//当前试题答案
        smallQ.smallQStuAnsMapList = history;
        smallQ.inputList = [];//小题下的所有输入框得id
        this.sQansListParseForStat(answerKey, smallQ);
        if (repeatData)
            repeatData.inputListForCorrect = angular.copy(smallQ.inputList);
    }

    smallQParse(smallQ) {
        let me = this, answerKey;
        answerKey = this.answerKeyFormatJson(smallQ);//当前试题答案
        smallQ.inputList = [];//小题下的所有输入框得id
        smallQ.smallQStuAnsMapList = []; //做题次数
        me.answerParse(answerKey, smallQ);
    }

    sQansListParseForStat(answerKey, smallQ) {
        let me = this, isRemoveQFlag = false, stuQAns;
        for (let key in smallQ.smallQStuAnsMapList) {
            stuQAns = smallQ.smallQStuAnsMapList[key];//stuQAns为学生做一次小题对象
            stuQAns.smallQScoreRate = me.commonService.convertToPercent(stuQAns.score / smallQ.score, 0);
            stuQAns.inputList = [];
            /* if (stuQAns.score == 0) {//最后一次为0分
             stuQAns.passFlag = 0;
             } else if (stuQAns.score == smallQ.score) {//改正确了
             stuQAns.passFlag = 2;
             } else {//半对
             stuQAns.passFlag = 1;
             }*/
            isRemoveQFlag = stuQAns.ignore == 1 ? true : isRemoveQFlag;
            stuQAns.isGrading = false;//正在批改中的标志
            me.answerParse(answerKey, smallQ, stuQAns);
            stuQAns.passFlag = stuQAns.isGrading ? 3 : stuQAns.passFlag;
            //stuQAns.passFlag=3;
        }
        if (isRemoveQFlag) {
            var firstDoneArry = [];
            firstDoneArry.push(smallQ.smallQStuAnsMapList[0]);
            smallQ.smallQStuAnsMapList = firstDoneArry;
        }

    }

    answerParse(answerKey, smallQ, stuQAns) {
        let me = this, spStu, spList, spInfo;
        /**
         * 做竖式题时，将answerKey中的matrix信息保存到verticalService中去
         * @param anskey
         */
        let addMatrixToVerticalFormulaService = (anskey)=> {
            anskey.scorePoints.forEach(sp=> {
                let spInfo = {};
                let spStu = stuQAns ? stuQAns.id2ScorePointScore[sp.uuid] : {};
                sp.spStuScore = spStu.score;//当前得分点学生的得分
                spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                spInfo.score = spStu.score;//该小题的得分点的得分
                spInfo.type = anskey.type;//得分点类型
                spInfo.spList = [];


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
                if (stuQAns && stuQAns.inputList) stuQAns.inputList.push(spInfo);
                smallQ.inputList.push(spInfo)
            });
        };
        answerKey.forEach((ans)=> {//处理参考答案
            if (ans.type == VERTICAL_CALC_SCOREPOINT_TYPE || ans.type == VERTICAL_ERROR_SCOREPOINT_TYPE || ans.type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE) { //竖式题
                addMatrixToVerticalFormulaService(ans)
            } else {
                //ans.type  3种类型题
                ans.scorePoints.forEach((sp, index)=> {//处理得分点
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
        referInputBoxes.forEach((inputInfo)=> {
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
    referAnswer(scorePoint, spStu, smallQ, spList, qType) {
        let me = this, stuAns, spQInfo;
        if (scorePoint.openStyle) {
            try {
                spStu.answer = JSON.parse(spStu.answer);
            } catch (e) {
                console.log(e);
            }
        }
        if (scorePoint.referInputBoxes && scorePoint.referInputBoxes.length > 0) {
            scorePoint.referInputBoxes.forEach((inputBox, index)=> {
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


    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    }

    shareImage(shareImg,scope,titleName,title,content) {
        let image = new Image();
        let titleNameMsg = titleName||'提醒家长';
        let titleMsg = title||"各位家长：";
        let contentMsg = content|| `根据最近作业完成情况，有部分孩子考点掌握不理想。每次作业的下方都会显示孩子的薄弱考点，请关注，并督促孩子查漏补缺。`;
        image.src = shareImg;
        image.onload = ()=> {
            var dataURL = this.getBase64Image(image);
            this.shareDeal(dataURL,scope,titleNameMsg,titleMsg,contentMsg)
        }
    }

    shareDeal(base64Img,scope,title,teacherName,shareContent) {
        // let teacherName = "各位家长：";
        // let shareContent = `根据最近作业完成情况，有部分孩子考点掌握不理想。每次作业的下方都会显示孩子的薄弱考点，请关注，并督促孩子查漏补缺。`;
        let me = scope;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="reward-share-btn weChat-share-img" src="${weChatIcon}">发到微信`},
                {text: `<img class="reward-share-btn friend-circle-share-img" src="${friendCircle}">发到朋友圈`},
                {text: `<img class="reward-share-btn qq-share-img" src="${qqIcon}" >请手动复制到QQ群`}
            ],
            titleText: `<div class="sub-title-remind-parent">${title}</div>
                    <div class="selectable">
                    <div class="reward-share-btn share-title" >${teacherName}</div>
                        <div class="reward-share-btn share-content" >${shareContent}</div>
                    </div><div class="sub-title-remind-teacher">(长按可复制)</div>`,
            cancelText: '取消',
            buttonClicked: (index) => {
                if (index == 2) {
                   /* QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        teacherName,
                        'http://xuexiv.com/img/icon.png',
                        'http://a.app.qq.com/o/simple.jsp?pkgname=com.allere.eclass',
                        () => {
                            me.commonService.showAlert("提示", "分享信息发送成功！");
                        }, (err) => {
                            me.commonService.showAlert("提示", err);
                        });*/
                    me.commonService.showAlert("提示", "请手动复制到QQ群");
                }
                if (index == 0) {//点击分享到微信
                    if (!me.getRootScope().weChatInstalled) {
                        me.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                        message: {
                            title: teacherName,
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                /* type: Wechat.Type.WEBPAGE,
                                 webpageUrl: $scope.shareUrl,*/
                                type: Wechat.Type.IMAGE,
                                image: base64Img,
                            }
                        },
                    }, () => {
                        me.commonService.showAlert("提示", "分享信息发送成功！");
                    }, (reason) => {
                        me.commonService.showAlert("提示", reason);
                    });
                }

                if (index == 1) {//点击分享到微信朋友圈
                    if (!me.getRootScope().weChatInstalled) {
                        me.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                        message: {
                            title: teacherName,
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                /* type: Wechat.Type.LINK,
                                 webpageUrl: $scope.shareUrl,*/
                                type: Wechat.Type.IMAGE,
                                image: base64Img,
                            }
                        },
                    }, () => {
                        me.commonService.showAlert("提示", "分享信息发送成功！");
                    }, (reason) => {
                        me.commonService.showAlert("提示", reason);
                    });
                }
                return true;
            }
        });
    }

    sendMsgTostudent(){
        let defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.SEND_MSG_TO_STU,{'function':'promotion'}).then((data)=> {
            defer.resolve(data);
        }, (error)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }
}

export default DiagnoseService;


