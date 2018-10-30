/**
 * Created by lW on 2016/8/3.
 */

import CONST from '../vfconst';
// import BaseService from '../../base_components/base_service'

//Singleton
export default class VerticalService /*extends BaseService */ {

    constructor() {
        // super(arguments);

        this.verticalAnswerMatrix = {}; //output to peng
        this.cell = {};  //{uuid:{matrix: matrix}}


        this.verticalMatrix = [];
        this.verticalMatrixObj = {
            rows: 0,
            cols: 0
        };
        this.currentCursorPos = null;

        this.matrixCached = {type: null, matrix: null};
        //this.getVerticalMatrix();
        this.initVueData = {
            // hasStyleLine: false,
            val: undefined, //"",
            hasStyleDiv: false, //false,
            hasStyleDivLine: undefined, //false,
            line: undefined, //0,
            dot: undefined, //0,
            borrow: undefined, //0,
            carry1: undefined, //0,
            carry2: undefined, //0,
            carry3: undefined, //0,
            carry4: undefined, //0,
            carry5: undefined, //0,
            carry6: undefined, //0,
            carry7: undefined, //0,
            carry8: undefined, //0,
            curCur: undefined, //false,
        };
        this.initVueDataNoReset = {
            hasStyleCellWrapperPadding: false,
            hasStyleCellBorder: false,
            hasStyleEditableColor: false,
            hasStyleCellGrid: true,
            cellEditable: false,
        };
        this.initVueDeadData = {
            mathSymbolType: ""
        };
    }

    // setCurrentCursor(target) {
    //     this.currentCursorPos = target;
    // }

    getVerticalMatrix() {
        //TODO   fetch matrix object
        this.$timeout((data)=> {
            //let vmd = verticalMatrixData.verticalMatrix;
            let vmd = verticalMatrixData.qbiMatrix;
            let len = vmd.length > vmd[0].length ? vmd.length : vmd[0].length;
            // let len = 9;
            data = {
                rows: len,
                cols: len
            };
            Object.assign(this.verticalMatrixObj, data);

            this.makeVerticalRowsCols();

        }, 0);
    }

    makeVerticalRowsCols(ele) {
        let verticalHtml = "";
        console.log("this.verticalMatrixObj", this.verticalMatrixObj);
        for (let r = 0; r < this.verticalMatrixObj.rows; r++) {
            verticalHtml += `<div class="vertical-row">`;
            for (let c = 0; c < this.verticalMatrixObj.cols; c++) {
                verticalHtml += `
                    <vertical-cell class="${CONST.CSS_NAME_VERTICAL_CELL_GRID}">
                        <span class="vertical-cell" r="${r}" c="${c}"></span>
                    </vertical-cell>`;
            }
            verticalHtml += `</div>`;
        }

        /*let gradeInfoHtml = `<div class="vertical-grade-info">竖式格式不正确!</div>`;*/

        return $(verticalHtml)
        // .append($(gradeInfoHtml));
    }

    // getRowLen(colLen, matrix, matrixType, $attr) {
    //     var rowLen = colLen;
    //     if (matrixType === CONST.MATRIX_TYPE_CALC ||
    //         (matrixType === CONST.MATRIX_TYPE_ERROR && !$attr.preset)) {
    //         return rowLen;
    //     }
    //
    //     rowLen = (matrix && matrix.length) || colLen;
    //     if(matrixType === CONST.MATRIX_TYPE_BLANKS) {
    //         rowLen++;
    //     }
    //
    //     return rowLen < colLen ? rowLen :  colLen;
    // }
    //
    // makeMatrixContainer(ele, matrix, uuid, matrixType, $attr) {
    //     //let len = matrix.length > matrix[0].length ? matrix.length : matrix[0].length;
    //     // let len = 10;
    //     let colLen = 12,
    //         rowLen = this.getRowLen(colLen, matrix, matrixType, $attr);
    //
    //     let dataLen = {
    //         rows: rowLen,
    //         cols: colLen
    //     };
    //     Object.assign(this.verticalMatrixObj, dataLen);
    //
    //     this.initVerticalAnswerMatrixByUUID(uuid, dataLen);
    //     return this.makeVerticalRowsCols(ele);
    //     //let verticalContainer = this.makeVerticalRowsCols(ele);
    //     //this._applyMatrix(verticalContainer)
    // }

    // initVerticalAnswerMatrixByUUID(uuid, dataLen) {
    //     let m = [];
    //     for (let r = 0; r < dataLen.rows; r++) {
    //         m.push([]);
    //         for (let c = 0; c < dataLen.cols; c++) {
    //             m[r].push({});
    //         }
    //     }
    //     return this.verticalAnswerMatrix[uuid] = m;
    // }

