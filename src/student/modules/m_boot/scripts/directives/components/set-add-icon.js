/**
 * Created by 华海川 on 2016/1/31.
 * 集合型题 点击+号
 */
define(['./../index'], function (directives) {
    directives.directive('setAddIcon', ['$compile',function ($compile) {
        return {
            restrict: 'C',
            scope: true,
            link: function ($scope, $element, $attrs) {
                $element.click(function(){
                    if($element.attr('disabled')){return}; //如果不是做题时点击就return
                    var uuid=$element.attr('value');
                    if($element.parents().hasClass('modal')){
                     $('.modal-content [id='+uuid+']').show();
                    }else{
                        $('#'+uuid).show();
                    }
                    $element.parents('.set-icon').hide();
                });
            }

        };
    }]);
});