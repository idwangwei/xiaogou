/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from '../../module';
import codeImg from './../../../../m_live/images/live_home/live-home-code.png';
@View('live_course_enter', {
    url: '/live_course_enter',
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
        this.go("home.live_home")
    }
    constructor() {
        this.courseDetail={};
    }
    /*初始化页面*/
    initData(){

    }
    initFn(){
        this.getCourseDetail()
    }
    getCourseDetail(){
        this.liveService.getCourseDetail({
            id:this.selectCourse.id
        }).then((data)=>{
            data.teacherIntroduce=JSON.parse(data.teacherIntroduce)
            data.lessionContent=JSON.parse(data.lessionContent)
            data.lessionHarvest=JSON.parse(data.lessionHarvest)
            data.teacherIntroduce.teacherStarArr=new Array(data.teacherIntroduce.teacherStar);
            console.log(data);
            this.courseDetail=data;
        })
    }
    enterCourse(){
        if(this.selectCourse.type==1){
            return;
        }
        if(this.selectCourse.limitTotal==this.selectCourse.studentCount){
            this.$ionicPopup.alert({
                title: '提示',
                template: "报名人数已满，请加唐老师微信:17780695191预约下一期直播课"
            });
            return;
        }
        //暂时5年级才能报名
        if(this.clazzInfo.grade!=5){
            this.$ionicPopup.alert({
                title: '提示',
                template: "该课程只有五年级的学生才能报名哦~"
            });
            return;
        }
        this.go("live_course_verify")
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