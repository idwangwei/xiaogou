/**
 * Created by LuoWen on 2016/11/26.
 */

import Vue from 'vue'
import * as events from './EventTypes'
import * as watchers from '../watchers'

let vmList = [];

class EventHub {
    constructor() {
        // console.log("new EventHub...");
        throw new Error('no instance!');
    }

    static init(ctrl, uid) {
        let vm = new Vue();
        vm.preCur = [-1, -1];

        addListeners(vm);
        pushVmList(vm, ctrl, uid);
        return vm;
    }

    static getVmList() {
        return vmList;
    }

    static refreshVmList(vmRemove) {

        for (let k = vmList.length - 1; k >= 0; k--) {
            let uid = vmList[k].uid;
            let ctrl = vmList[k].ctrl;

            if(uid === vmRemove._uid) {
                let vmEventHub = vmList[k].vm;
                vmEventHub.$destroy(true);

                // ctrl.ctx.$options.parent = null;
                // do {
                //     let ctx = ctrl.ctx;
                //     if(ctx) {
                //         ctx.eventHub = null;
                //         ctx.ctrl = null;
                //         // ctx.vam = null;
                //         ctx.curCur = null;
                //     }
                //
                //     ctrl.vam = null;
                //     ctrl.eventHub = null;
                //     ctrl.ctx = null;
                //     // ctrl.__proto__ = null;
                // } while (vmRemove.subCtrl.length && (ctrl = vmRemove.subCtrl.pop()));

                // walk(vmRemove, vmRemove._uid);

                //
                // do {
                //     let ctx = ctrl.ctx;
                //     ctrl.vam = null;
                //     ctrl.eventHub = null;
                //
                //     ctx.eventHub = null;
                //     ctx.$context = null;
                //     ctx.context = null;
                //     ctx.$parent = null;
                //     ctx.$root = null;
                //     ctx._renderContext = null; //for MathJax Canvas
                //
                //
                //     ctx.$destroy();
                //     ctx.__proto__ = null;
                //     ctx.ctrl = null;
                //     ctrl.ctx = null;
                // } while (vmRemove.subCtrl.length && (ctrl = vmRemove.subCtrl.pop()));


                vmList.splice(k, 1);
            }
        }
    }
}

let pushVmList = (vm, ctrl, uid) => {
    vmList.push({vm, ctrl, uid});
};

let addListeners = (vm) => {

    vm.$on(events.ADD_CLICK_4_CONTAINER, (ctrl) => {
        ctrl.addClickListener();
    });

    vm.$on(events.APPEND_CURSOR, (ctrl, {target, vfCell}) => {
        // window.DEBUG && console.log("$on: ", events.APPEND_CURSOR);
        ctrl.appendCursor(target, vfCell);
    });

    vm.$on(events.APPEND_CURSOR_EL, updateCursorPos);
    vm.$on(events.WATCH_LINE, watchers.watchLine);
    vm.$on(events.WATCH_DIV, watchers.watchDiv);
    vm.$on(events.WATCH_DIV_CURSOR, watchers.watchDivCursor);
    vm.$on(events.WATCH_DIV_ALL_CLEAN, watchers.cleanDivAndLines);
    vm.$on(events.WATCH_LINE_ALL_CLEAN, watchers.cleanLines);
    vm.$on(events.BEFORE_ADD_DIV, watchers.beforeAddDiv);
    vm.$on(events.SYNC_MATH_SYMBOL_TYPE, watchers.syncMathSymbolType);
    vm.$on(events.WATCH_VAL, watchers.watchVal);
    vm.$on(events.BEFORE_ADD_SYMBOL, watchers.beforeAddSymbol);
    vm.$on(events.WATCH_DOT, watchers.watchDot);
    vm.$on(events.WATCH_CARRY, watchers.watchCarry);
    vm.$on(events.WATCH_ALL_CLEAR_CONFIRM, watchers.watchAllClearConfirm);
    vm.$on(events.WATCH_ALL_CLEAR, watchers.watchAllClear);
    vm.$on(events.CLEAR_CARRY, watchers.clearCarry);
};

let updateCursorPos = (ctrl, vfCell)=> {

    let vmList = EventHub.getVmList();
    let sameCur = false;

    for(let idx in vmList) {
        let li = vmList[idx];
        let eventHub = li.vm;
        if(!eventHub) continue;

        let _ctrl = li.ctrl;
        let preCur = eventHub.preCur;

        if(eventHub === ctrl.eventHub) {
            ctrl.$set(vfCell, 'curCur', true);
            sameCur = (preCur[0] === vfCell.r) && (preCur[1] === vfCell.c);

            if (preCur[0] !== -1) {
                if (!sameCur) {
                    let preVfCell = ctrl.getVfCell({r: preCur[0], c: preCur[1]});
                    preVfCell.curCur = false;
                }
            }

            if (!sameCur) {
                preCur[0] = vfCell.r;
                preCur[1] = vfCell.c;
            }
        } else {
            //处理其它 VM 的光标
            if(preCur[0] !== -1) {
                let _vfCell = _ctrl.getVfCell({r: preCur[0], c:preCur[1]});
                // _vfCell.curCur = false;
                ctrl.$set(_vfCell, 'curCur', false);
                preCur[0] = -1;
                preCur[1] = -1;
            }

        }


    }

    return sameCur;
};

let cleanchildren = ()=>{

};

let walk = (vm, rootId)=> {
    // console.log("rootId: %d, isDestroyed: ", rootId, vm._isBeingDestroyed);

    if(vm.$children.length) {
        var subVms = vm.$children;
        subVms.forEach((subVm)=> {

            walk(subVm, rootId);
        });
    }


    vm.$destroy(true);
};

export default EventHub;
