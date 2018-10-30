/**
 * Created by ZL on 2018/2/27.
 */
import {PUB_ORAL_WORK_DIFF_UNIT} from  "../action_typs/index";
import * as defaultStates from "../default_states/index";
import _assign from 'lodash.assign';

export  default (state = defaultStates.compose_oral_multi_unit_paper, action = null)=> {
    switch (action.type) {
        case PUB_ORAL_WORK_DIFF_UNIT.COMPOSE_ORAL_MULTI_UNIT_PAPER_START:
            return state;
        case PUB_ORAL_WORK_DIFF_UNIT.COMPOSE_ORAL_MULTI_UNIT_PAPER_FAIL:
            return state;
        case PUB_ORAL_WORK_DIFF_UNIT.COMPOSE_ORAL_MULTI_UNIT_PAPER_SUCCESS:
            let nextState = {};
            nextState = action.payload.paper;
            return nextState;
        default:
            return state;
    }
};