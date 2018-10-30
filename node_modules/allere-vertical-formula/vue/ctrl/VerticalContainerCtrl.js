/**
 * Created by LuoWen on 2016/11/21.
 */

import VerticalCtrlTools from './VerticalCtrlTools'
import CONST from '../../vfconst'
// import eventHub from '../event/EventHub'
import * as events from '../event/EventTypes'
import DeferQ from '../tools/DeferQ'

export default class VerticalContainerCtrl extends VerticalCtrlTools {
    constructor(ctx) {
        super(ctx);
    }

    initData() {
        super.initData();

        this.hasStyleContainerBorder = !this.isTypeBlank && !this.isTypeError1;
        this.hasStyleContainerBorderErr1 = this.isTypeError1;
        // this.hasStyleContainerBorder = !this.tools.isTypeBlank();
        // this.hasStyleContainerEditableColor = !this.tools.isTypeBlank();
        // this.cursor = this.getCompile('<cursor class="vf-cursor"/>')(this.getScope());
        this.applyMatrixCorrectness();
    }

    applyMatrixCorrectness() {
        this.gradeInfo = this.getMatrixCached().gradeInfo;
    }

    addClickListener() {
        // return ;
        // let sc = this.getScope();
        this.eventHub.$on(events.KEYBOARD_ADD_CONTENT, ({val, ele, vfCell})=> {
            // window.DEBUG && console.log("CONST.EVENT_KEYBOARD_ADD_CONTENT: \nval: %s\nele:", val, ele);

            let defer = this.getQ().defer();
            defer.promise.then(()=> {
                // let vfCell = this.getVfCellFromEle(ele);
                vfCell = this.getVfCell(vfCell);
                this.setVfCellValue(vfCell, val, ele);
            }/*, 1*/);

            window.setTimeout(()=> defer.resolve());

        });

        this.eventHub.$on(events.KEYBOARD_DEL_CONTENT, ({ele, vfCell}) => {

            let defer = this.getQ().defer();
            defer.promise.then(()=> {
                // let vfCell = this.getVfCellFromEle(ele);
                vfCell = this.getVfCell(vfCell);
                this.cleanVfCell(vfCell, ele, {});
            }/*, 1*/);

            window.setTimeout(()=> defer.resolve());

            // ele = this.convertAngularElement(ele);
            // this.removeMathSymbolBeforeInput(ele, this); //如果有值,先删除
            // this.setCellValue(ele, "vfdel");
        })

    }

    setVfCellValue(vfCell, val, target) {
        let cur = 1;
        let ctrl = this;
        let cursorMove = true;
        let cursorEmit = true;

        if (val) {
            new DeferQ(CONST.patterns_vue).eachQ(({ele:pat, next, stop})=> {
                if (val.match(pat.test)) {
                    if (pat.skipInVfBlank !== undefined && ctrl.isTypeBlank) return;
                    if (val.match(/-del/)) {
                        cursorMove = false;
                        cur = 2;
                    }
                    if (pat.cursorMove !== undefined) cursorMove = pat.cursorMove;
                    if (pat.cursorEmit !== undefined) cursorEmit = pat.cursorEmit;
                    if (pat.replace !== null) val = val.replace(pat.test, pat.replace);
                    if (pat.setKV && !(pat.setKV.length % 3)) {
                        for (let j = 0; j < pat.setKV.length; j = j + 2 + 1) {
                            let _key = pat.setKV[j];
                            let _val = pat.setKV[j + cur];
                            _val = _val === null ? val : _val;

                            if (pat.evt) {
                                new DeferQ(pat.evt).eachQ(({ele:evt, next, stop}) => {
                                    ctrl.eventHub.$emit(evt, ctrl, vfCell, _key, _val,
                                        target, {next, stop, originVal: val});
                                    !pat.manualNextEvt && next();
                                }, (data)=> {
                                    cursorEmit = data.cursorEmit;
                                });
                            } else ctrl.$set(vfCell, _key, _val);
                        }
                    } else {
                        console.warn("setKV error: ", val, pat.setKV);
                    }

                    stop();
                }

                next();
            });
        }

        if (cursorEmit) {
            let ret = {target, vfCell};
            if (cursorMove) ret = this.nextEleCursor(target, vfCell);
            ctrl.eventHub.$emit(events.APPEND_CURSOR, this, ret);
        }
    }

    nextEleCursor(target, vfCell) {
        let direction = this.getCursorDirection(vfCell);
        let ret = null;

        if (direction === CONST.APPEND_CURSOR_NEXT) {
            ret = this.nextEleBlank(target, vfCell);
        } else if (direction === CONST.APPEND_CURSOR_PRE) {
            ret = this.preEleBlank(target, vfCell);
        } else {
            ret = {target, vfCell};
        }

        return ret;
    }

