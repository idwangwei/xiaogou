/**
 * Created by 华海川 on 2015/8/21.
 * @description 作业列表指令
 */

define(['./../index'], function (directives) {
    directives.directive('commonList', [function () {
        return {
            restrict: 'E',
            scope: true,
            controller: function ($scope) {
                var me = this;
                me.getListSource = function(){
                    return $scope.listSource;
                }
            },
            link: function ($scope, element, attrs) {
                if(attrs.listSource){
                    $scope.listSource=$scope[attrs.listSource] || $scope.listSource;
                }
            }
        }
    }]).directive('commonListItem', [function () {
        return{
            restrict: 'E',
            scope: false,
            controller: function ($scope) {
            },
            link: function ($scope, element, attrs) {
            }
        }
    }]).directive('listLeft', ['$parse', function ($parse) {
        return{
            restrict: 'E',
            scope: true,
            template: '<img ng-src="{{imgSrc}}"  ng-click="listLeftFn()" />',
            link: function ($scope, element, attrs) {
                $scope.imgSrc = attrs.imgSrc;
                var func = $parse(attrs.fn);
                $scope.listLeftFn = function (){
                    if(func){
                        func($scope);
                    }
                };
            }
        }
    }]).directive('listCenter', ['$parse',function ($parse) {
        return{
            restrict: 'E',
            scope: true,
            controller: function ($scope) {
            },
            replace: false,
            template: '<div class="center" ng-click="listCenterFn()">'
                + '<div class="first">{{firstMsg}}</div>'
                + '<div class="second" >{{secondMsg}}</div>'
                + '<div class="third" >{{thirdMsg}}</div>'
                + '</div>',
            link: function ($scope, element, attrs) {
                $scope.firstMsg = $scope.list[attrs.firstMsg] ||attrs.firstMsg;
                $scope.secondMsg = $scope.list[attrs.secondMsg] || attrs.secondMsg;
                $scope.thirdMsg = $scope.list[attrs.thirdMsg] || attrs.thirdMsg;
                var func = $parse(attrs.fn);
                $scope.listCenterFn = function (){
                    if(func){
                        func($scope);
                    }
                };
            }
        }
    }]).directive('listRight', ['$parse',function ($parse) {
        return{
            restrict: 'E',
            scope: true,
            require:'^commonList',
            controller: function ($scope) {
            },
            replace: false,
            templateUrl: './partials/directive/commonListRight.html',
            link: function ($scope, element, attrs,ctrl) {
                $scope.showCheckbox = $scope[attrs.showCheckbox];
                $scope.multipleChoice = $scope[attrs.multipleChoice];
                $scope.handleClick = function () {
                    if($scope.multipleChoice){
                        $scope.list.isClicked =!$scope.list.isClicked;
                        return;
                    }
                    if($scope.list.isClicked){
                        $scope.list.isClicked = false;
                        return;
                    }
                    var listSource = ctrl.getListSource();
                    listSource.forEach(function(item){
                        item.isClicked =false;
                    });
                    $scope.list.isClicked = true;
                };

                $scope.showRightItem = $scope[attrs.showRightItem];
                $scope.rightIcon = attrs.rightIcon;
                var func = $parse(attrs.rightFun);
                $scope.rightFun = function (){
                    if(func){
                        func($scope);
                    }
                };
            }
        }
    }]);
});