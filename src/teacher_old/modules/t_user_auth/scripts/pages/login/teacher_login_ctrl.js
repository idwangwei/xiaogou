/**
 * Created by 彭建伦 on 2015/7/21.
 */
import $ from 'jquery';
import userManifest from './../../../../t_boot/scripts/user_manifest';
import _uniqBy from 'lodash.uniqby';
import {Inject, View, Directive, select} from '../../module';

@View('system_login', {
    url: '/system_login',
    template: require('./system_login.html'),
    styles: require('./system_login.less'),
    cache: false,
    inject:[
        '$scope',
        '$rootScope',
        '$log',
        '$state',
        '$interval',
        '$timeout',
        '$ionicLoading',
        'profileService',
        'teacherProfileService',
        'commonService',
        'serverInterface',
        '$q',
        '$ionicPopup',
        'finalData',
        '$ngRedux',
        '$ionicHistory',
        '$ionicBackdrop',
        '$compile',
        'creditsInfoService',
        '$ocLazyLoad'
    ]
})
class TeacherLoginCtrl {
    $log;
    $q;
    $ngRedux;
    $ionicLoading;
    $ionicPopup;
    $interval;
    $timeout;
    $ionicBackdrop;
    serverInterface;
    commonService;
    profileService;
    $ionicHistory;
    $compile;
    $ocLazyLoad;
    initCtrl = false;//初始化ctrl flag
    telVcBtnText = "点击获取";//按钮文字显示
    telVcBtn = false;//按钮不可以点击状态
    needVCode = false;//需要图形验证码(默认不需要图形验证码)
    needTelCode = false;//需要手机验证码
    submitClicked = false;
    formData = { //表单信息
        userName: '',
        password: ''
    };
    isBackspace = false;

    @select(state=>state.profile_user_auth.isLogIn) isLogin;
    @select(state=>state.profile_user_auth.user) user;
    // @select(state=>state.wl_selected_clazz) wl_selected_clazz;
    // @select(state=>state.profile_user_auth.user.loginName) loginName;


    constructor() {
        this.initData();
        this.savePWflag = true;
    }

    /**
     * 初始化
     */
    initData() {
        this.isIos = this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
        var user = userManifest.getUserManifest();
        this.USER_MANIFEST_T = user || {};
        this.USER_MANIFEST_T.userList = _uniqBy(this.USER_MANIFEST_T.userList, 'loginName');
        if (user && user.defaultUser && user.defaultUser != "NONE_USER") {
            this.formData.userName = user.defaultUser;
        }
        let pw = userManifest.getPassWordByLoginName(this.formData.userName);
        this.formData.password = pw;

        this.showForgetUserName();
    }

    onAfterEnterView() {
        this.$ionicHistory.clearCache();
        this.$ionicHistory.clearHistory();
    }

    /**
     * 获取图片验证码
     */
    getValidateImage = function () {
        this.commonService.getValidateImageUrl().then(data=> {
            this.validateImageUrl = data;
        });
    };

    /**
     * 登录（提交表单处理）
     */
    handleSubmit(form) {
        this.submitClicked = true;
        //检查名称是否合法
        let nameValid = this.checkUserName();
        if (!nameValid)return;

        if (form.$valid) {//表单数据合法，就登录
            this.login();
            return;
        }
        //不合法就提示相关信息
        var formParamList;
        if (this.needVCode && !this.formData.vCode) {
            formParamList = ['userName', 'password', 'vCode'];//需要验证的字段
        } else if (this.needTelCode && !this.formData.telVC) {
            formParamList = ['userName', 'password', 'telVC'];//需要验证的字段
        } else if (this.needTelCode && this.needVCode) {
            formParamList = ['userName', 'password', 'telVC', 'vCode'];//需要验证的字段
        } else {
            formParamList = ['userName', 'password'];//需要验证的字段
        }
        let errorMsg = this.commonService.showFormValidateInfo(form, formParamList);
        this.commonService.alertDialog(errorMsg.msg);
    };

    /**
     * 发起用户登录请求并处理返回结果
     */
    login() {
        if (!this.needVCode && !this.needTelCode) {//如果不需要验证码
            this.getCurrentSessionId();
            return;
        }
        if (this.needVCode) { //如果需要验证码
            this.$ionicLoading.show({template: "正在处理，请稍后..."});
            this.teacherProfileService.validateImageVCode(this.formData.vCode).then(data=> {//先验证图形验证码是否正确
                this.$ionicLoading.hide();//隐藏载入指示器
                if (data) {//正确
                    this.loginHandle();
                    return;
                } else {
                    this.commonService.alertDialog("验证码不正确!");
                    this.getValidateImage();
                }
            });
            return;
        }
        this.loginHandle();
    }


