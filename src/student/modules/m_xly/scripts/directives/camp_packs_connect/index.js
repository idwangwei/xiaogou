/**
 * Created by ZL on 2017/7/12.
 */

import controller from './controller'

export default function () {
    return {
        restrict: 'A',
        scope:{
            backUrl:'@',
            isIncreaseScore:'='
        },
        controller: controller,
        controllerAs: 'ctrl',
        link: ($scope, $element, $attrs, ctrl) => {
            ctrl.backUrl = $scope.backUrl;
            $element[0].onclick = ()=> {
                console.log('click事件触发');
                ctrl.goToXlyPage();
            };
        }
    };
}
