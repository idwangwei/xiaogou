/**
 * Created by LuoWen on 2016/8/3.
 */
import * as EVENT_TYPES from './vue/event/EventTypes';

let CONST = {};

CONST.PLATFORM = {
    RELEASE: "release",
    DEV: "dev",
    QBI: "qbi",
    QBP: "qbp",
    P: "parent",
    S: "student",
    T: "teacher"
};
// CONST.CURRENT_PLATFORM = CONST.PLATFORM.RELEASE;
CONST.CURRENT_PLATFORM = CONST.PLATFORM.RELEASE;

CONST.EVENT_VCELL_CUR_REMOVE = "verticalCell.removeCursor";
CONST.EVENT_VCELL_CUR_ADD = "verticalCell.addCursor";

//-------- keyboard event---------------
CONST.EVENT_KEYBOARD_ADD_CONTENT = "keyboard.addContent";
CONST.EVENT_KEYBOARD_DEL = "keyboard.del";
CONST.EVENT_KEYBOARD_REMOVE_FOCUS = "keyboard.removefocus";
CONST.EVENT_KEYBOARD_SHOW = "keyboard.show";
CONST.EVENT_KEYBOARD_HIDE = "keyboard.hide";

CONST.APPEND_CURSOR_NEXT = 1;
CONST.APPEND_CURSOR_PRE = 2;
CONST.APPEND_CURSOR_NO = 3;


//patterns
CONST.PATTERN_VALUE_KEY = 'val';
CONST.PATTERN_DIV_KEY = 'div';
CONST.PATTERN_DIV_VAL = !0;
CONST.PATTERN_LINE_KEY = 'line';
CONST.PATTERN_LINE_VAL = !0;
CONST.PATTERN_LINE_DIV_KEY = 'line-div';
CONST.PATTERN_LINE_DIV_VAL = !0;
CONST.PATTERN_CELL_EDITABLE = 'cellEditable';

//CONST.KBD_VAL_DIV = "\\vfdiv";
//CONST.KBD_VAL_DEL_DIV = "\\vfdiv-del";

// Keyboard input values
CONST.KBD_INPUT_VALUE_ADD = "+";
CONST.KBD_INPUT_VALUE_SUB = "-";
CONST.KBD_INPUT_VALUE_MUL = "\\times";
CONST.KBD_INPUT_VALUE_DIV = "\\vfdiv";
CONST.KBD_INPUT_VALUE_DIV_DEL = "\\vfdiv-del";
CONST.KBD_INPUT_VALUE_DOT = ".";
CONST.KBD_INPUT_VALUE_DOT_DEL = ".-del";
CONST.KBD_INPUT_VALUE_CARRY1 = "\\vfcarry1";
CONST.KBD_INPUT_VALUE_CARRY2 = "\\vfcarry2";
CONST.KBD_INPUT_VALUE_CARRY3 = "\\vfcarry3";
CONST.KBD_INPUT_VALUE_CARRY4 = "\\vfcarry4";
CONST.KBD_INPUT_VALUE_CARRY5 = "\\vfcarry5";
CONST.KBD_INPUT_VALUE_CARRY6 = "\\vfcarry6";
CONST.KBD_INPUT_VALUE_CARRY7 = "\\vfcarry7";
CONST.KBD_INPUT_VALUE_CARRY8 = "\\vfcarry8";
CONST.KBD_INPUT_VALUE_CARRY1_DEL = "\\vfcarry1-del";
CONST.KBD_INPUT_VALUE_CARRY2_DEL = "\\vfcarry2-del";
CONST.KBD_INPUT_VALUE_CARRY3_DEL = "\\vfcarry3-del";
CONST.KBD_INPUT_VALUE_CARRY4_DEL = "\\vfcarry4-del";
CONST.KBD_INPUT_VALUE_CARRY5_DEL = "\\vfcarry5-del";
CONST.KBD_INPUT_VALUE_CARRY6_DEL = "\\vfcarry6-del";
CONST.KBD_INPUT_VALUE_CARRY7_DEL = "\\vfcarry7-del";
CONST.KBD_INPUT_VALUE_CARRY8_DEL = "\\vfcarry8-del";
CONST.KBD_INPUT_VALUE_BORROW = "\\vfborrow";
CONST.KBD_INPUT_VALUE_BORROW_DEL = "\\vfborrow-del";
CONST.KBD_INPUT_VALUE_LINE = "\\vfline";
CONST.KBD_INPUT_VALUE_LINE_DEL = "\\vfline-del";
CONST.KBD_INPUT_VALUE_ALL_CLEAR = "\\vfallclear";
CONST.KBD_INPUT_VALUE_DELETE = null;
CONST.KBD_INPUT_VALUE_SKIP = undefined;
CONST.KBD_INPUT_VALUE_CELL_EDITABLE = "cellEditableVal";

