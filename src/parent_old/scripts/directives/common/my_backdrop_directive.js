/**
 * Author 邓小龙 on 2015/12/15.
 * @description 遮罩情况辅助老师显示重点部分
 */

import  directives from './../index';
import  $ from 'jquery';
directives.directive('myBackdrop',['$timeout',function($timeout){
    return {
        restrict:'EAC',
        scope:true,
        link:function($scope,$element,$attrs){
            $timeout(function(){
                var ionContent=$("#"+$attrs["contentid"]);//内容区域
                $($element).css("left",0).css("top",ionContent.offset().top);
                $($element).height(ionContent.height());
            },500);
        }
    };
}]);