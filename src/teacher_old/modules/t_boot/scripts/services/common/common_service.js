/**
 * Created by 邓小龙 on 2015/7/24.
 * @description
 *
 */
import  services from './../index';
import * as simulationData from './../../../json/simulationClazz/index';

'use strict';
services.factory('commonService',
    function ($q, $log, $interval, $http, $rootScope, $ionicLoading, $ionicPopover, $ionicPopup, cssMap, finalData,
              serverInterface, platformDetector, $location) {
        "ngInject";
        /**
         * 公共颜色数组，用于抽取颜色
         */
        //var colorArray=new Array(cssMap.BG_COLOR_LIGHT,cssMap.BG_COLOR_STABLE,cssMap.BG_COLOR_POSITIVE,cssMap.BG_COLOR_CALM,
        //    cssMap.BG_COLOR_BALANCED,cssMap.BG_COLOR_ENERGIZED,cssMap.BG_COLOR_ASSERTIVE,cssMap.BG_COLOR_ROYAL,cssMap.BG_COLOR_DARK);
        var colorArray = cssMap.BG_COLOR_ARRAY.concat();//复制常量数组
        var color = "";
        //$rootScope.postQueue = [];

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
            console.log($rootScope.sessionID);
            if ($rootScope.sessionID) {
                var url = $rootScope.ip + serverInterface.GET_VALIDATE_IMAGE + ';jsessionid=' + $rootScope.sessionID + '?timeStamp=' + new Date().getTime();
                defer.resolve(url);
                console.log(url);
            }
//                var timer = $interval(function () {
//
//                    $interval.cancel(timer);
//                }, 100);
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
            return commonPost(serverInterface.APPLY_REFER_PHONE_V_CODE, {telephone: telePhone});
        }

        /**
         * 更改设备时获取手机验证码
         * @returns {promise}
         */
        function getChangingDevVC() {
            return commonPost(serverInterface.GET_CHANGING_DEV_VC);
        }

        /**
         * 验证手机验证码
         * @param telRC 手机短信验证码
         */
        function validateTelVC(telRC) {
            return commonPost(serverInterface.VALIDATE_REFER_PHONE_V_CODE, {telRC: telRC});
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
                        return {
                            numericField: val,
                            msg: validateMsgInfo[formParamList[i]][val]
                        };
                    }
                }
            }
        }

        /**
         * @description 公共提示框 一定时间消失
         *
         */
        function alertDialog(msg, duration) {
            var duration = duration || 800;
            $ionicLoading.show({
                template: msg,
                duration: duration
            });
        }

        /**
         * @description 公共提示框 点击确定可以做处理
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
         * 获取ionic帮助提示框
         * @param template 帮助提示框的模板
         * @returns  promise
         */
        function getPopover(template) {
            return $ionicPopover.fromTemplateUrl(template);
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
         * @description 获取已勾选的下标集合
         * @param Array 列表
         * @returns {Array} 下标集合
         */
        function getClickedIndex(Array) {
            var index = [];
            for (var i = 0; i < Array.length; i++) {
                if (Array[i].isClicked) {
                    index.push(i);
                }
            }
            return index;
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
         * 确认弹出框
         * @param title 提示标题
         * @param contentTemplate  提示的内容模板
         * return  confirmPromise  提示框关闭时返回用户操作的promise
         */
        function showConfirm(title, contentTemplate, btn) {
            var title = title || "信息提示";
            var contentTemplate = contentTemplate || "您确定要执行该操作吗？";
            var btn = btn || '确定';
            var confirmPromise = $ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
                template: contentTemplate,
                title: title,
                buttons: [
                    {
                        text: "<b>" + btn + "</b>",
                        type: "button-positive",
                        onTap: function (e) {
                            return true;
                        }
                    },
                    {
                        text: "取消",
                        type: "",
                        onTap: function (e) {
                            return false;
                        }
                    }

                ]
            });
            return confirmPromise;
        }

        function toast(msg) {
            if (window.parent.plugins && window.parent.plugins.toast) {
                window.parent.plugins.toast.showLongTop(msg);
            }else {
                $ionicLoading.show({
                    template: msg,
                    duration: 3000,
                    backdrop: false
                });
            }
        }

        /**
         * @description 公共post方法 返回Map
         * @param url http地址
         * @param param 要传的参数
         * @returns promise
         */
        function commonPost(url, param,withCancelPromise) {
            $log.log(url);
            param = param || '';
            let rtn = getSimulationClazzData(url,param,withCancelPromise);
            if(typeof(rtn) == "object"){
                return rtn;
            }

            var defer = $q.defer();
            let cancelDefer = $q.defer();
            let canRePost = true; //如果session过期,自动登录后再发一次请求
            let counter = 0;
            let NOTIFY_BUSY = 'busy';
            let intervalId = $interval(function () {
                counter++;
                // if (counter == 6) {
                //     cancelDefer.notify(NOTIFY_BUSY);
                // }
                if (counter == 30) {
                    cancelDefer.resolve(true);
                    $interval.cancel(intervalId);
                }
            }, 1000);
            cancelDefer.promise.then(function () {
                // toast('网络传输失败,请重试...');
            }, null, function () {
                // toast('网络传输中...');
            });

            //$rootScope.postQueue.push(url);
            $rootScope.isLoadingProcessing = true;

            let postData = ()=>{
                $http.post(url, param, {
                    timeout: cancelDefer.promise
                })
                    .success(function (data) {
                        $interval.cancel(intervalId);
                        $rootScope.isLoadingProcessing = false;
                        if (typeof(data) == 'string') {
                            try {
                                data = JSON.parse(data);
                                defer.resolve(data);
                            } catch (e) {
                                defer.reject(false);
                                $log.error('parse server data failed,the detail is ' + e);
                            }
                        }
                        else {
                            defer.resolve(data);
                        }
                        // if (data.length == undefined) {
                        //     if (data.code && (!arrayContains(finalData.RESPONSE_CODE, data.code))) {
                        //         defer.resolve(data);
                        //         return;
                        //     }
                        //     defer.resolve(data);
                        //     return;
                        // }
                    })
                    .error(function (data) {
                        $interval.cancel(intervalId);
                        if(data && data.code == 603 && canRePost){
                            postData();
                            canRePost =false;
                            return
                        }

                        $rootScope.isLoadingProcessing = false;
                        loadingScene.hide();
                        // if (!$ionicPopup._popupStack.length && (!data||!data.withoutNotify))
                            // showAlert('提示', '连接服务器失败,请检查你的网络设置！');
                        defer.reject(false);
                    });
            };

            postData();

            return withCancelPromise ? {
                requestPromise: defer.promise,
                cancelDefer: cancelDefer
            } : defer.promise;
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
         * 阿拉伯数字转化为中文数字（处理1-99）
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
         * 设置关卡数组一行两列显示，如果关卡数为奇数则最后一行单行显示
         * @param levels 关卡数组
         * @returns {Array}
         */
        function setLevel(levels) {
            var colArray = []; //存关卡的行数组
            var rowArray = [];  //存关卡的列数组
            if (!(levels.length % 2)) {   //如果为偶数个关卡
                levels.forEach(function (item, index) {
                    rowArray.push(item);
                    if (index % 2) {
                        colArray.push(rowArray);
                        rowArray = [];
                    }
                });
            } else {
                levels.forEach(function (item, index) {
                    rowArray.push(item);
                    if (index % 2) {
                        colArray.push(rowArray);
                        rowArray = [];
                    }
                    if (levels.length == index + 1) {
                        colArray.push(rowArray);
                    }
                });
            }
            return colArray;
        }

        /**
         * 共用中文拼音排序
         * @param array 源数组
         * @param levelDown 是否降序
         * @param sortBy 根据什么字段
         * @returns  新数组
         */
        function commonWordSortByPinYin(array,levelDown,sortBy){
            if(!angular.isArray(array)){
                return;
            }
            var newArray;
            try{
                if(levelDown){
                    newArray=array.sort(function compareFUnction(a,b){
                        if(sortBy)
                            return b[sortBy].localeCompare(a[sortBy]);
                        else
                            return b.localeCompare(a);
                    });
                }else{
                    newArray=array.sort(function compareFUnction(a,b){
                        if(sortBy)
                            return a[sortBy].localeCompare(b[sortBy]);
                        else
                            return a.localeCompare(b);

                    });

                }
            }catch (e){
                console.log("共用中文拼音排序出错：",e);
                newArray=array;
            }

            return newArray;
        }
        /*
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
         * 获取设备id
         */
        function getDeviceId() {
            var deviceId;
            try {
                deviceId = device.uuid || "11";
            } catch (e) {
                deviceId = "11";
            }
            return "11";
        }

        /**
         * 获取二维码
         */
        function getQRcodeUrl() {
            var defer = $q.defer();
            var timer = $interval(function () {
                if ($rootScope.sessionID) {
                    var url = $rootScope.ip + serverInterface.GET_QR_CODE + ';jsessionid=' + $rootScope.sessionID + '?timeStamp=' + new Date().getTime() + '&deviceId=' + getDeviceId();
                    defer.resolve(url);
                }
                $interval.cancel(timer);
            }, 100);
            return defer.promise;
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
         * 针对auto-box-con的做列个数自适应
         */
        function getFlexRowColCount() {
            var currentWindowWidt = window.innerWidth;
            if (currentWindowWidt <= finalData.DEVICE_SCREN_WIDTH.SMALL.MAX_WIDTH) {
                return finalData.DEVICE_SCREN_WIDTH.SMALL.COL_COUNT;
            }
            if (currentWindowWidt <= finalData.DEVICE_SCREN_WIDTH.MID.MAX_WIDTH) {
                return finalData.DEVICE_SCREN_WIDTH.MID.COL_COUNT;
            }
            if (currentWindowWidt <= finalData.DEVICE_SCREN_WIDTH.BIG.MAX_WIDTH) {
                return finalData.DEVICE_SCREN_WIDTH.BIG.COL_COUNT;
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
         * 打印当前试卷
         */
        function print() {
            if ($rootScope.platform.IS_WINDOWS || $rootScope.platform.IS_MAC_OS) {
                $('body').append(getPrintContent());
                alertDialog("正在处理,请稍后....",4500);
                setTimeout(function () {
                    window.print();
                }, 5000);
            }else{
                let template=`
                   <p>打印功能目前只支持windows电脑和苹果电脑</p>
                   <p>在电脑上下载安装智算365后，登录账号即可打印，不需要重复注册</p>
                `;
                showAlert('提示',template);
            }
        }

        function getPrintContent() {
            $('.print').remove();
            let $activePage = $('[nav-view=active]');
            let content = $activePage.find('ion-content').find('.scroll').children().not('.row').clone(); //获取试卷内容的html

            //去掉试卷小题中显示的知识点文字信息
            let knowledgeText = content.find('.question_content_knowledge_text');
            knowledgeText.each((i,v)=>{
                v.remove();
            });



            let $wrapper = $('<div></div>');
            let header =`
                <div class="print-header" style="width: 100%;text-align: center">
                     四川爱里尔科技有限公司&nbsp;&nbsp;&nbsp;http://www.xuexiV.com&nbsp;&nbsp;&nbsp;版权所有,翻印必究
                </div>
            `;
            $wrapper.append(header).append(content);

            $wrapper.children().addClass('print');
            return $wrapper.html();
        }

        function openWin() {
            var url = './print.html'; //转向网页的地址;
            var name = 'print';     //网页名称，可为空;
            return window.open(url, name, 'status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
        }
        /*速算shardingId*/
        function rapidCalcAppendShardingId(gameClazzId) {
            let gameSessionID;
                // gameClazzId = $ngRedux.getState().rc_selected_clazz.id;
            let shardingIndex = $rootScope.sessionID.indexOf(finalData.GAME_SHARDING_SPILT);
            if (shardingIndex > -1)
                gameSessionID = $rootScope.sessionID.substring(0, shardingIndex) + finalData.GAME_SHARDING_SPILT + gameClazzId;
            else
                gameSessionID = $rootScope.sessionID + finalData.GAME_SHARDING_SPILT + gameClazzId;

            console.log('gameSessionID!!!!!', gameSessionID);
            return gameSessionID;
        }

        function judgeAppVersion(){
            let appNumVersion = getAppNumVersion();
            if(!appNumVersion)return false;
            if(judgeSYS() == 1)  return true;
            if(judgeSYS() == 3)  return false;
            let ver = "1.8.8";
            let verArr = ver.split(".");
            let appVerArr = appNumVersion.split(".");
            while(appVerArr.length < verArr.length){
                appVerArr.push(0);
            }
            let isShow = true;
            for(let i = 0 ; i<appVerArr.length; i++){
                if(Number(appVerArr[i]) > Number(verArr[i])){
                    break;
                }else if(Number(appVerArr[i]) < Number(verArr[i])){
                    isShow = false;
                    break;
                }
            }
            return isShow;
        }

        function getSimulationClazzData (url,param,withCancelPromise) {
            console.log('SimulationClazz:::::::::::',param);
            let guideFlag = getSimulationClazzLocalData();
            if(!guideFlag || (guideFlag && (guideFlag.isGuideEnd || !guideFlag.isSameUser)) ) return; //引导结束
            let urlArr = [];
            if(guideFlag.hasPubedSimulationWork){ //引导过程已经布置了模拟作业，但是引导还没有结束，需要查看引导作业统计相关的内容
                urlArr = [
                    serverInterface.GET_ERROR_STU_Q,
                    serverInterface.GET_STUDENT_ANS,
                    serverInterface.ANALYSIS_PAPER_REPEAT,
                    serverInterface.WORK_STU_LIST,
                    serverInterface.GET_SCORE_DIST,
                    /*serverInterface.PUBED_WORK_LIST,*/
                    serverInterface.GET_PAPER_LIST
                ];

                let simuData = simulationData.default;
                if(url == serverInterface.GET_PAPER_LIST ){ //获取试卷信息
                    if(param.id != simuData.work_list.paperList[0].subjects[0].subjectId){
                        return;
                    }
                }else{
                    let simulationInstanceId = simuData.work_list.paperList[0].instanceId;
                    let paperInstanceId = getPaperInstanceId(param);
                    if(paperInstanceId != simulationInstanceId) return;
                }

                if (urlArr.indexOf(url) == -1) return;
                return getSimulationPostData(url,param,withCancelPromise);
            }

            urlArr = [
                serverInterface.GET_TEXTBOOK_LIST_V2,
                serverInterface.GET_LIB_LIST,
                serverInterface.GET_PAPER_LIST,
                serverInterface.GET_PUB_CLAZZ_LIST,
                serverInterface.PUB_WORK,
               /* serverInterface.PUBED_WORK_LIST,*/
                serverInterface.WORK_STU_LIST,
                serverInterface.ANALYSIS_PAPER_REPEAT,
                serverInterface.GET_ERROR_STU_Q,
                serverInterface.GET_SCORE_DIST,
                serverInterface.GET_STUDENT_ANS,
            ];

            if (urlArr.indexOf(url) == -1) return;
            return getSimulationPostData(url,param,withCancelPromise);
        }

        function getSimulationPostData(url,param,withCancelPromise){
            var defer = $q.defer();
            let cancelDefer = $q.defer();
            let data = "";
            let filter = "";
            let simuData = simulationData.default;

            let postData = (data)=> {
                switch(url){
                    case serverInterface.GET_TEXTBOOK_LIST_V2:
                        data =  angular.copy(simuData.textbook_list_v2);
                        break;
                    case serverInterface.GET_LIB_LIST:
                        data = angular.copy(simuData.all_paper_list);
                        break;
                    case serverInterface.GET_PAPER_LIST:
                        data = angular.copy(simuData.one_paper_list);
                        break;
                    case serverInterface.GET_PUB_CLAZZ_LIST:
                        data = angular.copy(simuData.get_pub_clazz_list);
                        break;
                    case serverInterface.PUB_WORK:
                        data = angular.copy(simuData.pub_work);
                        break;
                    case serverInterface.WORK_STU_LIST:
                        data = angular.copy(simuData.rank_stu_list);
                        break;
                    case serverInterface.PUBED_WORK_LIST:
                        data = angular.copy(simuData.work_list);
                        break;
                    case serverInterface.ANALYSIS_PAPER_REPEAT:
                        data = angular.copy(simuData.analysis);
                        break;
                    case serverInterface.GET_SCORE_DIST:
                        data = angular.copy(simuData.score_distribution);
                        break;
                    case serverInterface.GET_STUDENT_ANS:
                        filter = JSON.parse(param.filter);
                        data = angular.copy(simuData.stu_work_list[filter.sIds]);
                        break;
                    case serverInterface.GET_ERROR_STU_Q:
                        filter = JSON.parse(param.filter);
                        let paper = filter.paper;
                        if(paper.stat == '首次做'){
                            data = angular.copy(simuData.error_stu_list_first[paper.questionId]);
                        }else{
                            data = angular.copy(simuData.error_stu_list_second[paper.questionId]);
                        }
                        break;
                }

                if (typeof(data) == 'string') {
                    try {
                        data = JSON.parse(data);
                        defer.resolve(data);
                    } catch (e) {
                        defer.reject(false);
                        $log.error('parse server data failed,the detail is ' + e);
                    }
                }
                else {
                    defer.resolve(data);
                }
            };

            postData();

            return withCancelPromise ? {
                requestPromise: defer.promise,
                cancelDefer: cancelDefer
            } : defer.promise;
        }

        function getSimulationClazzLocalData() {
            let userName = $rootScope.user.loginName;

            //todo 寒假作业期间屏蔽引导,结束后再添加
            // let flagStorageArr = window.localStorage.getItem("teachingGuideFlag");
            let flagStorageArr = undefined;
            let rtnGuideFlag;
            flagStorageArr = flagStorageArr ? JSON.parse(flagStorageArr) :flagStorageArr;
            if(flagStorageArr && angular.isArray(flagStorageArr)){
                angular.forEach(flagStorageArr,(guideFlag)=>{
                    let flag = userName == guideFlag.teacherName; //不是同一个用户
                    if(!flag || guideFlag.isGuideEnd) return; //不是同一个用户或者引导已经结束
                    if(!guideFlag.isGuideEnd && flag !=guideFlag.isSameUser){
                        guideFlag.isSameUser = flag;
                        saveSimulationClazzLocalData(guideFlag);
                    }
                    if(guideFlag.isGuideAnimationEnd || !guideFlag.isSameUser){
                        $rootScope.isShowGuideFlag = false;
                    }
                    rtnGuideFlag = guideFlag;
                });
            }else {
                $rootScope.isShowGuideFlag = false;
            }
            return rtnGuideFlag;
        }

        function closeSimulationGuide() {
            let userName = $rootScope.user.loginName;
            let flagStorageArr = window.localStorage.getItem("teachingGuideFlag");
            flagStorageArr = flagStorageArr ? JSON.parse(flagStorageArr) :flagStorageArr;
            let closeFlag = false;

            if(flagStorageArr && angular.isArray(flagStorageArr)){
                angular.forEach(flagStorageArr,(guideFlag)=>{
                    let flag = userName == guideFlag.teacherName; //是同一个用户
                    if(flag){
                        guideFlag.isGuideEnd = true;//引导结束
                        guideFlag.isGuideAnimationEnd = true;//引导动画结束
                        guideFlag.hasPubedSimulationWork = true; //发布了模拟作业
                        $rootScope.isShowGuideFlag = false;
                        closeFlag = true;
                    }

                });
            }else {
                $rootScope.isShowGuideFlag = false;
            }
            if(closeFlag){
                window.localStorage.setItem("teachingGuideFlag",JSON.stringify(flagStorageArr));
            }
        }

        function saveSimulationClazzLocalData(guideFlag) {
            let userName = $rootScope.user.loginName;
            let flagStorageArr = window.localStorage.getItem("teachingGuideFlag");
            flagStorageArr = flagStorageArr ? JSON.parse(flagStorageArr) :flagStorageArr;
            let len = flagStorageArr.length;
            for(let i = 0 ; i<len;i++){
                if(flagStorageArr[i].teacherName == userName){
                    flagStorageArr[i]  = guideFlag;
                }
            }
            window.localStorage.setItem("teachingGuideFlag",JSON.stringify(flagStorageArr));
        }

        function getPaperInstanceId(param) {
            let filter = param.filter ;
            if(!filter) return;
            let data = JSON.parse(filter);
            let paperInstanceId = null;
            angular.forEach(data,function (value,key) {
                if(paperInstanceId) return;
                if(key == "paper"){
                    paperInstanceId = value.paperInstanceId;
                }
            });

            return paperInstanceId;
        }

        /**
         * 判断是否PC设备， win || osx
         */
        function isPC(){
            return $rootScope.platform.IS_WINDOWS || $rootScope.platform.IS_MAC_OS;
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
            getLocations: getLocations,
            showPopup: showPopup,
            getRowColArray: getRowColArray,
            getRowColArrayChecked: getRowColArrayChecked,
            getPopover: getPopover,
            getSelected: getSelected,
            removeListInfo: removeListInfo,
            showConfirm: showConfirm,
            arrayContains: arrayContains,
            commonPost: commonPost,
            convertToChinese: convertToChinese,
            setLevel: setLevel,
            convertToPercent: convertToPercent,
            interceptName: interceptName,
            getClickedIndex: getClickedIndex,
            getDeviceId: getDeviceId,
            getChangingDevVC: getChangingDevVC,
            getQRcodeUrl: getQRcodeUrl,
            removeLocalStorage: removeLocalStorage,
            getAppNumVersion: getAppNumVersion,
            getAppSvnVersion: getAppSvnVersion,
            minAndMaxInObjArray: minAndMaxInObjArray,
            getChangeLog: getChangeLog,
            getFlexRowColCount: getFlexRowColCount,
            judgePhone: judgePhone,
            judgeSYS: judgeSYS,
            print: print,
            commonWordSortByPinYin:commonWordSortByPinYin,
            rapidCalcAppendShardingId: rapidCalcAppendShardingId,
            commonPostSpecial:commonPostSpecial,
            judgeAppVersion:judgeAppVersion,
            getSimulationClazzLocalData:getSimulationClazzLocalData,
            saveSimulationClazzLocalData:saveSimulationClazzLocalData,
            getPaperInstanceId:getPaperInstanceId,
            closeSimulationGuide:closeSimulationGuide,
            isPC:isPC,
        }

    });
