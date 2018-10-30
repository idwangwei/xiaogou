/**
 * Created by 彭建伦 on 2015/7/27.
 */
import {Inject, View, Directive, select} from '../../module';

@View('reset_pass_apply', {
    url: '/reset_pass_apply/:loginName/:phone',
    cache: false,
    template: require('./reset_pass_apply.html'),
    inject: ['$scope'
        , '$state'
        , '$log'
        , '$rootScope'
        , '$interval'
        , '$ionicLoading'
        , 'baseInfoService'
        , 'profileService'
        , 'commonService'
        , '$ionicHistory'
        , '$ngRedux']
})
class resetPassApplyCtrl {
    $log;
    $interval;
    $ionicLoading;
    baseInfoService;
    profileService;
    commonService;
    $ionicHistory;

    telVcBtnText = "点击获取";//按钮文字显示
    telVcBtn = false;//按钮不可以点击状态

    initData() {
        this.loginName = this.getStateService().params.loginName;//账号
        this.phone = this.getStateService().phone;//账号所关联的手机号码

        this.pageStatus = 3;//初始页面状态

        /**
         * 注册 表单数据
         */
        this.formData = {};
        this.securityFormData = {};

        /**
         * 初始图片验证码
         */
        this.initImage = this.commonService.getValidateImageUrl().then((data)=> {
            this.validateImageUrl = data;
            this.validateImageUrl2 = data;
        });

        this.qList = [];
        this.qBackList = [];
    }

    onAfterEnterView() {
        this.initData();
        if (!this.getStateService().params.loginName || !this.getStateService().params.phone) {
            this.$log.log("没有参数!");
            return;
        } else {
            this.formDataInit();
        }
    }

    formDataInit() {
        this.baseInfoService.getPwProQuestion({loginName: this.getStateService().params.loginName}).then((data)=> {
            if (data) {
                angular.forEach(data, (item, index)=> {
                    var info = {};
                    info.q = item;
                    info.num = this.commonService.convertToChinese(index + 1);
                    info.ansName = "answer" + (index + 1);
                    info.modName = "formData." + info.ansName;
                    if (index > 2) {
                        this.qBackList.push(info);
                        return;
                    }
                    this.qList.push(info);
                })
            }
            /*if(data.code==200){
             debugger;
             }*/
        });
    }

    /**
     * 获取图片验证码
     */
    getValidateImage(type) {
        if (type == 1) {
            this.commonService.getValidateImageUrl().then((data)=> {
                this.validateImageUrl = data;
            });
        } else {
            this.commonService.getValidateImageUrl().then((data)=> {
                this.validateImageUrl2 = data;
            });
        }
    };

    /**
     * 验证图形验证码
     */
    validateImageVCode(vCode) {
        this.commonService.validateImageVCode(vCode).then((data)=> {
            if (data.code == 200) {
                this.imgVSuccess = true;
            }
        });
    };

    /**
     * 校验手机短信验证码
     */
    validateTelVC() {
        this.commonService.validateTelVC(this.formData.telVC).then((data)=> {
            if (data) {
                this.pageStatus = 5;
            } else {
                this.$log.error(JSON.stringify(data.msg));
            }
        });
    }

