/**
 * Created by ww on 2017/5/10.
 * 游戏排行榜
 */
import './game_star_rank.less';
import directives from './../index';
directives.directive('gameStarRank', [function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./game_star_rank.html'),
        controller: ['$scope', '$rootScope', '$ngRedux',
            ($scope, $rootScope, $ngRedux)=> {
                /* let unsubscribe = $ngRedux.connect((state) => {
                 return {
                 gameStarRankData: state.clazz_with_game_star_rank_data[state.gl_selected_clazz.id],
                 selectedClazz: state.gl_selected_clazz,
                 isGameStarLoading: state.fetch_game_star_rank_data_processing,
                 user: state.profile_user_auth.user
                 }
                 })($scope);

                 $scope.$on('$destroy', ()=> {
                 unsubscribe();
                 });*/
                $scope.getPageData=()=>{
                    $scope.gameStarRankData = $ngRedux.getState().clazz_with_game_star_rank_data[$ngRedux.getState().gl_selected_clazz.id];
                    $scope.selectedClazz = $ngRedux.getState().gl_selected_clazz;
                    $scope.isGameStarLoading = $ngRedux.getState().fetch_game_star_rank_data_processing;
                    $scope.user = $ngRedux.getState().profile_user_auth.user;
                };
                $scope.getPageData();

                /**
                 * 点击排行榜外的灰色区域关闭排行榜
                 * @param event
                 */
                $scope.closeGameStarRankData = (event)=> {
                    if ($(event.target).hasClass('work-backdrop'))
                        $rootScope.isShowGameStarRank = false;
                };


            }
        ],
        link: function ($scope, $element, $attrs) {

        }
    };
}]);
