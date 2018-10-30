/**
 * Created by ww on 2018/1/5.
 */
import {Inject, actionCreator} from '../module';
import {HOLIDAY_WORK} from './../redux/action_types';
import {WORK_LIST} from './../../../m_boot/scripts/redux/actiontypes/actiontypes'
import _forEach from 'lodash.foreach';

@Inject('$q'
    , '$ngRedux'
    , '$rootScope'
    , 'commonService'
    , 'holidayWorkInterface'
    , 'holidayWorkFinalData'
    , 'serverInterface'
    , 'finalData'
    , 'ngWorkerRunner'
)
class HolidayWorkService {
    $q;
    finalData;
    commonService;
    serverInterface;
    ngWorkerRunner;
    holidayWorkInterface;
    holidayWorkFinalData;

    constructor() {
    }

    /**
     * 获取寒假作业列表
     * @param clazzId
     * @param limitQuery
     * @returns {function(*=, *)}
     */
    @actionCreator
    getHolidayWorkListFromServer(clazzId, limitQuery) {
        let param = {
            groupId: clazzId, //班级id
            subject: 1, //指定参数：科目-数学
            category: 2, //指定参数：作业类型-课堂作业
            limitQuery: limitQuery, //分页
            type: this.finalData.WORK_TYPE.SUMMER_WORK //暑假作业
        };
        let defer = this.$q.defer();
        let handleScoreImg = (paperInfo) => {
            var temp = paperInfo.latestScore / paperInfo.worthScore;
            if (temp >= 1) {
                paperInfo.img = "holiday_work_list/holiday_work_gold_cup.png";
                return;
            }
            if (temp < 1 && temp >= 0.9) {
                paperInfo.img = "holiday_work_list/holiday_work_silvery_cup.png";
                return;
            }
            if (temp < 0.9 && temp >= 0.8) {
                paperInfo.img = "holiday_work_list/holiday_work_coppery_cup.png";
                return;
            }
            paperInfo.img = "holiday_work_list/holiday_work_default_cup.png";
        };
        let statusToVo = (status) => {
            if (status <= 2) {
                return "未提交";
            }
            if (status == 3) {
                return "已提交";
            }
            if (status == 4) {
                return "已批改";
            }
        };
        let handlePraisePriority = (info, praise, item) => {
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
        };
        let parsePaper = (histories,systemTime)=> {
            let workList = [];
            if (!(histories instanceof Array)) {
                return workList
            }
            _forEach(histories, (paper) => {
                let paperInfo = {};
                paper.gradeTime = paper.gradeTime == undefined ? null : paper.gradeTime.substring(0, 10);//批改日期
                paperInfo.publishWeek = paper.publishWeek;
                paperInfo.publishStr = `${paper.publishTime && paper.publishTime.match(/-(\d{2}-\d{2})/)[1].replace(/-/, "月").replace(/^0/,'')}日开放`;
                paperInfo.publishType = paper.publishType;
                paperInfo.nextPublishTime = paper.nextPublishTime;
                paperInfo.publishTimeDate = paper.publishTime == undefined ? null : paper.publishTime.substring(0, 10);
                paperInfo.publishTime = paper.publishTime;
                paperInfo.detailPublishTime = Date.parse(paper.publishTime);
                paperInfo.showTime = paperInfo.publishWeek + "  " + paperInfo.publishTimeDate;
                paperInfo.clazz = paper.groupName;//班级名称
                paperInfo.instanceId = paper.instanceId;//作业流水号
                paperInfo.paperId = paper.paperHistories[0].paperId;//发布已限定只能一次发布一个作业。
                paperInfo.paperName = paper.paperHistories[0].paperTitle;
                paperInfo.processName = "正确率";
                paperInfo.worthScore = paper.paperHistories[0].worthScore;//作业总分
                paperInfo.score = paper.paperHistories[0].score;//作业得分
                paperInfo.latestScore = paper.paperHistories[0].latestScore;
                paperInfo.processBar = this.commonService.convertToPercent(paper.paperHistories[0].latestScore / paper.paperHistories[0].worthScore, 1);//作业得分率
                paperInfo.status = paper.paperHistories[0].status;//作业状态
                paperInfo.statusVo = statusToVo(paperInfo.status);//状态页面显示
                paperInfo.encourage = paper.paperHistories[0].encourage;
                handleScoreImg(paperInfo);
                paperInfo.studentPraise = null;
                paperInfo.teacherPraise = null;
                paperInfo.parentPraise = null;
                paperInfo.masterNum = paper.paperHistories[0].masterNum;
                paperInfo.masterStatus = paper.paperHistories[0].masterStatus;

                paperInfo.questionCount = paper.questionCount;
                paperInfo.limitTime = paper.limitTime;
                paperInfo.startTime = paper.startTime || '';
                paperInfo.systemTime = paper.systemTime || systemTime||'';
                paperInfo.endTime = paper.endTime || '';
                paperInfo.seq = paper.seq;

                if (paperInfo.encourage) {
                    _forEach(paperInfo.encourage, (encourage) => {
                        _forEach(encourage, (praise) => {
                            this.finalData.PRAISE_TYPE_LIST.forEach((info) => {
                                handlePraisePriority(info, praise, paperInfo);
                            });
                        });
                    });
                }

                workList.push({instanceId: paperInfo.instanceId, paperInfo: paperInfo});
            });
            return workList;
        };

        return (dispatch, getState)=> {
            dispatch({type: WORK_LIST.FETCH_WORK_LIST_START});
            let postInfo = this.commonService.commonPost(this.serverInterface.GET_WORK_LIST, {filter: JSON.stringify(param)}, true);
            postInfo.requestPromise.then((data)=> {
                if (data.code == 200 && data.histories) {
                    let state = getState();
                    let workListBefore = state.wl_clazz_list_with_works[state.wl_selected_clazz.id];
                    let workList = parsePaper(data.histories,data.systemTime);
                    this.ngWorkerRunner.runTask('mergeWorkList', [workListBefore, workList, limitQuery.lastKey === ""])
                        .then((mergedWorkList)=> {
                            //最新作业初始化获取试卷的flag
                            _forEach(mergedWorkList, (work) => {
                                if (work.canFetchPaper === undefined) {
                                    work.canFetchPaper = true
                                }
                                if (work.canFetchDoPaper === undefined) {
                                    work.canFetchDoPaper = true
                                }

                            });
                            mergedWorkList.sort((i1,i2)=>{return (+i1.paperInfo.seq)-(+i2.paperInfo.seq)});
                            dispatch({
                                type: WORK_LIST.FETCH_WORK_LIST_SUCCESS,
                                payload: {clzId: clazzId, list: mergedWorkList}
                            });
                        });

                    defer.resolve({
                        lastKey: data.lastKey,
                        moreFlag: data.histories.length === limitQuery.quantity,
                        systemTime:new Date(data.systemTime.replace('-','/')).getTime(),
                    })
                } else {
                    dispatch({type: WORK_LIST.FETCH_WORK_LIST_FAILED, errorInfo: data});
                    defer.resolve()
                }
            }, ()=> {
                dispatch({type: WORK_LIST.FETCH_WORK_LIST_FAILED});
                defer.resolve();
            });
            return defer.promise;
        }
    }

    getVideoConfigData(param) {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.olympicMathMicrolectureInterface.GET_VIDEO_CONFIG, param).then((data) => {
            if (data.code == 200) {
                if (data.result[0]) {
                    data.result[0].solution = data.result[0].solution.replace('${ip}:90', this.serverInterface.IMG_SERVER)
                }
                defer.resolve(data.result[0]);
            }
            else {
                defer.resolve(false);
            }
        }, ()=> {
            defer.resolve(false);
        });

        return defer.promise;
    };
}

export default HolidayWorkService;