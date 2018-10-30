/**
 * Created by WL on 2017/6/22.
 */
import './style.less';
export default function () {
    return {
        restrict: 'E',
        scope: {
            goodsListInfo: '@',
            confirmGoods: '&',
        },
        replace: true,
        template: require('./page.html'),
        controller: 'goodsSelectCtrl as ctrl',
        link: function ($scope, $element, $attrs) {

        }
    };
}
