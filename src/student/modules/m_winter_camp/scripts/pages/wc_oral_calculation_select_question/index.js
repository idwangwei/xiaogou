/**
 * Created by WL on 2017/9/5.
 */
import _find from 'lodash.find';
import {Inject, View, Directive, select} from '../../module';

let getSelectedPaper = (state) => {
    let clzId = state.wl_selected_clazz.id;
    let selectedWork = state.wl_selected_work;
    let clazzListWithWorks = state.wl_clazz_list_with_works;
    return clazzListWithWorks[clzId] && _find(clazzListWithWorks[clzId], {instanceId: selectedWork.instanceId});
};

let getPaperData = (state) => {
    let selectedPaper = getSelectedPaper(state);
    return selectedPaper ? selectedPaper.paperInfo.doPaper : null;
};


@View('wc_oral_calculation_select_question', {
    url: '/wc_oral_calculation_select_question/:paperId/:paperInstanceId/:redoFlag/:urlFrom/:questionIndex',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ["$scope", '$rootScope', "$log", "$state", "commonService", "paperService", "uuid4", "$ionicPopup", "$ngRedux", "$ionicSlideBoxDelegate", "$ionicTabsDelegate",
        "ngLocalStore", "$timeout", "$ionicHistory", "finalData", "workStatisticsServices", "pageRefreshManager", "countDownService", "competitionFinalData"
    ]
})
class OralCalculationSelectQuestion {
    paperDataInitializedFlag = false; //初始化试卷计时器标记
    regFlag = false;
    qsList = [];
    onLine = true;
    @select(state => state.profile_user_auth.user.loginName)loginName;
    @select(state => state.wl_is_fetch_doPaper_loading)isFetchDoPaperLoading;
    @select(state => state.wl_is_local_ans_changed)ansChanged;
    @select(state => state.wl_selected_work)selectedWork;
    @select(state => {
        let paperData = getPaperData(state);
        return paperData && paperData.history.paperId;
    })selectedPaperId;
    @select(state => {
        let paperData = getPaperData(state);
        return paperData && paperData.history.paperInstanceId;
    })selectedPaperInstanceId;
    @select(state => {
        let selectedPaper = getSelectedPaper(state);
        return selectedPaper && selectedPaper.canFetchDoPaper;
    })canFetchDoPaper;
    @select(state => {
        let paperData = getPaperData(state);
        return paperData && paperData.history.status.key
    })paperStatus;
    @select(state => {
        let selectedPaper = getSelectedPaper(state);
        return selectedPaper && selectedPaper.paperInfo.paperName
    })title;
    @select(state => {
        let paperData = getPaperData(state);
        return paperData && paperData.bigQList
    })bigQList;
    @select(state => {
        let paperData = getPaperData(state);
        console.log("++++++++++++++++++++++++++++++++");
        console.log(paperData);
        return paperData && paperData.statusMapForQuestions || []
    })statusMapForQuestions;
    @select(state => {
        let paperData = getPaperData(state);
        return paperData && paperData.availableTime
    })availableTime;
    @select(state => state.app_info.onLine)onLine;
    @select(state => {
        let pId = state.wl_selected_work.instanceId;
        return state.oral_calculation_limittime[pId];
    })paperTime;


    /**
     * 在super中被$ngRedux.connect数据监听调用
     */
    onReceiveProps() {
        this.ensurePageData();
    }

    countDownActCallBack() {
        this.getScope().$apply(() => {
            this.showCountDownActFlag = false;
        });
    }

    countDownServerCallBack(time) {
        this.getScope().$apply(() => {
            if (time < 0) {
                time = 0
            }
            this.countDownStr = this.countDownService.dhms(time, 'ms2');
        });
        console.log("selection question---->" + time);
    }


    /**
     * 首次进入页面时执行该方法: 隐藏菜单栏
     */
    onBeforeEnterView() {
        this.regFlag = false;
        this.paperDataInitializedFlag = false;
    }

    onAfterEnterView() {
        if (this.selectedWork.publishType === this.finalData.WORK_TYPE.MATCH_WORK)
            this.countDownService.registCallback(this.countDownServerCallBack.bind(this), this.getScope().$id)
    }

    onBeforeLeaveView() {
        this.countDownService.removeCallback(this.getScope().$id);
    }

