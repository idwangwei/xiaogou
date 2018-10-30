/**
 * Created by ZL on 2017/12/12.
 */
import {Inject, View, Directive, select} from '../../module';

@View('sprint_goods_weixin_pay', {
    url: '/sprint_goods_weixin_pay/:cut',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        'finalSprintPaymentService',
        'commonService',
        '$ionicPopup',
        '$ionicHistory'
    ]
})

class sprintGoodsWeixinPayCtrl {
    $stateParams;
    finalSprintPaymentService;
    commonService;
    $ionicHistory
    @select(state => state.select_sprint_goods) sprintGoodsInfo;
    @select(state => state.select_sprint_goods.id) productId;
    @select(state => state.select_sprint_goods.totalFee) totalFee;
    @select(state => state.select_sprint_goods.realFee) realFee;
    @select(state => state.select_sprint_goods.title) payTitle;
    @select(state => state.select_sprint_goods.goodsDesc) payGoodsDesc;
    @select(state => state.sprint_goods_created_order_info.app) wxAppOrderInfo;
    @select(state => state.sprint_goods_created_order_info.scan) wxScanOrderInfo;
    orderType = this.finalSprintPaymentService.orderType;
    payAppCode = "wechat"; //微信支付
    currentOrderType = ""; //订单类型
    iscreateAppOrder = true;
    iscreateScanOrder = true;

    constructor() {
    }


