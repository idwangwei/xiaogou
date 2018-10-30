/**
 * Created by qiyuexi on 2017/12/19.
 */
import {Inject, View, Directive, select} from './../../module';

@View('micro_example_detail', {
    url: '/micro_example_detail',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$state'
        ,'$ngRedux'
        ,'$stateParams'
        ,'$ionicHistory'
        ,'$rootScope'
        ,"microUnitService"
        ,'profileService'
        ,'$ionicPopup'
        ,'$ionicLoading'
    ]
})

class MicroExampleDetailCtrl {
    microUnitService
    profileService
    $ionicPopup
    $ionicLoading
    @select(state=>state.micro_select_example_item) selectExampleItem;
    @select(state=>state.micro_example_detail) allExampleDetail;
    @select(state=>state.user_reward_base) rewardBase;
    onBeforeLeaveView() {
        this.microUnitService.cancelRequestList.forEach(function (cancelDefer) {
         cancelDefer.resolve(true);
         });
         this.microUnitService.cancelRequestList.length=0;
    }
    constructor(){
        this.resetExampleDetail={};
        this.alertMsg="";
        this.canShowFinger=false;
    }
    onAfterEnterView(){
        this.initData();
        this.initFn();
    }
    mapActionToThis() {
        let ps = this.profileService;
        return {
            getRewardInfoServer: ps.getRewardInfoServer.bind(ps),
            changeRewardCredits:ps.changeRewardCredits.bind(ps)
        }
    }
    /*初始化页面*/
    initData(){
        this.showNum=0;//弹框显示的能量数
        this.isAlertModalShowFlag=false;
        this.isFirstDialogShow=false;
        this.noticeText="";
    }
    initFn(){
        this.fetchMicroExampleDetail().then(()=>{
            this.setMicroExampleDetail();
            if(this.resetExampleDetail.rightQuestion==4){
                this.showAlert("本例已经学完了，快去学习其他例吧！")
            }
            if(this.resetExampleDetail.state==0){
                this.isFirstDialogShow=true;
                setTimeout(()=>{
                    this.isFirstDialogShow=false;
                    this.getScope().$digest();
                },2500)
            }
            if(this.resetExampleDetail.awardList[0].state==2){
                $(".gift-mark").show();
            }else{
                $(".gift-mark").hide();
            }
        })
        this.getRewardInfoServer();//获取最新的能量数值
        this.microUnitService.setDoQuestionMark(0);//清空标记
    }
    showAlert(msg){
        this.alertMsg=msg;
        this.isAlertModalShowFlag=true;
    }
    hideAlert(){
        this.isAlertModalShowFlag=false;
        this.showFinger();
    }
    showEnergyPopups(index){
        let obj=this.resetExampleDetail.awardList[index];
        if(obj.state!=2) return; //不能领奖就返回
        this.acceptAward({
            questionGroupId:this.selectExampleItem.groupId,
            type:obj.type
        }).then(()=>{
            this.showNum=obj.credits;
            this.changeRewardCredits(this.showNum)
            this.getRootScope().showRewardPrompt=true;
            /*更新页面数据*/
            obj.state=3;
        }).catch(()=>{
            this.$ionicLoading.show({
                template: "领取失败",
                duration: 1000
            });
        })
    }
    /*获取详情信息*/
    fetchMicroExampleDetail(){
        return this.microUnitService.fetchMicroExampleDetail({
            questionGroupId:this.selectExampleItem.groupId
        })
    }
    setMicroExampleDetail(){
        let itm=this.allExampleDetail;
        this.resetExampleDetail={
            state:itm.state,
            groupId:this.selectExampleItem.groupId,
            groupName:this.selectExampleItem.groupName,
            questionList:itm.questionList.sort((a,b)=>{
                return a.seq-b.seq;
            }),
            awardList:itm.awardList,
            isWatch:itm.videoTotalProgress>0,
            videoProgress:(itm.videoPassProgress/itm.videoTotalProgress||0)*100+'%',
            rightQuestion:itm.rightQuestion,
            stepThreeProgress:((itm.rightQuestion||1)-1)/3*100+'%',
        };
        this.noticeText=this.getBestStep().msg;
        this.alertInfo();//帮他点一下
    }
    /*点击老师头像智能提示步骤*/
    alertInfo(){
        let obj=this.getBestStep();
        // this.showAlert(obj.msg);
        this.canShowFinger=true;
        this.showFinger();
    }
    /*显示手指提示*/
    showFinger(){
        if(!this.canShowFinger) return;
        this.canShowFinger=false;
        let obj=this.getBestStep();
        if(obj.step==-1) return;
        let $doc=$(".micro-example-detail .finger-box");
        let $step=$(".micro-example-detail .content-step .step-img").eq(obj.step-1);
        let offset=$step.offset(),w=$step.width(),h=$step.height();
        $doc.css({
            "opacity":1,
            "top":offset.top+h/2+10,
            "left":offset.left+w/2+20
        })
        window.setTimeout(()=>{
            $doc.css({
                "opacity":0
            })
        },5000)
    }
    /*获取最优步骤*/
    getBestStep(){
        if(this.resetExampleDetail.state==0){
            return {
                step:1,
                msg:"先去“例题试做”哦！",
            }
        }
        if(this.resetExampleDetail.state!=0&&!this.resetExampleDetail.isWatch){
            return {
                step:2,
                msg:"快来跟着小慧老师一起学习吧！"
            }
        }
        if(this.resetExampleDetail.rightQuestion==0&&this.resetExampleDetail.isWatch){
            return {
                step:1,
                msg:"要将例题试做做对才能前往举一反三哟。"
            }
        }
        if(this.resetExampleDetail.rightQuestion==1&&this.resetExampleDetail.isWatch){
            return {
                step:3,
                msg:"快来举一反三中练练手吧。"
            }
        }
        if(this.resetExampleDetail.rightQuestion>1&&this.resetExampleDetail.rightQuestion<4){
          return {
            step:3,
            msg:"快去完成举一反三吧。"
          }
        }
        if(this.resetExampleDetail.rightQuestion==4){
            return {
                step:-1,
                msg:"本课程已经学完了，快去学习其他课程吧！"
            }
        }
        /*以上还判断不了就进第二步 可能是数据哪里出错了*/
        return {
          step:2,
          msg:"快来跟着小慧老师一起学习吧！"
        }
    }
    /*领取能量*/
    acceptAward(param){
        return this.microUnitService.acceptAward(param)
    }
    //进入详情页面
    goToStepDetail(step){
        let param={
            stepMark:step,
            groupId:this.resetExampleDetail.groupId,
            groupName:this.resetExampleDetail.groupName,
            questionIds:this.resetExampleDetail.questionList,
            status:this.resetExampleDetail.state,
            rightQuestion:this.resetExampleDetail.rightQuestion,
            isWatch:this.resetExampleDetail.isWatch,
            num:this.selectExampleItem.num,//例几
            starArr:this.selectExampleItem.starArr //星星
        };
        this.microUnitService.selectMicroExampleItem(param);//储存起来
        switch (step){
            case 1:this.go("example_do_question");break;
            case 2:
                if(this.resetExampleDetail.state==0){
                    this.showAlert('首先要提交例题后才能上辅导课哟！')
                    break;
                }
                this.go("micro_lecture_video_page", {
                    tagId: this.selectExampleItem.groupId,
                    isUnitStepOneRight: this.resetExampleDetail.awardList[0].state != 1
                });
                break;
            case 3:
                if(this.resetExampleDetail.state==0){
                    this.showAlert('要提交例题后，才能继续进行辅导哟！')
                    break;
                }
                if(!this.resetExampleDetail.isWatch){
                    //TODO  要有小手
                    this.showAlert('要上完辅导课，才能进行举一反三哟！')
                    break;
                }
                if(!(this.resetExampleDetail.rightQuestion>=1&&this.resetExampleDetail.isWatch)){
                    this.showAlert('上完辅导课，还要做对例题才能进入举一反三哟！')
                    break;
                }
                if(this.resetExampleDetail.rightQuestion==4){
                    this.go("mirco_all_ques_records");
                    break;
                }
                this.go("exercise_exam_do_question");
                break;
        }
    }
    back() {
        /*android后退 先关闭能量窗口*/
        if(this.getRootScope().showRewardPrompt==true){
            this.getRootScope().showRewardPrompt=false;
            this.getRootScope().$digest();
            return ;
        }
        if(this.isAlertModalShowFlag==true){
            this.isAlertModalShowFlag=false;
            this.getScope().$digest();
            return ;
        }
        this.go('micro_example_list');
    }
}

export default MicroExampleDetailCtrl