    parseSeqNumToInt(str) {
        return parseInt(str);
    }

    timeEndCallBack(retMsg) {
        //弹出一个询问框，有确定和取消按钮
        var msg = retMsg ? '作业提交失败！' : "比赛时间到，点击确定提交作业！";
        var data = {title: "信息提示", msg: msg};
        var me = this;
        this.commonService.showAlert(data.title, data.msg).then((res) => {
            if (res) {//点击确认
                retMsg ? this.go("home.winter_camp_home", 'back') : me.submitAnsAndPaper(me.submitCallback.bind(me), true);//改错后返回试卷列表
            }
        });
    }

    ensurePageData() {
        let params = this.getStateService().params
        this.btnText = (params.urlFrom == "finalSprint" || params.urlFrom == "detail" && params.urlFromMark == "finalSprint") ? "试卷" : "作业"
        if (this.getRootScope().selectQuestionUrlFrom != "doQuestion" && !this.paperDataInitializedFlag && this.selectedWork && this.selectedWork.paperId) {
            this.paperDataInitializedFlag = true;
            //获取试卷内容
            this.getPaperDataFromService();
        }
        //初始化Ctrl时执行,向后端拉取试卷内容
        if (this.canFetchDoPaper && !this.paperDataInitializedFlag && !this.isFetchDoPaperLoading && this.selectedWork && this.selectedWork.paperId) {
            this.paperDataInitializedFlag = true;
            //获取试卷内容
            this.getPaperDataFromService();
        }

        //获取试卷内容后执行,创建该试卷的计时器队列
        if (this.paperDataInitializedFlag && !this.paperService.startPaperTimeCollectorFlag && this.selectedPaperId) {
            this.paperService.startPaperTimeCollectorFlag = true;
            //开启试卷计时
            this.paperService.timeCollector.checkStatusForPaper(this.selectedPaperInstanceId, this.paperStatus, this.title);
        }

        //初始化Ctrl时执行,使用本地缓存的试卷内容
        if ((!this.canFetchDoPaper && !this.paperDataInitializedFlag && this.selectedWork && this.selectedWork.paperId)
            || (!this.onLine && !this.paperDataInitializedFlag)) {
            this.regFlag = true;

            this.paperDataInitializedFlag = true;
            let tempWork = this.ngLocalStore.getTempWork();
            if (tempWork.id == this.bigQList) {
                this.qsList = tempWork.qsList;
                // this.regFlag = true;
                checkSmallQStatus.call(this);
            } else {
                this.ngLocalStore.doPaperStore.getItem(this.loginName + '/' + this.selectedWork.instanceId).then((res) => {
                    if (res) {
                        this.ngLocalStore.setTempWork(this.loginName + '/' + this.bigQList, res);
                        this.getScope().$apply(() => {
                            // this.regFlag = true;
                            this.qsList = res;
                            checkSmallQStatus.call(this);
                        })
                    }
                }, () => {
                    // this.regFlag = true;
                    checkSmallQStatus.call(this);
                });
            }
        }


        function checkSmallQStatus() {
            let statusISUndefined = _find(this.qsList, (bigQ) => {
                return _find(bigQ.qsList, (smallQ) => {
                    return this.statusMapForQuestions[smallQ.id] === undefined;
                })
            });

            if (statusISUndefined) {
                this.getPaperDataFromService();
            }
        }
    }

