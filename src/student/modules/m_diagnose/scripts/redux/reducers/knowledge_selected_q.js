/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';


let knowledge_selected_q=(state=defaultStates.knowledge_selected_q,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        //去查看错题记录
        case DIAGNOSE.KNOWLEDGE_SELECTED_Q:
            nextState= payload.questionInfo;
            return nextState;
        default:
            return state;
    }
};
export  default knowledge_selected_q;
