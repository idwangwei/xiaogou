/**
 * Created by qiyuexi on 2018/1/13.
 */
/**
 * Created by 邓小龙 on 2016/8/15.
 */

import _sortby from 'lodash.sortby';
import _find from 'lodash.find';
import {getDiagnoseknowledgeStateKey} from '../redux/state_common_keys/state_common_keys';
import {DIAGNOSE, UNIT, PROFILE,COUNT_DOWN_VIP_INCREASE_SCORE_COUNTS} from '../../../m_boot/scripts/redux/actiontypes/actiontypes';

import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import {Service, actionCreator,Inject} from '../module';
@Service('diagnoseService')
@Inject("$ngRedux", "$timeout", "serverInterface", "verticalService", "commonService", "finalData", "ngLocalStore",'$rootScope','$q')
class DiagnoseService {
    constructor() {
        // super(arguments);
        //color等级低到高，对应掌握程度低到高
        this.COLOR = {
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
        this.cancelDiagnoseRequestList = []; //诊断主页的请求
        this.cancelDiagnoseImproveRequestList = []; //诊断提高的请求
        this.cancelDiagnoseDoRequestList = []; //诊断做题的请求
        this.cancelDiagnoseErrorQRequestList = []; //诊断错题记录的请求
        this.cancelDiagnoseReportRequestList = []; //诊断报告的请求
        this.cancelDiagnoseQRecordsRequestList = []; //诊断做题记录的请求
        this.cancelDiagnoseChapterRequestList = []; //章节诊断的请求
        this.cancelDiagnoseGoodsMenusRequestList = []; //商品列表的请求
        this.cancelErrorQRecordRequestList = [];//获取错题记录的请求队列
        this.diagnoseWrongQuestionNum = 0; //诊断当前知识点的待改的错题
        this.Grades = [
            {"num": 1, "name": "一年级上册"},
            {"num": 2, "name": "一年级下册"},
            {"num": 3, "name": "二年级上册"},
            {"num": 4, "name": "二年级下册"},
            {"num": 5, "name": "三年级上册"},
            {"num": 6, "name": "三年级下册"},
            {"num": 7, "name": "四年级上册"},
            {"num": 8, "name": "四年级下册"},
            {"num": 9, "name": "五年级上册"},
            {"num": 10, "name": "五年级下册"},
            {"num": 11, "name": "六年级上册"},
            {"num": 12, "name": "六年级下册"}
        ];

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


    handleLevelStati(unitDiagnoseStati, totalStatistics) {
        let me = this, typeList = [], pieChartData = [], totalNum = 0;
        if (angular.isArray(totalStatistics)) {
            /* unitDiagnoseStati.masterNumberMaxLength=1;*/
            totalStatistics.forEach((item, index)=> {
                this.handleLevelColor('level', item);
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
        unitDiagnoseStati.totalStatistics = typeList;
        unitDiagnoseStati.pieChartData = pieChartData;
        unitDiagnoseStati.totalNum = totalNum;
    }

    handleLevelText(level, item, isIncreaseScore) {
        item[level] = parseInt(item[level]);
        item.numIndex = item.numIndex ? item.numIndex : 0;
        let temp = item.numIndex % this.finalData.ADORABLE_PET_TOTAL_COUNT;//目前只有5组萌宠
        try {
            switch (item[level]) {
                case 1:
                    item.text = '去唤醒';
                    item.showImg = isIncreaseScore ? 'diagnose/level-star-1.png' : ('diagnose/level-one-' + temp + '.png');
                    break;
                case 2:
                    item.text = '去驯服';
                    item.showImg = isIncreaseScore ? 'diagnose/level-star-2.png' : ('diagnose/level-two-' + temp + '.png');
                    break;
                case 3:
                    item.text = '去驯服';
                    item.showImg = isIncreaseScore ? 'diagnose/level-star-3.png' : ('diagnose/level-three-' + temp + '.png');
                    break;
                case 4:
                    item.text = '';
                    item.showImg = isIncreaseScore ? 'diagnose/level-star-4.png' : ('diagnose/level-four-' + temp + '.png');
                    break;
                default:
                    item.text = '去唤醒';
                    item.showImg = isIncreaseScore ? 'diagnose/level-star-1.png' : ('diagnose/level-one-' + temp + '.png');
                    break;
            }
        } catch (e) {
            item.text = '去唤醒';
            item.showImg = isIncreaseScore ? 'diagnose/level-star-1.png' : ('diagnose/level-one-' + temp + '.png');
        }

    }

    pieChartInit(unitDiagnoseStati) {
        /*unitDiagnoseStati.pieChartData=[
         {"label":"未做题","value":1,"showvalue":"1/15","color":"#CCCCCC"},
         {"label":"未掌握","value":3,"showvalue":"3/15","color":"#F26666"},
         {"label":"不牢固","value":2,"showvalue":"2/15","color":"#FEB05A"},
         {"label":"掌握","value":3,"showvalue":"3/15","color":"#6AF420"},
         {"label":"牢固掌握","value":6,"showvalue":"6/15","color":"#20CC61"}
         ];*/
        /*labels: {
         outer: {
         format: "label",
         hideWhenLessThanPercentage: null,
         pieDistance: 30
         },
         inner: {
         format: "percentage",
         hideWhenLessThanPercentage: null
         },
         mainLabel: {
         color: "#333333",
         font: "arial",
         fontSize: 10
         },
         percentage: {
         color: "#dddddd",
         font: "arial",
         fontSize: 10,
         decimalPlaces: 0
         },
         value: {
         color: "#cccc44",
         font: "arial",
         fontSize: 10
         },
         lines: {
         enabled: true,
         style: "curved",
         color: "segment"
         },
         truncation: {
         enabled: false,
         truncateLength: 30
         },*/
        unitDiagnoseStati.pieChart = {
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
                /*size: {
                 canvasHeight: 105,
                 canvasWidth: 125,
                 pieInnerRadius: "30%",
                 pieOuterRadius: "85%"
                 },*/
                data: {
                    sortOrder: "label-asc",
                    content: unitDiagnoseStati.pieChartData
                }
                /*,
                 tooltips: {
                 enabled: true,
                 type: "placeholder",
                 string: "{label}({percentage}%)",
                 placeholderParser: function (index, data) {
                 //data.value = data.value+"/"+unitDiagnoseStati.totalNum;
                 }
                 }*/
            }
        };
    }

    /**
     * 改变班级
     * @param reSelectClazz
     * @returns {function()}
     */
    changeClazz(reSelectClazz) {
        return (dispatch, getState)=> {
            if (!reSelectClazz) {
                angular.forEach(getState().profile_clazz.passClazzList, (item)=> {
                    if (item.type === 100) reSelectClazz = item;
                    return true;
                });
            }
            dispatch({type: DIAGNOSE.DIAGNOSE_CHANGE_CLAZZ, payload: reSelectClazz});
        };
    }

    /**
     * 改变教材
     * @param reSelectTextBook
     * @returns {function()}
     */
    changeTextBook(reSelectTextBook) {
        return (dispatch, getState)=> {
            dispatch({type: DIAGNOSE.DIAGNOSE_CHANGE_TEXTBOOK, payload: reSelectTextBook});
        };
    }

    /**
     * 改变年级
     * @param reSelectGrade
     * @returns {function()}
     */
    changeGrade(reSelectGrade) {
        return (dispatch, getState)=> {
            dispatch({type: DIAGNOSE.DIAGNOSE_CHANGE_GRADE, payload: reSelectGrade});
        };
    }

    /**
     * 诊断主页选择章节
     * @param reSelectGrade
     * @returns {function()}
     */
    homeSelectChapter(reSelectChapter) {
        return (dispatch, getState)=> {
            dispatch({type: DIAGNOSE.HOME_SELECT_CHAPTER, payload: reSelectChapter});
        };
    }

    /**
     * 章节选中知识点
     * @param reSelectGrade
     * @returns {function()}
     */
    chapterSelectPoint(reSelectPoint) {
        if (reSelectPoint && reSelectPoint.knowledgeName) {
            let findIndex = reSelectPoint.knowledgeName.indexOf('.');
            if (findIndex > 0)
                reSelectPoint.knowledgeName = reSelectPoint.knowledgeName.substring((findIndex + 1), reSelectPoint.knowledgeName.length);
        }
        return (dispatch, getState)=> {
            dispatch({type: DIAGNOSE.CHAPTER_SELECT_POINT, payload: reSelectPoint});
        };
    }

    /**
     * 重置知识点上的试题
     * @param reSelectGrade
     * @returns {function()}
     */
    resetKnowledgeQuestion(selectedPoint, question) {
        let payload = {
            selectedKnowpoint: selectedPoint,
            questionInfo: null
        };
        return (dispatch, getState)=> {
            dispatch({type: DIAGNOSE.FETCH_QUESTION_SUCCESS, payload: payload});
        };
    }

    changeTextBookByClazz(selectedTextbook) {
        return (dispatch)=> {
            dispatch({
                type: UNIT.CHANGE_TEXTBOOK_BY_CLAZZ,
                selectedTextbook: selectedTextbook
            });
        }
    }

    resetUnitSelectedStatus() {
        return (dispatch)=> {
            dispatch({type: UNIT.RESET_UNIT_STATUS});
        };
    };

    selectedGood(good, callBack) {
        callBack = callBack || angular.noop;
        return (dispatch)=> {
            dispatch({type: PROFILE.SELECTED_GOOD, payload: good});
            callBack();
        };
    }

    fetchGoodsMenus() {
        let me = this;
        return (dispatch, getState)=> {
            let url = me.serverInterface.GET_GOODS_MENUS, params = {category: 'XN-ZD'};
            dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseGoodsMenusRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let list = [];
                    angular.forEach(data.goods, (item)=> {
                        item.desc = JSON.parse(item.desc);
                        list.push(item);
                    });
                    dispatch({
                        type: DIAGNOSE.FETCH_GOODS_MENUS_SUCCESS,
                        payload: list
                    });
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_FAIL});
            });

        };
    }

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

