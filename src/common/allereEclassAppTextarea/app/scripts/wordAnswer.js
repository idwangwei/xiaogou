/**
 * Created by 彭建伦 on 2016/3/21.
 * 答语指令
 */
import module from './module';
//import $ from 'jquery';
module.directive('wordAnswer', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {

            var inputRegExp = /@id=(.+?)@\[(.*?)\]/mg; //查找wordAnswer中的<id=?>[?]的部分
            $scope.$watch('value', function () {
                // 答语串 example:
                // \wordAnswer{小明一共搬了<id=1>[800]公斤的大米，<id=2>[够]吃半年啦}
                // 找到<id=?>[?]的部分生成相应的输入框，并赋 值（值为[ ]中的内容），点击输入框时可接受键盘输入重新赋值

                var exprStrWithInputBox = $scope.value.replace(inputRegExp, function (match, $1, $2) {
                    return '<span style="display: inline-block;min-width: 40px;border-bottom: 1px solid black;text-align:center;"' +//输入框html模板
                        'word-answer-input-box box-id=' + $1 + ' value="' + $2 + '"></span>';
                });

                var contentRegExp = /\\wordAnswer{(.+)}/mg; //查找\wordAnswer{..}中，{}中的内容
                var htmlStrWidthInputBox = '';
                exprStrWithInputBox.replace(contentRegExp, function (match, $1) {
                    htmlStrWidthInputBox = '答：' + $1;
                });

                if(htmlStrWidthInputBox.indexOf('`')>=0){    //答语中有需要mathJax渲染的字符串
                    htmlStrWidthInputBox=htmlStrWidthInputBox.replace(/`(.+?)`/g,function(match,$1){
                        return "<span mathjax-parser value='"+$1+"'></span>";
                    });
                }
                element.empty().append(htmlStrWidthInputBox);
                //=========================找到答语中的mathjax-parser并compile===========================
                var mathjax = $(element).find('[mathjax-parser]');
                mathjax.each(function(){
                    var $newScope = $scope.$new();
                    $compile($(this))($newScope);
                });
                //=========================找到答语中的输入框并compile===========================
                var $inputBoxes = $(element).find('[word-answer-input-box]');
                angular.forEach($inputBoxes, function (inputBox, idx) {
                    var $newScope = $scope.$new();
                    $newScope.value = $(inputBox).attr('value');
                    $compile(inputBox)($newScope);
                });

                $scope.$emit('apptextarea.subdirective.render', element);

            });


            //=====================改变wordAnswer的expr=========================================
            var tempValue = $scope.value;
            $scope.$on('wordAnswer.boxExprChange', function (ev, data) {

                tempValue = tempValue.replace(inputRegExp, function (match, $1, $2) {
                    if ($1 == data.boxId) {
                        return '@id=' + $1 + '@[' + data.expr + ']';
                    }
                    return match;
                });

                $scope.$emit('unit.exprChange', {unitId: element.attr('id'), expr: tempValue});

            });
        }
    }
}]);