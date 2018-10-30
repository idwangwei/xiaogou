import $ from 'jquery';
import _ from 'underscore';
let keyboard = angular.module('keyboard', []);
class KeyboardController {
    constructor($scope, $timeout, $window) {
        "ngInject";
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$window = $window;
        this.height = null; //键盘高度
        this.$element = null; //键盘指令元素
        this.ADDITION_PURE_WORDS = ['解', ':', '设', '为', '\\var{x}','则','有', '总', '一', '共' ,'之','和', '平', '均', '每','第', '个', '数']; //附加到键盘头部的文字内容
        this.ADDITION_PURE_WORDS2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '-', '×', '÷','因','为','所','以','最','比', '大', '小', '多', '少','先','后','把', '分', '组',  '\\var{y}'];//附加到键盘尾部的文字内容
        $scope.INPUT_BOX_TYPE={
            VARIABLE_INPUT_AREA:'variable-input-area',  //字母型输入框
            VARIABLE_SOLVE_INPUT_AREA:'variable-solve-input-area'
        };
        $scope.pureWordsList = [];
        $scope.TOP_PANEL_LIST = {
            COMMON: 'common', //常用输入面板，包括加减乘除和数字等
            CHARACTER: 'character', //英文字母
            MARK: 'MARK',//数学符号
            SPECIAL_SYMBOL: 'specialSymbol', //特殊符号输入：分数和带分数等
            UNIT: 'unit',//单位
            WORD: 'word'//文字
        };
        $scope.fractinInputMode = false; //是否是输入分数的模式

        /**
         * 处理键盘上的数字和字母点击
         * @param ev 点击事件
         */
        $scope.handleClickNum = function (ev,str) {
            var $tar = $(ev.currentTarget);
            if(str==='comment'){
                $tar.addClass('key-active-100');
                $tar.removeClass('greenItem');
                $timeout(function(){
                    $tar.addClass('greenItem');
                    $tar.removeClass('key-active-100');
                },200);
            }else{
                $tar.addClass('key-active');
                $timeout(function(){
                    $tar.removeClass('key-active');
                },200);
            }
            if ($scope.currentFoucus && $scope.fractinInputMode) {
                $scope.currentFoucus.model.val = ($scope.currentFoucus.val().toString() + $(ev.target).html());
            } else {
                var $target = ($(ev.currentTarget).hasClass('unitItem') || $(ev.currentTarget).hasClass('item')) ? $(ev.currentTarget) : $(ev.currentTarget).parents('.unitItem , .unit');
                var value = $target.attr('value') || $target.html();
                $scope.fromElement.scope().$emit('keyboard.addContent', {val: value, ele: $scope.fromElement});
                if (value == '\\comment{}')
                    $timeout(function () {
                        $scope.fromElement.scope().$broadcast('keyboard.comment.focus', {ele: $scope.fromElement});
                    });
            }
        };

