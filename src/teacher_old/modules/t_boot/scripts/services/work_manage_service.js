/**
 * Author 华海川 on 2015/8/25
 * @description 作业试卷管理 service
 */
import  services from './index';
import  _ from 'underscore';
import  $ from 'jquery';
import {PUB_WORK_DIFF_UNIT} from './../redux/action_typs';
services.service('workManageService', function ($q, $http, $log, serverInterface, commonService, $state, $rootScope) {
    "ngInject";
    this.workList = [];           //作业库作业列表
    this.backupList = [];         //候选作业列表
    this.backupWork = {           //一个候选作业基本属性
        id: '',                  //作业id
        name: '',                //作业名称
        type: $rootScope.homeOrClazz.type   //发布类型
    };
    this.libWork = {        //作业库一个作业
        id: "",
        name: "",
        bigQCount: 0,
        smallQCount: 0,
        score:""
    }
    this.firstLabId = '';       //根标签id
    this.textBookinfo = {};      //已经选中的教材
    this.searchResList = [];     //点击教材时所获取教材下的单元列表
    this.enterFrom = {             //区分进入作业库的入口
        listOrDetail: '',      //作业库入口[1|2]    1代表从候选列表进入，可选一个作业，2代表从候选详情进入，可选试题
        clzOrHome: $rootScope.homeOrClazz.type    //作业类型[1|2]      1代表从课堂进入，2代表从家庭进入
    };
    this.paperInfo = {           //一个作业详情
        basic: {
            description: '',
            score: 0,
            title: '',
            type: ''
        },
        qsTitles: [],
        tags: []
    };
    this.labInfo = {                   //标签信息
        "labId": '',            //教材id
        "tagId": '',            //单元id
        "labName": '',          //教材名称
        "tagName": ''           //单元名称
    };
    this.libWorkDetail = [];
    this.backupWorkIndex = '';        //候选页index，便于详情页跳回去
    this.Students = {};             //班级学生
    this.clazzList = [];

    /**
     * 获取候选作业列表
     * @param type 作业类型[1|2] 1代表课堂2代表家庭
     */
    this.getBackupList = function () {
        var defer = $q.defer();
        var me = this;
        commonService.commonPost(serverInterface.GET_FAVORITES_Q_LIST, {type: $rootScope.homeOrClazz.type}).then(function (data) {
            if (data) {
                me.backupList.length = 0;
                defer.resolve(true);
                if (!data.bookmarks) {
                    return;
                }
                data.bookmarks.forEach(function (item) {
                    item.isClicked = false;
                    me.backupList.push(item);
                });
                return;
            }
            defer.resolve(false);
        });
        return defer.promise;
    };
    /**
     * 把作业信息设为空
     * @returns  paperInfo空作业信息
     */
    this.clearPaper = function () {
        this.paperInfo = {
            basic: {
                description: '',
                score: 0,
                title: '',
                type: ''
            },
            qsTitles: [],
            tags: []
        };
        return this.paperInfo;
    };
    /**
     * 把标签信息设为空
     * @returns labInfo空标签
     */
    this.clearLab = function () {
        this.labInfo.tagId = '';
        this.labInfo.tagName = '';
        return this.labInfo;
    };
    /**
     * 获取教材或单元
     * @param from 表示是否从教材选择过来
     * @returns 教材根节点或教材列表
     */
    this.getLabList = function (from) {
        var defer = $q.defer();
        var me = this;
        commonService.commonPost(serverInterface.GET_LAB_LIST, {id: me.labInfo.labId, text: ''}).then(function (data) {
            if (data) {
                if (!me.labInfo.labId) {
                    me.labInfo.labId = me.firstLabId = data[0].id;
                    me.getLabList().then(function (data2) {
                        var textBook = commonService.getLocalStorage("textBook");     //如果存了教材就获取当前教材下的单元
                        if (textBook) {
                            me.labInfo.labId = textBook.id;
                            me.textBookinfo.labId = textBook.id;
                            me.textBookinfo.labName = textBook.text;
                        } else {
                            me.labInfo.labId = data2[0].id;
                            me.textBookinfo.labId = data2[0].id;
                            me.textBookinfo.labName = data2[0].text;
                        }
                        me.getLabList();
                    });
                } else {
                    if (from != 'modal') {
                        me.searchResList.length = 0;
                        angular.forEach(data, function (item) {
                            me.searchResList.push(item);
                        });
                        if (me.labInfo.labId != me.firstLabId) {
                            commonService.setLocalStorage('textBook', {
                                id: me.labInfo.labId,
                                text: me.textBookinfo.labName
                            }); //选择了教材就记住
                        }
                    }
                }
                ;
                defer.resolve(data);    //没传id表示获取根节点

            }
            defer.resolve(false);
        });
        return defer.promise;
    };
    this.getLabList();

    /**
     * 获取一个单元下的课时
     * @param data
     */
    this.getLesson = function (unitId) {
        var defer = $q.defer();
        commonService.commonPost(serverInterface.GET_LAB_LIST, {id: unitId, text: ''}).then(function (data) {
            if (data) {
                defer.resolve(data);    //没传id表示获取根节点
            }
            defer.resolve(false);
        });
        return defer.promise;
    }


    /**
     *新建候选作业
     * @param type  [1|2] 1代表新建课堂2代表新建家庭
     * @returns {promise}
     */
    this.newBuiltWork = function (id) {
        var paperInfo = JSON.stringify(this.paperInfo);
        var params = {
            name: this.paperInfo.basic.title,
            paperInfo: paperInfo,
            subjectIds: id || '',   //新建时没有id 从作业库取题时有id
            type: this.enterFrom.clzOrHome
        };
        return commonService.commonPost(serverInterface.ADD_FAVORITE, params);
    };
    /**
     * 获取作业库列表
     * @returns boolean
     */
    this.getLibList = function () {
        var condition = {
            "tagName": "",         //根据标签名模糊查询。为空表示全匹配
            "paperName": "",       //根据试卷名模糊查询。为空表示全匹配
            "tagIds": [this.labInfo.tagId]           //根据标签ID查找。可以不赋值，但必须保留结构
        };
        var page = {
            "curPage": '',    //查询的当前页
            "perSize": '',    //每页显示的数目
            "sort": '',       //排序方式。asc升序；desc降序。可为空，表示升序
            "order": ""       //排序的属性
        };
        var param = {'condition': JSON.stringify(condition), 'page': JSON.stringify(page)};
        var defer = $q.defer();
        var me = this;
        commonService.commonPost(serverInterface.GET_LIB_LIST, param).then(function (data) {
            if (data) {
                me.workList.length = 0;
                data.items.forEach(function (item) {
                    me.workList.push(item);
                });
                defer.resolve(me.workList);
                return;
            }
            defer.resolve(false);
        });
        return defer.promise;
    }
    /**
     * 获取作业库一个作业详情
     * @param id 作业id
     * @returns boolean
     */
    this.getWorkDetail = function (param) {
        var defer = $q.defer();
        var me = this;
        debugger
        commonService.commonPost(serverInterface.GET_P_DETAIL_Q_LIST, param).then(function (data) {
            if (data) {
                me.paperInfo.basic = data.basic;
                me.paperInfo.qsTitles = data.qsTitles;
                me.paperInfo.tags = data.tags;
                me.paperInfo.qsTitles.forEach(function (item) {
                    item.qsList = _.sortBy(item.qsList, 'seqNum');
                });
                me.paperInfo.qsTitles = _.sortBy(me.paperInfo.qsTitles, 'seqNum');
                defer.resolve(true);
                return;
            }
            defer.resolve(false);
        });
        return defer.promise;
    };
    /**
     * 加入候选列表
     * @param id作业库一个作业id
     * @returns boolean
     */
    this.addBackupWork = function (param) {
        var defer = $q.defer();
        var me = this;
        this.getWorkDetail(param).then(function (data) {
            if (data) {
                me.newBuiltWork(param.id).then(function (data2) {
                    if (data2) {
                        defer.resolve(data2);
                        return;
                    }
                    defer.resolve(false);
                    return;
                });
                return;
            }
            defer.resolve(false);
        });
        return defer.promise;
    };
    /**
     * 删除一个候选作业
     * @param 候选作业id
     * @returns {promise}
     */
    this.deleteWork = function (param) {
        return commonService.commonPost(serverInterface.DEL_WORK, param);
    };
    /**
     * 获取班级列表
     * @returns {promise}
     */
    this.getClassList = function () {
        return commonService.commonPost(serverInterface.SELECT_CLAZZ_LIST);
    };
    /**
     * 检查该作业是否完整
     * @returns {promise}
     */
    this.checkWork = function () {
        return commonService.commonPost(serverInterface.CHECK_WORK, {id: this.backupWork.id});
    };
    this.copy = function () {
        return commonService.commonPost(serverInterface.COPY, {id: this.backupWork.id, type: this.backupWork.type});
    }
    /**
     * @description 发布一个作业或试卷
     * @returns {*}
     */
    this.pubWork = function (param) {
        return commonService.commonPost(serverInterface.PUB_WORK, param);
    };

    /**
     * 获取候选作业详情
     * @returns {*}
     */
    this.getPaperInfo = function () {
        var defer = $q.defer();
        var me = this;
        commonService.commonPost(serverInterface.GET_PAPER_INFO, {id: this.backupWork.id}).then(function (data) {
            if (!data) {
                defer.resolve(false);
                return;
            }
            var paperInfo = data.detail;
            me.paperInfo.basic = paperInfo.basic;
            paperInfo.qsTitles.forEach(function (item) {
                item.qsList = _.sortBy(item.qsList, 'seqNum');
            });
            paperInfo.qsTitles = _.sortBy(paperInfo.qsTitles, 'seqNum');
            me.paperInfo.qsTitles = paperInfo.qsTitles;
            me.paperInfo.tags = paperInfo.tags;

            defer.resolve(true);
            return;
        });
        return defer.promise;
    };
    /**
     * 初始化大题号（以中文的形式显示）
     * return title 大题号
     */
    this.innitBigQNum = function () {
        var bigQtitle = [];
        this.paperInfo.qsTitles.forEach(function (item, index) {
            var id = index;
            var title = item.title;
            title = commonService.convertToChinese(item.seqNum + 1) + '、' + title;
            var smallLength = item.qsList.length;
            var data = {
                id: id,
                title: title,
                smallLength: smallLength
            }
            bigQtitle.push(data);
        });
        return bigQtitle;
    };

    /**
     * @description 修改作业
     * @param paperId 作业id
     * @param paperInfo 作业信息
     */
    this.updatePaperInfo = function (paper) {
        var paperScore=0;
        paper.qsTitles.forEach(function (bigQ, i) {
            bigQ.seqNum = i;
            var bigQScore=0;
            bigQ.qsList.forEach(function (smallQ, j) {
                smallQ.seqNum = j;
                bigQScore+=parseInt(smallQ.score);
            });
            bigQ.score=bigQScore;
            paperScore+=bigQScore;
        });
        paper.basic.score=paperScore;
        var name = paper.basic.title;
        var paperInfo = JSON.stringify(paper);
        var param = {
            id: this.backupWork.id,
            paperInfo: paperInfo,
            name: name
        }
        return commonService.commonPost(serverInterface.UPDATE_PAPER_INFO, param);
    };
    /**
     * 按权重算各题分数(四舍五入取整，剩余的分数补于最后一题)
     * @param paperInfo 作业信息
     * @param oldScore  最初分数
     */
    this.calculateScore = function (oldScore) {
        var newScore = parseInt(this.paperInfo.basic.score);
        var oldScore = parseInt(oldScore);
        var scale = newScore / oldScore;          //权重
        var totalScore = 0;
        this.paperInfo.qsTitles.forEach(function (bigQuestion) {
            bigQuestion.score = 0;
            bigQuestion.qsList.forEach(function (smallQuestion) {
                smallQuestion.score = parseInt((smallQuestion.score * scale).toFixed(0));
                bigQuestion.score += smallQuestion.score;
            });
            totalScore += parseInt(bigQuestion.score);
        });
        var temp = newScore - totalScore;
        this.paperInfo.qsTitles[0].score = this.paperInfo.qsTitles[0].score + (temp);
        this.paperInfo.qsTitles[0].qsList[0].score = this.paperInfo.qsTitles[0].qsList[0].score + (temp);     //多余的分数给第一个题
    };
    /**
     * 某个作业库下的一个作业详情
     * @param param 参数
     * @returns promise
     */
    this.getLibDetail = function (param) {
        var defer = $q.defer();
        var me = this;
        commonService.commonPost(serverInterface.GET_P_DETAIL_Q_LIST, param).then(function (data) {
            me.libWorkDetail.length = 0;
            me.libWork.bigQCount = 0;
            me.libWork.smallQCount = 0;
            if (data.code==200) {
                me.libWork.score=data.basic.score;
                data.qsTitles.forEach(function (item) {
                    item.qsList = _.sortBy(item.qsList, 'seqNum');
                });
                data.qsTitles = _.sortBy(data.qsTitles, 'seqNum');
                var count = 0;
                data.qsTitles.forEach(function (item) {
                    me.libWork.bigQCount += 1;
                    item.qsList.forEach(function (smallQ) {
                        smallQ.selected = false;
                        me.libWork.smallQCount += 1;
                    });
                    me.libWorkDetail.push(item);
                });
                defer.resolve(true);
                return;
            }
            defer.resolve(false);
        });
        return defer.promise;
    };
    /**
     * 为大题添加小题
     * @returns {*}
     */
    this.addSmallQ = function () {
        var index = commonService.getLocalStorage('bigQIndex'); //大题下标
        var paperInfo = angular.copy(this.paperInfo);
        var selected = false;
        this.libWorkDetail.forEach(function (bigQ) {
            bigQ.qsList.forEach(function (smallQ) {
                if (smallQ.selected) {
                    var data = {
                        answerKey: smallQ.answerKey,
                        id: smallQ.id,
                        qContext: smallQ.qContext,
                        score: smallQ.score
                    };
                    paperInfo.qsTitles[index].score = parseInt(paperInfo.qsTitles[index].score) + parseInt(data.score);
                    paperInfo.basic.score = parseInt(paperInfo.basic.score) + parseInt(data.score);
                    paperInfo.qsTitles[index].qsList.push(data);
                    selected = true;
                }
            });
        });
        var defer = $q.defer();
        if (selected) {
            var me = this;
            this.updatePaperInfo(paperInfo).then(function (data) {
                if (data) {
                    me.paperInfo = paperInfo;
                    defer.resolve(true);
                    return;
                }
                defer.resolve(false);
            })
            return defer.promise;
        }
        defer.resolve('noClicked');       //表示没有勾选
        return defer.promise;
    };

    /**
     * 发布时获取班级列表
     * @returns {*}
     */
    this.getPubClazzList = function (params) {
        var defer = $q.defer();
        var me = this;
        commonService.commonPost(serverInterface.GET_PUB_CLAZZ_LIST, params).then(function (data) {
            if (!data) {
                defer.resolve(false);
                me.commonService.alertDialog(data.msg, 2500);
                return
            }
            me.clazzList.length = 0;
            if (data.classes && data.classes.length) {
                data.classes.forEach(function (item) {
                    item.isClicked = false;
                    item.levelClick = [];
                    for (var level in item.levels) {
                        var lev = {};
                        lev.isClicked = false;
                        item.levelClick[level] = lev;
                    }
                    me.clazzList.push(item);
                });

            }
            defer.resolve(me.clazzList);
        },(data)=>{
            me.commonService.alertDialog(data.msg, 2500);
            return
        });
        return defer.promise;
    };

    this.pubPaperSucceed = function(dispatch,getState) {
        // return (dispatch, getState)=> {
            dispatch({
                type: PUB_WORK_DIFF_UNIT.CHANGE_PAPER_SET_PARAMS, payload: {
                    setParams: [],
                    quesList: [],
                }
            });
        // }
    }
});
