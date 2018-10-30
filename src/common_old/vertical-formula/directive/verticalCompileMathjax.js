/**
 * Created by LuoWen on 16/8/5.
 */
import CONST from './../vfconst'


let watchKbdDel = ($element, ctrl, KEY, val) => {
    if(val === undefined) return;

    $element = ctrl.nowEle($element);

    let direction = ctrl.hasCVal($element)
        ? CONST.APPEND_CURSOR_NO
        : CONST.APPEND_CURSOR_PRE;

    $element.html("");
    ctrl.setCell($element, KEY, null);

    ctrl.appendCursor($element, direction);
};

let watchVal = ($element, ctrl, KEY, val) => {
    if(val === undefined) return;

    if(val === null) {

        return;
    }

    $element = ctrl.nowEle($element);

    $element.html(ctrl.getKeyboardAddContentVal(val));
    ctrl.setCell($element, KEY, val);

    if(val === '?') {
        $element.addClass('vfcell-border');
        $element.html('');
    }

    ctrl.appendCursor($element, ctrl.getCursorDirection($element));
    //getSpanVcVal($element).html(controller.getKeyboardAddContentVal(val));
};

let watchDiv = ($element, ctrl, KEY,  val, commonService) => {
    if (val === undefined) return;

    $element = ctrl.nowEle($element);

    if(val === null) {
        ctrl.nowRow($element)
            .children()
            .removeClass("vfline-div")
            .removeClass("vfdiv");
        ctrl.nowRow($element)
            .children()
            .find(CONST.CSS_MATCH_SPAN_CELL)
            .each((k,child) => {
                ctrl.setCell($(child), KEY, null);
            });

        ctrl.appendCursor($element);
        return;
    }

    //当前cell有val, 并且左边也有
    if(ctrl.getCVal($element) && ctrl.getCVal(ctrl.preEle($element))) {
        commonService.showAlert("提示", "添加除号的位置不对");

        //当前cell有val 并且左边没有
    } else if(ctrl.getCVal($element) && !ctrl.getCVal(ctrl.preEle($element))) {
        ctrl.preEle($element).parent().addClass("vfdiv");
        ctrl.setCell(ctrl.preEle($element), KEY, val);

        do {
            ctrl.nowEle($element).parent().addClass("vfline-div");
            ctrl.setCell(ctrl.nowEle($element), KEY, val);

            $element = ctrl.nextEle($element);
        } while (ctrl.hasCVal($element) && !ctrl.rowEnd($element));

        //当前没有, 下一个有
    } else if(ctrl.getCVal(ctrl.nextEle($element))) {
        $element.parent().addClass("vfdiv");
        ctrl.setCell($element, KEY, val);

        $element = ctrl.nextEle($element);
        do {
            ctrl.nowEle($element).parent().addClass("vfline-div");
            ctrl.setCell(ctrl.nowEle($element), KEY, val);

            $element = ctrl.nextEle($element);
        } while (ctrl.hasCVal($element) && !ctrl.rowEnd($element));

        //当前没有, 上一个有
    } else if(ctrl.getCVal(ctrl.preEle($element))) {
        commonService.showAlert("提示", "添加除号的位置不对");

        //上一个没有,当前没有,下一个没有
    } else {
        commonService.showAlert("提示", "请先写被除数")
    }

    ctrl.appendCursor($element);
    // getSpanVcVal($element).html("丿");
    //console.log("div");
    //$element.html(controller.getKeyboardAddContentVal(val.val));
};

