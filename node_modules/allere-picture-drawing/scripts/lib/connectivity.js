/**
 * Created by LuoWen on 2017/3/13.
 */

import utils from "../worker/utils"
import {astar, Graph} from "./astar"
import numjs from "../lib/numjs"

export default class connectivity {
    constructor(){}

    /**
     * 计算图像的连通性
     * @param painterNodes
     * @returns {number}
     */
    static process(painterNodes) {
        let visitedNodeCnt = 0, totalNodeCnt = 0, coverRate = 0;
        let startNode = this.getStartNode(painterNodes);
        if(!startNode) return coverRate;

        let queue = [startNode];

        console.time("walk");
        // 避免调用栈溢出，使用广度优先搜索
        while (queue.length) {
            this.walk(queue, painterNodes, queue.pop())
        }
        console.timeEnd("walk");

        utils.walkNodes(painterNodes, ({nodeCol})=> {
            if (nodeCol.visited) {
                visitedNodeCnt++;
            }
            totalNodeCnt++;
        });

        coverRate = visitedNodeCnt / totalNodeCnt;
        return coverRate < 0.5 ? 1 - coverRate : coverRate;
    }

    static walk(queue, painterNodes, {r, c}) {
        painterNodes[r][c].visited = true;

        let neighbors = [
            r - 1, c - 1, r - 1, c, r - 1, c + 1,
            r    , c - 1,           r    , c + 1,
            r + 1, c - 1, r + 1, c, r + 1, c + 1
        ];
        for(let i=0; i<neighbors.length; i=i+2) {
            let r = neighbors[i], c = neighbors[i + 1];
            if(!painterNodes[r]
                || !painterNodes[r][c]
                || painterNodes[r][c].visited)
                continue;
            queue.push(painterNodes[r][c])
        }
    }

    static getStartNode(painterNodes) {
        let row = painterNodes.find(row=>row && row.find(node=>node) && row);
        return row && row.find(node=>node);
    }

    static connectivity2(start, end, ndArray) {
        console.log("connectivity", astar);
        let ret = this.runSearch(ndArray.tolist(), start, end);
        console.log("runSearch", ret, ret.text/***TODO for pyplot */);
    }

    static runSearch(graph, start, end, options) {
        if (!(graph instanceof Graph)) {
            graph = new Graph(graph);
        }
        start = graph.grid[start[0]][start[1]];
        end = graph.grid[end[0]][end[1]];
        var sTime = new Date(),
            result = astar.search(graph, start, end, options),
            eTime = new Date();
        return {
            result: result,
            text: this.pathToString(result),
            time: (eTime - sTime)
        };
    }

    static pathToString(result) {
        return result.map(function(node) {
            return "(" + node.x + "," + node.y + ")";
        }).join("");
    }
}