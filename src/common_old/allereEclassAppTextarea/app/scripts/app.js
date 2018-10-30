/**
 * Created by angelking on 15-11-4.
 */

import $ from 'jquery';
import _ from 'underscore';
var allereEClassAppTextarea = angular.module('allereEClassAppTextarea', ['uuid', 'keyboard', 'mathJaxParser']);
allereEClassAppTextarea.constant('EXPRESSION_SET', {
    NEQ: '\\\\neq',//不等于,注意：一定要配置要　NEWLINE之前
    MUL: '\\\\times', //乘号
    DIV: "\\\\div",   //除号
    EQU: '\\\\eq',    //等号
    PLUS: '\\\\plus',  //加好
    MINUS: '\\\\minus',//减号
    LBRACE: '\\\\lbrace',//左花括号
    RBRACE: '\\\\rbrace',//右花括号
    FRACTION: "\\\\frac{.*?}{.*?}",//分数
    UNIT: "\\\\unit{.*?}{.*?}{.*?}",//单位
    UNKN: "\\\\var{.+?}",//未知数
    NEWLINE: "\\\\n",//换行
    SPACE: '    ',//空格
    WORD_ANSWER: '\\\\wordAnswer{(.+)}',//答语
    SQUARE: '(.*\\^.*)', //平方，次方,
    GREATER: '\\\\gt',//大于号
    LESS: '\\\\lt',//小于号
    LE: '\\\\le',//小于
    GE: '\\\\ge',//大于
    APPROX: '\\\\approx',//约等于
    PI: '\\\\pi',//π
    REMAIN: '\\\\remain',//余数
    PERCENT:'\\\\%'//百分号
});
allereEClassAppTextarea.constant('UNSUPPORT_EXPRESSION_SET', {
    EQU: {expr: '\\eq', directive: 'equal'},//等号
    PLUS: {expr: '\\plus', directive: 'plus'},//加号
    MINUS: {expr: '\\minus', directive: 'minus'},//减号
    FRACTION: {expr: "\\\\frac{(.*?)}{(.*?)}", directive: 'frac'},//分数
    UNIT: {expr: '\\\\unit{.*?}{.*?}{.*?}', directive: 'unit'},//单位
    UNKN: {expr: '\\\\var{.+?}', directive: 'unkn'},//未知数
    NEWLINE: {expr: '\\\\n', directive: 'newline'}, //换行
    SPACE: {expr: '    ', directive: 'space'},//空格
    REMAIN: {expr: '\\\\remain', directive: 'remain'},//空格
    WORD_ANSWER: {expr: '\\\\wordAnswer{(.+)}', directive: 'word-answer'}//答语
});

allereEClassAppTextarea.constant('INPUT_AREA_TYPE', {
    PULL_INPUT_AREA: 'pull-input-area'
});

