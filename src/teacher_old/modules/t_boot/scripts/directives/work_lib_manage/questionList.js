/**
 * Author 邓小龙 on 2015/8/18.
 * @description 题目列表指令
 */
define(['./../index'], function (directives) {
    directives.directive('questionList', ['commonService', function (commonService) {
        return {
            restrict: 'EA',
            scope: true,
            transclude: true,
            controller: ['$scope', function ($scope) {
            }],
            template: '<div ng-transclude=""> </div>',
            link: function ($scope, element, attrs) {
            }
        }
    }])
        .directive('questionItem', [function () {
            return {
                restrict: 'EA',
                scope: true,
                require: '^questionList',
                transclude: true,
                controller: ['$scope', function ($scope) {
                }],
                template: '  <div class="image-type-question"><div class="question-content" ng-transclude></div></div>',
                link: function ($scope, element, attrs, ctrl) {

                }

            }
        }])
        .directive('questionTitle', ['commonService', function (commonService) {
            return {
                restrict: 'EA',
                scope: true,
                replace: true,
                template: require('./questionListTemp/questionTitle.html'),
                require: '^questionItem',
                link: function ($scope, element, attr, ctrl) {
                    console.log($scope);
                    $scope.checkBox = $scope[attr.checkBox];
                    $scope.name = $scope[attr.name];
                    $scope.title = $scope[attr.title];
                    $scope.showScore = $scope[attr.showScore];
                    $scope.showCorrectScore = $scope[attr.showCorrectScore];
                    $scope.hideIcon = attr.hideIcon;
                }
            };
        }])
        .directive('questionContent', ['commonService', function (commonService) {
            return {
                restrict: 'EA',
                scope: true,
                replace: true,
                template: require('./questionListTemp/questionContent.html'),
                require: '^questionItem',
                link: function ($scope, element, attr, ctrl) {
                    $scope.showFlag = $scope[attr.showFlag];
                }
            };
        }])
        .directive('questionToolbar', ['commonService', function (commonService) {
            return {
                restrict: 'EA',
                scope: true,
                transclude: true,
                template: '<div class="sub-toolbar" ng-transclude></div>',
                require: '^questionItem',
                link: function ($scope, element, attr, ctrl) {
                }
            };
        }])
        .directive('questionToolItem', ['commonService', function (commonService) {
            return {
                restrict: 'EA',
                scope: true,
                replace: true,
                template: require('./questionListTemp/questionToolItem.html'),
                require: '^questionItem',
                link: function ($scope, element, attr, ctrl) {
                    $scope.btnClass = attr["btnClass"];
                    $scope.text = attr["text"];
                }
            };
        }]);
});
