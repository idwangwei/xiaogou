/**
 * Created by LuoWen on 2016/12/4.
 */

import CONST from '../../vfconst'

let beforeAddSymbol = (ctrl, vfCell, key, val, target, {stop})=> {
    //数字
    if ((typeof val === "string") && val.match(/\d/)) return;

    //覆盖符号
    let oldVal = vfCell[key];
    if (oldVal && oldVal.match && oldVal.match(/^\+|^-|^×/)) return;

    //删除符号
    if (val === false || val === "") return;


    let mathSymbolType = ctrl.getMathSymbolType();
    let mathSymbolTypeName = "";
    switch (mathSymbolType) {
        case CONST.VF_MATH_SYMBOL_ADD:
            mathSymbolTypeName = "加号";
            break;
        case CONST.VF_MATH_SYMBOL_SUB:
            mathSymbolTypeName = "减号";
            break;
        case CONST.VF_MATH_SYMBOL_MUL:
            mathSymbolTypeName = "乘号";
            break;
        case CONST.VF_MATH_SYMBOL_DIV:
            mathSymbolTypeName = "除号";
            break;
    }
    //没有符号
    if (!mathSymbolTypeName) return;


    let commonService = ctrl.getCommonService();
    commonService.showAlert("提示", `已经有${mathSymbolTypeName}了, 一个框中只限列一个竖式.`);

    stop({cursorEmit: false});
};

export {
    beforeAddSymbol
}