allereEClassAppTextarea.directive('appTextarea',
    function ($log, $compile, $window, uuid4, $timeout, $interval, EXPRESSION_SET, UNSUPPORT_EXPRESSION_SET, INPUT_AREA_TYPE) {
        "ngInject";
        return {
            restrict: "EC",
            scope: true,
            controller: function ($scope, $rootScope) {
                "ngInject";
                this.$root = $rootScope;
                $scope.EXPRESSION_SET = EXPRESSION_SET;//表达式列表
                $scope.UNSUPPORT_EXPRESSION_SET = UNSUPPORT_EXPRESSION_SET;//mathjax不能parse的表达式列表
                $scope.INPUT_AREA_TYPE = INPUT_AREA_TYPE; //输入框的类型
                $scope.SPACE_CHARACTOR = "    "; //空格
                $scope.APP_TEXTAREA_CLASS_IDENTITIY = 'appTextarea';
                $scope.CORRECT_PAPER_CONTAINER_ELEMENT_IDENTITY = 'show_type';

                $scope.IS_ALL_IMG_LOADED = false;//这个输入框所在的小题的所有图片是否加载完毕
                $scope.IS_ALL_SUB_DIRECTIVE_LOADED = false;//输入框内所有的指令 如：分数、乘号等mathjax符号有关的指令是否渲染完毕

                $scope.textContent = {
                    html: '', //包含html标签的答案串
                    expr: '' //不包含html标签的答案串
                };
                $scope.innerDirectiveCount = 0;

                $scope.parseExpr2Html = function () {

                    /**
                     *
                     * 注意：在对编辑器中的内容进行处理时，对答案串要做特殊处理。
                     * 例如：给定内容表达式串
                     *
                     *         ‘1234\times\frac{1}{2}=617\answer{一共吃吃了@id=1@[\frac{1234}{2}]个苹果}’
                     *
                     * 需要里面的每个最小的输入单元（如\times \frac{.+?}{.+?}等）替换成html节点
                     *
                     * 但是需要注意的是 \answer{.+?} 括号中的内容应当被当做一个整体看待，不应被替换。
                     *
                     * 所以这里先把 \answer{.+?}括号中的内容提取出来，保存在一个临时变量中，等所有的内容被替换完毕后，
                     *
                     * 再将内容赋值回去。
                     *
                     *
                     *
                     */
                    $scope.tempAnswerExprContent = ''; //答案串中的内容，如果没有答案串，或答案串没有内容，则改变量值为 '';


                    var exprCl = $scope.textContent.expr;
                    if (!exprCl)return;
                    //替换答案串中的内容
                    exprCl = exprCl.replace(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg'), function (match, $1) {
                        $scope.tempAnswerExprContent = $1;
                        return '\\wordAnswer{   }';
                    });
                    //先替换Mathjax能够识别的符号
                    for (var key in $scope.EXPRESSION_SET) {
                        if (key == 'SQUARE' && exprCl.indexOf('\\unit') != -1) {  //如果是应用题答案单位里有次方的将不做处理 因为单位里已经处理了
                            continue;
                        }
                        exprCl = exprCl.replace(new RegExp($scope.EXPRESSION_SET[key], 'mg'), function ($1) {
                            $scope.innerDirectiveCount++;
                            var rtStr = null;
                            for (var key in $scope.UNSUPPORT_EXPRESSION_SET) {
                                if ($1.match(new RegExp($scope.UNSUPPORT_EXPRESSION_SET[key].expr, 'mg'))) {
                                    rtStr = '<unit ' + $scope.UNSUPPORT_EXPRESSION_SET[key].directive + ' id=' + uuid4.generate() + '  lazy-compile=true value="' + $1 + '">{{value}}</unit>';
                                    break;
                                }
                            }
                            if (!rtStr)rtStr = '<unit mathjax-parser lazy-compile=true id=' + uuid4.generate() + ' value="' + $1 + '">{{value}}</unit>';
                            return rtStr;
                        });
                    }
                    //将剩余的部分的每个字符都用unit标签包裹起来
                    var $wrapper = $('<div></div>').append(exprCl), replaceSet = [];
                    angular.forEach($wrapper[0].childNodes, function (node) {
                        if (node.nodeType != 3)return; //针对文本节点操作
                        var txt = node.textContent, $w = $('<div></div>');
                        angular.forEach(txt.split(''), function (charactor) {
                            $w.append($('<unit></unit>').attr('id', uuid4.generate()).append(charactor));
                        });
                        replaceSet.push({node: node, replace: $w.html()});
                    });
                    angular.forEach(replaceSet, function (replaceItem) {
                        $(replaceItem.node).replaceWith(replaceItem.replace);
                    });

                    //如果有答案，则将之前替换的内容再替换到HTML串中
                    $wrapper.find('[' + $scope.UNSUPPORT_EXPRESSION_SET.WORD_ANSWER.directive + ']').attr('value', '\\wordAnswer{' + $scope.tempAnswerExprContent + '}');

                    $scope.textContent.html = $wrapper.html();
                };

            },
            link: function ($scope, element, $attrs, ctrl) {
                $scope.element = element;
                //=============获取文本串并进行首次编译===========================
                var selfChangeExpr = false;  //
                var keyboardUnits = [];//键盘的单位
                var selectItems = []; //选择型输入框的选项
                var wordAnswer = null;
                $scope.$watch('textContent.expr', function () {
                    if (selfChangeExpr)return;
                    if ($scope.answerInfo) {
                        wordAnswer = $scope.answerInfo.wordAnswer;
                        keyboardUnits = $scope.answerInfo.standardUnitList.concat($scope.answerInfo.nonStandardUnitList);
                    }
                    if ($(element).hasClass('select-input-area')) {
                        _.each($scope.currentQInput, function (spInfo) {
                            _.each(spInfo.spList, function (inputInfo) {
                                if (inputInfo.inputBoxUuid == $attrs.id) {
                                    if (inputInfo.currentQSelectItem) {//有选择项内容
                                        _.each(inputInfo.currentQSelectItem, function (item) {
                                            selectItems.push(item.expr);
                                        });
                                    }
                                }
                            });
                        });
                    }
                    $scope.parseExpr2Html();
                    var $ele = $($scope.textContent.html);
                    element.empty().append($ele);
                    //$timeout(function () {  //这里有个坑，必须加setTimeout,否则涉及Mathjax的内容无法显示
                    if ($(element).parents('[word-answer-input-box]').length) { //针对应用题答语框中的内容，无需等待所有图片加载完毕，即可渲染
                        $compile($ele)($scope);
                    } else {
                        $scope.$on('compileHtml.allImgRender', function () {
                            $compile($ele)($scope);
                            $scope.IS_ALL_IMG_LOADED = true;
                            if ($scope.innerDirectiveCount == 0 && element.attr("spListFirstChild") == "true"
                                && $scope.showType == "correct") {//如果没有特殊指令，就触发批改指令
                                $scope.smallQ = $(element).parents('[compile-html]');
                                $scope.currentEle = element;
                                if ($scope.smallQ.length) {
                                    element.append($compile('<correct-paper></correct-paper>')($scope));
                                }
                            }
                        });
                    }

                    //});

                    //}
                });
                $scope.currentNode = null;

                //==================添加内容==================================
                $scope.$on('keyboard.addContent', function (ev, val) {
                    if (val.ele != element && (element.attr('id') ? element.attr('id') != $(val.ele).attr('id') : true))return;//不是发给自己的消息
                    $scope.currentElement = val.ele;
                    val = val.val;
                    var data = splitUnit(val); //调用函数处理文字加mathjax表达式的答案,如果有就存为数组
                    if (typeof(data) == 'string') {
                        addUnitToTextArea(val);
                    } else {
                        data.forEach(function (val) {
                            addUnitToTextArea(val);
                        });
                    }
                });
                //==================计算子节点指令渲染的个数==================================
                var subDirectiveRenderCount = 0;
                $scope.$on('apptextarea.subdirective.render', function () {
                    subDirectiveRenderCount++;
                    if (subDirectiveRenderCount == $scope.innerDirectiveCount) {
                        MathJax.Hub.Queue(["Reprocess", MathJax.Hub, document.querySelector('body'), function () {
                            if ($scope.showType == "correct" && element.attr("spListFirstChild") == "true") {
                                $scope.smallQ = $(element).parents('[compile-html]');
                                $scope.currentEle = element;
                                if ($scope.smallQ.length) {
                                    if ($scope.IS_ALL_IMG_LOADED) {
                                        element.append($compile('<correct-paper></correct-paper>')($scope));
                                    } else {
                                        var count = 0;
                                        var crInterval = null;
                                        crInterval = $interval(function () {
                                            count++;
                                            if ($scope.IS_ALL_IMG_LOADED) {
                                                element.append($compile('<correct-paper></correct-paper>')($scope));
                                                $interval.cancel(crInterval);
                                            }
                                            if (count >= 100)
                                                $interval.cancel(crInterval);
                                        }, 100);
                                    }
                                }
                            }
                        }]);
                    }
                });

                /**
                 * 处理文字加mathjax表达式的答案,如果有就存为数组
                 * @param val  传入的答案
                 * @returns {*} 传入数据或分割数组
                 */
                function splitUnit(val) {
                    var units = [];
                    for (var key in $scope.EXPRESSION_SET) {
                        if (key == 'WORD_ANSWER' || key == 'SQUARE') {
                            continue;
                        }
                        val = val.replace(new RegExp($scope.EXPRESSION_SET[key], 'mg'), function (match) {
                            var findInfo = {
                                match: match,
                                startIndex: arguments[arguments.length - 2]
                            };
                            units.push(findInfo);
                            var rtStr = '';
                            for (var i = 0; i < match.length; i++) {
                                rtStr += '~';
                            }
                            return rtStr;
                        });
                    }
                    if (val.indexOf('~') == -1)
                        return val;
                    var array = val.split('');
                    for (var i = 0; i < units.length; i++) {
                        array[units[i].startIndex] = units[i].match;
                    }
                    var rtArray = [];
                    for (var j = 0; j < array.length; j++) {
                        if (array[j] != '~')
                            rtArray.push(array[j]);
                    }
                    return rtArray;
                }


                /**
                 * 想输入区域添加编辑内容（unit）
                 * @param val
                 * @param forceCompile 无论以什么开头，都执行compile
                 */
                function addUnitToTextArea(val, forceCompile) {

                    var $currentElement = $scope.currentElement;

                    if ($currentElement.is('.appTextarea') && (  //非应用题做题框不能添加答语和换行
                            val.match(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg'))
                            || val.match(new RegExp($scope.EXPRESSION_SET.NEWLINE, 'mg'))
                        ) && !$currentElement.hasClass($scope.INPUT_AREA_TYPE.PULL_INPUT_AREA))return;

                    if (($currentElement.is('.fractionInputBoxTop') || $currentElement.is('.fractionInputBoxBottom')) && val.match(new RegExp($scope.EXPRESSION_SET.FRACTION, 'mg')))return; //分数分子分母上不能再添加分数


                    if (!$scope.currentNode && val.match(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg')))return; //第一行行首以及没有内容时不能添加答案


                    if (val.match(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg')) && $currentElement.hasClass($scope.APP_TEXTAREA_CLASS_IDENTITIY))return; //答案中不能插入答案

                    if ($scope.currentNode && $scope.currentNode.is('[' + $scope.UNSUPPORT_EXPRESSION_SET.WORD_ANSWER.directive + ']'))return; //答语后面不能添加内容

                    if (val.match(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg')) &&
                        $scope.textContent.expr.match(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg'))) {//不能同时添加两个以上的答语
                        if ($scope.currentNode.is('[' + $scope.UNSUPPORT_EXPRESSION_SET.NEWLINE.directive + ']')) {
                            $scope.$emit('keyboard.del', {ele: $currentElement});
                        }
                        return;
                    }

                    if (val.match(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg')) && $scope.currentNode && $($scope.currentNode).next().next().length) {//不能在中间插入答语
                        if ($scope.currentNode.is('[' + $scope.UNSUPPORT_EXPRESSION_SET.NEWLINE.directive + ']')) {
                            $scope.$emit('keyboard.del', {ele: $currentElement});
                        }
                        return;
                    }

                    if (val == '\\n' && $scope.currentNode && $scope.currentNode.hasClass('newline'))return;//不可以连续添加两个或两个以上的换行


                    var $cursor = $currentElement.find('cursor');
                    var inserPointNodeId = $cursor.prev() ? $cursor.prev().attr('id') : null;
                    var $unit = $('<unit></unit>').attr('id', uuid4.generate()).append(val);
                    $unit.insertBefore($cursor);
                    var $unitClone = $unit.clone();
                    if (val.startsWith('\\')
                        || val.startsWith(' ')//针对空格
                        || val.indexOf('^') > 0 //针对平方、次方
                        || forceCompile) {
                        var isSupportedExpression = false;
                        for (var key in $scope.UNSUPPORT_EXPRESSION_SET) {
                            if (val.match(new RegExp('^' + $scope.UNSUPPORT_EXPRESSION_SET[key].expr, 'mg'))) {
                                $unit.attr($scope.UNSUPPORT_EXPRESSION_SET[key].directive, '').attr('value', val).html('{{value}}');
                                isSupportedExpression = true;
                            }
                        }
                        if (!isSupportedExpression)$unit.attr('mathjax-parser', '').attr('value', val).html('{{value}}');
                        $compile($unit)($scope);
                    }
                    //改变textContext
                    var $wrapper = angular.element('<div></div>').append($scope.textContent.html);
                    if (inserPointNodeId) {
                        $unitClone.insertAfter($wrapper.find('#' + inserPointNodeId));
                    } else {
                        $wrapper.prepend($unitClone);
                    }
                    selfChangeExpr = true;
                    angular.forEach($wrapper.find('[value]'), function (item) {
                        $(item).html($(item).attr('value'));
                    });
                    $scope.textContent.html = $wrapper.html();
                    $scope.textContent.expr = $wrapper.text();
                    setCursorAndCurrentNode($unit);

                    //=========================如果没有appTextarea这个class,则保证首行空格============================
                    if (!element.hasClass($scope.APP_TEXTAREA_CLASS_IDENTITIY)) {
                        ensureSpace();
                    }
                }

                /**
                 * 设置光标所在的位置
                 * @param currentNode 光标前面的元素
                 */
                function setCursorAndCurrentNode(currentNode) {
                    var $currentElement = $scope.currentElement || $('#' + $(element).attr('id'));
                    var $cursor = $currentElement.find('cursor');
                    var cursorHeight = $cursor.height();
                    var $newCursor = $('<cursor></cursor>').height(cursorHeight);
                    $scope.currentNode = currentNode;
                    $('cursor').remove();//移除所有的光标
                    if (currentNode)
                        $newCursor.insertAfter($scope.currentNode);
                    else
                        $($currentElement).prepend($newCursor);
                    $compile($newCursor)($scope);
                    var $last = $currentElement.children().last();
                    removeLastNewline($last);
                }

                /**
                 * 当光标聚焦到非最后一个unit时，如果最后一个unit是换行，则去除该换行
                 */
                function removeLastNewline($last) {
                    var lastId = $last.attr('id');
                    if ($last.is('[' + $scope.UNSUPPORT_EXPRESSION_SET.NEWLINE.directive + ']')
                        || $last.is('[' + $scope.UNSUPPORT_EXPRESSION_SET.SPACE.directive + ']')) {
                        $last.remove();
                        //改变textContext
                        var $wrapper = angular.element('<div></div>').append($scope.textContent.html);
                        $wrapper.find('#' + lastId).remove();
                        $scope.textContent.html = $wrapper.html();
                        selfChangeExpr = true;
                        $scope.textContent.expr = $wrapper.text();
                        var $l = element.children().last();
                        removeLastNewline($l);
                    }
                }

                //==================删除内容======================================
                $scope.$on('keyboard.del', function (ev, val) {
                    if (val.ele != element && (element.attr('id') ? element.attr('id') != $(val.ele).attr('id') : true))return;//不是发给自己的消息
                    if ($scope.currentNode) {
                        function doDelete() {
                            var $temp = $scope.currentNode;
                            var $prev = $scope.currentNode.prev();
                            if ($prev.length)setCursorAndCurrentNode($prev.eq(0));
                            else $scope.currentNode = null;
                            //改变textContext
                            var $wrapper = angular.element('<div></div>').append($scope.textContent.html);
                            $wrapper.find('#' + $temp.attr('id')).remove();
                            $scope.textContent.html = $wrapper.html();
                            selfChangeExpr = true;
                            $scope.textContent.expr = $wrapper.text();
                            $temp.remove();
                        }

                        doDelete();

                        //=========================如果没有appTextarea这个class,则保证首行空格============================
                        if (!element.hasClass($scope.APP_TEXTAREA_CLASS_IDENTITIY)) {
                            ensureSpace();
                        }
                    }
                });

                /**
                 * 检查space行首空格，如果以等号开始，则行首无空格，否则有空格
                 */
                function ensureSpace() {
                    /**
                     * 递归查找上一个内容为 \n 的元素
                     * @param $start
                     * @returns {*}
                     */
                    function findStartOfLine($start) {
                        if (!$start.length) {
                            return null;
                        }
                        if ($start.html() != '\\n') {
                            return findStartOfLine($start.prev());
                        } else {
                            return $start;
                        }
                    }

                    /**
                     * 添加空格
                     * @param afterId 空格后一个元素的ID
                     */
                    function addSpace(afterId) {
                        var $space = $('<unit></unit>')
                            .attr($scope.UNSUPPORT_EXPRESSION_SET.SPACE.directive, '')
                            .attr('id', uuid4.generate())
                            .attr('value', '    ').html('{{value}}');
                        var $spaceClone = $space.clone().html('    ');
                        var $afterEle = element.find('#' + afterId);
                        $space.insertBefore($afterEle);
                        $compile($space)($scope);
                        //改变textContext
                        var $wrapper = $('<div></div>');
                        $wrapper.append($scope.textContent.html);
                        $spaceClone.insertBefore($wrapper.find('#' + afterId));

                        $scope.textContent.html = $wrapper.html();
                        $scope.textContent.expr = $wrapper.text();
                    }

                    /**
                     * 删除空格
                     * @param spaceId 空格元素的ID
                     */
                    function deleteSpace(spaceId) {
                        var currentNode = null;
                        var $eSpace = element.find('#' + spaceId);
                        var $wrapper = $('<div></div>').append($scope.textContent.html);
                        var $space = $wrapper.find('#' + spaceId);
                        currentNode = $eSpace.prev().length ? $eSpace.prev() : null;

                        if (currentNode && currentNode[0].nodeName.toUpperCase() == "CURSOR") {
                            currentNode = currentNode.prev().length ? currentNode.prev() : null;
                        }

                        setCursorAndCurrentNode(currentNode);
                        $eSpace.remove();
                        //改变textContext
                        $space.remove();
                        $scope.textContent.html = $wrapper.html();
                        $scope.textContent.expr = $wrapper.text();
                    }

                    //==============找到当前光标所在行的行首位置的元素===============================================


                    var $startEle;
                    var $cursor = element.find('cursor');
                    var $cursorPrev = $cursor.prev();
                    var $html = $($scope.textContent.html);
                    if (!$cursorPrev.length) {
                        $startEle = null;
                    } else {
                        var id = $cursorPrev.attr('id');
                        var $start = $html.filter('#' + id);
                        $startEle = findStartOfLine($start);
                    }

                    //=============删除当前光标右边的空格===========================================================

                    var $cursorNext = $cursor.next();

                    if ($html.filter('#' + $cursorNext.attr('id')).html() == $scope.SPACE_CHARACTOR) {
                        deleteSpace($cursorNext.attr('id'));
                    }

                    if (!$startEle) { //找不到 \n 元素
                        if ($html.eq(0).html() != '=' && $html.eq(0).html() != $scope.SPACE_CHARACTOR) {
                            addSpace($html.eq(0).attr('id'));
                        }
                    } else {
                        var $next = $startEle.next();//下一个
                        var $nnext = $next.next(); //下下一个
                        if (!$next.length) return;
                        if ($next.html() == $scope.SPACE_CHARACTOR && !$nnext.length) {
                            deleteSpace($next.attr('id'));
                        } else if ($next.html() != $scope.SPACE_CHARACTOR && !$nnext.length) {
                            if ($next.html() != '=') {
                                addSpace($next.attr('id'));
                            }
                        } else if ($next.html() == $scope.SPACE_CHARACTOR && $nnext.length) {
                            if ($nnext.html() == '=') {
                                deleteSpace($next.attr('id'));
                            }
                        } else if ($next.html() != $scope.SPACE_CHARACTOR && $nnext.length) {
                            if ($next.html() != '=') {
                                addSpace($next.attr('id'));
                            } else if ($next.html() == '=' && $nnext.html() == $scope.SPACE_CHARACTOR) {
                                deleteSpace($nnext.attr('id'));
                            }
                        }
                    }

                }

                angular.element(element).on('click', function (ev) {
                    ev.stopPropagation();
                    $scope.$broadcast('focus.element', element);
                    if (selectItems.length) {
                        $scope.$root.$broadcast('keyboard.show', {
                            ele: element,
                            selectItemList: selectItems
                        });
                    } else {
                        $scope.$root.$broadcast('keyboard.show', {
                            ele: element,
                            possibleUnits: keyboardUnits,
                            wordAnswer: wordAnswer
                        });
                    }
                    var $target = $(ev.target);

                    //====================下面判断当前点击的target=================================================


                    //case 1.当前target为 appTextarea,说明当前点中了整个编辑区域
                    if ($target[0].nodeName.toUpperCase() == 'APP-TEXTAREA' || $target.hasClass('appTextarea')) {
                        var $cUnits = $target.find('unit');
                        if ($cUnits.length) {
                            setCursorAndCurrentNode($cUnits.eq($cUnits.length - 1));
                            return;
                        }
                        $('cursor').remove();
                        $target.append($('<cursor></cursor>'));
                        $compile($(element).find('cursor'))($scope);

                        return;
                    }

                    //case 2.当前点中的内容为unit
                    if ($target[0] && $target[0].nodeName.toUpperCase() == "UNIT") {
                        setCursorAndCurrentNode($target);
                        return;
                    }

                    //case 3.当前点中的不是unit,则target为当前点中节点最近的unit父亲节点
                    if ($target.parents('unit').length) {
                        $target = $target.parents('unit').eq(0);
                        setCursorAndCurrentNode($target);
                    }

                });


                $scope.$root.bodyClickFn = $scope.$root.bodyClickFn ? $scope.$root.bodyClickFn : function (ev) {
                    console.log('body click!!!!!!!!!!!!!!!!!!!!');
                    if (!(ev.target.nodeName.toUpperCase() == 'APP-TEXTAREA')
                        && !$(ev.target).parents('app-textarea , .appTextarea').length
                        && !$(ev.target).hasClass('appTextarea')) {
                        ctrl.$root.$broadcast('keyboard.hide', element);
                        if (!$(ev.target).parents('.keyboard').length && !$(ev.target).is('.keyboard')) {
                            $('cursor').remove();
                        }
                    }
                };
                angular.element($window.document).off('mousedown touchstart', $scope.$root.bodyClickFn);
                angular.element($window.document).on('mousedown touchstart', $scope.$root.bodyClickFn);

                //=================改变答语串中某个unit的内容===========================================

                $scope.$on('unit.exprChange', function (ev, data) {
                    var $wrapper = $('<div></div>').append($scope.textContent.html);
                    $wrapper.find('[value]').each(function () {
                        $(this).html($(this).attr('value'));
                    });
                    $wrapper.find('#' + data.unitId).html(data.expr);
                    $scope.textContent.html = $wrapper.html();
                    $scope.textContent.expr = $wrapper.text();
                    selfChangeExpr = true;
                });

                //================判断当前编辑区域是否聚焦了====================================

                $scope.$on('focus.element', function (ev, ele) {
                    if (ele == element)$scope.elementFocus = true;
                });

            }
        }
    });

allereEClassAppTextarea.directive('cursor', ['$interval', function ($interval) {
    return {
        restrict: "E",
        link: function ($scope, element, attrs) {
            element.addClass('cursor').addClass('cursorShow');
            var interval = $interval(function () {
                element.toggleClass('cursorShow').toggleClass('cursorHide');
            }, 500);
            $scope.$on('$destroy', function () {
                $interval.cancel(interval);
            });
        }
    }
}]);

//========================下面是mathjax不支持的一些指令列表=============================
allereEClassAppTextarea.directive('equal', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.html('=');
                $scope.$emit('apptextarea.subdirective.render', element);
            })

        }
    }
}]);

allereEClassAppTextarea.directive('plus', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.html('＋');
                $scope.$emit('apptextarea.subdirective.render', element);
            })

        }
    }
}]);

