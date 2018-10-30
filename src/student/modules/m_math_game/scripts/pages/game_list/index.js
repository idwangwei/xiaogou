/**
 * Created by qiyuexi on 2018/1/4.
 */
import {Inject, View, Directive, select} from '../../module';
import _find from 'lodash.find';
const typeXS = 'XS'; //教材版本为西师版
@View('home.game_list', {
    url: '/game_list',
    views: {
        "study_index": {
            template: require('./page.html')
        }
    },
    styles: require('./style.less'),
    inject:[
        "$scope"
        , "$rootScope"
        , "$state"
        , "gameService"
        , "profileService"
        , "$timeout"
        , "$ionicPopup"
        , "$ngRedux"
        , "pageRefreshManager"
        , "$ionicTabsDelegate"
        , "$ionicSideMenuDelegate"
        , "$log"
        , "commonService"
        , 'tabItemService'
        , "mathGameFinalData"
        , 'homeInfoService'
        , '$ionicScrollDelegate'
    ]
})
class GameListCtrl{
    constructor() {
        // super(arguments);
        this.initData();
    }

    onReceiveProps() {
        this.initCount++;
        this.ensurePageData();
    }

    onUpdate() {
        this.fetchGameList(false, this.loadCallback.bind(this));
    }

    onBeforeLeaveView() {
        this.$ionicSideMenuDelegate.toggleLeft(false);
        //离开当前页面时，cancel由所有当前页发起的请求
        this.gameService.cancelRequestDeferList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        // angular.forEach(this.$ionicSideMenuDelegate._instances,instance=>instance.close());
        this.isShowGameStarRank = false;
    }

    onAfterEnterView() {
        this.getRootScope().studyStateLastStateUrl = this.getStateService().current.name;
        this.commonService.setLocalStorage('studyStateLastStateUrl','home.game_list');

        if(!this.clazzList || this.clazzList.length==0){
            this.changeClazz({});//需要传一个空对象 否则 mapStateToThis里面会报错
            return;
        }
        if(!this.selectedClazz || (this.selectedClazz && !this.selectedClazz.id)){
            try{
                this.changeClazz(this.clazzList && this.clazzList[0]);
            }catch(err){
                console.error(err);
            }
        }
        this.clazzList.find(item =>{
            if(item.id === this.selectedClazz.id){
                // if(item.name !== this.selectedClazz.name){
                this.changeClazz(item);
                // }
                return true;
            }
        })
    }

    ensurePageData() {
        this.ensureSelectedClazz();
        this.ensureGameList();
    }

    /**
     * 初始化ctrl中的一些 flag
     */
    initData() {
        this.onLine = true;
        this.screenWidth = window.innerWidth;
        this.selectedClazzInitlized = false; //ctrl初始化后，是否已经选择过一次班级
        this.gameListInitlized = false; //ctrl初始化后，是否已经加载过一次游戏列表
        this.loadMoreExecuteCount = 0; //从ion-infinite-scroll调用加载列表方法的次数
        this.moreFlag = false;//是否出现加载更多的指令
        this.moreFlagMapForEveryClazz = {/*format clzId[班级ID]:moreFlag[true|false]*/};
        this.starImg = this.mathGameFinalData.START_ICON;
        this.isIos = this.commonService.judgeSYS() === 2;
        this.isShowGameStarRank = false;
        //this.showMonth = true;
        this.initCount = 0;
    }


    back(){
        if(this.isShowGameStarRank){
            this.isShowGameStarRank = false;
            this.getScope().$digest();
            return;
        }
        this.go('home.study_index','back');
    }

    /**
     * 保证首次进入ctrl选择班级
     */
    ensureSelectedClazz() {
        if (!this.selectedClazzInitlized && this.clazzList && this.clazzList.length != 0) {
            this.selectedClazzInitlized = true;

            let clazz = this.selectedClazz.id ? _find(this.clazzList,{id:this.selectedClazz.id}):undefined;
            if (clazz) {
                this.changeClazz(clazz);
            }else {
                this.changeClazz(this.clazzList[0]);
            }
        }
    }

