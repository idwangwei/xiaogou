/**
 * Created by qiyuexi on 2017/12/7.
 */
import codeImg from './../../../../m_live/images/live_home/live-home-code.png';
import {Inject, View, Directive, select} from '../../module';
@View('home.live_home', {
    url: '/live_home',
    views: {
        "live_home": {
            template: require('./page.html'),
            styles: require('./style.less'),
        }
    },
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
        "commonService",
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
    commonService
    @select(state=>state.profile_clazz.passClazzList) clazzList;
    @select(state=>state.select_my_course) currentCourse;
    @select(state=>state.refresh_current_course_flag) markTime;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    @select(state=>state.profile_user_auth.user) userInfo;
    onBeforeLeaveView() {

    }
    onAfterEnterView(){
        this.initData();
        this.initFn();
    }
    back() {
        if (this.showCourseModal) {
            this.showCourseModal = false;
        }else if (this.showSuccessModal) {
            this.showSuccessModal = false;
        }else {
            return 'exit';
        }
        this.getScope().$digest();
    }
    constructor() {
        this.showCourseModal=false;
        this.showSuccessModal=false;
        this.allCourseList=[];
        this.liveUrl="";
        this.liveTxt="";
        this.myCourseList=[];//我报名的课程和付费的课程
        this.isWin=this.commonService.judgeSYS() === 3
        this.clazzArr=["","一","二","三","四","五","六"]
    }
    /*初始化页面*/
    initData(){
        /*如果没有选择班级 默认一个班级 不然有问题*/
        // if(!this.clazzId){
            let clazz=this.clazzList.find(v=>v.type==200)
            if(clazz==null) clazz=this.clazzList[0]
            this.liveService.setSharingInfo(clazz)
            this.liveService.setDiagnoseSelectedClazz(clazz)
        // }
    }
    initFn(){
        // this.$ionicScrollDelegate.$getByHandle('liveHomeScroll').scrollTop();
        this.getCourseList()
    }
    getCourseList(){
        var arr=["日","一","二","三","四","五","六"];
        this.liveService.fetchCourseList().then((data)=>{
            let list=data.result;//课程列表
            list.forEach((v)=>{
                var startTime=new Date(v.startTime.replace(/-/g,"/"));
                v.showTime=startTime.getMonth()+1+"月"+startTime.getDate()+"日 周"+arr[startTime.getDay()]+" "+v.startTime.slice(11,16)+"-"+v.endTime.slice(11,16)
                v.showDate=v.startTime.slice(0,10)
                v.showDateTime=v.startTime.slice(11,16)+"-"+v.endTime.slice(11,16)
                v.feeName=v.fee?"免费":"付费"
                v.starArr=new Array(v.lessionDifficulty)
                v.secondaryTeacherName=JSON.parse(v.secondaryTeacherName)
                v.btnText=v.type==1?"已报名":"去约课";
                if(v.studentCount>=v.limitTotal&&v.type==0){
                    v.btnText="已售罄"
                }
                if(v.lessionName.indexOf("第")!=-1&&v.lessionName.indexOf("课")!=-1){
                    v.showLessionName=""
                }else{
                    v.showLessionName="："+v.lessionName
                }
                if(v.discountPercent){
                    v.discountPercentObj=JSON.parse(v.discountPercent)
                }
            })
            this.allCourseList=list
            this.getPaperStatus(data.videoPaperList);
            this.getScope().$broadcast('scroll.refreshComplete');//停止广播下拉
        })
    }
    getPaperStatus(list){
        if(list===undefined){
            this.liveService.selectMyCourse({});
            return;//没有东西
        }
        /*如果过了一天 那就重新默认*/
        let currnetTime=new Date()
        let timeStr=''+currnetTime.getFullYear()+currnetTime.getMonth()+currnetTime.getDate();
        if(this.markTime!=timeStr){
            this.liveService.setCurrentCourseFlag(timeStr)
            this.liveService.selectMyCourse({});
        }
        list=list.slice();
        let idArr=[],compareTimeArr=[];
        list.forEach((v,k)=>{
            v.videoLiveCoursePapers.forEach((v1,k1)=>{
                idArr.push(v1.previewPaper)
                idArr.push(v1.paperId)

                v1.difficultyArr=new Array(v1.difficulty).fill("");
                let startTime=new Date(v1.lessionStartTime.replace(/-/g,"/"));
                v1.showTime=startTime.getMonth()+1+"月"+startTime.getDate()+"日 "+v1.lessionStartTime.slice(11,16)+"-"+v1.lessionStopTime.slice(11,16)
                v1.showTime1=v1.lessionStartTime.slice(0,-3)+"-"+v1.lessionStopTime.slice(11,16)
                v1.topTitle=v.courseName;
                /*判断直播是否开始状态*/
                let endTime=new Date(v1.lessionStopTime.replace(/-/g,"/"));
                if(new Date().getTime()>endTime.getTime()){
                    v1.liveStatus=2;//已结束
                }else if(new Date().getTime()<startTime.getTime()){
                    v1.liveStatus=0;//未结束
                }else{
                    v1.liveStatus=1;//进行中
                }
                /*比较时间*/
                let obj={
                    time:startTime.getTime(),
                    id:v1.courseId,
                    title:v.courseName
                }
                compareTimeArr.push(obj)
            })
        })
        /*比较时间 算出当前最优解
        * 规则 最近一个未开始直播大于两天切前一个直播未完成 那么默认显示前一个直播
        *   一天计算一次
        * */
        let courseId="";
        compareTimeArr.sort((a,b)=>b.time-a.time);
        /*选出最近一个还未开课的课程*/
        compareTimeArr.forEach((v,k)=>{
            if(v.time>=new Date().getTime()){
                courseId=v.id;
            }
        })
        /*判断是否符合规则*/
        if(!courseId){
            courseId=compareTimeArr[0].id
        }
        /*else{
            if(compareTimeArr[k].time+24*2*3600000>=new Date().getTime()
                &&k!=compareTimeArr.length-1
                &&(compareTimeArr[k+1].)){
                courseId=v.id;
                index=k;
            }
        }*/
        if(!courseId){
            this.liveService.selectMyCourse({});
            return;//没有东西
        }
        let isSelect=false;
        if(!this.currentCourse.courseId){
            list.forEach((v,k)=>{
                let itm=v.videoLiveCoursePapers.find((v)=>v.courseId==courseId)
                if(itm!=null){
                    this.liveService.selectMyCourse(itm)
                    return false;
                }
            })
        }else{
            isSelect=true;
        }
        /*end*/
        this.liveService.fetchPaperStatusList({
            filter:JSON.stringify({
                paper:{
                    paperInstanceId:idArr,
                    paperId:idArr,
                    name:new Array(idArr.length).fill("test")
                }
            }),
            shardingId:this.clazzId
        }).then((data)=>{
            let i=0,workList=[],fullScore=data.fullScore,markObj1,markObj2;
            data=data.status
            list.forEach((v,k)=>{
                v.videoLiveCoursePapers.forEach((v1,k1)=>{
                    v1.preStatus=data[i].key
                    v1.preStatusFullFlag=fullScore[i].fullScore
                    v1.preStatusName=data[i++].value
                    v1.nextStatus=data[i].key
                    v1.nextStatusFullFlag=fullScore[i].fullScore
                    v1.nextStatusName=data[i++].value
                    if(v1.courseId==this.currentCourse.courseId){
                        markObj1=v1
                    }

                    /*兼容改错的显示*/
                    let obj={
                        canFetchDoPaper:true,
                        canFetchPaper:true,
                        instanceId:v1.previewPaper,
                        paperInfo:{
                            doPaper:{
                                instanceId:v1.previewPaper,
                                paperId:v1.previewPaper,
                                paperName:v1.lessonName,
                                history:{
                                    paperId:v1.previewPaper,
                                    paperInstanceId:v1.previewPaper,
                                    status:{
                                        key:v1.preStatus,
                                        value:v1.preStatusName
                                    }
                                }
                            },
                            paperName:v1.lessonName,
                        }
                    }
                    workList.push(obj)
                    let obj1={
                        canFetchDoPaper:true,
                        canFetchPaper:true,
                        instanceId:v1.paperId,
                        paperInfo:{
                            doPaper:{
                                instanceId:v1.paperId,
                                paperId:v1.paperId,
                                paperName:v1.lessonName,
                                history:{
                                    paperId:v1.paperId,
                                    paperInstanceId:v1.paperId,
                                    status:{
                                        key:v1.nextStatus,
                                        value:v1.nextStatusName
                                    }
                                }
                            },
                            paperName:v1.lessonName,
                        }
                    }
                    workList.push(obj1)
                })
            })
            /*根据规则重写默认值*/
            let markIndex1=compareTimeArr.findIndex(x=>x.id==this.currentCourse.courseId);
            if(markIndex1==-1){
                this.liveService.selectMyCourse(list[0].videoLiveCoursePapers[0]);
            }else{
                if(markIndex1==compareTimeArr.length-1||isSelect){
                    this.liveService.selectMyCourse(markObj1);
                }else{
                    let markId=compareTimeArr[markIndex1+1].id;
                    list.forEach((v,k)=>{
                        let a=v.videoLiveCoursePapers.findIndex(x=>x.courseId==markId);
                        if(a!=-1) markObj2=v.videoLiveCoursePapers[a];
                    })
                    if(compareTimeArr[markIndex1].time+24*2*3600000>=new Date().getTime()
                        &&!(markObj2.preStatusFullFlag&&markObj2.nextStatusFullFlag)){
                        this.liveService.selectMyCourse(markObj2);
                    }else{
                        this.liveService.selectMyCourse(markObj1);
                    }
                }
            }


            this.setWorkList(workList)
            this.myCourseList=list
        })
    }
    changeCurrentCourse(v,v1,index){
        //判断是否可以去点击
        //规则为该套课的前一个课没结束  后一个课不能点
        if(index!=0){
            let prev=v.videoLiveCoursePapers[index-1];
            let time=new Date(prev.lessionStopTime.replace(/-/g,"/")).getTime()
            if(new Date().getTime()<time){
                this.$ionicPopup.alert({
                    title: '提示',
                    template: "上完前面的课程才能开启哟！"
                });
                return;
            }
        }
        this.liveService.selectMyCourse(v1);
        this.hideModal()
    }
    hideModal(){
        this.showCourseModal=false;
    }
    showModal(){
        if(this.btnProxy()) return;
        this.showCourseModal=true;
    }
    goToEnter(item){
        this.liveService.selectCourse(item);
        if(item.fee){
            this.go('live_course_enter')
        }else{
            this.go('live_course_detail')
        }
    }
    btnProxy(){
        if(!this.currentCourse.courseId){
            this.$ionicPopup.alert({
                title: '提示',
                template: '你没有直播课程，快去报名吧~'
            });
            return true;
        }
        return false;
    }
    goToPaperDetail(type){
        if(this.btnProxy()) return;
        let id=this.currentCourse.previewPaper;
        let status=this.currentCourse.preStatus;
        let typeName="-预习"
        if(type==2){
            id=this.currentCourse.paperId;
            status=this.currentCourse.nextStatus;
            typeName="-练习"
            if(this.currentCourse.liveStatus!=2){
                this.$ionicPopup.alert({
                    title: '提示',
                    template: "上完直播课再来做作业吧~"
                });
                return;
            }
        }
        if(!id||!status) return;
        if(status!=4){
            let param = {
                paperId: id,
                paperInstanceId: id,
                redoFlag: 'false', //是否是提交后再进入select_question做题
                urlFrom: 'live',
            };
            // param.paperId="e176e2cc-d6b5-4a72-a0c6-48c71453cbf7";
            // param.paperInstanceId="ed848e5d-318b-4559-8092-59f258d7d3fa";
            this.selectWork({
                instanceId:param.paperInstanceId,
                paperId:param.paperId,
                paperName:this.currentCourse.lessonName,
                publishType:17,
                liveType:typeName
            })
            this.go("live_select_question", param); //返回做题
        }else{
            let param = {
                paperId: id,
                paperInstanceId: id,
                urlFrom: 'live',
            };
            this.selectWork({
                instanceId: param.paperInstanceId,
                paperId: param.paperId,
                paperName: this.currentCourse.lessonName,
                publishType: 17,
                liveType:typeName
            })
            this.go("live_work_detail", param);
        }
    }
    goToLive(){
        if(this.btnProxy()) return;
        let startTime=new Date(this.currentCourse.lessionStartTime.replace(/-/g,"/"));
        let endTime=new Date(this.currentCourse.lessionStopTime.replace(/-/g,"/"));
        if(new Date().getTime()>startTime.getTime()){
            if(this.currentCourse.liveStatus==0){
                this.currentCourse.liveStatus=1
            }
        }
        if(new Date().getTime()>endTime.getTime()){
            if(this.currentCourse.liveStatus==1){
                this.currentCourse.liveStatus=2
            }
        }
        if(this.currentCourse.liveStatus==0){
            let arr=this.currentCourse.showTime1.split(" ")
            this.$ionicPopup.alert({
                title: '提示',
                template: '<p style="text-align: center;margin-bottom: 0">直播时间为: '+arr[0]+'</br>'+arr[1]+'，还没开始哦~</p>'
            });
            return;
        }else if(this.currentCourse.liveStatus==1){
            if(this.isWin){
                this.getAccessToken()
            }else{
                this.go("live_course_iframe")
            }
        }else{
            if(!this.currentCourse.playbackUrl){
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '直播回放将在三天之内上传，敬请期待！'
                });
            }else if(this.currentCourse.playbackUrl=="ready"){
                if(this.isWin){
                    this.getVideoUrl()
                }else{
                    this.go("live_course_video_iframe")
                }
            }else{
                this.go("live_course_video")
            }
        }
    }
    getAccessToken(){
        return this.liveService.fetchAccessToken({
            uid:this.userInfo.userId,
            nickName:this.userInfo.name,
            courseId:this.currentCourse.courseId,
            id:this.currentCourse.id
        }).then((data)=>{
            if(data.code==200){
                this.liveTxt="直播"
                this.liveUrl='http://www.xuexiv.com/live_pc_2/live.html?access_token='+data.accessToken
                this.showSuccessModal=true;
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
    getVideoUrl(){
        return this.liveService.fetchVideoUrl({
            uid:this.userInfo.userId,
            nickName:this.userInfo.name,
            courseId:this.currentCourse.courseId,
            id:this.currentCourse.id
        }).then((data)=>{
            if(data.code==200){
                this.liveTxt="回放"
                this.liveUrl=data.playbackUrl
                this.showSuccessModal=true;
            }else{
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '系统出现问题，请稍后再试~'
                }).then((res)=>{
                    this.back();
                })
            }
        })
    }
    mapActionToThis() {
        return {
            selectWork: this.paperService.selectWork,
        };
    }
    setWorkList(workListState){
        this.liveService.setWorkList({
            clzId: this.clazzId,
            list: workListState
        })
    }
    closeModal(){
        this.showSuccessModal=false;
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