/**
 * Created by ZL on 2017/11/8.
 */
import {Inject, View, Directive, select} from '../../module';

@View('submit_exchange_goods', {
    url: 'submit_exchange_goods',
    styles: require('./style.less'),
    template: require('./page.html'),
    inject: ['$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        '$ionicHistory',
        '$ionicLoading',
        '$ionicPopup',
        '$timeout',
        'commonService',
        'creditsStoreService'
    ]
})

class submitExchangeGoodsCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    creditsStoreService;
    // selectGoods = {};
    onOrOffFlag = true;//如果有默认地址则亮起，自动显示默认地址，如果重新填入了地址，或关掉了默认地址则（调接口）按钮灰掉
    initOnOrOffFlag = this.onOrOffFlag;
    currentReceiver = {};

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.default_receiver) defaultReceiver;
    @select(state=>state.select_credits_goods) selectGoods;

    constructor() {


    }

    initData() {
        if (!this.defaultReceiver) this.defaultReceiver = {};

        /*else {
         this.creditsStoreService.getDefaultReceiver().then((data)=> {
         this.onOrOffFlag = true;
         this.currentReceiver = Object.assign({}, this.defaultReceiver);
         $('#receiver_address').val(this.currentReceiver.address);
         })
         }*/
        this.creditsStoreService.getDefaultReceiver().then((data)=> {
            this.onOrOffFlag = true;
            this.currentReceiver = Object.assign({}, this.defaultReceiver);
            $('#receiver_address').val(this.currentReceiver.address);

            if (this.selectGoods.isOrder && this.selectGoods.orderInfo) {
                if (this.defaultReceiver.name != this.selectGoods.orderInfo.name ||
                    this.defaultReceiver.phone != this.selectGoods.orderInfo.phone ||
                    this.defaultReceiver.address != this.selectGoods.orderInfo.address) {
                    this.onOrOffFlag = false;
                    this.currentReceiver = Object.assign({}, this.selectGoods.orderInfo);
                }
                this.canClickFlag = false;
                $('#receiver_address').val(this.currentReceiver.address);
            }
        })

    }

    onAfterEnterView() {
        this.canClickFlag = true;
        this.initData();
    }

    onBeforeEnterView() {
    }

    back() {
        // this.go('credits_exchange_goods',{fromUrl:this.fromUrl});
        this.$ionicHistory.goBack()
    }

    /**
     * 开始或关闭按钮点击事件
     */
    onOrOffClickEvent() {
        if (!this.canClickFlag) return;
        this.canClickFlag = false;
        let className = 'off-on-active';
        if (this.onOrOffFlag) className = 'on-off-active';
        $('.on-off').addClass(className);
        this.clickTimer = this.$timeout(()=> {
            this.onOrOffFlag = !this.onOrOffFlag;
            this.canClickFlag = true;
            $('.on-off').removeClass(className);
            if (this.onOrOffFlag) {
                $('.on-off').css('transform', 'translate3d(40px, 0, 0)');
                $('.on-off').css('-webkit-transform', 'translate3d(40px, 0, 0)');
            } else {
                $('.on-off').css('transform', 'translate3d(0, 0, 0)');
                $('.on-off').css('-webkit-transform', 'translate3d(0, 0, 0)');
            }
            this.$timeout.cancel(this.clickTimer);
        }, 500);
    }

    /**
     * 下单
     */
    submitGoodsForOrder() {
        this.currentReceiver.address = $('#receiver_address').val();
        if (!this.currentReceiver.name) {
            this.commonService.alertDialog('收件人姓名不能为空！');
            return;
        }
        if (!this.currentReceiver.phone) {
            this.commonService.alertDialog('请填写正确的手机号！');
            return;
        }
        if (!this.currentReceiver.address) {
            this.commonService.alertDialog('收件人地址不能为空！');
            return;
        }

        //已下单的商品不能在重复兑换
        if (this.selectGoods.isOrder || !this.selectGoods.hasStock) return;

        let me = this;

        this.commonService.showAlert('温馨提示', '<p>您的商品已开始兑换流程，我们会在7—10个工作日内进行核对，请保证手机畅通以便我们联系您。</p>')
            .then(()=> {
                me.creditsStoreService.createCreditsOrder(me.selectGoods.id, me.currentReceiver, me.onOrOffFlag)
                    .then((data)=> {
                        if (data && data.code == 200) {
                            me.selectGoods.isOrder = true;
                            me.creditsStoreService.selectCreditsGoods(me.selectGoods);
                            me.creditsStoreService.getDefaultReceiver();
                        }
                    });
            });
    }

    /**
     * 完成订单
     */
    submitFinishOrder() {
        let me = this;
        this.commonService.showPopup({
            title: '提示',
            template: '<p style="text-align: center">是否确认收货?</p>',
            buttons: [{
                text: '确定',
                type: 'button-positive',
                onTap: (e)=> {
                    me.creditsStoreService.submitFinishOrder(me.selectGoods.orderInfo.orderId)
                        .then((data)=> {
                            if (data && data.code == 200) {
                                me.commonService.alertDialog('订单完成');
                                // me.go('credits_store',{fromUrl:this.fromUrl});
                                this.$ionicHistory.goBack(-2)
                            }
                        });
                }
            },
                {
                    text: '取消',
                    type: 'button-default',
                    onTap: (e)=> {
                        return;
                    }
                }]
        });

    }
}

export default submitExchangeGoodsCtrl;