/**
 * Created by LuoWen on 2016/11/10.
 */

let imgCarry      = require('./../images/vf/kbd-carry.png');
let imgCarry2     = require('./../images/vf/kbd-carry2.png');
let imgCarry3     = require('./../images/vf/kbd-carry2.png');
let imgCarry4     = require('./../images/vf/kbd-carry2.png');
let imgCarry5     = require('./../images/vf/kbd-carry2.png');
let imgCarry6     = require('./../images/vf/kbd-carry2.png');
let imgCarry7     = require('./../images/vf/kbd-carry2.png');
let imgCarry8     = require('./../images/vf/kbd-carry2.png');

export default [()=> {
    return {
        restrict: "A",
        template: require('./../templates/keyboard_vertical_carry.html'),
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
    $scope.imgCarry  = imgCarry ;
    $scope.imgCarry2 = imgCarry2;
    $scope.imgCarry3 = imgCarry3;
    $scope.imgCarry4 = imgCarry4;
    $scope.imgCarry5 = imgCarry5;
    $scope.imgCarry6 = imgCarry6;
    $scope.imgCarry7 = imgCarry7;
    $scope.imgCarry8 = imgCarry8;
};