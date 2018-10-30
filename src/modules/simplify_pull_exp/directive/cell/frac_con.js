/**
 * Created by ww 2017/8/9.
 */

export default ()=> {
    return {
        restrict: 'E',
        scope: true,
        replace:true,
        transclude:true,
        template:`<div class="simplify-frac-con" ng-transclude>
                    <row-con class="simplify-frac-con-row-top"></row-con>
                    <div class="frac-con-line"></div>
                    <row-con class="simplify-frac-con-row-bottom"></row-con>
                 </div>`,
        link: function ($scope, element, attrs, ctrl) {
            let $ele = $(element);
            
        }
    }
}
