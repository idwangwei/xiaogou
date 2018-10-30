/**
 * Created by liangqinli on 2017/3/20.
 */
import './style.less';
import scTeacher from '../../../images/sc-teacher.png';

function teaCompWork($root, $interval, workListService, $state, commonService) {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        template: require('./page.html'),
        controller: ["$scope", function ($scope) {
            /**
             * 引用image
             */
            $scope.scTeacher = scTeacher;
            $scope.competitionType = '初赛';

            if($root.competition && $root.competition.area){
                var infoArr = $root.competition.area.split("@");
                $scope.competitionType = infoArr[3];
            }
            /**
             * 控制器逻辑
             */
            $scope.goDetail = () => {
                if ($root.competition.paper.status.progress == 1) {
                    commonService.alertDialog('竞赛还未开始，下拉获取最新比赛状态', 2000);
                }
                if ($root.competition.paper.status.progress >= 2 && $root.competition.paper.status.progress <= 3) {
                    var paper = $root.competition.paper;
                    workListService.selectPublishWork(paper);
                    $state.go("work_student_list", {paperInstanceId: paper.instanceId});
                }
            }
            $scope.convertToChinese = commonService.convertToChinese;


        }],
        link: function ($scope, $element, $attrs) {
        }
    };
}
teaCompWork.$inject = ['$rootScope', '$interval', 'workListService', '$state', 'commonService'];
export default teaCompWork;