import "./http_interpectors/index";
import "./directives/index";
import "./constants/index";
import "./constants/constant";
import "./controllers/index";
import "./../less/app.less";
import "./services/index"
import configRoutes from "./routes";

let competitionModule = angular.module('competition', [
    "competition.ngHttpInterceptors",
    "competition.directives",
    "competition.constants",
    "competition.controllers",
    "competition.services",

]);

configRoutes(competitionModule);//配置路由

competitionModule.config(['$httpProvider', ConfigHttpProxy])//配置http拦截器
    .run(["$rootScope", "commonService", "competitionInterface", "competitionFinalData", "$ngRedux", "countDownService", HandleStateChange])//路由拦截
    // .run(["$rootScope", "$ngRedux", "competitionFinalData", "competitionInterface", "commonService", "countDownService", watchWlSelectedClazz])
    .run(["$window", "$rootScope", "competitionFinalData", OnResumeHandler]);

function OnResumeHandler($window, $rootScope, competitionFinalData) {
    $window.document.addEventListener("resume", onResume, false);

    function onResume() {
        if ($rootScope.hasCompetition && $rootScope.currentSystem !== competitionFinalData.SYSTEM_PARENT) {
            $rootScope.$emit("fetch_competition_info_from_server");
        }
    }
}

function ConfigHttpProxy($httpProvider) {
    $httpProvider.interceptors.push('getCompetitionInfo');
}

function HandleStateChange($rootScope, commonService, competitionInterface, competitionFinalData, $ngRedux, countDownService) {
    $rootScope.$on('$stateChangeSuccess', function (ev, toState, toStateParams) {
        console.log("$stateChangeSuccess from competition!");

        //如果没有竞赛资格 || 不是去作业列表页 不获取
        if (!$rootScope.hasCompetition || toState.name !== competitionFinalData.WORK_LIST_URL) {
            return
        }

        //家长端不获取
        // let currentSystem = JSON.parse(window.localStorage.getItem('currentSystem')) || {id:$rootScope.currentSystem};
        let currentSystem = {id: $rootScope.currentSystem};
        if (currentSystem.id === competitionFinalData.SYSTEM_PARENT) {
            return
        }
        // getCompetitionPaperInfo($rootScope, $ngRedux, competitionFinalData, competitionInterface, commonService, currentSystem, countDownService);
    });
}

function watchWlSelectedClazz($rootScope, $ngRedux, competitionFinalData, competitionInterface, commonService, countDownService) {
    if (!$ngRedux.getState().wl_selected_clazz) {
        return
    }
    $ngRedux.connect({
        selectorList: [], mapStateToThis: (state) => {
            return {wlSelectedClazz: state.wl_selected_clazz}
        }
    })($rootScope);
    // $rootScope.$watch('wlSelectedClazz.id', (newData, oldData) => {
    //     if(oldData && newData && newData != oldData){
    //         getCompetitionPaperInfo($rootScope, $ngRedux, competitionFinalData, competitionInterface, commonService, {id: $rootScope.currentSystem});
    //     }
    // });
    $rootScope.$on('refresh_competition_info', () => {
        $rootScope.competition.paper.countdown = null;
        if ($rootScope.currentSystem == competitionFinalData.SYSTEM_TEACHER) {
            $rootScope.competition.paper.status.progress = 2;
        }
        if ($rootScope.currentSystem == competitionFinalData.SYSTEM_STUDENT) {
            $rootScope.competition.paper.status = 2;
        }
    });
    $rootScope.$on('fetch_competition_info_from_server', () => {
        // getCompetitionPaperInfo($rootScope, $ngRedux, competitionFinalData, competitionInterface, commonService, {id: $rootScope.currentSystem},countDownService);
    });
    //退出账号，清空$rootScope上竞赛相关的任何信息
    $rootScope.$on('clear_competition_info', () => {
        $rootScope.competition = {};
        $rootScope.hasCompetition = undefined;
    })

}

