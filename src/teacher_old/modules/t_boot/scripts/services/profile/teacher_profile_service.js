/**
 * Created by 彭建伦 on 2015/7/23.
 */
import BaseService from 'baseComponentForT/base_service';
import _each from 'lodash.foreach';
import _sortby from 'lodash.sortby';
import userManifest from './../../user_manifest';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {
    PROFILE_LOGIN_START
    , PROFILE_LOGIN_SUCCESS
    , PROFILE_LOGIN_FAIL
    , PROFILE_LOGOUT_START
    , PROFILE_LOGOUT_SUCCESS
    , PROFILE_LOGOUT_FAIL
    , FETCH_CLAZZ_LIST_START
    , FETCH_CLAZZ_LIST_SUCCESS
    , FETCH_CLAZZ_LIST_FAIL
    , SELECT_WORK_CLAZZ
} from './../../redux/action_typs';
import DTMgr from 'TdBase/index.js'

@Inject('$q', '$rootScope', '$http', 'commonService', 'gameManageService', 'serverInterface', 'finalData', '$ngRedux' ,'pageRefreshManager','$state','$ionicBackdrop','creditsInfoService')

class TeacherProfileService{

    constructor() {

    }

    /**
     * 过滤奥数班和普通班级
     */
    filterClazz(list){
        let normalClazzList = [];
        let omClazzList = [];
        angular.forEach(list,function (clazz) {
            if(clazz.type == 100){
                normalClazzList.push(clazz);
            }else if(clazz.type == 200){
                omClazzList.push(clazz);
            }
        });
        return {
            normal:normalClazzList,
            om:omClazzList
        }
    }


    /**
     * 处理管理员登录后，获取待批准的教师列表
     */
    @actionCreator
    handleAdminTeacherList(classInfo) {
        return (dispatch, getState)=> {
            let clazzList_ = classInfo.classes || [];
            this.getRootScope().clazzList = clazzList_;
            let wl_selected_clazz = getState().wl_selected_clazz;
            if (this.getRootScope().isAdmin && classInfo.teachers) {
                this.getRootScope().teacherList = [];
                angular.forEach(classInfo.teachers, group=> {
                    angular.forEach(group.schools, school=> {
                        this.getRootScope().teacherList.push(school);
                    })
                });
            }
            if (clazzList_.length && !wl_selected_clazz) {
                dispatch({type: SELECT_WORK_CLAZZ, payload: clazzList_[0]});
            }

            /*dispatch({type: FETCH_CLAZZ_LIST_SUCCESS, payload: {clazzList: clazzList_}});*/
            let addedClazz = this.filterClazz(clazzList_);
            dispatch({type:FETCH_CLAZZ_LIST_SUCCESS ,payload:{clazzList:addedClazz.normal,omClazzList:addedClazz.om}});
        };
    };


