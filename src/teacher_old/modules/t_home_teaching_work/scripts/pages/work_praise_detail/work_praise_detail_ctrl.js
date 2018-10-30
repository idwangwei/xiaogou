/**
 * Author 邓小龙 on 2015/9/2.
 * @description 表扬 controller
 */
// import  controllers from '../../../../t_boot/scripts/controllers/index';
import  _ from 'underscore';
import {Inject, View, Directive, select} from '../../module';
@View('work_praise_detail', {
    url: '/work_praise_detail',
    styles: require('./work_praise_detail.less'),
    template: require('./work_praise_detail.html'),
    inject: [
        '$scope'
        , '$log'
        , '$state'
        , '$ionicModal'
        , '$rootScope'
        , 'commonService'
        , 'workStatisticsService'
        , 'finalData'
        , '$ionicHistory'
        , '$ngRedux'
    ]
})
class workPraiseDetailCtrl {
    $ionicHistory;
    workStatisticsService;

    onAfterEnterView() {
        this.wData = this.workStatisticsService.wData;//共享作业的数据
        this.data = this.workStatisticsService.data;//共享的数据
        this.workStatisticsService.getPraiseDetail(this.data.correctedPraise.showType);//获取评价列表
    }

    back(){
        this.$ionicHistory.goBack();//返回到列表展示
    };
}
export default workPraiseDetailCtrl;