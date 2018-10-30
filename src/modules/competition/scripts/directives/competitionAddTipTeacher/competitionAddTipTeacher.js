/**
 * Created by WangLu on 2017/3/20.
 */
import './competition_add_tip_teacher.less';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./competition_add_tip_teacher.html'),
        controller: ['$scope', '$rootScope', '$ngRedux', function ($scope, $rootScope, $ngRedux) {
            $scope.competitionType = "初赛";
            $scope.publishType = $ngRedux.getState().wl_selected_work.publishType;
            $scope.isCompetitionPaper = $scope.publishType == 8;

            $scope.showCompetitionAd = function () {
                $rootScope.showCompetitionAdFlag = true;
            };

            $scope.initData =function(){
                if($rootScope.competition && $rootScope.competition.area){
                    var infoArr = $rootScope.competition.area.split("@");
                    $scope.competitionType = infoArr[3];
                }
            };
            $scope.initData();
        }
        ],
        link: function ($scope, $element, $attrs) {

        }
    };
}
