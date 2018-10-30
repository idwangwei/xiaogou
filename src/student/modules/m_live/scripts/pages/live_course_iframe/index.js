/**
 * Created by qiyuexi on 2017/12/11.
 */
/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from '../../module';


@View('live_course_iframe', {
    url: 'live_course_iframe',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: [
        '$scope',
        '$state',
        '$ngRedux',
        '$stateParams',
        '$ionicHistory',
        '$rootScope',
        "$ionicLoading",
        "$ionicPopup",
        "commonService",
        "liveService"
    ]
})

class finalSprintCheckCtrl {
    $ionicHistory
    $ionicPopup
    liveService
    commonService
    @select(state=>state.select_my_course) currentCourse;
    @select(state=>state.profile_user_auth.user) userInfo;
    onBeforeLeaveView() {
        this.clearPage()
    }

    onAfterEnterView() {
        this.initData();
       this.initFn();
    }

    back() {
        this.go("home.live_home");
    }

    constructor() {
        this.timer={};
        this.isShow=true;
        this.isIPhone=this.commonService.judgeSYS() === 2
        this.iframeHash={
            height:0,
            sendMsg:""
        };
        if(this.isIPhone){
            window.addEventListener('native.keyboardshow',(e)=>{
                // todo 进行键盘可用时操作
                //e.keyboardHeight 表示软件盘显示的时候的高度
                //聊天容器的高度为40px
                var keyboardHeight=e.keyboardHeight||0;
                $(".frame-mark").css({
                    bottom:keyboardHeight+40+"px"
                }).show();
                $(".frame-btn").css({
                    bottom:keyboardHeight+5+"px"
                }).show();
                this.setHash("height",keyboardHeight);
                this.emitSrc()
            });
            window.addEventListener('native.keyboardhide', (e)=>{
                $(".frame-mark,.frame-btn").hide();
                this.setHash("height",0);
                this.emitSrc()
            });
        }
    }
    initData(){

    }
    initFn(){
        this.getAccessToken();
        // this.toggleBack();
    }
    getAccessToken(){
        return this.liveService.fetchAccessToken({
            uid:this.userInfo.userId,
            nickName:this.userInfo.name,
            courseId:this.currentCourse.courseId,
            id:this.currentCourse.id
        }).then((data)=>{
            if(data.code==200){
               /* $.get("http://192.168.0.25:8081/getUrl",(data1)=>{
                    let url=data1+'/live.html?access_token='+data.accessToken+this.getHashStrAll()
                    $("#talkfun_frame").attr('src',url)
                    // let url="https://open.talk-fun.com/room.php?ak=9d69ee8d9ce05e3b70e9f63556eb5ffc&from=opencms"

                })*/
                let url='http://www.xuexiv.com/live_mobile_2/live.html?access_token='+data.accessToken+this.getHashStrAll()
                $("#talkfun_frame").attr('src',url)
            }else{
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '你没有直播课程，快去报名吧~'
                }).then((res)=>{
                    this.back();
                })
            }
        })
    }
    clearPage(){
        // $("#talkfun_frame").attr("src","");
    }
    toggleBack(){
        clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
            this.isShow=false;
            this.getScope().$digest;
        },2000)
    }
    closeMark(){
        ionic.keyboard.hide();
    }
    sendMsg(){
        ionic.keyboard.hide();
        this.setHash("sendMsg",new Date().getTime());
        this.emitSrc()
    }
    setHash(key,val){
        this.iframeHash[key]=val;
    }
    emitSrc(){
        let url=$("#talkfun_frame").attr('src').split("#")[0]
        $("#talkfun_frame").attr('src',url+this.getHashStrAll())
        return
    }
    getHashStrAll(){
        var str="#"
        for(var v in this.iframeHash){
            str+=v+"="+this.iframeHash[v]+"&"
        }
        return str.slice(0,-1)
    }
}

export default finalSprintCheckCtrl
