/**
 * Created by 华海川 on 2015/11/4.
 * 游戏统计
 */
import  _ from 'underscore';
import {Inject, View, Directive, select} from '../../module';
@View('game_statistics', {
    url: '/game_statistics',
    template: require('./game_statistics.html'),
    inject: ['$scope'
        , '$log'
        , '$rootScope'
        , 'commonService'
        , '$ionicActionSheet'
        , 'gameStatisticsService'
        , '$ionicModal'
        , '$state'
        , '$interval'
        , '$ngRedux']
})
class GameStatistics {
    @select(state => state.game_statistics) data;
    gameStatisticsService;

    constructor() {
        this.initData();
    }

    initData() {
        this.pubGame = this.gameStatisticsService.pubGame;
    }

    back() {
        this.go("home.pub_game_list")
    }

    setOrder(name, asc) {  //设置排序
        var a = [];
        var b = [];
        //var $scope = this.getScope();
        this.data.tabData.forEach((item) => {
            if (typeof(item.errorTimes) == 'string' && item.errorTimes.match(/^\d+$/g)) {         //保证排序字段是整形
                item.errorTimes = parseInt(item.errorTimes);
            }
            if (typeof(item.order) == 'string' && item.order.match(/^\d+$/g)) {
                item.order = parseInt(item.order);
            }
            if (typeof(item.totalGameTime) == 'string' && item.totalGameTime.match(/^\d+$/g)) {
                item.totalGameTime = parseInt(item.totalGameTime);
            }
            if (typeof(item[name]) == 'string') {
                b.push(item);
            } else {
                a.push(item);
            }
        });
        a = _.sortBy(a, name); //按升序排列
        if (!asc) {            //按降序排序
            a.reverse();
        }
        this.data.tabData = a.concat(b);
    }

    /**
     * 获取统计
     */
    initGameStats() {
        // this.$ngRedux.dispatch(this.gameStatisticsService.getGameStats())
        this.gameStatisticsService.getGameStats();
    }

    /**
     * 查看全班错误统计
     */
    errorByClazz() {
        this.gameStatisticsService.clazzOrStu = 1;
        this.getStateService().go('pass_game_situation');
    };

    /**
     * 查看一个学生错误统计
     * @param stu
     */
    errorByStu(stu) {
        this.gameStatisticsService.student.id = stu.studentId;
        this.gameStatisticsService.student.name = stu.name;
        this.gameStatisticsService.clazzOrStu = 2;
        this.getStateService().go('pass_game_situation');
    };

    /**
     * 刷新页面状态
     */
    doRefresh() {
        // this.$ngRedux.dispatch(this.gameStatisticsService.getGameStats());
        this.gameStatisticsService.getGameStats()
    };

    onAfterEnterView() {
        this.initGameStats();
    }
}

export default GameStatistics;