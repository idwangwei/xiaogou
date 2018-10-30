/**
 * Created by qiyuexi on 2018/1/11.
 */
import _find from 'lodash.find';
// import {PromiseFn} from "ngDecoratorForStuent/ng-decorator";
import {Inject, View, Directive, select, PromiseFn} from '../../module';

@View('wc_select_question', {
    url: '/wc_select_question/:paperId/:paperInstanceId/:redoFlag/:urlFrom/:questionIndex/:urlFromMark',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: [
        "$scope",
        '$rootScope',
        "$log",
        "$state",
        "commonService",
        "paperService",
        "uuid4",
        "$ionicPopup",
        "$ngRedux",
        "$ionicSlideBoxDelegate",
        "$ionicTabsDelegate",
        "ngLocalStore",
        "$timeout",
        "$ionicHistory",
        "finalData",
        "workStatisticsServices",
        "pageRefreshManager",
        "countDownService",
        "competitionFinalData"

    ]
})
class SelectQuestionCtrl {

    constructor() {
        this.initFlags();
    }

    /**
     * 初始化当前controller使用的变量,在super中被调用
     */
    initFlags() {
        this.paperDataInitializedFlag = false; //初始化试卷计时器标记
        // this.startPaperTimeCollectorFlag = false; //试卷计时器开始计时标记
        this.qsList = [];
        //this.title = "";
        this.regFlag = false;
        this.onLine = true;

    }

    /**
     * 在super中被$ngRedux.connect数据监听调用
     */
    onReceiveProps() {
        this.ensurePageData();
    }

    /**
     * 页面刷新时执行该方法
     */
    onUpdate() {

    }


    /**
     * 首次进入页面时执行该方法: 隐藏菜单栏
     */
    onBeforeEnterView() {
        //this.$ionicTabsDelegate.showBar(false);
        this.regFlag = false;
        this.paperDataInitializedFlag = false;

    }

    onAfterEnterView() {

    }

    onBeforeLeaveView() {

    }

    parseSeqNumToInt(str) {
        return parseInt(str);
    }

    ensurePageData() {
        let params = this.getStateService().params
        this.btnText = "试卷";
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

    @PromiseFn
    getPaperDataFromService(resolve) {
        // this.regFlag = false;
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
            resolve();


        }, () => {
            this.regFlag = true;
            this.getScope().$broadcast('scroll.refreshComplete');
        });
    }


    /**
     * 从state上获取该页面需要的数据
     * @param state
     * @returns {{selectedPaperId: *, selectedPaperInstanceId: *, selectedClazzId: *, selectedPaperIndex: *, paperData: *}}
     */
    mapStateToThis(state) {
        let urlFrom = state.work_list_route.urlFrom;
        let userId = state.profile_user_auth.user.userId;
        let clzId = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom === 'olympic_math_s' ? userId : state.wl_selected_clazz.id;

        let clazzListWithWorks = state.wl_clazz_list_with_works;
        let selectedClazzId = state.wl_selected_clazz.id;
        let selectedWork = state.wl_selected_work;
        let selectedPaper = clazzListWithWorks[clzId] && _find(clazzListWithWorks[clzId], {instanceId: selectedWork.instanceId});
        let paperData = selectedPaper ? selectedPaper.paperInfo.doPaper : null;

        let selectedPaperId = paperData && paperData.history.paperId;
        let selectedPaperInstanceId = paperData && paperData.history.paperInstanceId;
        let availableTime = paperData && paperData.availableTime;
        let pId = state.wl_selected_work.instanceId;
        let oralPaperTime = state.oral_calculation_limittime[pId];
        let finalAccessPaperTime = state.final_access_limittime[pId];
        return {
            loginName: state.profile_user_auth.user.loginName,
            isFetchDoPaperLoading: state.wl_is_fetch_doPaper_loading,
            isLoadingProcessing: (state.wl_is_fetch_doPaper_loading || state.wl_is_paper_submitting || state.wl_is_post_answer_loading) && urlFrom != 'oral_work',
            isLoadingProcessingOral: urlFrom == 'oral_work',
            ansChanged: state.wl_is_local_ans_changed,
            selectedWork: selectedWork,
            stateUrlFrom: state.work_list_route.urlFrom,
            selectedPaperId: selectedPaperId, //当前试卷的ID
            selectedPaperInstanceId: selectedPaperInstanceId, //当前试卷的批次号ID
            canFetchDoPaper: selectedPaper && selectedPaper.canFetchDoPaper,
            paperStatus: paperData && paperData.history.status.key, //试卷状态,是否是已提交
            title: selectedPaper && selectedPaper.paperInfo.paperName, //试卷名称
            bigQList: paperData && paperData.bigQList, //试卷题目
            statusMapForQuestions: paperData && paperData.statusMapForQuestions || [], //试卷中所有题目的状态
            availableTime: availableTime,
            onLine: state.app_info.onLine,
            paperTime: selectedWork.publishType == 13 ? finalAccessPaperTime : oralPaperTime,
        }
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
            urlFrom: this.getStateService().params.urlFrom,
            urlFromMark: this.getStateService().params.urlFromMark || ""
        }
        if (mark.length == bigQ.qsList.length) {
            param.isFirst = "yes"
        }
        this.go("wc_do_question", "forward", param);
    };

    goUrlHandle() {
        /*新增期末冲刺逻辑*/

        this.go("home.winter_camp_home");
       /* let params = this.getStateService().params;
        if (params.urlFrom == "winter_camp_home") {
            this.go("home.winter_camp_home")
            return;
        }
        if (params.urlFrom == "detail" && params.urlFromMark == "winter_camp_home") {
            this.go("wc_work_detail", 'back', {urlFrom: 'winter_camp_home'});
            return;
        }
        this.go("wc_work_detail", 'back');*/
    }

    /**
     * 点击返回按钮,结束该试卷的计时,并回到work_list页面
     */
    back() {
        let me = this;
        this.paperService.timeCollector.stopCollectTimeForPaper();

        //期末测评
        if (this.selectedWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS && this.paperTime && this.paperTime.startTime) {
            this.commonService.showConfirm('信息提示', '<p>正在进行中，退出仍会继续计时，确定退出吗？</p>').then((res) => {
                if (res) me.postAnsToServer().then(() => {
                    me.goUrlHandle();
                    this.paperService.startPaperTimeCollectorFlag = false;
                    me.paperService.timeCollector.clearIntervalTime(me.selectedPaperInstanceId);//保存答案成功后删除本地存的时间
                });
            });
            return
        }


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

            this.go("home.winter_camp_home");

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
        if (this.selectedWork.publishType === this.finalData.WORK_TYPE.FINAL_ACCESS) {
            data.msg = '试卷无法改错，请仔细检查后再提交。确定提交吗？'
        }
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
export default SelectQuestionCtrl