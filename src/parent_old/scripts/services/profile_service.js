/**
 * Created by 邓小龙 on 2015/7/23.
 * 华海川（重构）2015/10/8
 */
import DTMgr from 'TdBase/index.js'
define(['./index'], function (services) {
    services.service('profileService', ['$http', '$q', '$log', '$rootScope', 'serverInterface', 'finalData', 'commonService', '$state', 'studentService',
        function ($http, $q, $log, $rootScope, serverInterface, finalData, commonService, $state, studentService) {
            let me = this;
            this.pStudentList=[];//家长帐号下的学生列表
            /**
             * 登录
             * @param formData 登录表单数据
             * @returns promise
             */
            this.login = function (formData) {
                return commonService.commonPost(serverInterface.LOGIN, formData);
            };
            /**
             *@description 退出系统
             * @return promise
             */
            this.logout = function () {
                return commonService.commonPost(serverInterface.LOGOUT);
            };


            /**
             * 密码找回-根据账号下发手机验证码到其绑定的手机
             * @param loginName 用户账号
             */
            this.getTelVCByLoginName = function (loginName) {
                var param = {
                    loginName: loginName,
                    type: finalData.TYPE_PARENT
                };
                return commonService.commonPost(serverInterface.APPLY_PHONE_PASSWORD_V_CODE, param);
            };

            /**
             * 根据用户账户获取该账号所关联手机号的后4位
             * @param loginName
             * @returns  promise;
             */
            this.getUserPhone = function (loginName) {
                var param = {loginName: loginName};
                return commonService.commonPost(serverInterface.APPLY_REFER_PHONE_INFO, param);
            };


            /**
             * 根据用户账户获取该账号所关联手机号的后4位以及学生信息
             * @param loginName
             * @returns  promise;
             */
            this.getUserPhoneAndChildren = function (loginName) {
                var param = {loginName: loginName};
                return commonService.commonPost(serverInterface.APPLY_REFER_PHONE_INFO_CHILDREN, param);
            };

            /**
             * @description 重置密码--通过密保方式
             * @phone 手机号码
             * @param newPassword 新密码
             * @return promise
             */
            this.resetPassWordBySecurity = function (loginName, newPassword) {
                var param = {
                    loginName: loginName,
                    password: newPassword
                };
                return commonService.commonPost(serverInterface.RESET_PASSWORD, param);
            };

            /**
             * @description 重置密码--通过手机验证码方式
             * @phone 手机号码
             * @param newPassword 新密码
             * @param idArry id数组
             * @return promise
             */
            this.resetPassWordByVCode = function (loginName, password, telVC,idArry) {
                var param = {
                    loginName: loginName,
                    password: password,
                    telVC: telVC
                };
                if(idArry&&idArry.length)
                    param.studentIds=idArry.join(",");
                return commonService.commonPost(serverInterface.RESET_PASSWORD, param);
            };

            /**
             * 家长注册
             * @param formData 注册的表单数据
             * @returns promise
             */
            this.register = function (formData) {
                var defer = $q.defer();
                var param = {
                    telephone: formData.cellphone,
                    password: formData.password,
                    telVC: formData.telVC
                };
                commonService.commonPost(serverInterface.REGISTER, param).then(function (data) {
                    if (data.code == 200) {
                        defer.resolve(data.loginName);
                    } else {
                        defer.resolve(data);
                    }
                });
                return defer.promise;
            };

            /**
             * 获取sessionId
             */
            this.getSessionId = function () {
                var defer = $q.defer();
                $rootScope.sessionID = '';
                $http.get(serverInterface.GET_SESSION_ID).success(function (resp) {
                    if (resp.code == 200) {
                        $rootScope.sessionID = resp.jsessionid;
                    }
                    defer.resolve(resp);
                });
                return defer.promise;
            };

            /**
             * 获取登录类型
             */
            this.getLoginType = function () {
                if ($rootScope.user && $rootScope.user.loginName.toLocaleUpperCase().indexOf("P") > 0) {//说明是当前是主监护人登录
                    return "P";
                }
                if ($rootScope.user && $rootScope.user.loginName.toLocaleUpperCase().indexOf("G") > 0) {//说明是当前是第二监护人登录
                    return "G";
                }
            };

            /**
             * 查看该设备是否允许登录
             * @returns {promise}
             */
            this.allowDevice = function () {
                return commonService.commonPost(serverInterface.ALLOW_DEVICE);
            };

            /**
             * 扫描二维码
             * @param params
             * @returns {promise}
             */
            this.allowQRCode = function (params) {
                return commonService.commonPost(serverInterface.ALLOW_CODE, params);
            };

            /**
             * 变更rootScope上的学生班级列表
             * @param stuId
             * @param clazzInfo
             * @param opt 新增或删除
             */
            this.changeRootStuClazzList=function(stuId,clazzInfo,opt){
                if(!stuId||!clazzInfo||!opt)
                    return;
                angular.forEach($rootScope.student,function (stu) {
                    if(stu.studentId==stuId){
                        if(opt==1){//新增
                            let notPassedClazz=[],passedClazz=[];
                            stu.clazzList.push(clazzInfo);
                            angular.forEach(stu.clazzList,function (clazz) {
                                if (clazz.status == 0) {//审核中的
                                    notPassedClazz.push(clazz);
                                }
                                if(clazz.status==1){//审核通过的
                                    passedClazz.push(clazz);
                                }
                            });
                            stu.stuClazzStatus=commonService.checkStuClazzStatus(stu.clazzList,notPassedClazz,passedClazz);
                        }
                        if(opt==2){//删除
                            let clazz,findIndex=-1,notPassedClazz=[],passedClazz=[];
                            for(let i=0,j=stu.clazzList.length;i<j;i++){
                                clazz=stu.clazzList[i];
                                if(clazz.id==clazzInfo.id){
                                    findIndex=i;
                                    continue;
                                }
                                if (clazz.status == 0) {//审核中的
                                    notPassedClazz.push(clazz);
                                }
                                if(clazz.status==1){//审核通过的
                                    passedClazz.push(clazz);
                                }
                            }
                            if(findIndex>-1){
                                stu.clazzList.splice(findIndex,1);
                                stu.stuClazzStatus=commonService.checkStuClazzStatus(stu.clazzList,notPassedClazz,passedClazz);
                            }

                        }
                    }

                })
            };

            /**
             * 家长获取孩子以及孩子的班级
             */
            this.getStudentsAndClasses=function(){
                commonService.commonPost(serverInterface.P_GET_STU_AND_CLASS).then(function (data) {
                    $rootScope.student = [];
                    if (data.code == 200 && data.students.length > 0) {
                        var template = $('<div><p style="font-size: 16px">老师还未批准下列班级申请</p></div>').css({'text-align': 'center'});
                        var notPassedClassFlag=false;
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
                            if(stu.notPassedClazzList.length>0){
                                notPassedClassFlag=true;
                                var item = $(`<p  style="font-size: 17px;text-align: left">${stu.name}</p>`);
                                template.append(item);
                                angular.forEach(stu.notPassedClazzList,function (notPassedClazz) {
                                    var teacher_name = notPassedClazz.teacherName, showTeacherName;
                                    if (teacher_name&&teacher_name.length>0) {
                                        var len = teacher_name.length;
                                        showTeacherName = teacher_name[0];
                                        for (var i = 1; i < len; i++) {
                                            showTeacherName += '*';
                                        }
                                    }
                                    var clazzItem = $(`<p  style="font-size: 17px;">${notPassedClazz.name}<br><span>(${showTeacherName}老师)</span></p>`);
                                    template.append(clazzItem);
                                });

                            }
                            var stuClazzStatus=commonService.checkStuClazzStatus(stu.classes,stu.notPassedClazzList,stu.passedClazzList);
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
                        //不再提示老师未批准通过的人数
                        /*if(notPassedClassFlag)
                            commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');*/
                    }
                    var lastLoginInfo = {};
                    var PAGE_STATE = {
                        WORK: 'home.work_list',
                        GAME: 'home.game_list',
                        MESSAGE: 'home.message_list'
                    };
                    if ($rootScope.lastLoginInfo && $rootScope.lastLoginInfo.lastPage)
                        lastLoginInfo.lastPage = $rootScope.lastLoginInfo.lastPage;
                    else
                        lastLoginInfo.lastPage = PAGE_STATE.WORK;//默认到已发布作业列表页面
                    localStorage.setItem("lastLoginInfo", JSON.stringify(lastLoginInfo));
                    switch (lastLoginInfo.lastPage) {
                        case PAGE_STATE.WORK:
                            $state.go(PAGE_STATE.WORK);
                            break;
                        case PAGE_STATE.GAME:
                            $state.go(PAGE_STATE.GAME);
                            break;
                        case PAGE_STATE.MESSAGE:
                            $state.go(PAGE_STATE.MESSAGE);
                            break;
                        default :
                            $state.go(PAGE_STATE.WORK);
                            break;
                    }
                });
            };

            this.getUserListByPhone=function(phone,callBack){
                let params={
                    type:'P',
                    loginName: phone
                };
                commonService.commonPostSpecial(serverInterface.GET_USER_LIST_BY_PHONE,params).then((data)=> {
                    if (data.code === 200) {
                        callBack(data.list);
                        return;
                    }
                    callBack([]);
                },(res)=>{
                    callBack([]);
                });
            }




            /**
             * 登录成功或者是首次登录成功后填写完个人信息后跳转到首页
             * 这里需要做以下的内容：
             * 1.存储这次是登录云端网络还是课堂网络
             * 2.根据最后是停留在哪个页面[作业|游戏|消息]而前往相应的页面
             *
             */
            this.loginSuccessAndGoHome = function () {
                me.getStudentsAndClasses();
            };
            this.showUnAuditClasses = function (studentList) {
               /* let counter = 0;
                let showInfoList = [];
                angular.forEach(studentList,function (student) {
                    commonService.commonPost(serverInterface.P_GET_STU_CLASS, {id: student.studentId}).then(function (data) {
                        if (data && data.classes) {
                            student.passedClazzList=[];
                            student.notPassedClazzList=[];
                            data.classes.forEach(function (clazz) {
                                if (clazz.status == 0) {//审核中的
                                    if (student.clazzList) {
                                        student.clazzList.push(clazz);
                                    } else {
                                        student.clazzList = [];
                                        student.clazzList.push(clazz);
                                    }
                                    student.notPassedClazzList.push(clazz);
                                }
                                if(clazz.status==1){//审核通过的
                                    student.passedClazzList.push(clazz);
                                }
                            });
                            if (student.clazzList && student.clazzList.length)
                                showInfoList.push(student);

                        }
                        counter++;
                        if (counter == studentList.length && showInfoList.length) {
                            console.log(showInfoList);
                            var template = $('<div><p style="font-size: 16px">老师还未批准下列班级申请</p></div>').css({'text-align': 'center'});
                            showInfoList.forEach(function (stu) {

                                var item = $(`<p  style="font-size: 17px;text-align: left">${stu.studentName}</p>`);
                                template.append(item);
                                stu.clazzList.forEach(function (clazz) {
                                    var teacher_name = clazz.teacher, showTeacherName;
                                    var len = teacher_name.length;
                                    if (len) {
                                        showTeacherName = teacher_name[0];
                                        for (var i = 1; i < len; i++) {
                                            showTeacherName += '*';
                                        }
                                    }
                                    var clazzItem = $(`<p  style="font-size: 17px;">${clazz.name}<br><span>(${showTeacherName}老师)</span></p>`);
                                    template.append(clazzItem);
                                });
                            });
                            commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
                        }
                    });
                });*/
            };
            /*处理自动session过期后自动登录的逻辑*/
            this.autoLoginCancelDeferQueue =this.autoLoginCancelDeferQueue|| [];
            this.handleAutoLogin = ()=> {
                let that = this;
                let defer = $q.defer();
                let handleAutoLoginSuccess = (data)=> {
                    that.autoLoginCancelDeferQueue.forEach((cancelDefer)=>cancelDefer.reject(true));
                    that.autoLoginCancelDeferQueue.splice(0,that.autoLoginCancelDeferQueue.length);
                    if (data.code == 200) {
                        $rootScope.sessionID = data.jsessionid;
                        DTMgr.send(data.login,data.loginName);
                        defer.resolve();
                    }
                };
                let handleAutoLoginFail = ()=> {
                    that.autoLoginCancelDeferQueue.forEach((cancelDefer)=>cancelDefer.reject(true));
                    that.autoLoginCancelDeferQueue.splice(0,that.autoLoginCancelDeferQueue.length);
                    $rootScope.needAutoLogin = false;
                    $state.go('system_login');
                };
                if(that.autoLoginCancelDeferQueue.length){
                    defer.resolve();
                }else{
                    if( !$rootScope.user||!$rootScope.user.loginName) {
                        defer.resolve(false);
                        return defer.promise;
                    }
                    let requestInfo = commonService.commonPost(serverInterface.LOGIN, {
                        loginName: $rootScope.user.loginName,
                        deviceId: '11',
                        //deviceType: $rootScope.platform.type
                        deviceType: 1
                    }, true);
                    requestInfo.requestPromise.then(handleAutoLoginSuccess, handleAutoLoginFail);
                    that.autoLoginCancelDeferQueue.push(requestInfo.cancelDefer);
                }


                return defer.promise;
            };

            this.fetchWinterBroadcastData = function () {
                let defer = $q.defer();
                commonService.commonPost(serverInterface.GET_WINTER_BROADCAST_DATA,{publishType:5,limit:50,minScore:0}).then((data)=> {
                    if (data.code !== 200) {
                        defer.resolve(false);
                        return;
                    }
                    defer.resolve(data);
                },()=>{
                    defer.reject();
                });
                return defer.promise;
            };

            this.parentShareFirst = function(param){
                return  commonService.commonPost(serverInterface.PARENT_SHARE_GET_REWARD,param);
            }
        }]);
});