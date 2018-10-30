/**
 * Created by Administrator on 2017/5/8.
 */

class TreeNode {
    constructor(parent, children) {
        this.parent = parent||{};
        this.children = children||[];
        this.isRoot = false;
        this.isLeaf = false;
        this.height = 0;
        this.width = 0;
        this.x = 0;
        this.y = 0;
        this.dataPoints = [];
    }

    setRoot(isRoot) {
        this.isRoot = isRoot;
    }

    setIsLeaf(isLeaf) {
        this.isLeaf = isLeaf;
        return this;
    }

    setParent(parent) {
        this.parent = parent;
        return this;
    }

    setChildRen(children) {
        if (children && children.length) {
            this.children = children;
        }
        return this;
    }

    setHeight(height) {
        if (!isNaN(height) && height > 0)this.height = height;
        return this;
    }

    setWidth(width) {
        if (!isNaN(width) && width > 0)this.width = width;
        return this;
    }

    setX(x) {
        if (!isNaN(x) && x > 0)this.x = x;
        return this;
    }

    setY(y) {
        if (!isNaN(y) && y > 0)this.y = y;
        return this;
    }

    setDataPoints(dataPoints) {
        this.dataPoints = dataPoints;
        return this;
    }

    appendChild(childNode) {
        if (!this.children)this.children = [];
        this.children.push(childNode);
    }

    static TYPE = {
        ROW: "row",//行
        POW: "pow",//乘幂
        FRAC: "frac",//分数
        CHAR: "character"//普通字符
    }
}


export {TreeNode}