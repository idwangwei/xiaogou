/**
 * Created by 邓小龙 on 2015/7/24.
 * @description
 *
 */
import services from './../index';
import * as types from '../../redux/actiontypes/actiontypes';
import logger from 'log_monitor';
function CommonService($q, $log, $interval, $timeout, $http, $ngRedux, $rootScope, cssMap, finalData, serverInterface, $ionicPopup, $ionicLoading, platformDetector) {
    /**
     * 公共颜色数组，用于抽取颜色
     */
    var colorArray = cssMap.BG_COLOR_ARRAY.concat();//复制常量数组
    var color = "";

    /**
     * 公共颜色数组元素新增
     * @param color 颜色
     */
    function setColorArray(color) {
        if (colorArray.indexOf(color) > 0) {//如果数组存在该颜色，就不添加
            colorArray.unshift(color);//从数组第一个位置添加元素。然后从最后位子压出
        }
    }

    /**
     * 得到颜色
     */
    function getColor() {
        if (colorArray) {
            color = colorArray.pop();//这两行，设置color值为数组最后一个，并将该值再次压入数组的第一个位置。
            colorArray.unshift(color);
        }
        return color;
    }

    /**
     * 设置本地永久缓存对象
     * @param key 缓存的名称
     * @param value 缓存的值
     */
    function setLocalStorage(key, value) {
        if (typeof(Storage) !== "undefined") {//判断当前浏览器是否支持storage
            if (!key) {
                $log.error("localStorage:key is undefined！");
                return;
            }
            localStorage[key] = JSON.stringify(value);
            return;
        }
        $log.error("浏览器不支持数据缓存！");
    }

    /**
     * 获取本地永久缓存对象
     * @param key 缓存的名称
     */
    function getLocalStorage(key) {
        if (typeof(Storage) !== "undefined") {//判断当前浏览器是否支持storage
            if (localStorage[key] && localStorage[key] != "undefined") {
                return JSON.parse(localStorage[key]);
            }
            return undefined;
        }
        $log.error("浏览器不支持数据缓存！");
    }

    function removeLocalStorage(key) {
        if (typeof(Storage) !== "undefined") {//判断当前浏览器是否支持storage
            if (localStorage[key] && localStorage[key] != "undefined") {
                localStorage.removeItem(key);
            }
            return undefined;
        }
        $log.error("浏览器不支持数据缓存！");
    }

    /**
     * 向一个数组批量添加元素
     * @ param sList 被添加的数组
     * @param qList 元素列表
     */
    function setCollectBatch(sList, qList) {
        Array.prototype.push.apply(sList, qList);
    }

    /**
     * 获取图片验证码
     * @returns 验证码图片地址
     */
    function getValidateImageUrl() {
        var defer = $q.defer();
        var timer = $interval(function () {
            // if ($rootScope.sessionID) {
                var url = $rootScope.ip + serverInterface.GET_VALIDATE_IMAGE + '?timeStamp=' + new Date().getTime();
                defer.resolve(url);
            // }
            $interval.cancel(timer);
        }, 100);
        return defer.promise;
    }

    /**
     * 验证图形验证码
     * @param imageVCode
     * @returns promise
     */
    function validateImageVCode(imageVCode) {
        var defer = $q.defer();
        $http.post($rootScope.ip + serverInterface.VALIDATE_IMAGE_V_CODE + ';jsessionid=' + $rootScope.sessionID, {imgVC: imageVCode}).success(function (data) {
            //if (data.code == 200) {
            //    defer.resolve(data);
            //} else {
            //    $log.error('validate vCode failed,the code is' + data.code);
            //}
            defer.resolve(data);
        });
        return defer.promise;
    }

    /**
     * 获取手机验证码
     * @param telePhone 手机号码
     */
    function getTelVC(telePhone) {
        var defer = $q.defer();
        $http.post(serverInterface.APPLY_REFER_PHONE_V_CODE, {telephone: telePhone}).success(function (data) {
            if (data.code == 200) {
                defer.resolve(data);
            } else {
                $log.error("getTelVC：code:" + data.code + "Msg:" + data.msg);
            }
        });
        return defer.promise;
    }

    /**
     * 验证手机验证码
     * @param telRC 手机短信验证码
     */
    function validateTelVC(telRC) {
        var deferred = $q.defer();
        $http.post(serverInterface.VALIDATE_REFER_PHONE_V_CODE, {telRC: telRC}).success(function (data) {
            if (data.code == 200) {
                deferred.resolve(data);
            } else {
                $log.error("validateTelVC错误:" + data)
            }
        });
        return deferred.promise;
    }

    /**
     * 验证表单数据是否合法
     * @param form  需要验证的表单
     * @param formParamList  需要验证的字段
     */
    function showFormValidateInfo(form, formParamList) {
        var validateMsgInfo = finalData.VALIDATE_MSG_INFO;
        for (var i = 0; i < formParamList.length; i++) {
            var error = form[formParamList[i]].$error;
            for (var val in error) {
                if (validateMsgInfo[formParamList[i]][val]) {
                    return validateMsgInfo[formParamList[i]][val];
                }
            }
        }
    }

    /**
     * @description 公共提示框 一段时间消失
     */
    function alertDialog(msg, duration) {
        var duration = duration || 800;
        $ionicLoading.show({
            template: msg,
            duration: duration
        });
    }

    /**
     * @description 公共提示框点击确定可以做处理
     */
    function showAlert(title, template, okText) {
        return $ionicPopup.alert({
            title: title,
            template: template,
            okText: okText || '确定'
        });
    };
    /**
     * 重新登录pop
     * 传入的参数为p配置configObj
     */
    function showPopup(configObj){
       return $ionicPopup.show(configObj);
    }
    /**
     * @description 获取省市区
     * @param parentId type
     * @return promise
     *
     */
    function getLocations(parentId, type) {
        var defer = $q.defer();
        $http.post(serverInterface.GET_LOCATIONS, {
            parentId: parentId,
            type: type,
            name: ''
        }).success(function (data) {
            if (data.code == 200) {
                defer.resolve(data);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    }

    /**
     * 将一位数组转变成二维数组
     * @param array 传入的一位数组
     * @param colCount  列划分点
     * @returns 二维数组
     */
    function getRowColArray(array, colCount) {
        var rowArray = [];//行数组
        var colArray = [];//列数组
        if (!array || array.length == 0) {//空数组不处理
            $log.error("array:是空数组!");
            return rowArray;
        }
        if (!colCount) {
            $log.error("列索引为空!");
            return rowArray;
        }
        if (isNaN(colCount)) {
            $log.error("列索引不正确!");
            return rowArray;
        }
        for (var i = 0; i < array.length; i++) {
            if (i == 0 || i % colCount != 0) {
                colArray.push(array[i]);
            } else {
                rowArray.push(colArray);
                colArray = [];//清空列数组
                colArray.push(array[i]);
            }
        }
        if (colArray.length != 0) {
            rowArray.push(colArray);
        }
        return rowArray;
    }

    /**
     * 获取二维数组中已勾选/没勾选了某元素，并返回二维数组
     * @param array 目标二维
     * @param name  目标元素名称
     * @param checked  勾选状态 （true/false）
     */
    function getRowColArrayChecked(array, name, checked) {
        var retArray = [];
        if (!array || array.length == 0) {//空数组不处理
            $log.error("array:是空数组!");
            return retArray;
        }
        if (!name) {
            $log.error("name:undefined!");
            return retArray;
        }
        if ((typeof checked != 'boolean')) {
            $log.error("checked:不是boolean !");
            return retArray;
        }
        for (var i = 0; i < array.length; i++) {
            var colArray = array[i];
            if (colArray) {
                for (var k = 0; k < colArray.length; k++) {
                    if (colArray[k][name] == checked) {//找到目标元素
                        retArray.push(colArray[k]);
                    }
                }
            }
        }
        return retArray;
    }

    /**
     * 截取目标字符串长度，超过默认添加为...
     * @param str
     * @param length
     */
    function interceptName(str, length) {
        if (str && str.length > length) {
            var str_ = str.substring(0, length);
            return str_ + "...";
        }
        return str;
    }

    /**
     * @description 获取已勾选的选项的id集合
     * @param  Array 作业列表
     * @param key id属性
     * @return  Array 勾选的所有选项id
     */
    function getSelected(Array, key) {
        var selectedIds = [];
        for (var i = 0; i < Array.length; i++) {
            if (Array[i].isClicked) {
                selectedIds.push(Array[i][key]);
            }
        }
        return selectedIds;
    }

    /**
     * 页面移除列表指定对象
     * @param list 目标列表
     * @param key  数组的某个键
     * @param value  数组的某个值
     */
    function removeListInfo(list, key, value) {
        for (var i = 0; i < list.length; i++) {
            if (list[i]["key"] == value) {
                list.splice(i, 1);
                break;
            }
        }
        return list;
    }

    /**
     * 判断数组是否包含某个元素
     * @param arry 传入数组
     * @param obj
     * @param key 对象的属性
     * @returns {boolean}
     */
    function arrayContains(arry, obj, key) {
        var flag = false;
        if (arry) {
            var i = arry.length;
            while (i--) {
                if (key) {
                    if (arry[i][key] == obj[key]) {
                        flag = true;
                        break;
                    }
                }
                if (arry[i] === obj) {
                    flag = true;
                    break;
                }
            }
        }
        if (flag) {
            return true;
        }
        return false;
    }

    /**
     * 显示网络不好的提示
     * @param msg
     */
    function toast(msg) {
        if (window.parent.plugins && window.parent.plugins.toast) {
            window.parent.plugins.toast.showLongTop(msg);
        } else {
            $ionicLoading.show({
                template: msg,
                duration: 2000,
                noBackdrop: true
            });
        }
    }

    /**
     *
     * @description
     * 向后端发送POST请求，如果 withCancelPromise===true
     * 则调用该方法时会返回:
     * {
         *   requestPromise, //请求后端的promise
         *   cancelPromise  //丢弃该请求的promise
         *   cancelDefer //丢弃该求情的延迟对象
         * }
     * 反之，则返回 requestPromise
     * eg.如果要在访问后端需要丢弃该请求时：
     * let postInfo=commonService.commonPost(backendUrl,params,true)
     * postInfo.requestPromise.then(function(){
         *      //请求成功或失败后的处理
         * })
     * //在想要丢弃这个请求时，调用如下方法：
     * postInfo.cancelDefer.resolve(true);
     *
     * @param url {string} 请求URL
     * @param param {*} 请求附加信息
     * @param withCancelPromise {boolean}
     * @returns {*}
     */
    function commonPost(url, param, withCancelPromise ) {
        let requestDefer = $q.defer();
        let cancelDefer = $q.defer();
        let canRePost = true; //如果session过期,自动登录后再发一次请求
        let cancelByUserInterAction = false; //是否是通过用户的交互,如返回上一页,或者前往下一页时,丢弃当前的请求
        let counter = 0;
        let NOTIFY_BUSY = 'busy';
        let intervalId = $interval(function () {
            // $log.debug('request interval running....',url);
            counter++;
            if (counter % 6 == 5 && url != serverInterface.PAPER_GET && url != serverInterface.POST_ANSWER && url != serverInterface.PAPER_SUBMIT) {
                cancelDefer.notify(NOTIFY_BUSY);
            }
            if (counter == 30) {
                cancelDefer.resolve(false);
                $interval.cancel(intervalId);
            }
        }, 1000);
        cancelDefer.promise.then(function (byUserInterAction) {
            cancelByUserInterAction = byUserInterAction;
            // toast('网络传输失败,请重试...');
        }, null, function () {
            // toast('网络传输中...');
        });

        let getRequestOrder = ()=> { //为内存中每一次的请求生成一个请求顺序的order;
            if (typeof $rootScope.requestOrder == "number") {
                $rootScope.requestOrder++;
                if ($rootScope.requestOrder > 100000)$rootScope.requestOrder = 0;//最多记录到十万条然后归零
            } else {
                $rootScope.requestOrder = 0;
            }
            return $rootScope.requestOrder;
        };
        let addTimeStampForRequest = (param)=> {//往请求参数对象中添加一个名为 “$tmp”的属性，http拦截器对截取这个属性将它的值拼接到请求url上，便于log
            let timeStamp = new Date().getTime();
            if (!param)param = {$tmp: timeStamp};
            else param.$tmp = timeStamp;
            return param;
        };

        let getDebugUrl = (url)=> {//获取请求url
            let array = url.split("/");
            return array[array.length - 1];
        };

        let getConnectionType = ()=> {//获取网络类型 wifi | 2g | 3g | 4g | unknown
            if (navigator.connection) {
                return navigator.connection.type;
            }
            return "unknown";
        };

        param = addTimeStampForRequest(param);
        let $tmp = param.$tmp;
        let loginName = $ngRedux.getState().profile_user_auth.user.loginName;
        let postData = ()=> {
            logger.debug(`${$tmp}-req-${getRequestOrder()}-${loginName}-${getDebugUrl(url)}-${getConnectionType()}`);
            $http.post(url, param, {
                timeout: cancelDefer.promise
            }).success(function (data) {
                $interval.cancel(intervalId);
                if (typeof(data) == 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        requestDefer.reject(data);
                        $log.error('parse server data failed,the detail is ' + e);
                        logger.error(`${$tmp}-resp-resp is not a valid string-${getConnectionType()}`);
                    }
                }
                logger.debug(`${$tmp}-resp-${loginName}-${getDebugUrl(url)}-${data.code}-${new Date().getTime() - $tmp}-${getConnectionType()}`);
                requestDefer.resolve(data);
            }).error(function (data) {
                data = data || {};
                logger.error(`${$tmp}-resp-${loginName}-${getDebugUrl(url)}-${data.code}-${new Date().getTime() - $tmp}-${getConnectionType()}`);
                $interval.cancel(intervalId);
                if (data && data.code == 603 && canRePost) {
                    postData();
                    canRePost = false;
                    return;
                }
                requestDefer.reject(data);
            });
        };
        postData();
        return withCancelPromise ? {
            requestPromise: requestDefer.promise,
            cancelPromise: cancelDefer.promise,
            cancelDefer: cancelDefer
        } : requestDefer.promise;
    }

    /**
     * @description 公共post方法 返回Map  该方法针对于不需要显示网络传送中，以及不需要登录
     * @param url http地址
     * @param param 要传的参数
     * @returns promise
     */
    function commonPostSpecial(url, param) {
        param = param || '';
        var defer = $q.defer();
        $http.post(url, param)
            .success(function (data) {
                if (typeof(data) == 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        $log.error('parse server data failed,the detail is ' + e);
                    }
                }
                defer.resolve(data);
            })
            .error(function (data) {
                defer.reject(false);
            });
        return defer.promise;
    }


    /**
     *@description           初始化作业列表 加入三个数组（显示购物车图标，显示收藏夹图标，显示勾选框）
     * @param Array           需要遍历的列表
     * @param Favorite        收藏夹里的收藏的作业id集合
     * @returns Array        初始化后的作业列表
     */

    function workList(Array, Favorite, key) {
        var works = getLocalStorage('works') || [];
        var isAddCart = "";
        var isAddFavorite = "";
        var isClicked = false;
        for (var i = 0; i < Array.length; i++) {
            if (works.indexOf(Array[i][key]) >= 0) {
                isAddCart = true;
            } else {
                isAddCart = false;
            }
            if (Favorite) {
                if (Favorite.indexOf(Array[i][key]) >= 0) {
                    isAddFavorite = true;
                } else {
                    isAddFavorite = false;
                }
                Array[i].isAddFavorite = isAddFavorite;
            }
            Array[i].isAddCart = isAddCart;
            Array[i].isClicked = isClicked;
        }
        return Array;
    }

    /**
     * 小数转换百分比
     * @param 源小数
     * @count 保留小数位数
     */
    function convertToPercent(num, count) {
        try {
            count = count == undefined ? 2 : count;
            var count_ = parseInt(count);
            var num_ = num * 100;
            return num_.toFixed(count_) + "%";
        } catch (e) {
            $log.error("小数转换百分比出现错误" + e);
        }
    }

    /**
     * 阿拉伯数字转化为中文数字
     * @param num
     * @returns {string}
     */
    function convertToChinese(num) {
        //出题端新版的大题seqNum是0开始的。
        var N = [
            "零", "一", "二", "三", "四", "五", "六", "七", "八", "九"
        ];
        if (num >= 0 && num < 10) {
            var str = num.toString();
            return N[str];
        }
        var C_Num = [];
        if (num % 10 == 0) {
            if (num / 10 == 1) {
                return "十"
            } else {
                var str = (num / 10).toString();
                return N[str] + "十";
            }

        }

        var temp1 = Math.floor(num / 10);
        var temp2 = (num % 10).toString();
        if (temp1 == 1) {
            return "十" + N[temp2];
        }
        return N[temp1] + "十" + N[temp2];
    }

    /**
     * 黑屏或解除黑屏
     * @param yesOrNo
     */
    function lockScreen(yesOrNo) {
        $('#blackStage').remove();
        if (!yesOrNo) {
            return;
        }
        var $blackStage = $('<div id="blackStage"><img src="sImages/other/boy.gif"></div>');
        $blackStage.css({
            position: 'fixed',
            width: '100%',
            height: '100%',
            background: 'black',
            left: 0, top: 0,
            display: '-webkit-flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        });
        $('body').append($blackStage);
    }


    /**
     * 确认弹出框
     * @param title 提示标题
     * @param contentTemplate  提示的内容模板
     * return  confirmPromise  提示框关闭时返回用户操作的promise
     */
    function showConfirm(title, contentTemplate, confirm, esc) {
        var title = title || "信息提示";
        var contentTemplate = contentTemplate || "您确定要执行该操作吗？";
        var confirm = confirm || "确定";
        var esc = esc || "取消";
        var confirmPromise = $ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: contentTemplate,
            title: title,
            buttons: [
                {
                    text: "<button>" + confirm + "</button>",
                    type: "button-positive",
                    onTap: function (e) {
                        return true;
                    }
                },
                {
                    text: esc,
                    type: "",
                    onTap: function (e) {
                        return false;
                    }
                }

            ]
        });
        return confirmPromise;
    };

    /**
     * 获取设备id
     */
    function getDeviceId() {
        var deviceId;
        try {
            deviceId = device.uuid || "11";
        } catch (e) {
            deviceId = "11";
        }
        return deviceId;
    }

    /**
     * 获取数组中最小最大数
     * @param objArray
     * @param objProperty
     */
    function minAndMaxInObjArray(objArray, objProperty) {
        var min;
        var max;
        var ret = [];

        if (objArray.length <= 0) {
            return null;
        }

        if (!objProperty) {
            return null;
        }

        min = objArray[0][objProperty];
        max = objArray[0][objProperty];

        angular.forEach(objArray, function (item) {
            if (item[objProperty] > max) {
                max = item[objProperty];
            }
            if (item[objProperty] < min) {
                min = item[objProperty];
            }
        });

        ret.push(min);
        ret.push(max);

        return ret;
    }

    /**
     * 获取应用数字版本号
     */
    function getAppNumVersion() {
        try {
            if (AppUtils) {
                return AppUtils.getAppVersion();
            }
            return "";
        } catch (e) {
            return "";
        }
    }

    /**
     * 获取应用svn版本号
     */
    function getAppSvnVersion() {
        try {
            if (AppUtils) {
                return AppUtils.getAppRev();
            }
            return "";
        } catch (e) {
            return "";
        }
    }

    /**
     * 获取应用变更日志
     */
    function getChangeLog() {
        try {
            if (AppUtils) {
                var ret = [];
                var changeLog = AppUtils.getChangeLog();
                AppUtils.isArray(changeLog) && changeLog.forEach(function (val) {
                    ret.push(JSON.stringify(val));
                });

                return ret;
            }
            return "";
        } catch (e) {
            return "";
        }
    }

    /**
     * 简略判断是否为手机
     */
    function judgePhone() {
        var ANDROID = "Android";
        var IPHONE = "iPhone";
        if (platformDetector.detector.os == IPHONE) {
            return true;
        }
        if (platformDetector.detector.os == ANDROID) {
            if (window.innerWidth < 768) {
                return true;
            }
        }
        return false;
    }

    /**
     * 简略判断系统
     */
    function judgeSYS() {
        return $rootScope.platform.type = $rootScope.platform.IS_ANDROID ? 1 :
            ($rootScope.platform.IS_IPHONE || $rootScope.platform.IS_IPAD) ? 2 : 3;
    }

    /**
     * 判断是否PC设备， win || osx
     */
    function isPC(){
        return $rootScope.platform.IS_WINDOWS || $rootScope.platform.IS_MAC_OS;
    }

    function isAndroid(){
        return $rootScope.platform.IS_ANDROID;
    }


    function sendUserSuggestion(suggestionWord, imgs, sendOverCallback) {
        return (dispatch, getState)=> {
            let state = getState(),
                id = state.getIn(['profile', 'user', 'userId']),
                name = state.getIn(['profile', 'user', 'name']);
            dispatch({
                type: types.FEEDBACK.SUBMIT_SUGGESTION_START,
                payload: {suggestionWord: suggestionWord, imgs: imgs, isSuggestionSubmitProcessing: true}
            });
            commonPost(serverInterface.POST_FEEDBACK, {
                imgs: JSON.stringify(imgs),
                user: JSON.stringify({
                    id: id,
                    name: name,
                    role: 'S'
                }),
                suggestion: suggestionWord
            }).then(
                (data) => {
                    if (data.code == 200) {
                        sendOverCallback()
                    }
                    dispatch({
                        type: types.FEEDBACK.SUBMIT_SUGGESTION_SUCCESS,
                        payload: {isSuggestionSubmitProcessing: false}
                    });
                }
            )

        };
    }


    function gameAppendShardingId() {
        let gameSessionID,
            gameClazzId = $ngRedux.getState().game_list.selectedClazz.id;
        let shardingIndex = $rootScope.sessionID.indexOf(finalData.GAME_SHARDING_SPILT);
        if (shardingIndex > -1)
            gameSessionID = $rootScope.sessionID.substring(0, shardingIndex) + finalData.GAME_SHARDING_SPILT + gameClazzId;
        else
            gameSessionID = $rootScope.sessionID + finalData.GAME_SHARDING_SPILT + gameClazzId;

        console.log('gameSessionID!!!!!', gameSessionID);
        return gameSessionID;
    }

    function replaceAnalysisImgAddress(analysisImgUrl){
        var replace = false;
        var replacedSrc = analysisImgUrl.replace(/(\$\{ip\}:90)(.*)/,(match, $1, $2)=>{
            if (match)replace = true;
            return serverInterface.REFER_ANS_IMG_SERVER + $2;
        });
        if(replace) analysisImgUrl=replacedSrc;
        return analysisImgUrl;
    }

    return {
        setColorArray: setColorArray,
        getColor: getColor,
        setLocalStorage: setLocalStorage,
        getLocalStorage: getLocalStorage,
        setCollectBatch: setCollectBatch,
        getValidateImageUrl: getValidateImageUrl,
        validateImageVCode: validateImageVCode,
        getTelVC: getTelVC,
        validateTelVC: validateTelVC,
        showFormValidateInfo: showFormValidateInfo,
        alertDialog: alertDialog,
        showAlert: showAlert,
        showPopup: showPopup,
        getLocations: getLocations,
        getRowColArray: getRowColArray,
        getRowColArrayChecked: getRowColArrayChecked,
        getSelected: getSelected,
        removeListInfo: removeListInfo,
        arrayContains: arrayContains,
        commonPost: commonPost,
        commonPostSpecial: commonPostSpecial,
        workList: workList,
        convertToPercent: convertToPercent,
        convertToChinese: convertToChinese,
        interceptName: interceptName,
        lockScreen: lockScreen,
        showConfirm: showConfirm,
        removeLocalStorage: removeLocalStorage,
        getDeviceId: getDeviceId,
        getAppNumVersion: getAppNumVersion,
        getAppSvnVersion: getAppSvnVersion,
        minAndMaxInObjArray: minAndMaxInObjArray,
        getChangeLog: getChangeLog,
        judgePhone: judgePhone,
        judgeSYS: judgeSYS,
        sendUserSuggestion: sendUserSuggestion,
        gameAppendShardingId: gameAppendShardingId,
        replaceAnalysisImgAddress:replaceAnalysisImgAddress,
        isPC:isPC,
        isAndroid:isAndroid
    }
}
CommonService.$inject = [
    "$q", "$log", "$interval", "$timeout", "$http", "$ngRedux", "$rootScope", "cssMap", "finalData", "serverInterface", "$ionicPopup", "$ionicLoading", "platformDetector"
];
services.factory('commonService', CommonService);
