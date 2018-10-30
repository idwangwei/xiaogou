/**
 * Created by LuoWen on 2016/8/2.
 */

import verticalCtrl from './verticalCtrl'
import CONST from '../vfconst'


export default ["$compile",($compile)=>{
    let _scope ={
        qbi: {
            uuid: '@',
            matrix: "=?"
        },
        stu: {
            uuid: '=?',
            matrix: "=?"
        },
        qbp: {
            uuid: '@',
            matrix: "=?"
        }
    };

    return {
        restrict: 'E',
        scope: _scope[CONST.CURRENT_PLATFORM],
        template: `<div class="vertical-container" ng-mousedown="ctrl.verticalOnClick($event)"></div>`,
        controller: verticalCtrl,
        controllerAs: 'ctrl',
        link: function ($scope, $element, $attr, ctrl) {
            console.log("link...");
            ctrl.$element=$element;

            // $scope.$watch("uuid", (val)=> {
            //     watchUUID($scope, $element, $attr, ctrl, val);
            // });

            if(CONST.IS_STU){
                let uuid = "uuid-" + (new Date().getTime());
                $element.attr('uuid', uuid);
                $scope.uuid = uuid;
                $scope.type = CONST.MATRIX_TYPE_CALC;
                // ctrl.verticalService.cell[uuid] = stuMatrix;
            }

            // let val = ctrl.verticalService.cell[$scope.uuid];
            watchUUID($scope, $element, $attr, ctrl, $scope.uuid);

            $scope.$on("$destroy", ($scope) => {
                ctrl.verticalService.matrixCached[$scope.currentScope.uuid] = undefined;
                ctrl.verticalService.cell[$scope.currentScope.uuid] = undefined;
            });
            // console.log("row", $scope.row);
            // $scope.ctrl = verticalCtrl;
        }
    };
}];

let watchUUID = ($scope, $element, $attr, ctrl, uuid) => {
    if(uuid === undefined) return;

    console.log("watch", uuid);
    if(!CONST.IS_QBP && ctrl.verticalService.matrixCached[uuid]) {return;}

    let matrix;
    matrix = ctrl.verticalService.cell[uuid];
    let matrixType = $scope.type || getMatrixType(matrix);
    ctrl.verticalService.matrixCached[uuid] = {
        type: matrixType,
        matrix: matrix
    };

    // make matrix elements
    let matrixContainer = ctrl.verticalService.makeMatrixContainer($element, 10, uuid);

    let matrixSpans = matrixContainer.find('span');
    applyMatrix(matrix, matrixContainer, matrixSpans, ctrl); // apply matrix data
    applyMatrixType(matrixContainer, matrixSpans, ctrl, matrixType); // apply matrix type
};

let applyMatrix = (matrix, matrixContainer, matrixSpans, ctrl) => {
    if(!matrix) return;

    let m = matrix;
    const LEN = matrixContainer.children().size();
    for (let r = 0; r < m.length; r++) {
        for (let c = m[r].length - 1; c >= 0; c--) {
            let cell = m[r][c], _val;
            if (!Object.keys(cell).length) continue;

            if(cell['val']) {
                _val = cell['val'];
                ctrl.setCellValue(matrixSpans.eq(r * LEN + c), _val);
            }

            CONST.patterns.forEach(pat => {
                _val = undefined;
                if (pat.key !== 'val' && cell[pat.key]) {
                    _val = pat.match.toString().replace(/\//g, '');
                    ctrl.setCellValue(matrixSpans.eq(r * LEN + c), _val);
                }
            });
        }
    }
};

let applyMatrixType = (matrixContainer, matrixSpans, ctrl, matrixType) => {
    if(matrixType === CONST.MATRIX_TYPE_CALC) {
        matrixContainer.addClass(CONST.CSS_NAME_EDITABLE_COLOR)
            .addClass(CONST.CSS_NAME_CONTAINER_BORDER);
    } else if (matrixType === CONST.MATRIX_TYPE_BLANKS) {
        // matrixContainer.addClass(CONST.CSS_NAME_EDITABLE_COLOR);
        matrixContainer.find(CONST.CSS_CLAZ_CELL_BORDER)
            .addClass(CONST.CSS_NAME_EDITABLE_COLOR);
    }
};

let getMatrixType = (matrix) => {
    console.info("no $scope.type. 没有传入竖式类型");

    let type=CONST.MATRIX_TYPE_CALC;

    for(let r in matrix) {
        for(let c in matrix[r]) {
            if(matrix[r][c].val === '?') {
                return CONST.MATRIX_TYPE_BLANKS;
            } else if(matrix[r][c].val) {
                type = CONST.MATRIX_TYPE_ERROR;
            }
        }
    }

    return type;
};

let stuMatrix =[
    [{},{"val":"?","dot":1},{"val":"2"},{"val":"?"},{},{}],
    [{"line":true,'val':"\\times"},{"line":true},{"val":"?","dot":1,"line":true},{"val":"5","line":true},{},{}],
    [{},{"val":"6"},{"val":"1"},{"val":"5"},{},{}],
    [{"line":true},{"val":"?","line":true},{"val":"4","line":true},{"val":"?","line":true}],
    [{"val":"4","dot":1},{"val":"3"},{"val":"?"},{"val":"?"},{},{}]
];