    initVerticalAnswerMatrixByUUID(uuid, dataLen, matrix) {
        let m = [];
        for (let r = 0; r < dataLen.rows; r++) {
            m.push([]);
            for (let c = 0; c < dataLen.cols; c++) {
                // let temp = Object.assign({r: r, c: c}, this.initVueData);
                // temp = Object.assign(temp, this.initVueDataNoReset);
                let temp = {r: r, c: c, "hasStyleDiv": false, val: undefined};
                if(matrix && matrix.length){
                    let merged = Object.assign(temp, matrix[r] ? matrix[r][c]: {});
                    merged.curCur = false; //clean vam cursor
                    m[r].push(merged)
                } else {
                    m[r].push(temp);
                }
            }
        }
        return this.verticalAnswerMatrix[uuid] = m;
    }

    /**
     * 获取正在使用的vam
     * @param uuid
     */
    getOriginVerticalAnswerMatrix(uuid) {
        return this.verticalAnswerMatrix[uuid];
    }

    /**
     * 复制一个新的vam
     * @param uuid
     * @returns {Array}
     */
    getDupVerticalAnswerMatrix(uuid) {
        let m = this.verticalAnswerMatrix[uuid];
        let ret = [];
        for (let r in m) {
            let row = [];
            for (let c in m[r]) {
                row.push(Object.assign({}, m[r][c]));
            }
            ret.push(row);
        }
        return ret;
    }

    /**
     * 创建一个新的空的vam
     * @param uuid
     * @returns {Array}
     */
    getEmptyVerticalAnswerMatrix(uuid) {
        let m = this.verticalAnswerMatrix[uuid];
        let ret = [];
        for (let r in m) {
            let row = [];
            for (let c in m[r]) {
                row.push(Object.create({}));
            }
            ret.push(row);
        }
        return ret;
    }

    /**
     * 重置 vam
     * @param uuid
     */
    resetVerticalAnswerMatrix(uuid) {
        this.verticalAnswerMatrix[uuid] = this.getEmptyVerticalAnswerMatrix(uuid);
    }


    /**
     * 外部调用的接口
     *


     ctrl  = angular.element($0).scope().ctrl
     var container = ctrl.nowAll($0)
     container.find('span.vertical-cell')
     var spans = container.find('span.vertical-cell')
     var rowLen = container.first().children().size();
     var output = []
     console.info('-----', 'cell data');
     spans.each(function(i, child){
      output.push(JSON.stringify($(child).data().cell || {}))
      if(output.length === rowLen) {
           //console.log(~~(i/rowLen), output.join());
           console.log(output.join());
           output = []
      }
    });
     console.info('-----', 'vam raw');
     var vam = ctrl.verticalService.verticalAnswerMatrix[ctrl.uuid];
     vam.forEach(function(v) { console.log(JSON.stringify(v));})
     console.info('-----', 'vam result');
     var vam2 = ctrl.verticalService.getVerticalAnswerMatrix(ctrl.uuid);
     vam2.forEach(function(v) { console.log(JSON.stringify(v));})


     //-------------------------


     ctrl  = angular.element($0).scope().ctrl
     console.info('-----', 'vam result');
     var vam2 = ctrl.verticalService.getVerticalAnswerMatrix(ctrl.uuid);
     vam2.forEach(function(v) { console.log(JSON.stringify(v));})


     *
     *
     *

     dot :1 0
     line: 1 0
     div -> val:\\div

     * @param uuid
     * @returns {*}
     */
    getVerticalAnswerMatrix(uuid) {

        //转化服务器认识的数据格式
        let m = this.verticalAnswerMatrix[uuid];
        let ret = this.getEmptyVerticalAnswerMatrix(uuid);
        // let ret = [];
        for (let r in m) {
            // let row = [];
            for (let c in m[r]) {
                let obj = Object.assign({}, m[r][c]);
                // let obj = m[r][c];
                // if ('dot' in obj) obj['dot'] = obj['dot'] ? 1 : 0; //dot
                // if ('line' in obj) obj['line'] = obj['line'] ? 1 : 0; //line
                // if ('carry' in obj) obj['carry'] = obj['carry'] ? 1 : 0; //carry
                // if ('carry2' in obj) obj['carry2'] = obj['carry2'] ? 1 : 0; //carry2
                // if ('borrow' in obj) obj['borrow'] = obj['borrow'] ? 1 : 0; //borrow
                //carry2
                // if ('carry2' in obj) {
                //     (obj['carry2'] = obj['carry2'] ? 2 : 0) &&
                //     (obj['carry'] = 2) &&
                //     (delete obj['carry2'])
                // }

                //去掉多余空格 for blanks
                // if(obj.val) obj.val = obj.val.trim();

                //除号和数字合并
                if(obj.hasStyleDiv) {
                    obj.val = obj.val ? obj.val + "#\\div" : "\\div";
                }

                //处理乘号
                if(obj.val === "×") {
                    obj.val = "\\times";
                }

                //填空题的格子
                if(obj.hasStyleEditableColor) {
                    obj.cellEditable = true;
                }

                //删除多余的key
                delete obj.hasStyleCellBorder;
                delete obj.hasStyleCellGrid;
                delete obj.hasStyleCellWrapperPadding;
                delete obj.hasStyleDiv;
                delete obj.hasStyleDivLine;
                delete obj.hasStyleEditableColor;
                delete obj.hasMarkDiv;
                delete obj.hasMarkLine;
                delete obj.curCur;
                delete obj.carry;
                delete obj.r;
                delete obj.c;
                for(let delKey in obj) {
                    if(!obj[delKey]) {
                        delete obj[delKey];
                    }
                }

                ret[r][c] = obj;
            }
        }
        return ret;
    }

