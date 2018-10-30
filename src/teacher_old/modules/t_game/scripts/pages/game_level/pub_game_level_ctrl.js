/**
 * Created by 华海川 on 2016/3/17.
 *发布游戏关卡界面
 * 未见使用 暂时不用的
 */
import {Inject, View, Directive, select} from '../../module';
@View('game_level', {
    url: '/game_level',
    template: require('./game_level.html'),
    inject: ["$scope", "$state", "gameManageService", "gameStatisticsService", '$rootScope', '$ngRedux']
})
class gameLevelCtrl {
    gameStatisticsService;
    gameManageService;

    gameStatistics(game, level) {
        this.gameStatisticsService.pubGame.classId = this.gameManageService.pubGameClazz.id;
        this.gameStatisticsService.pubGame.publicId = this.pubGameId;
        this.gameStatisticsService.pubGame.levelGuid = level.levelGuid;
        this.gameStatisticsService.pubGame.kdName = level.kdName;
        this.gameStatisticsService.pubGame.levelNum = level.num;
        this.gameStatisticsService.pubGame.gameName = game.name;
        this.go('game_statistics');
    }

    back() {
        this.go("home.pub_game_list")
    }

    onAfterEnterView() {
        this.gameManageService.getPubGameLevels().then((data)=> {
            if (data.code == 200) {
                this.selectPubGame = data.cgceDetail.games[0];
                this.pubGameId = data.cgceDetail.id;
            } else {
                console.log(data.msg);
            }
        });
    }
}

export default gameLevelCtrl;
