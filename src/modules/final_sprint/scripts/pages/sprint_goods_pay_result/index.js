/**
 * Created by WL on 2017/6/29.
 */

import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'sprintGoodsPayResult',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('sprint_goods_pay_result', {
    url: '/sprint_goods_pay_result/:orderType',
    template: '<sprint-goods-pay-result></sprint-goods-pay-result>'
})

@Inject('$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', 'finalSprintService', 'commonService','wxPayService')
class sprintGoodsPayResult {
    $stateParams;
    finalSprintService;
    commonService;
    wxPayService;
    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state => state.profile_user_auth.user.vips) vips;

    orderType = this.getStateService().params.orderType;
    failTip = "支付中遇到问题，重新支付试试吧";
    isSuccessFlag = true;
    retFlag = false;

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

    queryOrderInfo() {
        this.isSuccessFlag = true;
        this.retFlag = false;
        this.finalSprintService.queryOrder(this.orderType).then(data=> {
            if (data.code != 200) {
                if (data.msg) {
                    this.commonService.showAlert('温馨提示', `<div>${data.msg}</div>`);
                }
                this.isSuccessFlag = false;
                this.paySuccessModifyVips();
                return;
            }

            if (data.status != 0) { //已支付
                this.isSuccessFlag = false;
            }
            this.retFlag = true;
        });
    }

    /**
     * 支付成功后，开始玩游戏 TODO
     */
    paySuccessStart() {

        this.go('final_sprint_home');
        // this.go(this.buyFromData.backUrl,{theme:this.buyFromData.theme,mapId:this.buyFromData.mapId});
    }

    /**
     * 支付失败后返回
     */
    payFailBack() {
        this.go("sprint_goods_weixin_pay");
    }

    back() {
        if (this.retFlag && this.isSuccessFlag) {
            this.paySuccessStart();
        } else if (this.retFlag && !this.isSuccessFlag) {
            this.payFailBack();
        } else {
            this.go('final_sprint_pay');
        }

    }

    mapActionToThis() {
        return {
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService),
        }
    }

}

export default sprintGoodsPayResult;