/**
 * Created by ww on 2017/7/7.
 */
import {Inject, View, Directive, select} from '../../module';
import _each from 'lodash.foreach';
import _find from 'lodash.find';
@View('xly_vip_v2', {
    url: '/xly_vip_v2',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:['$scope', '$state', '$stateParams', 'wxPayService', 'commonService',
    '$ngRedux', '$ionicPopup', '$timeout', 'serverInterface', 'finalData', '$ionicViewSwitcher','$rootScope','$ocLazyLoad']
})
class xlyVipV2Ctrl {
    wxPayService;
    finalData;
    commonService;
    serverInterface;
    $ionicViewSwitcher;
    $timeout;
    $ocLazyLoad;
    @select(state=>state.wxpay_created_order_info&&state.wxpay_created_order_info.app) wxAppOrderInfo;
    @select(state=>state.wxpay_created_order_info&&state.wxpay_created_order_info.scan) wxScanOrderInfo;
    @select((state)=>{
        let vips = state.profile_user_auth.user.vips, isSVIP = false;
        _each(vips,(item)=>{
            if(item.hasOwnProperty('svip')){
                isSVIP = item.svip instanceof Array ? item.svip.indexOf(1)!=-1 :item.svip;
            }
        });
        return isSVIP;
    }) isSVIP;
    
    btnReadProtocol = true;
    iscreateAppOrder = true;
    iscreateScanOrder = true;

    isIos = this.commonService.judgeSYS() === 2;
    
    //TODO  订单信息存储的位置
    currentOrderType = ""; //订单类型
    payAppCode = "wechat"; //微信支付
    orderType = this.wxPayService.orderType;
    initCtrl = false;
    xlyGoods = {};
    isLoadingProcessing = true;
    constructor() {
    }

    back() {
        this.go("home.study_index",'back');
    }

    mapActionToThis() {
        let wxPayService = this.wxPayService;
        return {
            createOrder: wxPayService.createXlyVipOrder.bind(wxPayService),
            queryOrder: wxPayService.queryOrder.bind(wxPayService),
        }
    }

    onAfterEnterView() {
        this.$ocLazyLoad.load("m_diagnose_payment");
    }

    configDataPipe() {
        this.dataPipe.when(()=>!this.initCtrl)
            .then(()=> {
                this.initCtrl = true;
                //获取最新的商品列表
                this.getServerData();
            })
    }

    getServerData() {
        this.hasWrong = false;
        this.isLoadingProcessing = true;
        this.wxPayService.getXlyVipAllGoodsInfo().then((data)=> {
            if (data) {
                this.xlyGoods = data.goods;
                this.xlyGoods.totalFee=(this.xlyGoods.totalFee/100).toFixed(2);
                this.xlyGoods.discountGoodsList.forEach((item)=>{
                    item.selected = true;
                    item.disable = 'disable';
                    item.discountPrice =(item.discountPrice/100).toFixed(0);
                    item.originalPrice =(item.originalPrice/100).toFixed(0);
                });
                this.isLoadingProcessing = false;
            } else {
                this.isLoadingProcessing = false;
                this.hasWrong = true;
            }
        },()=>{
            this.isLoadingProcessing = false;
            this.hasWrong = true;
        })
    }

    
    
    /**
     * 微信本机支付下订单
     * 错误提示  1、提交请求失败有可能是设备上微信加密所致 TODO
     */
    createOrderWxPayApp() {
        if (!this.iscreateAppOrder) return;

        if (!this.btnReadProtocol) {
            this.commonService.alertDialog("请先阅读用户须知条款!");
            this.iscreateAppOrder = true;
            return;
        }

        // this.handleSelectGoodsIdsParam();
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

        this.iscreateAppOrder = false;
        this.createOrder(this.xlyGoods.id, this.payAppCode, this.currentOrderType).then(data=> {
            this.iscreateAppOrder = true;
            if (data.code == 200) {
                this.sendWxPayRequest();
                return;
            }
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

        this.alrSendPaymentRequest(me.wxAppOrderInfo.order, data=> {
            console.log("success:", data);

            me.gotoPayResult(); //支付成功跳转到支付结果页面
        }, function (data) {
            console.error("fail:", data);
            me.gotoPayResult(); //支付失败也跳转到支付结果页面
        });
    };

    /**
     * 打开本机微信App支付
     * @param params
     * @param onSuccess
     * @param onError
     */

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
        this.iscreateScanOrder = false;
        this.createOrder(this.xlyGoods.id, this.payAppCode, this.currentOrderType).then(data=> {
            this.iscreateScanOrder = true;
            if (data.code == 200) {
                this.showQrCode(); //显示二维码
                return;
            }
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
        //订单不存在 ||订单存在但不是同一个商品|| 订单存在且为同一个商品且支付状态为0（已支付） 重新创建订单
        if (!orderInfo || !orderInfo.productId || !orderInfo.order
            || (orderInfo && orderInfo.productId && orderInfo.productId.toString() != this.xlyGoods.id.toString())
            || (orderInfo && orderInfo.status == 0)
        ) {
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
     * 跳转到支付结果页面
     */
    gotoPayResult() {
        this.go("weixin_pay_result", {
            orderType: this.currentOrderType,
            comeFrom: 'xly_vip_v2',
            urlFrom:'home.study_index'
        });
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
     * 打开用户须知
     */
    gotoProtocol() {
        this.go("weixin_pay_protocol", {backUrl: 'xly_vip_v2'});
    }
    

}
