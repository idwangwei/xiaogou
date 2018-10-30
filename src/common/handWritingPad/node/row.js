/**
 * Created by Administrator on 2017/5/8.
 */
import {TreeNode} from "./treeNode";
export default class Row extends TreeNode {
    constructor() {
        super(arguments);
        this.heightWeight = 1; //row平均分整个canvas高度的比重
        this.type = TreeNode.TYPE.ROW;
    }
}
