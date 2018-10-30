/**
 * Created by qiyuexi on 2018/1/13.
 */
/**
 * Created by 邓小龙 on 2017/01/10.
 * 新版诊断及改进
 */

const CancelReduceKnowledgeCount = 2;
import {Inject, View, Directive, select} from '../../module';

@View('diagnose_knowledge02', {
    url: '/diagnose_knowledge02/:backWorkReportUrl/:isIncreaseScore',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$rootScope'
        , '$state'
        , '$stateParams'
        , 'commonService'
        , '$ngRedux'
        , '$ionicPopup'
        , '$timeout'
        , 'diagnoseService'
        , '$location'
        , '$anchorScroll'
        , '$ionicScrollDelegate'
        , 'increaseScoreService'
        , '$q'
        ,'$ocLazyLoad'
    ]
})
class DiagnoseKnowledge02Ctrl {
    changeSelect = false;
    workReportFlag = false;
    chapterConten = '';
    showSummaryGraph = false;
    showPopup = false;
    @select(state=>state.diagnose_entry_url_from.urlFrom) entryUrl;
    constructor() {
        this.initFlags();
        this.initData();

        // this.changeSelect = false;
        // this.workReportFlag = false;

        // this.chapterConten = '';

        // this.showSummaryGraph = false;

        // this.showPopup = false;
    }

    initData() {
        this.pieChart = {            //饼图插件对象
            instance: null
        };
        this.showPieChartFlag = false;
        this.AUTHORITY = {
            VIP: 1,
            ORDINARY: 2
        };
        this.firstUnMasterId = null;
    }

