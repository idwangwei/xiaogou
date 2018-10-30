/**
 * Created by 邓小龙 on 2015/7/24.
 * @description
 *
 */
import services from './../index';
'use strict';
services.factory('commonService',
    function ($q, $log, $interval,$compile,$timeout, $http, $rootScope, $ionicLoading, cssMap, finalData, serverInterface, $ionicPopup) {
        /**
         * 公共颜色数组，用于抽取颜色
         */
        //var colorArray=new Array(cssMap.BG_COLOR_LIGHT,cssMap.BG_COLOR_STABLE,cssMap.BG_COLOR_POSITIVE,cssMap.BG_COLOR_CALM,
        //    cssMap.BG_COLOR_BALANCED,cssMap.BG_COLOR_ENERGIZED,cssMap.BG_COLOR_ASSERTIVE,cssMap.BG_COLOR_ROYAL,cssMap.BG_COLOR_DARK);
        var colorArray = cssMap.BG_COLOR_ARRAY.concat();//复制常量数组
        var color = "";
        $rootScope.postQueue=[];

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
         * 获取图片验证码
         * @returns 验证码图片地址
         */
        function getValidateImageUrl() {
            var defer = $q.defer();
            var timer = $interval(function () {
                if ($rootScope.sessionID) {
                    var url = serverInterface.GET_VALIDATE_IMAGE + ';jsessionid=' + $rootScope.sessionID + '?timeStamp=' + new Date().getTime();
                    defer.resolve(url);
                }
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
            $http.post(serverInterface.VALIDATE_IMAGE_V_CODE + ';jsessionid=' + $rootScope.sessionID, {imgVC: imageVCode}).success(function (data) {
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
                if (data.code == 200||data.code==552) {
                    defer.resolve(data);
                } else {
                    // showAlert('Code:' + data.code, data.msg);
                    showAlert('温馨提示', data.msg);
                    //$log.error("getTelVC：code:" + data.code + "Msg:" + data.msg);
                }
            });
            return defer.promise;
        }

        /**
         * 获取手机验证码 用于设备更换模板
         * @param telePhone 手机号码
         */
        function getChangingDevVC(telePhone) {
            var defer = $q.defer();
            $http.post(serverInterface.CHANGE_DEVICE_PHONE_V_CODE, {telephone: telePhone}).success(function (data) {
                if (data.code == 200) {
                    defer.resolve(data);
                } else {
                    showAlert('Code:' + data.code, data.msg);
                    //$log.error("getTelVC：code:" + data.code + "Msg:" + data.msg);
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
         * 获取下拉菜单的所选中的值
         * @param id 控件id
         */
        function getSelectedItem(id) {
            var selectItems = document.querySelector("#" + id);
            var options = selectItems.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    return options[i].value;
                }
            }
        }

        /**
         * 设置下拉菜单的所选中的值
         * @param id 控件id
         */
        function setSelectedItem(id, value) {
            var selectItems = document.querySelector("#" + id);
            var options = selectItems.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value == value) {
                    options[i].selected = true;
                    break;
                }
            }
        }

        /**
         * 页面移除列表指定对象
         * @param list 目标列表
         * @param id  id
         */
        function removeListInfo(list, id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    list.splice(i, 1);
                    break;
                }
            }
            return list;
        }

        /**
         * @description 公共提示框
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

        function toast(msg) {
            if (window.parent.plugins && window.parent.plugins.toast) {
                window.parent.plugins.toast.showLongTop(msg);
            } else {
                $ionicLoading.show({
                    template: msg,
                    duration: 6000,
                    backdrop: false
                });
            }
        }
        /**
         * @description 公共post方法 返回Map
         * @param url http地址
         * @param param 要传的参数
         * @param withCancelPromise 是否要返回cancel promise
         * @returns promise
         */
        function commonPost(url, param,withCancelPromise) {
            param = param || '';
            var defer = $q.defer();
            let cancelDefer = $q.defer();
            let canRePost = true; //如果session过期,自动登录后再发一次请求

            let counter = 0;
            let NOTIFY_BUSY = 'busy';
            let intervalId = $interval(function () {
                counter++;
                if (counter == 6) {
                    cancelDefer.notify(NOTIFY_BUSY);
                }
                if (counter == 30) {
                    cancelDefer.resolve(true);
                    $interval.cancel(intervalId);
                }
            }, 1000);
            cancelDefer.promise.then(function(){
                // toast('网络传输失败,请重试...');
            }, null, function () {
                // toast('网络传输中...');
            });

            //$rootScope.postQueue.push(url);
            $rootScope.isLoadingProcessing = true;
            let postData = ()=>{
                $http.post(url, param,{
                    timeout:cancelDefer.promise  //请求超时的时间为6秒
                })
                    .success(function (data) {
                        $interval.cancel(intervalId);

                        $rootScope.isLoadingProcessing = false;
                        if (typeof(data) == 'string') {
                            try {
                                data = JSON.parse(data);
                            } catch (e) {
                                $log.error('parse server data failed,the detail is ' + e);
                            }
                        }
                        // if (data.length == undefined) {
                        //     if (data.code && (arrayContains(finalData.RESPONSE_CODE, data.code))) {
                        //         defer.resolve(data);
                        //         return;
                        //     }
                        //     defer.resolve(data);
                        //     return;
                        // }
                        loadingScene.hide();
                        defer.resolve(data);
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
                        // if (!data||!data.withoutNotify)
                        //     showAlert('提示', '连接服务器失败,请检查你的网络设置！');
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
         * 确认弹出框
         * @param title 提示标题
         * @param contentTemplate  提示的内容模板
         * return  confirmPromise  提示框关闭时返回用户操作的promise
         */
        function showConfirm(title, contentTemplate) {
            var title = title || "信息提示";
            var contentTemplate = contentTemplate || "您确定要执行该操作吗？";
            var confirmPromise = $ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
                template: contentTemplate,
                title: title,
                buttons: [
                    {
                        text: "<b>确定</b>",
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

        /**
         * 获取设备id
         */
        function getDeviceId() {
            var deviceId;
            try {
                deviceId = device.uuid || "11";
            } catch (e) {
                //deviceId="";
                deviceId = "11";
            }
            return deviceId;
        }

        /**
         * 获取二维码
         */
        function getQRcodeUrl() {
            var defer = $q.defer();
            var timer = $interval(function () {
                if ($rootScope.sessionID) {
                    var url = serverInterface.GET_QR_CODE + ';jsessionid=' + $rootScope.sessionID + '?timeStamp=' + new Date().getTime() + '&deviceId=1';
                    defer.resolve(url);
                }
                $interval.cancel(timer);
            }, 100);
            return defer.promise;
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
         * 判断学生的班级状态
         * @param allList
         * @param notPassedList
         * @param passedList
         * @returns {number}
         */
        function checkStuClazzStatus(allList,notPassedList,passedList){
            if(allList.length==0){
                return finalData.STU_CLAZZ_STATUS.NO_CLAZZ;
            }
            if(passedList.length==0){
                return finalData.STU_CLAZZ_STATUS.ALL_CLAZZ_NOT_PASSED;
            }
            if(notPassedList.length==0){
                return finalData.STU_CLAZZ_STATUS.ALL_CLAZZ_PASSED;
            }
            if(notPassedList.length>0&&passedList.length>0){
                return finalData.STU_CLAZZ_STATUS.ANY_CLAZZ_PASSED;
            }
        }

        /**
         * 获取家长切换的当前学生id和name
         */
//            function getStuParam(){
//                var studentId = [];
//                var studentName =[];
//                var defer = $q.defer();
//                commonPost(serverInterface.GET_STUDENT_LIST).then(function (data){
//                    if(data.code==200 && data.students.length>0){
//                        data.students.forEach(function(stu){
//                            studentId.push(stu.id);
//                            studentName.push(stu.name);
//                        });
//                        var localStudent = getLocalStorage('student');
//                        if(!localStudent || studentId.indexOf(localStudent.id)<0){
//                            var student={id:studentId[0],name:studentName[0]};
//                            $rootScope.student=student;
//                            setLocalStorage('student',student);
//                        }else{
//                            $rootScope.student=localStudent;
//                        }
//                    }else if(!data.students || data.students.length==0){
//                        $rootScope.student="";
//                    }
//                    defer.resolve(true);
//                });
//                return defer.promise;
//            }
        /**
         * 获取学生列表
         * @returns {*}
         */
        function getStudentList() {
            var defer = $q.defer();
            commonPost(serverInterface.P_GET_STU_AND_CLASS).then(function (data) {
                debugger;
                $rootScope.student = [];
                if (data.code == 200 && data.students.length > 0) {
                    angular.forEach(data.students,function (stu) {
                        stu.passedClazzList=[];
                        stu.notPassedClazzList=[];
                        stu.normalClazzList = [];
                        stu.selfStudyClazzList = [];
                        stu.olyMathClazzList = [];
                        angular.forEach(stu.classes,function(stuClass){
                            if (stuClass.status == 0) {//审核中的
                                stu.notPassedClazzList.push(stuClass);
                            }
                            if(stuClass.status==1){//审核通过的
                                stu.passedClazzList.push(stuClass);
                            }
                            if(stuClass.type === 900) stu.selfStudyClazzList.push(stuClass);
                            if(stuClass.type === 100) stu.normalClazzList.push(stuClass);
                            if(stuClass.type === 200) stu.olyMathClazzList.push(stuClass);
                        });
                        var stuClazzStatus=checkStuClazzStatus(stu.classes,stu.notPassedClazzList,stu.passedClazzList);
                        $rootScope.student.push({
                            studentId: stu.id,
                            studentName: stu.name,
                            clazzList:stu.normalClazzList,
                            allClazzList:stu.normalClazzList.concat(stu.olyMathClazzList),
                            selfStudyClazzList: stu.selfStudyClazzList,
                            passedClazzList: stu.classes,
                            stuClazzStatus:stuClazzStatus
                        });
                    });
                }
                defer.resolve(true);
            });
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
         * 简略判断系统
         */
        function judgeSYS(){
            return $rootScope.platform.type = $rootScope.platform.IS_ANDROID?1:
                ($rootScope.platform.IS_IPHONE || $rootScope.platform.IS_IPAD)?2:3;
        }

        /**
         * 打印当前试卷
         */
        function printForNewPaper() {
            if ($rootScope.platform.IS_WINDOWS || $rootScope.platform.IS_MAC_OS) {
                $('body').append(getPrintContentNew());
                alertDialog("正在处理,请稍后....",3500);
                setTimeout(function () {
                    window.print();
                }, 4000);
            }else{
                let template=`
                   <p>打印功能目前只支持windows电脑和苹果电脑</p>
                `;
                showAlert('提示',template);
            }
        }

        function getPrintContentNew() {
            $('.print').remove();
            let $activePage = $('[nav-view=active]');
            let content = $activePage.find('ion-content').find('.scroll').children().clone(); //获取试卷内容的html
            let $wrapper = $('<div></div>');
            let header =`
                <div class="print-header" style="width: 100%;text-align: center">
                     四川爱里尔科技有限公司&nbsp;&nbsp;&nbsp;http://xuexiV.com&nbsp;&nbsp;&nbsp;版权所有,翻印必究
                </div>
            `;
            $wrapper.append(header).append(content);
            $wrapper.children().addClass('print');
            return $wrapper.html();
        }


        function printForOldPaper(scope) {
            if ($rootScope.platform.IS_WINDOWS || $rootScope.platform.IS_MAC_OS) {
                alertDialog("正在处理,请稍后....",3000);
                getPrintOldContent(scope).then(function (res) {
                    if(res){
                        $('body').append(res);
                        $timeout(function () {
                            window.print();
                        }, 3000);
                    }
                });

            }else{
                let template=`
                   <p>打印功能目前只支持windows电脑和苹果电脑</p>
                `;
                showAlert('提示',template);
            }
        }

        function getPrintOldContent(scope) {
            $('.print').remove();
            var printPaper=require('partials/print_paper.html');
            var defer=$q.defer();
            let compileContent=$compile(printPaper)(scope);
            $timeout(function () {
                let $activePage = $(compileContent);
                let content = $activePage.find('ion-content').find('.scroll').children().clone(); //获取试卷内容的html
                let $wrapper = $('<div></div>');
                let header =`
                <div class="print-header" style="width: 100%;text-align: center">
                     四川爱里尔科技有限公司&nbsp;&nbsp;&nbsp;http://xuexiV.com&nbsp;&nbsp;&nbsp;版权所有,翻印必究
                </div>
            `;
                $wrapper.append(header).append(content);
                $wrapper.children().addClass('print');
                defer.resolve($wrapper.html());
            },1000);
            return defer.promise;
        }


        return {
            setColorArray: setColorArray,
            getColor: getColor,
            getValidateImageUrl: getValidateImageUrl,
            validateImageVCode: validateImageVCode,
            getTelVC: getTelVC,
            validateTelVC: validateTelVC,
            getChangingDevVC: getChangingDevVC,
            showFormValidateInfo: showFormValidateInfo,
            getSelectedItem: getSelectedItem,
            setSelectedItem: setSelectedItem,
            removeListInfo: removeListInfo,
            alertDialog: alertDialog,
            commonPost: commonPost,
            commonPostSpecial: commonPostSpecial,
            setLocalStorage: setLocalStorage,
            getLocalStorage: getLocalStorage,
            arrayContains: arrayContains,
            convertToPercent: convertToPercent,
            convertToChinese: convertToChinese,
            interceptName: interceptName,
            showConfirm: showConfirm,
            getDeviceId: getDeviceId,
            getQRcodeUrl: getQRcodeUrl,
            showAlert: showAlert,
//                getStuParam:getStuParam,
            getStudentList: getStudentList,
            getAppNumVersion: getAppNumVersion,
            getAppSvnVersion: getAppSvnVersion,
            minAndMaxInObjArray: minAndMaxInObjArray,
            getRowColArray: getRowColArray,
            getChangeLog: getChangeLog,
            judgeSYS:judgeSYS,
            printForNewPaper:printForNewPaper,
            printForOldPaper:printForOldPaper,
            checkStuClazzStatus:checkStuClazzStatus
        }
    });
