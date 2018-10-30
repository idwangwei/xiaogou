/**
 * Created by WL on 2017/9/18.
 */
import img from './../../../oral_calculation_images/oral_calculation_loading/fetch_data.gif';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace:false,
        template: require('./page.html'),
        link: function ($scope, $elem, $attrs, ctrl) {
            $scope.loadingImg = img;
        }
    };
}