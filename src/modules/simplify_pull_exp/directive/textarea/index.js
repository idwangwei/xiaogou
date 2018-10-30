/**
 * Created by ww 2017/8/9.
 */
import './index.less';
export default ()=> {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: `<div class="simplify-textarea"></div>`,
        controller: ['$scope', '$rootScope', 'uuid4', '$compile', '$window', '$timeout',
            function($scope, $rootScope, uuid4, $compile, $window, $timeout){
                $scope.DO_QUESTION_FLAG = '[show-type="doQuestion"]';//小题上要标注展示类型，如果是做题，那么可以点击输入框，否则不能点击
                $scope.CORRECT_QUESTION_FLAG = '[show-type="correct"]';//小题上要标注展示类型，如果是已批改，那么不可以点击输入框
                $scope.uuid4 = uuid4;
                $scope.$compile = $compile;
                $scope.$window = $window;
                $scope.$timeout = $timeout;
                $scope.valMap = [
                    {
                        val: '\\\\div',
                        text: '÷'
                    },
                    {
                        val: '\\\\times',
                        text: '×'
                    }
                ];
                $scope.textContent = {
                    expr: '',
                    html: ''
                };
                this.$root = $rootScope;

                $scope.NEWLINE = "\\n";//换行

                $scope.QUESTION_TYPE = {
                    DOING: 'doQuestion', //做题
                    CORRECTED: 'correct' //已批改
                }; //题目状态
                $scope.EXPRESSION_SET = {
                    FRACTION: {
                        REGEXP: /^\\frac{.*}{.*}$/
                    },//分数
                    REDUCE: {
                        REGEXP: /^\\reduc{.*}{.*}$/
                    }, //约分
                    MUL: {
                        REGEXP: /^\\times$/,
                        TEXT: '×',
                        VAL: '\\times'
                    }, //乘号
                    DIV: {
                        REGEXP: /^\\div$/,
                        TEXT: '÷',
                        VAL: '\\div'
                    },   //除号
                    ADD: {
                        REGEXP: /^\+$/,
                        TEXT: '+'
                    }, //加
                    PLUS: {
                        REGEXP: /^-$/,
                        TEXT: '-'
                    }, //减
                    EQUAL: {
                        REGEXP: /^=$/,
                        TEXT: '='
                    }, //等号
                    NUM: {
                        REGEXP: /^\d+$/
                    } //数字

                };
                $scope.spliceRegExp = /\\frac\{[^\{]*?\}\{[^\{]*?\}|\\reduc\{[^\{]*?\}\{[^\{]*?\}/igm;//拆分嵌套的分数和约分
                $scope.itemRegExp = /\\frac\{.*?\}\{.*?\}|\\reduc\{.*?\}\{.*?\}|\\times|\\div|=|\+|-|\d+/igm;//拆分嵌套的分数和约分
            }],
        link: function ($scope, element, attrs, ctrl) {
            let $ele = $(element);
            $scope.focusConEle = undefined;
            $scope.isDoQuestion = undefined; //题目状态为做题
            /**
             * 当前元素的点击事件
             */
            $scope.elementClick = () => {
                $ele.on('click', (ev) => {
                    let $appendEle = undefined;
                    let $cursorEle = $ele.find('cursor');
                    if ($cursorEle.length == 0) {
                        $cursorEle = $scope.$compile($('<cursor></cursor>'))($scope);
                    }
                    ev.stopPropagation();
                    $scope.$root.$broadcast('simplifyKeyboard.show', {ele: $ele});

                    //输入框最后一行为空，将光标加入到最后一行行首
                    let lastRowCon = $ele.children(':last-child');
                    if (lastRowCon.length !== 0 && lastRowCon.children().not('cursor').length === 0) {
                        lastRowCon.append($cursorEle);
                        $scope.$apply(()=> {
                            $scope.focusConEle = lastRowCon;
                        });
                        return
                    }

                    //添加一个空行,并将光标加入到行首
                    $appendEle = $scope.$compile($('<row-con></row-con>'))($scope);
                    $appendEle.append($cursorEle);
                    $ele.append($appendEle);
                    $scope.$apply(()=> {
                        $scope.focusConEle = $appendEle;
                    })
                });
            };

            /**
             * 添加输入元素
             * @param val
             */
            $scope.addUnitToTextArea = (val) => {
                let $unit = $('<span style="min-width: 12px"></span>').attr('id', $scope.uuid4.generate()),
                    $cursorEle = $ele.find('cursor'),
                    $cursorNumParent = $cursorEle.parents('.simplify-num-con'),
                    $appendEle = undefined;

                let createNewSymbol = ()=> {
                    let $wrapper = $('<div></div>');
                    $wrapper.append($('<unit-con></unit-con>').append($unit));
                    $appendEle = $scope.$compile($wrapper.html())($scope);
                };
                let createNewNumBox = ()=> {
                    $appendEle = $('<num-con></num-con>');
                    $appendEle.append($('<unit-con></unit-con>').append($unit).append($('<cursor></cursor>')));
                    $appendEle = $scope.$compile($appendEle)($scope);
                };
                let createNewFracBox = ()=> {
                    let $compileCursor = $scope.$compile($('<cursor></cursor>'))($scope);

                    $appendEle = $('<frac-con></frac-con>');
                    $appendEle = $scope.$compile($appendEle)($scope);
                    $appendEle.children(':first-child').addClass('simplify-row-con-background-white');
                    $appendEle.children(':last-child').append($compileCursor).addClass('simplify-row-con-background-white');
                    $scope.focusConEle = $appendEle.children(':first-child');
                    $scope.$root.$broadcast('simplifyKeyboard.showFracImg', {focusEle: $scope.focusConEle});
                };
                if($cursorEle.length== 0)return;
                //分数里面不能再有分数
                let $fracPar = $cursorEle.parents('.simplify-frac-con');
                let focusEle;
                if ($fracPar.length != 0 && val.match(/^\\frac/)){
                    if($cursorEle.parents('.simplify-frac-con-row-bottom').length != 0 ){
                        let $topLastChild = $fracPar.children('.simplify-frac-con-row-top').children(':last-child');
                        if($topLastChild.is('.simplify-num-con')){
                            focusEle = $topLastChild.children(':last-child');
                        }else {
                            focusEle = $fracPar.children('.simplify-frac-con-row-top');
                        }

                        focusEle.append($cursorEle);
                        $scope.focusConEle = focusEle;

                    }else {
                        let $bottomLastChild = $fracPar.children('.simplify-frac-con-row-bottom').children(':last-child');

                        if($bottomLastChild.is('.simplify-num-con')){
                            focusEle = $bottomLastChild.children(':first-child');
                        }else {
                            focusEle = $fracPar.children('.simplify-frac-con-row-bottom');
                        }
                        focusEle.append($cursorEle);
                        $scope.focusConEle = focusEle;
                    }
                    $scope.$root.$broadcast('simplifyKeyboard.showFracImg', {focusEle: $scope.focusConEle});
                    return
                }

                //约分框里面只能填数字
                if ($cursorEle.parents('.simplify-unit-con-real').length != 0 && !val.match(/\d+/))return;

                //替换乘除符号
                $scope.valMap.forEach((item)=> {
                    if (val.match(item.val)) {
                        $unit.attr('value', val);
                        val = item.text;
                    }
                });
                $unit.text(val);

                //输入的是分数，在父级行中添加一个新的frac-con
                if (val.match(/^\\frac/)) {
                    createNewFracBox();
                    $cursorNumParent.length != 0 ? $cursorNumParent.after($appendEle) : $cursorEle.before($appendEle);
                    $cursorEle.remove();
                }
                //输入的是数字
                else if (val.match(/^\d$/)) {
                    if ($cursorNumParent.length != 0) {
                        $appendEle = $unit;
                        $cursorEle.before($scope.$compile($appendEle)($scope));
                    } else {
                        createNewNumBox();
                        $cursorEle.before($appendEle);
                        $cursorEle.remove();
                    }
                }
                //输入的是运算符号
                else {
                    createNewSymbol();
                    //在数字框中输入了运算符号
                    if ($cursorNumParent.length != 0) {
                        let $cursorPrev = $cursorEle.prev();
                        let $cursorNext = $cursorEle.next();
                        //数字框首位输入了符号
                        if ($cursorPrev.length == 0) {
                            $cursorNumParent.before($appendEle);
                        }
                        //数字框末尾输入了符号
                        else if ($cursorNext.length == 0) {
                            $cursorNumParent.after($appendEle);
                            $appendEle.after($cursorEle);
                        }
                        //数字框数字中间输入了符号
                        else {
                            let newNextNumCon = $('<num-con><unit-con></unit-con></num-con>');
                            newNextNumCon = $scope.$compile(newNextNumCon)($scope);

                            $cursorNumParent.after($appendEle);
                            $appendEle.after(newNextNumCon);
                            newNextNumCon.children().append($cursorEle, $cursorEle.nextAll());
                        }

                        return
                    }

                    $cursorEle.before($appendEle);
                }
            };
            /**
             * 删除光标前的元素
             */
            $scope.clearUnit = ()=> {

                let $cursorEle = $ele.find('cursor');
                let $simplifyNum = $cursorEle.parents('.simplify-num-con');
                let $deleteEle = $cursorEle.prev();
                let $cursorPar = $cursorEle.parent();
                let $cursorParPrev = $cursorPar.prev();

                //当前行为空行，且有前一行，则删除当前行
                if ($cursorEle.siblings().length == 0 && $cursorPar.is('.simplify-row-con') && $cursorParPrev.is('.simplify-row-con')) {
                    $cursorParPrev.append($cursorEle);
                    $cursorPar.remove();
                }


                //如果光标在数字框中的首位，删除数字前面的兄弟dom
                if ($simplifyNum.length != 0 && $deleteEle.length == 0 && !$cursorPar.is('.simplify-unit-con-real')) {

                    $deleteEle = $simplifyNum.prev();
                }
                $deleteEle.remove();

                //如果相邻的两个框都是数字框，则合并
                let $simplifyNumPrev = $simplifyNum.prev();
                if ($simplifyNum.length != 0 && $simplifyNumPrev.is('.simplify-num-con')) {
                    $simplifyNumPrev.children().append($cursorEle, $cursorEle.siblings());
                    return;
                }

                //如果该次删除的是数字框中的数字，并且已经被清空则删除num-con dom
                if ($simplifyNum.length != 0 && $cursorEle.siblings().length == 0 && !$cursorPar.is('.simplify-unit-con-real')) {
                    //如果是分数,并且有约分框（分母|分子）,添加或删除布局平衡框保证分数居中
                    let $simplifyNumPar = $simplifyNum.parents('.simplify-frac-con-row-bottom,.simplify-frac-con-row-top');
                    let simplifyNumRealChildrenDomLength = $simplifyNum.children('.simplify-unit-con-real').length;
                    if ($simplifyNumPar.length != 0 && simplifyNumRealChildrenDomLength != 0) {
                        let $opacityDom, isTop, opacityDomLen;
                        if ($simplifyNumPar.is('.simplify-frac-con-row-top')) {
                            $opacityDom = $simplifyNumPar.nextAll('.simplify-unit-con-opacity');
                            isTop = true;
                            opacityDomLen = $opacityDom.length;
                        } else {
                            $opacityDom = $simplifyNumPar.prevAll('.simplify-unit-con-opacity');
                            isTop = false;
                            opacityDomLen = $opacityDom.length;
                        }

                        if (simplifyNumRealChildrenDomLength > opacityDomLen) {
                            $opacityDom.remove();
                            for (let i = 0; i < simplifyNumRealChildrenDomLength - opacityDomLen; i++) {
                                let $appendOpacity = $scope.$compile($('<unit-con></unit-con>').addClass('simplify-unit-con-opacity'))($scope);
                                isTop ?
                                    $simplifyNumPar.before($appendOpacity)
                                    : $simplifyNumPar.after($appendOpacity);
                            }
                        } else {
                            for (let i = 0; i < simplifyNumRealChildrenDomLength; i++) {
                                $opacityDom.eq(i).remove();
                            }
                        }
                    }

                    //删除了数字框里的所有数字
                    $cursorEle.insertBefore($simplifyNum);//数字会被整体删除，光标移动到该数字dom之前
                    $scope.focusConEle = $simplifyNum.parent();
                    $simplifyNum.remove();
                }

                //光标最新位置前是一个数字，则将光标添加进unit-con（数字框）最后一位
                let $NewCursorPrevEle = $cursorEle.prev();
                if ($NewCursorPrevEle.is('.simplify-num-con')) {
                    $NewCursorPrevEle.children().eq(0).append($cursorEle);
                }

            };

            /**
             * 将输入的答案解析为字符串，更新填入的答案$scope.textContent.expr
             */
            $scope.modifyTextContentExpr = ()=> {
                let $allInputEle = $ele.children().not('cursor');
                if ($allInputEle.length == 0) {
                    $scope.textContent.expr = '';
                    return;
                }
                let rowStrArr = []; //每一行的输入集合
                for (let i = 0; i < $allInputEle.length; i++) {
                    let $rowDom = $allInputEle.eq(i).not('cursor');
                    rowStrArr.push($scope.parseRowDom($rowDom));
                }
                $scope.textContent.expr = rowStrArr.join('\\n');
            };
            $scope.parseRowDom = ($rowDom, isFracBottom)=> {
                let $rowItemDom = $rowDom.children().not('cursor');

                //每一行中的元素
                let rowVal = '';
                for (let j = 0; j < $rowItemDom.length; j++) {
                    let $itemDom = $rowItemDom.eq(j);
                    let itemVal = '';
                    if ($itemDom.is('.simplify-num-con')) {
                        itemVal = $scope.parseNumDom($itemDom, isFracBottom);
                    }
                    else if ($itemDom.is('.simplify-unit-con')) {
                        itemVal = $scope.parseSymbolDom($itemDom);
                    }
                    else if ($itemDom.is('.simplify-frac-con')) {
                        itemVal = $scope.parseFracDom($itemDom);
                    }
                    rowVal += itemVal;
                }
                return rowVal;
            };
            $scope.parseNumDom = ($itemDom, isFracBottom)=> {
                let $unitDom = $itemDom.children().not('cursor').not('.simplify-unit-con-opacity');
                if ($unitDom.length == 1) {
                    return $unitDom.text();
                }

                if ($unitDom.length < 3) {
                    let $unitLineDom = $itemDom.children('.simplify-unit-con-line');
                    let $unitRealStr = $itemDom.children('.simplify-unit-con-real').text();
                    if ($unitLineDom.length != 0) {
                        return $unitRealStr ? `\\reduc{${$unitLineDom.text()}}{${$unitRealStr}}`
                            : $unitLineDom.text();//6约3表示为\reduc{6}{3}
                    }
                }
                else if (isFracBottom) {
                    // div.simplify-unit-con.simplify-unit-con-line
                    // div.simplify-unit-con.simplify-unit-con-real.simplify-unit-con-line
                    // .....
                    // div.simplify-unit-con.simplify-unit-con-real

                    let str = $unitDom.eq(-1).text();
                    for (let i = $unitDom.length - 1; i > 0; i--) {
                        str = `\\reduc{${$unitDom.eq(i - 1).text()}}{${str}}`
                    }
                    return str;
                } else {
                    // div.simplify-unit-con.simplify-unit-con-real
                    // div.simplify-unit-con.simplify-unit-con-real.simplify-unit-con-line
                    // .....
                    // div.simplify-unit-con.simplify-unit-con-line

                    let str = $unitDom.eq(0).text();
                    for (let i = 0, len = $unitDom.length - 1; i < len; i++) {
                        str = `\\reduc{${$unitDom.eq(i + 1).text()}}{${str}}`
                    }
                    return str;
                }
                return '';
            };
            $scope.parseSymbolDom = ($itemDom)=> {
                let $unitDom = $itemDom.children().not('cursor');
                return $unitDom.attr('value') || $unitDom.text() || '';
            };
            $scope.parseFracDom = ($itemDom)=> {
                let $fracTopDom = $itemDom.children('.simplify-frac-con-row-top');
                let $fracBottomDom = $itemDom.children('.simplify-frac-con-row-bottom');

                let fracTopStr = $scope.parseRowDom($fracTopDom);
                let fracBottomStr = $scope.parseRowDom($fracBottomDom, true);
                return `\\frac{${fracTopStr}}{${fracBottomStr}}`;
            };

            $scope.$on('simplifyKeyboard.addContent', (ev, val) => {
                if (val.ele != element && element.attr('id') != $(val.ele).attr('id'))return; //不是发给自己的消息
                $scope.addUnitToTextArea(val.val);
                $scope.modifyTextContentExpr();
            });
            $scope.$on('simplifyKeyboard.clearUnit', (ev, val) => {
                if (val.ele != $ele && $ele.attr('id') != $(val.ele).attr('id')) return; //不是发给自己的消息
                $scope.clearUnit();
                $scope.modifyTextContentExpr();
            });
            $scope.$on('simplifyKeyboard.showSimplifyBox', (ev, val) => {
                if (val.ele != $ele && $ele.attr('id') != $(val.ele).attr('id')) return; //不是发给自己的消息

                let $cursorEle = $ele.find('cursor');
                let $simplifyUnitCon = $cursorEle.parent('.simplify-unit-con');
                let $simplifyNumCon = $simplifyUnitCon.parent('.simplify-num-con');

                //不是数字框 不再处理约分
                if ($cursorEle.length == 0 || $simplifyNumCon.length == 0) {
                    return;
                }

                let $simplifyNumConParent = $simplifyNumCon.parent();
                let $simplifyRealEle = $scope.$compile($('<unit-con></unit-con>'))($scope);
                let $simplifyOpacityEle = $scope.$compile($('<unit-con></unit-con>'))($scope);


                //在含有数字的unit-con框（数字框）中创建约分框并聚焦
                if ($simplifyUnitCon.length != 0 && $simplifyNumCon.length != 0 && $cursorEle.siblings().length != 0) {
                    //当前数字作为被约分数，已经显示了他的 约分框
                    let $currentSimplifyPrevRealEle = $simplifyUnitCon.prev('.simplify-unit-con-real');
                    let $currentSimplifyNextRealEle = $simplifyUnitCon.next('.simplify-unit-con-real');
                    let parentIsFracBottom = $simplifyUnitCon.parents('.simplify-frac-con-row-bottom').length != 0;

                    //如果是分母的被约分数，拥有他的约分框
                    if (parentIsFracBottom && $currentSimplifyNextRealEle.length != 0) {
                        $currentSimplifyNextRealEle.append($cursorEle);
                        $scope.focusConEle = $currentSimplifyNextRealEle;
                        return;
                    }
                    //行中单独的数字，分子的被约分数，拥有他的约分框
                    if (!parentIsFracBottom && $currentSimplifyPrevRealEle.length != 0) {
                        $currentSimplifyPrevRealEle.append($cursorEle);
                        $scope.focusConEle = $currentSimplifyPrevRealEle;
                        return;
                    }


                    //unit-con（数字）为分数的分子|分母，直接在上下方创建一个约分框，否则再创建一个居中平衡框
                    if ($simplifyNumConParent.eq(0).is('.simplify-frac-con-row-top,.simplify-frac-con-row-bottom')) {
                        let isTop = $simplifyNumConParent.eq(0).is('.simplify-frac-con-row-top');
                        let $appendRealEle = $simplifyRealEle.append($cursorEle).addClass('simplify-unit-con-real');
                        let $appendOpacityEle = $simplifyOpacityEle.addClass('simplify-unit-con-opacity');
                        //添加约分框
                        isTop ?
                            $simplifyUnitCon.before($appendRealEle)
                            : $simplifyUnitCon.after($appendRealEle);

                        $simplifyUnitCon.addClass('simplify-unit-con-line');
                        //添加约分平衡框
                        let $fracEle = $simplifyNumConParent.eq(0).parent();
                        let firstChildEle = $fracEle.children(':first-child');
                        let lastChildEle = $fracEle.children(':last-child');
                        let firstChildIsOpacityEle = firstChildEle.is('.simplify-unit-con-opacity');
                        let lastChildIsOpacityEle = lastChildEle.is('.simplify-unit-con-opacity');
                        if (isTop) {
                            firstChildIsOpacityEle ? firstChildEle.remove() : $fracEle.append($appendOpacityEle);
                        } else {
                            lastChildIsOpacityEle ? lastChildEle.remove() : $fracEle.prepend($appendOpacityEle);
                        }

                        $scope.focusConEle = $appendRealEle;

                    }
                    else {
                        $simplifyUnitCon.before($simplifyRealEle.append($cursorEle).addClass('simplify-unit-con-real'));
                        $simplifyNumCon.append($simplifyOpacityEle.addClass('simplify-unit-con-opacity'));
                        $simplifyUnitCon.addClass('simplify-unit-con-line');
                        $scope.focusConEle = $simplifyRealEle;
                    }
                }

            });
            $scope.$on('simplifyKeyboard.enter', (ev, val) => {
                if (val.ele != $ele && $ele.attr('id') != $(val.ele).attr('id')) return; //不是发给自己的消息

                let $cursorEle = $ele.find('cursor');
                let $cursorParentRow = $cursorEle.parents('.simplify-row-con').eq(-1);
                if ($cursorParentRow.children().not('cursor').length == 0)return; //当前行为空，不处理

                let $nextRow = $cursorParentRow.next();
                if ($nextRow.length != 0 && $nextRow.children().length == 0) {
                    $nextRow.append($cursorEle);
                    $scope.focusConEle = $nextRow;
                } else {
                    let $newRow = $scope.$compile($('<row-con></row-con>'))($scope);
                    $newRow.append($cursorEle);
                    $cursorParentRow.after($newRow);
                    $scope.focusConEle = $newRow;
                }
            });
            $scope.$watch('focusConEle', ($nowEle, $preEle)=> {
                if(!$preEle)return;

                //处理点击了约分框后不输入，失去焦点后去掉约分框
                if ($preEle.children().length == 0 && $preEle.is('.simplify-unit-con-real')) {

                    let $preElePar = $preEle.parents('.simplify-frac-con-row-top,.simplify-frac-con-row-bottom');
                    //分数分子中 的约分框
                    if ($preElePar.length != 0 && $preElePar.is('.simplify-frac-con-row-top')) {
                        if (!$preEle.prev().is('.simplify-unit-con-real')) {
                            $preEle.next('.simplify-unit-con-line').removeClass('simplify-unit-con-line');
                        }
                        let $bottomOpacityDoms = $preElePar.nextAll('.simplify-unit-con-opacity');
                        if ($bottomOpacityDoms.length != 0) {
                            $bottomOpacityDoms.eq(-1).remove();
                        } else {
                            $preElePar.parents('.simplify-frac-con')
                                .prepend($scope.$compile($('<unit-con></unit-con>'))($scope).addClass('simplify-unit-con-opacity'));
                        }
                        //分数分母中 的约分框
                    } else if ($preElePar.length != 0 && $preElePar.is('.simplify-frac-con-row-bottom')) {
                        if (!$preEle.next().is('.simplify-unit-con-real')) {
                            $preEle.prev('.simplify-unit-con-line').removeClass('simplify-unit-con-line');
                        }
                        let $topOpacityDoms = $preElePar.prevAll('.simplify-unit-con-opacity');
                        if ($topOpacityDoms.length != 0) {
                            $topOpacityDoms.eq(0).remove();
                        } else {
                            $preElePar.parents('.simplify-frac-con')
                                .append($scope.$compile($('<unit-con></unit-con>'))($scope).addClass('simplify-unit-con-opacity'));
                        }
                        //行中的约分框
                    } else {
                        $preEle.siblings('.simplify-unit-con-opacity').eq(0).remove();
                        if (!$preEle.prev().is('.simplify-unit-con-real')) {
                            $preEle.next('.simplify-unit-con-line').removeClass('simplify-unit-con-line');
                        }
                    }
                    $preEle.remove();
                    $scope.modifyTextContentExpr();
                    return;
                }
                //分数框有子元素就去掉白色背景,否则拥有白色背景
                let preIsFracRow = $preEle.is('.simplify-frac-con-row-bottom,.simplify-frac-con-row-top');
                let $preEleFracPar = $preEle.parents('.simplify-frac-con-row-bottom,.simplify-frac-con-row-top');
                if (!preIsFracRow && $preEleFracPar.length == 0) return;

                if (preIsFracRow) {
                    $preEle.children().not('cursor').length == 0 ?
                        $preEle.addClass('simplify-row-con-background-white')
                        : $preEle.removeClass('simplify-row-con-background-white')
                }
                else {
                    $preEleFracPar.children().not('cursor').length == 0 ?
                        $preEleFracPar.addClass('simplify-row-con-background-white')
                        : $preEleFracPar.removeClass('simplify-row-con-background-white')
                }
            });

            /**
             * 答案字符串转换为dom
             * @param answerStr
             */
            $scope.transformationAnswer = (answerStr)=> {
                //"=3\\times\frac{\reduc{3}{1}}{\reduc{6}{2}}\n=3"
                let rowStrArr = answerStr.split($scope.NEWLINE);

                rowStrArr.forEach((rowStr)=> {
                    let $rowEle = $scope.transformationRow(rowStr);
                    $ele.append($rowEle);
                });

            };
            $scope.transformationRow = (rowStr, replaceMap)=> {
                let $rowEle = $scope.$compile($('<row-con></row-con>'))($scope);
                replaceMap = replaceMap || {};
                let itemArr = $scope.spliceRowItem(rowStr, replaceMap);
                if (itemArr) {
                    itemArr.forEach((v)=> {
                        if ($scope.EXPRESSION_SET.EQUAL.REGEXP.test(v)) {
                            $rowEle.append($scope.$compile(
                                $(`<unit-con><unit id="${$scope.uuid4.generate()}">${$scope.EXPRESSION_SET.EQUAL.TEXT}</unit></unit-con>`)
                            )($scope))
                        }
                        else if ($scope.EXPRESSION_SET.ADD.REGEXP.test(v)) {
                            $rowEle.append($scope.$compile(
                                $(`<unit-con><unit id="${$scope.uuid4.generate()}">${$scope.EXPRESSION_SET.ADD.TEXT}</unit></unit-con>`)
                            )($scope))
                        }
                        else if ($scope.EXPRESSION_SET.PLUS.REGEXP.test(v)) {
                            $rowEle.append($scope.$compile(
                                $(`<unit-con><unit id="${$scope.uuid4.generate()}">${$scope.EXPRESSION_SET.PLUS.TEXT}</unit></unit-con>`)
                            )($scope))
                        }
                        else if ($scope.EXPRESSION_SET.MUL.REGEXP.test(v)) {
                            $rowEle.append($scope.$compile(
                                $(`<unit-con>
                                    <unit id="${$scope.uuid4.generate()}" value="${$scope.EXPRESSION_SET.MUL.VAL}">
                                        ${$scope.EXPRESSION_SET.MUL.TEXT}
                                    </unit>
                                </unit-con>`)
                            )($scope))
                        }
                        else if ($scope.EXPRESSION_SET.DIV.REGEXP.test(v)) {
                            $rowEle.append($scope.$compile(
                                $(`<unit-con >
                                    <unit id="${$scope.uuid4.generate()}" value="${$scope.EXPRESSION_SET.DIV.VAL}">
                                        ${$scope.EXPRESSION_SET.MUL.TEXT}
                                    </unit>
                                </unit-con>`)
                            )($scope))
                        }
                        else if ($scope.EXPRESSION_SET.NUM.REGEXP.test(v)) {
                            $rowEle.append($scope.transformationNum(replaceMap, v, false));
                        }
                        else if ($scope.EXPRESSION_SET.REDUCE.REGEXP.test(v)) {
                            $rowEle.append($scope.transformationNum(replaceMap, v, true));
                        }
                        else if ($scope.EXPRESSION_SET.FRACTION.REGEXP.test(v)) {
                            $rowEle.append($scope.transformationFrac(replaceMap, v));
                        }

                    });
                }

                return $rowEle;
            };
            $scope.transformationNum = (replaceMap, numStr, isReduc)=> {
                let $numConDom = $scope.$compile($('<num-con></num-con>'))($scope);

                if (!isReduc) {
                    let $unitConDom = $scope.$compile($('<unit-con></unit-con>'))($scope);
                    $unitConDom.append($scope.$compile($(numStr.replace(/\d/g, (num)=> {
                        return `<unit id="${$scope.uuid4.generate()}">${num}</unit>`
                    })))($scope));
                    $numConDom.append($unitConDom);
                }
                else {//\reduc{4}{2} || \reduc{4}{uuid4}  :-> uuid4 = \reduc{2}{1}
                    let reducSecondItemMatch,//约分表达式匹配被约分和约分数字
                        reducLineStr,//被约分数字
                        reducRealStr,//约分数字
                        $unitConRealDom, //填入约分数字的dom
                        $unitConLineDom, //填入被约分数字的dom
                        $unitConOpacityDom, //约分布局平衡框
                        whileCount = 0; //循环次数
                    do {
                        whileCount++;
                        reducSecondItemMatch = numStr.match(/\{(.*?)\}\{(.*?)\}$/);
                        reducLineStr = reducSecondItemMatch && reducSecondItemMatch[1];
                        reducRealStr = reducSecondItemMatch && reducSecondItemMatch[2];
                        $unitConOpacityDom = $scope.$compile($('<unit-con></unit-con>').addClass('simplify-unit-con-opacity'))($scope);

                        if (whileCount === 1) {
                            $unitConLineDom = $scope.$compile($('<unit-con></unit-con>').addClass('simplify-unit-con-line'))($scope);
                            $unitConLineDom.append($scope.$compile($(reducLineStr.replace(/\d/g, (num)=> {
                                return `<unit id="${$scope.uuid4.generate()}">${num}</unit>`
                            })))($scope));
                            $numConDom.append($unitConLineDom, $unitConOpacityDom);
                        } else {
                            $unitConRealDom = $scope.$compile($('<unit-con></unit-con>').addClass('simplify-unit-con-real'))($scope);
                            $unitConRealDom.append($scope.$compile($(reducLineStr.replace(/\d/g, (num)=> {
                                return `<unit id="${$scope.uuid4.generate()}">${num}</unit>`
                            })))($scope));
                            $numConDom.prepend($unitConRealDom.addClass('simplify-unit-con-line'));
                            $numConDom.append($unitConOpacityDom);
                        }

                        if ((/^\d+$/.test(reducRealStr))) {
                            $unitConRealDom = $scope.$compile($('<unit-con></unit-con>').addClass('simplify-unit-con-real'))($scope);
                            $unitConRealDom.append($scope.$compile($(reducRealStr.replace(/\d/g, (num)=> {
                                return `<unit id="${$scope.uuid4.generate()}">${num}</unit>`
                            })))($scope));
                            $numConDom.prepend($unitConRealDom);
                            break;
                        }
                        for (let key in replaceMap) {
                            if (reducRealStr.match(key)) {
                                reducRealStr = reducRealStr.replace(key, replaceMap[key]);
                                delete replaceMap[key];
                            }
                        }
                        numStr = reducRealStr;
                    } while (true);
                }

                return $numConDom;
            };
            $scope.transformationFrac = (replaceMap, str)=> {
                //\frac{4}{2} || \frac{uuid1}{uuid2} :->uuid1=\reduc{3}{1} uuid2=\reduc{9}{3}

                let $fracDom = $scope.$compile($('<frac-con></frac-con>'))($scope);

                let $fracTopDom = $fracDom.children(':first-child'), //分子DOM
                    $fracBottomDom = $fracDom.children(':last-child'); //分母DOM

                let fracItemMatch = str.match(/\{(.*?)\}\{(.*?)\}$/); //约分表达式匹配被约分和约分数字
                let fracTopStr = fracItemMatch && fracItemMatch[1]; //分子字符串
                let fracBottomStr = fracItemMatch && fracItemMatch[2]; //分子字符串

                for (let key in replaceMap) {
                    if (fracTopStr.match(key)) {
                        fracTopStr = fracTopStr.replace(key, replaceMap[key]);
                        delete replaceMap[key];
                    }
                    if (fracBottomStr.match(key)) {
                        fracBottomStr = fracBottomStr.replace(key, replaceMap[key]);
                        delete replaceMap[key];
                    }

                }

                let $topRowItem = $scope.transformationRow(fracTopStr, replaceMap);
                let $bottomRowItem = $scope.transformationRow(fracBottomStr, replaceMap);

                let bottomRealDom = $bottomRowItem.find('.simplify-unit-con-real');
                for (let i = bottomRealDom.length - 1; i >= 0; i--) {
                    bottomRealDom.eq(i).parent().append(bottomRealDom.eq(i));
                }

                let $bottomOpacityDoms = $bottomRowItem.find('.simplify-unit-con-opacity');
                let $topOpacityDoms = $topRowItem.find('.simplify-unit-con-opacity');
                let bottomOpacityDomsLen = $bottomOpacityDoms.length;
                let topOpacityDomsLen = $topOpacityDoms.length;

                if (bottomOpacityDomsLen > topOpacityDomsLen) {
                    $topOpacityDoms.remove();
                    for (let j = 0; j < bottomOpacityDomsLen; j++) {
                        j > (topOpacityDomsLen - 1) ?
                            $fracDom.prepend($bottomOpacityDoms.eq(j))
                            : $bottomOpacityDoms.eq(j).remove();
                    }

                } else {
                    $bottomOpacityDoms.remove();
                    for (let j = 0; j < topOpacityDomsLen; j++) {
                        j > (bottomOpacityDomsLen - 1) ?
                            $fracDom.append($topOpacityDoms.eq(j))
                            : $topOpacityDoms.eq(j).remove();
                    }
                }


                $fracTopDom.append($topRowItem.children());
                $fracBottomDom.append($bottomRowItem.children());
                return $fracDom;
            };
            $scope.spliceRowItem = (rowStr, replaceMap)=> {
                while ($scope.spliceRegExp.test(rowStr)) {
                    rowStr = rowStr.replace($scope.spliceRegExp, (matchStr, index)=> {
                        let mapKey = $scope.uuid4.generate();
                        replaceMap[mapKey] = matchStr;
                        return mapKey
                    })
                }
                for (let key in replaceMap) {
                    if (rowStr.match(key)) {
                        rowStr = rowStr.replace(key, replaceMap[key]);
                        delete replaceMap[key];
                    }
                }
                return rowStr.match($scope.itemRegExp)
            };

            /**
             * 初始化元素的点击事件
             */
            let currentElement = $(element);
            let showType = $scope.$parent.showType;
            let doQuestionElement = $(currentElement).parents($scope.DO_QUESTION_FLAG);
            if ((showType && showType == $scope.QUESTION_TYPE.DOING) || (doQuestionElement && doQuestionElement.length > 0)) {
                $scope.isDoQuestion = true;
                $scope.elementClick();

                $scope.$root.simplifyClickFn = $scope.$root.simplifyClickFn ? $scope.$root.simplifyClickFn : (ev)=> {
                    let $target = $(ev.target);
                    console.log('约分.......');
                    if ((!$target.parents('.simplify-textarea').length && !$target.is('.simplify-textarea'))
                        && (!$target.parents('.simplify-keyboard').length && !$target.is('.simplify-keyboard'))
                        && !(ev.target.nodeName.toUpperCase() == 'APP-TEXTAREA')
                        && !$target.parents('app-textarea , .appTextarea').length
                        && !$target.parents('vertical').length
                        && !$target.hasClass('appTextarea')
                        && (!$target.parents('.keyboard').length && !$(ev.target).is('.keyboard'))
                    ) {
                        $('cursor').remove();
                        ctrl.$root.$broadcast('simplifyKeyboard.hide', $ele);
                        $scope.$apply(()=>{
                            $scope.focusConEle = undefined;
                        })
                    }
                };
                $($scope.$window.document).off('mousedown touchstart', $scope.$root.simplifyClickFn);
                $($scope.$window.document).on('mousedown touchstart', $scope.$root.simplifyClickFn);
                // $scope.$on('$destroy', ()=> {
                //     console.log('destroy 约分');
                //     $($scope.$window.document).off('mousedown touchstart', $scope.$root.simplifyClickFn);
                // });
            }

            //答案输入不为空，填充本地答案
            let preAnswer = $scope.currentQInput && $scope.currentQInput.length != 0 && $scope.currentQInput.slice(-1)[0].answer;
            if (preAnswer) {
                $scope.transformationAnswer(preAnswer);
            }

            //批改显示勾叉
            if (showType && showType == $scope.QUESTION_TYPE.CORRECTED) {
                $scope.$timeout(() => {
                    $scope.smallQ = $ele.parents('[compile-html]');
                    $scope.currentEle = $ele;
                    if ($scope.smallQ.length) {
                        $ele.append($scope.$compile('<correct-paper></correct-paper>')($scope));
                    }
                }, 300);
            }
        }
    }
}
