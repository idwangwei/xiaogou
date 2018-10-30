/**
 * Created by 彭健伦 on 2016/3/21.
 * 分数指令
 */
import  module from './module';
//import  $ from 'jquery';
module.directive('frac', [
    "$compile"
    , "$q"
    , "$state"
    , "$window"
    , "$timeout"
    , "UNSUPPORT_EXPRESSION_SET"
    , function ($compile, $q, $state, $window, $timeout, UNSUPPORT_EXPRESSION_SET) {
        return {
            restrict: "A",
            scope: {
                value: '@',
                lazyCompile: '@'
            },
            link: function ($scope, element, attrs) {
                var STATE_FOR_EDIT = 'do_question';//注意，目前能做题有三块，老题库，学生做题，学生诊断做题。
                                                   //需要统一urlRouter的路径必须包含do_question
                var SELECT_INPUT_AREA='select-input-area';//选择性输入框。
                var SELECT_INPUT_FRAC='select-input-frac';//分数是选择性输入框。
                element.css({
                    display: 'inline-block',
                    verticalAlign: 'middle'
                });
                //===================分数编辑模式的内容===============================================

                var topExpr = '' //分数分子的值
                    , bottomExpr = ''//分数分母的值
                    , topMathjaxExpr = ''
                    , bottomMathjaxExpr = ''
                    , isMathjaxState = false//是否是MATHJAX的表现形式
                    , fractionRegexp = new RegExp(UNSUPPORT_EXPRESSION_SET.FRACTION.expr, 'mg'); //提取分子分母的正则

                var Pzindex = $(element).parent().css('z-index');

                function keyBoardIsShow() {
                    var hasKeyBoard = $(element).parents().find('.keyboard');
                    if (hasKeyBoard && hasKeyBoard.length && hasKeyBoard[0].style.display != 'none') {
                        return true;
                    }
                    return false;
                }

                function lazyCompileFrac() {
                    if ($state.current.name.indexOf(STATE_FOR_EDIT)>-1 && !keyBoardIsShow()) { //在学生端做题的页面并且没有键盘情况
                        /*var ionSlidePage=$(element).parents('ion-slide');//如果不是当前ionSlide就返回
                        if(ionSlidePage.length!=0&&ionSlidePage.attr('data-index')!=ionSlidePage.attr('slideboxcurrentindex'))return;*/
                        var parentEle = $(element).parent();
                        var childFracEleArray = parentEle.children('unit[frac]');
                        if (childFracEleArray && childFracEleArray.length) {
                            var topMathjaxExpr_ = getMathjaxExpr(topExpr);
                            var bottomMathjaxExpr_ = getMathjaxExpr(bottomExpr);
                            var mathjaxRenderSpan = $('<span mathjax-parser></span>').attr('value', '\\frac{' + topMathjaxExpr_ + '}{' + bottomMathjaxExpr_ + '}').attr('lazy-compile', "true");
                            var compileHtml = $compile(mathjaxRenderSpan)($scope);
                            $(element).empty();
                            $(element).append(compileHtml);
                            isMathjaxState = true;

                            /*var unitCount = 0;
                             angular.forEach(childFracEleArray, function (childFracEle) {
                             if ($(childFracEle).children().length === 1)
                             unitCount++;
                             });

                             if (!keyBoardIsShow() && ((unitCount + '') === parentEle.attr('fracCount'))) {
                             debugger;
                             console.log("统一延时加载frac");
                             MathJax.Hub.Queue(["Reprocess", MathJax.Hub, parentEle[0]]);
                             //$scope.$emit('apptextarea.subdirective.render');
                             return;
                             }*/
                        }
                    }
                }

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
                    $(element).empty();
                    $(element).append($fractionInputBoxTopTemplate, $fractionSeparatorTemplate, $fractionInputBoxBottomTemplate);
                    $compile($fractionInputBoxTopTemplate)($scope);
                    var $cTopScope = angular.element($fractionInputBoxTopTemplate).scope();
                    $cTopScope.textContent.expr = topExpr;
                    $cTopScope.$watch('textContent.expr', function () {
                        topExpr = $cTopScope.textContent.expr;
                        $scope.$emit('unit.exprChange', {
                            unitId: element.attr('id'),
                            expr: "\\frac{" + topExpr + "}{" + bottomExpr + "}"
                        });
                        //renderMathJax();
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
                        //renderMathJax();
                    });


                    if ($state.current.name.indexOf(STATE_FOR_EDIT)>-1&& keyBoardIsShow()) { //在学生端做题的页面自动进入编辑模式
                        var ionSlidePage = $(element).parents('ion-slide');//如果不是当前ionSlide就返回
                        if (ionSlidePage.length != 0 && ionSlidePage.attr('data-index') != ionSlidePage.attr('slideboxcurrentindex'))return;
                        $timeout(function () {
                            var flag = $(element).attr('add');
                            var parent = $(element).parent();
                            if(parent.hasClass(SELECT_INPUT_AREA)){//如果是选择输入框选择了分数
                                $(element).addClass(SELECT_INPUT_FRAC);
                                angular.element(element).trigger('click');
                                return;
                            }
                            if ((!topExpr || !bottomExpr) && flag != 'true') {
                                $(element).attr('add', 'true');
                                angular.element((element).find('span').eq(2)).trigger('click');
                            }
                        });
                        return;
                    }
                }

                /**
                 * 根据$scope.value获取分子及分母的值
                 */
                function getTopAndBottomExpr() {
                    if (!$scope.value)return;
                    //$scope.value.replace(fractionRegexp, function (match, $1, $2) {
                    //    topExpr = $1;
                    //    bottomExpr = $2;
                    //
                    //    return match;
                    //});
                    var lBracketCount = 0, rBracketCount = 0, firstFound = false, topExprStartPos = null, topExprEndPos = null, bottomExprStartPos = null, bottomExprEndPos = null;
                    for (var i = 0; i < $scope.value.length; i++) {
                        var char = $scope.value[i];
                        if (char == '{' && lBracketCount == 0) {
                            lBracketCount++;
                            if (firstFound) {
                                bottomExprStartPos = i + 1;
                            } else {
                                topExprStartPos = i + 1;
                            }
                        } else if (char == '{' && lBracketCount != 0) {
                            lBracketCount++;
                        } else if (char == '}') {
                            rBracketCount++;
                            if (lBracketCount == rBracketCount) {

                                lBracketCount = 0;
                                rBracketCount = 0;
                                if (firstFound) {
                                    bottomExprEndPos = i - 1;
                                } else {
                                    topExprEndPos = i - 1;
                                    firstFound = true;
                                }
                            }
                        }
                    }
                    topExpr = $scope.value.substring(topExprStartPos, topExprEndPos + 1);
                    bottomExpr = $scope.value.substring(bottomExprStartPos, bottomExprEndPos + 1);
                }

                /**
                 * 获取用于在分子分母的Mathjax形式中显示的表达式
                 * @param expr
                 */
                function getMathjaxExpr(expr) {
                    return expr.replace(/\\var{(.?)}/mg, '$1').replace(/\\remain/mg, ' ......');
                    //return expr.replace(/\\var{x?}/mg, ' x').replace(/\\var{y?}/mg, ' y').replace(/\\remain/mg, ' ......');
                }

                function handleCompile(compileHtml) {
                    var defer = $q.defer();
                    $timeout(function () {
                        defer.resolve(compileHtml);
                    }, 450);
                    return defer.promise;
                }

                function renderMathJax() {
                    topMathjaxExpr = getMathjaxExpr(topExpr);
                    bottomMathjaxExpr = getMathjaxExpr(bottomExpr);
                    var mathjaxRenderSpan = $('<span mathjax-parser></span>').attr('value', '\\frac{' + topMathjaxExpr + '}{' + bottomMathjaxExpr + '}');
                    var compileHtml = $compile(mathjaxRenderSpan)($scope);
                    if (keyBoardIsShow()) {//如果有键盘,就停顿渲染dom（解决新建分数，抖动bug）
                        handleCompile(compileHtml).then(function (data) {
                            $(element).empty();
                            $(element).append(data);
                        });
                        return;
                    }
                    $(element).empty();
                    $(element).append(compileHtml);
                  /*  setTimeout(function () {
                        MathJax.Hub.Queue(["Reprocess", MathJax.Hub, element[0]]);
                    },50);*/
                }


                getTopAndBottomExpr();
                addFractionEditUI();
                lazyCompileFrac();

                $scope.$on('focus.element', function () { //当分数编辑区域失去焦点时，如果合法，则显示为mathjax形式
                    if (topExpr && bottomExpr && !isMathjaxState && $state.current.name.indexOf(STATE_FOR_EDIT)>-1) {
                        renderMathJax();
                        isMathjaxState = true;
                        $(element).parent().css('z-index', Pzindex);
                    }
                });

                function handleDocumentClick(ev) {
                    /*if (topExpr && bottomExpr &&!isMathjaxState) {
                     renderMathJax();
                     isMathjaxState = true;
                     $(element).parent().css('z-index', Pzindex);
                     $scope.$emit('apptextarea.subdirective.render', element);
                     }
                     return;*/

                    if ($(ev.target).parents('keyboard').length || $(ev.target).parents('.keyboard').length)return;
                    if ($state.current.name.indexOf(STATE_FOR_EDIT)>-1) { //在学生端做题的页面自动进入编辑模式
                        var ionSlidePage = $(element).parents('ion-slide');//如果不是当前ionSlide就返回
                        if (ionSlidePage.length != 0 && ionSlidePage.attr('data-index') != ionSlidePage.attr('slideboxcurrentindex'))return;
                        /* if($(element).parent('app-textarea').length||$(element).parent('.pull-input-area').length) {
                         isMathjaxState=false;
                         return;
                         }*/


                        var withoutChildren = $(element).find('.fractionInputBoxTop').children('unit').length == 0 && $(element).find('.fractionInputBoxBottom').children('unit').length == 0;
                        var mathJaxParserUnit=$(element).find('span[mathjax-parser]');
                        var fracNull = !mathJaxParserUnit.length||mathJaxParserUnit.attr('value') === '\\frac{}{}';//空的mathJax
                        //var fracNull = $(element).attr('value') === '\\frac{}{}';//空的mathJax
                        ///var fracMathJaxNull = $(element).children().first().attr('value') === '\\frac{}{}';//空的mathJax
                        if (fracNull && withoutChildren) {
                            //有键盘的时候就不删除分数
                            if (keyBoardIsShow()) {
                                return;
                            }
                            var parent = $(element).parent();
                            if(parent&&parent.length){
                                angular.element(parent).scope().$emit('keyboard.del', {ele: parent, currentEle: $(element)});
                                $scope.fromElement = parent;
                                //$scope.fromElement.trigger('click');
                            }
                            return;

                        }

                        if ($(element).find('.fractionInputBoxTop').length == 0 || $(element).find('.fractionInputBoxBottom').length == 0) {
                            isMathjaxState = true;
                            return;//已经被mathjax渲染了，不再是分数形式了。
                        }

                        if (!isMathjaxState) {
                            renderMathJax();
                            isMathjaxState = true;
                            $(element).parent().css('z-index', Pzindex);
                            $scope.$emit('apptextarea.subdirective.render', element);
                        }

                    } else {
                        if (!isMathjaxState) {
                            renderMathJax();
                            isMathjaxState = true;
                            $(element).parent().css('z-index', Pzindex);
                            $scope.$emit('apptextarea.subdirective.render', element);
                        }

                    }
                }

                //$(document).on('click', handleDocumentClick);
                $(document).on('click', handleDocumentClick).trigger('click');
                $scope.$on('$destroy', function () {
                    $(document).off('click', handleDocumentClick)
                });


                element.on('click', function (ev,goNextEle) {//点击分数时显示分数编辑框
                    debugger;
                    if ($state.current.name.indexOf(STATE_FOR_EDIT)===-1||$(element).hasClass(SELECT_INPUT_FRAC))
                        return;
                    var CLICK_INSENSITIVITY_VALUE = 3;//点击不敏感的值。针对两个分数之间或者首行元素，添加光标。
                    var clickIsBefore = (ev.clientX - $(element).offset().left) <= CLICK_INSENSITIVITY_VALUE;
                    if (isMathjaxState && clickIsBefore)//已渲染并且点击分数前半部分
                        return;
                    if (isMathjaxState)
                        ev.stopPropagation();
                    if ($state.current.name.indexOf(STATE_FOR_EDIT)===-1 || $(element).parent().hasClass('comment'))
                        return;
                    try{
                        if(!goNextEle)
                            $scope.$apply(()=> {
                                addFractionEditUI();
                            });
                    }catch (e){
                        console.log(e);
                    }

                    isMathjaxState = false;
                    $(element).parent().css('z-index', 10000);
                });
            }
        }
    }]);
