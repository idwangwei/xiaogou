/**
 * Created by LuoWen on 2017/3/14.
 */

export default class PainterNode {
    constructor(r, c, {weight, punish, visited, value}) {
        this.r = r;
        this.c = c;
        this.value = value;
        this.weight = weight || null;
        this.punish = punish || null;
        this.visited = visited || null;
        this.similarityVisited = visited || null;
    }
}