    /**
     * 登录
     * @param clazz
     */
    @actionCreator
    handleLogin(formData, callback, scope,bootstrapAutoLogin) {
        return (dispatch, getState)=> {
            callback = callback || this.noop;
            formData = formData || {};
            formData.deviceId = '11';
            formData.deviceType = this.getRootScope().platform.type;
            if (!formData.loginName)  formData.loginName = getState().profile_user_auth.user.loginName;
            console.log('PROFILE_LOGIN_START!!!!!!!!', PROFILE_LOGIN_START);

            var defer = this.$q.defer();
            dispatch({type: PROFILE_LOGIN_START});
            this.commonService.commonPost(this.serverInterface.LOGIN, formData).then((data)=> {
                // this.getRootScope().hideLoadingScene();
                this.getRootScope().isAdmin = !!data.manager; //是否是教研员账号
                if (!data) data = {};
                data.loginName = formData.loginName;
                if (data && data.code == 200) {
                    this.getRootScope().userConfig = data.config;
                    dispatch({type: PROFILE_LOGIN_SUCCESS, data: data}); //登录成功将信息传入store
                    this.creditsInfoService.fetchTeaScoreDetail();
                    DTMgr.send(data.login,data.loginName);
                    //获取班级列表
                    this.getTeacherClazzList().then(()=>{
                        this.loginSuccessAndGoHome(callback);
                        this.getRootScope().hideLoadingScene();
                        defer.resolve(data);
                    });
                } else if (data && data.code == 601 || data.code == 609) {   //第一次登录601:第一次登录，609:需要完善用户信息
                    this.getRootScope().userConfig = data.config;
                    dispatch({type: PROFILE_LOGIN_SUCCESS, data: data}); //登录成功将信息传入store
                    userManifest.setDefaultUser(getState().profile_user_auth.user.loginName.toUpperCase());
                    userManifest.addUserToUserList(getState().profile_user_auth.user);
                   /* this.getRootScope().hideLoadingScene();
                    defer.resolve(data);*/
                    this.creditsInfoService.fetchTeaScoreDetail();
                    this.getTeacherClazzList().then(()=>{
                        this.getStateService().go('home.work_list');
                        this.getRootScope().hideLoadingScene();
                        defer.resolve(data);
                    });
                } else {
                    dispatch({type: PROFILE_LOGIN_FAIL, payload: data});
                    // scope.$emit('loginFail', data);//发给 onresumeHandler 处理自动登录等功能
                    // if(bootstrapAutoLogin){this.getStateService().go('system_login');} //程序启动自动登录失败，回到登录页面手动登录
                    if(bootstrapAutoLogin){callback(false);} //程序启动自动登录失败，回到登录页面手动登录
                    this.getRootScope().hideLoadingScene();
                    defer.resolve(data);
                }
            },(data)=>{
                dispatch({type: PROFILE_LOGIN_FAIL, payload: data});
                this.getRootScope().hideLoadingScene();
                // callback(false);
            });
            return defer.promise;
        }
    }

    /**
     * 获取班级列表
     */
    @actionCreator
    getTeacherClazzList() {
        return (dispatch)=> {
            let defer = this.$q.defer();
            dispatch({type: FETCH_CLAZZ_LIST_START});
            this.commonService.commonPost(this.serverInterface.SELECT_CLAZZ_LIST).then((classInfo)=> {
                this.getRootScope().hideLoadingScene();
                if (classInfo.code === 200) {
                    this.handleAdminTeacherList(classInfo);
                    defer.resolve(classInfo);
                } else {
                    dispatch({type: FETCH_CLAZZ_LIST_FAIL});
                    defer.resolve(classInfo);
                }
            });

            return defer.promise;
        }
    };

    /**
     * 登录成功后的处理
     */
    loginSuccessAndGoHome(callback) {
        callback = callback||angular.noop;
        let lastLoginInfo = {};
        let PAGE_STATE = {
            WORK: 'home.work_list',
            GAME: 'home.pub_game_list',
            MESSAGE: 'home.clazz_manage'
        };
        lastLoginInfo.homeOrClazz = this.getRootScope().homeOrClazz;
        if (this.getRootScope().lastLoginInfo && this.getRootScope().lastLoginInfo.lastPage)
            lastLoginInfo.lastPage = this.getRootScope().lastLoginInfo.lastPage;
        else
            lastLoginInfo.lastPage = PAGE_STATE.WORK;//默认到已发布作业列表页面
        //localStorage.setItem("lastLoginInfo", JSON.stringify(lastLoginInfo));


        let switchTo = this.checkFromGame();
        /*----------------界面的跳转(判断是否是游戏回来)----------------------*/
        if (switchTo) {
            try {
                let game = switchTo.tPlayGame.game;
                let Url = switchTo.tPlayGame.Url;
                //TODO:先保留这块，避免其他模块出问题
                this.gameManageService.game.gameDesc = game.gameDesc;
                this.gameManageService.game.gameGuid = game.gameGuid;
                this.gameManageService.game.gameName = game.gameName;
                this.gameManageService.game.gameMode = game.gameMode;
                this.commonService.removeLocalStorage('switchTo');
                this.getStateService().go(Url);
                return;
            } catch (e) {
                console.log('===========error==============');
                console.log(switchTo);
                this.goHome(callback);
            }
        }
        /*----------------------------界面的跳转(判断是否是游戏回来)end---------------------------------*/
        //正常（不是玩游戏回来的）自动登录
        this.goHome(callback);
    }

    //判断是否是游戏过来的
    checkFromGame() {
        let switchTo = this.commonService.getLocalStorage('switchTo');
        if (switchTo && switchTo.isGame && switchTo.tPlayGame && switchTo.tPlayGame.Url && switchTo.tPlayGame && switchTo.tPlayGame.game)
            return switchTo;
        else
            return false;
    }

