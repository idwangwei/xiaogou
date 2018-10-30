/**
 * Created by Administrator on 2017/5/8.
 */
import {TreeNode} from "./treeNode";
export default class Char extends TreeNode {
    constructor() {
        super(arguments);
        this.type = TreeNode.TYPE.CHAR;
        this.fontSize = 20;
        this.height = 24;
        this.width = 24;
        this.isLeaf = true;
        this.textStr = '';
    }

    setFontSize(fontSize) {
        if (!isNaN(fontSize) && fontSize > 0)this.fontSize = fontSize;
        return this;
    }

    setText(textStr) {
        if (typeof textStr === 'string')this.textStr = textStr;
    }
}
