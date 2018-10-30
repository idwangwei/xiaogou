/**
 * Created by ww on 2017/7/7.
 */
import {Inject, View, Directive, select} from '../../module';
import _each from 'lodash.foreach';
import _find from 'lodash.find';
@View('year_card_pay', {
    url: '/year_card_pay/:xlyType',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:['$scope', '$state', '$stateParams', 'wxPayService', 'commonService',
    '$ngRedux', '$ionicPopup', '$timeout', 'serverInterface', 'finalData', '$ionicViewSwitcher','$rootScope','$ocLazyLoad']
})
class yearCardPayCtrl {
    wxPayService;
    finalData;
    commonService;
    serverInterface;
    $ionicViewSwitcher;
    $timeout;
    $ocLazyLoad;
    @select(state=>state.wxpay_created_order_info.app) wxAppOrderInfo;
    @select(state=>state.wxpay_created_order_info.scan) wxScanOrderInfo;
    @select((state)=>{
        let vips = state.profile_user_auth.user.vips, isVip = false;
        _each(vips,(item)=>{
            if(item.hasOwnProperty('xly')){
                isVip = item.xly;
            }
        });
        return isVip;
    }) isVip;

    btnReadProtocol = true;
    iscreateAppOrder = true;
    iscreateScanOrder = true;

    isIos = this.commonService.judgeSYS() === 2;
    invite = this.wxPayService.invite;
    //TODO  订单信息存储的位置
    currentOrderType = ""; //订单类型
    payAppCode = "wechat"; //微信支付
    orderType = this.wxPayService.orderType;
    verifyResult = !!this.wxPayService.invite.inviteUserId ? 1 : 0; //验证邀请结果0：没验证，1：验证成功，2：验证失败
    initCtrl = false;
    xlyType = this.getStateService().params.xlyType;
    needPayPrice = '';
    actualPayPrice = '';
    xlyGoods = {
        selectPlan: this.getStateService().params.xlyType,
        selectPlanText:'',
        invitation: 50, //邀请减免费用
        joinFee: 299, //加入学籍费用
        planGoodsArr: [], //学籍费商品集合
        selectedXlyId: '',
        list: [ //优惠商品列表
            // {
            //     bought: false, //是否已购买
            //     discountPrice: 0, //打折价
            //     goodsId: "XN-ZD-013", //商品订单Id
            //     name: "学霸训练营一年使用期", //商品名称
            //     originalPrice: 49800, //商品原价
            //     seq: 1,
            //
            //     selected: true, //是否被选择
            //     type: 'xc', //商品分类
            //     disable: false, //商品不能选
            //
            // }
        ]
    };
    selectedGoods = [];
    selectedGoodsIds = [];
    isLoadingProcessing = true;
    checkInviteProcess = false;
    constructor() {
    }

    back() {
        if(this.xlyType){
            this.go("xly_select",{backUrl:'home.study_index'});
        }else {
            this.go("smart_training_camp");
        }
    }

