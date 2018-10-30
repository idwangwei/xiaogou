/**
 * Created by 彭健伦 on 2016/3/23.
 */
var expressionSet = {
    WORD_ANSWER: '\\\\wordAnswer{(.+)}',//答语
    NEQ: '\\\\neq',//不等于
    MUL: '\\\\times', //乘号
    DIV: "\\\\div",   //除号
    EQU: '\\\\eq',    //等号
    PLUS: '\\\\plus',  //加好
    MINUS: '\\\\minus',//减号
    LBRACE: '\\\\lbrace',//左花括号
    RBRACE: '\\\\rbrace',//右花括号
    LBRACKET: '\\\\lbracket',//右花括号
    RBRACKET: '\\\\rbracket',//右花括号
    FRACTION: "\\\\frac{.*?}{.*?}",//分数
    UNIT: "\\\\unit{.*?}{.*?}{.*?}",//单位
    UNKN: "\\\\var{.+?}",//未知数
    NEWLINE: "\\\\n(?!(eq))",//换行
    SPACE: '    ',//空格
    SQUARE: '\\^([a-z]|\\d)*', //平方，次方,
    GREATER: '\\\\gt',//大于号
    LESS: '\\\\lt',//小于号
    LE: '\\\\le',//小于
    GE: '\\\\ge',//大于
    APPROX: '\\\\approx',//约等于
    PI: '\\\\pi',//π
    REMAIN: '\\\\remain',//余数
    COMMENT: '\\\\comment{(.*?)}',//解题步骤说明
    PERCENT:'\\\\\\%',//百分号
    DOT:'\\\\dot{.+?}',
    VDOTVDOT:'\\\\vdotdot',

};
var unSupportExpressionSet = {
    EQU: {expr: '\\eq', directive: 'equal'},//等号
    PLUS: {expr: '\\plus', directive: 'plus'},//加号
    MINUS: {expr: '\\minus', directive: 'minus'},//减号
    LBRACKET: {expr: '\\\\lbracket', directive: 'lbracket'},//左中括号
    RBRACKET: {expr: '\\\\rbracket', directive: 'rbracket'},//右中括号
    FRACTION: {expr: "\\\\frac{(.*?)}{(.*?)}", directive: 'frac'},//分数
    UNIT: {expr: '\\\\unit{.*?}{.*?}{.*?}', directive: 'unit'},//单位
    UNKN: {expr: '\\\\var{.+?}', directive: 'unkn'},//未知数
    NEWLINE: {expr: '\\\\n(?!(eq))', directive: 'newline'}, //换行
    SPACE: {expr: '    ', directive: 'space'},//空格
    REMAIN: {expr: '\\\\remain', directive: 'remain'},//空格
    WORD_ANSWER: {expr: '\\\\wordAnswer{(.+)}', directive: 'word-answer'},//答语
    COMMENT: {expr: '\\\\comment{(.*?)}', directive: 'comment'},//解题步骤说明
    VDOTDOT: {expr: '\\\\vdotdot', directive: 'vdotdot'}//解题步骤说明

};
var mergedExpressionSet = {};
Object.assign(mergedExpressionSet, expressionSet);
Object.assign(mergedExpressionSet, unSupportExpressionSet);

export {expressionSet,unSupportExpressionSet, mergedExpressionSet}
