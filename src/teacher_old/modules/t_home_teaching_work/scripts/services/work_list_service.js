/**
 * Author 邓小龙 on 2015/8/28.
 * @description  统计service
 */

import _each from 'lodash.foreach';
import _sortBy from 'lodash.sortby';
import _keys from 'lodash.keys';
import _values from 'lodash.values';
import _find from 'lodash.find';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import {
    SELECT_WORK_CLAZZ
    , SET_WORK_LIST_PAGE_INFO
    , FETCH_WORK_LIST_START
    , FETCH_WORK_LIST_SUCCESS
    , FETCH_AE_WORK_LIST_SUCCESS
    , FETCH_WORK_LIST_FAIL
    , FETCH_STUDENT_LIST_START
    , FETCH_STUDENT_LIST_SUCCESS
    , FETCH_STUDENT_LIST_FAIL
    , SELECT_PUBLISH_WORK
    , SELECT_ARCHIVED_WORK
    , MODIFY_STATISTICS_ERROR_INFO
    , FETCH_STATISTICS_ERROR_INFO_START
    , FETCH_STATISTICS_ERROR_INFO_SUCCESS
    , FETCH_STATISTICS_ERROR_INFO_FAIL
    , EQ_SELECT_CHAPTER
    , EQ_SELECT_CONDITION
    , MODIFY_EQ_CREATING_PAPER_ADD
    , MODIFY_EQ_CREATING_PAPER_REMOVE
    , MODIFY_EQ_CREATING_PAPER_CLEAR
    , EQ_SELECTED_REDO_PAPER
    , MODIFY_EQ_ERROR_DATA
    , MODIFY_EQ_ERROR_PAPER
    , SELECT_MATH_OLY_CLAZZ
    , FETCH_MATH_OLY_WORK_LIST_SUCCESS
    , DELETE_MATH_OLY_WORK
    , DELETE_WORK_ITEM
    , SAVE_AUTO_COMMENT
    , FETCH_HOLIDAY_WORK_LIST_SUCCESS

} from 'modules/t_boot/scripts/redux/action_typs';
import * as simulationData from 'modules/t_boot/json/simulationClazz/index';

@Inject('$q',
    '$rootScope',
    '$timeout',
    '$ngRedux',
    '$ionicLoading',
    'commonService',
    'serverInterface',
    'finalData',
    'ngLocalStore',
    'dateUtil',
    'sortConfig',
    'workChapterPaperService',
    '$http',
    '$log',
)

class WorkListService {
    $q;
    $rootScope;
    $ionicLoading;
    commonService;
    serverInterface;
    finalData;
    $ngRedux;
    ngLocalStore;
    sortConfig;
    workChapterPaperService;
    dateUtil;
    $timeout;
    eqcRequestList = []; //错题集首页请求集合
    eqcCurrentClickTag = null; //错题集错误概述点击单元id
    eqcCurrentClickPaper = null; //错题集错误概述点击试卷id

    eqcDetailRequest = null; //错题详情页请求集合

    eqcErrorStudentRequest = null; //错题做错的学生详情列表
    eqcCurrentClickStudent = null; //错题集学生列表点击的学生

    eqcRedoPaperRequestList = []; //查看重练试卷详情
    mathOlyPaperRequestList = []; //获取奥数试卷详情
    workListRequest = null; //作业列表获取作业请求
    getStudentErrorInfoRequest = null; //错题集：获取学生试题错误详情cancelDefer
    mathOlyWorkListRequest = null; //奥数作业列表请求cancelDeffer
    systemTime = new Date().getTime();
//===================================试卷列表页面==================================================

    /**
     * 获取已发布的作业列表
     */
    @actionCreator
    fetchPublishedWorkList(isLoadMore, lastKey) {
        return (dispatch, getState) => {
            let limitQuery = getState().wl_page_info;
            let selectedClazz = getState().wl_selected_clazz;
            let defer = this.$q.defer();
            let param = {
                status: this.finalData.ARCHIVED_STATUS.UN_ARCHIVED,
                groupId: selectedClazz.id,
                limitQuery: limitQuery,
                type: "1,2,3,4,6,7,8,9,10,11,16,21"
            };

            if (lastKey !== undefined) {
                param.limitQuery.lastKey = lastKey
            }
            param = {filter: JSON.stringify(param)};

            if (this.workListRequest) {
                this.workListRequest.resolve();
            }
            dispatch({type: FETCH_WORK_LIST_START});
            let post = this.commonService.commonPost(this.serverInterface.PUBED_WORK_LIST, param, true);
            this.workListRequest = post.cancelDefer;

            /**
             * 根据作业类型去处理样式
             */
            let handleWorkTypeCss = (workType, targetInfo) => {
                switch (workType) {
                    case this.finalData.WORK_TYPE.SUMMER_WORK:
                        targetInfo.showCss = 'summer-work-item';
                        break;
                    case this.finalData.WORK_TYPE.WINTER_WORK:
                        targetInfo.showCss = 'winter-work-item';
                        break;
                    case this.finalData.WORK_TYPE.MATCH_WORK:
                        targetInfo.showCss = 'match-work-item';
                        break;
                    case this.finalData.WORK_TYPE.ORAL_WORK:
                        targetInfo.showCss = 'oral-work-item';
                        break;
                    case this.finalData.WORK_TYPE.FINAL_ACCESS:
                        targetInfo.showCss = 'final-access-work-item';
                        break;
                    default:
                        targetInfo.showCss = 'default-work-item';
                }
            };
            post.requestPromise.then((data) => {
                this.workListRequest = null;
                if (data.code == 200) {
                    let newCount = 0, workList = [], finalAccessList = [], holidayWorkList = [], areaEvaluationList = [];
                    //解析出所有的作业信息集合
                    _each(data.paperList, (paperPub) => {
                        _each(paperPub.subjects, (paper) => {
                            let paperInfo = {};
                            paperInfo.instanceId = paperPub.instanceId;
                            paperInfo.groupId = paperPub.groupId;
                            paperInfo.groupName = paperPub.groupName;
                            paperInfo.paperId = paper.subjectId;
                            paperInfo.isNew = paperPub.isNew;
                            paperInfo.paperName = paper.subjectSymbol;
                            paperInfo.createTime = paperPub.createTime;
                            paperInfo.publishType = paperPub.publishType;
                            paperInfo.publishWeek = paperPub.publishWeek;
                            paperInfo.startTime = paperPub.startTime;
                            handleWorkTypeCss(paperInfo.publishType, paperInfo);
                            paperInfo.submitNum = paper.submitNum;//提交的人数
                            paperInfo.totalNum = paper.totalNum;//总的人数
                            paperInfo.questionCount = paperPub.questionCount;//口算题的题量
                            paperInfo.limitTime = paperPub.limitTime;//口算题的时间

                            paperInfo.nextPublishTime = paperPub.nextPublishTime ? ("下次作业将于" + paperPub.nextPublishTime + "发布") : '';
                            paperInfo.assigneeDisplay = paperPub.assigneeDisplaySet.length > 0 ? paperPub.assigneeDisplaySet.join("|") : "";//分层信息
                            paperInfo.rowId = paperPub.id;
                            workList.push(paperInfo);
                        });
                    });
                    if (data.availableCompetitions) {
                        _each(data.availableCompetitions, (paperPub) => {
                            _each(paperPub.subjects, (paper) => {
                                let paperInfo = {};
                                paperInfo.instanceId = paperPub.instanceId;
                                paperInfo.groupId = paperPub.groupId;
                                paperInfo.groupName = paperPub.groupName;
                                paperInfo.paperId = paper.subjectId;
                                paperInfo.isNew = paperPub.isNew;
                                paperInfo.paperName = paper.subjectSymbol;
                                paperInfo.createTime = paperPub.createTime;
                                paperInfo.publishType = paperPub.publishType;
                                paperInfo.publishWeek = paperPub.publishWeek;
                                paperInfo.startTime = paperPub.startTime;
                                handleWorkTypeCss(paperInfo.publishType, paperInfo);
                                paperInfo.submitNum = paper.submitNum;//提交的人数
                                paperInfo.totalNum = paper.totalNum;//总的人数
                                paperInfo.questionCount = paperPub.questionCount;//口算题的题量
                                paperInfo.limitTime = paperPub.limitTime;//口算题的时间

                                paperInfo.nextPublishTime = paperPub.nextPublishTime ? ("下次作业将于" + paperPub.nextPublishTime + "发布") : '';
                                paperInfo.assigneeDisplay = paperPub.assigneeDisplaySet.length > 0 ? paperPub.assigneeDisplaySet.join("|") : "";//分层信息
                                finalAccessList.push(paperInfo)
                            });
                        });
                    }

                    //寒假作业
                    if (data.availableVacations && data.availableVacations.length) {
                        _each(data.availableVacations, (paperPub) => {
                            _each(paperPub.subjects, (paper) => {
                                let paperInfo = {};
                                paperInfo.instanceId = paperPub.instanceId;
                                paperInfo.groupId = paperPub.groupId;
                                paperInfo.groupName = paperPub.groupName;
                                paperInfo.paperId = paper.subjectId;
                                paperInfo.isNew = paperPub.isNew;
                                paperInfo.paperName = paper.subjectSymbol;
                                paperInfo.createTime = paperPub.createTime;
                                paperInfo.publishType = paperPub.publishType;
                                paperInfo.publishWeek = paperPub.publishWeek;
                                paperInfo.startTime = paperPub.startTime;
                                handleWorkTypeCss(paperInfo.publishType, paperInfo);
                                paperInfo.submitNum = paper.submitNum;//提交的人数
                                paperInfo.totalNum = paper.totalNum;//总的人数
                                paperInfo.questionCount = paperPub.questionCount;//口算题的题量
                                paperInfo.limitTime = paperPub.limitTime;//口算题的时间
                                paperInfo.assigneeDisplay = paperPub.assigneeDisplaySet.length > 0 ? paperPub.assigneeDisplaySet.join("|") : "";//分层信息
                                let publishTime = paperPub.publishTime ? new Date(paperPub.publishTime.replace(/-/g,"/")):undefined;
                                paperInfo.publishTimeStr = publishTime ?`${publishTime.getMonth()+1}月${publishTime.getDate()}日开放`:'';
                                holidayWorkList.push(paperInfo)
                            });
                        });
                        this.systemTime = new Date(data.systemTime.replace(/-/g,"/")).getTime();
                    }

                    workList = finalAccessList.concat(workList);
                    //获取最新作业的数量
                    _each(workList, (work, workIndex) => {
                        if (work.isNew == 1)
                            newCount++;
                    });
                    /*区域测评逻辑修改*/
                    if (!lastKey) {
                        _each(data.availableAreaAssessmentPaper, (paperPub) => {
                            _each(paperPub.subjects, (paper) => {
                                let paperInfo = {};
                                paperInfo.instanceId = paperPub.instanceId;
                                paperInfo.groupId = paperPub.groupId;
                                paperInfo.groupName = paperPub.groupName;
                                paperInfo.paperId = paper.subjectId;
                                paperInfo.isNew = paperPub.isNew;
                                paperInfo.paperName = paper.subjectSymbol;
                                paperInfo.createTime = paperPub.createTime;
                                paperInfo.publishType = paperPub.publishType;
                                paperInfo.paperType = paperPub.type;
                                paperInfo.publishWeek = paperPub.publishWeek;
                                paperInfo.startTime = paperPub.startTime;
                                paperInfo.endTime = paperPub.endTime;
                                handleWorkTypeCss(paperInfo.publishType, paperInfo);
                                paperInfo.submitNum = paper.submitNum;//提交的人数
                                paperInfo.totalNum = paper.totalNum;//总的人数
                                paperInfo.questionCount = paperPub.questionCount;//口算题的题量
                                paperInfo.limitTime = paperPub.limitTime;//口算题的时间

                                paperInfo.assigneeDisplay = paperPub.assigneeDisplaySet.length > 0 ? paperPub.assigneeDisplaySet.join("|") : "";//分层信息

                                let str = paperPub.startTime;
                                let t = new Date(str.replace(/-/g, "/"));
                                let arr = ["日", "一", "二", "三", "四", "五", "六"]
                                paperInfo.isStart = t.getTime() < new Date().getTime();
                                paperInfo.f1 = str.split(" ")[1].slice(0, 5);
                                paperInfo.f2 = "星期" + arr[t.getDay()];
                                paperInfo.f3 = str.split(" ")[0];
                                areaEvaluationList.push(paperInfo)
                            });
                        });
                        areaEvaluationList.sort((a, b)=> {
                            return a.startTime < b.startTime ? 1 : -1
                        })
                        dispatch({
                            type: FETCH_AE_WORK_LIST_SUCCESS,
                            payload: {
                                workList: areaEvaluationList,
                                clazzId: selectedClazz.id,
                            }
                        })
                    }
                    dispatch({
                        type: FETCH_WORK_LIST_SUCCESS,
                        payload: {
                            workList: workList,
                            isLoadMore: isLoadMore,
                            clazzId: selectedClazz.id
                        }
                    });
                    dispatch({type: SET_WORK_LIST_PAGE_INFO, payload: data.lastKey});

                    //保存寒假作业列表
                    dispatch({
                        type: FETCH_HOLIDAY_WORK_LIST_SUCCESS,
                        payload: {
                            workList: holidayWorkList,
                            clazzId: selectedClazz.id
                        }
                    });


                    defer.resolve(workList.length >= limitQuery.quantity);
                }
                else {
                    dispatch({type: FETCH_WORK_LIST_FAIL});
                    defer.resolve(false);
                }
            }, () => {
                this.workListRequest = null;
                dispatch({type: FETCH_WORK_LIST_FAIL});
                defer.reject();
            });

            return defer.promise;
        }
    };

