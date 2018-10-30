/**
 * Created by LuoWen on 2016/11/21.
 */


export default (obj, ctx)=> {
    for (let fn in obj) {
        if (obj[fn] instanceof Function) {
            obj[fn] = obj[fn].bind(ctx);
        }
    }
    return obj
};