//这个数组顺序不要变!!
CONST.patterns = [{
    match: /vfline/,
    //del: /del$/,
    //val: true,
    key: "line",
    method: "watchLine",
    kbdInputVal: CONST.KBD_INPUT_VALUE_LINE,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_LINE_DEL,
}, {
    match: /vfdiv/,
    //del: /del$/,
    //val: true,
    method: "watchDiv",
    key: 'div',
    kbdInputVal: CONST.KBD_INPUT_VALUE_DIV,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_DIV_DEL,
}, {
    match: /\./,
    //del: /del$/,
    //val: true,
    method: "watchDot",
    key: 'dot',
    kbdInputVal: CONST.KBD_INPUT_VALUE_DOT,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_DOT_DEL,
}, {
    match: /vfborrow/,
    //del: /del$/,
    //val: true,
    method: "watchBorrow",
    key: 'borrow',
    kbdInputVal: CONST.KBD_INPUT_VALUE_BORROW,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_BORROW_DEL,
}, {
    match: /vfcarry1/,
    //del: /del$/,
    //val: true,
    method: "watchCarry1",
    key: 'carry1',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CARRY1,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_CARRY1_DEL,
}, {
    match: /vfcarry2/,
    //del: /del$/,
    //val: true,
    method: "watchCarry2",
    key: 'carry2',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CARRY2,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_CARRY2_DEL,
}, {
    match: /vfcarry3/,
    //del: /del$/,
    //val: true,
    method: "watchCarry3",
    key: 'carry3',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CARRY3,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_CARRY3_DEL,
}, {
    match: /vfcarry4/,
    //del: /del$/,
    //val: true,
    method: "watchCarry4",
    key: 'carry4',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CARRY4,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_CARRY4_DEL,
}, {
    match: /vfcarry5/,
    //del: /del$/,
    //val: true,
    method: "watchCarry5",
    key: 'carry5',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CARRY5,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_CARRY5_DEL,
}, {
    match: /vfcarry6/,
    //del: /del$/,
    //val: true,
    method: "watchCarry6",
    key: 'carry6',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CARRY6,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_CARRY6_DEL,
}, {
    match: /vfcarry7/,
    //del: /del$/,
    //val: true,
    method: "watchCarry7",
    key: 'carry7',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CARRY7,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_CARRY7_DEL,
}, {
    match: /vfcarry8/,
    //del: /del$/,
    //val: true,
    method: "watchCarry8",
    key: 'carry8',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CARRY8,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_CARRY8_DEL,
}, {
    match: /vfallclear/,
    //del: /del$/,
    //val: true,
    method: "watchAllClear",
    key: 'allclear',
    kbdInputVal: CONST.KBD_INPUT_VALUE_ALL_CLEAR,
}, {
    match: /vfdel/,
    //del: /del$/,
    //val: null,
    method: "watchKbdDel",
    key: 'val',
    kbdInputVal: CONST.KBD_INPUT_VALUE_DELETE,
}, {
    match: /cellEditable/,
    //del: /del$/,
    //val: undefined,
    method: "watchCellEditable",
    key: 'cellEditable',
    kbdInputVal: CONST.KBD_INPUT_VALUE_CELL_EDITABLE,
    kbdInputValDel: CONST.KBD_INPUT_VALUE_DELETE,
}];

/**
 * @return {boolean}
 */