    /**
     * 保存选择的班级到store
     * @param clazz
     */
    @actionCreator
    changeAndSaveSelectedClazz(clazz) {
        return (dispatch, getState) => {
            //如果clazz为undefined,默认选择班级为列表中第一个班级
            let selectedClazz = clazz || getState().clazz_list[0] || {};

            dispatch({type: SELECT_WORK_CLAZZ, payload: selectedClazz});
        }
    }

    /**
     * 归档发布的试卷
     * @param paperInstanceId
     * @param paperId
     * @returns {promise}
     */
    // @actionCreator
    // archivedWork(paperInstanceId, paperId) {
    //     return (dispatch, getState) => {
    //         let param = {
    //             paperInstanceId: paperInstanceId,
    //             paperId: paperId
    //         };
    //
    //         this.$ionicLoading.show({template: '归档中...'});
    //         return this.commonService.commonPost(this.serverInterface.ARCHIVED_PUB_WORK, param).then((res) => {
    //             let msg;
    //             this.$ionicLoading.hide();
    //             if (res && res.code == 200) {
    //                 msg = '<p style="text-align: center">归档成功</p>';
    //                 dispatch({
    //                     type: ADD_ARCHIVED_WORK,
    //                     payload: {clazzId: getState().wl_selected_clazz.id, instanceId: paperInstanceId}
    //                 });
    //             }
    //             else {
    //                 msg = '<p style="text-align: center">归档失败，请稍后再试</p>'
    //             }
    //             this.commonService.showAlert('温馨提示', msg);
    //         }, () => {
    //             this.$ionicLoading.hide();
    //             this.commonService.showAlert('温馨提示', '<p style="text-align: center">归档失败，请稍后再试</p>');
    //         });
    //     }
    // };

    /**
     * 为新加班级的学生重新发布之前发布过的作业
     */
    reDeliverWork(param) {
        return this.commonService.commonPost(this.serverInterface.RE_DELIVER, param);
    };


    /**
     * 设置发布作业列表分页查询参数
     * @param lastKey
     * @returns {function(*, *)}
     */
    @actionCreator
    setWorkListPageInfo() {
        return (dispatch) => {
            //如果lastKey为undefined,则为""
            dispatch({type: SET_WORK_LIST_PAGE_INFO, payload: ''});
        }
    }

    /**
     * 选择并保存当前作业信息
     */
    @actionCreator
    selectPublishWork(work) {
        return (dispatch) => {
            dispatch({
                type: SELECT_PUBLISH_WORK,
                payload: {
                    paperName: work.paperName,
                    instanceId: work.instanceId,
                    paperId: work.paperId,
                    publishType: work.publishType,
                    paperType: work.paperType,
                    groupName: work.groupName,
                    assigneeDisplay: work.assigneeDisplay,
                    stu: {}
                }
            });
        }
    }

    @actionCreator
    selectArchivedWork(work) {
        return (dispatch) => {
            dispatch({
                type: SELECT_ARCHIVED_WORK,
                payload: {
                    paperName: work.paperName,
                    instanceId: work.instanceId,
                    paperId: work.paperId,
                    publishType: work.publishType,
                    groupName: work.groupName,
                    assigneeDisplay: work.assigneeDisplay,
                    stu: {}
                }
            });
        }
    }

//===================================归档页面=====================================================

    // /**
    //  * 设置归档作业列表分页查询参数
    //  * @param lastKey
    //  * @returns {function(*, *)}
    //  */
    // @actionCreator
    // setArchivedListPageInfo() {
    //     return (dispatch) => {
    //         //如果lastKey为undefined,则为""
    //         dispatch({type: SET_ARCHIVED_PAGE_INFO, payload: ''});
    //     }
    // }

