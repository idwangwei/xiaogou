/**
 * Created by LuoWen on 2016/8/4.
 */

let imgNewLine    = require('./../images/vf/newline.png');
let imgBackBtn    = require('./../images/vf/kbd-del.png');
let imgLine       = require('./../images/vf/kbd-line.png');
let imgDot        = require('./../images/vf/kbd-dot.png');
let imgDiv        = require('./../images/vf/kbd-div.png');
let imgBorrow     = require('./../images/vf/kbd-borrow.png');
// let imgCarry      = require('./../images/vf/kbd-carry.png');
// let imgCarry2     = require('./../images/vf/kbd-carry2.png');
let imgLineDel    = require('./../images/vf/kbd-line-del.png');
let imgDotDel     = require('./../images/vf/kbd-dot-del.png');
let imgDivDel     = require('./../images/vf/kbd-div-del.png');
let imgBorrowDel  = require('./../images/vf/kbd-borrow-del.png');
let imgCarryDel   = require('./../images/vf/kbd-carry-del.png');
let imgCarryDel2  = require('./../images/vf/kbd-carry-del2.png');
let imgClearAll   = require('./../images/vf/kbd-clear-all.png');
let imgUndo       = require('./../images/vf/kbd-undo.png');

export default [()=> {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_vertical.html'),
        controller: 'keyboardCommonCtrl as ctrl',
        require: '^keyboard',
        link: ($scope, element, attrs, keyboardCtrl)=> {
            handleImages($scope);

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
}];

let handleImages = ($scope) => {
    console.log("handleImages", imgBackBtn);
    $scope.imgBackBtn = imgBackBtn;
    $scope.imgNewLine = imgNewLine;
    $scope.imgLine = imgLine;
    $scope.imgLineDel = imgLineDel;
    $scope.imgDot = imgDot;
    $scope.imgDotDel = imgDotDel;
    $scope.imgDiv = imgDiv;
    $scope.imgDivDel = imgDivDel;
    $scope.imgBorrow = imgBorrow;
    $scope.imgBorrowDel = imgBorrowDel;
    // $scope.imgCarry = imgCarry;
    // $scope.imgCarry2 = imgCarry2;
    $scope.imgCarryDel = imgCarryDel;
    $scope.imgCarryDel2 = imgCarryDel2;
    $scope.imgClearAll = imgClearAll;
    $scope.imgUndo = imgUndo;
};