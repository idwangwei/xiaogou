/**
 * Created by ZL on 2017/3/28.
 */

class openClass01Ctrl {

    constructor($scope) {
        this.$scope = $scope;
        // super(arguments);
        this.initData();
    }

    initData() {
        this.$scope.textContent = {
            expr: '',
            inputBoxUUID: ''
        };
        this.lineDatas = [];
        this.tableDatas = [];
        this.context = null;
        this.tempX = 0;
        this.tempY = 0;
        this.PAINT_START = 'mousedown';
        this.PAINT_MOVE = 'mousemove';
        this.PAINT_END = 'mouseup';
        this.configData = {
            width: 350,
            height: 450,
            cellX: 50,
            cellY: 50,
            countX: 10,
            countY: 10
        };
        this.mouseMoveFlag = false;
    }


    /**
     *生成矩阵
     */
    genTableData() {
        for (let i = 0; i < this.configData.countY; i++) {
            for (let j = 0; j < this.configData.countX; j++) {
                this.tableDatas.push([j * this.configData.cellX, i * this.configData.cellX]);
            }
        }
    };

    /**
     * 获取html中的配置信息
     * 解析传入的画线数据
     */
    getConfig(element) {
        this.canvas = element.find('canvas')[0];
        this.context = this.canvas.getContext("2d");
        this.configData.width = this.configData.cellX * (this.configData.countX - 1);
        this.configData.height = this.configData.cellY * (this.configData.countY - 1);
        this.canvas.width = this.configData.width;
        this.canvas.height = this.configData.height;
        this.lineDatas = [[[200, 50], [200, 100], [200, 150]], [[200, 50], [250, 50], [300, 50]]];
        this.genTableData();
    };

    /**
     * 生成已画的数据
     * @param config
     * @returns {string}
     */
    genUIByConfig(config) {
        this.genUiTable();
        this.drawLineByConfigData()
    };

    /**
     * 生成格子图
     */
    genUiTable() {
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

    drawLineByData(line) {
        if (!line || line && line.length == 0) return;
        this.context.strokeStyle = "#8877dd";
        this.context.lineWidth = 2;
        this.context.beginPath(); //必须加盖方法才能有不同颜色
        this.context.moveTo(line[0][0], line[0][1]);
        for (let i = 1; i < line.length; i++) {
            this.context.lineTo(line[i][0], line[i][1]);
        }
        this.context.stroke();
    };

    /**
     * 根据线段画线
     */
    drawLineByConfigData(line) {
        if (!this.lineDatas || this.lineDatas && this.lineDatas.length == 0) return;
        this.context.strokeStyle = "#8877dd";
        this.context.lineWidth = 2;

        for (let i = 0; i < this.lineDatas.length; i++) {
            this.drawLineByData(this.lineDatas[i]);
        }
    };


    /**
     * 记录答案到scope上
     * */
    lineRecord() {
        this.$scope.textContent.expr = JSON.stringify(this.lineDatas);
    }

    /**
     * 处理事件
     * 画线
     */
    mousedownEvent(e) {
        console.log(this);
        e = e || event;
        var x = e.clientX - this.canvas.offsetLeft;
        var y = e.clientY - this.canvas.offsetTop;
        var minPoint = this.finePoint(x, y);
        this.lineDatas.push([[minPoint[0], minPoint[1]]]);
        this.tempX = minPoint[0];
        this.tempY = minPoint[1];
        this.mouseMoveFlag = true;
        // this.canvas.removeEventListener(this.PAINT_MOVE, this.mousemoveEvent);
        // this.canvas.addEventListener(this.PAINT_MOVE, this.mousemoveEvent);
    };

    mousemoveEvent(e) {
        if (!this.mouseMoveFlag) return;
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

    mouseupEvent(e) {
        this.mouseMoveFlag = false;
        // this.canvas.removeEventListener(this.PAINT_MOVE, this.mousemoveEvent);
        console.log(JSON.stringify(this.lineDatas));
    };

    /**
     * 查找最近的点
     */
    finePoint(x, y) {

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


    initListeners() {
        this.canvas.addEventListener(this.PAINT_START, this.mousedownEvent.bind(this));
        this.canvas.addEventListener(this.PAINT_END, this.mouseupEvent.bind(this));
        this.canvas.addEventListener(this.PAINT_MOVE, this.mousemoveEvent.bind(this));
    };

    replyDraw() {
        if (!this.lineDatas || this.lineDatas && this.lineDatas.length == 0) return;
        let line = this.lineDatas.pop();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.genUiTable();
        this.drawLineByConfigData();

    };

    clearDraw() {
        this.lineDatas.length = 0;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.genUiTable();
    };


}
openClass01Ctrl.$inject = [
    '$scope'
];
export default openClass01Ctrl;