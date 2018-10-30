/**
 * Created by Administrator on 2017/5/8.
 */
import {TreeNode} from './../node/treeNode';
class Stroke{
    constructor(dataPoints,recognize,x,y,width,height){
        this.dataPoints = dataPoints || [];
        this.recognize = recognize || '';
        this.x = x||0;
        this.y = y||0;
        this.height = height||0;
        this.width = width||0;
    }
}
class CharStroke extends Stroke{
    constructor() {
        super(arguments);
        this.type = TreeNode.TYPE.CHAR;
    }
}
class PowStroke extends Stroke {
    constructor() {
        super(arguments);
        this.type = TreeNode.TYPE.POW;
    }
}
class FracStroke extends Stroke {
    constructor() {
        super(arguments);
        this.type = TreeNode.TYPE.FRAC;
    }
}
export {CharStroke, PowStroke, FracStroke}