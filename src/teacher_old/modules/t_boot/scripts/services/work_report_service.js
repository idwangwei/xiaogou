/**
 * Created by WL on 2017/6/6.
 */
/**
 * Created by ww on 2017/5/23.
 */
import BaseService from 'baseComponentForT/base_service';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {STU_WORK_REPORT}  from './../redux/action_typs';
import _pluck from 'lodash.pluck';
import _sortby from 'lodash.sortby';

@Inject('$http', '$q', '$rootScope', 'serverInterface', 'commonService', "$ngRedux" ,"diagnoseService")


class StuWorkReportService extends BaseService {
    serverInterface;
    commonService;
    diagnoseService;
    $q;
    $http;
    cancelRequestList = [];

    constructor() {
        super(arguments);
    }

    @actionCreator
    getStuWorkReport() {
        let me = this;
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            let state = getState();
            let paper = state.wl_selected_work;
            let param = {
                paperId: paper.paperId,
                paperInstanceId: paper.instanceId,
                classId: state.wl_selected_clazz.id,
                role: "T"
            };
            dispatch({type: STU_WORK_REPORT.FETCH_DATA_REPORT_START});
            let postInfo = this.commonService.commonPost(me.serverInterface.GET_STU_WORK_REPORT, param, true);
            me.cancelRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data) => {
                if (data && data.code == 200) {
                    let analysis = data.analysis;
                    let result = me.parseData(analysis, paper.stu.correctedStus);
                    dispatch({type: STU_WORK_REPORT.FETCH_DATA_REPORT_SUCCESS, payload: {
                        paperInstanceId:param.paperInstanceId,
                        result:result
                    }});
                    defer.resolve(true);
                } else {
                    dispatch({type: STU_WORK_REPORT.FETCH_DATA_REPORT_FAIL});
                    defer.resolve(false)
                }
            }, () => {
                dispatch({type: STU_WORK_REPORT.FETCH_DATA_REPORT_FAIL});
            });
            return defer.promise;

        };

    }

    parseData(analysis, correctedStus) {
        let totalLevelCount = 0;
        let me = this;
        angular.forEach(analysis.knowledgeQuestionDict, (data) => {
            totalLevelCount++;
        });
        analysis.totalLevelCount = totalLevelCount;
        angular.forEach(analysis.stuId2KnowledgeMasterDict, (stu, stuId) => {
            let myData = {};
            myData.isShow = me.filterStu(stuId, correctedStus);
            angular.forEach(stu.quantityOfMasterLevel, (level, value) => {
                myData[value] = {};
                if (level == 1 || level == 2) {
                    if (!myData[2]) {
                        myData[2].levelCount = 0;
                    }
                    myData[2].levelCount += level.length;
                } else {
                    myData[value].levelCount = level.length;
                }
                myData[value].levelPercent = myData[value].levelCount * 100 / totalLevelCount + "%"
            });
            myData.stuImg = this.getRootScope().loadImg(stu.profile.gender == '-1' ? 'person/delete-student.png' : (stu.profile.gender == '0' ? 'person/student-f.png' : 'person/student-m.png'));
            stu.myData = myData;
        });
        return analysis;

    }

    filterStu(stuId, correctedStus) {
        let isShow = false;
        angular.forEach(correctedStus, (item) => {
            if (isShow) return isShow;
            isShow = stuId == item.id;

        });
        return isShow;
    }

    @actionCreator
    fetchDiagnoseReportForWork(loadMore, loadMoreCallback,clazzId, userId ,knowLedgeInfo) {
        loadMoreCallback = loadMoreCallback || angular.noop;
        let me = this;

        return (dispatch, getState)=> {
            let state = getState();
            //如果这个单元没有试题列表，无需加载更多数据
            let knowledgeId = knowLedgeInfo.knowledgeId;
            let knowledgeReportStoreValue = state.knowledge_with_report[knowledgeId] || {};
            let qRecords = knowledgeReportStoreValue.qRecords;
            let report = knowledgeReportStoreValue.report || {};
            let url = me.serverInterface.FETCH_DIAGNOSE_REPORT;
            if (loadMore && (!qRecords || qRecords.length === 0))return loadMoreCallback(loadMore);
            if (!loadMore) { //如果没有加载更多的选项，则表示更新列表下所有的内容，则需要重新设置分页信息
                dispatch({
                    type: STU_WORK_REPORT.CHANGE_DIAGNOSE_REPORT_RECORDS_PAGINATION_INFO,
                    payload: {
                        lastKey: 0,
                        quantity: 16
                    }
                });
            }

            state = getState(); //刷新 state
            let limitQuery = state.change_diagnose_report_records_pagination_info;
            let params = {
                knowledgeId: knowledgeId,
                classId: clazzId,
                studentId:userId,
                lastKey: limitQuery.lastKey,
                quantity: limitQuery.quantity,
                countNum:(qRecords && Math.floor(qRecords.length/limitQuery.quantity))||0
            };

            dispatch({type: STU_WORK_REPORT.FETCH_DIAGNOSE_REPORT_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data)=> {
                if (!data || data.code != 200) {

                    return;
                }
                if (data && data.code === 200) {

                    let qRecordList = null;
                    if (data.qsTitles) {
                        qRecordList = me.diagnoseService.smallQListParse(data.qsTitles, true, data.history[userId], false);
                        qRecordList = _sortby(qRecordList, [function (item) {
                            return -item.innerCreateTimeCount;
                        }]);
                        dispatch({
                            type: STU_WORK_REPORT.CHANGE_DIAGNOSE_REPORT_RECORDS_PAGINATION_INFO,
                            payload: {
                                lastKey: data.lastKey,
                                quantity: 16
                            }
                        });
                    }
                    report.allMsg = data.allMsg ? data.allMsg : report.allMsg;
                    report.masterList = data.list ? data.list : [];

                    dispatch({
                        type: STU_WORK_REPORT.FETCH_DIAGNOSE_REPORT_SUCCESS,
                        payload: {
                            selectedKnowpoint: knowLedgeInfo,
                            qRecords: qRecordList,
                            loadMore: loadMore,
                            report: report,
                            knowledgeReportStoreValue: knowledgeReportStoreValue
                        }
                    });

                    if (!qRecordList || (loadMore && data.qsTitles.length < limitQuery.quantity) || (!loadMore && data.qsTitles.length < 16))
                        loadMoreCallback(loadMore, true);
                    else
                        loadMoreCallback(loadMore);
                }
            }, (res)=> {
                dispatch({type: STU_WORK_REPORT.FETCH_DIAGNOSE_REPORT_FAIL});
            });
        }
    }

  /**
   * 获取测评广告信息
   */
  fetchMonitorInfo(param) {
    let defer = this.$q.defer();
    let post = this.commonService.commonPost("/um/trGroup/area/assessment/advertisement", param, true);
    this.cancelRequestList.push(post.cancelDefer);
    let request = post.cancelDefer;
    post.requestPromise.then((data)=> {
      request = null;
      if (data.code == 200) {
        defer.resolve(data.areaAssessmentAdvertisement);
      }
      else {
        defer.reject(false);
      }
    }, ()=> {
      request = null;
      defer.reject();
    });
    return defer.promise;
  };
}

export default StuWorkReportService

