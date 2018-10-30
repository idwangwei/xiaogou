/**
 * Created by LuoWen on 16/7/29.
 */

import BaseCtrl from "./../base_ctrl";
import CONST from "./../vfconst";
import {mergedExpressionSet} from "../expressionSet";
import vcm from "./verticalCompileMathjax";

class VerticalCtrl extends BaseCtrl {

    constructor() {
        super(arguments);
    }

    initData() {
        // debugger;
       // this.verticalService.getVerticalMatrix();
        console.log("")
        this.initListeners();
        // this.verticalService.getVerticalData($element);
        try {
            this.commonService = this.$injector.get('commonService');
            this.commonService = this.$injector.get('ngRedux');
        } catch (e) {
            console.log('commonService not found!');
            this.$ngRedux = {connect: {}};
            this.commonService = {
                showAlert: angular.noop
            };
        }
    }

    initListeners() {
        let sc = this.getScope();
        // if(sc.$root.isInit) {
        //    return;
        // }
        // debugger;
        // sc.$root.isInit = true;
        sc.$on(CONST.EVENT_KEYBOARD_ADD_CONTENT, (event, {val, ele})=> {
            if (!this.canAddContent(ele)) return;

            ele = this.nowEle(ele);
            this.setCellValue(ele, val);

            // let valHTML = this.getKeyboardAddContentVal(val);
            // ele.html(valHTML);
            // this.getCell(ele).val = val;//this.getKeyboardAddContentVal(val);


            // this.verticalService.setCellValue(this.getCell(ele), val);
            //let direction = this.getCursorDirection(ele);
            //this.appendCursor(ele, direction);
        });

        sc.$on(CONST.EVENT_KEYBOARD_DEL, (event, {ele}) => {
            this.setCellValue(ele, "vfdelete");
           /*
            let cell = this.getCell(ele);
            let direction = cell.val
                ? CONST.APPEND_CURSOR_NO
                : CONST.APPEND_CURSOR_PRE;

            cell.val = "";
            this.appendCursor(ele, direction);
            */
        })
    }

    preventDefault($event) {
        console.log('vertical stopPropagation.');
        $event.stopPropagation();
    }

    verticalOnClick(event) {
        // let target = event.currentTarget;
        let target = event.target;
        console.log(target);
        //this.verticalService.setCurrentCursor(target);

        this.appendCursor($(target));

        // preventDefault
        this.preventDefault(event);
    }

    /**
     * 添加光标
     * @param target
     * @param direction
     */
    appendCursor(target, direction) {
        if (direction === CONST.APPEND_CURSOR_NEXT) {
            target = this.nextEleBlank(target);
        } else if (direction === CONST.APPEND_CURSOR_PRE) {
            target = this.preEleBlank(target);
        } else {
            target = this.nowEle(target);
        }
        if(!this.canAppendCursor(target)) return;

        let sc = this.getScope();
        let $cursor = this.$compile('<cursor/>')(sc);
        sc.$root.$broadcast(CONST.EVENT_KEYBOARD_SHOW, {ele: angular.element(target), cell: this.getCell(target)});

        this.nowAll(target).find('cursor').remove();

        console.log("append cursor..");
        $(target).append($cursor);
    }

    nextEle(ele, defaultEle /*= this.nowEle(ele)*/) {
        return this.cacheEle(ele, 'nextEle', ()=> {
            ele = this.nowEle(ele);
            if (defaultEle === undefined) defaultEle = ele;
            let e = ele.parent().next().find('span');
            return e.length ? e : defaultEle;
        });
    }

    nextRow(ele) {
        return this.cacheEle(ele, "nextRow", ()=>this.nowRow(this.nextEle(ele)));
    }

    nextCol(ele) {
        return this.cacheEle(ele, "nextCol", ()=>this.nowCol(this.nextEle(ele)));
    }

    /**
     // 性能问题，不使用 默认参数值
     var defaultEle = arguments.length <= 1 || arguments[1] === undefined ? this.nowEle(ele) : arguments[1];
     * @param ele
     * @param defaultEle
     * @returns {*}
     */
    preEle(ele, defaultEle/* = this.nowEle(ele)*/) {
        return this.cacheEle(ele, 'preEle', ()=> {
            ele = this.nowEle(ele);
            if (defaultEle === undefined) defaultEle = ele;
            let e = ele.parent().prev().find('span');
            return e.length ? e : defaultEle
        });
    }

