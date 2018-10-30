/**
 * Created by ZL on 2017/12/12.
 */
import  _ from 'underscore';
import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'finalSprintPay',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('final_sprint_pay', {
    url: 'final_sprint_pay/:fromUrl',
    template: '<final-sprint-pay></final-sprint-pay>'
})

@Inject('$scope',
    '$state',
    '$rootScope',
    '$stateParams',
    '$ngRedux',
    '$ionicHistory',
    '$ionicLoading',
    '$ionicPopup',
    '$timeout',
    'commonService',
    'finalSprintService'
)

class finalSprintPayCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    $ionicHistory;
    finalSprintService;
    // goodsList = [];
    selectGoodsIndex = -1;
    isVipGoods = [];

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.final_sprint_goods_list) goodsList;
    @select(state=>state.final_sprint_goods_list_processing) fetchProcessing;
    @select(state => state.profile_user_auth.user.vips) vipInfo;


    initData() {
        this.initCtrl = false;
        this.loading = true;
        /*this.goodsList = [
         {
         title: '冲刺月提分包',
         goodsDesc: ['期末全真模拟密卷（全部试卷）',
         '智能测评和考点诊断报告',
         '涉及80个考点练习题'
         ],
         totalFee: '5000',
         fee:50
         },
         {
         name: '第一周提分包',
         desc: ['期末第一周全真模拟密卷',
         '智能测评和考点诊断报告',
         '涉及20个考点练习题'
         ],
         price: '50',
         },
         {
         name: '第二周提分包',
         desc: ['期末第二周全真模拟密卷',
         '智能测评和考点诊断报告',
         '涉及20个考点练习题'
         ],
         price: '50',
         }
         ];*/
    }

    filterVipGoods() {
        if (this.vipInfo) {
            let hasFinal = -1;
            angular.forEach(this.vipInfo, (v, k)=> {
                if (this.vipInfo[k].hasOwnProperty('finalSprint')) hasFinal = k;
            });
            if (hasFinal != -1) {
                this.isVipGoods = this.vipInfo[hasFinal].finalSprint||[];
            }
        }
        angular.forEach(this.isVipGoods, (v, k)=> {
            $('.goods-item .ion-ios-circle-outline').eq(v).hide();
            $('.goods-item .ion-checkmark-circled').eq(v).hide();
            $('.goods-item .pay_vip_mark').eq(v).show();
        });
        // if (this.isVipGoods.length == this.goodsList.length - 1) {
        if (this.isVipGoods.length == 4) {
            $('.goods-item .ion-ios-circle-outline').eq(0).hide();
            $('.goods-item .ion-checkmark-circled').eq(0).hide();
            $('.goods-item .pay_vip_mark').eq(0).show();
        }
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
            this.finalSprintService.fetchFinalSprintGoods(this.sortType, true).then((data)=> { //获取商品列表
                if (data) {
                    this.$timeout(()=>{
                        this.filterVipGoods();
                    });

                }
            });
            this.initCtrl = true;
        }
    }

    back() {
       /* if (this.$ionicHistory.backView() !== null) {
            this.$ionicHistory.goBack()
        } else {
            this.go('final_sprint_home');
        }*/
        this.commonService.showPopup({
            title: '提示',
            template: '<p style="text-align: center; width=100%;">确定退出支付吗？</p>',
            buttons: [{
                text: '确定',
                type: 'button-default',
                onTap: (e)=> {
                    this.go('final_sprint_home','back');
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
        if (!this.loading) return;
        this.loading = false;
        let refreshComplete = () => {
            this.$timeout(() => this.getScope().$broadcast('scroll.refreshComplete'), 10)
        };
        this.finalSprintService.fetchFinalSprintGoods(this.sortType, true).then((data)=> {
            this.$timeout(()=>{
                this.filterVipGoods();
            });
            refreshComplete();
            this.loading = true;
        }, () => {
            this.loading = true;
            refreshComplete();
        });
    }

    gotoFinalSprintWeixinPay() {
        if (this.selectGoodsIndex == -1) {
            this.commonService.alertDialog('请先选择您要购买的提分包');
            return;
        }

        this.$ionicPopup.alert({
            title: '确认支付',
            template: '<div style="text-align: center; width=100%;"><p>购买前必须告诉爸爸妈妈</p><p>不要擅自购买哦！</p></div>',
            buttons: [
                {text: '说过了，去支付'}
            ]
        }).then((res)=> {
            let selectVipGoods = angular.copy(this.isVipGoods);
            if (this.selectGoodsIndex == 0) {
                selectVipGoods = selectVipGoods.concat(_.range(5).slice(1));
            } else {
                selectVipGoods.push(Number(this.selectGoodsIndex))
            }
            this.goodsList[this.selectGoodsIndex].finalSprintVips = _.uniq(selectVipGoods);
            this.finalSprintService.selectSprintGoods(this.goodsList[this.selectGoodsIndex]);
            this.go('sprint_goods_weixin_pay','forward');
        });
    }

    selectGoods(event, item, index) {
        if($('.goods-item .pay_vip_mark')[index].style.display !='none') return;
        let goodsItems = $(".pay-goods-list .goods-item");
        if (this.selectGoodsIndex == index) {
            let newSelectElem =goodsItems.eq(index);
            this.changeGoodsItemStyle(newSelectElem,true,false,"#51b5f0","#ff0d0d",false);
            this.selectGoodsIndex = -1;
        }else{
            if(this.selectGoodsIndex != -1){
                let oldSelectElem = goodsItems.eq(this.selectGoodsIndex);
                this.changeGoodsItemStyle(oldSelectElem,true,false,"#51b5f0","#ff0d0d",false);
            }
            let newSelectElem =goodsItems.eq(index);
            this.changeGoodsItemStyle(newSelectElem,false,true,"#ffffff","#fbf50b",true);
            this.selectGoodsIndex = index;
        }
    }

    changeGoodsItemStyle(selectElem,unselectFlag,selectFlag,item01Color,item02Color,addClassFlag){
        if(unselectFlag){
            selectElem.find('.ion-ios-circle-outline').show();
        }else{
            selectElem.find('.ion-ios-circle-outline').hide();
        }
        if(selectFlag){
            selectElem.find('.ion-checkmark-circled').show();
        }else{
            selectElem.find('.ion-checkmark-circled').hide();
        }
        selectElem.find('.item01').css("color",item01Color);
        selectElem.find('.item02').css("color",item02Color);
        if(addClassFlag){
            selectElem.addClass('goods-item-change-bg');
        }else{
            selectElem.removeClass('goods-item-change-bg');
        }

    }
}

export default finalSprintPayCtrl;