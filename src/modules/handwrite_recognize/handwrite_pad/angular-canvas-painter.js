'use strict';
import "./angular-uuid4";
let canvasPainter = angular.module('pw.canvas-painter', ['uuid4']);
canvasPainter.run(['$templateCache', function ($templateCache) {
    $templateCache.put('../templates/canvas.html',
        '<div class="pwCanvasPaint" style="position:relative"></div>');
}]);
canvasPainter.directive('pwCanvas', ['uuid4', function (uuid4) {
    return {
        restrict: 'AE',
        scope: {
            options: '=',
            version: '=',
            eventDelegate: "="
        },
        templateUrl: '../templates/canvas.html',
        link: function postLink(scope, elm) {
            var isTouch = !!('ontouchstart' in window);

            var PAINT_START = isTouch ? 'touchstart' : 'mousedown';
            var PAINT_MOVE = isTouch ? 'touchmove' : 'mousemove';
            var PAINT_END = isTouch ? 'touchend' : 'mouseup';

            //set default options
            var options = scope.options;
            options.canvasId = options.customCanvasId || 'pwCanvasMain';
            options.tmpCanvasId = options.customCanvasId ? (options.canvasId + 'Tmp') : 'pwCanvasTmp';
            options.width = options.width || 400;
            options.height = options.height || 300;
            options.backgroundColor = options.backgroundColor || '#fff';
            options.color = options.color || '#000';
            options.undoEnabled = options.undoEnabled || false;
            options.opacity = options.opacity || 0.9;
            options.lineWidth = options.lineWidth || 1;


            //undo
            var undoCacheWithId = [];
            scope.$watch(function () {
                return undoCacheWithId.length;
            }, function (newVal) {
                scope.version = newVal;
            });

            scope.$watch('version', function (newVal) {
                console.log('new val..............' + newVal)
                if (newVal < 0) {
                    scope.version = 0;
                    return;
                }
                if (newVal >= undoCacheWithId.length) {
                    scope.version = undoCacheWithId.length;
                    return;
                }
                undo(newVal);
            });

            //create canvas and context
            var canvas = document.createElement('canvas');
            canvas.id = options.canvasId;
            elm.find('div').append(canvas);
            var ctx = canvas.getContext('2d');

            //inti variables
            var point = {
                x: 0,
                y: 0
            };
            var ppts = [];
            window.ppts_str = "";

            //set canvas size
            canvas.width = options.width;
            canvas.height = options.height;

            //set context style
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineJoin = ctx.lineCap = 'round';

            //
            ctx.lineWidth = options.lineWidth;


            var getOffset = function (elem) {
                var offsetTop = 0;
                var offsetLeft = 0;
                do {
                    if (!isNaN(elem.offsetLeft)) {
                        offsetTop += elem.offsetTop;
                        offsetLeft += elem.offsetLeft;
                    }
                    elem = elem.offsetParent;
                } while (elem);
                return {
                    left: offsetLeft,
                    top: offsetTop
                };
            };

            var setPointFromEvent = function (point, e) {
                if (isTouch) {
                    point.x = e.changedTouches[0].pageX - getOffset(e.target).left;
                    point.y = e.changedTouches[0].pageY - getOffset(e.target).top;
                } else {
                    point.x = e.offsetX !== undefined ? e.offsetX : e.layerX;
                    point.y = e.offsetY !== undefined ? e.offsetY : e.layerY;
                }
            };


            var paint = function (e) {
                if (e && !(e instanceof Array)) {
                    e.preventDefault();
                    setPointFromEvent(point, e);
                }
                if (e && e instanceof Array)
                    ppts = e;
                // Saving all the points in an array
                if (!(e instanceof Array)) {
                    ppts.push({
                        x: point.x,
                        y: point.y
                    });
                }
                if (ppts.length === 3) {
                    var b = ppts[0];
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
                    ctx.fill();
                    ctx.closePath();
                    return;
                }

                // Tmp canvas is always cleared up before drawing.


                ctx.beginPath();
                ctx.moveTo(ppts[0].x, ppts[0].y);

                for (var i = 1; i < ppts.length - 2; i++) {
                    var c = (ppts[i].x + ppts[i + 1].x) / 2;
                    var d = (ppts[i].y + ppts[i + 1].y) / 2;
                    ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
                }

                // For the last 2 points
                ctx.quadraticCurveTo(
                    ppts[i].x,
                    ppts[i].y,
                    ppts[i + 1].x,
                    ppts[i + 1].y
                );
                ctx.stroke();
            };

            var copyTmpImage = function () {
                var strokeUUID = uuid4.generate();
                scope.eventDelegate.trigger("paintEnd", {pts: ppts, uuid: strokeUUID});
                if (options.undo) {
                    scope.$apply(function () {
                        undoCacheWithId.push({
                            imgData: ppts,
                            strokeUUID: strokeUUID
                        });
                    });
                }
                canvas.removeEventListener(PAINT_MOVE, paint, false);
                // ctx.drawImage(canvas, 0, 0);
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                ppts = [];
            };

            var startTmpImage = function (e) {
                e.preventDefault();
                scope.eventDelegate.trigger("paintStart");
                canvas.addEventListener(PAINT_MOVE, paint, false);

                setPointFromEvent(point, e);
                ppts.push({
                    x: point.x,
                    y: point.y
                });
                ppts.push({
                    x: point.x,
                    y: point.y
                });
                paint();
            };

            var initListeners = function () {
                canvas.addEventListener(PAINT_START, startTmpImage, false);
                canvas.addEventListener(PAINT_END, copyTmpImage, false);

                if (!isTouch) {
                    var MOUSE_DOWN;

                    document.body.addEventListener('mousedown', mousedown);
                    document.body.addEventListener('mouseup', mouseup);

                    scope.$on('$destroy', removeEventListeners);

                    canvas.addEventListener('mouseenter', mouseenter);
                    canvas.addEventListener('mouseleave', mouseleave);
                }

                function mousedown() {
                    MOUSE_DOWN = true;
                }

                function mouseup() {
                    MOUSE_DOWN = false;
                }

                function removeEventListeners() {
                    document.body.removeEventListener('mousedown', mousedown);
                    document.body.removeEventListener('mouseup', mouseup);
                }

                function mouseenter(e) {
                    // If the mouse is down when it enters the canvas, start a path
                    if (MOUSE_DOWN) {
                        startTmpImage(e);
                    }
                }

                function mouseleave(e) {
                    // If the mouse is down when it leaves the canvas, end the path
                    if (MOUSE_DOWN) {
                        copyTmpImage(e);
                    }
                }
            };

            var undo = function (version) {
                if (undoCacheWithId.length > 0) {
                    undoCacheWithId = undoCacheWithId.slice(0, version);
                    ctx.clearRect(0, 0, options.width, options.height);
                    undoCacheWithId.forEach(function (item) {
                        paint(item.imgData);
                    });
                    ppts = [];
                }
            };

            scope.eventDelegate.on("undoCacheById", function (ev, res) {
                var next = [];
                undoCacheWithId.forEach(function (item) {
                    if ([].slice.call(res.deletedIdList).indexOf(item.strokeUUID) == -1) {
                        next.push(item);
                        scope.version = next.length;
                    }
                });
                undoCacheWithId = next;
                ctx.clearRect(0, 0, options.width, options.height);
                undoCacheWithId.forEach(function (item) {
                    paint(item.imgData);
                });
                ppts = [];
            });

            initListeners();
        }
    };
}]);

export default  canvasPainter;



