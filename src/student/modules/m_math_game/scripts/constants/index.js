/**
 * Created by qiyuexi on 2018/1/5.
 */
import {Constant} from "../module";
@Constant('mathGameInterface', {
    GET_GAME_DATA: '/game/rest/knowledge/canPlayGame', //获取游戏列表
    GET_PLAY_GAME:'/game/rest/knowledge/getPlayGame',//获取玩游戏返回的游戏结算
    IS_GAME_CAN_PLAY:'/game/rest/knowledge/isGameCanPlay',      //判断这个游戏是否被老师修改
})
class mathGameInterface {
}
@Constant('mathGameFinalData', {
    CATEGORY:2, //类型默认家庭 1代表课堂
    GAME_NUM: {

        "11" : [
            "aa0NumCounting"
            , "comparison"
            , "location"
            , "rule"
            , "complexcomparison"
            , "aa5", "aa5addsub"
        ]
        , "12" : [
            "aa8Classification"
            , "aa10", "aa10addsubwithin20"
            , "aa12", "aa12GraphicsSolid"
            ,"aa13", "aa13timer"
            , "aa21", "aa21Position"
        ]
        , "13" : [
            "aa11", "aa11absubwithin20"
            , "aa14CountingWithin100"
            , "aa17", "aa17addsubwithin100"
            , "aa18 ", "aa18GraphicsPlane"
        ]
        , "14" : [
            "aa19", "AA19AddsubWithin100"
            , "aa20AddsubExe"
            , "aa22AddsubExe"
            , "aa23AddsubExe"
        ]
        , "21" : [
            "ab1", "ab1Fishing"
            , "ab2", "ab2Shopping"
            , "ab3", "ab3Farm"
            , "ab4", "ab4TranslationSymmetry"
        ]
        , "22" : [
            "ab5", "ab5Multiplication1"
            , "ab6", "ab6Measure"
            , "ab7", "ab7DivisionConcept"
            , "ab8", "ab8Multiplication2"
        ]
        , "23" : [
            "ab9", "ab9Division"
            , "ab10", "ab10SnowmanPageant"
            , "ab11", "ab11Direction"
            , "ab12a", "ab12aNumber"
            , "ab12b", "ab12bNumber"
        ]
        , "24" : [
            "ab15", "ab15GraphicsAbstract"
            , "ab13", "ab13Measure"
            , "ab16", "ab16Time"
            , "ab17", "ab17InvestigationRecording"
            , "ab14a", "ab14aAddSub"
            , "ab14b", "ab14bAddSub"
        ]
        , "31" : [
            "ac1", "ac1HybridOperation"
            , "ac3", "ac3IslandArmy"
            , "ac4", "ac4Island"
            , "ac5", "ac5Perimeter"
        ]
        , "32" : [
            "ac6a", "ac6aMul"
            , "ac6b", "ac6bMul"
            , "ac7", "ac7Date"
            , "ac8", "ac8Decimal"
        ]
        , "33" : [
            "ac9a", "ac9aDivision"
            , "ac9b", "ac9bDivision"
            , "ac10", "ac10Circus"
            , "ac11", "ac11SeabedTreasures"
        ]
        , "34" : [
            "ac12", "ac12Quality"
            , "ac13", "ac13EgyptAdventure"
            , "ac14", "ac14NinjaShop"
            , "ac15"
            , "ac19", "ac19i10eChosen", "ac19i10eGame"
        ]
    },
    START_ICON: {
        fullStar: 'math_game_full_star.png',
        halfStar: 'math_game_half_star.png',
        emptyStar: 'math_game_empty_star.png'
    },
    IS_COME_FROM_GAME:'IS_COME_FROM_GAME',//从游戏推出后初始化作业端进入游戏列表路由|速算路由
})
class mathGameFinalData {
}