        /**
         * 处理键盘上的删除键点击
         * @param ev 点击事件
         */
        $scope.handleDel = function (ev) {
            var $tar = $(ev.currentTarget);
            $tar.addClass('key-active-100');
            $tar.removeClass('greenItem');
            $timeout(function(){
                $tar.addClass('greenItem');
                $tar.removeClass('key-active-100');
            },200);
            if (!$scope.fractinInputMode || $scope.fractinInputMode == '') {
                if($scope.fromElement.hasClass('fractionInputBoxTop')||$scope.fromElement.hasClass('fractionInputBoxBottom')){
                    if($scope.fromElement.children('unit').length==0){
                        var fracEle=$scope.fromElement.parent();//解决分数删除
                        var removeFlag=fracEle.find('.fractionInputBoxTop').children('unit').length==0&&fracEle.find('.fractionInputBoxBottom').children('unit').length==0;
                        if(removeFlag){
                            var parent=fracEle.parent();
                            parent.scope().$emit('keyboard.del', {ele: parent,currentEle:fracEle});
                            $scope.fromElement=parent;
                            $scope.fromElement.trigger('click');
                            return;
                        }
                    }
                }
                if($scope.fromElement.hasClass('comment')&&$scope.fromElement.children('unit').length==0){//题设信息已空的情况
                    var commentEle=$scope.fromElement.parent();
                    var parent=commentEle.parent();
                    $scope.fromElement.scope().$emit('keyboard.done', {ele:commentEle});
                    parent.scope().$emit('keyboard.del', {ele: parent,currentEle:commentEle});
                    $scope.fromElement=parent;

                    //$scope.fromElement.scope().$emit('keyboard.show', {ele: $scope.fromElement});
                    return;
                }
                $scope.fromElement.scope().$emit('keyboard.del', {ele: $scope.fromElement});
                return;
            }
            var val = $scope.currentFoucus.val();
            if (val.length == 0)return;
            $scope.currentFoucus.model.val = (val.substr(0, val.length - 1));
        };
        /**
         * 处理步骤说明框的“done”的点击
         * @param ev 点击事件
         */
        $scope.handleClickCommentDone = function (ev) {
            var $tar = $(ev.currentTarget);
            $tar.addClass('key-active-100');
            $tar.removeClass('greenItem');
            $timeout(function(){
                $tar.addClass('greenItem');
                $tar.removeClass('key-active-100');
                $scope.fromElement.scope().$emit('keyboard.done', {ele: $scope.fromElement});
            },200);

        };
        /**
         * 查找下一个输入
         */
        $scope.findNextInput = function (ev) {
            ev.stopPropagation();
            var $tar = $(ev.currentTarget);
            $tar.addClass('key-active-100');
            $tar.removeClass('greenItem');
            $timeout(function(){
                $tar.addClass('greenItem');
                $tar.removeClass('key-active-100');
            },200);
            $scope.fromElement.scope().$emit('keyboard.findNextInput', {
                val: '',
                ele: $scope.fromElement
            });
        }
    }

    /**
     * 显示键盘
     * @param scope
     * @param keyboardEle 键盘DOM元素
     */
    show(scope, keyboardEle) {
        this.setHeight();
        $(keyboardEle).css({width: '100%'}).show();
    }

    /**
     * 隐藏键盘
     * @param keyboardEle
     */
    hide(keyboardEle) {
        $(keyboardEle).hide();
    }

    /**
     * 设置键盘的高度
     * @param useWidth 屏幕旋转时去宽度
     */
    setHeight(useWidth) {
        useWidth = useWidth && !this.$scope.$root.platform.IS_IPHONE && !this.$scope.$root.platform.IS_IPAD;
        var me = this;
        me.height = useWidth ? window.innerWidth * 0.462 : window.innerHeight * 0.462;
        me.$element.css('height', me.height + 'px');
    }

    /**
     * 设置屏幕旋转事件的Listener
     * @param fn
     */
    setOrientationchangeListener(fn) {
        $(this.$window).on('orientationchange', fn);
    }

    /**
     * 移除屏幕旋转事件的Listener
     * @param fn
     */
    removeOrientationchangeListener(fn) {
        $(this.$window).off('orientationchange', fn);
    }

    /**
     * 屏幕旋转时的处理函数
     */
    orientationchangeFn() {
        this.setHeight(true);
        console.log('setHeight:' + this.height);
    }

    /**
     * 清理一些显示信息
     */
    clearKeyboardInfo() {
        this.$scope.wordAnswer = null;//清空答案串
        this.$scope.keyboardStatus.showSelectInputItem = false;
        this.$scope.keyboardStatus.selectInputItemList.length = 0;
        this.$scope.pureWordsList.length = 0;
        if (this.$scope.keyboardStatus.currentTopPanel == this.$scope.TOP_PANEL_LIST.WORD ||this.$scope.keyboardStatus.currentTopPanel==this.$scope.TOP_PANEL_LIST.CHARACTER)
            this.$scope.keyboardStatus.currentTopPanel = this.$scope.TOP_PANEL_LIST.COMMON
    }
}
KeyboardController.$inject = ["$scope", "$timeout", "$window"];
class KeyboardCommonController {
    constructor($scope, $timeout) {
        "ngInject";
        this.$scope = $scope;
        this.selfHeight = null;
        this.$element = null;
        this.keyboardCtrl = null; //keyboard指令的Controller
        /**
         * 添加空格
         */
        $scope.space = function () {
            $scope.fromElement.scope().$emit('keyboard.addContent', {
                val: '    ',
                ele: $scope.fromElement
            });
        };
        /**
         * 换行
         * @param ev
         */
        $scope.enter = function (ev) {
            var $tar = $(ev.currentTarget);
            $tar.addClass('key-active-100');
            $tar.removeClass('greenItem');
            $timeout(function(){
                $tar.addClass('greenItem');
                $tar.removeClass('key-active-100');
            },200);
            $scope.fromElement.scope().$emit('keyboard.addContent', {val: '\\n', ele: $scope.fromElement});
        };
        /**
         * 添加答语
         */
        $scope.handleAnswer = function (ev) {
            var $tar = $(ev.currentTarget);
            $tar.addClass('key-active-100');
            $tar.removeClass('greenItem');
            $timeout(function(){
                $tar.addClass('greenItem');
                $tar.removeClass('key-active-100');
            },200);
            $scope.fromElement.scope().$emit('keyboard.addContent', {
                val: '\\n',
                ele: $scope.fromElement
            });
            $scope.fromElement.scope().$emit('keyboard.addContent', {
                val: '\\wordAnswer{' + $scope.wordAnswer + '}',
                ele: $scope.fromElement
            });
        }

        /**
         * 查找下一个输入
         */
        $scope.findNextInput = function (ev) {
            ev.stopPropagation();
            var $tar = $(ev.currentTarget);
            $tar.addClass('key-active-100');
            $tar.removeClass('greenItem');
            $timeout(function(){
                $tar.addClass('greenItem');
                $tar.removeClass('key-active-100');
            },200);
            $scope.fromElement.scope().$emit('keyboard.findNextInput', {
                val: '',
                ele: $scope.fromElement
            });
        }
    }

