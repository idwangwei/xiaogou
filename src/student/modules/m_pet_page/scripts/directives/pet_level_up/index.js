/**
 * Created by ww 2017/8/9.
 */

import temp from './index.html';
import './index.less';

export default ()=> {
    return {
        restrict: 'E',
        template: temp,
        scope:{
            showAnimation:'='
        },
        link: function ($scope, element, attrs, ctrl) {
            element.children().on("animationend",()=>{
                $scope.$apply(()=>{
                    $scope.showAnimation = false;
                })
            });
            element.children().on("webkitAnimationEnd",()=>{
                $scope.$apply(()=>{
                    $scope.showAnimation = false;
                })
            });

        }
    }
}
