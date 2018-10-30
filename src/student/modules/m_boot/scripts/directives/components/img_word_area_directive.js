/**
 * Created by ���� on 2015/10/16.
 */
define(['./../index'],function(directives){
    directives.directive('imgWordArea',function(){
        return {
            restrict:'C',
            scope:true,
            link:function($scope,ele,attr){
                angular.element(ele).removeAttr('contenteditable');
            }
        };
    });
});