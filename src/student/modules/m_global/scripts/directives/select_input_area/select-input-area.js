/**
 * Author 邓小龙 on 2015/9/23.
 * @description 做题弹出选择框
 */
export default function () {
    return {
        restrict: 'E',
        scope: {
            date: '=dateInfo'
        },
        controller: ['$scope', '$element', function ($scope, $element) {

        }],
        templateUrl: './datetime_picker.html',
        link: function ($scope, $element, attr) {
            $element.css('background-color', '#FAFAD2');
        }
    };
}
