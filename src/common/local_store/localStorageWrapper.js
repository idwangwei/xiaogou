/**
 * Created by 彭建伦 on 2016/5/31.
 * 封装localStorage API
 */
class LocalStorageWrapper {
    constructor() {
    }

    setItem(key, content, callback) {
        callback = callback || this.noop;
        let error;
        try {
            localStorage.setItem(key, content);
        } catch (e) {
            error = e;
        }
        callback.call(this, error);
    }

    getItem(key, callback) {
        callback = callback || this.noop;
        let error, res;
        try {
            res = localStorage.getItem(key);
        } catch (e) {
            error = e;
        }
        callback.call(this, error, res);
    }

    removeItem(key, callback) {
        callback = callback || this.noop;
        let error;
        try {
            localStorage.removeItem(key);
        } catch (e) {
            error = e;
        }
        callback.call(this, error);
    }


    noop() {
    }

}

export default LocalStorageWrapper;
