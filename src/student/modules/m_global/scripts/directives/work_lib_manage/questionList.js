/**
 * Author 邓小龙 on 2015/8/18.
 * @description 题目列表指令
 */
// define(['../index'], function (directives) {
    function questionList(commonService) {
        return {
            restrict: 'EA',
            scope:true,
            transclude: true,
            controller:['$scope', function ($scope) {
            }],
            template:'<div  class="card" ng-transclude=""> </div>',
            link: function ($scope, element, attrs) {
            }
        }
    }
    function questionItem(){
        return {
            restrict:'EA',
            scope:true,
            require:'^questionList',
            transclude: true,
            controller:['$scope', function ($scope) {
            }],
            template:'  <div class="image-type-question"><div class="question-content" ng-transclude></div></div>',
            link: function ($scope, element, attrs,ctrl) {

            }

        }
    }
    function questionTitle(commonService){
        return {
            restrict:'EA',
            scope:true,
            replace: true,
            templateUrl:'../../partials/directive/questionList/questionTitle.html',
            require:'^questionItem',
            link:function($scope,element,attr,ctrl){
                $scope.checkBox=attr["checkBox"];
                $scope.name=attr["name"];
                $scope.title=attr["title"];
                $scope.showScore=attr["showScore"];
            }
        };
    }
    function questionContent(commonService){
        return {
            restrict:'EA',
            scope:false,
            replace: true,
            templateUrl:'../../partials/directive/questionList/questionContent.html',
            require:'^questionItem',
            link:function($scope,element,attr,ctrl){
                $scope.showFlag=attr["showflag"];

            }
        };
    }
    function questionToolbar(commonService){
        return {
            restrict:'EA',
            scope:true,
            transclude: true,
            template:'<div class="sub-toolbar" ng-transclude></div>',
            require:'^questionItem',
            link:function($scope,element,attr,ctrl){
            }
        };
    }
    function questionToolItem(commonService){
        return {
            restrict:'EA',
            scope:true,
            replace:true,
            templateUrl:'../../partials/directive/questionList/questionToolItem.html',
            require:'^questionItem',
            link:function($scope,element,attr,ctrl){
                $scope.btnClass=attr["btnClass"];
                $scope.text=attr["text"];
            }
        };
    }
// });
questionList.$inject=['commonService'];
questionTitle.$inject=['commonService'];
questionContent.$inject=['commonService'];
questionToolbar.$inject=['commonService'];
questionToolItem.$inject=['commonService'];
export {questionList,questionItem,questionTitle,questionContent,questionToolbar,questionToolItem};