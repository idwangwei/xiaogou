/**
 * Created by LuoWen on 2016/12/20.
 */

let once = function (fn) {
    if (!fn) return;

    return function () {
        fn.call(this, ...arguments);
        fn = null;
    }
};

export default once;