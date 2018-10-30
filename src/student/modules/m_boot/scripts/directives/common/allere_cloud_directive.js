/**
 * Author 邓小龙 on 2017/01/23.
 * @description
 */
import  directives from './../index';

directives.directive('allereCloud', ["$timeout", "$rootScope", function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            
        },
        replace:true,
        template:require('../../partials/directive/allere_cloud.html'),
        link: function ($scope, element, attr) {
            $scope.onTouch = ($event) =>{
                /*  $event.stopPropagation();
                 $event.preventDefault();*/
                $scope.ox = $event.target.offsetLeft;
                $scope.oy = $event.target.offsetTop;
            };

            $scope.onDrag = ($event)=>{
                /* $event.stopPropagation();
                 $event.preventDefault();*/
                let el = $event.target,
                    dx = $event.gesture.deltaX,
                    dy = $event.gesture.deltaY;
                let canMoveWitdh = window.innerWidth - $(el).width();
                let canMoveHeightMin = 44;
                let canMoveHeightMax = window.innerHeight - $(el).height() - 44;
                let moveX = $scope.ox + dx, moveY = $scope.oy + dy;

                if (moveX < 0)
                    el.style.left = 0 + 'px';
              /*  else if (moveX > canMoveWitdh)
                    this.handleImgStop(el);//el.style.left = canMoveWitdh + 'px';*/
                else
                    el.style.left = $scope.ox + dx + "px";

                if (moveY < canMoveHeightMin)
                    el.style.top = canMoveHeightMin + "px";
                else if (moveY > canMoveHeightMax)
                    el.style.top = canMoveHeightMax + "px";
                else
                    el.style.top = $scope.oy + dy + "px";
            };

        }
    };
}]);
