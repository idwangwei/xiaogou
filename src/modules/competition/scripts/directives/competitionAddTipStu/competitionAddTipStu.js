/**
 * Created by WangLu on 2017/3/20.
 */
import './competition_add_tip_stu.less';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./competition_add_tip_stu.html'),
        controller: ['$scope', '$rootScope', function ($scope,$rootScope) {
            $scope.showCompetitionAd = function () {
                $rootScope.showCompetitionAdFlag = true;
                $rootScope.isShowSeeBtnFlag = false;
            }
        }
        ],
        link: function ($scope, $element, $attrs) {

        }
    };
}
