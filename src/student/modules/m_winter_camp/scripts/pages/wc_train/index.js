/**
 * Created by ZL on 2017/6/1.
 */
import audioSrc from './../../../audios/task-desc.mp3';
import {Inject, View, Directive, select} from 'ngDecoratorForStudent/ng-decorator';
@View('wc_train', {
    url: '/wc_train/:urlFrom',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ['$scope', '$interval', '$rootScope', '$log', '$state', '$ionicPopup',
        'commonService', '$ngRedux', 'workReportService', 'diagnoseService',
        '$ionicLoading', '$ionicScrollDelegate', 'finalData', '$ocLazyLoad', 'winterCampService']
})

class workReportCtrl {
    commonService;
    finalData;
    winterCampService;
    workReportService;
    // @select(state=>state.work_report_info.publishType) publishType;
    @select(state=>state.current_course_info.paper.paperId) paperId;
    @select(state=>state.current_course_info.paper.paperInstanceId) instanceId;
    @select(state=>state.wl_selected_clazz.id) clazzId;

    @select((state)=> {
        let classArr = state.profile_clazz.clazzList || [];
        if (classArr.length == 0) classArr = state.profile_clazz.selfStudyClazzList || [];
        let selectedClazz = classArr[0] || {};
        if (!selectedClazz.hasOwnProperty('teachingMaterial')) {
            selectedClazz.teachingMaterial = 'BS-北师版';
        }
        return selectedClazz;
    }) clazzObj;
    // @select(state=>state.work_report_info.quantityOfMasterLevel) allPoints;
    // @select(state=>state.ques_record) allPointsQues;
    // @select(state=>state.select_winter_camp_course) currentCourse;
    fetchFlag = false;
    audioSrc = audioSrc;
    descAudio = $('#task-desc-video-diagnose')[0];
    hasPlayEd = false;
    resetKnowledgeInfo = [];
    AllKnowledgeInfo = [];

    initData() {
        this.resetKnowledgeInfo = [];
        this.AllKnowledgeInfo = [];
        this.dicObj = {
            "unhold": {
                "id": "1",
                "class": "progress-1",
                "name": "未掌握"
            },
            "unfirm": {
                "id": "2",
                "class": "progress-2",
                "name": "不牢固"
            },
            "hold": {
                "id": "3",
                "class": "progress-3",
                "name": "掌握"
            },
        }
    }

    /*getAllPointsQuesList() {
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

     }*/

    /*getAllPointsNum() {
     let checkPointsNum = 0;
     var keysArr = Object.keys(this.allPoints);
     angular.forEach(keysArr, (v, k)=> {
     checkPointsNum += Number(this.allPoints[keysArr[k]].length);
     });
     return checkPointsNum;
     }*/

    /**
     * 考点和对应的题目
     */
    /*getCheckPointsQues(item, index) {
     // let resultStr = item.num + ":";
     let knowNameArr = item.knowledgeTxt.split(".");
     knowNameArr.pop;
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
     }*/

    /**
     * 获取作业报告的信息 TODO
     */
    getWRInfo() {
        //final_sprint_check
        /**
         * {
            "withoutPaperContent": true,
            "filter": JSON.stringify(this.getFetchInfoParam()),
            "role": "S",
            "shardingId": this.clazzId
        }
         */
        //this.paperId, this.instanceId,
        this.winterCampService.fetchKnowledgeInfo({
            "withoutPaperContent": true,
            "filter": JSON.stringify({paper: {paperId: this.paperId, paperInstanceId: this.instanceId}}),
            "role": "S",
            "shardingId": this.clazzId
        }).then((data)=> {
            if (data) {
                this.fetchFlag = true;
                this.AllKnowledgeInfo = data;
                this.setKnowledgeInfo();
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

        // this.diagnoseService.changeClazz(this.clazzObj);
        this.workReportService.selectWorkKnowledge(param);
        //let pointIndex = item.knowledgePoint;//item.num || 3; //TODO 测试
        // let pointIndex = item.num; //TODO 测试

        this.go('wc_ques_record', {pointIndex: pointIndex, urlFrom: "wc_train"});
    }


    back() {
        // this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');

        /* if(this.getStateService().params.urlFrom){
         this.getStateService().go(this.getStateService().params.urlFrom);
         }else if(this.publishType == this.finalData.WORK_TYPE.WINTER_WORK){
         this.getStateService().go("holiday_work_list");

         }else {
         this.getStateService().go("home.work_list");
         }*/
        this.getStateService().go("home.winter_camp_home");

    }

    onBeforeLeaveView() {
        if (this.descAudio) this.descAudio.pause();
        this.fetchFlag = false;
    }

    onAfterEnterView() {
        this.initData();
        this.$ocLazyLoad.load('m_pet_page');
        this.$ionicScrollDelegate.$getByHandle('work-report-content').scrollTop(true);
        this.getWRInfo();
        // this.isFinalAccess = this.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS;
        if (this.descAudio) this.descAudio.play();
        this.descAudio.addEventListener('ended', function () {
            $('.task-desc-video-butn .auto-mark').hide();
        }, false);
    }

    playAudio() {
        if (!this.descAudio) return;
        this.hasPlayEd = true;
        this.descAudio.pause();
        this.descAudio.play();
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
            chapterSelectPoint: diagnoseService.chapterSelectPoint.bind(diagnoseService),
            changeDiagnoseClazz: diagnoseService.changeClazz.bind(diagnoseService),
            // saveDiagnoseEntryUrlFrom: diagnoseService.saveDiagnoseEntryUrlFrom.bind(diagnoseService)
        }
    }

    setKnowledgeInfo() {
        this.resetKnowledgeInfo = [];//为了优化
        this.AllKnowledgeInfo.forEach((x, i)=> {
            /*组装结果*/
            this.resetKnowledgeInfo.push(...x.data)
        })
        /*把单元进行排序*/
        this.resetKnowledgeInfo.sort((a, b)=> {
            if (a.unitId.split(" ").length < 2) {
                return 1;
            }
            if (b.unitId.split(" ").length < 2) {
                return -1;
            }
            let x = a.unitId.split(" ")[0];
            let y = b.unitId.split(" ")[0];
            return this.calcNum(x) - this.calcNum(y)
        })
        console.log(this.resetKnowledgeInfo)
    }

    /* calcUnit(x){
     if(x.split(" ").length<2){
     return x+"：";
     }else{
     let arr=x.split(" ");
     return "第"+arr[0]+"单元："+arr[1]
     }
     }*/

    goToKnowledge(x) {
        this.chapterSelectPoint({
            "knowledgeId": x.knowledgeId
        });
        this.go('wc_diagnose_do_question', {
            'urlFrom': 'wc_train',
            'pointName': x.knowledgeTxt,
            'pointIndex': 0,//不需要
            'backWorkReportUrl': "wc_train"
        })
    }

    calcNum(x) {
        let dic = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10};
        // let max=200;
        if (x.length == 1) {
            return dic[x]
        }
        if (x.length == 2) {
            if ("十".indexOf(x) == 0) {
                return "1" + dic[x[1]] - 0
            } else {
                return dic[x[0]] + "0" - 0
            }
        }
        if (x.length == 3) {
            dic['十'] = "";
            return dic[x[0]] + dic[x[1]] + dic[x[2]] - 0
        }
        return 200
    }
}