CONST.IS_QBI = (() => {
    return CONST.CURRENT_PLATFORM === CONST.PLATFORM.QBI
})();
CONST.IS_QBP = (() => {
    return CONST.CURRENT_PLATFORM === CONST.PLATFORM.QBP
})();
CONST.IS_S = (() => {
    return CONST.CURRENT_PLATFORM === CONST.PLATFORM.S
})();
CONST.IS_T = (() => {
    return CONST.CURRENT_PLATFORM === CONST.PLATFORM.T
})();
CONST.IS_P = (() => {
    return CONST.CURRENT_PLATFORM === CONST.PLATFORM.P
})();
CONST.IS_DEV = (() => {
    return CONST.CURRENT_PLATFORM === CONST.PLATFORM.DEV
})();
CONST.IS_RELEASE = (() => {
    return CONST.CURRENT_PLATFORM === CONST.PLATFORM.RELEASE
})();

CONST.MATRIX_TYPE_CALC = "vertical-exp-calc";
CONST.MATRIX_TYPE_BLANKS = "vertical-exp-blank";
CONST.MATRIX_TYPE_ERROR = "vertical-exp-error";
CONST.MATRIX_TYPE_ERROR_1 = "vertical-exp-error1";
CONST.MATRIX_TYPE_ERROR_2 = "vertical-exp-error2";

// ------- css start
CONST.CSS_NAME_EDITABLE_COLOR = "vertical-editable-color";
CONST.CSS_NAME_CELL_BORDER = 'vfcell-border';
CONST.CSS_NAME_CONTAINER_BORDER = 'vertical-container-border';
CONST.CSS_NAME_CORRECT = "vfcorrect";
CONST.CSS_NAME_WRONG = "vfwrong";
CONST.CSS_NAME_VF_LINE = "vfline";
CONST.CSS_NAME_VF_LINE_DIV = "vfline-div";
CONST.CSS_NAME_VF_DIV = "vfdiv";
CONST.CSS_NAME_VF_DOT = "vfdot";
CONST.CSS_NAME_VF_CARRY1 = "vfcarry1";
CONST.CSS_NAME_VF_CARRY2 = "vfcarry2";
CONST.CSS_NAME_VF_CARRY3 = "vfcarry3";
CONST.CSS_NAME_VF_CARRY4 = "vfcarry4";
CONST.CSS_NAME_VF_CARRY5 = "vfcarry5";
CONST.CSS_NAME_VF_CARRY6 = "vfcarry6";
CONST.CSS_NAME_VF_CARRY7 = "vfcarry7";
CONST.CSS_NAME_VF_CARRY8 = "vfcarry8";
CONST.CSS_NAME_VF_BORROW = "vfborrow";
CONST.CSS_NAME_VERTICAL_CELL_GRID = "vertical-cell-grid";
CONST.CSS_NAME_VF_CELL_SPACE = "vfcell-space";
CONST.CSS_NAME_VF_CELL_WRAPPER_PADDING = "vertical-cell-wrapper-padding";
CONST.CSS_NAME_VF_LOADING = "containerLoading";
CONST.CSS_NAME_VF_CONTAINER_ERR1 = "vertical-container-border-err1";
CONST.CSS_NAME_VF_CONTAINER_BLANK_MARGIN = "vertical-container-blank-margin";

