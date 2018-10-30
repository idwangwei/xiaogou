/**
 * Created by LuoWen on 2016/11/21.
 */

import VerticalCtrlTools from './VerticalCtrlTools'
import CONST from '../../vfconst'
import {mergedExpressionSet} from "../../expressionSet";
// import eventHub from '../event/EventHub'
import * as events from '../event/EventTypes'

export default class VerticalCellCtrl extends VerticalCtrlTools {
    constructor(ctx) {
        super(ctx);
    }

    initData() {
        super.initData();

        this.vfCell = this.ctx.vfCell;
        this.r = this.ctx.r;
        this.c = this.ctx.c;
        // this.vfCellR = this.getVfCellR(this);
        // this.vam2 = (ctx)=>ctx.$root.vam;

        // this.$set(this.vfCell,'hasStyleDiv', false);
        // this.$set(this.vfCell,'hasStyleLine', false);
        // this.$set(this.vfCell,'hasStyleDivLine', false);
        // this.$set(this.vfCell,'hasStyleCellWrapperPadding', false);
        // this.$set(this.vfCell,'hasStyleCellBorder', false);
        // this.$set(this.vfCell,'hasStyleEditableColor', false);
        // this.$set(this.vfCell,'hasStyleCellGrid', !this.tools.isTypeBlank());

        // this.vfCell.hasStyleDiv = false;
        // this.vfCell.hasStyleLine = false;
        // this.vfCell.hasStyleDivLine = false;
        // this.vfCell.hasStyleCellWrapperPadding = false;
        // this.vfCell.hasStyleCellBorder = false;
        // this.vfCell.hasStyleEditableColor = this.isTypeBlank;
        // this.hasStyleContainerEditableColor = !this.isTypeBlank && !this.isTypeError1;

        this.filterVfBlankInitVal();
        this.filterDiv();
        this.filterVal();
        this.refreshPresetLine();
    }

    initVueData() {

    }

    filterVfBlankInitVal() {

        let ctrl = this;
        let vfCell = ctrl.vfCell;

        if (ctrl.isTypeBlank) {
            let val = vfCell[CONST.VUE_KEY_VAUE];
            let cellEditable = vfCell[CONST.VUE_KEY_CELL_EDITABLE];
            if (cellEditable || ctrl.contains(val, "?")) {
                ctrl.$set(vfCell, 'hasStyleCellBorder', true);
                ctrl.$set(vfCell, 'hasStyleEditableColor', true);
            }
            if (ctrl.contains(val, "?")) {
                //处理 ?#\\div
                val = val.replace(/\?/, '');
                if(!val) val = ' ';

                ctrl.$set(vfCell, 'val', val);
            }
            
            ctrl.$set(vfCell, 'hasStyleCellWrapperPadding', true);
            ctrl.$set(vfCell, 'hasStyleCellGrid', false);

        } else if (ctrl.isTypeError1) {
            ctrl.$set(vfCell, 'hasStyleCellGrid', false);

        } else if (ctrl.isTypeError2 || ctrl.isTypeCalc) {
            ctrl.$set(vfCell, 'hasStyleCellGrid', true);
        }
    }

    /**
     * @deprecated
     * @param val
     * @returns {*}
     */
    getKeyboardAddContentVal(val) {
        // window.DEBUG && console.log('filterAddContent', val);

        if (val === undefined || val === null) val = "";

        if (!val.match(/[0-9]/)) { // 键盘非数字输入的情况下，进行符号匹配。
            for (let symbol in mergedExpressionSet) {
                let expression = mergedExpressionSet[symbol];
                let expr = expression.expr ? expression.expr : expression;

                if (val.match(new RegExp(expr))) {
                    let directiveName = expression.directive ? expression.directive : "mathjax-parser";
                    val = this.getCompile()(`<span ${directiveName} value=${val}></span>`)(this.getScope());
                    break;
                }
            }
        }
        return val;
    }

    // filterVal(val) {
    //     if (!val) return val;
    //
    //     let ret = val.val;
    //
    //     // if (ret && ret.indexOf("#") !== -1) { // 3#\\div 除法的情况
    //     //     return ret.split('#').shift();
    //     // }
    //
    //
    //
    //     //
    //     // // mul
    //     // if(ret && ret.indexOf(CONST.KBD_INPUT_VALUE_MUL) !== -1) {
    //     //     return ret.replace(CONST.KBD_INPUT_VALUE_MUL, "×");
    //     // }
    //
    //     return ret;
    // }

