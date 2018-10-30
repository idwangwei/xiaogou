/**
 * Created by LuoWen on 2017/2/28.
 */

import {CONST} from './PictureDrawingConfig'
/**
 * 鼠标按住的前两秒，需要选定位置
 */
class PainterHoldingCursor {
    constructor() {
        this.holdingStart = null;
    }

    now() {
        if(Date.now) return Date.now();
        return new Date().getTime();
    }

    start(holding, $timeout) {
        this.holdingStart = this.now();
        this.show(holding.progress, $timeout, CONST.DURATION);
        CONST.DURATION && this.show(holding.pencil);
    }

    end(holding) {
        this.holdingStart = 0;
        this.hide(holding.progress);
        this.hide(holding.pencil);
    }

    isStart() {
        return !!this.holdingStart;
    }

    enough(holding) {
        let isEnough = this.now() - this.holdingStart >= CONST.DURATION;
        // console.log("isEnough", isEnough);

        if(isEnough) {
            this.hide(holding.progress);
            CONST.DURATION && this.show(holding.pencil);
        }
        return isEnough;
    }

    isVisible(elm) {
        return elm.is(':visible');
    }

    show(elm, $timeout, duration) {
        if(!this.isVisible(elm)) {
            elm.show();
            if($timeout) {
                $timeout(()=> {
                    this.hide(elm)
                }, duration || CONST.DURATION)
            }
        }
    }

    hide(elm) {
        if(this.isVisible(elm))
            elm.hide();
    }
}

export default new PainterHoldingCursor()
