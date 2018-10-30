/**
 * Created by ww on 2017/5/10.
 * 游戏排行榜
 */
import './compute_fighter_rank.less';
import directives from './../index';
directives.directive('computeFighterRank',[function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./compute_fighter_rank.html'),
        controller: [
            '$scope',
            '$rootScope',
            '$ngRedux',
            function ($scope, $rootScope, $ngRedux) {
                let unsubscribe= $ngRedux.connect((state) => {
                    return {
                        fighterRankData: state.clazz_with_fighter_rank_data[state.rc_selected_clazz.id],
                        currentClazz:state.rc_selected_clazz,
                        isFighterLoading:state.fetch_fighter_rank_data_processing,
                        user:state.profile_user_auth.user

                }
                })($scope);

                $scope.$on('$destroy',()=>{
                    unsubscribe();
                });

                /**
                 * 点击排行榜外的灰色区域关闭排行榜
                 * @param event
                 */
                $scope.closeComputeFighterRankData=(event)=>{
                    if($(event.target).hasClass('work-backdrop'))
                        $rootScope.isShowComputeFighterRank = false;
                }

            }
        ],
        link: function ($scope, $element, $attrs) {

        }
    };
}]);
