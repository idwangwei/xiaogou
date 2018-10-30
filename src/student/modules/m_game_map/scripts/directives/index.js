/**
 * Created by WL on 2017/5/4.
 */
import goodsSelectDir from "./goodsSelectPage/index";
import stuFloatMark from "./level_page/stu_float_mark.js";
import atlasShareBtn from "./atlasShareBtn/index.js";
import repeatFinish from "./level_page/repeat_finish.js";

let directives = angular.module("m_game_map.directives",[]);

directives.directive("goodsSelect", goodsSelectDir)
    .directive('stuFloatMark',stuFloatMark)
    .directive('atlasShareBtn',atlasShareBtn)
    .directive('repeatFinish',repeatFinish);
