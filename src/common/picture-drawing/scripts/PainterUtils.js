/**
 * Created by LuoWen on 2017/3/1.
 */

import {CONST} from './PictureDrawingConfig'

/**
 * Painter工具
 */
class PainterUtils {
    constructor() {
    }

    getDomRect(dom) {
        if (dom instanceof jQuery) dom = dom[0];
        return dom.getBoundingClientRect();
    }

    getDomWidth(dom) {
        return this.getDomRect(dom).width;
    }

    getDomHeight(dom) {
        return this.getDomRect(dom).height;
    }

    /**
     * 加载图片到画布上
     * @param ctx
     * @param src
     * @param [scaleX]
     * @param [scaleY]
     */
    loadImg(ctx, src, [scaleX, scaleY]) {
        var image = new Image();
        image.onload = function () {
            ctx.save();
            if(scaleX && scaleY) {
                ctx.scale(scaleX, scaleY);
            }
            ctx.drawImage(this, 0, 0);
            ctx.restore();
        };
        image.crossOrigin = "anonymous";
        image.src = src;
    }

    /**
     * 调整画布大小
     * @param newValue
     * @param ctx
     * @param domRect
     * @param scale
     * @param scaleGlobal
     */
    resizeCanvas(newValue, ctx, domRect, scale, scaleGlobal) {
        ctx.save();
        let canvas = ctx.canvas;
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        //新的大小
        canvas.width = domRect.width / scaleGlobal;
        canvas.height = newValue * scaleGlobal * scale;

        let newCanvas = $("<canvas>")
            .attr("width", imageData.width)
            .attr("height", imageData.height)[0];
        newCanvas.getContext("2d").putImageData(imageData, 0, 0);


        ctx.scale(scale, scale);
        ctx.drawImage(newCanvas, 0, 0);

        ctx.restore();
        // ctx.scale(1/scale, 1/scale); //restore scale
    }

    // moveCursor(elm, {pageX:left, pageY:top}, scale) {
    //     // console.log(
    //     //     "clientX", e.clientX,
    //     //     "Y", e.clientY,
    //     //     "pageX", e.pageX,
    //     //     "Y", e.pageY,
    //     //     "screenX", e.screenX,
    //     //     "Y", e.screenY,
    //     //     "top", this.getOffset(elm.parent()[0]).top,
    //     //     "left", this.getOffset(elm.parent()[0]).left,
    //     // );
    //
    //     let offset = this.getDomOffset(elm.parent()[0]);
    //     top = (top - offset.top + CONST.OFFSET_TOP) / scale;
    //     left = (left - offset.left + CONST.OFFSET_LEFT) / scale;
    //     elm.css({top, left});
    // }

    moveCursorClick(elm, {offsetX:left, offsetY:top}) {
        top += CONST.OFFSET_TOP;
        elm.css({top, left});
    }

    /**
     * 
     * @param elm
     * @param point
     * @param scale
     * @param scaleGlobal
     */
    moveCursorTouch(elm, point, scale, scaleGlobal) {
        let top = point.y * scale / scaleGlobal + CONST.TINY_MOVE_OFFSET_TOP;
        let left = point.x * scale / scaleGlobal;
        elm.css({top, left});

        // console.log(
        //     "s", scale,
        //     "sg", scaleGlobal,
        //     "point", point.x, point.y,
        //     "l,t", left, top
        // )
    }

    getDomOffset(elem) {
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
    }

    /**
     * 展示答案
     * @param answer
     * @returns {*}
     */
    handleInRetrieveAns(answer) {
        try {
            // let answer = JSON.parse(ans);
            let coordsUsr = answer.coordsUsr;
            let imgData = new ImageData(coordsUsr.w, coordsUsr.h);
            let coords = coordsUsr.p;

            const BYTE_W = 4;
            const W = coordsUsr.w * BYTE_W;

            coords.forEach((c)=> {
                let idx = c[0] * W + c[1] * BYTE_W;
                imgData.data[idx + 3] = 150; //[0,0,0,255]
            });

            // return {
            //     name: CONST.RETRIEVE_ANS,
            //     data: imgData
            // };
            return imgData;
        } catch (e) {
            return null;
        }
    };

    /**
     * 模拟触摸
     * @param el
     * @param type
     */
    createTouchEventAndDispatch(el, type) {
        //var type = 'move'; // or start, end
        var event = document.createEvent('Event');
        event.initEvent('touch' + type, true, true);
        // event.constructor.name; // Event (not TouchEvent)

        var point = {x: 10, y: 10};
        event.touches = [{
            identifier: Date.now(),
            target: el,
            pageX: point.x,
            pageY: point.y,
            screenX: point.x,
            screenY: point.y,
            clientX: point.x,
            clientY: point.y
        }];

        el.dispatchEvent(event);
    }

    /**
     * 调整背景网格大小
     */
    // resizeBgGrid(scale, scaleGlobal) {
    //
    //     elm = $('.pwContainer').eq(0)
    //     ctrl = angular.element(elm).scope().ctrl
    //     service = ctrl.pictureDrawingService
    //     worker = service.pdWorker
    //     worker.postMessage({options:{taskId: Date.now(), uuid: ctrl.uuid}, taskName:'extractCoords', args: [ctrl.getImageData('canvas#ans')]})
    // }

}

export default new PainterUtils()
