/**
 * Created by 彭建伦 on 2016/3/21.
 * 答语上的输入框
 */
import module from './module';
import $ from 'jquery';
module.directive('wordAnswerInputBox', ['$compile', 'EXPRESSION_SET', 'UNSUPPORT_EXPRESSION_SET', 'uuid4', function ($compile, EXPRESSION_SET, UNSUPPORT_EXPRESSION_SET, uuid4) { //答语中的输入框
    return {
        restrict: 'A',
        scope: true,
        link: function ($scope, $element, $attrs) {

            $scope.$watch('value', function () {
                //console.log('wordANswer box!!!!!!!!!!!!!!!!!!')
                //表达式列表
                $scope.EXPRESSION_SET = EXPRESSION_SET;
                //mathjax不能parse的表达式列表
                $scope.UNSUPPORT_EXPRESSION_SET = UNSUPPORT_EXPRESSION_SET;

                var exprCl = $scope.value;
                var boxId = $element.attr('box-id');

                //================如果该输入框表达式串中含有[A|B|C|....]这种格式，则说明这是选择型输入框=======
                //=======================并且方括号中用竖线分割的每一项就是选项=============================

                var isSelectInputBox = false,  //是否是输入框
                    selectItemList = [];//输入框选项列表
                boxId.replace(/\[(.+?)\]/mg, function (match, $1) {
                    if (match)isSelectInputBox = true;
                    selectItemList = $1.split('|');
                });


                //================在输入框内部插入一个appTextarea,使其可编辑================================

                var $appTextArea = angular.element('<span class="appTextarea"></span>');
                $appTextArea.attr('id', uuid4.generate());
                $element.empty().append($appTextArea);

                $compile($appTextArea)($scope);


                //================当答案编辑框监听到内容改变时,通知wordAnswer指令===========================

                var $cScope = angular.element($appTextArea).scope();
                $cScope.textContent.expr = exprCl;
                $cScope.$watch("textContent.expr", function () {
                    if ($cScope.textContent.expr)
                        $scope.$emit('wordAnswer.boxExprChange', {boxId: boxId, expr: $cScope.textContent.expr});
                });

                //===============当编辑输入框时显示键盘，如果该输入框是选择型输入框，则通知键盘显示选项==========

                $appTextArea.on('click', function (ev) {
                    ev.stopPropagation();
                    if (isSelectInputBox) {//是选择型输入框需要清空内容
                        $appTextArea.addClass('select-input-area');
                        $scope.$root.$broadcast('keyboard.show', {
                            ele: $appTextArea,
                            selectItemList: selectItemList
                        });
                    } else
                        $scope.$root.$broadcast('keyboard.show', {ele: $appTextArea});

                });
            });
        }
    }
}]);