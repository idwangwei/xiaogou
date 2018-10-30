/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from '../../module';
import codeImg from './../../../../m_live/images/live_home/live-home-code.png';
@View('live_course_verify', {
    url: '/live_course_verify',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$state',
        '$ngRedux',
        '$stateParams',
        '$ionicHistory',
        '$rootScope',
        "$ionicPopup",
        "$ionicLoading",
        "paperService",
        "$timeout",
        "$ocLazyLoad",
        "$ionicActionSheet",
        "liveService"
    ]
})
class liveCtrl {
    $ionicHistory
    $ionicPopup
    $timeout
    $ocLazyLoad
    liveService
    @select(state=>state.select_course) selectCourse;
    @select(state=>state.profile_user_auth.user) userInfo;
    @select(state=>state.wl_selected_clazz) clazzInfo;
    onBeforeLeaveView() {

    }
    onAfterEnterView(){
        this.initData();
        this.initFn();
    }
    back() {
        if (this.showSuccessModal) {
            this.showSuccessModal = false;
            this.getScope().$digest();
            return;
        }
        this.go("live_course_enter")
    }
    constructor() {
        this.showSuccessModal=false;
    }
    /*初始化页面*/
    initData(){
        this.form={
            telephone:"",
                telVC:"",
                userName:"",
        };
        this.sendText="获取验证码";
        this.timeStatus=0;
        this.time=60;
    }
    initFn(){
    }
    verifyPhone(){
        if(!this.form.telephone){
            this.$ionicPopup.alert({
                title: '提示',
                template: "请输入手机号"
            });
            return false;
        }
        if(!/^1\d{10}$/.test(this.form.telephone)){
            this.$ionicPopup.alert({
                title: '提示',
                template: "手机号格式不正确"
            });
            return false;
        }
        return true;
    }
    submitForm(){
        if(!this.verifyPhone()) return;
        if(!this.form.userName){
            this.$ionicPopup.alert({
                title: '提示',
                template: "请输入姓名"
            });
            return false;
        }
        if(!this.form.telVC){
            this.$ionicPopup.alert({
                title: '提示',
                template: "请输入验证码"
            });
            return false;
        }
        this.enterCourse();
    }
    sendCode(){
        if(!this.verifyPhone()) return;
        if(this.timeStatus==1) return;
        this.setCutDown();
        return this.liveService.sendMsgCode({
            telephone:this.form.telephone
        })
            .then((data) => {
                this.$ionicPopup.alert({
                    title: '提示',
                    template: "发送验证码成功"
                });
            })
    }
    setCutDown(){
        this.timeStatus=1;
        this.sendText=this.time+"秒";
        let timer=setInterval(()=>{
            this.time--;
            this.sendText=this.time+"秒";
            if(this.time==0){
                this.timeStatus=0;
                this.time=60;
                this.sendText="获取验证码"
                clearInterval(timer);
            }
            this.getScope().$digest();
        },1000)
    }
    enterCourse(){

        this.liveService.verifyMsgCode({
            telephone:this.form.telephone,
            appUserName:this.userInfo.loginName,
            userName:this.form.userName,
            id:this.selectCourse.id,
            telVC:this.form.telVC,
            type:2
        }).then((data)=>{
            if(data.code==200){
                this.showSuccessModal=true;
            }else{
                if(data.code==10027){
                    this.$ionicPopup.alert({
                        title: '提示',
                        template: "报名人数已满，请加唐老师微信:17780695191预约下一期直播课"
                    });
                }else{
                    this.$ionicPopup.alert({
                        title: '提示',
                        template: data.msg
                    });
                }
            }
        })
    }
    closeModal(){
     this.showSuccessModal=false;
        this.go("home.live_home")
    }
    callPhone(){
        this.$ionicActionSheet.show({
            buttons: [],
            titleText: `<div>
                            <div class="live-share-title" style="padding-left: 20px">扫一扫，找唐越老师咨询。</div>
                            <div class="live-share-title" style="padding-left: 20px">唐老师伴你一路成长！</div>
                            <div class="live-share-content" style="padding-left: 0;padding-top: 10px;text-align: center"><img src="${codeImg}" alt="" width="150"></div>
                        </div>`,
            cancelText: '取消',
            buttonClicked: function(index) {
                // location.href="tel:17780695191"
                return false;
            }
        });
    }
}

export default liveCtrl