    /**
     * 设置键盘的高度设置内容的高度
     */
    setSelfHeight(useWidth) {
        useWidth = useWidth && !this.$scope.$root.platform.IS_IPHONE && !this.$scope.$root.platform.IS_IPAD;
        var me = this;
        me.selfHeight = useWidth ? window.innerWidth * 0.4 * 6 / 7 - 4 : window.innerHeight * 0.4 * 6 / 7 - 4;
        me.$element.css('height', me.selfHeight + 'px');
    }

    /**
     * 屏幕旋转时的处理函数
     */
    orientationchangeFn() {
        this.setSelfHeight(true);
        console.log('setHeight:' + this.selfHeight);
    }


}
KeyboardCommonController.$inject = ["$scope", "$timeout"];
class KeyboardMarkController {
    constructor($scope) {
        "ngInject";
        this.$scope = $scope;
        /**
         *
         * @param mode [fraction1|fraction2]
         */
        $scope.handleClickFractionInput = function (ev,mode) {
            $scope.fromElement.scope().$emit('keyboard.addContent', {val: '\\frac{}{}', ele: $scope.fromElement});
            $scope.keyboardStatus.currentTopPanel = $scope.TOP_PANEL_LIST.COMMON;
        };
    }

    /**
     * 设置键盘的高度设置内容的高度
     */
    setSelfHeight(useWidth) {
        useWidth = useWidth && !this.$scope.$root.platform.IS_IPHONE && !this.$scope.$root.platform.IS_IPAD;
        var me = this;
        me.selfHeight = useWidth ? window.innerWidth * 0.4 * 6 / 7 - 4 : window.innerHeight * 0.4 * 6 / 7 - 4;
        me.$element.css('height', me.selfHeight + 'px');
    }