    mapActionToThis() {
        let wxPayService = this.wxPayService;
        return {
            createOrder: wxPayService.createXlyOrder.bind(wxPayService),
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
        this.selectedGoods.length = 0;
        this.wxPayService.getXlyAllGoodsInfo().then((data)=> {
            if (data) {
                let list = [];

                if (this.xlyGoods.selectPlan) { //没有购买有四个商品
                    this.isVip = false;
                    _each(data.xly, (item)=> {
                        item.desc = JSON.parse(item.desc);
                        if (item.desc.type != this.xlyGoods.selectPlan) {
                            return
                        }

                        this.xlyGoods.planGoodsArr.push(item);
                        this.xlyGoods.joinFee = item.desc.joinFee;
                        //todo 国庆大礼包
                        this.xlyGoods.saleFee = item.desc.saleFee;
                        this.xlyGoods.saleMsg = item.desc.saleMsg;
                        // this.xlyGoods.saleFee = 399;
                        // this.xlyGoods.saleMsg = '双节优惠价';

                        if (item.desc.invitation) {
                            this.xlyGoods.invitation = item.desc.invitation;
                        } else {
                            this.xlyGoods.selectedXlyId = item.id;
                        }
                    });

                } else { //已购买后只有购买的一个商品
                    this.isVip = true;
                    data.xly[0].desc = JSON.parse(data.xly[0].desc);
                    this.xlyGoods.planGoodsArr.push(data.xly[0]);
                    this.xlyGoods.selectPlan = data.xly[0].desc.type;
                    this.xlyGoods.invitation = data.xly[0].desc.invitation;
                    this.xlyGoods.joinFee = data.xly[0].desc.joinFee;
                    //todo 国庆大礼包
                    this.xlyGoods.saleFee = data.xly[0].desc.saleFee;
                    this.xlyGoods.saleMsg = data.xly[0].desc.saleMsg;
                    // this.xlyGoods.saleFee = 399;
                    // this.xlyGoods.saleMsg = '双节优惠价';

                }
                this.xlyGoods.selectPlanText = this.xlyGoods.selectPlan === 'planA' ? 'A计划':'B计划';

                _each(data[this.xlyGoods.selectPlan], (goods)=> {
                    goods.selected = goods.bought;
                    goods.disable = goods.bought;
                    goods.discountPrice = +goods.discountPrice / 100;
                    goods.originalPrice = +goods.originalPrice / 100;

                    //根据商品Id分类
                    if (goods.goodsId.indexOf('ZD') != -1) { //驯宠
                        goods.type = this.finalData.XLY_GOODS_TYPE.XC
                    } else if (goods.goodsId.indexOf('AS') != -1) { //奥数
                        goods.type = this.finalData.XLY_GOODS_TYPE.AS
                    } else if (goods.goodsId.indexOf('XN-MLCG-001') != -1 || goods.goodsId.indexOf('XN-MLCG-008') != -1) { //游戏合集
                        goods.type = this.finalData.XLY_GOODS_TYPE.GLS
                    } else if (goods.goodsId.indexOf('TF') != -1) { //提分
                        goods.type = this.finalData.XLY_GOODS_TYPE.TF
                    } else { //游戏单个地图包
                        goods.type = this.finalData.XLY_GOODS_TYPE.GL
                    }

                    if(!this.isVip && this.xlyGoods.selectPlan === 'planB' && goods.goodsId.indexOf('XN-TF-001')!=-1){
                        goods.selected = true;
                        this.selectedGoods.push({
                            id:goods.goodsId,
                            price:goods.discountPrice
                        });

                    }
                    if(!this.isVip && this.xlyGoods.selectPlan === 'planA' && (goods.goodsId.indexOf('XN-ZD-015')!=-1||goods.goodsId.indexOf('XN-TF-003')!=-1)){
                        goods.selected = true;
                        this.selectedGoods.push({
                            id:goods.goodsId,
                            price:goods.discountPrice
                        });
                    }
                    list.push(goods)
                });

                let firstXC = _find(list,(item)=>{return item.goodsId === 'XN-ZD-013'});
                let secondXC = _find(list,(item)=>{return item.goodsId === 'XN-ZD-014'});
                let thirdXC = _find(list,(item)=>{return item.goodsId === 'XN-ZD-015'});
                let firstTF = _find(list,(item)=>{return item.goodsId === 'XN-TF-001'});
                let secondTF = _find(list,(item)=>{return item.goodsId === 'XN-TF-002'});
                let thirdTF = _find(list,(item)=>{return item.goodsId === 'XN-TF-003'});
                let groupMLCG = _find(list,(item)=>{return item.type === this.finalData.XLY_GOODS_TYPE.GLS});
                let singleMLCG = !!_find(list,(item)=>{return item.type === this.finalData.XLY_GOODS_TYPE.GL && !item.bought}); //还有 待购买的单个地图

                if(this.isVip){
                    if(thirdXC.bought){
                        firstXC.disable = true;
                        secondXC.disable = true;
                    }else{
                        firstXC.disable = firstXC.bought || false;
                        secondXC.disable = secondXC.bought || false;
                        thirdXC.disable = true;
                    }
                    if(thirdTF.bought){
                        firstTF.disable = true;
                        secondTF.disable = true;
                    }else{
                        firstTF.disable = firstTF.bought || false;
                        secondTF.disable = secondTF.bought || false;
                        thirdTF.disable = true;
                    }

                    if(groupMLCG.bought){
                        _each(list,(item)=>{
                            if(item.type === this.finalData.XLY_GOODS_TYPE.GL){
                                item.disable = true;
                            }
                        })
                    }
                    //所有的单个地图都被买了
                    if(!singleMLCG){
                        groupMLCG.disable = true
                    }
                }
                if(this.xlyGoods.selectPlan === 'planA'){
                    firstXC.disable = true;
                    secondXC.disable = true;
                    thirdXC.disable = true;
                    firstTF.disable = true;
                    secondTF.disable = true;
                    thirdTF.disable = true;
                }


                this.xlyGoods.list = list;
                this.handleTotalPriceStr();
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

        this.handleSelectGoodsIdsParam();
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

        if(!this.selectedGoodsIds.length){return}
        this.iscreateAppOrder = false;
        this.createOrder(this.selectedGoodsIds, this.payAppCode, "app", this.invite.inviteUserId).then(data=> {
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

        this.handleSelectGoodsIdsParam();
        this.currentOrderType = this.orderType.WX_SCAN;
        if (!this.isCreateNewOrder(this.currentOrderType)) { //订单没有超时直接调用微信支付接口
            this.showQrCode(); //显示二维码
            this.iscreateScanOrder = true;
            return;
        }
        if(!this.selectedGoodsIds.length){return}
        this.iscreateScanOrder = false;
        this.createOrder(this.selectedGoodsIds, this.payAppCode, "scan", this.invite.inviteUserId).then(data=> {
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
            || (orderInfo && orderInfo.productId && orderInfo.productId.toString() != this.selectedGoodsIds.toString())
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
            comeFrom: 'year_card_pay',
            xlyType: this.xlyType,
            urlFrom:'smart_training_camp'
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
        this.go("weixin_pay_protocol", {backUrl: 'year_card_pay', xlyType: this.xlyType});
    }

    /**
     * 添加有有效的邀请人账号，学籍费商品id切换为
     */
    checkHasInvite() {
        if (!this.isVip && this.invite.inviteUserId) {
            this.xlyGoods.selectedXlyId = this.xlyGoods.planGoodsArr[1].id
        } else {
            this.xlyGoods.selectedXlyId = this.xlyGoods.planGoodsArr[0].id
        }
    }

    handleSelectGoodsIdsParam(){
        this.checkHasInvite();
        this.selectedGoodsIds.length = 0;
        _each(this.selectedGoods,(item)=>{
            this.selectedGoodsIds.push(item.id)
        });

        if(!this.isVip){
            this.selectedGoodsIds.push(this.xlyGoods.selectedXlyId);
        }
    }

    /**
     * 校验邀请人账号是否可用
     */
    checkInvitees() {
        let regExp = new RegExp('^1\\d{10}S\\d?$', 'i');
        if (!this.invite.inviteAccount || !regExp.test(this.invite.inviteAccount)) {
            this.invite.inviteUserId = '';
            this.verifyResult = 0;
            return
        }
        //上一次验证还么有返回则不发送
        if(this.checkInviteProcess){return}

        this.checkInviteProcess = true;
        this.wxPayService.verifyTheInvitees(this.invite.inviteAccount)
            .then((res)=> {
                if (res) {
                    this.verifyResult = res.joined ? 1 : 2; //验证成功
                    if (res.userId) {
                        this.invite.inviteUserId = res.userId;
                        this.checkHasInvite();
                    } else {
                        this.invite.inviteUserId = '';
                    }
                }
                this.checkInviteProcess = false;
            }, (data)=> {
                this.commonService.showAlert('温馨提示', data.msg);
                this.checkInviteProcess = false;
            });
    }

    selectGood(item) {
        this.selectedGoods.length = 0;

        _each(this.xlyGoods.list, (goods)=> {
            //游戏地图包，购买了集合包就不购买单个包
            if (item.type === this.finalData.XLY_GOODS_TYPE.GLS
                && item.selected
                && goods.type === this.finalData.XLY_GOODS_TYPE.GL
            ) {
                goods.selected = goods.bought || false;
                this.commonService.alertDialog('已勾选合集，不需要重复购买单个地图',2500);
            }

            //当前选择的是单个游戏包，则集合包不选
            if (item.type === this.finalData.XLY_GOODS_TYPE.GL
                && item.selected
                && goods.type === this.finalData.XLY_GOODS_TYPE.GLS
            ) {
                goods.selected = goods.bought || false;
            }

            //当前选择的是一个学霸驯宠记商品，其他的年限的驯宠不勾选，三选一， 并且提分不勾选
            //当前选择的是一个提分商品，其他的年限的提分不勾选，三选一，并且驯宠不勾选
            if ((item.type === this.finalData.XLY_GOODS_TYPE.XC||item.type === this.finalData.XLY_GOODS_TYPE.TF)
                && (goods.type === this.finalData.XLY_GOODS_TYPE.XC||goods.type === this.finalData.XLY_GOODS_TYPE.TF)
                && item.selected && item.goodsId != goods.goodsId)
            {
                goods.selected = goods.bought || false;
            }



            if (goods.selected && !goods.bought) {
                this.selectedGoods.push({
                    id:goods.goodsId,
                    price:goods.discountPrice
                });
            }
        });
        this.handleTotalPriceStr();
    }

    handleTotalPriceStr(){
        if(!this.isVip){
            let price = this.xlyGoods.saleFee || this.xlyGoods.joinFee;
            this.needPayPrice = `￥${price}`;
            let totalPrice = +price;
            _each(this.selectedGoods,(item)=>{
                this.needPayPrice+=`+￥${item.price}`;
                totalPrice += +item.price;
            });
            this.needPayPrice += `=￥${totalPrice.toFixed(2)}`;

            this.actualPayPrice = this.needPayPrice.replace(/=/,`-￥${this.xlyGoods.invitation}=`);
            this.actualPayPrice = this.actualPayPrice.replace(/(\d+\.?\d+)$/,($1)=>{return $1-50});
        }else {
            this.needPayPrice = ``;
            let totalPrice = 0;
            _each(this.selectedGoods,(item,i)=>{
                this.needPayPrice+= i==0 ? `￥${item.price}`:`+￥${item.price}`;
                totalPrice += +item.price;
            });
            if(this.selectedGoods.length > 1){
                this.needPayPrice += `=￥${totalPrice.toFixed(2)}`;
            }
            if(!this.needPayPrice){
                this.needPayPrice = '￥0'
            }
        }
    }

}
// export default yearCardPayCtrl
