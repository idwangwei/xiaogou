/**
 * Created by LuoWen on 2016/12/6.
 */

import once from './Once'

export default (component, time = 0)=> {
    return component;
};

// export default (component, time = 0)=> once(function (resolve, reject) {
//
//     window.setTimeout(() => resolve(component), time);
// });