allereEClassAppTextarea.directive('minus', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.html('－');
                $scope.$emit('apptextarea.subdirective.render', element);
            })
        }
    }
}]);
allereEClassAppTextarea.directive('remain', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.html('······');
                $scope.$emit('apptextarea.subdirective.render', element);
            })
        }
    }
}]);

allereEClassAppTextarea.directive('newline', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.addClass('newline');
                $scope.$emit('apptextarea.subdirective.render', element);
            })
        }
    }
}]);
allereEClassAppTextarea.directive('unit', ['$log', '$compile', function ($log, $compile) {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            if (!$(element).is('[mathjax-parser]')) {
                $scope.$watch('value', function () {

                    //==========================如果是键盘中的unit,则都使用lazyCompile================================
                    if ($(element).parents('.keyboard').length) {
                        $scope.lazyCompile = false;
                    }
                    $scope.value.replace(/\\unit{(.+)?}{(.+)?}{(.+?)}/, function (match, $1, $2, $3) {
                        if (!match.length) {
                            $log.error('单位的格式不正确！');
                        }
                        var option = $3.split('');
                        if (option.length != 2 || ['0', '1'].indexOf(option[0]) == -1 || ['0', '1'].indexOf(option[1]) == -1) {
                            $log.error('单位的格式不正确！第三个花括号中只可能是00|01|10|11');
                        }
                        if (option[0] == 0 && option[1] == 0) { //显示中文加括号
                            element.html('(' + $2 + ')');
                            $scope.$emit('apptextarea.subdirective.render', element);

                        }
                        if (option[0] == 0 && option[1] == 1) { //显示中文不加括号
                            element.html($2);
                            $scope.$emit('apptextarea.subdirective.render', element);
                        }
                        if (option[0] == 1 && option[1] == 0) { //显示英文加括号
                            if ($1.indexOf('^') != -1) { //如果内容中有 ‘^’，则表示有平方，需要用maxjax转化
                                var $parser = $('<span></span>').attr('mathjax-parser', '').attr('value', '(' + $1 + ')').attr('lazy-compile', $scope.lazyCompile);
                                element.empty().append($parser);
                                $compile($parser)($scope);
                            } else {
                                element.html('(' + $1 + ')');
                                $scope.$emit('apptextarea.subdirective.render', element);
                            }
                        }
                        if (option[0] == 1 && option[1] == 1) { //显示英文不加括号
                            if ($1.indexOf('^') != -1) { //如果内容中有 ‘^’，则表示有平方，需要用maxjax转化
                                var $parser = $('<span></span>').attr('mathjax-parser', '').attr('value', $1).attr('lazy-compile', $scope.lazyCompile);
                                element.empty().append($parser);
                                $compile($parser)($scope);
                            } else {
                                element.html($1);
                                $scope.$emit('apptextarea.subdirective.render', element);
                            }
                        }
                    });
                })
            }
        }
    }
}]);

