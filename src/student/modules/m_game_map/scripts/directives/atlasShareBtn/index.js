/**
 * Created by WL on 2017/6/28.
 */
import './style.less';
export default function () {
    return {
        restrict: 'E',
        scope: {
            theme: '@',
            mapId: '@',
        },
        replace: true,
        template: require('./page.html'),
        controller: 'atlasShareBtnCtrl as ctrl',
        link: function ($scope, $element, $attrs,ctrl) {
            $scope.$parent.$on('atlasShareBtnBack',ctrl.back.bind(ctrl));
            // '$ionicView.beforeEnter'
            // $scope.$emit('$ionicView.beforeEnter', {});
        }
    };
}
