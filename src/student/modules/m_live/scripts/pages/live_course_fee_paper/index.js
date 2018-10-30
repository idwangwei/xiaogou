/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from '../../module';

@View('live_course_fee_paper', {
    url: '/live_course_fee_paper',
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
        "commonService",
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
    commonService
    paperService
    liveService
    @select(state=>state.select_course) selectCourse;
    @select(state=>state.profile_user_auth.user) userInfo;
    @select(state=>state.wl_selected_clazz) clazzInfo;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    onBeforeLeaveView() {
        if(this.timer) clearInterval(this.timer)
    }
    onAfterEnterView(){
        this.initData();
        this.initFn();
    }
    back() {
        this.go("live_course_detail")
    }
    constructor() {
        this.courseDetail={};
        this.thisTimer=""
        this.timer={}
    }
    /*初始化页面*/
    initData(){
        this.timerMark="liveTimer"+this.userInfo.userId+this.selectCourse.id
        this.btnUrl=""
        this.refreshStatus().then((data)=>{
            this.selectCourse.paperInfo=data.previewResult;
            this.selectCourse.type=data.type;
            this.selectCourse.totalFee=data.totalFee;
            this.liveService.selectCourse(this.selectCourse);
            if(this.selectCourse.paperInfo.status!=4){
                if(this.selectCourse.paperInfo.status==1){
                    this.btnUrl="live_course_enter/live_course_bottom_btn_6.png"
                }else{
                    this.btnUrl="live_course_enter/live_course_bottom_btn_5.png"
                    this.initThisTime()
                }
            }else if(this.selectCourse.paperInfo.score>=this.selectCourse.paperInfo.enrollPreviewScoreLevel){
                if(this.selectCourse.type==1){
                    //已报名
                }else{
                    this.btnUrl="live_course_enter/live_course_bottom_btn_3.png"
                }

            }else{
                this.btnUrl="live_course_enter/live_course_back.png"
            }
        })
    }
    initFn(){
        this.initPaperList()
    }
    refreshStatus(){
        return this.liveService.fetchCourseLessons({
            id:this.selectCourse.id,
            shardingId:this.clazzInfo.id
        })
    }
    initPaperList(){
        let v1=this.selectCourse.paperInfo
        this.setWorkList([{
            canFetchDoPaper:true,
            canFetchPaper:true,
            instanceId:v1.enrollPreviewPaperId,
            paperInfo:{
                doPaper:{
                    instanceId:v1.enrollPreviewPaperId,
                    paperId:v1.enrollPreviewPaperId,
                    paperName:v1.enrollPreviewPaperName,
                    history:{
                        paperId:v1.enrollPreviewPaperId,
                        paperInstanceId:v1.enrollPreviewPaperId,
                        status:{
                            key:v1.status,
                            value:'已批改'
                        }
                    }
                },
                paperName:v1.enrollPreviewPaperName,
            }
        }])
    }
    btnClick(){
        if(this.selectCourse.paperInfo.status!=4){//还没开始
            if(this.selectCourse.paperInfo.status==1){
                //开始定时器
                this.commonService.showConfirm("提示", '一旦开始，需在规定的时间内提交，确认要开始考试吗？').then((res)=>{
                    if(res){
                        this.initTimer();
                        this.selectCourse.paperInfo.status=2
                        this.btnClick()
                    }
                })
            }else{
                let paperInfo=this.selectCourse.paperInfo;
                let param = {
                    paperId: paperInfo.enrollPreviewPaperId,
                    paperInstanceId: paperInfo.enrollPreviewPaperId,
                    redoFlag: 'false', //是否是提交后再进入select_question做题
                    urlFrom: 'live',
                };
                this.selectWork({
                    instanceId:param.paperId,
                    paperId:param.paperId,
                    paperName:paperInfo.enrollPreviewPaperName,
                    publishType:17,
                    liveType:"",
                    liveToPay:1,//标记是考试作业
                })
                this.go("live_select_question", param);
            }

        }else if(this.selectCourse.paperInfo.score>=this.selectCourse.paperInfo.enrollPreviewScoreLevel){
            this.go("live_course_pay",{fee:this.selectCourse.totalFee/100});
        }else{
            this.go("live_course_detail");
        }
    }
    goToPaper(){
        debugger
        let paperInfo=this.selectCourse.paperInfo;
        let param = {
            paperId: paperInfo.enrollPreviewPaperId,
            paperInstanceId: paperInfo.enrollPreviewPaperId,
            urlFrom: 'live',
        };
        this.selectWork({
            instanceId: param.paperInstanceId,
            paperId: param.paperId,
            paperName: paperInfo.enrollPreviewPaperName,
            publishType: 17,
            liveType:"",
            liveToPay:2,//标记是改错考试作业
        })
        this.go("live_work_detail", param);
    }
    mapActionToThis() {
        return {
            selectWork: this.paperService.selectWork,
        };
    }
    initTimer(){
        var max=this.selectCourse.paperInfo.enrollPreviewLimitTime*60;
        localStorage.setItem(this.timerMark, new Date().getTime());
        localStorage.setItem(this.timerMark+"max", max);
    }
    initThisTime(){
        let max=localStorage.getItem(this.timerMark+"max");
        let oldTime=localStorage.getItem(this.timerMark);
        if(max==null){
            //如果拿不到这些信息 就重新计时。。。
            this.initTimer();
            this.initThisTime();
            return;
        }
        let now=new Date().getTime();
        let cal=max-Math.floor((now-oldTime)/1000)
        if(cal<=0) cal=0;
        this.thisTimer=fn(cal)
        this.timer=setInterval(()=>{
            cal--;
            this.thisTimer=fn(cal)
            // localStorage.setItem(this.timerMark, m+":"+s);
            if(cal<=0){
                this.thisTimer="00:00"
                clearInterval(this.timer)
            }
            this.getScope().$digest();
        },1000)
        function fn(cal) {
            var s=cal%60;
            var m=Math.floor(cal/60);
            if(s<10){
                s="0"+s;
            }
            if(m<10){
                m="0"+m;
            }
            return m+":"+s
        }
    }
    setWorkList(workListState){
        this.liveService.setWorkList({
            clzId: this.clazzId,
            list: workListState
        })
    }
}

export default liveCtrl