    getPaperDataFromService() {
        this.fetchPaper(this.getStateService().params.redoFlag, false).then((data) => {
            this.regFlag = true;

            if (!data) {
                return
            }

            this.getRootScope().$emit('fetch_competition_info_from_server');

            if (this.selectedWork.publishType === this.finalData.WORK_TYPE.MATCH_WORK) {

                let localCountDownTime = this.commonService.getLocalStorage(this.competitionFinalData.COMPETITION_PAPER_COUNT_DOWN_TIME); //保存在本地竞赛试卷做题倒计时
                let currentCompetitionPaperCountDownTime = this.selectedWork.limitTime * 60; //当前点开的竞赛试卷做题剩余时间，默认为总做题时间
                let preTime = localCountDownTime && localCountDownTime[this.loginName + this.selectedWork.instanceId];
                if (localCountDownTime && preTime !== undefined) {
                    currentCompetitionPaperCountDownTime = preTime;
                }
                //更新countDownService上的time值（倒计时开始，time为0时弹出提交竞赛试卷的提示）
                this.countDownService.updateTime(currentCompetitionPaperCountDownTime);
            }


            //从localStore中获取需要显示的试卷信息
            let tempWork = this.ngLocalStore.getTempWork();
            if (tempWork.id == this.bigQList) {
                this.qsList = tempWork.qsList;
            }
            this.getScope().$broadcast('scroll.refreshComplete');
            if ((this.$ngRedux.getState().wl_selected_work.publishType === this.finalData.WORK_TYPE.ORAL_WORK
                || this.$ngRedux.getState().wl_selected_work.publishType === this.finalData.WORK_TYPE.FINAL_ACCESS
                ||this.$ngRedux.getState().wl_selected_work.publishType === this.finalData.WORK_TYPE.WINTER_CAMP_ORAl_CALC_WORK)
                && !this.commonService.isPC()) {
                this.skipToDoQuesPage();
            }
        }, () => {
            this.regFlag = true;
            this.getScope().$broadcast('scroll.refreshComplete');
        });
    }

    /**
     * 试题加载完成后跳转到作业页面
     */
    skipToDoQuesPage() {
        let bigQ = this.qsList[0];
        let smallq = bigQ.qsList[0];
        this.go("wc_oral_calculation_do_question", "none", {
            paperId: this.selectedPaperId,
            paperInstanceId: this.selectedPaperInstanceId,
            redoFlag: this.getStateService().params.redoFlag
        });
    }

    /**
     * 从service中获取需要的方法
     * @returns {{fetchPaper: *, submitPaper: *, parsePaperData: *, checkAssignedQuestion: *, stateGo: *}}
     */
    mapActionToThis() {
        return {
            fetchPaper: this.paperService.fetchPaper,
            submitPaper: this.paperService.submitPaper,
            submitAnsAndPaper: this.paperService.submitAnsAndPaper.bind(this.paperService),
            postAnsToServer: this.paperService.postAnsToServer,
            // parsePaperData: this.paperService.parsePaperData,
            checkAssignedQuestion: this.paperService.checkAssignedQuestion,
            fillSlideBoxData: this.paperService.fillSlideBoxData,
            deleteOralPaperLimitTime: this.workStatisticsServices.deleteLimitTimeByOralPaperId,
            //stateGo: stateGo
        };
    }


    /**
     * 点击页面上的小题,保存该小题信息到paperData中,并进入do_question页面
     * @param bigQ  大题对象
     * @param smallQ  小题对象
     */
    goToCheck(bigQ, smallQ) {
        this.checkAssignedQuestion(bigQ, smallQ); //保存当前点击小题的答题下标,小题下标,和该小题在所有小题集合中的下标
        //每次进入do_question页面都要使用点击的该小题及其前后一题来填充do_question页面中的sideBox
        this.fillSlideBoxData(this.qsList);
        let mark = bigQ.qsList.filter(x => this.statusMapForQuestions[x.id] == 0);//所有未做的
        let param = {
            paperId: this.selectedPaperId,
            paperInstanceId: this.selectedPaperInstanceId,
            urlFrom: this.getStateService().current.name
        };
        if (mark.length == bigQ.qsList.length) {
            param.isFirst = "yes"
        }
        // this.go("do_question", "forward", param);
        this.go("wc_do_question", "forward", param);
    };

    goUrlHandle() {
        /*新增期末冲刺逻辑*/
        let params = this.getStateService().params;
        if (this.getStateService().params.redoFlag === 'true')
            this.go("wc_oral_calculation_work_detail", 'back');
        else
            this.go("home.winter_camp_home", 'back');
    }

