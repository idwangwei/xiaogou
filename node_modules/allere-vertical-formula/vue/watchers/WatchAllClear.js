/**
 * Created by LuoWen on 2016/12/5.
 */

import CONST from '../../vfconst'

let watchAllClearConfirm = (ctrl, vfCell, key, val, target, {next})=> {
    ctrl.getCommonService()
        .showConfirm(null, "您确定要删除整个竖式吗?")
        .then((isYes)=> {
            if (isYes) {
                next();
            }
        });
};

let watchAllClear = (ctrl)=> {
    let root = ctrl.getVmRoot();

    let vam = root.vam;
    let vs = ctrl.getVerticalService();
    let rLen = vam.length;
    let cLen = vam[0].length;

    if(ctrl.isTypeBlank) {
        for (let r = 0; r < rLen; r++) {
            for (let c = 0; c < cLen; c++) {
                let vfCell = vam[r][c];
                if(vfCell[CONST.VUE_KEY_HAS_STYLE_EDITABLE_COLOR]) {
                    ctrl.$set(vfCell, CONST.VUE_KEY_VAUE, " ");
                }
            }
        }

        return;
    }


    //重置为初始化的值
    let initVueData = vs.initVueData;
    for (let r = 0; r < rLen; r++) {
        for (let c = 0; c < cLen; c++) {
            let vfCell = vam[r][c];
            for(let k in initVueData) {
                ctrl.$set(vfCell, k, initVueData[k]);
            }
        }
    }

    //清理一些遗漏的
    let initVueDeadData = vs.initVueDeadData;
    for(let k in initVueDeadData) {
        root[k] = initVueDeadData[k];
    }
};

export {
    watchAllClearConfirm,
    watchAllClear
}