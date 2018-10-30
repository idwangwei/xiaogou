/**
 * Author 邓小龙 on 2015/9/2.
 * @description 表扬 controller
 */
import  _ from 'underscore';
import {Inject, View, Directive, select} from '../../module';

@View('work_praise', {
    url: '/work_praise',
    styles: require('./work_praise.less'),
    template: require('./work_praise.html'),
    inject: [
        '$scope'
        , '$state'
        , '$ionicModal'
        , '$rootScope'
        , '$ionicHistory'
        , '$ngRedux'
        , 'commonService'
        , 'workStatisticsService'
        , 'finalData'
    ]
})
class WorkPraiseCtrl {
    finalData;
    workStatisticsService;
    $ngRedux;

    constructor() {
        this.initData();

        /**
         * @description 初始化表扬语modal页
         */
        this.$ionicModal.fromTemplateUrl('selectPraise.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then((modal) =>{
            this.getScope().praiseModal = modal;
            this.getRootScope().modal.push(modal);
        });
    }

    initData() {
        this.wData = this.workStatisticsService.wData;//共享作业的数据
        this.data = this.workStatisticsService.data;//共享的数据

        this.cBThumbsupFlag = false;//点赞标志
        this.cBBestFlag = false;//最佳作业奖标志
        this.cBGoodFlag = false;//优秀作业奖标志
        this.cBAmazingFlag = false;//最大进步奖标志
        this.bigImage = false;
        this.currentImg = {};//当前img对象
        if (!this.data.currentStu) {
            this.data.currentStu = {};
            this.data.currentStu.selectedPraise = "常用评价语！";
            this.data.praiseTypeList = [];
            _.each(this.finalData.PRAISE_TYPE_LIST, (item) =>{
                if (item.type <= 5) {
                    item.selected = false;
                    this.data.praiseTypeList.push(item);
                }
            });
            this.data.currentStu.praiseTempList = this.workStatisticsService.selectAppraiseList;
            this.data.currentStu.praiseList = [];
            angular.forEach(this.data.currentStu.praiseTempList, (item, index) =>{
                let info = {};
                info.id = index;
                info.value = item;
                this.data.currentStu.praiseList.push(info);
            });
        } else {
            this.data.currentStu.selectedPraise = "常用评价语！";
            this.workStatisticsService.getPraiseSelectList();//获取评价列表
        }
    }


    /**
     * 保存此次作业对某个学生的评价
     */
    savePraise() {
        let content = document.getElementById("teacherPraise").value;
        this.wData.queryParam.paperId = this.$ngRedux.getState().wl_selected_work.paperId;
        this.wData.queryParam.paperInstanceId = this.$ngRedux.getState().wl_selected_work.instanceId;
        this.wData.queryParam.showTipName = "整个作业";
        this.workStatisticsService.savePraise(content);//保存评价
    };

    /**
     * @description 打开表扬语modal
     *
     */
    openPraiseModal() {
        this.praiseModal.show();
    };

    /**
     * @description 关闭表扬语modal
     */
    closePraiseModal() {
        this.praiseModal.hide();
    };

    /**
     * 选择表扬语
     * @param rec 所选择的表扬语
     */
    selectedPraise(rec) {
        let teacherPraiseEle = document.getElementById("teacherPraise");
        teacherPraiseEle.value = teacherPraiseEle.value + rec.value;
        this.praiseModal.hide();
    };

    handleClick(praiseType) {
        this.data.praiseTypeList.forEach((item) =>{
            if (item != praiseType) {
                item.selected = false;
            }
        });
    };

    /**
     * 返回作业列表展示
     */
    back() {
        this.$ionicHistory.goBack();//返回到列表展示
    };
}
export default WorkPraiseCtrl;
