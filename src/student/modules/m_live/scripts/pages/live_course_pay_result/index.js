/**
 * Created by WL on 2017/6/29.
 */

import {Inject, View, Directive, select} from '../../module';

@View('live_course_pay_result', {
    url: '/live_course_pay_result/:orderType',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        'commonService',
        'wxPayService',
        '$ionicHistory',
        "liveService"
    ]
})

class sprintGoodsPayResult {
    $stateParams;
    liveService;
    commonService;
    wxPayService;
    $ionicHistory
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
        this.liveService.queryOrder(this.orderType).then(data=> {
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
        this.$ionicHistory.goBack(-2);
        // this.go('final_sprint_home');
        // this.go(this.buyFromData.backUrl,{theme:this.buyFromData.theme,mapId:this.buyFromData.mapId});
    }

    /**
     * 支付失败后返回
     */
    payFailBack() {
        // this.go("sprint_goods_weixin_pay");
        this.$ionicHistory.goBack();
    }

    back() {
        if (this.retFlag && this.isSuccessFlag) {
            this.paySuccessStart();
        } else if (this.retFlag && !this.isSuccessFlag) {
            this.payFailBack();
        } else {
            this.$ionicHistory.goBack();
        }

    }

    mapActionToThis() {
        return {
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService),
        }
    }

}

export default sprintGoodsPayResult;