/**
 * Created by ZL on 2017/6/1.
 */
import {Inject, View, Directive, select} from 'ngDecoratorForStudent/ng-decorator';
@View('work_report', {
    url: '/work_report/:urlFrom',
    template: require('./work_report.html'),
    styles: require('./work_report.less'),
    inject:['$scope', '$interval', '$rootScope', '$log', '$state', '$ionicPopup', 'commonService', '$ngRedux', 'workReportService', 'diagnoseService','$ionicLoading','$ionicScrollDelegate','finalData','$ocLazyLoad']
})

class workReportCtrl {
    commonService;
    finalData;
    @select(state=>state.profile_user_auth.user.name) realName;
    @select(state=>state.work_report_info.paperName) paperName;
    @select(state=>state.work_report_info.totalScore) totalScore;
    @select(state=>state.work_report_info.publishType) publishType;
    // @select(state=>state.work_report_info.unitId) unitId;
    // @select(state=>state.work_report_info.allCheckPoints) allPoints;
    @select(state=>state.work_report_info.paperId) paperId;
    @select(state=>state.work_report_info.instanceId) instanceId;
    @select(state=>state.user_reward_base.avator) avator;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    @select(state=>state.wl_selected_clazz) clazzObj;
    @select(state=>state.work_report_info.quantityOfMasterLevel) allPoints;
    @select(state=>state.ques_record) allPointsQues;
    fetchFlag = false;

    getAllPointsQuesList() {
        if (!this.allPoints) return;
        let masterPoints = this.allPoints['4']; //掌握
        let insecurePoints = this.allPoints['3'];//不牢固
        let notMasterPoints = this.allPoints['2'];//未掌握
        let notDone = this.allPoints['1'];//未掌握
        let quesList = [];
        angular.forEach(masterPoints, (v, k)=> {
            quesList.push(this.allPointsQues[masterPoints[k]]);
            quesList[quesList.length - 1].masterStatus = 4;
        });
        angular.forEach(insecurePoints, (v, k)=> {
            quesList.push(this.allPointsQues[insecurePoints[k]]);
            quesList[quesList.length - 1].masterStatus = 3;
        });
        angular.forEach(notMasterPoints, (v, k)=> {
            quesList.push(this.allPointsQues[notMasterPoints[k]]);
            quesList[quesList.length - 1].masterStatus = 2;
        });
        angular.forEach(notDone, (v, k)=> {
            quesList.push(this.allPointsQues[notDone[k]]);
            quesList[quesList.length - 1].masterStatus = 2;
        });

        angular.forEach(quesList, (item)=> {
            this.getCheckPointsQues(item);
        });
        return quesList;

    }

    getAllPointsNum() {
        let checkPointsNum = 0;
        var keysArr = Object.keys(this.allPoints);
        angular.forEach(keysArr, (v, k)=> {
            checkPointsNum += Number(this.allPoints[keysArr[k]].length);
        });
        return checkPointsNum;
    }

    /**
     * 考点和对应的题目
     */
    getCheckPointsQues(item, index) {
        // let resultStr = item.num + ":";
        let knowNameArr = item.knowledgeTxt.split(".");
        knowNameArr.pop();
        item.knowledgePoint = knowNameArr.join("");
        let resultStr = "";
        //let resultStr = "考点" + (index + 1) + ":";
        let quesList = Object.values(item.questionDict);
        angular.forEach(quesList, (v, k)=> {
            if (k == 0 || k != 0 && quesList[k].qgSeq != quesList[k - 1].qgSeq) {
                if (k != 0) {
                    resultStr = resultStr.slice(0, resultStr.length - 1);
                    resultStr += ';';
                }
                // resultStr += this.numWords[quesList[k].qgSeq] + '.';
                resultStr += this.commonService.convertToChinese(quesList[k].qgSeq + 1) + '.';
            }
            resultStr += (quesList[k].qSeq + 1) + ',';
        });
        resultStr = resultStr.slice(0, resultStr.length - 1);
        resultStr += ';';
        resultStr = resultStr.replace(/\s/g, "");
        item.knowledgeAndQues = resultStr;
        return resultStr;
    }