    initFlags() {
        this.initCtrl = false; //是否已初始化ctrl
        this.showDiaglog = true;
        this.isShowTipWord = true;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    initChapterContent() {
        if (this.workReportFlag) {
            this.chapterConten = this.chapterText;
        } else {
            this.chapterConten = this.homeSelectChapter.content;
        }
    }

    onAfterEnterView() {
        this.backUrl = this.getStateService().params.backWorkReportUrl;
        if (this.backUrl == 'work_report') {
            this.workReportFlag = true;
        }
        this.getRootScope().isIncreaseScore = this.isIncreaseScore = this.getStateService().params.isIncreaseScore == 'true';
        this.isIos = this.commonService.judgeSYS() == 2;

        this.$ocLazyLoad.load('m_diagnose_payment');
        if(this.isIncreaseScore){
            this.$ocLazyLoad.load('m_increase_score_payment');
        }
        this.$ocLazyLoad.load('m_pet_page');
        this.isShowTipWord = !this.isIncreaseScore;
        this.backUrl = this.getStateService().params.backWorkReportUrl;
        // TODO 确认一下
        /*if (this.backUrl == 'work_report'||this.entryUrl=='work_report') {
            this.workReportFlag = true;
        }*/
        this.initChapterContent();

        if (this.workReportFlag) {
            this.showDiaglog = true;
            this.initCtrl = true;
            this.showPieChartFlag = false;
            this.pieChart.instance = null;
            this.fetchChapterDiagnose02(this.loadCallback.bind(this), this.classId, this.chapterId, this.isIncreaseScore || this.workReportFlag);
            return;
        }
        if (this.homeSelectChapter.id) {
            this.showDiaglog = true;
            this.initCtrl = true;
            this.showPieChartFlag = false;
            this.pieChart.instance = null;
            this.fetchChapterDiagnose02(this.loadCallback.bind(this), undefined, undefined, this.isIncreaseScore || this.workReportFlag);
            return;
        }
    }


    ensurePageData() {
        if (this.homeSelectChapter.id && !this.initCtrl) {
            this.initCtrl = true;
            //this.pieChartRedraw(true);
            this.getChapterDiagnose();
        }
    }

    getChapterDiagnose() {
        if (this.workReportFlag && !this.changeSelect && this.classId && this.chapterId) {
            this.fetchChapterDiagnose02(this.loadCallback.bind(this), this.classId, this.chapterId, this.isIncreaseScore || this.workReportFlag);
        } else {
            this.fetchChapterDiagnose02(this.loadCallback.bind(this), undefined, undefined, this.isIncreaseScore || this.workReportFlag);
        }

    }

    onBeforeLeaveView() {
        this.isShowTipWord = false;
        this.workReportFlag = false;
        this.showDiaglog = false;
        this.chapterConten = '';
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseChapterRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseChapterRequestList.splice(0, this.diagnoseService.cancelDiagnoseChapterRequestList.length);//清空请求列表
    }

    /**
     * 加载完毕的回调
     */
    loadCallback(chapterDiagnoseStati) {
        this.showErrorMsg = !chapterDiagnoseStati;
        this.showPieChartFlag = true;
        /*angular.forEach(chapterDiagnoseStati.list,(unit)=>{
         unit.showChapCter=false;
         if(unit.id===this.unit_select_chapter.id){
         unit.showChapCter=true;
         }
         });*/
        this.chapter_diagnose = chapterDiagnoseStati;
        this.pieChartRedraw(true);
        //this.isLoadingProcessing=false;

        if (this.workReportFlag) {
            this.pointScroll();
        }
        if (this.backUrl == 'scrollToKnowledge') { //诊断页面显示了搜索过程，在知识点页面就需要跳转到制定知识点
            this.pointToFirstUnmasterUnit();
        }
    }

    pieChartRedraw(refleshFlag) {
        if (this.chapter_diagnose && this.chapter_diagnose.pieChart && this.pieChart.instance) {
            if (refleshFlag) {
                this.showPieChartFlag = false;
                this.$timeout(()=> {
                    this.showPieChartFlag = true;
                });
            }
            //this.pieChart.instance.redraw();
        } else {
            /*  if (refleshFlag) {
             this.showPieChartFlag = false;
             this.$timeout(()=> {
             this.showPieChartFlag = true;
             });
             }*/
        }
    }

    goToReport(pointInfo, pIndex, cIndex) {
        pointInfo.pIndex = pIndex;
        pointInfo.cIndex = cIndex;
        if (this.checkVip(pIndex, cIndex, pointInfo) === this.AUTHORITY.VIP) {
            //TODO:去查看报告
            this.chapterSelectPoint(pointInfo);
            this.changeSelect = true;
            this.go('diagnose_report', 'forward', {
                'urlFrom': 'diagnose_knowledge02',
                'pointIndex': (pointInfo.pointIndex + 1),
                'pointName': this.diagnoseService.pointNameFormat(pointInfo),
                'backWorkReportUrl': this.backUrl
            });
        }else if(this.isIncreaseScoreVipV2 && this.isIncreaseScore){
            this.chapterSelectPoint(pointInfo);
            this.changeSelect = true;
            this.handleVipV2ClickKnowledge(pointInfo).then((res)=>{
                if(res && res !== CancelReduceKnowledgeCount) {
                    //TODO:去查看报告
                    this.chapterSelectPoint(pointInfo);
                    this.changeSelect = true;
                    this.go('diagnose_report', 'forward', {
                        'urlFrom': 'diagnose_knowledge02',
                        'pointIndex': (pointInfo.pointIndex + 1),
                        'pointName': this.diagnoseService.pointNameFormat(pointInfo),
                        'backWorkReportUrl': this.backUrl
                    });
                }else if(res !== CancelReduceKnowledgeCount){
                    this.tipAndGoToPay();

                }
            });
        }else {
            this.tipAndGoToPay();
        }
    }

    checkVip(pIndex, cIndex, pointInfo) {
        let isVip;
        if (this.isIncreaseScore) {
            isVip = this.isIncreaseScore && this.chapter_diagnose.raiseScoreDays > 0;
        } else {
            isVip = !this.isIncreaseScore && this.chapter_diagnose.vipDays > 0;
        }


        // return this.AUTHORITY.VIP;
        if ((pIndex === 0 && (cIndex <= 1)) || (pointInfo.open&&this.isIncreaseScore))//表示第一单元的第一个和第二个考点，是免费的|考点特权数打开的考点
            return this.AUTHORITY.VIP;
        else {
            return isVip?this.AUTHORITY.VIP:this.AUTHORITY.ORDINARY;
        }
    }

    tipAndGoToPay(goToDoQuestionFlag) {
        let callback = ()=> {
            this.$ocLazyLoad.load('m_diagnose_payment').then(()=>{
                if(this.isIncreaseScore){
                    // this.$ocLazyLoad.load('m_increaseScore_payment').then(()=>{
                        this.go('increase_score_goods_select', 'forward', {
                            'selectedGrade': this.diagnoseSelectedGrade.num,
                        });
                    // })

                }else {
                    this.go('weixin_pay_select', 'forward', {
                        'urlFrom': 'diagnose_knowledge02',
                        'backWorkReportUrl': this.backUrl,
                        isIncreaseScore: this.isIncreaseScore
                    });
                }
            })

        };
        let templeteContent = "马上开通，扫清考点漏洞，挑战变式题，迅速提升成绩。";
        this.getScope().$emit('diagnose.dialog.show', {
            'showType': 'confirm',
            'comeFrom': 'diagnose-knowlege',
            'content': templeteContent,
            'confirmCallBack': callback
        });
    }

    showQQCustomService($event) {
        $event.stopPropagation();
        this.getScope().$emit('diagnose.dialog.show', {
            'comeFrom': 'diagnose',
            'content': '在使用智算365过程中遇到问题，请加入QQ群：255804252(智算365VIP用户群)。群里有指导老师随时为你做最专业的解答。'
        });
    }

    goToDoQuestion(pointInfo, pIndex, cIndex) {
        pointInfo.pIndex = pIndex;
        pointInfo.cIndex = cIndex;
        if(this.checkVip(pIndex, cIndex, pointInfo) === this.AUTHORITY.VIP ){
            this.chapterSelectPoint(pointInfo);
            this.changeSelect = true;
            this.go('diagnose_do_question02', 'forward', {
                'urlFrom': 'diagnose_knowledge02',
                'pointName': this.diagnoseService.pointNameFormat(pointInfo),
                'pointIndex': (pointInfo.pointIndex + 1),
                'backWorkReportUrl': this.backUrl
            });
        }else if(this.isIncreaseScoreVipV2 && this.isIncreaseScore){
            this.chapterSelectPoint(pointInfo);
            this.changeSelect = true;
            this.handleVipV2ClickKnowledge(pointInfo).then((res)=>{
                if(res && res !== CancelReduceKnowledgeCount){
                    this.go('diagnose_do_question02', 'forward', {
                        'urlFrom': 'diagnose_knowledge02',
                        'pointName': this.diagnoseService.pointNameFormat(pointInfo),
                        'pointIndex': (pointInfo.pointIndex + 1),
                        'backWorkReportUrl': this.backUrl
                    });
                }else if(res !== CancelReduceKnowledgeCount){
                    this.tipAndGoToPay();
                }
            });
        }else {
            this.tipAndGoToPay(true);
        }
    }


    mapStateToThis(state) {
        let vips = state.profile_user_auth.user.vips,
            vipKnowledgeCounts = 0, //诊断提分购买了的考点特权数
            isIncreaseScoreVipV2 = false, //诊断提分是否是购买了考点|整册
            vipKnowledgeGradeArr = []; //诊断提分购买的考点特权年级册集合

        vips&&vips.forEach((item)=> {
            if(item.hasOwnProperty('raiseScore2Key')){
                vipKnowledgeCounts = item['raiseScore2Key'];
                isIncreaseScoreVipV2 = true;
            }
            if(item.hasOwnProperty('raiseScore2')){
                vipKnowledgeGradeArr = item['raiseScore2'];
                isIncreaseScoreVipV2 = true;
            }
        });


        return {
            stuName: state.profile_user_auth.user.name,
            homeSelectChapter: state.home_select_chapter,
            isLoadingProcessing: state.fetch_chapter_diagnose_processing,
            chapterId: state.select_work_knowledge.chapterId,
            chapterText: state.select_work_knowledge.chapterContent,
            classId: state.wl_selected_clazz.id,
            knowledgeId: state.select_work_knowledge.knowledgeId,
            vips: vips,
            diagnoseSelectedGrade:state.diagnose_selected_grade,
            isIncreaseScoreVipV2: isIncreaseScoreVipV2,
            vipKnowledgeCounts: vipKnowledgeCounts,
            vipKnowledgeGradeArr: vipKnowledgeGradeArr,
            diagnoseSelectedClazz:state.diagnose_selected_clazz,
        };
    }

    mapActionToThis() {
        let diagnoseService = this.diagnoseService;
        return {
            fetchChapterDiagnose02: diagnoseService.fetchChapterDiagnose02.bind(diagnoseService),
            chapterSelectPoint: diagnoseService.chapterSelectPoint.bind(diagnoseService),
            reduceVipKnowledgeCounts: diagnoseService.reduceVipKnowledgeCounts.bind(diagnoseService)
        }
    }

    pointScroll() {
        this.$location.hash(this.knowledgeId);
        this.$anchorScroll();
    }

    back() {
        if (angular.element($('.diagnose-dialog-box').eq(0)).scope()
            && angular.element($('.diagnose-dialog-box').eq(0)).scope().showDiagnoseDialogFalg) {
            this.getScope().$emit('diagnose.dialog.hide');
            return;
        }
        let back = this.backUrl && this.backUrl!='scrollToKnowledge' ? this.backUrl : "home.diagnose02";
        this.go(back, 'back',{isIncreaseScore:this.getRootScope().isIncreaseScore});
    }

    hideTipWord() {
        this.isShowTipWord = false;
    }

    getFirstUnMasterUnit() {
        let unitArr = this.chapter_diagnose.list;
        let len = unitArr && unitArr.length ? unitArr.length : 0;
        for (let i = 0; i < len; i++) {
            let listArr = unitArr[i].list;
            let listLen = listArr && listArr.length ? listArr.length : 0;
            for (let j = 0; j < listLen; j++) {
                let text = listArr[j].masterDegree;
                if (text == "未掌握" || text == "不牢固") {
                    this.firstUnMasterId = listArr[j].knowledgeId;
                    return;
                }
            }
            if (this.firstUnMasterId) return;
        }
    };

    pointToFirstUnmasterUnit() {
        this.getFirstUnMasterUnit();
        if (!this.firstUnMasterId) return;
        this.$location.hash(this.firstUnMasterId);
        this.$anchorScroll();
        let height = $('#' + this.firstUnMasterId).height();
        this.$ionicScrollDelegate.scrollBy(0, -height);
    };

    handleShowSummaryGraph() {
        this.showSummaryGraph = !this.showSummaryGraph;

    }

    getPetGoods(pointInfo, pIndex, cIndex) {
        if (this.isIncreaseScore && this.checkVip(pIndex, cIndex, pointInfo) === this.AUTHORITY.VIP ) {
            this.increaseScoreService.getPetGoods({
                knowledgeId: pointInfo.knowledgeId,
                foodId: pointInfo.petGoods.id
            }).then(()=> {
                //显示领奖动画
                this.buyFoodSuccess = true;
                this.buyFoodType = pointInfo.petGoods.id;

                pointInfo.petGoods.received = true;
            }, ()=> {
                this.commonService.alertDialog('领取失败，稍后再试', 2000);
            });
        }
        else if(this.isIncreaseScoreVipV2 && this.isIncreaseScore){
            this.handleVipV2ClickKnowledge(pointInfo).then((res)=>{
                if(res && res !== CancelReduceKnowledgeCount){
                    this.increaseScoreService.getPetGoods({
                        knowledgeId: pointInfo.knowledgeId,
                        foodId: pointInfo.petGoods.id
                    }).then(()=> {
                        //显示领奖动画
                        this.buyFoodSuccess = true;
                        this.buyFoodType = pointInfo.petGoods.id;

                        pointInfo.petGoods.received = true;
                    }, ()=> {
                        this.commonService.alertDialog('领取失败，稍后再试', 2000);
                    });
                }else if(res !== CancelReduceKnowledgeCount){
                    this.tipAndGoToPay();
                }
            });
        }else {
            this.tipAndGoToPay();
        }
    }

    /**
     * 处理购买的考点特权显示
     */
    getIncreaseScoreVipStr(){
        let increaseScoreVipV2Str = '';
        //购买了考点特权，是从作业考点诊断进入该页
        if (this.isIncreaseScoreVipV2 && this.workReportFlag) {
            if (this.chapter_diagnose && this.chapter_diagnose.grade && this.vipKnowledgeGradeArr.indexOf(this.chapter_diagnose.grade.num)!=-1 ) {
                increaseScoreVipV2Str = this.chapter_diagnose.grade.name;
            }
            //点钱考点所在年级没有购买，且买过考点特权数量，显示数量
            else if (this.vipKnowledgeCounts > 0) {
                increaseScoreVipV2Str = this.vipKnowledgeCounts;
            }
        }
        //购买了考点特权，从诊断提分进入
        else if (this.isIncreaseScoreVipV2) {
            //当前考点所在年级是已购买的年级，考点特权显示当前年级
            if (this.vipKnowledgeGradeArr.indexOf(this.diagnoseSelectedGrade.num)!=-1) {
                increaseScoreVipV2Str = this.diagnoseSelectedGrade.name;
            }
            //点钱考点所在年级没有购买，且买过考点特权数量，显示数量
            else if (this.vipKnowledgeCounts > 0) {
                increaseScoreVipV2Str = this.vipKnowledgeCounts;
            }
        }
        //什么也没有买过，就不显示考点特权

        return increaseScoreVipV2Str
    }

    /**
     * 处理购买了考点特权点击知识点进入诊断报告|诊断做题操作
     * 1.购买当前选择年级的考点特权，直接进入下一页
     * 2.购买了考点特权数， 当前年级考点特权没有购买，扣除一个个考点特权数，进入下一页
     * 3.
     */
    handleVipV2ClickKnowledge(pointInfo){
        var defer = this.$q.defer();
        if(this.workReportFlag && this.vipKnowledgeGradeArr.indexOf(this.chapter_diagnose.grade.num)!=-1){
            defer.resolve(true);
        }else if(!this.workReportFlag && this.vipKnowledgeGradeArr.indexOf(this.diagnoseSelectedGrade.num)!=-1){
            defer.resolve(true);
        }else if(pointInfo.open){ //该考点已使用考点特权数打开
            defer.resolve(true);
        }else if(!pointInfo.open && this.vipKnowledgeCounts > 0){
            this.commonService.showConfirm(
                '<div>考点特权</div>',
                `<div>
                    <p style="text-align: center">进入本考点练习，将消耗</p>
                    <p class="display-flex">
                        <img style="height: 22px;margin-right: 6px;" ng-src="{{$root.loadImg('diagnose/stu_increase_score_icon.png')}}"/> 1 个考点特权，
                    </p>
                    <p style="text-align: center">确定使用吗？</p>
                </div>`
            ).then((res)=> {
                if(!res){
                    defer.resolve(CancelReduceKnowledgeCount);
                    return;
                }
                //调用接口，减掉1个考点特权
                this.reduceVipKnowledgeCounts({
                    type:'raiseScore2Key',
                    resourceId:pointInfo.knowledgeId
                }).then(()=>{
                    defer.resolve(true)
                },()=>{
                    defer.resolve(CancelReduceKnowledgeCount);
                    this.commonService.alertDialog('网络忙，请稍后再试！')
                })
            })
        }else {
            defer.resolve(false)
        }

        return defer.promise;
    }

    gotoSelectGoods(){
        // Promise.all([this.$ocLazyLoad.load('m_diagnose_payment'),this.$ocLazyLoad.load('m_increaseScore_payment')]).then(()=>{
            this.go('increase_score_goods_select', 'forward', {
                'selectedGrade': this.diagnoseSelectedGrade.num,
            })
        // });
    }

    /**
     * 返回当前考点背景色，返回 可进入为true，不能进入为false
     * @param pIndex
     * @param cIndex
     * @param pointInfo
     * @returns {boolean}
     */
    currentKnowledgeCanClickIn(pIndex,cIndex,pointInfo){
        //使用考点特权数打开了该考点|前两个考点，考点点亮
        if(pointInfo.open || (pIndex === 0 && cIndex <2)){
            return true;
        }
        //前两个考点后面的考点，有当前年级的vip,或者vip天数不为0,该考点点亮
        return ((pIndex === 0 && cIndex > 1) || pIndex != 0)
            && (this.chapter_diagnose.raiseScoreDays > 0||
            this.vipKnowledgeGradeArr.indexOf(this.diagnoseSelectedGrade.num) != -1);
    }
}

export default DiagnoseKnowledge02Ctrl
