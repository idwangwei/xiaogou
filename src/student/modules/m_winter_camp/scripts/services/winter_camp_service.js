/**
 * Created by ZL on 2018/1/30.
 */
import {Inject, actionCreator} from '../module';
import * as WINTER_CAMP from './../redux/action_types';

@Inject('$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state', '$ionicBackdrop', 'winterCampInterface', 'finalData')
class winter_camp_service {
    winterCampInterface;
    finalData;
    commonService;
    orderType = {
        WX_APP: "app",
        WX_SCAN: "scan",
    };
    /**
     * 修改当日签到状态
     */
    /*@actionCreator
     changeSignInDate(dispatch) {
     return (dispatch)=> {
     dispatch({type: REWARD.CHANGE_SIGN_IN_DATE});
     }
     }*/

    /**
     * 修改选择的教材版本
     * @returns {function(*, *)}
     */
    @actionCreator
    changeTextBook(textBook) {
        return (dispatch, getState)=> {
            dispatch({type: WINTER_CAMP.WINTER_CAMP.WINTER_CAMP_SELECTED_TEXTBOOK, payload: textBook})

        }

    }

    /**
     * 修改选择的年级
     * @returns {function(*, *)}
     */
    @actionCreator
    changeGrade(grade) {
        return (dispatch, getState)=> {
            dispatch({type: WINTER_CAMP.WINTER_CAMP.WINTER_CAMP_SELECTED_GRADE, payload: grade});
            dispatch({type: WINTER_CAMP.WINTER_CAMP.CHANGE_WINTER_CAMP_SELECTED_GRADE_FLAG, payload: {selectFlag:true}})
        }
    }

    /**
     * 保存是否分享的记录
     */
    @actionCreator
    saveShareRecord() {
        return (dispatch, getState)=> {
            dispatch({type: WINTER_CAMP.WINTER_CAMP.CHANGE_WINTER_CAMP_SHARE_RECORD})
        }
    }

