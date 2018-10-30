/**
 * Created by 彭建伦 on 2016/5/14.
 * 同步LocalStorage与app的数据
 */
import {Immutable} from 'immutable';
let LOCAL_STORAGE_KEY = "E_CLASS_STUDENT";
let localStoreSynchronizer = store=>next=>action=> {
    let state = store.getState();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.toJS()));
    next(action);
};
export {
    localStoreSynchronizer,
    LOCAL_STORAGE_KEY
}

    ;
