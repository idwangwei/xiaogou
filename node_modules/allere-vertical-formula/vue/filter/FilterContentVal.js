/**
 * Created by LuoWen on 2016/11/22.
 */
import {mergedExpressionSet} from "../../expressionSet";

// export default function (value) {
//     if (!value && !value.val) return value;
//     return value.val
// }


let getKeyboardAddContentVal = (val) => {
    if (val === undefined || val === null) val = "";

    if (!val.match(/[0-9]/)) { // 键盘非数字输入的情况下，进行符号匹配。
        for (let symbol in mergedExpressionSet) {
            let expression = mergedExpressionSet[symbol];
            let expr = expression.expr ? expression.expr : expression;

            if (val.match(new RegExp(expr))) {
                let directiveName = expression.directive ? expression.directive : "mathjax-parser";
                val = this.$compile(`<span ${directiveName} value=${val}></span plus>`)(this.getScope());
                break;
            }
        }
    }
    return val;
};

export default getKeyboardAddContentVal;