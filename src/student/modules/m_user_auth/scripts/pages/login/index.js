/**
 * Created by qiyuexi on 2018/1/8.
 */
import userManifest from './user_manifest';
import _uniqBy from 'lodash.uniqby';
import {Inject, View, Directive, select} from '../../module';
@View('system_login', {
    url: '/system_login',
    template:require('./page.html'),
    styles: require('./style.less'),
    inject:[
        "$scope", "$rootScope", "$state", '$ionicHistory', "commonService", "profileService", "serverInterface",
        "$http", "$ionicLoading", "$ionicPopup", "$q", "$interval", "$window", "$timeout", "$ngRedux", "ngLocalStore","$ocLazyLoad"
    ]
})
class StudentLoginCtrl{
    $ocLazyLoad
    constructor() {
        this.initData();
        this.getScope().$on("$ionicView.enter", ()=> {
            this.$ionicHistory.clearCache();
            this.$ionicHistory.clearHistory();
            this.student.password = '';
            this.student.vCode = '';
            this.isSecondInputError = false;   //是否两次输入错误
            this.savePWflag = true;
            let pw = userManifest.getPassWordByLoginName(this.student.userName);
            this.student.password = pw;
        });
        this.$ocLazyLoad.load('m_global')
        this.$ocLazyLoad.load('m_home')
        this.$ocLazyLoad.load('m_diagnose_pk');
        this.$ocLazyLoad.load('m_me');
        this.$ocLazyLoad.load('m_improve');
    }

    onReceiveProps() {
        this.handleLoginSuccess();
    }

    onBeforeEnterView() {
        //暂时解决pop提示在登录页面无法关闭的问题
        if (this.$ionicPopup._popupStack.length) {
            this.$ionicPopup._popupStack.forEach(_popupStack=> {
                _popupStack.remove();
            });
            this.$ionicPopup._popupStack.splice(0, this.$ionicPopup._popupStack.length);
            $('.backdrop.visible.active').remove();
            $('body').removeClass("popup-open");
        }
    }


    initData() {
        let $scope = this.getScope();
        let $rootScope = this.getRootScope();
        $rootScope.homeOrClazz = {type: ''};
        this.codeUrlDone = false;
        this.codeUrl = "";
        this.isBackspace = false;
        $scope.internet = {cloud: true, clazz: false};
        $rootScope.ip = this.serverInterface.CLOUD_IP;//默认云端网络
        $scope.title = '云端';
        this.showInputHelpFlag = false;
        this.isIos = this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
        this.USER_MANIFEST_S = this.commonService.getLocalStorage('USER_MANIFEST_S') || {};
        this.USER_MANIFEST_S.userList = _uniqBy(this.USER_MANIFEST_S.userList, 'loginName');
        $scope.select = function (status) {
            if (status == 2) {
                $scope.internet.cloud = true;
                $scope.internet.clazz = false;
                $rootScope.ip = this.serverInterface.CLOUD_IP;
                $scope.title = '云端';
            } else {
                $interval.cancel($scope.interval);
                this.needQRCode = false;
                $scope.internet.cloud = false;
                $scope.internet.clazz = true;
                $rootScope.ip = this.serverInterface.CLZ_IP;
                $scope.title = '课堂';
                $scope.getSessionId();
            }
        };
        $scope.isPhone = this.commonService.judgePhone();
        this.student = {           //初始化表单
            userName: '',
            password: '',
            vCode: ''
        };

        var user = userManifest.getUserManifest();
        if (user && user.defaultUser && user.defaultUser != "NONE_USER") {
            this.student.userName = user.defaultUser;
        }

        this.isSecondInputError = false;   //是否两次输入错误
        $scope.errorNum = 0;                //输入错误次数
        $scope.errorMsg = '';                  //错误提示信息
        this.needQRCode = false;            //默认不需要扫描二维码

        this.isShowRegisterConfirm = false;

        $scope.$on('$destroy', ()=> {    //当离开controller就取消定时器
            this.$interval.cancel($scope.interval);
        });
        /**
         * 登陆提交表单
         * @param studentLoginInfoForm
         */
        let that = this;
        this.submitClicked = false;
        $scope.handleSubmit = function () {
            //检查用户名是否合法
            that.submitClicked = true;
            let nameValid = that.checkUserName();
            if (!nameValid)return;
            var form = this.studentLoginInfoForm;
            if (form.$valid) {  //表单数据合法，发起登录请求
                $scope.ctrl.login();
            } else { //表单数据不合法，显示错误信息
                $scope.ctrl.showFormValidateInfo(form);
            }
        }
    }

    handleLoginSuccess() {
        if (this.isLogin && this.getStateService().current.name == 'system_login') {
            this.savePassword();
            userManifest.setDefaultUser(this.student.userName.toUpperCase());
            userManifest.addUserToUserList(this.user);
            this.getLocalStoreStateForLoginUser();
        }
    }