    preRow(ele) {
        return this.cacheEle(ele, "preRow", ()=>this.nowRow(this.preEle(ele)));
    }

    preCol(ele) {
        return this.cacheEle(ele, "preCol", ()=>this.nowCol(this.preEle(ele)));
    }

    nowEle(ele) {
        return this.cacheEle(ele, "nowEle", ()=>this.getCellEle(ele));
    }

    nowRow(ele) {
        return this.cacheEle(ele, "nowRow", ()=>this.nowEle(ele).parent().parent());
    }

    nowCol(ele) {
        return this.cacheEle(ele, 'nowCol', ()=> {
            let pos = this.nowEle(ele).parent().index();
            let rowLen = this.nowRow(ele).children().length;
            let offset = rowLen - pos;
            return this.nowRow(ele)
                .parent()
                .find(`vertical-cell:nth-child(${rowLen}n-${offset})`)
                .find('span')
        });
    }

    nowAll(ele) {
        return this.cacheEle(ele, "nowAll", ()=>this.nowRow(ele).parent());
    }

    rowFirst(ele) {
        return this.cacheEle(ele, 'rowFirst', ()=>!this.nowEle(ele).parent().prev().size());
    }

    rowEnd(ele) {
        return this.cacheEle(ele, 'rowEnd', ()=>!this.nowEle(ele).parent().next().size());
    }

    colFirst(ele) {
        return this.cacheEle(ele, 'colFirst', ()=>!this.nowRow(ele).prev().next().size());
    }

    colEnd(ele) {
        return this.cacheEle(ele, 'colEnd', ()=>!this.nowRow(ele).next().next().size());
    }

    /**
     * 下一个可输入的空格
     * @param ele
     */
    nextEleBlank(ele) {
        let _next = this.nextEle(ele); //下一个元素
        while(!this.canAppendCursor(_next)) { //下一个元素是否可添加cursor
            if(this.rowEnd(_next)) return ele; //如果下一个元素是行末,返回输入的元素
            _next = this.nextEle(_next); //继续下一个
        }
        return _next;
    }

    /**
     * 上一个可输入的空格
     * @param ele
     * @returns {*}
     */
    preEleBlank(ele) {
        let _prev = this.preEle(ele);
        while(!this.canAppendCursor(_prev)) {
            if(this.rowFirst(_prev)) return ele;
            _prev = this.preEle(_prev);
        }
        return _prev;
    }

    /**
     * 设置 element.cell 的值
     * @param ele
     * @param key
     * @param val
     * @returns {*}
     */
    setCell(ele, key, val) {
        let cell = this.getCell(ele);
        cell[key] = val;
        return ele.data("cell", cell);
    }

    /**
     * 获取 element.cell 的值
     * @param ele
     * @param key
     * @returns {*}
     */
    getCell(ele, key) {
        let cell = this.nowEle(ele).data("cell") || this.nowEle(ele).data("cell", {}).data("cell");
        return (key === 0 || !!key) ? cell[key] : cell;
    }

    getCVal(ele) {
        return this.getCell(ele, "val");
    }

    hasCVal(ele) {
        let val = this.getCVal(ele, "val");
        return val === 0 || !!val;
    }

    /**
     //缓存已捕获的元素，PC上测试
     var ctrl = angular.element($0).scope().ctrl;
     ctrl.testCache($0, "", 10000);

     <pre>
            方法执行 10000 次消耗的时间

         方法名      优化前ms     优化后ms
         nowEle:      28           1
         preEle:      118          1
         nextEle:     106          1
         nowRow:      61           1
         preRow:      166          1
         nextRow:     165          1
         nowCol:      877          1
         preCol:      964          1
         nextCol:     976          1
     </pre>
     */
    testCache(ele, methods, cnt) {
        if (!methods) methods = [
            'nowEle', 'preEle', 'nextEle',
            'nowRow', 'preRow', 'nextRow',
            'nowCol', 'preCol', 'nextCol'
        ];
        if(!(methods instanceof Array))  methods = [methods];

        methods.forEach(method => {
            let _cnt = cnt || 10000;
            console.time(method);
            while (_cnt--) {
                this[method](ele)
            }
            console.timeEnd(method);
        });
    }

