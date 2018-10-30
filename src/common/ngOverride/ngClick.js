/**
 * Created by 彭建伦 on 2016/10/24.
 * 覆写ng-click指令，以解决在移动端点击时间偶尔点一次触发两次的问题（touchend+mouseup）
 * 相关问题描述：
 * https://forum.ionicframework.com/t/ng-click-fires-twice-in-response-to-a-single-tap/22585/14
 * @param $provide
 * @constructor
 */
let ngClickDirectiveDecorator = function ($provide) {
    $provide.decorator('ngClickDirective', ['$delegate', function ($delegate) {
        // drop the default ngClick directive
        $delegate.shift();
        return $delegate;
    }]);
};
ngClickDirectiveDecorator.$inject = ["$provide"];

let ngClickDirective = function ($parse, $ionicNgClick, $window, $ionicGesture) {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            if (JSON.stringify($window.ontouchstart) == undefined) {  //非移动设备
                $ionicNgClick(scope, element, attr.ngClick)
            } else { //移动设备
                var clickExpr = attr.ngClick;
                var clickHandler = angular.isFunction(clickExpr) ?
                    clickExpr :
                    $parse(clickExpr);
                var listener = function (ev) {
                    scope.$apply(function () {
                        clickHandler(scope, {
                            $event: ev
                        });
                    });
                };
                var gesture = $ionicGesture.on('tap', listener, element,{
                    tap_max_touchtime:499
                });
                scope.$on('$destroy', function () {
                    $ionicGesture.off(gesture, 'tap', listener);
                });
            }
        }
    }
};
ngClickDirective.$inject = ['$parse', '$ionicNgClick', '$window', '$ionicGesture'];

export {
    ngClickDirectiveDecorator,
    ngClickDirective
}


// angular.module("overrideNgClick", [])
//     .config(["$provide", function ($provide) {
//         $provide.decorator('ngClickDirective', ['$delegate', function ($delegate) {
//             // drop the default ngClick directive
//             $delegate.shift();
//             return $delegate;
//         }]);
//     }])
//     .directive('ngClick', ['$parse', '$ionicNgClick', '$window', '$ionicGesture', function ($parse, $ionicNgClick, $window, $ionicGesture) {
//         return {
//             restrict: "A",
//             link: function (scope, element, attr) {
//                 if (JSON.stringify($window.ontouchstart) == undefined) {  //非移动设备
//                     $ionicNgClick(scope, element, attr.ngClick)
//                 } else { //移动设备
//                     var clickExpr = attr.ngClick;
//                     var clickHandler = angular.isFunction(clickExpr) ?
//                         clickExpr :
//                         $parse(clickExpr);
//                     var listener = function (ev) {
//                         scope.$apply(function () {
//                             clickHandler(scope, {
//                                 $event: ev
//                             });
//                         });
//                     };
//                     var gesture = $ionicGesture.on('tap', listener, element);
//                     scope.$on('$destroy', function () {
//                         $ionicGesture.off(gesture, 'tap', listener);
//                     });
//                 }
//             }
//         }
//     }]);