    /**
     * 根据登陆账号获取手机验证码
     */
    getTelVCByLoginName() {
        this.showTextForWait();
        this.profileService.getTelVCByLoginName(this.loginName).then((data)=> {
            if (data.code == 200) {
                this.commonService.alertDialog("短信验证码已下发,请查收!", 2000);
            } else if (data.code == 552) {
                this.formData.telVC = data.telVC;
            } else {
                this.commonService.alertDialog(data.msg, 1500);
            }

        });
    }


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
            this.$log.log(count + '.......');
        }, 1000);
    }


    /**
     * 重置密码--通过手机验证码
     */
    resetPassByVCode() {
        this.profileService.resetPassWordByVCode(this.getStateService().params.loginName, this.formData.newPass, this.formData.telVC)
            .then((data)=> {
                if (data.code == 200) {
                    this.commonService.alertDialog("密码重置成功!");
                    this.go('system_login');
                } else {
                    this.commonService.alertDialog(data.msg);
                    this.$log.error(JSON.stringify(data.msg));
                }
            });

    }


    /**
     * 处理tab 按钮点击事件
     * @param $event 事件
     * @param pageStatus 页面状态
     */
    handleTabBtnClick($event, pageStatus) {
        var activeEl = document.querySelector(".active");
        angular.element(activeEl).removeClass("active");
        angular.element($event.target).addClass("active");
        this.pageStatus = pageStatus;
    };

    /**
     /**
     * 提交确认手机号码表单 (即pageStatus=2下提交表单)
     */
    submitCellPhoneConfirmForm() {
        this.pageStatus = 3;
        this.getTelVCByLoginName();
    };

    /**
     * 提交验证手机验证码校验表单
     */
    submitCellPhoneTelVCForm() {
        var form = this.CellPhoneTelVCForm;
        if (form.$valid) {
            this.validateTelVC();
        } else {
            var formParamList = ['telVC'];
            var errorMsg = this.commonService.showFormValidateInfo(form, formParamList);
            this.commonService.alertDialog(errorMsg);
        }
    };

    /**
     * 提交密保找回表单
     */
    submitSecurityForm() {

        var passwordProtection = [];
        var flag = true;
        for (var i = 0; i < this.qList.length; i++) {
            var item = this.qList[i];
            var info = {};
            info.question = item.q;
            var ele = document.getElementById(item.ansName);
            if (ele && ele.value && ele.value != "") {
                info.answer = document.getElementById(item.ansName).value;
            } else {
                this.commonService.alertDialog("问题" + item.num + "，没有答案，请填写!");
                flag = false;
                break;
            }
            passwordProtection.push(info);
        }
        if (!flag) {
            return;
        }
        var param = {
            loginName: this.getStateService().params.loginName,
            passwordProtection: JSON.stringify(passwordProtection)
        };
        this.baseInfoService.checkPwProQuestion(param).then((data)=> {
            if (data.code == 200) {
                this.pageStatus = 5;//密保验证成功
                return;
            }
            this.commonService.alertDialog("密保答案不正确!");
        });

        /*var form=this.SecurityForm;
         if(form.$valid){
         validateSecurity();
         }else{
         var formParamList=['answer1','answer2','answer3','vCode'];
         var errorMsg=commonService.showFormValidateInfo(form,formParamList);
         commonService.alertDialog(errorMsg);
         }*/
    };

    /**
     * 提交密码找回--通过手机验证码的表单
     */
    submitResetPassByVCodeForm(form) {
        // var form = this.resetPassByVCodeForm;
        if (form.$valid) {
            this.resetPassByVCode();
        } else {
            var formParamList = ['newPass', 'confirmPass', 'telVC'];
            var errorMsg = this.commonService.showFormValidateInfo(form, formParamList);
            this.commonService.alertDialog(errorMsg.msg);
        }
    };

    /**
     * 提交密码找回--通过密保的表单
     */
    submitResetPassBySecurityForm() {
        var form = this.resetPassBySecurityForm;
        if (form.$valid) {
            this.resetPassBySecurity();
        } else {
            var formParamList = ['newPass', 'confirmPass'];
            var errorMsg = this.commonService.showFormValidateInfo(form, formParamList);
            this.commonService.alertDialog(errorMsg.msg);
        }
    };

    /**
     * 重置密码--通过密保
     */
    resetPassBySecurity() {
        this.profileService.resetPassWordBySecurity(this.getStateService().params.loginName, this.securityFormData.newPass)
            .then((data)=> {
                if (data) {
                    this.commonService.alertDialog("密码重置成功!");
                    this.go('system_login');
                } else {
                    this.$log.error(JSON.stringify(data.msg));
                }
            });

    }

    //返回按钮
    back() {
        this.$ionicHistory.goBack();
    }
}

export default resetPassApplyCtrl;