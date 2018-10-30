import "angular";
import "./index.less";
import openCalssCtrl from './open_class01_ctrl'

angular.module('openClass01', [])
    .directive('openClass01', ['$compile', '$window', function ($compile, $window) {
        return {
            district: "AE",
            scope: true,
            template: require('../templates/canvas.html'),
            controller: openCalssCtrl,
            controllerAs: 'ctrl',
            /* controller: ['$scope', function ($scope) {
             $scope.textContent = {
             expr: '',
             inputBoxUUID: ''
             };
             this.lineDatas = [];
             this.tableDatas = [];
             this.context = null;
             this.tempX = 0;
             this.tempY = 0;
             let isTouch = !!('ontouchstart' in $window);
             this.PAINT_START = isTouch ? 'touchstart' : 'mousedown';
             this.PAINT_MOVE = isTouch ? 'touchmove' : 'mousemove';
             this.PAINT_END = isTouch ? 'touchend' : 'mouseup';
             this.configData = {
             width: 350,
             height: 450,
             cellX: 50,
             cellY: 50,
             countX: 10,
             countY: 10
             };

             /!**
             *生成矩阵
             *!/
             this.genTableData = ()=> {
             for (let i = 0; i < this.configData.countY; i++) {
             for (let j = 0; j < this.configData.countX; j++) {
             this.tableDatas.push([j * this.configData.cellX, i * this.configData.cellX]);
             }
             }
             };

             /!**
             * 获取html中的配置信息
             * 解析传入的画线数据
             *!/
             this.getConfig = ()=> {
             this.context = this.canvas.getContext("2d");
             this.context1 = this.canvas.getContext("2d");
             this.configData.width = this.configData.cellX * (this.configData.countX + 1);
             this.configData.height = this.configData.cellY * (this.configData.countY + 1);
             this.canvas.width = this.configData.width;
             this.canvas.height = this.configData.height;
             this.lineDatas = [[[200, 50], [200, 100], [200, 150]], [[200, 50], [250, 50], [300, 50]]]
             this.genTableData();
             };

             /!**
             * 生成已画的数据
             * @param config
             * @returns {string}
             *!/
             this.genUIByConfig = (config)=> {
             this.genUiTable();
             this.drawLineByConfigData()
             };

             /!**
             * 生成格子图
             *!/
             this.genUiTable = ()=> {
             this.context.fillStyle = "#aadd33";
             this.context.strokeStyle = "#aadd33";
             this.context.lineWidth = 1;
             for (let i = 0; i < this.tableDatas.length; i++) {
             if (i % this.configData.countX == 0) {
             this.context.moveTo(this.tableDatas[i][0], this.tableDatas[i][1]);
             } else {
             this.context.lineTo(this.tableDatas[i][0], this.tableDatas[i][1]);
             }
             }
             for (let i = 0; i < this.configData.countX; i++) {
             let startIndex = i;
             let endIndex = this.configData.countX * (this.configData.countY - 1) + i;
             this.context.moveTo(this.tableDatas[startIndex][0], this.tableDatas[startIndex][1]);
             this.context.lineTo(this.tableDatas[endIndex][0], this.tableDatas[endIndex][1]);
             }

             this.context.stroke();


             };
             /!**
             * 根据线段画线
             *!/
             this.drawLineByData = (line)=> {
             if (!line || line && line.length == 0) return;
             this.context1.strokeStyle = "#8877dd";
             this.context1.lineWidth = 2;
             this.context1.beginPath(); //必须加盖方法才能有不同颜色
             this.context1.moveTo(line[0][0], line[0][1]);
             for (let i = 1; i < line.length; i++) {
             this.context1.lineTo(line[i][0], line[i][1]);
             }
             this.context1.stroke();
             };

             /!**
             * 根据线段画线
             *!/
             this.drawLineByConfigData = (line)=> {
             if (!this.lineDatas || this.lineDatas && this.lineDatas.length == 0) return;
             this.context1.strokeStyle = "#8877dd";
             this.context1.lineWidth = 2;

             for (let i = 0; i < this.lineDatas.length; i++) {
             this.drawLineByData(this.lineDatas[i]);
             }
             };


             /!**
             * 记录答案到scope上
             * *!/
             this.lineRecord = ()=> {
             $scope.textContent.expr = this.answerStr;
             }

             /!**
             * 处理事件
             * 画线
             *!/
             this.mousedownEvent = (e)=> {

             e = e || event;
             var x = e.clientX - this.canvas.offsetLeft;
             var y = e.clientY - this.canvas.offsetTop;
             var minPoint = this.finePoint(x, y);
             this.lineDatas.push([[minPoint[0], minPoint[1]]]);
             this.tempX = minPoint[0];
             this.tempY = minPoint[1];
             this.canvas.removeEventListener(this.PAINT_MOVE, this.mousemoveEvent);
             this.canvas.addEventListener(this.PAINT_MOVE, this.mousemoveEvent);
             };

             this.mousemoveEvent = (e)=> {
             e = e || event;
             var x = e.clientX - this.canvas.offsetLeft;
             var y = e.clientY - this.canvas.offsetTop;
             let len = this.lineDatas.length;
             var len1 = this.lineDatas[len - 1].length;
             if (len1 == 0 || len == 0) return;
             let xdiff = this.tempX - x;
             let ydiff = this.tempY - y;
             let dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
             if (dis <= this.configData.cellX / 2) {
             return;

             } else {
             var minPoint = this.finePoint(x, y);
             if (this.tempX != minPoint[0] && this.tempY != minPoint[1]) return;
             this.drawLineByData([minPoint, [this.tempX, this.tempY]]);
             this.lineDatas[len - 1].push(minPoint);
             this.tempX = minPoint[0];
             this.tempY = minPoint[1];
             }
             };

             this.mouseupEvent = (e)=> {
             this.canvas.removeEventListener(this.PAINT_MOVE, this.mousemoveEvent);
             console.log(JSON.stringify(this.lineDatas));
             };

             /!**
             * 查找最近的点
             *!/
             this.finePoint = (x, y)=> {

             var minPoint = [];
             var s = -1;

             for (let i = 0; i < this.tableDatas.length; i++) {
             let xdiff = this.tableDatas[i][0] - x;
             let ydiff = this.tableDatas[i][1] - y;
             let dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
             if (dis <= s || s == -1) {
             s = dis;
             minPoint = [this.tableDatas[i][0], this.tableDatas[i][1]];
             }
             }
             return minPoint;
             };


             this.initListeners = () => {
             this.canvas.addEventListener(this.PAINT_START, this.mousedownEvent);
             this.canvas.addEventListener(this.PAINT_END, this.mouseupEvent);
             };

             $scope.replyDraw = ()=> {
             let line = this.lineDatas.pop();
             this.context1.clearRect(0, 0, this.canvas.width, this.canvas.height);
             this.genUiTable();
             this.drawLineByConfigData();

             };

             $scope.clearDraw = ()=> {
             this.lineDatas.length = 0;
             this.context1.clearRect(0, 0, this.canvas.width, this.canvas.height);
             this.genUiTable();
             };

             }],*/
            link(scope, element, attr, ctrl) {
                ctrl.element = element;
                // ctrl.canvas = element.find('canvas')[0];

                let config = ctrl.getConfig(element);
                ctrl.genUIByConfig(config);

                ctrl.initListeners();
                scope.$watch('textContent.expr', (newVal, oldVal)=> {
                    /* if (newVal && ctrl.loadImgCount == ctrl.imgNum) {
                     ctrl.drawMatchLineByData();
                     }*/
                })
            }
        }
    }]);

