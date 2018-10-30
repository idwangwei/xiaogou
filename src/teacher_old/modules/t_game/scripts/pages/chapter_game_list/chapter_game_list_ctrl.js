import {Inject, View, Directive, select} from '../../module';

@View('chapter_game_list', {
    url: '/chapter_game_list',
    styles: require('./style.less'),
    template: require('./chapter_game_list.html'),
    cache: false,
    inject: ["$scope"
        , '$rootScope'
        , '$state'
        , "$ngRedux"
        , "gameRepoService"
        , 'commonService'
        , 'gameManageService'
        , 'finalData']
})
class ChapterGameListCtrl {
    @select(state=>state.gr_selected_chapter) gr_selected_chapter;
    @select(state=>state.gr_chapter_gamelist_map) gr_chapter_gamelist_map;
    @select(state=>state.gr_fetch_gamelist_processing) gr_fetch_gamelist_processing;
    @select(state=>state.profile_user_auth.user.visitor) visitor;

    constructor() {
        this.initData();
    }

    initData() {
        this.gameList = []; //游戏集合
        this.retFlag = false; //获取数据完毕
        this.initCtrl = false;
    }

    onReceiveProps() {
        this.ensureGameList();
    }

    ensureGameList() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.fetchChapterGameList(this.gr_selected_chapter.id).then((data)=> {
                if (data) {
                    this.retFlag = true;
                }
            });
        }
        else {
            this.gameList = this.gr_chapter_gamelist_map[this.gr_selected_chapter.id];
        }
    }

    isSelectedChapterHasGameList() {
        if (!this.gr_selected_chapter || !this.gr_selected_chapter.id) {
            console.error("gr_selected_chapter is " + this.gr_selected_chapter);
            return false;
        }
        if (!this.gr_chapter_gamelist_map[this.gr_selected_chapter.id]) {
            return false;
        }
        return true;
    }

    /**
     * 试玩游戏
     * @param game
     */
    playGame(game) {
        // if(!this.gr_selected_chapter.isFirst && !this.visitor){
        //     this.commonService.showAlert('温馨提示','<span style="text-align: center">你的班级学生人数小于10，只能试玩本册第一单元第一课时的游戏</span>');
        //     return
        // }


        var URL = "chapter_game_list";
        let gameSessionID;
        let shardingIndex = this.getRootScope().sessionID.indexOf(this.finalData.GAME_SHARDING_SPILT);
        if (shardingIndex > -1)
            gameSessionID =
                this.getRootScope().sessionID.substring(0, shardingIndex) +
                this.finalData.GAME_SHARDING_SPILT + this.finalData.GAME_NO_CLAZZ;
        else
            gameSessionID = this.getRootScope().sessionID +
                this.finalData.GAME_SHARDING_SPILT + this.finalData.GAME_NO_CLAZZ;
        var data = {
            m: [
                game.levelGuid, //aa0_01
                game.num, //1 所有游戏都是1
                game.gameGuid //aa0
            ],
            cgc: {/*cgceId: result.cgceId, cgcId: result.cgcId, */session: gameSessionID},
            user: {name: this.getRootScope().user.name, theme: this.getRootScope().user.gender ? 1 : 0},
            tPlayGame: {
                game: game,
                Url: URL
            }
        };

        var dirNum = this.gameRepoService.getGameNum(game.gameGuid);
        this.commonService.setLocalStorage('switchTo', data);
        this.commonService.setLocalStorage('dirLocal', dirNum);
        this.commonService.setLocalStorage('pubGameClazz', this.gameManageService.pubGameClazz);
        this.commonService.setLocalStorage('IS_COME_FROM_GAME', 'chapter_game_list');

        if (navigator.userAgent.match(/iPad|iPhone/i)) {
            var assetPath = this.commonService.getLocalStorage('assetPath');
            if (assetPath) window.location.href = assetPath.url + "index.html";
        }
        else if (navigator.userAgent.match(/WINDOWS|MAC/i)) {
            window.location.href = '../../win/index.html?dir=' + dirNum;
        }
        else {
            window.location.href = 'file:///android_asset/www/index.html';
        }
    }


    /**
     * 布置游戏
     * @param game
     */
    pubGame(game) {
        // if(!this.gr_selected_chapter.isFirst && !this.visitor){
        //     this.commonService.showAlert('温馨提示','<span style="text-align: center">你的班级学生人数小于10，只能布置本册第一单元第一课时的游戏</span>');
        //     return
        // }
        this.gameRepoService.game = game;
        this.go('game_pub');
    }

    back() {
        this.go('game_lib');
    }

    /**
     * 是否显示删除按钮
     * @returns {boolean}
     */
    isShowRemoveBtn() {
        var versionStrArr = this.commonService.getAppNumVersion().match(/^(\d+)\.(\d+)\.(\d+)/) || [0, 0, 0];
        var firstNum = versionStrArr[1] * Math.pow(10, 5);
        var secondNum = versionStrArr[2] * Math.pow(10, 3);
        var thirdNum = (versionStrArr[3] * Math.pow(10, 2) + "").slice(0, 3);
        var isIphone = this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_IPHONE; //IOS
        var versionNum = (firstNum + secondNum + thirdNum) >= 102300; //版本号在1.2.3及以上

        return !isIphone || versionNum;
    }


    getGameIconUrl(gameGuid) {
        let name = gameGuid.match(/ab4_03|ab4_04/) ? 'ab4_other' : gameGuid.split('_')[0];
        return 'game_icon/' + name + '.png'
    }


   /* mapStateToThis(state) {
        return {
            gr_selected_chapter: state.gr_selected_chapter,
            gr_chapter_gamelist_map: state.gr_chapter_gamelist_map,
            gr_fetch_gamelist_processing: state.gr_fetch_gamelist_processing,
            visitor: state.profile_user_auth.user.visitor
        }
    }*/

    mapActionToThis() {
        let grs = this.gameRepoService;
        return {
            fetchChapterGameList: grs.fetchChapterGameList.bind(grs)
        }
    }
}

export default ChapterGameListCtrl;