/**
 * Created by pengjianlun on 15-12-29.
 * 对一些平台的兼容代码 如（IOS）
 */
define([], function () {
    var compatiblePatch = angular.module('compatiblePatch', []);
    compatiblePatch.run([function () {


        //处理IOS的webview或其他低版本浏览器不支持startsWith和endsWith方法
        String.prototype.startsWith = function (str) {
            if (str == null || str == "" || this.length == 0 || str.length > this.length)
                return false;
            if (this.substr(0, str.length) == str)
                return true;
            else
                return false;
            return true;
        };
        String.prototype.endsWith = function (str) {
            if (str == null || str == "" || this.length == 0 || str.length > this.length)
                return false;
            if (this.substring(this.length - str.length) == str)
                return true;
            else
                return false;
            return true;
        };

    }]);

    compatiblePatch.directive('img', ['serverInterface', function (serverInterface) {//根据IMG_SERVER配置的地址动态加载图片
        return {
            restrict: "E",
            link: function ($scope, $element, $attrs) {
                var src = $attrs.src;
                if (src) {
                    replaceFn(src);
                    return;
                }
                if ($attrs.imgSrc) {
                    $scope.$watch($attrs.imgSrc, function (val) {
                        if (val)replaceFn(val);
                    });
                }
                function replaceFn(src) {
                    var replace = false;
                    var replacedSrc = src.replace(/(\$\{ip\}:90)(.*)/, function (match, $1, $2) {
                        if (match)replace = true;
                        return serverInterface.IMG_SERVER + $2;
                    });
                    if (replace)$element.attr('src', replacedSrc)
                }
            }
        };
    }]);
});

