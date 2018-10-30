/**
 * Created by Administrator on 2016/8/3.
 */
import _indexOf from 'lodash.indexof';
import _each from 'lodash.foreach';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import {Inject, View, Directive, select} from '../../module';
@View('work_paper_detail', {
    url: '/work_paper_detail/:id/:urlFrom',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:[
        '$rootScope'
        , '$scope'
        , '$state'
        , '$ionicPopup'
        , '$ionicScrollDelegate'
        , '$ngRedux'
        , 'finalData'
        , 'commonService'
        , 'workChapterPaperService'
        , 'ngLocalStore'
        , 'workManageService'
        , "workStatisticsService"
    ]
})
class WorkPaperDetailCtrl{
    constructor() {
        this.initData();
    }

    initData() {
        this.isShowKAD = true;
        this.isIOS = this.commonService.judgeSYS() == 2;
        this.isShowTips = false;
        this.initCtrl = false;
        this.paper = null;
        this.isLoadingProcessing = true;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        this.guideFlag = this.commonService.getSimulationClazzLocalData();
        if (!this.initCtrl && !this.paper && this.selectPaperInfo) {
            this.initCtrl = true;

            //向服务器获取试卷最新数据，如果失败则使用本地数据
            this.workChapterPaperService.fetchPaper(this.selectPaperInfo.id,!this.selectUnit.isFirst).then((data)=> {
                if (data) {
                    this.isLoadingProcessing = false;
                    if(data.code == 850){
                        this.paper = {};
                        this.commonService.showAlert('温馨提示',
                            `<span style="text-align: center">${data.msg}</span>`
                        ).then(()=>{
                            this.back();
                        });

                    }else {
                        this.paper = data;
                    }
                } else {
                    this.getLocalStoragePaper();
                }
            }, ()=> {
                this.getLocalStoragePaper();
            });
        }
    }

    /**
     * 获取本地试卷数据
     */
    getLocalStoragePaper() {
        this.ngLocalStore.paperStore.keys().then((keys)=> {
            let key = this.getRootScope().user.loginName + '/' + this.selectPaperInfo.id;
            let index = _indexOf(keys, key);
            if (index != -1) {
                this.ngLocalStore.paperStore.getItem(key).then((paperData)=> {
                    this.getScope().$apply(()=> {
                        this.paper = paperData;
                        this.isLoadingProcessing = false;
                    });

                    this.ngLocalStore.setTempPaper(this.getRootScope().user.loginName + '/' + paperData.basic.id, paperData);
                })
            } else {
                this.getScope().$apply(()=> {
                    this.isLoadingProcessing = false;
                });
            }
        });
    }

    /**
     * 显示引导
     */
    showTips() {
        let key = this.getRootScope().user.loginName + "workPaperDetail";
        this.isShowTips = this.commonService.getLocalStorage(key);
        if (!this.isShowTips) {
            this.$ionicPopup.alert({
                title: '温馨提示',
                template: `<p style="font-size:16px">教师端不能做作业，只能查看作业、增删试题、布置作业等。</p>
                    <p style="font-size:16px">想要体验学生做作业，可以布置作业后用您的体验账号登录学生端</p>
                    <p style="font-size:16px">点击右上角的“?”了解更多。</p>
                    <ion-checkbox ng-click="ctrl.isShowTips = !ctrl.isShowTips"  style="border:none;background:none;font-size:14px">不再提示</ion-checkbox>`,
                scope: this.getScope(),
                okText: '确定'
            }).then(()=> {
                if (this.isShowTips) {
                    this.commonService.setLocalStorage(key, true)
                }
            });
        }
    }

    /**
     * 返回
     */
    back() {
        if(this.getStateService().params.urlFrom){
            this.go(this.getStateService().params.urlFrom);
            return
        }
        this.go('work_chapter_paper', {chapterId: this.selectUnit.unitId});
    };

    help() {
        this.$ionicPopup.alert({
            title: '如何增题删题？',
            template: '<p>1.先点击页脚的“编辑”会把作业拷贝到“编辑列表”，并开始对拷贝的试卷进行编辑</p>' +
            '<p>2.进入“编辑列表”，打开作业也可以编辑试卷</p>' +
            '<p>3.试题难度：基础＜精炼＜培优</p>',
            okText: '确定'
        });
    }

    /**
     * 获取该大题的中文题号和名称并返回
     * @param bigQ
     * @returns {*}
     */
    getBigQText(bigQ) {
        return this.workChapterPaperService.getBigQText(bigQ);
    }

