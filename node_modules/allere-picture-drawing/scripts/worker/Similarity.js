/**
 * Created by LuoWen on 2017/3/14.
 */

import utils from './utils'
import skeleton from '../lib/skeleton'
import connectivity from '../lib/connectivity'

let SimilarityRaw = {

    /**
     * @param imgFrom
     * @param imgTo
     * @param pixelOffset
     * @returns {number}
     */
    calcImgSimilarity(imgFrom, imgTo, pixelOffset, {imgFromLen}) {
        if (!imgFrom.length || !imgTo.length) return 0;

        var wrongSetLen = 0, punishF = 0, punishT = 0;
        // var distances = [];

        utils.walkNodes(imgFrom, ({nodeCol:nodeColF})=> {
            let {weight: weightF, r: rF, c: cF} = nodeColF;
            var isOutOfBounds = true;
            utils.walkNodes(imgTo, ({nodeCol:nodeColT})=> {
                let {similarityVisited, weight: weightT, r: rT, c: cT} = nodeColT;
                if(similarityVisited) return;

                let offset = (weightF < weightT ? weightF : weightT) + pixelOffset; //weight -> offset
                if (utils.checkCoordsNearby([rF, cF], [rT, cT], offset)) {
                    nodeColT.punish = 0; // clear punish
                    nodeColF.punish = 0;
                    isOutOfBounds = false;
                    nodeColT.similarityVisited = true;
                }
            });

            if (isOutOfBounds) {
                wrongSetLen++;
                punishF += 0;
            }
        });

        if(this.accuracy) {
            utils.walkNodes(imgTo, ({nodeCol:{punish}})=>{punishT += punish});
        } else {
            punishF = punishT = 0;
        }
        this.punish = punishF + punishT;

        // return (1 - (wrongSet.length / imgFrom.length)) * (1 -  this.punish / 100);
        return (1 - (wrongSetLen / imgFromLen)) * (1 - this.punish / 100);

        //
        // imgFrom.forEach((coordF, idx)=> {
        //     /*var dist, minDist = getDynOffset(coordF[2], imgTo[0][2], pixelOffset)  + 1;
        //      for (var i = 1; i < imgTo.length; i++) {
        //      var coordT = imgTo[i];
        //      dist = this.calcCoordDistance(coordF, coordT);
        //      if (!i || dist < minDist) {
        //      minDist = dist;
        //      if(minDist < getDynOffset(coordF[2], coordT[2], pixelOffset)) {
        //      coordF[3] = 0; // clear punish
        //      coordT[3] = 0;
        //      // break;
        //      }
        //      }
        //      }*/
        //     imgTo.forEach((coordT)=> {
        //         let offset = (coordF[2] < coordT[2] ? coordF[2] : coordT[2]) + pixelOffset; //weight -> offset
        //         if (this.checkCoordsNearby(coordF, coordT, offset)) {
        //             coordF[3] = 0; // clear punish
        //             coordT[3] = 0;
        //             isOutOfBounds = false;
        //         }
        //     });
        //
        //     // distances.push(minDist);
        //     // coordF[4] = minDist;
        //     if (isOutOfBounds) {
        //         wrongSetLen++;
        //         punishF += 0;
        //     }
        // });
        //
        // // function getDynOffset(from, to, offset) {
        // //    return Math.min(from, to) + offset; //取最近的偏移
        // // }
        //
        // // var wrongSet = distances.filter(c=>c>pixelOffset);
        // // var wrongSet = imgFrom.filter(c=>c[4] > (c[2] + pixelOffset));
        // // var punishF = imgFrom.reduce((a, b)=> a + b[3], 0);
        // // var punishT = imgTo.reduce((a, b)=> a + b[3], 0);
        // punishT = imgTo.reduce((a, b)=> a + b[3], 0);
        // console.log("punish", punishF, punishT);
        //
        // if (!this.accuracy) punishF = punishT = 0;
        // this.punish = punishF + punishT;
        //
        // // return (1 - (wrongSet.length / imgFrom.length)) * (1 -  this.punish / 100);
        // return (1 - (wrongSetLen / imgFrom.length)) * (1 - this.punish / 100);
    },

    calcImgSimilarityV2(coordsAns, coordsUsr, pixelOffset, undoCache) {
        let ret = {
            similarityNum: 0,
            usrPointRate: 0
        };

        let imgAns = utils.extractCoords(coordsAns);
        if (!imgAns.length || !imgAns.length) return ret;
        let imgUsr = utils.extractCoords(coordsUsr);

        let painterNodesAns = this.parsePainterNodeVector(imgAns, coordsAns);
        let painterNodesUsr = this.parsePainterNodeVector(imgUsr, coordsUsr);
        painterNodesAns = skeleton.process(painterNodesAns);
        painterNodesUsr = skeleton.process(painterNodesUsr);

        ret.usrPointRate = imgUsr.length / imgAns.length;
        ret.coordsUsr = {w:coordsUsr.width, h:coordsUsr.height, p:imgUsr};

        let imgAnsLen = 0, imgUsrLen = 0;
        utils.walkNodes(painterNodesAns,()=> imgAnsLen++);
        utils.walkNodes(painterNodesUsr,()=> imgUsrLen++);

        if (imgAnsLen > imgUsrLen) {
            ret.similarityNum = this.calcImgSimilarity(
                painterNodesAns, painterNodesUsr, pixelOffset,
                {imgFromLen: imgAnsLen, imgToLen: imgUsrLen}
            );
        } else {
            ret.similarityNum = this.calcImgSimilarity(
                painterNodesUsr, painterNodesAns, pixelOffset,
                {imgFromLen: imgUsrLen, imgToLen: imgAnsLen}
            );
        }
        return ret;

        // utils.isConnectedness(coordsUsr, undoCache);
        // let painterNodes = this.parsePainterNodeVector(imgUsr, coordsUsr);
        // let calcConnectedRate = connectivity.process(painterNodes);
        // console.log(`calcConnectedRate: ${calcConnectedRate * 100}%`);
        // ret.similarityNum *= calcConnectedRate;
        //
        // let painterNodesSkeletonized = skeleton.process(painterNodes);
        // let calcConnectedRateSkeletonized = connectivity.process(painterNodesSkeletonized);
        // console.log(`calcConnectedRateSkeletonized: ${calcConnectedRateSkeletonized * 100}%`);

        // let test = this.parsePainterNodeArray([
        //     [0,0,0,0,0,0],
        //     [0,1,1,1,1,0],
        //     [0,1,1,1,1,0],
        //     [0,1,1,1,1,0],
        //     [0,0,0,0,0,0]
        // ]);
        // skeleton.process(test);
        

        // return ret;
    },

};

export default SimilarityRaw;