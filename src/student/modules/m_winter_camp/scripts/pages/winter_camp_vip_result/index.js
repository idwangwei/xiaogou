/**
 * Created by WL on 2017/6/29.
 */

import {Inject, View, Directive, select} from '../../module';

@View('winter_camp_vip_result', {
    url: '/winter_camp_vip_result/:orderType',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: [
        '$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        'winterCampService',
        'commonService',
        'wxPayService'
    ]
})

class WinterCampVipResult {
    $stateParams;
    winterCampService;
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
        this.winterCampService.queryOrder(this.orderType).then(data=> {
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
     * 支付成功后，开始玩游戏 TODO
     */
    paySuccessStart() {

        this.go('home.winter_camp_home');
    }

    /**
     * 支付失败后返回
     */
    payFailBack() {
        this.go("winter_camp_vip_pay");
    }

    back() {
        if (this.retFlag && this.isSuccessFlag) {
            this.paySuccessStart();
        } else if (this.retFlag && !this.isSuccessFlag) {
            this.payFailBack();
        } else {
            this.go('winter_camp_vip_pay');
        }

    }

    mapActionToThis() {
        return {
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService),
        }
    }

}

export default WinterCampVipResult;