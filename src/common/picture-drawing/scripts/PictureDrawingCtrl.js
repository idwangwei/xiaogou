/**
 * Created by LuoWen on 2017/1/9.
 */

import {CONST, EVENTS} from './PictureDrawingConfig'

let modelPencilSrc1 = require('../images/mode_1.png');
let modelPencilSrc2 = require('../images/mode_2.png');

class PictureDrawingCtrl {
    constructor($scope, $element, $timeout, $q, pictureDrawingService) {
        this.$element = $element;
        this.$timeout = $timeout;
        this.$q = $q;
        this.pictureDrawingService = pictureDrawingService;
        $scope.uuid = $element.attr('id');
        this.uuid = this.getUUIDPatern($scope);

        //右上角的输入模式
        this.modelPencilSrc1 = modelPencilSrc1; // 用笔
        this.modelPencilSrc2 = modelPencilSrc2; // 不用笔
        this.drawingMode = 2;

        console.log("init ctrl");
        this.share = this.pictureDrawingService.share[this.uuid] = {similarityNum: 0};

        this.getScope = ()=> {
            return $scope;
        }
    }

    undo() {
        this.version--;
        if(this.version <= 0) {
            this.undoAll();
            return;
        }

        this.$timeout(()=>{
            this.similarity();
        });
    }

    undoAll() {
        this.version = 0;

        this.$timeout(()=> {
            let mainDom = this.$element.find('canvas#main')[0];
            let ctxMain = mainDom.getContext('2d');
            ctxMain.clearRect(0, 0, mainDom.width, mainDom.height);

            this.similarity();
        });
    }

    commit() {
        let canvas = this.$element.find('canvas#main')[0];
        let ansDataUrl = canvas.toDataURL();

        console.log(ansDataUrl);
    }

    toggleAns() {
        this.isShowAns = !this.isShowAns;
        this.$element.find('canvas#ans').toggle();
    }

    toggleBtnAns() {
        if(!this.clickCnt) this.clickCnt = 0;
        this.isShowBtnAns = !(++this.clickCnt % 5);
    }

    toggleAccuracy() {
        this.accuracy = !this.accuracy;
        this.similarity();
    }

    similarityOld() {
        let tag = new Date().getTime();
        console.time(`[${tag}]`);
        let imgDataAns = this.getImageData('canvas#ans');
        let imgDataUsr = this.getImageData('canvas#main');
        let coordsAns = this.extractCoords(imgDataAns);
        let coordsUsr = this.extractCoords(imgDataUsr);
        let coordOffset = +this.coordOffset; //this.getCoordOffset(this.coordOffset);

        this.similarityNum = this.calcImgSimilarityV2(coordsAns, coordsUsr, coordOffset);
        console.timeEnd(`[${tag}]`);
        // this.similarityNumTest = this.calcImgSimilarityV2Test(coordsAns, coordsUsr, coordOffset);
        // this.$timeout(()=>this.getScope().$apply());
    }

    similarity(undoCache) {
        // let taskId = new Date().getTime();
        // console.time(`[${taskId}]`);
        let ctrl = this;
        ctrl.share.calculating = true;
        let imgDataAns = ctrl.getImageData('canvas#ans');
        let imgDataUsr = ctrl.getImageData('canvas#main');
        // let coordsAns = ctrl.extractCoords(imgDataAns);
        // let coordsUsr = ctrl.extractCoords(imgDataUsr);
        let coordOffset = +ctrl.coordOffset;
        let uuid = ctrl.uuid;

        ctrl.pictureDrawingService.calcImgSimilarityV2({uuid}, imgDataAns, imgDataUsr, coordOffset, undoCache)
            .then(({data})=> {
                ctrl.getScope().$emit(EVENTS.SAVE_SIMILARITY + ctrl.uuid, data);
            });
        // ctrl.similarityNum = ctrl.calcImgSimilarityV2();
        // console.timeEnd(`[${tag}]`)
        ctrl.$timeout(()=>ctrl.getScope().$apply());
    }

