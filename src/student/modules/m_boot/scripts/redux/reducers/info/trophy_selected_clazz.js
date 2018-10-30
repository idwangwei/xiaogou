/**
 * Created by 邓小龙 on 2016/10/18.
 */
import {TROPHY_RANK} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
import lodash_assign from 'lodash.assign';


function trophy_selected_clazz(state = defaultStates.trophy_selected_clazz, action = null) {
    switch (action.type) {
        case TROPHY_RANK.TROPHY_CHANGE_CLAZZ:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default trophy_selected_clazz;