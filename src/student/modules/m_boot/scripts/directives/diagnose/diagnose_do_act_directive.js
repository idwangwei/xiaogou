/**
 * Author 邓小龙 on 2015/8/10.
 * @description
 */
import  directives from './../index';


directives.directive('diagnoseDoAct', ["$timeout", "$rootScope", function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        scope: true,
        replace:true,
        template:require('../../partials/directive/diagnose_do_act.html'),
        link: function ($scope, element, attr) {

        }
    };
}]);