    /**
     * 获取游戏列表
     * @param loadMore
     * @param loadMoreCallback
     * @returns {function(*, *)}
     */
    @actionCreator
    fetchGameList(selectedClazz, loadMoreCallback) {
        loadMoreCallback = loadMoreCallback || angular.noop;
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let state = getState();
            let clzId = selectedClazz.id;
            /*  let params = {
             clzId: clzId,
             subject: 1,
             category: this.winterCampInterface.CATEGORY,
             page: JSON.stringify({"seq": 0, "needDataNum": 20})//TODO 暂时使用,新接口应该不会用这个参数
             };*/
            //TODO 测试数据
            let params = {
                clzId: 610286,
                subject: 1,
                category: this.winterCampInterface.CATEGORY,
                page: JSON.stringify({"seq": 0, "needDataNum": 20})//TODO 暂时使用,新接口应该不会用这个参数
            };
            dispatch({type: WINTER_CAMP.WINTER_CAMP_GAME.FETCH_WINTER_CAMP_GAME_LIST_START});
            let postInfo = this.commonService.commonPost(this.winterCampInterface.GET_GAME_DATA, params, true);
            postInfo.requestPromise.then((data) => {
                if (data.code != 200) {
                    dispatch({type: WINTER_CAMP.WINTER_CAMP_GAME.FETCH_WINTER_CAMP_GAME_LIST_FAIL});
                    return defer.resolve(false);
                }
                var gameList = [];
                if (data && data.gameGrades.games) {
                    angular.forEach(data.gameGrades.games, function (game) {
                        var levelNumArr = game.levels;

                        //显示游戏的知识点名称
                        if (angular.isArray(levelNumArr) && levelNumArr.length > 0) {
                            game.showName = levelNumArr[0].kdName;
                        }
                        else {
                            game.showName = game.name;
                        }

                        gameList.push(game);
                    });
                    dispatch({
                        type: WINTER_CAMP.WINTER_CAMP_GAME.FETCH_WINTER_CAMP_GAME_LIST_SUCCESS,
                        payload: gameList
                    });
                    loadMoreCallback(true);
                } else {
                    dispatch({
                        type: WINTER_CAMP.WINTER_CAMP_GAME.FETCH_WINTER_CAMP_GAME_LIST_SUCCESS,
                        payload: gameList
                    });
                    loadMoreCallback(true);
                }
                defer.resolve(true);

            }, (res)=> {
                loadMoreCallback(true);
                defer.reject(res);
            });
            return defer.promise;
        }
    };

    getGameNum(gameGuid) {
        if (gameGuid == "aa1" || gameGuid == "aa2" || gameGuid == "aa3" || gameGuid == "aa4") {
            return 11;
        }

        var reg = new RegExp(gameGuid + "([^\\d]|$)");
        for (var key in this.finalData.GAME_NUM) {
            for (var i = 0; i < this.finalData.GAME_NUM[key].length; i++) {
                if (this.finalData.GAME_NUM[key][i].match(reg)) {
                    return +key;
                }
            }
        }
        console.log("没有找到" + gameGuid);
    }


    @actionCreator
    fetchWinterCampVipGoods(currentSelectId) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.FETCH_VIP_GOODS_LIST_START});
            this.commonService.commonPostSpecial(this.winterCampInterface.GET_WINTER_CAMP_VIP_GOODS_LIST, {category: 'XN-XZT'})
                .then((data)=> {
                    if (data && data.code == 200 && data.goods) {
                        let goodsList = [];
                        angular.forEach(data.goods, (v, k)=> {
                            let desc = JSON.parse(v.desc);
                            goodsList.push({
                                goodsDesc: desc.goodsDesc.split(/\n/) || [],
                                title: desc.title,
                                id: v.id,
                                totalFee: v.totalFee,
                                fee: Math.floor(+v.totalFee / 100),
                                selected: currentSelectId && currentSelectId == v.id,
                                hasBought: false,
                                promoteBeforeMarkPrice :desc.promoteBeforeMarkPrice,
                                discountPercent: desc.discountPercent,
                                discountURLImage : desc.discountURLImage
                            })
                        });
                        dispatch({
                            type: WINTER_CAMP.WINTER_CAMP_VIP.FETCH_VIP_GOODS_LIST_SUCCESS,
                            payload: goodsList
                        });
                        defer.resolve(true);
                    } else {
                        dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.FETCH_VIP_GOODS_LIST_FAIL});
                    }
                    defer.resolve(false);
                }, ()=> {
                    defer.resolve(false);
                    dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.FETCH_VIP_GOODS_LIST_FAIL});
                });
            return defer.promise;
        }
    }

    /**
     * 选择付费商品
     * @param goods
     */
    @actionCreator
    selectVipGoods(goods) {
        return (dispatch) => {
            dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.CHANGE_WINTER_CAMP_VIP_SELECT_GOODS, payload: goods});
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
        return (dispatch) => {
            var defer = this.$q.defer();
            dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.WINTER_CAMP_GOODS_CREATE_ORDER_START});
            this.commonService.commonPost(this.winterCampInterface.CREATE_WINTER_CAMP_GOODS_ORDER, {
                goodsId: productId,
                thirdPayCode: thirdPay,
                type: payType
            }).then(data => {
                if (data.code == 200) {
                    dispatch({
                        type: WINTER_CAMP.WINTER_CAMP_VIP.WINTER_CAMP_GOODS_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, productId: productId}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.WINTER_CAMP_GOODS_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.WINTER_CAMP_GOODS_CREATE_ORDER_FAIL});
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
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            let orderInfo = getState().winter_camp_vip.created_order_info[orderType];
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }

            dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.WINTER_CAMP_GOODS_QUERY_ORDER_INFO_START});
            this.commonService.commonPost(this.winterCampInterface.WINTER_CAMP_GOODS_ORDER_QUERY, {
                orderNo: orderInfo.orderNo
            })
                .then((data) => {
                    if (data.code == 200) {
                        dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.WINTER_CAMP_GOODS_QUERY_ORDER_INFO_SUCCESS});
                        dispatch({
                            type: WINTER_CAMP.WINTER_CAMP_VIP.CHANGE_WINTER_CAMP_GOODS_CREATE_ORDER_STATUS,
                            payload: {orderType: orderType, status: data.status}
                        });
                        defer.resolve(data);
                    } else {
                        dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.WINTER_CAMP_GOODS_QUERY_ORDER_INFO_FAIL});
                        defer.resolve(data);
                    }
                }, data => {
                    dispatch({type: WINTER_CAMP.WINTER_CAMP_VIP.WINTER_CAMP_GOODS_QUERY_ORDER_INFO_FAIL});
                    defer.reject(data);
                });
            return defer.promise;
        }
    }

    /**
     * 获取所有的课程
     */
    @actionCreator
    getWinterCampAllClass(textbook, grade) {
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            let param = {
                grade: grade,
                textbook: textbook
            };
            dispatch({type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_ALL_COURSES_START});
            this.commonService.commonPost(this.winterCampInterface.WINTER_CAMP_GET_CLASS_LIST, param)
                .then((data)=> {
                    if (data && data.code == 200) {
                        dispatch({
                            type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_ALL_COURSES_SUCCESS,
                            payload: data.result
                        });
                        defer.resolve(true);
                    } else {
                        dispatch({type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_ALL_COURSES_FAIL});
                        defer.resolve(false);
                    }
                }, data => {
                    dispatch({type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_ALL_COURSES_FAIL});
                    defer.resolve(false);
                });
            return defer.promise;
        }
    }

    getAdShowFlag() {
        return this.$ngRedux.getState().show_winter_camp_ad;
    }

    @actionCreator
    changeAdShowFlag() {
        return (dispatch)=> {
            dispatch({type: WINTER_CAMP.WINTER_CAMP.CHANGE_AD_SHOW_FLAG})
        }
    }

    /**
     * 获取课时详情
     */
    @actionCreator
    getWinterCampClassDetail(comboClassId, shardingId, courseMarkId) {
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            let param = {
                comboClassId: comboClassId,
                shardingId: shardingId
            };
            let currentTextbook = getState().winter_camp_selected_textbook || {};
            let currentGrade = getState().winter_camp_selected_grade || {};
            let lastDateObj = getState().study_course_count[currentTextbook.id + '_' + currentGrade.num] || {};
            let lastDate = lastDateObj.dayTime || '2018/1/1';
            let currentDateObj = new Date();
            let currentDate = currentDateObj.getFullYear() + '/' + (currentDateObj.getMonth() + 1) + '/' + currentDateObj.getDate();

            dispatch({type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_CURRENT_COURSE_INFO_START});
            this.commonService.commonPost(this.winterCampInterface.WINTER_CAMP_GET_CLASS_DETAIL, param)
                .then((data)=> {
                    let courseInfo = {};
                    if (data /*&& data.code == 200*/) {
                        courseInfo.paper = data.paper;
                        courseInfo.oralCalculationPaper = data.oralCalculationPaper;
                        courseInfo.games = data.games;
                        courseInfo.reward = {
                            award: data.award,
                            finish: Number(data.finish),
                            totalStep: Number(data.totalStep)
                        };
                        courseInfo.knowledge = {
                            knowledgeCount: Number(data.knowledgeCount),
                            knowledgeMaster: Number(data.knowledgeMaster)
                        };
                        courseInfo.open = data.open;
                        if (lastDate != currentDate) {
                            dispatch({
                                type: WINTER_CAMP.WINTER_CAMP.CHANGE_STUDY_COURSE_COUNT,
                                payload: {courseMarkId: courseMarkId, comboClassId: comboClassId, todayFlag: true}
                            });
                        }
                        dispatch({
                            type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_CURRENT_COURSE_INFO_SUCCESS,
                            payload: courseInfo
                        });
                        defer.resolve(true);
                    } else {
                        dispatch({type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_CURRENT_COURSE_INFO_FAIL});
                        defer.resolve(false);
                    }
                }, data => {
                    dispatch({type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_CURRENT_COURSE_INFO_FAIL});
                    defer.resolve(false);
                });
            return defer.promise;
        }
    }

    /**
     * 选择课程
     * @param clazz
     */
    @actionCreator
    selectWinterCampCourse(clazz) {
        return (dispatch, getState)=> {
            dispatch({
                type: WINTER_CAMP.WINTER_CAMP.SELECT_WINTER_CAMP_COURSE,
                payload: clazz
            });
        }
    }

    /**
     * 修改sharding
     * @param clazz
     * @returns {function(*, *)}
     */
    @actionCreator
    setShardingClazz(clazz) {
        return (dispatch, getState)=> {
            dispatch({type: 'WORK_LIST_CHANGE_CLAZZ', payload: clazz});
        }
    }

    /**
     * 設置diagnose_selected_clazz
     */
    @actionCreator
    setDiagnoseSelectedClazz(data) {
        return (dispatch) => {
            dispatch({type: "DIAGNOSE_CHANGE_CLAZZ", payload: data});
        };
    }

    /**
     * 清空wl_clazz_list_with_works
     */
    @actionCreator
    setWorkList(data) {
        return (dispatch) => {
            dispatch({
                type: "FETCH_WORK_LIST_SUCCESS",
                payload: data
            });
        };
    }

    gameAppendShardingId(gameClazzId) {
        let gameSessionID;
        let shardingIndex = this.getRootScope().sessionID.indexOf(this.finalData.GAME_SHARDING_SPILT);
        if (shardingIndex > -1)
            gameSessionID = this.getRootScope().sessionID.substring(0, shardingIndex) + this.finalData.GAME_SHARDING_SPILT + gameClazzId;
        else
            gameSessionID = this.getRootScope().sessionID + this.finalData.GAME_SHARDING_SPILT + gameClazzId;

        console.log('gameSessionID!!!!!', gameSessionID);
        return gameSessionID;
    }

    /**
     * 开始vip功能，消耗钥匙
     */
    openWinterCampResource(resourceId) {
        let defer = this.$q.defer();
        let param = {
            type: 'comboClassKey',
            resourceId: resourceId
        };
        // dispatch({type: WINTER_CAMP.WINTER_CAMP.FETCH_WINTER_CAMP_CURRENT_COURSE_INFO_START});
        this.commonService.commonPost(this.winterCampInterface.OPEN_RESOURCE, param)
            .then((data)=> {
                if (data && data.code == 200) {
                    defer.resolve(true);
                } else {
                    defer.resolve(false);
                }
            }, (data) => {
                defer.resolve(false);
            });
        return defer.promise;
    }

    getWinterCampReward(comboClassId) {
        //WINTER_CAMP_GET_AWARD
        let param = {
            comboClassId: comboClassId
        };
        let defer = this.$q.defer();
        this.commonService.commonPost(this.winterCampInterface.WINTER_CAMP_GET_AWARD, param)
            .then((data)=> {
                if (data && data.code == 200) {
                    defer.resolve(true);
                } else {
                    defer.resolve(false);
                }
            }, (data) => {
                defer.resolve(false);
            });
        return defer.promise;
    }

    /**
     * 获取知识点信息
     * @param param
     * @returns {*}
     */
    fetchKnowledgeInfo(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.winterCampInterface.GET_KNOWLEDGE_INFO, param, true);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data.knowledgeUnit);
            }
            else {
                defer.resolve(false);
            }
        }, ()=> {
            request = null;
            defer.reject();
        });
        return defer.promise;
    };

    /**
     * 修改当前课时选择信息
     */
    @actionCreator
    changeStudyCourseCount(courseMarkId, todayFlag) {
        return (dispatch, getState)=> {
            dispatch({
                type: WINTER_CAMP.WINTER_CAMP.CHANGE_STUDY_COURSE_COUNT_STATUS,
                payload: {courseMarkId: courseMarkId, todayFlag: todayFlag}
            })

        }
    }
}


export default winter_camp_service;