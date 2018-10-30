/**
 * Author 邓小龙 on 2015/12/15.
 * @description 遮罩情况辅助老师显示重点部分
 */

import  directives from './../index';
import  $ from 'jquery';
directives.directive('backdropForAssist',function(){
    return {
        restrict:'C',
        scope:true,
        link:function($scope,$element,$attrs){
            var ionContent=$("ion-content");//内容区域
            $($element).css("left",ionContent.offset().left).css("top",ionContent.offset().top);
            $($element).height(ionContent.height());
        }
    };
});