/**
 * Created by ww on 2017/4/20.
 */
import lodash_assign from 'lodash.assign';

import * as defaultStates from './../../default_states/index';
import {
    SELECT_WORK_CLAZZ,
    CHANGE_CLAZZ,
    RC_CHANGE_CLAZZ,
    CHANGE_DIAGNOSE_CLAZZ,
    SELECT_MATH_OLY_CLAZZ,
} from './../../action_typs';
export default (state = defaultStates.sharding_clazz, action = null) => {
    switch (action.type) {
        case CHANGE_CLAZZ: //游戏班级
            console.log('=====================','切换shardingId为游戏班级');
            return lodash_assign({},
                {
                    name: action.name,
                    id: action.id,
                    type: action.bookType
                },
            );
        case RC_CHANGE_CLAZZ: //速算班级
            console.log('=====================','切换shardingId为速算班级');
            return lodash_assign({},
                {
                    name: action.name,
                    id: action.id,
                    grade: action.grade
                }
            );
        case SELECT_WORK_CLAZZ: //普通班级
            console.log('=====================','切换shardingId为普通班级');
            return lodash_assign({}, action.payload);
        case CHANGE_DIAGNOSE_CLAZZ: //诊断班级
            console.log('=====================','切换shardingId为诊断班级');
            return lodash_assign({}, action.payload);
        case SELECT_MATH_OLY_CLAZZ: //奥数班级
            console.log('=====================','切换shardingId为奥数班级');
            return lodash_assign({}, action.payload);
        default :
            return state;
    }
}