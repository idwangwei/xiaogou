/**
 * Created by ZL on 2017/2/17.
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';

class groupBuyingResult extends BaseController {
    constructor() {
        super(arguments);
    }

    initFlags() {
        this.isSuccessFlag = true;
        this.retFlag = false;
    }

    initData() {
        this.orderType = this.getStateService().params.orderType;
        this.urlFrom = this.getStateService().params.urlFrom || "home.diagnose02";//this.$stateParams.urlFrom;
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
        this.failTip = "支付中遇到问题，重新支付试试吧";
        this.leader = null;
        this.memberList = null;
    }

    onAfterEnterView() {
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
        this.queryOrderInfo();
    }

    onReceiveProps() {
        this.queryPayUserList();
    }

    mapStateToThis(state) {
        return {
            resultList: state.group_buying_selected_good.payload.payDetails,
        };
    }

    mapActionToThis() {
        let wxPayService = this.wxPayService;
        return {
            queryGroupOrder: wxPayService.queryGroupBuyingOrder.bind(wxPayService),
        }
    }

    /**
     * 查询订单状态
     */
    queryOrderInfo() {
        this.isSuccessFlag = true;
        this.retFlag = false;
        this.queryGroupOrder(this.orderType).then(data=> {
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
     * 查询支付用户列表 TODO
     */
    queryPayUserList() {
        if (this.resultList && this.resultList.length > 0) {
            this.leader = this.resultList[0] || {};
            this.memberList = this.resultList.slice(1) || [];
        }
    }

    /**
     * 支付成功后，开启学霸之旅
     */
    paySuccessStart() {
        this.go(this.urlFrom,{backWorkReportUrl:this.backWorkReportUrl});
    }

    /**
     * 支付失败后返回
     */
    payFailBack() {
        this.go('group_buying_create', 'forward', {urlFrom: this.urlFrom,backWorkReportUrl:this.backWorkReportUrl});
    }

    //返回
    back() {
        this.go('group_buying_create', 'forward', {urlFrom: this.urlFrom,backWorkReportUrl:this.backWorkReportUrl});
    }


}
groupBuyingResult.$inject = [
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
controllers.controller("groupBuyingResult", groupBuyingResult);