    /**
     *
     * @param val
     */
    filterDiv(val) {
        // window.DEBUG && console.log("filterDiv", val);

        let ctrl = this;
        let vfCell = this.vfCell;
        let vfCellVal = vfCell.val;
        let eventHub = this.eventHub;

        if(!vfCellVal) return;

        // div
        if (this.contains(vfCellVal, CONST.KBD_INPUT_VALUE_DIV)) {
            vfCellVal = vfCellVal.replace(CONST.KBD_INPUT_VALUE_DIV, "");
        }

        if (this.contains(vfCellVal, CONST.VAM_KEY_DIV)) {
            ctrl.$set(vfCell, 'hasStyleDiv', true);
            vfCellVal = vfCellVal.replace(CONST.VAM_KEY_DIV, "");
        }

        if (this.contains(vfCellVal, '#')) { // 3#\\div 除法的情况
            vfCellVal = vfCellVal.split('#').shift();
        }

        if (vfCell.hasStyleDiv/* || vfCell.hasStyleDivLine*/) {
            eventHub.$emit(events.WATCH_DIV, ctrl, vfCell, CONST.VUE_KEY_HAS_STYLE_DIV, true);

            // 载入保存的答案时, 同步 div
            eventHub.$emit(events.SYNC_MATH_SYMBOL_TYPE, ctrl, vfCell, CONST.VUE_KEY_HAS_STYLE_DIV, true);
        }

        ctrl.$set(vfCell, 'val', vfCellVal);

    }

    filterVal() {
        let ctrl = this;
        let vfCell = this.vfCell;
        let vfCellVal = vfCell.val;


        // 处理接收到的乘号
        if(vfCellVal && vfCellVal.match(/times/)) {
            vfCell[CONST.VUE_KEY_VAUE] = "×";
            vfCellVal = vfCell[CONST.VUE_KEY_VAUE];
        }

        // 载入保存的答案时, 同步 + - *
        if(vfCellVal && vfCellVal.match(/^\+|^-|^×/)) {
            ctrl.eventHub.$emit(events.SYNC_MATH_SYMBOL_TYPE, ctrl, vfCell,
                CONST.VUE_KEY_VAUE, vfCellVal);
        }
    }

    refreshPresetLine() {
        let ctrl = this;
        let vfCell = this.vfCell;

        if((ctrl.isMatrixTypeError1() || ctrl.isMatrixTypeBlank())
            // && ctrl.isRowEleEnd(vfCell)
            && vfCell[CONST.VUE_KEY_HAS_STYLE_LINE]) {
            ctrl.eventHub.$emit(events.WATCH_LINE, ctrl, vfCell);
            // console.log("refreshPresetLine...")
        }
    }

    /**
     * @deprecated
     * @param val
     * @returns {*}
     */
    filterDivLine(val) {
        let ele = this.nowEle();
        let prev = this.prevEle(ele);
        let next = this.nextEle(ele);
        //当前有除号横线
        if (ele.hasStyleDivLine) {
            //如果上一个有值, 并且没除号, 有横线
            if (!this.isRowEleFirst(ele)) {
                prev.hasStyleDivLine = prev.hasStyleDiv ? false : this.hasCVal(prev);
            }
            //如果下一个有值, 有横线
            if (!this.isRowEleEnd(ele) && this.hasCVal(next)) {
                next.hasStyleDivLine = true;
            }

            //当前没有除号横线
        } else {
            //如果当前没有除号,下一个也没有横线
            if (!this.isRowEleEnd(ele) && !ele.hasStyleDiv) next.hasStyleDivLine = false;
            //上一个肯定没有横线
            // if (!this.isRowEleFirst(ele)) prev.hasStyleDivLine = false;
        }

        return val;
    }

    /**
     * @deprecated
     * @param val
     */
    filterLine(val) {
        // window.DEBUG && console.log('filterLine', val);
        if (val) {
            let vfCell = this.nowEle();
            let eventHub = this.eventHub;
            eventHub.$emit(events.WATCH_LINE, this, vfCell, CONST.VUE_KEY_HAS_STYLE_LINE, 1)
        }
    }

    // filterEditableColor(val) {
    //     // let ele = this.nowEle();
    //     // ele.hasStyleEditableColor = !!(
    //     //     val && val[CONST.PATTERN_CELL_EDITABLE]
    //     // );
    //
    //     if(val) {
    //
    //     }
    //
    //     return val;
    // }

    // filterDot(val) {
    //     // let ele = this.nowEle();
    //
    //
    //     return val;
    // }
}