    cacheEle(ele, key, valFn) {
        // return val;
        if (!(valFn instanceof Function)) valFn = ()=> valFn;
        let val = ele instanceof jQuery ? ele[0][key] : ele[key];
        return ele instanceof jQuery
            ? (val || val === 0) ? val : ele[0][key] = valFn()
            : (val || val === 0) ? val : ele[key] = valFn();
    }

    /**
     * @deprecated
     * @param target
     * @returns {*}
     */
    canAddContent(target) {
        return true;
        //eturn target.parent().parent().find('cursor').size();
    }

    canAppendCursor(target) {
        return this.cacheEle(target, "canAppendCursor", ()=>target.is(CONST.CSS_CLAZ_EDITABLE_COLOR)
            || this.nowAll(target).is(CONST.CSS_CLAZ_EDITABLE_COLOR));
    }

    getKeyboardAddContentVal(val) {
        if (val === undefined || val === null) val = "";

        if (!val.match(/[0-9]/)) { // 键盘非数字输入的情况下，进行符号匹配。
            for (let symbol in mergedExpressionSet) {
                let expression = mergedExpressionSet[symbol];
                let expr = expression.expr ? expression.expr : expression;

                if (val.match(new RegExp(expr))) {
                    let directiveName = expression.directive ? expression.directive : "mathjax-parser";
                    val = this.$compile(`<span ${directiveName} value=${val}></span plus>`)(this.getScope());
                    break;
                }
            }
        }
        return val;
    }

    getCursorDirection(ele, negDirection = 1) {
        return negDirection * (this.hasVerticalLineBefore(ele)
                ? CONST.APPEND_CURSOR_PRE
                : CONST.APPEND_CURSOR_NEXT)
    }

    hasVerticalLineBefore(ele) {
        let eleP = ele.parent().parent();
        while ((eleP = eleP.prev()).size()) {
            if (eleP.has(".vfline").size())
                return true;
        }
        return false;
    }

    getCellEle($element) {
        let clazz = CONST.CSS_MATCH_SPAN_CELL;
        if (!$element.is) $element = $($element);
        if (!$element.is(clazz)) $element = $element.find(clazz);

        return $element;
    }




    setCellValue($element, val) {
        //if(!$element.cell) $element.cell = {};

        // let cell = $element.cell;
        let patterns = CONST.patterns;
        let method;
        let key;

        for (let i in patterns) {
            let pattern = patterns[i];
            if (val.match(pattern.match)) {
                if (val.match(pattern.del)) {
                    val = null;
                    //this.setCell($element, pattern.key, null);
                } else {
                    //this.setCell($element, pattern.key, pattern.val);
                }
                // cell[pattern.key] = pattern.val;

                key = pattern.key;
                method = pattern.method;
                break;
            }
        }
        if(!method) {
            //this.setCell($element, "val", val);
            key = "val";
            method = "watchVal";
        }

        vcm[method].call(this, $element, this, key, val, this.commonService);

        setVerticalAnswerMatrix($element, this, key, val);
    }
}


let setVerticalAnswerMatrix = ($element, ctrl, key, val)=>{
    if(val === undefined) return;

    $element = ctrl.nowEle($element);
    let r = +$element.attr('r');
    let c = +$element.attr('c');
    let uuid = ctrl.nowAll($element).parent().attr('uuid');

    let vam = ctrl.verticalService.verticalAnswerMatrix[uuid];
    if(!vam[r]) vam[r] = [];
    if(!vam[r][c]) vam[r][c] = {};

    //TODO get $elements index..
    if(val === null) {
        vam[r][c][key] = null;
        return;
    }

    vam[r][c][key] = val;
};


VerticalCtrl.$inject = [
    '$scope',
    '$element',
    '$compile',
    'verticalService'
];

export default VerticalCtrl;