    getLocalStoreStateForLoginUser() {
        if (this.submitClicked) {
            this.go('home.study_index');
        }
    }

    /**
     * @description 验证表单数据是否合法
     * @param form 需要验证的表单
     */
    showFormValidateInfo(form) {
        var formParamList = ''; //需要验证的字段
        if (this.isSecondInputError) {
            formParamList = ['userName', 'password', 'vCode'];
        } else {
            formParamList = ['userName', 'password'];
        }
        var errorMsg = this.commonService.showFormValidateInfo(form, formParamList);
        this.commonService.alertDialog(errorMsg);
    }

    /**
     * 登陆处理
     */
    loginHandle() {
        var param = {
            loginName: this.student.userName,
            password: this.student.password,
        };
        loadingScene && loadingScene.show();
        this.$ngRedux.setKey(this.student.userName, ($1, $2)=> {
            this.handleLogin(param, null, this);
        });
    }

    /**
     * @description 发起用户登录请求并处理返回结果
     */
    login() {
        if (!this.isSecondInputError) {//如果不需要验证码
            this.getSessionId();
            /*  this.getSessionId().then((data)=> {  //获取sessionId
             if (data) {
             this.loginHandle();
             }
             });*/
            this.loginHandle();
            return;
        }
        this.commonService.validateImageVCode(this.student.vCode).then((data) => {//先验证图形验证码是否正确
            if (data.code == 200) {//正确
                this.loginHandle();
            }
            else {
                this.commonService.alertDialog("验证码不正确!");
                this.getCodeUrl();
            }
        });
    }

    /**
     * 获取图片验证码
     */
    getCodeUrl() {
        this.commonService.getValidateImageUrl().then((data) => {
            this.codeUrl = data;
            this.codeUrlDone = true;
        });
    };

    getSessionId() {  //获取sessionId
        let that = this;
        let $rootScope = this.getRootScope();
        let $scope = this.getScope();
        // this.$ionicLoading.show();

        if ($scope.internet.clazz) {
            $rootScope.homeOrClazz.type = 1;
            this.go('system_login_student_select');
        }

        /* var defer = this.$q.defer();
         this.$http.get(this.serverInterface.GET_SESSION_ID).success(function (resp) {
         that.$ionicLoading.hide();
         if (resp.code == 200) {
         $rootScope.sessionID = resp.jsessionid;
         if ($scope.internet.clazz) {
         $rootScope.homeOrClazz.type = 1;
         this.go('system_login_student_select');
         }
         defer.resolve(true);
         } else {
         defer.resolve(false);
         defer.resolve(false);
         that.$log.error('get session id failed!');
         }
         }).error(function (data, header, config, status) {
         defer.resolve(false);
         that.$ionicLoading.hide();
         var info = '连接' + $scope.title + '网络失败';
         that.commonService.showConfirm('', info, '重连').then((data)=> {
         if (data) {
         if ($scope.title == '课堂') {
         that.getSessionId();
         } else {
         that.login();
         }
         }
         })
         });
         return defer.promise;
         */
    };


    handleClickRegister() {
        // var alertTemplate = "<p style='text-align: center'>学生账号由家长帮忙申请</p>" +
        //     "<p>请选择家长>点新用户注册>填写注册信息>一键获取学生和家长账号</p>";
        //
        // this.commonService.showAlert("说明", alertTemplate);

        // this.isShowRegisterConfirm = true;
        localStorage.setItem('firstGoToRegister', JSON.stringify(true));
        this.switchSystem('parent');
    }
    gotoRegister($event){
        $event.preventDefault();
        this.isShowRegisterConfirm = false;
        localStorage.setItem('firstGoToRegister', JSON.stringify(true));
        this.switchSystem('parent');
    }
    closeRegisterConfirm($event){
        $event.preventDefault();
        this.isShowRegisterConfirm = false;
    }

    warning() {
        this.$ionicPopup.alert({
            title: '格式不正确',
            template: '<p>学生账号应是如下形式：</p>'
            + '<p>1.手机号+S<br/>或<br/>2.手机号+S+数字</p>' +
            '<p style="color:#6B94D6">例如：13812345678S</p>',
            okText: '确定'
        });
    }

    /**
     * 忘记密码提示
     */
    forgetPassWord() {
        this.$ionicPopup.alert({
            title: '信息提示',
            template: '<p>请登录家长端，再进入“孩子”页面，点击重置孩子密码。</p>' +
            '<p>如果家长的密码也忘了，可点击家长端的“忘记密码”。</p>',
            okText: '确定'
        });
    }