CONST.CSS_CLAZ_EDITABLE_COLOR = "." + CONST.CSS_NAME_EDITABLE_COLOR;
CONST.CSS_CLAZ_CELL_BORDER = "." + CONST.CSS_NAME_CELL_BORDER;
CONST.CSS_CLAZ_CONTAINER_BORDER = "." + CONST.CSS_NAME_CONTAINER_BORDER;
CONST.CSS_CLAZ_VF_LINE = "." + CONST.CSS_NAME_VF_LINE;
CONST.CSS_CLAZ_VF_LINE_DIV = "." + CONST.CSS_NAME_VF_LINE_DIV;
CONST.CSS_CLAZ_VF_DIV = "." + CONST.CSS_NAME_VF_DIV;
CONST.CSS_CLAZ_VF_DOT = "." + CONST.CSS_NAME_VF_DOT;
CONST.CSS_CLAZ_VF_CARRY1 = "." + CONST.CSS_NAME_VF_CARRY1;
CONST.CSS_CLAZ_VF_CARRY2 = "." + CONST.CSS_NAME_VF_CARRY2;
CONST.CSS_CLAZ_VF_CARRY3 = "." + CONST.CSS_NAME_VF_CARRY3;
CONST.CSS_CLAZ_VF_CARRY4 = "." + CONST.CSS_NAME_VF_CARRY4;
CONST.CSS_CLAZ_VF_CARRY5 = "." + CONST.CSS_NAME_VF_CARRY5;
CONST.CSS_CLAZ_VF_CARRY6 = "." + CONST.CSS_NAME_VF_CARRY6;
CONST.CSS_CLAZ_VF_CARRY7 = "." + CONST.CSS_NAME_VF_CARRY7;
CONST.CSS_CLAZ_VF_CARRY8 = "." + CONST.CSS_NAME_VF_CARRY8;
CONST.CSS_CLAZ_VF_BORROW = "." + CONST.CSS_NAME_VF_BORROW;
CONST.CSS_CLAZ_VERTICAL_CELL_GRID = "." + CONST.CSS_NAME_VERTICAL_CELL_GRID;
CONST.CSS_CLAZ_VF_CELL_SPACE = "." + CONST.CSS_NAME_VF_CELL_SPACE;
CONST.CSS_CLAZ_VF_CELL_WRAPPER_PADDING = "." + CONST.CSS_NAME_VF_CELL_WRAPPER_PADDING;
CONST.CSS_CLAZ_VF_LOADING = "." + CONST.CSS_NAME_VF_LOADING;
CONST.CSS_CLAZ_VF_CONTAINER_ERR1 = "." + CONST.CSS_NAME_VF_CONTAINER_ERR1;
CONST.CSS_CLAZ_VF_CONTAINER_BLANK_MARGIN = "." + CONST.CSS_NAME_VF_CONTAINER_BLANK_MARGIN;

CONST.CSS_MATCH_SPAN_CELL = "span.vertical-cell";
// --------- css end

// vf math symbols
CONST.VF_MATH_SYMBOL_ADD = "vf_math_symbol_add";
CONST.VF_MATH_SYMBOL_SUB = "vf_math_symbol_sub";
CONST.VF_MATH_SYMBOL_MUL = "vf_math_symbol_mul";
CONST.VF_MATH_SYMBOL_DIV = "vf_math_symbol_div";


//keys
CONST.KEY_HAS_SYMBOL_DIV = 'hasSymbolDiv';
CONST.KEY_HAS_SYMBOL_LINE = 'hasSymbolLine';
CONST.KEY_SYMBOL_DIV_POSITION = 'symbolDivPosition';
CONST.KEY_CELL_EDITABLE = 'cellEditable';

CONST.QUESTION_MARK = '?';


CONST.LABEL = 'onlyDom_label';
CONST.labelIndex = 0;
CONST.IS_SHOW_RUN_TIME = false;

CONST.STATE_HOME_DO_QUESTION = "do_question";
CONST.STATE_HOME_DIAGNOSE_DO_QUESTION = "diagnose_do_question";
CONST.STATE_QUESTION_EDIT = "question_edit";
CONST.STATE_QUESTION_EXAMINE = "question_examine";

////---------------------- vue -------------
CONST.STYLE_CELL_EDITABLE = 'cell_editable';
CONST.STYLE_CELL_BORDER = 'cell_border';
CONST.STYLE_CELL_WRAPPER_PADDING = 'cell_wrapper_padding';

// CONST.HAS_STYLE_DIV = 'hasStyleDiv';
CONST.KBD_INPUT_REPLACE = {};
CONST.KBD_INPUT_REPLACE.MUL = [CONST.KBD_INPUT_VALUE_MUL, '×'];

CONST.VAM_KEY_DIV = '\\div';

