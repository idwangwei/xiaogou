/**
 * Created by ZL on 2017/1/18.
 */
import {Inject, View, Directive, select} from '../../module';
@View('weixin_pay_detail', {
    url: '/weixin_pay_detail',
    template: require('./weixin_pay_detail.html'),
    styles: require('./weixin_pay_detail.less'),
    inject: ['$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , 'commonService'
        , '$ngRedux'
        , '$ionicPopup'
        , 'wxPayService'
        , '$ionicLoading'
        , '$timeout'
        , '$ionicHistory'
        , '$ocLazyLoad']
})
class weixinPayDetail {
    @select(state=>state.wxpay_detail_list) payDetailList;
    initData() {
        this.isGetList = false;
        this.initCtrl = false;
    }

    getOrderDetail(item) {
        let promise;
        if (item.queryType == 'xlyOrderQuery') {
            promise = this.getXLYOrderDetails(item.id)
        } else if (item.payType == 'groupBuyingOrderQuery') {
            promise = this.getGroupBuyingOrderDetails(item.id)
        } else {
            promise = this.getOrderDetailServer(item.id)
        }
        promise.then((data)=> {
            if (data && data.code == 200) {
                if (item.status != 0 && item.status != data.status) {
                    item.description = data.msg;
                }
                if (item.status == 0 && item.status != data.status) {
                    this.paySuccessModifyVips();
                }
            }
        });
    }

    onBeforeLeaveView() {
    }


    onReceiveProps() {

    }

    onAfterEnterView() {
        this.initData();
        this.ensurePageData();
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.paySuccessModifyVips();
            this.getPayDetail().then((data)=> {
                if (data.code == 200) {
                    if (!this.payDetailList || this.payDetailList && this.payDetailList.list.length == 0) {
                        this.isGetList = true;
                    }
                }
            });
        }
    }

    /*mapStateToThis(state) {
     return {
     payDetailList: state.wxpay_detail_list
     };
     }*/

    mapActionToThis() {
        return {
            getPayDetail: this.wxPayService.getPayDetail.bind(this.wxPayService),
            getOrderDetailServer: this.wxPayService.getOrderDetails.bind(this.wxPayService),
            getGroupBuyingOrderDetails: this.wxPayService.getGroupOrderDetails.bind(this.wxPayService),
            getXLYOrderDetails: this.wxPayService.getXLYOrderDetails.bind(this.wxPayService),
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService),
        }
    }

    back() {
        this.go('home.me')
    }
}
