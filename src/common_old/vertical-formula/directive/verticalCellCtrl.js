/**
 * Created by LuoWen on 16/7/29.
 */

import BaseCtrl from "./../../base_components/base_ctrl";
import CONST from './../vfconst'

class VerticalCellCtrl extends BaseCtrl {

    constructor() {
        super(arguments);
    }



    

    // getCell(ele) {
    //     return this.getScope(ele).cell;
    // }

    // getScope(ele) {
    //     if (ele === undefined) return super.getScope();
    //     return ele.scope();
    // }

    

}

VerticalCellCtrl.$inject = [
    '$scope',
    '$compile',
    '$http',
    '$stateParams',
    '$anchorScroll',
    '$state',
    '$ngRedux',
    '$location',
    'verticalService'
];

export default VerticalCellCtrl;