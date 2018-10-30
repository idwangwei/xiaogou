/**
 * Created by WangLu on 2017/3/20.
 */
import './style.less';
import btn from '../../../images/ad-competition.png';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', 'commonService', function ($scope, $rootScope, $state, commonService) {
            /* $rootScope.competition.area ="郫都区王帅帅小学@2016~2017学年度下学期@分数学习能力竞赛@初赛";*/
            $scope.studentTip = $rootScope.competitionSchoolTitle + $rootScope.competitionPaperTitle + "正在进行中， 快去比赛吧！";
            $scope.parentTip = $rootScope.competitionSchoolTitle + $rootScope.competitionPaperTitle + "。<br/>详情请登录学生端查看！";
            $scope.btn = btn;
            $scope.isCompeting = false; //是否是比赛中
            if($rootScope.competition && $rootScope.competition.progressInfo){
                $scope.isCompeting = $rootScope.competition.progressInfo.alert;
            }

            $scope.hideCompetitionAd = function () {
                $rootScope.showCompetitionAdAlertBoxFlag = false;
            };

            $scope.goToWorkList = function () {
                $state.go("home.work_list");
            };

            if ($rootScope.showCompetitionAdAlertBoxFlag && $rootScope.currentSystem == 'parent' && $rootScope.hasCompetition) {
                $rootScope.showCompetitionAdAlertBoxFlag = false;
                commonService.showAlert('温馨提示', `<div>${$scope.parentTip}</div>`, '知道了');
            }
        }
        ],
        link: function ($scope, $element, $attrs) {

        }
    };
}
