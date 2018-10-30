import  controllers from './../../controllers/index';
import './style.less';
controllers.controller('holidayWorkListCtrl',
    function ($log, $scope, $state, $rootScope, commonService, workStatisticsServices) {
        "ngInject";

        $scope.initCtrl = false;
        $scope.wData = workStatisticsServices.wData;//共享的数据
        $scope.wData.workList = [];
        $scope.retFlag = false;
        $scope.pubWorkStudent = workStatisticsServices.pubWorkStudent;
        $scope.wData = workStatisticsServices.wData;//共享的数据
        $scope.wData.queryParams.sId = $scope.pubWorkStudent.id; //学生id
        $scope.wData.queryParams.sName = $scope.pubWorkStudent.name; //学生名称
        $scope.wData.queryParams.dateInfo = {};
        $scope.wData.queryParams.startTime = workStatisticsServices.getFirstDayOfMonth();//获取当前月份的第一天
        $scope.wData.queryParams.endTime = workStatisticsServices.getLastDayOfMonth();//获取当前月份的最后一天
        let SHOW_NAME = {P: "家长", S: '学生', T: '老师'};//在评价明细页面显示的名称

        $scope.openingTime = new Date("2018/07/01 0:0:0").getTime();
        $scope.systemTime = new Date().getTime();
        $scope.back = ()=> {
            $state.go('home.work_list');
        };//返回到worklist页面

        $scope.reviewWorkDetail = (col)=>{
            $scope.wData.currentWork = col;
            $scope.wData.currentWork.detailPublishTime = col.publishDateTime + '  ' + col.date.substring(11, 16);
            $scope.wData.currentWork.sName = $scope.wData.queryParams.sName;
            $scope.wData.currentWork.sId = $scope.wData.queryParams.sId;
            $scope.wData.currentWork.reworkTimes = col.reworkTimes;
            var param = {
                workId: col.paperId,
                workInstanceId: col.instanceId,
                workStatus: col.status
            };
            var paper = {
                paperId: col.paperId,
                paperInstanceId: col.instanceId
            };
            workStatisticsServices.getHolidayPaperStatus(paper, col.publishType).then(function (data) {
                debugger;
                if (data.code == 200) {
                    var status = data.status.key;
                    param.workStatus = status;
                    if (status == -1) {
                        commonService.showAlert('信息提示', '该作业已经被老师删除').then(function () {
                            $scope.wData.workList.splice($index, 1);
                        });
                        return;
                    }
    
                    //如果服务器时间小于该套时间的布置时间，则提示“改作业于param.publishTime开启”
                    if (data.status.key == 1 && data.systemTime && col.date) {
                        let publishTime = new Date(col.date.replace(/-/g, '/'));
                        if(publishTime.getTime() - data.systemTime > 0){
                            commonService.alertDialog(`该作业于${publishTime.getMonth()+1}月${publishTime.getDate()}号发布`,2000);
                            return
                        }
                    }
    
                    workStatisticsServices.workDetailUrlFrom = 'holiday_work_list';
                    $state.go("work_detail", param); //返回做题
                    return;
                }
            });

        };
        /**
         * 显示信封具体内容
         * @param paper 当前作业
         * @showType  展示区分  1为学生2为老师3家长
         */
        $scope.showPraiseDetail = function (paper, showType) {
            debugger;
            $scope.wData.correctedPraise = {};
            $scope.wData.correctedPraise.paper = paper;
            $scope.wData.correctedPraise.showType = showType;
            switch (showType) {
                case 1:
                    $scope.wData.correctedPraise.showName = SHOW_NAME.S;
                    $scope.wData.correctedPraise.praiseImg = paper.studentPraise.img;
                    break;
                case 2:
                    $scope.wData.correctedPraise.showName = SHOW_NAME.T;
                    $scope.wData.correctedPraise.praiseImg = paper.teacherPraise.img;
                    break;
                case 3:
                    $scope.wData.correctedPraise.showName = SHOW_NAME.P;
                    $scope.wData.correctedPraise.praiseImg = paper.parentPraise.img;
                    break;
                default:
                    $scope.wData.correctedPraise.showName = "";
            }
            $state.go("work_praise_detail");
        };

        /**
         * 家长评价
         */
        $scope.praiseStu = function (paper) {
            /* var param={
             encourage:paper.encourage
             };*/
            $scope.wData.queryParams.workId = paper.paperId;
            $scope.wData.queryParams.workInstanceId = paper.instanceId;
            $state.go("work_praise");
            //$state.go("work_praise",param);
        };


        if(!$scope.initCtrl){
            $scope.initCtrl = true;
            workStatisticsServices.queryWork(4, true).then((data,systemTime) =>{
                if (data) {
                    angular.forEach(data,(work)=> {
                        $scope.wData.workList.push(work);
                    });
                    $scope.wData.workList.sort((v1,v2)=>{return v1.seq-v2.seq})
                } else {
                    $scope.moreFlag = false;
                }
                if (systemTime){
                    $scope.systemTime = new Date(systemTime.replace(/-/g,"/")).getTime();
                }
                $scope.retFlag = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, () =>{
                $scope.retFlag = true;
            });
        }
        $rootScope.viewGoBack=$scope.back.bind($scope);
    });
