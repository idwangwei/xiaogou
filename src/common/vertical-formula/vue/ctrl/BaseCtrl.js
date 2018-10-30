/**
 * Created by LuoWen on 2016/11/21.
 */
import CONST from '../../vfconst'

export default class BaseCtrl {
    constructor(ctx) {
        this.ctx = ctx;

        this._uid = this.ctx._uid;
        this.initData && this.initData();
    }

    initData() {
        this.vam = this.getVmRoot().vam;
        // this.vamR = this.getVmRoot().vamR;
        this.eventHub = this.getEventHub();

        this.isTypeBlank = this.isMatrixTypeBlank();
        this.isTypeCalc = this.isMatrixTypeCalc();
        this.isTypeError1 = this.isMatrixTypeError1();
        this.isTypeError2 = this.isMatrixTypeError2();

        // this.tools = Tools.getTools(ctx);
        // this.tools = new Tools(this.getMatrixUUID(), this.getVerticalService());
        // this.matrixType = ""; // error blank calc

        //need override
    }

    getVmRoot() {
        return this.ctx.$root;
    }

    getVerticalService() {
        return this.getVmRoot().getVerticalService();
    }

    getMatrixUUID() {
        return this.getVmRoot().getMatrixUUID();
    }

    getMatrixCached() {
        return this.getVmRoot().getMatrixCached();
    }

    getScope() {
        // return this.getVmRoot().$data.ngScope;
        return this.getVmRoot().getNgScope();
    }

    getCompile() {
        // return this.getVmRoot().$data.ngCompile;
        return this.getVmRoot().getNgCompile();
    }

    getQ() {
        return this.getVmRoot().getQ();
    }

    getCommonService() {
        return this.getVmRoot().getCommonService();
    }

    $set(obj, key, val) {
        return this.ctx.$set(obj, key, val);
    }

    getVfCell({r, c}) {
        return this.vam[r][c];
    }

    getEventHub() {
        let root  = this.getVmRoot();
        if(!root.eventHub) {
            root.eventHub = this.getVmRoot().getEventHub().init(this, root._uid);
        } /*else {
            //for GC
            if(!root.subCtrl) root.subCtrl = [];
            root.subCtrl.push(this);
        }*/
        return root.eventHub;
    }

    isMatrixTypeBlank() {
        return this.getVmRoot().isTypeBlank;
    }

    isMatrixTypeCalc() {
        return this.getVmRoot().isTypeCalc;
    }

    isMatrixTypeError1() {
        return this.getVmRoot().isTypeError1;
    }

    isMatrixTypeError2() {
        return this.getVmRoot().isTypeError2;
    }

    isMathSymbolTypeAdd() {
        return this.getMathSymbolType() === CONST.VF_MATH_SYMBOL_ADD;
    }

    isMathSymbolTypeSub() {
        return this.getMathSymbolType() === CONST.VF_MATH_SYMBOL_SUB;
    }

    isMathSymbolTypeMul() {
        return this.getMathSymbolType() === CONST.VF_MATH_SYMBOL_MUL;
    }

    isMathSymbolTypeDiv() {
        return this.getMathSymbolType() === CONST.VF_MATH_SYMBOL_DIV;
    }

    getMathSymbolType() {
        return this.getVmRoot().mathSymbolType;
    }

    getStyleContainerEditableColor() {
        return !this.isTypeBlank && !this.isTypeError1;
    }
    
    isStateAllowed() {
        return this.getVmRoot().isStateAllowed;
    }
    // getVfCellR({r, c}) {
    //     return this.vamR[r][c];
    // }
    //
    // syncVfCellR({r, c}, val) {
    //     return this.vamR[r][c].val = val;
    // }

    /**
     * 确保使用VueData.
     * @param obj
     * @param key
     * @param val
     */
    ensureVueData(obj, key, val = "") {
        if (!obj[key]) this.$set(obj, key, val);
    }

    contains(str, pattern = "") {
        return str 
		&& str.indexOf 
		&& str.indexOf(pattern) !== -1;
    }
}