    /**
     * 判断该竖式是否做过
     * @param answerMatrix 竖式矩阵
     * @param uuid 竖式框UUID
     * @returns {boolean}
     */
    isAnswerMatrixModified(answerMatrix, uuid) {
        if (!answerMatrix)
            answerMatrix = this.getVerticalAnswerMatrix(uuid);
        let type = this.cell[uuid].type;
        let rt = false;
        if (type == CONST.MATRIX_TYPE_ERROR_2 || type == CONST.MATRIX_TYPE_CALC) {//如果每个空都是一个空对象，则表示没有修改过，反之则修改过
            answerMatrix.forEach(row=> {
                row.forEach(col=> {
                    if (Object.keys(col).length)
                        rt = true;
                });
            })
        } else if (type == CONST.MATRIX_TYPE_BLANKS) {
            answerMatrix.forEach(row=> {
                row.forEach(col=> {
                    if (col.val !== CONST.QUESTION_MARK && col[CONST.KEY_CELL_EDITABLE]) {
                        rt = true;
                    }
                });
            })
        }
        return rt;
    }

}

VerticalService.$inject = [
    '$compile',
    '$timeout'
];


let verticalMatrixData = {
    "verticalMatrix": [
        [{}, {}, {}, {}, {}, {
            "val": "2",
            "dot": 1,
            "borrow": 1
        }, {"val": "5"}, {"val": "2"}, {"val": "1"}, {}, {}, {}, {}],
        [{}, {"val": "2", "dot": 1}, {"val": "8"}, {"val": "\\div"}, {
            "val": "7",
            "dot": 1
        }, {"val": "0"}, {"val": "6"}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {"val": "5"}, {"val": "6", "carry": 3}, {}, {}, {}, {}, {}, {}, {}],
        [{"val": "_"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {"val": "1"}, {"val": "4"}, {"val": "6"}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {"val": "1"}, {"val": "4"}, {"val": "0"}, {}, {}, {}, {}, {}, {}],
        [{"val": "_"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {"val": "6"}, {"val": "0"}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {"val": "5"}, {"val": "6"}, {}, {}, {}, {}, {}],
        [{"val": "_"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {"val": "4"}, {"val": "0"}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {"val": "2"}, {"val": "8"}, {}, {}, {}, {}],
        [{"val": "_"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {"val": "1"}, {"val": "2"}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    ],
    "qbiMatrix": [
        [{}, {"val": "1", "dot": 1}, {"val": "2"}, {"val": "3"}, {}, {}],
        [{}, {"line": true}, {"val": "?", "dot": 1, "line": true}, {"val": "5", "line": true}, {}, {}],
        [{}, {"val": "6"}, {"val": "1"}, {"val": "5"}, {}, {}],
        [{"line": true}, {"line": true}, {"line": true}, {"val": "3", "line": true}, {
            "val": "?",
            "line": true
        }, {"val": "9", "line": true}],
        [{"val": "4", "dot": 1}, {"val": "3"}, {"val": "?"}, {"val": "5"}, {}, {}]
    ]
};

/*
服务器需要的格式:

// 除
[{},{},{},{},{"val":"3"},{},{},{},{},{},{},{}]
[{},{},{"val":"4#\\div"},{"val":"1"},{"val":"4","dot":1},{"val":"4"},{},{},{},{},{},{}]
[{},{},{},{"val":"1","line":1},{"val":"2","line":1},{"line":1},{},{},{},{},{},{}]
[{},{},{},{},{"val":"2","dot":1},{"val":"4","carry1":1},{},{},{},{},{},{}]
[{},{},{},{},{"val":"2","carry8":1,"line":1},{"borrow":1,"val":"4","line":1},{},{},{},{},{},{}]
[{},{},{},{},{},{"val":"0"},{},{},{},{},{},{}]
[{},{},{},{},{},{},{},{},{},{},{},{}]

// 乘
[{},{},{},{"val":"\\times","line":1},{"line":1,"carry1":1},{"line":1,"carry1":1},{"val":"4","line":1},{},{},{},{},{}]

// 加
[{},{},{},{"val":"+","line":1},{"line":1,"carry1":1},{"line":1,"carry1":1},{"val":"4","line":1},{},{},{},{},{}]

// 减
[{},{},{},{"val":"-","line":1},{"line":1},{"line":1,"carry1":1},{"val":"4","line":1},{},{},{},{},{}]

 window.VERB && console.log("get: %s:%s\t%s\t", key, value, obj, obj);
 window.VERB && console.log("set: %s:%s -> %s\t%s\t", key, value, newVal, obj, obj);

*/