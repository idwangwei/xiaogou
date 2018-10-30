/**
 * Created by qiyuexi on 2017/12/11.
 */
/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'finalSprintCheck',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('final_sprint_check', {
    url: 'final_sprint_check',
    template: '<final_sprint_check></final_sprint_check>'
})

@Inject( '$scope', '$state','$ngRedux','$stateParams','$ionicHistory','$rootScope',"finalSprintService","paperService","workReportService","$ionicLoading")
class finalSprintCheckCtrl {
    $ionicHistory
    $ionicLoading
    @select(state=>state.select_sprint_week) selected_work;
    onBeforeLeaveView() {
        this.finalSprintService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.finalSprintService.cancelRequestList.length=0;
    }
    onAfterEnterView(){
        console.log(this.clazzList)
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
        this.AllScoreInfo=[];//接受的返回数据
        this.AllKnowledgeInfo=[];//接受的考点返回数据
        this.resetScoreInfo={
            unfirm:0,//不牢固
            unhold:0,//未掌握
            hold:0,//掌握
            total:0,//总的知识点
            firstScore:0,//第一次得分
            modifyScore:0,//修改后得分
        };//重组后的分数返回数据
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
    goToCheckDetail(index){
        let param = {
            paperId: this.selected_work.data[index].id,
            paperInstanceId: this.selected_work.data[index].originId,
            urlFrom: 'finalSprint',
        };
        this.selectWork({
            instanceId:param.paperInstanceId,
            paperId:param.paperId,
            paperName:"期末全真模拟密卷（"+this.selected_work.name+"）-"+(index+1),
            publishType:12
        })
        this.go("work_detail", param);
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
        this.go('ques_record', {pointIndex: -1,urlFrom:"final_sprint_check",formText:"期末全真模拟密卷（"+this.selected_work.name+"）"});
    }
    goToKnowledge(){
        this.$ionicLoading.show({
            template: "请去提分第3步进行变式训练~",
            duration: 1000
        });
    }
    mapActionToThis() {
        return {
            selectWork: this.paperService.selectWork,
        };
    }
    setScoreInfo(){
        this.AllScoreInfo.knowledgeNumber.forEach((x,i)=>{
            this.resetScoreInfo.unfirm+=x.unfirm||0;//不牢固
            this.resetScoreInfo.unhold+=x.unhold||0;//未掌握
            this.resetScoreInfo.hold+=x.hold||0;//掌握
            this.resetScoreInfo.total+=x.total||0;//总的知识点
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
        this.resetKnowledgeInfo=[];//为了优化
        this.AllKnowledgeInfo.forEach((x,i)=>{
            /*组装结果*/
            this.resetKnowledgeInfo.push(...x.data)
        })
        /*把单元进行排序*/
        this.resetKnowledgeInfo.sort((a,b)=>{
            if(a.unitId.split(" ").length<2){
                return 1;
            }
            if(b.unitId.split(" ").length<2){
                return -1;
            }
            let x=a.unitId.split(" ")[0];
            let y=b.unitId.split(" ")[0];
            return this.calcNum(x)-this.calcNum(y)
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
            return [x,""];
        }else{
            let arr=x.split(" ");
            return ["第"+arr[0]+"单元：",arr[1]]
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
                this.AllScoreInfo= data;
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

export default finalSprintCheckCtrl