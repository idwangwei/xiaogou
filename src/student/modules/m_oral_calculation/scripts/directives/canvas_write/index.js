/**
 * Created by WL on 2017/9/6.
 */
import './style.less'

let canvasInputDirective = ['$compile', '$timeout', 'uuid4', 'canvasInputDelegate', ($compile, $timeout, uuid4, canvasInputDelegate) => {
    return {
        restrict: 'AE',
        scope: {
            handle: "@",
            height: '='
        },
        template: `<div class="pwCanvasPaint" style="position:relative;height: 100%;width: 100%"></div>`,
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
            this.eraserStatus = 0;
            this.paint_end_callback = null;
            this.container_element = null;
            this.canvas_element = document.createElement('canvas');
            this.canvas_temp_element = document.createElement('canvas');
            this.encodeStrokeInformation = function (strokeImage, boundary, uuid) {
                let encodedImage = "";
                let binaryExp = "";
                let temp = "0000";
                // console.log(strokeImage)
                for (let i = 0; i < strokeImage.width * strokeImage.height * 4; i += 4) {
                    // console.log(i);
                    if (strokeImage.data[i + 3] > 0) binaryExp += "0";
                    else binaryExp += "1";
                    // console.log(binaryExp);
                    // console.log(encodedImage.length);
                    if (binaryExp.length === 4) {
                        encodedImage += parseInt(binaryExp, 2).toString(16);
                        binaryExp = "";
                    }
                }
                if (binaryExp.length) {
                    binaryExp = binaryExp + temp.substr(0, 4 - binaryExp.length);
                    encodedImage += parseInt(binaryExp, 2).toString(16);
                }
                return {
                    image: encodedImage,
                    width: strokeImage.width,
                    height: strokeImage.height,
                    boundary: boundary,
                    uuid: uuid
                }
            };
            this.set_paint_start_listener = (callBack) => this.paint_start_callback = callBack;
            this.set_paint_end_listener = (callback) => this.paint_end_callback = callback;
            this.init_canvas = (width, height, question_count) => {
                this.canvas_element.width = this.canvas_temp_element.width = width;
                this.canvas_element.height = this.canvas_temp_element.height = height;
                this.question_count = question_count;
                this.container_element.find('div').append(this.canvas_element);
                this.container_element.find('div').append(this.canvas_temp_element);
                this.setWritePathStyle();
            };
            this.clearCanvas = function () {
                let ctx = this.canvas_element.getContext('2d');
                let ctxTmp = this.canvas_temp_element.getContext('2d');
                ctxTmp.clearRect(0, 0, this.canvas_temp_element.width, this.canvas_temp_element.height);
                ctx.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
            };
            this.deleteStroke = function (strokeIdList) {
                let nextStrokeList = [];
                let imageList = [];
                let ctx = this.canvas_element.getContext('2d');
                strokeIdList.forEach(strokeUUID => {
                    $scope.strokeList.forEach(stroke => {
                        if (strokeUUID !== stroke.strokeUuid) {
                            nextStrokeList.push(stroke);
                        }
                    });
                    $scope.showStrokeList.forEach(stroke => {
                        if (strokeUUID !== stroke.strokeUuid) {
                            imageList.push(stroke);
                        }
                    });
                });
                this.clearCanvas();
                $scope.strokeList = nextStrokeList;
                $scope.showStrokeList = imageList;
                imageList.forEach(stroke => {
                    ctx.putImageData(stroke.showData, stroke.boundary.left, stroke.boundary.top);
                });
            };

            this.setEraserPathStyle = function () {
                this.eraserStatus = 1;
                let ctxTmp = this.canvas_temp_element.getContext('2d');
                ctxTmp.lineWidth = 5;
                ctxTmp.strokeStyle = '#cf5470';
            };
            this.setWritePathStyle = function () {
                this.eraserStatus = 0;
                let ctxTmp = this.canvas_temp_element.getContext('2d');
                ctxTmp.lineWidth = 3;
                ctxTmp.strokeStyle = '#000';
                ctxTmp.stroke();
            };

            canvasInputDelegate.add_instance(this, $scope.handle);
        }],
        link: function postLink(scope, elm, attr, ctrl) {
            scope.strokeList = scope.strokeList || [];
            scope.showStrokeList = [];
            ctrl.container_element = elm;
            let canvas = ctrl.canvas_element;
            let canvasTmp = ctrl.canvas_temp_element;
            let genUUID = uuid4.generate;
            let isTouch = !!('ontouchstart' in window);
            let PAINT_START = isTouch ? 'touchstart' : 'mousedown';
            let PAINT_MOVE = isTouch ? 'touchmove' : 'mousemove';
            let PAINT_END = isTouch ? 'touchend' : 'mouseup';

            let options = scope.options = {};
            options.canvasId = options.customCanvasId || 'pwCanvasMain';
            options.tmpCanvasId = options.customCanvasId ? (options.canvasId + 'Tmp') : 'pwCanvasTmp';
            options.width = options.width || window.innerWidth;
            options.height = options.height || scope.height;
            options.backgroundColor = options.backgroundColor || 'transparent';
            options.color = options.color || '#000';
            options.opacity = options.opacity || 1;
            options.lineWidth = 5;
            options.imageSrc = options.imageSrc || false;
            // background image
            if (options.imageSrc) {
                let image = new Image();
                image.onload = function () {
                    ctx.drawImage(this, 0, 0);
                };
                image.src = options.imageSrc;
            }

            //create canvas and context
            canvas.id = options.canvasId;
            canvasTmp.id = options.tmpCanvasId;
            angular.element(canvasTmp).css({
                position: 'absolute',
                top: 0,
                left: 0,
            });
            // elm.find('div').append(canvas);
            // elm.find('div').append(canvasTmp);
            let ctx = canvas.getContext('2d');
            let ctxTmp = canvasTmp.getContext('2d');
            //inti letiables
            let point = {
                x: 0,
                y: 0
            };
            let ppts = [];
            let boundary = {
                left: 100000,
                top: 100000,
                right: 0,
                bottom: 0
            };
            let strokeUuid = "";
            let pushPtx = function (x, y) {
                ppts.push({x: x, y: y});
                boundary.left = Math.floor(Math.min(boundary.left, x));
                boundary.top = Math.floor(Math.min(boundary.top, y));
                boundary.right = Math.ceil(Math.max(boundary.right, x));
                boundary.bottom = Math.ceil(Math.max(boundary.bottom, y));
            };

            let resetPtX = function () {
                let temp = 2;
                boundary.left -= temp;
                boundary.top -= temp;
                boundary.right += temp;
                boundary.bottom += temp;
            };

            let clearPtx = function () {
                ppts = [];
                boundary = {
                    left: 100000,
                    top: 100000,
                    right: 0,
                    bottom: 0
                };
                strokeUuid = "";
            };

            //set canvas size
            canvas.width = canvasTmp.width = options.width;
            canvas.height = canvasTmp.height = options.height;

            //set context style
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctxTmp.globalAlpha = options.opacity;
            ctxTmp.lineJoin = ctxTmp.lineCap = 'round';
            ctxTmp.lineWidth = 5;
            ctxTmp.strokeStyle = options.color;
            ctx.lineJoin = ctxTmp.lineCap = 'round';
            ctx.strokeStyle = options.color;
            //Watch options
            scope.$watch('options.lineWidth', function (newValue) {
                if (typeof newValue === 'string') {
                    newValue = parseInt(newValue, 10);
                }
                if (newValue && typeof newValue === 'number') {
                    ctxTmp.lineWidth = options.lineWidth = newValue;
                    ctx.lineWidth = ctxTmp.lineWidth;
                }
            });

            scope.$watch('options.color', function (newValue) {
                if (newValue) {
                    //ctx.fillStyle = newValue;
                    ctxTmp.strokeStyle = ctxTmp.fillStyle = newValue;
                    ctx.strokeStyle = ctxTmp.strokeStyle;
                }
            });

            scope.$watch('options.opacity', function (newValue) {
                if (newValue) {
                    ctxTmp.globalAlpha = newValue;
                    ctx.globalAlpha = ctxTmp.globalAlpha;
                }
            });

            let getOffset = function (elem) {
                let bbox = elem.getBoundingClientRect();
                return {
                    left: bbox.left,
                    top: bbox.top
                };
            };

            let setPointFromEvent = function (point, e) {
                let paintOffset = {
                    x: -12,
                    y: -14
                };
                if (isTouch) {
                    point.x = e.changedTouches[0].pageX - getOffset(e.target).left;
                    point.y = e.changedTouches[0].pageY - getOffset(e.target).top;
                } else {
                    point.x = e.offsetX !== undefined ? e.offsetX : e.layerX;
                    point.y = e.offsetY !== undefined ? e.offsetY : e.layerY;
                }
                point.x += paintOffset.x;
                point.y += paintOffset.y;
            };

            let paint = function (e) {
                if (e) {
                    e.preventDefault();
                    setPointFromEvent(point, e);
                }

                // Saving all the points in an array
                // ppts.push({
                //     x: point.x,
                //     y: point.y
                // });
                pushPtx(point.x, point.y);

                if (ppts.length === 3) {
                    let b = ppts[0];
                    ctxTmp.beginPath();
                    ctxTmp.arc(b.x, b.y, ctxTmp.lineWidth, 0, Math.PI * 2, !0);
                    ctxTmp.fill();
                    ctxTmp.closePath();
                    return;
                }

                // Tmp canvas is always cleared up before drawing.
                ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);

                ctxTmp.beginPath();
                ctxTmp.moveTo(ppts[0].x, ppts[0].y);
                let i = 1;
                for (; i < ppts.length - 2; i++) {
                    let c = (ppts[i].x + ppts[i + 1].x) / 2;
                    let d = (ppts[i].y + ppts[i + 1].y) / 2;
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

            let checkPointStroke = function () {
                let w = boundary.right - boundary.left;
                let h = boundary.bottom - boundary.top;
                w = 5 - w;
                h = 5 - h;
                let count = Math.min(w, h);
                for (let i = 1; i < count + 1; i++) {
                    point.x = point.x + 1;
                    point.y = point.y + 1;
                    pushPtx(point.x, point.y);
                    paint();
                }
            };

            let copyTmpImage = function () {
                checkPointStroke();
                resetPtX();
                canvasTmp.removeEventListener(PAINT_MOVE, paint, false);
                ctx.drawImage(canvasTmp, 0, 0);
                let imageData = ctxTmp.getImageData(boundary.left, boundary.top, boundary.right - boundary.left, boundary.bottom - boundary.top);
                let data = {width: imageData.width, height: imageData.height, data: imageData.data};
                ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);
                let stroke = ctrl.encodeStrokeInformation(data, boundary, strokeUuid);
                scope.strokeList.push({imageData, boundary, strokeUuid});

                if (ctrl.eraserStatus == 0) {
                    let showData = ctx.getImageData(boundary.left, boundary.top, boundary.right - boundary.left, boundary.bottom - boundary.top);
                    scope.showStrokeList.push({showData, boundary, strokeUuid});
                }

                ctrl.paint_end_callback.call(this, stroke);
                clearPtx();
            };

            let startTmpImage = function (e) {
                e.preventDefault();
                canvasTmp.addEventListener(PAINT_MOVE, paint, false);
                strokeUuid = genUUID();
                setPointFromEvent(point, e);
                pushPtx(point.x, point.y);
                pushPtx(point.x + 1, point.y + 1);
                pushPtx(point.x - 1, point.y - 1);
                ctrl.paint_start_callback.call(this);
                paint();
            };

            let initListeners = function () {
                canvasTmp.addEventListener(PAINT_START, startTmpImage, false);
                canvasTmp.addEventListener(PAINT_END, copyTmpImage, false);
                let MOUSE_DOWN;
                if (!isTouch) {
                    document.body.addEventListener('mousedown', mousedown);
                    document.body.addEventListener('mouseup', mouseup);

                    scope.$on('$destroy', removeEventListeners);

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
            initListeners();
        },
    };
}];
let canvasInputDelegate = [function () {
    this._instances = {};
    this.add_instance = (instance, handle) => {
        this._instances[handle] = instance;
    };
    this.get_by_handle = (handle) => {
        return this._instances[handle];
    }
}];
export {canvasInputDirective, canvasInputDelegate}