    /**
     * 删除归档作业列表中的作业
     * @param paperInstanceId
     * @param paperId
     */
    @actionCreator
    deleteWork(paperInstanceId, paperId, rowId) {
        return (dispatch, getState) => {
            let param = {
                paperInstanceId: paperInstanceId,
                paperId: paperId,
                rowId: rowId
            };
            return this.commonService.commonPost(this.serverInterface.DEL_PUB_WORK, param).then((res) => {
                if (res.code != 200) {
                    this.commonService.alertDialog('删除失败，请稍后再试', 1500);
                }
                else {
                    this.commonService.alertDialog('删除成功', 1500);
                    dispatch({
                        type: DELETE_WORK_ITEM,
                        payload: {clazzId: getState().wl_selected_clazz.id, instanceId: paperInstanceId}
                    });
                }
            }, () => {
                this.commonService.alertDialog('删除失败，请稍后再试', 1500);
            });
        }
    }

    // /**
    //  * 撤销归档的作业
    //  * @param paperInstanceId
    //  * @param paperId
    //  * @returns {function(*, *)}
    //  */
    // @actionCreator
    // revokeWork(paperInstanceId, paperId) {
    //     return (dispatch, getState) => {
    //         let param = {
    //             paperInstanceId: paperInstanceId,
    //             paperId: paperId
    //         };
    //         return this.commonService.commonPost(this.serverInterface.ARCHIVED_PUB_WORK, param).then((res) => {
    //             if (res.code != 200) {
    //                 this.commonService.alertDialog('撤销归档失败，请稍后再试', 1500);
    //             }
    //             else {
    //                 this.commonService.alertDialog('撤销归档成功');
    //                 dispatch({
    //                     type: REVOKE_ARCHIVED_WORK,
    //                     payload: {clazzId: getState().wl_selected_clazz.id, instanceId: paperInstanceId}
    //                 });
    //             }
    //         }, () => {
    //             this.commonService.alertDialog('撤销归档失败，请稍后再试', 1500);
    //         });
    //     }
    // };

//==================================='作业列表'页选定作业进入的'学生提交详情'页面===================

    /**
     * 获取某个作业下的学生列表
     */
    @actionCreator
    getWorkStuList(callback) {
        callback = callback || angular.noop;
        return (dispatch, getState) => {
            let paper = getState().wl_selected_work;
            let selectedClazz = getState().wl_selected_clazz;
            let param = {
                filter: JSON.stringify({
                    paper: {
                        paperId: paper.paperId,
                        paperInstanceId: paper.instanceId
                    }
                })
            };
            let url = this.serverInterface.WORK_STU_LIST;
            if (paper.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS || paper.publishType == this.finalData.WORK_TYPE.WINTER_WORK || paper.publishType == this.finalData.WORK_TYPE.SUMMER_WORK) {
                url = this.serverInterface.WORK_STU_LIST_FINAL_ACCESS;
                param.groupId = selectedClazz.id;
                param.publishType = paper.publishType;
            }
            dispatch({type: FETCH_STUDENT_LIST_START});
            this.commonService.commonPost(url, param).then((data) => {
                let stu = {
                    notSubStus: [],//未提交的学生数组
                    correctedStus: [],//已批改的学生数组
                    notCorrectStus: [],//未批改的学生数组
                    correctedStusHigh: [],//已批改成绩高-低
                    correctedStusLow: []//已批改成绩低-高
                };
                let isShowStatistics = false; //显示统计信息的flag
                if (data.code != 200) {
                    dispatch({type: FETCH_STUDENT_LIST_FAIL});
                }

                stu.totalScore = data.rank.totalScore;//总分
                stu.average = data.rank.average;//平均分
                _each(data.rank.rankList, (item) => {
                    item.studentPraise = null;
                    item.teacherPraise = null;
                    item.parentPraise = null;
                    _each(item.encourage, (praise) => {
                        _each(this.finalData.PRAISE_TYPE_LIST, (info) => {
                            handlePraisePriority(info, praise, item);
                        });
                    });
                    //已批改
                    if (item.status == "4") {
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
                        item.first = item.scores[0];//第一次得分
                        item.last = item.scores[item.scores.length - 1];//最近一次得分
                        item.subCount = item.reworkTimes;//提交次数
                        item.reworkTimesVo = item.reworkTimes - 1;//改错次数
                        item.reworkTimesVo = item.reworkTimesVo <= 0 ? 0 : item.reworkTimesVo;
                        item.elapse = parseWasteTime(item.elapse);
                        stu.correctedStus.push(item);
                    }
                    //未批改
                    else if (item.status == "3") {
                        stu.notCorrectStus.push(item);
                    }
                    //未提交
                    else {
                        stu.notSubStus.push(item);
                    }
                });
                //使用本地保存的已批改学生排序规则，排序
                stu.correctedStus = _sortBy(stu.correctedStus, (v) => {
                    let sortParam;
                    if (this.sortConfig.sortBy == 1) {
                        sortParam = v.scores[0];
                    }
                    else if (this.sortConfig.sortBy == 2) {
                        sortParam = v.elapse;
                    }
                    else if (this.sortConfig.sortBy == 4) {
                        sortParam = v.scores[1];
                    }
                    else if (this.sortConfig.sortBy == 6) {
                        sortParam = new Date(v.latestSubmitTime.slice(0, -4)).getTime();
                    }
                    return this.sortConfig.sortOrder == 'down' ? -sortParam : sortParam;
                });
                stu.stuCount = data.rank.rankList.length;
                stu.notSubStusLength = stu.notSubStus.length;
                stu.correctedStusLength = stu.correctedStus.length;
                stu.notCorrectStusLength = stu.notCorrectStus.length;

                //如果已批改人数大于0,显示统计操作
                if (stu.correctedStusLength && stu.correctedStusLength > 0) {
                    isShowStatistics = true;
                }

                //构造两个成绩排序数组，高-低 和 低-高
                stu.correctedStusHigh = _sortBy(stu.correctedStus, (data) => {
                    return -data.updateTime;
                });
                stu.correctedStusLow = _sortBy(stu.correctedStus, (data) => {
                    return data.updateTime;
                });
                stu.totalNum = data.rank.totalNum;//参与统计的人数

                //统计提交学生的分数段人数【100,90-100,70-90,-70】
                stu.correctedStusLevel = [
                    {
                        "label": "满分",
                        "value": 0,
                        "color": "#20cc61",
                    },
                    {
                        "label": "90%~100%",
                        "value": 0,
                        "color": "#6af420",
                    },
                    {
                        "label": "70%~90%",
                        "value": 0,
                        "color": "#feb05a",
                    },
                    {
                        "label": "70%以下",
                        "value": 0,
                        "color": "#f26666",
                    }
                ];
                _each(stu.correctedStus, (item) => {
                    let studentFirstScore = item.scores[0] || 0;
                    let scoreRate = studentFirstScore / stu.totalScore;
                    if (scoreRate < 0.7) {
                        stu.correctedStusLevel[3].value++;
                    } else if (scoreRate < 0.9) {
                        stu.correctedStusLevel[2].value++;
                    } else if (scoreRate < 1) {
                        stu.correctedStusLevel[1].value++;
                    } else {
                        stu.correctedStusLevel[0].value++
                    }
                });


                dispatch({
                    type: FETCH_STUDENT_LIST_SUCCESS,
                    payload: {
                        isShowStatistics: isShowStatistics,
                        stu: stu,
                        clazzId: getState().wl_selected_clazz.id,
                        paperId: paper.paperId
                    }
                });
                callback();
            }, () => {
                dispatch({type: FETCH_STUDENT_LIST_FAIL});
                callback();
            });
        };

        /**
         * 处理评价信息
         * @param info
         * @param praise
         * @param item
         */
        function handlePraisePriority(info, praise, item) {
            if (info.type == praise) {
                if (info.type >= 1 && info.type <= 5) {
                    item.teacherPraise = info;
                }
                else if (info.type == 6 && !item.teacherPraise) {
                    item.teacherPraise = info;
                }
                else if (info.type >= 7 && info.type <= 9) {
                    item.parentPraise = info;
                }
                else if (info.type == 10 && !item.parentPraise) {
                    item.parentPraise = info;
                }
                else if (info.type >= 102 && info.type <= 105) {
                    item.studentPraise = info;
                }
                else if (info.type >= 101 && !item.studentPraise) {
                    item.studentPraise = info;
                }
            }
        }
    };