    /**
     * 把存入localStory的新注册的帐号和当前登录账号匹配，匹配到了就提示
     */
    /*第一次登陆后台会返回601*/
    getNewRegisterForLoginTip(){
        /*let newRegisterForLoginTipList=this.commonService.getLocalStorage('newRegisterForLoginTipList'),
            currentLoginName=this.getRootScope().user&&this.getRootScope().user.loginName;
        if(!newRegisterForLoginTipList) return;
        let findIndex=-1,item,i=0;
        for(i;i<newRegisterForLoginTipList.length;i++){
            item=newRegisterForLoginTipList[i];
            if(item.loginName===currentLoginName){
                findIndex=i;
                break;
            }
        }
        if(findIndex>-1){
            let clazzCount=newRegisterForLoginTipList[findIndex].clazzCount===2?'两':'一';
            let template = `<p>您创建了${clazzCount}个班级，请在“班级”信息下方点击“通知”学生加入，将班级号告知家长。</p>`;
            this.$ionicBackdrop.retain();
            this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '去通知').then((res)=>{
                if(res){
                    this.$ionicBackdrop.release();
                    this.getStateService().go('home.clazz_manage');
                    newRegisterForLoginTipList.splice(i,1);
                    this.commonService.setLocalStorage('newRegisterForLoginTipList',newRegisterForLoginTipList);
                }
            });
        }*/
    }

    //正常（不是玩游戏回来的）自动登录
    goHome(callback) {
        //判断是否要显示班级申请人数提示
        let teacherList = this.getRootScope().teacherList || [];
        let classList = this.getRootScope().clazzList;
        let teacherInfoList = [];
        let classInfoList = [];//TODO:
        if (classList && classList.length == 0) {
            let template = '<p>您还没有创建班级，请点击下方的“班级”，然后再点击“+”创建班级。</p>';
            // let template = '<p>您还没有创建班级，点击“班级”，然后再点击“+”创建班级</p>';
            //let template='<p>您还没有创建班级，请进入“我”的页面，点击“班级管理”，然后创建班级</p>';
            this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
        }

        angular.forEach(classList, function (clazz) {
            if (clazz.checkingNum > 0)classInfoList.push({
                name: clazz.name,
                num: clazz.checkingNum
            });
        });

        angular.forEach(teacherList, function (school) {
            if (school.teacherNum > 0)teacherInfoList.push({
                name: school.schoolName,
                num: school.teacherNum
            })
        });

        //弹出提示 教研员：待审批的教师列表,待审批班级的学生列表；普通老师：待审批班级的学生列表
        let rootTemplate = '<div></div>';
        let isExistTeacherFlag = false;
        if (teacherInfoList.length && teacherInfoList.length > 0) {
            let template = $('<div><p>目前有<span style="color: red;font-weight: bold;font-size: 19px">老师</span>等待您的批准加入</p></div>').css({'text-align': 'center'});
            teacherInfoList.forEach(function (info) {
                let item = $(`<p  style="font-size: 17px;">${info.name}:<span style="color: red;font-weight: bold;font-size: 19px">${info.num}</span>人</p>`);
                template.append(item);
            });
            rootTemplate = $(rootTemplate).append(template);
            isExistTeacherFlag = true
        }
        //不需要提示老师批准学生申请了
        /*if (classInfoList.length && classInfoList.length > 0) {
            if (isExistTeacherFlag) rootTemplate = $(rootTemplate).append('<div><hr></div>');
            let template = $('<div><p>目前有<span style="color: red;font-weight: bold;font-size: 19px">学生</span>等待您的批准加入</p></div>').css({'text-align': 'center'});
            classInfoList.forEach(function (info) {
                let item = $(`<p  style="font-size: 17px;">${info.name}:<span style="color: red;font-weight: bold;font-size: 19px">${info.num}</span>人</p>`);
                template.append(item);
            });
            rootTemplate = $(rootTemplate).append(template);
        }
        if (isExistTeacherFlag || (classInfoList.length && classInfoList.length > 0)) {
            this.commonService.showAlert("温馨提示", $(rootTemplate).html(), '确定');
        }*/
        callback();
    }


