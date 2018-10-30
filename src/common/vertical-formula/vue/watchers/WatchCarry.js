/**
 * Created by LuoWen on 2016/12/5.
 */

let watchCarry = (ctrl, vfCell, key, val, target, {originVal})=> {
    let carryNum = +originVal.match(/(\d)/)[1];
    let _val = val;

    for (let i = 1; i <= 8; i++) {

        if (i === carryNum) {
            _val = val ? 1 : 0;
        } else {
            _val = 0;
        }

        ctrl.$set(vfCell, key + i, _val);
    }
};

let clearCarry = (ctrl, vfCell, key)=> {
    watchCarry(ctrl, vfCell, key, 0, null, {originVal: "0"});
};

export {
    watchCarry,
    clearCarry
}