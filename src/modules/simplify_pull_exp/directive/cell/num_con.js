/**
 * Created by ww 2017/8/9.
 */

export default ()=> {
    return {
        restrict: 'E',
        scope: true,
        replace:true,
        transclude:true,
        template:`<div class="simplify-num-con" ng-transclude></div>`,
        link: function ($scope, element, attrs, ctrl) {
            let $ele = $(element);
        }
    }
}
