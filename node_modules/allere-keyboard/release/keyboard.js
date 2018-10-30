var $=require('jquery');
var keyboard = angular.module('keyboard', []);
//testBoard
keyboard.directive('keyboard', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: "EC",
        template: require('./../templates/container.html'),
        controller: ['$scope', '$window', function ($scope, $window) {
            $scope.TOP_PANEL_LIST = {
                COMMON: 'common', //常用输入面板，包括加减乘除和数字等
                CHARACTER: 'character', //英文字母
                MARK: 'MARK',//数学符号
                SPECIAL_SYMBOL: 'specialSymbol', //特殊符号输入：分数和带分数等
                UNIT: 'unit'//单位
            };
            $scope.fractinInputMode = false; //是否是输入分数的模式

            //======================如果点击了键盘之外的某个地方，则键盘上的输入框数去焦点===================================
            $($window.document).on('click', function (ev) {
                if (!$(ev.target).parents('.keyboard').length) {
                    $scope.$broadcast('keyboard.removefocus');
                }
            });

            /**
             * 处理键盘上的数字和字母点击
             * @param ev 点击事件
             */
            $scope.handleClickNum = function (ev) {
                var $tar=$(ev.currentTarget);
                $tar.css('background','#8BC34A');
                $timeout(function(){
                    $tar.css('background','#edfffa');
                },200);
                if ($scope.currentFoucus && $scope.fractinInputMode) {
                    $scope.currentFoucus.model.val = ($scope.currentFoucus.val().toString() + $(ev.target).html());
                } else {
                    var $target = ($(ev.target).hasClass('unitItem') || $(ev.target).hasClass('item')) ? $(ev.target) : $(ev.target).parents('.unitItem , .unit');
                    var value = $target.attr('value') || $target.html();
                    $scope.$root.$broadcast('keyboard.addContent', {val: value, ele: $scope.fromElement});
                }
            };

            /**
             * 处理键盘上的删除键点击
             * @param ev 点击事件
             */
            $scope.handleDel = function (ev) {
                var $tar=$(ev.currentTarget);
                $tar.css('background','#8BC34A');
                $timeout(function(){
                    $tar.css('background','#edfffa');
                },200);
                if (!$scope.fractinInputMode || $scope.fractinInputMode == '') {
                    $scope.$root.$broadcast('keyboard.del', {ele: $scope.fromElement});
                    return;
                }
                var val = $scope.currentFoucus.val();
                if (val.length == 0)return;
                $scope.currentFoucus.model.val = (val.substr(0, val.length - 1));
            };


        }],
        link: function ($scope, element, attrs) {
            var amIclicked;
            element.hide();
            element.css({left: $window.innerWidth/2 - element.width()/2});
            $scope.unitRows = [],
                $scope.currentRow = {};
            $scope.keyboardStatus = {
                showSelectInputItem: false,
                selectInputItemList: [],
                currentTopPanel: $scope.TOP_PANEL_LIST.COMMON
            };
            $scope.$on('keyboard.show', function (evt, info) {
                element.show();
                $scope.fromElement = info.ele;
                $scope.keyboardStatus.showSelectInputItem = false;
                $scope.keyboardStatus.selectInputItemList.length = 0;

                if (info.possibleUnits) {
                    $scope.unitRows.splice(0, $scope.unitRows.length);
                    angular.forEach(info.possibleUnits, function (row) {
                        $scope.unitRows.push(row);
                    });
                    //$scope.currentRow.classification = $scope.unitRows[0].classification;
                    //$scope.currentRow.idx = 0;
                }
                if(info.wordAnswer){
                    $scope.wordAnswer=info.wordAnswer;
                }
                if (info.selectItemList) {  //需要选择型输入框
                    $scope.keyboardStatus.selectInputItemList.length = 0;
                    angular.forEach(info.selectItemList, function (item) {
                        $scope.keyboardStatus.selectInputItemList.push(item);
                    });
                    $scope.keyboardStatus.showSelectInputItem = true;
                    $timeout(function () {
                        MathJax.Hub.Queue(["Reprocess", MathJax.Hub, element[0]]);
                    }, 500);
                }

                //lw: 根据格子确定按钮上的显示
                if(info.cell){
                    let cell = info.cell;
                    $scope.keyboardStatus.vfDiv = !cell.div;
                    $scope.keyboardStatus.vfLine = !cell.line;
                    $scope.keyboardStatus.vfDot = !cell.dot;
                }
            });
            $scope.$on('keyboard.hide', function () {
                if (amIclicked)return;
                element.hide();
            });
            //=======================实现键盘拖拽========================================================================
            var pointerEventToXY = function (e) {
                var out = {x: 0, y: 0};
                if (e.type == 'touchstart' ||
                    e.type == 'touchmove' ||
                    e.type == 'touchend' ||
                    e.type == 'touchcancel') {
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    out.x = touch.pageX;
                    out.y = touch.pageY;
                } else if (e.type == 'mousedown' ||
                    e.type == 'mouseup' || e.type == 'mousemove' ||
                    e.type == 'mouseover' || e.type == 'mouseout' ||
                    e.type == 'mouseenter' || e.type == 'mouseleave') {
                    out.x = e.pageX;
                    out.y = e.pageY;
                }
                return out;
            };
            element.off('mousedown mouseup touchstart touchend touchmove click mousemove');
            $(element).on('mousedown touchstart', function (evt) {

                var timeout = null;
                amIclicked = true;
                $timeout.cancel(timeout);
                timeout = $timeout(function () {
                    amIclicked = false;
                }, 100);

                var startTime = new Date().getTime();
                var start = pointerEventToXY(evt);
                var elePos = element.position();
                var distance = {x: start.x - elePos.left, y: start.y - elePos.top};
                $($window.document).on('touchmove mousemove', function (evt) {
                    var nowTime = new Date().getTime();
                    if (nowTime - startTime < 50)return;
                    if ($(evt.target).hasClass('dragarea')
                        || $(evt.target).parents('.dragarea').length) {
                        evt.preventDefault();
                        var end = pointerEventToXY(evt);
                        var newPos = {x: end.x - distance.x, y: end.y - distance.y};
                        newPos.x < 0 ? newPos.x = 0 : '';
                        newPos.y < 0 ? newPos.y = 0 : '';
                        newPos.x > $window.innerWidth - $(element).width() ? newPos.x = $window.innerWidth - $(element).width() : '';
                        newPos.y > $window.innerHeight - $(element).height() ? newPos.y = $window.innerHeight - $(element).height() : '';
                        element.css({
                            left: newPos.x + 'px',
                            top: newPos.y + 'px'
                        });

                    }
                });
            }).on('mouseup touchend', function () {
                $($window.document).off('touchmove mousemove');
            });
        }
    }
}]);

