/**
 * Created by LuoWen on 2017/2/22.
 */

/**************************************************************/
/**********************像素图相关方法****************************/
/**************************************************************/
import {CONST} from '../PictureDrawingConfig'
import connectivity from '../lib/connectivity'
import np from '../lib/numjs'
import PainterNode from './PainterNode'

/**

 ctx = $0.getContext('2d')
 ctrl = angular.element($0).scope().$parent.ctrl
 imgData = ctrl.getImageData($0)
 ctrl.log(imgData, 0.4)

 */

let Utils = {

    /**
     * 画出像素图
     * @param imgdata
     * @param hideRatio
     */
    log(imgdata, hideRatio) {
        var data = imgdata.data;
        var len = data.byteLength;
        var byteW = 4;
        var w = imgdata.width * byteW;
        var row = "0";
        hideRatio = hideRatio || 1;
        for (var i = 0; i < len; i += byteW) {
            if ((i % w) < w * hideRatio) continue;

            row += this.getColorObj(data, i).shape;

            /*if(data[i] || data[i+1] || data[i+2] || data[i+3] ) {
             row += '+'
             } else {
             row += '-'
             }*/
            if (i && (i % w === (imgdata.width - 1) * byteW)) {
                row += '\n';
                console.log(row);
                row = (i + 4) / w + ""
            }
        }
    },

    getImgIdx(coord, w) {
        return coord[0] * w + coord[1] * 4;
    },

    getCoord(imgIdx, w) {
        return [~~(imgIdx / w), ~~((imgIdx % w) / 4)]
    },

    getCoord2Str(imgIdx, w) {
        var coord = this.getCoord(imgIdx, w);
        return '(' + coord[0] + "," + coord[1] + ")"
    },

    calcCoordDistance(coord1, coord2) {
        return Math.sqrt(Math.pow(coord1[0] - coord2[0], 2) + Math.pow(coord1[1] - coord2[1], 2));
    },

    /**
     * 把画布上的图分离出有效的点
     * @param imgdata
     * @returns {Array}
     * [
     *   0, //x点
     *   0, //y点
     *   0, //偏移值
     *   0, //精度惩罚
     *   0, //最近的距离
     * ]
     */
    extractCoords(imgdata) {
        var data = imgdata.data;
        var len = data.byteLength;
        var byteW = 4;
        var w = imgdata.width * byteW;
        var coords = [];

        for (var i = 0; i < len; i += byteW) {
            if (data[i] || data[i + 1] || data[i + 2] || data[i + 3]) {
                let color = this.getColorObj(data, i);
                coords.push(this.getCoord(i, w) //点值
                    .concat(color.weight) //颜色权重
                    .concat(color.punish) //精度惩罚
                );
            }
        }

        return coords;
    },

    checkCoordsNearby(coordF, coordT, offset) {
        if(offset < 0) offset = 0; //offset 最小为0

        return Math.abs(coordF[0] - coordT[0]) <= offset
            && Math.abs(coordF[1] - coordT[1]) <= offset
    },

    calcImgSimilarityTest(imgFrom, imgTo, pixelOffset) {
        if (!imgFrom.length || !imgTo.length) return 0;

        var distances = [];
        imgFrom.forEach((coordO)=> {
            var dist, minDist = pixelOffset + 1;
            for (var i = 0; i < imgTo.length; i++) {
                if (minDist < pixelOffset) break;

                dist = this.calcCoordDistance(coordO, imgTo[i]);
                if (!i || dist < minDist) {
                    minDist = dist;
                }
            }
            distances.push(minDist);
        });

        pixelOffset = pixelOffset || 0;
        var wrongSet = distances.filter(c=>c > pixelOffset);

        return 1 - (wrongSet.length / imgFrom.length);
    },

    calcImgSimilarityV2Test(imgAns, imgUsr, pixelOffset) {
        if (!imgAns.length || !imgAns.length) return 0;

        if (imgAns.length > imgUsr.length) {
            return this.calcImgSimilarityTest(imgAns, imgUsr, pixelOffset);
        } else {
            return this.calcImgSimilarityTest(imgUsr, imgAns, pixelOffset);
        }
    },

    drawImg(src) {
        var image = new Image();
        image.onload = function () {
            let canvas = $('canvas#tmp')[0];
            let ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
        };
        image.src = 'img/BS/BS二年级上册/一单元/BS-3-1-3.测试/4.png'
    },

    getCoordOffset(offset) {
        return this.calcCoordDistance([0, 0], [offset, offset]);
    },

    drawLine(ctx, start, end) {
        ctx.restore();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke()
    },

    drawGrid(ctx, offset) {
        var c = ctx.canvas;
        var w = c.width, h = c.height;

        for (var i = 0; i < w; i += offset) {
            this.drawLine(ctx, [i * offset, 0], [i * offset, h])
        }
        for (var j = 0; j < h; j += offset) {
            this.drawLine(ctx, [0, j * offset], [w, j * offset])
        }
    },

    getColorObj(data, idx) {
        let color = CONST.COLORS.find((obj)=> {
            if ((obj.color[3] === data[idx + 3]) //透明
                || (this.getSimilarColor(obj.color[0], data[idx])
                && this.getSimilarColor(obj.color[1], data[idx + 1])
                && this.getSimilarColor(obj.color[2], data[idx + 2]))) {
                return obj;
            }
        });
        if (color === undefined) {
            color = CONST.COLORS_DEFAULT;
        }
        return color;
    },

    getSimilarColor(c1, c2, offset) {
        if (offset === undefined) offset = 50;
        return Math.abs(c1 - c2) < offset;
    },

    getColorWeight(colorObj) {
        return colorObj.weight;
    },

    getColorShape(colorObj) {
        return colorObj.shape;
    },

    /**
     * 4个颜色值合并为1个像素点
     * @param data
     */
    mergeCoords2Points({data}) {
        let vector = [];

        for (let i = 0; i < data.length; i += 4) {
            let p1 = data[i + 0],
                p2 = data[i + 1],
                p3 = data[i + 2],
                p4 = data[i + 3];
            vector.push(
                !!p4 //alpha
                    // ? (p1 === 255 && p2 === 255 && p3 === 255)
                    //     ? 0
                    //     : 1
                    // : 0
                    ? 1 : 0
                // ((data[i] + data[i + 1] + data[i + 2]) * data[i + 3]) ? 1 : 0
            )
        }

        return vector;
    },

    parsePainterNode([r, c, weight, punish]) {
        return new PainterNode(r, c, {weight, punish});
    },

    /**
     * 转为 PainterNode
     * @param vector
     * @param row
     * @param column
     */
    parsePainterNodeVector(vector, {row, column}) {
        let nodes = new Array(row);
        vector.map(([r, c, weight, punish])=> {
            if(!nodes[r]) nodes[r] = new Array(column);
            nodes[r][c] = this.parsePainterNode([r, c, weight, punish]);
        });
        return nodes;
    },

    parsePainterNodeArray(array) {
        let nodes = new Array(array.length);
        this.walkNodes(array, ({nodeCol, nodeRow, rn, cn}, nodes)=>{
            if(!nodes[rn]) nodes[rn] = new Array(nodeRow.length);
            nodes[rn][cn] = this.parsePainterNode([rn, cn, 0, 0]);
        }, nodes);
        return nodes;
    },

    /**
     * @param painterNodes
     * @deprecated
     */
    calcConnectedRate(painterNodes) {
        // let rndStartNode = painterNodes[~~(Math.random() * painterNodes.length)];

        let rate = connectivity.process(painterNodes);

        return rate < 0.5 ? 1 - rate : rate;


        /*
        return;

        let arr = np.array(this.mergeCoords2Points({data}));
        let ndArray = arr.reshape(row, column);
        // console.log(ndArray.toJSON());
        // console.log("a", np.arange(55).reshape(5,11));
        // let arr2 = arr.reshape(arr, 300, 200)

        let cache = undoCache.filter(({path})=>{
            return path.length;
        });

        let start = cache[0].path[0];
        let end = cache[cache.length - 1].path.slice(-1)[0];

        if(!start || !end) return;

        astar.connectivity([start.x, start.y], [end.x, end.y], ndArray);*/

    },

    /**
     * 图像的连通性 2
     * @param data
     * @param column
     * @param row
     * @param undoCache
     * @deprecated
     */
    isConnectedness2(/*vector, */{data, width:column, height:row}, undoCache) {
        let arr = np.array(this.mergeCoords2Points({data}));
        let ndArray = arr.reshape(row, column);
        // console.log(ndArray.toJSON());
        // console.log("a", np.arange(55).reshape(5,11));
        // let arr2 = arr.reshape(arr, 300, 200)

        let cache = undoCache.filter(({path})=>{
            return path.length;
        });

        let start = cache[0].path[0];
        let end = cache[cache.length - 1].path.slice(-1)[0];

        if(!start || !end) return;

        connectivity.process([start.x, start.y], [end.x, end.y], ndArray);

        // np.images.read(vector);
        // np.images.flip();

        // console.log(vector)
    },

    /**
     * 遍历Nodes
     * @param painterNodes
     * @param callback {nodeRow, nodeCol, rn, cn}
     * @param args
     */
    walkNodes(painterNodes, callback, ...args) {
        painterNodes.forEach((nodeRow, rn)=> {
            nodeRow && nodeRow.forEach((nodeCol, cn)=> {
                if (!nodeCol) return;
                callback && callback.apply(null, [{nodeRow, nodeCol, rn, cn}].concat(args))
            })
        });
    },

    plot(painterNodes) {
        return;

        let retX = [], retY = [];
        this.walkNodes(painterNodes, ({nodeCol}, retX, retY)=> {
            retX.push(nodeCol.c);
            retY.push(nodeCol.r);
        }, retX, retY);

        console.log('For pyplot\n', JSON.stringify(retX), ',', JSON.stringify(retY));
    },

    getNodesCnt(painterNodes) {
        let cnt = 0;
        this.walkNodes(painterNodes, ()=> cnt++);
        return cnt;
    },

    // copyNodes(painterNodes) {
    //     let copy = [];
    //     this.walkNodes(painterNodes, ({nodeCol, rn, cn})=> {
    //
    //     })
    // },

    debug(str) {
        eval(str);
    },
};

export default Utils