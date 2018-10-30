/**
 * Author 华海川 on 2015/9/22.
 * @description 日期选择
 */
import directives from './../index';
directives.directive('datetimePicker', [function () {
    return {
        restrict: 'E',
        controller: ['$scope', '$element', function ($scope, $element) {
        }],
        templateUrl: './partials/directive/datetime_picker.html',
        link: function ($scope, ele, attr) {
            $(ele.find("#startTime")[0]).datetimepicker({
                lang: 'zh',
                step: 5,
                format: 'Y-m-d h:i'
            });
            $(ele.find("#endTime")[0]).datetimepicker({
                lang: 'zh',
                step: 5,
                format: 'Y-m-d h:i'
            });
        }
    };
}]).directive('datePicker', [function () {
    return {
        restrict: 'E',
        link: function ($scope, ele, attr) {
            $(ele.find("#startTime")[0]).datetimepicker({
                lang: 'zh',
                step: 5,
                format: 'Y-m-d',
                closeOnDateSelect: true,
                timepicker: false
            });
            ele.find("#startTime").bind('blur', function () {
                $('.xdsoft_datetimepicker').css('display', 'none');
            });
            $(ele.find("#endTime")[0]).datetimepicker({
                lang: 'zh',
                step: 5,
                format: 'Y-m-d',
                closeOnDateSelect: true,
                timepicker: false
            });
            ele.find("#endTime").bind('blur', function () {
                $('.xdsoft_datetimepicker').css('display', 'none');
            });
        }
    }
}]);