    /**
     * 屏幕旋转时的处理函数
     */
    orientationchangeFn() {
        this.setSelfHeight(true);
        console.log('setHeight:' + this.selfHeight);
    }
}
KeyboardMarkController.$inject = ['$scope'];
class KeyboardUnitController {
    constructor($scope) {
        "ngInject";
        this.$scope = $scope;
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
    }

    /**
     * 设置键盘的高度设置内容的高度
     */
    setSelfHeight(useWidth) {
        useWidth = useWidth && !this.$scope.$root.platform.IS_IPHONE && !this.$scope.$root.platform.IS_IPAD;
        var me = this;
        me.selfHeight = useWidth ? window.innerWidth * 0.4 * 6 / 7 - 4 : window.innerHeight * 0.4 * 6 / 7 - 4;
        me.$element.css('height', me.selfHeight + 'px');
    }

    /**
     * 屏幕旋转时的处理函数
     */
    orientationchangeFn() {
        this.setSelfHeight(true);
        console.log('setHeight:' + this.selfHeight);
    }
}
KeyboardUnitController.$inject = ['$scope'];
class KeyboardWordController {
    constructor($scope) {
        this.$scope = $scope;
    }

    /**
     * 设置键盘的高度设置内容的高度
     */
    setSelfHeight(useWidth) {
        useWidth = useWidth && !this.$scope.$root.platform.IS_IPHONE && !this.$scope.$root.platform.IS_IPAD;
        var me = this;
        me.selfHeight = useWidth ? window.innerWidth * 0.4 * 6 / 7 - 4 : window.innerHeight * 0.4 * 6 / 7 - 4;
        me.$element.css('height', me.selfHeight + 'px');
    }

    /**
     * 屏幕旋转时的处理函数
     */
    orientationchangeFn() {
        this.setSelfHeight(true);
        console.log('setHeight:' + this.selfHeight);
    }
}
KeyboardWordController.$inject = ['$scope'];

class KeyboardSelectController {
    constructor($scope) {
        this.$scope = $scope;
    }

    /**
     * 设置键盘的高度设置内容的高度
     */
    setSelfHeight(useWidth) {
        useWidth = useWidth && !this.$scope.$root.platform.IS_IPHONE && !this.$scope.$root.platform.IS_IPAD;
        var me = this;
        me.selfHeight = useWidth ? window.innerWidth * 0.4 * 6 / 7 - 4 : window.innerHeight * 0.4 * 6 / 7 - 4;
        me.$element.css('height', me.selfHeight + 'px');
    }

    /**
     * 屏幕旋转时的处理函数
     */
    orientationchangeFn() {
        this.setSelfHeight(true);
        console.log('setHeight:' + this.selfHeight);
    }
}
KeyboardSelectController.$inject = ['$scope'];

