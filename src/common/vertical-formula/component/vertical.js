/**
 * Created by LuoWen on 2016/8/2.
 */

import verticalCtrl from './verticalCtrl'
import CONST from '../vfconst'

let makeVertical = require('../vue/vertical');

export default ["$injector", "$timeout", "$state", ($injector, $timeout, $state) => {
    let _scope = {
        release: {
            uuid: '@',
            matrix: "=?"
        },
        stu: {
            uuid: '=?',
            matrix: "=?"
        }
    };

    return {
        restrict: 'E',
        scope:true,
        // scope: _scope[CONST.CURRENT_PLATFORM],
        // scope:true,
        template: `<div id="vf-{{ctrl.uuid}}"></div>`,
        controller: verticalCtrl,
        controllerAs: 'ctrl',
        link: function ($scope, $element, $attr, ctrl) {
            $scope.uuid = $attr.uuid;
            let uuid = getUUIDPatern($scope);
            $element.attr("uuid", uuid);     //这个给自己用
            $element.attr("id", $attr.uuid); //这个给小龙用
            $scope.textContent = {expr: null};

            // $scope.matrix=$scope.$eval($attr.matrix);
            // return;

            // ctrl.addClickListeners($element);
            // $element = ctrl.convertAngularElement($element);

            if (CONST.IS_DEV) {
                let uuid = "uuid-" + (new Date().getTime());
                $element.attr('uuid', uuid);
                $scope.uuid = uuid;
                $scope.type = CONST.MATRIX_TYPE_CALC;

                //fillblanks
                $scope.type = CONST.MATRIX_TYPE_BLANKS;
                ctrl.verticalService.cell[uuid] = {
                    type: $scope.type,
                    matrix: stuMatrixTest3
                };
            }
            ctrl.uuid = uuid;
            let label = CONST.LABEL + ctrl.uuid;
            // console.profile(label);

            //初始化缓存Type
            if (!$scope.type) $scope.type = $attr.type;
            $scope.type = parseErrorType($scope.type, $attr);
            ctrl.type = $scope.type;

            let vsc = ctrl.verticalService.cell;
            if(!vsc[ctrl.uuid]) vsc[ctrl.uuid] = {};
            vsc[ctrl.uuid].type = ctrl.type;
            vsc[ctrl.uuid].ctrl = ctrl.ctrl;

            ctrl.$element = $element;
            ctrl.mathSymbol = null;
            // let val = ctrl.verticalService.cell[$scope.uuid];
            let isWatched = false;
            let unbindingWatch = $scope.$watch('textContent.expr', (newVal, oldVal, $scope)=> {
                // if(newVal === oldVal && !isWatched) return;
                if((newVal === null) && !isWatched) return; //"[]" 这个空数组是和小龙约定好了的.

                isWatched = true; //这个方法只执行一次
                watchUUID($scope, $element, $attr, ctrl, ctrl.uuid, [$injector, $timeout, $state]);

                unbindingWatch();
                unbindingWatch = undefined;
            });
            // afterLinkDirective($scope, $element, $attr, ctrl, $scope.uuid);
            // console.profileEnd(label);
            $scope.$on("$destroy", function destroyScope($scope) {

                let curScope = $scope.currentScope;
                // let uuid = curScope.uuid;
                let uuid = getUUIDPatern(curScope);
                let ctrl = curScope.ctrl;
                let vm = ctrl.verticalService.cell[uuid].vm;

                vm && vm.$destroy && vm.$destroy(true);

                // $('svg').remove();
                ctrl.verticalService.cell[uuid].vm = undefined;

                if(ctrl.verticalService.matrixCached[uuid]){
                    ctrl.verticalService.matrixCached[uuid].matrix = undefined;
                }
                ctrl.verticalService.matrixCached[uuid] = undefined;
                ctrl.verticalService.cell[uuid] = undefined;
                ctrl.verticalService.verticalAnswerMatrix[uuid] = undefined;


                // ctrl.$element.parent().parent().empty().remove();
                ctrl.$element.empty().remove(); //for GC 很重要! 不要删掉!!
                ctrl.verticalService = undefined;
                ctrl.$element = undefined;
                // curScope.$parent.element = undefined;
                curScope.element = undefined;
                curScope.ctrl = undefined;
                curScope.textContent= undefined;
                curScope.isAnswerMatrixModified = undefined;
                curScope.getVerticalAnswerMatrix = undefined;


                // $(`vertical[uuid=${uuid}]`).remove();
            });
            $scope.isAnswerMatrixModified = (answerMatrix)=> {
                return isAnswerMatrixModified(answerMatrix, ctrl);
            };
            $scope.getVerticalAnswerMatrix = ()=> {
                return getVerticalAnswerMatrix(ctrl);
            };
        }
    }
}];

