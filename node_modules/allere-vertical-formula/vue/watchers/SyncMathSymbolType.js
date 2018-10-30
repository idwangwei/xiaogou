/**
 * Created by LuoWen on 2016/12/4.
 */

import CONST from '../../vfconst'

let syncMathSymbolType = (ctrl, vfCell, key, val, oldVal)=> {

    // let oldVal = vfCell[key];
    let root = ctrl.getVmRoot();
    if (oldVal && oldVal.match && oldVal.match(/^\+|^-|^×/)) {
        root.mathSymbolType = "";
    }

    if (key && key.match) {
        if (key.match(CONST.VUE_KEY_VAUE) && val && val.match) {

            if(val.match(/^\+/)) {
                root.mathSymbolType = CONST.VF_MATH_SYMBOL_ADD;
            } else if(val.match(/^-/)) {
                root.mathSymbolType = CONST.VF_MATH_SYMBOL_SUB;
            } else if (val.match(/^×/)) {
                root.mathSymbolType = CONST.VF_MATH_SYMBOL_MUL;
            }

        } else if (key.match(CONST.VUE_KEY_HAS_STYLE_DIV)) {
            root.mathSymbolType = val ? CONST.VF_MATH_SYMBOL_DIV : "";
        }
    }

    console.log("syncMathSymbolType:", root.mathSymbolType);
};

export {
    syncMathSymbolType
}