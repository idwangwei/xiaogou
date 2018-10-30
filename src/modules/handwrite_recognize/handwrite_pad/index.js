/**
 * Created by pjl on 2017/3/21.
 * 手写板
 */
import './angular-canvas-painter';
export default  angular.module('handwrite-pad', ['pw.canvas-painter'])
    .directive('handwritePad', [function () {
        return {
            restrict: "E",
            scope: {
                width: "@",
                height: "@"
            },
            controller: ["$scope",function ($scope) {
                this.eventDelegate = $({});
                this.version = 0;
                this.options = {
                    width: $scope.width,
                    height: $scope.height,
                    backgroundColor: 'white',
                    lineWidth: 4, //px
                    undo: true,
                    color: 'black'
                };
            }],
            controllerAs: "ctrl",
            replace: true,
            template: `
                   <div pw-canvas options="ctrl.options"
                      version="ctrl.version"
                      event-delegate="ctrl.eventDelegate"></div>
                `
        }
    }]);
