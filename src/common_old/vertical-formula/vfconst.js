/**
 * Created by LuoWen on 2016/8/3.
 */

let CONST = {};

CONST.PLATFORM = {
    QBI : "qbi",
    QBP : "qbp",
    STU : "stu"
};
CONST.CURRENT_PLATFORM = CONST.PLATFORM.QBI;

CONST.EVENT_VCELL_CUR_REMOVE = "verticalCell.removeCursor";
CONST.EVENT_VCELL_CUR_ADD = "verticalCell.addCursor";

//-------- keyboard event---------------
CONST.EVENT_KEYBOARD_ADD_CONTENT = "keyboard.addContent";
CONST.EVENT_KEYBOARD_DEL = "keyboard.del";
CONST.EVENT_KEYBOARD_REMOVE_FOCUS = "keyboard.removefocus";
CONST.EVENT_KEYBOARD_SHOW = "keyboard.show";
CONST.EVENT_KEYBOARD_HIDE = "keyboard.hide";

CONST.APPEND_CURSOR_NEXT = 1;
CONST.APPEND_CURSOR_PRE = -1;
CONST.APPEND_CURSOR_NO = 0;

CONST.patterns = [{
    match: /vfline/,
    del: /del$/,
    val: true,
    key: "line",
    method: "watchLine",
}, {
    match: /vfdiv/,
    del: /del$/,
    val: true,
    method: "watchDiv",
    key: 'div'
}, {
    match: /\./,
    del: /del$/,
    val: true,
    method: "watchDot",
    key: 'dot'
}, {
    match: /vfborrow/,
    del: /del$/,
    val: true,
    method: "watchBorrow",
    key: 'borrow'
}, {
    match: /vfcarry/,
    del: /del$/,
    val: true,
    method: "watchCarry",
    key: 'carry'
}, {
    match: /vfallclear/,
    del: /del$/,
    val: true,
    method: "watchAllClear",
    key: 'allclear'
}, {
    match: /vfdelete/,
    del: /del$/,
    val: null,
    method: "watchKbdDel",
    key: 'val'
}];

/**
 * @return {boolean}
 */
CONST.IS_QBI = (() => {return CONST.CURRENT_PLATFORM === CONST.PLATFORM.QBI})();
CONST.IS_QBP = (() => {return CONST.CURRENT_PLATFORM === CONST.PLATFORM.QBP})();
CONST.IS_STU = (() => {return CONST.CURRENT_PLATFORM === CONST.PLATFORM.STU})();

CONST.MATRIX_TYPE_CALC = "vertical-exp-calc";
CONST.MATRIX_TYPE_BLANKS = "vertical-exp-blank";
CONST.MATRIX_TYPE_ERROR = "vertical-exp-error";

// ------- css start
CONST.CSS_NAME_EDITABLE_COLOR = "vertical-editable-color";
CONST.CSS_NAME_CELL_BORDER = 'vfcell-border';
CONST.CSS_NAME_CONTAINER_BORDER = 'vertical-container-border';

CONST.CSS_CLAZ_EDITABLE_COLOR = "." + CONST.CSS_NAME_EDITABLE_COLOR;
CONST.CSS_CLAZ_CELL_BORDER = "." + CONST.CSS_NAME_CELL_BORDER;
CONST.CSS_CLAZ_CONTAINER_BORDER = "." + CONST.CSS_NAME_CONTAINER_BORDER;

CONST.CSS_MATCH_SPAN_CELL = "span.vertical-cell";
// --------- css end

export default CONST;
