/**
 * Author 邓小龙 on 2015/8/10.
 * @description 用于给页面标题添加图标
 */
define(['./../index'],function(directives){
    directives.directive('addIcon',function(){
        return {
            restrict:'EAC',
            scope:{
                addIcon:'@'
            },
            link:function($scope,element,attr){ //ionView是compile方式，这里link无效
                if($scope.addIcon){
                    //element[0].addClass($scope.addIcon);
                    //element.css($scope.addIcon);
                    element[0].className=$scope.addIcon;
                }
            }
        };
    });
});