let watchDot = ($element, ctrl, KEY, val, commonService) => {
    if (val === undefined) return;

    $element = ctrl.nowEle($element);

    if(val === null) {
        $element.removeClass("vfdot");
        ctrl.setCell($element, KEY, null);

        ctrl.appendCursor($element);
        return;
    }

    if(ctrl.getCVal($element)) { //当前cell有val
        ctrl.nowRow($element)
            .children()
            .find(CONST.CSS_MATCH_SPAN_CELL)
            .each((i, child) => {
                $(child).removeClass("vfdot");
                ctrl.setCell($(child), KEY, null);
            });

        $element.addClass("vfdot");
        ctrl.setCell($element, KEY, val);

    } else if(ctrl.getCVal(ctrl.preEle($element))) { //当前无, 上一个有
        ctrl.nowRow($element)
            .children()
            .find(CONST.CSS_MATCH_SPAN_CELL)
            .each((i, child) => {
                $(child).removeClass("vfdot");
                ctrl.setCell($(child), KEY, null);
            });
        ctrl.preEle($element).addClass("vfdot");
        ctrl.setCell(ctrl.preEle($element), KEY, val);

    } else { //当前无,上一个无
        commonService.showAlert('提示', "请先写数字,再添加小数点!");
    }

    //console.log("dot");
    //$element.html(controller.getKeyboardAddContentVal(val.val));

    ctrl.appendCursor($element);
};

let watchCarry = ($element, ctrl, KEY, val, commonService) => {

};

let watchBorrow = ($element, ctrl, KEY, val, commonService) => {

};

let watchAllClear = ($element, ctrl, KEY, val, commonService) => {
    if (!val) return;
    clearAllCells($scope.$parent);
};

let watchLine = ($element, ctrl, KEY, val, commonService) => {
    if (val === undefined) {
        return;
    }

    $element = ctrl.getCellEle($element);

    if (val === null) {
        //clearVFLine($element);
        $element.parent().removeClass("vfline");
        ctrl.setCell($element, KEY, null);

        ctrl.appendCursor($element, CONST.APPEND_CURSOR_NEXT);
        return;
    }

    // drawVFLine($element);
    $element.parent().addClass("vfline");
    ctrl.setCell($element, KEY, val);

    ctrl.appendCursor($element, CONST.APPEND_CURSOR_NEXT);

    //抵消光标错误移动
    //ctrl.appendCursor($element, ctrl.getCursorDirection($element, -1));
};

let watchLineDiv = ($element, ctrl, KEY, val, commonService) => {
    if(val === undefined) return;

    if(val) {
        ctrl.nowEle($element).parent().addClass("vfline-div");
    } else {
        ctrl.nowEle($element).parent().removeClass("vfline-div");
    }

};
// setVerticalAnswerMatrix(this.verticalService, $element, key, val);







let drawVFLine = (ele) => {
    let children = ele.parent().parent().children();
    let _first = 0, _last = children.size() - 1;

    //first index
    let child = children.first();
    do {
        if (child.scope().c.val)
            break;
        _first++;
    } while ((child = child.next()).size());

    //last index
    child = children.last();
    do {
        if (child.scope().c.val)
            break;
        _last--;
    } while ((child = child.prev()).size());

    //drawing
    for (let i = _first; i <= _last; i++) {
        children.eq(i).addClass("vfline");
    }
};

let clearVFLine = ele => {
    ele.parent().parent().children().each((i, child)=> {
        $(child).removeClass("vfline");
    });
};

/**
 * 重置所有单元格
 * @param scope
 */
let clearAllCells = scope => {
    let matrix = scope.ctrl.verticalService.verticalMatrix;
    matrix.forEach((row)=> {
        row.forEach(col=> {
            col.val = null;
            col.div = null;
            col.borrow = null;
            col.carry = null;
            col.line = null;
            col.dot = null;
            col.allclear = null;

            col.line = null;
        });
    })
};

let getSpanVcVal = ($element)=>{
    let span = $('span.vc_val', $element);
    if (!span.size()) {
        span = $("<span>").addClass("vc_val").prependTo($element);
    }
    return span;
};

export default {
    watchAllClear,
    watchKbdDel,
        watchVal,
        watchDiv,
        watchBorrow,
        watchCarry,
        watchDot,
        watchLine,
        watchLineDiv,
};

