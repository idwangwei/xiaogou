
/**
 * LocalStorage存取工具类
 */
class LocalStorageUtil {
    constructor() {
        this._storage = window.localStorage
    }

    /**
     * 检查字符串是否为空
     * @param str
     * @private
     */
    _checkNull(str) {
        return str == undefined || str == '' || str == null
    }


    /**
     * 根据key获取JSON object
     * @param key
     */
    getJSONObject(key) {
        var val = this._storage.getItem(key);
        var rt = {};
        if (this._checkNull(val)) {
            console.log(`The value of key:'${key}' is '' or undefined or null`);
            return rt;
        }
        try {
            rt = JSON.parse(val);
            if (typeof rt == 'object' && !(rt instanceof Array))
                return rt;
            else {
                console.log('object is Array !');
                return {};
            }
        } catch (e) {
            console.error(`error while trying to parse JSON string : ${val}`);
        }
    }

    /**
     * 根据key获取JSON Array
     * @param key
     * @returns {*}
     */
    getJSONArray(key) {
        var val = this._storage.getItem(key);
        var rt = [];
        if (this._checkNull(val)) {
            console.log(`The value of key:'${key}' is '' or undefined or null`);
            return rt;
        }
        try {
            rt = JSON.parse(val);
            if (typeof rt == 'object' && rt instanceof Array)
                return rt;
            else {
                console.log('object is Array !');
                return [];
            }
        } catch (e) {
            console.error(`error while trying to parse JSON string : ${val}`);
        }
    }

    /**
     *
     * @param key
     * @param itemKey
     * @param itemValue
     */
    getJSONArrayItem(key, itemKey, itemValue) {
        var rt = {};
        var JSONArray = this.getJSONArray(key);
        JSONArray.forEach(function (item) {
            if (item[itemKey] == itemValue)rt = item;
        });
        return rt;
    }

    /**
     *
     * @param key
     * @param itemKey
     * @param itemValue
     */
    deleteJSONArrayItem(key, itemKey, itemValue) {
        var JSONArray = this.getJSONArray(key);
        var hasItem = false, index = 0;
        JSONArray.forEach(function (item, idx) {
            if (item[itemKey] == itemValue) {
                hasItem = true;
                index = idx;
            }
        });
        if (!hasItem)return;
        var first = JSONArray.splice(0, index);
        var second = JSONArray.splice(1, JSONArray.length);
        this._storage.setItem(key, JSON.stringify(first.concat(second)));
    }

    /**
     * 保存或更新JSONObject
     * @param key
     * @param value
     */
    saveOrUpdateJSONObject(key, value) {
        var JSONObj = this.getJSONObject(key);
        console.log(Object.assign(JSONObj, value));
        this._storage.setItem(key, JSON.stringify(Object.assign(JSONObj, value)));
    }

    /**
     *
     * @param key
     * @param value
     * @param identityKey
     */
    saveOrUpdateJSONArray(key, value, identityKey) {
        var JSONArray = this.getJSONArray(key);
        var addingArray = [];
        if (identityKey) {
            for (var i = 0; i < JSONArray.length; i++) {
                var has = false;
                for (var j = 0; j < value.length; j++) {
                    if (!JSONArray[i][identityKey] || !value[j][identityKey])continue;
                    if (JSONArray[i][identityKey] === value[j][identityKey]) {
                        has = true;
                        JSONArray[i] = Object.assign(JSONArray[i], value[j]);
                    }
                }
            }
            for (var i = 0; i < value.length; i++) {
                has = false;
                for (var j = 0; j < JSONArray.length; j++) {
                    if (value[i][identityKey] === JSONArray[j][identityKey]) {
                        has = true;
                    }
                }
                if (!has)addingArray.push(value[i]);
            }
            JSONArray = JSONArray.concat(addingArray);
            this._storage.setItem(key, JSON.stringify(JSONArray))
        } else {
            this._storage.setItem(key, JSON.stringify(JSONArray.concat(value)));
        }
    }
}

export  default LocalStorageUtil
