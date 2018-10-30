/**
 * Created by ww on 2017/6/26.
 */
import bgImg from './../../../game_map_images/level_page/level_stu_mark_bg.png';
import './style.less';
export default function () {
    return {
        restrict: 'E',
        scope: {
            levelId: '@',
        },
        replace: true,
        template: `<div class="game_level_stu_float_mark">
            <p>{{userName}}</p>
            <img src="${bgImg}" class="float_mark_bg">
            <img ng-src="{{$root.loadImg('head_images/user_head'+avator+'.png')}}"  class="float_mark_avatar">
        </div>`,

        controller: ['$scope','$timeout', '$ionicScrollDelegate', '$ngRedux', ($scope, $timeout, $ionicScrollDelegate, $ngRedux)=> {
            $scope.scrollToNewPosition = (left, top)=> {
                $ionicScrollDelegate.scrollTo(left, top, false);
            };
            $scope.userName = $ngRedux.getState().profile_user_auth && $ngRedux.getState().profile_user_auth.user.name;
            $scope.$timeout = $timeout;
            let rewardBase = $ngRedux.getState().user_reward_base;
            $scope.avator = rewardBase.avator == 'default' ? 1 : rewardBase.avator;
        }],
        link: ($scope, $element, $attrs) => {
            let positionDiv;
            $scope.setFloatMarkPosition=()=>{
                positionDiv = $('.game_map_level_file #' + $scope.levelId);
                if (positionDiv[0]) {
                    let top = positionDiv[0].offsetTop - 60;
                    if($scope.levelId.match(/\d$/)[0] % 2 == 1 ){
                        $element.css({
                            'top': top + 'px',
                            'left': positionDiv[0].offsetLeft + 4 + 'px'
                        });
                    }else {
                        $element.css({
                            'top': top + 'px',
                            'right': positionDiv[0].offsetLeft + 4 + 'px'
                        });
                    }
                    $scope.scrollToNewPosition(positionDiv[0].offsetLeft, top - 300 < 0 ? 0 : top - 300);
                }
            };
            $scope.setFloatMarkPosition();
            $scope.handleOrientationChange = ()=> {
                $scope.$timeout(()=> {
                    $scope.setFloatMarkPosition();
                }, 100)
            };
            window.addEventListener("orientationchange" , $scope.handleOrientationChange);
            $scope.$on('$destroy', ()=>{
                window.removeEventListener("orientationchange" , $scope.handleOrientationChange);
            });

            $element.click(()=>{
                positionDiv.find('.item_top_layer_box').click();
            });
        }
    };
}