    /**
     * 登陆处理
     */
    loginHandle(loginParam) {
        var param = {
            loginName: this.formData.userName,
            password: this.formData.password,
            // deviceId: commonService.getDeviceId() ? commonService.getDeviceId() : '11',
            deviceId: '11',
            deviceType: this.getRootScope().platform.type
        };

        if (loginParam) $.extend(param, loginParam);

        if (this.telephone) {
            param.telVC = this.formData.telVC;
        }
        loadingScene && loadingScene.show();
        //在store所有字段中加入 userName（账号）/，区别不用用户数据s ;后跟回调函数
        this.$ngRedux.setKey(this.formData.userName, ()=> {
            // this.teacherProfileService.handleLogin(param, this.handleLoginSuccess.bind(this), this.getScope());
            this.handleLogin(param, null, this);
        });
    }

    handleLogin(param) {
        this.teacherProfileService.handleLogin(param, this.handleLoginSuccess.bind(this)).then((data) => {
            this.getRootScope().hideLoadingScene();
            if (data) {
                // this.commonService.alertDialog(data.msg, 1500);
                if (data.code == 200) {
                    this.getRootScope().$emit('loginSuccess', data);//发给 onresumeHandler 处理自动登录等功能
                    this.saveUserInfo(data);
                    // this.getTeacherClazzList();
                    // this.teacherProfileService.getTeacherClazzList().then((data)=> {
                    //     this.teacherProfileService.loginSuccessAndGoHome(this.handleLoginSuccess.bind(this));
                    // });
                } else if (data.code == 601 || data.code == 609) {//第一次登录
                    this.getRootScope().$emit('loginSuccess', data);//发给 onresumeHandler 处理自动登录等功能
                    this.saveUserInfo(data);

                    let flagStorageArr = window.localStorage.getItem("teachingGuideFlag");
                    flagStorageArr = flagStorageArr ? JSON.parse(flagStorageArr) :flagStorageArr;
                    if(!flagStorageArr || (flagStorageArr && !angular.isArray(flagStorageArr))){
                        flagStorageArr = [];
                    }
                    let guideFlag = {
                        isGuideEnd: false, //引导是否结束(发布了作业才算结束)
                        isGuideAnimationEnd :false, //引导动画是否结束
                        hasPubedSimulationWork: false, //是否发布了模拟作业
                        teacherName: param.loginName, //需要引导的教师端账号
                    };
                    flagStorageArr.push(guideFlag);
                    window.localStorage.setItem("teachingGuideFlag",JSON.stringify(flagStorageArr));

                  /*
                   let template = `<p>您已经创建好班级，
请在"班级"信息下方点击图标 "<img height="27px" src="${require('tImages/common/inform_stu.png')}"/>"，将班级号告知家长。</p>`;

                    this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '去通知').then(() => {
                        this.go('home.clazz_manage');
                    });*/

                    // this.getTeacherClazzList();
                    // this.teacherProfileService.getTeacherClazzList().then(()=> {
                    //this.getStateService().go('basic_info_first'); //不用去基本信息问题
                    // });

                } else if (data.code == 602 || data.code == 604) {
                    this.needVCode = true;
                    this.getValidateImage();
                    this.commonService.alertDialog(data.msg, 1500);
                } else if (data.code == 606) {
                    this.needVCode = true;
                    this.telephone = data.telephone;
                    var title = '信息提示';
                    var info = '不是常用登录设备，需要手机验证码验证,点击确定，我们会把手机验证码发送到:' + data.telephone;
                    this.commonService.showConfirm(title, info).then(res=> {
                        if (res) {
                            this.needTelCode = true;
                            this.getTelVC();
                        }
                    });
                } else if (data.code == 607) {
                    this.needVCode = true;
                    this.commonService.alertDialog(data.msg, 1500);
                } else {
                    this.needVCode = true;
                    this.getRootScope().$emit('loginFail', data);//发给 onresumeHandler 处理自动登录等功能
                    this.commonService.alertDialog(data.msg, 1500);
                }
            } else {
                this.needVCode = true;
                this.getRootScope().$emit('loginFail', data);//发给 onresumeHandler 处理自动登录等功能
                this.commonService.alertDialog(data.msg, 1500);
            }

        });
    }

    //获取班级列表
    getTeacherClazzList() {
        this.teacherProfileService.getTeacherClazzList().then((data) => {
            if (data && data.code === 200) {
            } else {
                console.error("获取班级失败");
            }

        });
    }

    /**
     * 将数据存入localStorage 后期删除
     * @param data
     */
    saveUserInfo(data) {
        this.getRootScope().user = {
            userId: data.userId,
            loginName: data.loginName,
            name: data.name,
            gender: data.gender,
            role: "T",
            isFirstLogin:data.code == 601
        };
        this.commonService.setLocalStorage('T_user', {loginName: data.loginName});
        // this.creditsInfoService.setTeaScoreDetail(data.credits||0);
    }


