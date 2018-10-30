/**
 * Created by WL on 2017/6/29.
 */

import {Inject, View, Directive, select} from '../../module';


@View('game_goods_pay_result', {
    url: '/game_goods_pay_result/:orderType',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope', '$state', '$rootScope', '$stateParams', '$ngRedux',  'gameGoodsPayServer','commonService','wxPayService'
    ]
})

class GameGoodsPayResult {
    $stateParams;
    gameGoodsPayServer;
    commonService;
    wxPayService;
    @select(state => state.game_map_atlas_info.atlas1) avatorList;

    orderType = this.$stateParams.orderType;
    failTip = "支付中遇到问题，重新支付试试吧";
    paramData = this.gameGoodsPayServer.stateParam;
    buyFromData = this.gameGoodsPayServer.stateBuyFrom;

    constructor() {
    }


    initFlags() {
        this.initCtrl = false;
        this.isSuccessFlag = true;
        this.retFlag = false;
    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;
            })
    }


    onBeforeEnterView() {

    }

    onAfterEnterView() {
      this.queryOrderInfo();
    }

    queryOrderInfo(){
        this.isSuccessFlag = true;
        this.retFlag = false;
        this.gameGoodsPayServer.queryOrder(this.orderType).then(data=> {
            if (data.code != 200) {
                if (data.msg) {
                    this.commonService.showAlert('温馨提示', `<div>${data.msg}</div>`);
                }
                this.isSuccessFlag = false;
                return;
            }
            this.paySuccessModifyVips();
            if (data.status != 0) { //已支付
                this.isSuccessFlag = false;
            }
            this.retFlag = true;
        });
    }

    /**
     * 支付成功后，开始玩游戏
     */
    paySuccessStart() {
       this.go(this.buyFromData.backUrl,{theme:this.buyFromData.theme,mapId:this.buyFromData.mapId});
    }

    /**
     * 支付失败后返回
     */
    payFailBack() {
        this.go("game_goods_pay", {backUrl:'game_goods_pay_result'});
    }

    loadMyImg(url){
        return require("./../../../game_map_images/gameGoodsPay/"+url);
    }

    back(){
        if(this.retFlag&&this.isSuccessFlag){
            this.paySuccessStart();
        }else if(this.retFlag&&!this.isSuccessFlag){
            this.payFailBack();
        }else{
            this.go('game_goods_pay');
        }

    }
    mapActionToThis() {
        return {
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService),
        }
    }

}

export default GameGoodsPayResult;