keyboard.directive('keyboardCommon', [function () {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_common.html'),
        controller: ['$scope','$timeout', function ($scope,$timeout) {
            $scope.space = function () {
                $scope.$root.$broadcast('keyboard.addContent', {
                    val: '    ',
                    ele: $scope.fromElement
                });
            };
            $scope.enter = function (ev) {
                var $tar=$(ev.currentTarget);
                $tar.css('background','#8BC34A');
                $timeout(function(){
                    $tar.css('background','#edfffa');
                },200);
                $scope.$root.$broadcast('keyboard.addContent', {val: '\\n', ele: $scope.fromElement});
            };
            /**
             * 添加答语
             */
            $scope.handleAnswer = function () {
                $scope.$root.$broadcast('keyboard.addContent', {
                    val: '\\n',
                    ele: $scope.fromElement
                });
                $scope.$root.$broadcast('keyboard.addContent', {
                    val: '\\wordAnswer{'+$scope.wordAnswer+'}',
                    ele: $scope.fromElement
                });
            }
        }],
        link: function ($scope, element, attrs) {

        }
    }
}]);
keyboard.directive('keyboardCharacter', [function () {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_character.html'),
        controller: ['$scope', function ($scope) {
            $scope.characterStatus = 1;
            $scope.toCase = function () {
                var $character = $('.keyboardCharacter .itemRow .item');
                if ($scope.characterStatus == 1) {     //大小写转换
                    $character.each(function (i) {
                        if (i <= 26) {
                            $(this).html($(this).html().toLowerCase());
                        }
                    });
                    $scope.characterStatus = 0;
                } else {
                    $character.each(function (i) {
                        if (i <= 26) {
                            $(this).html($(this).html().toUpperCase());
                        }
                    });
                    $scope.characterStatus = 1;
                }
            };

        }],
        link: function ($scope, element, attrs) {

        }
    }
}]);