    /**
     * 获取试卷内容
     * @returns {function(*, *)}
     */
    getPaperById(currentWork) {
        debugger
        switch (currentWork.publishType) {
            case 6://教师自动试卷
                return this.workChapterPaperService.fetchEditPaper(currentWork.paperId);
            case 7://普通错题组卷试卷
                return this.fetchRedoPaper(currentWork.paperId);
            case 9://奥数试卷
                return this.fetchMathOlyPaper(currentWork.paperId);
            case 10:
                return this.fetchOralArithmeticPaper(currentWork.paperId);
            case 11:
                return this.fetchOralArithmeticPaper(currentWork.paperId);
            case 16://区域测评
                return this.fetchAreaEvaluationPaper(currentWork.paperId,currentWork.paperType);
            case 21://老师个人题库
                return this.fetchTeacherPersonalQbPaper(currentWork.paperId);
            default://普通试卷
                return this.workChapterPaperService.fetchPaper(currentWork.paperId);
        }
    };

    /**
     * 获取老师个人题库组卷的试卷
     */
    fetchTeacherPersonalQbPaper(paperId) {
        let defer = this.$q.defer();
        let param = {
            sourceId: paperId,
            publishType: 21
        };
        this.commonService.commonPost(this.serverInterface.FETCH_EDIT_PAPER_DETAIL, param)
            .then((data) => {
                let paper = {};
                if (data.code == 200) {
                    paper.basic = data.basic;
                    paper.qsTitles = data.qsTitles;
                    paper.tags = data.tags;
                    this.workChapterPaperService.parseQuestion(paper);
                    this.workChapterPaperService.savePaperDataToLocal(paper);
                    return defer.resolve(paper);
                }
                defer.resolve(false);
            }, ()=> {
                defer.reject(data);
            });
        return defer.promise;
    }

    /**
     * 获取口算题的作业详情
     * @param paperId
     * @returns {*}
     */
    fetchOralArithmeticPaper(paperId) {
        let defer = this.$q.defer();

        this.commonService.commonPost(this.serverInterface.FETCH_EDIT_PAPER_DETAIL, {
            sourceId: paperId,
            publishType: 10
        })
            .then((data) => {
                let paper = {};
                if (data && data.code == 200) {
                    paper.basic = data.basic;
                    paper.qsTitles = data.qsTitles;
                    paper.tags = data.tags;
                    this.workChapterPaperService.parseQuestion(paper);
                    this.workChapterPaperService.savePaperDataToLocal(paper);
                    return defer.resolve(paper);
                }
                defer.resolve(false);
            }, (data) => {
                defer.reject(data)
            });
        return defer.promise;
    }

