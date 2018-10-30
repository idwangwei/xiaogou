/**
 * Created by pengjianlun on 16-1-11.
 */
import _ from 'underscore';
import $ from 'jquery';
import directives from './../index';
//该service根据每个subheader的ID缓存subheader的状态
directives.service('subHeaderService', [function () {
    this.subHeaderList = [];
    var me=this;
    /**
     * 根据传入subheader的ID判断其状态是否被缓存
     * @param id subheader的ID
     * @return 该subheader的状态对象，如果没有则返回false
     */
    this.has = function (id) {
        var has = false;
        angular.forEach(this.subHeaderList, function (subHeaderInfo) {
            if (subHeaderInfo.id == id) {
                has = subHeaderInfo;
            }
        });
        return has;
    };
    /**
     * 保存 subheader的状态
     * @param subHeaderInfo {id:'',activeEle:'elementId'}
     */
    this.save = function (subHeaderInfo) {
        var has = this.has(subHeaderInfo.id);
        if (has)has.activeEle = subHeaderInfo.activeEle;
        else this.subHeaderList.push(subHeaderInfo);
    };

    /**
     * 清除所有的tab缓存
     */
    this.clearAll=function(){
        me.subHeaderList.splice(0,me.subHeaderList.length);
    }
}]).directive('subHeader', ['subHeaderService', function (subHeaderService) {
    return {
        restrict: 'E',
        template: '<div class="bar bar-subheader subheader-flex" ng-transclude></div>',
        transclude: true,
        replace: true,
        link: function ($scope, $element, $attrs) {
            var subheaderId = $attrs.id;
            if ($scope.subHeaderInfo = subHeaderService.has(subheaderId)) {
                $($element).find('#' + $scope.subHeaderInfo.activeEle).find('.sub-title').addClass('subheader-active');
            } else {
                $scope.subHeaderInfo = {id: subheaderId, activeEle: $($element).children().get(0).id};
                $($element).children().eq(0).find('.sub-title').addClass('subheader-active');
                subHeaderService.save($scope.subHeaderInfo);
            }
            $($element).children().on('click', function () {
                $($element).children().find('.sub-title').removeClass('subheader-active');
                $(this).find('.sub-title').addClass('subheader-active');
                var id = this.id;
                $scope.$apply(function () {
                    $scope.subHeaderInfo.activeEle = id;
                    subHeaderService.save({id: $attrs.id, activeEle: id});
                });
            });
        }
    }
}]);
