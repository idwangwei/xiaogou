/**
 * Created by 邓小龙 on 2015/7/27.
 * @description  用于list列表块元素的背景颜色随机获取不重复。
 */
define(['./../index'],function(directives){
    directives.directive('autoColor',['commonService',function(commonService){
        return {
            restrict:'EAC',
            scope:{
            },
            link:function($scope,element,attrs){
                element.addClass(commonService.getColor());
            }
        }
    }]);
});