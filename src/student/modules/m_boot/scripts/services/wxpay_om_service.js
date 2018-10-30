/**
 * Created by ZL on 2017/3/2.
 */
import services from  './index';
import BaseService from 'base_components/base_service';
import {DIAGNOSE, PROFILE, WEIXIN_PAY} from './../redux/actiontypes/actiontypes';

class wxpayOmService extends BaseService {

    constructor() {
        super(arguments);
        this.orderType = {
            WX_APP: "app",
            WX_SCAN: "scan",
        };
        this.cancelOmGoodsMenusRequestList = []; //商品列表的请求
    }

    /**
     * 创建订单
     * @param productId 商品id
     * @param thirdPay 第三方支付，目前只有微信支付：wechat
     * @param payType 支付方式 "app"：跳转第三方直接支付，"scan"：扫码支付
     * @returns {*}
     */
    createOrder(productId, thirdPay, payType) {
        let me = this;
        return (dispatch)=> {
            var defer = me.$q.defer();
            dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_CREATE_ORDER_START});
            me.commonService.commonPost(me.serverInterface.WXPAY_ORDER_CREATE, {
                goodsId: productId,
                thirdPayCode: thirdPay,
                type: payType
            }).then(data=> {
                if (data.code == 200) {
                    dispatch({
                        type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, productId: productId}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data=> {
                dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_CREATE_ORDER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 查询订单状态
     * @param orderType 支付方式
     * @returns {*}
     */
    queryOrder(orderType) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            let orderInfo = getState().wei_xin_pay_02_created_order_info[orderType];
            //TODO 获取产品的标记名
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }

            dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_QUERY_ORDER_START});
            me.commonService.commonPost(me.serverInterface.WXPAY_ORDER_QUERY, {
                orderNo: orderInfo.orderNo
            }).then((data)=> {
                if (data.code == 200) {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_QUERY_ORDER_SUCCESS});
                    dispatch({
                        type: WEIXIN_PAY.CHANGE_WEI_XIN_PAY_02_ORDER_STATUS,
                        payload: {orderType: orderType, status: data.status}
                    });
                    /* if (data.status == 0) {
                     dispatch({type: PROFILE.USER_IS_VIP_DIAGNOSE});
                     }*/

                    if (data.status == 0) {
                        dispatch({type: PROFILE.USER_IS_VIP_MATH_OLY, payload: ""});
                    }
                    defer.resolve(data);
                } else {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_QUERY_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data=> {
                dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_QUERY_ORDER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        }
    }

    orderFreeGoods(goodsId) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            me.commonService.commonPost(me.serverInterface.ORDERFREEGOODS, {
                goodsId: goodsId
            }).then((data)=> {
                defer.resolve(data);
            }, data=> {
                defer.resolve(data);
            });
            return defer.promise;
        }
    }

    getOrderDetails(orderId) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            me.commonService.commonPost(me.serverInterface.WXPAY_ORDER_QUERY, {
                orderNo: orderId
            }).then((data)=> {
                defer.resolve(data);
            }, data=> {
                defer.resolve(data);
            });
            return defer.promise;
        }
    }


    //选择商品
    selectedGood(good, callBack) {
        callBack = callBack || angular.noop;
        return (dispatch)=> {
            dispatch({type: WEIXIN_PAY.SAVE_WEI_XIN_PAY_02_SELECT_GOODS, payload: good});
            callBack();
        };
    }

    //选择年级
    selectedGrade(grade) {
        var param = {grade: grade};
        return (dispatch)=> {
            dispatch({type: WEIXIN_PAY.SAVE_WEI_XIN_PAY_02_SELECT_GRADE, payload: param});
        };
    }

    //获取商品菜单
    fetchGoodsMenus() {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            let url = me.serverInterface.GET_GOODS_MENUS;
            let params = {category: 'XN-AS'};

            dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_GOODS_START});

            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelOmGoodsMenusRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_GOODS_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let list = [];
                    angular.forEach(data.goods, (item)=> {
                        item.desc = JSON.parse(item.desc);
                        //todo 国庆大礼包
                        // item.desc.saleFee = 100;
                        // item.desc.saleMsg = '双节5折价';

                        list.push(item);
                    });
                    dispatch({
                        type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_GOODS_SUCCESS,
                        payload: list
                    });
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_GOODS_FAIL});
            });

            return defer.promise;
        };
    }

}

wxpayOmService.$inject = ['$http', '$q', '$rootScope', 'serverInterface', 'commonService', "$ngRedux"];
services.service('wxpayOmService', wxpayOmService);



