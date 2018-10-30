/**
 * Created by qiyuexi on 2017/12/11.
 */
/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from '../../module';


@View('live_course_video', {
    url: 'live_course_video',
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
        "$sce",
        "commonService",
        "liveService"
    ]
})

class finalSprintCheckCtrl {
    $ionicHistory
    $ionicPopup
    liveService
    $sce
    commonService
    @select(state=>state.select_my_course) currentCourse;
    @select(state=>state.profile_user_auth.user) userInfo;
    @select(state=>state.alert_watch_video_flag) videoFlog;
    onBeforeLeaveView() {

    }

    onAfterEnterView() {
        this.initData();
       this.initFn();
    }

    back() {
        this.go("home.live_home");
    }

    constructor() {
        this.showLoading=true;
    }
    initData(){
        this.showLoading=true;
        this.videoObj=$("#backVideo");
        this.videoObj.attr("src",this.currentCourse.playbackUrl)
        this.videoObj.on("loadstart",()=>{
            console.log("准备播放视频loadstart")
        })
        this.videoObj.on("canplay",()=>{
            console.log("准备播放视频canplay")
        })
        this.videoObj.on("play",()=>{
            console.log("准备播放视频play")
        })
        this.videoObj.on("end",()=>{
            console.log("准备播放视频end")
        })
        this.videoObj.on("timeupdate",()=>{
            console.log("准备播放视频timeupdate")
            this.showLoading=false;
            this.getScope().$digest();
            this.videoObj.off("timeupdate")
        })
        this.videoObj.on("playing",()=>{
           /* this.showLoading=false;
            this.getScope().$digest();
            console.log("准备播放视频playing")*/
        })
    }
    initFn(){
        let that=this;
        if(this.videoFlog){
            this.isChecked=false;
            this.$ionicPopup.show({
                template: '<p style="font-size: 16px">回放视频大，请尽量在wifi环境下观看哦</p><ion-checkbox ng-model="ctrl.isChecked" style="    border: none;background: transparent;width: 158px;margin: 0 auto;font-size: 14px">不再提示</ion-checkbox>',
                title: '提示',
                scope: this.getScope(),
                buttons: [
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (that.isChecked) {
                                that.setVideoFlag()
                            }
                        }
                    },
                ]
            });
        }
    }
    setVideoFlag(){
        this.liveService.setWatchVideoFlag(false);
    }
    videoUrlFun(url){
        var urlFun = this.$sce.trustAsResourceUrl(url);
        return urlFun;
    }
}

export default finalSprintCheckCtrl
