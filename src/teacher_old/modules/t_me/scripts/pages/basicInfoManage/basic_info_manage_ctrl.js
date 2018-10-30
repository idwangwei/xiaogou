/**
 * Created by 邓小龙 on 2015/7/31.
 * @description 个人中心
 */
import {Inject, View, Directive, select} from '../../module';
@View('basic_info_manage', {
    url: '/basic_info_manage',
    template: require('./basic_info_manage.html'),
    inject: ['$scope', '$interval', '$rootScope', '$log', '$state', '$ionicPopup', 'baseInfoService', 'commonService', '$ngRedux']
})
class baseInfoManageCtrl {
    $interval;
    $log;
    baseInfoService;
    commonService;
    @select(state=>state.profile_user_auth.user.name) realName;
    @select(state=>state.profile_user_auth.user.gender) gender;
    @select(state=>state.profile_user_auth.user.telephone) telephone;
    telVcBtn = false;
    telVcBtnText = "点击获取";
    qList = [];

    constructor() {
        this.initData();
        this.destroyInterval();
    }

    /**
     * 初始化用户基本信息
     */

    initData() {
        this.baseInfoService.getPwProQuestion().then((data) => {
            if (data) {
                angular.forEach(data, (item, index)=> {
                    var info = {};
                    info.q = item;
                    info.num = this.commonService.convertToChinese(index + 1);
                    info.ansName = "answer" + (index + 1);
                    info.modName = "formData." + info.ansName;
                    if (index <= 2) {
                        this.qList.push(info);
                    }
                })
            }
        });
    }

    back() {
        this.go("home.me")
    }

    //****************基本信息修改****************
    /**
     * 性别选择
     */
    genderSelect(event, checkStatus) {
        if (this.gender == checkStatus) {//如果当前已被点击，那么再次被点击，就设置为没有被点击状态
            this.gender = -1;
        } else {
            this.gender = checkStatus;
        }
    }

    /**
     * 提交基本信息
     */
    baseInfoSubmit() {
        if (this.gender == -1) {
            this.commonService.alertDialog("请选择性别！");
            return;
        }
        // this.baseInfoService.saveBaseInfo(this.realName, this.gender);
        this.baseInfoService.saveBaseInfo(this.realName, this.gender).then((data)=> {
            if (data && data.code == 200) {
                this.commonService.alertDialog("基本信息保存成功！");
            } else {
                this.commonService.alertDialog(JSON.stringify(data.msg));
            }
        });
    }

    //****************更换关联手机******************

    /**
     * 获取手机验证码
     */
    getTelVC() {
        if (this.telephone) {
            this.showTextForWait();
            this.commonService.getTelVC(this.telephone).then((data)=> {
                if (data && data.code == 200) {
                    this.commonService.alertDialog("短信验证码已下发,请查收!", 1500);
                    // this.$log.error("tvc:" + data.telRC);
                } else if (data && data.code == 552) {
                    this.telVC = data.telVC;
                    //$scope.telVcServerVal = data.telVC;
                    this.$ionicPopup.alert({
                        title: '温馨提示',
                        template: '<p>手机验证码已收到并已自动填入</p>',
                        okText: '确定'
                    });
                } else {
                    this.commonService.alertDialog(data.msg, 1500);
                }
            });
        } else {
            this.commonService.alertDialog("请先填写正确的手机号!");
        }
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
        }, 1000)
    }


    /**
     * 提交关联手机修改
     */
    submitReferCellphone(form) {
        this.telVcBtn = false;
        this.$interval.cancel(this.interval);
        this.telVcBtnText = "点击获取";

        var param = {
            telephone: this.telephone,
            telVC: this.telVC
        };
        this.$log.log("phone:" + this.telephone + " telVC:" + this.telVC);
        if (form.$valid) {//字段内容合法的
            this.baseInfoService.resetTelephone(param);
        } else {
            var formParamList = ['telephone', 'telVC'];
            var errorMsg = this.commonService.showFormValidateInfo(form, formParamList);
            this.commonService.alertDialog(errorMsg);
        }
    }

    /**
     * 页面切换时，清除定时器
     */
    destroyInterval() {
        this.getScope().$on('$destroy', () => {
            if (this.interval) {
                this.$interval.cancel(this.interval);
            }
        });
    }

    /**
     * 页面切换时，清除定时器
     */
    onBeforeLeaveView() {
        if (this.interval) {
            this.$interval.cancel(this.interval);
            this.telVcBtn = false;
            this.telVcBtnText = "点击获取";
        }
    }


    //****************密保信息*****************
    /**
     * 提交密保信息
     */
    submitSecurityInfo() {
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
        this.baseInfoService.savePwProQuestion({passwordProtection: JSON.stringify(passwordProtection)});

    }
}

export default baseInfoManageCtrl
