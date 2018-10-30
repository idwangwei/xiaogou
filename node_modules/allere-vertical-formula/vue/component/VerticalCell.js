/**
 * Created by LuoWen on 2016/11/18.
 */

import Vue from 'vue'
import CONST from '../../vfconst'
import VerticalCtrl from '../ctrl/VerticalCellCtrl'
// import eventHub from '../event/EventHub'
import * as events from '../event/EventTypes'
// import VerticalCursor from './VerticalCursor'
import VerticalCellComputed from './computed/VerticalCellComputed'
import deferLoad from '../tools/DeferLoad'
import randomNumber from '../tools/RandomNumber'
import VerticalCursorComponent from '../component/VerticalCursor'

let VerticalCellComponent = ()=>
Vue.component('vertical-cell', deferLoad({
    template: require('./vertical-cell.html'),
    props: ['vfCell', 'r', 'c'],
    data: function () {
        this.ctrl = new VerticalCtrl(this);

        return {
            curCur: false
        }
    },
    computed: VerticalCellComputed,
    methods: {
        verticalCellOnClick: function (el) {
            let target = el.currentTarget;
            // window.DEBUG && console.log("el:", target);
            let ctrl = this.ctrl;
            ctrl.eventHub.$emit(events.APPEND_CURSOR, ctrl, {target: target, vfCell: this.vfCell});
        }
    },
    filters: {
        // filterEditableColor: (val, ctrl) => ctrl.filterEditableColor(val),
        // filterLine: (val, ctrl) => ctrl.filterLine(val),
        // filterDiv: (val, ctrl) => ctrl.filterDiv(val),
        // filterDot: (val, ctrl) => ctrl.filterDot(val),
        // filterVal: (val, ctrl) => ctrl.filterVal(val),
        // filterValDisplay: (val, ctrl) => ctrl.getKeyboardAddContentVal(val),
    },
    watch: {
        'vfCell.val': {
            handler: function (newVal, oldVal) {
                // window.DEBUG && console.log("watch val ", newVal, oldVal, this);
                if (newVal === oldVal) return;

                let ctrl = this.ctrl;
                let vfCell = ctrl.vfCell;

                ctrl.eventHub.$emit(events.SYNC_MATH_SYMBOL_TYPE, ctrl, vfCell,
                    CONST.VUE_KEY_VAUE, newVal, oldVal);

                refreshSymbols(ctrl, vfCell);

            },
            deep: false
        },
        'vfCell.hasStyleDiv': function (newVal, oldVal) {
                if (newVal === oldVal) return;

                let ctrl = this.ctrl;
                let vfCell = ctrl.vfCell;
                ctrl.eventHub.$emit(events.SYNC_MATH_SYMBOL_TYPE, ctrl, vfCell,
                    CONST.VUE_KEY_HAS_STYLE_DIV, newVal, oldVal);
        }
        // 'vfCell.line': {
        //     handler: ()=>{}
        // }
        // 'vfCell.hasMarkLine' : {
        //     handler: function (newVal, oldVal) {
        //         window.DEBUG && console.log("watch hasMarkDiv ", newVal, oldVal, this);
        //         if (newVal === oldVal) return;
        //
        //         let ctrl = this.ctrl;
        //         ctrl.vfCellR[CONST.VUE_KEY_HAS_MARK_DIV] = newVal;
        //     }
        // },
        // 'vfCell.hasMarkDiv' : {
        //     handler: function (newVal, oldVal) {
        //         window.DEBUG && console.log("watch hasMarkLine ", newVal, oldVal, this);
        //         if (newVal === oldVal) return;
        //
        //         let ctrl = this.ctrl;
        //         ctrl.vfCellR[CONST.VUE_KEY_HAS_MARK_LINE] = newVal;
        //     }
        // }

    },
    // mounted: function () {
    //     this.$on("vf-click", this.verticalCellOnClick);
    // },
    destroyed: function () {
        // console.log("beforeDestroy", this);
        //TODO   REMOVE LISTENERS...

        this.ctrl.vam = null;
        this.ctrl.eventHub = null;
        this.ctrl.ctx = null;

        this.ctrl = null;
        // this.$off("click", this.verticalCellOnClick);
        // this._vnode.elm._v_remove('click', this.verticalCellOnClick);
        // this._vnode.elm._v_remove = null;
        // this._vnode.elm._v_add = null;
        this.$off();
        // this.$off("vf-click", this.verticalCellOnClick);
    },
    components: {
        'vertical-cursor': VerticalCursorComponent(),
        // 'vertical-cursor-none': {template: `<span/>`}
    }
}, randomNumber(100, 200)));

/**
 * 同步一些符号
 * 个性化设置
 *
 * @param ctrl
 * @param vfCell
 */
let refreshSymbols = (ctrl, vfCell)=> {

    //             vfCell, vfCellPrev, vfCellNext
    let vfCells = [vfCell,    null,     null];

    if(ctrl.isRowFirst(vfCell)) {
        vfCells[2] = ctrl.rowEleNext(vfCell); //div true next
        //line false prev // none
    } else if(ctrl.isRowEnd(vfCell)) {
        //div false next // none
        vfCells[1] = ctrl.rowElePrev(vfCell); //line true prev
    } else {
        vfCells[2] = ctrl.rowEleNext(vfCell); //div true next
        vfCells[1] = ctrl.rowElePrev(vfCell); //line true prev
    }

    watchDiv(ctrl, vfCells);
    watchLine(ctrl, vfCells);

    function watchDiv(ctrl, vfCells) {
        vfCells.forEach((vfCell)=> {
            if (vfCell && ctrl.hasMarkDiv(vfCell)) {
                ctrl.eventHub.$emit(events.WATCH_DIV, ctrl, vfCell)
            }
        });
    }
    function watchLine(ctrl, vfCells) {
        vfCells.forEach((vfCell)=>{
            if (vfCell && ctrl.hasMarkLine(vfCell)) {
                ctrl.eventHub.$emit(events.WATCH_LINE, ctrl, vfCell, null, 2)
            }
        });
    }
};


export default VerticalCellComponent;
