/**
 * Created by ZL on 2017/7/12.
 */
import {DIAGNOSE_CAMP} from '../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

export default (state = default_states.diagnose_camp_goods, action = null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST:
            nextState.list = action.payload.list;
            // nextState.desc = action.payload.desc; TODO 测试数据
            return nextState;
        default:
            return state;
    }
}