    initFlags() {
        this.initCtrl = false;
        this.btnReadProtocol = true;

        this.iscreateAppOrder = true;
        this.iscreateScanOrder = true;
        this.newFee=this.sprintGoodsInfo.fee-(this.getStateService().params.cut||0)
    }


    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;
                this.btnReadProtocol = true;
            })
    }

    onReceiveProps() {
        this.iscreateAppOrder = true;
    }

    onBeforeEnterView() {

    }

    onAfterEnterView() {
        this.initFlags();
    }

    back() {
        // this.go("final_sprint_pay" );
        this.$ionicHistory.goBack();
    }


    /**
     * 微信本机支付下订单
     * 错误提示  1、提交请求失败有可能是设备上微信加密所致 TODO
     */
    createOrderWxPayApp() {
        if (!this.iscreateAppOrder) return;
        this.iscreateAppOrder = false;

        if (!this.btnReadProtocol) {
            this.commonService.alertDialog("请先阅读用户须知条款!");
            this.iscreateAppOrder = true;
            return;
        }

        if (!window.parent.Wechat || (window.parent.Wechat && !window.parent.Wechat.isInstalled)) {
            this.commonService.alertDialog("请先安装微信!"); //TODO 提示信息要修改
            this.iscreateAppOrder = true;
            return;
        }

        this.currentOrderType = this.orderType.WX_APP;
        if (!this.isCreateNewOrder(this.currentOrderType)) { //订单没有超时直接调用微信支付接口
            this.sendWxPayRequest();
            return;
        }

        this.finalSprintPaymentService.createOrder(this.productId, this.payAppCode, "app").then(data=> {
            if (data.code == 200) {
                this.sendWxPayRequest();
                return;
            }
            this.iscreateAppOrder = true;
            this.commonService.showAlert('温馨提示', `<div>${data.msg}</div>`);
        });

    }

    /**
     * 调起支付接口，跳转到微信支付
     */
    sendWxPayRequest() {
        let me = this;
        if (!this.wxAppOrderInfo || (this.wxAppOrderInfo && !this.wxAppOrderInfo.order)) {
            this.commonService.alertDialog("下单失败!");
            this.iscreateAppOrder = true;
            return;
        }

        // window.parent.Wechat.sendPaymentRequest(me.wxAppOrderInfo.order,data=>{
        this.alrSendPaymentRequest(me.wxAppOrderInfo.order, data=> {
            console.log("success:", data);
            me.gotoPayResult(); //支付成功跳转到支付结果页面
        }, function (data) {
            console.error("fail:", data);
            me.gotoPayResult(); //支付失败也跳转到支付结果页面
        });
    };

    alrSendPaymentRequest(params, onSuccess, onError) {
        if (!window.cordova) {
            console.error("没有cordova");
            return;
        }
        var alrexec = window.cordova.require("cordova/exec");
        alrexec(onSuccess, onError, "Wechat", "sendPaymentRequest", [params]);
    }


    /**
     * 扫码支付
     */
    createOrderWxPayScan() {
        if (!this.iscreateScanOrder) return;
        this.iscreateScanOrder = false;

        if (!this.btnReadProtocol) {
            this.commonService.alertDialog("请先阅读用户须知条款!");
            return;
        }

        this.currentOrderType = this.orderType.WX_SCAN;
        if (!this.isCreateNewOrder(this.currentOrderType)) { //订单没有超时直接调用微信支付接口
            this.showQrCode(); //显示二维码
            this.iscreateScanOrder = true;
            return;
        }

        this.finalSprintPaymentService.createOrder(this.productId, this.payAppCode, "scan").then(data=> {
            if (data.code == 200) {
                this.showQrCode(); //显示二维码
                this.iscreateScanOrder = true;
                return;
            }
            this.iscreateScanOrder = true;
            var msg = data.msg || "下单失败";
            this.commonService.showAlert('温馨提示', `<div>${msg}</div>`);
        });
    }


    /**
     * 显示二维码
     * @param qrCodeData
     */
    showQrCode() {
        let codeUrl = this.wxScanOrderInfo.order.code_url;
        var imgSrc = window.QRCode.generatePNG(codeUrl, {modulesize: 5, margin: 5});
        this.$ionicPopup.show({
            title: '微信扫码支付（可找人代付）',
            template: '<div style="width: 100%;height: 100%;text-align: center"><img src=' + imgSrc + '></div>',
            scope: this.getScope(),
            buttons: [
                {
                    text: '支付成功后，点这里',
                    onTap: e=> {
                        this.gotoPayResult();
                    }
                }
            ]
        })
    };

    /**
     * 判断订单是否超时，超时则重新去后端下单，若没有超时，则只跳转到微信端支付
     * @returns {boolean}
     */
    isCreateNewOrder(type) {
        var orderInfo = "";
        switch (type) {
            case this.orderType.WX_SCAN:
                orderInfo = this.wxScanOrderInfo;
                break;
            case this.orderType.WX_APP:
            default:
                orderInfo = this.wxAppOrderInfo;
                break;

        }
        //订单不存在 ||订单存在但不是同一个商品|| 订单存在且为同一个商品且支付状态为1（已支付） 重新创建订单
        if (!orderInfo || (orderInfo && orderInfo.productId != this.productId) || (orderInfo && orderInfo.status == 0 && orderInfo.productId == this.productId)) {
            return true;
        }
        let startTime = orderInfo.order.timestamp;
        let tmp = Date.parse(new Date()).toString();
        let endTime = tmp.substr(0, 10);

        let intervalTime = Number(endTime) - Number(startTime);
        if (intervalTime < 0) {
            return true;
        }

        let intervalMinute = intervalTime / 60; //间隔的分钟数
        return intervalMinute >= 15;  //超过15分钟订单超时
    }

    /**
     * 切换是否阅读用户须知
     */
    toggleReadBtn() {
        this.btnReadProtocol = !this.btnReadProtocol;
        this.iscreateAppOrder = true;
        this.iscreateScanOrder = true;
    }

    /**
     * 跳转到支付结果页面
     */
    gotoPayResult() {
        this.go("sprint_goods_pay_result",{orderType:this.currentOrderType});
    }

    /**
     * 打开用户须知
     */
    gotoProtocol() {
        this.go("sprint_goods_pay_protocol");
    }
}

export default sprintGoodsWeixinPayCtrl;