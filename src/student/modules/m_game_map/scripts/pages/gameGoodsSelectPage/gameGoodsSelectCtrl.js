/**
 * Created by WL on 2017/6/22.
 */
import {Inject, View, Directive, select} from '../../module';


@View('game_goods_select', {
    url: '/game_goods_select/:mapId/:theme/:pageIndex/:backUrl',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', '$window', '$ionicHistory', '$ionicLoading', '$ionicSlideBoxDelegate', 'gameGoodsPayServer', '$timeout'
    ]
})

class gameGoodsSelectCtrl {
    $ionicSlideBoxDelegate;
    gameGoodsPayServer;
    $timeout;
    $window;
    $stateParams;
    @select(state => state.game_goods_list) goodsListInfo;
    @select(state => state.profile_user_auth.user.vips) vipInfo;

    mapId = this.$stateParams.mapId || null;
    theme = this.$stateParams.theme || null;
    currentPageIndex = this.theme ? this.theme.replace('theme0','') : (this.$stateParams.pageIndex ? this.$stateParams.pageIndex : 0);
    backUrl = this.$stateParams.backUrl;
    showGamePayPrompt = false;

    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    initData() {
    }

    constructor(){
        this.getScope().$on("game-goods-repeat-finish", this.updateReapeatInfo.bind(this));
        /*后退注册*/

    }

    getContentHeight() {
        let h = this.getRootScope().platform.IS_ANDROID ? this.$window.screen.availHeight : this.$window.innerHeight;
        let hh = Math.floor(h) - (this.isIos() ? 47 : 10);
        if (hh < 0) hh = 0;
        return hh;
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }


    initFlags() {
        this.initCtrl = false;
    }

    updateReapeatInfo(){
        this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').update();
        this.getCurrentPageIndex();
        this.goToThemePage();
    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;
                this.gameGoodsPayServer.getAllGoodsInfo().then((data) => {
                    if (data.code == 200) {
                        //this.getCurrentPageIndex();
                        //this.goToThemePage();
                    }
                })
            })
    }

    onAfterEnterView() {
        this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').update();
        this.saveFromUrl();
        //this.getCurrentPageIndex();
        //this.goToThemePage();
        //TODO 调用接口获取商品列表
        /*  this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').stop();
         let timeId = this.$timeout(()=> {
         this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').start();
         this.$timeout.cancel(timeId);
         }, 3000);*/
    }

    getCurrentPageIndex(){
        this.currentPageIndex = this.theme ? this.theme.replace('theme0','') : (this.$stateParams.pageIndex ? this.$stateParams.pageIndex : 0);
    }

    saveFromUrl() {
        if (!this.backUrl) {
            this.backUrl = "game_map_level";
        }
        this.gameGoodsPayServer.stateBuyFrom = {
            mapId: this.mapId,
            theme: this.theme,
            backUrl: this.backUrl
        }
    }

    /**
     * 注：调用以前的service的方法时需要 mapActionToThis 才能用
     * @returns {{}}
     */
    mapActionToThis() {
        return {}
    }

    backShowPromote() {
        this.promptType = "giveUpPay";
        this.showGamePayPrompt = true;
    }

    quitPay(){
        this.hidePrompt();
        this.back();
    }

    back() {
        if(this.showGamePayPrompt){
            this.showGamePayPrompt = false;
            this.getScope().$digest();
            return;
        }
        if (this.mapId && this.theme) {
            let param = {
                mapId: this.mapId,
                theme: this.theme
            };
            this.getStateService().go('game_map_level', param);
        }
        else {
            this.getStateService().go("game_map_scene");
        }
    }

    /**
     * 调到制定的页面
     */
    goToThemePage() {
        this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').slide(parseInt(this.currentPageIndex));

    }

    repeatBuyBack(){
        this.promptType = "buyRepeat";
        this.showGamePayPrompt = true;
    }

    hidePrompt() {
        this.showGamePayPrompt = false;
    }

    confirmSelectGoods() {
        let index = this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').currentIndex();
        let len = this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').slidesCount();
        len = Number(len);
        this.currentPageIndex = index % len;
        if(this.gameGoodsPayServer.hasBuyTheGame(this.vipInfo,this.currentPageIndex)){  //重复购买
            this.repeatBuyBack();
            return;
        }
        this.promptType = "tellParent";
        this.showGamePayPrompt = true;
    }

    goToPayForGoods() {
        this.hidePrompt();
        console.log("您选择的是第", this.currentPageIndex, '个商品');
        this.gameGoodsPayServer.selectGameGoods(this.goodsListInfo[this.currentPageIndex]);
        this.getStateService().go('game_goods_pay', {pageIndex: this.currentPageIndex,mapId:this.mapId,theme:this.theme});
    }


}

export default gameGoodsSelectCtrl;