    /**
     * 获取手机验证码
     */
    getTelVC() {
        this.showTextForWait();
        this.commonService.getChangingDevVC().then(data => {
            if (data) {
                this.commonService.alertDialog("短信验证码已下发,请查收!", 1500);
                this.$log.debug("tvc:" + data.telRC);
            }
        });
    };

    /**
     * 发送手机验证码后等待60秒
     */
    showTextForWait() {
        this.telVcBtn = true;
        var count = 60;
        this.interval = this.$interval(()=> {
            if (count == 0) {
                this.telVcBtnText = "点击获取";
                this.telVcBtn = false;
                this.$interval.cancel(this.interval);
            } else {
                this.telVcBtnText = count + "秒";
                count--;
            }
        }, 1000);
    }

    onBeforeLeaveView() {
        if (this.interval) {
            this.$interval.cancel(this.interval);
        }
    }


    /**
     * 获取sessionId
     */
    getCurrentSessionId() {
        this.$ionicLoading.show();
        this.teacherProfileService.getSessionId().then((data)=> {
            this.$ionicLoading.hide();
            if (data && data.code == 200) {
                this.getRootScope().sessionID = data.jsessionid;
                this.loginHandle();
            } else {
                let info = '连接' + this.title + '网络失败';
                this.commonService.showConfirm('', info, '重连').then((data)=> {
                    if (data) {
                        this.login();
                    }
                })
            }
        });
    }


    /**
     * 切换系统
     * @param name 系统名称[教师|学生|家长]
     */
    switchSystem(name) {
        switch (name) {
            case "teacher":
                window.localStorage.setItem('currentSystem', JSON.stringify({id: 'teacher'}));
                window.location.href = './teacher_index.html';
                break;
            case "student":
                window.localStorage.setItem('currentSystem', JSON.stringify({id: 'student'}));
                window.location.href = './student_index.html';
                break;
            case "parent":
                window.localStorage.setItem('currentSystem', JSON.stringify({id: 'parent'}));
                window.location.href = './parent_index.html'
        }
    }

    changeInputName() {
        this.wantToChangeLoginName = true;
        let userNameEle = document.getElementById('userName');
        this.$timeout(() => {
            this.showInputHelpFlag = false;
            this.formData.userName = '';
            this.formData.password = '';
            //userNameEle.focus();
            //不是ios系统就自动获取焦点
            if (!this.isIos) userNameEle.focus();
        }, 300);
    }

    checkUserName() {
        //this.showInputHelpFlag = false;
        let userName = this.formData.userName;
        let warning = ()=> {
            this.$ionicPopup.alert({
                title: '账号格式不正确',
                template: '<p>老师账号应是如下形式：</p>'
                + '<p>1.手机号+T<br/>或<br/>2.手机号+T+数字</p>' +
                '<p style="color: #6B94D6">例如：13812345678T</p>',
                okText: '确定'
            });
        };
        if (!userName)return;
        
        if(!this.showInputHelpFlag && userName.match(/^1\d{10}$/g) ){
            this.formData.userName+="T";
            return true;
        }
        
        if (!this.showInputHelpFlag && !userName.match(/^1\d{10}(T|t)\d*$/g) && !userName.match(/^1\d{10}(T|t)\d*(@super|@Super|@SUPER)$/g)) {//当没有展示背景的时候
            warning();
            return false;
        }
        return true;
    }


    /**
     * 根据localStorage，是否显示忘记账号
     */
    showForgetUserName() {
        // let tUserNameList = this.commonService.getLocalStorage("tUserNameList") || [];
        // this.showForgetFlag = tUserNameList.length == 0 ? false : true;
        this.showForgetFlag = true; //始终显示'忘记账号';
    };

    /**
     * 查看之前注册成功的帐号
     */
    forgetLoginName() {
        if (this.showInputHelpFlag) return;//已经显示了账号列表就返回
        this.userList = this.USER_MANIFEST_T.userList;
        if (this.userList && this.userList.length) {
            this.showInputHelpFlag = true;
            //todo: 账号列表的特殊样式
            return;
        }
        this.commonService.showAlert("温馨提示", "教师账号是您注册时用的手机号码后面加t，如：13812345678t。");

        /* let tUserNameList = this.commonService.getLocalStorage("tUserNameList") || [];
         if (tUserNameList.length) {
         this.go("forget_user_name", "forward");
         return;
         }
         this.commonService.showAlert("温馨提示", "教师账号是您注册时用的手机号码后面加t，如：13812345678t");*/
    }

    handleLoginSuccess() {
        if (this.isLogin && this.getStateService().current.name === 'system_login') {
            this.savePassword();
            userManifest.setDefaultUser(this.formData.userName.toUpperCase());
            userManifest.addUserToUserList(this.user);
            this.getLocalStoreStateForLoginUser();
        }
    }

