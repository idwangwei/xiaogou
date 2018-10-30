var module = angular.module("keyboard");module.run(["$templateCache",function($templateCache){  'use strict';

  $templateCache.put('templates/container.html',
    "<!--<div class=\"dragarea\" ng-if=\"!$root.platform.IS_ANDROID&&!$root.platform.IS_IPHONE&&!$root.platform.IS_IPAD\">-->\n" +
    "    <!--点此拖动-->\n" +
    "<!--</div>-->\n" +
    "\n" +
    "\n" +
    "<div class=\"switcher\" >\n" +
    "    <div class=\"left-div-box\"\n" +
    "         ng-if=\"!keyboardStatus.showSelectInputItem\n" +
    "            && keyboardStatus.currentTopPanel!=TOP_PANEL_LIST.VERTICAL\n" +
    "            && keyboardStatus.currentTopPanel!=TOP_PANEL_LIST.VERTICAL_CARRY\"\n" +
    "    >\n" +
    "         <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.COMMON?'switcherItem active':'switcherItem'\"\n" +
    "               ng-click=\"setCurrentTopPanel(TOP_PANEL_LIST.COMMON,$event)\"\n" +
    "               ng-show=\"!keyboardStatus.isCommentBox\">常用</span>\n" +
    "\n" +
    "        <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.MARK?'switcherItem active':'switcherItem'\"\n" +
    "              ng-click=\"setCurrentTopPanel(TOP_PANEL_LIST.MARK,$event)\"\n" +
    "              ng-show=\"!keyboardStatus.isCommentBox\">更多</span>\n" +
    "        <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.UNIT?'switcherItem active':'switcherItem'\"\n" +
    "              ng-click=\"setCurrentTopPanel(TOP_PANEL_LIST.UNIT,$event)\"\n" +
    "              ng-show=\"!keyboardStatus.isCommentBox\">单位</span>\n" +
    "         <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.WORD?'switcherItem active':'switcherItem'\"\n" +
    "               ng-click=\"setCurrentTopPanel(TOP_PANEL_LIST.WORD,$event)\"\n" +
    "               ng-show=\"pureWordsList.length\" style=\"color:#ff952b;font-size: 16px;\">文字<span style=\"color: #ffff55;font-size: 14px;\">（请不要用文字列等式）</span></span>\n" +
    "        <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.CHARACTER?'switcherItem active':'switcherItem'\"\n" +
    "              ng-click=\"setCurrentTopPanel(TOP_PANEL_LIST.CHARACTER,$event)\"\n" +
    "              ng-show=\"keyboardStatus.isCharacterBox\">字母</span>\n" +
    "       <!--  <span ng-class=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.VERTICAL?'switcherItem active':'switcherItem'\"\n" +
    "               ng-click=\"setCurrentTopPanel(TOP_PANEL_LIST.VERTICAL,$event)\">竖式</span>-->\n" +
    "    </div>\n" +
    "\n" +
    "    <div  class=\"right-div-box\" ng-click=\"hide($event)\">\n" +
    "        <span class=\"tool-bar-item flex-2\" >\n" +
    "            <i class=\"icon ion-chevron-down\"></i>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "<!--选择型输入框的选择区域 start-->\n" +
    "<div class=\"keyboardContent\" ng-if=\"keyboardStatus.showSelectInputItem\" keyboard-select>\n" +
    "    <div class=\"keyboardUnit\">\n" +
    "        <div class=\"left\">\n" +
    "            <div class=\"itemRow\" ng-repeat=\"itemRow in keyboardStatus.selectInputDataList\">\n" +
    "                <div class=\"item\" ng-click=\"handleClickNum($event)\" ng-repeat=\"item in itemRow\" value=\"{{item}}\">\n" +
    "                    <span mathjax-parser value=\"{{item}}\"></span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"right\">\n" +
    "            <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleDel($event)\">\n" +
    "                <img src=\"images/del.png\" width=\"35px\" alt=\"\"/>\n" +
    "            </div>\n" +
    "        </div>\n" +
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
    "         keyboard-mark\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.MARK\">\n" +
    "    </div>\n" +
    "    <div class=\"keyboardCharacter\"\n" +
    "         keyboard-character\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.CHARACTER\">\n" +
    "    </div>\n" +
    "    <div class=\"keyboardUnit\"\n" +
    "         keyboard-unit\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.UNIT\">\n" +
    "    </div>\n" +
    "    <div class=\"keyboardWord\"\n" +
    "         keyboard-word\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.WORD\">\n" +
    "    </div>\n" +
    "    <div class=\"keyboardCommon keyboardVertical\"\n" +
    "         keyboard-vertical\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.VERTICAL\">\n" +
    "    </div>\n" +
    "    <div class=\"keyboardCommon keyboardVerticalCarry\"\n" +
    "         keyboard-vertical-carry\n" +
    "         ng-show=\"keyboardStatus.currentTopPanel==TOP_PANEL_LIST.VERTICAL_CARRY\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"switcher tool-bar\" >\n" +
    "    <span ng-if=\"doCtrl.currentSmallQ\" class=\"tool-bar-item flex-4\"\n" +
    "          ng-click=\"doCtrl.currentSmallQ.isFirstOfAllQ?'':doCtrl.previousQuestion()\"\n" +
    "          ng-class=\"doCtrl.currentSmallQ.isFirstOfAllQ?'un-click':''\">\n" +
    "        <i class=\"icon ion-arrow-left-b\" style=\"font-size: 25px;\"></i>&nbsp;\n" +
    "         <span ng-bind=\"doCtrl.redoFlag == 'false'?'上一题':'上一错题'\" style=\"font-size: 17px;\"></span>\n" +
    "    </span>\n" +
    "    <span ng-if=\"doCtrl.currentSmallQ\" class=\"tool-bar-item flex-4\"\n" +
    "          ng-click=\"doCtrl.currentSmallQ.isLastOfAllQ?'':doCtrl.goNextQuestion()\"\n" +
    "          ng-class=\"doCtrl.currentSmallQ.isLastOfAllQ?'un-click':''\"\n" +
    "    >\n" +
    "        <span ng-bind=\"doCtrl.redoFlag == 'false'?'下一题':'下一错题'\" style=\"font-size: 17px;\"></span>\n" +
    "        &nbsp;<i  class=\"icon ion-arrow-right-b\" style=\"font-size: 25px;\"></i>\n" +
    "    </span>\n" +
    "\n" +
    "    <!-- 诊断页面做题-->\n" +
    "     <span class=\"tool-bar-item flex-4\"  ng-if=\"!doQCtrl.noQuestionTip&&doQCtrl.questionInfo.question\"\n" +
    "           ng-click=\"doQCtrl.submitQ()\"\n" +
    "     >\n" +
    "        <i class=\"icon ion-paper-airplane\" style=\"font-size: 25px;\"></i>&nbsp;&nbsp;\n" +
    "         <span ng-bind=\"doQCtrl.diagnose_submit_q_processing?'提交中...':'提交'\" style=\"font-size: 17px;\"></span>\n" +
    "    </span>\n" +
    "\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/keyboard_character.html',
    "<div class=\"left\">\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{a}\">a</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{b}\">b</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{c}\">c</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{d}\">d</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{e}\">e</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{f}\">f</div>\n" +
    "    </div>\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{g}\">g</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{h}\">h</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{i}\">i</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{j}\">j</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{k}\">k</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{l}\">l</div>\n" +
    "    </div>\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{m}\">m</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{n}\">n</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{o}\">o</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{p}\">p</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{q}\">q</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{r}\">r</div>\n" +
    "    </div>\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{s}\">s</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{t}\">t</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{u}\">u</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{v}\">v</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{w}\">w</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{x}\">x</div>\n" +
    "    </div>\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{y}\">y</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\var{z}\">z</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"right\">\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">\n" +
    "        <img ng-src=\"images/del.png\" width=\"35px\" alt=\"\"/>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1;font-size: 15px;\" ng-click=\"findNextInput($event)\" style=\"color: #fe6948;\">\n" +
    "        <span style=\"display: block;width: 35px;color:white;margin-left: -8px\">下一空</span>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\" ng-click=\"toCase()\" style=\"color: #fff\" ng-bind=\"lowerOrUpper\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('templates/keyboard_common.html',
    "<div class=\"left\">\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">+</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">1</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">2</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">3</div>\n" +
    "    </div>\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">-</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">4</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">5</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">6</div>\n" +
    "    </div>\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\times\">×</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">7</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">8</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">9</div>\n" +
    "    </div>\n" +
    "    <div class=\"itemRow\">\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\div\">÷</div>\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\">=</div>\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">0</div>\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\".\"><span class=\"mathMark\" ng-bind=\"'.'+' (小数点)'\"></span></div>\n" +
    "        <!--<div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\lt\">＜</div>-->\n" +
    "    </div>\n" +
    "    <div class=\"itemRow\">\n" +
    "        <!--<div class=\"item\" ng-click=\"handleClickNum($event)\">=</div>-->\n" +
    "        <div class=\"item \" ng-click=\"handleClickFractionInput($event,'fraction1')\" style=\"flex: 1;-webkit-flex:1;\">\n" +
    "            <div style=\"position: relative\">\n" +
    "                <img src=\"images/fraction1.png\" width=\"28px\"/>\n" +
    "                <img src=\"images/go-top.png\" class=\"show-top\" ng-if=\"showFracTop\"/>\n" +
    "                <img src=\"images/go-bottom.png\" class=\"show-bottom\" ng-if=\"showFracBottom\"/>\n" +
    "               <!-- <i class=\"icon ion-arrow-left-c show-top\" ng-if=\"showFracTop\"></i>\n" +
    "                <i class=\"icon ion-arrow-left-c show-bottom\"  ng-if=\"showFracBottom\"></i>-->\n" +
    "            </div>\n" +
    "            <span class=\"mathMark\">&nbsp;(分数)</span>\n" +
    "        </div>\n" +
    "        <div class=\"item \" ng-click=\"handleClickNum($event)\" value=\"\\var{x}\" style=\"flex: 1;-webkit-flex:1;\">\n" +
    "            <span mathjax-parser value=\"x\"></span>\n" +
    "        </div>\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\remain\" style=\"flex: 1;-webkit-flex:1;\">······\n" +
    "            <span class=\"mathMark\">&nbsp;(余)</span>\n" +
    "        </div>\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\vdotdot\" style=\"flex: 1;-webkit-flex:1;\">:\n" +
    "            <span class=\"mathMark\">&nbsp;(比)</span>\n" +
    "        </div>\n" +
    "        <!--<div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\gt\">＞</div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"right\">\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">\n" +
    "        <img src=\"images/del.png\" width=\"35px\" alt=\"\"/>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1;font-size: 15px;color: #fe6948;\"\n" +
    "         ng-click=\"findNextInput($event)\" ng-if=\"showFindNextInputFlag\">\n" +
    "        <span style=\"display: block;width: 35px;color:white;margin-left: -8px\">下一空</span>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:2\" ng-click=\"enter($event)\" style=\"color: #fe6948;\">\n" +
    "        <img src=\"images/newline.png\" width=\"35px\" alt=\"\"/>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleAnswer($event)\" ng-if=\"wordAnswer\">\n" +
    "        <span style=\"display: block;width: 35px;color:white\">答</span>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\"\n" +
    "         style=\"flex:1;-webkit-flex:1\"\n" +
    "         ng-click=\"handleClickNum($event,'comment')\"\n" +
    "         value=\"\\comment{}\"\n" +
    "         ng-show=\"keyboardStatus.isAppTextarea&&!keyboardStatus.isCommentBox\">\n" +
    "        <span style=\"display: block;width: 35px;color:white\">文</span>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\"\n" +
    "         style=\"flex:1;-webkit-flex:1\"\n" +
    "         ng-click=\"handleClickCommentDone($event)\"\n" +
    "         ng-show=\"keyboardStatus.isCommentBox\">\n" +
    "        <span style=\"display: block;color:white\">完成</span>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/keyboard_mark.html',
    "<div class=\"left\">\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\lt\">＜</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\gt\">＞</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\le\">≤</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\ge\">≥</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" >=</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\approx\">≈</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\%\">%</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\pi\"><span mathjax-parser value=\"π\"></span></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\lbrace\">{</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\rbrace\">}</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\lbracket\">[</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\rbracket\">]</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <!--<div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\neq\">≠</div>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">(</div>\r" +
    "\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">)</div>\r" +
    "\n" +
    "        <div class=\"item \" ng-click=\"handleClickNum($event)\" value=\"°\">°\r" +
    "\n" +
    "            <span class=\"mathMark\">&nbsp;（度）</span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">℃</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <!--<div class=\"item \" ng-click=\"handleClickNum($event)\" value=\"\\cdot\">·-->\r" +
    "\n" +
    "            <!--<span class=\"mathMark\">&nbsp;（点乘）</span>-->\r" +
    "\n" +
    "        <!--</div>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"item \" ng-click=\"handleClickNum($event)\" value=\"\\var{y}\"><span mathjax-parser value=\"y\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item \" ng-click=\"handleClickNum($event)\" value=\"^2\">\r" +
    "\n" +
    "            <span mathjax-parser value=\"^2\"></span>\r" +
    "\n" +
    "            <span class=\"mathMark\">&nbsp;(平方)</span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item \" ng-click=\"handleClickNum($event)\" value=\"^3\">\r" +
    "\n" +
    "            <span mathjax-parser value=\"^3\"></span>\r" +
    "\n" +
    "            <span class=\"mathMark\">&nbsp;(次方)</span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"right\">\r" +
    "\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">\r" +
    "\n" +
    "        <img ng-src=\"images/del.png\" width=\"35px\" alt=\"\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1;font-size: 15px;color: #fe6948;\"\r" +
    "\n" +
    "         ng-click=\"findNextInput($event)\" ng-if=\"showFindNextInputFlag\">\r" +
    "\n" +
    "        <span style=\"display: block;width: 35px;color:white;margin-left: -8px\">下一空</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--<div class=\"item\" ng-click=\"space($event)\">空格</div>-->\r" +
    "\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:2\" ng-click=\"enter($event)\" style=\"color: #fe6948;\">\r" +
    "\n" +
    "        <img src=\"images/newline.png\" width=\"35px\" alt=\"\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleAnswer($event)\" ng-if=\"wordAnswer\">\r" +
    "\n" +
    "        <span style=\"display: block;width: 35px;color:white\">答</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"item greenItem\"\r" +
    "\n" +
    "         style=\"flex:1;-webkit-flex:1\"\r" +
    "\n" +
    "         ng-click=\"handleClickNum($event)\"\r" +
    "\n" +
    "         value=\"\\comment{}\"\r" +
    "\n" +
    "         ng-show=\"keyboardStatus.isAppTextarea&&!keyboardStatus.isCommentBox\">\r" +
    "\n" +
    "        <span style=\"display: block;width: 35px;color:white\">文</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"item greenItem\"\r" +
    "\n" +
    "         style=\"flex:1;-webkit-flex:1\"\r" +
    "\n" +
    "         ng-click=\"handleClickCommentDone($event)\"\r" +
    "\n" +
    "         ng-show=\"keyboardStatus.isCommentBox\">\r" +
    "\n" +
    "        <span style=\"display: block;color:white\">完成</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/keyboard_select.html',
    "<div class=\"keyboardUnit\">\r" +
    "\n" +
    "    <div class=\"left\">\r" +
    "\n" +
    "        <div class=\"itemRow\" ng-repeat=\"itemRow in keyboardStatus.selectInputDataList\">\r" +
    "\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\" ng-repeat=\"item in itemRow\" value=\"{{item}}\" unit>\r" +
    "\n" +
    "                <span mathjax-parser value=\"{{item}}\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"right\">\r" +
    "\n" +
    "        <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleDel($event)\">\r" +
    "\n" +
    "            <img src=\"images/del.png\" width=\"35px\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1;font-size: 15px;\" ng-click=\"findNextInput($event)\" style=\"color: #fe6948;\" ng-if=\"showFindNextInputFlag\">\r" +
    "\n" +
    "            <span style=\"display: block;width: 35px;color:white;margin-left: -8px\">下一空</span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
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
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\" style=\"flex: 2;-webkit-flex:2;\">0</div>\n" +
    "            <div class=\"item\" ng-click=\"handleClickNum($event)\">.</div>\n" +
    "        </div>\n" +
    "        <div class=\"itemRow\">\n" +
    "            <div class=\"item\" ng-click=\"handleDel($event)\">删除</div>\n" +
    "            <div class=\"item\" ng-click=\"handlePressOk()\" style=\"flex: 2;-webkit-flex:2;\">确定</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/keyboard_unit.html',
    "<div class=\"left\">\r" +
    "\n" +
    "    <div class=\"itemRow\"  ng-repeat=\"unitRows in unitsDataList\"  >\r" +
    "\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" ng-repeat=\"unitInfo in unitRows\" value=\"{{unitInfo.unit}}\"  unit\r" +
    "\n" +
    "             ng-style=\"{flexGrow:unitInfo.length,flexShrink:unitInfo.length}\">\r" +
    "\n" +
    "            <span mathjax-parser value=\"unitInfo.unit\" lazy-compile=\"true\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"right\">\r" +
    "\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">\r" +
    "\n" +
    "        <img ng-src=\"images/del.png\" width=\"35px\" alt=\"\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--<div class=\"item\" ng-click=\"space($event)\">空格</div>-->\r" +
    "\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:2\" ng-click=\"enter($event)\" style=\"color: #fe6948;\">\r" +
    "\n" +
    "        <img src=\"images/newline.png\" width=\"35px\" alt=\"\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleAnswer($event)\" ng-if=\"wordAnswer\">\r" +
    "\n" +
    "        <span style=\"display: block;width: 35px;color:white\">答</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"item greenItem\"\r" +
    "\n" +
    "         style=\"flex:1;-webkit-flex:1\"\r" +
    "\n" +
    "         ng-click=\"handleClickNum($event)\"\r" +
    "\n" +
    "         value=\"\\comment{}\"\r" +
    "\n" +
    "         ng-show=\"keyboardStatus.isAppTextarea&&!keyboardStatus.isCommentBox\">\r" +
    "\n" +
    "        <span style=\"display: block;width: 35px;color:white\">文</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"item greenItem\"\r" +
    "\n" +
    "         style=\"flex:1;-webkit-flex:1\"\r" +
    "\n" +
    "         ng-click=\"handleClickCommentDone($event)\"\r" +
    "\n" +
    "         ng-show=\"keyboardStatus.isCommentBox\">\r" +
    "\n" +
    "        <span style=\"display: block;color:white\">完成</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/keyboard_vertical.html',
    "<div class=\"left\">\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">+</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">1</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">2</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">3</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\">-</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">4</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">5</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">6</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item\" ng-click=\"handleClickNum($event)\" value=\"\\times\">×</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">7</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">8</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">9</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item\" ng-show=\"!keyboardStatus.hasMarkDiv\" ng-click=\"handleClickNum($event)\" value=\"\\vfdiv\" style=\"flex: 2;-webkit-flex:2;\">\r" +
    "\n" +
    "            <!--<img src=\"images/vfdiv.png\" width=\"57px\"/>-->\r" +
    "\n" +
    "            <img ng-src=\"{{imgDiv}}\" width=\"80px\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item\" ng-show=\"keyboardStatus.hasMarkDiv\" ng-click=\"handleClickNum($event)\" value=\"\\vfdiv-del\" style=\"flex: 2;-webkit-flex:2;\">\r" +
    "\n" +
    "            <img ng-src=\"{{imgDivDel}}\" width=\"80px\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\">0</div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-dot\" ng-show=\"keyboardStatus.vfDot\" ng-click=\"handleClickNum($event)\" value=\".\">\r" +
    "\n" +
    "            <!--小数<span style=\"font-size: 1px;color: rgb(192, 192, 192);margin-left: 4px;\">●</span>-->\r" +
    "\n" +
    "            <img ng-src=\"{{imgDot}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-dot\" ng-show=\"!keyboardStatus.vfDot\" ng-click=\"handleClickNum($event)\" value=\".-del\">\r" +
    "\n" +
    "            <img ng-src=\"{{imgDotDel}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow itemRowLast\">\r" +
    "\n" +
    "        <div class=\"item kbd-img-line\" ng-show=\"!keyboardStatus.hasMarkLine\" ng-click=\"handleClickNum($event)\" value=\"\\vfline\" style=\"flex: 2;-webkit-flex:2\">\r" +
    "\n" +
    "            <img ng-src=\"{{imgLine}}\" style=\"width:80px;margin-top: 17px;\" alt=\"\"/>\r" +
    "\n" +
    "            <!--竖式橫线-->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-line\" ng-show=\"keyboardStatus.hasMarkLine\" ng-click=\"handleClickNum($event)\" value=\"\\vfline-del\" style=\"flex: 2;-webkit-flex:2\">\r" +
    "\n" +
    "            <img ng-src=\"{{imgLineDel}}\" style=\"width:80px;margin-top: 7px;\" alt=\"\"/>\r" +
    "\n" +
    "            <!--删除橫线-->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry\" ng-click=\"handleClickNum($event, 'vf-borrow')\">\r" +
    "\n" +
    "            <!--添加进位-->\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"!keyboardStatus.vfCarry\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry1-del\">\r" +
    "\n" +
    "            <!--删除进位-->\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarryDel}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-borrow\" ng-show=\"keyboardStatus.vfBorrow\" ng-click=\"handleClickNum($event)\" value=\"\\vfborrow\">\r" +
    "\n" +
    "            <!--添加退位-->\r" +
    "\n" +
    "            <img ng-src=\"{{imgBorrow}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-borrow\" ng-show=\"!keyboardStatus.vfBorrow\" ng-click=\"handleClickNum($event)\" value=\"\\vfborrow-del\">\r" +
    "\n" +
    "            <!--删除退位-->\r" +
    "\n" +
    "            <img ng-src=\"{{imgBorrowDel}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"right\">\r" +
    "\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">\r" +
    "\n" +
    "        <img ng-src=\"{{imgBackBtn}}\" width=\"35px\" alt=\"\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"item greenItem kbd-img-clearall\" style=\"flex:1;\r" +
    "\n" +
    "    -webkit-flex:1;\r" +
    "\n" +
    "    display: flex;\r" +
    "\n" +
    "    display: -webkit-flex;\r" +
    "\n" +
    "    flex-direction: column;\r" +
    "\n" +
    "    -webkit-flex-direction: column;\" ng-click=\"handleClickNum($event)\" style=\"color: #fe6948;\"  value=\"\\vfallclear\">\r" +
    "\n" +
    "        <img ng-src=\"{{imgClearAll}}\" style=\"flex:1; -webkit-flex: 1; width: 50px;\" alt=\"\"/>\r" +
    "\n" +
    "        <!--全部<br/>清除-->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--回退-->\r" +
    "\n" +
    "    <!--<div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"\" style=\"color: #fe6948;\">\r" +
    "\n" +
    "        <img ng-src=\"{{imgUndo}}\" style=\"width: 70%;\" alt=\"\"/>\r" +
    "\n" +
    "    </div>-->\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/keyboard_vertical_carry.html',
    "<div class=\"left\">\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry1\">1</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry2\">2</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry3\">3</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry4\">4</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry5\">5</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry6\">6</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry7\">7</div>\r" +
    "\n" +
    "        <div class=\"item num\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry8\">8</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--<div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry\">\r" +
    "\n" +
    "            &lt;!&ndash;添加进位1&ndash;&gt;\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry2\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry2\">\r" +
    "\n" +
    "            &lt;!&ndash;添加进位2&ndash;&gt;\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry2}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry3\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry3\">\r" +
    "\n" +
    "            &lt;!&ndash;添加进位3&ndash;&gt;\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry3}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry4\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry4\">\r" +
    "\n" +
    "            &lt;!&ndash;添加进位4&ndash;&gt;\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry4}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry5\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry5\">\r" +
    "\n" +
    "            &lt;!&ndash;添加进位5&ndash;&gt;\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry5}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry6\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry6\">\r" +
    "\n" +
    "            &lt;!&ndash;添加进位6&ndash;&gt;\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry6}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"itemRow\">\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry7\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry7\">\r" +
    "\n" +
    "            &lt;!&ndash;添加进位7&ndash;&gt;\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry7}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item kbd-img-carry\" ng-show=\"keyboardStatus.vfCarry8\" ng-click=\"handleClickNum($event)\" value=\"\\vfcarry8\">\r" +
    "\n" +
    "            &lt;!&ndash;添加进位8&ndash;&gt;\r" +
    "\n" +
    "            <img ng-src=\"{{imgCarry8}}\" width=\"150%\" alt=\"\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>-->\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/keyboard_word.html',
    "<div class=\"left\">\n" +
    "    <div class=\"word_container\">\n" +
    "        <div class=\"item\"\n" +
    "             ng-click=\"handleClickNum($event)\"\n" +
    "             ng-repeat=\"value in pureWordsList track by $index\"\n" +
    "             value=\"{{value.item}}\"\n" +
    "             ng-style=\"{background:value.firstOrTail?'#6F6F6F':'#9391A6'}\">\n" +
    "            <span ng-if=\"value.item!='\\\\var{x}'&&value.item!='\\\\var{y}'&&value.item.indexOf('frac')===-1\">{{value.item}}</span>\n" +
    "            <span ng-if=\"value.item.indexOf('frac')>-1\" mathjax-parser value=\"{{value.item}}\"></span>\n" +
    "            <span ng-if=\"value.item=='\\\\var{x}'\" mathjax-parser value=\"x\"></span>\n" +
    "            <span ng-if=\"value.item=='\\\\var{y}'\" mathjax-parser value=\"y\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"right\">\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleDel($event)\" style=\"color: #fe6948;\">\n" +
    "        <img src=\"images/del.png\" width=\"35px\" alt=\"\"/>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\" style=\"flex:1;-webkit-flex:1\" ng-click=\"handleAnswer($event)\" ng-if=\"wordAnswer\">\n" +
    "        <span style=\"display: block;width: 35px;color:white\">答</span>\n" +
    "    </div>\n" +
    "    <div class=\"item greenItem\"\n" +
    "         style=\"flex:1;-webkit-flex:1\"\n" +
    "         ng-click=\"handleClickCommentDone($event)\"\n" +
    "         ng-show=\"keyboardStatus.isCommentBox\">\n" +
    "        <span style=\"display: block;color:white\">完成</span>\n" +
    "    </div>\n" +
    "</div>\n"
  );
}])