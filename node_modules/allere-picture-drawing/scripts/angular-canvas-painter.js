/*!
 * angular-canvas-painter - v0.5.2
 *
 * Copyright (c) 2015, Philipp Wambach
 * Released under the MIT license.
 */
import holdingCursor from './PainterHoldingCursor'
import utils from './PainterUtils'
import {CONST, EVENTS} from './PictureDrawingConfig'
import correctness from './PainterCorrectness'

'use strict';
(function(window) {
angular.module('pw.canvas-painter', []);
(function(module) {
try {
  module = angular.module('pw.canvas-painter');
} catch (e) {
  module = angular.module('pw.canvas-painter', []);
}
// module.run(['$templateCache', function($templateCache) {
//   $templateCache.put('../templates/canvas.html',
//     '<div class="pwCanvasPaint" style="position:relative"></div>');
// }]);
})();

(function(module) {
try {
  module = angular.module('pw.canvas-painter');
} catch (e) {
  module = angular.module('pw.canvas-painter', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('../templates/color-selector.html',
    '<ul class="pwColorSelector"><li ng-repeat="color in colorList track by $index" class="pwColor" ng-class="{\'active\': (selectedColor === color)}" ng-style="{\'background-color\':color}" ng-click="setColor(color)"></li></ul>');
}]);
})();


// var pictureDrawingGridSvg = require('../templates/picture-drawing-grid.html');
var pencilImg = require('../images/pencil.png');

angular.module('pw.canvas-painter')
  .directive('pwCanvas', ['$timeout', '$window', function($timeout, $window) {
    return {
      restrict: 'AE',
      scope: {
        options: '=',
        version: '='
      },
      template: require('../templates/canvas.html'),
      link: function postLink(scope, elm) {

        scope.pencilImg = pencilImg;
        scope.holdingPosition = {};

        var holding = {
          container: elm.find("#holdingContainer"),
          pencil: elm.find("#holdingContainer > #pencil"),
          progress: elm.find("#holdingContainer > #progress")
        };

        // var isTouch = true;//!!('ontouchstart' in window);
        var isTouch = !!('ontouchstart' in $window);

        var scaleGlobal = 1;
        var scale = 1;

        var PAINT_START = isTouch ? 'touchstart' : 'mousedown';
        var PAINT_MOVE = isTouch ? 'touchmove' : 'mousemove';
        var PAINT_END = isTouch ? 'touchend' : 'mouseup';

        //set default options
        var options = scope.options;
        options.canvasId = options.customCanvasId || 'main';  //用户输入
        options.tmpCanvasId = options.customCanvasId ? (options.canvasId + 'Tmp') : 'tmp';
        options.imgCanvasId = options.customCanvasId ? (options.canvasId + 'Img') : 'img'; //背景
        options.ansCanvasId = options.customCanvasId ? (options.canvasId + 'Ans') : 'ans'; //答案
        options.width = options.width || CONST.DEFAULT_WIDTH;
        options.height = options.height || CONST.DEFAULT_HEIGHT;
        options.backgroundColor = options.backgroundColor; /* || '#fff'*/
        options.color = options.color || '#000';
        options.undoEnabled = options.undoEnabled || false;
        options.opacity = options.opacity || 0.9;
        options.lineWidth = options.lineWidth || 1;
        options.undo = options.undo || false;
        options.imageSrcBg = options.imageSrcBg || false;
        options.imageSrcAns = options.imageSrcAns || false;
        options.correctnessStatus = options.correctnessStatus || 0;
        try {
          options.bridge = JSON.parse(options.bridge || "{}");
        } catch (e) {
          options.bridge = {};
        }

        // background image
        if (options.imageSrcBg) {
          var image = new Image();
          image.onload = function() {
            ctxImg.drawImage(this, 0, 0);
          };
          image.crossOrigin = "anonymous";
          image.src = options.imageSrcBg;
        }

        // background image for Answer
        if (options.imageSrcAns) {
          var image = new Image();
          image.onload = function() {
            ctxAns.drawImage(this, 0, 0);
          };
          image.crossOrigin = "anonymous";
          image.src = options.imageSrcAns;
        }

        //undo
        if (options.undo) {
          var undoCache = [];
          scope.$watch(function() {
            return undoCache.length;
          }, function(newVal) {
            scope.version = newVal;
          });

          scope.$watch('version', function(newVal) {
            if (newVal < 0) {
              scope.version = 0;
              return;
            }
            if (newVal >= undoCache.length) {
              scope.version = undoCache.length;
              return;
            }
            undo(newVal);
          });
        }

        //create canvas and context
        var canvas = document.createElement('canvas'); //用户输入
        var canvasTmp = document.createElement('canvas'); //临时输入区
        var canvasImg = document.createElement('canvas'); //背景
        var canvasAns = document.createElement('canvas'); //答案
        canvas.id = options.canvasId;
        canvasTmp.id = options.tmpCanvasId;
        canvasImg.id = options.imgCanvasId;
        canvasAns.id = options.ansCanvasId;
        var cssOption = {position: 'absolute', top: 0, left: 0};
        var attrOption = {/*crossOrigin:"anonymous"*/};
        angular.element(canvas).attr(attrOption).css(cssOption);
        angular.element(canvasTmp).attr(attrOption).css(cssOption);
        angular.element(canvasAns).attr(attrOption).css(cssOption);
        angular.element(canvasImg).attr(attrOption);
        elm.parent().find('div.pwCanvasPaint')
            .prepend(canvasTmp) // 临时输入区域 layer 4
            .prepend(canvasAns) // 参考答案 layer 3
            .prepend(canvas) // 用户答案 layer 2
            .prepend(canvasImg); // 题目 layer 1
        var ctx = canvas.getContext('2d');
        var ctxTmp = canvasTmp.getContext('2d');
        var ctxImg = canvasImg.getContext('2d');
        var ctxAns = canvasAns.getContext('2d');

        //铅笔移至表层，不会被画线遮盖。
        var bgGrid = elm.find('#bgGrid');
        bgGrid.parent().prepend(bgGrid);

        //inti variables
        var point = {
          x: 0,
          y: 0
        };
        var ppts = [];

        //set canvas size
        canvas.width
            = canvasAns.width
            = canvasTmp.width
            = canvasImg.width
            = options.width;
        canvas.height
            = canvasAns.height
            = canvasTmp.height
            = canvasImg.height
            = options.height;

        //set context style
        if(options.backgroundColor) {
          ctx.fillStyle = options.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctxTmp.globalAlpha = options.opacity;
        ctxTmp.lineJoin = ctxTmp.lineCap = 'round';
        ctxTmp.lineWidth = 10;
        ctxTmp.strokeStyle = options.color;

        //交换数据
        scope.$on(EVENTS.GET_CANVAS_PROPS + options.uuid, function (evt, data) {
            if(!(data instanceof Array)) data = [data];
            let ret = {};
            data.forEach((prop)=> {
                if(prop === CONST.PROP_SCALE) ret.scale = scale;
                else if(prop === CONST.PROP_SCALE_GLOBAL) ret.scaleGlobal = scaleGlobal;
            });
            return scope.$emit(EVENTS.POST_CANVAS_PROPS + options.uuid, ret) ;
        });

        //Watch options
        scope.$watch('options.lineWidth', function(newValue) {
          if (typeof newValue === 'string') {
            newValue = parseInt(newValue, 10);
          }
          if (newValue && typeof newValue === 'number') {
            ctxTmp.lineWidth = options.lineWidth = newValue;
          }
        });

        scope.$watch('options.color', function(newValue) {
          if (newValue) {
            //ctx.fillStyle = newValue;
            ctxTmp.strokeStyle = ctxTmp.fillStyle = newValue;
          }
        });

        scope.$watch('options.opacity', function(newValue) {
          if (newValue) {
            ctxTmp.globalAlpha = newValue;
          }
        });

        scope.$watch('options.bridge', function(newValue) {
          if (newValue) {
              // let bridge = JSON.parse(newValue);
              let bridge = newValue;
              switch (bridge.name) {
                case CONST.RETRIEVE_ANS:
                    let imgDataUsr = utils.handleInRetrieveAns(bridge.data);
                  // let imgDataUsr = bridge.data;
                    ctx.putImageData(imgDataUsr,0,0);
                  break;
              }
          }
        });

        scope.$watch('options.correctnessStatus', function(newValue) {
          if (newValue) {
            correctness.show(scope, newValue);
          }
        });

        scope.$watch('options.globalScale', function(newValue) {
          if(newValue) {
            scaleGlobal = newValue;
            let origScale = 1 / newValue;
            scope.scaleStyle = {
              // "-webkit-transform": `scale(${origScale}, ${origScale})`,
              // "transform": `scale(${origScale}, ${origScale})`,
              // "-webkit-transform-origin": `0 0`,
            }
          }
        });

        scope.$watch('options.heightLoaded', function(newValue) {
          if(newValue) {
            options.heightLoaded = newValue;
          }
        });

        scope.$watch('options.height', function(newValue) {

            if (newValue) {
                if (!options.heightLoaded) { //如果设置了全局缩放，则先算出来
                    // scaleGlobal = utils.getDomWidth(ctx.canvas) / CONST.DEFAULT_WIDTH;
                } else {
                    resizeCanvas(newValue, ctx);
                    resizeCanvas(newValue, ctxImg);
                    resizeCanvas(newValue, ctxTmp);
                    resizeCanvas(newValue, ctxAns);

                    //获取 scale 条件下，真实的Dom宽度
                    scale = utils.getDomWidth(ctx.canvas) / CONST.DEFAULT_WIDTH;
                }
            }

          // if (newValue) {
          //   resizeCanvas(newValue, ctx);
          //   resizeCanvas(newValue, ctxImg);
          //   resizeCanvas(newValue, ctxTmp);
          //   resizeCanvas(newValue, ctxAns);
          //
          //   //获取 scale 条件下，真实的Dom宽度
          //   scale = ctx.canvas.getBoundingClientRect().width / ctx.canvas.width;
          // }
        });

        let resizeCanvas = (newValue, ctx)=> {
          var canvas = ctx.canvas;
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          canvas.height = options.height = newValue;
          ctx.putImageData(imgData, 0, 0);
        };

        let getPointFromEvent = function (e) {
          let point = {};
          let offset = utils.getDomOffset(e.target);
          point.x = (e.pageX - offset.left + CONST.OFFSET_LEFT * scaleGlobal) / scale;
          point.y = (e.pageY - offset.top + CONST.OFFSET_TOP * scaleGlobal) / scale;

          return point;
        };

        var setPointFromEvent = function(point, e) {
          let pt = getPointFromEvent(e);
          point.x = pt.x;
          point.y = pt.y;
          // if (isTouch) {
          //   point.x = (e.changedTouches[0].pageX - getOffset(e.target).left) / scale;
          //   point.y = (e.changedTouches[0].pageY - getOffset(e.target).top) / scale;
          // } else {
          //   let offset = utils.getDomOffset(e.target);
          //   point.x = (e.pageX - offset.left + CONST.OFFSET_LEFT * scaleGlobal) / scale;
          //   point.y = (e.pageY - offset.top + CONST.OFFSET_TOP * scaleGlobal) / scale;

            // point.x = e.offsetX !== undefined ? e.offsetX : e.layerX;
            // point.y = e.offsetY !== undefined ? e.offsetY : e.layerY;
          // }
        };


        var getEvent = (e, isTouch)=> {
            return isTouch
                ? e.changedTouches
                  ? e.changedTouches[0]
                  : e.touches[0]
                : e;
        };

        var paint = function(e) {
          if (e) {
            e.preventDefault();
            e = getEvent(e, isTouch);
            setPointFromEvent(point, e);
            isTouch
              ? utils.moveCursorTouch(holding.container, point, scale, scaleGlobal)
              : utils.moveCursorClick(holding.container, e);
          }
          if(!holdingCursor.enough(holding)) return;

          // Saving all the points in an array
          ppts.push({x: point.x,y: point.y});

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

          if (ppts.length >= 2) {
            // For the last 2 points
            if(ppts[i] && ppts[i + 1]) {
              ctxTmp.quadraticCurveTo(
                  ppts[i].x,
                  ppts[i].y,
                  ppts[i + 1].x,
                  ppts[i + 1].y
              );
            }
          }
          ctxTmp.stroke();
        };

        var copyTmpImage = function() {
          holdingCursor.end(holding);

          if (options.undo) {
            scope.$apply(function() {
              undoCache.push({path: ppts, imgData: ctx.getImageData(0, 0, canvasTmp.width, canvasTmp.height)});
              if (angular.isNumber(options.undo) && options.undo > 0) {
                undoCache = undoCache.slice(-1 * options.undo);
              }
            });
          }
          canvasTmp.removeEventListener(PAINT_MOVE, paint, false);
          ctx.drawImage(canvasTmp, 0, 0);
          ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);
          ppts = [];

          $timeout(()=>{
            if(scope.$parent && scope.$parent.ctrl) {
              scope.$parent.ctrl.similarity(undoCache);
            }
          }, 100)

        };

        var startTmpImage = function(e) {
          e.preventDefault();
          canvasTmp.addEventListener(PAINT_MOVE, paint, false);

          if(!holdingCursor.isStart() || isTouch) {
            // paint(e);
            correctness.hide(scope); //隐藏判断
            let pt = getPointFromEvent(getEvent(e, isTouch));
            utils.moveCursorTouch(holding.container, pt, scale, scaleGlobal);
            holdingCursor.start(holding, $timeout);
          }

          // setPointFromEvent(point, e);
          // ppts.push({
          //   x: point.x,
          //   y: point.y
          // });
          // ppts.push({
          //   x: point.x,
          //   y: point.y
          // });
          //
          // paint();
        };

        var initListeners = function() {
          canvasTmp.addEventListener(PAINT_START, startTmpImage, false);
          canvasTmp.addEventListener(PAINT_END, copyTmpImage, false);

          if (!isTouch) {
            var MOUSE_DOWN;

            document.body.addEventListener('mousedown', mousedown);
            document.body.addEventListener('mouseup', mouseup);

            scope.$on('$destroy', removeEventListeners);

            canvasTmp.addEventListener('mouseenter', mouseenter);
            canvasTmp.addEventListener('mouseleave', mouseleave);
          }

          function mousedown(e) {
            MOUSE_DOWN = true;
            correctness.hide(scope); //隐藏判断
            utils.moveCursorClick(holding.container, e);
            holdingCursor.start(holding, $timeout);
          }

          function mouseup() {
            MOUSE_DOWN = false;
            holdingCursor.end(holding);
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
            ctx.putImageData(undoCache[version].imgData, 0, 0);
            undoCache = undoCache.slice(0, version);
          }
        };

        initListeners();
      }
    };
  }]);



angular.module('pw.canvas-painter')
  .directive('pwColorSelector', function () {
    return {
      restrict: 'AE',
      scope: {
        colorList: '=pwColorSelector',
        selectedColor: '=color'
      },
      templateUrl: '../templates/color-selector.html',
      link: function(scope){
        scope.setColor = function(col){
          scope.selectedColor = col;
        };
      }
    };
  });

}(this));