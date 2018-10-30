/**
 * Created by ww on 2017/6/26.
 */
export default function () {
    return {
        restrict: 'A',
        link: ($scope, $element, $attrs) => {
            if($scope.$last == true){
                //向父控制器传递事件
                $scope.$emit('level-repeat-finish');
                $scope.$emit('game-goods-repeat-finish');
                console.log('repeat finish............')
            }
        }
    };
}
