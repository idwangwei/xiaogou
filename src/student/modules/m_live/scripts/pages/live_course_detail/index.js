/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from '../../module';
import codeImg from './../../../../m_live/images/live_home/live-home-code.png';
@View('live_course_detail', {
    url: '/live_course_detail',
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
        "$ionicScrollDelegate",
        "liveService"
    ]
})
class liveCtrl {
    $ionicHistory
    $ionicPopup
    $timeout
    $ocLazyLoad
    liveService
    $ionicScrollDelegate
    @select(state=>state.select_course) selectCourse;
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
        this.showSuccessModal=false;
        this.fee=0;
        this.oldFee=0;
        this.lessonList=[]
        this.paperInfo={}//试卷的信息
        this.teacherIntroduce={}
        this.shouldDoPaper=true;
        this.clazzArr=["","一","二","三","四","五","六"]
    }
    /*初始化页面*/
    initData(){
        this.shouldDoPaper=this.selectCourse.discountPercentObj.examination==="true"
    }
    initFn(){
        this.$ionicScrollDelegate.$getByHandle('liveDetailScroll').scrollTop();
        this.getCourseLessons()
    }
    getCourseLessons(){
        return this.liveService.fetchCourseLessons({
            id:this.selectCourse.id,
            shardingId:this.clazzInfo.id
        }).then((data)=>{
            this.fee=data.totalFee/100;
            this.oldFee=data.oldFee/100;
            this.paperInfo=data.previewResult;
            this.teacherIntroduce=JSON.parse(this.paperInfo.teacherIntroduce);
            this.teacherIntroduce.teacherStarArr=new Array(this.teacherIntroduce.teacherStar);
            /*下方按钮显示*/
            let url="",showTagStatus=0
            //实时更新type
            this.selectCourse.type=data.type;
            this.liveService.selectCourse(this.selectCourse);
            if(this.shouldDoPaper){//需要做试卷
                if(this.selectCourse.type==1){//已报名
                    url=""
                    showTagStatus=1
                }else if(this.paperInfo.status!=4&&this.selectCourse.studentCount<this.selectCourse.limitTotal){//为提交试卷
                    url="live_course_enter/live_course_bottom_btn_4.png"
                }else if(this.paperInfo.score>=this.paperInfo.enrollPreviewScoreLevel){//有资格报名,前往报名
                    url="live_course_enter/live_course_bottom_btn_3.png"
                    showTagStatus=1
                }else{ //没有资格报名
                    url=""
                    showTagStatus=2
                }
            }else{
                if(this.selectCourse.type==1){//已报名
                    url=""
                }else{
                    if(this.selectCourse.studentCount>=this.selectCourse.limitTotal){
                        url=""
                    }else{
                        url="live_course_enter/live_course_bottom_btn_2.png"
                    }
                }
            }
            this.paperInfo.btnUrl=url
            this.paperInfo.showTagStatus=showTagStatus
            data.result.forEach((v1)=>{
                v1.difficultyArr=new Array(v1.difficulty).fill("");
                let startTime=new Date(v1.lessionStartTime.replace(/-/g,"/"));
                v1.showTime=startTime.getMonth()+1+"月"+startTime.getDate()+"日 "+v1.lessionStartTime.slice(11,16)+"-"+v1.lessionStopTime.slice(11,16)
            })
            this.lessonList=data.result;
        })
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
    showMoreInfo() {
        this.$ionicActionSheet.show({
            buttons: [],
            titleText: `<div class="live-course-detail-more">
                        <div class="more-title">退款须知：</div>
                        <div class="more-content">本课程支持不满意随时退费。若开课后，申请退款需扣除已开课时的学费。</div>
                        <div class="more-title">直播课程：</div>
                        <div class="more-content">课前完成预习—课中做好笔记—课后完成练习。</div>
                        <div class="more-title">学情跟踪：</div>
                        <div class="more-content">指导老师全程跟踪，督促完成作业，确保学习效果。</div>
                        <div class="more-title">课程回放：</div>
                        <div class="more-content">直播课结束后，三天之内，智算365会上传录播视频。可随时观看复习。</div>
                    </div>`,
            cancelText: '取消',
        });
    }
    goToPay(){
        if(this.selectCourse.studentCount>=this.selectCourse.limitTotal) return;//报名人数满了
        if(this.selectCourse.type==0&&(this.paperInfo.score>=this.paperInfo.enrollPreviewScoreLevel||!this.shouldDoPaper)){
            let limitGrade = this.selectCourse.secondaryTeacherName.limitGrade || this.selectCourse.secondaryTeacherName.grade;
            //暂时5年级才能报名
            if(+this.clazzInfo.grade < +limitGrade){
                this.$ionicPopup.alert({
                    title: '提示',
                    template: "该课程只有"+this.clazzArr[+limitGrade]+"年级及以上的学生才能报名哦~"
                });
                return;
            }
            this.go("live_course_pay",{fee:this.fee});
        }else if(this.selectCourse.type==0&&this.paperInfo.status!=4){
            //去考试
            this.goToFeePaper()
        }

    }
    goToFeePaper(){
        this.selectCourse.paperInfo=this.paperInfo;
        this.liveService.selectCourse(this.selectCourse);
        this.go("live_course_fee_paper")
    }
}

export default liveCtrl