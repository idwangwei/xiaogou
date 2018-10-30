/**
 * Created by LuoWen on 2016/12/5.
 */

let watchDot = (ctrl, vfCell, key, val)=> {

    if (!ctrl.isRowEleFirst(vfCell)
        && !ctrl.hasCVal(vfCell)) { //当前格子没有值
        let preVfCell = ctrl.prevEle(vfCell);
        if (ctrl.hasCVal(preVfCell)) { //并且上一格子有值
            vfCell = preVfCell; //把小数点放在上一格
        }
    }


    let row = ctrl.rowNow(vfCell);
    let c = vfCell.c;
    let _val = val;

    let dotStart = 0, dotEnd = row.length;
    if (ctrl.hasMarkDiv(vfCell)) {
        let rfdi = ctrl.getRowFirstDivIndex(vfCell);
        if (c > rfdi) {
            dotStart = rfdi + 1;
        } else {
            dotEnd = rfdi;
        }
    }

    // 一行只能有一个小数点
    for (let i = dotStart; i < dotEnd; i++) {
        if (i === c) {
            _val = val ? 1 : 0;
        } else {
            _val = 0;
        }
       ctrl.$set(row[i], key, _val);
    }
};

export {
    watchDot
}