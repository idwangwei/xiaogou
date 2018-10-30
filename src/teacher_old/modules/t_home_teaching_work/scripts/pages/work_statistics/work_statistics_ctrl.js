/**
 * Author ww on 2016/10/17.
 * @description 统计分析 controller
 */

import {Inject, View, Directive, select} from '../../module';
import shareImg from "./../../../../t_boot/tImages/diagnose/share_img_to_p.png";

@View('work_statistics', {
    url: '/work_statistics',
    template: require('./work_statistics.html'),
    styles: require('./work_statistics.less'),
    inject:[
        '$scope'
        , '$state'
        , '$rootScope'
        , '$ionicScrollDelegate'
        , '$ngRedux'
        , '$timeout'
        , 'commonService'
        , 'workListService'
        , 'ngLocalStore'
        , 'diagnoseService'
        , 'finalData'
        , '$ionicHistory'
    ]
})

class WorkStatistics {
    $ionicScrollDelegate;
    commonService;
    workListService;
    $ngRedux;
    $timeout;
    diagnoseService;
    ngLocalStore;
    finalData;
    initCtrl = false;
    paperData;
    workAnalysis;
    retFlag = false;
    @select(state=>state.wl_selected_work) currentWork;
    isCompetitionPaper = true; //是否是竞赛试卷

    constructor() {


    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> {
                this.isCompetitionPaper = this.currentWork.publishType == 8; //是否是竞赛试卷
                this.initCtrl = true;
                let paperData = this.ngLocalStore.getTempPaper();
                if(paperData.id.indexOf(this.currentWork.paperId) != -1){
                    this.paperData = paperData.data;
                        getWorkStatistics.call(this);
                }
                else {
                    this.ngLocalStore.paperStore.getItem(this.getRootScope().user.loginName + '/' + this.currentWork.paperId).then((res)=> {
                        if(res){
                            this.paperData = res;
                            getWorkStatistics.call(this);
                        }
                    });
                }
            });
        
        
        function getWorkStatistics() {
            this.workListService.getWorkStatistics(this.paperData).then((res)=>{
                this.retFlag = true;
                this.workAnalysis = res;
            });
        }
    }

    onBeforeEnterView() {
        if(this.initCtrl&&this.retFlag){
            this.workListService.getWorkStatistics(this.paperData).then((res)=>{
                this.workAnalysis = res;
            });
        }
    }

    onBeforeLeaveView(){
        if (this.alertTimer) this.$timeout.cancel(this.alertTimer);
    }

    onAfterEnterView(){
        this.isFinalAccess = this.currentWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS;
    }

    back() {
        this.$ionicHistory.goBack()
        //this.getStateService().go('work_student_list',{paperInstanceId:this.currentWork.instanceId})
    }

    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition() {
        let moveData = this.$ionicScrollDelegate.getScrollPosition().top;
        if (moveData >= 250) {
            $('.scrollToTop').fadeIn();
        }
        else if (moveData < 250) {
            $('.scrollToTop').fadeOut();
        }
    };

    /**
     * 滚动到顶部
     */
    scrollTop() {
        this.$ionicScrollDelegate.scrollTop(true);
    };

    /**
     * 按当前小题，进入错误学生列表
     * @param smallQ 当前小题
     * @param bigQ 当前大题
     * @param stat 统计对象
     */
    goErrorStudentList(smallQ, bigQ, stat) {
        this.workListService.modifyStatisticsErrorInfo(smallQ, bigQ, stat);
        this.getStateService().go("error_student_list");
    };

    /**
     * 显示小题的知识点和难度
     * @param record
     * @returns {string}
     */
    showKnowledgeAndDifficulty(record) {
        // let str1 = record.knowledge[0].code.match(/-(\w+)$/)[1]; //知识点
        let str1 = record.knowledge[0].content.replace(/^[a-z]\d+\./i,'');
        let str2 = record.difficulty < 40 ? '基础' : record.difficulty > 70 ? '拓展' : '变式'; //难度
        return str1 + ' - ' + str2;
    }

    showQuesDetail(item){
        item.showQuesFlag = !item.showQuesFlag;
    }

    /**
     * 发送题型个学生；分享
     */
    sendMsgTostu() {
        this.diagnoseService.sendMsgTostudent();
        this.commonService.alertDialog('提醒已发送到学生端', 1000);
        this.alertTimer = this.$timeout(()=> {
            this.diagnoseService.shareImage(shareImg, this);
            this.$timeout.cancel(this.alertTimer);
        }, 1000);
    }
}

export default WorkStatistics;
