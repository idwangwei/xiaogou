/**
 * Created by LuoWen on 2017/3/4.
 */

import {CONST} from './PictureDrawingConfig'

var correct5 = require('../images/icon_yes3.png');
var correct4 = require('../images/icon_yes2.png');
var correct3 = require('../images/icon_no.png');

/**
 * Painter正确错误
 */
class PainterCorrectness {
    constructor() {
    }

    show(scope, correctnessStatus) {
        switch (correctnessStatus) {
            case 3: scope.correctnessSrc = correct3; break;
            case 4: scope.correctnessSrc = correct4; break;
            case 5: scope.correctnessSrc = correct5; break;
            default: scope.correctnessSrc = "";
        }
    }

    hide(scope) {
        scope.correctnessSrc = "";
    }

}

export default new PainterCorrectness()
