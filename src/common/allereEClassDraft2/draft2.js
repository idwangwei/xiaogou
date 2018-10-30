'use strict';
import './css/canvas.css';
import  $ from 'jquery';

angular.module('draftPainter2', []).directive('allereDraft', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        template: `<div class="draft_icon" ng-class="{'draft_icon_light':isShow}"></div>`,
        scope:{isShow:'@'},
        controller: ['$scope', '$window', function ($scope, $window) {
            $scope.options = {};
            $scope.headerHight = $scope.$root.platform.IS_IPHONE || $scope.$root.platform.IS_IPAD ? 64 : 44;
            $scope.screenWidth = $scope.$root.platform.IS_ANDROID ? $window.screen.availWidth : $window.innerWidth;
            $scope.screenHeight = $scope.$root.platform.IS_ANDROID ? $window.screen.availHeight : $window.innerHeight;
            $scope.options.width = $scope.screenWidth;
            $scope.options.height = $scope.screenHeight - $scope.headerHight;
            $scope.isTouch = !!('ontouchstart' in window);
            $scope.PAINT_START = $scope.isTouch ? 'touchstart' : 'mousedown';
            $scope.PAINT_MOVE = $scope.isTouch ? 'touchmove' : 'mousemove';
            $scope.PAINT_END = $scope.isTouch ? 'touchend' : 'mouseup';

            $scope.getTouchPoint = function (e) {
                let point = {x:0,y:0};
                if ($scope.isTouch) {
                    point.x = e.changedTouches[0].pageX;
                    point.y = e.changedTouches[0].pageY - $scope.headerHight;
                } else {
                    point.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
                    point.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
                }
                return point;
            };
            $scope.paint = function (e,ctxTmp,ppts) {
                e.preventDefault();
                let currentP = $scope.getTouchPoint(e);
                console.log('currentP:',JSON.stringify(currentP));
                ppts.push({
                    x: currentP.x,
                    y: currentP.y
                });

                // ctxTmp.clearRect(0, 0, $scope.options.width, $scope.options.height);
                if (ppts.length === 3) {
                    var b = ppts[0];
                    ctxTmp.beginPath();
                    ctxTmp.moveTo(ppts[0].x, ppts[0].y);
                    ctxTmp.arc(b.x, b.y, ctxTmp.lineWidth / 2, 0, Math.PI * 2, !0);
                    ctxTmp.fill();
                    ctxTmp.closePath();
                    return;
                }

                // Tmp canvas is always cleared up before drawing.
                ctxTmp.clearRect(0, 0, $scope.options.width, $scope.options.height);
                ctxTmp.beginPath();
                ctxTmp.moveTo(ppts[0].x, ppts[0].y);

                for (var i = 1; i < ppts.length - 2; i++) {
                    var c = (ppts[i].x + ppts[i + 1].x) / 2;
                    var d = (ppts[i].y + ppts[i + 1].y) / 2;
                    ctxTmp.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
                }

                // For the last 2 points
                ctxTmp.quadraticCurveTo(
                    ppts[i].x,
                    ppts[i].y,
                    ppts[i + 1].x,
                    ppts[i + 1].y
                );
                ctxTmp.stroke();
            };
        }],
        link: function postLink($scope, ele, attr) {
            //获取上一次创建的canvas
            let drawList = document.getElementsByClassName('draft_container');
            let drawBgList = document.getElementsByClassName('draft_container_bg');
            let canvas = drawList[0];
            let canvasBG = drawBgList[0];
            let context = canvas && canvas.getContext("2d");
            let contextBG = canvasBG && canvasBG.getContext("2d");
            //创建canvas并设置尺寸
            if(!canvas||!contextBG){
                canvas = document.createElement('canvas');
                canvasBG = document.createElement('canvas');
                context = canvas.getContext("2d");
                contextBG = canvasBG.getContext("2d");
                document.documentElement.appendChild(canvas);
                document.documentElement.appendChild(canvasBG);

                canvasBG.style.top = $scope.headerHight+'px';
                canvasBG.height = $scope.options.height;
                canvasBG.width = $scope.options.width;
                canvasBG.classList.add('draft_container_bg');
                canvas.style.top = $scope.headerHight+'px';
                canvas.height = $scope.options.height;
                canvas.width = $scope.options.width;
                canvas.classList.add('draft_container');
                canvas.lineJoin = canvas.lineCap = 'round';
                context.lineWidth = 2;

                //canvas绘图操作
                let ppts=[];
                let moveDrawing = function(e) {
                    e.preventDefault();
                    $scope.paint(e,context,ppts);
                };
                canvas.addEventListener($scope.PAINT_START, (e)=>{
                    e.preventDefault();
                    let startP = $scope.getTouchPoint(e);
                    console.log('startP:',JSON.stringify(startP));

                    ppts = [];
                    ppts.push({x: startP.x,y: startP.y});
                    ppts.push({x: startP.x,y: startP.y});

                    canvas.addEventListener($scope.PAINT_MOVE, moveDrawing, false);
                    $scope.paint(e,context,ppts);
                }, false);

                canvas.addEventListener($scope.PAINT_END, (e)=>{
                    e.preventDefault();
                    canvas.removeEventListener($scope.PAINT_MOVE,moveDrawing);
                    contextBG.drawImage(canvas,0,0);
                    context.clearRect(0,0,$scope.options.width,$scope.options.height);
                }, false);
            }

            //当前草稿图标事件绑定
            let stateChangeListener = $scope.$on('$stateChangeStart',()=>{
                $scope.isShow = false;
            });
            let unWatcher = $scope.$watch('isShow',(newData)=>{
                if(newData){
                    console.log('draft event show');
                    canvas.style.display='block';
                    canvasBG.style.display='block';
                }else {
                    console.log('draft event hide');
                    canvas.style.display='none';
                    canvasBG.style.display='none';

                    context.clearRect(0,0,canvas.width,canvas.height);
                    contextBG.clearRect(0,0,canvas.width,canvas.height)
                }
            });
            $(ele).click(()=>{
                $scope.$apply(()=>{
                    $scope.isShow = !$scope.isShow;
                });
            });
            $scope.$on('$destroy',()=>{
                unWatcher();
                stateChangeListener();
            });
            window.onorientationchange = function(){
                contextBG.clearRect(0, 0, $scope.options.width, $scope.options.height);
                context.clearRect(0, 0, $scope.options.width, $scope.options.height);

                $scope.headerHight = $scope.$root.platform.IS_IPHONE || $scope.$root.platform.IS_IPAD ? 64 : 44;
                $scope.screenWidth = $scope.$root.platform.IS_ANDROID ? window.screen.availWidth : window.innerWidth;
                $scope.screenHeight = $scope.$root.platform.IS_ANDROID ? window.screen.availHeight : window.innerHeight;
                $scope.options.width = $scope.screenWidth;
                $scope.options.height = $scope.screenHeight - $scope.headerHight;
                canvas.height = $scope.options.height;
                canvas.width = $scope.options.width;
                canvasBG.height = $scope.options.height;
                canvasBG.width = $scope.options.width;
            };
        }
    };
}]);
