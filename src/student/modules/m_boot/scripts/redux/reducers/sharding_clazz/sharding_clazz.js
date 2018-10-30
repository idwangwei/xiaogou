/**
 * Created by ww on 2017/4/20.
 */
import {COMPUTE} from '../../actiontypes/actiontypes';
import {OLYMPIC_MATH} from '../../actiontypes/actiontypes';
import {DIAGNOSE} from '../../actiontypes/actiontypes';
import {GAME_LIST} from '../../actiontypes/actiontypes';
import {WORK_LIST} from '../../actiontypes/actiontypes';
import lodash_assign from 'lodash.assign';
// import {SET_GAME_MAP_SHARDING_CLAZZ} from '../../../../../modules/game_map/scripts/redux/action_types';
import * as defaultStates from './../../default_states/default_states';
let SET_GAME_MAP_SHARDING_CLAZZ = 'SET_GAME_MAP_SHARDING_CLAZZ';
export default (state = defaultStates.sharding_clazz, action = null) => {
    switch (action.type) {
        case WORK_LIST.WORK_LIST_CHANGE_CLAZZ: //普通班级
        case GAME_LIST.GAME_LIST_CHANGE_CLAZZ: //游戏班级
        case COMPUTE.COMPUTE_CHANGE_CLAZZ: //速算班级
        case DIAGNOSE.DIAGNOSE_CHANGE_CLAZZ: //诊断班级
        case OLYMPIC_MATH.OLYMPIC_MATH_CHANGE_CLAZZ: //奥数班级
            return action.payload ? lodash_assign({}, action.payload) : state;
        case SET_GAME_MAP_SHARDING_CLAZZ:
            return action.payload;
        default :
            return state;
    }
}