keyboard.controller('keyboardCtrl', KeyboardController);
keyboard.controller('keyboardCommonCtrl', KeyboardCommonController);
keyboard.controller('keyboardMarkCtrl', KeyboardMarkController);
keyboard.controller('keyboardUnitCtrl', KeyboardUnitController);
keyboard.controller('keyboardWordCtrl', KeyboardWordController);
keyboard.controller('keyboardSelectCtrl',KeyboardSelectController);
keyboard.directive('keyboard', function ($window, $timeout, $log) {
    "ngInject";
    return {
        restrict: "EC",
        template: require('./../templates/container.html'),
        controller: 'keyboardCtrl as ctrl',
        link: function ($scope, element, attrs) {
            var ctrl = $scope.ctrl;
            ctrl.$element = $(element);
            //屏幕方向改变时重新设定高度
            var orientationchangeFn = ctrl.orientationchangeFn.bind(ctrl);
            ctrl.setOrientationchangeListener(orientationchangeFn);
            $scope.$on('$destroy', function () {
                ctrl.removeOrientationchangeListener(orientationchangeFn);
            });


            var amIclicked;
            $scope.ctrl.hide(element);
            $scope.unitRows = [],
                $scope.currentRow = {};
            $scope.keyboardStatus = {
                showSelectInputItem: false,
                selectInputItemList: [],
                currentTopPanel: $scope.TOP_PANEL_LIST.COMMON
            };
            $scope.setCurrentTopPanel = function (panel, ev) {
                $scope.keyboardStatus.currentTopPanel = panel;
                ev.stopPropagation();
            };
            $scope.hide=function(){
                $scope.ctrl.hide(element);
            };
            /**
             * 将一位数组转变成二维数组
             * @param array 传入的一位数组
             * @param colCount  列划分点
             * @returns 二维数组
             */
            function getRowColArray(array, colCount) {
                var rowArray = [];//行数组
                var colArray = [];//列数组
                if (!array || array.length == 0) {//空数组不处理
                    $log.error("array:是空数组!");
                    return rowArray;
                }
                if (!colCount) {
                    $log.error("列索引为空!");
                    return rowArray;
                }
                if (isNaN(colCount)) {
                    $log.error("列索引不正确!");
                    return rowArray;
                }
                for (var i = 0; i < array.length; i++) {
                    if (i == 0 || i % colCount != 0) {
                        colArray.push(array[i]);
                    } else {
                        rowArray.push(colArray);
                        colArray = [];//清空列数组
                        colArray.push(array[i]);
                    }
                }
                if (colArray.length != 0) {
                    rowArray.push(colArray);
                }
                return rowArray;
            }
            function isNomarInput(currentEle){
                if(currentEle.hasClass("fractionInputBoxBottom")||$scope.fromElement.hasClass("fractionInputBoxTop"))
                    currentEle=currentEle.parent().parent();
                if(currentEle.hasClass('pull-input-area')||currentEle.hasClass('variable-solve-input-area')||currentEle.parents('app-textarea').length
                   ||currentEle.is('app-textarea')||currentEle.parents('.set-edit-area').length||currentEle.hasClass("comment")){
                    return false;
                }

                return true;
            }

            $scope.$on('keyboard.show', function (evt, info) {
                ctrl.show($scope, element);
                ctrl.clearKeyboardInfo();
                $scope.fromElement = info.ele;
                $scope.keyboardStatus.isAppTextarea = info.isAppTextarea;//是否是应用题框
                $scope.keyboardStatus.isCommentBox = $scope.fromElement.is('.comment');
                $scope.keyboardStatus.isCharacterBox = $scope.fromElement.is('.'+$scope.INPUT_BOX_TYPE.VARIABLE_INPUT_AREA);
                $scope.keyboardStatus.isVariableSolveBox=$scope.fromElement.parents('.'+$scope.INPUT_BOX_TYPE.VARIABLE_SOLVE_INPUT_AREA).length&&$scope.fromElement.is('.comment');
                $scope.showFracTop=false;
                $scope.showFracBottom=false;
                if($scope.fromElement.hasClass("fractionInputBoxBottom")){//如果当前是处于分子的最末尾
                   $scope.showFracTop=false;
                   $scope.showFracBottom=true;
                }
                if($scope.fromElement.hasClass("fractionInputBoxTop")){//如果当前是处于分母的最末尾
                    $scope.showFracTop=true;
                    $scope.showFracBottom=false;
                }
                $scope.showFindNextInputFlag=isNomarInput($scope.fromElement);

                if($scope.fromElement.parent('unit[frac]').length&&$scope.fromElement.parents('.'+$scope.INPUT_BOX_TYPE.VARIABLE_INPUT_AREA).length)//如果是分数，并且父级有字母框就让键盘显示字母
                    $scope.keyboardStatus.isCharacterBox=true;
                if (info.possibleUnits) {
                    $scope.unitRows.splice(0, $scope.unitRows.length);
                    angular.forEach(info.possibleUnits, function (row) {
                        $scope.unitRows.push(row);
                    });
                    $scope.unitsDataList = unitShowSizeOptimize($scope.unitRows);
                }
                if (info.wordAnswer) {
                    $scope.wordAnswer = info.wordAnswer;
                }
                if (info.selectItemList) {  //需要选择型输入框
                    $scope.keyboardStatus.selectInputItemList.length = 0;
                    angular.forEach(info.selectItemList, function (item) {
                        $scope.keyboardStatus.selectInputItemList.push(item);
                    });
                    $scope.keyboardStatus.selectInputDataList = getRowColArray($scope.keyboardStatus.selectInputItemList, 2);
                    $scope.keyboardStatus.showSelectInputItem = true;
                    $timeout(function () {
                        MathJax.Hub.Queue(["Reprocess", MathJax.Hub, element[0]]);
                    }, 500);
                }
                if (info.pureWordsOfQuestion||$scope.keyboardStatus.isVariableSolveBox) {
                    if($scope.keyboardStatus.isVariableSolveBox){
                        $scope.pureWordsList.push({firstOrTail: true, item: "解"});
                        $scope.pureWordsList.push({firstOrTail: true, item: ":"});
                    }else{
                        ctrl.ADDITION_PURE_WORDS.forEach(function (item) {
                            $scope.pureWordsList.push({firstOrTail: true, item: item});
                        });
                        var fracArray=info.pureWordsOfQuestion.match(/\\frac{.*?}{.*?}/g);
                        var pureWordsOfQuestionParsed=info.pureWordsOfQuestion.replace(/`\\frac{.*?}{.*?}`/g,'@');//将分数替换成没有使用到的@符号
                        var fracIndex=0;
                        pureWordsOfQuestionParsed.split('').forEach(function (item) {
                            if (item != '\\' && item != '{' && item != '}' && item != '`'&& item !='='){
                                if(item==='@'){
                                    $scope.pureWordsList.push({firstOrTail: false, item: fracArray[fracIndex]});
                                    fracIndex++;
                                }else{
                                    $scope.pureWordsList.push({firstOrTail: false, item: item});
                                }
                            }

                        });
                        ctrl.ADDITION_PURE_WORDS2.forEach(function (item) {
                            $scope.pureWordsList.push({firstOrTail: true, item: item});
                        });
                    }

                    $scope.keyboardStatus.currentTopPanel = $scope.TOP_PANEL_LIST.WORD;
                }
            });
            $scope.$on('keyboard.hide', function () {
                if (amIclicked)return;
                $scope.ctrl.hide(element);
            });

            $scope.$on('keyboard.hide.change.question', function () {
                $scope.ctrl.hide(element);
            });

            //TODO:需要知道unit解析后的内容，否则长度不可控，周边没有pading了
            var unitShowSizeOptimize = function (unitRows) {
                var leftProportion = 4 / 5;//html中键盘左边所占的flex比例。
                var pandingValue = 16;//页面上实际一行左右整体的pading，

                var fontSize = window.innerWidth >= 768 ? 30 : 16;//平板字体目前是30，手机是16
                var itemPadding = 3;//两个元素之间的间隔为3px
                //var maxLength = Math.floor((leftProportion * window.innerWidth - pandingValue) / fontSize);//最后支持多少个汉字
                var maxLength = leftProportion * window.innerWidth;
                var remainLength = maxLength;
                var MAX_COL_COUNT = 4;//最大的一行拥有的个数
                var rowArray = [];//行数组
                var colArray = [];//列数组
                $log.log("maxLength:" + maxLength);
                $log.log("remainLength:" + remainLength);
                var count = 0;
                angular.forEach(unitRows, function (unit, index) {
                    count++;
                    console.log("idnex:" + index + "--->" + unit);
                    var unitMatchArr = unit.match(/}{(.+?)}{/);
                    var brackets = unit.match(/}{(01|11)}/);//00-中文   01-带括号中文   10-英文  11-带括号的英文
                    var hasBracketsLenght = brackets ? 1 : 0;
                    var unitText = "";
                    if (unitMatchArr && unitMatchArr.length > 0) {
                        unitText = unitMatchArr[1];
                    }
                    var unitTextLength = (unitText.replace(/[^\u0000-\u00ff]/g, "aa").length) / 2;//汉字长度
                    var daptValue = count == 1 ? 2 : 1;
                    unitTextLength = (unitTextLength + hasBracketsLenght) * fontSize + daptValue * (itemPadding + pandingValue);//给单位内容统一添加一个()
                    if (unitTextLength >= maxLength) {//单位长度超过最大长度
                        var colArrayTemp = [];
                        addItemIntoCol(colArrayTemp, unit, unitTextLength);
                        rowArray.push(colArrayTemp);
                        count = 0;
                    } else {
                        if (colArray.length >= MAX_COL_COUNT) {//当前列数组的长度大于等于最大支持的列个数
                            rowArray.push(colArray);
                            count = 0;
                            colArray = [];
                            addItemIntoCol(colArray, unit, unitTextLength);
                            remainLength = maxLength - unitTextLength;
                        } else {
                            if (remainLength < unitTextLength) {//剩余长度超过单位长度
                                rowArray.push(colArray);
                                count = 0;
                                colArray = [];
                                addItemIntoCol(colArray, unit, unitTextLength);
                                remainLength = maxLength - unitTextLength;
                            } else {
                                addItemIntoCol(colArray, unit, unitTextLength);
                                remainLength = remainLength - unitTextLength;
                            }
                        }
                    }

                });
                if (colArray.length > 0) {//余留的列数组
                    rowArray.push(colArray);
                }
                return rowArray;
            };

            var addItemIntoCol = function (col, unit, unitTextLength) {
                var unitInfo = {};
                unitInfo.unit = unit;
                unitInfo.length = unitTextLength;
                col.push(unitInfo);
            };

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
                        if (!$scope.$root.platform.IS_ANDROID && !$scope.$root.platform.IS_IPHONE) {
                            element.css({
                                left: newPos.x + 'px',
                                top: newPos.y + 'px'
                            });
                        }
                    }
                });
            }).on('mouseup touchend', function () {
                $($window.document).off('touchmove mousemove');
            });
        }
    }
});