function getCompetitionPaperInfo($rootScope, $ngRedux, competitionFinalData, competitionInterface, commonService, currentSystem, countDownService) {
    let state = $ngRedux.getState();
    let clazzId = state.wl_selected_clazz.id ||
        (currentSystem.id === competitionFinalData.SYSTEM_STUDENT && state.profile_clazz.clazzList && state.profile_clazz.clazzList[0] && state.profile_clazz.clazzList[0].id) ||
        (currentSystem.id === competitionFinalData.SYSTEM_TEACHER && state.clazz_list && state.clazz_list[0] && state.clazz_list[0].id) ||
        '';
    let formatTime = function (timestamp) {
        if (typeof timestamp !== 'number') {
            console.warn('竞赛起止时间后端返回有错: ', timestamp);
            return "x月x日 24:00"
        }
        let date = new Date(timestamp);
        return (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours() + ':'
            + (date.getMinutes().toString().length == 1 ? ("0" + date.getMinutes()) : date.getMinutes())
    };
    let getStatusMap = function (status) {
        // status:{       //状态值: 0-表示未知状态
        //     "result":0,        //比赛结果状态  1-未晋级  2-晋级
        //     "racing":1,        //学生比赛状态  1-没有开始比赛  2-正在进行比赛  3-已经提交比赛数据  4-时间用完
        //     "progress":3,      //比赛日程状态  1-比赛进入倒计时(预告)  2-比赛进行中  3-比赛结束
        // }

        let studentStatus = 1;
        if (status.progress == 1) { //赛前
            studentStatus = 1;
        }
        else if (status.progress == 2) { //赛中
            if (status.racing == 1) {
                studentStatus = 2;
            }
            else if (status.racing == 2) {
                studentStatus = 3;
            }
            else if (status.racing == 3) {
                studentStatus = 4;
            }
            else if (status.racing == 4) {
                studentStatus = 3;
            }
        }
        else if (status.progress == 3) { //赛后
            if (status.racing == 1) {
                studentStatus = 5;
            }
            else if (status.racing == 2) {
                studentStatus = 3;
            }
            else if (status.racing == 3) {//竞赛结束，试卷提交，status.result!=0 才显示报告icon
                studentStatus = 6;
                if (status.result == 1) {
                    studentStatus = 8;
                } //未晋级
                else if (status.result == 2) {
                    studentStatus = 7;
                } //已晋级
            }
            else if (status.racing == 4) {
                studentStatus = 3;
            }
        }

        // if (status.progress == 1) {
        //     studentStatus = 1
        // }
        // else if (status.progress == 2 && status.racing == 1) {
        //     studentStatus = 2
        // }
        // else if (status.progress == 2 && status.racing == 2) {
        //     studentStatus = 3
        // }
        // else if (status.progress == 2 && status.racing == 3) {
        //     studentStatus = 4
        // }
        // else if (status.progress == 2 && status.racing == 4) {
        //     studentStatus = 3
        // }
        // else if (status.progress == 3 && status.racing == 1) {
        //     studentStatus = 5
        // }
        // else if (status.progress == 3 && status.racing == 2) {
        //     studentStatus = 3
        // }
        // else if (status.progress == 3 && status.racing == 3) {
        //     studentStatus = 6
        // }
        // else if (status.progress == 3 && status.racing == 4) {
        //     studentStatus = 3
        // }
        // else if (status.result == 1) {
        //     studentStatus = 8
        // }
        // else if (status.result == 2) {
        //     studentStatus = 7
        // }

        return studentStatus;
    };
    if (!clazzId) {
        console.log("没有班级id，不能获取竞赛试卷信息。。。。。。。。。。。。。");
        $rootScope.competition.paper = undefined;
        return
    }
    if ($rootScope.competitionCancelDefer) {
        $rootScope.competitionCancelDefer.resolve();
        $rootScope.competitionCancelDefer = null;
    }
    let url = currentSystem.id === competitionFinalData.SYSTEM_TEACHER ?
        competitionInterface.GET_COMPETITION_PAPER_INFO_TEACHER : competitionInterface.GET_COMPETITION_PAPER_INFO;

    //特殊处理新用户第一次登录使用，state.wl_selected_clazz为空，sharding参数默认从clazzList[0]中获取，
    let post = commonService.commonPost(url, {groupId: clazzId}, true);
    $rootScope.competitionCancelDefer = post.cancelDefer;
    post.requestPromise.then((data) => {
        $rootScope.competitionCancelDefer = null;
        if (data.code == 200) {
            if (!$rootScope.competition) {
                $rootScope.competition = {};
            }
            $rootScope.competition.paper = data.list && data.list[0];
            // $rootScope.competition.paper = {
            //     countDown: 20,
            //     endTime: 1492159400000,
            //     instanceId: "cc72383b-ad40-449a-8059-42bf23fd13e1@610027",
            //     limitTime: 5,
            //     paperId: "2550cbfa-05b3-43c7-b3b9-86d13fb260da",
            //     paperName: "2016~2017学年郫都区三年级初赛",
            //     publishType: 8,
            //     questionNumber: 15,
            //     score: 0,
            //     startTime: 1492159000000,
            //     status: {result: 0, racing: 1, progress: 1},
            //     totalScore: 100,
            //     wasteTime: null
            // };

            if ($rootScope.competition.paper) {
                $rootScope.competition.paper.clazzId = clazzId;
                $rootScope.competition.paper.startTime = formatTime($rootScope.competition.paper.startTime);
                $rootScope.competition.paper.endTime = formatTime($rootScope.competition.paper.endTime).split(" ")[1];
                $rootScope.competition.realStatus = $rootScope.competition.paper.status;
                //学生端映射后端状态值为1-8
                if (currentSystem.id == competitionFinalData.SYSTEM_STUDENT) {
                    $rootScope.competition.paper.status = getStatusMap($rootScope.competition.paper.status);
                }
                //竞赛前倒计时
                if (countDownService && $rootScope.competition.realStatus.progress == 1) {
                    countDownService.updateTime($rootScope.competition.paper.countDown);
                }

                //做题倒计时
                if (countDownService && ($rootScope.competition.realStatus.racing == 2 || $rootScope.competition.realStatus.racing == 4)) {
                    let localCountDownTime = commonService.getLocalStorage(competitionFinalData.COMPETITION_PAPER_COUNT_DOWN_TIME); //保存在本地竞赛试卷做题倒计时
                    let currentCompetitionPaperCountDownTime = $rootScope.competition.paper.limitTime * 60; //当前点开的竞赛试卷做题剩余时间，默认为总做题时间
                    let preTime = localCountDownTime && localCountDownTime[$ngRedux.getState().profile_user_auth.user.loginName + $rootScope.competition.paper.instanceId];

                    if (localCountDownTime && preTime !== undefined) {
                        currentCompetitionPaperCountDownTime = preTime;
                    }

                    if ($rootScope.competition.paper.countDown > currentCompetitionPaperCountDownTime) {
                        currentCompetitionPaperCountDownTime = $rootScope.competition.paper.countDown;
                    }
                    //更新countDownService上的time值（倒计时开始，time为0时弹出提交竞赛试卷的提示）
                    countDownService.updateTime(currentCompetitionPaperCountDownTime);
                }
            } else {
                $rootScope.competition.paper = undefined;
                $rootScope.competition.realStatus = undefined;
            }
        } else {
            $rootScope.competition.paper = undefined;
            $rootScope.competition.realStatus = undefined;
            console.error("获取竞赛试卷信息失败：", data.msg);
        }
    }, () => {
        $rootScope.competitionCancelDefer = null;
        if ($rootScope.competition) {
            $rootScope.competition.realStatus = undefined;
            $rootScope.competition.paper = undefined;
        }
    });

}