/**
 * Created by 华海川 on 2015/10/20.
 * 一个游戏详情
 */
import {Inject, View, Directive, select} from '../../module';
@View('select_game', {
    url: '/select_game',
    template: require('./select_game.html'),
    inject: ['$scope'
        , '$state'
        , '$log'
        , 'commonService'
        , 'gameManageService'
        , '$ionicPopup'
        , '$rootScope'
        , 'finalData'
        , '$ngRedux']
})
class selectGameCtrl {
    gameManageService;
    commonService;
    $ionicPopup;
    finalData;

    initData() {
        this.game = this.gameManageService.game;  //游戏信息
        this.specialGame = false;             //是否是特殊游戏
    }

    onAfterEnterView() {
        this.initData();
        this.gameManageService.getLevels().then((data)=> {  //获取关卡
            if (data) {
                this.levelArray = this.gameManageService.levelArray; //关卡信息
            }
        });
    }

    back() {
        this.go("game_lib")
    }

    handleClick() { //点击关卡，最多选择连续三关
        var levels = [];
        this.level.isClicked = !this.level.isClicked;
        this.levelArray.forEach((item)=>{
            item.forEach((data)=>{
                if (data.isClicked)levels.push(data.num);
            });
        });
        if (levels.length <= 1) {
            return;
        }
        if (levels.length > 20) {        //选择关卡大于三关
            this.level.isClicked = false;
            this.rule();
            return;
        }
        var me = this;
        levels.sort((a, b)=>{
            return a - b;
        });
        for (var i = 1; i < levels.length; i++) {     //选择了不连续的关卡
            var a = levels[i] - levels[i - 1];
            if (a > 1) {
                if (this.level.isClicked) {
                    this.rule();
                    this.level.isClicked = false;
                } else {
                    this.levelArray.forEach((col)=>{ //清除
                        col.forEach((level)=>{
                            if (me.level.num <= level.num)
                                level.isClicked = false;
                        });
                    });
                }
                break;
            }
        }
    }

    goPub() {         //去发布页
        var levels = [];
        var seq = 1;
        this.levelArray.forEach((col)=>{
            col.forEach((level)=>{
                if (level.isClicked) {
                    var param = {
                        levelGuid: level.levelGuid,
                        num: level.num,
                        seq: seq
                    };
                    levels.push(param);
                    seq++;
                }
            });
        });
        if (!levels.length) {
            this.commonService.alertDialog('请至少选择一个关卡', 1000);
            return;
        }
        var param = {
            gameGuid: this.game.gameGuid,
            seq: 1,
            levels: levels
        };
        this.gameManageService.configs.games.length = 0;
        this.gameManageService.configs.games.push(param);
        this.go('game_pub');
    };

    rule() {
        this.$ionicPopup.alert({
            title: '信息提示',
            template: '<p>1.只能发布连续的关卡</p>'
            + '<p>2.点击关卡中的红色图标可以试玩</p>',
            okText: '确定'
        });
    };

    /**
     * 获取游戏的CgcId
     * @param game
     */
    playGame(game, level) {
        this.gameManageService.getGameCgcId(game.gameGuid).then((data)=>{
            if (!data) {
                this.commonService.alertDialog('获取游戏失败', 1500);
                return;
            } else {
                this.toPlayGame(game, level);
            }
        });
    }

    /**
     * 去玩游戏
     */
    toPlayGame(game, level) {
        var URL = "select_game";
        var BOY = 1;
        var GIRL = 0;
        var data = {
            m: [/*"mission_panel",*/ level.levelGuid, level.num, game.gameGuid],
            cgc: {cgceId: game.cgceId, cgcId: game.cgcId, session: $rootScope.sessionID},
            user: {name: $rootScope.user.name, theme: $rootScope.user.gender ? BOY : GIRL},
            tPlayGame: {
                game: game,
                Url: URL
            }
        };
        var dirNum = this.getGameNum(game.gameGuid);
        this.commonService.setLocalStorage('switchTo', data);
        this.commonService.setLocalStorage('dirLocal', dirNum);
        if (navigator.userAgent.match(/iPad|iPhone/i)) {
            var assetPath = this.commonService.getLocalStorage('assetPath');
            if (assetPath) window.location.href = assetPath.url + "index.html";
        }
        else if (navigator.userAgent.match(/WINDOWS|MAC/i)) {
            window.location.href = '../../win/index.html?dir=' + dirNum;
        } else {
            window.location.href = '../../../../../../../index.html';
        }
    }

    getGameNum(gameGuid) {
        if (gameGuid == "aa1" || gameGuid == "aa2" || gameGuid == "aa3" || gameGuid == "aa4") {
            return 11;
        }
        var reg = new RegExp(gameGuid + "([^\\d]|$)");
        for (var key in this.finalData.GAME_NUM) {
            for (var i = 0; i < this.finalData.GAME_NUM[key].length; i++) {
                if (this.finalData.GAME_NUM[key][i].match(reg)) {
                    return +key;
                }
            }
        }
        console.log("没有找到" + gameGuid);
    }
}
export default selectGameCtrl;