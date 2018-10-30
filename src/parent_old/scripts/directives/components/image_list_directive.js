/**
 * Author 彭建伦 on 2015/3/7.
 * @description 输入框指令
 */

import directives from './../index';
import $ from 'jquery';

//directives.directive('imgListContainer', function () {
//    return {
//        restrict: 'C',
//        scope: {
//            col: '@',
//            gap: '@'
//        },
//        controller: function ($scope) {
//            "ngInject";
//            var DEFAULT_COL = 2, DEFAULT_GAP = '1';
//            this.getCol = ()=>$scope.col || DEFAULT_COL;
//            this.getGap = ()=>$scope.gap || DEFAULT_GAP;
//        }
//    };
//}).directive('imgContainer', function () {
//    return {
//        restrict: 'C',
//        scope: true,
//        require: '^imgListContainer',
//        link: function ($scope, ele, $attr, ctrl) {
//            var $ionContent = $(ele).parents('ion-content');
//            var hasPadding = $ionContent.length && $ionContent.attr('padding') == "true";
//            var $ele = $(ele)
//                , pWidth = hasPadding ? $ele.parent().innerWidth() - 20: $ele.parent().innerWidth()
//                , width = Math.floor((pWidth - ctrl.getGap() * 2 * ctrl.getCol()) / ctrl.getCol());
//            $ele.width(width);
//            $ele.height(width-20);
//            $ele.css('margin', ctrl.getGap() + 'px');
//        }
//    }
//});
