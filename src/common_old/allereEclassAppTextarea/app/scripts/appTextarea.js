/**
 * Created by 彭建伦 on 2016/3/21.
 */
import  module from './module';
import $ from 'jquery';
import _ from 'underscore';
import ExpressionParser from './expressParser';
import AlineByEqual from './alineByEqual';
module.directive('appTextarea',
    function ($log, $compile, $window, uuid4, $timeout, $interval, EXPRESSION_SET, UNSUPPORT_EXPRESSION_SET, INPUT_AREA_TYPE, INPUTBOX_TYPES) {
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
                $scope.DO_QUESTION_FLAG = '[show-type="doQuestion"]';//小题上要标注展示类型，如果是做题，那么可以点击输入框，否则不能点击
                $scope.CLICK_INSENSITIVITY_VALUE=3;//点击不敏感的值。针对两个分数之间或者首行元素，添加光标。

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
                    var exprCl = $scope.textContent.expr;
                    if (!exprCl)return;

                    var parser = new ExpressionParser();
                    var parseResult = parser.parse(exprCl);
                    var $wrapper = $('<div></div>');
                    parseResult.forEach(function (item) {
                        var $unit = $('<unit></unit>'), matchExpressionSet, matchUnSupportExpressionSet;
                        for (var key in $scope.EXPRESSION_SET) {
                            if (item.match(new RegExp('^' + $scope.EXPRESSION_SET[key]))) {
                                matchExpressionSet = true;
                            }
                        }
                        for (var key in $scope.UNSUPPORT_EXPRESSION_SET) {
                            if (item.match(new RegExp('^' + $scope.UNSUPPORT_EXPRESSION_SET[key].expr))) {
                                $unit.attr($scope.UNSUPPORT_EXPRESSION_SET[key].directive, '');

                                matchUnSupportExpressionSet = true;
                            }
                        }
                        if (matchExpressionSet && !matchUnSupportExpressionSet) {
                            $unit.attr('mathjax-parser', '').attr('lazy-compile', true).attr('value', item).attr('ng-bind', 'value').attr('id', uuid4.generate());
                            $scope.innerDirectiveCount++;
                        } else if (matchExpressionSet && matchUnSupportExpressionSet) {
                            $scope.innerDirectiveCount++;
                            $unit.attr('id', uuid4.generate()).attr('lazy-compile', true).attr('value', item);
                        } else {
                            $unit.attr('id', uuid4.generate()).html(item);
			    if($unit.text()==="=")
                                $unit.addClass("aline-equal");
                        }
                        $wrapper.append($unit);
                    });
                    $scope.textContent.html = $wrapper.html();
                };
                this.$wrapper = $('<div></div>');
                /**
                 * 获取该输入框所在小题的所有文字内容
                 * @param $element 指令元素
                 */
                this.getPureWordsOfQuestion = function ($element) {
                    if (!$($element).is(INPUTBOX_TYPES.APP_TEXTAREA))return;
                    if (!$scope.html) {
                        $log.error('no html content found in app-textarea!');
                        return;
                    }
                    var $wrapper = $('<div></div>').append($scope.html);
                    $scope.pureWordsOfQuestion = $wrapper.text().replace(/\s/mg, '');
                };
                /**
                 * 获取输入框中每一行的最后一个unit
                 */
                this.getLastElementForEverySingleRow = function (target) {
                    var newLineElements = [], rtList = [];
                    //this.$wrapper.empty().append($scope.textContent.html);
                    $(target).children().each(function () {
                        if ($(this).html() == '\\n'||$(this).is('unit[newline]')) {
                            newLineElements.push($scope.element.find('#' + $(this).attr('id')));
                        }
                    });
                     var lastNode=$(target).children().last();
                    var lastEle = lastNode.is("cursor")?lastNode.prev():lastNode;

                    newLineElements.forEach(function (item) {
                        if ($(item).prev().length) {
                            rtList.push($(item).prev());
                        }
                    });
                    rtList.push($scope.element.find('#' + $(lastEle).attr('id')));
                    return rtList;
                };
                /**
                 * 当用户点击应用题输入框时，获取应当聚焦的元素
                 * （素距离当前用户点击的位置的Y坐标最近的元素就是需要聚焦的元）
                 * @param 点击事件
                 */
                this.getFocusElementInMultipleRow = function (ev) {
                    var rtEle = null, distance = null;
                    var eleList = this.getLastElementForEverySingleRow(ev.target);
                    eleList.forEach(function (eleItem) {
                        var dis = Math.abs((ev.pageY - $scope.element.offset().top - $(eleItem).height() / 2) - $(eleItem).position().top);
                        if (distance == null || distance > dis) {
                            distance = dis;
                            rtEle = eleItem;
                        }
                    });
                    return rtEle;
                }
            },
            link: function ($scope, element, $attrs, ctrl) {
                ctrl.getPureWordsOfQuestion(element);
                $scope.element = element;
                //=============获取文本串并进行首次编译===========================
                var selfChangeExpr = false;  //
                var keyboardUnits = [];//键盘的单位
                var selectItems = []; //选择型输入框的选项
                var pureWordsOfQuestion = null;//题干的文字内容
                var wordAnswer = null;
                let alineByEqual=new AlineByEqual();
                $scope.$watch('textContent.expr', function () {
                    if (selfChangeExpr)return;

                    if ($scope.answerInfo) {
                        wordAnswer = $scope.answerInfo.wordAnswer;
                        keyboardUnits = $scope.answerInfo.standardUnitList.concat($scope.answerInfo.nonStandardUnitList);
                    }

                    //如果为选择型输入框则需要获取选项的内容 selectItems
                    if ($(element).hasClass(INPUTBOX_TYPES.SELECT_INPUT_BOX)) {
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
                    //如果是步骤说明框，则需要获取题干上所有的文字内容
                    if ($(element).hasClass(INPUTBOX_TYPES.COMMENT_INPUT_BOX)) {
                        var $app_textarea = $(element).parents(INPUTBOX_TYPES.APP_TEXTAREA);
                        if (!$app_textarea.length) {
                            $app_textarea = $(element).parents('.' + INPUTBOX_TYPES.VARIABLE_SOLVE_INPUT_AREA);
                            if ($app_textarea.length) {
                                pureWordsOfQuestion = ' ';
                            }
                        }
                        if (!$app_textarea.length) {
                            $log.error('no app-textarea found!');
                            return;
                        }
                        pureWordsOfQuestion = angular.element($app_textarea).scope().pureWordsOfQuestion;
                        $log.debug(pureWordsOfQuestion);
                    }


                    $scope.parseExpr2Html();
                    var $ele = $($scope.textContent.html);
                    element.empty().append($ele);
                    if ($(element).parents('[word-answer-input-box]').length//针对应用题答语框中的内容，无需等待所有图片加载完毕，即可渲染
                        || $(element).parents('[' + $scope.UNSUPPORT_EXPRESSION_SET.COMMENT.directive + ']').length //步骤说明框中的内容，无需等待所有图片加载完毕，即可渲染
                        || $(element).parents('[' + $scope.UNSUPPORT_EXPRESSION_SET.FRACTION.directive + ']').length) { //分数框中的内容，无需等待所有图片加载完毕，即可渲染
                        $compile($ele)($scope);
                    } else {
                        $scope.$on('compileHtml.allImgRender', function () {
                            $compile($ele)($scope);
                            $scope.IS_ALL_IMG_LOADED = true;
			    if($scope.innerDirectiveCount == 0){
                                if(alineByEqual.currentQIsEquation($(element)))
                                    alineByEqual.alineEqualAuto($(element));
                                if(element.attr("spListFirstChild") == "true"
                                    && $scope.showType == "correct"){//如果没有特殊指令，就触发批改指令
                                    $scope.smallQ = $(element).parents('[compile-html]');
                                    $scope.currentEle = element;
                                    if ($scope.smallQ.length) {
                                        $timeout(function () {
                                            element.append($compile('<correct-paper></correct-paper>')($scope));
                                        },300)
                                    }
                                }
                            }

                        });
                    }
                });
                $scope.currentNode = null;
                //====================键盘控制光标位置================================
                $scope.$on('keyboard.findNextInput', function (ev, val) {
                    if (val.ele != element && (element.attr('id') ? element.attr('id') != $(val.ele).attr('id') : true))return;//不是发给自己的消息
                    $scope.currentElement = val.ele;
                    var currentCursor=$scope.currentElement.find('cursor');
                    if(currentCursor.next().length){//有下一个元素
                        var nextFracNode=currentCursor.next('[frac]');
                        if(nextFracNode.length){//说明下一个元素是分数
                            if(nextFracNode.children().length!=3)//如果是已经渲染了的分数
                                nextFracNode.trigger('click');
                            $timeout(function () {
                                //var clickBeforeFirstNode=true;
                                $(nextFracNode).find('span').eq(2).trigger('click');
                            });
                            return;
                        }
                        setCursorAndCurrentNode(currentCursor.next());
                        return;
                    }
                    if($scope.currentElement.hasClass("fractionInputBoxBottom")){//如果当前是处于分子的最末尾
                        var fractionInputBoxTop=$scope.currentElement.parent().find(".fractionInputBoxTop");
                        $(fractionInputBoxTop).trigger('click');
                        return;
                    }
                    if($scope.currentElement.hasClass("fractionInputBoxTop")){//如果当前是处于分母的最末尾
                        $scope.currentElement.parent().trigger('click');
                        //setCursorAndCurrentNode($scope.currentElement.parent());
                        return;
                    }

                    if($scope.currentElement.hasClass("comment")){//如果当前是处于注释的最末尾
                        //TODO: 处理文字注释
                        return;
                    }

                    var doQuetisonEle=$scope.currentElement.parents('.editor.do_question_text').first();//找到做题区域
                    var inputAreaArray=doQuetisonEle.find('.input-area');
                    if(inputAreaArray.length<=1){//表示当前做题区域只有一个输入区域
                        //TODO：该输入框从头开始
                        return;
                    }
                    var findNextInputIndex=-1;
                    for(var i=0;i< inputAreaArray.length;i++){
                        if($(inputAreaArray[i]).attr("id")===$scope.currentElement.attr("id")){
                            if(i!=inputAreaArray.length-1)
                                findNextInputIndex=i+1;
                            else
                                findNextInputIndex=0;
                            break;
                        }
                    }
                    var nextInput=$(inputAreaArray[findNextInputIndex]);
                    //$scope.$emit("inputbox.focus.scroll",{ele:nextInput});
                    nextInput.trigger('click');


                });

                $scope.$on('question.slide.change',function (ev,val) {
                    //在渲染内容时，需要判断下当前输入是否为“=”,且为解方程的情况
                    if(alineByEqual.currentQIsEquation(element)){
                        let time;
                        if(val.init){//从总览过来
                            if(element.children('unit[frac]').length)//有分数的情况
                                time=2400;
                            else
                                time=300;
                        }else{//说明从上下题
                            if(element.children('unit[frac]').length)//有分数的情况
                                time=1400;
                            else
                                time=500;
                        }
                        $timeout(function () {
                            alineByEqual.alineEqualAuto(element);
                            console.log("time：",time);
                        },time);
                    }
                });

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
                    //在渲染内容时，需要判断下当前输入是否为“=”,且为解方程的情况
                    if(alineByEqual.currentQIsEquation(element)){
                        if(!element.hasClass('variable-solve-input-area')&&val==="\\comment{}"){//解方程应用题添加comment就返回
                            return;
                        }

                        $timeout(function(){
                            alineByEqual.alineEqualAuto(element);
                        },400);
                    }
                });
                //==================计算子节点指令渲染的个数==================================
                var subDirectiveRenderCount = 0;
                $scope.$on('apptextarea.subdirective.render', function () {
                    subDirectiveRenderCount++;
                    if (subDirectiveRenderCount == $scope.innerDirectiveCount) {
                        MathJax.Hub.Queue(["Reprocess", MathJax.Hub, element[0], function () {
                            
                            $scope.smallQ = $(element).parents('[compile-html]');
                            $scope.currentEle = element;
                            if ($scope.smallQ.length) {
                                if ($scope.IS_ALL_IMG_LOADED) {
                                    if(alineByEqual.currentQIsEquation($(element)))
                                        alineByEqual.alineEqualAuto($(element));
                                    if ($scope.showType == "correct" && element.attr("spListFirstChild") == "true")
                                            element.append($compile('<correct-paper></correct-paper>')($scope));
                                } else {
                                    var count = 0;
                                    var crInterval = null;
                                    crInterval = $interval(function () {
                                        count++;
                                        if ($scope.IS_ALL_IMG_LOADED) {
                                            if(alineByEqual.currentQIsEquation($(element)))
                                                alineByEqual.alineEqualAuto($(element));
                                            if ($scope.showType == "correct" && element.attr("spListFirstChild") == "true")
                                                element.append($compile('<correct-paper></correct-paper>')($scope));
                                            $interval.cancel(crInterval);
                                        }
                                        if (count >= 100)
                                            $interval.cancel(crInterval);
                                    }, 100);
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

                    if ($currentElement.is('.variable-solve-input-area') && $currentElement.children().eq(0).is('[comment]') && val.match(new RegExp(EXPRESSION_SET.COMMENT)))return;//解方程题的最前面只能添加一个解

                    if ($currentElement.is('.comment') && $currentElement.parents('.appTextarea').length) {//如果是解方程中的文字输入框，则最多只能输入一个"解"和":"
                        let commentExpr = $scope.textContent.expr;
                        if (commentExpr.indexOf("解") != -1 && val == "解")return;
                        if (commentExpr.length && commentExpr[0] == ':')return;
                        if (commentExpr.indexOf(":") != -1)return;
                    }


                    if ($currentElement.is('.appTextarea') && (  //非应用题、脱式题、解方程题做题框不能添加答语和换行
                            val.match(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg'))
                            || val.match(new RegExp($scope.EXPRESSION_SET.NEWLINE, 'mg'))
                        ) && !$currentElement.hasClass(INPUTBOX_TYPES.PULL_INPUT_AREA) && !$currentElement.hasClass(INPUTBOX_TYPES.VARIABLE_SOLVE_INPUT_AREA))return;

                    if (($currentElement.is('.fractionInputBoxTop') || $currentElement.is('.fractionInputBoxBottom')) && val.match(new RegExp($scope.EXPRESSION_SET.FRACTION, 'mg'))){
                        if($currentElement.hasClass("fractionInputBoxBottom")){//如果当前是处于分子的最末尾
                            var fractionInputBoxTop=$currentElement.parent().find(".fractionInputBoxTop");
                            $(fractionInputBoxTop).trigger('click');
                            return;
                        }
                        if($currentElement.hasClass("fractionInputBoxTop")){//如果当前是处于分母的最末尾
                            var fractionInputBoxBottom=$currentElement.parent().find(".fractionInputBoxBottom");
                            $(fractionInputBoxBottom).trigger('click');
                            return;
                        }
                        //return; //分数分子分母上不能再添加分数
                    }


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

                    var insertRt = insertUnitToTextarea(val);

                    if (!insertRt) return; //同一行已经有步骤说明了
                    var $unit = insertRt.unit, inserPointNodeId = insertRt.insertPointNodeId;
                    var $unitClone = $unit.clone();
                    if (val.startsWith('\\')
                        || val.startsWith(' ')//针对空格
                        || val.indexOf('^') >= 0 //针对平方、次方
                        || forceCompile
                        || val.indexOf('\\dot') >-1) {
                        var isSupportedExpression = false;
                        for (var key in $scope.UNSUPPORT_EXPRESSION_SET) {
                            if (val.match(new RegExp('^' + $scope.UNSUPPORT_EXPRESSION_SET[key].expr, 'mg'))) {
                                $unit.attr($scope.UNSUPPORT_EXPRESSION_SET[key].directive, '').attr('value', val);
                                isSupportedExpression = true;
                            }
                        }
                        if (!isSupportedExpression)$unit.attr('mathjax-parser', '').attr('value', val).attr('ng-bind', 'value');
                        $compile($unit)($scope);
                    }
                    //改变textContext
                    var $wrapper = angular.element('<div></div>').append($scope.textContent.html);
                    if (inserPointNodeId) {
                        if(val.match(new RegExp(EXPRESSION_SET.COMMENT)))
                            $unitClone.insertBefore($wrapper.find('#' + inserPointNodeId));
                        else
                            $unitClone.insertAfter($wrapper.find('#' + inserPointNodeId));
                    } else {
                        $wrapper.prepend($unitClone);
                    }
                    selfChangeExpr = true;
                    angular.forEach($wrapper.find('[value]'), function (item) {
                        $(item).html($(item).attr('value'));
                    });
                    $scope.textContent.html = $wrapper.html();
                    //scope.textContent.expr 如果$wrapper.text()=="",
                    var expr = $wrapper.text();
                    if (expr != "")
                        $scope.textContent.expr = expr;
                    setCursorAndCurrentNode($unit);

                    //=========================如果没有appTextarea这个class,则保证首行空格============================
                    if (!element.hasClass($scope.APP_TEXTAREA_CLASS_IDENTITIY)&&!element.is("app-textarea")) {
                        ensureSpace();
                    }
                }

                /**
                 * 插入一个基本显示单元（unit）到输入框
                 * @param val
                 * @return {}
                 */
                function insertUnitToTextarea(val) {
                    var $currentElement = $scope.currentElement;
                    var $cursor = $currentElement.find('cursor');
                    var inserPointNodeId = $cursor.prev() ? $cursor.prev().attr('id') : null;
                    var $unit = $('<unit></unit>').attr('id', uuid4.generate()).append(val);
                    /*//如果是解方程式子非应用题
                    if(val==="\\comment{}"&&$currentElement.hasClass('variable-solve-input-area'))
                        $unit.addClass('variable-comment');*/
                    if(val==="="&&alineByEqual.currentQIsEquation($currentElement)){//如果是解方程或者解方程应用题,给等号添加样式
                        $unit.addClass('aline-equal');
                    }
                    if (val.match(new RegExp(EXPRESSION_SET.COMMENT))) { //插入步骤说明框
                        if ($currentElement.is('.variable-solve-input-area')) { //解方程步骤说明直接添加到最前方
                            $currentElement.prepend($unit);
                            inserPointNodeId = null;
                        } else {
                            var $prevEle = $cursor.prev();
                            while (!$prevEle.is('[' + UNSUPPORT_EXPRESSION_SET.NEWLINE.directive + ']')
                            && !$prevEle.is('[' + UNSUPPORT_EXPRESSION_SET.COMMENT.directive + ']')
                            && !$prevEle.is('[' + UNSUPPORT_EXPRESSION_SET.SPACE.directive + ']')
                            && $prevEle.prev() && $prevEle.prev().length) {
                                $prevEle = $prevEle.prev();
                            }
                            if ($prevEle.is('[' + UNSUPPORT_EXPRESSION_SET.COMMENT.directive + ']')) { //同一行已经有步骤说明了
                                return null;
                            }
                            if ($prevEle.is('[' + UNSUPPORT_EXPRESSION_SET.NEWLINE.directive + ']')) {
                                $unit.insertAfter($prevEle);
                            }
                            if ($prevEle.is('[' + UNSUPPORT_EXPRESSION_SET.SPACE.directive + ']')) {
                                var spaceId = $prevEle.attr('id');
                                $prevEle = $prevEle.prev();
                                deleteSpace(spaceId);
                                $unit.insertAfter($prevEle);
                            }
                            if (!$prevEle.prev().length) {
                                $currentElement.prepend($unit);
                            }
                            inserPointNodeId = $prevEle ? $prevEle.attr('id') : null;
                        }
                    } else {
                        $unit.insertBefore($cursor);
                        if($cursor.next().length&&$cursor.next().attr("first-left")==="true"){//新加入的元素是在等号对齐的第一个元素之前
                            $cursor.next().css({
                               'marginLeft':0
                            });
                        }
                    }
                    return {unit: $unit, insertPointNodeId: inserPointNodeId}
                }

                /**
                 * 设置光标所在的位置
                 * @param currentNode 光标前面的元素
                 * @param clickPostion true 表示当前元素之前，false表示当前元素之后
                 */
                function setCursorAndCurrentNode(currentNode,clickPostion) {
                    var $currentElement = $scope.currentElement || $('#' + $(element).attr('id'));
                    var $cursor = $currentElement.find('cursor');
                    var cursorHeight = $cursor.height();
                    var $newCursor = $('<cursor></cursor>').height(cursorHeight);
                    $scope.currentNode = currentNode;
                    $('cursor').remove();//移除所有的光标
                    if (currentNode){
                        $newCursor.insertAfter($scope.currentNode);
                        if(clickPostion){
                            $newCursor.insertBefore($scope.currentNode);
                            $scope.currentNode=$scope.currentNode.prev();
                        }else
                            $newCursor.insertAfter($scope.currentNode);
                    }else
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
                    $scope.currentNode=val.currentEle?val.currentEle:$scope.currentNode;
                    if ($scope.currentNode) {
                        function doDelete() {
                            if($scope.currentNode.is("cursor"))
                                $scope.currentNode=$scope.currentNode.prev();
                            var $temp = $scope.currentNode;
                            var $prev = $scope.currentNode.prev();
                            var $next=$scope.currentNode.next();
                            if ($prev.length)setCursorAndCurrentNode($prev.eq(0));
                            else $scope.currentNode = null;
                            //改变textContext
                            var $wrapper = angular.element('<div></div>').append($scope.textContent.html);
                            $wrapper.find('#' + $temp.attr('id')).remove();
                            $scope.textContent.html = $wrapper.html();
                            selfChangeExpr = true;
                            $scope.textContent.expr = $wrapper.text();
                            $temp.remove();
                            //在渲染内容时，需要判断下当前输入是否为“=”,且为解方程的情况
                            var currentNode_=$scope.currentNode?$scope.currentNode:$next;
                            $scope.currentNode=currentNode_;
                            if(alineByEqual.currentQIsEquation(element)){
                                alineByEqual.alineEqualAuto(element);
                            }
                        }

                        doDelete();

                        //=========================如果没有appTextarea这个class,则保证首行空格============================
                        if (!element.hasClass($scope.APP_TEXTAREA_CLASS_IDENTITIY)) {
                            ensureSpace();
                        }
                    }
                });
                //==================在文字框的状态下点击完成按钮，自动跳到下一行进行输入==================================
                $scope.$on('apptextarea.subdirective.done', function (ev, val) {
                    let ele = val.ele;
                    $scope.currentElement = ele.parents('app-textarea');
                    if (!$scope.currentElement.length)
                        $scope.currentElement = ele.parents('.variable-solve-input-area');
                    addUnitToTextArea('\\n');
                });
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
                        .attr('value', '    ');
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

                /**
                 * 检查space行首空格，如果以等号开始，则行首无空格，否则有空格
                 */
                function ensureSpace() {
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
                    function isComment(ele) {
                        return ele && ele.length && ele.html().match(new RegExp(EXPRESSION_SET.COMMENT));
                    }

                    var $cursorNext = $cursor.next();
                    if ($html.filter('#' + $cursorNext.attr('id')).html() == $scope.SPACE_CHARACTOR) {
                        deleteSpace($cursorNext.attr('id'));
                    }

                    if (!$startEle) { //找不到 \n 元素
                        if ($html.eq(0).html() != '=' && $html.eq(0).html() != $scope.SPACE_CHARACTOR && !isComment($html.eq(0))) {
                            addSpace($html.eq(0).attr('id'));
                        }
                    } else {
                        var $next = $startEle.next();//下一个
                        var $nnext = $next.next(); //下下一个
                        if (!$next.length) return;
                        if ($next.html() == $scope.SPACE_CHARACTOR && !$nnext.length) {
                            deleteSpace($next.attr('id'));
                        } else if ($next.html() != $scope.SPACE_CHARACTOR && !$nnext.length) {
                            if ($next.html() != '=' && !isComment($next)) {
                                addSpace($next.attr('id'));
                            }
                        } else if ($next.html() == $scope.SPACE_CHARACTOR && $nnext.length) {
                            if ($nnext.html() == '=') {
                                deleteSpace($next.attr('id'));
                            }
                        } else if ($next.html() != $scope.SPACE_CHARACTOR && $nnext.length) {
                            if ($next.html() != '=' && !isComment($next)) {
                                addSpace($next.attr('id'));
                            } else if ($next.html() == '=' && $nnext.html() == $scope.SPACE_CHARACTOR) {
                                deleteSpace($nnext.attr('id'));
                            }
                        }
                    }

                }


                /**
                 * 当前元素的点击事件
                 */
                function elementClick() {
                    angular.element(element).on('click', function (ev) {
                        ev.stopPropagation();
                        var ionSlidePage=$(element).parents('ion-slide');//如果不是当前ionSlide就返回
                        if(ionSlidePage.length!=0&&ionSlidePage.attr('data-index')!=ionSlidePage.attr('slideboxcurrentindex'))return;
                        $scope.$broadcast('focus.element', element);
                        var isAppTextarea = false;//是否是应用题的输入框
                        if ($(element).is(INPUTBOX_TYPES.APP_TEXTAREA) || $(element).hasClass(INPUTBOX_TYPES.VARIABLE_SOLVE_INPUT_AREA))
                            isAppTextarea = true;
                        if (selectItems.length) {
                            $scope.$root.$broadcast('keyboard.show', {
                                ele: element,
                                selectItemList: selectItems,
                                isAppTextarea: isAppTextarea
                            });
                        } else {
                            $scope.$root.$broadcast('keyboard.show', {
                                ele: element,
                                possibleUnits: keyboardUnits,
                                wordAnswer: wordAnswer,
                                pureWordsOfQuestion: pureWordsOfQuestion,
                                isAppTextarea: isAppTextarea
                            });
                        }
                        var $target = $(ev.target);

                        //====================下面判断当前点击的target=================================================

                       /* debugger;
                        if($target[0] && $target[0].nodeName.toUpperCase()=="SVG"&&$target.parents('unit[frac]').length===1){//点击了已渲染的分数前半部分
                            $target=$target.parents('unit[frac]');//将当前node更换为分数unit节点
                        }*/
                        //case 1.当前target为 appTextarea,说明当前点中了整个编辑区域
                        if ($target[0].nodeName.toUpperCase() == 'APP-TEXTAREA' || $target.hasClass('appTextarea')) {
                            var $cUnits = $target.children('unit');
                            if ($cUnits.length) {
                                var eleToFocus = ctrl.getFocusElementInMultipleRow(ev);
                                if (eleToFocus) {
                                    setCursorAndCurrentNode(eleToFocus);
                                } else {
                                    setCursorAndCurrentNode($cUnits.eq($cUnits.length - 1));
                                }
                                return;
                            }
                            $('cursor').remove();
                            $target.append($('<cursor></cursor>'));
                            $compile($(element).find('cursor'))($scope);

                            return;
                        }

                        //case 2.当前点中的内容为unit
                        if ($target[0] && $target[0].nodeName.toUpperCase() == "UNIT") {
                            var clickIsBefore=(ev.clientX-$target.offset().left)<=$scope.CLICK_INSENSITIVITY_VALUE;
                            setCursorAndCurrentNode($target,clickIsBefore);
                            return;
                        }

                        //case 3.当前点中的不是unit,则target为当前点中节点最近的unit父亲节点
                        if ($target.parents('unit').length) {
                            // $target = $target.parents('unit').eq(0);
                            // setCursorAndCurrentNode($target);
                            $target=$target.parents('unit').first();
                            var clickIsBefore=(ev.clientX-$target.offset().left)<=$scope.CLICK_INSENSITIVITY_VALUE;
                            setCursorAndCurrentNode($target,clickIsBefore);
                            return;
                        }

                    });
                }

                /**
                 * 初始化元素的点击事件
                 */
                function initElementClick() {
                    var currentElecment = angular.element(element);
                    var showType = $scope.$parent.showType;
                    var doQuestionElement = $(currentElecment).parents($scope.DO_QUESTION_FLAG);
                    if ((showType && showType == "doQuestion") || (doQuestionElement && doQuestionElement.length > 0)) {
                        elementClick();
                    }
                }

                initElementClick();


                $scope.$root.bodyClickFn = $scope.$root.bodyClickFn ? $scope.$root.bodyClickFn : function (ev) {
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

                //=================改变应用题中的子控件，如答案、步骤说明、分数输入框中的内容===========================================
                $scope.$on('unit.exprChange', function (ev, data) {
                    var $wrapper = $('<div></div>').append($scope.textContent.html);
                    $wrapper.find('[value]').each(function () {
                        $(this).html($(this).attr('value'));
                    });
                    $wrapper.find('#' + data.unitId).html(data.expr).attr('value', data.expr);
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
