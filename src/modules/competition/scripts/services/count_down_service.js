/**
 * Created by Administrator on 2017/3/23.
 * 倒计时service
 */
import {dhms} from './../directives/untils';
import {bindActionCreators} from 'redux';
export default function ($rootScope, commonService, $injector, $state, $ngRedux,finalData) {

    this.callbackMap = {}; //倒数计时过程中调用的回调函数映射
    this.time = 0; //比赛前倒计时|试卷做题倒计时
    this.intervalId = 0; //计时器id
    this.localCountDownTime = commonService.getLocalStorage(finalData.COMPETITION_PAPER_COUNT_DOWN_TIME); //保存在本地竞赛试卷做题倒计时
    /**
     * 更新时间
     * @param time
     */
    this.updateTime = function (seconds) {
        seconds ? this.time = seconds : this.time = 0;
        let me = this;
        clearInterval(this.intervalId);
        this.intervalId = setInterval(function () {
            me.time -= 1;
            for (let props in me.callbackMap) {
                me.callbackMap[props].call(me, me.time);
            }
            //竞赛试卷做题时间倒计时(只要没有限时结束都上可以做题的)，需要同步到本地保存
            if($rootScope.competition.realStatus && ($rootScope.competition.realStatus.racing == 2||$rootScope.competition.realStatus.racing == 4)){
                let userInfo = $ngRedux.getState().profile_user_auth.user;
                if(me.localCountDownTime) {
                    me.localCountDownTime[userInfo.loginName+$rootScope.competition.paper.instanceId] = me.time;
                }
                else{
                    me.localCountDownTime = {};
                    me.localCountDownTime[userInfo.loginName+$rootScope.competition.paper.instanceId] = me.time
                }
                commonService.setLocalStorage(finalData.COMPETITION_PAPER_COUNT_DOWN_TIME, me.localCountDownTime);
            }

            if (me.time <= 0) {
                clearInterval(me.intervalId);
                me.showSubmitAnswerTipWhileTimesUp();
            }
        }, 1000);
    };
    /**
     * 注册获取时间的回调函数
     * @param callback
     * @param callbackId
     */
    this.registCallback = function (callback, callbackId) {
        this.callbackMap[callbackId] = callback;
    };
    /**
     * 注销获取时间的回调函数
     * @param callbackId
     */
    this.removeCallback = function (callbackId) {
        delete this.callbackMap[callbackId];
        console.log("delete callback->" + callbackId);
        console.log(this.callbackMap);
    };
    this.dhms = dhms;
    /**
     * 做题试卷倒计时结束时，弹出提交试卷提示框
     */
    this.showSubmitAnswerTipWhileTimesUp = function () {
        if ($rootScope.competition && $rootScope.competition.realStatus) {
            let status = $rootScope.competition.realStatus;
            if (status.racing == 2 || status.racing == 4) {//提示提交试卷
                let isStudentSystem = $rootScope.currentSystem == "student";
                let submitPaper = function () {
                };
                if (isStudentSystem) {
                    let paperService = $injector.get('paperService');
                    submitPaper = bindActionCreators(paperService.submitAnsAndPaper.bind(paperService), $ngRedux.dispatch);
                    commonService.showAlert("信息提示", "比赛时间到，点击确定提交作业！").then((res) => {
                        if (res) {//点击确认
                            let selectedMatchWork={
                                paperId :$rootScope.competition.paper.paperId,
                                instanceId :$rootScope.competition.paper.instanceId,
                                publishType:8,
                                clzId:$rootScope.competition.paper.clazzId
                            };
                            //提交试卷
                            submitPaper(() => {
                                if ($state.current.name === "home.work_list") {
                                    $rootScope.$emit('fetch_competition_info_from_server');
                                    return;
                                }
                                $state.go("home.work_list");
                            }, true,selectedMatchWork);
                        }
                    });
                }
            }
        }
    }
}
