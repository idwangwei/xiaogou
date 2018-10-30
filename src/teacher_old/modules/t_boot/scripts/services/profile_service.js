/**
 * Created by 彭建伦 on 2015/7/23.
 */
import services from './index';
services.service('profileService',
    function ($http, $location, $q, $log, $state, $rootScope, serverInterface, finalData, commonService, gameManageService) {
        "ngInject";


        this.ip = "";
        /**
         * 获取班级列表
         */
        this.getTeacherClazzList = function () {
            return commonService.commonPost(serverInterface.SELECT_CLAZZ_LIST);
        };
        /**
         * 登录
         * @description 处理登录，在登录成功后获取教师的班级列表，并将班级列表挂在$rootScope上
         * @param formData 登录表单数据
         * @returns promise
         */
        this.login = function (formData) {
            var defer = $q.defer();
            var me = this;
            commonService.commonPost(serverInterface.LOGIN, formData).then(function (data) {
                if (data.manager != undefined)
                    $rootScope.isAdmin = data.manager; //是否是教研员账号
                else
                    $rootScope.isAdmin=false;
                me.getTeacherClazzList({isAdmin:$rootScope.isAdmin}).then(function (classInfo) {
                    if (classInfo){
                        $rootScope.clazzList = classInfo.classes || [];
                        if($rootScope.isAdmin&&classInfo.teachers){
                            $rootScope.teacherList=[];
                            angular.forEach(classInfo.teachers,function(group){
                                angular.forEach(group.schools,function (school) {
                                    $rootScope.teacherList.push(school);
                                })
                            })
                        }
                    }
                    defer.resolve(data);
                });
            });
            return defer.promise;
        };
        /**
         * 密码找回-根据账号下发手机验证码到其绑定的手机
         * @param loginName 用户账号
         */
        this.getTelVCByLoginName = function (loginName) {
            var param = {
                loginName: loginName,
                type: finalData.TYPE_TEACHER
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
         * 校验密保问题
         * @param  param 密保答案参数
         */
        this.validateSecurity = function (param) {
            return commonService.commonPost(serverInterface.VALIDATE_SECURITY, param);
        };

        /**
         * @description 重置密码--通过密保方式
         * @loginName 账号
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
         * @return promise
         */
        this.resetPassWordByVCode = function (loginName, password, telVC) {
            var param = {
                loginName: loginName,
                password: password,
                telVC: telVC
            };
            return commonService.commonPost(serverInterface.RESET_PASSWORD, param);
        };

        /**
         * 老师注册
         * @param formData 注册的表单数据
         * @returns promise
         */
        this.register = function (params) {

            return commonService.commonPost(serverInterface.REGISTER, params);
        };

        /**
         * 退出系统
         * @returns {promise}
         */
        this.logout = function () {
            return commonService.commonPost(serverInterface.LOGOUT);
        };

        /**
         * 获取sessionId
         */
        this.getSessionId = function () {
            $rootScope.sessionID = '';
            $http.get(serverInterface.GET_SESSION_ID).success(function (resp) {
                if (resp.code == 200) {
                    $rootScope.sessionID = resp.jsessionid;
                }
            });
        };

        /**
         * 查看该设备是否被允许登录
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
         * 登录成功或者是首次登录成功后填写完个人信息后跳转到首页
         * 这里需要做以下的内容：
         * 1.存储这次是登录云端网络还是课堂网络
         * 2.根据最后是停留在哪个页面[作业|游戏|消息]而前往相应的页面
         *
         */
        this.loginSuccessAndGoHome = function () {
            var lastLoginInfo = {};
            var PAGE_STATE = {
                WORK: 'home.work_list',
                GAME: 'home.pub_game_list',
                MESSAGE: 'home.clazz_manage'
            };
            lastLoginInfo.homeOrClazz = $rootScope.homeOrClazz;
            if ($rootScope.lastLoginInfo && $rootScope.lastLoginInfo.lastPage)
                lastLoginInfo.lastPage = $rootScope.lastLoginInfo.lastPage;
            else
                lastLoginInfo.lastPage = PAGE_STATE.WORK;//默认到已发布作业列表页面
            localStorage.setItem("lastLoginInfo", JSON.stringify(lastLoginInfo));

            /*----------------界面的跳转(判断是否是游戏回来)----------------------*/
            if (checkFromGame()) {
                try {
                    var switchTo = checkFromGame();
                    var game = switchTo.tPlayGame.game;
                    var Url = switchTo.tPlayGame.Url;
                    gameManageService.game.gameDesc = game.gameDesc;
                    gameManageService.game.gameGuid = game.gameGuid;
                    gameManageService.game.gameName = game.gameName;
                    gameManageService.game.gameMode = game.gameMode;
                    commonService.removeLocalStorage('switchTo');
                    $state.go(Url);
                    return;
                } catch (e) {
                    console.log('===========error==============');
                    console.log(checkFromGame());
                    goHome(lastLoginInfo, PAGE_STATE);
                }
            }
            /*----------------------------界面的跳转(判断是否是游戏回来)end---------------------------------*/
            goHome(lastLoginInfo, PAGE_STATE);
        }

        //判断是否是游戏过来的
        function checkFromGame() {
            var switchTo = commonService.getLocalStorage('switchTo');
            if (switchTo && switchTo.isGame && switchTo.tPlayGame && switchTo.tPlayGame.Url && switchTo.tPlayGame && switchTo.tPlayGame.game) {
                return switchTo;
            } else {
                return false;
            }
        }

        //正常（不是玩游戏回来的）自动登录
        function goHome(lastLoginInfo, PAGE_STATE) {


            //判断是否要显示班级申请人数提示
            let teacherList= $rootScope.teacherList||[],classList = $rootScope.clazzList||[], teacherInfoList = [],classInfoList = [];
            //for (let clazz of classList) {
            //    if (clazz.checkingNum > 0)infoList.push({
            //        name: clazz.name,
            //        num: clazz.checkingNum
            //    });
            //}
            if (classList && classList.length == 0) {
                let template = '<p>您还没有创建班级，点击“班级”，然后再点击“+”创建班级</p>';
                //let template='<p>您还没有创建班级，请进入“我”的页面，点击“班级管理”，然后创建班级</p>';
                commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
            }
            classList.forEach(function (clazz) {
                if (clazz.checkingNum > 0)classInfoList.push({
                    name: clazz.name,
                    num: clazz.checkingNum
                });
            });
            teacherList.forEach(function (school) {
                if(school.teacherNum>0)teacherInfoList.push({
                    name:school.schoolName,
                    num:school.teacherNum
                })
            });
            var rootTemplate='<div></div>';
            let isExistTeacherFlag=false;
            if(teacherInfoList.length&&teacherInfoList.length>0){
                let template = $('<div><p>目前有<span style="color: red;font-weight: bold;font-size: 19px">老师</span>等待您的批准加入</p></div>').css({'text-align': 'center'});
                teacherInfoList.forEach(function (info) {
                    let item = $(`<p  style="font-size: 17px;">${info.name}:<span style="color: red;font-weight: bold;font-size: 19px">${info.num}</span>人</p>`);
                    template.append(item);
                });
                rootTemplate=$(rootTemplate).append(template);
                isExistTeacherFlag=true
            }
            if (classInfoList.length&&classInfoList.length>0) {
                if(isExistTeacherFlag)
                    rootTemplate=$(rootTemplate).append('<div><hr></div>');
                let template = $('<div><p>目前有<span style="color: red;font-weight: bold;font-size: 19px">学生</span>等待您的批准加入</p></div>').css({'text-align': 'center'});
                classInfoList.forEach(function (info) {
                    let item = $(`<p  style="font-size: 17px;">${info.name}:<span style="color: red;font-weight: bold;font-size: 19px">${info.num}</span>人</p>`);
                    template.append(item);
                });
                rootTemplate=$(rootTemplate).append(template);
            }
            if(isExistTeacherFlag||(classInfoList.length&&classInfoList.length>0)){
                commonService.showAlert("温馨提示", $(rootTemplate).html(), '确定');
            }
            switch (lastLoginInfo.lastPage) {
                case PAGE_STATE.WORK:
                    $state.go(PAGE_STATE.WORK, {category: $rootScope.homeOrClazz.type, workType: 2});
                    break;
                case PAGE_STATE.GAME:
                    $state.go(PAGE_STATE.GAME);
                    break;
                case PAGE_STATE.MESSAGE:
                    $state.go(PAGE_STATE.MESSAGE);
                    break;
                default:
                    $state.go(PAGE_STATE.WORK, {category: $rootScope.homeOrClazz, workType: 2});
                    break;
            }
        }

        /*处理自动session过期后自动登录的逻辑*/
        this.autoLoginCancelDeferQueue = [];
        this.handleAutoLogin = ()=> {
            let defer = $q.defer();
            let that = this;
            let handleAutoLoginSuccess = (data)=> {
                if (data.code == 200) {
                    that.autoLoginCancelDeferQueue.forEach((cancelDefer)=>cancelDefer.reject(true));
                    $rootScope.sessionID = data.jsessionid;
                    defer.resolve();
                }
            };
            let handleAutoLoginFail = ()=> {
                that.handleAutoLogin();
            };
            let requestInfo = commonService.commonPost(serverInterface.LOGIN, {
                loginName: $rootScope.user.loginName,
                deviceId: '11',
                deviceType: $rootScope.platform.type
            }, true);
            requestInfo.requestPromise.then(handleAutoLoginSuccess, handleAutoLoginFail);
            this.autoLoginCancelDeferQueue.push(requestInfo.cancelDefer);

            return defer.promise;
        };

        /**
         * 获取寒假直播数据
         * @returns {*}
         */
        this.fetchWinterBroadcastData = function () {
            let defer = $q.defer();
            commonService.commonPost(serverInterface.GET_WINTER_BROADCAST_DATA,{limit:50,minScore:0}).then((data)=> {
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

        /**
         * 删除班级（5个学生之内）
         */
        this.deleteSelectClazz = function(clazzId){
            let params={groupId:clazzId};
            let defer = $q.defer();
            commonService.commonPostSpecial(serverInterface.DELETE_CLAZZ,params).then((data)=> {
                if (data.code === 200) {
                    defer.resolve(data);
                }else{
                    defer.resolve(false);
                }
            },(res)=>{
                defer.resolve(false);
            });
            return defer.promise;
        }
    });