    getCursorDirection(vfCell, negDirection = 1) {

        //在除号的撇上,光标不右移一格
        if (vfCell[CONST.VUE_KEY_HAS_STYLE_DIV]) {
            return CONST.APPEND_CURSOR_NO;
        }

        //有除号,光标右移
        if (this.isMathSymbolTypeDiv()) {
            return CONST.APPEND_CURSOR_NEXT;
        }

        return negDirection * (this.hasVerticalLineBefore(vfCell)
                ? CONST.APPEND_CURSOR_PRE
                : CONST.APPEND_CURSOR_NEXT)
    }

    hasVerticalLineBefore(ele) {
        let has = false;
        let safeCnt = 20, cnt = 0;

        do {
            if (!has && !this.isRowFirst(ele)) {
                ele = this.rowElePrev(ele)
            } else {
                break;
            }
            has = this.hasMarkLine(ele);
            if(++cnt > safeCnt) break;
        } while (true);

        return has;
    }

    // hasVerticalLineBefore(vfCell) {
    //     return !this.isRowFirst(vfCell) //vfCell 不是首行,
    //         && this.hasMarkLine(this.rowElePrev(vfCell)); // 并且有 除号
    //     // let has = false;
    //     // if (!this.isRowFirst(vfCell)) {
    //     //     // this.rowElePrev(vfCell)
    //     //     // this.rowPrev(vfCell)
    //     //     //     .find((cell)=>cell.line && (has = true))
    //     //     this.hasMarkLine(this.rowElePrev(vfCell))
    //     //
    //     // }
    //     //
    //     // return has;
    // }

    /**
     * 下一个可输入的空格
     * @param target
     */
    nextEleBlank(target, vfCell) {
        let _next = target;
        let _nextCell = vfCell;

        do {
            if (this.isRowEleEnd(_nextCell)) break;
            _nextCell = this.nextEle(_nextCell);
            // _next = target.next();

        } while (!this.canAppendCursor(_nextCell));

        return {
            target: _next,
            vfCell: _nextCell
        };
    }

    /**
     * 上一个可输入的空格
     * @param target
     */
    preEleBlank(target, vfCell) {
        let _prev = target;
        let _prevCell = vfCell;

        do {
            if (this.isRowEleFirst(_prevCell)) break;
            _prevCell = this.prevEle(_prevCell);
            // _prev = target.prev();

        } while (!this.canAppendCursor(_prevCell));

        return {
            target: _prev,
            vfCell: _prevCell
        };
    }

    cleanVfCell(vfCell, target, {cursorMove = true, hasDeleted}) {

        let ctrl = this;
        // let cursorMove = true;

        //竖式除法单独处理
        if(ctrl.isTypeBlank) {
            cursorMove = !((vfCell[CONST.VUE_KEY_VAUE]+"").trim());
            ctrl.eventHub.$emit(events.WATCH_VAL, ctrl, vfCell, CONST.VUE_KEY_VAUE, " ");

            let ret = {target, vfCell};
            if (cursorMove) ret = ctrl.preEleBlank(target, vfCell);
            ctrl.eventHub.$emit(events.APPEND_CURSOR, ctrl, ret);
            return;
        }

        //同步符号

        //预处理: 除号
        if (vfCell[CONST.VUE_KEY_HAS_STYLE_DIV_LINE] && !ctrl.hasCVal(vfCell)) {
            let prev = ctrl.prevEle(vfCell);
            if (prev[CONST.VUE_KEY_HAS_STYLE_DIV]) {
                ctrl.eventHub.$emit(events.WATCH_DIV_ALL_CLEAN, ctrl, vfCell);
                cursorMove = false;
                hasDeleted = true;
            }
        }

        let pattern = CONST.patterns_vue;
        pattern.forEach(({setKV, kbdDel, evtDel})=> {
            //es6解构语法:
            //如果传入的对象没有 kbdDel 这个键, 那么kbdDel会代表整个对象
            if (kbdDel === false) return;

            for (let k = 0; k < setKV.length - 1; k = k + 3) {
                if (vfCell[setKV[k]] !== undefined
                    && vfCell[setKV[k]] !== setKV[k + 2]) {
                    ctrl.$set(vfCell, setKV[k], setKV[k + 2]);
                    cursorMove = false;
                    hasDeleted = true;
                }

                if(evtDel instanceof Array) {
                    evtDel.forEach((evt)=> {
                        ctrl.eventHub.$emit(evt, ctrl, vfCell, setKV[k]);
                    });
                }
            }

        });

        if(!hasDeleted) {
            let vfCellPrev = ctrl.prevEle(vfCell);
            return vfCellPrev
                && ctrl.cleanVfCell(vfCellPrev, target, {cursorMove: false, hasDeleted: true});
        }

        let ret = {target, vfCell};
        if (cursorMove) ret = ctrl.preEleBlank(target, vfCell);
        ctrl.eventHub.$emit(events.APPEND_CURSOR, ctrl, ret);
    }
}
