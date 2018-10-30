/**
 * Created by 邓小龙 on 2015/9/11.
 * description 重置密码第一步：提交要找回的账号
 */
import {Inject, View, Directive, select} from '../../module';

@View('reset_pass', {
    url: '/reset_pass',
    cache: false,
    template: require('./reset_pass.html'),
    inject: ['$scope'
        , '$state'
        , '$log'
        , 'commonService'
        , 'profileService'
        , '$rootScope'
        , 'serverInterface'
        , '$http'
        , '$ionicHistory'
        , '$ionicPopup'
        , '$ngRedux']
})
class resetPassCtrl {
    commonService;
    profileService;
    serverInterface;
    $http;
    $log;
    $ionicHistory;
    $ionicPopup;

    initData() {
        this.getRootScope().ip = this.serverInterface.CLOUD_IP;
    }

    onAfterEnterView() {
        this.initData();
        this.$http.get(this.serverInterface.GET_SESSION_ID).success((resp)=> {
            if (resp.code == 200) {
                this.getRootScope().sessionID = resp.jsessionid;
                return;
            }
            this.$log.log('getSesssionId error...');
        });
        this.formData = {};
        this.securityFormData = {};
    }

    /**
     * 提交找回目标账号的表单
     */
    submitCellPhoneForm() {
        if (!this.formData.loginName || this.formData.loginName == "") {
            this.commonService.alertDialog("请填写要找回的账号!");
            return;
        }
        else if (!this.formData.loginName.match(/^1\d{10}(T|t)\d*$/g)) {
            this.warning();
            return;
        }


        var loginName_ = $('input[name="loginName"]').val();
        loginName_ = loginName_ === this.formData.loginName ? this.formData.loginName : loginName_;
        this.profileService.getUserPhone(loginName_).then((data)=> {//根据登陆账号获取其关联的手机号
            var param = {
                loginName: this.formData.loginName
            };
            if (data && data.code == 200) {
                let phoneNum = this.formData.loginName.match(/^\d{11}/) && this.formData.loginName.match(/^\d{11}/)[0];
                // param.phone = phoneNum||data.telephone;
                param.phone = data.telephone;
                this.go("reset_pass_apply", param);
                return;
            }
            if (data && data.code == 604) {
                this.commonService.alertDialog(data.msg, 2000);
                return;
            }

            this.commonService.alertDialog('当前用户不存在，请重新填写', 1500);
        });
    };

    back() {
        this.$ionicHistory.goBack();
    }

    /*
     * 账号格式提示
     * */
    warning() {
        this.$ionicPopup.alert({
            title: '账号格式不正确',
            template: '<p>教师账号应是如下形式：</p>'
            + '<p>1.手机号+T<br/>或<br/>' +
            '2.手机号+T+数字<br/>' +
            '<p style="color:#6B94D6 ">例如：13812345678t</p>',
            okText: '确定'
        });
    }

}
export default resetPassCtrl;