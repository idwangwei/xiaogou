/**
 * Author 邓小龙 on 2015/9/23.
 * @description
 */
import directives from './../index';
import $ from'jquery';
import _each from 'lodash.foreach';
directives.directive('compileHtml', function ($compile, $log, $filter, commonConstants,verticalService) {
    'ngInject';
    return {
        restrict: "A",
        scope: {
            html: '=compileHtml', //题目内容
            currentQInput: '=',
            showType: '@',//由于先compileHtml指令公用（即做题和批改），这个类型为correct则为批改，其他则为做题
            referAnswers: '=',//输入框和答案直接映射
            possibleUnits: '='//可选的单位
        },
        replace: false,
        controller: function ($scope, $q, $timeout, $interval) {
            "ngInject";
            /**
             * 获取 element 中的内容并计算其中IMG标签的个数，并且在所有IMG都加载完毕后resolve
             * @param element
             */
            this.delectRendingImgs = function (element) {
                var $imgs = $(element).find('img')
                    , defer = $q.defer()
                    , count = 0;
                if ($imgs.length) {
                    $imgs.each(function () {
                        var interval = null, timer = null, thisImg = this;
                        interval = $interval(function () {
                            console.log('compileHTML:delectRendingImgs interval running!');
                            if (thisImg.complete == true) {
                                count++;
                                console.log('count');
                                $interval.cancel(interval);
                                $timeout.cancel(timer);
                                if (count >= $imgs.length) {
                                    defer.resolve(true);
                                }
                            }
                        }, 100);
                        timer = $timeout(function () {
                            console.log('compileHTML:delectRendingImgs timer running!');
                            count++;
                            $interval.cancel(interval);
                            if (count >= $imgs.length) {
                                defer.resolve(true);
                            }
                        }, 2000);

                    });
                } else {
                    $log.debug('no img tag in html......');
                    defer.resolve(true);
                }
                return defer.promise;
            };
            /**
             * 调用Mathjax API渲染题干中的Mathjax表达式
             */
            this.renderMathJaxExpression = function () {
                if (MathJax) {
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $scope.element[0]]);
                }
            }
        },
        link: function ($scope, ele, attrs, ctrl) {
            /* $(ele).click(function () {
             ele.append($compile('<q-correct-ans></q-correct-ans>')($scope));
             });*/
            $scope.element = ele;
            //===============================过滤MathJax表达式================================================
            if ($filter('filterExpressionContainer'))
                $scope.html = $filter('filterExpressionContainer')($scope.html);
            //===============================向html内容中添加一些指令 by 彭建伦=================================
            var $wrapper = $('<div></div>').append($scope.html);
            var $inputAreas = $wrapper.find('.input-area');
            _each($inputAreas, function (inputArea) {
                var classList = inputArea.classList.toString();
                $(inputArea).replaceWith($('<span></span>')
                    .attr('id', inputArea.id)
                    .addClass('appTextarea')
                    .addClass(classList)
                    .attr('style', $(inputArea).attr('style')));
                if (classList.indexOf('select-input-area') == -1) {
                    $(inputArea).addClass('select-input-area');
                }
            });

            //=============================如果为打钩打叉，隐藏加减图标，如果为做做题，把集合里的加减图标设为可以点击======================
            if ($scope.showType == "correct") {
                if ($wrapper.find('.set-icon').length) {
                    $wrapper.find('.set-icon').hide();
                }
            } else {
                if ($wrapper.find('.set-list').length) {
                    $wrapper.find('.set-list').attr('contenteditable', false);
                    $wrapper.find('.set-list').parent().css('display', 'none');
                    $wrapper.find('.set-edit-area').each(function () {               //初始化只显示一行
                        $(this).find('.set-list-content').eq(0).css('display', 'block');
                    });
                    $wrapper.find('.set-icon').show();
                    $wrapper.find('.set-add-icon').removeAttr('disabled').css('display', 'inline-block');
                    $wrapper.find('.set-remove-icon').removeAttr('disabled').css('display', 'inline-block');
                }
            }
            //如果小题为竖式,小题内容的container宽度为100%
            if ($wrapper.find('vertical').length){
                $wrapper.find('.layout-box').css('width','100vw')
            }

            $scope.html = $wrapper.html();

            
            //===============================为相应的输入框或者答案添加ID等===========================
            var res = $compile($scope.html)($scope);

            if ($scope.referAnswers) {
                _each($scope.referAnswers, function (inputBoxStuAns, index) {//由于后台给的referAnswers是对象数组
                    var input = $(res).find("#" + index);//找到输入框
                    if (!input) {
                        $log.error("出题bug,试题内容和参考答案所映射的输入框不匹配!输入框id:" + index);
                        return true;
                    }
                    if (!angular.element(input).length)return;
                    angular.element(input).scope().textContent.expr = inputBoxStuAns == "" ? " " : inputBoxStuAns;//赋值答案
                    /*  angular.element(input).scope().answerInfo = inputBoxStuAns;
                     */
                    if (inputBoxStuAns) { //集合类型的题
                        input.parents('.set-list-content').css('display', 'block');
                    } else {
                        input.parents('.set-list-content').css('display', 'none');
                    }
                });
            }
            if ($scope.currentQInput && $scope.currentQInput.length > 0) {
                _each($scope.currentQInput, function (spInfo) {
                    _each(spInfo.spList, function (inputBoxInfo, index) {
                        var input = $(res).find("#" + inputBoxInfo.inputBoxUuid);//找到输入框
                        if (!input) {
                            $log.error("出题bug,试题内容和答案所映射的输入框不匹配!输入框id:" + inputBoxInfo.inputBoxUuid);
                            return true;
                        }
                        // input.val(inputBoxInfo.inputBoxStuAns);//赋值答案
                        //if (inputBoxInfo.inputBoxStuAns == '')inputBoxInfo.inputBoxStuAns = ' ';
                        /*if (input.hasClass('select-input-area')) {
                         /!*   input.val(inputBoxInfo.inputBoxStuAns);*!/
                         input.text(inputBoxInfo.inputBoxStuAns);
                         } else {

                         }*/
                        if (!angular.element(input).length&&inputBoxInfo.hasOwnProperty('matrix'))return;
                        if(!$scope.referAnswers){
                            angular.element(input).scope().textContent.expr = inputBoxInfo.inputBoxStuAns == "" ? "" : inputBoxInfo.inputBoxStuAns;//赋值答案
                        }
                        if(inputBoxInfo.hasOwnProperty('matrix')){
                            angular.element(input).scope().textContent.expr=inputBoxInfo.matrix?inputBoxInfo.matrix:'';
                        }

                        //angular.element(input).scope().textContent.expr = inputBoxInfo.inputBoxStuAns == "" ? " " : inputBoxInfo.inputBoxStuAns;//赋值答案
                        angular.element(input).scope().answerInfo = spInfo.answerInfo;

                        if (inputBoxInfo.inputBoxStuAns) { //集合类型的题
                            input.parents('.set-list-content').css('display', 'block');
                        } else {
                            input.parents('.set-list-content').css('display', 'none');
                        }
                        /* var setListEle=res.find('.set-list').parent();
                         if(setListEle&&setListEle.length){
                         debugger;

                         }*/


                        input.attr("scorePointQbuId", inputBoxInfo.scorePointQbuId);//设置属性bqb得分点的主键
                        input.attr("scorePointId", spInfo.scorePointId);//设置属性bqb得分点的主键
                        if (index == 0) {//解决正常题型时，一个得分点映射多个输入框，而每一个输入框都会触发批改指令，现在给予第一个输入框才触发的条件。
                            input.attr("spListFirstChild", "true");//设置属性bqb得分点的主键
                        } else {
                            input.attr("spListFirstChild", "false");//设置属性bqb得分点的主键
                        }

                    });
                });
            }
            ele.append(res);

            //计算html中需要Mathjax渲染的个数，并在所有需要渲染的HTML都准备好过后调用渲染
            var counter = 0, total = $(res).find('.' + commonConstants.CLASS_NAME_MATHJAX_EXPRESSION_IN_Q_BODY).length;
            $scope.$on(commonConstants.RENDER_EVENT_FOR_MATHJAX_EXPRESSION_IN_Q_BODY, function () {
                counter++;
                if (counter >= total)
                    ctrl.renderMathJaxExpression();
            });

            ctrl.delectRendingImgs(ele).then(function (res) {

                if (!res)return;
                $scope.$broadcast('compileHtml.allImgRender');
            })

        }
    }
});

