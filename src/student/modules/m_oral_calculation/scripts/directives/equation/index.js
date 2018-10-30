/**
 * Created by WL on 2017/9/6.
 */
import './style.less';
import uuid4 from "./../../angular-uuid4";

export default function () {
    return {
        restrict: 'AE',
        scope: {
            quesInfo: '=',
            quesIndex: '@'
        },
        replace: true,
        // require: ['^equation','^oralCalculationList'],
        template: require('./page.html'),
        controller: ['$scope', '$timeout', 'uuid4', '$compile', ($scope, $timeout, uuid4, $compile) => {
            $scope.uuid4 = uuid4;
            $scope.exprType = {
                COMMON: 1,
                MATHJAX: 2,
                BLANK: 3,
                LINE_BREAK: 4
            };

            $scope.checkItem = function (expr) {
                let type = $scope.exprType.COMMON;
                if (expr.indexOf('frac') != -1 || expr.indexOf('div') != -1 || expr.indexOf('times') != -1) {
                    type = $scope.exprType.MATHJAX;
                } else if (expr.indexOf('blank') != -1) {
                    type = $scope.exprType.BLANK;
                } else if (expr === 'br') {
                    type = $scope.exprType.LINE_BREAK;
                }
                return type;
            };
            $scope.getId = function (expr) {
                let id = null;
                expr.replace(/{(.+?)}/mg, (match, $0) => {
                    id = $0;
                });
                return id;
            }
        }],
        link: function ($scope, $elem, $attrs, ctrl) {
            ctrl.quesInfo = $scope.quesInfo;
            $scope.quesRoot = $elem;
            // $scope.quesInfo = JSON.parse($scope.quesInfo);
            $scope.exprList = $scope.quesInfo.expr;
            $scope.quesId = $scope.quesInfo.id;
            $scope.inputId = $scope.quesInfo.inputId;

        }
    };
}