/**
 * Created by 邓小龙 on 2016/8/19.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';

let go_to_do_question=(state=defaultStates.go_to_do_question,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        case DIAGNOSE.GO_TO_DO_QUESTION:
            nextState.type=payload.type;
            nextState.title=(payload.type===2||payload.type===3||payload.type===4)?'新题':'改错';
            return nextState;
        default:
            return state;
    }
};
export  default go_to_do_question;