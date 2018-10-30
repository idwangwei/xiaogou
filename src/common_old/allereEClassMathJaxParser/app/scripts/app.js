//require('mathJax');
//require('mathJaxCfg');
import $ from 'jquery';
import 'commonConstants';
const mathJaxParser = angular.module('mathJaxParser', ['commonConstants']);
/**
 * 将html串中的MathJax串替换成MathJax指令
 * MathJax表达式默认以 ‘{#’开始‘#}’结束
 *
 */

mathJaxParser.filter('filterExpressionContainer', ['$log','commonConstants', function ($log,commonConstants) {
    return function (html, startIdentity, endIdentity) {
        if (!html) {
            $log.debug('html is undefined!');
            return;
        }
        if (!startIdentity)startIdentity = '`';
        if (!endIdentity)endIdentity = '`';
        var replaceRegex = new RegExp(startIdentity + '(.*?)' + endIdentity, 'mg');

        var $wrapper = $('<div></div>').append(html);
        $wrapper.find('layout-box').replaceWith(function () {
            return '<div class="layout-box">' + arguments[1] + '</div>';
        });
        var aa=$wrapper.html().replace(replaceRegex, function ($1, $2) {
            return '<span lazy-compile="true"  class="'+commonConstants.CLASS_NAME_MATHJAX_EXPRESSION_IN_Q_BODY+'" mathjax-parser value=' + $2 + '>{{value}}</span>';
        });

        return aa;
    }
}]);
mathJaxParser.directive('compileMathjaxHtml', ['$compile', '$filter', function ($compile, $filter) {
    return {
        restrict: "A",
        scope: false,
        link: function ($scope, ele, $attrs) {
            $scope.$watch($attrs.compileMathjaxHtml, function (val) {
                ele.empty();
                var filteredHtml = $filter('filterExpressionContainer')(val);

                //图库中图片上的输入框为<img>标签,在教师，学生和家长端需要显示为<span>标签
                var $wrapper = $('<div></div>');
                $wrapper.append(filteredHtml);
                $wrapper.find('.input-area').each(function () {
                    if (!$(this).is('img'))return;
                    var $me = $(this);
                    var id = $me.attr('id'),
                        label = $me.attr('label'),
                        style = $me.attr('style'),
                        clazz = $me.attr('class');
                    var $span = $('<span></span>')
                        .attr('id', id)
                        .attr('label', label)
                        .attr('style', style)
                        .attr('class', clazz);
                    $me.replaceWith($span);
                });

                ele.append($compile($wrapper.html())($scope));
            });

        }
    }
}]);
mathJaxParser.directive('mathjaxParser', ['$timeout','$state', function ($timeout,$state) {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        controller: ["$scope", "$element", "$attrs", "EXPRESSION_SET","commonConstants", function ($scope, $element, $attrs, EXPRESSION_SET,commonConstants) {
            $scope.EXPRESSION_SET = EXPRESSION_SET;
            var STATE_FOR_EDIT = 'do_question';
            var watchFn = $scope.$watch('value', function () {
                $element.html("");
                var flag = false;
                var value = $scope.value;
                if (value.match(/[a-zA-Z]+/)) {
                    flag = true;
                } else {
                    for (var key in $scope.EXPRESSION_SET) {
                        if (value.match(new RegExp($scope.EXPRESSION_SET[key], 'mg'))) {      //检测表达式是否需要mathjax
                            flag = true;
                            if (key == "UNIT") {
                                value = isUnit(value);     //处理单位类型\\unit{(.+)?}{(.+)?}{(.+?)}
                            }
                            break;
                        }
                    }
                }

                if (flag) {
                    var $script = angular.element("<script type='math/tex'>")
                        .html(value == undefined ? "" : value);
                    $element.append($script);
                } else {
                    $element.html(value == undefined ? "" : value);
                }

                //如果没有启用延迟编辑选项，则马上进行编译
                if ((($state.current.name == STATE_FOR_EDIT && $element.parent().attr('lazy-compile') != 'true') || $state.current.name != STATE_FOR_EDIT) && ($attrs.lazyCompile == "false" || !$attrs.lazyCompile))  {
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                }else {
                    if($element.hasClass(commonConstants.CLASS_NAME_MATHJAX_EXPRESSION_IN_Q_BODY)){
                        $scope.$emit(commonConstants.RENDER_EVENT_FOR_MATHJAX_EXPRESSION_IN_Q_BODY);
                        return
                    }
                    if($state.current.name == STATE_FOR_EDIT&&$element.parents('[fraccount]').length){//说明该输入框有分数
                        var fracCountStr=$element.parents('[fraccount]').first().attr("fraccount");
                        if($element.attr('value').indexOf("\\frac")===-1){//说明当前元素不是分数
                            if(fracCountStr==='0'){//如果分数count为0了，那么就开始判断当前是不是最后一个mathJax元素。不为0就不用
                                //关心它的渲染了，因为之后肯定会有分数判断。
                                renderMathJaxOne($element);
                            }
                            return;
                        }
                        if(fracCountStr==='0'){//表示当前父级框已经渲染过了的情况，此时该分数还需要再渲染，比如点击了分数，出现了
                            //分数上下框，再点击别处，然后触发他的渲染。
                            MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                            return;
                        }

                        var faccInt=parseInt(fracCountStr)-1;

                        if((faccInt+"")==="0"){//这里表示拿到做题内容，一个个渲染，此时已渲染到最后一个分数了
                            renderMathJaxOne($element);
                        }
                        $element.parents('[fraccount]').first().attr("fraccount",faccInt);
                        return;
                    }
                    $scope.$emit('apptextarea.subdirective.render');

                }

                //if (!$(document).find($element).length) {
                //    $scope.$destroy();
                //}
            });

            $scope.$on('$destroy', function () {
                watchFn();
                watchFn = null;
            });

            /**
             * 所有mathJax一次性渲染
             */
            function renderMathJaxOne($element) {
                //说明后面没有mathJax的了，就渲染整个框子,或者后面有mathJax元素，但是他是已渲染了的
                var nextAllMathJaxEles,nextAllScripts;
                if($element.is('unit')){
                    nextAllMathJaxEles=$element.nextAll().filter("[mathjax-parser]");
                    nextAllScripts=$element.nextAll().find("script");
                }else{//特殊如<span mathjax-parser="" value="(m^3)" lazy-compile="true"><script type="math/tex">(m^3)</script></span>
                    nextAllMathJaxEles=$element.parent().nextAll().filter("[mathjax-parser]");
                    nextAllScripts=$element.parent().nextAll().find("script");
                }
                if (!nextAllMathJaxEles.length||(nextAllMathJaxEles.length&&nextAllScripts.length===nextAllMathJaxEles.length))
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element.parents('[fraccount]').first()[0]]);
            }

            //处理单位类型函数
            function isUnit(value) {
                return value.replace(/\\unit{(.+)?}{(.+)?}{(.+?)}/, function (match, $1, $2, $3) {
                    if (!match.length) {
                        $log.error('单位的格式不正确！');
                    }
                    var option = $3.split('');
                    if (option.length != 2 || ['0', '1'].indexOf(option[0]) == -1 || ['0', '1'].indexOf(option[1]) == -1) {
                        $log.error('单位的格式不正确！第三个花括号中只可能是00|01|10|11');
                    }
                    if (option[0] == 0 && option[1] == 0) { //显示中文加括号
                        return '(' + $2 + ')';
                    }
                    if (option[0] == 0 && option[1] == 1) { //显示中文不加括号
                        return $2;
                    }
                    if (option[0] == 1 && option[1] == 0) { //显示英文加括号
                        return '(' + $1 + ')';
                    }
                    if (option[0] == 1 && option[1] == 1) { //显示英文不加括号
                        return $1;
                    }
                });
            }
        }]
    };
}]);
mathJaxParser.run(function () {
    MathJax.Hub.Config({
        skipStartupTypeset: true,
        messageStyle: "none",
        "HTML-CSS": {
            showMathMenu: false
        }, tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]}
    });
    MathJax.Hub.Configured();
});
mathJaxParser.controller('testCtrl', function ($scope) {
    $scope.html = '<div>while{#1x+2y=5#},{#x=1#}and{#y=2#}</div>';
});
module.exports = mathJaxParser;