CONST.VUE_KEY_VAUE = 'val';
CONST.VUE_KEY_HAS_MARK_DIV = 'hasMarkDiv';
CONST.VUE_KEY_HAS_MARK_LINE = 'hasMarkLine';
CONST.VUE_KEY_HAS_STYLE_DIV = 'hasStyleDiv';
CONST.VUE_KEY_HAS_STYLE_DIV_LINE = 'hasStyleDivLine';
CONST.VUE_KEY_HAS_STYLE_EDITABLE_COLOR = 'hasStyleEditableColor';
CONST.VUE_KEY_HAS_STYLE_LINE = 'line';
CONST.VUE_KEY_HAS_SYLE_DOT = 'dot';
CONST.VUE_KEY_HAS_SYLE_BORROW = 'borrow';
CONST.VUE_KEY_HAS_SYLE_CARRY_PRE = 'carry';
CONST.VUE_KEY_HAS_SYLE_CARRY1 = 'carry1';
CONST.VUE_KEY_HAS_SYLE_CARRY2 = 'carry2';
CONST.VUE_KEY_HAS_SYLE_CARRY3 = 'carry3';
CONST.VUE_KEY_HAS_SYLE_CARRY4 = 'carry4';
CONST.VUE_KEY_HAS_SYLE_CARRY5 = 'carry5';
CONST.VUE_KEY_HAS_SYLE_CARRY6 = 'carry6';
CONST.VUE_KEY_HAS_SYLE_CARRY7 = 'carry7';
CONST.VUE_KEY_HAS_SYLE_CARRY8 = 'carry8';
CONST.VUE_KEY_CELL_EDITABLE = 'cellEditable';

CONST.patterns_vue = [{
    test: /^\d$|^\+|^-/,
    replace: null,
    evt: [EVENT_TYPES.BEFORE_ADD_SYMBOL, EVENT_TYPES.WATCH_VAL],
    //          key        valueAdd  valueDel
    setKV: [CONST.VUE_KEY_VAUE, null, undefined],
}, {
    test: /\\vfdiv/,
    replace: null,
    evt: [EVENT_TYPES.BEFORE_ADD_SYMBOL, EVENT_TYPES.WATCH_DIV,
        EVENT_TYPES.WATCH_DIV_CURSOR],
    setKV: [CONST.VUE_KEY_HAS_STYLE_DIV, true, false],
    kbdDel: false, //删除键不能删除
    cursorMove: false, //添加、删除操作, 光标不移动
    cursorEmit: false,
    skipInVfBlank: true,
}, {
    test: /\\vfline/,
    replace: "",
    evt: [EVENT_TYPES.WATCH_LINE],
    setKV: [CONST.VUE_KEY_HAS_STYLE_LINE, 1, 0],
    kbdDel: false,
    cursorMove: false,
    skipInVfBlank: true,
}, {
    test: /\\times/,
    replace: "×",
    evt: [EVENT_TYPES.BEFORE_ADD_SYMBOL, EVENT_TYPES.WATCH_VAL],
    setKV: [CONST.VUE_KEY_VAUE, null, undefined],
}, {
    test: /^\./,
    replace: null,
    evt: [EVENT_TYPES.WATCH_DOT],
    setKV: [CONST.VUE_KEY_HAS_SYLE_DOT, 1, 0],
    cursorMove: false,
    skipInVfBlank: true,
}, {
    test: /^\\vfborrow/,
    replace: null,
    setKV: [CONST.VUE_KEY_HAS_SYLE_BORROW, 1, 0],
    cursorMove: false,
    skipInVfBlank: true,
}, {
    test: /^\\vfcarry\d/,
    replace: null,
    evt: [EVENT_TYPES.WATCH_CARRY, EVENT_TYPES.WATCH_VAL],
    evtDel: [EVENT_TYPES.CLEAR_CARRY],
    setKV: [CONST.VUE_KEY_HAS_SYLE_CARRY_PRE, 1, 0],
    cursorMove: false,
    skipInVfBlank: true,
}, {
    test: /^\\vfallclear/,
    replace: null,
    evt: [EVENT_TYPES.WATCH_ALL_CLEAR_CONFIRM, EVENT_TYPES.WATCH_ALL_CLEAR],
    setKV: [CONST.VUE_KEY_VAUE, 1, 0],
    kbdDel: false,
    cursorEmit: false,
    manualNextEvt: true,
}];


export default CONST;
