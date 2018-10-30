/**
 * Created by ww on 2017/12/8.
 */
import {Inject, View, Directive, select} from '../../module';

@View('increase_score_goods_select', {
    url: '/increase_score_goods_select/:selectedGrade',
    template: require('./goods_select_page.html'),
    styles: require('./goods_select_page.less'),
    inject: ['$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , 'commonService'
        , '$ngRedux'
        , '$ionicPopup'
        , 'wxPayService'
        , '$ionicLoading'
        , '$ionicHistory'
    ]
})
class IncreaseScorePay {
    $stateParams;
    commonService;
    wxPayService;
    @select(state=>state.fetch_goods_menus_processing) isLoadingProcessing;
    @select(state=>state.increase_score_goods_menus_list) goodsList;
    initCtrl = false; //ctrl初始化后，是否已经加载过
    screenWidth = window.innerWidth;
    isIos = this.commonService.judgeSYS() == 2;
    selectedGrade = +this.$stateParams.selectedGrade;

    constructor() {
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    onAfterEnterView() {
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.wxPayService.cancelDiagnoseGoodsMenusRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.wxPayService.cancelDiagnoseGoodsMenusRequestList.splice(0, this.wxPayService.cancelDiagnoseGoodsMenusRequestList.length);//清空请求列表
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.fetchGoodsMenus(this.selectedGrade);
        }
    }

    callBack() {
        this.$ionicPopup.alert({
            title: '确认支付',
            template: '<div style="text-align: center; width=100%;"><p>购买前必须告诉爸爸妈妈</p><p>不要擅自购买哦！</p></div>',
            buttons: [
                {text: '说过了，去支付'}
            ]
        }).then((res)=> {
            this.go('weixin_pay', {urlFrom: 'increase_score_goods_select'});
        });
    }

    back() {
        var title = '提示';
        var info = '<div style="text-align: center; width=100%;"><p>确定要退出支付吗?</p></div>';
        this.commonService.showConfirm(title, info).then((res)=> {
            if (!res)return;
            // this.go("diagnose_knowledge02", {isIncreaseScore: true});
            this.$ionicHistory.goBack();
        });
    }

    gotoPay() {
        let selectGood = undefined;
        this.goodsList.forEach((v) => {
            if (v.selected) {
                selectGood = v;
            }
        });
        if (!selectGood) {
            this.$ionicLoading.show({
                template: "<p style='text-align: center'>请先选择一个版本</p>",
                duration: 800
            });
            return;
        }
        this.selectGoodService(selectGood, this.callBack.bind(this));
    }

    selectGoods(item) {
        if(item.hasBought){return}
        if (!item.selected) {
            this.goodsList.forEach((v) => {
                v.selected = false;
            });
            item.selected = true;
        } else {
            item.selected = false;
        }
    }

    mapActionToThis() {
        return {
            fetchGoodsMenus: this.wxPayService.fetchIncreaseScoreGoodsMenus.bind(this.wxPayService),
            selectGoodService: this.wxPayService.selectedGood.bind(this.wxPayService)
        }
    }
}