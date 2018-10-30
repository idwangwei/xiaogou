/**
 * Created by LuoWen on 2016/12/5.
 */

let watchVal = (ctrl, vfCell, key, val)=> {
    ctrl.$set(vfCell, key, val);
};

export {
    watchVal
}