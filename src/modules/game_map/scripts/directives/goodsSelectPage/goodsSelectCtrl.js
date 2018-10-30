/**
 * Created by WL on 2017/6/22.
 * 注：这是指令的controller，用的是以前的方法，目前不需要调用service方法，如果调用service需要测试看有没有问题
 */

const PAGE_TITLE={
    TYPE1:'优惠大礼包',
    TYPE2:'天空之城',
    TYPE3:'青青草原',
    TYPE4:'魔法城堡',
    TYPE5:'雪地探险',
    TYPE6:'航海日志',
    TYPE7:'海底冒险'
};

import BaseController from 'base_components/base_ctrl';
class goodsSelectCtrl extends BaseController {
    constructor() {
        super(arguments);
        this.initData();
    }

    getTitleArr(){
        let titleArr = [];
        for( let k in PAGE_TITLE){
            if(k != "TYPE1"){
                titleArr.push(PAGE_TITLE[k]);
            }
        }
        return titleArr;
    }

    getImg(item) {
        let imgUrl = '';
        let title = item || this.goodsInfo.title;
        switch (title) {
            case PAGE_TITLE.TYPE1:
                imgUrl = 'p1_games1.png';
                break;
            case PAGE_TITLE.TYPE2:
                imgUrl = 'p1_games2.png';
                break;
            case PAGE_TITLE.TYPE3:
                imgUrl = 'p1_games3.png';
                break;
            case PAGE_TITLE.TYPE4:
                imgUrl = 'p1_games4.png';
                break;
            case PAGE_TITLE.TYPE5:
                imgUrl = 'p1_games5.png';
                break;
            case PAGE_TITLE.TYPE6:
                imgUrl = 'p1_games6.png';
                break;
            case PAGE_TITLE.TYPE7:
                imgUrl = 'p1_games7.png';
                break;
            default:
                imgUrl = 'p1_games1.png';
                break;
        }
        return this.loadLocalImg(imgUrl);
    }

    loadLocalImg(imgUrl) {
        return require('../../../game_map_images/gameGoodsPay/' + imgUrl);
    };

    initData() {
        this.goodsInfo = JSON.parse(this.getScope().goodsListInfo);
        this.confirmGoods = this.getScope().confirmGoods;
        this.isGameBag = this.goodsInfo.title == PAGE_TITLE.TYPE1;
        this.maxIndex = this.gameGoodsPayServer.totalTheme;
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }

    onAfterEnterView() {

    }

    /* mapStateToThis(state) {
     return {
     name: state.profile_user_auth.user.name,
     }
     }

     mapActionToThis() {
     return {}
     }*/

    getCurrentIndex(){
        let index = this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').currentIndex();
        let len = this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').slidesCount();
        len = Number(len);
        let currentIndex = index % len;
        return currentIndex;
    }

    goNext(){
        let index = this.getCurrentIndex();
        if(index == this.maxIndex){
            this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').slide(0);
            return;
        }
        this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').next();
    }

    goPrevious(){
        let index = this.getCurrentIndex();
        if(index == 0){
            this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').slide(this.maxIndex);
            return;
        }
        this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').previous();
    }

}
goodsSelectCtrl.$inject = ['$scope', '$ngRedux', '$interval', '$rootScope', '$log', '$state', '$ionicPopup','$ionicSlideBoxDelegate','gameGoodsPayServer'];

export default goodsSelectCtrl;