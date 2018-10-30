/**
 * Created by 邓小龙 on 2016/7/11.
 * 公共密码框
 */

import directives from './../index'
directives.directive('commonPassword', ['commonService',function (commonService) {
    return {
        restrict: 'E',
        scope: {
            passwordSetting:'='
        },
        template:require('partials/directive/common_password.html'),
        controller:['$scope',function ($scope) {
            $scope.passwordSetting_=$scope.passwordSetting;
            $scope.passwordSetting_.placeholder=$scope.passwordSetting_.placeholder||"";
            $scope.passwordSetting_.name=$scope.passwordSetting_.name||"";
            $scope.passwordSetting_.maxlength=$scope.passwordSetting_.maxlength||6;

            $scope.keyDown=function (modelValue,$event) {
                if($event.keyCode == 8 || $event.keyCode == 46)
                    return;
                
                if(modelValue&&modelValue.length==$scope.passwordSetting_.maxlength){
                    if($scope.passwordConfirmPop)
                        return;
                    var hasSelectStr="";
                    if(window.getSelection) {
                        hasSelectStr=window.getSelection().toString();
                    }
                    if(hasSelectStr&&hasSelectStr.length) return;
                    $scope.passwordConfirmPop=commonService.showAlert("信息提示","只能输入6个字符以内！");
                    $scope.passwordConfirmPop.then(function (res) {
                        if(res){
                            $scope.passwordConfirmPop=null;
                        }
                    })
                }
            }
        }],
        link: function ($scope, $element, $attrs) {
        }
    };
}]);
