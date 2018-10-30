/**
 * Created by WL on 2017/9/5.
 */
import  'ionicJS';
angular.module('oralCalculation.constants', [])
    .constant('oralCalculationInterface', {

    })
    .constant('oralCalculationExpressionSet',{
        MUL: '\\\\times', //乘号
        DIV: "\\\\div",   //除号
        EQU: '\\\\eq',    //等号
        PLUS: '\\\\plus',  //加号
        MINUS: '\\\\minus',//减号
        LBRACE: '\\\\lbrace',//左花括号
        RBRACE: '\\\\rbrace',//右花括号
        LBRACKET: '\\\\lbracket',//右花括号
        RBRACKET: '\\\\rbracket',//右花括号
        FRACTION: "\\\\frac{.*?}{.*?}",//分数
        UNIT: "\\\\unit{.*?}{.*?}{.*?}",//单位
        SPACE: '    ',//空格
        SQUARE: '\\^([a-z]|\\d)*', //平方，次方,
    })
    .constant('oralCalculationUnSupportExpressionSet',{
        EQU: {expr: '\\eq', directive: 'equal'},//等号
        PLUS: {expr: '\\plus', directive: 'plus'},//加号
        MINUS: {expr: '\\minus', directive: 'minus'},//减号
        LBRACKET: {expr: '\\\\lbracket', directive: 'lbracket'},//左中括号
        RBRACKET: {expr: '\\\\rbracket', directive: 'rbracket'},//右中括号
        FRACTION: {expr: "\\\\frac{(.*?)}{(.*?)}", directive: 'frac'},//分数
    });

