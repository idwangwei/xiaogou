/**
 * Created by pjl on 2017/3/18.
 * 竞赛广告
 */
import './competition_add.less';
import btnSee from '../../../images/ad-see.png';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        //template:'<div class="abc" ng-if="$root.showCompetitionAdFlag">算对了发生的分离式的福利哈搜的和{{test}}  {{$id}}</div>',
        template: require('./competition_add.html'),
        controller: ['$scope', '$rootScope', '$state', '$ionicHistory', 'commonService', function ($scope, $rootScope, $state, $ionicHistory, commonService) {
            $rootScope.showCompetitionAdFlag = false;
            $rootScope.isShowSeeBtnFlag = true;
            $scope.btnSee = btnSee;
            $scope.competitionType = "初赛";
            $scope.limitTime = "30";
            $scope.competition_details = [];
            $scope.currentDate = "";

            $scope.student = {
                prepare: ['1.请至少在赛前3天安装智算365APP，并加入正确的网络班级，如加错班级，' +
                '可操作：登录家长端>点孩子>点班级详情>删除错误班级>重新添加正确班级。',
                    '2.请保持良好的网络环境！'
                ],
                introduce: ["1.在规定竞赛时间之前登陆智算365，到达考试时间，竞赛试题开启，进入试题后，限时" + $scope.limitTime + "分钟，" +
                "时限到没提交的，系统将自动回收试卷。",
                    "2.答题完毕，点击“提交”试卷，将此次成绩和用时视为最终成绩和用时，不能改错。",
                    "3.比赛结束后，系统记录正确率及时间，全区按照成绩进行排名，首先按照正确率排名，正确率相同则按照时间长短排名。",
                    "4.全区比赛结束后，每位参赛学生都能收到相应的《比赛报告》，结果将在赛后公布。"],
            };

            $scope.teacher = {
                prepare: ['1.请至少在赛前3天安装智算365APP，老师注册创建网络班级，邀请学生安装智算365，注册并加入网络班级。',
                    '2.请保持良好的网络环境！'],
                introduce: ["1.在规定竞赛时间之前登陆智算365，到达考试时间，竞赛试题开启，在规定时间内进入试题均可参加比赛。",
                    " 2.进入试题后，限时" + $scope.limitTime + "分钟，" + $scope.limitTime + "分钟后没提交的系统将自动回收试题。",
                    "3.全区比赛结束后，结果将在赛后公布。"],
            };


            $scope.hideCompetitionAd = function () {
                $rootScope.showCompetitionAdFlag = false;
            };

            $scope.goToWorkList = function () {
                $state.go("home.work_list");
            };

            $scope.initTimeArr = function () {
                $scope.initData();
                if ($rootScope.competition && $rootScope.competition.progressInfo && $rootScope.competition.progressInfo.competitionTime) {
                    var infoArr = $rootScope.competition.progressInfo.competitionTime;
                    angular.forEach(infoArr, function (info) {
                        $scope.currentDate = "";
                        var infoObj = {};
                        infoObj.grade = commonService.convertToChinese(info.grade) + "年级";
                        infoObj.startTime = $scope.getTime(info.startTime, 1);
                        infoObj.endTime = $scope.getTime(info.endTime, 2);
                        infoObj.limitTime = info.limitTime;
                        $scope.competition_details.push(infoObj);
                        $scope.limitTime = infoObj.limitTime;
                    })
                }
            };

            $scope.getTime = function (time, type) {
                var rtnDate = "";
                var timeArr = time.split(" ");
                if (type == 1) {
                    $scope.currentDate = timeArr[0]; //日期
                }
                if (type == 1 || (type == 2 && $scope.currentDate != timeArr[0])) {
                    var dateArr = timeArr[0].split("-");
                    rtnDate = Number(dateArr[1]) + "月" + dateArr[2] + "日 ";
                }
                var timeStr = timeArr[1];
                if (timeStr.match(/:/g).length == 2) {
                    timeStr = timeArr[1].substring(0, timeArr[1].lastIndexOf(':'));
                }
                rtnDate += timeStr;
                return rtnDate;
            };

            $scope.initData = function () {
                if ($rootScope.competition && $rootScope.competition.area) {
                    var infoArr = $rootScope.competition.area.split("@");
                    $scope.competitionType = infoArr[3];
                }
            };

            $scope.initTimeArr();

        }
        ],
        link: function ($scope, $element, $attrs) {

        }
    };
}
