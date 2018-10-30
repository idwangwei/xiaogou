/**
 * Created by ZL on 2017/11/8.
 */
import {Inject, View, Directive, select} from '../../module';

@View('credits_exchange_goods', {
    url: 'credits_exchange_goods',
    styles: require('./style.less'),
    template: require('./page.html'),
    inject:['$scope',
    '$state',
    '$rootScope',
    '$stateParams',
    '$ngRedux',
    '$ionicHistory',
    '$ionicLoading',
    '$ionicPopup',
    '$timeout',
    'commonService',
    'creditsStoreService']
})

class creditsExchangeGoodsCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    creditsStoreService;
    // selectGoods = {};
    canOrderFlag = false;
    explainDesc = [];
    goodsInfo = {};

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.select_credits_goods) selectGoods;
    @select(state=>state.teacher_credits_detail) currentCredits;
    constructor(){


    }
    initData() {
        this.explain = [
            '1.图片供参考，请以收到的实物为准。',
            '2.本商品一次只可兑换1个。',
            '3.同一姓名、手机号、收货地址视为同一账号。',
            '4.商品一经兑换发出，一律不退还智慧币。',
            '5.请填写准确收货地址，如因地址错误无法送达，智算365不承担任何责任。',
            '6.如有疑问，请关注公众号“智算365” 进行提问。'
        ];
    }

    onAfterEnterView() {
        this.initData();
        this.optionButn();
    }

    onBeforeEnterView() {
    }

    back() {
        this.$ionicHistory.goBack()
    }

    gotoSubmitGoods() {
        if (this.goodsInfo.type == 2) return;
        if (this.selectGoods.isOrder && !this.selectGoods.orderInfo) {
            this.creditsStoreService.getCreditsOrder(this.selectGoods.id).then((data)=> {
                if (data && data.code == 200) {
                    if (data.result && data.result.orderId) {
                        this.selectGoods.isOrder = true;
                        this.selectGoods.orderInfo = data.result;
                    } else {
                        this.selectGoods.isOrder = false;
                        this.selectGoods.orderInfo = undefined;
                    }
                }
                this.creditsStoreService.selectCreditsGoods(this.selectGoods);
                this.go('submit_exchange_goods');
            })
        } else {
            this.go('submit_exchange_goods');
        }

    }

    gotoCreditsRecord() {
        this.go('credits_list');
    }

    gotoCreditsTask() {
        this.go('task_progress', {fromUrl: "credits_exchange_goods"});
    }

    /**
     * 根据商品情况显示按钮
     */
    optionButn() {
        this.goodsInfo.type = undefined;
        this.goodsInfo.butnStr = '';

        if (this.selectGoods.isOrder) {
            this.goodsInfo.type = 1;
            this.goodsInfo.butnStr = '详情';
        } else if (!this.selectGoods.hasStock) {
            this.goodsInfo.type = 2;
            this.goodsInfo.butnStr = '已售罄';
        } else if (Number(this.selectGoods.credits) > Number(this.currentCredits)) {
            this.goodsInfo.type = 3;
            this.goodsInfo.butnStr = '';
        } else {
            this.goodsInfo.type = 4;
            this.goodsInfo.butnStr = '兑换';
        }
    }

    enoughCredits() {
        if (!this.selectGoods) return false;
        return this.selectGoods.hasStock && Number(this.selectGoods.credits) > Number(this.currentCredits);
    }

    canExchange() {
        if (!this.selectGoods) return false;
        return !this.selectGoods.isOrder && Number(this.selectGoods.credits) <= Number(this.currentCredits) && this.selectGoods.hasStock;
    }
}

export default creditsExchangeGoodsCtrl;