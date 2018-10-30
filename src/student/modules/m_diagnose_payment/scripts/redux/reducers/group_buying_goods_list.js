/**
 * Created by ZL on 2017/2/14.
 */
import * as types from  "../action_types/index";
import * as default_states from "../default_states/index";

let group_buying_goods_list = (state = default_states.group_buying_goods_list, action)=> {
    switch (action.type) {
        case (types.WEIXIN_PAY.SAVE_GROUP_BUYING_GOODS_LIST):
            return Object.assign({}, state, {
                goods: action.payload.goods,
                leaderFavorable: action.payload.leaderFavorable
            });
        default:
            return state;
    }
};
export default group_buying_goods_list;