/**
 * Created by 邓小龙 on 2016/10/20.
 */

import {TROPHY_RANK} from  "./../../actiontypes/actiontypes";
import * as defaultStates from "./../../default_states/default_states";
import _findIndex from 'lodash.findindex';
import lodash_assign from 'lodash.assign';

let clazz_year_with_trophy_rank=(state=defaultStates.clazz_year_with_trophy_rank,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        /* 获取单元的诊断统计信息成功*/
        case TROPHY_RANK.FETCH_TROPHY_RANK_SUCCESS:
            nextState[payload.stateKey]=payload.trophyRankData;
            return nextState;
        default:
            return state;
    }
};
export  default clazz_year_with_trophy_rank;
