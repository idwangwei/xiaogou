import * as default_states from './../../default_states/index';
import _findIndex from 'lodash.findindex';
import {
    MODIFY_EQ_CREATING_PAPER_ADD
    ,MODIFY_EQ_CREATING_PAPER_REMOVE
    ,MODIFY_EQ_CREATING_PAPER_CLEAR
} from './../../action_typs';
import _assign from 'lodash.assign';
export  default (state=default_states.eq_redo_creating_paper,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case MODIFY_EQ_CREATING_PAPER_ADD:
            if(newState[action.payload.key]){
                newState[action.payload.key].push(action.payload.question);
            }else {
                newState[action.payload.key]= [action.payload.question];
            }

            return newState;
        case MODIFY_EQ_CREATING_PAPER_REMOVE:
            let index = _findIndex(newState[action.payload.key],{questionId:action.payload.question.questionId});
            newState[action.payload.key].splice(index,1);

            return newState;
        case MODIFY_EQ_CREATING_PAPER_CLEAR:
            newState[action.payload.key].length = 0;
            return newState;
        default:
            return state;
    }

};