let getUUIDPatern = ($scope)=> {
    // return $scope.uuid;
    return `${$scope.uuid}-${$scope.$id}`;
};

let parseErrorType = (type, $attr) => {
    if (type === CONST.MATRIX_TYPE_ERROR) {
        type = type.replace(/\d$/, '') + ($attr.preset ? 1 : 2);
    }
    return type;
};

let showRunTime = (matrixContainer, ctrl) => {
    if(!CONST.IS_SHOW_RUN_TIME) return;

    matrixContainer.css({'position': 'relative'})
        .append(
            $('<div class="vf-err-msg">').html(` ${new Date() - ctrl.timeStart} ms`)
        );
};

let watchUUID = ($scope, $element, $attr, ctrl, uuid, [$injector, $timeout, $state]) => {
    if (uuid === undefined) return;

    let verticalService = ctrl.verticalService;
    let matrix, matrixType, gradeInfo;

    if (!verticalService.cell[uuid]) verticalService.cell[uuid] = {};
    // matrix = getValidMatrix($element, ctrl, $attr);
    // matrix = getValidMatrixFromScope($scope);

    let inputBoxInfo = getInputBoxInfo($scope, $element);
    matrix = inputBoxInfo.matrix || $scope.textContent.expr;
    gradeInfo = inputBoxInfo.gradeInfo; //getGradeInfo($scope);// verticalService.cell[uuid].gradeInfo;
    matrixType = ctrl.type; //|| getMatrixType(matrix);
    // verticalService.cell['ctrl'] = ctrl;
    verticalService.matrixCached[uuid] = {
        type: matrixType,
        matrix: matrix,
        gradeInfo: gradeInfo,
    };

    // make matrix elements
    // let matrixRows = verticalService.makeMatrixContainer($element, matrix, uuid, matrixType, $attr);

    let dataLen = getDataLen(matrix, matrixType, $attr, ctrl);
    verticalService.initVerticalAnswerMatrixByUUID(uuid, dataLen, matrix);

    $timeout(()=>{
        let vm = makeVertical([$scope, $injector, $state], uuid, verticalService);
        verticalService.cell[uuid].vm = vm;
    });


    //!!!!!
    // let matrixSpans = matrixRows.find('span');
    // applyMatrix(matrix, matrixRows, matrixSpans, ctrl); // apply matrix data
    // applyMatrixType(matrixRows, matrixSpans, ctrl, matrixType, $attr); // apply matrix type
    // let matrixContainer = $('.vertical-container', $element).prepend(matrixRows);
    // applyMatrixType2(matrixContainer, matrixSpans,ctrl,matrixType,$attr);
    // applyMatrixCorrectness(matrixContainer, ctrl, gradeInfo);
    // showRunTime(matrixContainer, ctrl);
};

let getDataLen = (matrix, matrixType, $attr, ctrl) => {
    let colLen = 12,
        rowLen = getRowLen(colLen, matrix, matrixType, $attr);

    let dataLen = {
        rows: rowLen,
        cols: colLen
    };
    return Object.assign(ctrl.verticalService.verticalMatrixObj, dataLen);
};

let getRowLen = (colLen, matrix, matrixType, $attr) => {
    var rowLen = colLen;
    if (matrixType === CONST.MATRIX_TYPE_CALC ||
        matrixType === CONST.MATRIX_TYPE_ERROR_2) {
        return rowLen;
    }

    rowLen = (matrix && matrix.length) || colLen;

    // 填空题改为 css 控制
    // if (matrixType === CONST.MATRIX_TYPE_BLANKS) {
    //     let lastRow = matrix[matrix.length - 1];
    //     let isLastRowValEmpty = true;
    //     for (let c in lastRow) {
    //         if (c[CONST.VUE_KEY_VAUE])
    //             isLastRowValEmpty = false;
    //     }
    //     if (!isLastRowValEmpty) rowLen++;
    // }

    return rowLen < colLen ? rowLen :  colLen;
};

let afterLinkDirective = ($scope, $element, $attr, ctrl, uuid) => {
    hideCursor(ctrl);

    ctrl.needShowKeyboard = true;
};

