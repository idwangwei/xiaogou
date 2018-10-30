/**
 * Created by ZL on 2017/3/18.
 */

import lodash_assign from 'lodash.assign';
import BaseController from 'base_components/base_ctrl';

class competitionReportCtrl extends BaseController {

    constructor() {
        super(arguments);
        // this.initData();
        /*后退注册*/

    }

    initData() {
        this.paperInstanceId = "";
        this.paperInfo = {
            paperName: "",
            score: '',
            wasteTime: '',
            overPercent: '0'
        };
        this.competitionResult = {
            district: '',
            avgScore: '0',
            personNumber: '0'
        };

        this.analyzeInfo = {
            totalKnowledgeNumber: 0,
            masterList: [],
            masterNum: '0',
            unmasterNum: '0',
        };

        //饼状图设置
        this.pieChartSettings = {
            labels: {
                outer: {
                    format: "none",
                    pieDistance: 0
                }
            },
            data: {
                sortOrder: "label-asc",
                content: []
            }
        };
        this.pieChart = {  //饼图插件对象
            instance: null
        };
        this.hasReport = false;
        this.retFlag = false;
    }

    setPieSeting(contents) {
        var pieContents = [];
        angular.forEach(contents, (v, k)=> {
            pieContents.push({label: "", value: contents[k].masterNumber, color: contents[k].color});
        });
        this.pieChartSettings.data.content = pieContents;
    }

    /**
     * 去开通
     */
    dredgeDiagnose() {
        this.go("home.diagnose02");
    }

    /**
     * 返回
     */
    back() {
        // this.$ionicHistory.goBack();
        this.go("home.work_list");
    }

    onBeforeLeaveView() {

    }


    onReceiveProps() {
        if (this.getRootScope().competition && this.getRootScope().competition.paper) {
            this.paperInstanceId = this.getRootScope().competition.paper.instanceId;
            this.competitionResult.district = this.getRootScope().competition.area.split('@')[0];
            this.getAnalyzeData();
        }
        // this.paperInstanceId = "cc72383b-ad40-449a-8059-42bf23fd13e1";//TODO

    }

    /**
     * 获取解析数据
     */
    getAnalyzeData() {
        this.analyzeFlag = false;
        this.getCompetionReportInfo(this.paperInstanceId).then((data)=> {//获取竞赛报告的信息
            this.retFlag = true;
            if (data.code == 200) {
                this.hasReport = true;
                //比赛情况
                this.paperInfo.paperName = data.report.paperName;
                this.paperInfo.wasteTime = data.report.wasteTime;
                this.paperInfo.score = data.report.score;
                this.paperInfo.overPercent = data.report.overPercent || "0";
                this.competitionResult.avgScore = data.report.avgScore || 0;
                this.competitionResult.personNumber = data.report.personNumber || 0;
                if (Number(this.competitionResult.avgScore) - Math.floor(this.competitionResult.avgScore) > 0) {
                    this.competitionResult.avgScore = data.report.avgScore.toFixed(2);
                }
                //掌握情况统计
                this.analyzeInfo.totalKnowledgeNumber = data.report.totalKnowledgeNumber;
                this.getStatisticsData(data.report.statisticsReportDTOList);
            }

            if (data.code == 50001) {
                this.hasReport = false;
            }
        });

    }

    /**
     * 获取掌握情况的分析数据
     * @param totalStatistics
     */
    getStatisticsData(totalStatistics) {
        var colors = ['#CCCCCC', '#F26666', '#FEB05A', '#48BE09'];
        angular.forEach(totalStatistics, (v, k) => {
            this.analyzeInfo.masterList[k] = lodash_assign({}, totalStatistics[k]);
            this.analyzeInfo.masterList[k].color = colors[Number(this.analyzeInfo.masterList[k].level) - 1];

        });
        this.setPieSeting(this.analyzeInfo.masterList);//设置饼状图
        this.analyzeFlag = true;
    }

    onAfterEnterView() {
    }

    mapStateToThis(state) {
        return {
            name: state.profile_user_auth.user.name,
        }
    }

    mapActionToThis() {
        return {
            getCompetionReportInfo: this.competitionReportService.getCompetionReport.bind(this.competitionReportService),
        }
    }
}
competitionReportCtrl.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , '$stateParams'
    , '$ngRedux'
    , 'competitionReportService'
    , '$ionicHistory'
];
export default competitionReportCtrl;