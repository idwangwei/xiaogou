/**
 * Created by 彭建伦 on 2015/7/27.
 */
define(['./../index'], function (directives) {
    /**
     * @description 再次输入密码时，验证输入密码与之前输入的密码是否一致
     *
     * confirmPass为之前输入的密码
     */
    directives.directive('confirmPass', function () {
        return {
            restrict: "A",
            scope: {
                confirmPass: '='
            },
            require: '^ngModel',
            link: function ($scope, element, $attr, ctrl) {
                ctrl.$validators.confirmPass = function (modelValue) {
                    if ($scope.confirmPass != modelValue) {
                        return false;
                    }
                    return true;
                }
            }
        }
    });
});
