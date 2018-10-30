/**
 * Created by Administrator on 2017/5/4.
 */

export let game_goods_list = [ //商品列表

];
export let fetch_goods_list_processing = false;
export let game_map_level_info={
    levelsWithoutFirst:[],
    firstLevel:{
        id: 'id'+1,
        star: 2,
        desc: '第一关',
        levelNum: 1,
        hasInsertBox: false,
        boxOpen:undefined,
        boxId:undefined,
        canPlay: true,
        bgImgIndex: undefined
    },
    currentStuLevel:7,
    passBox:{}
};
export let open_game_level_box_processing = false;

export let select_game_goods = {}; //选中的商品
export let fetch_game_goods_create_order_processing = false; //创建订单状态
export let query_game_goods_order_processing = false; //查询订单的状态
export let game_goods_created_order_info = { //订单信息
    app:{}, //微信支付
    scan:{} //微信扫码支付信息
};



export let game_map_scene_list = [];
export let game_map_scene_list_processing = false;

export let game_map_atlas_info = {
    atlas1: [
        {
            avatorId: '1_1',
            light: false
        }, {
            avatorId: '1_2',
            light: false
        }, {
            avatorId: '1_3',
            light: false
        }, {
            avatorId: '1_4',
            light: false
        }, {
            avatorId: '1_5',
            light: false
        }, {
            avatorId: '1_6',
            light: false
        }, {
            avatorId: '1_7',
            light: false
        }, {
            avatorId: '1_8',
            light: false
        }, {
            avatorId: '1_9',
            light: false
        }, {
            avatorId: '1_10',
            light: false
        }, {
            avatorId: '1_11',
            light: false
        }, {
            avatorId: '1_12',
            light: false
        }, {
            avatorId: '1_13',
            light: false
        }],
    atlas2: [
        {
            avatorId: '2_1',
            light: false
        }, {
            avatorId: '2_2',
            light: false
        }, {
            avatorId: '2_3',
            light: false
        }, {
            avatorId: '2_4',
            light: false
        }, {
            avatorId: '2_5',
            light: false
        }, {
            avatorId: '2_6',
            light: false
        }, {
            avatorId: '2_7',
            light: false
        }, {
            avatorId: '2_8',
            light: false
        }, {
            avatorId: '2_9',
            light: false
        }, {
            avatorId: '2_10',
            light: false
        }],
    atlas3: [
        {
            avatorId: '3_1',
            light: false
        }, {
            avatorId: '3_2',
            light: false
        }, {
            avatorId: '3_3',
            light: false
        }, {
            avatorId: '3_4',
            light: false
        }, {
            avatorId: '3_5',
            light: false
        }, {
            avatorId: '3_6',
            light: false
        }, {
            avatorId: '3_7',
            light: false
        }, {
            avatorId: '3_8',
            light: false
        }, {
            avatorId: '3_9',
            light: false
        }, {
            avatorId: '3_10',
            light: false
        }, {
            avatorId: '3_11',
            light: false
        }, {
            avatorId: '3_12',
            light: false
        }, {
            avatorId: '3_13',
            light: false
        }, {
            avatorId: '3_14',
            light: false
        }, {
            avatorId: '3_15',
            light: false
        }],
    atlas4: [
        {
            avatorId: '4_1',
            light: false
        }, {
            avatorId: '4_2',
            light: false
        }, {
            avatorId: '4_3',
            light: false
        }, {
            avatorId: '4_4',
            light: false
        }, {
            avatorId: '4_5',
            light: false
        }, {
            avatorId: '4_6',
            light: false
        }, {
            avatorId: '4_7',
            light: false
        }, {
            avatorId: '4_8',
            light: false
        }, {
            avatorId: '4_9',
            light: false
        }, {
            avatorId: '4_10',
            light: false
        }, {
            avatorId: '4_11',
            light: false
        }],
    atlas5: [
        {
            avatorId: '5_1',
            light: false
        }, {
            avatorId: '5_2',
            light: false
        }, {
            avatorId: '5_3',
            light: false
        }, {
            avatorId: '5_4',
            light: false
        }, {
            avatorId: '5_5',
            light: false
        }, {
            avatorId: '5_6',
            light: false
        }, {
            avatorId: '5_7',
            light: false
        }, {
            avatorId: '5_8',
            light: false
        }, {
            avatorId: '5_9',
            light: false
        }, {
            avatorId: '5_10',
            light: false
        }, {
            avatorId: '5_11',
            light: false
        }, {
            avatorId: '5_12',
            light: false
        }],
    atlas6: [
        {
            avatorId: '6_1',
            light: false
        }, {
            avatorId: '6_2',
            light: false
        }, {
            avatorId: '6_3',
            light: false
        }, {
            avatorId: '6_4',
            light: false
        }, {
            avatorId: '6_5',
            light: false
        }, {
            avatorId: '6_6',
            light: false
        }, {
            avatorId: '6_7',
            light: false
        }, {
            avatorId: '6_8',
            light: false
        }, {
            avatorId: '6_9',
            light: false
        }, {
            avatorId: '6_10',
            light: false
        }, {
            avatorId: '6_11',
            light: false
        }, {
            avatorId: '6_12',
            light: false
        }, {
            avatorId: '6_13',
            light: false
        }, {
            avatorId: '6_14',
            light: false
        }, {
            avatorId: '6_15',
            light: false
        }],
};
export let game_map_atlas_processing = false;