    /**
     * 显示小题的知识点和难度
     * @param record
     * @returns {string}
     */
    showKnowledgeAndDifficulty(record) {
        let str1 = record.knowledge[0].content.replace(/^[a-z]\d+\./i, '');
        let str2 = record.difficulty < 40 ? '基础' : record.difficulty > 70 ? '拓展' : '变式'; //难度
        return str1 + ' - ' + str2;
    }


    /**
     * 滚动到顶部
     */
    scrollTop() {
        this.$ionicScrollDelegate.scrollTop(true);
    };

    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition() {
        if (this.$ionicScrollDelegate.getScrollPosition().top >= 250) {
            $('.scrollToTop').fadeIn();
        }
        else {
            $('.scrollToTop').fadeOut();
        }
    };

    /**
     * 点击考点进入考点展示页面
     */
    testPoints() {
        this.go('work_paper_points_detail')
    }

    /**
     * 布置作业
     */
    workPub() {
        if (this.holidayHomeworkCheck()) return;

        let smallQCount = 0;
        _each(this.paper.qsTitles, (v, i)=> {
            smallQCount += v.qsList.length
        });

        // if (smallQCount > this.finalData.WORK_QUESTION_MAX_COUNT) {
        //     this.$ionicPopup.alert({
        //         title: '警告',
        //         template: '<p style="color:red">题量有可能过大!</p>' +
        //         '<p>建议：一般单次作业以10到30分钟为宜。请老师根据本班情况斟酌。</p>' +
        //         '<p>想了解如何增删试题，请回到作业页面，点击右上角的"?"。</p>',
        //         okText: '确定'
        //     });
        // }
        /*
         if (smallQCount > this.finalData.WORK_QUESTION_MAX_COUNT) {
         let alertPopup = this.$ionicPopup.alert({
         title: '警告',
         template: '<p style="color:red">题量有可能过大!</p>' +
         '<p>建议：一般单次作业以10到30分钟为宜。请老师根据本班情况斟酌。</p>' +
         '<p>想了解如何增删试题，请回到作业页面，点击右上角的"?"。</p>',
         okText: '确定'
         });
         alertPopup.then(data=>{
         if(data){
         this.goToPub();
         }
         })
         }else{
         this.goToPub();
         }*/
        this.goToPub();
    };

    goToPub() {
        this.workManageService.libWork.id = this.paper.basic.id;
        this.workManageService.libWork.name = this.paper.basic.title;
        this.go("work_pub", {from: 'work_paper_detail'});
    }

    /**
     * 点击编辑进入试卷编辑页面
     * @returns {boolean}
     */
    paperEdit() {
        if(this.holidayHomeworkCheck()) return;

        // this.addBackupWork(this.selectUnit.unitId, this.paper)
        //     .then((data)=> {
        //         if (data) {
        this.go("work_paper_edit", {fromUrl: 'work_paper_detail'});
        //             return
        //         }
        //
        //         this.$ionicPopup.alert({
        //             title: '提示信息',
        //             template: '<p style="text-align: center">添加编辑试卷失败</p>'
        //         });
        //     });
    };

    /**
     * 打印试卷
     */
    paperPrint() {
        this.commonService.print();
    }


    /**
     * 检查当前作业是否为暑假作业或者寒假作业，是的话，给予提示
     */
    holidayHomeworkCheck() {
        var reg = new RegExp(/.*[暑|寒].*[期|假].*作.*业/g);
        if (reg.test(this.selectPaperInfo.title)) {
            this.$ionicPopup.alert({
                title: '温馨提示',
                template: '<p style="font-size:16px">' + (this.selectPaperInfo.title || "作业") + '由智算365自动发布' + '</p>',
                okText: '确定'
            });
            return true;
        }
    }


    goQFeedbackPage($event, questionId) {
        $event.stopPropagation();
        this.workStatisticsService.workDetailState.lastStateUrl = this.getStateService().current.name;
        this.workStatisticsService.workDetailState.lastStateParams = this.getStateService().params;
        this.workStatisticsService.QInfo.questionId = questionId;
        this.workStatisticsService.QInfo.paperId = this.selectPaperInfo.id;
        this.getStateService().go('q_feedback');
    }


    mapStateToThis(state) {
        return {
            //userId:state.profile.userId,
            selectPaperInfo: state.wr_selected_paper,
            selectUnit: state.wr_selected_unit,
        }
    }

    mapActionToThis() {
        return {
            addBackupWork: this.workChapterPaperService.addBackupWork.bind(this.workChapterPaperService)

        }
    }

    getHighLightEle() {
        this.currentShowEle = $(".work_paper_detail_file[nav-view = 'active'] .footer_click_btn").eq(1);
    }
}
export default WorkPaperDetailCtrl;