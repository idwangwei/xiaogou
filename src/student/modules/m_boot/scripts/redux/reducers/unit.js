/**
 * Created by 邓小龙 on 2016/8/12.
 */

import  * as types from './../actiontypes/actiontypes';
import * as defaultStates from './../default_states/default_states';

let unit =(state=defaultStates.unit,action=null)=>{
    let nextState=Object.assign({},state);
    switch (action.type){
        case types.UNIT.FETCH_UNIT_START:
            nextState.isFetchUnitProcessing=true;
            return nextState;
        case types.UNIT.FETCH_UNIT_SUCCESS:
            nextState.isFetchUnitProcessing=false;
            nextState.unitList=action.unitList;
            return nextState;
        case types.UNIT.FETCH_UNIT_FAIL:
            nextState.isFetchUnitProcessing=false;
            nextState.errorInfo=action.error;
            return nextState;
        case types.UNIT.CHANGE_UNIT:
            nextState.selectedUnit=action.unit;
            nextState.unitHasChanged=true;
            return nextState;
        case types.UNIT.CHANGE_TEXTBOOK_BY_CLAZZ:
            nextState.selectedTextbook=action.selectedTextbook;
            return nextState;
        case types.UNIT.RESET_UNIT_STATUS:
            nextState.unitHasChanged=false;
            return nextState;
        case types.UNIT.SELECT_TEXTBOOK_WORK:
            nextState.selectedTextbook = action.payload;
            return nextState;
        case types.UNIT.FETCH_TEXTBOOK_LIST_SUCCESS:
            nextState.textbooks = action.payload;
            return nextState;
        default:
            return nextState;

    }
};

export  default unit;