let applyMatrix = (matrix, matrixRows, matrixSpans, ctrl) => {
    if (!matrix) return;

    let m = matrix;
    const LEN = 12;
    for (let r = 0; r < m.length; r++) {
        for (let c = m[r].length - 1; c >= 0; c--) {
            let cell = Object.assign({}, m[r][c]), _val;
            if (!Object.keys(cell).length) continue;

            clearLineIfNoVal(cell);

            if (cell['val']) {
                _val = cell['val'];
                ctrl.setCellValue(matrixSpans.eq(r * LEN + c), _val);
                cell['val'] = undefined;
            }
            /*else if (cell['dot']) {
             _val = CONST.KBD_INPUT_VALUE_DOT;
             ctrl.setCellValue(matrixSpans.eq(r * LEN + c), _val);
             delete cell['dot'];
             }*/

            CONST.patterns.forEach(pat => {
                // _val = undefined;
                if (/*pat.key !== 'val'
                     && pat.key !== 'dot'
                     && */cell[pat.key]) {
                    // _val = pat.match.toString().replace(/\//g, '');
                    ctrl.setCellValue(matrixSpans.eq(r * LEN + c), pat.kbdInputVal);
                }
            });
        }
    }

    function clearLineIfNoVal(cell) {
        if(cell[CONST.PATTERN_LINE_KEY]
            && (cell[CONST.PATTERN_VALUE_KEY] === null || cell[CONST.PATTERN_VALUE_KEY] == undefined)) {
            cell[CONST.PATTERN_LINE_KEY] = undefined;
        }
    }
};

let applyMatrixType = (matrixRows, matrixSpans, ctrl, matrixType, $attr) => {
    if (matrixType === CONST.MATRIX_TYPE_CALC) {
        //do nothing
    } else if (matrixType === CONST.MATRIX_TYPE_BLANKS) {
        matrixRows.find(CONST.CSS_CLAZ_CELL_BORDER)
            .addClass(CONST.CSS_NAME_EDITABLE_COLOR)
            .addClass(CONST.CSS_NAME_VF_CELL_SPACE);
        //如果是填空题, 就隐藏格子
        matrixRows.find(CONST.CSS_CLAZ_VERTICAL_CELL_GRID)
            .removeClass(CONST.CSS_NAME_VERTICAL_CELL_GRID);
    } else if (matrixType === CONST.MATRIX_TYPE_ERROR) {
        //do nothing
    }
};
let applyMatrixType2 = (matrixContainer, matrixSpans, ctrl, matrixType, $attr) => {
    if (matrixType === CONST.MATRIX_TYPE_CALC) {
        matrixContainer.addClass(CONST.CSS_NAME_EDITABLE_COLOR)
            .addClass(CONST.CSS_NAME_CONTAINER_BORDER);
    } else if (matrixType === CONST.MATRIX_TYPE_BLANKS) {
        //do nothing
    } else if (matrixType === CONST.MATRIX_TYPE_ERROR) {
        matrixContainer.addClass(CONST.CSS_NAME_CONTAINER_BORDER);
        if (!$attr.preset) {
            matrixContainer.addClass(CONST.CSS_NAME_EDITABLE_COLOR);
        }
    }
};

let getMatrixType = (matrix) => {
    console.info("no $scope.type. 没有传入竖式类型");

    let type = CONST.MATRIX_TYPE_CALC;

    for (let r in matrix) {
        for (let c in matrix[r]) {
            if (matrix[r][c].val === '?') {
                return CONST.MATRIX_TYPE_BLANKS;
            } else if (matrix[r][c].val) {
                type = CONST.MATRIX_TYPE_ERROR;
            }
        }
    }

    return type;
};

let applyMatrixCorrectness = (matrixContainer, ctrl, gradeInfo) => {
    // let ctrl = this.cell[uuid]['ctrl'];
    // let ele = ctrl.nowAll(ctrl.$element);
    if (!gradeInfo) return;

    // matrixContainer.addClass(gradeInfo.correctness ? CONST.CSS_NAME_CORRECT : CONST.CSS_NAME_WRONG);
    let $checkImgCon = $('<div class="checkImgCon">')
        .append(
            $('<div>').addClass(gradeInfo.correctness ? CONST.CSS_NAME_CORRECT : CONST.CSS_NAME_WRONG)
        )
        .append(
            $('<div class="vf-err-msg">').html(gradeInfo.msg)
        )
    matrixContainer.css({'position': 'relative'}).append($checkImgCon);
    // matrixContainer.attr('data-content', gradeInfo.msg);
};