    /**
     * 忘记账号提示
     */
    forgetLoginName() {
        if (this.showInputHelpFlag) return;//已经显示了账号列表就返回
        this.userList = this.USER_MANIFEST_S.userList;
        if (this.userList && this.userList.length) {
            this.showInputHelpFlag = true;
            //todo: 账号列表的特殊样式
            return;
        }
        this.$ionicPopup.alert({
            title: '信息提示',
            template: '<p>如果忘记了账号，请登录家长端，再进入“孩子”页面，查看孩子账号</p>' +
            '<p>如果家长的帐号或密码忘了，可点击家长端的“忘记帐号”或“忘记密码”。</p>',
            okText: '确定'
        });
    }

    changeInputName() {
        this.wantToChangeLoginName = true;
        let userNameEle = document.getElementById('userName');
        this.$timeout(() => {
            this.showInputHelpFlag = false;
            this.student.userName = '';
            this.student.password = '';
            //userNameEle.focus();
            //不是ios系统就自动获取焦点
            if (!this.isIos) userNameEle.focus();

        }, 300);
    }

    checkUserName() {
        //this.showInputHelpFlag = false;
        var userName = this.student.userName;
        if (!userName)return;
        if(!this.showInputHelpFlag && userName.match(/^1\d{10}$/g)){
            this.student.userName+="S";
            return true;
        }
        if (!this.showInputHelpFlag && !userName.match(/^1\d{10}(S|s)\d*$/g) && !userName.match(/^1\d{10}(S|s)\d*(@super|@Super|@SUPER)$/g)) {
            this.warning();
            return false;
        } else {
            return true;
        }
    }

    autoCompleteName(person) {
        this.student.userName = person.hasOwnProperty('gender') ? person.loginName : person;
        // if(this.student.password) this.student.password
        let pw = userManifest.getPassWordByLoginName(this.student.userName);
        this.student.password = pw;
        this.savePWflag = true;

        let passEle = document.getElementById('password');
        this.$timeout(()=> {
            this.showInputHelpFlag = false;
            //$(passEle).trigger('click');
            //不是ios系统就自动获取焦点
            if (!this.isIos) passEle.focus();
        }, 300);
    }

    showInputHelp(handleType) {
        if (handleType === 'focus') {
            if (this.student.userName) return;
            this.userList = this.USER_MANIFEST_S.userList;
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

        if (!this.USER_MANIFEST_S) {
            this.showInputHelpFlag = false;
            return;
        }

        if (this.student.userName && this.student.userName.match(/^1\d{10}/g)) {
            let pw = userManifest.getPassWordByLoginName(this.student.userName);
            this.student.password = pw;
        }

        if (this.student.userName && !this.student.userName.match(/^1\d{10}/g) && (!this.USER_MANIFEST_S.userList || !this.USER_MANIFEST_S.userList.length)) {
            this.showInputHelpFlag = false;
            return;
        }
        if (!this.student.userName) {
            this.userList = this.USER_MANIFEST_S.userList;
            if (this.userList && this.userList.length)  this.showNameList();
            return;
        }
        if (this.student.userName.match(/^1\d{10}$/g)) {
            if (this.isBackspace) return;  //如果是退格操作，不显示inputHelp
            /* try{
             if(this.student.userName.length > 12) return;
             }catch(err){
             console.log(err);
             }*/
            let phone = angular.copy(this.student.userName).substr(0, 11);
            this.profileService.getUserListByPhone(phone, this.getUserListCallBack.bind(this));
            return;
        }
        this.showInputHelpFlag = false;
    }

    hideInputHelp(ev) {
        /*hack windows端 focus click事件bug 描述：输入框触发了focus事件后，弹出层仍然触发了click事件*/
        if (this.hackWindowsClick) {
            this.hackWindowsClick = false;
            return;
        }
        if (!this.student.userName) {
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

    getUserListCallBack(userList) {
        if (this.student.userName && this.student.userName.match(/^1\d{10}/g) && userList && userList.length) {
            this.userList = userList;
            this.showNameList();
        }
    }

    showNameList() {
        this.showInputHelpFlag = true;
        let timeSpan = this.isIos ? 300 : 0;
        this.$timeout(()=> {
            //$('body').trigger('click');//让输入框失去焦点，隐藏键盘
            $('#userName')[0].blur();//让输入框失去焦点，隐藏键盘
        }, timeSpan);
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

    mapStateToThis(state) {
        return {
            isLogin: state.profile_user_auth.isLogIn,
            clazzList: state.profile_clazz.clazzList,
            user: state.profile_user_auth.user
        }
    }

    mapActionToThis() {
        let ps = this.profileService;
        return {
            handleLogin: ps.handleLogin.bind(ps)
        };
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
        if (this.savePWflag) this.user.passWord = this.student.password;//this.student.password;
        this.user.savePWflag = this.savePWflag;
    }

    back(){
        return 'exit';
    }

}

export default StudentLoginCtrl;


