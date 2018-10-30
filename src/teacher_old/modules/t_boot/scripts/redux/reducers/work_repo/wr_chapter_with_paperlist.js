import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';
import _findIndex from 'lodash.findindex';

import {
    FETCH_PAPER_LIST_SUCCESS
    ,FETCH_MINE_PAPER_LIST_SUCCESS
    ,PAPER_EDIT_LIST_ADD
    ,DELETE_SPECIFIED_MINE_PAPER
} from './../../action_typs';


let wr_chapter_with_paperlist = (state = default_states.wr_chapter_with_paperlist, action = null)=> {
    let newState = _assign({},state);
    let payload = action.payload;
    switch (action.type) {
        case FETCH_PAPER_LIST_SUCCESS:
            newState.paperList[payload.unitId] = payload.paperList;
            if(!newState.needHideRapid) newState.needHideRapid = {};
            newState.needHideRapid[payload.unitId] = payload.needHideRapid;
            return newState;
        case FETCH_MINE_PAPER_LIST_SUCCESS:
            if(payload.isLoadMore){
                newState.mine[payload.unitId] = newState.mine[payload.unitId].concat(payload.mine);
            }else{
                newState.mine[payload.unitId] = payload.mine;
            }
            newState.canLoadMore = payload.mine.length >= newState.minePageInfo.size;
            newState.minePageInfo.lastKey = payload.mine.slice(-1)[0] && payload.mine.slice(-1)[0].id;

            return newState;
        case PAPER_EDIT_LIST_ADD:
            newState.mine[payload.unitId] = newState.mine[payload.unitId] || [];
            newState.mine[payload.unitId].unshift(payload.paperInfo);
            return newState;
        case DELETE_SPECIFIED_MINE_PAPER:
            newState.mine[payload.unitId] = newState.mine[payload.unitId] || [];
            let index = _findIndex(newState.mine[payload.unitId],{id:payload.paperId});
            newState.mine[payload.unitId].splice(index,1);
            return newState;
        default:
            return state;
    }
};

export  default wr_chapter_with_paperlist;