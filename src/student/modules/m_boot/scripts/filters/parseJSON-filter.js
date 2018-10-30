define(['./index'], function (filters) {
    'use strict';
    // expand input and show post button on focus
    filters.filter('parseJSON', [function () {
        return function (obj, paramList) {
            if (!obj  instanceof Object) {
                console.warn('the first param should be instance of Object');
                return obj;
            }
            if (!paramList instanceof  Array) {
                console.warn('the second param "paramList" should be an Array');
                return obj;
            }
            for (var key in obj) {
                if (paramList.indexOf(key) != -1) {
                    if (typeof obj[key] != 'string') {
//                        console.warn('the value of param ' + key + ' is not string');
                        continue;
                    }
                    try {
                        obj[key] = JSON.parse(obj[key]);
                    } catch (e) {
                        console.error('error during parsing ' + key);
                        console.error(e);
                    }

                }
            }
            return obj;
        }
    }]);
});