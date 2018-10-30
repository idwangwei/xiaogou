/**
 * Created by ZL on 2017/3/2.
 */

import {Inject, View, Directive, select} from '../../module';
@View('wp_good_pay_result', {
    url: '/wp_good_pay_result/:orderType/:urlFrom',
    template: require('./wp_good_pay_result.html'),
    styles: require('./wp_good_pay_result.less'),
    inject: [
        '$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , 'commonService'
        , '$ngRedux'
        , '$ionicPopup'
        , 'wxpayOmService'
        , '$ionicLoading'
    ]
})
class wpGoodPayResult{
    constructor() {
        this.initFlags();
        this.initData();
    }

    initFlags() {
        this.isSuccessFlag = true;
        this.retFlag = false;
    }

    initData() {
        this.orderType = this.$stateParams.orderType;
        this.urlFrom = this.getStateService().params.urlFrom || "home.olympic_math_home";//this.$stateParams.urlFrom;
        this.failTip = "支付中遇到问题，重新支付试试吧";
    }

    onAfterEnterView() {
        this.queryOrderInfo();
    }

    mapStateToThis(state) {
        return {};
    }

    mapActionToThis() {
        let wxpayOmService = this.wxpayOmService;
        return {
            queryOrder: wxpayOmService.queryOrder.bind(wxpayOmService),
        }
    }

    /**
     * 查询订单状态
     */
    queryOrderInfo() {
        this.isSuccessFlag = true;
        this.retFlag = false;
        this.queryOrder(this.orderType).then(data=> {
            if (data.code != 200) {
                if (data.msg) {
                    this.commonService.showAlert('温馨提示', `<div>${data.msg}</div>`);
                }
                this.isSuccessFlag = false;
                return;
            }

            if (data.status != 0) { //已支付
                this.isSuccessFlag = false;
            }
            this.retFlag = true;
        });
    }

    /**
     * 支付成功后，开启学霸之旅
     */
    paySuccessStart() {
        if (this.urlFrom == "olympic_math_work_list") {
            let param = this.workStatisticsServices.routeInfo.urlFrom;
            this.go(this.urlFrom, {urlFrom: param});
        } else {
            this.go(this.urlFrom);
        }
    }

    /**
     * 支付失败后返回
     */
    payFailBack() {
        this.go("wp_good_pay", {urlFrom: this.urlFrom});
    }

    /**
     * 返回
     */
    back() {
        if(this.retFlag&&this.isSuccessFlag){
            this.paySuccessStart();
        }else if(this.retFlag&&!this.isSuccessFlag){
            this.payFailBack();
        }else{
            this.go("wp_good_select", {urlFrom: this.urlFrom});
        }
    }


}