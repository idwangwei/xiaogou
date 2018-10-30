/**
 * Created by 华海川 on 2016/1/31.
 * 集合型题 点击减号
 */
define(['./../index'], function (directives) {
    directives.directive('setRemoveIcon', ['$compile','INPUTBOX_TYPES',function ($compile,INPUTBOX_TYPES) {
        return {
            restrict: 'C',
            scope: true,
            link: function ($scope, $element, $attrs) {
                $element.click(function(){
                    if($element.attr('disabled')) return;   //如果不做题的时候点击 return
                    var uuid=$element.attr("value");        //清除appTextarea里的内容并隐藏该得分点
                    resetData(uuid);
                    $element.parents('.set-list-content').prev().find('.set-icon').show();
                });
                function getClassSelector(param){
                    return '.'+param;
                }
                function resetData(uuid){
                    var $setElement = $('#'+uuid);
                    var appTextarea=$setElement.find(getClassSelector(INPUTBOX_TYPES.C_APP_TEXTAREA));
                    appTextarea.each(function(){
                        angular.element($(this)).scope().textContent.expr="";
                        angular.element($(this)).scope().textContent.html="";
                        $(this).html('');
                    });
                    $setElement.hide();
                }
            }

        };
    }]);
});
