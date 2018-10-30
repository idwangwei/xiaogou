/**
 * Created by WangLu on 2016/11/10.
 */
const comeFromXly = 'year_card_pay';
import {Inject, View, Directive, select} from '../../module';

@View('weixin_pay_result', {
    url: '/weixin_pay_result/:orderType/:urlFrom/:backWorkReportUrl/:comeFrom/:xlyType',
    styles: require('./weixin_pay_result.less'),
    template: require('./weixin_pay_result.html'),
    inject: ['$scope'
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
class WeixinPayResult {
    constructor(){
        this.initFlags();
        this.initData();
    }
    initFlags() {
        this.isSuccessFlag = true;
        this.retFlag = false;
    }

    initData() {
        this.orderType = this.$stateParams.orderType;
        this.urlFrom = this.getStateService().params.urlFrom || "home.diagnose02";//this.$stateParams.urlFrom;
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
        this.failTip = "支付中遇到问题，重新支付试试吧";
        this.comeFrom = this.getStateService().params.comeFrom;
        this.isCheckIncreaseScoreOrder = this.urlFrom == 'increase_score_goods_select';
    }

    onAfterEnterView() {
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
        this.queryOrderInfo();
    }

    mapStateToThis(state) {
        return {};
    }

    mapActionToThis() {
        let wxPayService = this.wxPayService;
        return {
            queryOrder: wxPayService.queryOrder.bind(wxPayService),
            xlyQueryOrder: wxPayService.xlyQueryOrder.bind(wxPayService),
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService),
        }
    }

    /**
     * 查询订单状态
     */
    queryOrderInfo() {
        this.isSuccessFlag = true;
        this.retFlag = false;
        let promise;
        if (this.comeFrom === comeFromXly) { //查询训练营的订单
            promise = this.xlyQueryOrder(this.orderType);
        } else {
            promise = this.queryOrder(this.orderType)
        }

        promise.then(data=> {
            this.retFlag = true;
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
        }, ()=> {
            this.retFlag = false;
            this.isSuccessFlag = false;
        });
    }

    /**
     * 支付成功后，开启学霸之旅
     */
    paySuccessStart() {
        if (this.isCheckIncreaseScoreOrder) {
            this.go('home.diagnose02', {isIncreaseScore: true, isIncreaseScorePaySuccess: true});
            return;
        }
        this.go(this.urlFrom, {backWorkReportUrl: this.backWorkReportUrl});

    }

    /**
     * 支付失败后返回
     */
    payFailBack() {
        // if (this.urlFrom == 'increase_score_goods_select') {
        //     this.$ionicHistory.goBack(-1);
        //     return;
        // }
        if (this.comeFrom === comeFromXly) {
            this.go(comeFromXly, {xlyType: this.getStateService().params.xlyType});
            return
        }
        if (this.isCheckIncreaseScoreOrder) {
            this.go(this.urlFrom, {backWorkReportUrl: this.backWorkReportUrl});
            return
        }
        // this.go("weixin_pay", {urlFrom: this.urlFrom, backWorkReportUrl: this.backWorkReportUrl});
        this.$ionicHistory.goBack(-1);
    }

    back() {
        if (this.retFlag && this.isSuccessFlag) {
            this.paySuccessStart();
        } else if (this.retFlag && !this.isSuccessFlag) {
            this.payFailBack();
        } else {
            this.payFailBack();
        }
    }
}
