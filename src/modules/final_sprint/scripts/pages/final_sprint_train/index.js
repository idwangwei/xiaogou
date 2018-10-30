/**
 * Created by qiyuexi on 2017/12/11.
 */
/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'finalSprintTrain',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('final_sprint_train', {
    url: 'final_sprint_train',
    template: '<final_sprint_train></final_sprint_train>'
})

@Inject( '$scope', '$state','$ngRedux','$stateParams','$ionicHistory','$rootScope',"finalSprintService","diagnoseService","workReportService")
class finalSprintTrainCtrl {
    $ionicHistory
    @select(state=>state.select_sprint_week) selected_work;
    onBeforeLeaveView() {
        this.finalSprintService.cancelRequestList.forEach(function (cancelDefer) {
         cancelDefer.resolve(true);
         });
         this.finalSprintService.cancelRequestList.length=0;
    }
    onAfterEnterView(){
        console.log(this.selected_work)
        this.initData();
        this.initFn();
    }
    back(){
        this.go("final_sprint_home");
        // this.$ionicHistory.goBack();
    }
    constructor() {
        this.resetKnowledgeInfo=[];//重组后的考点返回数据
    }
    /*初始化页面*/
    initData(){
        this.AllScoreInfo={};//接受的分数返回数据
        this.AllKnowledgeInfo=[];//接受的考点返回数据
        this.resetScoreInfo={
            unfirm:0,//不牢固
            unhold:0,//未掌握
            hold:0,//掌握
            total:0,//总的知识点
            firstScore:0,//第一次得分
            modifyScore:0,//修改后得分
        };//重组后的分数返回数据
        // this.resetKnowledgeInfo=[];//重组后的考点返回数据
        this.dicObj={
            "unhold":{
                "id":"1",
                "class":"progress-1",
                "name":"未掌握"
            },
            "unfirm":{
                "id":"2",
                "class":"progress-2",
                "name":"不牢固"
            },
            "hold":{
                "id":"3",
                "class":"progress-3",
                "name":"掌握"
            },
        }
        this.isLoadingProcessing=true;//loading动画指令
    }
    initFn(){
        this.fetchScoreInfo().then(()=>{
            this.setScoreInfo();
        })
        this.fetchKnowledgeInfo().then(()=>{
            this.setKnowledgeInfo();
            this.isLoadingProcessing=false;//loading动画指令
        }).catch(()=>{
            this.isLoadingProcessing=false;
        });
    }
    goToKnowledge(x){
        this.chapterSelectPoint({
            "knowledgeId":x.knowledgeId
        });
        this.go('diagnose_do_question02',{
            'urlFrom': 'final_sprint_train',
            'pointName': x.knowledgeTxt,
            'pointIndex': 0,//不需要
            'backWorkReportUrl': "final_sprint_train"
        })
    }
    goToQuesRecord(item) {
        let param = {
            knowledgeId: item.knowledgeId,
            knowledgeName: item.num,
            chapterId: item.unitId,
            knowledgeTxt: item.knowledgeTxt,
            chapterContent: item.unitContent
        };
        this.workReportService.selectWorkKnowledge(param);
        this.go('ques_record', {pointIndex: -1,urlFrom:"final_sprint_train",formText:"期末全真模拟密卷（"+this.selected_work.name+"）"});
    }
    mapActionToThis() {
        let diagnoseService = this.diagnoseService;
        return {
            chapterSelectPoint: diagnoseService.chapterSelectPoint.bind(diagnoseService),
        }
    }
    setScoreInfo(){
        this.AllScoreInfo.knowledgeNumber.forEach((x,i)=>{
            this.resetScoreInfo.unfirm+=x.unfirm;//不牢固
            this.resetScoreInfo.unhold+=x.unhold;//未掌握
            this.resetScoreInfo.hold+=x.hold;//掌握
            this.resetScoreInfo.total+=x.total;//总的知识点
            let y=this.AllScoreInfo.scores[i];
            this.resetScoreInfo.firstScore+=y.firstScore;//第一次得分
            if(y.modifyScore===undefined){
                this.resetScoreInfo.modifyScore+=y.firstScore;//修改后得分
            }else{
                this.resetScoreInfo.modifyScore+=y.modifyScore;//修改后得分
            }
        })
        /*如果都没有修改过那就不存在修改后得分*/
        if(this.AllScoreInfo.scores.findIndex(x=>x.modifyScore!==undefined)==-1){
            this.resetScoreInfo.modifyScore=undefined;
        }
        console.log(this.resetScoreInfo)
    }
    setKnowledgeInfo(){
        let isFind=false;
        this.resetKnowledgeInfo=[];//为了优化
        this.AllKnowledgeInfo.forEach((x,i)=>{
            /*组装结果*/
            let index=this.resetKnowledgeInfo.findIndex((y)=>{
                return y.name==x.name;
            })
            if(index==-1){
                this.resetKnowledgeInfo.push(x)
            }else{
                this.resetKnowledgeInfo[index].data.push(...x.data)
            }
        })
        /*把单元进行排序*/
        this.resetKnowledgeInfo.sort((a,b)=>{
            if(a.name.split(" ").length<2){
                return 1;
            }
            if(b.name.split(" ").length<2){
                return -1;
            }
            let x=a.name.split(" ")[0];
            let y=b.name.split(" ")[0];
            return this.calcNum(x)-this.calcNum(y)
        })
        /*找出第一个来动画*/
        this.resetKnowledgeInfo.forEach((x,i)=>{
            /*计算出第一个未掌握或者不牢固的按钮*/
            if(!isFind){
                let result=x.data.find(x=>(x.level=='unhold'||x.level=='unfirm'))
                if(result){
                    result.hasAnimate=true
                    isFind=true;
                }
            }
        })
        console.log(this.resetKnowledgeInfo)
    }
    calcNum(x){
        let dic= {'一':1, '二':2, '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9, '十':10};
        // let max=200;
        if(x.length==1){
            return dic[x]
        }
        if(x.length==2){
            if("十".indexOf(x)==0){
                return "1"+dic[x[1]]-0
            }else{
                return dic[x[0]]+"0"-0
            }
        }
        if(x.length==3){
            dic['十']="";
            return dic[x[0]]+dic[x[1]]+dic[x[2]]-0
        }
        return 200
    }
    calcUnit(x){
        if(x.split(" ").length<2){
            return x+"：";
        }else{
            let arr=x.split(" ");
            return "第"+arr[0]+"单元："+arr[1]
        }
    }
    getFetchInfoParam() {
        let param = [];
        this.selected_work.data.forEach((x,i)=>{
            param.push({
                "paper":{
                    "paperInstanceId":x.originId,
                    "paperId":x.id
                }
            })
        })
        return param
    }
    fetchScoreInfo(){
        return this.finalSprintService.fetchScoreInfo({
            "withoutPaperContent":true,
            "filter": JSON.stringify(this.getFetchInfoParam()),
            "role":"S",
            "shardingId":this.selected_work.id
        })
            .then((data)=>{
                this.AllScoreInfo= data
            })
    }
    fetchKnowledgeInfo(){
        return this.finalSprintService.fetchKnowledgeInfo({
            "withoutPaperContent":true,
            "filter": JSON.stringify(this.getFetchInfoParam()),
            "role":"S",
            "shardingId":this.selected_work.id
        })
            .then((data)=>{
                this.AllKnowledgeInfo= data
            })
    }
}

export default finalSprintTrainCtrl