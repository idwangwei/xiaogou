/**
 * Created by LuoWen on 16/8/5.
 */
import CONST from './../vfconst'

export default ["$compile", "commonService", ($compile, commonService) => {
    return {
        restrict: "A",
        scope: {
            vc: '='
        },
        require: '^vertical',
        link: function($scope, $element, $attr, ctrl) {
            // TODO wrapper
            // let args = arguments;
            // let wrapper = (fn) => {
            //     return () => {
            //         fn.call(this, ...arguments, ...args);
            //     }
            // };
            // $scope.$watch('vc.linediv', wrapper(linediv));

            // let args = arguments;
            // $scope.$watch('vc.val',     function (val) {watchVal(...Array.from(args).slice(0, 4), arguments[0], commonService);});
            // $scope.$watch('vc.div',     function (val) {watchDiv(...Array.from(args).slice(0, 4), arguments[0], commonService);});
            // $scope.$watch('vc.dot',     function (val) {watchDot(...Array.from(args).slice(0, 4), arguments[0], commonService);});
            // $scope.$watch('vc.carry',   function (val) {watchCarry(...Array.from(args).slice(0, 4), arguments[0], commonService);});
            // $scope.$watch('vc.borrow',  function (val) {watchBorrow(...Array.from(args).slice(0, 4), arguments[0], commonService);});
            // $scope.$watch('vc.allclear',function (val) {watchAllClear(...Array.from(args).slice(0, 4), arguments[0], commonService);});
            // $scope.$watch('vc.line',    function (val) {watchLine(...Array.from(args).slice(0, 4), arguments[0], commonService);});
            // $scope.$watch('vc.linediv', function (val) {watchLineDiv(...Array.from(args).slice(0, 4), arguments[0], commonService);});
        }
    }
}];

let watchVal = ($scope, $element, $attr, ctrl, val) => {
    // console.log("vc.val..");
    $element = ctrl.getCellEle($element);
    $element.html(ctrl.getKeyboardAddContentVal(val));

    ctrl.appendCursor($element, ctrl.getCursorDirection($element));
    //getSpanVcVal($element).html(controller.getKeyboardAddContentVal(val));
};

let watchDiv = ($scope, $element, $attr, ctrl, val, commonService) => {

    if (!val) return;

    $element = ctrl.nowEle($element);

    //当前cell有val, 并且左边也有
    if(ctrl.getVal($element) && ctrl.getVal(ctrl.preEle($element))) {
        commonService.showAlert("提示", "添加除号的位置不对");

        //当前cell有val 并且左边没有
    } else if(ctrl.getVal($element) && !ctrl.getVal(ctrl.preEle($element))) {
        ctrl.preEle($element).addClass("vfdiv");

        do {
            ctrl.getCell($element).linediv = true;
            $element = ctrl.nextEle($element);
        } while (ctrl.hasVal($element) && !ctrl.rowEnd($element));

        //当前没有, 下一个有
    } else if(ctrl.getVal(ctrl.nextEle($element))) {
        $element.addClass("vfdiv");

        //当前没有, 上一个有
    } else if(ctrl.getVal(ctrl.preEle($element))) {
        commonService.showAlert("提示", "添加除号的位置不对");

        //上一个没有,当前没有,下一个没有
    } else {
        commonService.showAlert("提示", "请先写被除数")
    }

    // getSpanVcVal($element).html("丿");
    //console.log("div");
    //$element.html(controller.getKeyboardAddContentVal(val.val));
};

let watchDot = ($scope, $element, $attr, ctrl, val, commonService) => {
    if (val === undefined) return;

    if(val) {

    }
    $element = ctrl.nowEle($element);

    if(ctrl.getVal($element)) { //当前cell有val
        $element.addClass("vfdot");

    } else if(ctrl.getVal(ctrl.preEle($element))) { //当前无, 上一个有
        ctrl.preEle($element).addClass("vfdot");

    } else { //当前无,上一个无
        commonService.showAlert('提示', "请先写数字,再添加小数点!");
    }

    //console.log("dot");
    //$element.html(controller.getKeyboardAddContentVal(val.val));

};

let watchCarry = ($scope, $element, $attr, ctrl, val, commonService) => {

};

let watchBorrow = ($scope, $element, $attr, ctrl, val, commonService) => {

};

let watchAllClear = ($scope, $element, $attr, ctrl, val, commonService) => {
    if (!val) return;
    clearAllCells($scope.$parent);
};

let watchLine = ($scope, $element, $attr, ctrl, val, commonService) => {
    //console.log("line");
    $element = ctrl.getCellEle($element);

    if (val === undefined) {
        // console.log("line", val);
        return;
    }
    if (val) {
        // drawVFLine($element);
        $element.parent().addClass("vfline");

    } else {
        clearVFLine($element);
    }

    ctrl.appendCursor($element, CONST.APPEND_CURSOR_NEXT);

    //抵消光标错误移动
    //ctrl.appendCursor($element, ctrl.getCursorDirection($element, -1));
};

let watchLineDiv = ($scope, $element, $attr, ctrl, val, commonService) => {
    if(val === undefined) return;

    if(val) {
        ctrl.nowEle($element).parent().addClass("vfline-div");
    } else {
        ctrl.nowEle($element).parent().removeClass("vfline-div");
    }

};






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