    /**
     * 获取作业报告的信息 TODO
     */
    getWRInfo() {
        this.workReportService.getWorkReportInfo(this.paperId, this.instanceId, this.clazzId).then((data)=> {
            if (data && data.code == 200) {
                this.fetchFlag = true;
            }
        })
    }

    gotoQuesRecord(item, index) {
        let param = {
            knowledgeId: item.knowledgeId,
            knowledgeName: item.num,
            chapterId: item.unitId,
            knowledgeTxt: item.knowledgeTxt,
            chapterContent: item.unitContent
        };

        this.diagnoseService.changeClazz(this.clazzObj);
        this.workReportService.selectWorkKnowledge(param);
        //let pointIndex = item.knowledgePoint;//item.num || 3; //TODO 测试
        let pointIndex = item.num; //TODO 测试

        this.go('ques_record', {pointIndex: pointIndex});
    }

    gotoDiagnose(item) {
        let param = {
            knowledgeId: item.knowledgeId,
            knowledgeName: item.num,
            chapterId: item.unitId,
            knowledgeTxt: item.knowledgeTxt,
            chapterContent: item.unitContent
        };
      /*  if(!item.unitId){
            this.toast("找不到该知识点所在的单元");
            return;
        }*/
        // if(this.publishType==4||this.publishType==5||!item.unitId||item.unitContent.match('期末真题')){
        //     this.changeDiagnoseClazz(this.clazzObj);
        //     this.go('home.diagnose02',{backWorkReportUrl: 'work_report',isIncreaseScore:true});
        //     return;
        // }
        // this.saveDiagnoseEntryUrlFrom('work_report');
        this.changeDiagnoseClazz(this.clazzObj);
        this.workReportService.selectWorkKnowledge(param);
        if(item.masterStatus == 4){
            this.go('home.diagnose02', {backWorkReportUrl: 'work_report',isIncreaseScore:true});
            this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('forward');
        }else {
            this.$ocLazyLoad.load('m_pet_page').then(()=>{
                this.go('diagnose_knowledge02', {backWorkReportUrl: 'work_report',isIncreaseScore:true});
            });
        }
    }

    back() {
        this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');

        if(this.getStateService().params.urlFrom){
            this.getStateService().go(this.getStateService().params.urlFrom);
        }else if(this.publishType == this.finalData.WORK_TYPE.WINTER_WORK ||this.publishType == this.finalData.WORK_TYPE.SUMMER_WORK){
            this.getStateService().go("holiday_work_list");

        }else {
            this.getStateService().go("home.work_list");
        }


    }

    onBeforeLeaveView() {
        this.fetchFlag = false;
    }

    onAfterEnterView() {
        // this.$ocLazyLoad.load('m_pet_page')
        this.$ionicScrollDelegate.$getByHandle('work-report-content').scrollTop(true);
        this.getWRInfo();
        this.isFinalAccess = this.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS;
        this.isAreaEvaluation = this.publishType == this.finalData.WORK_TYPE.AREA_EVALUATION;
    }

    getAvator() {
        if (this.avator == 'default') return 1;
        return this.avator||1;
    }

    /**
     * 弹出提示框
     * @param msg
     */
    toast(msg, t) {
        let time = t || 1000;
        this.$ionicLoading.show({
            template: msg,
            duration: time,
            noBackdrop: true
        });
    }

    mapActionToThis() {
        let diagnoseService = this.diagnoseService;
        return {
            changeDiagnoseClazz: diagnoseService.changeClazz.bind(diagnoseService),
            saveDiagnoseEntryUrlFrom: diagnoseService.saveDiagnoseEntryUrlFrom.bind(diagnoseService)
        }
    }
}