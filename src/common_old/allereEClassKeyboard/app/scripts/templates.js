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
    "    <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">％</div>\r" +
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