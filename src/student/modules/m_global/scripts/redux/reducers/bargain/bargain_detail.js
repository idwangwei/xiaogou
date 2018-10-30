/**
 * Created by qiyuexi on 2018/2/2.
 */
import {BARGAIN} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';


export default (state = defaultStates.bargain_detail, action = null) =>{
    switch (action.type) {
        case BARGAIN.FETCH_BARGAIN_DETAIL_SUCCESS:
            return action.payload;
        default :
            return state;
    }
}