define([ 'ionic','./app'], function(angular, app) { app.run(['$templateCache', function($templateCache) {  'use strict';

  $templateCache.put('partials/child/child_index.html',
    "<!--<ion-view title=\"智算365\" hide-nav-bar=\"true\">-->\r" +
    "\n" +
    "    <!--<ion-header-bar class=\"bar-balanced\">-->\r" +
    "\n" +
    "        <!--<button class=\"button button-clear\" ui-sref=\"home.person_index\">-->\r" +
    "\n" +
    "            <!--<i class=\"icon ion-ios-arrow-left\"></i>-->\r" +
    "\n" +
    "            <!--返回</button>-->\r" +
    "\n" +
    "        <!--<h1 class=\"title title-center\" style=\"font-family: 'Microsoft YaHei'\">智算365</h1>-->\r" +
    "\n" +
    "        <!--<div class=\"buttons\">-->\r" +
    "\n" +
    "            <!--<button class=\"button button-clear icon ion-plus-round\" ui-sref=\"add_child\"></button>-->\r" +
    "\n" +
    "        <!--</div>-->\r" +
    "\n" +
    "    <!--</ion-header-bar>-->\r" +
    "\n" +
    "    <!--<ion-content>-->\r" +
    "\n" +
    "        <!--<div style=\"margin-top: 10px;border-bottom: 1px solid #ccc;\" ng-repeat=\"student in studentList\">-->\r" +
    "\n" +
    "            <!--<div>-->\r" +
    "\n" +
    "                <!--<img src=\"pImages/student.svg\" alt=\"\"  style=\"width: 50px; height: 50px;float: left\"/>-->\r" +
    "\n" +
    "                <!--<div style=\"float: right\">-->\r" +
    "\n" +
    "                    <!--<ion-checkbox ng-model=\"student.isClicked\" style=\"border: none\" ng-click=\"handleClick(student)\"></ion-checkbox>-->\r" +
    "\n" +
    "                <!--</div>-->\r" +
    "\n" +
    "                <!--<div style=\"padding: 5px 5px 5px 65px;\">-->\r" +
    "\n" +
    "                    <!--<div>{{student.name}}</div>-->\r" +
    "\n" +
    "                    <!--<div>{{student.loginName}}</div>-->\r" +
    "\n" +
    "                <!--</div>-->\r" +
    "\n" +
    "            <!--</div>-->\r" +
    "\n" +
    "            <!--<div style=\"margin-top: 5px\">-->\r" +
    "\n" +
    "                <!--<i class=\"icon ion-gear-b\" style=\"color:#1462d2;font-size: 16px;margin-left: 10px\" ng-click=\"showStuSettings(student)\">&nbsp;设置信息</i>-->\r" +
    "\n" +
    "                <!--<i class=\"icon ion-ios-plus-outline\" style=\"color:#1462d2;font-size: 16px;margin-left: 10px\" ui-sref=\"child_class_list({sid:student.id})\">&nbsp;添加班级</i>-->\r" +
    "\n" +
    "                <!--<i class=\"icon ion-ios-trash-outline\" style=\"color:#1462d2;font-size: 16px;margin-left: 10px\" ng-click=\"delStu($index,student.id,student.name)\">&nbsp;删除学生</i>-->\r" +
    "\n" +
    "            <!--</div>-->\r" +
    "\n" +
    "        <!--</div>-->\r" +
    "\n" +
    "    <!--</ion-content>-->\r" +
    "\n" +
    "<!--</ion-view>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<style type=\"text/css\">\r" +
    "\n" +
    "    .item-avatar {\r" +
    "\n" +
    "        padding-bottom: 10px;\r" +
    "\n" +
    "        padding-top: 16px;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>\r" +
    "\n" +
    "<ion-view hide-nav-bar=true>\r" +
    "\n" +
    "    <ion-header-bar class=\"bar-balanced\">\r" +
    "\n" +
    "        <button class=\"button back-button buttons  button-clear header-item\" ui-sref=\"home.person_index\">\r" +
    "\n" +
    "            <i class=\"icon ion-ios-arrow-back\"></i>\r" +
    "\n" +
    "            返回\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "        <button class=\"button button-clear icon ion-plus\" style=\"position: absolute;right: 0px\"\r" +
    "\n" +
    "                ui-sref=\"add_child\"></button>\r" +
    "\n" +
    "        <h1 class=\"title\" style=\"font-family: 'Microsoft YaHei'\">我的孩子</h1>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "    <ion-content padding=\"false\">\r" +
    "\n" +
    "        <div class=\"list card\" ng-repeat=\"student in studentList\">\r" +
    "\n" +
    "            <div class=\"item item-divider item-avatar\">\r" +
    "\n" +
    "                <img class=\"thumbnail-left\" src=\"pImages/student.svg\" alt=\"\">\r" +
    "\n" +
    "                <h2>{{student.name}}</h2>\r" +
    "\n" +
    "                <p>{{student.loginName}}</p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"display-flex\">\r" +
    "\n" +
    "                <div style=\"flex:1;-webkit-flex:1;text-align:center;color:#615D53\" ng-click=\"showStuSettings(student)\">\r" +
    "\n" +
    "                    <div style=\"color:#615D53\" class=\"button button-clear\"><span class=\"icon ion-gear-b\"></span>设置信息</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div style=\"flex:1;-webkit-flex:1;text-align:center;color:#615D53\" ui-sref=\"child_class_list({sid:student.id})\">\r" +
    "\n" +
    "                    <div style=\"color:#615D53\" class=\"button button-clear\"><span class=\"icon ion-ios-plus-outline\"></span>添加班级</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div style=\"flex:1;-webkit-flex:1;text-align:center;color:#615D53\" ng-click=\"delStu($index,student.id,student.name)\">\r" +
    "\n" +
    "                    <div style=\"color:#615D53\" class=\"button button-clear\"><span class=\"icon ion-ios-trash-outline\"></span>删除学生</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/game_statistics/game_list.html',
    "<!--<ion-view title=\"{{student.name}}的游戏列表\">-->\r" +
    "\n" +
    "    <!--<ion-content class=\"game\">-->\r" +
    "\n" +
    "        <!--<div class=\"item\" ng-if=\"data.gameList.length<=0\"  style=\"font-size: 20px;color: red\">目前没有游戏记录</div>-->\r" +
    "\n" +
    "        <!--<auto-list-con ng-repeat=\"game in data.gameList | orderBy:'cgceSeq'\">-->\r" +
    "\n" +
    "            <!--<div class=\"pubed_title\">-->\r" +
    "\n" +
    "                <!--<p>发布时间：{{game.publishTime}}</p>-->\r" +
    "\n" +
    "                <!--<p>游戏描述：{{game.gameDesc}}</p>-->\r" +
    "\n" +
    "            <!--</div>-->\r" +
    "\n" +
    "            <!--<auto-list ng-repeat=\"level in game.levels\">-->\r" +
    "\n" +
    "                <!--<auto-list-content class=\"bg-calm list_content\">-->\r" +
    "\n" +
    "                    <!--<div class=\"pic\">-->\r" +
    "\n" +
    "                        <!--<img ng-src=\"images/game_head/{{game.gameGuid}}.png\" alt=\"\"/>-->\r" +
    "\n" +
    "                    <!--</div>-->\r" +
    "\n" +
    "                    <!--<div class=\"content\">-->\r" +
    "\n" +
    "                        <!--<div class=\"first\">游戏名称:&nbsp;{{game.name}}(第{{level.num}}关)</div>-->\r" +
    "\n" +
    "                        <!--<div class=\"first\" style=\"overflow: visible\">知识点:&nbsp;{{level.kdName}}</div>-->\r" +
    "\n" +
    "                        <!--<div class=\"first\" ng-if=\"level.firstPassedTime\">完成日期:&nbsp;{{level.firstPassedTime}}</div>-->\r" +
    "\n" +
    "                        <!--<div class=\"first\" ng-if=\"!level.firstPassedTime\">还未通关</div>-->\r" +
    "\n" +
    "                        <!--<div class=\"first\"><span style=\"float: left\">得分：</span>-->\r" +
    "\n" +
    "                            <!--<img ng-src =\"{{level.score >= 1? start.fullStar: level.score >= 0.5?start.halfStar:start.emptyStar}}\" alt=\"\"/>-->\r" +
    "\n" +
    "                            <!--<img ng-src =\"{{level.score >= 2? start.fullStar: level.score >= 1.5?start.halfStar:start.emptyStar}}\" alt=\"\"/>-->\r" +
    "\n" +
    "                            <!--<img ng-src =\"{{level.score ==3?  start.fullStar: level.score >= 2.5 ?start.halfStar:start.emptyStar}}\" alt=\"\"/>-->\r" +
    "\n" +
    "                        <!--</div>-->\r" +
    "\n" +
    "                    <!--</div>-->\r" +
    "\n" +
    "                <!--</auto-list-content>-->\r" +
    "\n" +
    "            <!--</auto-list>-->\r" +
    "\n" +
    "            <!--<br/>-->\r" +
    "\n" +
    "        <!--</auto-list-con>-->\r" +
    "\n" +
    "    <!--</ion-content>-->\r" +
    "\n" +
    "<!--</ion-view>-->\r" +
    "\n" +
    "<style type=\"text/css\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    .pub_game_list .item-avatar .item-content{\r" +
    "\n" +
    "        padding-left: 95px;\r" +
    "\n" +
    "        padding-right: 5px;\r" +
    "\n" +
    "        padding-top: 20px;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "    .pub_game_list .item-avatar .item-content>img:first-child {\r" +
    "\n" +
    "        max-width: 70px;\r" +
    "\n" +
    "        max-height: 70px;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>\r" +
    "\n" +
    "<ion-view hide-nav-bar=\"true\">\r" +
    "\n" +
    "    <ion-header-bar align-title=\"center\" class=\"bar-balanced\">\r" +
    "\n" +
    "        <h1 class=\"title\">学生游戏列表</h1>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <ion-content class=\"pub_game_list\">\r" +
    "\n" +
    "        <div class=\"item item-input block-input\" style=\"height: 40px;font-size: 18px;rgb(6, 6, 6);\" ng-if=\"data.gameList.length<=0\">\r" +
    "\n" +
    "            目前没有发布游戏\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <ion-list ng-if=\"data.gameList.length>0\">\r" +
    "\n" +
    "            <ion-item ng-repeat=\"game in data.gameList | orderBy:'cgceSeq'\"\r" +
    "\n" +
    "                      ng-if=\"data.gameList.length>0\"\r" +
    "\n" +
    "                      ng-click=\"showLevels(game)\"\r" +
    "\n" +
    "                      class=\"item item-avatar \">\r" +
    "\n" +
    "                <div class=\"item-content\" style=\"padding-left: 30px\">\r" +
    "\n" +
    "                    <img ng-src=\"images/game_icon/{{game.gameGuid}}.png\" alt=\"\" style=\"max-width: 70px;max-height: 70px;\"/>\r" +
    "\n" +
    "                    <div class=\"display-flex\">\r" +
    "\n" +
    "                        <div style=\"flex:1;-webkit-flex:3\">\r" +
    "\n" +
    "                            <h2>{{game.name}}</h2>\r" +
    "\n" +
    "                            <p>{{game.gameDesc}}</p>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div style=\"flex:1;-webkit-flex:2 \">\r" +
    "\n" +
    "                            <p>{{game.publishTime.substr(0,11)}}</p>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </ion-item>\r" +
    "\n" +
    "        </ion-list>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script id=\"level-select.html\" type=\"text/ng-template\">\r" +
    "\n" +
    "    <ion-modal-view>\r" +
    "\n" +
    "        <ion-header-bar class=\"bar-balanced\">\r" +
    "\n" +
    "            <h1 class=\"title\">{{selectedGame.name}}</h1>\r" +
    "\n" +
    "        </ion-header-bar>\r" +
    "\n" +
    "        <ion-content>\r" +
    "\n" +
    "            <ul class=\"list\">\r" +
    "\n" +
    "                <li  ng-repeat=\"level in selectedGame.levels\"\r" +
    "\n" +
    "                     class=\"item item-avatar  item-complex item-right-editable\">\r" +
    "\n" +
    "                    <div class=\"item-content\" style=\"padding:16px 49px 16px 72px\">\r" +
    "\n" +
    "                        <img ng-src=\"images/game_icon/{{selectedGame.gameGuid}}.png\" alt=\"\"/>\r" +
    "\n" +
    "                        <h2>{{level.name}}(第{{level.num}}关)</h2>\r" +
    "\n" +
    "                        <p>{{level.desc}}</p>\r" +
    "\n" +
    "                        <div>\r" +
    "\n" +
    "                        <img width=\"20px\" ng-src =\"{{level.score >= 1? start.fullStar: level.score >= 0.5?start.halfStar:start.emptyStar}}\" alt=\"\"/>\r" +
    "\n" +
    "                        <img width=\"20px\" ng-src =\"{{level.score >= 2? start.fullStar: level.score >= 1.5?start.halfStar:start.emptyStar}}\" alt=\"\"/>\r" +
    "\n" +
    "                        <img width=\"20px\" ng-src =\"{{level.score ==3?  start.fullStar: level.score >= 2.5 ?start.halfStar:start.emptyStar}}\" alt=\"\"/>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </ion-content>\r" +
    "\n" +
    "        <ion-footer-bar class=\"bar-balanced\" style=\"align-items: center;justify-content: center;-webkit-align-items:center;-webkit-justify-content:center\">\r" +
    "\n" +
    "            <div class=\"buttons\">\r" +
    "\n" +
    "                <div class=\"button button-clear\" ng-click=\"closeModal()\">&nbsp;关闭</div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ion-footer-bar>\r" +
    "\n" +
    "    </ion-modal-view>\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('partials/game_statistics/game_statistics.html',
    "<ion-view title=\"错误归因\" class=\"statisstics\">\r" +
    "\n" +
    "    <ion-content class=\"has-subheader\" overflow-scroll=\"false\">\r" +
    "\n" +
    "        <div row-auto-height style=\"position: relative\" id=\"mainContent\">\r" +
    "\n" +
    "            <div  style=\"overflow-y: auto;height: 50%;\" id=\"topContent\">\r" +
    "\n" +
    "                <div style=\"text-align: center\">\r" +
    "\n" +
    "                    <h4>{{stuName}}在当前关卡的错误类型统计</h4>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <table>\r" +
    "\n" +
    "                    <tr>\r" +
    "\n" +
    "                        <th ng-repeat=\"title in data.tabTitle\">{{title.name}}</th>\r" +
    "\n" +
    "                    </tr>\r" +
    "\n" +
    "                    <tr ng-repeat=\"info in data.tabData\">\r" +
    "\n" +
    "                        <td class=\"name\">{{info.position}}</td>\r" +
    "\n" +
    "                        <td>{{info.description}}</td>\r" +
    "\n" +
    "                        <td>{{info.num}}</td>\r" +
    "\n" +
    "                    </tr>\r" +
    "\n" +
    "                </table>\r" +
    "\n" +
    "                <br/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div  style=\"border-top:4px solid rgba(15, 121, 89, 0.26);position: absolute;bottom: 0;width: 100%;height: 50%;\" on-touch=\"onTouch($event)\" on-drag=\"onDrag($event)\" id=\"bottomContent\">\r" +
    "\n" +
    "                <img src=\"{{data.total.imgUrl}}\" height=\"100%\" width=\"100%\" alt=\"\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/home.html',
    "<style type=\"text/css\">\r" +
    "\n" +
    "    .badgeStyle {\r" +
    "\n" +
    "        background-color: red !important;\r" +
    "\n" +
    "        top: 0 !important;\r" +
    "\n" +
    "        opacity: .8 !important;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>\r" +
    "\n" +
    "<ion-tabs class=\"tabs-icon-top tabs-stable\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <ion-tab title=\"作业\" icon=\"icon ion-ios-paper-outline\" ui-sref=\"home.work_list\">\r" +
    "\n" +
    "        <ion-nav-view name=\"work_list\"></ion-nav-view>\r" +
    "\n" +
    "    </ion-tab>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <ion-tab title=\"游戏\" icon=\"icon ion-ios-game-controller-b\" ui-sref=\"home.game_list\">\r" +
    "\n" +
    "        <ion-nav-view name=\"game_list\"></ion-nav-view>\r" +
    "\n" +
    "    </ion-tab>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <ion-tab title=\"消息\" icon=\"icon ion-android-chat\" ui-sref=\"home.msg\" badge=\"unRead.count\" badge-style=\"badgeStyle\">\r" +
    "\n" +
    "        <ion-nav-view name=\"message_list\"></ion-nav-view>\r" +
    "\n" +
    "    </ion-tab>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <ion-tab title=\"我\" icon=\"icon ion-android-person\" ui-sref=\"home.person_index\">\r" +
    "\n" +
    "        <ion-nav-view name=\"person_index\"></ion-nav-view>\r" +
    "\n" +
    "    </ion-tab>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</ion-tabs>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('partials/personal/basic_info_first.html',
    "<ion-view title=\"完善个人信息\">\r" +
    "\n" +
    "    <div class=\"bar bar-subheader bg-balanced\">\r" +
    "\n" +
    "        <button class=\"button-clear bg-calm icon ion-ios-plus-outline not-active\"\r" +
    "\n" +
    "                ng-click=\"handleTabBtnClick($event,1)\">基本信息\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "        <button class=\"button-clear bg-balanced icon ion-ios-plus-outline active\"\r" +
    "\n" +
    "                ng-click=\"handleTabBtnClick($event,2)\">密保信息\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <ion-content padding=\"true\" class=\"has-subheader\">\r" +
    "\n" +
    "        <ng-form name=\"baseInfoForm\" novalidate class=\"list\" style=\"margin-top: 20px\" ng-show=\"pageStatus==1\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"text\" placeholder=\"真实姓名\" ng-model=\"formData.name\" name=\"realName\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row item\" style=\"margin-bottom: 10px\">\r" +
    "\n" +
    "                <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\"  ng-checked=\"formData.gender==1\" ng-click=\"handleCheck($event,1)\">\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    男\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-checked=\"formData.gender==0\" ng-click=\"handleCheck($event,0)\">\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    女\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 ng-click=\"handleBaseInfoSubmit()\">\r" +
    "\n" +
    "                保存\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <ng-form name=\"securityInfoForm\"  ng-show=\"pageStatus==2\" novalidate=\"novalidate\">\r" +
    "\n" +
    "            <div class=\"list\" ng-repeat=\"item in qList\" style=\"margin-bottom: 5px\">\r" +
    "\n" +
    "                <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                    <label>问题{{item.num}}:{{item.question}}?</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"答案\"  ng-model=\"item.answer\"  required>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"button button-block button-balanced\"\r" +
    "\n" +
    "                    type=\"submit\"\r" +
    "\n" +
    "                    ng-click=\"submitSecurityInfoForm()\">\r" +
    "\n" +
    "                保存\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/personal/basic_info_manage.html',
    "<ion-view title=\"个人中心\" hide-back-button=\"true\" hide-nav-bar=\"true\">\r" +
    "\n" +
    "    <ion-header-bar class=\"bar-balanced\">\r" +
    "\n" +
    "        <button class=\"button button-clear\" ui-sref=\"home.person_index\">\r" +
    "\n" +
    "            <i class=\"icon ion-ios-arrow-back\"></i>\r" +
    "\n" +
    "            返回</button>\r" +
    "\n" +
    "        <h1 class=\"title title-center\" style=\"font-family: 'Microsoft YaHei'\">个人中心</h1>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <sub-header id=\"basic_info_manage_subheader\">\r" +
    "\n" +
    "        <div class=\"subheader-item\"\r" +
    "\n" +
    "             id=\"basic_info\"\r" +
    "\n" +
    "             ng-click=\"handleTabBtnClick($event,1)\">基本信息\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"subheader-item\"\r" +
    "\n" +
    "             id=\"pqs\"\r" +
    "\n" +
    "             ng-click=\"handleTabBtnClick($event,2)\">账号安全\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"subheader-item\" ng-show=\"loginType=='P'\"\r" +
    "\n" +
    "             id=\"pT\">第二监护人\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </sub-header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!--<div class=\"bar bar-subheader\">-->\r" +
    "\n" +
    "        <!--<button class=\"button-clear bg-calm icon ion-ios-plus-outline not-active subheader-item\"-->\r" +
    "\n" +
    "                <!--ng-click=\"handleTabBtnClick($event,1)\">基本信息-->\r" +
    "\n" +
    "        <!--</button>-->\r" +
    "\n" +
    "        <!--<button class=\"button-clear bg-balanced icon ion-ios-plus-outline active subheader-item\"-->\r" +
    "\n" +
    "                <!--ng-click=\"handleTabBtnClick($event,2)\">账号安全-->\r" +
    "\n" +
    "        <!--</button>-->\r" +
    "\n" +
    "       <!--&lt;!&ndash; <button class=\"button-clear bg-balanced icon ion-ios-plus-outline active\"-->\r" +
    "\n" +
    "                <!--ng-click=\"handleTabBtnClick($event,3)\">密保信息-->\r" +
    "\n" +
    "        <!--</button>&ndash;&gt;-->\r" +
    "\n" +
    "        <!--<button class=\"button-clear bg-balanced icon ion-ios-plus-outline active subheader-item\"-->\r" +
    "\n" +
    "                <!--ng-click=\"handleTabBtnClick($event,4)\" ng-if=\"loginType=='P'\">第二监护人-->\r" +
    "\n" +
    "        <!--</button>-->\r" +
    "\n" +
    "    <!--</div>-->\r" +
    "\n" +
    "    <ion-content padding=\"true\" class=\"has-subheader\">\r" +
    "\n" +
    "        <ng-form name=\"baseInfoForm\" novalidate class=\"list\" style=\"margin-top: 20px\" ng-show=\"pageStatus==1\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"text\" placeholder=\"真实姓名\" ng-model=\"formData.name\" name=\"realName\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row item\" style=\"margin-bottom: 10px\">\r" +
    "\n" +
    "                <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\"  ng-checked=\"formData.gender==1\" ng-click=\"handleCheck($event,1)\">\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    男\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-checked=\"formData.gender==0\" ng-click=\"handleCheck($event,0)\">\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    女\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 ng-click=\"handleBaseInfoSubmit()\">\r" +
    "\n" +
    "                保存\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <ng-form name=\"cellphoneResetForm\" class=\"list\" ng-show=\"pageStatus==2\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"text\"\r" +
    "\n" +
    "                       placeholder=\"请输入关联手机号\"\r" +
    "\n" +
    "                       name=\"cellphone\"\r" +
    "\n" +
    "                       ng-model=\"formData.tel\"\r" +
    "\n" +
    "                       required\r" +
    "\n" +
    "                       pattern=\"^1\\d{10}$\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  img-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\"\r" +
    "\n" +
    "                           placeholder=\"图形验证码\"\r" +
    "\n" +
    "                           name=\"vCode\"\r" +
    "\n" +
    "                           ng-model=\"formData.vCode\"\r" +
    "\n" +
    "                           required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <img src=\"{{validateImageUrl}}\"/>\r" +
    "\n" +
    "                <i class=\"button icon ion-refresh button-clear\"\r" +
    "\n" +
    "                   ng-click=\"getValidateImage()\">\r" +
    "\n" +
    "                </i>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  phone-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"手机验证码\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button class=\"button button-positive\" ng-model=\"formData.telVC\" name=\"telVC\"  ng-click=\"getTelVC()\" ng-disabled=\"telVcBtn\">{{telVcBtnText}}</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"button button-block button-balanced\"\r" +
    "\n" +
    "                    type=\"submit\"\r" +
    "\n" +
    "                    ng-click=\"submitReferCellphoneForm()\">\r" +
    "\n" +
    "                提交\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <!--<ng-form name=\"securityInfoForm\" class=\"list\" ng-show=\"pageStatus==3\" novalidate=\"novalidate\">\r" +
    "\n" +
    "            <div class=\"list\" ng-repeat=\"item in qList\" style=\"margin-bottom: 5px\">\r" +
    "\n" +
    "                <div class=\"item item-input block-input\" >\r" +
    "\n" +
    "                    <label>问题{{item.num}}:{{item.question}}?</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"答案\"  ng-model=\"item.answer\"  required>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"button button-block button-balanced\"\r" +
    "\n" +
    "                    type=\"submit\"\r" +
    "\n" +
    "                    ng-click=\"submitSecurityInfoForm()\">\r" +
    "\n" +
    "                保存\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </ng-form>-->\r" +
    "\n" +
    "        <div ng-show=\"pageStatus==4&&secondP.first\">\r" +
    "\n" +
    "            <ng-form name=\"setSecondPForm\" id=\"registerForm\" novalidate=\"novalidate\" class=\"list\" style=\"margin-top: 20px\">\r" +
    "\n" +
    "                <div class=\"item item-input block-input\" >\r" +
    "\n" +
    "                    <i class=\"ion ion-iphone\" style=\"font-size: 30px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"第二监护人手机号\" ng-model=\"secondP.secondPhone\" name=\"secondPhone\"\r" +
    "\n" +
    "                           pattern=\"^1[0-9]{10}$\" required />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"item item-input block-input\" >\r" +
    "\n" +
    "                    <i class=\"ion ion-iphone\" style=\"font-size: 30px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"第二监护人姓名\" ng-model=\"secondP.secondName\" name=\"secondName\"\r" +
    "\n" +
    "                            required />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                    <i class=\"ion ion-locked\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                    <input type=\"password\" placeholder=\"密码\" ng-model=\"secondP.secondPassword\" name=\"secondPassword\" required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                    <i class=\"ion ion-locked\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                    <input type=\"password\" placeholder=\"再次输入密码\" ng-model=\"secondP.confirmPass\" name=\"confirmPassword\" confirm-pass=\"secondP.secondPassword\" required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"row item\" style=\"margin-bottom: 10px\">\r" +
    "\n" +
    "                    <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                        <label class=\"checkbox\">\r" +
    "\n" +
    "                            <input type=\"checkbox\"  ng-checked=\"secondP.secondGender==1\" ng-click=\"handleSecondGCheck($event,1)\">\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                        男\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                        <label class=\"checkbox\">\r" +
    "\n" +
    "                            <input type=\"checkbox\" ng-checked=\"secondP.secondGender==0\" ng-click=\"handleSecondGCheck($event,0)\">\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                        女\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!--关系下拉菜单 start-->\r" +
    "\n" +
    "                <label class=\"item item-input item-select\" style=\"margin-bottom: 5px\" >\r" +
    "\n" +
    "                    <div class=\"input-label\" style=\"color: #a29f91\">\r" +
    "\n" +
    "                        与学生的关系\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <select name=\"relationship\" id=\"relationship\" style=\"height: 50px\" ng-model=\"secondP.secondRelationShip\">\r" +
    "\n" +
    "                        <option value=\"0\">父亲</option>\r" +
    "\n" +
    "                        <option value=\"1\">母亲</option>\r" +
    "\n" +
    "                        <option value=\"2\">爷爷</option>\r" +
    "\n" +
    "                        <option value=\"3\">奶奶</option>\r" +
    "\n" +
    "                        <option value=\"4\">外公</option>\r" +
    "\n" +
    "                        <option value=\"5\">外婆</option>\r" +
    "\n" +
    "                        <option value=\"6\">其他</option>\r" +
    "\n" +
    "                    </select>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "                <!--关系下拉菜单 end-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </ng-form>\r" +
    "\n" +
    "            <!--用户注册信息表单 end-->\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 type=\"submit\"\r" +
    "\n" +
    "                 ng-click=\"settingSecondSubmit()\" >\r" +
    "\n" +
    "                设置\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-show=\"pageStatus==4&&!secondP.first\">\r" +
    "\n" +
    "            <div  class=\"list\" style=\"margin-top: 20px\">\r" +
    "\n" +
    "                <label class=\"item item-input\" style=\"margin-bottom: 5px\" >\r" +
    "\n" +
    "                    <div class=\"input-label\" style=\"color: #a29f91\">\r" +
    "\n" +
    "                        账号：&nbsp;&nbsp;<span style=\"color: black;\" ng-bind=\"secondP.loginName\"></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "                <label class=\"item item-input \" style=\"margin-bottom: 5px\" >\r" +
    "\n" +
    "                    <div class=\"input-label\" style=\"color: #a29f91\">\r" +
    "\n" +
    "                        手机号：&nbsp;&nbsp;<span style=\"color: black;\" ng-bind=\"secondP.secondPhone\"></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "                <label class=\"item item-input \" style=\"margin-bottom: 5px\" >\r" +
    "\n" +
    "                    <div class=\"input-label\" style=\"color: #a29f91\">\r" +
    "\n" +
    "                        姓名：&nbsp;&nbsp;<span style=\"color: black;\" ng-bind=\"secondP.secondName\"></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "                <label class=\"item item-input \" style=\"margin-bottom: 5px\" >\r" +
    "\n" +
    "                    <div class=\"input-label\" style=\"color: #a29f91\">\r" +
    "\n" +
    "                        性别：&nbsp;&nbsp;<span style=\"color: black;\" ng-bind=\"secondP.secondGenderShow\"></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "                <label class=\"item item-input\" style=\"margin-bottom: 5px\" >\r" +
    "\n" +
    "                    <div class=\"input-label\" style=\"color: #a29f91\">\r" +
    "\n" +
    "                        与学生的关系：&nbsp;&nbsp;<span style=\"color: black;\" ng-bind=\"secondP.secondRelationShipShow\"></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "       <!-- <ng-form name=\"securityInfoForm\" class=\"list\" ng-show=\"pageStatus==4\" novalidate=\"novalidate\">\r" +
    "\n" +
    "            <div class=\"list\" ng-repeat=\"item in qList\" style=\"margin-bottom: 5px\">\r" +
    "\n" +
    "                <div class=\"item item-input block-input\" >\r" +
    "\n" +
    "                    <label>问题{{item.num}}:{{item.question}}?</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"答案\"  ng-model=\"item.answer\"  required>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"button button-block button-balanced\"\r" +
    "\n" +
    "                    type=\"submit\"\r" +
    "\n" +
    "                    ng-click=\"submitSecurityInfoForm()\">\r" +
    "\n" +
    "                保存\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </ng-form>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/personal/person_index.html',
    "<ion-view  hide-nav-bar=\"true\">\r" +
    "\n" +
    "    <ion-header-bar align-title=\"center\" class=\"bar-balanced\">\r" +
    "\n" +
    "        <h1 class=\"title\">我</h1>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "    <ion-content padding=\"true\" class=\"has-header\">\r" +
    "\n" +
    "        <ul class=\"list\">\r" +
    "\n" +
    "            <a  class=\"item item-avatar\" menu-close  ui-sref=\"basic_info_manage\">\r" +
    "\n" +
    "                <img src=\"images/student.svg\"  alt=\"\">\r" +
    "\n" +
    "                <h2 class=\"name\">{{user.name}}</h2>\r" +
    "\n" +
    "                <p class=\"loginName\">{{user.loginName}}</p>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "            <a  class=\"item \" menu-close ui-sref=\"child_index\"><span class=\"icon ion-happy-outline\"></span>&nbsp;我的孩子</a>\r" +
    "\n" +
    "            <a  class=\"item \" menu-close ng-click=\"scanQRCode()\"><span class=\"icon ion-qr-scanner\"></span>&nbsp;扫一扫</a>\r" +
    "\n" +
    "            <a  class=\"item \" menu-close ng-click=\"logout()\"><span class=\"icon ion-android-exit\"></span>&nbsp;退出</a>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script id=\"allowDevice.html\" type=\"text/ng-template\">\r" +
    "\n" +
    "    <ion-modal-view>\r" +
    "\n" +
    "        <ion-header-bar class=\"bar-positive\">\r" +
    "\n" +
    "            <button class=\"button back-button buttons  button-clear header-item\" ng-click=\"Modal.hide()\">\r" +
    "\n" +
    "                <i class=\"icon ion-ios-arrow-back\"></i>\r" +
    "\n" +
    "                返回\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <h1 class=\"title\" align-title=\"center\">是否允许其他设备登录</h1>\r" +
    "\n" +
    "        </ion-header-bar>\r" +
    "\n" +
    "        <ion-content>\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <ion-checkbox ng-model=\"isAllow.no\" style=\"font-weight: normal\" ng-click=\"select(0)\">拒绝</ion-checkbox>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <ion-checkbox ng-model=\"isAllow.yes\" style=\"font-weight: normal;\" ng-click=\"select(1)\">允许一次\r" +
    "\n" +
    "                </ion-checkbox>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <ion-checkbox ng-model=\"isAllow.always\" style=\"font-weight: normal;\" ng-click=\"select(2)\">总是允许\r" +
    "\n" +
    "                </ion-checkbox>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ion-content>\r" +
    "\n" +
    "    </ion-modal-view>\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('partials/system_auth/add_child.html',
    "<ion-view title=\"添加学生\">\r" +
    "\n" +
    "    <ion-content padding=\"true\">\r" +
    "\n" +
    "        <!--学生基本信息 start-->\r" +
    "\n" +
    "        <ng-form name=\"studentRegisterForm\" class=\"list\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-person\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"text\"\r" +
    "\n" +
    "                       placeholder=\"学生名\"\r" +
    "\n" +
    "                       required=\"\"\r" +
    "\n" +
    "                       name=\"studentName\"\r" +
    "\n" +
    "                       ng-model=\"formData.name\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-locked\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"password\"\r" +
    "\n" +
    "                       placeholder=\"密码\"\r" +
    "\n" +
    "                       required=\"\"\r" +
    "\n" +
    "                       name=\"password\"\r" +
    "\n" +
    "                       ng-model=\"formData.password\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-locked\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"password\"\r" +
    "\n" +
    "                       placeholder=\"再次输入密码\"\r" +
    "\n" +
    "                       required=\"\"\r" +
    "\n" +
    "                       name=\"confirmPassword\"\r" +
    "\n" +
    "                       ng-model=\"formData.confirmPassword\" confirm-pass=\"formData.password\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!--关系下拉菜单 start-->\r" +
    "\n" +
    "            <label class=\"item item-input item-select\" style=\"margin-bottom: 5px\">\r" +
    "\n" +
    "                <div class=\"input-label\" style=\"color: #a29f91\">\r" +
    "\n" +
    "                    与学生的关系\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <select name=\"relationship\" id=\"relationship\" ng-model=\"formData.relationShip\" style=\"height: 50px\">\r" +
    "\n" +
    "                    <option value=\"0\">父亲</option>\r" +
    "\n" +
    "                    <option value=\"1\">母亲</option>\r" +
    "\n" +
    "                    <option value=\"2\">爷爷</option>\r" +
    "\n" +
    "                    <option value=\"3\">奶奶</option>\r" +
    "\n" +
    "                    <option value=\"4\">外公</option>\r" +
    "\n" +
    "                    <option value=\"5\">外婆</option>\r" +
    "\n" +
    "                    <option value=\"6\">其他</option>\r" +
    "\n" +
    "                </select>\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "            <!--关系下拉菜单 end-->\r" +
    "\n" +
    "            <!--性别选择 start-->\r" +
    "\n" +
    "            <div class=\"row item\" style=\"margin-bottom: 10px\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-checked=\"formData.gender==1\" ng-click=\"handleGenderSelect(1)\" >\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    男\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-checked=\"formData.gender==0\" ng-click=\"handleGenderSelect(0)\" >\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    女\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!--性别选择 end-->\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-key\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"text\"\r" +
    "\n" +
    "                       placeholder=\"学生邀请码\"\r" +
    "\n" +
    "                       required=\"\"\r" +
    "\n" +
    "                       name=\"iCode\"\r" +
    "\n" +
    "                       ng-model=\"formData.iCode\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  img-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\"\r" +
    "\n" +
    "                           placeholder=\"图形验证码\"\r" +
    "\n" +
    "                           required=\"\"\r" +
    "\n" +
    "                           name=\"vCode\"\r" +
    "\n" +
    "                           ng-model=\"formData.vCode\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <img src=\"{{validateImageUrl}}\"/>\r" +
    "\n" +
    "                <i class=\"button  icon ion-refresh button-clear\"\r" +
    "\n" +
    "                        ng-click=\"getValidateImage()\"></i>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 ng-click=\"handleSubmit()\">\r" +
    "\n" +
    "                注册\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <!--学生基本信息表单 end-->\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/change_device_login.html',
    "<ion-view title=\"验证手机号码\">\r" +
    "\n" +
    "    <ion-content padding=\"true\">\r" +
    "\n" +
    "        <div class=\"list\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\" style=\"height: 40px;\" >\r" +
    "\n" +
    "                <label style=\"font-size: 15px;color: red\">更换设备登录，需要验证手机号码！</label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  phone-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"手机验证码\" ng-model=\"formData.telVC\" name=\"telVC\" required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button class=\"button button-positive\" ng-click=\"getTelVC()\" ng-disabled=\"telVcBtn\">{{telVcBtnText}}</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 type=\"submit\"\r" +
    "\n" +
    "                 ng-click=\"checkTelVcSubmit()\" >\r" +
    "\n" +
    "                提交\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/child_class_apply.html',
    "<ion-view title=\"添加班级申请\">\r" +
    "\n" +
    "    <ion-content padding=\"true\">\r" +
    "\n" +
    "        <!--班级申请信息表单 start-->\r" +
    "\n" +
    "        <ng-form novalidate name=\"classApplyForm\" class=\"list\" style=\"margin-top: 20px\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-person-stalker\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"text\"\r" +
    "\n" +
    "                       placeholder=\"请输入班级号\"\r" +
    "\n" +
    "                       required\r" +
    "\n" +
    "                       name=\"classNumber\"\r" +
    "\n" +
    "                       ng-model=\"formData.classNumber\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  img-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\"\r" +
    "\n" +
    "                           placeholder=\"图形验证码\"\r" +
    "\n" +
    "                           required\r" +
    "\n" +
    "                           name=\"vCode\"\r" +
    "\n" +
    "                           ng-model=\"formData.vCode\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <img src=\"{{validateImageUrl}}\"/>\r" +
    "\n" +
    "                <i class=\"button icon ion-refresh button-clear\"\r" +
    "\n" +
    "                        ng-click=\"getValidateImage()\"></i>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <!--班级申请信息表单 end-->\r" +
    "\n" +
    "        <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "             ng-click=\"handleSubmit()\">\r" +
    "\n" +
    "            申请加入\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/child_class_detail.html',
    "<ion-view title=\"班级详情\">\r" +
    "\n" +
    "    <ion-content padding=\"true\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <auto-list-con>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <auto-list>\r" +
    "\n" +
    "                <auto-list-content style=\"background-color: #ffffff;\">\r" +
    "\n" +
    "                    <img class=\"thumbnail-left\" src=\"images/class.svg\" alt=\"\"/>\r" +
    "\n" +
    "                    <div class=\"second\" style=\"color: #000000\" ng-bind=\"clazzInfo.name\"></div>\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <auto-list>\r" +
    "\n" +
    "                <auto-list-content class=\"span-container\">\r" +
    "\n" +
    "                    <span class=\"span-left\">详细地址：</span>\r" +
    "\n" +
    "                    <span class=\"span-right\">{{clazzInfo.provinceName+clazzInfo.cityName+clazzInfo.districtName}}</span>\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <auto-list>\r" +
    "\n" +
    "                <auto-list-content class=\"span-container\">\r" +
    "\n" +
    "                    <span class=\"span-left\">学校名称：</span>\r" +
    "\n" +
    "                    <span class=\"span-right\">{{clazzInfo.schoolName}}</span>\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <auto-list>\r" +
    "\n" +
    "                <auto-list-content class=\"span-container\">\r" +
    "\n" +
    "                    <span class=\"span-left\">班级名称：</span>\r" +
    "\n" +
    "                    <span class=\"span-right\">{{clazzInfo.className}}</span>\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <auto-list>\r" +
    "\n" +
    "                <auto-list-content class=\"span-container\">\r" +
    "\n" +
    "                    <span class=\"span-left\">教师名称：</span>\r" +
    "\n" +
    "                    <span class=\"span-right\">{{clazzInfo.teacher}}</span>\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <auto-list>\r" +
    "\n" +
    "                <auto-list-content class=\"span-container\">\r" +
    "\n" +
    "                    <span class=\"span-left\">班级人数：</span>\r" +
    "\n" +
    "                    <span class=\"span-right\">{{clazzInfo.studentCount}}</span>\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </auto-list-con>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/child_class_list.html',
    "<!--<ion-view title=\"班级列表\">-->\r" +
    "\n" +
    "    <!--<ion-nav-buttons side=\"right\">-->\r" +
    "\n" +
    "        <!--<button class=\"button button-clear icon ion-ios-plus-outline\" ui-sref=\"child_class_apply({sid:sid})\">申请班级</button>-->\r" +
    "\n" +
    "    <!--</ion-nav-buttons>-->\r" +
    "\n" +
    "    <!--<ion-content padding=\"false\">-->\r" +
    "\n" +
    "        <!--<auto-list-con>-->\r" +
    "\n" +
    "            <!--&lt;!&ndash;班级列表 start&ndash;&gt;-->\r" +
    "\n" +
    "            <!--<auto-list ng-repeat=\"clazz in classList\" >-->\r" +
    "\n" +
    "                <!--<auto-list-content class=\"bg-calm\">-->\r" +
    "\n" +
    "                    <!--<img class=\"thumbnail-left\" src=\"images/class.svg\" alt=\"\"/>-->\r" +
    "\n" +
    "                    <!--<div class=\"first\">状态：{{clazz.auditStatusName}}</div>-->\r" +
    "\n" +
    "                    <!--<div class=\"first\">老师：{{clazz.teacher}}</div>-->\r" +
    "\n" +
    "                    <!--<div class=\"first\">班级名：{{clazz.name}}</div>-->\r" +
    "\n" +
    "                    <!--<div class=\"tool-bar-right\">-->\r" +
    "\n" +
    "                        <!--<div class=\"tool-bar-item\" ng-click=\"delStuClass(sid,clazz.id,$index)\">-->\r" +
    "\n" +
    "                            <!--<i class=\"icon ion-ios-trash-outline\"></i>-->\r" +
    "\n" +
    "                        <!--</div>-->\r" +
    "\n" +
    "                        <!--<div class=\"tool-bar-item\">-->\r" +
    "\n" +
    "                            <!--<i class=\"icon icon ion-clipboard\"  ui-sref=\"child_class_detail({cid:clazz.id})\">-->\r" +
    "\n" +
    "                            <!--</i>-->\r" +
    "\n" +
    "                        <!--</div>-->\r" +
    "\n" +
    "                    <!--</div>-->\r" +
    "\n" +
    "                <!--</auto-list-content>-->\r" +
    "\n" +
    "            <!--</auto-list>-->\r" +
    "\n" +
    "            <!--&lt;!&ndash;班级列表 end&ndash;&gt;-->\r" +
    "\n" +
    "        <!--</auto-list-con>-->\r" +
    "\n" +
    "    <!--</ion-content>-->\r" +
    "\n" +
    "<!--</ion-view>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "<style type=\"text/css\">\r" +
    "\n" +
    "    .clazz_list .item-avatar {\r" +
    "\n" +
    "        padding-bottom: 10px;\r" +
    "\n" +
    "        padding-top: 16px;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>\r" +
    "\n" +
    "<ion-view title=\"班级列表\">>\r" +
    "\n" +
    "    <ion-nav-buttons side=\"right\">\r" +
    "\n" +
    "        <button class=\"button button-clear icon ion-ios-plus-outline\" ui-sref=\"child_class_apply({sid:sid})\">申请班级</button>\r" +
    "\n" +
    "    </ion-nav-buttons>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "    <ion-content padding=\"false\" class=\"clazz_list\" >\r" +
    "\n" +
    "        <div class=\"list card\" ng-repeat=\"clazz in classList\">\r" +
    "\n" +
    "            <div class=\"item item-divider item-avatar\">\r" +
    "\n" +
    "                <img class=\"thumbnail-left\" src=\"images/class.svg\" alt=\"\">\r" +
    "\n" +
    "                <h2>{{clazz.name}}</h2>\r" +
    "\n" +
    "                <p>{{'班级号:'+clazz.id}}</p>\r" +
    "\n" +
    "                <p>状态：{{clazz.auditStatusName}}</p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-text-wrap\">\r" +
    "\n" +
    "                <div>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:{{clazz.grade}}年级</div>\r" +
    "\n" +
    "                <!--    <div>所属学校:{{clazz.schoolName}}</div>\r" +
    "\n" +
    "                   <div>创建时间:{{clazz.createdTime}}</div> -->\r" +
    "\n" +
    "                <div>班级人数:{{clazz.studentCount}}</div>\r" +
    "\n" +
    "                <!-- <pre>{{clazz|json}}</pre> -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"display-flex\">\r" +
    "\n" +
    "                <div style=\"flex:1;-webkit-flex:1;text-align:center;color:#615D53\" ng-click=\"delStuClass(sid,clazz.id,$index)\">\r" +
    "\n" +
    "                    <div style=\"color:#615D53\" class=\"button button-clear\"><span class=\"icon ion-ios-trash-outline\"></span>删除班级</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div style=\"flex:1;-webkit-flex:1;text-align:center;color:#615D53\">\r" +
    "\n" +
    "                    <div style=\"color:#615D53\" class=\"button button-clear\" ui-sref=\"child_class_detail({cid:clazz.id})\">\r" +
    "\n" +
    "                        <span class=\"icon ion-android-document\"></span>\r" +
    "\n" +
    "                        详细信息</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>\r" +
    "\n"
  );


  $templateCache.put('partials/system_auth/edit_child.html',
    "<ion-view title=\"修改学生信息\">\r" +
    "\n" +
    "    <div class=\"bar bar-subheader bg-balanced\">\r" +
    "\n" +
    "        <button class=\"button-clear  icon ion-ios-plus-outline not-active\" ng-click=\"handleTabBtnClick($event,1)\">基本信息\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "        <button class=\"button-clear  icon ion-ios-plus-outline active\" ng-click=\"handleTabBtnClick($event,2)\">修改密码\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <sub-header id=\"edit_student_subheader\">\r" +
    "\n" +
    "        <div class=\"subheader-item\"\r" +
    "\n" +
    "             id=\"edit_basic_info\"\r" +
    "\n" +
    "             ng-click=\"handleTabBtnClick($event,1)\">基本信息\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"subheader-item\"\r" +
    "\n" +
    "             id=\"edit_pqs\"\r" +
    "\n" +
    "             ng-click=\"handleTabBtnClick($event,2)\">账号安全\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </sub-header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <ion-content padding=\"true\" class=\"has-subheader\">\r" +
    "\n" +
    "        <!--学生信息表单 start-->\r" +
    "\n" +
    "        <ng-form name=\"studentRegisterForm\" class=\"list\" ng-if=\"pageStatus==1\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-person\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"text\"\r" +
    "\n" +
    "                       placeholder=\"学生名\"\r" +
    "\n" +
    "                       required=\"\"\r" +
    "\n" +
    "                       name=\"studentName\"\r" +
    "\n" +
    "                       ng-model=\"formData.studentName\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!--关系下拉菜单 start-->\r" +
    "\n" +
    "            <label class=\"item item-input item-select\" style=\"margin-bottom: 5px\" >\r" +
    "\n" +
    "                <div class=\"input-label\" style=\"color: #a29f91\">\r" +
    "\n" +
    "                    与学生的关系\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <select name=\"relationship\" id=\"relationship\" style=\"height: 50px\" ng-model=\"formData.relationShip\">\r" +
    "\n" +
    "                    <option value=\"0\">父亲</option>\r" +
    "\n" +
    "                    <option value=\"1\">母亲</option>\r" +
    "\n" +
    "                    <option value=\"2\">爷爷</option>\r" +
    "\n" +
    "                    <option value=\"3\">奶奶</option>\r" +
    "\n" +
    "                    <option value=\"4\">外公</option>\r" +
    "\n" +
    "                    <option value=\"5\">外婆</option>\r" +
    "\n" +
    "                    <option value=\"6\">其他</option>\r" +
    "\n" +
    "                </select>\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "            <!--关系下拉菜单 end-->\r" +
    "\n" +
    "            <!--性别选择 start-->\r" +
    "\n" +
    "            <div class=\"row item\" style=\"margin-bottom: 10px\">\r" +
    "\n" +
    "                <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-checked=\"formData.gender==1\" ng-click=\"handleGenderSelect(1)\" >\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    男\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"item item-checkbox\" style=\"border: none\">\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-checked=\"formData.gender==0\" ng-click=\"handleGenderSelect(0)\" >\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    女\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!--性别选择 end-->\r" +
    "\n" +
    "            <div class=\"row  img-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\"\r" +
    "\n" +
    "                           placeholder=\"图形验证码\"\r" +
    "\n" +
    "                           required=\"\"\r" +
    "\n" +
    "                           name=\"vCode\"\r" +
    "\n" +
    "                           ng-model=\"formData.vCode\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <img src=\"{{validateImageUrl}}\"/>\r" +
    "\n" +
    "                <i class=\"button icon ion-refresh button-clear\"\r" +
    "\n" +
    "                        ng-click=\"getValidateImage()\"></i>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 ng-click=\"handleSubmit()\">\r" +
    "\n" +
    "                保存\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <!--学生信息表单 end-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ng-form novalidate=\"novalidate\" name=\"resetPassForm\" class=\"list\" style=\"margin-top: 20px\" ng-show=\"pageStatus==2\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"password\" placeholder=\"新密码\" ng-model=\"formData.newPass\" name=\"newPass\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"password\" placeholder=\"再次输入密码\" ng-model=\"formData.confirmPassword\" name=\"confirmPassword\" confirm-pass=\"formData.newPass\" required=\"\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 type=\"submit\" ng-click=\"handlePwd()\">\r" +
    "\n" +
    "                保存\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/message_detail.html',
    "<ion-view  class=\"statisstics\" hide-nav-bar=\"true\">\r" +
    "\n" +
    "    <ion-header-bar align-title=\"center\" class=\"bar-balanced\">\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button class=\"button  button-clear\" ui-sref=\"home.msg\">\r" +
    "\n" +
    "                <i class=\"icon ion-ios-arrow-left\"></i>\r" +
    "\n" +
    "                返回</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <h1 class=\"title\">{{msgData.senderName}}</h1>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "    <ion-content padding=\"false\" style=\"padding-bottom: 20px\">\r" +
    "\n" +
    "        <div style=\"margin-top: 20px;\" ng-repeat=\"msgDetail in msgData.msgDetail.msgList\">\r" +
    "\n" +
    "            <div style=\"text-align: center\">\r" +
    "\n" +
    "                <label style=\"font-size: 10px\" ng-bind=\"msgDetail.msgDateTime\"></label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"message_content\"  >\r" +
    "\n" +
    "                <div class=\"face \">\r" +
    "\n" +
    "                    <img ng-src=\"{{msgData.senderImgUrl}}\" />\r" +
    "\n" +
    "                    <!--    <div class=\"name\" style=\"text-align: center;\" ng-bind=\"msgData.msgDetail.sendName\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>-->\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"message\" style=\"min-height: 50px;\"  ng-if=\"msgDetail.senderId==1\">\r" +
    "\n" +
    "                    <label ng-bind=\"msgDetail.msgContent\"  ></label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"message\" style=\"min-height: 50px;\" ng-click=\"msgHandle(msgDetail)\" ng-if=\"msgDetail.senderId !=1\">\r" +
    "\n" +
    "                    <label ng-bind=\"msgDetail.msgContent\" style=\"font-size: 16px;text-decoration:underline\" ></label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('partials/system_auth/message_list.html',
    "<ion-view hide-nav-bar=\"true\">\r" +
    "\n" +
    "    <ion-header-bar align-title=\"center\" class=\"bar-balanced\">\r" +
    "\n" +
    "        <h1 class=\"title\">消息</h1>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "    <ion-content padding=\"false\">\r" +
    "\n" +
    "        <div class=\"list\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\" style=\"height: 40px;\" ng-if=\"msgData.msgList.length<=0\">\r" +
    "\n" +
    "                <input type=\"text\"\r" +
    "\n" +
    "                       ng-model=\"tip\"\r" +
    "\n" +
    "                       readonly=\"readonly\"\r" +
    "\n" +
    "                       style=\"font-size: 18px;color: rgb(6, 6, 6);\"\r" +
    "\n" +
    "                        />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-avatar\" ng-repeat=\"item in msgData.msgList\" ng-click=\"goMsgDetail(item)\" ng-if=\"msgData.msgList.length>0\">\r" +
    "\n" +
    "                <img ng-src=\"{{item.imgUrl}}\" >\r" +
    "\n" +
    "                <!-- <div style=\"position: absolute;left: 18px;\">\r" +
    "\n" +
    "                     <img src=\"images/student.svg\" style=\"width: 40px;height: 40px\">\r" +
    "\n" +
    "                 </div>-->\r" +
    "\n" +
    "                <h2><span ng-bind=\"item.senderName\"></span>\r" +
    "\n" +
    "                    <i style=\"float: right;font-size:14px;color: #666;\" ng-bind=\"item.msgLastDateTime\"></i>\r" +
    "\n" +
    "                    <!--  <i class=\"badge badge-positive\" style=\"background-color: #066CB3;right: 10px\" ng-bind=\"item.msgNotViewedCount\"></i>-->\r" +
    "\n" +
    "                </h2>\r" +
    "\n" +
    "                <!--<h2><span ng-bind=\"item.sendName\"></span><i style=\"float: right;color:rgba(41, 66, 109, 0.82)\">未读</i></h2>-->\r" +
    "\n" +
    "                <p><span ng-bind=\"item.msgLastContent\"></span>\r" +
    "\n" +
    "                    <i class=\"badge badge-positive\" style=\"background-color: rgb(215, 24, 24);right: 17px;top: 38px;font-weight: normal;padding: 2px 6px;\" ng-bind=\"item.msgNotViewedCount\" ng-if=\"item.msgNotViewedCount>0\"></i>\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>\r" +
    "\n"
  );


  $templateCache.put('partials/system_auth/register.html',
    "<ion-view title=\"注册\">\r" +
    "\n" +
    "    <ion-content padding=\"true\">\r" +
    "\n" +
    "        <!--用户注册信息表单 start-->\r" +
    "\n" +
    "        <ng-form name=\"registerForm\" id=\"registerForm\" novalidate=\"novalidate\" class=\"list\" style=\"margin-top: 20px\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\" >\r" +
    "\n" +
    "                <i class=\"ion ion-iphone\" style=\"font-size: 30px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"text\" placeholder=\"手机号\" ng-model=\"formData.cellphone\" name=\"cellphone\"\r" +
    "\n" +
    "                       pattern=\"^(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$\" required />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-locked\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"password\" placeholder=\"密码\" ng-model=\"formData.password\" name=\"password\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-locked\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"password\" placeholder=\"再次输入密码\" ng-model=\"formData.confirmPass\" name=\"confirmPassword\" confirm-pass=\"formData.password\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  img-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"图形验证码\" ng-model=\"formData.vCode\" name=\"vCode\" required\r" +
    "\n" +
    "                           ng-blur=\"validateImageVCode()\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <img src=\"{{validateImageUrl}}\"/>\r" +
    "\n" +
    "                <i class=\"button icon ion-refresh button-clear\" ng-click=\"getValidateImage()\"></i>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  phone-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"手机验证码\" ng-model=\"formData.telVC\" name=\"telVC\" required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button class=\"button button-positive\" ng-click=\"getTelVC()\" ng-disabled=\"telVcBtn\">{{telVcBtnText}}</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!--<label ng-show=\"isShow\"><span style=\"color: red\">{{showValiadteMsg}} </span></label>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <!--用户注册信息表单 end-->\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 type=\"submit\"\r" +
    "\n" +
    "                 ng-click=\"registerSubmit()\" >\r" +
    "\n" +
    "                注册\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/register_success.html',
    "<ion-view title=\"注册成功\">\r" +
    "\n" +
    "    <ion-content padding=\"true\">\r" +
    "\n" +
    "          恭喜你，注册成功！\r" +
    "\n" +
    "        你的账号是 {{loginName}}\r" +
    "\n" +
    "        <button style=\"margin-top: 60px\" ui-sref=\"{{flag}}\" class=\"button  button-block button-positive\" >\r" +
    "\n" +
    "        确定\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/reset_pass.html',
    "<ion-view title=\"重置密码申请\">\r" +
    "\n" +
    "    <ion-content padding=\"true\" style=\"margin-top: 10px\">\r" +
    "\n" +
    "        <ng-form novalidate=\"novalidate\" name=\"CellPhoneForm\" class=\"list\" >\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"text\" placeholder=\"请输入要找回的账号\" ng-model=\"formData.loginName\" name=\"loginName\" required>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"button button-block button-balanced\" type=\"submit\" ng-click=\"submitCellPhoneForm()\">下一步\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/reset_pass_apply.html',
    "<ion-view title=\"重置密码申请\">\r" +
    "\n" +
    "    <div class=\"bar bar-subheader bg-balanced\">\r" +
    "\n" +
    "        <button class=\"button-clear bg-calm icon ion-ios-plus-outline not-active\" ng-click=\"handleTabBtnClick($event,phoneStatus)\">手机重置\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "        <button class=\"button-clear bg-balanced icon ion-ios-plus-outline active\" ng-click=\"handleTabBtnClick($event,4)\">密保重置\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <ion-content padding=\"true\" class=\"has-subheader\">\r" +
    "\n" +
    "        <ng-form name=\"CellPhoneConfirmForm\" class=\"list\" ng-show=\"pageStatus==2\" novalidate=\"novalidate\">\r" +
    "\n" +
    "            <label class=\"row  img-validate-block\">\r" +
    "\n" +
    "                该账号{{loginName}}所关联的手机号码为{{phone}},点击确定后,我们将发送短信验证码到该手机上，请查收！\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "            <button class=\"button button-block button-balanced\"\r" +
    "\n" +
    "                    type=\"submit\"\r" +
    "\n" +
    "                    ng-click=\"submitCellPhoneConfirmForm()\">\r" +
    "\n" +
    "                确定\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <ng-form novalidate=\"novalidate\" name=\"resetPassByVCodeForm\" class=\"list\" style=\"margin-top: 20px\" ng-show=\"pageStatus==3\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"password\" placeholder=\"新密码\" ng-model=\"formData.newPass\" name=\"newPass\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"password\" placeholder=\"再次输入密码\" ng-model=\"formData.confirmPass\" name=\"confirmPassword\" confirm-pass=\"formData.newPass\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\" >\r" +
    "\n" +
    "                <input type=\"text\"\r" +
    "\n" +
    "                       placeholder=\"请输入手机验证码\"\r" +
    "\n" +
    "                       name=\"telVC\"\r" +
    "\n" +
    "                       ng-model=\"formData.telVC\"\r" +
    "\n" +
    "                       required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 type=\"submit\" ng-click=\"submitResetPassByVCodeForm()\">\r" +
    "\n" +
    "                重置\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ng-form name=\"SecurityForm\"  ng-show=\"pageStatus==4\" novalidate=\"novalidate\">\r" +
    "\n" +
    "            <div class=\"list\" ng-repeat=\"item in qList\" style=\"margin-bottom: 5px\">\r" +
    "\n" +
    "                <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                    <label >问题{{item.num}}:{{item.question}}?</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"答案\"  ng-model=\"item.answer\"  required>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  img-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\"\r" +
    "\n" +
    "                           placeholder=\"图形验证码\"\r" +
    "\n" +
    "                           name=\"vCode\"\r" +
    "\n" +
    "                           ng-model=\"securityFormData.vCode\"\r" +
    "\n" +
    "                           ng-blur=\"validateImageVCode(securityFormData.vCode)\"\r" +
    "\n" +
    "                           required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <img src=\"{{validateImageUrl2}}\"/>\r" +
    "\n" +
    "                <i class=\"button icon ion-refresh button-clear\"\r" +
    "\n" +
    "                   ng-click=\"getValidateImage(2)\">\r" +
    "\n" +
    "                </i>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"button button-block button-balanced\"\r" +
    "\n" +
    "                    type=\"submit\"\r" +
    "\n" +
    "                    ng-click=\"submitSecurityForm()\">\r" +
    "\n" +
    "                提交\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <ng-form novalidate=\"novalidate\" name=\"resetPassBySecurityForm\" class=\"list\" style=\"margin-top: 20px\" ng-show=\"pageStatus==5\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"password\" placeholder=\"新密码\" ng-model=\"securityFormData.newPass\" name=\"newPass\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <input type=\"password\" placeholder=\"再次输入密码\" ng-model=\"securityFormData.confirmPassword\" name=\"confirmPassword\" confirm-pass=\"securityFormData.newPass\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 type=\"submit\" ng-click=\"submitResetPassBySecurityForm()\">\r" +
    "\n" +
    "                重置\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/second_p_first.html',
    "<ion-view title=\"验证手机号码\">\r" +
    "\n" +
    "    <ion-content padding=\"true\">\r" +
    "\n" +
    "        <div class=\"list\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\" style=\"height: 40px;\" >\r" +
    "\n" +
    "                <label style=\"font-size: 15px;color: red\">第一次登录app，需要验证手机号码！</label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  phone-validate-block\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"手机验证码\" ng-model=\"formData.telVC\" name=\"telVC\" required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button class=\"button button-positive\" ng-click=\"getTelVC()\" ng-disabled=\"telVcBtn\">{{telVcBtnText}}</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                 type=\"submit\"\r" +
    "\n" +
    "                 ng-click=\"checkTelVcSubmit()\" >\r" +
    "\n" +
    "                提交\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('partials/system_auth/stu_settings.html',
    "<ion-view title=\"学生设置\" align-title=\"center\" >\r" +
    "\n" +
    "    <ion-content>\r" +
    "\n" +
    "        <auto-box-con row=\"2\" decrease-height=\"56\" style=\"  margin: 5px;\">\r" +
    "\n" +
    "            <auto-box-row column=\"2\">\r" +
    "\n" +
    "                <auto-box-block class=\"bg-calm\" ng-click=\"editStu()\" style=\"  border-bottom: 5px solid white;\">\r" +
    "\n" +
    "                    <div class=\"block-content\">\r" +
    "\n" +
    "                        <img src=\"images/person.ico\"/>\r" +
    "\n" +
    "                       <!-- <i class=\"icon ion-person\"></i>-->\r" +
    "\n" +
    "                        <div class=\"content-title\" style=\"font-size: 20px;\">基本信息</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </auto-box-block>\r" +
    "\n" +
    "                <auto-box-block class=\"bg-calm\" style=\"  border-left: 5px solid white;border-bottom: 5px solid white;\"\r" +
    "\n" +
    "                                ng-click=\"delStu()\">\r" +
    "\n" +
    "                    <div class=\"block-content\">\r" +
    "\n" +
    "                        <img src=\"images/del.ico\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"content-title\" style=\"font-size: 20px;\">删除账号</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </auto-box-block>\r" +
    "\n" +
    "            </auto-box-row>\r" +
    "\n" +
    "            <auto-box-row row=\"1\">\r" +
    "\n" +
    "                <auto-box-block class=\"bg-calm\"  ng-click=\"childClassList()\">\r" +
    "\n" +
    "                    <div class=\"block-content\">\r" +
    "\n" +
    "                        <img src=\"images/class.svg\"/>\r" +
    "\n" +
    "                        <!--   <img src=\"images/exam-stati.ico\"/>-->\r" +
    "\n" +
    "                        <!--<i class=\"icon ion-person-stalker\"></i>-->\r" +
    "\n" +
    "                        <div class=\"content-title\" style=\"font-size: 20px;\">班群管理</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </auto-box-block>\r" +
    "\n" +
    "            </auto-box-row>\r" +
    "\n" +
    "        </auto-box-con>\r" +
    "\n" +
    "      <!--  <div class=\"tool-container\" style=\"background-color: #11c1f3\">\r" +
    "\n" +
    "            &lt;!&ndash;  <div class=\"row\">\r" +
    "\n" +
    "                  <div class=\"col tool-item-stu\" ng-click=\"edit(student)\">\r" +
    "\n" +
    "                      <div >\r" +
    "\n" +
    "                          <i class=\"icon ion-gear-a\" ></i>\r" +
    "\n" +
    "                      </div>\r" +
    "\n" +
    "                      <div >\r" +
    "\n" +
    "                          <span >修改信息</span>\r" +
    "\n" +
    "                      </div>\r" +
    "\n" +
    "                  </div>\r" +
    "\n" +
    "                  <div class=\"col tool-item-stu\" ng-click=\"delStu(student.id,$index)\">\r" +
    "\n" +
    "                      <div >\r" +
    "\n" +
    "                          <i class=\"icon ion-ios-trash-outline\" ></i>\r" +
    "\n" +
    "                      </div>\r" +
    "\n" +
    "                      <div >\r" +
    "\n" +
    "                          <span >删除账号</span>\r" +
    "\n" +
    "                      </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                  </div>\r" +
    "\n" +
    "              </div>\r" +
    "\n" +
    "              <div class=\"row\" style=\"margin-top: -1px;\" ui-sref=\"child_class_list({sid:student.id})\">\r" +
    "\n" +
    "                  <div class=\"col tool-item-stu\" >\r" +
    "\n" +
    "                      <div >\r" +
    "\n" +
    "                          <i class=\"icon ion-person-stalker\" ></i>\r" +
    "\n" +
    "                      </div>\r" +
    "\n" +
    "                      <div >\r" +
    "\n" +
    "                          <span >班级管理</span>\r" +
    "\n" +
    "                      </div>\r" +
    "\n" +
    "                  </div>\r" +
    "\n" +
    "              </div>&ndash;&gt;\r" +
    "\n" +
    "            <div class=\"row\" style=\"margin-top: -1px;\">\r" +
    "\n" +
    "                <div class=\"col tool-item-stu\"\r" +
    "\n" +
    "                     style=\"border-top: 5px solid white;border-right: 5px solid white;\">\r" +
    "\n" +
    "                    <div style=\"  margin-top: 40px;\">\r" +
    "\n" +
    "                        <i class=\"icon ion-clipboard\" style=\"color: white;\"></i>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div style=\"color: white;\">\r" +
    "\n" +
    "                        <span >作业</span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"col tool-item-stu\"\r" +
    "\n" +
    "                     style=\"border-top: 5px solid white;\">\r" +
    "\n" +
    "                    <div style=\"  margin-top: 40px;\">\r" +
    "\n" +
    "                        <i class=\"icon ion-ios-game-controller-b\" style=\"color: white;\"></i>\r" +
    "\n" +
    "                        &lt;!&ndash;<span >游戏管理</span>&ndash;&gt;\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div style=\"color: white;\">\r" +
    "\n" +
    "                        <span >游戏</span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>-->\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>\r" +
    "\n"
  );


  $templateCache.put('partials/system_auth/system_login.html',
    "<ion-view  align-title=\"center\" hide-nav-bar=\"true\">\r" +
    "\n" +
    "    <div class=\"bar bar-header bar-balanced\">\r" +
    "\n" +
    "        <div class=\"title title-center header-item\">家长登录</div>\r" +
    "\n" +
    "        <div class=\"buttons buttons-right header-item\">\r" +
    "\n" +
    "            <button class=\"button button-clear icon ion-laptop\" ng-click=\"handleSystemSelect()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <ion-content padding=\"true\" class=\"has-header\">\r" +
    "\n" +
    "        <!--<div class=\"row\"-->\r" +
    "\n" +
    "             <!--style=\"background-image: url('images/other/banner.png');background-size: 100% 100%;height: 120px;\">-->\r" +
    "\n" +
    "        <!--</div>-->\r" +
    "\n" +
    "        <!--登陆表单 start-->\r" +
    "\n" +
    "        <ng-form novalidate=\"novalidate\"  id=\"loginForm\" name=\"loginForm\" class=\"list\" ng-show=\"!needQRCode\">\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-person\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"formData.userName\" name=\"userName\" placeholder=\"账号\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"item item-input block-input\">\r" +
    "\n" +
    "                <i class=\"ion ion-locked\" style=\"font-size: 20px;margin-right: 5px\"></i>\r" +
    "\n" +
    "                <input type=\"password\" ng-model=\"formData.password\" name=\"password\" placeholder=\"密码\" required/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  img-validate-block\" ng-if=\"needVCode\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\" ng-model=\"formData.vCode\" name=\"vCode\" placeholder=\"验证码\" ng-blur=\"validateImageVCode()\" required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <img src=\"{{validateImageUrl}}\"/>\r" +
    "\n" +
    "                <i class=\"button icon ion-refresh button-clear\" ng-click=\"getValidateImage()\" ></i>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row  phone-validate-block\" ng-if=\"needTelVC\">\r" +
    "\n" +
    "                <div class=\"item item-input\">\r" +
    "\n" +
    "                    <input type=\"text\" placeholder=\"手机验证码\" ng-model=\"formData.telVC\" name=\"telVC\" required/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button class=\"button button-positive\" ng-click=\"getTelVC()\" ng-disabled=\"telVcBtn\">{{telVcBtnText}}</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row\" style=\"padding:0 !important;\">\r" +
    "\n" +
    "                <!--<div class=\"col-50\" style=\"  flex: 0 0 100%;max-width: 100%;\">\r" +
    "\n" +
    "                    <div class=\"button button-block  button-positive\"\r" +
    "\n" +
    "                         type=\"submit\"\r" +
    "\n" +
    "                         ng-click=\"handleSubmit()\"\r" +
    "\n" +
    "                         style=\"border:none;box-shadow: 0 0 0 0;border-radius: 0;margin-right: 5px;\">\r" +
    "\n" +
    "                        登录\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>-->\r" +
    "\n" +
    "                <div class=\"col-50\">\r" +
    "\n" +
    "                    <div class=\"button button-block  button-positive\"\r" +
    "\n" +
    "                         type=\"submit\"\r" +
    "\n" +
    "                         ng-click=\"handleSubmit()\"\r" +
    "\n" +
    "                         style=\"border:none;box-shadow: 0 0 0 0;border-radius: 0;margin-right: 5px;\">\r" +
    "\n" +
    "                        登录\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"col-50\">\r" +
    "\n" +
    "                    <div class=\"button button-block  button-balanced\"\r" +
    "\n" +
    "                         ui-sref=\"register\"\r" +
    "\n" +
    "                         style=\"border:none;box-shadow: 0 0 0 0;border-radius: 0;margin-right: 5px;\">\r" +
    "\n" +
    "                        注册\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </ng-form>\r" +
    "\n" +
    "        <!--登陆表单 end-->\r" +
    "\n" +
    "        <div class=\"row\" style=\"margin-top: 30px;\" ui-sref=\"reset_pass\" ng-show=\"!needQRCode\">\r" +
    "\n" +
    "            <a href=\"\" style=\"margin: auto;color: #1462d2\">忘记密码?</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div style=\"text-align: center\" ng-show=\"needQRCode\">\r" +
    "\n" +
    "            <br/>\r" +
    "\n" +
    "            <p>你当前在非手机上登录，请使用手机客户端登录，扫描二维码后直接登录</p>\r" +
    "\n" +
    "            <img src=\"{{QRcode}}\" alt=\"\"/>\r" +
    "\n" +
    "            <p style=\"color: red;font-size: 18px\">{{msg}}</p>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('partials/work_statistics/work_detail_for_show.html',
    "<ion-view title=\"作业详情\" hide-nav-bar=\"true\">\r" +
    "\n" +
    "    <ion-header-bar class=\"bar-balanced\" align-title=\"center\">\r" +
    "\n" +
    "        <div class=\"button button-clear\" ng-click=\"back()\">\r" +
    "\n" +
    "            <i class=\"icon ion-ios-arrow-back\"> </i>\r" +
    "\n" +
    "            返回\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <h1 class=\"title\" style=\"font-family: 'Microsoft YaHei'\">作业详情</h1>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "    <ion-content overflow-scroll=\"false\">\r" +
    "\n" +
    "        <div class=\"item  item-label work-paper-title\">\r" +
    "\n" +
    "            <span ng-bind=\"data.paper.title+'('+data.paper.paperScore+'分)'\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"item item-label \">\r" +
    "\n" +
    "            <span style=\"font-size:16px;\">发布班级：<span\r" +
    "\n" +
    "                    ng-bind=\"wData.currentWork.clazz\"></span></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item item-label \">\r" +
    "\n" +
    "              <span style=\"font-size:16px;\">发布时间：<span\r" +
    "\n" +
    "                      ng-bind=\"wData.currentWork.date\"></span></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item item-label \">\r" +
    "\n" +
    "            <span style=\"font-size:16px;\">姓名：<span\r" +
    "\n" +
    "                    ng-bind=\"wData.currentWork.sName\"></span></span>\r" +
    "\n" +
    "            <span class=\"padding-right\" style=\"font-size:16px;\">状态：<span\r" +
    "\n" +
    "                    ng-bind=\"wData.currentWork.statusVo\"></span></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!--showTipType为1 显示整个paper -->\r" +
    "\n" +
    "        <div ng-repeat=\"bigQ in data.paper.bigQList track by $index\" ng-init=\"bigIndex=$index\">\r" +
    "\n" +
    "            <div class=\"big-q\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <label style=\"font-size: 16px\">\r" +
    "\n" +
    "                        {{bigQ.bigQVoIndex}}、{{bigQ.title}}&nbsp;\r" +
    "\n" +
    "                        <span>\r" +
    "\n" +
    "                            <span ng-bind=\"'('+bigQ.score+'分)'\"></span>\r" +
    "\n" +
    "                            <!--<span class=\"actual-score\" ng-bind=\"bigQ.bigQStuScore\"></span>-->\r" +
    "\n" +
    "                             <!--<span class=\"deserve-score\"  ng-bind=\"+'分/'+bigQ.score+'分'\"></span>-->\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        <!--{{bigQ.bigQVoIndex}}、{{bigQ.title+\"(包含\"}}&nbsp;{{bigQ.qsList.length+\"个小题 共\"+bigQ.score+\"分)\"}}-->\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <question-list ng-repeat=\"record in bigQ.qsList track by record.id\">\r" +
    "\n" +
    "                <question-item>\r" +
    "\n" +
    "                    <div class=\"small-q\">\r" +
    "\n" +
    "                        <label style=\"font-size: 15px;width: 100%;padding-right: 80%;\">\r" +
    "\n" +
    "                            <span>{{'第'+(record.seqNum)+'道题('+record.score+'分)'}}</span>\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div compile-html=\"record.qContext\"\r" +
    "\n" +
    "                         current_q_input=\"record.inputList\"></div>\r" +
    "\n" +
    "                    <!--           <div compile-html=\"record.qContext\"  ></div>-->\r" +
    "\n" +
    "                </question-item>\r" +
    "\n" +
    "            </question-list>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('partials/work_statistics/work_detail_for_stat.html',
    "<ion-view title=\"作业批改结果\"  hide-nav-bar=\"true\">\r" +
    "\n" +
    "        <ion-header-bar class=\"bar-balanced\" align-title=\"center\">\r" +
    "\n" +
    "            <div class=\"button button-clear\" ng-click=\"back()\" >\r" +
    "\n" +
    "                <i class=\"icon ion-ios-arrow-back\"> </i>\r" +
    "\n" +
    "                返回</div>\r" +
    "\n" +
    "            <h1 class=\"title\" style=\"font-family: 'Microsoft YaHei'\">作业批改结果</h1>\r" +
    "\n" +
    "        </ion-header-bar>\r" +
    "\n" +
    "    <ion-content overflow-scroll=\"false\" on-scroll=\"getScrollPosition()\">\r" +
    "\n" +
    "        <!--<div class=\"item  item-label work-paper-title\" id=\"paper\">\r" +
    "\n" +
    "            <span  ng-bind=\"data.paper.title+'(应得分'+data.paper.paperScore+'分)'\"></span>\r" +
    "\n" +
    "        </div>-->\r" +
    "\n" +
    "        <div class=\"item  item-label work-paper-title\" id=\"paper\">\r" +
    "\n" +
    "            <span  ng-bind=\"data.paper.title\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item  item-label work-paper-title\" style=\"font-size: 18px\">\r" +
    "\n" +
    "            <span  ng-bind=\"wData.currentWork.sName\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item  item-label work-paper-title\" style=\"font-size:16px \">\r" +
    "\n" +
    "            <span>\r" +
    "\n" +
    "                <span class=\"deserve-score\" ng-bind=\"'最近一次得分: '\"></span>\r" +
    "\n" +
    "                <span class=\"actual-score\" ng-bind=\"data.paper.latestScore\"></span>\r" +
    "\n" +
    "                <span class=\"deserve-score\" ng-bind=\"'分/'+data.paper.paperScore+'分'\"></span>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"item  item-label work-paper-title\" style=\"font-size:16px \">\r" +
    "\n" +
    "            <span>\r" +
    "\n" +
    "                <span class=\"deserve-score\" ng-bind=\"'第一次得分: '\"></span>\r" +
    "\n" +
    "                <span class=\"actual-score\" ng-bind=\"data.paper.firstScore\"></span>\r" +
    "\n" +
    "                <span class=\"deserve-score\" ng-bind=\"'分/'+data.paper.paperScore+'分'\"></span>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!--<div class=\"item  item-label work-paper-title\" >\r" +
    "\n" +
    "            <span  ng-bind=\"data.paper.title+'(应得分'+data.paper.paperScore+'分)'\"></span>\r" +
    "\n" +
    "        </div>-->\r" +
    "\n" +
    "        <!-- <div class=\"item  item-label work-paper-title\" style=\"font-size: 18px\">\r" +
    "\n" +
    "             <span  ng-bind=\"data.currentStu.stuName\"></span>\r" +
    "\n" +
    "         </div>-->\r" +
    "\n" +
    "        <!-- <div class=\"item  \" style=\"width: 100%;padding: 8px;\">\r" +
    "\n" +
    "             <label style=\"font-size: 15px\">学生姓名：<span style=\"color: darkred\" ng-bind=\"data.currentStu.stuName\"></span></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "         </div>-->\r" +
    "\n" +
    "        <!--<div class=\"item item-label \"  >\r" +
    "\n" +
    "            <span style=\"font-size:16px;\">作业得分：<span ng-bind=\"data.paper.paperStuScore\" class=\"actual-score\"></span>\r" +
    "\n" +
    "                <span ng-bind=\"'分/'+data.paper.paperScore+'分'\"></span>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "            <span class=\"padding-right\" style=\"font-size:16px;\">得分率：<span ng-bind=\"data.paper.paperScoreRate\"></span></span>\r" +
    "\n" +
    "        </div>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"card\" ng-repeat=\"bigQ in data.paper.bigQList track by $index\"  ng-init=\"bigQIndex=$index\">\r" +
    "\n" +
    "            <div  class=\"work-paper-big-q\"  >\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <label style=\"font-size: 16px;\" ng-bind=\"bigQ.bigQVoIndex+'、'+bigQ.title+'('+bigQ.score+'分)'\">\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    <!--</br>-->\r" +
    "\n" +
    "                    <!--<span style=\"font-size: 15px;\">得分：<span class=\"actual-score\">{{bigQ.bigQStuScore}}</span>分</span>-->\r" +
    "\n" +
    "                    <!--<span style=\"font-size: 15px;  margin-left: 30px;\">得分率：<span >{{bigQ.bigQScoreRate}}</span></span>-->\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!--<div style=\"display: block\">-->\r" +
    "\n" +
    "                <!--<span style=\"font-size: 15px;\">平均得分：<span style=\"color: dodgerblue\">{{bigQ.average.toFixed(1)}}分</span></span>-->\r" +
    "\n" +
    "                <!--<span style=\"font-size: 15px;float: right;\">平均得分率：<span style=\"color: dodgerblue\">{{bigQ.averageScoreRate}}</span></span>-->\r" +
    "\n" +
    "                <!--</div>-->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"table-container\">\r" +
    "\n" +
    "                <div class=\"row table-header\" style=\"font-size: 12px\">\r" +
    "\n" +
    "                    <div class=\"col col-10\" style=\" min-width: 35px;\">题号</div>\r" +
    "\n" +
    "                    <div class=\"col \" >做题次数</div>\r" +
    "\n" +
    "                    <div class=\"col \" style=\"display: inline-block\">得分</div>\r" +
    "\n" +
    "                    <div class=\"col \" style=\"display: inline-block\">得分率</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"row table-row\" style=\"margin-top:-1px \" ng-repeat=\"smallQ in bigQ.qsList track by $index\" >\r" +
    "\n" +
    "                    <div class=\"col col-10\"   >\r" +
    "\n" +
    "                        <a ng-bind=\"smallQ.seqNum\" ></a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"col \" >\r" +
    "\n" +
    "                        <div class=\"row \"  ng-repeat=\"(key,doneInfo) in smallQ.smallQStuAnsMapList track by $index\" ng-init=\"doneIndex=$index\">\r" +
    "\n" +
    "                            <div class=\"col\"  ng-click=\"viewQ(smallQ,key,bigQIndex)\">\r" +
    "\n" +
    "                                <a ng-bind=\"($index+1)\" style=\"text-decoration: underline;color:blue;font-weight:bold;\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"col\">\r" +
    "\n" +
    "                             <span >\r" +
    "\n" +
    "                                  <span class=\"actual-score\" ng-bind=\"doneInfo.score\"></span>\r" +
    "\n" +
    "                                 <span class=\"deserve-score\"  ng-bind=\"'/'+smallQ.score\"></span>\r" +
    "\n" +
    "                                <!--<span class=\"actual-score\" ng-bind=\"smallQ.smallQStuScore\"></span>-->\r" +
    "\n" +
    "                                 <!--<span class=\"deserve-score\"  ng-bind=\"+'/'+smallQ.score\"></span>-->\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"col\" ng-bind=\"doneInfo.smallQScoreRate\"></div>\r" +
    "\n" +
    "                            <!--<div class=\"col\" ng-bind=\"smallQ.smallQScoreRate\"></div>-->\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <!--<div class=\"col\" ng-bind=\"smallQ.seqNum\" ></div>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div style=\"font-size: 25px;line-height: 50px;text-align: center;\"  >\r" +
    "\n" +
    "            附：试卷\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!--showTipType为1 显示整个paper -->\r" +
    "\n" +
    "        <div ng-repeat=\"bigQ in data.paper.bigQList track by $index\"  ng-init=\"bigIndex=$index\">\r" +
    "\n" +
    "            <div class=\"big-q\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <label style=\"font-size: 16px\">\r" +
    "\n" +
    "                        {{bigQ.bigQVoIndex}}、{{bigQ.title}}&nbsp;\r" +
    "\n" +
    "                        <span >\r" +
    "\n" +
    "                            <span  ng-bind=\"'('+bigQ.score+'分)'\"></span>\r" +
    "\n" +
    "                            <!--<span class=\"actual-score\" ng-bind=\"bigQ.bigQStuScore\"></span>-->\r" +
    "\n" +
    "                             <!--<span class=\"deserve-score\"  ng-bind=\"+'分/'+bigQ.score+'分'\"></span>-->\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        <!--{{bigQ.bigQVoIndex}}、{{bigQ.title+\"(包含\"}}&nbsp;{{bigQ.qsList.length+\"个小题 共\"+bigQ.score+\"分)\"}}-->\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <question-list ng-repeat=\"record in bigQ.qsList track by record.id\"  ng-init=\"smallQIndex=$index\">\r" +
    "\n" +
    "                <question-item >\r" +
    "\n" +
    "                    <div ng-repeat=\"(key,doneInfo) in record.smallQStuAnsMapList track by $index\" ng-init=\"doneIndex=$index;doneLast=$last\" >\r" +
    "\n" +
    "                        <div class=\"small-q\" id=\"{{record.id+key+'|paper'}}\" style=\"position: relative\" >\r" +
    "\n" +
    "                            <label style=\"font-size: 15px;width: 100%;padding-right: 80%;\"  ng-click=\"showQ(doneInfo)\">\r" +
    "\n" +
    "                                <span ng-if=\"doneIndex==0\" >{{'第'+(record.seqNum)+'道题'}}</span>\r" +
    "\n" +
    "                                <!--<span ng-if=\"$index>1\">{{'第'+($index+1)+'道题'}}</span>-->\r" +
    "\n" +
    "                                <!--<span ng-if=\"doneIndex==1&&doneLast\" style=\"padding-left: 10px;color: red;font-size: 17px;\">{{'改错后: '}}</span>-->\r" +
    "\n" +
    "                                <span ng-if=\"doneIndex==1&&!doneLast\" style=\"padding-left: 10px;color: red;font-size: 17px;\">{{'第'+(doneIndex)+'次改错后: '}}</span>\r" +
    "\n" +
    "                                <span ng-if=\"doneIndex>=1&&doneLast\" style=\"padding-left: 10px;color: red;font-size: 17px;\">{{'第'+(doneIndex)+'次改错后: '}}</span>\r" +
    "\n" +
    "                            <span >\r" +
    "\n" +
    "                            <span class=\"actual-score\" ng-bind=\"doneInfo.score\"></span>\r" +
    "\n" +
    "                             <span class=\"deserve-score\"  ng-bind=\"'分/'+record.score+'分'\"></span>\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                            </label>\r" +
    "\n" +
    "                            <i ng-class=\"!doneInfo.showQFlag==true?'ion ion-ios-arrow-up':'ion ion-ios-arrow-down'\"\r" +
    "\n" +
    "                               ng-click=\"showQ(doneInfo)\"\r" +
    "\n" +
    "                               style=\"color: green;font-size: 30px;  position: absolute;right: 0;  bottom: 0px;\">\r" +
    "\n" +
    "                            </i>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div compile-html=\"record.qContext\" show_type=\"correct\"\r" +
    "\n" +
    "                             current_q_input=\"doneInfo.inputList\" ng-if=\"doneInfo.showQFlag\" ></div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <!--<div correct-paper=\"record.qContext\"-->\r" +
    "\n" +
    "                    <!--current_q_input=\"record.inputList\" ng-if=\"!record.smallQStuAnsList||record.smallQStuAnsList.length==0\"></div>-->\r" +
    "\n" +
    "                </question-item>\r" +
    "\n" +
    "            </question-list>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!--先屏蔽掉当前大题和当前小题情况   start -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!--showTipType为2 并且当前大题有内容 显示当前大题-->\r" +
    "\n" +
    "        <!--<div ng-if=\"wData.rankListShow.showTipType=='2'&&data.paper.currentBigQ\">\r" +
    "\n" +
    "            <div style=\"border: 1px solid gold;text-align: left;background-color: lightgreen; margin: 20px 0px 10px 0px;\r" +
    "\n" +
    "                height: 50px;\r" +
    "\n" +
    "                line-height: 50px;\r" +
    "\n" +
    "              \">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <label style=\"font-size: 16px\">\r" +
    "\n" +
    "                        {{data.paper.currentBigQ.bigQVoIndex}}、{{data.paper.currentBigQ.title}}&nbsp;\r" +
    "\n" +
    "                        <span >\r" +
    "\n" +
    "                            <span class=\"actual-score\" ng-bind=\"data.paper.currentBigQ.bigQStuScore\"></span>\r" +
    "\n" +
    "                             <span class=\"deserve-score\"  ng-bind=\"+'分/'+data.paper.currentBigQ.score+'分'\"></span>\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        &lt;!&ndash;{{bigQ.bigQVoIndex}}、{{bigQ.title+\"(包含\"}}&nbsp;{{bigQ.qsList.length+\"个小题 共\"+bigQ.score+\"分)\"}}&ndash;&gt;\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <question-list ng-repeat=\"record in data.paper.currentBigQ.qsList \" ng-click=\"correctQ(record,$index,'false',data.paper.currentBigQ.bigQVoIndex);\">\r" +
    "\n" +
    "                <question-item id=\"{{record.id+'|bigQ'}}\">\r" +
    "\n" +
    "                    <div\r" +
    "\n" +
    "                            style=\"border: 1px solid gold;text-align: left;\r" +
    "\n" +
    "                                    background-color: lightgoldenrodyellow;\r" +
    "\n" +
    "                                    margin: 10px 0px 10px 0px;\r" +
    "\n" +
    "                                    height: 37px;\r" +
    "\n" +
    "                                    line-height: 37px;\r" +
    "\n" +
    "                                    \">\r" +
    "\n" +
    "                        <label style=\"font-size: 15px\">{{'第'+($index+1)+'道题'}}\r" +
    "\n" +
    "                            <span style=\"color: darkred\">{{record.smallQStuScore}}分/{{record.score}}分</span>\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                        <i class=\"icon ion-eye\" style=\"font-size: 30px;float: right;color: red; \"></i>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div correct-paper=\"record.qContext\"\r" +
    "\n" +
    "                         current_q_input=\"record.inputList\"></div>\r" +
    "\n" +
    "                </question-item>\r" +
    "\n" +
    "            </question-list>\r" +
    "\n" +
    "        </div>-->\r" +
    "\n" +
    "        <!--showTipType为3 并且当前小题有内容 显示当前小题-->\r" +
    "\n" +
    "        <!--<div ng-if=\"wData.rankListShow.showTipType=='3'&&data.paper.currentQ\">\r" +
    "\n" +
    "            <question-list ng-click=\"correctQ(data.paper.currentQ,wData.rankListShow.smallQIndex,wData.rankListShow.bigQIndex);\">\r" +
    "\n" +
    "                <question-item id=\"{{data.paper.currentQ.id+'|smallQ'}}\">\r" +
    "\n" +
    "                    &lt;!&ndash;<question-title check_box=\"checkBox\" name=\"\" show_score=\"showScore\"\r" +
    "\n" +
    "                                    show_correct_score=\"showCorrectScore\"\r" +
    "\n" +
    "                                    style=\"border: 1px solid gold;text-align: left;background-color: lightgoldenrodyellow;margin: 10px 0px 10px 0px;\">\r" +
    "\n" +
    "                    </question-title>&ndash;&gt;\r" +
    "\n" +
    "                    <div style=\"border: 1px solid gold;text-align: left;background-color: lightgoldenrodyellow;margin: 10px 0px 10px 0px;\r" +
    "\n" +
    "                    height: 37px;\r" +
    "\n" +
    "                    line-height: 37px;\r" +
    "\n" +
    "                    \">\r" +
    "\n" +
    "                        <label style=\"font-size: 15px\">\r" +
    "\n" +
    "                            &lt;!&ndash;第{{wData.rankListShow.smallQIndex+1}}题&nbsp;&ndash;&gt;\r" +
    "\n" +
    "                            试题&nbsp;\r" +
    "\n" +
    "                            <span style=\"color: darkred\">\r" +
    "\n" +
    "                                {{data.paper.currentQ.smallQStuScore}}分/{{data.paper.currentQ.score}}分\r" +
    "\n" +
    "                            </span>\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                        <i class=\"icon ion-eye\" style=\"font-size: 30px;float: right;color: red; \"></i>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div correct-paper=\"data.paper.currentQ.qContext\"\r" +
    "\n" +
    "                         current_q_input=\"data.paper.currentQ.inputList\"></div>\r" +
    "\n" +
    "                </question-item>\r" +
    "\n" +
    "            </question-list>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!--先屏蔽掉当前大题和当前小题情况   end -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "    <div  class=\"scrollToTop\" ng-click=\"scrollTop()\"></div>\r" +
    "\n" +
    "    <!--<ion-footer-bar class=\"bg-balanced\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <button class=\"button-clear bg-calm  bar-item\"\r" +
    "\n" +
    "                style=\"flex: 1;font-weight: bold;color: white\"\r" +
    "\n" +
    "                ng-click=\"goTopBtnClick()\">\r" +
    "\n" +
    "            <i class=\"icon ion-arrow-up-c\">\r" +
    "\n" +
    "            </i>\r" +
    "\n" +
    "            去顶部\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "    </ion-footer-bar>-->\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('partials/work_statistics/work_list.html',
    "<style type=\"text/css\">\r" +
    "\n" +
    "    .second , .name {\r" +
    "\n" +
    "        color:black !important;\r" +
    "\n" +
    "\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "    .name {\r" +
    "\n" +
    "        text-align: center;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "    auto-list-content {\r" +
    "\n" +
    "        background:white !important;\r" +
    "\n" +
    "        border:none !important;\r" +
    "\n" +
    "        border-bottom: 1px solid #dddddd !important;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "    .list-center-stu {\r" +
    "\n" +
    "        border:none !important;\r" +
    "\n" +
    "        border-bottom: 1px solid #dddddd !important;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "    .list-left_stu i {\r" +
    "\n" +
    "        color:#333 !important;\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "</style>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<ion-view title=\"作业列表 | {{wData.queryParams.sName}}\">\r" +
    "\n" +
    "    <ion-content class=\"has-header\">\r" +
    "\n" +
    "        <div class=\"item item-input block-input\" style=\"height: 40px;\" ng-if=\"wData.workList.length<=0\">\r" +
    "\n" +
    "            <input type=\"text\"\r" +
    "\n" +
    "                   ng-model=\"tip\"\r" +
    "\n" +
    "                   readonly=\"readonly\"\r" +
    "\n" +
    "                   id=\"refreshTimeCount\"\r" +
    "\n" +
    "                   style=\"font-size: 20px;color: red\"\r" +
    "\n" +
    "                    />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <auto-list-con>\r" +
    "\n" +
    "            <auto-list ng-repeat=\"paper in wData.workList\" >\r" +
    "\n" +
    "                <auto-list-content class=\"bg-calm list-content_stu\" style=\"min-height: 105px;position: relative;\" >\r" +
    "\n" +
    "                    <div class=\"list-center-stu\"  ng-click=\"showWorkDetail(paper);\">\r" +
    "\n" +
    "                        <div  class=\"left-img\" style=\"width: auto;height: auto\">\r" +
    "\n" +
    "                            <img src=\"images/notepad-icon.png\" style=\"  border-radius: 50%;\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"center-span\">\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span style=\"font-weight: 100;font-size: 16px;\" ng-bind=\"paper.paperName\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span style=\"font-size: 13px\" ng-bind=\"paper.date\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span style=\"font-size: 13px\" ng-bind=\"paper.clazz\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"second position-set\" ng-if=\"paper.status<3\">\r" +
    "\n" +
    "                                <span style=\"font-size: 13px\" ng-bind=\"paper.statusVo\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"second position-set\" ng-if=\"paper.status>=3\">\r" +
    "\n" +
    "                                <p>\r" +
    "\n" +
    "                                    <span style=\"font-weight: bold;font-size: 19px;color:#003366\">{{paper.score}}</span>\r" +
    "\n" +
    "                                    /{{paper.worthScore}}分\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"list-right_stu\"  >\r" +
    "\n" +
    "                        <div class=\"tool-bar-item\" >\r" +
    "\n" +
    "                            <img src=\"{{praise.img}}\" ng-repeat=\"praise in paper.encourageImgs\" >\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                   <a style=\"position: absolute;bottom: 5px;right: 0;text-decoration: underline;color:blue;font-weight:bold;font-size: 14px\"\r" +
    "\n" +
    "                            ng-click=\"praiseStu(paper)\" ng-if=\"paper.status>=3\">\r" +
    "\n" +
    "                       家长评价</a>\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>\r" +
    "\n" +
    "\r" +
    "\n" +
    "          <!--  <auto-list ng-repeat=\"paper in wData.workList \" item=\"item\" >\r" +
    "\n" +
    "                &lt;!&ndash;  <div class=\"tool-bar-left\">\r" +
    "\n" +
    "                      <i class=\"icon ion-android-checkbox-outline\"></i>\r" +
    "\n" +
    "                  </div>&ndash;&gt;\r" +
    "\n" +
    "                <auto-list-content class=\"bg-calm list-content_stu\" >\r" +
    "\n" +
    "                    <div class=\"list-center-stu\" ng-click=\"showWorkDetail(paper);\" >\r" +
    "\n" +
    "                        <div  class=\"left-img\">\r" +
    "\n" +
    "                            <img src=\"images/student.svg\" alt=\"\"  ng-click=\"goWorkDetail(correctedStu)\"/>\r" +
    "\n" +
    "                            <div class=\"name\" >王大锤</div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"center-span\">\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span ng-bind=\"'得分: '\" ></span>\r" +
    "\n" +
    "                                <span style=\"color: rgb(53, 69, 207);font-size: 20px\" ng-bind=\"correctedStu.first\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span style=\"margin-left: 12px\" ng-show=\"!data.workSort.showElapseFlag\"></span>\r" +
    "\n" +
    "                                 <span ng-bind=\"'用时: '+correctedStu.elapse+'分钟'\" >\r" +
    "\n" +
    "                                 </span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                   <span ng-bind=\"'改错次数: '+(correctedStu.reworkTimesVo)\" >\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span ng-bind=\"'改错后得分: '\" ></span>\r" +
    "\n" +
    "                                <span style=\"color:  rgb(53, 69, 207);font-size: 20px\" ng-bind=\"correctedStu.last\">\r" +
    "\n" +
    "                                </span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    &lt;!&ndash;<div class=\"third\" style=\"margin-left: 20px;\">{{\"排名: 第\"+($index+1)+\"名\"}}</div>&ndash;&gt;\r" +
    "\n" +
    "                    <div class=\"list-right_stu\" ng-click=\"editPraise(correctedStu)\" >\r" +
    "\n" +
    "                        <div class=\"tool-bar-item\" >\r" +
    "\n" +
    "                            <img src=\"{{praise.img}}\" ng-repeat=\"praise in correctedStu.encourageImgs\" >\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </auto-list-con>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('partials/work_statistics/work_list_backup.html',
    "<ion-view title=\"作业列表 | {{wData.queryParams.sName}}\">\r" +
    "\n" +
    "    <ion-content class=\"has-header\">\r" +
    "\n" +
    "        <!--作业列表查询-->\r" +
    "\n" +
    "<!--        <fieldset style=\"width: 99%;padding: 8px;border:1px solid black;margin: 5px 2px 5px 2px\" >\r" +
    "\n" +
    "            &lt;!&ndash;<select-month month=\"$parent.wData.queryParam.currentMonth\"></select-month>&ndash;&gt;\r" +
    "\n" +
    "            <legend class=\"legend\" ng-click=\"showQuery()\">\r" +
    "\n" +
    "                <span >\r" +
    "\n" +
    "                    查询\r" +
    "\n" +
    "                <i ng-class=\"showQueryFlag==true?'ion ion-ios-arrow-up':'ion ion-ios-arrow-down'\"\r" +
    "\n" +
    "                   style=\"color: green\"\r" +
    "\n" +
    "                        >\r" +
    "\n" +
    "                </i>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "                &nbsp;\r" +
    "\n" +
    "            </legend>\r" +
    "\n" +
    "            <div ng-show=\"showQueryFlag\" >\r" +
    "\n" +
    "                <date-picker>\r" +
    "\n" +
    "                    <div class=\"item item-input block-input \" style=\"height: 30px\">\r" +
    "\n" +
    "                        <a  class=\"button button-clear icon ion-calendar\" ng-click=\"showDateTime('startTime')\" ng-blur=\"closeDateTime(1)\"></a>\r" +
    "\n" +
    "                        <i style=\"margin-right: 10px\">从:</i>\r" +
    "\n" +
    "                        <input type=\"text\"\r" +
    "\n" +
    "                               placeholder=\"开始时间\"\r" +
    "\n" +
    "                               ng-model=\"wData.queryParam.startTime\"\r" +
    "\n" +
    "                               name=\"startTime\"\r" +
    "\n" +
    "                               readonly=\"readonly\"\r" +
    "\n" +
    "                               id=\"startTime\"\r" +
    "\n" +
    "                               style=\"background-color: #fff\"\r" +
    "\n" +
    "                                />\r" +
    "\n" +
    "                        <a class=\"button button-clear icon ion-close\" ng-show=\"wData.queryParam.startTime!=''\" ng-click=\"clearDateTime(1)\"></a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"item item-input block-input\" style=\"height: 40px\">\r" +
    "\n" +
    "                        <a  class=\"button button-clear icon ion-calendar\" ng-click=\"showDateTime('endTime')\" ng-blur=\"closeDateTime(2)\"></a>\r" +
    "\n" +
    "                        <i style=\"margin-right: 10px\">到:</i>\r" +
    "\n" +
    "                        <input type=\"text\"\r" +
    "\n" +
    "                               placeholder=\"截止时间\"\r" +
    "\n" +
    "                               ng-model=\"wData.queryParam.endTime\"\r" +
    "\n" +
    "                               name=\"endTime\"\r" +
    "\n" +
    "                               readonly=\"readonly\"\r" +
    "\n" +
    "                               id=\"endTime\"\r" +
    "\n" +
    "                               style=\"background-color: #fff\"\r" +
    "\n" +
    "                                />\r" +
    "\n" +
    "                        <a class=\"button button-clear icon ion-close\" ng-show=\"wData.queryParam.endTime!=''\" ng-click=\"clearDateTime(2)\"></a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </date-picker>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </fieldset>-->\r" +
    "\n" +
    "        <div class=\"item item-input block-input\" style=\"height: 40px;\" ng-if=\"wData.workList.length<=0\">\r" +
    "\n" +
    "            <input type=\"text\"\r" +
    "\n" +
    "                   ng-model=\"tip\"\r" +
    "\n" +
    "                   readonly=\"readonly\"\r" +
    "\n" +
    "                   id=\"refreshTimeCount\"\r" +
    "\n" +
    "                   style=\"font-size: 20px;color: red\"\r" +
    "\n" +
    "                    />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <auto-list-con>\r" +
    "\n" +
    "            <auto-list ng-repeat=\"paper in wData.workList\" >\r" +
    "\n" +
    "                <auto-list-content class=\"bg-calm list-content_stu\" style=\"min-height: 105px;position: relative;\" >\r" +
    "\n" +
    "                    <div class=\"list-center-stu\"  ng-click=\"showWorkDetail(paper);\">\r" +
    "\n" +
    "                        <div  class=\"left-img\">\r" +
    "\n" +
    "                            <div stat-circle\r" +
    "\n" +
    "                                 refer-text=\"paper.processName+paper.processBar\",\r" +
    "\n" +
    "                                 refer-percent=\"paper.processBar.substr(0,paper.processBar.length - 1)\"\r" +
    "\n" +
    "                                 data-width=\"25\"\r" +
    "\n" +
    "                                 data-dimension=\"95\"\r" +
    "\n" +
    "                                 class=\"thumbnail-left\"\r" +
    "\n" +
    "                                 style=\"width: 100px;height: 100px;float: left\"  ng-click=\"showWorkDetail(paper);\"></div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"center-span\">\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span ng-bind=\"'试卷名: '\" ></span>\r" +
    "\n" +
    "                                <span style=\"font-size: 12px\" ng-bind=\"paper.paperName\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span style=\"font-size: 12px\" ng-bind=\"paper.date\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span style=\"font-size: 12px\" ng-bind=\"paper.clazz\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"second position-set\" >\r" +
    "\n" +
    "                                <span style=\"font-size: 12px\" ng-bind=\"paper.statusVo\"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <!--<div class=\"second position-set\" ng-if=\"paper.status>=3\">\r" +
    "\n" +
    "                                <span style=\"font-size: 12px\" ng-bind=\"paper.statusVo+ ' ('+paper.score+'分/'+paper.worthScore+'分) ' \"></span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"second position-set\" ng-if=\"paper.status<3\">\r" +
    "\n" +
    "                                <span style=\"font-size: 12px\" ng-bind=\"paper.statusVo\"></span>\r" +
    "\n" +
    "                            </div>-->\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "<!--\r" +
    "\n" +
    "                    <div stat-circle\r" +
    "\n" +
    "                         refer-text=\"paper.processName+paper.processBar\",\r" +
    "\n" +
    "                         refer-percent=\"paper.processBar.substr(0,paper.processBar.length - 1)\"\r" +
    "\n" +
    "                         data-width=\"25\"\r" +
    "\n" +
    "                         data-dimension=\"95\"\r" +
    "\n" +
    "                         class=\"thumbnail-left\"\r" +
    "\n" +
    "                  <!--       style=\"width: 100px;height: 100px;float: left\"  ng-click=\"showWorkDetail(paper);\"></div>&ndash;&gt;\r" +
    "\n" +
    "                    <div class=\"first\" style=\"margin-left: 35px\"><label>试卷名:&nbsp; <span>{{paper.paperName}}</span>\r" +
    "\n" +
    "                    </label></div>\r" +
    "\n" +
    "                    <div class=\"first\" style=\"margin-left: 35px\"><label><span>{{paper.date}}</span></label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"first\" style=\"margin-left: 35px\"><label><span>{{paper.clazz}}</span> </label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"first\" style=\"margin-left: 35px\"><label><span>{{paper.statusVo}}</span>\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    </div>-->\r" +
    "\n" +
    "                    <div class=\"list-right_stu\"  >\r" +
    "\n" +
    "                        <div class=\"tool-bar-item\" >\r" +
    "\n" +
    "                            <img src=\"{{praise.img}}\" ng-repeat=\"praise in paper.encourageImgs\" >\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                   <a style=\"position: absolute;bottom: 0;right: 0;text-decoration: underline;color:blue;font-weight:bold;font-size: 14px\"\r" +
    "\n" +
    "                            ng-click=\"praiseStu(paper)\" ng-if=\"paper.status>=3\">\r" +
    "\n" +
    "                       家长评价</a>\r" +
    "\n" +
    "                </auto-list-content>\r" +
    "\n" +
    "            </auto-list>\r" +
    "\n" +
    "            <!--<auto-list ng-if=\"!wData.workList||wData.workList.length==0\">\r" +
    "\n" +
    "                无作业\r" +
    "\n" +
    "            </auto-list>-->\r" +
    "\n" +
    "        </auto-list-con>\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('partials/work_statistics/work_praise.html',
    "<ion-view title=\"表扬\"  hide-nav-bar=\"true\">\r" +
    "\n" +
    "    <ion-header-bar class=\"bar-balanced\" align-title=\"center\">\r" +
    "\n" +
    "        <div class=\"button button-clear\" ng-click=\"back()\" >\r" +
    "\n" +
    "            <i class=\"icon ion-ios-arrow-back\"> </i>\r" +
    "\n" +
    "            返回</div>\r" +
    "\n" +
    "        <h1 class=\"title\" style=\"font-family: 'Microsoft YaHei'\">表扬</h1>\r" +
    "\n" +
    "    </ion-header-bar>\r" +
    "\n" +
    "    <ion-content padding=\"false\">\r" +
    "\n" +
    "        <div class=\"message_content\">\r" +
    "\n" +
    "            <div class=\"face\">\r" +
    "\n" +
    "                <img src=\"./images/student.svg\" />\r" +
    "\n" +
    "                <div class=\"name\" style=\"text-align: center;\" ng-bind=\"wData.queryParams.sName\"></div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"message\" > <label ng-bind=\"wData.stuPraise||'没有评价'\" style=\"font-size: 16px;\"></label></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div style=\"padding-top: 150px;\">\r" +
    "\n" +
    "            <label style=\"  font-size: 20px;\" ng-bind=\"'家长对'+wData.queryParams.sName+'的表现进行评价：'\"> </label>\r" +
    "\n" +
    "            <div class=\"card\" style=\"margin: 10px 20px;\">\r" +
    "\n" +
    "                <ul class=\"list\" style=\"padding: 5px\">\r" +
    "\n" +
    "                    <ion-checkbox ng-repeat=\"praise in wData.praiseList \" ng-model=\"praise.selected\" class=\"item clazz-list\"\r" +
    "\n" +
    "                            ng-click=\"selectPraise(praise);\">\r" +
    "\n" +
    "                        {{praise.text}}\r" +
    "\n" +
    "                    </ion-checkbox>\r" +
    "\n" +
    "                </ul>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </ion-content>\r" +
    "\n" +
    "    <ion-footer-bar class=\"bg-balanced\"  >\r" +
    "\n" +
    "        <button class=\"button-clear bg-calm  bar-item\"\r" +
    "\n" +
    "                ng-click=\"comfirmPraise()\" >\r" +
    "\n" +
    "            <i class=\"icon ion-ios-checkmark\">\r" +
    "\n" +
    "            </i>\r" +
    "\n" +
    "            确定\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "    </ion-footer-bar>\r" +
    "\n" +
    "</ion-view>\r" +
    "\n" +
    "\r" +
    "\n"
  );
}]); });