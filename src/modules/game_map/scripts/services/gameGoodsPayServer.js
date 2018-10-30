/**
 * Created by ZL on 2017/6/23.
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {GAME_GOODS_PAY} from './../redux/action_types';

@Inject('$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state', '$ionicBackdrop', 'gameMapInterface')
class gameGoodsPayServer {
    gameMapInterface;
    commonService;
    orderType = {
        WX_APP: "app",
        WX_SCAN: "scan",
    };

    stateParam = {};
    stateBuyFrom = {}; //从哪个页面进入的支付，以及参数
    totalTheme = 6;
    cancelGameGoodsRequestList = [];

    /**
     * 获取所有商品列表信息
     */
    @actionCreator
    getAllGoodsInfo() {
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            dispatch({type: GAME_GOODS_PAY.FETCH_GOODS_LIST_START});
            let param = {
                category: 'XN-MLCG'
            };
            this.commonService.commonPostSpecial(this.gameMapInterface.GET_GAME_GOODS_LIST, param).then((data) => {
                if (data.code === 200) {
                    let goods = data.goods;
                    let goodsList = this.analysisGoodsListInfo(goods);//TODO 解析数据
                    dispatch({type: GAME_GOODS_PAY.FETCH_GOODS_LIST_SUCCESS, payload: goodsList});
                } else {
                    dispatch({type: GAME_GOODS_PAY.FETCH_GOODS_LIST_FAIL});
                }
                defer.resolve(data);
            }, (res) => {
                dispatch({type: GAME_GOODS_PAY.FETCH_GOODS_LIST_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 解析商品列表信息
     */
    analysisGoodsListInfo(goods) {
        let goodsList = [];
        angular.forEach(goods, (v, k) => {
            let data = {};
            data.id = v.id;
            data.totalFee = v.totalFee;
            let desc = JSON.parse(v.desc);
            data = Object.assign(data, desc);
            let descDetaisArr = data.goodsDesc.split("。");
            let arr = [];
            let len = descDetaisArr.length;
            let first = "";
            for(let i=0;i<len-1;i++){
                first =first + descDetaisArr[i] + "。";
            }
            arr.push(first);
            arr.push(descDetaisArr[len-1]);
            data.goodsDesc = arr;
            //todo 国庆大礼包
            // data.saleMsg = '双节5折价';
            // data.saleFee = '200';

            goodsList.push(data);
        });
        return goodsList;
    }

    /**
     * 选中的商品信息
     * @param goodsInfo
     * @returns {function(*)}
     */
    @actionCreator
    selectGameGoods(goodsInfo) {
        return (dispatch) => {
            dispatch({type: GAME_GOODS_PAY.SELECT_GAME_GOODS_INFO, payload: goodsInfo});
        };
    }

    /**
     * 创建订单
     * @param productId 商品id
     * @param thirdPay 第三方支付，目前只有微信支付：wechat
     * @param payType 支付方式 "app"：跳转第三方直接支付，"scan"：扫码支付
     * @returns {*}
     */
    @actionCreator
    createOrder(productId, thirdPay, payType) {
        let me = this;
        return (dispatch) => {
            var defer = me.$q.defer();
            dispatch({type: GAME_GOODS_PAY.GAME_GOODS_CREATE_ORDER_START});
            me.commonService.commonPost(me.gameMapInterface.GAME_GOODS_ORDER_CREATE, {
                goodsId: productId,
                thirdPayCode: thirdPay,
                type: payType
            }).then(data => {
                if (data.code == 200) {
                    dispatch({
                        type: GAME_GOODS_PAY.GAME_GOODS_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, productId: productId}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: GAME_GOODS_PAY.GAME_GOODS_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: GAME_GOODS_PAY.GAME_GOODS_CREATE_ORDER_FAIL});
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
    @actionCreator
    queryOrder(orderType) {
        let me = this;
        return (dispatch, getState) => {
            let defer = me.$q.defer();
            let orderInfo = getState().game_goods_created_order_info[orderType];
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }

            dispatch({type: GAME_GOODS_PAY.GAME_GOODS_QUERY_ORDER_INFO_START});
            me.commonService.commonPost(me.gameMapInterface.GAME_GOODS_ORDER_QUERY, {
                orderNo: orderInfo.orderNo
            }).then((data) => {
                if (data.code == 200) {
                    dispatch({type: GAME_GOODS_PAY.GAME_GOODS_QUERY_ORDER_INFO_SUCCESS});
                    dispatch({
                        type: GAME_GOODS_PAY.CHANGE_GOODS_CREATE_ORDER_STATUS,
                        payload: {orderType: orderType, status: data.status}
                    });
                    if (data.status == 0) {
                        this.getMlcgVipData(orderType);
                    }
                    defer.resolve(data);
                } else {
                    dispatch({type: GAME_GOODS_PAY.GAME_GOODS_QUERY_ORDER_INFO_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: GAME_GOODS_PAY.GAME_GOODS_QUERY_ORDER_INFO_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        }
    }

    @actionCreator
    getMlcgVipData(orderType) {
        return (dispatch, getState) => {
            let state = getState();
            let orderInfo = state.game_goods_created_order_info[orderType];
            let mlcg = this.getCurrentMlcg(orderInfo.productId);
            if (mlcg.length > 1) { //选的是大礼包
                dispatch({type: GAME_GOODS_PAY.UPDATE_GAME_VIP, data: mlcg});
                return;
            }
            let vipInfo = state.profile_user_auth.user.vips;
            let mlcgGotVip = [];
            if (!vipInfo) {
                dispatch({type: GAME_GOODS_PAY.UPDATE_GAME_VIP, data: mlcg});
                return;
            }
            if (vipInfo) {
                let hasMlcg = -1;
                angular.forEach(vipInfo, (v, k) => {
                    if (vipInfo[k].hasOwnProperty("mlcg")) hasMlcg = k;
                });
                if (hasMlcg === -1) {
                    dispatch({type: GAME_GOODS_PAY.UPDATE_GAME_VIP, data: mlcg});
                    return;
                }
                mlcgGotVip = vipInfo[hasMlcg].mlcg;
            }
            mlcg = this.uniqueMyArr(mlcg.concat(mlcgGotVip));
            dispatch({type: GAME_GOODS_PAY.UPDATE_GAME_VIP, data: mlcg});
        };
    }

    getCurrentMlcg(orderId) {
        let arr = orderId.split("-");
        let id = parseInt(arr[arr.length - 1]);
        let rtn = [];
        if (id != 1) {
            rtn.push(--id);
        } else {
            for (let i = 1; i <= this.totalTheme; i++) {
                rtn.push(i);
            }
        }

        return rtn;
    }

    uniqueMyArr(arr) {
        let res = [];
        let json = {};
        for (let i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    }

    /**
     * 判断是否已经支付
     * @param vipInfo
     * @param currentPageIndex 0表示大礼包，1表示天空之城
     * @returns {boolean}
     */
    hasBuyTheGame(vipInfo,currentPageIndex) {
        let flag = false;
        if(!vipInfo) return flag;
        let hasMlcg = -1;
        angular.forEach(vipInfo,(v,k)=>{
            if(vipInfo[k].hasOwnProperty("mlcg")) hasMlcg = k;
        });
        if(hasMlcg===-1) {
            return flag;
        }
        let mlcgGotVip = vipInfo[hasMlcg];
        if(!mlcgGotVip.mlcg) return flag;
        if(currentPageIndex == 0 && mlcgGotVip.mlcg.length == this.totalTheme){
            flag = true;
        }else{
            if(mlcgGotVip.mlcg.indexOf(currentPageIndex)!=-1){
                flag = true;
            }
        }
        return flag;
    }
}


export default gameGoodsPayServer;