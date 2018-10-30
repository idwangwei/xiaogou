/**
 * Created by LuoWen on 2016/11/21.
 */

import BaseCtrl from './BaseCtrl'
import CONST from '../../vfconst'
// import eventHub from '../event/EventHub'
import * as events from '../event/EventTypes'

export default class VerticalCtrlTools extends BaseCtrl {
    constructor(ctx) {
        super(ctx);
    }

    initData() {
        super.initData();
    }

    needParam() {
        return this.errMsg('need a param');
    }

    errMsg(msg) {
        throw new Error(msg || "error...");
    }

    hasCVal({val}) {
        return !!val;
    }

    // nowEleR() {
    //     return this.vfCellR;
    // }

    nextEle({r, c}) {
        return this.vam[r][c + 1];
    }

    prevEle({r, c}) {
        return this.vam[r][c - 1];
    }

    isRowEleFirst({c}) {
        return c === 0;
    }

    isRowEleEnd({r, c}) {
        return this.vam[r].length - 1 === c;
    }

    rowEleFirst({r}) {
        return this.vam[r][0];
    }

    rowEleEnd({r}) {
        let eleR = this.vam[r];
        return eleR[eleR.length - 1];
    }

    isRowFirst({r}) {
        return r === 0;
    }

    isRowEnd({r}) {
        return this.vam.length - 1 === r;
    }

    rowElePrev({r, c}) {
        return this.rowPrev({r})[c];
    }

    rowEleNext({r, c}) {
        return this.rowNext({r})[c];
    }

    rowPrev({r}) {
        return this.vam[r - 1];
    }

    rowNext({r}) {
        return this.vam[r + 1];
    }

    rowNow({r}) {
        return this.vam[r];
    }

    hasMarkLine(ele) {
        // return !!this.rowNow(ele)
        //     .find((cell)=>cell.line);
        return this.rowEleFirst(ele)[CONST.VUE_KEY_HAS_MARK_LINE];
    }

    hasMarkDiv(ele) {
        return !!this.rowNow(ele)
            .find(cell => cell.hasStyleDiv);
        // return this.rowEleFirst(ele)[CONST.VUE_KEY_HAS_MARK_DIV];
    }

    /**
     * 添加光标
     * @param target
     * @param vfCell
     */
    appendCursor(target, vfCell) {

        if(!this.canAppendCursor(vfCell)) return;

        // window.DEBUG && console.log("append cursor..");
        target = target && angular.element(target);

        let ctrl = this;
        let sc = ctrl.getScope();
        sc.$root.$broadcast(CONST.EVENT_KEYBOARD_SHOW, {
            isShowVertical: true,
            ele: target,
            cell: {
                dot: vfCell.dot,
                borrow: vfCell.borrow,
                carry: vfCell.carry,
                carry2: vfCell.carry2,
            },
            curCur: {r:vfCell.r, c:vfCell.c},
            fromElementVfCell: ctrl.eventHub,
            // cell: ctrl.getCell(target),
            hasMarkLine: ctrl.hasMarkLine(vfCell),
            hasMarkDiv: ctrl.hasMarkDiv(vfCell),
            showCarry: false,
        });

        // window.setTimeout(()=>{
            ctrl.eventHub.$emit(events.APPEND_CURSOR_EL, ctrl, vfCell);
        // }, 100)
    }

    canAppendCursor(vfCell) {
        return this.isStateAllowed() &&
            (this.getStyleContainerEditableColor() || vfCell.hasStyleEditableColor);
    }

    getRowFirstValueIndex(vfCell) {
        let row = this.rowNow(vfCell);
        for (let r = 0; r < row.length - 1; r++) {
            if (this.hasCVal(row[r])) return r;
        }
        return -1;

        // return this.rowNow(vfCell)
        //     .find(this.hasCVal);
    }

    getRowLastValueIndex(vfCell) {
        //不用 reverse, 是为了避免操作数组时引起vue额外的开销
        let row = this.rowNow(vfCell);
        for (let r = row.length - 1; r >= 0; r--) {
            if (this.hasCVal(row[r])) return r;
        }
        return -1;
    }

    getRowFirstDivIndex(vfCell) {
        let row = this.rowNow(vfCell);
        for (let r = 0; r < row.length - 1; r++) {
            if (row[r][CONST.VUE_KEY_HAS_STYLE_DIV]) return r;
        }
        return -1;
    }

    isIndexExist(index) {
        return index >= 0;
    }

    isRowEmptyValue(vfCell) {
        return !this.isIndexExist(this.getRowFirstValueIndex(vfCell));
    }

    getVfCellFromEle(ele) {
        let r = ele.attr('r');
        let c = ele.attr('c');
        return this.getVfCell({r, c});
    }

    // getVfCellRFromCoord(r, c) {
    //     return this.vam[r][c];
    // }

    getCleanVm(obj) {
        return Object.assign({}, obj);
    }
}
