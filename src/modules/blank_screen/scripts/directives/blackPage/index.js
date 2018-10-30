/**
 * Created by ZL on 2017/10/19.
 */
import './style.less';
import logoImg from './../../../images/blank_screen_img.png'
export default function () {
    return {
        restrict: 'E',
        scope: {
            theme: '@',
            mapId: '@',
        },
        replace: true,
        template: require('./page.html'),
        link: function ($scope, $element, $attrs) {
            $scope.logoImg = logoImg;
        }
    };
}