    /**
     * 处理自动session过期后自动登录的逻辑
     * @returns {*}
     */
    handleAutoLogin() {
        let defer = this.$q.defer();
        this.autoLoginCancelDeferQueue =this.autoLoginCancelDeferQueue|| [];
        let handleAutoLoginSuccess = (data)=> {
            this.autoLoginCancelDeferQueue.forEach((cancelDefer)=>cancelDefer.reject(true));
            this.autoLoginCancelDeferQueue.splice(0,this.autoLoginCancelDeferQueue.length);
            if (data.code == 200) {
                this.getRootScope().sessionID = data.jsessionid;
                this.getRootScope().userConfig = data.config;
                this.pageRefreshManager.update(this.getStateService().current, this.getStateService().params);
                DTMgr.send(data.login,data.loginName);
                defer.resolve();
            }
        };
        let handleAutoLoginFail = ()=> {
            this.autoLoginCancelDeferQueue.forEach((cancelDefer)=>cancelDefer.reject(true));
            this.autoLoginCancelDeferQueue.splice(0,this.autoLoginCancelDeferQueue.length);
            this.getRootScope().needAutoLogin = false;
            this.getStateService().go('system_login');
        };

        if(this.autoLoginCancelDeferQueue.length){
            defer.resolve();
        }else{
            if( !this.getRootScope().user||!this.getRootScope().user.loginName) {
                defer.resolve(false);
                return defer.promise;
            }
            let requestInfo = this.commonService.commonPost(this.serverInterface.LOGIN, {
                loginName: this.getRootScope().user.loginName,
                deviceId: '11',
                deviceType: this.getRootScope().platform.type
            }, true);
            requestInfo.requestPromise.then(handleAutoLoginSuccess, handleAutoLoginFail);
            this.autoLoginCancelDeferQueue.push(requestInfo.cancelDefer);
        }
        return defer.promise;
    };

    /**
     * 注销登录
     * @param clazz
     */
    @actionCreator
    logout(callback) {
        return (dispatch)=> {
            dispatch({type: PROFILE_LOGOUT_START});
            this.commonService.commonPost(this.serverInterface.LOGOUT)
                .then((data)=> {
                    if (data.code == 200) {
                        dispatch({type: PROFILE_LOGOUT_SUCCESS});
                        callback.call(this, true);
                    } else {
                        dispatch({type: PROFILE_LOGOUT_FAIL, error: data});
                        callback.call(this, false);
                    }
                });
        }
    }


    /**
     * 验证图形验证码
     */
    validateImageVCode(vCode) {
        let defer = this.$q.defer();
        if (vCode) {
            this.commonService.validateImageVCode(vCode).then(data=> {
                if (data.code === 200) {
                    defer.resolve(true);
                } else {
                    defer.resolve(false);
                }
            });
        } else {
            defer.resolve(false);
        }
        return defer.promise;
    };

    /**
     * 从后端获取sessionId
     * @returns {*}
     */
    getSessionId() {  //获取sessionId
        let defer = this.$q.defer();
        this.$http.get(this.serverInterface.GET_SESSION_ID).success((data)=> {
            if (data.code == 200) {
                defer.resolve(data);
            } else {
                defer.reject(data);
            }
        }).error((data)=> {
            defer.reject(data);
        });

        return defer.promise;
    };

    getUserListByPhone(phone,callBack){
        let params={
            type:'T',
            loginName: phone
        };
        this.commonService.commonPostSpecial(this.serverInterface.GET_USER_LIST_BY_PHONE,params).then((data)=> {
            if (data.code === 200) {
                callBack(data.list);
                return;
            }
            callBack([]);
        },(res)=>{
            callBack([]);
        });
    }

    noop() {
    }

    /**
     * 确认教师是否拥有奥数的权限（登录成功后，用户配置会随登录接口返回存入rootScope.userConfig中，根据userConfig判断）
     * @returns {boolean}
     */
    checkTeacherOlyAuthority(){
        let uc = this.getRootScope().userConfig;
        const hasAuthority = 'enable';
        if(!uc){return false}

        for (let param in uc){
            if(!uc.hasOwnProperty(param) || typeof uc[param] !== 'string'){
                continue;
            }
            try{
                if(JSON.parse(uc[param]).OMath === hasAuthority){return true}
            }catch (e){}
        }
        return false;
    }
}

export default TeacherProfileService;