allereEClassAppTextarea.directive('frac', function ($compile, $state, $window, $timeout, UNSUPPORT_EXPRESSION_SET) {
    "ngInject";
    return {
        restrict: "A",
        scope: {
            value: '@',
            lazyCompile: '@'
        },
        link: function ($scope, element, attrs) {
            var STATE_FOR_EDIT = 'do_question';
            element.css({
                display: 'inline-block',
                verticalAlign: 'middle'
            });
            //===================分数编辑模式的内容===============================================

            var topExpr = '' //分数分子的值
                , bottomExpr = ''//分数分母的值
                , isMathjaxState = false//是否是MATHJAX的表现形式
                , fractionRegexp = new RegExp(UNSUPPORT_EXPRESSION_SET.FRACTION.expr, 'mg'); //提取分子分母的正则

            /**
             * 添加分数编辑时的UI
             */
            function addFractionEditUI() {
                var $fractionInputBoxTopTemplate = $('<span class="appTextarea fractionInputBoxTop"></span>');
                var $fractionSeparatorTemplate = $('<span class="fractionSeparator"></span>');
                var $fractionInputBoxBottomTemplate = $('<span class="appTextarea fractionInputBoxBottom"></span>');
                $fractionInputBoxBottomTemplate.css({
                    minWidth: '50px',
                    margin: '0 5px',
                    background: 'white',
                    display: 'block',
                    textAlign: 'center',
                    overflow: 'hidden'
                });
                $fractionSeparatorTemplate.css({
                    borderBottom: '1px solid black',
                    width: '80%',
                    display: 'block',
                    margin: '1px 10%'
                });
                $fractionInputBoxTopTemplate.css({
                    minWidth: '50px',
                    margin: '0 5px',
                    background: 'white',
                    display: 'block',
                    textAlign: 'center',
                    overflow: 'hidden'
                });
                element.empty();
                element.append($fractionInputBoxTopTemplate, $fractionSeparatorTemplate, $fractionInputBoxBottomTemplate);
                $compile($fractionInputBoxTopTemplate)($scope);
                var $cTopScope = angular.element($fractionInputBoxTopTemplate).scope();
                $cTopScope.textContent.expr = topExpr;
                $cTopScope.$watch('textContent.expr', function () {
                    topExpr = $cTopScope.textContent.expr;
                    $scope.$emit('unit.exprChange', {
                        unitId: element.attr('id'),
                        expr: "\\frac{" + topExpr + "}{" + bottomExpr + "}"
                    });
                });
                $compile($fractionInputBoxBottomTemplate)($scope);
                var $cBottomScope = angular.element($fractionInputBoxBottomTemplate).scope();
                $cBottomScope.textContent.expr = bottomExpr;
                $cBottomScope.$watch('textContent.expr', function () {
                    bottomExpr = $cBottomScope.textContent.expr;
                    $scope.$emit('unit.exprChange', {
                        unitId: element.attr('id'),
                        expr: "\\frac{" + topExpr + "}{" + bottomExpr + "}"
                    });
                });
                if ($state.current.name == STATE_FOR_EDIT) { //在学生端做题的页面自动进入编辑模式
                    $timeout(function () {
                        if (!topExpr || !bottomExpr)
                            $(element).find('span').eq(0).trigger('click');
                    }, 200);
                }
            }

            /**
             * 根据$scope.value获取分子及分母的值
             */
            function getTopAndBottomExpr() {
                if (!$scope.value)return;
                $scope.value.replace(fractionRegexp, function (match, $1, $2) {
                    topExpr = $1;
                    bottomExpr = $2;
                    return match;
                });
            }

            function renderMathJax() {
                var mathjaxRenderSpan = $('<span mathjax-parser></span>').attr('value', '\\frac{' + topExpr + '}{' + bottomExpr + '}');
                element.empty();
                element.append($compile(mathjaxRenderSpan)($scope));
            }

            getTopAndBottomExpr();
            addFractionEditUI();

            $scope.$on('focus.element', function () { //当分数编辑区域失去焦点时，如果合法，则显示为mathjax形式
                if (topExpr && bottomExpr && !isMathjaxState && $state.current.name == STATE_FOR_EDIT) {
                    renderMathJax();
                    isMathjaxState = true;
                    $(element).parent().css('z-index', 0);
                }
            });

            function handleDocumentClick(ev) {
                if ($(ev.target).parents('keyboard').length || $(ev.target).parents('.keyboard').length)return;
                if (topExpr && bottomExpr && !isMathjaxState) {
                    renderMathJax();
                    isMathjaxState = true;
                    $(element).parent().css('z-index', 0);
                    $scope.$emit('apptextarea.subdirective.render', element);
                }
            }

            $(document).on('click', handleDocumentClick).trigger('click');
            $scope.$on('$destroy', function () {
                $(document).off('click', handleDocumentClick)
            });

            element.on('click', function (ev) {//点击分数时显示分数编辑框
                if (isMathjaxState)
                    ev.stopPropagation();
                if ($state.current.name != STATE_FOR_EDIT)
                    return;
                addFractionEditUI();
                isMathjaxState = false;
                $(element).parent().css('z-index', 10000);
            });
        }
    }
});
//====================================================未知数=========================================================
allereEClassAppTextarea.directive('unkn', ['$compile', function ($compile) {
    return {
        restrict: "A",
        scope: {
            value: '@',
            lazyCompile: '@'
        },
        link: function ($scope, element, attrs) {
            if (!$(element).is('[mathjax-parser]')) {
                $scope.$watch('value', function () {
                    $scope.value.replace(/\\var{(.+)?}/, function (match, $1) {
                        if (!match.length) {
                            $log.error('未知数的格式不正确！');
                        }
                        element.removeAttr('unkn').attr('mathjax-parser', '').attr('value', $1).attr('lazy-compile', $scope.lazyCompile);
                    });
                    $compile(element)($scope);
                });
            }
        }
    }
}]);