    /**
     * 保证首次进入ctrl加载游戏列表
     */
    ensureGameList() {
        if (this.isLoadingProcessing || !this.clazzName)return; //如果游戏列表正在加载或者如果没有选择班级,则return，防止重复加载
        if (!this.gameListInitlized) {
            this.gameListInitlized = true;
            this.getRootScope().selectedClazz=this.selectedClazz;
            this.fetchGameList(false, this.loadCallback.bind(this));
        }
    }

    /**
     * 去选择班级
     */
    selectClazz(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft();
        this.loadMoreExecuteCount = 0;
        this.moreFlag = false;
        this.changeClazz(clazz);
        this.fetchGameList(false, this.loadCallback.bind(this))
    }

    /**
     *  该方法适用于：在加载更多列表内容时，将该方法传递给ion-infinite-scroll指令，
     *  由于在ion-infinite-scroll初始化的时候就会调用该方法去加载对应的列表内容，
     *  为了避免这种情况，在方法内部使用了 loadMoreExecuteCount 进行记数，只有其
     *  值大于0时才执行加载过程
     *
     */
    fetGameListWithLoadMore() {
        if (this.loadMoreExecuteCount == 0)
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        if (this.loadMoreExecuteCount > 0)
            this.fetchGameList(true, this.loadCallback.bind(this)).then(() => {
                this.getScope().$broadcast('scroll.infiniteScrollComplete');
            });
        this.loadMoreExecuteCount++;
    }

    /**
     * 加载游戏列表完毕的回调
     * @param loadMore 是否是上划刷新的情况
     * @param loadAllComplete 对应班级下的游戏列表是否全部加载完毕
     */
    loadCallback(loadMore, loadAllComplete) {
        this.getScope().$broadcast('scroll.infiniteScrollComplete');
        this.moreFlag = !loadAllComplete;
    }

