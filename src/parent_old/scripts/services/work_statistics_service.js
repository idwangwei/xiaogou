/**
 * Author 邓小龙 on 2015/9/15.
 * @description 作业统计service
 */

import services from './index';
import _ from 'underscore';
import $ from 'jquery';

services.service('workStatisticsServices',
    function ($state,$q, serverInterface, commonService, finalData, dateUtil, $rootScope) {
        'ngInject';

        var me = this;
        this.finishVacationMessages=[];//暑假作业消息列表数组
        this.selfMsg={};
        this.limitQuery={lastKey:'',quantity:16};//请求作业列表的参数 lastKey下一次请求数据的标识，quantity:请求的条数
        this.wData = {};//共享数据对象
        this.wData.queryShow = "";//查询条件初始化展示
        this.wData.queryParams = {};//作业列表查询参数
        this.wData.workList = [];//作业列表
        this.wData.workDetail = {};
        this.wData.workDetail.param = {};//作业明细页面参数
        this.pubWorkStudent = {id: null, name: null,showName:null};    //学生id
        this.selectAppraiseList = null;//常用评价语列表
        this.rankList=[];//排名数组
        this.workDetailState = {};//作业详情页面State信息
        this.QInfo = {};//作业详情页面State信息
        this.workDetailUrlFrom = 'home.work_list';

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
         * 查询作业
         * @param type 0所有作业|1今天作业|2昨天作业|3近一周作业|4近一月作业|5查询过滤作业
         */
        this.queryWork = function (type,isHolidayWork) {
            var defer=$q.defer();
            var param = {};//接口参数
            var filter = {
                "groupId":$rootScope.selectedWorkClazz.id,
                "sIds": me.wData.queryParams.sId
            };
            var queryParams = me.wData.queryParams;
            var ret = handleQueryShow(type, filter, queryParams);
            if (!ret) {//验证有问题就返回
                return;
            }
            var queryShow = ret.queryShow;
            var filter = ret.filter;
            if (queryParams.clazzId) {//说明选择了班级
                filter.groupId = queryParams.clazzId;
                if (queryShow != "") {
                    queryShow += " | " + queryParams.clazzName;
                } else {
                    queryShow += queryParams.clazzName;
                }
            }
            if (queryParams.searchName) {//说明搜索了作业名称
                filter.work = {
                    workName: queryParams.searchName
                };
                if (queryShow != "") {
                    queryShow += " | " + queryParams.searchName;
                } else {
                    queryShow += queryParams.clazzName;
                }
            }
            queryShow = queryShow == "" ? "所有作业" : queryShow;
            queryParams.queryShow = queryShow;
            filter.limitQuery=me.limitQuery;
            if(isHolidayWork){
                filter.limitQuery = {"lastKey":"","quantity":16};
                filter.type = '4';
            }else {
                filter.type = '2,6,7,10,11,21';
            }
            param = {
                filter: JSON.stringify(filter)
            };
            commonService.commonPost(serverInterface.GET_WORK_LIST, param).then(function (data) {
                if (data.code == 200) {
                    me.limitQuery.lastKey=data.lastKey;
                    var paperList = [];//作业列表
                    angular.forEach(data.histories, function (paper,index) {
                        var paperInfo = {};
                        paper.gradeTime = paper.gradeTime == undefined ? null : paper.gradeTime.substring(0, 10);//批改日期
                        paperInfo.date = paper.publishTime;
                        paperInfo.clazz = paper.groupName;//班级名称
                        paperInfo.instanceId = paper.instanceId;//作业流水号
                        paperInfo.paperId = paper.paperHistories[0].paperId;//发布已限定只能一次发布一个作业。
                        paperInfo.paperName = commonService.interceptName(paper.paperHistories[0].paperTitle, 15);//作业名称。
                        paperInfo.img = "./pImages/other/paper_folder.png";//作业图形
                        paperInfo.processName = "正确率";
                        paperInfo.publishType = paper.publishType;
                        handleWorkTypeCss(paperInfo.publishType,paperInfo);
                        //paperInfo.publishType = index<3?4:0;
                        paperInfo.processName = "正确率";
                        paperInfo.reworkTimes=paper.paperHistories[0].reworkTimes;
                        paperInfo.worthScore = paper.paperHistories[0].worthScore;//作业总分
                        paperInfo.score = paper.paperHistories[0].score;//作业得分
                        paperInfo.latestScore = paper.paperHistories[0].latestScore;//作业最后一次得分
                        paperInfo.processBar = commonService.convertToPercent(paper.paperHistories[0].score / paper.paperHistories[0].worthScore, 1);//作业得分率
                        paperInfo.status = paper.paperHistories[0].status;//作业状态
                        paperInfo.statusVo = statusToVo(paperInfo.status);//状态页面显示
                        paperInfo.nextPublishTime = paper.nextPublishTime?("下次作业将于"+paper.nextPublishTime+"发布"):'';
                        paperInfo.publishDateTime=paper.publishTime.substring(0, 10)+'  '+paper.publishWeek;
                        paperInfo.encourage = paper.paperHistories[0].encourage;
                        paperInfo.studentPraise = null;
                        paperInfo.teacherPraise = null;
                        paperInfo.parentPraise = null;
                        paperInfo.seq = paper.seq;
                        _.each(paperInfo.encourage, function (encourage) {
                            _.each(encourage, function (praise) {
                                _.each(finalData.PRAISE_TYPE_LIST, function (info) {
                                    handlePraisePriority(info, praise, paperInfo);
                                });
                            });
                        });
                        paperList.push(paperInfo);
                    });
                    
                    //me.wData.workList = commonService.getRowColArray(paperList, 3);
                    defer.resolve(paperList,data.systemTime);
//                    me.wData.workList = paperList;
                }else{
                    defer.resolve(null);
                }
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
         * 获取常用评价语
         */
        this.getPraiseList = function () {
            commonService.commonPost(serverInterface.SELECT_APPRAISE_LIST).then(function (data) {
                if (data.code == 200) {
                    me.selectAppraiseList = data.default;
                }
            });
        };

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
         * 清空共享作业数据
         */
        this.clearAllData = function () {
            this.wData = {//共享作业数据对象
                clazzList: [],//班级列表
                queryParams: {},//查询参数对象
                workList: [] //作业列表
            };
        };

        /**
         * 获取当前月份的第一天
         */
        this.getFirstDayOfMonth = function () {
            var firstDate = new Date();
            firstDate.setDate(1); //第一天
            var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATE_FORMAT;//格式成“2015-08-11”
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
            var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATE_FORMAT;//格式成“2015-08-11”
            var lastDayOfMonth = dateUtil.dateFormat.prototype.format(endDate, formatStr); //当前月份的第一天
            return lastDayOfMonth; //当前月份
        };

        /**
         * 家长确认评价
         */
        this.pConfirmA = function (stuId, content, encourage) {
            var appraise = {
                "studentIds": stuId,
                "workInstanceId": me.wData.queryParams.workInstanceId,//作业批次号
                "workId": me.wData.queryParams.workId,//作业id
                "encourage": encourage,
                "messageP": encodeURI(content)
            };
            var param = {
                appraise: JSON.stringify(appraise)
            };
            commonService.commonPost(serverInterface.P_CONFIRM_APPRAISE, param).then(function (data) {
                if (data && data.code == 200) {//成功
                    $state.go("home.work_list");
                }
                ;
            });

        };


        /**
         * 获取评价反馈明细
         */
        this.getPraiseDetail = function (showType) {
            var paramInfo = {
                "workInstanceId": me.wData.correctedPraise.paper.instanceId,
                "workId": me.wData.correctedPraise.paper.paperId
            };
            var filter = {
                work: paramInfo,
                sIds: me.wData.queryParams.sId
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            var url = "";
            if (showType == 1) {
                url = serverInterface.GET_APPRAISE_DATA_S;
            }
            if (showType == 2) {
                url = serverInterface.GET_APPRAISE_DATA_T;
            }
            commonService.commonPost(url, param).then(function (data) {
                if (data.code == 200) {
                    var lastPraise = data.appraises[0];
                    if (!lastPraise) {
                        $log.error("点击获取评价明细，最近一次评价给空");
                        return;
                    }
                    if (showType == 2) {
                       /* if (lastPraise.teacherName.length == 4) {
                            me.wData.correctedPraise.photoName = lastPraise.teacherName.substring(0, 2) + "老师";
                        } else if (lastPraise.teacherName.length < 4 && lastPraise.teacherName.length >= 1) {
                            me.wData.correctedPraise.photoName = lastPraise.teacherName.substring(0, 1) + "老师";
                        } else {
                            me.wData.correctedPraise.photoName = lastPraise.teacherName;
                        }*/
                        me.wData.correctedPraise.photoName = lastPraise.teacherName;
                        me.wData.correctedPraise.gender=lastPraise.teacherGender;
                        debugger;
                        me.wData.correctedPraise.headImg=lastPraise.teacherGender==0?finalData.TEACHER_F_IMG:finalData.TEACHER_M_IMG;
                        me.wData.correctedPraise.message = decodeURI(lastPraise.messageT);
                        me.wData.correctedPraise.message=me.wData.correctedPraise.message=="undefined"?'':me.wData.correctedPraise.message;
                    } else if (showType == 1) {
                        me.wData.correctedPraise.stuMsgList = [];
                        angular.forEach(lastPraise.encourage, function (code) {
                            if (code <= 105 && code >= 102)
                                angular.forEach(finalData.PRAISE_TYPE_LIST, function (praise) {
                                    if (praise.type == code) {
                                        var stuInfo = {};
                                        stuInfo.stuName = lastPraise.studentName;
                                        stuInfo.message = praise.msg;
                                        stuInfo.studentGender=lastPraise.studentGender;
                                        stuInfo.headImg=lastPraise.studentGender=='0'?finalData.STU_F_IMG:finalData.STU_M_IMG;
                                        me.wData.correctedPraise.stuMsgList.push(stuInfo);
                                    }
                                });
                        });
                        if (lastPraise.messageS) {
                            var stuInfo = {};
                            stuInfo.stuName = lastPraise.studentName;
                            stuInfo.message = decodeURI(lastPraise.messageS);
                            stuInfo.message=stuInfo.message=='undefined'?'':stuInfo.message;
                            stuInfo.studentGender=lastPraise.studentGender;
                            stuInfo.headImg=lastPraise.studentGender=='0'?finalData.STU_F_IMG:finalData.STU_M_IMG;
                            me.wData.correctedPraise.stuMsgList.push(stuInfo);
                        }
                    }
                }
            });
        };

        /**
         * 评价初始化
         */
        this.praiseInit = function () {
            me.wData.praiseTypeList = [];//家长表扬类型，来自于PRAISE_TYPE_LIST的7-9
            var paramInfo = {
                //"workType": me.wData.queryParam.workType,
                //"appraiseType": me.data.currentStu.appraiseType,
                "workInstanceId": me.wData.queryParams.workInstanceId,
                "workId": me.wData.queryParams.workId
            };
            var filter = {
                work: paramInfo,
                sIds: me.wData.queryParams.sId
            };
            var param = {
                filter: JSON.stringify(filter)
            };
            me.wData.praiseTempList = me.selectAppraiseList;
            me.wData.commonPraiseList = [];
            angular.forEach(me.wData.praiseTempList, function (item, index) {
                var info = {};
                info.id = index;
                info.value = item;
                me.wData.commonPraiseList.push(info);
            });
            commonService.commonPost(serverInterface.GET_APPRAISE_DATA, param).then(function (data) {
                if (data.code == 200) {
                    if (data.appraises && data.appraises.length > 0) {
                        var praiseInfo = data.appraises[0];//取的最近一次的表扬。
                        //me.data.currentStu.praiseId = praiseInfo.id;//评价表主键
                        if (praiseInfo.messageP) {
                            var messagePList = JSON.parse(praiseInfo.messageP);
                            _.each(messagePList, function (messageInfo) {
                                if (messageInfo.userId == $rootScope.user.userId) {
                                    document.getElementById("parentPraise").value = decodeURI(messageInfo.message);
                                }
                            });
                        }

                        _.each(finalData.PRAISE_TYPE_LIST, function (item) {
                            item.selected = false;
                        });
                        _.each(finalData.PRAISE_TYPE_LIST, function (item) {
                            if (item.type <= 9 && item.type >= 7) {
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
                                    me.wData.praiseTypeList.push(temp);
                                } else {
                                    me.wData.praiseTypeList.push(item);
                                }
                            }
                        });
                    } else {
                        if (!me.wData.praiseTypeList || me.wData.praiseTypeList.length <= 0) {
                            _.each(finalData.PRAISE_TYPE_LIST, function (item) {
                                if (item.type <= 9 && item.type >= 7) {
                                    item.selected = false;
                                    me.wData.praiseTypeList.push(item);
                                }
                            });
                        }
                    }
                }
            });
        }

        /**
         * 获取排名
         * @param 参数
         */
        this.getTopRank = function (param) {
            var paper={};
            var defer = $q.defer();
            paper.paperId = param.id;
            paper.paperInstanceId = param.paperInstanceId;
            var tempInfo = {
                "paper": {
                    "paperId": param.id,
                    "paperInstanceId": param.paperInstanceId
                },
                "sIds":param.sId
            };
            var tranParam = {
                filter: JSON.stringify(tempInfo)
            };
            commonService.commonPost(serverInterface.GET_TOP_RANK_LIST, tranParam).then(function (data) {
                if (data.code == 200) {
                   /* data.top=[
                        {id:"1",topSeq:1,name:"小A",point:"90",wasteTime:'45'},
                        {id:"2",topSeq:2,name:"小B",point:"89",wasteTime:'45'},
                        {id:"3",topSeq:3,name:"小C",point:"88",wasteTime:'45'},
                        {id:"4",topSeq:4,name:"小D",point:"87",wasteTime:'45'},
                        {id:"5",topSeq:5,name:"小E",point:"86",wasteTime:'45'},
                    ];*/
                    me.rankList.splice(0,me.rankList.length);
                    angular.forEach(data.top,function(rank){
                        me.rankList.push(rank);
                    });
                    defer.resolve(true);
                }else{
                    defer.resolve(false);
                }
            });
            return defer.promise;
        };

        /**
         * 获取试卷状态
         * @param paper
         * @returns {promise}
         */
        this.getPaperStatus=function(paper,publishType){
            var filter={
                sIds: me.wData.queryParams.sId,
                paper:paper
            };
            return commonService.commonPost(serverInterface.GET_PAPER_STATUS,{filter:JSON.stringify(filter),publishType:publishType});
        };
        /**
         * 获取试卷状态
         * @param paper
         * @returns {promise}
         */
        this.getHolidayPaperStatus=function(paper,publishType){
            var filter={
                sIds: me.wData.queryParams.sId,
                paper:paper
            };
            return commonService.commonPost(serverInterface.GET_FINAL_ACCESS_PAPER_STATUS,
                {
                    filter: JSON.stringify(filter),
                    publishType: publishType,
                    shardingId:$rootScope.selectedWorkClazz.id
                }
            );
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
         * 获取暑假作业的完成信息
         */
        this.getFinishVacationMessages=function (sId) {
            var defer = $q.defer();
            var param={
                limit:30,
                minScore:0
            };
            if(sId)
                param.studentId=sId;
            me.finishVacationMessages.splice(0,me.finishVacationMessages.length);
            me.selfMsg.number=null;
            me.selfMsg.newMsg=null;
            me.selfMsg.showNewMsg=false;
            commonService.commonPost(serverInterface.GET_FINISH_VACATION_MESSAGE,param).then(function (data) {
                defer.resolve(true);
                if(data&&data.code==200){
                    me.selfMsg.number=data.number;
                    me.selfMsg.showNewMsg=angular.isNumber(data.number);
                    angular.forEach(data.list,function (item) {
                        me.finishVacationMessages.push(item);
                    })
                }
            },function () {
                defer.resolve(true);
            });
            return defer.promise;
        }


    });