    getLocalStoreStateForLoginUser() {
        if (this.submitClicked) {
            this.$ocLazyLoad.load('t_home_teaching_work').then(()=>{
                this.go('home.work_list');
            })
        }
    }


    autoCompleteName(person) {
        this.formData.userName = person.hasOwnProperty('gender') ? person.loginName : person;
        let pw = userManifest.getPassWordByLoginName(this.formData.userName);
        this.formData.password = pw;
        this.savePWflag = true;

        let passEle = document.getElementById('password');
        this.$timeout(()=> {
            //passEle.focus();
            this.showInputHelpFlag = false;
            //不是ios系统就自动获取焦点
            if (!this.isIos) passEle.focus();
        }, 300);
    }

    showInputHelp(handleType) {
        this.USER_MANIFEST_T = userManifest.getUserManifest();
        if (handleType === 'focus') {
            if (this.formData.userName) return;
            this.userList = this.USER_MANIFEST_T.userList;
            if (this.when_input_null_only_show_once_count !== 0
                && this.when_input_null_only_show_once_count !== undefined) return;
            if (this.userList && this.userList.length && !this.wantToChangeLoginName) {
                this.showNameList();
                /*hack windows端 focus click事件bug 描述：输入框触发了focus事件后，弹出层仍然触发了click事件*/
                this.hackWindowsClick = true;
                this.$timeout.cancel(this.hackClickTimeout);
                this.hackClickTimeout = this.$timeout(() => this.hackWindowsClick = false, 1200);
            }
            return;
        }
        if (!this.USER_MANIFEST_T) {
            this.showInputHelpFlag = false;
            return;
        }

        if (this.formData.userName && this.formData.userName.match(/^1\d{10}/g)) {
            let pw = userManifest.getPassWordByLoginName(this.formData.userName);
            this.formData.password = pw;
        }

        if (this.formData.userName && !this.formData.userName.match(/^1\d{10}/g) && (!this.USER_MANIFEST_T.userList || !this.USER_MANIFEST_T.userList.length)) {
            this.showInputHelpFlag = false;
            return;
        }
        if (!this.formData.userName) {
            this.userList = this.USER_MANIFEST_T.userList;
            if (this.userList && this.userList.length)    this.showNameList();
            return;
        }
        if (this.formData.userName.match(/^1\d{10}$/g)) {
            console.log('formData.userName', this.formData.userName);
            if (this.isBackspace) return;  //如果是退格操作，不显示inputHelp
            let phone = angular.copy(this.formData.userName).substr(0, 11);
            this.teacherProfileService.getUserListByPhone(phone, this.getUserListCallBack.bind(this));
            return;
        }
        this.showInputHelpFlag = false;
    }

    /*点击浮层的时候隐藏弹出框*/
    hideInputHelp(ev) {
        /*hack windows端 focus click事件bug 描述：输入框触发了focus事件后，弹出层仍然触发了click事件*/
        if (this.hackWindowsClick) {
            this.hackWindowsClick = false;
            return;
        }
        if (!this.formData.userName) {
            this.when_input_null_only_show_once_count++;
        } else {
            this.when_input_null_only_show_once_count = 0;
        }
        if (ev.target.dataset.areaName === 'floating-layer') {
            this.showInputHelpFlag = false;
        }
    }

    /**
     * userName input 退格是否显示InputHelp的处理
     * @param ev
     */
    handleKeyBackspace(ev) {
        ev.keyCode === 8 ? this.isBackspace = true : this.isBackspace = false;
    }

    showNameList() {
        this.showInputHelpFlag = true;
        let timeSpan = this.isIos ? 300 : 0;
        this.$timeout(()=> {
            //$('body').trigger('click');//让输入框失去焦点，隐藏键盘
            $('#userName')[0].blur();//让输入框失去焦点，隐藏键盘
        }, timeSpan);
    }

    getUserListCallBack(userList) {
        if (this.formData.userName && this.formData.userName.match(/^1\d{10}/g) && userList && userList.length) {
            this.userList = userList;
            this.showNameList();
        }
    }

    showHowToDo() {
        var alertContent = `
           <p>1.在家长登录页面，点击“注册”，一键注册家长账号和学生账号。</p>
           <p>2.切换到学生登录页面，用学生账号和密码登录。</p>
           <p>3.点击“学霸驯宠记”，即可开始体验。</p>
        `;
        this.commonService.showAlert("想要马上体验学生做题？", alertContent);
    }

    /**
     * 保存密码
     */
    savePasswordFlag() {
        this.savePWflag = !this.savePWflag;
    }

    savePassword() {
        if (this.savePWflag) this.user.passWord = this.formData.password;//this.student.password;
        this.user.savePWflag = this.savePWflag;
    }

}

export default TeacherLoginCtrl;