    /**

     elm = $('.pwContainer').eq(0)
     ctrl = angular.element(elm).scope().ctrl
     service = ctrl.pictureDrawingService
     worker = service.pdWorker
     worker.postMessage({options:{taskId: Date.now(), uuid: ctrl.uuid}, taskName:'extractCoords', args: [ctrl.getImageData('canvas#ans')]})

     ctrl.bgGridWidth = (147 / 4) * 1.1775

     */
    zoomInBgGrid(bgGridWidth) {


        let times = 5;
        // let svg = this.$element.find('svg');
        // let smallGrid = svg.find('#smallGrid');
        // let pathAOld = smallGrid.attr('width');
        // let width = +pathAOld + (isZoomIn ? times : times * -1);
        // let path = smallGrid.attr({width: w, height:w}).find('path');
        // let pathA = path.attr('d');
        // if(!pathA) throw new Error('no pathA');
        //
        // path.attr('d', pathA.replace(new RegExp(pathAOld, 'g'), width))


        let svg = this.$element.find('svg#bgGrid');
        let svgHtml = svg.html();
        let widthOld = svgHtml.match(/width="([\d\.]+)"/)[1];
        // let width = +widthOld + (isZoomIn ? times : times * -1);
        let width = (bgGridWidth || this.bgGridWidth);

        if(width<2) return;
        svg.html(svgHtml.replace(new RegExp(widthOld, 'g'), width));
    }


    getImageData(canvas) {
        if (typeof canvas === 'string') { //css selector
            canvas = this.$element.find(canvas)[0];
        }
        return canvas.getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height)
    }

    getUUIDPatern($scope) {
        // return $scope.uuid;
        return `${$scope.uuid}-${$scope.$id}`;
    }

    togglePencilMode() {
        if(this.drawingMode === 1) { //变为亮色，使用手指
            CONST.OFFSET_LEFT = 0;
            CONST.OFFSET_TOP = -100;
            CONST.TINY_MOVE_OFFSET_TOP = -2;
            CONST.DURATION = 2000;
            this.drawingMode = 2;
            
        } else if(this.drawingMode === 2){//变为灰色，使用笔
            CONST.OFFSET_LEFT = 0;
            CONST.OFFSET_TOP = 0;
            CONST.TINY_MOVE_OFFSET_TOP = 0;
            CONST.DURATION = 0;
            this.drawingMode = 1;
        }
    }
    
    adjustBgGrid() {
        let ctrl = this;
        ctrl.pictureDrawingService.extractCoords({uuid: ctrl.uuid}, ctrl.getImageData('canvas#ans'))
            .then(({data})=> {
                // console.log("data", data, arguments)
                let maxPointX = 0;
                data.forEach(function (pt) {
                    if (maxPointX < pt[1]) maxPointX = pt[1];
                });
                ctrl.getCanvasScale()
                    .then(({data:{scale, scaleGlobal}})=> {
                        let tinnyOffset = -3;
                        let gridNum = 8;
                        ctrl.zoomInBgGrid(((maxPointX + tinnyOffset) / gridNum) * scale / scaleGlobal);
                    });
            });
    }
    
    getCanvasScale() {
        let ctrl = this;
        return ctrl.pictureDrawingService.getCanvasProps(ctrl,
            [CONST.PROP_SCALE_GLOBAL, CONST.PROP_SCALE]);
    }
}

PictureDrawingCtrl.$inject = ["$scope", "$element", "$timeout", "$q", "pictureDrawingService"];


export default PictureDrawingCtrl;

/**

 imgdataTmp = $0.getContext('2d').getImageData(0, 0 , $0.width, $0.height)
 coordsTmp = extractCoords(imgdataTmp)

 imgdataAns = $0.getContext('2d').getImageData(0, 0 , $0.width, $0.height)
 coordsAns = extractCoords(imgdataAns)

 calcImgSimilarity(coordsTmp, coordsAns, 50)

 */