//====================================================空格=========================================================

allereEClassAppTextarea.directive('space', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.html('&nbsp;&nbsp;');
                $scope.$emit('apptextarea.subdirective.render', element);
            })
        }
    }
}]);

//====================================================答语=========================================================

allereEClassAppTextarea.directive('wordAnswer', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {


            var inputRegExp = /@id=(.+?)@\[(.*?)\]/mg; //查找wordAnswer中的<id=?>[?]的部分

            $scope.$watch('value', function () {
                // 答语串 example:
                // \wordAnswer{小明一共搬了<id=1>[800]公斤的大米，<id=2>[够]吃半年啦}
                // 找到<id=?>[?]的部分生成相应的输入框，并赋 值（值为[ ]中的内容），点击输入框时可接受键盘输入重新赋值

                var exprStrWithInputBox = $scope.value.replace(inputRegExp, function (match, $1, $2) {
                    return '<span style="display: inline-block;min-width: 40px;border-bottom: 1px solid black;text-align:center;"' +//输入框html模板
                        'word-answer-input-box box-id=' + $1 + ' value="' + $2 + '"></span>';
                });

                var contentRegExp = /\\wordAnswer{(.+)}/mg; //查找\wordAnswer{..}中，{}中的内容
                var htmlStrWidthInputBox = '';
                exprStrWithInputBox.replace(contentRegExp, function (match, $1) {
                    htmlStrWidthInputBox = '答：' + $1;
                });

                element.append(htmlStrWidthInputBox);
                //=========================找到答语中的输入框并compile===========================
                var $inputBoxes = $(element).find('[word-answer-input-box]');
                angular.forEach($inputBoxes, function (inputBox, idx) {
                    var $newScope = $scope.$new();
                    $newScope.value = $(inputBox).attr('value');
                    $compile(inputBox)($newScope);
                });

                $scope.$emit('apptextarea.subdirective.render', element);

            });


            //=====================改变wordAnswer的expr=========================================
            var tempValue = $scope.value;
            $scope.$on('wordAnswer.boxExprChange', function (ev, data) {

                tempValue = tempValue.replace(inputRegExp, function (match, $1, $2) {
                    if ($1 == data.boxId) {
                        return '@id=' + $1 + '@[' + data.expr + ']';
                    }
                    return match;
                });

                $scope.$emit('unit.exprChange', {unitId: element.attr('id'), expr: tempValue});

            });
        }
    }
}]);