    fetchUnitDiagnose(unitId, loadCallback) {
        let me = this;
        loadCallback = loadCallback || angular.noop;
        return (dispatch, getState)=> {
            let classId = getState().diagnose_selected_clazz.id,
                selectedUnit = getState().unit.selectedUnit,
                url = me.serverInterface.FETCH_UNIT_DIAGNOSE,
                /* url=me.serverInterface.FETCH_UNIT_DIAGNOSE+'?shardingSId='+userId,*/
                params = {chapterId: unitId, classId: classId};
            dispatch({type: DIAGNOSE.FETCH_UNIT_STATISTIC_START});

            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_UNIT_STATISTIC_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let unitDiagnoseStati = {};
                    me.handleLevelStati(unitDiagnoseStati, data.totalStatistics);
                    me.pieChartInit(unitDiagnoseStati);
                    unitDiagnoseStati.totalKnowledgeNumber = data.totalKnowledgeNumber;
                    angular.forEach(data.list, (unit)=> {
                        me.formatLevel(unit.keyValuePairsListRate, unit);
                        unit.fatherCustomizationDTOList = _sortby(unit.fatherCustomizationDTOList, 'content');
                        angular.forEach(unit.fatherCustomizationDTOList, (chapter)=> {
                            chapter.customizationDTOList = _sortby(chapter.customizationDTOList, 'knowledgeName');
                        });
                    });
                    unitDiagnoseStati.list = data.list;
                    dispatch({
                        type: DIAGNOSE.FETCH_UNIT_STATISTIC_SUCCESS,
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
                dispatch({type: DIAGNOSE.FETCH_UNIT_STATISTIC_FAIL});
            });

        };
    }