    /**
     * 获取当前试卷的学生做题统计信息
     */
    @actionCreator
    getWorkStatistics(paperData) {
        /**
         * 作业下的大题统计分析
         * @param bigQList 传入的大题列表
         * @param analysisData 统计的信息
         */
        function bigQAnalysis(bigQList, analysisData) {
            _each(bigQList, (bigQ) => {
                if (analysisData.first.questionGroups[bigQ.id]) {
                    bigQ.firstAverage = analysisData.first.questionGroups[bigQ.id].average.toFixed(1);
                    bigQ.latestAverage = analysisData.latest.questionGroups[bigQ.id].average.toFixed(1);
                    bigQ.firstAverageRate = this.commonService.convertToPercent(bigQ.firstAverage / bigQ.score, 1);
                    bigQ.latestAverageRate = this.commonService.convertToPercent(bigQ.latestAverage / bigQ.score, 1);
                    bigQ.smallQCount = bigQ.qsList.length;//小题个数
                    bigQ.showNum = this.commonService.convertToChinese(bigQ.seqNum + 1);
                    bigQ.qsList = this.arraySort(bigQ.qsList, this.finalData.BIG_Q_SORT_FIELD);
                    smallQAnalysis.call(this, bigQ.qsList, analysisData, bigQ.id);
                }
            });
        }

        /**
         * 作业下的某一个大题下的小题统计分析
         * @param smallQList 传入的小题列表
         * @param analysisData 统计的信息
         * @param bigQId 当前大题id
         */
        function smallQAnalysis(smallQList, analysisData, bigQId) {
            let firstData = analysisData.first.questionGroups[bigQId];
            let latestData = analysisData.latest.questionGroups[bigQId];
            if (!firstData || !latestData) return;
            _each(smallQList, (smallQ) => {
                smallQ.statList = [];
                let firstInfo = {};
                let latestInfo = {};
                firstInfo.showText = "首次做";
                firstInfo.averageScore = firstData.questions[smallQ.id].averageScore.toFixed(1);//平均得分
                firstInfo.scoreRate = this.commonService.convertToPercent(smallQ.firstAverageScore / smallQ.score, 1);//平均得分率
                firstInfo.correctNum = firstData.questions[smallQ.id].correctNum;//得满分的人数
                firstInfo.wrongNum = firstData.questions[smallQ.id].wrongNum;//全错的人数
                firstInfo.incorrectScale = firstData.questions[smallQ.id].incorrectScale;//全错的人数所占的百分比
                firstInfo.wrongStus = firstData.questions[smallQ.id].wrongStus;//错误学生列表

                latestInfo.showText = "改错后";
                latestInfo.averageScore = latestData.questions[smallQ.id].averageScore.toFixed(1);//平均得分
                latestInfo.scoreRate = this.commonService.convertToPercent(smallQ.latestAverageScore / smallQ.score, 1);//平均得分率
                latestInfo.correctNum = latestData.questions[smallQ.id].correctNum;//得满分的人数
                latestInfo.incorrectScale = latestData.questions[smallQ.id].incorrectScale;//全错的人数所占的百分比
                latestInfo.wrongNum = latestData.questions[smallQ.id].wrongNum;//全错的人数
                latestInfo.wrongStus = latestData.questions[smallQ.id].wrongStus;//错误学生列表

                if (firstInfo.averageScore == smallQ.score || latestInfo.averageScore == smallQ.score) {//如果都相等
                    smallQ.passFlag = 2;
                }
                else if (latestInfo.averageScore == 0) {
                    smallQ.passFlag = 0;
                }
                else {
                    smallQ.passFlag = 1;
                }
                firstInfo.index = 1;
                latestInfo.index = 2;
                smallQ.statList.push(firstInfo);
                smallQ.statList.push(latestInfo);
            });
        }


        return (dispatch, getState) => {
            let selectedWork = getState().wl_selected_work;
            let filter = {
                "paper": {
                    "paperInstanceId": selectedWork.instanceId,
                    "paperId": selectedWork.paperId
                }
            };
            if (selectedWork.publishType == 16) {
                filter.type = 16;
                if (selectedWork.isAE) {
                    filter.areaAssessment = true;
                }
            }
            let param = {
                filter: JSON.stringify(filter),
                publishType: selectedWork.publishType
            };
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.ANALYSIS_PAPER_REPEAT, param).then((data) => {
                if (data.code == 200) {
                    var workAnalysis = {};//作业统计对象totalNum\
                    workAnalysis.totalNum = data.totalNum;
                    workAnalysis.paper = paperData;
                    workAnalysis.first = data.first;
                    workAnalysis.latest = data.latest;
                    workAnalysis.first.average = workAnalysis.first.average.toFixed(1);
                    workAnalysis.latest.average = workAnalysis.latest.average.toFixed(1);
                    workAnalysis.first.averageRate = this.commonService.convertToPercent(workAnalysis.first.average / paperData.basic.score, 1);
                    workAnalysis.latest.averageRate = this.commonService.convertToPercent(workAnalysis.latest.average / paperData.basic.score, 1);
                    workAnalysis.bigQList = this.arraySort(workAnalysis.paper.qsTitles, this.finalData.BIG_Q_SORT_FIELD);
                    bigQAnalysis.call(this, workAnalysis.bigQList, data);
                    defer.resolve(workAnalysis);
                }
                else {
                    defer.resolve(false);
                    this.commonService.alertDialog(data && data.msg)
                }
            }, (data) => {
                this.commonService.alertDialog(data && data.msg)
            });
            return defer.promise;
        }
    };

    // refreshStuList = function () {
    //     me.workStuListShowFlagInit();
    //     switch (me.data.workSort.sortBy && me.data.workSort.sortBy.selected.toString()) {
    //         case '1'://得分排序
    //             var temp = handleSort('first');
    //             me.data.stu.correctedStus = temp;
    //             if (me.data.workSort.showGreenIcon.flag) {
    //                 me.data.workSort.showFirstFlag = true;
    //                 if (me.data.workSort.sortOrderSelected == "up") {
    //                     me.data.workSort.showFirstDown = false;
    //                 } else {
    //                     me.data.workSort.showFirstDown = true;
    //                 }
    //             }
    //             break;
    //         case '2'://用时排序
    //             var temp = handleSort('elapse');
    //             me.data.stu.correctedStus = temp;
    //             if (me.data.workSort.showGreenIcon.flag) {
    //                 me.data.workSort.showElapseFlag = true;
    //                 if (me.data.workSort.sortOrderSelected == "up") {
    //                     me.data.workSort.showElapseDown = false;
    //                 } else {
    //                     me.data.workSort.showElapseDown = true;
    //                 }
    //             }
    //             break;
    //         case '3': //改错排序
    //             var temp = handleSort('subCount');
    //             me.data.stu.correctedStus = temp;
    //             if (me.data.workSort.showGreenIcon.flag) {
    //                 me.data.workSort.showSubFlag = true;
    //                 if (me.data.workSort.sortOrderSelected == "up") {
    //                     me.data.workSort.showSubDown = false;
    //                 } else {
    //                     me.data.workSort.showSubDown = true;
    //                 }
    //             }
    //             break;
    //         case '4': //改错后得分排序
    //             var temp = handleSort('last');
    //             me.data.stu.correctedStus = temp;
    //             if (me.data.workSort.showGreenIcon.flag) {
    //                 me.data.workSort.showLastFlag = true;
    //                 if (me.data.workSort.sortOrderSelected == "up") {
    //                     me.data.workSort.showLastDown = false;
    //                 } else {
    //                     me.data.workSort.showLastDown = true;
    //                 }
    //             }
    //             break;
    //         case '5': //第一次提交时间排序
    //             var temp = handleSort('firstSubmitTime');
    //             me.data.stu.correctedStus = temp;
    //             if (me.data.workSort.showGreenIcon.flag) {
    //                 me.data.workSort.showFirstSubTimeFlag = true;
    //                 if (me.data.workSort.sortOrderSelected == "up") {
    //                     me.data.workSort.showFirstSubTimeDown = false;
    //                 } else {
    //                     me.data.workSort.showFirstSubTimeDown = true;
    //                 }
    //             }
    //             break;
    //         case '6': //最近一次提交时间排序
    //             var temp = handleSort('latestSubmitTime');
    //             me.data.stu.correctedStus = temp;
    //             if (me.data.workSort.showGreenIcon.flag) {
    //                 me.data.workSort.showLastSubTimeFlag = true;
    //                 if (me.data.workSort.sortOrderSelected == "up") {
    //                     me.data.workSort.showLastSubTimeDown = false;
    //                 } else {
    //                     me.data.workSort.showLastSubTimeDown = true;
    //                 }
    //             }
    //             break;
    //     }
    //
    //     if (me.data.refreshListFlag) {
    //         me.workStuListShowFlagInit();
    //         var temp = handleSort('updateTime');
    //         me.data.stu.correctedStus = temp;
    //         if (me.data.workSort.showGreenIcon.flag) {
    //             me.data.workSort.showLastFlag = true;
    //             if (me.data.workSort.sortOrderSelected == "up") {
    //                 me.data.workSort.showLastDown = false;
    //             } else {
    //                 me.data.workSort.showLastDown = true;
    //             }
    //         }
    //     }
    // };
    // workStuListShowFlagInit = function () {
    //     if (me.data.workSort) {
    //         me.data.workSort.showSubDown = true;//展示提交次数向下的箭头
    //         me.data.workSort.showSubFlag = false;//展示提交次数的箭头
    //         me.data.workSort.showElapseDown = true;//展示用时向下的箭头
    //         me.data.workSort.showElapseFlag = false;//展示用时的箭头
    //         me.data.workSort.showFirstDown = true;//展示第一次向下的箭头
    //         me.data.workSort.showFirstFlag = false;//展示第一次的箭头
    //         me.data.workSort.showLastDown = true;//展示最后一次向下的箭头
    //         me.data.workSort.showLastFlag = false;//展示最后一次的箭头
    //         me.data.workSort.showFirstSubTimeDown = true;//展示第一次提交时间向下的箭头
    //         me.data.workSort.showFirstSubTimeFlag = false;//展示第一次提交时间的箭头
    //         me.data.workSort.showLastSubTimeDown = true;//展示最近一次提交时间向下的箭头
    //         me.data.workSort.showLastSubTimeFlag = false;//展示最近一次提交时间的箭头
    //     }
    //
    // };

    /**
     * 获取小题做错的学生答案信息，并更新到store
     * @param smallQ 小题
     * @param bigQ 所在大题
     * @param stat
     * @returns {function(*, *)}
     */
    @actionCreator
    modifyStatisticsErrorInfo(smallQ, bigQ, stat) {

        return (dispatch, getState) => {
            let errorInfo = {
                questionTitle: this.commonService.convertToChinese(bigQ.seqNum + 1) + "、" + bigQ.title + "|第" + (smallQ.seqNum + 1) + "题(" + smallQ.score + "分)",
                errorStudentList: stat.wrongStus
            };

            let filter = {
                sIds: _keys(errorInfo.errorStudentList).join(','),
                paper: {
                    "paperInstanceId": getState().wl_selected_work.instanceId,
                    "paperId": getState().wl_selected_work.paperId,
                    "questionId": smallQ.id,
                    "stat": stat.showText,
                }
            };
            let param = {
                filter: JSON.stringify(filter)
            };
            dispatch({type: FETCH_STATISTICS_ERROR_INFO_START});
            this.commonService.commonPost(this.serverInterface.GET_ERROR_STU_Q, param).then((data) => {
                if (data.code == 200) {
                    smallQ.qContext = smallQ.qContext.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
                    let answerKey = JSON.parse(smallQ.answerKey);//当前试题答案
                    _each(errorInfo.errorStudentList, (stu, stuId) => {
                        stu.currentQ = smallQ;
                        stu.inputList = [];
                        //获取该学生这道题的首次和改错答案集合
                        let smallQDoneTimes = _values(data[stuId].id2QuestionGroupScore[bigQ.id].id2QuestionScore[smallQ.id]) || [];
                        //表示第一次做题
                        if (stat.index == 1) {
                            stu.showStatus = 1;
                            stu.currentQAns = smallQDoneTimes[0];
                        }
                        //最近一次改错
                        else {
                            stu.showStatus = 2;
                            stu.currentQAns = smallQDoneTimes.slice(-1)[0];
                        }
                        this.answerParseForStat(bigQ.id, answerKey, stu.currentQ, stu.currentQAns, stu.inputList);
                    });
                    dispatch({type: FETCH_STATISTICS_ERROR_INFO_SUCCESS});
                    dispatch({type: MODIFY_STATISTICS_ERROR_INFO, payload: errorInfo})
                }

                dispatch({type: FETCH_STATISTICS_ERROR_INFO_FAIL});

            }, () => {
                dispatch({type: FETCH_STATISTICS_ERROR_INFO_FAIL})
            });
        }
    }


    /**
     * 老师强制回收作业
     * @param param
     * @returns {promise}
     */
    compelSubmitWork(param) {
        return this.commonService.commonPost(this.serverInterface.PAPER_SUBMIT, param);
    };

    getFinalAccessStuAverageScore(param) {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.COMPETITION_DISTRICT_AVERAGE, param).then((data)=> {
            if (data.code == 200) {
                defer.resolve(data)
            } else {
                defer.resolve(false);
            }
        }, ()=> {
            defer.resolve(false);
        });
        return defer.promise;
    };

    getAreaEvaluationStuAverageScore(param) {
        let defer = this.$q.defer();
        this.commonService.commonPost("/qbu/api/area/simpleStatics/rank/class", param).then((data)=> {
            if (data.code == 200) {
                defer.resolve(data)
            } else {
                defer.resolve(false);
            }
        }, ()=> {
            defer.resolve(false);
        });
        return defer.promise;
    };

