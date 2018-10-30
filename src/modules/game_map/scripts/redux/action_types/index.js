/**
 * Created by Administrator on 2017/5/4.
 */

//获取游戏关卡信息
export const FETCH_LEVEL_INFO_START = "FETCH_LEVEL_INFO_START";
export const FETCH_LEVEL_INFO_SUCCESS = "FETCH_LEVEL_INFO_SUCCESS";
export const FETCH_LEVEL_INFO_FAIL = "FETCH_LEVEL_INFO_FAIL";

//开启宝箱
export const OPEN_GAME_LEVEL_BOX_START = "OPEN_GAME_LEVEL_BOX_START";
export const OPEN_GAME_LEVEL_BOX_SUCCESS = "OPEN_GAME_LEVEL_BOX_SUCCESS";
export const OPEN_GAME_LEVEL_BOX_FAIL = "OPEN_GAME_LEVEL_BOX_FAIL";
export const CHANGE_GAME_LEVEL_BOX_STATUS = "CHANGE_GAME_LEVEL_BOX_STATUS";

export const GAME_GOODS_PAY = {
    FETCH_GOODS_LIST: 'FETCH_GOODS_LIST',
    FETCH_GOODS_LIST_START: 'FETCH_GOODS_LIST_START',
    FETCH_GOODS_LIST_SUCCESS: 'FETCH_GOODS_LIST_SUCCESS',
    FETCH_GOODS_LIST_FAIL: 'FETCH_GOODS_LIST_FAIL',
    SELECT_GAME_GOODS_INFO:'SELECT_GAME_GOODS_INFO',
    GAME_GOODS_CREATE_ORDER_START:'GAME_GOODS_CREATE_ORDER_START', //创建订单
    GAME_GOODS_CREATE_ORDER_SUCCESS:'GAME_GOODS_CREATE_ORDER_SUCCESS',
    GAME_GOODS_CREATE_ORDER_FAIL:'GAME_GOODS_CREATE_ORDER_FAIL',
    CHANGE_GOODS_CREATE_ORDER_STATUS:'CHANGE_GOODS_CREATE_ORDER_STATUS',
    GAME_GOODS_QUERY_ORDER_INFO_START:'GAME_GOODS_QUERY_ORDER_INFO_START', //查询订单信息
    GAME_GOODS_QUERY_ORDER_INFO_SUCCESS:'GAME_GOODS_QUERY_ORDER_INFO_SUCCESS',
    GAME_GOODS_QUERY_ORDER_INFO_FAIL:'GAME_GOODS_QUERY_ORDER_INFO_FAIL',
    UPDATE_GAME_VIP :"UPDATE_GAME_VIP",
};

//获取主界面信息
export const FETCH_GAME_MAP_SCENE_LIST_START = "FETCH_GAME_MAP_SCENE_LIST_START";
export const FETCH_GAME_MAP_SCENE_LIST_SUCCESS = "FETCH_GAME_MAP_SCENE_LIST_SUCCESS";
export const FETCH_GAME_MAP_SCENE_LIST_FAIL = "FETCH_GAME_MAP_SCENE_LIST_FAIL";

//获取图集信息
export const FETCH_GAME_MAP_ATLAS_START = "FETCH_GAME_MAP_ATLAS_START";
export const FETCH_GAME_MAP_ATLAS_SUCCESS = "FETCH_GAME_MAP_ATLAS_SUCCESS";
export const FETCH_GAME_MAP_ATLAS_FAIL = "FETCH_GAME_MAP_ATLAS_FAIL";
export const CHANGE_GAME_MAP_ATLAS = "CHANGE_GAME_MAP_ATLAS";

//游戏地图包相关的请求设置sharding clazz
export const SET_GAME_MAP_SHARDING_CLAZZ = 'SET_GAME_MAP_SHARDING_CLAZZ';