let hideCursor = (ctrl) => {
    ctrl.cursor.hide();
};

let isAnswerMatrixModified = (answerMatrix, ctrl) => {
    return ctrl.verticalService.isAnswerMatrixModified(answerMatrix, ctrl.uuid);
};

let getVerticalAnswerMatrix = (ctrl)=> {
    return ctrl.verticalService.getVerticalAnswerMatrix(ctrl.uuid);
};

/**
 * 为了改错题的展示
 * @param $element
 * @param ctrl
 * @param $attr
 * @returns {*}
 */
let getValidMatrix = ($element, ctrl, $attr) => {
    let uuid = ctrl.uuid;
    let vsc = ctrl.verticalService.cell;

    // if(vsc.cachedDom) {
    //     if(vsc.cachedDom == $element && !$attr.preset) return;
    // } else {
    //     vsc.cachedDom = $element[0];
    // }

    return vsc[uuid].matrix;
};

/**
 * @deprecated
 */
let getValidMatrixFromScope = ($scope)=> {
    let expr = $scope.textContent.expr;

    if(!(expr instanceof Array)) {
        $scope.textContent.expr = [];
    }

    return;
};

let getInputBoxInfo=($scope, $element)=>{
    let gradeInfo = null;
    let matrix = null;
    let $parentScope = $scope.$parent;
    let getElementScope = (verticalId) => $element.parent().parent().find(`#${verticalId}`).scope();

    $parentScope.currentQInput.find((spInfo)=> {
        return spInfo.spList.find((inputBoxInfo)=> {
            if (inputBoxInfo.matrix && (inputBoxInfo.inputBoxUuid == $scope.uuid)) {

                if ($scope.showType == 'correct') { //显示判断信息
                    gradeInfo = {
                        correctness: spInfo.correctness,
                        msg: spInfo.application
                    }
                }

                if (inputBoxInfo.presetMatrixInfo) { //为竖式改错的错误竖式赋值
                    let presetMatrixInfo = inputBoxInfo.presetMatrixInfo;
                    let verticalId = presetMatrixInfo.verticalId;
                    let presetMatrixScope = getElementScope(verticalId);
                    presetMatrixScope.textContent.expr = presetMatrixInfo.matrix;
                    // matrix = inputBoxInfo.presetMatrixInfo.matrix;
                }

                return true;
            } else if(spInfo.type === "verticalErr") {
                getElementScope(inputBoxInfo.inputBoxUuid).textContent.expr = inputBoxInfo.inputBoxStuAns;
            }
        });
    });

    return {gradeInfo, matrix};
};

/**
 * @deprecated
 * @param $scope
 * @returns {{}}
 */
let getGradeInfo = ($scope)=> {
    let gradeInfo = {};
    let $parentScope = $scope.$parent;
    $parentScope.currentQInput.find((spInfo)=> {
        return spInfo.spList.find((inputBoxInfo)=> {
            if(inputBoxInfo.matrix) {
                if($scope.showType == 'correct') {
                    return gradeInfo = {
                        correctness: spInfo.correctness,
                        msg: spInfo.application
                    };
                }
            }
        });
    });

    return gradeInfo;
};

let stuMatrix = [
    [{}, {"val": "2", "dot": 1, 'cellEditable': true}, {"val": "2"}, {"val": "?"}, {}, {}],
    [{"line": true, 'val': "\\times"}, {"line": true}, {"val": "1", "line": true}, {"val": "3", "line": true}, {}, {}],
    [{}, {"val": "6"}, {"val": "6"}, {"val": "9"}, {}],
    [{"val": "?", "line": true}, {"val": "2", "line": true}, {"val": "?", "line": true}, {"line": true}],
    [{"val": "?"}, {"val": "?"}, {"val": "9"}, {"val": "?"}, {}, {}]
];

let stuMatrixTest2 = [[{}, {"val": "1"}, {"val": "1"}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{"val": "+", "line": 1}, {"val": "1", "line": 1}, {
        "val": "6",
        "cellEditable": true,
        "line": 1
    }, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {"val": "2"}, {
        "val": "9",
        "cellEditable": true
    }, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]];

let stuMatrixTest3 = [[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {
        "val": "6",
        "cellEditable": true,
        "line": 1
    }, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]];

