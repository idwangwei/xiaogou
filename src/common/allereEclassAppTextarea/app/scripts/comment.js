/**
 * Created by 彭建伦 on 2016/3/22.
 */
import  module from './module';
//import $ from 'jquery';
import AlineByEqual from './alineByEqual'
module.directive('comment', ['$compile', '$log','$timeout', function ($compile, $log,$timeout) {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            var commentRegExp = /\\comment{(.*)}/;
            var match = $scope.value.match(commentRegExp);
            var alineByEqual =new AlineByEqual();
            if (!match.length || match[0].length != $scope.value.length) {
                $log.error('解题步骤的格式不正确:' + $scope.value);
                return;
            }
            var appTextarea = $('<span class="commentPlaceHolderLeft"></span>' +
                '<span class="appTextarea comment"></span>' +
                '<span class="commentPlaceHolderRight">&nbsp;&nbsp;</span>');
            element.empty().append(appTextarea);
            $scope.textContent = {};
            $compile(appTextarea)($scope);
            if(element.parent().hasClass('variable-solve-input-area'))
                element.addClass('variable-comment');
            var content = '';
            $scope.value.replace(commentRegExp, function (match, $1) {
                content = $1;
            });
            var inputAreaScope = angular.element(appTextarea.filter('.appTextarea')).scope();
            inputAreaScope.$watch('textContent.expr', function () {
                $scope.$emit('unit.exprChange', {
                    unitId: element.attr('id'),
                    expr: '\\comment{'+inputAreaScope.textContent.expr+'}'
                });
            });
            inputAreaScope.$on('keyboard.done',function(ev,val){
                angular.element(element.find('.commentPlaceHolderRight')).trigger('click');
                $scope.$emit('apptextarea.subdirective.done', {ele:val.ele});
                $timeout(function () {
                    if(alineByEqual.currentQIsEquation($(element).parent()))
                        alineByEqual.alineEqualAuto($(element).parent());
                });

            });
            inputAreaScope.$on('keyboard.comment.focus',function(){
                angular.element(element.find('.comment')).trigger('click');
            });
            inputAreaScope.textContent.expr = content;
            $scope.$emit('apptextarea.subdirective.render', element);

        }
    }
}]);