    /**
     * 显示左侧班级列表
     */
    showMenu() {
        if(this.selectedClazz.type === 900) return;
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    /**
     * 下拉刷新游戏列表
     */
    pullRefresh() {
        this.fetchGameList(false,pullRefreshCallback.bind(this));
        function pullRefreshCallback() {
            this.getScope().$broadcast('scroll.refreshComplete');
        }
    }

    /**
     * 进入游戏
     * @param game
     * @returns {*}
     */
    goToPlayGame(game) {
        // if(this.selectedClazz.teachingMaterial.match(typeXS)){
        //     this.commonService.showAlert(
        //         '温馨提示',
        //         '<p style="text-align: center">班级教材版本为西师版</p><p style="text-align: center">西师版游戏暂时不开放</p>');
        //     return
        // }

        if (game.status == 100) {
            return this.showAlertForLevel();
        }
        this.playGamePopUp(game).then((result)=> {
            //点击取消
            if (!result) {
                return
            }

            //点击确认
            let level = game.levels[0];
            let dirNum = this.gameService.getGameNum(game.gameGuid);
            let gameSessionID=this.commonService.gameAppendShardingId();
            let switchTo = {
                m: [level.levelGuid, level.num, game.gameGuid],
                cgc: {
                    cgceId: game.cgceId,
                    cgcId: game.cgcId,
                    session: gameSessionID
                },
                user: {name: this.user.name, theme: this.user.gender},
                sPlayGame: {
                    game: game,
                    Url: this.getStateService().current.name
                }
            };
            this.commonService.setLocalStorage('switchTo', switchTo);
            this.commonService.setLocalStorage('dirLocal', dirNum);
            this.commonService.setLocalStorage(this.mathGameFinalData.IS_COME_FROM_GAME, 'home.game_list');

            if (navigator.userAgent.match(/iPad|iPhone/i)) {
                var assetPath = this.commonService.getLocalStorage('assetPath');
                if (assetPath) window.location.href = assetPath.url + "index.html";
            }
            else if (navigator.userAgent.match(/WINDOWS|MAC/i)) {
                window.location.href = '../../win/index.html?dir=' + dirNum;
            } else {
                window.location.href = 'file:///android_asset/www/index.html';
            }
        });
    }


    /**
     * 显示关卡解锁提示框
     */
    showAlertForLevel() {
        this.$ionicPopup.alert({
            title: '信息提示',
            template: ' <p>通关前面的游戏，</p><p>后面的游戏就会解锁</p>',
            okText: '确定'
        });
    }

    /**
     * 显示进入游戏确认框
     * @param game
     * @returns {*}
     */
    playGamePopUp(game) {
        this.selectGame(game);

        return this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: ' <p style="text-align: center">确认进入游戏【' + game.tb.tbName + '】？</p>',
            title: '信息提示',
            buttons: [
                {
                    text: "<button> 进入 </button>",
                    type: "button-positive",
                    onTap: function (e) {
                        return true;
                    }
                },
                {
                    text: "<button> 取消 </button>",
                    type: "button-positive",
                    onTap: function (e) {
                        return false;
                    }
                }
            ]
        })
    }


    getGameIconUrl(gameGuid){
        let name = gameGuid.match(/ab4_03|ab4_04/) ? 'ab4_other':gameGuid.split('_')[0];
        return this.getRootScope().loadImg('game_icon/'+name+'.png');
    };

    ifShow($index) {
        if (!this.gameList || !this.gameList.length) return false;
        if ($index == 0) return true;
        let currentItem = this.gameList[$index];
        let previousItem = this.gameList[$index - 1];
        let currentMonth = currentItem.publishTime.split('-')[1];
        let previousMonth = previousItem.publishTime.split('-')[1];
        return currentMonth != previousMonth;
    }
    getMonth(listItem){
        try{
            return Number(listItem.publishTime.split('-')[1]);
        }catch(err){
            console.error('游戏列表分月信息解析失败', err);
        }
    }


    /**
     * 显示游戏星星排行榜
     */
    showGameStarRank(){
        this.getStarRankData();
        this.isShowGameStarRank = true;
    }
    /**
     * 获取游戏星星排行榜数据
     */
    getStarRankData(){
        if(!this.selectedClazz || !this.selectedClazz.id){return;}
        if(this.$ngRedux.getState().fetch_game_star_rank_data_processing){return;}
        this.fetchStarData({classId:this.selectedClazz.id});
        this.$ionicScrollDelegate.scrollTop(true);
    }
    /**
     * 点击排行榜外的灰色区域关闭排行榜
     * @param event
     */
    closeGameStarRankData(event){
        if($(event.target).hasClass('work-backdrop'))
            this.isShowGameStarRank = false;
    }
    alertInfo(){
        this.commonService.showAlert(
            '自学班能干什么？',
            `<p>自学班仅用于个人自学，可以玩速算（免费）、诊断提分（免费模式）、魔力闯关等版块。</p>
             <p>要想玩教学游戏，须加入数学老师开通的智算365班级，请推荐数学老师使用智算365。</p>`
        )
    }

    mapStateToThis(state) {
        if(!state.game_list||!state.game_list.selectedClazz) return {};
        let clzId = state.game_list.selectedClazz.id;
        let clazzListWithGameStar = state.clazz_with_game_star_rank_data;
        let gameStarRankData = clazzListWithGameStar[clzId];

        return {
            selectedClazz:state.game_list.selectedClazz,
            gameClazzId:clzId,
            clazzName: state.game_list.selectedClazz.name,
            gameList: state.game_list.clazzListWithGames[clzId],
            clazzList: state.profile_clazz.clazzList && state.profile_clazz.clazzList.length !== 0
                ? state.profile_clazz.clazzList : state.profile_clazz.passClazzList,
            selfStudyClazzList: state.profile_clazz.selfStudyClazzList,
            isLoadingProcessing: state.game_list.isFetchGameListProcessing,
            isFetchClazzProcessing: state.game_list.isFetchClazzProcessing,
            onLine: state.app_info.onLine,
            user: state.profile_user_auth.user,
            groupByMonth: state.game_list.groupByMonth,
            gameStarRankData:gameStarRankData,
            isGameStarLoading:state.fetch_game_star_rank_data_processing,

        }
    }

    mapActionToThis() {
        let ps = this.profileService;
        let his=this.homeInfoService;

        return {
            fetchClazzList: ps.fetchClazzList.bind(ps),
            changeClazz: this.gameService.changeClazz,
            changeSeq: this.gameService.changeSeq,
            fetchGameList: this.gameService.fetchGameList.bind(this.gameService),
            updateGameListCtr: this.gameService.updateGameListCtr,
            checkGameCanPlay: this.gameService.checkGameCanPlay,
            selectGame: this.gameService.selectGame,
            fetchStarData: his.fetchGameStarRankData.bind(his),
        }
    }
}
export default GameListCtrl