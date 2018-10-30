/**
 * Created by Administrator on 2017/5/2.
 */
// import BaseController from 'base_components/base_ctrl';
import {Inject, View, Directive, select} from '../../module';

@View('reward_score_store', {
    url: '/reward_score_store/:backUrl',
    template: require('./score_store.html'),
    styles: require('./score_store.less'),
    inject: ['$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , '$ngRedux'
        , '$ionicHistory'
        , '$ionicPopup'
        , 'rewardSystemService'
        , '$ionicLoading'
        , 'increaseScoreService'
        , 'commonService'
        , '$ocLazyLoad']
})

class scoreStoreCtrl {
    @select(state=>(state.user_reward_base)) rewardBase;
    constructor(){
        /*后退注册*/
    }
    loadStoreImg(imgUrl) {
        return require('../../../reward_images/' + imgUrl);
    }

    initData() {
        this.currentCredits = Number(this.rewardBase.credits);
        this.warningStr = '';
        this.storeGoods = [
            // {goodName: '学霸驯宠记', goodDesc: '3天试用权', costScore: 199}
        ];
        this.vipDays = 3;
        this.retFlag = false;
    }

    back() {
        if(this.buyFoodSuccess){
            this.buyFoodSuccess =false;
            this.getScope().$digest();
        }else if (this.backUrl) {
            this.go(this.backUrl);
        } else {
            this.go('home.me');
        }
    }

    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    exchange(item,index) {
        if (Number(this.currentCredits) < Number(item.costScore)) {
            this.toast('能量不足，完成每日任务可以获得能量哟！', 1000);
            return;
        }

        if(item.isFood){
            if(!item.canBuy||this.retFlag) return;
            this.retFlag = true;
            let buyLimit = this.storeGoods[index].buyLimit.split('/');
            //TODO 在该页面引入 相应模块
            this.increaseScoreService.buyPetFood(item.goodsId).then(()=>{

                buyLimit[0] = +buyLimit[0]+1;
                this.storeGoods[index].buyLimit = buyLimit[0] +'/' +buyLimit[1];
                this.storeGoods[index].canBuy = +buyLimit[0]<+buyLimit[1];
                this.buyFoodSuccess = true;
                this.buyFoodType = item.goodsId;
                this.currentCredits -= +item.costScore;
                this.retFlag = false;
            },()=>{
                this.retFlag = false;
                this.commonService.alertDialog('兑换失败，稍后再试',2000);
            });
            return
        }

        let template = "<p style='width: 100%;text-align: center;font-size: 16px'>兑换后，会立即开通学霸驯宠记三天。</p>" +
            "<p style='width: 100%;text-align: center;font-size: 16px'>是否兑换？</p>";
        this.$ionicPopup.show({
            title: '温馨提示',
            template: template,
            buttons: [
                {
                    text: '是',
                    type: 'button-positive',
                    onTap: (e)=> {
                        this.exchangeGoods(item);
                    }
                },{
                text: '否',
                type: 'button-default',
                onTap: (e)=> {
                }
            }]
        })
    }

    /**
     *兑换商品
     */
    exchangeGoods(item) {
        let exchangeServer = this.rewardSystemService.exchangeGoods(item.goodsId);
        exchangeServer.then((data)=> {
            if (data && data.code == 200) {
                if (data.orderSuccess) {
                    // this.toast('兑换成功', 1000);
                    this.showRewardPrompt();
                    this.currentCredits -= Number(item.costScore);
                } else {
                    this.toast(data.msg, 1000);
                }
            } else {
                this.toast("兑换失败", 1000);
            }
        });
    }

    getRewardGoodsList() {
        var listServer = this.rewardSystemService.getGoodsList();
        listServer.then((data)=> {
            if (data) {
                if (data.code == 200) {
                    this.analyzeGoodsData(data.goods);
                } else {
                    this.warningStr = data.msg;
                }


            }
        });
    }

    analyzeGoodsData(goods) {
        this.storeGoods.length = 0;
        angular.forEach(goods.vipGoods, (v, k)=> {
            let desc = JSON.parse(v.desc);
            this.storeGoods.push({
                goodName : desc.title + "使用券",
                goodDesc : desc.subTitle,
                costScore : desc.credits,
                goodsId : v.id,
                canBuy:true
            });
        });
        angular.forEach(goods.petFood, (v, k)=> {
            this.storeGoods.push({
                goodName : v.name,
                costScore : v.credits,
                goodsId : v.foodId,
                buyLimit:v.buyLimit,
                isFood:true,
                imgSrc:'scoreStore/pet_food'+v.foodId+'.png',
                canBuy:v.canBuy
            });
        })

    }

    /**
     * 弹出提示框
     * @param msg
     */
    toast(msg, t) {
        let time = t || 1000;
        this.$ionicLoading.show({
            template: msg,
            duration: time,
            noBackdrop: true
        });
    }

    showRewardPrompt(){
        this.getRootScope().showRewardPrompt = true;
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        this.initData();
        this.getRewardGoodsList();
    }


    configDataPipe() {
        this.backUrl = this.getStateService().params.backUrl;
    }
}