keyboard.directive('keyboardCommon', [function () {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_common.html'),
        controller: 'keyboardCommonCtrl as ctrl',
        require: '^keyboard',
        link: function ($scope, element, attrs, keyboardCtrl) {
            var ctrl = $scope.ctrl;
            ctrl.$element = $(element);
            ctrl.keyboardCtrl = keyboardCtrl;
            ctrl.setSelfHeight();
            $(element).css('margin', '2px 0');


            //屏幕方向改变时重新设定高度
            var orientationchangeFn = ctrl.orientationchangeFn.bind(ctrl);
            keyboardCtrl.setOrientationchangeListener(orientationchangeFn);
            $scope.$on('$destroy', function () {
                keyboardCtrl.removeOrientationchangeListener(orientationchangeFn);
            });
        }
    }
}]);

keyboard.directive('keyboardCharacter', [function () {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_character.html'),
        controller: ['$scope', function ($scope) {
            $scope.lowerOrUpper = '大写';
            $scope.isLower = true;  //true表示当前为小写 false表示当前为大小
            $scope.toCase = function () {
                var $character = $('.keyboardCharacter .left .itemRow .item');
                $character.each(function () {
                    $(this).html(replaceCharacter($(this).html()));
                    $(this).attr('value',replaceCharacter($(this).attr('value')));
                });
                $scope.isLower?$scope.lowerOrUpper="小写":$scope.lowerOrUpper="大写";
                $scope.isLower=!$scope.isLower;
            };
            function replaceCharacter(replceStr){      //大小写替换
                var character='';
                if(replceStr.indexOf('var')>=0){                      //替换\var{..}
                     character=replceStr.replace(/{([a-zA-Z]+?)}/,function(match,$1){
                         var $1 = $scope.isLower?$1.toUpperCase():$1.toLowerCase();
                         return '{'+$1+'}';
                     });
                }else{
                    character=replceStr.replace(/[a-zA-Z]+?/,function(match){
                        return $scope.isLower?match.toUpperCase():match.toLowerCase();
                    });
                }
                return character;
            }
        }],
        require:'^keyboard',
        link: function ($scope, element, attrs,keyboardCtrl) {
            var ctrl = $scope.ctrl;
            ctrl.$element = $(element);
            ctrl.keyboardCtrl = keyboardCtrl;
            ctrl.setSelfHeight();
            $(element).css('margin', '2px 0');


            //屏幕方向改变时重新设定高度
            var orientationchangeFn = ctrl.orientationchangeFn.bind(ctrl);
            keyboardCtrl.setOrientationchangeListener(orientationchangeFn);
            $scope.$on('$destroy', function () {
                keyboardCtrl.removeOrientationchangeListener(orientationchangeFn);
            });
        }
    }
}]);

