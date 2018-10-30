/**
 * Created by LuoWen on 2017/3/14.
 */
import utils from '../worker/utils'
import np from '../lib/numjs'


let Skeleton = {

    /**
     * @deprecated
     * @param data
     * @param width
     * @param height
     */
    process2({data, width, height}) {
        console.log("processing...");
        let arr = np.array(utils.mergeCoords2Points({data}));
        let ndArray = arr.reshape(height, width);

        console.log("ret0", ndArray.toJSON());

        let CONVOLVE_CORE = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
        let CONVOLVE_CORE_1 = [[1,2,1],[0,0,0],[-1,-2,-1]];
        let CONVOLVE_CORE_2 = [[1,0,-1],[2,0,-2],[1,0,-1]];
        let ret1 = np.convolve(ndArray, CONVOLVE_CORE_1);
        console.log("\n\n\n\n\n\n\n\nret1", ret1.toJSON());

        let ret2 = np.convolve(ret1, CONVOLVE_CORE_2);
        console.log("\n\n\n\n\n\n\n\nret2", ret2.toJSON())
    },

    process(painterNodes) {

        utils.plot(painterNodes);
        let nodeCnt = utils.getNodesCnt(painterNodes);
        console.log("nodes cnt s", nodeCnt);
        if(!nodeCnt) return painterNodes;
        
        console.time('skeleton');
        let completed = false, firstRound = true, preNode;
        let cnt = 0;
        while(!completed) {
            console.log("skeleton process", ++cnt);
            completed = true;
            utils.walkNodes(painterNodes, ({nodeCol})=> {
                if(firstRound) {
                    preNode = this.preProcess(painterNodes, nodeCol, true);
                    firstRound = false;
                }

                let removed = this.skeletonization(painterNodes, nodeCol);
                if(removed) completed = !1;
            });
        }
        this.preProcess(painterNodes, preNode, false);
        console.timeEnd('skeleton');

        utils.plot(painterNodes);
        console.log("nodes cnt e", utils.getNodesCnt(painterNodes));

        return painterNodes;
        
    },

    /**
     * 预处理
     * @param painterNodes
     * @param r
     * @param c
     * @param isStart
     */
    preProcess(painterNodes, {r, c}, isStart){
        if (isStart) {
            if (r == 0) {
                // TODO padding top row
                console.error("TODO padding top row")
            }
            if (c == 0) {
                // TODO padding left row
                console.error("TODO padding left row")
            }
            painterNodes[r - 1] = new Array(painterNodes[r].length);
            return painterNodes[r - 1][c - 1] = utils.parsePainterNode([r - 1, c - 1, 0, 0]);
        } else {
            painterNodes[r][c] = undefined;
        }
    },
    
    /**
     * Morphological Image Processing
     * @refer www.dspguide.com/ch25/4.htm
     */
    skeletonization(painterNodes, {r, c}) {
        let neighbors = this.getNeighbors(painterNodes, {r, c});

        let cnt = 0;
        // rule 1 skip

        // rule 2
        if (neighbors[1] && neighbors[3]
            && neighbors[5] && neighbors[7]) return;

        //rule 3
        cnt = 0;
        for (let i = 0; i < neighbors.length; i++) {
            neighbors[i] && cnt++;
        }
        if(cnt === 1) return;

        // rule 4
        cnt = 0;
        neighbors[0] && !neighbors[1] && cnt++;
        neighbors[1] && !neighbors[2] && !neighbors[3] && cnt++;
        neighbors[2] && !neighbors[3] && cnt++;
        neighbors[3] && !neighbors[4] && !neighbors[5] && cnt++;
        neighbors[4] && !neighbors[5] && cnt++;
        neighbors[5] && !neighbors[6] && !neighbors[7] && cnt++;
        neighbors[6] && !neighbors[7] && cnt++;
        neighbors[7] && !neighbors[0] && !neighbors[1] && cnt++;
        if(cnt > 1) return;

        // all passed
        painterNodes[r][c] = undefined;

        return true;
    },

    /**
     * 0 1 2
     * 7   3
     * 6 5 4
     *
     * @param painterNodes
     * @param r
     * @param c
     * @returns {*[]}
     */
    getNeighbors(painterNodes, {r, c}) {
        return [
            painterNodes[r - 1] && painterNodes[r - 1][c - 1],
            painterNodes[r - 1] && painterNodes[r - 1][c],
            painterNodes[r - 1] && painterNodes[r - 1][c + 1],
            painterNodes[r][c + 1],
            painterNodes[r + 1] && painterNodes[r + 1][c + 1],
            painterNodes[r + 1] && painterNodes[r + 1][c],
            painterNodes[r + 1] && painterNodes[r + 1][c - 1],
            painterNodes[r][c - 1]
        ]
    }
        
    
    



};

export default Skeleton;