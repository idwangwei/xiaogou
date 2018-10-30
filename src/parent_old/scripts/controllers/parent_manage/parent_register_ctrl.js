/**
 * Created by 邓小龙 on 2015/7/28.
 * 华海川（重构） 2015/10/8
 */
import controllers from './../index';
import _ from 'underscore';
import userManifest from './../../user_manifest';
import {UserManifest, SYSTEM_TYPE} from 'local_store/UserManifest';
var stuUserManifest= new UserManifest(SYSTEM_TYPE.STUDENT);

const relationshipMap = {
    empty: '-1',
    father: '0',
    mother: '1',
    grandFather: '2',
    grandMother: '3',
    grandFatherInLaw: '4',
    grandMotherInLaw: '5',
    other: '6'
};
const CHECK_CLAZZ_MSG = "班级号不存在!";
const SELF_STUDY_CLAZZ_ID = '100000';
class Child {
    constructor(idGernerator, name, gender, clzIds, iCode, relationShip) {
        this.id = idGernerator.generate();
        this.name = name || '';
        this.gender = gender || '';
        this.clzIds = clzIds || '';
        this.iCode = iCode || '';
        this.relationShip = relationShip || relationshipMap.father;
        this.checkClazzErrorFlagCount = 0;
        this.selfStudyClazzGrade = '-1';
    }
}
class ParentRegisterCtrl {
    constructor($scope, $state, $timeout, $ionicSlideBoxDelegate, $log, $ionicHistory, $interval, $ionicLoading, commonService, serverInterface, finalData, uuid4, $ionicPopup,$rootScope) {
        this.$ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
        this.currentPage = 1;
        $scope.clazzType = ''; //申请班级类别 't'|'s'  t:老师班级、s:自学班级
        let date = new Date();
        this.currentStudyYear = date.getMonth() < 8 ?date.getFullYear()-1:date.getFullYear();
        this.$scope = $scope;
        $scope.SELF_STUDY_CLAZZ_ID = SELF_STUDY_CLAZZ_ID;
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        }, 500);
        /**
         * 注册 表单数据
         */
        var parentInfo = {};
        var parentLocalStr = localStorage.getItem('parent');
        if (parentLocalStr){
            parentInfo = JSON.parse(parentLocalStr);
            parentInfo.name = '家长';
        }
        //TODO 因为旧的数据里面没有selfStudyClazzGrade这个字段，所以从localstorage读取旧数据的时候，选择自学班不会默认到“--请选择--”
        try{
            if(parentInfo.registInfo){
                parentInfo.registInfo.child_list[0].selfStudyClazzGrade = '-1';
            }
        }catch(err){
            console.error(err);
        }
        let _formData = this._formData = parentInfo.registInfo ? parentInfo.registInfo : {
            cellphone: '',
            name: '家长',//姓名
            gender: '1',//性别
            child_list: [ //孩子列表
                new Child(uuid4)
            ]
        };
        let _formStatus = {
            submitClicked: false
        };
        $scope.passwords = {
            confirmPass: '',
            password: ''
        };
        let ctrl = this;

        $scope._ = _;
        $scope.formData = _formData;
        $scope.formStatus = _formStatus;
        $scope.validateMsg = finalData.VALIDATE_MSG_INFO;
        $scope.telVcBtnText = "点击获取";//按钮文字显示
        $scope.telVcBtn = false;//按钮不可以点击状态
        $scope.vcCount = 60;
        var key="registerTip";
        $scope.alertTipInfo={
            register:commonService.getLocalStorage(key)
        };
        $scope.noTip={
            status:false
        };
        $scope.account={
            numInfo:'',
            numInfoStu:'',
            isInput:true
        };
        /*formSelect指令的options*/
        $scope.clazzTypes = [{
            value: '610000',
            name: '学校老师班级'
        }, {
            value: SELF_STUDY_CLAZZ_ID,
            name: '个人自学班'
        }]
        /*formSelect指令选中的值*/
        $scope.selectedClazzType = null;

        $('#cellphone').blur((e)=>{
            $scope.$apply(()=>{$scope.account.isInput = false;});
            $scope.checkAndShowPrentAccountNum();
        });
        $('#cellphone').focus((e)=>{
            $scope.$apply(()=>{$scope.account.isInput = true;});
        });

        $scope.help = function () {  //提示信息
            $ionicPopup.alert({
                title: '常见问题',
                template: `
                <p style="color: #377AE6">问：一家如何注册两个家长？</p>
                <p>答：先让一个家长注册自己和孩子的账号，然后登录家长账号，进入“我”页面，点击头像，为第二个家长添加一个“第二监护人”账号。第二个家长就可以在自己的手机上下载APP，使用“第二监护人”账号登录了。<br>
                    <span style="color: red">注意：第二个家长不要单独注册，否则不能查看第一个家长注册的孩子的学习情况。</span>
                </p>
                <p style="color: #377AE6">问：一家如何注册多个孩子？</p>
                <p>答：家长注册过程中只能添加一个孩子。注册成功后，登录家长账号，进入“孩子”页面，添加更多孩子。（“第二监护人”也能看见所有的孩子。）</p>
                <p style="color: #377AE6">问：如何为孩子设置不同的密码？</p>
                <p>答：注册成功后，登录家长账号，进入“孩子”页面，即可根据需要为孩子设置不同的密码。</p>`,
                okText: '确定'
            });
        };

        $scope.showTip =function(){
            // if(!$scope.alertTipInfo.register){
            //     $timeout(function () {
            //         $scope.flag=true;
            //     },3000);
            //
            //     var popupTip=$ionicPopup.alert({
            //         title: '教你一大招',
            //         template: '<p style="font-size:16px;position: relative">有任何问题，点击每个页面右上角的'+  '<img ng-src="'+"{{$root.loadImg('common/help_icon.png')}}"+'" alt="" class="common-help-tip"/>'+'<span style="margin-left: 33px">。</span></p> '+
            //         '  <ion-checkbox ng-click="checkNoTip()"  style="border:none;background:none;font-size:14px">'+
            //         '不再提示</ion-checkbox>',
            //         scope:$scope,
            //         buttons: [
            //             {
            //                 text: "<b >先看一下再点我</b>",
            //                 type: "button-positive",
            //                 onTap: function (e) {
            //                     if(!$scope.flag)
            //                         e.preventDefault();
            //                     else
            //                         return true;
            //
            //                 }
            //             }
            //         ]
            //     }).then(function(){
            //         if( $scope.noTip.status)
            //             commonService.setLocalStorage(key,true)
            //     });
            // }

            // $timeout($scope.help,500);
        };
        $scope.checkNoTip=function () {
            $scope.noTip.status=!$scope.noTip.status;
        };

        $scope.showTip();
        $scope.selectRelationship = function(relationShip){
           //console.log(child.relationShip);
            switch(relationShip){
                case relationshipMap.father: $scope.formData.gender = '1';break;
                case relationshipMap.mother: $scope.formData.gender = '0';break;
                case relationshipMap.grandFather: $scope.formData.gender = '1';break;
                case relationshipMap.grandMother: $scope.formData.gender = '0';break;
                case relationshipMap.grandFatherInLaw: $scope.formData.gender = '1';break;
                case relationshipMap.grandMotherInLaw: $scope.formData.gender = '0';break;
                case relationshipMap.other: $scope.formData.gender = '1'; break;
            }
        }

        $scope.showPassTip=function (modelValue,$event) {
            if($event.target.id=='password'){
                $scope.passwords.confirmPass='';
            }
            if($event.keyCode == 8|| $event.keyCode == 46) return;
            if(modelValue&&modelValue.length==6){
                if($scope.passwordConfirmPop)
                    return;
                var hasSelectStr="";
                if(window.getSelection) {
                    hasSelectStr=window.getSelection().toString();
                }
                if(hasSelectStr&&hasSelectStr.length) return;
                $scope.passwordConfirmPop=commonService.showAlert("信息提示","只能输入6个字符以内！");
                $scope.passwordConfirmPop.then(function (res) {
                    if(res){
                        $scope.passwordConfirmPop=null;
                        $event.target.focus();
                    }
                })
            }
        };
        $scope.testSpace = function(str){
            if(str == ' '){
                $scope.passwords.password = '';
            }
        };



        $scope.addChild = function () {
            if (_formData.child_list.length >= 2) {
                commonService.alertDialog('您最多可以添加两个孩子！', 1500);
                return;
            }
            let sc=$scope;
            let templete='<div>确定要添加<span style="color: red">第'+(_formData.child_list.length+1)+'个</span>学生吗？</div>';
            commonService.showConfirm('信息提示',templete).then(function(res){
               if(res){
                   _formData.child_list.push(new Child(uuid4));
                   sc.saveFormData();
               }
            });

        };

        $scope.deleteStudent = function (index) {
            let templete='<div>确定要删除该学生吗？</div>';
            let sc=$scope;
            commonService.showConfirm('信息提示',templete).then(function(res){
                if(res){
                    _formData.child_list.splice(index, 1);
                    sc.saveFormData();
                }
            });
        };
        /**
         * 初始图片验证码
         */
        $scope.initImage = commonService.getValidateImageUrl().then(function (data) {
            $scope.validateImageUrl = data;
        });

        /**
         * 检测家长的标志
         */
        $scope.checkParentFlag=function(){
            //if(formData.name)
        };

        /**
         * 检测学生列表的标志
         */
        $scope.checkChildListFlag = function () {
            for (let k = 0; k < $scope.formData.child_list.length; k++) {
                var currentChild = $scope.formData.child_list[k];
                if (currentChild.checkClazzErrorFlagCount == 0 && $scope.clazzType === 't') {
                    currentChild.checkClazzErrorFlag = true;
                    currentChild.clazzFlagMsg = CHECK_CLAZZ_MSG;
                    commonService.alertDialog('请检查信息是否填写完整', 1500);
                    ctrl.currentPage = 2;
                    return false;
                }
                if (currentChild.checkClazzErrorFlag && $scope.clazzType === 't') {
                    commonService.alertDialog('请检查班级号信息是否填写正确', 1500);
                    ctrl.currentPage = 2;
                    return false;
                }
                if(currentChild.relationShip==="-1" || !currentChild.relationShip){
                    commonService.alertDialog('请检查信息是否填写完整', 1500);
                    ctrl.currentPage = 1;
                    return false;
                }
                if($scope.clazzType === 's'
                    && (currentChild.selfStudyClazzGrade === undefined || currentChild.selfStudyClazzGrade < 0)){
                    commonService.alertDialog('请检查孩子的年级是否选择正确', 1500);
                    ctrl.currentPage = 2;
                    return false;
                }
            }
            return true;
        };
        /**
         * 获取图片验证码
         */
        $scope.getValidateImage = function () {
            commonService.getValidateImageUrl().then(function (data) {
                $scope.validateImageUrl = data;
                $scope.imgVSuccess = false;
            });
        };
        /**
         * 注册（提交表单处理）
         */

        $scope.registerSubmit = function () {
            if($scope.isSubmitProcess) return;
            _formStatus.submitClicked = true;
            var form = ctrl.registerForm = this.registerForm;
            var flag = $scope.checkChildListFlag(ctrl);
            if (!flag){
                try{
                    if($scope.formData.child_list[0].checkClazzErrorFlag) {
                        $scope.showClassTip = true
                    }
                }catch(e){
                    console.error('check clazzId error!')
                }
                return;
            }

            if (form.$valid) {//表单数据合法，就登录

                if(!$scope.checkWordInput($scope.formData.name)){
                    commonService.alertDialog('家长姓名填写格式不对', 1500);
                    this.currentPage = 1;
                    return
                }
                if(!$scope.checkWordInput($scope.formData.child_list[0] ? $scope.formData.child_list[0].name:'')){
                    commonService.alertDialog('学生姓名填写格式不对', 1500);
                    this.currentPage = 2;
                    return
                }

                register();
            } else {
                commonService.alertDialog('请检查信息是否填写完整', 1500);
                ctrl.goToErrorSlide();
            }
        };
        /**
         * 验证图形验证码
         */
        /*$scope.validateImageVCode = function () {
            if (this.formData.vCode) {
                commonService.validateImageVCode(this.formData.vCode).then(function (data) {
                    if (data) {
                        $scope.validateImage = true;
                    }
                });
            }
        };*/
        /**
         * 获取手机验证码
         */
        $scope.getTelVC = function () {
            $scope.formStatus.submitClicked = true;
            var flag = $scope.checkChildListFlag(ctrl);
            if (!flag){
                try{
                    if($scope.formData.child_list[0].checkClazzErrorFlag) {
                       $scope.showClassTip = true;
                    }
                }catch(e){
                    console.error('check clazzId error!')
                }
                return;
            }
            let form = ctrl.registerForm = this.registerForm;
            let keyNum = _.keys(form.$error).length;

            if (form.$valid || (form.$error && form.$error.required && form.$error.required.length == 1 && keyNum == 1 && form.telVC.$error.required)) {
                showTextForWait();
                commonService.getTelVC($scope.formData.cellphone).then(function (data) {
                    if (data && data.code == 200) {
                        commonService.alertDialog("短信验证码已下发,请查收!", 1500);
                        $log.debug("tvc:" + data.telRC);
                        return;
                    }
                    if (data && data.code == 552) {
                        $scope.formData.telVC = data.telVC;
                        //$scope.telVcServerVal = data.telVC;
                        $ionicPopup.alert({
                            title: '温馨提示',
                            template: '<p>手机验证码已收到并已自动填入，可以点击“提交”了</p>',
                            okText: '确定'
                        });
                        return;
                    }
                    commonService.alertDialog(data.msg, 1500);
                });
            } else {
                ctrl.goToErrorSlide();
            }
        };

        /**
         * 发送手机验证码后等待60秒
         */
        function showTextForWait() {
            $scope.telVcBtn = true;
            $scope.vcCount = 60;
            //$scope.telVcServerVal='';
            $scope.interval = $interval(function () {
                if ($scope.vcCount == 0) {
                    $scope.telVcBtnText = "点击获取";
                    $scope.telVcBtn = false;
                    /*if($scope.telVcServerVal){
                        $scope.formData.telVC=$scope.telVcServerVal;
                        $ionicPopup.alert({
                            title: '温馨提示',
                            template: '<p>手机验证码已收到并已自动填入，可以点击“提交”了</p>',
                            okText: '确定'
                        });
                    }*/
                    $interval.cancel($scope.interval);
                } else {
                    $scope.telVcBtnText = $scope.vcCount + "秒";
                    $scope.vcCount--;
                }
                $log.log($scope.vcCount);
            }, 1000)
        }

        /**
         * 当离开controller就取消定时器
         */
        $scope.$on('$destroy', function () {
            if ($scope.interval) {
                $interval.cancel($scope.interval);
            }
        });
        /**
         * 保存 formData 到localStorage
         */
        $scope.saveFormData = ()=> {
            
            var parentInfo = {};
            var parentLocalStr = localStorage.getItem('parent');
            if (parentLocalStr)
                parentInfo = JSON.parse(parentLocalStr);
            parentInfo.registInfo = $scope.formData;
            localStorage.setItem('parent', JSON.stringify(parentInfo));
        };
        $scope.switchInputShow = () => {
            var elem = angular.element('#password');
           if(elem.attr('type') == 'text'){
               elem.attr('type', 'password')
           }else{
               elem.attr('type', 'text')
           }
        };
        /**
         * 发起用户注册请求并处理返回结果
         */
        function register() {
            //显示载入指示器
            $ionicLoading.show({
                template: "正在处理，请稍后..."
            });
            $scope.isSubmitProcess=true;

            let studentIds = $scope.formData.child_list;
            if($scope.clazzType === 's'){
                studentIds = [];
                $scope.formData.child_list.forEach((child)=>{
                    let copyChild = Object.assign({},child);
                    copyChild.clzIds = copyChild.selfClzIds;
                    studentIds.push(copyChild);
                });
            }


            var param = {
                telVC: $scope.formData.telVC,
                parent: JSON.stringify({
                    telephone: $scope.formData.cellphone,
                    password: $scope.passwords.password,
                    confirmPassword: $scope.passwords.confirmPass,
                    name: $scope.formData.name,
                    gender: $scope.formData.gender,
                    deviceId: '11'
                }),
                students: JSON.stringify(studentIds)
            };

            commonService.commonPost(serverInterface.REGISTER_WITH_CHILDREN, param).then(function (data) {
                $scope.isSubmitProcess=false;
                //隐藏载入指示器
                $ionicLoading.hide();
                if (data && (data.code == 200 || data.code == 402)) {
                    $scope.formData = {};
                    $scope.$root.students = data.students;
                    let newPUser = {
                        loginName:  data.parent.loginName,
                        name:  data.parent.name,
                        gender: data.parent.gender
                    };
                    userManifest.addUserToUserList(newPUser);
                    angular.forEach(data.students,(stuItem)=>{
                        stuUserManifest.addUserToUserList(stuItem);
                    });

                    if(data.code == 402){
                        commonService.showAlert('提示', data.msg).then(()=>{
                            $state.go('register_success', {
                                loginName: data.parent.loginName,
                                flag: "system_login"
                            });
                        });
                    }else {
                        $state.go('register_success', {
                            loginName: data.parent.loginName,
                            flag: "system_login"
                        });
                    }

                    var parentInfo = {};
                    var parentLocalStr = localStorage.getItem('parent');
                    if (parentLocalStr) {
                        parentInfo = JSON.parse(parentLocalStr);
                        delete parentInfo.registInfo;
                        localStorage.setItem('parent', JSON.stringify(parentInfo));
                    }
                    return;
                }

                if (data && data.code == 551) {
                    commonService.alertDialog("手机验证码不正确!", 1500);
                    $scope.getValidateImage();
                    return;
                }
                if(data&&data.code===625){
                    commonService.showAlert('提示', data.msg);
                    ctrl.currentPage = 2;
                    return;
                }
                commonService.showAlert('提示', data.msg);
            },function(){
                //隐藏载入指示器
                $ionicLoading.hide();
                $scope.isSubmitProcess=false;
            });
        }

        /**
         * 返回
         */
        $scope.back = function () {
            if(this.clazzType){
                $scope.clazzType = '';
                $scope.$digest();
                return
            }
            $state.go("system_login");
        };
        debugger
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);

        $scope.checkClazzOnblur = function(child){
            if(!child.clzIds || child.clzIds.length < 6) $scope.showClassTip = true;
            if(child.clzIds && child.clzIds.length > 6) {
                child.checkClazzErrorFlag = true;
                child.clazzFlagMsg = CHECK_CLAZZ_MSG;
                child.teacherName = '';
            }
        }
        /**
         * 判断班级号
         * @param child
         */
        $scope.checkClazz = function (child) {

            if(child.clzIds && child.clzIds.length > 6){
                $scope.showClassTip = true;
            }
            if(!child.clzIds || child.clzIds.length < 6){
                $scope.showClassTip = false;
            }
            if (!child.clzIds || child.clzIds.length < 6 || child.clzIds.length > 6) {
                child.checkClazzErrorFlag = true;
                child.clazzFlagMsg = CHECK_CLAZZ_MSG;
                child.teacherName = '';
                return;
            }
            let param = {
                classId: child.clzIds
            };
            $ionicLoading.show({
                template: '检测班级号中...',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
            });
            commonService.commonPost(serverInterface.GET_TEACHER_NAME_BY_CLASS_ID, param).then(function (data) {
                $ionicLoading.hide();
                if (data && data.code == 200) {
                    child.teacherName = " (" + data.name + ")";
                    child.checkClazzErrorFlag = false;
                    if(data.state == 2){
                        child.checkClazzErrorFlag = true;
                        child.clazzFlagMsg = data.name+'已关闭班级申请通道';
                        $scope.showClassTip = true;
                    }

                } else {
                    child.checkClazzErrorFlag = true;
                    child.clazzFlagMsg = CHECK_CLAZZ_MSG;
                    $scope.showClassTip = true;
                }
                child.checkClazzErrorFlagCount++;
                $scope.saveFormData();
            }, function () {
                $ionicLoading.hide();
            });
        };
        /*处理自学班选择年级*/
        $scope.selectSelfStudyClazzGrade = function(child){
            if(child.selfStudyClazzGrade > 0){
                child.selfClzIds = SELF_STUDY_CLAZZ_ID;
            }
        }
        /*处理选择班级类型*/
        $scope.handleChangeClazzType = function(child, value){
               if(value !== SELF_STUDY_CLAZZ_ID){
                   child.clzIds = '';
                   child.teacherName = '';
               }else if(value === SELF_STUDY_CLAZZ_ID){
                   child.clzIds = SELF_STUDY_CLAZZ_ID;
                   child.checkClazzErrorFlag = false;
               }
        }.bind(null, $scope.formData.child_list[0])
        /**
         * 获取到焦点时，去掉提示信息
         * @param child
         */
        $scope.removeClazzTip = function (child) {
            if (child.teacherName && child.clzIds) {
                /*let index = child.clzIds.indexOf(child.teacherName);
                child.clzIds = index >= 0 ? child.clzIds.substring(0, index) : child.clzIds;*/
            }
        };
        $scope.checkAndShowPrentAccountNum = function(isInit){
            let newInfo,newInfoStu;
            if($scope.formData.cellphone && $scope.formData.cellphone.match(/^(13|15|18|14|17)[0-9]{9}$/)){
                newInfo = $scope.formData.cellphone+'p';
                newInfoStu = ''+$scope.formData.cellphone+'s';
            }else {
                newInfoStu = '';
                newInfo = "";
            }

            if(isInit){
                $scope.account.isInput = false;
                $scope.account.numInfo = newInfo;
                $scope.account.numInfoStu = newInfoStu;
            }else {
                $scope.$apply(()=>{
                    $scope.account.numInfo = newInfo;
                    $scope.account.numInfoStu = newInfoStu;
                });
            }
        };
        if($scope.formData.cellphone){
            $scope.checkAndShowPrentAccountNum(true);
        }


        $scope.checkWordInput = function(inputStr){
            let regExp = /^([\u4e00-\u9fa5]|\w)+$/;
            return regExp.test(inputStr);
        };

        $scope.chooseType = ($event,type)=>{
            $event.preventDefault();
            $scope.clazzType = type;
        };
    }

    next() {
        this.currentPage < 3 ? this.currentPage++ : '';
    }

    previous() {
        this.currentPage > 1 ? this.currentPage-- : '';
    }

    goToErrorSlide() {
        if (!(this.registerForm.cellphone.$valid
            && this.registerForm.password.$valid
            && this.registerForm.confirmPassword.$valid)) {
            this.currentPage = 1;
        }
        let cLen = this._formData.child_list.length;
        let valid = true;
        for (let i = 0; i < cLen; i++) {
            if (!(this.registerForm['gender' + i].$valid
                && this.registerForm['relationShip' + i].$valid
                && this.registerForm['realName' + i].$valid)) {

                valid = false;
                break;
            }
        }
        if (!valid)
            this.currentPage = 2;

    }

    submit() {
        if(this.$scope.isSubmitProcess) return;
        let btn = document.querySelector('#submitForm');
        setTimeout(function () {
            btn.click();
        }, 100)
    }


}
ParentRegisterCtrl.$inject = ["$scope", "$state", "$timeout", "$ionicSlideBoxDelegate", "$log", "$ionicHistory", "$interval", "$ionicLoading", "commonService", "serverInterface", "finalData", "uuid4", "$ionicPopup","$rootScope"];

controllers.controller('parentRegisterCtrl', ParentRegisterCtrl);
