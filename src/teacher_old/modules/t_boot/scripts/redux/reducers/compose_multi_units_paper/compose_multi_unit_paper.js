/**
 * Created by ZL on 2017/10/26.
 */
import {PUB_WORK_DIFF_UNIT} from  "./../../action_typs/index";
import * as defaultStates from "./../../default_states/index";
import _assign from 'lodash.assign';

export  default (state = defaultStates.compose_multi_unit_paper, action = null)=> {
    switch (action.type) {
        case PUB_WORK_DIFF_UNIT.COMPOSE_MULTI_UNIT_PAPER_START:
            return state;
        case PUB_WORK_DIFF_UNIT.COMPOSE_MULTI_UNIT_PAPER_FAIL:
            return state;
        case PUB_WORK_DIFF_UNIT.COMPOSE_MULTI_UNIT_PAPER_SUCCESS:
            let nextState = {};
            nextState = action.payload.paper;
            return nextState;
        default:
            return state;
    }
};