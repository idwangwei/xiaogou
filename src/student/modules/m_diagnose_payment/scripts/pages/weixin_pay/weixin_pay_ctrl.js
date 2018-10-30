/**
 * Created by WangLu on 2016/11/10.
 */
import * as QRCode from '../../../../m_global/scripts/libs/qr';
import {Inject, View, Directive, select} from '../../module';

@View('weixin_pay', {
    url: '/weixin_pay/:urlFrom/:backWorkReportUrl/:cut',
    styles: require('./weixin_pay.less'),
    template: require('./weixin_pay.html'),
    inject:['$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , 'commonService'
        , '$ngRedux'
        , '$ionicPopup'
        , 'wxPayService'
        , '$ionicHistory'
        , '$ionicLoading']
})
class WeixinPayCtrl {
    @select(state=>state.selected_good.payload) selectedGood;
    @select(state=>state.selected_good.payload.id) productId;
    @select(state=>state.selected_good.payload.totalFee) totalFee;
    @select((state)=>{
        let selectedGood = state.selected_good.payload;
        let productShowFee = selectedGood.desc.saleFee || selectedGood.desc.fee;
        return productShowFee;
    }) productShowFee;
    @select(state=>state.selected_good.payload.desc.title) payTitle;
    @select(state=>state.selected_good.payload.desc.subTitle) paySubTitle;
    @select(state=>state.wxpay_created_order_info.app) wxAppOrderInfo;
    @select(state=>state.wxpay_created_order_info.scan) wxScanOrderInfo;

    constructor(){
    }
    initFlags() {
        this.btnReadProtocol = true;
        this.newFee=(this.productShowFee*100-((this.getStateService().params.cut||0)-0)*100)/100
    }

    initData() {
        // this.totalFee = ""; //支付金额 以分为单位
        // this.payTitle = ""; //标题
        // this.productId = ""; //商品id
        // this.productShowFee = "";

        this.iscreateAppOrder = true;
        this.iscreateScanOrder = true;

        //TODO  订单信息存储的位置，
        this.wxAppOrderInfo = ""; //微信订单信息
        this.wxScanOrderInfo = ""; //扫描支付订单信息
        this.currentOrderType = ""; //订单类型

        this.payAppCode = "wechat"; //微信支付
        this.orderType = this.wxPayService.orderType;
        this.urlFrom = this.getStateService().params.urlFrom || "home.diagnose02";//this.$stateParams.urlFrom;
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
        this.productDescribe = this.urlFrom == 'increase_score_goods_select' ?
            [
                "考点和题目由20多名 特级教师 、10多所名校小升初 命题专家 ，联合 一线名师 ， 以历年小升初和期末真题为基础，紧扣考纲，精心打造。",
                "开通“诊断提分”可以对整本教材所有课时的考点进行全面诊断分析。"
            ] :
            [ //商品描述
                "精准分析学生的薄弱考点",
                "智能推送薄弱考点的针对性练习",
                "所有考点的诊断报告",
                "每一道题的详细答案和解析",
                "紧扣考纲，快速提分"
            ];
    }

    back() {
        // if (this.urlFrom == 'increase_score_goods_select') {
         this.$ionicHistory.goBack();
            return;
        // }
        // this.go("weixin_pay_select", {urlFrom: this.urlFrom, backWorkReportUrl: this.backWorkReportUrl});
    }

   /* mapStateToThis(state) {
        let me = this;
        let selectedGood = state.selected_good.payload;
        return {
            productId: selectedGood.id,
            totalFee: selectedGood.totalFee,
            productShowFee: selectedGood.desc.saleFee || selectedGood.desc.fee,
            payTitle: selectedGood.desc.title,
            paySubTitle: selectedGood.desc.subTitle,
            // productDescribe:selectedGood.desc.statement,
            wxAppOrderInfo: state.wxpay_created_order_info.app,
            wxScanOrderInfo: state.wxpay_created_order_info.scan,
        };
    }*/

    mapActionToThis() {
        let wxPayService = this.wxPayService;
        return {
            createOrder: wxPayService.createOrder.bind(wxPayService),
            queryOrder: wxPayService.queryOrder.bind(wxPayService),
        }
    }

    onAfterEnterView() {
        this.initFlags();
        this.initData();
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
    }

    onReceiveProps() {
        // this.productShowFee = this.totalFee;
        // this.totalFee = this.productShowFee * 100;
        this.iscreateAppOrder = true;
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

        this.createOrder(this.productId, this.payAppCode, "app").then(data=> {
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
            this.commonService.alertDialog("<p style='text-align: center'>下单失败!</p>");
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

        this.createOrder(this.productId, this.payAppCode, "scan").then(data=> {
            if (data.code == 200) {
                this.showQrCode(); //显示二维码
                this.iscreateScanOrder = true;
                return;
            }
            this.iscreateScanOrder = true;
            var msg = data.msg || "下单失败";
            this.commonService.showAlert('温馨提示', `<div style="text-align: center">${msg}</div>`);
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
        this.go("weixin_pay_result", {
            orderType: this.currentOrderType,
            urlFrom: this.urlFrom,
            backWorkReportUrl: this.backWorkReportUrl
        });
    }

    /**
     * 打开用户须知
     */
    gotoProtocol() {
        this.go("weixin_pay_protocol", {
            urlFrom: this.urlFrom,
            backUrl: 'weixin_pay',
            backWorkReportUrl: this.backWorkReportUrl
        });
    }

}