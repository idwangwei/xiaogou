/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from '../../module';

@View('final_sprint_home', {
    url: '/final_sprint_home/:from',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$state',
        '$ngRedux',
        '$stateParams',
        '$ionicHistory',
        '$rootScope',
        "finalSprintService",
        "$ionicPopup",
        "$ionicLoading",
        "paperService",
        "$timeout",
        "$ocLazyLoad"
    ]
})
class finalSprintHomeCtrl {
    $ionicHistory
    $ionicPopup
    $timeout
    $ocLazyLoad
    finalSprintService
    @select(state=>state.final_sprint_paper_list) allPaperInfo;
    @select(state=>state.final_sprint_paper_status_list) allWeekPaperStatusList;
    @select(state=>state.final_sprint_paper_info) allWeekInfo;
    @select(state=>state.select_sprint_week) selected_work;
    @select(state=>state.profile_clazz.passClazzList) clazzList;
    onBeforeLeaveView() {
        this.finalSprintService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.finalSprintService.cancelRequestList.length=0;
    }
    onAfterEnterView(){
        /*首页过来需要清除一下*/
        if(!this.selected_work){
            this.selected_work={}
        }
        this.initData();
        this.initFn();
        this.$ocLazyLoad.load("m_final_sprint_payment");
        this.$ocLazyLoad.load("m_final_sprint_question");
    }
    back(){
        if(this.isPayModalShow==true){
            this.isPayModalShow=false;
            this.getScope().$digest();
            return;
        }
        /*清空当前周到state*/
        this.finalSprintService.selectPaper({});
        if(this.getStateService().params.from=="study_index"){
            this.go("home.study_index");
        }else{
            this.go("home.improve");
        }
        this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');
    }
    constructor() {
        this.resetPaperInfo=[];//重组后的试卷信息
        this.currentPaperInfo={};//当前周的试卷信息
        this.numArr=["一","二","三","四"];//中文序号
    }
    mapActionToThis() {
        return {
            selectWork: this.paperService.selectWork,
        };
    }
    /*初始化页面*/
    initData(){
        this.startTime = "2017.12.07";
        /*this.allPaperInfo = {};//所有试卷信息
        this.allWeekInfo={};//所有周开启信息
        this.allWeekPaperStatusList=[];//所有周的所有状态列表*/
        /*上面的为接口直接获得*/
        // this.resetPaperInfo=[];//重组后的试卷信息
        this.currentWeekIndex = this.selected_work.index;//当前周 默认为0为第一周
        // this.currentPaperInfo={};//当前周的试卷信息
        // this.numArr=["一","二","三","四"];//中文序号
        this.isStepOneDoingFlag=true;//标记第一周的第一部分是否做过
        this.isPayModalShow=false;//支付弹窗
        this.isPayModalShowFlag=false;//支付弹窗inner
        this.isLoadingProcessing=true;//loading动画指令
    }
    initFn(){
        console.log(this.clazzList);
        this.fetchPaperList().then(()=>{
            this.fetchPaperStatusList().then(()=>{
                this.setPaperStatusList();
                this.setPaperInfo();
                this.isLoadingProcessing=false;
            });
        })
        this.fetchSprintInfo().then(()=>{
            this.setSprintInfo();
        })
    }
    setPaperInfo(){
        this.resetPaperInfo=[];//重置为空数组，放在这里为了优化页面
        if(this.allPaperInfo.papers==undefined){
            //error
            return ;
        }
        let obj={id:this.allPaperInfo.groupId};
        if(this.clazzList.length>0){
            obj=this.clazzList.find(x=>{
                return x.id==this.allPaperInfo.groupId
            })
        }
        this.finalSprintService.setSharingInfo(obj)
        this.finalSprintService.setDiagnoseSelectedClazz(obj)
        let workListState=[];
        this.allPaperInfo.papers.forEach((x,i)=>{
            let itm={};
            itm.openTime=x.openTime;
            itm.isOpen=this.calcWeek(itm.openTime)
            itm.name="第"+this.numArr[i]+"周";
            if(itm.isOpen&&this.selected_work.index===undefined) this.currentWeekIndex=i //技巧 最后一个满足条件的才是currentWeekIndex的真实值
            itm.child=x[i+1];
            /*兼容没出题的情况*/
            if(itm.child.length==0){
                itm.child=new Array(4).fill({
                    id: "",
                    name: "",
                    originId: ""
                })
            }
            let finishCount=0;
            itm.child.forEach((y,j)=>{
                y.status=this.allWeekPaperStatusList[i*4+j].key;
                y.val=this.allWeekPaperStatusList[i*4+j].value;
                y.oldStatus=y.status;
                y.status>3&&(y.status=3);//状态大于3就转化为3 已完成
                if(y.status>=3) finishCount++;
                workListState.push({
                    canFetchDoPaper:true,
                    canFetchPaper:true,
                    instanceId:y.originId,
                    paperInfo:{
                        doPaper:{
                            instanceId:y.originId,
                            paperId:y.id,
                            paperName:"期末全真模拟密卷（"+this.numArr[i]+"）-"+(j+1),
                            history:{
                                paperId:y.id,
                                paperInstanceId:y.originId,
                                status:{
                                    key:y.status,
                                    value:y.val
                                }
                            }
                        },
                        paperName:"期末全真模拟密卷（"+this.numArr[i]+"）-"+(j+1),
                    }
                })
            })
            itm.isStepOneFinish=false;
            if(finishCount==4) itm.isStepOneFinish=true;
            if(finishCount==0&&i==0) this.isStepOneDoingFlag=false;
            this.resetPaperInfo.push(itm)
        })
        this.reCalcData();
        this.setWorkList(workListState);//设置作业的state
        console.log(this.resetPaperInfo)
        console.log(this.currentWeekIndex)
    }
    setWorkList(workListState){
        this.finalSprintService.setWorkList({
            clzId: this.allPaperInfo.groupId,
            list: workListState
        })
    }
    calcWeek(time){
        time=time.replace(/-/g,'/');
        var difDay=(new Date().getTime()-new Date(time).getTime())/3600000/24;
        if(difDay>0){
            return true;
        }else{
            return false;
        }
    }
    reCalcData(){
        this.startTime=this.resetPaperInfo[this.currentWeekIndex].openTime.split(" ")[0];
        this.currentPaperInfo=this.resetPaperInfo[this.currentWeekIndex].child;
        /*设置当前周到state*/
        this.finalSprintService.selectPaper({
            index:this.currentWeekIndex,
            name:this.numArr[this.currentWeekIndex],
            id:this.allPaperInfo.groupId,
            data:this.currentPaperInfo
        });
    }
    changeWeek(index){
        let old=this.currentWeekIndex;
        this.currentWeekIndex=index;
        this.reCalcData();
        /*周还未开启 提示 和周开启了切换时提示*/
        if(!this.resetPaperInfo[this.currentWeekIndex].isOpen){
            this.$ionicLoading.show({
                template: "第"+this.numArr[index]+"周的提分训练还未开启，请耐心等待",
                duration: 3000
            });
            this.$timeout(()=>{
                this.changeWeek(old);
            },3000)
        }else{
            this.$ionicLoading.show({
                template: "进入第"+this.numArr[index]+"周提分训练",
                duration: 1000
            });
        }
    }
    /*做试卷页面*/
    goDoPaper(index){
        if(!this.btnProxy(1)) return;
        if(this.resetPaperInfo[this.currentWeekIndex].isStepOneFinish){
            this.$ionicPopup.alert({
                title: '提示',
                template: '请到“提分第2步”查看测评结果吧~'
            });
            return;
        }
        if(this.currentPaperInfo[index].status>2){
            this.$ionicPopup.alert({
                title: '提示',
                template: '请先完成密卷的其他部分！'
            });
            return;
        }
        let param = {
            paperId: this.currentPaperInfo[index].id,
            paperInstanceId: this.currentPaperInfo[index].originId,
            redoFlag: 'false', //是否是提交后再进入select_question做题
            urlFrom: 'finalSprint',
        };
        // param.paperId="e176e2cc-d6b5-4a72-a0c6-48c71453cbf7";
        // param.paperInstanceId="ed848e5d-318b-4559-8092-59f258d7d3fa";
        this.selectWork({
            instanceId:param.paperInstanceId,
            paperId:param.paperId,
            paperName:"期末全真模拟密卷（"+this.numArr[this.currentWeekIndex]+"）-"+(index+1),
            publishType:12
        })
        this.go("final_sprint_select_question", param); //返回做题
    }
    /*去查看页面*/
    goToCheck(){
        if(!this.btnProxy()) return;
        if(!this.resetPaperInfo[this.currentWeekIndex].isStepOneFinish){
            this.$ionicPopup.alert({
                title: '提示',
                template: '密卷未完成，完成后再来查看“测评结果”吧~'
            });
            return;
        }
        this.go("final_sprint_check");
    }
    /*去训练页面*/
    goToTrain(){
        if(!this.btnProxy()) return;
        if(!this.resetPaperInfo[this.currentWeekIndex].isStepOneFinish){
            this.$ionicPopup.alert({
                title: '提示',
                template: '密卷未完成，完成后再来练习吧~'
            });
            return;
        }
        this.go("final_sprint_train");
    }
    /*去支付页面*/
    goToPay(){
        this.isPayModalShow=false;
        this.go("final_sprint_pay");
    }
    showPayModal(){
        this.isPayModalShow=true;
        this.$timeout(()=>{
            this.isPayModalShowFlag=true;
        },50);
    }
    hidePayModal(){
        this.isPayModalShowFlag=false;
        this.$timeout(()=>{
            this.isPayModalShow=false;
        },1000);
    }
    /*所有按钮代理*/
    btnProxy(step){
        /*周还未开启*/
        if(!this.resetPaperInfo[this.currentWeekIndex].isOpen){
            this.$ionicPopup.alert({
                title: '提示',
                template: "别着急，期末复习按阶段来！<br/>认真复习，耐心等待第"+this.numArr[this.currentWeekIndex]+"周的提分训练吧！",
            });
            return false;
        }
        if(this.clazzList&&this.clazzList.length==0){
            this.$ionicPopup.alert({
                title: '提示',
                template: '让家长帮你加入一个班级，再来进行复习吧！'
            });
            return false;
        }
        let available=this.allWeekInfo[this.currentWeekIndex].available
        /*第一周第一步免费 其他给钱   第一周第一部分没有完就不走这个逻辑*/
        let flag1=(step==1&&this.currentWeekIndex==0);//第一周的去查看试卷
        let flag2=(this.currentWeekIndex==0&&!this.resetPaperInfo[0].isStepOneFinish);//当前周为 第一周 并且第一部分未完成
        if(!available&&!flag1&&!flag2){
            this.showPayModal();
            return;
        }
        return true;
    }
    getFetchPaperStatusListParamIn(){
        let param={
            "paperInstanceId":[],
            "paperId":[],
            "name":[],
        };
        this.allPaperInfo.papers.forEach((x,i)=>{
            x[i+1].forEach((y,j)=>{
                param.paperInstanceId.push(y.originId)
                param.paperId.push(y.id)
                param.name.push(y.name)
            })
        })
        return param;
    }
    /*获取所有试卷信息*/
    fetchPaperList(){
        return this.finalSprintService.fetchPaperList({})
    }
    /*获取试卷周记录的状态列表*/
    fetchPaperStatusList(){
        /*兼容没出题的情况*/
        return this.finalSprintService.fetchPaperStatusList({
            filter: JSON.stringify({
                paper: this.getFetchPaperStatusListParamIn()
            }),
            shardingId:this.allPaperInfo.groupId
        })
    }
    setPaperStatusList(){
        let data=this.allWeekPaperStatusList;
        let arr=new Array(16).fill({
            key:1,
            value:"未开始"
        })
        arr.forEach((x,i)=>{
            if(i<=data.length-1){
                arr[i]=data[i]
            }
        })
        this.allWeekPaperStatusList=arr;
    }
    /*获取开启周信息*/
    fetchSprintInfo(){
        return this.finalSprintService.fetchSprintInfo({})
    }
    setSprintInfo(){
        /*后端排序可能不正确 手动排序一次...*/
        let data=this.allWeekInfo;
        data.sort(function (a,b) {
            return a.res>b.res?1:-1
        })
        this.allWeekInfo=data;
    }
}

export default finalSprintHomeCtrl