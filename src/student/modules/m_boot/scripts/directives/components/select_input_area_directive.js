/**
 * Author 邓小龙 on 2015/9/23.
 * @description 弹出选择框的指令
 */
var directives = require('./../index');
import _each from 'lodash.foreach';
directives.directive('selectInputArea', ['$templateCache', function ($templateCache) {
    return {
        restrict: "C",
        scope: true,
        controller: ['$scope', '$window', '$ionicModal', function ($scope, $window, $ionicModal) {
            $scope.textContent = {};
            $scope.modalDialogData = { //modal模态窗口传入合适的值
                title: "这里要选什么呢?",
                icon: "fa fa-paw",
                itemList: []
            };
            $scope.inputValue = "";
        }],
        link: function ($scope, ele, attrs) {

            if (!$(ele).hasClass('underline-select-input-area')) {
                angular.element(ele).css("border", "none");
            }

            if ($(ele).attr('id') == 'yesImg84ab9c31-9850-426d-ad1a-7374765b6475') {
                $(ele).css('border-bottom', '1px soild black');
            }
            var inputBox = angular.element(ele).attr('readonly', true);
            inputBox.bind("focus", $scope.focusSelectMenu);
            _each($scope.currentQInput, function (spInfo) {
                _each(spInfo.spList, function (inputInfo) {
                    if (inputInfo.inputBoxUuid == attrs.id) {
                        $scope.inputBoxId = inputInfo.inputBoxUuid;//输入框id
                        if (inputInfo.currentQSelectItem) {//有选择项内容
                            $scope.modalDialogData.itemList = inputInfo.currentQSelectItem;
                            inputBox.value = inputInfo.inputBoxStuAns;
                            $scope.scorePointQbuId = inputInfo.scorePointQbuId;//得分点qub表主键
                        }
                    }
                });
            });
        }
    }
}]);

