/**
 * Created by qiyuexi on 2017/12/11.
 */
/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from '../../module';


@View('live_course_video_iframe', {
    url: 'live_course_video_iframe',
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
        // this.clearPage()
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
    }
    initData(){

    }
    initFn(){
        this.getAccessToken();
    }
    getAccessToken(){
        return this.liveService.fetchVideoUrl({
            uid:this.userInfo.userId,
            nickName:this.userInfo.name,
            courseId:this.currentCourse.courseId,
            id:this.currentCourse.id
        }).then((data)=>{
            if(data.code==200){
                let url=data.playbackUrl
                $("#video_frame").attr('src',url)
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
}

export default finalSprintCheckCtrl