    fetchHomeDiagnose(loadCallback) {
        let me = this;
        loadCallback = loadCallback || angular.noop;
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let classId = getState().diagnose_selected_clazz.id,
                diagnoseSelectedTextbook = getState().diagnose_selected_textbook,
                diagnoseSelectedGrade = getState().diagnose_selected_grade,
                userId = getState().profile_user_auth.user.userId,
                url = me.serverInterface.FETCH_HOME_DIAGNOSE,
                params = {
                    grade: diagnoseSelectedGrade.num,
                    classId: classId,
                    studentId: userId,
                    code: diagnoseSelectedTextbook.code
                };
            dispatch({type: DIAGNOSE.FETCH_HOME_STATISTIC_START});

            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                /* data={
                 "msg": "success",
                 "code": 200,
                 "list": [
                 {
                 "id": "58933684-52c9-4802-b383-09fab1daedd0",
                 "unitCustomizationDTOList": null,
                 "seqNum": 0,
                 "masterNumber":0,
                 "totalMasterNumber":45,
                 "masterRate": "0/45",
                 "content": "一 认识更大的数"
                 },
                 {
                 "id": "f8b3190e-4c2d-45a9-bd1a-4ffbb33d3432",
                 "unitCustomizationDTOList": null,
                 "seqNum": 1,
                 "masterNumber":0,
                 "totalMasterNumber":42,
                 "masterRate": "0/42",
                 "content": "二 线与角"
                 },
                 {
                 "id": "d6f834d1-a8ba-4495-9b1e-4075c81ef013",
                 "unitCustomizationDTOList": null,
                 "seqNum": 2,
                 "masterNumber":2,
                 "totalMasterNumber":27,
                 "masterRate": "2/27",
                 "content": "三 乘法"
                 },
                 {
                 "id": "a2f5c16e-33c2-4648-be1c-7db90cdf69db",
                 "unitCustomizationDTOList": null,
                 "seqNum": 3,
                 "masterRate": "0/46",
                 "masterNumber":0,
                 "totalMasterNumber":46,
                 "content": "四 运算律"
                 },
                 {
                 "id": "698bd6f9-ebd8-47ac-8e16-0c0450bda7d5",
                 "unitCustomizationDTOList": null,
                 "seqNum": 4,
                 "masterNumber":0,
                 "totalMasterNumber":20,
                 "masterRate": "0/20",
                 "content": "五 方向与位置"
                 },
                 {
                 "id": "c59e9956-da58-4eda-87e3-d0e860b4ab5c",
                 "unitCustomizationDTOList": null,
                 "seqNum": 5,
                 "masterNumber":0,
                 "totalMasterNumber":65,
                 "masterRate": "0/65",
                 "content": "六 除法"
                 },
                 {
                 "id": "514ff6f2-2ecf-408b-9d9c-468cd81d3ea0",
                 "unitCustomizationDTOList": null,
                 "seqNum": 6,
                 "masterNumber":1,
                 "totalMasterNumber":26,
                 "masterRate": "1/26",
                 "content": "七 生活中的负数"
                 },
                 {
                 "id": "f3cf8885-644d-4a90-b90c-71544096115c",
                 "unitCustomizationDTOList": null,
                 "seqNum": 7,
                 "masterNumber":0,
                 "totalMasterNumber":9,
                 "masterRate": "0/9",
                 "content": "八 可能性"
                 },
                 {
                 "id": "4480bc50-cb4e-425d-b266-3caf9af563b7",
                 "unitCustomizationDTOList": null,
                 "seqNum": 8,
                 "masterNumber":0,
                 "totalMasterNumber":3,
                 "masterRate": "0/3",
                 "content": "四年级上期期末真题"
                 }
                 ]
                 };*/
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_HOME_STATISTIC_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let key = classId + '#' + diagnoseSelectedTextbook.code + '#' + diagnoseSelectedGrade.num;
                    dispatch({
                        type: DIAGNOSE.FETCH_HOME_STATISTIC_SUCCESS,
                        payload: {
                            key: key,
                            homeStatisticList: data.list
                        }
                    });


                    let vips = [];
                    if(data.vipDays && data.vipDays!= -1){vips.push({diagnose:data.vipDays})}
                    if(data.raiseScore && data.raiseScore !=-1){vips.push({raiseScore:data.raiseScore})}
                    if(data.raiseScore2){vips.push({raiseScore2:data.raiseScore2})}
                    if(data.raiseScore2Key && data.raiseScore2Key !=-1){vips.push({raiseScore2Key:data.raiseScore2Key})}
                    if(vips.length!=0)dispatch({type:PROFILE.MODIFY_VIPS_INFO,data:vips});
                    defer.resolve(true);
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_HOME_STATISTIC_FAIL});
                defer.resolve(true);
            });
            return defer.promise;

        };
    }

    fetchChapterDiagnose02(loadCallback, clzId, chtId, isIncreaseScore) {
        let me = this;
        loadCallback = loadCallback || angular.noop;
        return (dispatch, getState)=> {
            let classId = clzId || getState().diagnose_selected_clazz.id,
                chapterId = chtId || getState().home_select_chapter.id,
                url = me.serverInterface.FETCH_UNIT_DIAGNOSE,
                params = {chapterId: chapterId, classId: classId};
            dispatch({type: DIAGNOSE.FETCH_CHAPTER_DIAGNOSE_START});

            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseChapterRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_CHAPTER_DIAGNOSE_FAIL});
                    loadCallback(false);
                    return;
                }
                if (data.code === 200) {
                    let chapterDiagnoseStati = {}, showList = [], unitInfo = null, pointIndex = 0;
                    me.handleLevelStati(chapterDiagnoseStati, data.totalStatistics);
                    me.pieChartInit(chapterDiagnoseStati);
                    chapterDiagnoseStati.totalKnowledgeNumber = data.totalKnowledgeNumber;
                    angular.forEach(data.list, (unit)=> {
                        unitInfo = {
                            id: unit.id,
                            content: unit.content,
                            list: []
                        };
                        me.formatLevel(unit.keyValuePairsListRate, unit);
                        unit.fatherCustomizationDTOList = _sortby(unit.fatherCustomizationDTOList, 'content');
                        angular.forEach(unit.fatherCustomizationDTOList, (chapter)=> {
                            chapter.customizationDTOList = _sortby(chapter.customizationDTOList, 'knowledgeName');
                            angular.forEach(chapter.customizationDTOList, (ponit)=> {
                                ponit.numIndex = pointIndex;
                                me.handleLevelText('level', ponit,isIncreaseScore);
                                ponit.parentContent = chapter.content;
                                ponit.pointIndex = pointIndex;
                                pointIndex++;
                                if(data.knowledge2Food){
                                    ponit.petGoods = data.knowledge2Food[ponit.knowledgeId]||{};
                                }
                                if(isIncreaseScore){
                                    switch (ponit.level){
                                        case 1:
                                            ponit.text = "去做题";
                                            break;
                                        case 2:
                                            ponit.text = "去掌握";
                                            break;
                                        case 3:
                                            ponit.text = "去巩固";
                                    }
                                }
                                unitInfo.list.push(ponit);

                            })
                        });
                        showList.push(unitInfo);
                    });
                    chapterDiagnoseStati.list = showList;
                    chapterDiagnoseStati.vipDays = data.vipDays?+data.vipDays:0;
                    chapterDiagnoseStati.raiseScoreDays = data.raiseScore ? +data.raiseScore:0;
                    chapterDiagnoseStati.grade = _find(this.Grades, {num: data.term});

                    dispatch({
                        type: DIAGNOSE.FETCH_CHAPTER_DIAGNOSE_SUCCESS
                    });

                    let vips = [];
                    if(data.vipDays && data.vipDays!= -1){vips.push({diagnose:data.vipDays})}
                    if(data.raiseScore && data.raiseScore !=-1){vips.push({raiseScore:data.raiseScore})}
                    if(data.raiseScore2){vips.push({raiseScore2:data.raiseScore2})}
                    if(data.raiseScore2Key && data.raiseScore2Key !=-1){vips.push({raiseScore2Key:data.raiseScore2Key})}
                    if(vips.length!=0)dispatch({type:PROFILE.MODIFY_VIPS_INFO,data:vips});

                    /*dispatch({
                     type: DIAGNOSE.FETCH_CHAPTER_DIAGNOSE_SUCCESS,
                     payload: {
                     classId: classId,
                     selectedUnit: selectedUnit,
                     unitId: unitId,
                     unitDiagnoseStati: chapterDiagnoseStati
                     }
                     });*/
                    loadCallback(chapterDiagnoseStati);
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_CHAPTER_DIAGNOSE_FAIL});
                loadCallback(false);
            });

        };
    }


    fetchQuestionNew(questionInfo, callback) {
        let me = this, state, url, params = {};
        return (dispatch, getState)=> {
            state = getState();
            //如果有题目就不获取题，只获取掌握进度。
            if ((questionInfo && questionInfo.isSubmitted) //当前试题已提交，显示继续驯服
                || (questionInfo && !questionInfo.isSubmitted && questionInfo.hasLocalAnswer) //当前试题还没有提交
            ) {
                params.onlyProgressFlag = 'only';
            }

            let knowledgePoint = state.chapter_select_point;
            params.classId = state.diagnose_selected_clazz.id;
            params.knowledgeId = knowledgePoint.knowledgeId;
            //url = me.serverInterface.FETCH_QUESTION_NEW;
            url = state.chapter_select_point.pIndex === 0 && state.chapter_select_point.cIndex >= 1 ? me.serverInterface.FETCH_QUESTION_NEW : me.serverInterface.FETCH_QUESTION_NEW_VIP;

            let fetchQuestionServerNew = ()=> {
                dispatch({type: DIAGNOSE.FETCH_QUESTION_START});
                let postInfo = me.commonService.commonPost(url, params, true);
                me.cancelDiagnoseDoRequestList.push(postInfo.cancelDefer);
                postInfo.requestPromise.then((data)=> {
                    if (!data || data.code != 200) {
                        dispatch({type: DIAGNOSE.FETCH_QUESTION_FAIL});
                        return;
                    }
                    if (data && data.code === 200) {
                        let stepNum = {
                            new: data.newQuestion || 0,
                            error: data.error || 0
                        };

                        if (params.onlyProgressFlag) { //只获取进度信息
                            dispatch({
                                type: DIAGNOSE.FETCH_QUESTION_STEP_STATUS_SUCCESS,
                                payload: {
                                    selectedKnowpoint: knowledgePoint,
                                    newQuestionNum: stepNum.new,
                                    errorQuestionNum: stepNum.error
                                }
                            });
                            if (angular.isFunction(callback)) {
                                callback({error: stepNum.error, new: stepNum.new});
                            }
                            return
                        }


                        if (angular.isArray(data.qsTitle) && !data.qsTitle.length) {
                            data.qsTitle = {};
                        } else {
                            me.smallQParse(data.qsTitle);
                        }
                        data.qsTitle.haveQuestion = data.haveQuestion;
                        data.qsTitle.newQuestionNum = stepNum.new;
                        data.qsTitle.errorQuestionNum = stepNum.error;
                        if (data.qsTitle.analysisImgUrl) {
                            data.qsTitle.analysisImgUrl = me.commonService.replaceAnalysisImgAddress(data.qsTitle.analysisImgUrl);
                        }

                        dispatch({
                            type: DIAGNOSE.FETCH_QUESTION_SUCCESS,
                            payload: {
                                selectedKnowpoint: knowledgePoint,
                                questionInfo: data.qsTitle
                            }
                        });
                        if (angular.isFunction(callback)) {
                            callback({error: stepNum.error, new: stepNum.new});
                        }
                    }
                }, (res)=> {
                    dispatch({type: DIAGNOSE.FETCH_QUESTION_FAIL});
                });
            }
            fetchQuestionServerNew();
        }
    }


    fetchChapterDiagnose(chapter, loadCallback) {
        let me = this;
        loadCallback = loadCallback || angular.noop;
        return (dispatch, getState)=> {
            let classId = getState().diagnose_selected_clazz.id,
                selectedUnit = getState().unit.selectedUnit,
                url = me.serverInterface.FETCH_CHAPTER_DIAGNOSE,
                /* url=me.serverInterface.FETCH_UNIT_DIAGNOSE+'?shardingSId='+userId,*/
                params = {unitId: chapter.id, classId: classId};
            dispatch({type: DIAGNOSE.FETCH_CHAPTER_STATISTIC_START});

            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseChapterRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                debugger;
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_CHAPTER_STATISTIC_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let chapterDiagnoseStati = {};
                    if (data.list && data.list.length) {
                        data.list = _sortby(data.list, 'content');
                        angular.forEach(data.list, (chapter)=> {
                            chapter.customizationDTOList = _sortby(chapter.customizationDTOList, 'knowledgeName');
                        });
                    }
                    angular.forEach(data.totalStatistics, (item)=> {
                        this.handleLevelColor('level', item);
                    });
                    chapterDiagnoseStati.totalStatistics = this.commonService.getRowColArray(data.totalStatistics, 2);
                    chapterDiagnoseStati.list = data.list;
                    dispatch({
                        type: DIAGNOSE.FETCH_CHAPTER_STATISTIC_SUCCESS,
                        payload: {
                            classId: classId,
                            selectedUnit: selectedUnit,
                            chapter: chapter,
                            chapterDiagnoseStati: chapterDiagnoseStati
                        }
                    });
                    loadCallback(chapterDiagnoseStati.totalStatistics);
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_CHAPTER_STATISTIC_FAIL});
            });

        };
    }

    fetchDiagnoseReport(loadMore, loadMoreCallback,isIncreaseScore) {
        loadMoreCallback = loadMoreCallback || angular.noop;
        let me = this;
        return (dispatch, getState)=> {
            let state = getState();
            //如果这个单元没有试题列表，无需加载更多数据
            let chapterSelectPoint = state.chapter_select_point;
            let knowledgeReportStoreValue = state.knowledge_with_report[chapterSelectPoint.knowledgeId] || {};
            let qRecords = knowledgeReportStoreValue.qRecords;
            let report = knowledgeReportStoreValue.report || {};
            let userId = state.profile_user_auth.user.userId,
                url = me.serverInterface.FETCH_DIAGNOSE_REPORT;
            if (loadMore && (!qRecords || qRecords.length === 0))return loadMoreCallback(loadMore);
            if (!loadMore) { //如果没有加载更多的选项，则表示更新列表下所有的内容，则需要重新设置分页信息
                dispatch({
                    type: DIAGNOSE.CHANGE_Q_RECORDS_PAGINATION_INFO,
                    payload: {
                        lastKey: 0,
                        quantity: 16
                    }
                });
            }

            state = getState(); //刷新 state
            let limitQuery = state.q_records_pagination_info;
            let params = {
                knowledgeId: chapterSelectPoint.knowledgeId,
                classId: state.diagnose_selected_clazz.id,
                lastKey: limitQuery.lastKey,
                quantity: limitQuery.quantity,
                countNum: (qRecords && Math.floor(qRecords.length/limitQuery.quantity)) || 0
            };
            dispatch({type: DIAGNOSE.FETCH_DIAGNOSE_REPORT_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseReportRequestList.push(postInfo.cancelDefer);
            let handleMasterLevelText = (level, item, report)=> {
                switch (item[level]) {
                    case 'first':
                        item.showImg = 'diagnose/diagnose_report_right.png';
                        break;
                    case "mistake":
                        item.showImg = 'diagnose/diagnose_report_edit.png';
                        break;
                    case "error":
                        item.showImg = 'diagnose/diagnose_report_error.png';
                        let numArr = item.value.match(/\d+/);
                        report.wrongNum = numArr ? +numArr[0] : 0;
                        break;
                    case "master":
                        item.numIndex = getState().chapter_select_point.numIndex;
                        me.handleLevelText('value', item,isIncreaseScore);
                        break;
                }
            }
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_Q_RECORDS_FAIL});
                    return;
                }
                if (data && data.code === 200) {

                    /*dispatch({
                     type: DIAGNOSE.FETCH_Q_RECORDS_SUCCESS,
                     payload: {selectedKnowpoint:unitSelectKnowledge_,qRecords: data.qsTitles,loadMore:loadMore}
                     });*/
                    let qRecords = null;
                    if (data.qsTitles) {
                        qRecords = me.smallQListParse(data.qsTitles, true, data.history[userId], false);
                        qRecords = _sortby(qRecords, [function (item) {
                            return -item.innerCreateTimeCount;
                        }]);
                        dispatch({
                            type: DIAGNOSE.CHANGE_Q_RECORDS_PAGINATION_INFO,
                            payload: {
                                lastKey: data.lastKey,
                                quantity: 16
                            }
                        });
                    }
                    report.allMsg = data.allMsg ? data.allMsg : report.allMsg;
                    angular.forEach(data.list, (item)=> {
                        handleMasterLevelText('key', item, report);
                    });
                    report.masterList = data.list ? data.list : report.masterList;
                    dispatch({
                        type: DIAGNOSE.FETCH_DIAGNOSE_REPORT_SUCCESS,
                        payload: {
                            selectedKnowpoint: chapterSelectPoint,
                            qRecords: qRecords,
                            loadMore: loadMore,
                            report: report,
                            knowledgeReportStoreValue: knowledgeReportStoreValue
                        }
                    });

                    if (!qRecords || (loadMore && qRecords.length < limitQuery.quantity) || (!loadMore && qRecords.length < 16))
                        loadMoreCallback(loadMore, true);
                    else
                        loadMoreCallback(loadMore);
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_DIAGNOSE_REPORT_FAIL});
            });
        }
    }

    fetchDiagnoseReportForWork(loadMore, loadMoreCallback, klId, claszId) {
        loadMoreCallback = loadMoreCallback || angular.noop;
        let me = this;

        return (dispatch, getState)=> {
            let state = getState();
            //如果这个单元没有试题列表，无需加载更多数据
            let chapterSelectPoint = state.select_work_knowledge;
            let knowledgeId = klId || chapterSelectPoint.knowledgeId;
            let clazzId = claszId || state.diagnose_selected_clazz.id;
            // let knowledgeReportStoreValue = state.knowledge_with_report[chapterSelectPoint.knowledgeId] || {};
            let knowledgeReportStoreValue = state.knowledge_with_report[knowledgeId] || {};
            let qRecords = knowledgeReportStoreValue.qRecords;
            let report = knowledgeReportStoreValue.report || {};
            let userId = state.profile_user_auth.user.userId,
                url = me.serverInterface.FETCH_DIAGNOSE_REPORT;
            if (loadMore && (!qRecords || qRecords.length === 0))return loadMoreCallback(loadMore);
            if (!loadMore) { //如果没有加载更多的选项，则表示更新列表下所有的内容，则需要重新设置分页信息
                dispatch({
                    type: DIAGNOSE.CHANGE_Q_RECORDS_PAGINATION_INFO,
                    payload: {
                        lastKey: 0,
                        quantity: 16
                    }
                });
            }

            state = getState(); //刷新 state
            let limitQuery = state.q_records_pagination_info;
            let params = {
                knowledgeId: chapterSelectPoint.knowledgeId,
                // knowledgeId: knowledgeId,
                // classId: state.diagnose_selected_clazz.id,
                classId: clazzId,
                lastKey: limitQuery.lastKey,
                quantity: limitQuery.quantity,
                // countNum: (qRecords && Math.floor(qRecords.length/limitQuery.quantity)) || 0
                countNum: loadMore ? qRecords.length+limitQuery.quantity :limitQuery.quantity
            };
            dispatch({type: DIAGNOSE.FETCH_DIAGNOSE_REPORT_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseReportRequestList.push(postInfo.cancelDefer);
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
                        item.numIndex = getState().chapter_select_point.numIndex;
                        me.handleLevelText('value', item);
                        break;
                }
            }
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_Q_RECORDS_FAIL});
                    return;
                }
                if (data && data.code === 200) {

                    /*dispatch({
                     type: DIAGNOSE.FETCH_Q_RECORDS_SUCCESS,
                     payload: {selectedKnowpoint:unitSelectKnowledge_,qRecords: data.qsTitles,loadMore:loadMore}
                     });*/
                    let qRecords = null;
                    if (data.qsTitles) {
                        qRecords = me.smallQListParse(data.qsTitles, true, data.history[userId], false);
                        qRecords = _sortby(qRecords, [function (item) {
                            return -item.innerCreateTimeCount;
                        }]);
                        dispatch({
                            type: DIAGNOSE.CHANGE_Q_RECORDS_PAGINATION_INFO,
                            payload: {
                                lastKey: data.lastKey,
                                quantity: 16
                            }
                        });
                    }
                    report.allMsg = data.allMsg ? data.allMsg : report.allMsg;
                    angular.forEach(data.list, (item)=> {
                        handleMasterLevelText('key', item);
                    });
                    report.masterList = data.list ? data.list : report.masterList;
                    dispatch({
                        type: DIAGNOSE.FETCH_DIAGNOSE_REPORT_SUCCESS,
                        payload: {
                            selectedKnowpoint: chapterSelectPoint,
                            // selectedKnowpoint: knowledgeId,
                            qRecords: qRecords,
                            loadMore: loadMore,
                            report: report,
                            knowledgeReportStoreValue: knowledgeReportStoreValue
                        }
                    });

                    if (!qRecords || (loadMore && qRecords.length < limitQuery.quantity) || (!loadMore && qRecords.length < limitQuery.quantity))
                        loadMoreCallback(loadMore, true);
                    else
                        loadMoreCallback(loadMore);
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_DIAGNOSE_REPORT_FAIL});
            });
        }
    }


    unitSelectKnowledge(knowledgePoint) {
        let index = knowledgePoint.knowledgeName.indexOf('.');
        knowledgePoint.knowledgeNameText = knowledgePoint.knowledgeName.substring(index + 1, knowledgePoint.knowledgeName.length);
        return (dispatch)=> {
            dispatch({
                type: DIAGNOSE.UNIT_SELECT_KNOWLEDGE,
                payload: knowledgePoint
            });
        };
    }

    unitSelectChapter(chapter) {
        /*chapter.keyValuePairsListRate=_sortby(chapter.keyValuePairsListRate,'sort');
         angular.forEach(chapter.keyValuePairsListRate,(item)=>{
         this.handleLevelColor('sort',item);
         });
         chapter.showImgMap=this.commonService.getRowColArray(chapter.keyValuePairsListRate,2);*/
        return (dispatch)=> {
            dispatch({
                type: DIAGNOSE.UNIT_SELECT_CHAPTER,
                payload: chapter
            });
        };
    }


    fetchUnitKnowledgeDiagnose(knowledgePoint) {
        let me = this;
        return (dispatch, getState)=> {
            let userId = getState().profile_user_auth.user.userId,
                url = me.serverInterface.FETCH_UNIT_KNOWLEDGE_DIAGNOSE,
                /* url=me.serverInterface.FETCH_UNIT_KNOWLEDGE_DIAGNOSE+'?shardingSId='+userId,*/
                params = {knowledgeId: knowledgePoint.knowledgeId, classId: getState().diagnose_selected_clazz.id};
            dispatch({type: DIAGNOSE.FETCH_UNIT_KNOWLEDGE_STATI_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseImproveRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_UNIT_KNOWLEDGE_STATI_FAIL});
                    return;
                }
                if (data.code === 200) {
                    //data.list.unshift({key:'学习要点',value:knowledgePoint.knowledgeName});
                    let knowledgeDiagnoseStati = {}, text = "";
                    knowledgeDiagnoseStati.list = data.list;
                    angular.forEach(data.list, (item)=> {
                        text += item.value + '，';
                    });
                    knowledgeDiagnoseStati.showListText = text ? text.substring(0, text.length - 1) : text;
                    //knowledgeDiagnoseStati.list=[{"key":"学习要点","value":"举例说明末尾不够除的小数除以整数的意义","$$hashKey":"object:47"},{"key":"做题情况","value":"该学习要点一共做5道题，4道题出错，改错过程中又出错3次","$$hashKey":"object:48"},{"key":"结论","value":"掌握的可能性: 低","$$hashKey":"object:49"}];
                    knowledgeDiagnoseStati.signalGraph = data.signalGraph;
                    knowledgeDiagnoseStati.suggest = data.suggest;
                    angular.forEach(data.suggest, (item)=> {
                        if (item.key === 'button')
                            knowledgeDiagnoseStati.suggestCode = item.sort;
                        if (item.key === 'text')
                            knowledgeDiagnoseStati.suggestMsg = item.value;
                    });
                    dispatch({
                        type: DIAGNOSE.FETCH_UNIT_KNOWLEDGE_STATI_SUCCESS,
                        payload: {
                            selectedKnowpoint: knowledgePoint,
                            knowledgeDiagnoseStati: knowledgeDiagnoseStati
                        }
                    });
                    return;
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_UNIT_KNOWLEDGE_STATI_FAIL});
            });
        }
    }

    fetchQRecords(loadMore, loadMoreCallback) {
        loadMoreCallback = loadMoreCallback || angular.noop;
        let me = this;
        return (dispatch, getState)=> {
            let state = getState();
            //如果这个单元没有试题列表，无需加载更多数据
            let unitSelectKnowledge_ = state.unit_select_knowledge;
            let knowledgeStateKey = getDiagnoseknowledgeStateKey(unitSelectKnowledge_);
            let qRecords = state.knowledge_with_diagnose_stati[knowledgeStateKey].qRecords;
            let userId = state.profile_user_auth.user.userId,
                url = me.serverInterface.FETCH_UNIT_Q_RECORDS;
            /* url=me.serverInterface.FETCH_UNIT_Q_RECORDS+'?shardingSId='+userId;*/
            if (loadMore && (!qRecords || qRecords.length === 0))return loadMoreCallback(loadMore);
            if (!loadMore) { //如果没有加载更多的选项，则表示更新列表下所有的内容，则需要重新设置分页信息
                dispatch({
                    type: DIAGNOSE.CHANGE_Q_RECORDS_PAGINATION_INFO,
                    payload: {
                        lastKey: 0,
                        quantity: 16
                    }
                });
            }

            state = getState(); //刷新 state
            let limitQuery = state.q_records_pagination_info;
            let params = {
                knowledgeId: unitSelectKnowledge_.knowledgeId,
                classId: state.diagnose_selected_clazz.id,
                lastKey: limitQuery.lastKey,
                quantity: limitQuery.quantity
            };
            dispatch({type: DIAGNOSE.FETCH_Q_RECORDS_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseQRecordsRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_Q_RECORDS_FAIL});
                    return;
                }
                if (data && data.code === 200) {

                    /*dispatch({
                     type: DIAGNOSE.FETCH_Q_RECORDS_SUCCESS,
                     payload: {selectedKnowpoint:unitSelectKnowledge_,qRecords: data.qsTitles,loadMore:loadMore}
                     });*/
                    let qRecords = null;
                    if (data.qsTitles) {
                        qRecords = me.smallQListParse(data.qsTitles, true, data.history[userId]);
                        qRecords = _sortby(qRecords, [function (item) {
                            return -item.innerCreateTimeCount;
                        }]);
                        dispatch({
                            type: DIAGNOSE.CHANGE_Q_RECORDS_PAGINATION_INFO,
                            payload: {
                                lastKey: data.lastKey,
                                quantity: 15
                            }
                        });
                    }
                    dispatch({
                        type: DIAGNOSE.FETCH_Q_RECORDS_SUCCESS,
                        payload: {selectedKnowpoint: unitSelectKnowledge_, qRecords: qRecords, loadMore: loadMore}
                    });

                    if (!qRecords || (loadMore && qRecords.length < limitQuery.quantity) || (!loadMore && qRecords.length < 15))
                        loadMoreCallback(loadMore, true);
                    else
                        loadMoreCallback(loadMore);
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_Q_RECORDS_FAIL});
            });
        }
    }


    fetchErrorQRecords(questionInfo, loadCallback) {
        loadCallback = loadCallback || angular.noop;
        let me = this;
        return (dispatch, getState)=> {
            let url = me.serverInterface.FETCH_DIAGNOSE_Q_ERROR_RECORDS,
                userId = getState().profile_user_auth.user.userId,
                params = {
                    classId: getState().diagnose_selected_clazz.id,
                    questionId: questionInfo.id
                };
            dispatch({type: DIAGNOSE.FETCH_ERROR_Q_RECORDS_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseErrorQRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_ERROR_Q_RECORDS_FAIL});
                    return;
                }
                if (data && data.code === 200) {

                    /*data={
                     "msg": "success",
                     "code": 200,
                     "qsTitles": [
                     {
                     "id": "66f7459d-b6c1-41b7-b57c-4a26f4505bab",
                     "instanceId": null,
                     "question": "<div class=\"layout-box\"><p>数一数，填一填。</p><p><span class=\"absolute-edit-area\" style=\"display: block;text-align: center; min-width: 15px; min-height: 15px;padding: 10px 0 10px 0;position: relative;\" contenteditable=\"false\"><img class=\"img_big\"  src=\"http://${ip}:90/img/20160817115629_30d03f40-1370-433d-8c12-7f45bf803f02.png\" /></span></p><p>&nbsp;</p><p>5可以用来表示图<span class=\"appTextarea input-area select-input-area square-select-input-area\"  style=\"width: 40px; height: 30px;\"  id=\"q1f7459d-b6c1-41b7-b57c-4a26f4505bab\" label=\"Q1\"></span>。</p><p>4可以用来表示图<span class=\"appTextarea input-area select-input-area square-select-input-area\"  style=\"width: 40px; height: 30px;\"  id=\"q2f7459d-b6c1-41b7-b57c-4a26f4505bab\" label=\"Q2\"></span>。</p><p>6可以用来表示图<span class=\"appTextarea input-area select-input-area square-select-input-area\"  style=\"width: 40px; height: 30px;\"  id=\"q3f7459d-b6c1-41b7-b57c-4a26f4505bab\" label=\"Q3\"></span>。</p><p>&nbsp;</p></div>",
                     "answerKey": "[{\"type\":\"standalone\",\"scorePoints\":[{\"label\":\"得分点1\",\"uuid\":\"66f745q1-b6c1-41b7-b57c-4a26f4505bab\",\"referInputBoxes\":[{\"label\":\"Q1\",\"uuid\":\"q1f7459d-b6c1-41b7-b57c-4a26f4505bab\",\"info\":{\"type\":{\"name\":\"blank\",\"val\":\"无边框\"},\"selectItem\":[{\"expr\":\"a\"},{\"expr\":\"c\"},{\"expr\":\"b\"}]}}],\"answerList\":[{\"expr\":\"b\",\"uuid\":\"66f7459d-q1c1-41b7-b57c-4a26f4505bab\"}],\"openStyle\":0},{\"label\":\"得分点2\",\"uuid\":\"66f745q2-b6c1-41b7-b57c-4a26f4505bab\",\"referInputBoxes\":[{\"label\":\"Q2\",\"uuid\":\"q2f7459d-b6c1-41b7-b57c-4a26f4505bab\",\"info\":{\"type\":{\"name\":\"blank\",\"val\":\"无边框\"},\"selectItem\":[{\"expr\":\"b\"},{\"expr\":\"c\"},{\"expr\":\"a\"}]}}],\"answerList\":[{\"expr\":\"a\",\"uuid\":\"66f7459d-q2c1-41b7-b57c-4a26f4505bab\"}],\"openStyle\":0},{\"label\":\"得分点3\",\"uuid\":\"66f745q3-b6c1-41b7-b57c-4a26f4505bab\",\"referInputBoxes\":[{\"label\":\"Q3\",\"uuid\":\"q3f7459d-b6c1-41b7-b57c-4a26f4505bab\",\"info\":{\"type\":{\"name\":\"blank\",\"val\":\"无边框\"},\"selectItem\":[{\"expr\":\"c\"},{\"expr\":\"b\"},{\"expr\":\"a\"}]}}],\"answerList\":[{\"expr\":\"c\",\"uuid\":\"66f7459d-q3c1-41b7-b57c-4a26f4505bab\"}],\"openStyle\":0}]}]",
                     "score": 10,
                     "knowledgeId": "ffe5d23f-da0d-4fac-bfb7-292bcb40013f",
                     "difficulty": null,
                     "capability": null,
                     "cognition": null
                     }
                     ],
                     "history": {
                     "0": {
                     "score": 0,
                     "ignore": null,
                     "id2ScorePointScore": {
                     "66f745q1-b6c1-41b7-b57c-4a26f4505bab": {
                     "id": "66f745q1-b6c1-41b7-b57c-4a26f4505bab",
                     "score": 0,
                     "answer": null,
                     "correctness": -1
                     },
                     "66f745q2-b6c1-41b7-b57c-4a26f4505bab": {
                     "id": "66f745q2-b6c1-41b7-b57c-4a26f4505bab",
                     "score": 0,
                     "answer": null,
                     "correctness": -1
                     },
                     "66f745q3-b6c1-41b7-b57c-4a26f4505bab": {
                     "id": "66f745q3-b6c1-41b7-b57c-4a26f4505bab",
                     "score": 0,
                     "answer": null,
                     "correctness": -1
                     }
                     }
                     }
                     }
                     };*/
                    let smallQ = angular.copy(questionInfo);
                    if (!data.qsTitles || !data.qsTitles.length) {
                        return;
                    }
                    // me.smallQParseForStat(smallQ, data.history);
                    let qRecords = me.smallQListParse(data.qsTitles, true, data.history[userId], true);
                    dispatch({
                        type: DIAGNOSE.FETCH_ERROR_Q_RECORDS_SUCCESS
                    });
                    loadCallback(qRecords);
                    /*dispatch({
                     type: DIAGNOSE.FETCH_ERROR_Q_RECORDS_SUCCESS,
                     payload: {qStateKey: questionInfo.qStateKey, qErrorRecords: smallQ}
                     });*/
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_ERROR_Q_RECORDS_FAIL});
            });
        }
    }

    saveQuestionLocal(questionInfo, knowledgePoint, slideIndex) {
        questionInfo.spStu = questionInfo.spStu ? questionInfo.spStu : {};
        questionInfo.spStu.answer = this.getQAns(questionInfo, slideIndex).ansStrArray;
        questionInfo.hasLocalAnswer = true;
        //this.smallQParse(questionInfo);
        return (dispatch, getState)=> {
            dispatch({
                type: DIAGNOSE.FETCH_QUESTION_SUCCESS,
                payload: {
                    selectedKnowpoint: knowledgePoint,
                    questionInfo: questionInfo
                }
            });
        }
    }

    clearKnowledgeQ(knowledgePoint) {
        return (dispatch, getState)=> {
            dispatch({
                type: DIAGNOSE.DIAGNOSE_CLEAR_QUESTION,
                payload: {
                    selectedKnowpoint: knowledgePoint
                }
            });
        }
    }

    pointNameFormat(ponitInfo) {
        let pointName = '';
        if (ponitInfo.level === 1)
            pointName = (this.getRootScope().isIncreaseScore?'考点':'唤醒考点' )+ (ponitInfo.pointIndex + 1);
        else if (ponitInfo.level === 4)
            pointName = (this.getRootScope().isIncreaseScore?'考点':'喂养考点' )+ (ponitInfo.pointIndex + 1);
        else
            pointName = (this.getRootScope().isIncreaseScore?'考点':'驯服考点' )+ (ponitInfo.pointIndex + 1);
        return pointName
    }

    submitQuestion(questionInfo, knowledgePoint, slideIndex, callback, scope,isIncreaseScore) {
        callback = callback || angular.noop;
        let me = this, userAns,
            params = {
                knowledgeId: knowledgePoint.knowledgeId,
                instanceId: questionInfo.paperInstanceId,
                subjectType: '3'  //单题类型
            };
        userAns = this.getQAns(questionInfo, slideIndex);
        params.answer = JSON.stringify({questionId: questionInfo.id, workStatus: 0, answers: userAns.ansStrArray});
        return (dispatch, getState)=> {
            if (userAns.isAllInputBoxesEmpty) {
                scope.$emit('diagnose.dialog.show',
                    {'comeFrom': 'diagnose', 'content': '小伙伴，不能提交空白答案的哦！'}
                );
                return;
            }
            let userId = getState().profile_user_auth.user.userId,
                url = me.serverInterface.UNIT_SUBMIT_Q,
                chapterSelectPoint = getState().chapter_select_point;
            params.classId = getState().diagnose_selected_clazz.id;

            dispatch({type: DIAGNOSE.DIAGNOSE_SUBMIT_Q_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseDoRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {
                    if (data.code === 20002) {
                        dispatch({type: DIAGNOSE.DIAGNOSE_SUBMIT_Q_FAIL});
                        callback(data.msg);
                        return;
                    }

                    dispatch({type: DIAGNOSE.DIAGNOSE_SUBMIT_Q_FAIL});
                    callback(false);
                    return;
                }

                if (data && data.code === 200) {
                    questionInfo.hasNoSubmit = false;
                    let repeatData = {};
                    try {
                        me.smallQParseForStat(questionInfo, data.list, repeatData);
                    } catch (e) {
                        console.log('诊断做题提交后', e);
                    }
                    questionInfo.inputListForCorrect = repeatData.inputListForCorrect;
                    questionInfo.isSubmitted = true;
                    questionInfo.hasLocalAnswer = false;
                    questionInfo.suggestCode = data.suggest;
                    data.numIndex = getState().chapter_select_point.numIndex;
                    me.handleLevelText('master', data,isIncreaseScore);

                    questionInfo.masterDegreeUrl = data.showImg;
                    let retValue = {
                        suggestCode: data.suggest,
                        master: data.master,
                        masterDegreeUrl: data.showImg,
                        // knowledgePointShowImg: angular.copy(knowledgePoint.showImg)
                        knowledgePointShowImg: data.showImg
                    };

                    if (data.master <= 2) {
                        retValue.rightAnimateFlag = -1;
                    } else if (data.master == 3 && knowledgePoint.level == data.master) {
                        retValue.rightAnimateFlag = 0;
                    } else {
                        retValue.rightAnimateFlag = 1;
                    }
                    knowledgePoint.showImg = data.showImg;
                    knowledgePoint.level = data.master;
                    knowledgePoint.suggestCode = data.suggest;
                    dispatch({
                        type: DIAGNOSE.DIAGNOSE_SUBMIT_Q_SUCCESS,
                        payload: knowledgePoint
                    });
                    if (data.master == 2 && data.suggest == 2) {
                        dispatch({
                            type: DIAGNOSE.SUBTRACT_DIAGNOSE_REPORT_WRONG_NUM,
                            payload: {
                                knowledgeId: chapterSelectPoint.knowledgeId
                            }
                        });
                    }
                    callback(retValue);
                    return;
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.DIAGNOSE_SUBMIT_Q_FAIL});
                callback(false);
            });
        }
    }

    fetchQuestionServer(dispatch, url, params, knowledgePoint, me, qType) {
        dispatch({type: DIAGNOSE.FETCH_QUESTION_START});
        let postInfo = me.commonService.commonPost(url, params, true);
        me.cancelDiagnoseDoRequestList.push(postInfo.cancelDefer);
        postInfo.requestPromise.then((data)=> {
            /* data={
             "msg": "success",
             "flag": true,
             "code": 200,
             "qsTitle": {
             "id": "9ed52e39-6ea2-46c7-9797-5a560be4c917",
             "question": "<div class=\"layout-box\"><p>数一数，填一填。</p><p><span class=\"absolute-edit-area\" style=\"display: block;text-align: center; min-width: 15px; min-height: 15px;padding: 10px 0 10px 0;position: relative;\" contenteditable=\"false\"><img class=\"img_big\"  src=\"http://${ip}:90/img/20160816120635_fcb15f62-b773-4bb3-ba2e-0ba23cf77354.png\" /></span></p><p>&nbsp;</p><p>图<span class=\"appTextarea input-area select-input-area square-select-input-area\"  style=\"width: 40px; height: 30px;\"  id=\"q16224d3-ffcb-403e-9c64-4a45caa76a60\" label=\"Q1\"></span>用数9来表示。</p><p>图<span class=\"appTextarea input-area select-input-area square-select-input-area\"  style=\"width: 40px; height: 30px;\"  id=\"q26224d3-ffcb-403e-9c64-4a45caa76a60\" label=\"Q2\"></span>用数7来表示。</p><p>图<span class=\"appTextarea input-area select-input-area square-select-input-area\"  style=\"width: 40px; height: 30px;\"  id=\"q36224d3-ffcb-403e-9c64-4a45caa76a60\" label=\"Q3\"></span>用数6来表示。</p><p>&nbsp;</p></div>",
             "answerKey": "[{\"type\":\"standalone\",\"scorePoints\":[{\"label\":\"得分点1\",\"uuid\":\"dc6224q1-ffcb-403e-9c64-4a45caa76a60\",\"referInputBoxes\":[{\"label\":\"Q1\",\"uuid\":\"q16224d3-ffcb-403e-9c64-4a45caa76a60\",\"info\":{\"type\":{\"name\":\"blank\",\"val\":\"无边框\"},\"selectItem\":[{\"expr\":\"B\"},{\"expr\":\"A\"},{\"expr\":\"C\"}]}}],\"answerList\":[{\"expr\":\"B\",\"uuid\":\"dc6224d3-q1cb-403e-9c64-4a45caa76a60\"}],\"openStyle\":0},{\"label\":\"得分点2\",\"uuid\":\"dc6224q2-ffcb-403e-9c64-4a45caa76a60\",\"referInputBoxes\":[{\"label\":\"Q2\",\"uuid\":\"q26224d3-ffcb-403e-9c64-4a45caa76a60\",\"info\":{\"type\":{\"name\":\"blank\",\"val\":\"无边框\"},\"selectItem\":[{\"expr\":\"C\"},{\"expr\":\"B\"},{\"expr\":\"A\"}]}}],\"answerList\":[{\"expr\":\"A\",\"uuid\":\"dc6224d3-q2cb-403e-9c64-4a45caa76a60\"}],\"openStyle\":0},{\"label\":\"得分点3\",\"uuid\":\"dc6224q3-ffcb-403e-9c64-4a45caa76a60\",\"referInputBoxes\":[{\"label\":\"Q3\",\"uuid\":\"q36224d3-ffcb-403e-9c64-4a45caa76a60\",\"info\":{\"type\":{\"name\":\"blank\",\"val\":\"无边框\"},\"selectItem\":[{\"expr\":\"B\"},{\"expr\":\"C\"},{\"expr\":\"A\"}]}}],\"answerList\":[{\"expr\":\"C\",\"uuid\":\"dc6224d3-q3cb-403e-9c64-4a45caa76a60\"}],\"openStyle\":0}]}]",
             "score": 10,
             "knowledgeId": "f0a36f87-d863-479a-865e-d5dbf84f360c",
             "difficulty": 1,
             "capability": "root3A",
             "cognition": "root2B"
             }
             };*/
            if (!data || data.code != 200) {
                dispatch({type: DIAGNOSE.FETCH_QUESTION_FAIL});
                return;
            }
            if (data && data.code === 200) {
                if ((qType === me.finalData.DIAGNOSE_BTN_TYPE.NOT_START || qType === me.finalData.DIAGNOSE_BTN_TYPE.TEST_AGAIN
                    || qType === me.finalData.DIAGNOSE_BTN_TYPE.PERSONAL_TAILOR) && !data.flag) {//未获取到了新题
                    dispatch({
                        type: DIAGNOSE.FETCH_QUESTION_NO_QUESTION,
                        payload: {
                            selectedKnowpoint: knowledgePoint,
                            noQuestionTip: data.qsTitle
                        }
                    });
                    return;
                }
                me.smallQParse(data.qsTitle);
                dispatch({
                    type: DIAGNOSE.FETCH_QUESTION_SUCCESS,
                    payload: {
                        selectedKnowpoint: knowledgePoint,
                        questionInfo: data.qsTitle
                    }
                });
            }
        }, (res)=> {
            dispatch({type: DIAGNOSE.FETCH_QUESTION_FAIL});
        });
    }

    fetchQuestion(knowledgePoint, qType, questionInfo) {
        let me = this, state, storeKey,
            params = {knowledgeId: knowledgePoint.knowledgeId, code: qType};
        let url = me.serverInterface.FETCH_UNIT_NEW_QUESTION;
        if (qType === me.finalData.DIAGNOSE_BTN_TYPE.NOT_START || qType === me.finalData.DIAGNOSE_BTN_TYPE.TEST_AGAIN)
            url = me.serverInterface.FETCH_UNIT_NEW_QUESTION;
        else if (qType === me.finalData.DIAGNOSE_BTN_TYPE.PERSONAL_TAILOR)
            url = me.serverInterface.FETCH_UNIT_NEW_QUESTION_AUTHORITY;
        else
            url = me.serverInterface.FETCH_UNIT_ERROR_QUESTION;

        return (dispatch, getState)=> {
            state = getState();
            let userId = state.profile_user_auth.user.userId;
            /* url=url+'?shardingSId='+userId;*/
            //如果有题目就不去获取了。否则就去服务器去取。
            if (questionInfo && questionInfo.isSubmitted)return;
            if (questionInfo && !questionInfo.isSubmitted && questionInfo.hasLocalAnswer)return;
            params.classId = state.diagnose_selected_clazz.id;
            me.fetchQuestionServer(dispatch, url, params, knowledgePoint, me, qType);
        }
    }

    goToErrorQRecords(questionInfo, knowledgeStateKey) {
        let qStateKey = knowledgeStateKey + '/' + questionInfo.id;
        questionInfo.qStateKey = qStateKey;
        return (dispatch)=> {
            dispatch({
                type: DIAGNOSE.KNOWLEDGE_SELECTED_Q,
                payload: {questionInfo: questionInfo}
            });
            dispatch({
                type: DIAGNOSE.GO_TO_ERROR_RECORDS,
                payload: {qStateKey: qStateKey}
            });
        }
    }

    goToDoQuestion(typeCode) {
        return (dispatch)=> {
            dispatch({
                type: DIAGNOSE.GO_TO_DO_QUESTION,
                payload: {type: typeCode}
            });
        }
    }

    /**
     * 获取当前要保存答案的小题 的最新答案
     */
    getQAns(currentQ, slideIndex) {
        let currentQInputList = currentQ.inputList,//获取当前小题得分点的复本
            ansStrArray = [], //答案集合
            isAllInputBoxesEmpty = true,//答案输入框是否为空
            hasChangeAnsFlag = false, //答案是否有变化
            parentELe = $($('ion-slide[data-index=' + slideIndex + ']')).find('div[compile-html]');
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


    /**
     * 获取所有的教材列表
     * @returns {promise}
     */
    getTextbookList(callBack) {
        callBack = callBack || angular.noop;
        let postInfo = this.commonService.commonPost(this.serverInterface.GET_TEXTBOOK_LIST_V2,
            {
                depth: 4,
                categories: "normal"
            },
            true);
        this.cancelDiagnoseRequestList.push(postInfo.cancelDefer);
        postInfo.requestPromise.then((data)=> {
            if (data.code === 200) {
                /* _each(data.detail, (v)=> {//每一个教材版本设置展开flag(展开教材)
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

                 });*/
                callBack(data.detail,data.synTrainHiddenTagIds);
                return;
            }
            callBack(false);
        }, ()=> {
            callBack(false);
        });
    }

    /**
     * 获取所有的年级
     * @returns {promise}
     */
    getAllGrades(callBack) {
        callBack = callBack || angular.noop;
        let postInfo = this.commonService.commonPost(this.serverInterface.GET_ALL_GRADES, null, true);
        this.cancelDiagnoseRequestList.push(postInfo.cancelDefer);
        postInfo.requestPromise.then((data)=> {
            if (data && data.code === 200) {
                callBack(data);
                return;
            }
            callBack(false);
        }, ()=> {
            callBack(false);
        });
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
     * @param isGetErrorRecords
     */
    smallQListParse(smallQList, isStat, userHistory, isGetErrorRecords) {
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
                    let smallQStuAnsMapListTempList = [];
                    for (let key in smallQHistory) {
                        me.smallQParseForStat(smallQ, smallQHistory[key]);
                        smallQ.innerCreateTime = smallQ.smallQStuAnsMapList[0].createTime || '';
                        smallQ.innerCreateTime = smallQ.innerCreateTime.replace(/\-/g, "/");//safari不认识new Date('2016-10-22 14:00')
                        smallQ.innerCreateTimeCount = (new Date(smallQ.innerCreateTime)).getTime();
                        smallQ.quesIdAndInstanceId = key;
                        smallQ.quesFrom = Object.keys(smallQHistory[key]);
                        /*if(smallQ.quesFrom&&smallQ.quesFrom.length){
                         smallQ.quesFrom = smallQ.quesFrom[0];
                         }*/


                        if (isGetErrorRecords) {
                            let smallQStuAnsMapItem;
                            for (let itemKey in smallQ.smallQStuAnsMapList) {
                                smallQStuAnsMapItem = smallQ.smallQStuAnsMapList[itemKey];
                                smallQStuAnsMapItem.innerCreateTime = smallQStuAnsMapItem.createTime || '';
                                smallQStuAnsMapItem.innerCreateTime = smallQStuAnsMapItem.innerCreateTime.replace(/\-/g, "/");//safari不认识new Date('2016-10-22 14:00')
                                smallQStuAnsMapItem.innerCreateTimeCount = (new Date(smallQStuAnsMapItem.innerCreateTime)).getTime();
                                smallQStuAnsMapListTempList.push(smallQStuAnsMapItem);
                            }
                        }

                        if (!isGetErrorRecords) {//如果是做题记录，就需要给smallQStuAnsMapList进行升序排序
                            smallQ.smallQStuAnsMapList = _sortby(smallQ.smallQStuAnsMapList, [function (item) {
                                return item.innerCreateTimeCount;
                            }]);
                            newSmallQList.push(angular.copy(smallQ));
                        }

                    }
                    if (isGetErrorRecords) {
                        smallQStuAnsMapListTempList = _sortby(smallQStuAnsMapListTempList, [function (item) {
                            return -item.innerCreateTimeCount;
                        }]);
                        smallQ.smallQStuAnsMapList = {};
                        angular.forEach(smallQStuAnsMapListTempList, (item, itemIndex)=> {
                            smallQ.smallQStuAnsMapList[itemIndex] = item;
                        });
                    }

                    if (isGetErrorRecords)  newSmallQList.push(angular.copy(smallQ));
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
            stuQAns.innerCreateTime = stuQAns.createTime || '';
            stuQAns.innerCreateTime = stuQAns.innerCreateTime.replace(/\-/g, "/");//safari不认识new Date('2016-10-22 14:00')
            stuQAns.innerCreateTimeCount = (new Date(stuQAns.innerCreateTime)).getTime();
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

    /**
     * 获取驯宠大战数据
     */
    getDiagnosePkInfo(callBack) {
        callBack = callBack || angular.noop;
        let postInfo = this.commonService.commonPost(this.serverInterface.DIAGNOSE_RANKING_INFO, null, true);
        postInfo.requestPromise.then((data)=> {
            callBack(data);
        }, ()=> {
            callBack(false);
        });
    }

    getDiagnosePkLiveInfo(callBack) {
        callBack = callBack || angular.noop;
        let param = {
            publishType: -1,
            limit: 10
        };
        this.commonService.commonPost(this.serverInterface.GET_WINTER_BROADCAST_DATA, param).then((data)=> {
            callBack(data);
        }, ()=> {
            callBack(false);
        });
    }

    /**
     * 获取前五名奖励
     * @param callBack
     */
    getDiagnoseTop5Award(grade,callBack){
        callBack = callBack || angular.noop;
        let param = {
            grade:grade
        };
        this.commonService.commonPost(this.serverInterface.DIAGNOSE_CHAMPION_GET_CREDITS, param).then((data)=> {
            callBack(data);
        }, ()=> {
            callBack(false);
        });
    }

    /**
     * 获取昨日或前日前五名奖励
     * @param callBack
     */
    getLastDiagnoseTop5(grade,topType,callBack){
        callBack = callBack || angular.noop;
        let param = {
            grade:grade,
            topType:topType
        };
        this.commonService.commonPost(this.serverInterface.GET_LAST_TOP_FIVE, param).then((data)=> {
            callBack(data);
        }, ()=> {
            callBack(false);
        });
    }


    reduceVipKnowledgeCounts(param){
        let defer = this.$q.defer();
        return (dispatch)=>{
            this.commonService.commonPost(this.serverInterface.OPEN_INCREASE_SCORE_KNOWLEDGE, param).then((data)=> {
                if(data.code == 200){
                    dispatch({type:COUNT_DOWN_VIP_INCREASE_SCORE_COUNTS});
                    defer.resolve();
                }else {
                    defer.reject();
                }
            }, ()=> {
                defer.reject();
            });
            return defer.promise;
        };
    }
    getErrorQRecord (smallQ,params,callBack){
    var url = this.serverInterface.GET_ERROR_Q_RECORDS ;
    let postInfo = this.commonService.commonPost(url, params, true);
    this.cancelErrorQRecordRequestList.push(postInfo.cancelDefer);
    postInfo.requestPromise.then((data)=> {
        if (data.code == 200) {
            this.smallQParseForStat(smallQ, data.history);
            callBack(smallQ);
            return;
        }
        callBack(null);
    },(res)=>{
        callBack(null);
    });
};

    /**
     * 保存进入诊断的入口路由
     */
    saveDiagnoseEntryUrlFrom(urlFrom) {
        return (dispatch)=> {
            dispatch({
                type: DIAGNOSE.SAVE_DIAGNOSE_ENTRY_URL_FROM,
                payload: {urlFrom: urlFrom}
            });
        }
    }

}
export default DiagnoseService


