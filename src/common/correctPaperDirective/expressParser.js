/**
 * Created by 彭建伦 on 2016/3/21.
 *
 */
//    小明一共吃了\\frac{1}{2+\\frac{1}{2}\\times3}
//import $ from 'jquery';
import {expressionSet,unSupportExpressionSet} from './expressionSet';
class ExpressionParser {
    constructor() {
        this.expSet = this.getCombineExpSet();
        this.idFlag=0;
        this.combineExpSet = ['\\\\var{.*}', '\\\\frac{.*}{.*}', '\\\\wordAnswer{.*}', '\\\\unit{.*}{.*}{.*}', '\\\\comment{.*}'];
        this.R_BRACKETS = ['}'];
        this.replaceMap = {};
        this.parseString = null; //需要parse的字符串
        this.operationStack = []; //操作栈
    }

    getCombineExpSet() {
        var list = [];
        console.log(expressionSet);
        for (var key in expressionSet) {
            if(key=='SQUARE'){
                list.push('^'+expressionSet[key]);
            }else{
                var word = this.getRegExpWord(expressionSet[key]);
                if (word == '') {
                list.push('^' + '    ');//空格做特殊处理
                } else {
                    list.push('^\\\\' + word);
                }
            }
        }
        console.log(list);
        return list;
    }

    getRegExpWord(regExpStr) {
        if (!regExpStr)return '';
        var match = '';
        regExpStr.replace(/([a-z]+)/, function (m, $1) {
            match = $1;
        });
        if(regExpStr=='\\\\\\%')
            match='%';
        return match;
    }

    peekStr() {
        var matchStr = null;
        for (var i = 0; i < this.expSet.length; i++) {
            var find = false;
            this.parseString = this.parseString.replace(new RegExp(this.expSet[i]), function (match) {
                find = true;
                matchStr = match;
                return '';
            });
            if (find)break;
        }
        if (!matchStr) {
            matchStr = this.parseString[0];
            this.parseString = this.parseString.substr(1, this.parseString.length - 1);
        }
        this.operationStack.push(matchStr);
        return matchStr;
    }

    combineExpression() {
        if (this.operationStack.length <= 1)return;
        var operationList = [];
        operationList.unshift(this.operationStack.pop());
        while (this.operationStack.length > 0) {
            var stackTopElement = this.operationStack.pop();
            operationList.unshift(stackTopElement);

            var expr = operationList.join('');
            var match = false;
            for (var i = 0; i < this.combineExpSet.length; i++) {
                if (expr.match(new RegExp('^' + this.combineExpSet[i]))) {
                    match = true;
                    break;
                }
            }
            if (match) {
                var mapKey = new Date().getTime().toString()+(this.idFlag++).toString();
                this.operationStack.push(mapKey);
                this.replaceMap[mapKey] = expr;
                operationList.length = 0;
                break;
            }
            if (['\\var', '\\comment', '\\frac', '\\unit'].indexOf(stackTopElement) != -1)
                break;
        }
        var operationListItem;
        while (operationListItem = operationList.shift()) {
            this.operationStack.push(operationListItem);
        }
    }

    isRBracket(str) {
        var isRBracket = false;
        this.R_BRACKETS.forEach(function (item) {
            if (str == item)isRBracket = true;
        });
        return isRBracket;
    }

    parse(parseString) {
        if (!parseString)return;
        this.operationStack.length = 0;
        this.parseString = parseString;
        while (this.parseString.length) {
            var matchStr = this.peekStr();
            if (this.isRBracket(matchStr)) {
                this.combineExpression();
            }
        }
        this.restoreFromReplaceMap();
        console.log(this.operationStack);
        return this.operationStack;
    }

    restoreFromReplaceMap() {
        var copiedMap = {};
        $.extend(copiedMap, this.replaceMap);
        for (var key in this.replaceMap) {
            var val = this.replaceMap[key];
            for (var key2 in copiedMap) {
                val = val.replace(new RegExp(key2), copiedMap[key2]);
            }
            this.replaceMap[key] = val;
        }
        var me = this;
        this.operationStack.forEach(function (item, idx) {
            for (var key in me.replaceMap) {
                if (key == item) {
                    me.operationStack[idx] = me.replaceMap[key];
                }
            }
        });
    }
}
export default ExpressionParser;
window.parser = new ExpressionParser();
