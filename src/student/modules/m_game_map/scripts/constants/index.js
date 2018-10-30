/**
 * Created by Administrator on 2017/5/5.
 */
import {Constant} from "../module";
@Constant('gameMapInterface', {
    GET_GAME_MAP_LEVEL_INFO: '/game/rest/mlcg/levelScence',//获取游戏包的关卡信息
    GET_GAME_GOODS_LIST:'/vip/goodsMenus',//获取游戏商品列表
    OPEN_GAME_BOX:'/game/rest/mlcg/openBox', //打开一个宝箱
    GET_GAME_MAP_SCENE:'/game/rest/mlcg/mainScence',//获取主页面数据
    GET_GAME_MAP_ATLAS:'/game/rest/mlcg/ownedCard', //获取图集信息
    GAME_GOODS_ORDER_CREATE: "/vip/order", //创建游戏订单
    GAME_GOODS_ORDER_QUERY: "/vip/orderQuery", //查询游戏订单
})
class gameMapInterface {
}
@Constant('themeConfig', {
    bgBling:require('./../../game_map_images/level_page/level_bg_bling.png'),
    freePlayImg:require('./../../game_map_images/level_page/level_free_play_icon.png'),
    starImgLight:require('./../../game_map_images/level_page/level_star_1.png'),
    starImgDark:require('./../../game_map_images/level_page/level_star_2.png'),
    starImgHalf:require('./../../game_map_images/level_page/level_star_3.png'),
    itemIconLight: require('./../../game_map_images/level_page/level_icon_light.png'),
    theme01:{
        topBarImg: {
            left: require('./../../game_map_images/level_page/top_bar_left.png'),
            middle: require('./../../game_map_images/level_page/theme01/level_theme01_top_bar_middle.png'),
            right: require('./../../game_map_images/level_page/theme01/level_theme01_top_bar_right.png')
        },
        itemBoxOpen: require('./../../game_map_images/level_page/level_box_open.png'),
        itemBoxClosed: require('./../../game_map_images/level_page/level_box_closed.png'),
        itemBgImgArr:[
            require('./../../game_map_images/level_page/theme01/level_theme01_1.png'),
            require('./../../game_map_images/level_page/theme01/level_theme01_2.png'),
            require('./../../game_map_images/level_page/theme01/level_theme01_3.png'),
            require('./../../game_map_images/level_page/theme01/level_theme01_4.png'),
            require('./../../game_map_images/level_page/theme01/level_theme01_5.png'),
        ],
    },
    theme02:{
        topBarImg: {
            left: require('./../../game_map_images/level_page/top_bar_left.png'),
            middle: require('./../../game_map_images/level_page/theme02/level_theme02_top_bar_middle.png'),
            right: require('./../../game_map_images/level_page/theme02/level_theme02_top_bar_right.png')
        },
        itemBoxOpen: require('./../../game_map_images/level_page/level_box_open.png'),
        itemBoxClosed: require('./../../game_map_images/level_page/level_box_closed.png'),
        itemBgImgArr:[
            require('./../../game_map_images/level_page/theme02/level_theme02_1.png'),
            require('./../../game_map_images/level_page/theme02/level_theme02_2.png'),
            require('./../../game_map_images/level_page/theme02/level_theme02_3.png'),
            require('./../../game_map_images/level_page/theme02/level_theme02_4.png'),
            require('./../../game_map_images/level_page/theme02/level_theme02_5.png'),
        ],
    },
    theme03:{
        topBarImg: {
            left: require('./../../game_map_images/level_page/top_bar_left.png'),
            middle: require('./../../game_map_images/level_page/theme03/level_theme03_top_bar_middle.png'),
            right: require('./../../game_map_images/level_page/theme03/level_theme03_top_bar_right.png')
        },
        itemBoxOpen: require('./../../game_map_images/level_page/theme03/level_theme03_box_open.png'),
        itemBoxClosed: require('./../../game_map_images/level_page/theme03/level_theme03_box_close.png'),
        itemBgImgArr:[
            require('./../../game_map_images/level_page/theme03/level_theme03_1.png'),
            require('./../../game_map_images/level_page/theme03/level_theme03_2.png'),
            require('./../../game_map_images/level_page/theme03/level_theme03_3.png'),
            require('./../../game_map_images/level_page/theme03/level_theme03_4.png'),
            require('./../../game_map_images/level_page/theme03/level_theme03_5.png'),
        ],
    },
    theme04:{
        topBarImg: {
            left: require('./../../game_map_images/level_page/top_bar_left.png'),
            middle: require('./../../game_map_images/level_page/theme04/level_theme04_top_bar_middle.png'),
            right: require('./../../game_map_images/level_page/theme04/level_theme04_top_bar_right.png')
        },
        itemBoxOpen: require('./../../game_map_images/level_page/theme04/level_theme04_box_open.png'),
        itemBoxClosed: require('./../../game_map_images/level_page/theme04/level_theme04_box_close.png'),
        itemBgImgArr:[
            require('./../../game_map_images/level_page/theme04/level_theme04_1.png'),
            require('./../../game_map_images/level_page/theme04/level_theme04_2.png'),
            require('./../../game_map_images/level_page/theme04/level_theme04_3.png'),
            require('./../../game_map_images/level_page/theme04/level_theme04_4.png'),
            require('./../../game_map_images/level_page/theme04/level_theme04_5.png'),
            require('./../../game_map_images/level_page/theme04/level_theme04_6.png'),
        ],
    },
    theme05:{
        topBarImg: {
            left: require('./../../game_map_images/level_page/top_bar_left.png'),
            middle: require('./../../game_map_images/level_page/theme05/level_theme05_top_bar_middle.png'),
            right: require('./../../game_map_images/level_page/theme05/level_theme05_top_bar_right.png')
        },
        itemBoxOpen: require('./../../game_map_images/level_page/level_box_open.png'),
        itemBoxClosed: require('./../../game_map_images/level_page/level_box_closed.png'),
        itemBgImgArr:[
            require('./../../game_map_images/level_page/theme05/level_theme05_1.png'),
            require('./../../game_map_images/level_page/theme05/level_theme05_2.png'),
            require('./../../game_map_images/level_page/theme05/level_theme05_3.png'),
            require('./../../game_map_images/level_page/theme05/level_theme05_4.png'),
            require('./../../game_map_images/level_page/theme05/level_theme05_5.png'),
            require('./../../game_map_images/level_page/theme05/level_theme05_6.png'),
        ],
    },
    theme06:{
        topBarImg: {
            left: require('./../../game_map_images/level_page/top_bar_left.png'),
            middle: require('./../../game_map_images/level_page/theme06/level_theme06_top_bar_middle.png'),
            right: require('./../../game_map_images/level_page/theme06/level_theme06_top_bar_right.png')
        },
        itemBoxOpen: require('./../../game_map_images/level_page/level_box_open.png'),
        itemBoxClosed: require('./../../game_map_images/level_page/level_box_closed.png'),
        itemBgImgArr:[
            require('./../../game_map_images/level_page/theme06/level_theme06_1.png'),
            require('./../../game_map_images/level_page/theme06/level_theme06_2.png'),
            require('./../../game_map_images/level_page/theme06/level_theme06_3.png'),
            require('./../../game_map_images/level_page/theme06/level_theme06_4.png'),
            require('./../../game_map_images/level_page/theme06/level_theme06_5.png'),
        ],
    }
})
class themeConfig {
}
@Constant('gameMapFinalData', {
    needPassPreLevel : 'needPassPreLevel', //需要通关前的关卡才可以打开当前游戏|宝箱
    enterGame :'enterGame', //确定进入游戏
    gotoPay :'gotoPay', //去到付费页面
    openBox :'openBox', //打开宝箱获得奖励
})
class gameMapFinalData {
}