keyboard.directive('keyboardMark', ['$timeout', function () {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_mark.html'),
        controller: "keyboardMarkCtrl as ctrl",
        require: '^keyboard',
        link: function ($scope, element, attrs, keyboardCtrl) {
            var ctrl = $scope.ctrl;
            ctrl.$element = $(element);
            ctrl.keyboardCtrl = keyboardCtrl;
            ctrl.setSelfHeight();
            $(element).css('margin', '2px 0');

            //屏幕方向改变时重新设定高度
            var orientationchangeFn = ctrl.orientationchangeFn.bind(ctrl);
            keyboardCtrl.setOrientationchangeListener(orientationchangeFn);
            $scope.$on('$destroy', function () {
                keyboardCtrl.removeOrientationchangeListener(orientationchangeFn);
            });
        }
    }
}]);

keyboard.directive('keyboardUnit', [function () {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_unit.html'),
        controller: "keyboardUnitCtrl as ctrl",
        require: '^keyboard',
        link: function ($scope, element, attrs, keyboardCtrl) {
            $scope.element = element;
            var ctrl = $scope.ctrl;
            ctrl.$element = $(element);
            ctrl.keyboardCtrl = keyboardCtrl;
            ctrl.setSelfHeight();
            $(element).css('margin', '2px 0');

            //屏幕方向改变时重新设定高度
            var orientationchangeFn = ctrl.orientationchangeFn.bind(ctrl);
            keyboardCtrl.setOrientationchangeListener(orientationchangeFn);
            $scope.$on('$destroy', function () {
                keyboardCtrl.removeOrientationchangeListener(orientationchangeFn);
            });
        }
    }
}]);
keyboard.directive('keyboardWord', [function () {
    return {
        restrict: 'A',
        template: require('./../templates/keyboard_word.html'),
        controller: "keyboardWordCtrl as ctrl",
        require: '^keyboard',
        link: function ($scope, element, attrs, keyboardCtrl) {
            var ctrl = $scope.ctrl;
            ctrl.$element = $(element);
            ctrl.keyboardCtrl = keyboardCtrl;
            ctrl.setSelfHeight();
            $(element).css('margin', '2px 0');

            //屏幕方向改变时重新设定高度
            var orientationchangeFn = ctrl.orientationchangeFn.bind(ctrl);
            keyboardCtrl.setOrientationchangeListener(orientationchangeFn);
            $scope.$on('$destroy', function () {
                keyboardCtrl.removeOrientationchangeListener(orientationchangeFn);
            });
        }
    }
}]);
keyboard.directive('keyboardSelect',[function(){
    return {
        restrict: 'A',
        template: require('./../templates/keyboard_select.html'),
        controller: "keyboardSelectCtrl as ctrl",
        require: '^keyboard',
        link: function ($scope, element, attrs, keyboardCtrl) {
            var ctrl = $scope.ctrl;
            ctrl.$element = $(element);
            ctrl.keyboardCtrl = keyboardCtrl;
            ctrl.setSelfHeight();
            $(element).css('margin', '2px 0');

            //屏幕方向改变时重新设定高度
            var orientationchangeFn = ctrl.orientationchangeFn.bind(ctrl);
            keyboardCtrl.setOrientationchangeListener(orientationchangeFn);
            $scope.$on('$destroy', function () {
                keyboardCtrl.removeOrientationchangeListener(orientationchangeFn);
            });
        }
    }
}]);