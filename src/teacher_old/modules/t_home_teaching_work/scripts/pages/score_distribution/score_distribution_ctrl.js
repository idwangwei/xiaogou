/**
 * Author 邓小龙 on 2015/11/2.
 * @description 成绩分布
 */
import {Inject, View, Directive, select} from '../../module';

@View('score_distribution', {
    url: '/score_distribution/:paperTitle/:paperScore/:classFlag',
    styles: require('./score_distribution.less'),
    template: require('./score_distribution.html'),
    inject: [
        '$scope'
        , '$log'
        , '$state'
        , '$interval'
        , '$ionicNavBarDelegate'
        , 'workStatisticsService'
        , '$ionicHistory'
        , '$ngRedux'
        , '$rootScope'
    ]
})
class scoreDistributionCtrl {
    workStatisticsService;
    $ngRedux;

    @select((state)=>state.wl_selected_work.paperName) paperTitle;
    @select((state)=>state.wl_selected_work.stu.totalScore) paperScore;
    @select((state)=>state.wl_selected_work.publishType) publishType;
    @select((state)=>state.wl_selected_work.instanceId) instanceId;
    @select((state)=>state.wl_selected_work.paperId) paperId;
    isCompetitionPaper = this.publishType == 8;

    initData() {
        this.wData = this.workStatisticsService.wData;
        this.wData.scoreDistList = [];
        this.sectionData = this.workStatisticsService.sectionData;
    }

    onAfterEnterView() {
        this.initData();
        this.workStatisticsService.getScoreDist(this.instanceId, this.paperId);
        this.showOpenFlag = true;
    }

    back() {
        this.go("work_student_list", {paperInstanceId: this.instanceId});
    };

    /**
     * 显示区间学生列表
     */
    showSectionList(isFirst, selectSection) {
        this.workStatisticsService.wData.currentWork = this.$ngRedux.getState().wl_selected_work;
        this.sectionData.label = (isFirst ? '首次做' : '改错后') + '成绩在' + selectSection.label + '内';
        this.sectionData.sectionStudentList = isFirst ? selectSection.firstStudentList : selectSection.latestStudentList;
        this.go("section_student_list");
    }

}

export default scoreDistributionCtrl;