    /**
     * 点击返回按钮,结束该试卷的计时,并回到work_list页面
     */
    back() {
        let me = this;
        this.paperService.timeCollector.stopCollectTimeForPaper();
        //该试卷在本地是否保存了答案
        if (this.ansChanged[this.selectedPaperInstanceId]) {
            if (this.onLine) {
                this.$ionicPopup.alert({
                    title: '信息提示',
                    template: '<p>有部分试题答案仍保存在本机，上传到服务器？</p>',
                    okText: '确定'
                }).then(() => {
                    me.postAnsToServer().then(() => {
                        me.goUrlHandle();
                        this.paperService.startPaperTimeCollectorFlag = false;
                        me.paperService.timeCollector.clearIntervalTime(me.selectedPaperInstanceId);//保存答案成功后删除本地存的时间
                    });
                })
            } else {
                this.$ionicPopup.alert({
                    title: '信息提示',
                    template: '<p>当前网络不可用,有部分试题答案仍保存在本机,请在连接好网络后,上传到服务器</p>',
                    okText: '确定'
                }).then(() => {
                    this.paperService.startPaperTimeCollectorFlag = false;
                    me.goUrlHandle();
                });
            }
        } else {
            me.goUrlHandle();
            this.paperService.startPaperTimeCollectorFlag = false;
        }
    };

    /**
     * 提交作业的回调
     */
    submitCallback(msg) {
        if (msg) {//到时间后比赛作业提交失败，需要
            this.timeEndCallBack(msg);
            return;
        }
        console.log('提交成功后清空计时');
        this.$timeout(() => {  //不要删除这个定时器，不然做题时间会有问题
            if (this.selectedWork.publishType == this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
                || this.selectedWork.publishType == this.finalData.WORK_TYPE.ORAL_WORK
                || this.selectedWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS
                || this.selectedWork.publishType == this.finalData.WORK_TYPE.WINTER_CAMP_ORAl_CALC_WORK) {
                //将根据试卷publishType来dispatch删除 期末测评的定时器或者口算定时器
                this.deleteOralPaperLimitTime(this.selectedWork.paperId);
            }
            this.paperService.timeCollector.stopCollectTimeForPaper();
            this.paperService.startPaperTimeCollectorFlag = false;
            this.paperService.timeCollector.clearIntervalTime(this.selectedPaperInstanceId);//保存答案成功后删除本地存的时间

            /*新增期末冲刺逻辑*/
            let params = this.getStateService().params;
            //提交后返回到作业列表需要随机弹出提示去诊断的提示框
            this.getRootScope().isAfterSubmitPaperBackToWorkList = true;

            /*if (this.getStateService().params.redoFlag === 'false') {
             this.go("work_praise", 'forward', {
             workId: this.selectedPaperId,
             workInstanceId: this.selectedPaperInstanceId
             });//第一次提交后进入表扬页面
             } else {
             this.go("home.winter_camp_home", 'none');//改错后返回试卷列表
             }*/
            this.go("home.winter_camp_home", 'none');//改错后返回试卷列表


        }, 100);
    }

    /**
     * 提交作业
     */
    submitPaperHandle() {
        //弹出一个询问框，有确定和取消按钮
        let msg = this.selectedWork.publishType === this.finalData.WORK_TYPE.MATCH_WORK ? "试卷无法改错，请仔细检查后再提交。确定提交吗？" : "你确定要提交" + this.btnText + "吗？";
        let data = {title: "信息提示", msg: msg};
        let me = this;

        //期末测评作业提交提示
        /*  if (this.selectedWork.publishType === this.finalData.WORK_TYPE.FINAL_ACCESS) {
         data.msg = '试卷无法改错，请仔细检查后再提交。确定提交吗？'
         }*/
        this.commonService.showConfirm(data.title, data.msg).then((res) => {
            if (res) {//点击确认
                let spentTime = undefined;
                //口算时间以倒计时的时间为准
                //将期末测评的定时器添加到口算定时器map中，时间紧张暂时共用下
                if ((this.selectedWork.publishType == this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
                    || this.selectedWork.publishType == this.finalData.WORK_TYPE.ORAL_WORK
                    || this.selectedWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS
                    || this.selectedWork.publishType == this.finalData.WORK_TYPE.WINTER_CAMP_ORAl_CALC_WORK) && this.paperTime) {
                    let diff = Math.floor((new Date().getTime() - this.paperTime.startTime) / 1000);
                    spentTime = (diff > this.selectedWork.limitTime * 60 || diff < 0) ? this.selectedWork.limitTime * 60 : diff;
                }


                me.submitAnsAndPaper(me.submitCallback.bind(me), false, undefined, spentTime ? spentTime * 1000 : undefined);
            }
        });
    };
}










