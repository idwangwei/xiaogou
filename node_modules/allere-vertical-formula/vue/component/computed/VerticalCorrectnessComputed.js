/**
 * Created by LuoWen on 2016/12/3.
 */

import CONST from '../../../vfconst'

export default {
    VF_CORRECT: (comp)=>({[CONST.CSS_NAME_CORRECT]:comp.gradeInfo && comp.gradeInfo.correctness !== 0}),
    VF_WRONG: (comp)=>({[CONST.CSS_NAME_WRONG]:comp.gradeInfo && comp.gradeInfo.correctness === 0}),
}