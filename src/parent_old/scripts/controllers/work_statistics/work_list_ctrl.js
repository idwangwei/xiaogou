/**
 * Author 邓小龙 on 2015/9/15.
 * @description 作业列表
 */
import  controllers from './../index';
controllers.controller('workListCtrl',
    function ($log, $scope, $state, $rootScope, commonService, workStatisticsServices, finalData, $ionicModal, subHeaderService,
              $ionicPopup, $ionicScrollDelegate, dateUtil,profileService,$ionicSlideBoxDelegate) {
        "ngInject";
        $scope.pubWorkStudent = workStatisticsServices.pubWorkStudent;
        $scope.STU_CLAZZ_STATUS = finalData.STU_CLAZZ_STATUS;
        $scope.finishVacationMessages = workStatisticsServices.finishVacationMessages;
        $scope.selfMsg = workStatisticsServices.selfMsg;
        $scope.isIos = commonService.judgeSYS() === 2;
        subHeaderService.clearAll();
        $scope.studentList = $rootScope.student;
        workStatisticsServices.clearAllData();//先清空共享数据
        $scope.wData = workStatisticsServices.wData;//共享的数据
        $scope.wData.queryParams.sId = $scope.pubWorkStudent.id; //学生id
        $scope.wData.queryParams.sName = $scope.pubWorkStudent.name; //学生名称
        $scope.wData.queryParams.dateInfo = {};
        $scope.wData.queryParams.startTime = workStatisticsServices.getFirstDayOfMonth();//获取当前月份的第一天
        $scope.wData.queryParams.endTime = workStatisticsServices.getLastDayOfMonth();//获取当前月份的最后一天
        $scope.showQueryFlag = false;//是否显示查询条件
        $scope.startTime = "";//开始时间
        $scope.endTime = "";//结束时间
//        workStatisticsServices.queryWork(0);//获取作业列表
        workStatisticsServices.getPraiseList();
        var SHOW_CORRECT_MSG = "作业已提交，请耐心等待批改结果。";
        $scope.selectClazzName = '选择班级...';
        $scope.tip = "还没有收到作业";
        var SHOW_NAME = {P: "家长", S: '学生', T: '老师'};//在评价明细页面显示的名称
        //$scope.data.queryShow="所有作业"
        $rootScope.winterBroadcastLoading = false;
        $rootScope.winterBroadcastData = [];
        studentInit();

        function createStuClazzList() {
            let studentList = angular.copy($rootScope.student);
            let studentClazzInfo;
            $scope.studentClazzList = [];

            angular.forEach(studentList, (stu, index)=> {
                angular.forEach(stu.passedClazzList, (clazz)=> {
                    if (clazz.status === 1) {
                        studentClazzInfo = {};
                        studentClazzInfo.stu = stu;
                        studentClazzInfo.clazz = clazz;
                        $scope.studentClazzList.push(studentClazzInfo);
                    }

                });
            });
        }


        /**
         * 给发布的学生设置值
         */
        function setWorkStudentValue(id, name, showName, stuClazzStatus) {
            $scope.pubWorkStudent.id = id;
            $scope.pubWorkStudent.name = name;
            $scope.pubWorkStudent.showName = showName;
            $scope.pubWorkStudent.stuClazzStatus = stuClazzStatus;
            $scope.wData.queryParams.sId = $scope.pubWorkStudent.id; //学生id
            $scope.wData.queryParams.sName = $scope.pubWorkStudent.name; //学生名称
        }

        /**
         * 默认选中一个学生班级
         */
        function initSelectedStuClazz() {
            let stuId,stuName,studentShowName,stuClazzStatus,findIndex=-1,selecetedStuClazz;
            stuId=$scope.studentClazzList[0].stu.studentId;
            stuName=$scope.studentClazzList[0].stu.studentName;
            studentShowName=$scope.studentClazzList[0].stu.studentName+ '（' + $scope.studentClazzList[0].clazz.name + '）';
            stuClazzStatus=$scope.studentClazzList[0].stu.stuClazzStatus;
            if (!$scope.pubWorkStudent.id) {
                $rootScope.selectedWorkClazz = $scope.studentClazzList[0].clazz;
                setWorkStudentValue(stuId, stuName, studentShowName, stuClazzStatus);
                return;
            }

            angular.forEach($scope.studentClazzList,(stuClazz,index)=>{
                if($scope.pubWorkStudent.id === stuClazz.stu.studentId&&stuClazz.clazz.id===$rootScope.selectedWorkClazz.id)
                    findIndex=index;
            });
            if(findIndex!=-1){
                selecetedStuClazz=$scope.studentClazzList[findIndex];
                stuId=selecetedStuClazz.stu.studentId;
                stuName=selecetedStuClazz.stu.studentName;
                studentShowName=selecetedStuClazz.stu.studentName+ '（' + selecetedStuClazz.clazz.name + '）';
                stuClazzStatus=selecetedStuClazz.stu.stuClazzStatus;
                $rootScope.selectedWorkClazz = selecetedStuClazz.clazz;
                setWorkStudentValue(stuId, stuName, studentShowName, stuClazzStatus);
                return;
            }
            $rootScope.selectedWorkClazz = $scope.studentClazzList[0].clazz;
            setWorkStudentValue(stuId, stuName, studentShowName, stuClazzStatus);

        }

        /**
         * 学生初始化
         */
        function studentInit() {
            if ($rootScope.student && $rootScope.student.length > 0) {
                createStuClazzList();
                if ($scope.studentClazzList.length) {
                    initSelectedStuClazz();
                    return;
                }
                setWorkStudentValue(null, null, null, null);
            }
            setWorkStudentValue(null, null, null, null);
        }


        /**
         * 显示作业明细统计
         * @param col
         */
        $scope.showWorkDetail = function (col, $index) {
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
            workStatisticsServices.getPaperStatus(paper, col.publishType).then(function (data) {
                if (data.code == 200) {
                    var status = data.status.key;
                    param.workStatus = status;
                    if (status == -1) {
                        commonService.showAlert('信息提示', '该作业已经被老师删除').then(function () {
                            $scope.wData.workList.splice($index, 1);
                        });
                        return;
                    }
                    if (status == 3) {//3作业已提交
                        commonService.alertDialog(SHOW_CORRECT_MSG, 1500);
                        return;
                    }
                    workStatisticsServices.workDetailUrlFrom = 'home.work_list';
                    $state.go("work_detail", param); //返回做题
                    return;
                }
            });
        };

        $scope.wData.workList = [];
        $scope.retFlag = false; //默认不显示提示信息tips（请求完了才显示）
        $scope.moreFlag = true;
        $scope.limitQuery = workStatisticsServices.limitQuery;
        $scope.limitQuery.lastKey = "";

        /**
         * 给列表最后一个暑假作业添加“预告”
         */
        function getLastedSummerWork() {
            //给列表最后一个暑假作业添加“预告”
            var lastSummerWorkIndex = -1;
            angular.forEach($scope.wData.workList, function (work, index) {
                work.isLastSummerWork = false;
                if (lastSummerWorkIndex == -1)
                    lastSummerWorkIndex = work.publishType == 4 ? index : lastSummerWorkIndex;
            });
            if (lastSummerWorkIndex > -1) {
                var lastSummerWork = $scope.wData.workList[lastSummerWorkIndex];
                lastSummerWork.date = lastSummerWork.date ? lastSummerWork.date.substring(0, 10) : lastSummerWork.date;
                var workDate = new Date(lastSummerWork.date);
                var lastDay = workDate.setDate(workDate.getDate() + 3);//3天后
                if ((new Date(lastDay)).getMonth() + 1 < 9) {//如果三天后时间为9月，就不预告了
                    var formatStr = dateUtil.dateFormat.prototype.DEFAULT_CHINA_DAY_FORMAT;//格式成“08月01日”
                    var lastDayFormatStr = dateUtil.dateFormat.prototype.format(new Date(lastDay), formatStr);
                    var showStr = "下次作业将于" + lastDayFormatStr + "发布";
                    lastSummerWork.lastSummerWork = showStr;
                    $scope.wData.workList.splice(lastSummerWorkIndex, 1, lastSummerWork);
                }

            }
        }

        $scope.showWinterAd=function () {
            $rootScope.showWinterWorkFlag=true;
        };
        $scope.showWinterBroadcast=function(){
            console.log('page2');
            $rootScope.showWinterBroadcast = true;
            $rootScope.winterBroadcastLoading = true;
            profileService.fetchWinterBroadcastData().then((res)=>{
                $rootScope.winterBroadcastLoading = false;

                if(!res){
                    $rootScope.winterBroadcastData = "error";
                }else {
                    $rootScope.winterBroadcastData = res.list;
                }

            },()=>{
                $rootScope.winterBroadcastLoading = false;
                $rootScope.winterBroadcastData = "error";
            })
        };
        $scope.clickActivePage=function(){
            let index = $ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').currentIndex();
            let slidesCount = $ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').slidesCount();

           /* if(index%slidesCount===0){
                $rootScope.isShowHolidayHomeworkAdFlag = true;
            }else if(index%slidesCount===1){
                $rootScope.showRewardAdFlag = true;
            }else if(index%slidesCount===2){
                $scope.showWinterBroadcast();
            }*/
            $scope.showWinterBroadcast();
        };


        /**
         * 加载更多
         */
        $scope.loadMore = function () {
            if (!$rootScope.selectedWorkClazz||!$rootScope.selectedWorkClazz.id) {
                $scope.moreFlag = false;
                $scope.tip = $scope.pubWorkStudent.name + "还没有成功加入一个班级";
                $scope.retFlag = true;
                return;
            }
            workStatisticsServices.queryWork(5).then(function (data) {
                if (data) {
                    angular.forEach(data, function (work) {
                        $scope.wData.workList.push(work);
                    });
                    getLastedSummerWork();
                    if (data.length < $scope.limitQuery.quantity) {
                        $scope.moreFlag = false;
                    } else {
                        $scope.moreFlag = true;
                    }
                } else {
                    $scope.moreFlag = false;
                }
                $scope.retFlag = true;
                $scope.loadingFlag = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (data) {
                $scope.retFlag = true;
            });
        };


        /**
         * 折叠或打开查询条件
         */
        $scope.showQuery = function () {
            $scope.showQueryFlag = !$scope.showQueryFlag;
            if ($scope.showQueryFlag) {
                $scope.$watch('wData.queryParams.startTime', function (newValue) {//如果说日期变动
                    if ($scope.wData.queryParams.startTime != newValue) {
                        workStatisticsServices.queryWork(0);
                    }
                });
                $scope.$watch('wData.queryParams.endTime', function (newValue) {//如果说日期变动
                    //if(!$scope.wData.queryParam.startTime||$scope.wData.queryParam.startTime==""){
                    //    commonService.alertDialog("请选择发布开始日期！");
                    //    return ;
                    //}
                    //if($scope.wData.queryParam.startTime>$scope.wData.queryParam.endTime){
                    //    commonService.alertDialog("发布开始日期不能大于截止日期！");
                    //    return ;
                    //}
                    if ($scope.wData.queryParams.endTime != newValue) {
                        workStatisticsServices.queryWork(0);
                    }
                });
            }
        };

        /**
         * 清除日期
         * @param flag  处理标志
         */
        $scope.clearDateTime = function (flag) {
            if (flag == 1) {
                $scope.wData.queryParams.startTime = "";
                workStatisticsServices.queryWork(0);
                return;
            }
            if (flag == 2) {
                $scope.wData.queryParams.endTime = "";
                workStatisticsServices.queryWork(0);
                return;
            }
        };

        /**
         * 显示日期选择框
         * @param id 控件id
         */
        $scope.showDateTime = function (id) {
            var dateTime = document.getElementById(id);
            dateTime.focus();
        };

        $scope.isPpecialWork = function(list){
            return list.publishType === finalData.WORK_TYPE.SUMMER_WORK || list.publishType === finalData.WORK_TYPE.WINTER_WORK;
        };
        $scope.isWinterHolidayHomework = function (list) {
            return list.publishType === finalData.WORK_TYPE.WINTER_WORK;
        };
        /**
         * 查询作业
         * @param type 0所有作业|1今天作业|2昨天作业|3近一周作业|4近一月作业|5查询过滤作业
         */
        $scope.queryWorkList = function (type) {
            workStatisticsServices.queryWork(type);
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

        $ionicModal.fromTemplateUrl('student-select.html', { //初始化modal页
            scope: $scope
        }).then(function (modal) {
            $scope.studentSelectModal = modal;
            $rootScope.modal.push(modal);
        });

        /**
         * 选择学生
         * @param student 学生
         */
        $scope.selectStudent = function (student, clazz) {
            $scope.studentSelectModal.hide();
            $scope.loadingFlag = true;
            $scope.wData.queryParams.sId = student.studentId; //学生id
            $scope.wData.queryParams.sName = student.studentName; //学生名称
            $scope.pubWorkStudent.id = student.studentId;
            $scope.pubWorkStudent.name = student.studentName;
            $scope.pubWorkStudent.showName = student.studentName + '（' + clazz.name + '）';
            $scope.pubWorkStudent.stuClazzStatus = student.stuClazzStatus || null;
            $scope.retFlag = false;
            $scope.limitQuery.lastKey = "";
            $scope.wData.workList.length = 0;
            $rootScope.selectedWorkClazz = clazz;
            $scope.loadMore();

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

        $scope.answer = function () {
            $ionicPopup.alert({
                title: '常见问题',
                template: `<p style="color: #377AE6">问：如何对孩子进行评价或者发奖？</p>
                <p>答：点击作业列表右侧图标。</p>
                <p style="color: #377AE6">问：家长端能够做作业吗？</p>
                <p>答：不能。需要退出登录，进入学生端才能做作业。</p>
                <p style="color: #377AE6">问：怎样查看参考答案和解答步骤？</p>
                <p> 学生首次提交作业后，家长可以进家长端，点击题目旁边的“钥匙”图标，查看参考答案和主观题的解答步骤。
                【注意】学生首次提交作业前，家长不能查看参考答案。</p>`,
                okText: '确定'
            });
        };


        /**
         * 显示暑假作业广告
         */
        $scope.showSWorkPage = function () {
            $scope.showSummerWorkFlag = true;//显示错误原因大图标志
            $scope.workMsgRetFlag = false;
            workStatisticsServices.getFinishVacationMessages($scope.pubWorkStudent.id).then(function (data) {
                $scope.workMsgRetFlag = true;
            });
        };
        /**
         * 隐藏暑假作业广告
         */
        $scope.hideSummerWorkImg = function () {
            $scope.showSummerWorkFlag = false;//显示错误原因大图标志
        };

        $scope.showRankMsg = function () {
            commonService.showAlert('温馨提示', '领先人数是按每个学生的整个暑假作业进度以及正确率来计算的。');
        };

        $scope.showSummerAlert = function () {
            commonService.showAlert('温馨提示', '升级中，暂不开放');
        };

        $scope.openHolidayWorkList = function () {
            $state.go("holiday_work_list");
        };


        /*注冊返回*/
        $rootScope.viewGoBack=function () {
            if($rootScope.showWinterBroadcast==true){
                $rootScope.showWinterBroadcast=false;
            }else if($rootScope.showRewardAdFlag==true){
                $rootScope.showRewardAdFlag=false;
            }else if($rootScope.showWinterWorkFlag==true){
                $rootScope.showWinterWorkFlag=false;
            }else if($rootScope.isShowHolidayHomeworkAdFlag==true){
                $rootScope.isShowHolidayHomeworkAdFlag=false;
            }else if($rootScope.showCompetitionAdAlertBoxFlag==true){
                $rootScope.showCompetitionAdAlertBoxFlag=false;
            }else{
                return "exit";
            }
            $rootScope.$digest();
        }.bind(this)
    });