//==================================='错题集'相关页面=======================================

    /**
     * 错题集选择教材章节单元
     * @param chapter
     * @returns {function(*, *)}
     */
    @actionCreator
    selectErrorQuestionChapter(chapter) {
        return (dispatch, getState) => {
            let selectedClazz = getState().wl_selected_clazz;
            dispatch({type: EQ_SELECT_CHAPTER, payload: {chapter: chapter, clazzId: selectedClazz.id}});
        }

    }

    /**
     * 更新班级-章节的错题筛选条件
     * @param condition
     * @returns {function(*, *)}
     */
    @actionCreator
    selectErrorQuestionCondition(condition) {
        return (dispatch, getState) => {
            let selectedClazz = getState().wl_selected_clazz;
            dispatch({type: EQ_SELECT_CONDITION, payload: {condition: condition, clazzId: selectedClazz.id}});
        }
    }

    /**
     * 获取班级指定章节的错题概述
     * @param param
     * @param key
     * @returns {function(*, *)}
     */
    @actionCreator
    getErrorQuestionInfo(param, key) {
        return (dispatch) => {
            let defer = this.$q.defer();
            let post = this.commonService.commonPost(this.serverInterface.GET_ERROR_INFO_BY_CHAPTER, param, true);
            this.eqcRequestList.push(post.cancelDefer);
            post.requestPromise.then((res) => {
                if (res.code != 200) {
                    let msg = res.code === 31001 ? res.msg : '';
                    return defer.resolve({res: false, msg: msg});
                }
                dispatch({
                    type: MODIFY_EQ_ERROR_DATA,
                    payload: {key: key, data: {allNumber: res.allNumber, list: res.list}}
                });
                defer.resolve(true);
            }, () => {
                defer.reject()
            });
            return defer.promise;
        }
    }

    /**
     * 获取错题集重练组卷列表
     * @param param
     * @param key
     * @param isMore
     * @returns {function(*, *)}
     */
    @actionCreator
    getErrorRedoPaperList(param, key, isMore) {
        return (dispatch) => {
            let defer = this.$q.defer();
            let post = this.commonService.commonPost(this.serverInterface.GET_ERROR_PAPER_LIST, param, true);
            this.eqcRequestList.push(post.cancelDefer);
            post.requestPromise.then((data) => {
                if (data.code != 200) {
                    return defer.resolve(false)
                }

                dispatch({type: MODIFY_EQ_ERROR_PAPER, payload: {key: key, isMore: isMore, list: data.papers}});
                defer.resolve(data);
            }, () => {
                defer.reject()
            });
            return defer.promise;
        }
    }

    /**
     * 获取班级指定单元的错题
     * @param param
     * @returns {function(*, *)}
     */
    @actionCreator
    getErrorQuestionDetail(param) {
        let defer = this.$q.defer();

        return (dispatch, getState) => {
            let chapter = getState().eq_selected_chapter[getState().wl_selected_clazz.id];
            let creatingPaperQuestionList = getState().eq_redo_creating_paper[getState().wl_selected_clazz.id + "/" + (chapter && chapter.id)] || [];

            let post = this.commonService.commonPost(this.serverInterface.GET_ERROR_QUESTION_DETAIL, param, true);
            this.eqcDetailRequest = post.cancelDefer;
            post.requestPromise.then((data) => {
                this.eqcDetailRequest = null;
                if (data.code != 200) {
                    return defer.resolve(data)
                }

                let result = {code: 200, qsTitles: [], similar: {}};
                _each(data.list, (v) => {
                    let dataQ = _find(data.qsTitles, {id: v.questionId});
                    let question = {};
                    if (!dataQ) {
                        return console.error(`知识点所在的小题id:${v.questionId}，在qsTitles中没找到`)
                    }
                    question.id = dataQ.id;
                    question.question = dataQ.question;
                    question.answerKey = dataQ.answerKey;
                    question.totalErrorNumber = v.totalErrorNumber;
                    question.totalErrorTimes = v.totalErrorTimes;
                    question.newErrorNumber = v.newErrorNumber;
                    question.knowledgeId = v.knowledgeId;
                    question.knowledgeName = v.knowledgeName;
                    question.isChecked = !!_find(creatingPaperQuestionList, {questionId: question.id}); //检查小题是否被添加进了该单元还在创建的重组试卷中

                    this.parseVerticalData(question);
                    if (v.initialQuestionId) {
                        result.similar[v.initialQuestionId] = question;
                    }
                    else {
                        result.qsTitles.push(question)
                    }
                });
                defer.resolve(result);
            }, () => {
                this.eqcDetailRequest = null;
                defer.reject();
            });

            return defer.promise;
        }
    }

    /**
     * 获取指定题目做错的学生详情列表
     * @param param
     * @returns {*}
     */
    getErrorStudentList(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.serverInterface.GET_ERROR_STUDENT_LIST, param, true);
        this.eqcErrorStudentRequest = post.cancelDefer;
        post.requestPromise.then((data) => {
            this.eqcErrorStudentRequest = null;
            if (data.code != 200) {
                return defer.resolve(false)
            }
            defer.resolve(data.list);
        }, () => {
            this.eqcErrorStudentRequest = null;
            defer.reject()
        });

        return defer.promise;
    }

    /**
     * 获取指定题目做错的学生试题的错误详情
     * @param param
     * @returns {*}
     */
    getStudentErrorInfo(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.serverInterface.GET_STUDENT_ERROR_INFO, param, true);
        this.getStudentErrorInfoRequest = post.cancelDefer;
        post.requestPromise.then((data) => {
            let question, //题目内容string
                paperList = [], //试卷做题详情集合
                paperDone; //小题在每张试卷中的做题明细
            this.getStudentErrorInfoRequest = null;
            if (data.code != 200) {
                return defer.resolve(false)
            }

            question = data.qsTitles[0].question.replace(/value="&nbsp;"/mgi, "").replace(/disabled=""/mgi, "");
            //遍历学生做的所有的试卷
            for (let paper in data.history[param.studentId][param.questionId]) {
                paperDone = data.history[param.studentId][param.questionId][paper];

                let smallQDoneTimes = [];
                for (let errorInfo in paperDone) {
                    let inputList = [];

                    this.answerParseForStat(null, JSON.parse(data.qsTitles[0].answerKey), data.qsTitles[0], paperDone[errorInfo], inputList);
                    smallQDoneTimes.push(inputList)
                }

                paperList.push({
                    paperName: paperDone[0].keyValuePairs.value,
                    smallQDoneTimes: smallQDoneTimes
                });
            }

            defer.resolve({
                question: question,
                paperList: paperList
            });
        }, () => {
            defer.reject()
        });

        return defer.promise;
    }

    /**
     * 将选定的错题添加进重练试卷中
     * @param key
     * @param question
     * @returns {function(*, *)}
     */
    @actionCreator
    addQuestionToRedoPaper(key, question) {
        return (dispatch, getState) => {
            dispatch({type: MODIFY_EQ_CREATING_PAPER_ADD, payload: {key: key, question: question}});
        }
    }

    /**
     * 将选定的错题从重练试卷中移除
     * @param key
     * @param question
     * @returns {function(*, *)}
     */
    @actionCreator
    removeQuestionOfRedoPaper(key, question) {
        return (dispatch, getState) => {
            dispatch({type: MODIFY_EQ_CREATING_PAPER_REMOVE, payload: {key: key, question: question}});
        }
    }

    /**
     * 创建错题重练试卷
     * @param key
     * @param param
     * @returns {function(*, *)}
     */
    @actionCreator
    createRedoPaper(key, param) {
        let defer = this.$q.defer();

        return (dispatch, getState) => {
            this.commonService.commonPost(this.serverInterface.CREATE_ERROR_REDO_PAPER, param).then((data) => {
                if (data.code == 200) {
                    dispatch({type: MODIFY_EQ_CREATING_PAPER_CLEAR, payload: {key: key}});
                    data.paper.title = data.paper.name;
                    defer.resolve(data)
                }
                else {
                    this.$timeout(() => {
                        defer.resolve(false)
                    }, 500)
                }

            }, () => {
                this.$timeout(() => {
                    defer.reject()
                }, 500)
            });

            return defer.promise;
        }
    }


    @actionCreator
    selectRedoPaper(paper) {
        return (dispatch, getState) => {
            let clazzId = getState().wl_selected_clazz.id;
            dispatch({type: EQ_SELECTED_REDO_PAPER, payload: {clazzId: clazzId, paper: paper}});
        }
    }

    /**
     * 获取试卷内容
     * @param paperId
     * @returns {Function}
     */
    fetchAreaEvaluationPaper(paperId,paperType) {
        let defer = this.$q.defer();
        if(paperType==2){
            var post = this.commonService.commonPost(this.serverInterface.GET_PAPER_LIST, {
                id: paperId,
                publishType: 2
            }, true);
        }else{
            var post = this.commonService.commonPost(this.serverInterface.FETCH_EDIT_PAPER_DATA, {
                sourceId: paperId,
                publishType: 16
            }, true);
        }


        // this.mathOlyPaperRequestList.push(post.cancelDefer);
        post.requestPromise.then((data) => {
            let paper = {};
            if (data && data.code == 200) {
                paper.basic = data.basic;
                paper.qsTitles = data.qsTitles;
                paper.tags = data.tags;

                this.workChapterPaperService.parseQuestion(paper);
                this.workChapterPaperService.savePaperDataToLocal(paper);
                return defer.resolve(paper);
            }
            defer.resolve(false);
        }, (data) => {
            defer.reject(data)
        });

        return defer.promise;
    }

    /**
     * 获取试卷内容
     * @param paperId
     * @returns {Function}
     */
    fetchRedoPaper(paperId) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.serverInterface.FETCH_EDIT_PAPER_DATA, {
            sourceId: paperId,
            publishType: 7
        }, true);

        this.mathOlyPaperRequestList.push(post.cancelDefer);
        post.requestPromise.then((data) => {
            let paper = {};
            if (data && data.code == 200) {
                paper.basic = data.basic;
                paper.qsTitles = data.qsTitles;
                paper.tags = data.tags;

                this.workChapterPaperService.parseQuestion(paper);
                this.workChapterPaperService.savePaperDataToLocal(paper);
                return defer.resolve(paper);
            }
            defer.resolve(false);
        }, (data) => {
            defer.reject(data)
        });

        return defer.promise;
    }

    @actionCreator
    deletePaper(paperId, key) {
        return (dispatch) => {
            let defer = this.$q.defer();
            let post = this.commonService.commonPost(this.serverInterface.DELETE_MINE_PAPER, {sourceId: paperId}, true);
            post.requestPromise.then((data) => {
                if (data && data.code == 200) {
                    dispatch({type: MODIFY_EQ_ERROR_PAPER, payload: {paperId: paperId, remove: true, key: key}});
                }
                defer.resolve(data)
            }, () => {
                defer.reject()
            });
            return defer.promise;
        }
    }


    @actionCreator
    changeAndSaveSelectedMathOlyClazz(clazz) {
        return (dispatch, getState) => {
            //如果clazz为undefined,默认选择班级为列表中第一个班级
            let selectedClazz = clazz || getState().mo_clazz_list[0] || {};

            dispatch({type: SELECT_MATH_OLY_CLAZZ, payload: selectedClazz});
        }
    }


