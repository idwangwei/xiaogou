/**
 * Created by lW on 2016/8/3.
 */

import CONST from '../vfconst';
// import BaseService from '../../base_components/base_service'

//Singleton
export default class VerticalService /*extends BaseService */{

    constructor() {
        // super(arguments);

        this.verticalAnswerMatrix = {}; //output to peng
        this.cell = {};  //{uuid:matrix}


        this.verticalMatrix = [];
        this.verticalMatrixObj = {
            rows: 0,
            cols: 0
        };
        this.currentCursorPos = null;

        this.matrixCached = {type:null, matrix:null};
        //this.getVerticalMatrix();
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
                    <vertical-cell>
                        <span class="vertical-cell" r="${r}" c="${c}"></span>
                    </vertical-cell>`;
            }
            verticalHtml += `</div>`;
        }

        return $('.vertical-container', ele).prepend($(verticalHtml));
    }

    makeMatrixContainer(ele, len, uuid) {
        //let len = matrix.length > matrix[0].length ? matrix.length : matrix[0].length;
        // let len = 10;
        let dataLen = {
            rows: len,
            cols: len
        };
        Object.assign(this.verticalMatrixObj, dataLen);

        this.initVerticalAnswerMatrixByUUID(uuid, dataLen);
        return this.makeVerticalRowsCols(ele);
        //let verticalContainer = this.makeVerticalRowsCols(ele);
        //this._applyMatrix(verticalContainer)
    }

    initVerticalAnswerMatrixByUUID(uuid, dataLen) {
        let m = [];
        for (let r = 0; r < dataLen.rows; r++) {
            m.push([]);
            for (let c = 0; c < dataLen.cols; c++) {
                m[r].push({});
            }
        }
        return this.verticalAnswerMatrix[uuid] = m;
    }


    getVerticalAnswerMatrix(uuid) {
        /*
          dot :1 0
          line: 1 0
          div -> val:\\div
        */

        //转化服务器认识的数据格式
        let m = this.verticalAnswerMatrix[uuid];
        for(let r in m) {
            for(let c in m[r]) {
                let obj = m[r][c];
                if('dot' in obj) obj['dot'] = obj['dot'] ? 1 : 0;
                if('line' in obj) obj['line'] = obj['line'] ? 1 : 0;
                if('div' in obj) obj['val'] = obj['div'] ? '\\div' : '';
            }
        }

        return m;
    }

}

VerticalService.$inject = [
    '$compile',
    '$timeout'
];


let verticalMatrixData = {
    "verticalMatrix": [
        [{}, {}, {}, {}, {}, {"val": "2","dot": 1,"borrow": 1}, {"val": "5"}, {"val": "2"}, {"val": "1"}, {}, {}, {}, {}],
        [{}, {"val": "2", "dot": 1}, {"val": "8"}, {"val": "\\div"}, {"val": "7","dot": 1}, {"val": "0"}, {"val": "6"}, {}, {}, {}, {}, {}, {}],
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
    "qbiMatrix" :[
        [{},{"val":"1","dot":1},{"val":"2"},{"val":"3"},{},{}],
        [{},{"line":true},{"val":"?","dot":1,"line":true},{"val":"5","line":true},{},{}],
        [{},{"val":"6"},{"val":"1"},{"val":"5"},{},{}],
        [{"line":true},{"line":true},{"line":true},{"val":"3","line":true},{"val":"?","line":true},{"val":"9","line":true}],
        [{"val":"4","dot":1},{"val":"3"},{"val":"?"},{"val":"5"},{},{}]
    ]
};

