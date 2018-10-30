/**
 * Created by LuoWen on 2016/11/28.
 */
import CONST from '../../vfconst'
import * as EVENT_TYPES from '../event/EventTypes'

export let watchLine = (ctrl, vfCell, key, val = 1) => {

    //使用键盘删除格子时,自动刷新一行的横线
    let modeAutoRefreshLine = (val === 2);

    let _first, _last,
        _firstNext, _lastNext, _rowEleNext,
        first, last;

    //get first & last value
    _first = ctrl.getRowFirstValueIndex(vfCell);
    _last = ctrl.getRowLastValueIndex(vfCell);

    if(!ctrl.isIndexExist(_last)) {
        first = 1;
        last = 0;

    } else {

        if(ctrl.isRowEnd(vfCell)){//末行忽略
            _firstNext = _first + 1;
            _lastNext = _last - 1;
        } else {
            _rowEleNext = ctrl.rowEleNext(vfCell);
            _firstNext = ctrl.getRowFirstValueIndex(_rowEleNext);
            if(!ctrl.isIndexExist(_firstNext)) _firstNext = _first + 1;
            _lastNext = ctrl.getRowLastValueIndex(_rowEleNext);
        }

        //compare
        first = _first > _firstNext ? _firstNext : _first;
        last = _last > _lastNext ? _last : _lastNext;
    }

    //refresh a row
    let hasMarkLine = 0;
    let _row = ctrl.rowNow(vfCell);
    for (let r = 0; r < _row.length; r++) {
        //make a line
        ctrl.$set(_row[r],
            CONST.VUE_KEY_HAS_STYLE_LINE,
            (r < first || r > last) ? 0 : hasMarkLine = val);
    }

    ctrl.rowEleFirst(vfCell)[CONST.VUE_KEY_HAS_MARK_LINE] = hasMarkLine;

    if(val //val -> true 仅用于添加横线时调用
        && !modeAutoRefreshLine //排除键盘删除时的自动刷新
        && !hasMarkLine //如果当前行没有添加成功,则找上一行
        && !ctrl.isRowFirst(vfCell)) { //找到首行时停止
        let rowElePrev = ctrl.rowElePrev(vfCell);
        if(!ctrl.isRowEmptyValue(rowElePrev)) { //上行必须要能够添加横线
            ctrl.eventHub.$emit(EVENT_TYPES.WATCH_LINE, ctrl, rowElePrev, key, val)
        }
    }
};

export let cleanLines = (ctrl, vfCell) => {

    //refresh a row
    let hasMarkLine = 0;
    let _row = ctrl.rowNow(vfCell);
    for (let r = 0; r < _row.length; r++) {
        ctrl.$set(_row[r], CONST.VUE_KEY_HAS_MARK_LINE, hasMarkLine);
    }

    ctrl.rowEleFirst(vfCell)[CONST.VUE_KEY_HAS_MARK_LINE] = hasMarkLine;
};
