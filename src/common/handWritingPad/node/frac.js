/**
 * Created by Administrator on 2017/5/8.
 */
import {TreeNode} from "./treeNode";
export default class Frac extends TreeNode {
    constructor() {
        super(arguments);
        this.type = TreeNode.TYPE.FRAC;
    }
}
