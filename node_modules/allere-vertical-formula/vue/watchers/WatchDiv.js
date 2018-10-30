/**
 * Created by LuoWen on 2016/11/28.
 */
import CONST from '../../vfconst'
import * as EVENT_TYPES from '../event/EventTypes'

let watchDiv = (ctrl, vfCell, key, val = true) => {

    refreshDiv(ctrl, vfCell, key, val);

    if (vfCell.hasStyleDiv) {
        let prev = ctrl.prevEle(vfCell);
        let next = ctrl.nextEle(vfCell);

        if (!ctrl.isRowEleEnd(vfCell)) next.hasStyleDivLine = true;
        ctrl.$set(vfCell, 'hasStyleDivLine', false);
        if (!ctrl.isRowEleFirst(vfCell)) prev.hasStyleDivLine = false;
    }

};

let refreshDiv = (ctrl, vfCell, key, val) => {

    //输入 \\vfDiv 时, 需要在那一行中找到第一个元素,并开始添加除号
    //
    // if(key === CONST.VUE_KEY_VAUE) {
    //
    // }

    // window.DEBUG && console.log("watch div...");

    // if (ctrl.hasMarkDiv(vfCell)) {
    //     return;
    // }

    let _rowEleNow, _rowElePrev,
        _first, _last,
        _firstPrev, _lastPrev = -1,
        first, last;

    _rowEleNow = vfCell;

    // first
    _first = ctrl.getRowFirstDivIndex(_rowEleNow);
    if (!ctrl.isIndexExist(_first)) {
        _first = ctrl.getRowFirstValueIndex(_rowEleNow) - 1;
    }
    if (!ctrl.isIndexExist(_first)) {
        // Empty Row
        _last = _rowEleNow.c;
        _first = _last - 1;

    } else {
        _last = ctrl.getRowLastValueIndex(_rowEleNow);

        // last
        if (ctrl.isRowFirst(_rowEleNow)) {
            _lastPrev = _last - 1;
        } else {
            _rowElePrev = ctrl.rowElePrev(_rowEleNow);
            _lastPrev = ctrl.getRowLastValueIndex(_rowElePrev);
        }
    }

    // merge
    first = _first;
    last = _last > _lastPrev ? _last : _lastPrev;
    last = last > first ? last : first + 1;

    //refresh a row
    let has = 0;
    let _row = ctrl.rowNow(vfCell);
    for (let r = 0; r < _row.length; r++) {
        //make a line
        if (r === first) {
            ctrl.$set(_row[r], CONST.VUE_KEY_HAS_STYLE_DIV, val);
            has = val ? 1 : 0;
        } else if (r > first && r <= last) {
            ctrl.$set(_row[r], CONST.VUE_KEY_HAS_STYLE_DIV_LINE, val);
            has = val ? 1 : 0;
        } else {
            ctrl.$set(_row[r], CONST.VUE_KEY_HAS_STYLE_DIV, false);
            ctrl.$set(_row[r], CONST.VUE_KEY_HAS_STYLE_DIV_LINE, false);
        }
    }

    hasMarkDiv(ctrl, vfCell, has);
};

let cleanDivAndLines = (ctrl, vfCell) => {
    //refresh a row
    let _row = ctrl.rowNow(vfCell);
    for (let r = 0; r < _row.length; r++) {
        ctrl.$set(_row[r], CONST.VUE_KEY_HAS_STYLE_DIV, false);
        ctrl.$set(_row[r], CONST.VUE_KEY_HAS_STYLE_DIV_LINE, false);
    }

    hasMarkDiv(ctrl, vfCell, 0);
};

let hasMarkDiv = (ctrl, vfCell, has) => {
    ctrl.rowEleFirst(vfCell)[CONST.VUE_KEY_HAS_MARK_DIV] = has;
};

/**
 * 添加除号后, 光标的设置
 * @param ctrl
 * @param vfCell
 * @param key
 * @param val
 * @param target
 */
let watchDivCursor = (ctrl, vfCell, key, val, target) => {
    //添加 除号时, 如果此行为空,则不移动光标
    if(val && !ctrl.isRowEmptyValue(vfCell)) {
        let c = ctrl.getRowFirstDivIndex(vfCell);
        vfCell = ctrl.getVfCell({c, r: vfCell.r});
    }
    ctrl.eventHub.$emit(EVENT_TYPES.APPEND_CURSOR, ctrl, {target, vfCell})
};

/**
 * 设置除号之前
 * @param ctrl
 * @param vfCell
 * @param key
 * @param val
 * @param target
 */
let beforeAddDiv = (ctrl, vfCell, key, val = true, target, {stop}) => {
    // stop({cursorEmit : false});
    // if() {
    //
    // }
};

let syncMathSymbolType = ()=> {

}

export {
    beforeAddDiv,
    watchDiv,
    watchDivCursor,
    cleanDivAndLines,
};

