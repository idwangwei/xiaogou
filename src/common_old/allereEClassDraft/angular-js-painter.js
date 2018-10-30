/*!
 * angular-canvas-painter - v0.5.2
 *
 * Copyright (c) 2015, Philipp Wambach
 * Released under the MIT license.
 */
'use strict';

import canvasUrl from './templates/canvas.html'
var $=require('jquery');
var module = angular.module('draftPainter',[]);

module.directive('draft',function($templateCache){
    return {
            restrict: 'E',
//            template: canvasUrl,
            controller:['$scope','$window',function($scope,$window){
                $scope.options = {};
                $scope.headerHight = $('ion-view .bar-header').eq(0).css('height').match(/\d+/g);
//                $scope.footerHight = $('ion-view .bar-footer').eq(0).css('height').match(/\d+/g);
                $scope.screenWidth = $scope.$root.platform.IS_ANDROID ? $window.screen.availWidth : $window.innerWidth;
                $scope.screenHeight = $scope.$root.platform.IS_ANDROID ? $window.screen.availHeight : $window.innerHeight;


                $scope.options.width = $scope.screenWidth;
                $scope.options.height = $scope.screenHeight - $scope.headerHight;
                $scope.draftEle ={};


                $scope.$on('draft.hide',function(){
                    console.log('draft event hide');
                    $scope.backAll();
                    $scope.draftEle.css({display:'none'});
                });

                $scope.$on('draft.show',function(){
                    console.log('draft event show');
                    $scope.draftEle.css({display:'block'});
                });


            }],
            link: function postLink($scope, elm, attr) {
                if($("body").children('.draft_container').length !=0){
                   $('.draft_container').eq(0).remove();
                }

                var canvasHtml ='<div class="container draft_container" style="">'+
                    '<div class="pwCanvasPaint" style="position:fixed; left: 0; width: 100%"></div>'+
                '</div>';
                $("body").append(canvasHtml);

                var isTouch = !!('ontouchstart' in window);

                var PAINT_START = isTouch ? 'touchstart' : 'mousedown';
                var PAINT_MOVE = isTouch ? 'touchmove' : 'mousemove';
                var PAINT_END = isTouch ? 'touchend' : 'mouseup';

                //set default options
                $scope.version = 0;
                $scope.isShow = false;
                var options = $scope.options || {};
                options.canvasId = options.customCanvasId || 'pwCanvasMain';
                options.tmpCanvasId = options.customCanvasId ? (options.canvasId + 'Tmp') : 'pwCanvasTmp';
                options.width = options.width || 360;
                options.height = options.height || 300;
                options.backgroundColor = options.backgroundColor || '#fff';
                options.color = options.color || '#000';
                options.undoEnabled = options.undoEnabled || false;
                options.opacity = options.opacity || 1;
                options.lineWidth = options.lineWidth || 1;
                options.undo = options.undo || true;
                options.imageSrc = options.imageSrc || false;
                //undo
                if (options.undo) {
                    var undoCache = [];
                    $scope.$watch(function() {
                        return undoCache.length;
                    }, function(newVal) {
                        $scope.version = newVal;
                    });

                }

                //create canvas and context
                var canvas = document.createElement('canvas');
                canvas.id = options.canvasId;
                var canvasTmp = document.createElement('canvas');
                canvasTmp.id = options.tmpCanvasId;
                angular.element(canvasTmp).css({
                    position: 'absolute',
                    top: 0,
                    left: 0
                });
                $(".pwCanvasPaint").eq(0).append(canvas);
                $(".pwCanvasPaint").eq(0).append(canvasTmp);
                var ctx = canvas.getContext('2d');
                var ctxTmp = canvasTmp.getContext('2d');

                //inti variables
                var point = {
                    x: 0,
                    y: 0
                };
                var ppts = [];

                //set canvas size
                canvas.width = canvasTmp.width = options.width;
                canvas.height = canvasTmp.height = options.height;

                //set context style
                ctx.fillStyle = options.backgroundColor;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctxTmp.globalAlpha = options.opacity;
                ctxTmp.lineJoin = ctxTmp.lineCap = 'round';
                ctxTmp.lineWidth = 2;
                ctxTmp.strokeStyle = options.color;
                $scope.draftEle = $('.draft_container').eq(0);
                $scope.draftEle.css({
                    'z-index': 5,
                    'position': 'fixed',
                    'left': 0,
                    'top':$scope.headerHight+'px',
                    'display':'none'
                });



                var getOffset = function(elem) {
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

                var setPointFromEvent = function(point, e) {
                    if (isTouch) {
                        point.x = e.changedTouches[0].pageX - getOffset(e.target).left;
                        point.y = e.changedTouches[0].pageY - getOffset(e.target).top;
                    } else {
                        point.x = e.offsetX !== undefined ? e.offsetX : e.layerX;
                        point.y = e.offsetY !== undefined ? e.offsetY : e.layerY;
                    }
                };

                var paint = function(e) {
                    if (e) {
                        e.preventDefault();
                        setPointFromEvent(point, e);
                    }

                    // Saving all the points in an array
                    ppts.push({
                        x: point.x,
                        y: point.y
                    });

                    if (ppts.length === 3) {
                        var b = ppts[0];
                        ctxTmp.beginPath();
                        ctxTmp.arc(b.x, b.y, ctxTmp.lineWidth / 2, 0, Math.PI * 2, !0);
                        ctxTmp.fill();
                        ctxTmp.closePath();
                        return;
                    }

                    // Tmp canvas is always cleared up before drawing.
                    ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);

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

                var copyTmpImage = function() {
                    if (options.undo) {
                        $scope.$apply(function() {
                            undoCache.push(ctx.getImageData(0, 0, canvasTmp.width, canvasTmp.height));
                            if (angular.isNumber(options.undo) && options.undo > 0) {
                                undoCache = undoCache.slice(-1 * options.undo);
                            }
                        });
                    }
                    canvasTmp.removeEventListener(PAINT_MOVE, paint, false);
                    ctx.drawImage(canvasTmp, 0, 0);
                    ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);
                    ppts = [];
                };

                var startTmpImage = function(e) {
                    e.preventDefault();
                    canvasTmp.addEventListener(PAINT_MOVE, paint, false);

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

                var initListeners = function() {
                    canvasTmp.addEventListener(PAINT_START, startTmpImage, false);
                    canvasTmp.addEventListener(PAINT_END, copyTmpImage, false);

                    if (!isTouch) {
                        var MOUSE_DOWN;

                        document.body.addEventListener('mousedown', mousedown);
                        document.body.addEventListener('mouseup', mouseup);

                        $scope.$on('$destroy', removeEventListeners);

                        canvasTmp.addEventListener('mouseenter', mouseenter);
                        canvasTmp.addEventListener('mouseleave', mouseleave);
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

                var undo = function(version) {
                    if (undoCache.length > 0) {
                        ctx.putImageData(undoCache[version], 0, 0);
                        undoCache = undoCache.slice(0, version);
                    }
                };




                initListeners();
                $scope.backAll = function(){
                    $scope.version = 0;
                    if (undoCache.length > 0) {
                        ctx.putImageData(undoCache[$scope.version], 0, 0);
                        undoCache = undoCache.slice(0, $scope.version);
                    }

                };
                window.ctx = ctx;
                window.ctxTmp = ctxTmp;
                window.canvas = canvas;
                window.canvasTmp = canvasTmp;
                window.s1 = $scope;
                window.onorientationchange = function(){
                    $scope.backAll();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = canvasTmp.width = $scope.$root.platform.IS_ANDROID ? window.screen.availWidth : window.innerWidth;
                    canvas.height = canvasTmp.height = ($scope.$root.platform.IS_ANDROID ? window.screen.availHeight : window.innerHeight) - $scope.headerHight;
                    ctx.fillStyle = options.backgroundColor;
                    ctx.globalAlpha = 0.8;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }


            }
        };
    });
