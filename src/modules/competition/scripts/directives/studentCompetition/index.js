/**
 * Created by liangqinli on 2017/3/18.
 */
import './style.less';
import bkBtn from '../../../images/sc-btn.png';
import scFlag from '../../../images/sc-flag.png';
import scSuccess from '../../../images/sc-success.png';
import scReport from '../../../images/sc-report.png'
import {dhms} from '../untils';

function stuCompWork($root, $interval, $state, $ngRedux, commonService, paperService, $ionicPopup, countDownService) {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        template: require('./page.html'),
        controller: ["$scope",function ($scope) {
            /**
             * 引用image
             */
            $scope.bkBtn = bkBtn;
            $scope.scFlag = scFlag;
            $scope.scSuccess = scSuccess;
            $scope.scReport = scReport;
            /*$scope.paper = $root.competition.paper;*/
            /**
             * 格式化时间
             * @type {dhms}
             */
            /*$scope.competition = $root.competition;*/
            $scope.matchPaper = paperService.matchPaper;

            $scope.dhms = dhms;
            $scope.competitionType = '初赛';

            if($root.competition && $root.competition.area){
                var infoArr = $root.competition.area.split("@");
                $scope.competitionType = infoArr[3];
            }

            $scope.doWork = function () {
                /*比赛进行中*/
                if ($root.competition.paper.status == 1) {
                    commonService.alertDialog('竞赛还未开始', 1500);
                }

                //后端逻辑在progress =3&&racing == 4(竞赛已经结束用户超时还没有提交)就提交不了
                //竞赛区域不能点进做题页面和批改详情页面，放在最前面做特殊处理
                // if ($root.competition.realStatus.progress == 3 && $root.competition.realStatus.racing == 4) {
                //     commonService.alertDialog('你没有提交试卷，不能查看批改详情！', 1500);
                // }
                else if ($root.competition.paper.status >= 2 && $root.competition.paper.status <= 3) {
                    $scope.matchPaper.localVvailableTimeShow = null;
                    $scope.matchPaper.localVvailableTime = null;
                    /*学生比赛还没开始 第一次进入试卷弹出提示框*/
                    if($root.competition.realStatus.racing == 1){
                        $ionicPopup.show({
                            title: '温馨提示',
                            template: `<p style="text-align: center">进入试卷将马上开始计时，</p><p style="text-align: center">一旦开始，不能暂停！</p>`,
                            buttons: [
                                {
                                    text: '开始计时',
                                    onTap: (e) =>{
                                        return true;
                                    }
                                },
                                { text: '取消' }
                            ]
                        }).then((flag)=>{
                            if(flag){
                                $scope.goWork();
                            }
                        })
                    }else{
                        $scope.goWork();
                    }

                    /*比赛结束*/
                    //比赛已经结束，用户还没有获取试卷，点击竞赛区域给出提示
                } else if ($root.competition.paper.status == 5) {
                    commonService.alertDialog('比赛时间已截止，不能再进行比赛。', 1500);
                } else if ($root.competition.paper.status >= 4 && $root.competition.paper.status !== 5) {
                    $ngRedux.dispatch(paperService.selectWork($root.competition.paper));
                    $state.go('competition_work_detail')
                }

            }
            $scope.goWork = function () {
                var params = {
                    paperId: $root.competition.paper.paperId,
                    paperInstanceId: $root.competition.paper.instanceId,
                    redoFlag: "false",
                    urlFrom: "workList"
                }
                $ngRedux.dispatch(paperService.selectWork($root.competition.paper));
                $state.go('select_question', params);
            }
            $scope.goReport = function (ev) {
                ev.stopPropagation();
                $state.go('competition_report');
            }
            $scope.convertToChinese = commonService.convertToChinese;
            $scope.timeEnd = () => {
                if ($root.competition.paper.status == 1) {
                    $scope.$emit('refresh_competition_info');
                }
                /*else if($root.competition.paper.status == 3){
                 $ionicPopup.alert({
                 title: '提示',
                 template: '<p>你还没有提交试卷！</p>',
                 okText: '去提交'
                 }).then( () => $scope.goWork());
                 }*/
            };
            countDownService.registCallback((time) => {
                $scope.$apply(function () {

                    if($root.competition.paper.status === 1){
                        $scope.countDown = dhms(time<0?0:time, "dHms");
                    }else{
                        $scope.countDown = dhms(time<0?0:time, "ms");
                    }

                    if(time<=0){
                        $scope.timeEnd();
                    }
                });
            }, $scope.$id);
            $scope.$on('$destroy',function () {
                countDownService.removeCallback($scope.$id);
            })
        }],
        link: function ($scope, $element, $attrs) {

        }
    };
}
stuCompWork.$inject = ['$rootScope', '$interval', '$state', '$ngRedux', 'commonService', 'paperService', '$ionicPopup', 'countDownService'];
export default stuCompWork;