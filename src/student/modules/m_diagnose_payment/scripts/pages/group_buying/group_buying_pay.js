/**
 * Created by ZL on 2017/2/17.
 * 团购支付
 */

import controllers from './../index';
import BaseController from 'base_components/base_ctrl';
import * as QRCode from '../../../../m_global/scripts/libs/qr';

class groupBuyingPay extends BaseController {
    constructor() {
        super(arguments);
    }

    initFlags() {
        this.btnReadProtocol = true;
    }

    initData() {
        this.totalFee = ""; //支付金额 以分为单位
        this.payTitle = ""; //标题
        this.productId = ""; //商品id
        this.productDescribe = [ //商品描述
            "精准分析学生的薄弱考点",
            "智能推送薄弱考点的针对性练习",
            "6个年级所有考点的诊断报告",
            "每个单元所有考点的练习题",
            "每一道题的详细答案和解析"
        ];
        this.productShowFee = "";

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
    }

    back() {
        this.go("group_buying_create", {urlFrom: this.urlFrom,backWorkReportUrl:this.backWorkReportUrl});
    }

    mapStateToThis(state) {
        let selectedGood = state.group_buying_selected_good.payload;
        return {
            goods: selectedGood.goods,
            totalFee: selectedGood.totalFee,
            productShowFee: selectedGood.desc.fee,
            payTitle: selectedGood.desc.title,
            wxAppOrderInfo: state.group_buying_created_order_info.app,
            wxScanOrderInfo: state.group_buying_created_order_info.scan,
        };
    }

    mapActionToThis() {
        let wxPayService = this.wxPayService;
        return {
            createGroupOrder: wxPayService.createGroupBuyingOrder.bind(wxPayService)
        }
    }

    onAfterEnterView() {
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
    }

    onReceiveProps() {
        // this.productShowFee = this.totalFee;
        // this.totalFee = this.productShowFee * 100;
        this.iscreateAppOrder = true;
    }

    /**
     * 团购本机支付
     * createGroupOrder
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

        this.createGroupOrder(this.totalFee, this.goods, this.payAppCode, "app").then(data=> {
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
     * 团购扫描支付
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

        this.createGroupOrder(this.totalFee, this.goods, this.payAppCode, "scan").then(data=> {
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
        if (!orderInfo || orderInfo && !orderInfo.goods) return true; //订单不存在
        var leaderId = orderInfo.goods[0].leaderId;
        if (leaderId !== this.goods[0].leaderId) return true;//订单存在但不是同一个团主下的订单
        if (leaderId !== this.goods[0].leaderId && orderInfo.status == 0) return true;//同一个订单已支付

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
        this.go("group_buying_result", {orderType: this.currentOrderType, urlFrom: this.urlFrom,backWorkReportUrl:this.backWorkReportUrl});
    }

    /**
     * 打开用户须知
     */
    gotoProtocol() {
        this.go("weixin_pay_protocol", {urlFrom: this.urlFrom, backUrl: 'group_buying_pay',backWorkReportUrl:this.backWorkReportUrl});
    }

}

groupBuyingPay.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , '$stateParams'
    , 'commonService'
    , '$ngRedux'
    , '$ionicPopup'
    , 'wxPayService'
    , '$ionicLoading'

];
controllers.controller("groupBuyingPay", groupBuyingPay);