//=====================================奥数=============================================
    /**
     * 获取已发布的奥数作业列表
     */
    @actionCreator
    fetchMathOlyWorkList(isLoadMore, lastKey, clazzId) {
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            let param = {
                status: 0,
                type: 9,
                groupId: clazzId,
                limitQuery: {lastKey: lastKey || '', quantity: 16}
            };

            if (this.mathOlyWorkListRequest) {
                this.mathOlyWorkListRequest.resolve();
            }
            let post = this.commonService.commonPost(this.serverInterface.PUBED_WORK_LIST, {filter: JSON.stringify(param)}, true);
            this.mathOlyWorkListRequest = post.cancelDefer;

            /**
             * 根据作业类型去处理样式
             */
            let handleWorkTypeCss = (workType, targetInfo) => {
                switch (workType) {
                    case this.finalData.WORK_TYPE.SUMMER_WORK:
                        targetInfo.showCss = 'summer-work-item';
                        break;
                    case this.finalData.WORK_TYPE.WINTER_WORK:
                        targetInfo.showCss = 'winter-work-item';
                        break;
                    case this.finalData.WORK_TYPE.MATCH_WORK:
                        targetInfo.showCss = 'match-work-item';
                        break;
                    default:
                        targetInfo.showCss = 'default-work-item';
                }
            };
            post.requestPromise.then((data) => {
                this.mathOlyWorkListRequest = null;
                if (data.code == 200) {
                    let workList = [];
                    //解析出所有的作业信息集合
                    _each(data.paperList, function (paperPub) {
                        _each(paperPub.subjects, function (paper) {
                            var paperInfo = {};
                            paperInfo.instanceId = paperPub.instanceId;
                            paperInfo.groupId = paperPub.groupId;
                            paperInfo.groupName = paperPub.groupName;
                            paperInfo.paperId = paper.subjectId;
                            paperInfo.isNew = paperPub.isNew;
                            paperInfo.paperName = paper.subjectSymbol;
                            paperInfo.createTime = paperPub.createTime;
                            paperInfo.publishType = paperPub.publishType;
                            paperInfo.publishWeek = paperPub.publishWeek;
                            handleWorkTypeCss(paperInfo.publishType, paperInfo);
                            paperInfo.submitNum = paper.submitNum;//提交的人数
                            paperInfo.totalNum = paper.totalNum;//总的人数

                            paperInfo.questionCount = paperPub.questionCount;//口算题的题量
                            paperInfo.limitTime = paperPub.limitTime;//口算题的时间

                            paperInfo.nextPublishTime = paperPub.nextPublishTime ? ("下次作业将于" + paperPub.nextPublishTime + "发布") : '';
                            paperInfo.assigneeDisplay = paperPub.assigneeDisplaySet.length > 0 ? paperPub.assigneeDisplaySet.join("|") : "";//分层信息
                            workList.push(paperInfo);
                        });
                    });

                    dispatch({
                        type: FETCH_MATH_OLY_WORK_LIST_SUCCESS,
                        payload: {
                            workList: workList,
                            isLoadMore: isLoadMore,
                            clazzId: param.groupId
                        }
                    });
                    defer.resolve(workList.length >= param.limitQuery.quantity);
                }
                else {
                    defer.resolve(false);
                }
            }, () => {
                this.mathOlyWorkListRequest = null;
                defer.reject();
            });

            return defer.promise;
        }
    };

    /**
     * 删除归档作业列表中的作业
     * @param paperInstanceId
     * @param paperId
     */
    @actionCreator
    deleteMathOlyWork(paperInstanceId, paperId) {
        return (dispatch, getState) => {
            let param = {
                paperInstanceId: paperInstanceId,
                paperId: paperId
            };
            return this.commonService.commonPost(this.serverInterface.DEL_PUB_WORK, param).then((res) => {
                if (res.code != 200) {
                    this.commonService.alertDialog('删除失败，请稍后再试', 1500);
                }
                else {
                    this.commonService.alertDialog('删除成功', 1500);
                    dispatch({
                        type: DELETE_MATH_OLY_WORK,
                        payload: {clazzId: getState().mo_selected_clazz.id, instanceId: paperInstanceId}
                    });
                }
            }, () => {
                this.commonService.alertDialog('删除失败，请稍后再试', 1500);
            });
        }
    }

    fetchMathOlyPaper(paperId) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.serverInterface.FETCH_EDIT_PAPER_DATA, {
            sourceId: paperId,
            publishType: 9
        }, true);

        this.eqcRedoPaperRequestList.push(post.cancelDefer);
        post.requestPromise.then((data) => {
            let paper = {};
            if (data && data.code == 200) {
                paper.basic = data.basic;
                paper.qsTitles = data.qsTitles;
                paper.tags = data.tags;

                this.workChapterPaperService.parseQuestion(paper);
                this.workChapterPaperService.savePaperDataToLocal(paper);
                return defer.resolve(paper);
            }
            defer.resolve(false);
        }, (data) => {
            defer.reject(data)
        });

        return defer.promise;

    }

