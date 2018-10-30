/**
 * Author 邓小龙 on 2015/9/15.
 * @description 作业统计service
 */

import services from './index';
import * as types from '../redux/actiontypes/actiontypes';
import  _find from 'lodash.find';
import  _each from 'lodash.foreach';
import _groupBy from 'lodash.groupby';
import _sortBy from 'lodash.sortby';
import _indexOf from 'lodash.indexof';
services.service('workStatisticsServices', ["$log", "$rootScope", "serverInterface","commonService", "finalData", "dateUtil", "profileService", "$q", 'ngWorkerRunner'
    , function ($log, $rootScope, serverInterface,commonService, finalData, dateUtil, profileService, $q, ngWorkerRunner) {
        var me = this;
        /**
         * 删除请求的defer列表
         * @type {Array}
         */
        this.cancelRequestDeferList = [];
        this.limitQuery = {lastKey: '', quantity: 16};//请求作业列表的参数 lastKey下一次请求数据的标识，quantity:请求的条数
        this.wData = {};//共享数据对象
        this.wData.queryShow = "";//查询条件初始化展示
        this.wData.queryParams = {};//作业列表查询参数
        this.wData.workList = [];//作业列表
        this.wData.workDetail = {};
        this.wData.workDetail.param = {};//作业明细页面参数
        this.share = {
            work_query: {id: 'all', name: '全部'},
            game_query: {id: 'all', name: '全部'},
            work_filter: {id: 'all', name: '全部'},
            game_filter: {id: 'all', name: '全部'}
        };
        this.postsInfo = {};
        this.finishVacationMessages = [];//暑假作业消息列表数组
        // this.cancelErrorQRecordRequestList = [];//获取错题记录的请求队列
        this.routeInfo={
            urlFrom:''
        };

        /**
         * 校验用户输入的日期
         * @param date
         */
        function validateDate(date) {
            try {
                var tempArray = date.split("-");

                if (!tempArray || (tempArray && tempArray.length < 3)) {
                    return false;
                }
                var year = parseInt(tempArray[0]);
                var month = parseInt(tempArray[1]);
                var day = parseInt(tempArray[2]);
                if (year > 1900 && month > 0 && month < 13 && 0 < day && day < 32) {
                    return year + "-" + monthFormat(month) + "-" + dayFormat(day);
                }
                return false;
            } catch (e) {
                return false;
            }
        }

        /**
         * 月份格式化 如8 格式成08
         * @param month 月份
         */
        function monthFormat(month) {
            if (month < 10) {
                return "0" + month;
            }
            return month;
        }

        /**
         * 月份格式化 如8 格式成08
         * @param day 天
         */
        function dayFormat(day) {
            if (day < 10) {
                return "0" + day;
            }
            return day;
        }

        function getSelectedClazzId(state) {
            let userId = state.profile_user_auth.user.userId;
            let clzId = state.work_list_route.urlFrom === finalData.URL_FROM.OLYMPIC_MATH_T ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom ===finalData.URL_FROM.OLYMPIC_MATH_S ? userId:state.wl_selected_clazz.id;
            return clzId;
        }

        function isOlympicMathS(state){
           return state.work_list_route.urlFrom&&state.work_list_route.urlFrom.indexOf(finalData.URL_FROM.OLYMPIC_MATH_S) > -1
        }

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
         * 根据作业类型去处理样式
         */
        function handleWorkTypeCss(workType,targetInfo){
            switch (workType){
                case finalData.WORK_TYPE.SUMMER_WORK:
                    targetInfo.showCss='summer-work-item';
                    break;
                case finalData.WORK_TYPE.WINTER_WORK:
                    targetInfo.showCss='winter-work-item';
                    break;
                case finalData.WORK_TYPE.MATCH_WORK:
                    targetInfo.showCss='match-work-item';
                    break;
                default:
                    targetInfo.showCss='default-work-item';
            }
        }


        /**
         * 处理分数对应图片
         * @param paperInfo
         */
        function handleScoreImg(paperInfo,state) {
            var temp = paperInfo.latestScore / paperInfo.worthScore;
            if(state.work_list_route.urlFrom&&state.work_list_route.urlFrom.indexOf(finalData.URL_FROM.OLYMPIC_MATH) > -1){//说明是奥数
                if (temp >= 1) {
                    paperInfo.img = "msg/olympic_math_gold_cup.png";
                    return;
                }
                if (temp < 1 && temp >= 0.9) {
                    paperInfo.img = "msg/olympic_math_silver_cup.png";
                    return;
                }
                if (temp < 0.9 && temp >= 0.8) {
                    paperInfo.img = "msg/olympic_math_copper_cup.png";
                    return;
                }
                paperInfo.img = "msg/olympic_math_default_cup.png";
                return;
            }
            if (temp >= 1) {
                paperInfo.img = "msg/gold_cup.png";
                return;
            }
            if (temp < 1 && temp >= 0.9) {
                paperInfo.img = "msg/silvery_cup.png";
                return;
            }
            if (temp < 0.9 && temp >= 0.8) {
                paperInfo.img = "msg/coppery_cup.png";
                return;
            }
            paperInfo.img = "msg/default_cup.png";
        }

        /**
         * 状态数字转显示字段
         * @param status
         * @returns {*}
         */
        function statusToVo(status) {
            if (status <= 2) {
                return "未提交";
            }
            if (status == 3) {
                return "已提交";
            }
            if (status == 4) {
                return "已批改";
            }
        }


        /**
         * 处理查询条件展示
         * @param type 查询条件类型
         * @param filter 过滤对象
         * @param queryParams 查询条件
         * @returns {}
         */
        function handleQueryShow(type, filter, queryParams) {
            var queryShow = "";
            var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATE_FORMAT;//格式成“2015-08-01”
            var now = new Date();
            var nowDate = dateUtil.dateFormat.prototype.format(now, formatStr); //当前日期
            var yesterday = now.setDate(now.getDate() - 1);//昨天
            var lastWeek = now.setDate(now.getDate() - 7);//上一周
            var lastMonth = now.setDate(now.getMonth() - 1);//上一个月

            switch (type) {
                case 0://所有作业
                    filter.time = {
                        "startTime": "1990-01-01",
                        "endTime": nowDate //当前日期为结束日期
                    };
                    queryShow = "所有作业";
                    break;
                case 1://今天作业
                    filter.time = {
                        "startTime": nowDate,//当前日期为结束日期
                        "endTime": nowDate //当前日期为结束日期
                    };
                    queryShow = "今天(" + nowDate + ")";
                    break;
                case 2://昨天作业
                    filter.time = {
                        "startTime": dateUtil.dateFormat.prototype.format(new Date(yesterday), formatStr),
                        "endTime": dateUtil.dateFormat.prototype.format(new Date(yesterday), formatStr)
                    };
                    queryShow = "昨天(" + dateUtil.dateFormat.prototype.format(new Date(yesterday), formatStr) + ")";
                    break;
                case 3://近一周作业
                    filter.time = {
                        "startTime": dateUtil.dateFormat.prototype.format(new Date(lastWeek), formatStr),
                        "endTime": nowDate//当前日期为结束日期
                    };
                    queryShow = "近一周(" + dateUtil.dateFormat.prototype.format(new Date(lastWeek), formatStr) + "~" + nowDate + ")";
                    break;
                case 4://近一个月作业
                    filter.time = {
                        "startTime": dateUtil.dateFormat.prototype.format(new Date(lastMonth), formatStr),
                        "endTime": nowDate//当前日期为结束日期
                    };
                    queryShow = "近一月(" + dateUtil.dateFormat.prototype.format(new Date(lastMonth), formatStr) + "~" + nowDate + ")";
                    break;
                case 5:
                    if (queryParams.dateInfo.startTime || queryParams.dateInfo.endTime) { //说明选择了日期
                        var startTime = validateDate(queryParams.dateInfo.startTime);
                        var endTime = validateDate(queryParams.dateInfo.endTime);
                        if (!startTime) {
                            alert("开始日期的格式不正确！请选择");
                            return;
                        }
                        if (!endTime) {
                            alert("结束日期的格式不正确！请选择");
                            return;
                        }
                        if (startTime > endTime) {
                            alert("开始日期不能大于结束日期!");
                            return;
                        }
                        filter.time = {
                            "startTime": startTime,
                            "endTime": endTime
                        };
                        queryShow = startTime + "~" + endTime;
                    }
                    break;
            }
            var ret = {
                "queryShow": queryShow,
                "filter": filter
            };
            return ret;
        }

        /**
         * 获取评价反馈明细
         */
        this.getPraiseDetail=function(showType,work,callBack){
            callBack = callBack || angular.noop;
            var paramInfo = {
                "workInstanceId": work.instanceId,
                "workId": work.paperId
            };
            var filter = {
                work: paramInfo,
                sIds:me.wData.queryParams.sId
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            var url="";
            if(showType==3){
                url=serverInterface.GET_APPRAISE_DATA_P;
            }
            if(showType==2){
                url=serverInterface.GET_APPRAISE_DATA_T;
            }
            commonService.commonPost(url, param).then( (data) =>{
                callBack();
                if (data.code == 200) {
                    var lastPraise=data.appraises[0];
                    if(!lastPraise){
                        $log.error("点击获取评价明细，最近一次评价给空");
                        return ;
                    }
                    if(showType==2) {
                        /* if(lastPraise.teacherName&&lastPraise.teacherName.length==4){
                         me.wData.correctedPraise.photoName = lastPraise.teacherName.substring(0,2)+"老师";
                         }else if(lastPraise.teacherName.length<4&&lastPraise.teacherName.length>=1){
                         me.wData.correctedPraise.photoName = lastPraise.teacherName.substring(0,1)+"老师";
                         }else{
                         me.wData.correctedPraise.photoName = lastPraise.teacherName;
                         }*/
                        me.wData.correctedPraise.photoName = lastPraise.teacherName;
                        me.wData.correctedPraise.gender=lastPraise.teacherGender;
                        me.wData.correctedPraise.headImg=lastPraise.teacherGender==0?finalData.TEACHER_F_IMG:finalData.TEACHER_M_IMG;
                        me.wData.correctedPraise.message = decodeURI(lastPraise.messageT);
                        if(!lastPraise.messageT) me.wData.correctedPraise.message = '';
                    }else if(showType==3){
                        var messagePList=JSON.parse(lastPraise.messageP);
                        me.wData.correctedPraise.parentMsgList=[];
                        _each(messagePList,function(messageInfo){
                            var pMsgInfo={};
                            pMsgInfo.pName = messageInfo.username;
                            pMsgInfo.message = decodeURI(messageInfo.message);
                            if(!messageInfo.message) pMsgInfo.message = '';
                            pMsgInfo.gender=messageInfo.parentGender;
                            pMsgInfo.headImg=messageInfo.parentGender=='0'?finalData.PARENT_F_IMG:finalData.PARENT_M_IMG;
                            me.wData.correctedPraise.parentMsgList.push(pMsgInfo);
                        });
                    }
                }
            },()=>{
                callBack();
            });
        };

        /**
         * 评价初始化
         */
        this.fetchStuPraise = (work, sId, callback)=> {
            callback = callback || angular.noop;
            return (dispatch, getState)=> {

                var paramInfo = {
                    "workInstanceId": work.instanceId,
                    "workId": work.paperId
                };
                var filter = {
                    work: paramInfo,
                    sIds: sId
                };
                var param = {
                    filter: JSON.stringify(filter)
                };

                dispatch({type: types.WORK_LIST.FETCH_WORK_STU_PRAISE_START});

                this.postsInfo[serverInterface.GET_APPRAISE_DATA] = commonService.commonPost(serverInterface.GET_APPRAISE_DATA, param, true);
                this.postsInfo[serverInterface.GET_APPRAISE_DATA].requestPromise.then(function (data) {
                    if (!data || data.code != 200) {
                        dispatch({type: types.WORK_LIST.FETCH_WORK_STU_PRAISE_FAILED, errorInfo: data});
                        return;
                    }
                    var payload = {
                        studentPraise: {
                            messageS: "",
                            praiseTypeList: []
                        },
                        instanceId: work.instanceId,
                        clzId: getSelectedClazzId(getState())
                    };
                    if (data.code == 200) {
                        if (data.appraises && data.appraises.length > 0) {
                            var praiseInfo = data.appraises[0];//取的最近一次的表扬。
                            payload.studentPraise.messageS = decodeURI(praiseInfo.messageS) || "";
                            _each(finalData.PRAISE_TYPE_LIST, function (item) {
                                item.selected = false;
                            });
                            _each(finalData.PRAISE_TYPE_LIST, function (item) {
                                if (item.type <= 105 && item.type >= 102) {
                                    var tempFlag = false;
                                    _each(praiseInfo.encourage, function (data) {
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
                                        payload.studentPraise.praiseTypeList.push(temp);
                                    }
                                    else {
                                        payload.studentPraise.praiseTypeList.push(item);
                                    }
                                }
                            });
                        }
                        else {
                            _each(finalData.PRAISE_TYPE_LIST, function (item) {
                                if (item.type <= 105 && item.type >= 102) {
                                    item.selected = false;
                                    payload.studentPraise.praiseTypeList.push(item);
                                    payload.studentPraise.messageS="";
                                }
                            });
                        }
                        callback(payload.studentPraise.messageS);
                        dispatch({type: types.WORK_LIST.FETCH_WORK_STU_PRAISE_SUCCESS, payload: payload});
                    }
                });
            }
        };

        /**
         * 获取作业状态
         * @param paper
         * @returns {promise}
         */
        this.getPaperStatus=(paperParams,isRework,callback,col,$index)=>{
            callback = callback || angular.noop;
            return (dispatch,getState)=>{
                let filter={
                    paper:paperParams
                };
                var param ={filter:JSON.stringify(filter)};
                if(isRework)
                    param.reworkFlag=1;

                dispatch({type:types.WORK_LIST.FETCH_WORK_STATUS_START});
                let url=isOlympicMathS(getState())?serverInterface.GET_OLYMPIC_MATH_PAPER_STATUS:serverInterface.GET_PAPER_STATUS;
                if(col&&(col.paperInfo.publishType == finalData.WORK_TYPE.FINAL_ACCESS || col.paperInfo.publishType == finalData.WORK_TYPE.WINTER_WORK|| col.paperInfo.publishType == finalData.WORK_TYPE.SUMMER_WORK|| col.paperInfo.publishType == finalData.WORK_TYPE.AREA_EVALUATION)){
                    url = serverInterface.GET_FINAL_ACCESS_PAPER_STATUS
                }
                return commonService.commonPost(url,param).then((data)=>{
                    if(!data||data.code!=200){
                        dispatch({
                            type:types.WORK_LIST.FETCH_WORK_STATUS_FAILED,
                            payload:{failMsg:'服务器忙，code:'+data.code+'。'}
                        });
                        return;
                    }
                    if(data&&data.code===200){
                        let status=data.status.key;
                        dispatch({
                            type:types.WORK_LIST.FETCH_WORK_STATUS_SUCCESS,
                            payload:{status:status}
                        });
                        callback(paperParams,col,$index,data.systemTime);

                    }
                },()=>{
                    dispatch({
                        type:types.WORK_LIST.FETCH_WORK_STATUS_FAILED,
                        payload:{failMsg:'服务器忙'}
                    });
                });
            };
           

        };


        /**
         * 获取暑假作业的完成信息
         */
        this.getFinishVacationMessages = ()=>(dispatch, getState)=> {
            var defer = $q.defer();

            var param = {
                limit: 100,
                minScore: 0
            };
            commonService.commonPost(serverInterface.GET_FINISH_VACATION_MESSAGE, param).then(function (data) {
                defer.resolve(data);
            });
            return defer.promise;
        };

        /**
         * 改变分页信息
         */
        this.changePaginationInfo=(clazzWithPageinfo)=>{
            return (dispatch)=>{
                dispatch({
                    type: types.WORK_LIST.CHANGE_WORK_LIST_PAGINATION_INFO,
                    payload: clazzWithPageinfo
                });
            }
        };
        this.removeWorkList=(id)=>{
            return  (dispatch, getState) => {
                dispatch({
                    type: types.WORK_LIST.FETCH_WORK_LIST_SUCCESS,
                    payload: {clzId: id, list: []}
                });
            }
        }
        this.fetchWorkList = (loadMore, loadMoreCallback,selected_clazz,pageInfo)=> {
            loadMoreCallback = loadMoreCallback || angular.noop;
            let me=this;
            return  (dispatch, getState) => {
                let state = getState();
                //无法连接网络时，不去请求作业里列表(备注下，onLine更新状态有问题，会导致明明有网onLine还是false)
                /* let onLine = state.app_info.onLine;
                if (!onLine) return loadMoreCallback(loadMore,true);*/

                //如果正在加载作业列表，无需重复加载
                // if (state.wl_is_worklist_loading) return loadMoreCallback(loadMore,true);

                //没有选择班级时，不去请求作业里列表
                //let wl_selected_clazz = state.wl_selected_clazz;
                if (!selected_clazz.id)return loadMoreCallback(loadMore,true);

                //如果这个班级没有作业列表，无需加载更多数据
                let clzId = selected_clazz.id;
                let workListBefore = state.wl_clazz_list_with_works[clzId];
                if (loadMore && (!workListBefore || workListBefore.length == 0))return loadMoreCallback(loadMore);

                if (!loadMore) { //如果没有加载更多的选项，则表示更新列表下所有的内容，则需要重新设置分页信息
                    dispatch({
                        type: types.WORK_LIST.CHANGE_WORK_LIST_PAGINATION_INFO,
                        payload: {
                            lastKey: "",
                            quantity:16
                        }
                    });
                    dispatch({
                        type: types.WORK_LIST.CHANGE_CLASS_PAGINATION_INFO,
                        payload: {
                            clazzId:clzId,
                            limitQuery:{
                                lastKey: "",
                                quantity:16
                            }
                        }
                    });
                }
                state = getState(); //刷新 state
                let isOralWork = state.work_list_route.urlFrom == finalData.URL_FROM.ORAL_WORK;
                let isFinalAccessWork = state.work_list_route.urlFrom == finalData.URL_FROM.FINAL_ACCESS;
                let isAreaEvaluation = state.work_list_route.urlFrom == finalData.URL_FROM.AREA_EVALUATION;
                let limitQuery = pageInfo ||(state.wl_class_with_pagination_info[clzId]?state.wl_class_with_pagination_info[clzId]: state.wl_pagination_info);
                let filter = {
                    groupId: clzId,
                    subject: 1,
                    category: finalData.CATEGORY,
                    limitQuery: limitQuery
                };
                let url = serverInterface.GET_WORK_LIST;
                if(isOralWork){
                    filter.type = '10,11'; //只获取口算作业
                }else if(isFinalAccessWork){
                    url = serverInterface.GET_FINAL_ACCESS_WORK_LIST;
                    filter.type = '13'; //只获期末测评作业
                }else if(isAreaEvaluation){
                    // url = serverInterface.GET_FINAL_ACCESS_WORK_LIST;
                    filter.type = '16'; //只获期末测评作业
                }else {
                    filter.type = '2,6,7,21'; //获取普通作业和编辑过的作业
                }
                if(isOlympicMathS(state)){
                    url=serverInterface.GET_OLYMPIC_MATH_WORK_LIST;
                    delete  filter.groupId;
                    filter.gradeNum= state.olympic_math_selected_grade.num||1;
                }
                let params = {
                    filter: JSON.stringify(filter)
                };
                dispatch({type: types.WORK_LIST.FETCH_WORK_LIST_START, withoutWebWorker: true});

                let postInfo = commonService.commonPost(url, params, true);
                me.cancelRequestDeferList.push(postInfo.cancelDefer);
                return postInfo.requestPromise.then((data)=> {
                    if (!data || data.code != 200) {
                        dispatch({type: types.WORK_LIST.FETCH_WORK_LIST_FAILED, errorInfo: data});
                        loadMoreCallback(loadMore);
                    }
                    var workList = [];//作业列表
                    if (data.code == 200) {
                        //做过的题没有掌握的考点个数赋值到rootScope上
                        $rootScope.diagnoseGuideNum = data.number || 0;

                        angular.forEach(data.histories, (paper) =>{
                            var paperInfo = {};
                            paper.gradeTime = paper.gradeTime == undefined ? null : paper.gradeTime.substring(0, 10);//批改日期
                            paperInfo.publishWeek = paper.publishWeek;
                            paperInfo.publishType = paper.publishType;
                            paperInfo.paperType = paper.type;
                            handleWorkTypeCss(paperInfo.publishType,paperInfo);
                            /*如果是区域测评 那么用startTime排序*/
                            if(paper.publishType==16){
                                paper.publishTime=paper.startTime
                            }
                            paperInfo.nextPublishTime = paper.nextPublishTime;
                            paperInfo.publishTimeDate = paper.publishTime == undefined ? null : paper.publishTime.substring(0, 10);
                            paperInfo.detailPublishTime = Date.parse(paper.publishTime);
                            paperInfo.showTime = paperInfo.publishTimeDate + "  " + paperInfo.publishWeek;
                            paperInfo.clazz = paper.groupName;//班级名称
                            paperInfo.instanceId = paper.instanceId;//作业流水号
                            paperInfo.paperId = paper.paperHistories[0].paperId;//发布已限定只能一次发布一个作业。
                           /* if ($rootScope.platform.type >= 2) {
                                paperInfo.paperName = commonService.interceptName(paper.paperHistories[0].paperTitle, 18);//作业名称。
                            } else {
                                //paperInfo.paperName = paper.paperHistories[0].paperTitle;//作业名称。
                                paperInfo.paperName = commonService.interceptName(paper.paperHistories[0].paperTitle, 8);//作业名称。
                            }*/
                            paperInfo.paperName=paper.paperHistories[0].paperTitle;
                            //paperInfo.img = "./sImages/other/paper_folder.png";//作业图形
                            paperInfo.processName = "正确率";
                            paperInfo.worthScore = paper.paperHistories[0].worthScore;//作业总分
                            paperInfo.score = paper.paperHistories[0].score;//作业得分
                            paperInfo.latestScore = paper.paperHistories[0].latestScore;
                            //paperInfo.latestScore=85;
                            paperInfo.processBar = commonService.convertToPercent(paper.paperHistories[0].latestScore / paper.paperHistories[0].worthScore, 1);//作业得分率
                            paperInfo.status = paper.paperHistories[0].status;//作业状态
                            paperInfo.statusVo = statusToVo(paperInfo.status);//状态页面显示
                            paperInfo.encourage = paper.paperHistories[0].encourage;
                            handleScoreImg(paperInfo,state);
                            paperInfo.studentPraise = null;
                            paperInfo.teacherPraise = null;
                            paperInfo.parentPraise = null;
                            paperInfo.masterNum = paper.paperHistories[0].masterNum;
                            paperInfo.masterStatus = paper.paperHistories[0].masterStatus;

                            paperInfo.questionCount = paper.questionCount;
                            paperInfo.limitTime = paper.limitTime;
                            paperInfo.startTime = paper.startTime||'';
                            paperInfo.systemTime = paper.systemTime||'';
                            paperInfo.endTime = paper.endTime||'';

                            //来自老师发布的奥数作业，处理该作业是不是需要激活的作业，（前两套不需要激活，直接免费做）
                            paperInfo.isFree = true;
                            if(paper.flags){
                                paperInfo.isFree = _indexOf(paper.flags,finalData.OLYMPIC_FROM_TEACHER_FREE) == -1;
                            }

                            angular.forEach(paperInfo.encourage, function (encourage) {
                                angular.forEach(encourage, function (praise) {
                                    angular.forEach(finalData.PRAISE_TYPE_LIST, function (info) {
                                        handlePraisePriority(info, praise, paperInfo);
                                    });
                                });
                            });


                            workList.push({instanceId: paperInfo.instanceId, paperInfo: paperInfo});
                        });
                        let isUpdate=!loadMore;
                        //解决下拉刷新或者10秒刷新，导致数据重新重复叠加（缓存的数据小于限制个数）。
                        if(workListBefore&&workListBefore.length< limitQuery.quantity)
                            isUpdate=true;
                        ngWorkerRunner.runTask('mergeWorkList', [workListBefore, workList, isUpdate]).then((mergedWorkList)=> {
                            //最新作业初始化获取试卷的flag
                            _each(mergedWorkList, function (work) {
                                if (work.canFetchPaper === undefined) {
                                    work.canFetchPaper = true
                                }
                                if (work.canFetchDoPaper === undefined) {
                                    work.canFetchDoPaper = true
                                }

                            });
                            mergedWorkList.sort((a ,b) => b.paperInfo.detailPublishTime - a.paperInfo.detailPublishTime);
                            dispatch({
                                type: types.WORK_LIST.FETCH_WORK_LIST_SUCCESS,
                                payload: {clzId: selected_clazz.id, list: mergedWorkList}
                            });
                            dispatch({
                                type: types.WORK_LIST.CHANGE_WORK_LIST_PAGINATION_INFO,
                                payload: {
                                    lastKey: data.lastKey,
                                    quantity: 16
                                }
                            });
                            dispatch({
                                type: types.WORK_LIST.CHANGE_CLASS_PAGINATION_INFO,
                                payload: {
                                    clazzId:clzId,
                                    limitQuery:{
                                        lastKey: data.lastKey,
                                        quantity:16
                                    }
                                }
                            });

                            if(data.mathOlympiadVipDays){
                                dispatch({
                                    type: types.PROFILE.USER_IS_VIP_MATH_OLY,data:data.mathOlympiadVipDays
                                });
                            }

                            if ((loadMore && workList.length < limitQuery.quantity) || (!loadMore && workList.length < 16))
                                loadMoreCallback(loadMore, true);
                            else
                                loadMoreCallback(loadMore);
                        });
                        return true;
                    } else {
                        ngWorkerRunner.runTask('mergeWorkList', [workListBefore, workList, false]).then((mergedWorkList)=> {
                            dispatch({
                                type: types.WORK_LIST.FETCH_WORK_LIST_SUCCESS,
                                payload: {list: mergedWorkList}
                            });
                            loadMoreCallback(loadMore, true);
                        });
                    }
                },()=>{
                    dispatch({type: types.WORK_LIST.FETCH_WORK_LIST_FAILED});
                    loadMoreCallback(loadMore);
                });
            };

        };

        this.fetchOlympicMathVips=(callback) =>{
            return  (dispatch, getState) => {
                callback = callback || angular.noop;
                let url=serverInterface.GET_OLYMPIC_MATH_VIPS;
                commonService.commonPost(url).then((data) => {
                    // console.log(data);
                    if (data.code == 200) {
                        dispatch({
                            type: types.PROFILE.USER_IS_VIP_MATH_OLY,data:data.vipService
                        });
                        callback(data.vipService);
                        return;
                    }
                    callback(false);
                },()=>{
                    callback(false);
                });
            };

        }

        /**
         * 获取输入框和答案
         */
        this.getQReferAnswer = function (param,savantAnsFlag,urlFrom) {
            var defer = $q.defer();
            // var url = newAnsFlag ? serverInterface.GET_Q_REFER_ANSWER_FOR_NEW : serverInterface.GET_Q_REFER_ANSWER;
            var url = savantAnsFlag ? serverInterface.GET_Q_REFER_ANSWER_SAVANT : serverInterface.GET_Q_REFER_ANSWER_FOR_NEW;
            if(savantAnsFlag&&urlFrom&&urlFrom.indexOf(finalData.URL_FROM.OLYMPIC_MATH_S)>-1)
                url = serverInterface.GET_Q_REFER_ANSWER_SAVANT_SELF_TRAIN;
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

        this.changeClazz = (reSelectClazz)=>(dispatch, getState)=> {
            try{
                //改变班级
                if (!reSelectClazz)
                    reSelectClazz = getState().profile_clazz.clazzList[0];
            }catch(err){
                    reSelectClazz = {};
            }

            dispatch({type: types.WORK_LIST.WORK_LIST_CHANGE_CLAZZ, payload: reSelectClazz});
            $rootScope.selectedClazz=reSelectClazz;
        };

        this.deleteSelfTrainWork=(instanceIds,workList,callBack)=>(dispatch, getState)=> {
            callBack = callBack || angular.noop;
            let url=serverInterface.DELETE_SELF_TRAIN_WORK,param={instanceIds: instanceIds.join(',') };
            let clzId=getState().profile_user_auth.user.userId;
            commonService.commonPost(url, param).then((data) =>{
                if(data.code===200){
                    let workListCopy=angular.copy(workList);
                    workList.splice(0,workList.length);
                    angular.forEach(workListCopy,(item,index)=>{
                        if(!item.selected) workList.push(item);
                    });
                    commonService.alertDialog('删除成功！',1000);
                    callBack();
                    dispatch({type: types.WORK_LIST.DELETE_SELF_TRAIN_WORK, payload: {clzId: clzId,list:workList}});
                }
            });
          
        };

        /*this.getErrorQRecord = function (smallQ,params,callBack){
            var url = serverInterface.GET_ERROR_Q_RECORDS ;
            let postInfo = commonService.commonPost(url, params, true);
            this.cancelErrorQRecordRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code == 200) {
                    diagnoseService.smallQParseForStat(smallQ, data.history);
                    callBack(smallQ);
                    return;
                }
                callBack(null);
            },(res)=>{
                callBack(null);
            });
        };*/

        this.updateLimitTimeByOralPaperId = function(paperId,startTime,countDownTimer){
            console.log(paperId," ----- ",startTime);
            return (dispatch,getState) => {
                let selectedWork = getState().wl_selected_work;
                if(startTime){
                    dispatch({
                        type: (selectedWork.publishType == finalData.WORK_TYPE.FINAL_ACCESS||selectedWork.publishType == finalData.WORK_TYPE.AREA_EVALUATION) ?
                            types.FINAL_ACCESS.UPDATE_FINAL_ACCESS_LIMITTIME :
                            types.ORAL_CALCULATION.UPDATE_ORAL_CALCULATION_LIMITTIME,
                        payload: {paperId: paperId, startTime: startTime}
                    });
                }
                if(countDownTimer){
                    dispatch({
                        type:(selectedWork.publishType == finalData.WORK_TYPE.FINAL_ACCESS||selectedWork.publishType == finalData.WORK_TYPE.AREA_EVALUATION) ?
                            types.FINAL_ACCESS.UPDATE_FINAL_ACCESS_TIMER:
                            types.ORAL_CALCULATION.UPDATE_ORAL_CALCULATION_TIMER,
                        payload: {paperId:paperId,countDownTimer:countDownTimer}
                    });
                }
            }
        };
        this.deleteLimitTimeByOralPaperId = function(paperId){
            return (dispatch,getState) => {
                let selectedWork = getState().wl_selected_work;
                dispatch({
                    type:(selectedWork.publishType == finalData.WORK_TYPE.FINAL_ACCESS||selectedWork.publishType == finalData.WORK_TYPE.AREA_EVALUATION) ?
                        types.FINAL_ACCESS.DELETE_FINAL_ACCESS_LIMITTIM:
                        types.ORAL_CALCULATION.DELETE_ORAL_CALCULATION_LIMITTIM
                    , payload: {paperId:paperId}
                });
            }
        };

        return Object.assign({}, this);

    }]);
