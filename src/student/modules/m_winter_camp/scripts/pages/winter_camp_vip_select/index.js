/**
 * Created by ZL on 2017/12/12.
 */
import  _ from 'underscore';
import {Inject, View, Directive, select} from '../../module';

@View('winter_camp_vip_select', {
    url: 'winter_camp_vip_select/:fromUrl',
    cache:false,
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        '$ionicHistory',
        '$ionicLoading',
        '$ionicPopup',
        '$timeout',
        'commonService',
        'winterCampService'
    ]
})

class WinterCampVipSelectCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    $ionicHistory;
    winterCampService;
    selectGoodsIndex = -1;
    isVipGoods = [];

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.winter_camp_vip.goods_list) goodsList;
    @select(state=>state.winter_camp_vip.fetch_goods_list_processing) fetchProcessing;
    @select(state => state.profile_user_auth.user.vips) vipInfo;
    isIOS = this.commonService.judgeSYS() === 2;
    initData() {
        this.initCtrl = false;
        this.goodsList = [
            {
                title: '30课时·预习包',
                goodsDesc: [
                    '下学期全册30个课时互动课堂',
                    '30套配套随堂练习题',
                    '100+考点智能诊断和提高'
                ],
                totalFee: '5800',
                fee: 58,
                selected:false,
                hasBought:false
            },
            {
                title: '7课时·预习包',
                goodsDesc: [
                    '下学期1个单元7个课时互动课堂',
                    '7套配套随堂练习题',
                    '35+考点智能诊断和提高'
                ],
                totalFee: '1800',
                fee: 18,
                selected:false,
                hasBought:false
            }

        ];
    }

    onAfterEnterView() {
        this.initData();
    }

    onBeforeEnterView() {
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.winterCampService.fetchWinterCampVipGoods().then(()=>{
                this.initCtrl = true;
            });
        }
    }

    back() {
        this.commonService.showPopup({
            title: '提示',
            template: '<p style="text-align: center; width=100%;">确定退出支付吗？</p>',
            buttons: [{
                text: '确定',
                type: 'button-default',
                onTap: (e)=> {
                    this.go('home.winter_camp_home');
                    this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');
                }
            }, {
                text: '取消',
                type: 'button-positive',
                onTap: (e)=> {
                  return;
                }
            }]
        });
    }

    /**
     * 下拉刷新
     */
    pullRefresh() {
        if(this.fetchProcessing){return}

        let refreshComplete = () => {
            this.$timeout(() => this.getScope().$broadcast('scroll.refreshComplete'), 10)
        };

        let currentSelectId = this.selectGoodsIndex !==-1 && this.goodsList[this.selectGoodsIndex].id;
        this.winterCampService.fetchWinterCampVipGoods(currentSelectId).then(()=> {
            refreshComplete();
        }, () => {
            refreshComplete();
        });
    }

    gotoWinterCampVipPayPage() {
        if (this.selectGoodsIndex === -1) {
            this.commonService.alertDialog('请先选择您要购买的预习包');
            return;
        }

        this.$ionicPopup.alert({
            title: '确认支付',
            template: '<div style="text-align: center; width=100%;"><p>购买前必须告诉爸爸妈妈</p><p>不要擅自购买哦！</p></div>',
            buttons: [
                {text: '说过了，去支付'}
            ]
        }).then(()=> {
            this.winterCampService.selectVipGoods(this.goodsList[this.selectGoodsIndex]);
            this.go('winter_camp_vip_pay','forward');
        });
    }

    selectGoods(event, item, index) {
        event.stopPropagation();
        if(item.selected){
            item.selected = false;
            this.selectGoodsIndex = -1;
            return;
        }

        this.goodsList.forEach((item)=>{item.selected = false});
        item.selected = true;
        this.selectGoodsIndex = index;
    }
}

export default WinterCampVipSelectCtrl;