//=====================================工具方法=============================================


    /**
     * 数组排序
     * @param array 目标数组
     * @param sortField 按目标字段
     * @param type 升降序
     * @returns {*} 返回排序的数组
     */
    arraySort(array, sortField, type) {
        if (!array || array.length <= 0) {
            return [];
        }
        if (!sortField) {
            return array;
        }
        if (type == "1") {//排序类型，0为降序，1为升序
            return _sortBy(array, function (data) {
                return -data[sortField];//降序
            });
        } else {
            return _sortBy(array, function (data) {
                return data[sortField];//升序
            });
        }

    }

    answerParseForStat(bigQId, answerKey, smallQ, currentQAns, inputList) {

        /**
         * 竖式解析
         * @param anskey
         */
        let addMatrixToVerticalFormulaService = (anskey) => {
            anskey.scorePoints.forEach(sp => {
                let spInfo = {};
                //当前得分点历史得分记录
                var spStu = {};
                try {
                    spStu = currentQAns.id2ScorePointScore[sp.uuid];
                    sp.spStuScore = spStu.score;//当前得分点学生的得分
                    spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                    spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                    spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                    spInfo.score = spStu.score;//该小题的得分点的得分
                } catch (e) {
                    console.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                    return true;
                }
                spInfo.spList = [];
                sp.referInputBoxes.forEach(inputbox => {
                    let uuid = inputbox.uuid;
                    let answerMatrixList = [];
                    let answerMatrix = null;
                    if (currentQAns.id2ScorePointScore[sp.uuid]) {
                        try {
                            answerMatrixList = JSON.parse(currentQAns.id2ScorePointScore[sp.uuid].answer);
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
                inputList.push(spInfo);
                currentQAns.inputList.push(spInfo);
            });
        };

        //处理参考答案
        _each(answerKey, (ans) => {
            if (ans.type == VERTICAL_CALC_SCOREPOINT_TYPE
                || ans.type == VERTICAL_ERROR_SCOREPOINT_TYPE
                || ans.type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE) { //竖式题
                currentQAns.inputList = [];
                addMatrixToVerticalFormulaService(ans)
            } else {
                //ans.type  3种类型题
                _each(ans.scorePoints, (sp) => {//处理得分点
                    let spStu = null;
                    try {
                        spStu = currentQAns.id2ScorePointScore[sp.uuid];//当前得分点
                        sp.spStuScore = spStu.score;//当前得分点学生的得分

                    } catch (e) {
                        console.error("qbu的bug,qb试卷和qub映射学生答案不正确!大题id:" + bigQId + "小题id:" + smallQ.id + "得分点id:" + sp.uuid);
                        return true;
                    }
                    selectItemParse(sp.referInputBoxes, smallQ);//处理选择项
                    let spList = [];//小题封装的得分点数组
                    let spInfo = {};
                    spInfo.scorePointId = sp.uuid;//该小题的得分点的id
                    spInfo.correctness = spStu.correctness;//该小题的得分点的正确率
                    spInfo.application = spStu.application;//该小题如果是应用题，就会有application。批改提示
                    spInfo.score = spStu.score;//该小题的得分点的得分
                    spInfo.answer = spStu.answer;//该小题的得分点的整个答案
                    spInfo.spList = spList;//该小题的得分点的所有输入框
                    referAnswer.call(this, sp, spStu, smallQ, spList, ans.type);//处理答案关联
                    inputList.push(spInfo);
                });
            }
        });

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
         * @param ansType 小题类型
         */
        function referAnswer(scorePoint, spStu, smallQ, spList, ansType) {
            if (scorePoint.openStyle) {
                try {
                    spStu.answer = JSON.parse(spStu.answer);
                } catch (e) {
                    console.log(e);
                }
            }
            if (scorePoint.referInputBoxes && scorePoint.referInputBoxes.length > 0) {
                _each(scorePoint.referInputBoxes, (inputBox, index) => {
                    let spQInfo = {};//得分点下的输入框对象
                    if (spStu.answer && typeof spStu.answer == 'string') {
                        let stuAns = spStu.answer.split(this.finalData.ANSWER_SPLIT_FLAG);
                        spQInfo.inputBoxStuAns = stuAns[index];//当前学生的答案
                    }
                    else if (spStu.answer && typeof spStu.answer == 'object') {
                        spQInfo.inputBoxStuAns = spStu.answer[inputBox.label];
                    }

                    else {
                        spQInfo.inputBoxStuAns = "";//当前学生的答案
                    }
                    if (ansType == "line-match" || ansType == 'open_class_2') {
                        spQInfo.inputBoxStuAns = spStu.answer;
                        // spQInfo.reverse = spStu.application;
                    }
                    spQInfo.inputBoxUuid = inputBox.uuid;//当前输入框的id
                    spQInfo.scorePointId = scorePoint.uuid;//所属得分点id
                    spQInfo.scorePointQbuId = spStu.id;//qub存入该知识点答案表主键id
                    spQInfo.currentQSelectItem = smallQ.selectItem;//当前小题的选择项放在当前输入框对象中
                    spList.push(spQInfo);
                });
            }
        }
    }


    /**
     * 解析竖式的竖式框
     * @param smallQ
     */
    parseVerticalData(smallQ) {
        let isVerticalSpType = type => {
            return type == VERTICAL_CALC_SCOREPOINT_TYPE
                || type == VERTICAL_ERROR_SCOREPOINT_TYPE
                || type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE;
        };
        let answerKey = [];
        try {
            answerKey = JSON.parse(smallQ.answerKey);
        } catch (e) {
            console.error(e);
        }

        smallQ.inputList = [];
        _each(answerKey, ansKey => {
            if (isVerticalSpType(ansKey.type)) {
                ansKey.scorePoints.forEach(sp => {
                    let spInfo = {};
                    spInfo.type = ansKey.type;//得分点类型
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
                            let vfMatrix = ansKey.vfMatrix;
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
                                            type: ansKey.type
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
                                    type: ansKey.type
                                });
                            }
                        } else {
                            spInfo.spList.push({
                                inputBoxUuid: uuid,
                                scorePointId: sp.uuid,
                                currentQSelectItem: inputbox.info.selectItem
                            });
                        }
                    });
                    smallQ.inputList.push(spInfo)
                });
            }
        });
    }


    fetchSimulationWorkList() {
        let data = angular.copy(simulationData.default.work_list);
        /**
         * 根据作业类型去处理样式
         */
        let handleWorkTypeCss = (workType, targetInfo) => {
            switch (workType) {
                case this.finalData.WORK_TYPE.SUMMER_WORK:
                    targetInfo.showCss = 'summer-work-item';
                    break;
                case this.finalData.WORK_TYPE.WINTER_WORK:
                    targetInfo.showCss = 'winter-work-item';
                    break;
                case this.finalData.WORK_TYPE.MATCH_WORK:
                    targetInfo.showCss = 'match-work-item';
                    break;
                default:
                    targetInfo.showCss = 'default-work-item';
            }
        };

        let newCount = 0, workList = [];
        //解析出所有的作业信息集合
        _each(data.paperList, function (paperPub) {
            _each(paperPub.subjects, function (paper) {
                var paperInfo = {};
                paperInfo.instanceId = paperPub.instanceId;
                paperInfo.groupId = paperPub.groupId;
                paperInfo.groupName = paperPub.groupName;
                paperInfo.paperId = paper.subjectId;
                paperInfo.isNew = paperPub.isNew;
                paperInfo.paperName = paper.subjectSymbol;
                paperInfo.createTime = paperPub.createTime;
                paperInfo.startTime = paperPub.startTime;
                paperInfo.publishType = paperPub.publishType;
                paperInfo.publishWeek = paperPub.publishWeek;
                handleWorkTypeCss(paperInfo.publishType, paperInfo);
                paperInfo.submitNum = paper.submitNum;//提交的人数
                paperInfo.totalNum = paper.totalNum;//总的人数
                paperInfo.nextPublishTime = paperPub.nextPublishTime ? ("下次作业将于" + paperPub.nextPublishTime + "发布") : '';
                paperInfo.assigneeDisplay = paperPub.assigneeDisplaySet.length > 0 ? paperPub.assigneeDisplaySet.join("|") : "";//分层信息
                workList.push(paperInfo);
            });
        });
        //获取最新作业的数量
        _each(workList, (work, workIndex) => {
            if (work.isNew == 1)
                newCount++;
        });
        return workList;
    };

    /**
     * 自动评价获取评语
     */
    getAutoCommentInfo(groupId, callBack) {
        callBack = callBack || angular.noop();
        this.commonService.commonPost(this.serverInterface.GET_AUTO_COMMENT, {groupId: groupId}).then((res) => {
            callBack(res);
        }, (err) => {
            callBack(false);
        });
    }

    /**
     * 设置自动评价
     */
    @actionCreator
    setAutoCommentInfo(paramObj) {
        return (dispatch) => {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.SET_AUTO_COMMENT, paramObj).then((data) => {
                dispatch({type: SAVE_AUTO_COMMENT, payload: {}});
                defer.resolve(data);
            }, (err) => {
                defer.resolve(false);
            });
            return defer.promise;
        }

    }

    /**
     * 开关自动评价
     */
    onOrOffAutoComment(groupId, state) {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.CANCEL_AUTO_COMMENT, {
            groupId: groupId,
            state: state
        }).then((data) => {
            defer.resolve(data);
        }, (err) => {
            defer.resolve(false);
        });
        return defer.promise;
    }

    /**
     * 开关自动评价
     */
    @actionCreator
    saveAutoCommentInfo(paramsObj) {
        return (dispatch) => {
            dispatch({type: SAVE_AUTO_COMMENT, payload: paramsObj});
        }
    }


    /**
     * 获取作业统计报表
     */
    getStatisticsPaperReport(paperInstanceId, groupId, publishType) {
        let defer = this.$q.defer();
        let url = publishType && (publishType == this.finalData.WORK_TYPE.SUMMER_WORK||publishType == this.finalData.WORK_TYPE.WINTER_WORK) ?
            this.serverInterface.HOLIDAY_WORK_STATISTICS_PAPER_REPORT : this.serverInterface.WORK_STATISTICS_PAPER_REPORT;
        // this.commonService.commonPost(this.serverInterface.WORK_STATISTICS_PAPER_REPORT, {
        this.commonGetWorkReport(url, {
            groupId: groupId,
            paperInstanceId: paperInstanceId
        }).then((data) => {
            defer.resolve(data.paperReport);
        }, (err) => {
            defer.resolve(false);
        });
        return defer.promise;
    }


    /**
     * @description get方法 返回Map
     * @param url http地址
     * @param param 要传的参数
     * @returns promise
     */
    commonGetWorkReport(url, param) {
        param = param || '';
        var defer = this.$q.defer();
        this.$http.get(url, {params:param})
            .success(function (data) {
                if (typeof(data) == 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        this.$log.error('parse server data failed,the detail is ' + e);
                    }
                }
                defer.resolve(data);
            })
            .error(function (data) {
                defer.reject(false);
            });
        return defer.promise;
    }


}

export default WorkListService;



