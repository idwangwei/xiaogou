/**
 * Author 邓小龙 on 2015/10/8.
 * @description 输入框指令
 */
import  directives from './../index';
import  $ from 'jquery';
directives.directive('inputArea', ['$compile', 'INPUTBOX_TYPES','$timeout', function ($compile, INPUTBOX_TYPES,$timeout) {
    return {
        restrict: 'C',
        scope: true,
        link: function ($scope, $element, $attrs) {
            $timeout(function () {
                $element.css("text-align", "center")
                    .css('background', '#FAFAD2')
                    .css('display', 'inline-block !important')
                    .css('margin', '2px')
                    .css('vertical-align', 'middle')
                    .css('overflow', 'hidden')
                    .css('border', '1px solid #959191');
                $element.attr('readonly', '');

                if(!$element.hasClass(INPUTBOX_TYPES.CIRCLE_SELECT_INPUT_ARAE)&& !$element.hasClass(INPUTBOX_TYPES.CIRCLE_INPUT_ARAE)){   //圆形输入框用自己的border-radius其他输入框border-radius为5px
                    $element.css('border-radius','5px');
                }
                //脱式计算或解方程输入框文本居左
                if ($element.hasClass(INPUTBOX_TYPES.PULL_INPUT_AREA) ||$element.hasClass(INPUTBOX_TYPES.VARIABLE_SOLVE_INPUT_AREA)) {
                    $element.css('text-align', 'left').css('line-height', '24px');
                }

                //解决分数和脱式在批改页面以及参考答案地方显示补全
                var findFlag=$element.children('unit[frac]').length||$element.hasClass('pull-input-area')||$element.hasClass('variable-solve-input-area');
                if(findFlag){
                    $element[0].style.minHeight=$element[0].style.height;
                    $element[0].style.minWidth=$element[0].style.width;
                    $element[0].style.paddingBottom='10px';
                    $element[0].style.height='auto';
                    $element[0].style.width='auto';
                }else{
                    var width=$element.width();
                    var height=$element.height();
                    if(width>320){
                        width=320;
                        $element.css('max-width',width+'px');
                    }else if (width<30)
                        width=30;
                    height=height>30?height:30;
                    $element.css('width','');
                    $element.css('height','');
                    $element.css('min-width',width+'px');
                    $element.css('min-height',height+'px');
                }
            });

        }
    };
}]);
