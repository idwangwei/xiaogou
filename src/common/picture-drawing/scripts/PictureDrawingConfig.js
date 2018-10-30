/**
 * Created by LuoWen on 2017/1/9.
 */


let config = {};

let CONST = {
    ECLASS: "eclass",
    QBI: "qbi",
    QB: "qb",

    COLORS_DEFAULT: {color:[], weight:4, shape: "$", punish: 0}, //default
    COLORS: [
        {color:[255,255,255,0], weight:4, shape: "-", punish: 0}, //透明
        {color:[0,0,0,1], weight:4, shape: "*", punish: 0}, //黑色 (普通黑色)
        {color:[0,0,255,1], weight:2, shape: "#", punish: 5}, //蓝色
        {color:[255,0,0,1], weight:1, shape: "@", punish: 10}, //红色
    ],

    RETRIEVE_ANS: "retrieve_ans",
    DEFAULT_WIDTH: 300,
    DEFAULT_HEIGHT: 300,
    PARSE_VERSION_1_0: "1.0",

    //togglePencilMode 这个方法也会修改这个值
    DURATION: 2000,
    OFFSET_TOP: -100,
    OFFSET_LEFT: 0,
    TINY_MOVE_OFFSET_TOP : -2,

    // states
    STATE_HOME_DO_QUESTION: "do_question",
    STATE_HOME_DIAGNOSE_DO_QUESTION: "diagnose_do_question",
    STATE_QUESTION_EDIT: "question_edit",
    STATE_QUESTION_EXAMINE: "question_examine",

    //props
    PROP_SCALE: "prop_scale",
    PROP_SCALE_GLOBAL: "prop_scale_global",
};

let EVENTS = {
    SAVE_SIMILARITY: "save_similarity",
    GET_CANVAS_PROPS: "get_canvas_props",
    POST_CANVAS_PROPS: "post_canvas_props",
};

let utils = (()=>({
    getPlatformName(){
        let name = CONST.ECLASS;
        if (window.location.href.indexOf('import_preview') !== -1) {
            name = CONST.QBI;
        } else if (window.location.href.indexOf('qbbuild') !== -1) {
            name = CONST.QB;
        }
        return name;
    },

    isEClass() {
        return this.getPlatformName() === CONST.ECLASS;
    },

    isQBI() {
        return this.getPlatformName() === CONST.QBI;
    },

    isQB() {
        return this.getPlatformName() === CONST.QB;
    },
}))();

export {config, utils, CONST, EVENTS};