keyboard.directive('keyboardMark', ['$timeout', function ($timeout) {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_mark.html'),
        controller: ['$scope', function ($scope) {
            /**
             *
             * @param mode [fraction1|fraction2]
             */
            $scope.handleClickFractionInput = function (mode) {
                $scope.$root.$broadcast('keyboard.addContent', {val: '\\frac{1}{2}', ele: $scope.fromElement});
            };
        }],
        link: function ($scope, element, attrs) {

        }
    }
}]);

keyboard.directive('keyboardUnit', [function () {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_unit.html'),
        controller: ['$scope', function ($scope) {
            function getCurrentIndex() {
                var rt = 0;
                angular.forEach($scope.unitRows, function (unit, idx) {
                    if ($scope.currentRow.classification == unit.classification)rt = idx;
                });
                return rt;
            }

            $scope.prevClassifySelect = function () {
                var curIdx = getCurrentIndex();
                if (curIdx == 0)return;
                $scope.currentRow.idx = curIdx - 1;
                $scope.currentRow.classification = $scope.unitRows[curIdx - 1].classification;
                setTimeout(function () {
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $scope.element[0]]);
                }, 1)
            };
            $scope.nextClassifySelect = function () {
                var curIdx = getCurrentIndex();
                if (curIdx == $scope.unitRows.length - 1)return;
                $scope.currentRow.idx = curIdx + 1;
                $scope.currentRow.classification = $scope.unitRows[curIdx + 1].classification;
                setTimeout(function () {
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $scope.element[0]]);
                }, 1)
            }
        }],
        link: function ($scope, element, attrs) {
            $scope.element = element;
        }
    }
}]);
var module = angular.module("keyboard");module.run(["$templateCache",function($templateCache){  'use strict';

  $templateCache.put('templates/container.html',
    "<!--<div class=\"fractionInputContainer\" style=\"display: flex;display: -webkit-flex\" ng-if=\"fractinInputMode!=''\">-->\n" +
    "    <!--<div style=\"flex: 4;border-right: 1px solid #DDDDDD\" >-->\n" +
    "        <!--<div class=\"content\" ng-if=\"fractinInputMode=='fraction1'\">-->\n" +
    "            <!--<input type=\"text\"-->\n" +
    "                   <!--ng-model=\"fraction1Model.top.val\"-->\n" +
    "                   <!--ng-click=\"focusInput($event)\"-->\n" +
    "                   <!--id=\"fraction1InputTop\"-->\n" +
    "                   <!--ng-class=\"fraction1Model.top.isFocused?'inputFocus':''\"-->\n" +
    "                   <!--readonly>-->\n" +
    "\n" +
    "            <!--<div class=\"fractionSeparator\"></div>-->\n" +
    "            <!--<input type=\"text\"-->\n" +
    "                   <!--ng-model=\"fraction1Model.bottom.val\"-->\n" +
    "                   <!--id=\"fraction1InputBottom\"-->\n" +
    "                   <!--ng-click=\"focusInput($event)\"-->\n" +
    "                   <!--ng-class=\"fraction1Model.bottom.isFocused?'inputFocus':''\"-->\n" +
    "                   <!--readonly>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"content\" ng-if=\"fractinInputMode=='fraction2'\"-->\n" +
    "             <!--style=\"display: flex;display: -webkit-flex;align-items: center\">-->\n" +
    "            <!--<div class=\"leftSide\" style=\"flex: 1\">-->\n" +
    "                <!--<input type=\"text\"-->\n" +
    "                       <!--ng-model=\"fraction2Model.left.val\"-->\n" +
    "                       <!--id=\"fraction2InputLeft\"-->\n" +
    "                       <!--ng-click=\"focusInput($event)\"-->\n" +
    "                       <!--ng-class=\"fraction2Model.left.isFocused?'inputFocus':''\"-->\n" +
    "                       <!--readonly/>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--<div class=\"rightSide\" style=\"flex: 1\">-->\n" +
    "                <!--<input type=\"text\"-->\n" +
    "                       <!--ng-model=\"fraction2Model.top.val\"-->\n" +
    "                       <!--id=\"fraction2InputTop\"-->\n" +
    "                       <!--ng-click=\"focusInput($event)\"-->\n" +
    "                       <!--ng-class=\"fraction2Model.top.isFocused?'inputFocus':''\"-->\n" +
    "                       <!--readonly>-->\n" +
    "\n" +
    "                <!--<div class=\"fractionSeparator\"></div>-->\n" +
    "                <!--<input type=\"text\"-->\n" +
    "                       <!--ng-model=\"fraction2Model.bottom.val\"-->\n" +
    "                       <!--id=\"fraction2InputBottom\"-->\n" +
    "                       <!--ng-click=\"focusInput($event)\"-->\n" +
    "                       <!--ng-class=\"fraction2Model.bottom.isFocused?'inputFocus':''\"-->\n" +
    "                       <!--readonly>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--<div style=\"flex: 1;text-align: center;margin-top: 30px\">-->\n" +
    "        <!--<button style=\"margin: 5px\" ng-click=\"hideFractionInputPanel()\">取消</button>-->\n" +
    "        <!--<button style=\"margin: 5px\" ng-click=\"handlePressOk()\">完成</button>-->\n" +
    "    <!--</div>-->\n" +
    "<!--</div>-->\n" +
    "<!--<div class=\"dragarea\">-->\n" +
    "    <!--点此拖动-->\n" +
    "<!--</div>-->\n" +
    "\n" +
    "<!--<div class=\"switcher\">-->\n" +
    "    <!--<span ng-class=\"currentTopPanel==TOP_PANEL_LIST.COMMON?'switcherItem active':'switcherItem'\"-->\n" +
    "          <!--ng-click=\"currentTopPanel=TOP_PANEL_LIST.COMMON\">常用</span>-->\n" +
    "    <!--&lt;!&ndash;<span ng-class=\"currentTopPanel==TOP_PANEL_LIST.CHARACTER?'switcherItem active':'switcherItem'\"&ndash;&gt;-->\n" +
    "    <!--&lt;!&ndash;ng-click=\"currentTopPanel=TOP_PANEL_LIST.CHARACTER\">字母</span>&ndash;&gt;-->\n" +
    "    <!--<span ng-class=\"currentTopPanel==TOP_PANEL_LIST.MARK?'switcherItem active':'switcherItem'\"-->\n" +
    "          <!--ng-click=\"currentTopPanel=TOP_PANEL_LIST.MARK\">更多</span>-->\n" +
    "    <!--&lt;!&ndash;<span ng-class=\"currentTopPanel==TOP_PANEL_LIST.SPECIAL_SYMBOL?'switcherItem active':'switcherItem'\"&ndash;&gt;-->\n" +
    "          <!--&lt;!&ndash;ng-click=\"currentTopPanel=TOP_PANEL_LIST.SPECIAL_SYMBOL\">特殊</span>&ndash;&gt;-->\n" +
    "    <!--<span ng-class=\"currentTopPanel==TOP_PANEL_LIST.UNIT?'switcherItem active':'switcherItem'\"-->\n" +
    "          <!--ng-click=\"currentTopPanel=TOP_PANEL_LIST.UNIT\">单位</span>-->\n" +
    "\n" +
    "<!--</div>-->\n" +
    "<!--<div class=\"keyboardContent\">-->\n" +
    "    <!--<div class=\"keyboardCommon\"-->\n" +
    "         <!--keyboard-common-->\n" +
    "         <!--ng-show=\"currentTopPanel==TOP_PANEL_LIST.COMMON\"></div>-->\n" +
    "    <!--<div class=\"keyboardSpecial\"-->\n" +
    "         <!--keyboard-special-->\n" +
    "         <!--ng-show=\"currentTopPanel==TOP_PANEL_LIST.SPECIAL_SYMBOL\">-->\n" +
    "    <!--</div>-->\n" +
    "    <!--<div class=\"keyboardMark\"-->\n" +
    "         <!--keyboard-mark-->\n" +
    "         <!--ng-show=\"currentTopPanel==TOP_PANEL_LIST.MARK\">-->\n" +
    "    <!--</div>-->\n" +
    "    <!--<div class=\"keyboardCharacter\"-->\n" +
    "         <!--keyboard-character-->\n" +
    "         <!--ng-show=\"currentTopPanel==TOP_PANEL_LIST.CHARACTER\">-->\n" +
    "    <!--</div>-->\n" +
    "    <!--<div class=\"keyboardUnit\"-->\n" +
    "         <!--keyboard-unit-->\n" +
    "         <!--ng-show=\"currentTopPanel==TOP_PANEL_LIST.UNIT\">-->\n" +
    "    <!--</div>-->\n" +
    "<!--</div>-->\n" +
    "\n" +
    "\n" +
    "<div class=\"dragarea\">\n" +
    "    点此拖动\n" +
    "    {{currentTopPanel}}\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"switcher\" ng-if=\"!keyboardStatus.showSelectInputItem\">\n" +
    "    <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.COMMON?'switcherItem active':'switcherItem'\"\n" +
    "          ng-click=\"keyboardStatus.currentTopPanel=TOP_PANEL_LIST.COMMON\">常用</span>\n" +
    "    <!--<span ng-class=\"currentTopPanel==TOP_PANEL_LIST.CHARACTER?'switcherItem active':'switcherItem'\"-->\n" +
    "    <!--ng-click=\"currentTopPanel=TOP_PANEL_LIST.CHARACTER\">字母</span>-->\n" +
    "    <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.MARK?'switcherItem active':'switcherItem'\"\n" +
    "    ng-click=\"keyboardStatus.currentTopPanel=TOP_PANEL_LIST.MARK\">更多</span>\n" +
    "    <!--<span ng-class=\"currentTopPanel==TOP_PANEL_LIST.SPECIAL_SYMBOL?'switcherItem active':'switcherItem'\"-->\n" +
    "    <!--ng-click=\"currentTopPanel=TOP_PANEL_LIST.SPECIAL_SYMBOL\">特殊</span>-->\n" +
    "    <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.UNIT?'switcherItem active':'switcherItem'\"\n" +
    "          ng-click=\"keyboardStatus.currentTopPanel=TOP_PANEL_LIST.UNIT\">单位</span>\n" +
    "\n" +
    "</div>\n" +
    "<!--选择型输入框的选择区域 start-->\n" +
    "<div class=\"keyboardContent\" ng-if=\"keyboardStatus.showSelectInputItem\">\n" +
    "    <div class=\"keyboardUnit\">\n" +
    "        <div class=\"unitSelect\" >\n" +
    "            <div class=\"unitItem\" ng-click=\"handleClickNum($event)\" ng-repeat=\"item in keyboardStatus.selectInputItemList\" value=\"{{item}}\">\n" +
    "                <span mathjax-parser value=\"{{item}}\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"item\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">删除</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!--选择型输入框的选择区域 end-->\n" +
    "\n" +
    "<div class=\"keyboardContent\" ng-if=\"!keyboardStatus.showSelectInputItem\">\n" +
    "    {{currentTopPanel}}\n" +
    "    <div class=\"keyboardCommon\"\n" +
    "         keyboard-common\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.COMMON\"></div>\n" +
    "    <div class=\"keyboardMark\"\n" +
    "      keyboard-mark\n" +
    "      ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.MARK\">\n" +
    "    </div>\n" +
    "    <div class=\"keyboardCharacter\"\n" +
    "         keyboard-character\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.CHARACTER\">\n" +
    "    </div>\n" +
    "    <div class=\"keyboardUnit\"\n" +
    "         keyboard-unit\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.UNIT\">\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/keyboard_character.html',
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">A</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">B</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">C</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">D</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">E</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">F</div>\n" +
    "</div>\n" +
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">G</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">H</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">I</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">J</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">K</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">L</div>\n" +
    "</div>\n" +
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">M</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">N</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">O</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">P</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">Q</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">R</div>\n" +
    "</div>\n" +
    "<div class=\"itemRow\">\n" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">S</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">T</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">U</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">V</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">W</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">X</div>\n" +
    "</div>\n" +
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">Y</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">Z</div>\n" +
    "    <div class=\"item\" style=\"flex: 2\" ng-click=\"toCase()\">大小写</div>\n" +
    "    <div class=\"item\" style=\"flex: 2\" ng-click=\"handleDel($event)\">删除</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/keyboard_common.html',
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\"  value=\"\">+</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\"  value=\"\">1</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\"  value=\"\">2</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\"  value=\"\">3</div>\n" +
    "</div>\n" +
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">-</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">4</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">5</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">6</div>\n" +
    "</div>\n" +
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\times\">×</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">7</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">8</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">9</div>\n" +
    "</div>\n" +
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\div\">÷</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">(</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">)</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">0</div>\n" +
    "</div>\n" +
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">.</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\lt\">＜</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\gt\">＞</div>\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" >=</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"itemRow\">\n" +
    "    <div class=\"item\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">删除</div>\n" +
    "    <!--<div class=\"item\" ng-click=\"space($event)\">空格</div>-->\n" +
    "    <div class=\"item\" ng-click=\"handleAnswer($event)\" ng-if=\"wordAnswer\">答</div>\n" +
    "    <div class=\"item\" ng-click=\"enter($event)\" style=\"color: #fe6948;\">换行</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/keyboard_mark.html',
    "<div class=\"itemRow\">\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\lbrace\">{</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\rbrace\">}</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\le\">≤</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\ge\">≥</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"itemRow\">\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\neq\">≠</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\approx\">≈</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\%\">%</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">℃</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"itemRow\">\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item\" ng-click=\"handleClickFractionInput('fraction1')\">\r" +
    "\n" +
    "            <img src=\"images/fraction1.png\" width=\"28px\"/>\r" +
    "\n" +
    "            <span>分数</span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--<div class=\"itemRow\">-->\r" +
    "\n" +
    "        <!--<div class=\"item\" ng-click=\"handleClickFractionInput('fraction2')\">-->\r" +
    "\n" +
    "            <!--<img src=\"images/fraction2.png\" width=\"38px\">-->\r" +
    "\n" +
    "            <!--<span>带分数</span>-->\r" +
    "\n" +
    "        <!--</div>-->\r" +
    "\n" +
    "    <!--</div>-->\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\pi\">π</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\remain\">余</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"°\">度数</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"itemRow\">\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\cdot\">点乘</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\var{x}\">变量x</div>\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\var{y}\">变量y</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"itemRow\">\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">删除</div>\r" +
    "\n" +
    "    <!--<div class=\"item\" ng-click=\"space($event)\">空格</div>-->\r" +
    "\n" +
    "    <div class=\"item\" ng-click=\"enter($event)\" style=\"color: #fe6948;\">换行</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('templates/keyboard_special.html',
    "<div class=\"left\">\n" +
    "    <div class=\"fractionContainer\" ng-if=\"currentPanel==PANEL_LIST.FRACTION1\">\n" +
    "        <input type=\"text\"\n" +
    "               ng-model=\"fraction1Model.top.val\"\n" +
    "               ng-click=\"focusInput($event)\"\n" +
    "               id=\"fraction1InputTop\"\n" +
    "               ng-class=\"fraction1Model.top.isFocused?'inputFocus':''\"\n" +
    "               readonly>\n" +
    "\n" +
    "        <div class=\"fractionSeparator\"></div>\n" +
    "        <input type=\"text\"\n" +
    "               ng-model=\"fraction1Model.bottom.val\"\n" +
    "               id=\"fraction1InputBottom\"\n" +
    "               ng-click=\"focusInput($event)\"\n" +
    "               ng-class=\"fraction1Model.bottom.isFocused?'inputFocus':''\"\n" +
    "               readonly>\n" +
    "    </div>\n" +
    "    <div class=\"fractionContainer2\" ng-if=\"currentPanel==PANEL_LIST.FRACTION2\">\n" +
    "        <div class=\"leftSide\">\n" +
    "            <input type=\"text\"\n" +
    "                   ng-model=\"fraction2Model.left.val\"\n" +
    "                   id=\"fraction2InputLeft\"\n" +
    "                   ng-click=\"focusInput($event)\"\n" +
    "                   ng-class=\"fraction2Model.left.isFocused?'inputFocus':''\"\n" +
    "                   readonly/>\n" +
    "        </div>\n" +
    "        <div class=\"rightSide\">\n" +
    "            <input type=\"text\"\n" +
    "                   ng-model=\"fraction2Model.top.val\"\n" +
    "                   id=\"fraction2InputTop\"\n" +
    "                   ng-click=\"focusInput($event)\"\n" +
    "                   ng-class=\"fraction2Model.top.isFocused?'inputFocus':''\"\n" +
    "                   readonly>\n" +
    "\n" +
    "            <div class=\"fractionSeparator\"></div>\n" +
    "            <input type=\"text\"\n" +
    "                   ng-model=\"fraction2Model.bottom.val\"\n" +
    "                   id=\"fraction2InputBottom\"\n" +
    "                   ng-click=\"focusInput($event)\"\n" +
    "                   ng-class=\"fraction2Model.bottom.isFocused?'inputFocus':''\"\n" +
    "                   readonly>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"right\">\n" +
    "    <div ng-show=\"!currentFoucus\">\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\" ng-click=\"currentPanel=PANEL_LIST.FRACTION1;fractinInputMode=true\">\n" +
    "                <img src=\"images/fraction1.png\" width=\"28px\"/>\n" +
    "                <span>分数</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\" ng-click=\"currentPanel=PANEL_LIST.FRACTION2;fractinInputMode=true\">\n" +
    "                <img src=\"images/fraction2.png\" width=\"38px\">\n" +
    "                <span>带分数</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\">\n" +
    "                <img src=\"images/radicals.png\" width=\"35px\"/>\n" +
    "                <span>根号</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\"><img src=\"images/log.png\" width=\"30px\"/></div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\"><img src=\"images/ln.png\" width=\"32px\"/></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"currentFoucus\">\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">1</div>\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">2</div>\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">3</div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">4</div>\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">5</div>\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">6</div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">7</div>\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">8</div>\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">9</div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\" style=\"flex: 2\">0</div>\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">.</div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\" ng-click=\"handleDel($event)\">删除</div>\n" +
    "            <div class=\"item\" ng-click=\"handlePressOk()\" style=\"flex: 2\">确定</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/keyboard_unit.html',
    "<div class=\"unitSelect\" >\r" +
    "\n" +
    "    <div class=\"unitItem\" ng-click=\"handleClickNum($event)\" ng-repeat=\"unit in unitRows\" value=\"{{unit}}\" unit>\r" +
    "\n" +
    "        <span mathjax-parser value=\"unit\" lazy-compile=\"true\"></span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );
}])