allereEClassAppTextarea.directive('wordAnswerInputBox', ['$compile', 'EXPRESSION_SET', 'UNSUPPORT_EXPRESSION_SET', 'uuid4', function ($compile, EXPRESSION_SET, UNSUPPORT_EXPRESSION_SET, uuid4) { //答语中的输入框
    return {
        restrict: 'A',
        scope: true,
        link: function ($scope, $element, $attrs) {

            $scope.$watch('value', function () {
                //console.log('wordANswer box!!!!!!!!!!!!!!!!!!')
                //表达式列表
                $scope.EXPRESSION_SET = EXPRESSION_SET;
                //mathjax不能parse的表达式列表
                $scope.UNSUPPORT_EXPRESSION_SET = UNSUPPORT_EXPRESSION_SET;

                var exprCl = $scope.value;
                var boxId = $element.attr('box-id');

                //================如果该输入框表达式串中含有[A|B|C|....]这种格式，则说明这是选择型输入框=======
                //=======================并且方括号中用竖线分割的每一项就是选项=============================

                var isSelectInputBox = false,  //是否是输入框
                    selectItemList = [];//输入框选项列表
                boxId.replace(/\[(.+?)\]/mg, function (match, $1) {
                    if (match)isSelectInputBox = true;
                    selectItemList = $1.split('|');
                });


                //================在输入框内部插入一个appTextarea,使其可编辑================================

                var $appTextArea = angular.element('<span class="appTextarea"></span>');
                $appTextArea.attr('id', uuid4.generate());
                $element.append($appTextArea);

                $compile($appTextArea)($scope);


                //================当答案编辑框监听到内容改变时,通知wordAnswer指令===========================

                var $cScope = angular.element($appTextArea).scope();
                $cScope.textContent.expr = exprCl;
                $cScope.$watch("textContent.expr", function () {
                    if ($cScope.textContent.expr)
                        $scope.$emit('wordAnswer.boxExprChange', {boxId: boxId, expr: $cScope.textContent.expr});
                });

                //===============当编辑输入框时显示键盘，如果该输入框是选择型输入框，则通知键盘显示选项==========

                $appTextArea.on('click', function (ev) {
                    ev.stopPropagation();
                    if (isSelectInputBox) {//是选择型输入框需要清空内容
                        $appTextArea.addClass('select-input-area');
                        $scope.$root.$broadcast('keyboard.show', {
                            ele: $appTextArea,
                            selectItemList: selectItemList
                        });
                    } else
                        $scope.$root.$broadcast('keyboard.show', {ele: $appTextArea});

                });
            });
        }
    }
}]);

module.exports = allereEClassAppTextarea;

