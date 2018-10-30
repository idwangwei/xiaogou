/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';

let chapter_with_diagnose_stati=(state=defaultStates.chapter_with_diagnose_stati,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        /* 获取单元的诊断统计信息成功*/
        case DIAGNOSE.FETCH_CHAPTER_STATISTIC_SUCCESS:

            nextState[payload.classId+'#'+payload.selectedUnit.id+'/'+payload.chapter.id]=payload.chapterDiagnoseStati;
            return nextState;
        default:
            return state;
    }
};
export  default chapter_with_diagnose_stati;
