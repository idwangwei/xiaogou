/**
 * Created by 华海川 on 2015/10/23.
 * 已游戏发布管理-教师选择班级
 */
import {Inject, View, Directive, select} from '../../module';
@View('select_clazz', {
    url: '/select_clazz',
    template: require('./select_clazz.html'),
    inject: ['$scope', '$log', 'commonService', '$ionicActionSheet', 'gameManageService',
        '$ionicModal', '$state', 'gameStatisticsService', '$rootScope', '$ngRedux']
})
class selectClazzCtrl {
    gameManageService;
    gameStatisticsService;

    initData() {
        this.gameManageService.getPubGamesParam.category = this.getRootScope().homeOrClazz.type;
        this.clazzArray = this.gameManageService.clazzArray;

    }

    onAfterEnterView() {
        this.initData();
        this.gameManageService.getClassList().then((data)=>{
            if (!data) {
                this.commonService.alertDialog('网络不畅，请稍后再试', 1500)
            }
        });
    }

    goPubGame(clazz) {
        this.gameManageService.getPubGamesParam.clzId = clazz.id;
        this.gameStatisticsService.pubGame.classId = clazz.id;
        this.gameStatisticsService.pubGame.className = clazz.name;
        this.go("pub_game_list");
    };

    /**
     * 跳转到已发布作业
     * @param clazz
     */
    goPubedWork(clazz) {
        this.go("work_list", {category: this.getRootScope().homeOrClazz.type, workType: 2, clazzId: clazz.id});
    }
}
export default selectClazzCtrl;
