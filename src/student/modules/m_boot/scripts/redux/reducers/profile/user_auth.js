/**
 * Created by 彭建伦 on 2016/4/18.
 */
import {PROFILE,COUNT_DOWN_VIP_INCREASE_SCORE_COUNTS} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
// import {GAME_GOODS_PAY} from './../../../../../modules/game_map/scripts/redux/action_types/index';
let profile_user_auth = (state = defaultStates.profile_user_auth, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        /*登录*/
        case PROFILE.LOGIN_START:
            nextState.isLogInProcessing = true;
            return nextState;
        case PROFILE.LOGIN_SUCCESS:
            let user = Object.assign({}, action.data);
            nextState.isLogInProcessing = false;
            nextState.user = user;
            nextState.isLogIn = true;
            nextState.role = "S";
            nextState.logoutByUser = false;
            return nextState;
        case PROFILE.LOGIN_FAIL:
            nextState.isLogIn = false;
            nextState.isLogInProcessing = false;
            return nextState;

        /*退出*/
        case PROFILE.LOGOUT_START:
            nextState.isLogOutProcessing = true;
            return nextState;
        case PROFILE.LOGOUT_SUCCESS:
            nextState.isLogOutProcessing = false;
            nextState.user = {};
            nextState.isLogIn = false;
            nextState.logoutByUser = true;
            return nextState;
        case PROFILE.LOGOUT_FAIL:
            nextState.errorInfo = action.error;
            return nextState;
        /*检查session是否有效*/
        case PROFILE.CHECK_IS_VALID_SESSION_START:
            return nextState.set('isCheckValidSessionProcessing', true);
        case PROFILE.CHECK_IS_VALID_SESSION_SUCCESS:
            return nextState.set('isCheckValidSessionProcessing', false);
        case PROFILE.CHECK_IS_VALID_SESSION_FAIL:
            return nextState.set('isCheckValidSessionProcessing', false)
                .set('errorInfo', Immutable.Map(action.payload));
        /*用户主动退出*/
        case PROFILE.USER_LOGOUT_BY_SELF:
            nextState.logoutByUser = true;
            nextState.isLogIn = false;
            return nextState;
        /*修改diagnose支付状态*/
        case PROFILE.USER_IS_VIP_XLY:
            if(!nextState.user.vips) nextState.user.vips=[];
            let hasXly = -1;
            angular.forEach(nextState.user.vips,(v,k)=>{
                if(nextState.user.vips[k].hasOwnProperty('xly')) hasXly = k;
            });
            if(hasXly != -1)  nextState.user.vips[hasXly] = action.payload;
            else nextState.user.vips.push(action.payload);
            return nextState;
        case PROFILE.USER_IS_VIP_FINAL_SPRINT:
            if(!nextState.user.vips) nextState.user.vips=[];
            let hasFinal = -1;
            angular.forEach(nextState.user.vips,(v,k)=>{
                if(nextState.user.vips[k].hasOwnProperty('finalSprint')) hasFinal = k;
            });
            if(hasFinal != -1){
                nextState.user.vips[hasFinal] = action.payload;
            }
            else nextState.user.vips.push(action.payload);
            return nextState;
        case PROFILE.USER_IS_VIP_DIAGNOSE:
            if(!nextState.user.vips) nextState.user.vips=[];
            let hasDiagnose = false;
            angular.forEach(nextState.user.vips,(v,k)=>{
                if(nextState.user.vips[k].diagnose) hasDiagnose = true;
            });
            if(!hasDiagnose)  nextState.user.vips.push({diagnose:action.data||1});
            return nextState;
        /*修改奥数vip状态*/
        case PROFILE.USER_IS_VIP_MATH_OLY:
            if(!nextState.user.vips) nextState.user.vips=[];
            let hasOLympicMath = -1;
            angular.forEach(nextState.user.vips,(v,k)=>{
                if(nextState.user.vips[k].hasOwnProperty("mathematicalOlympiad")) hasOLympicMath = k;
            });
            if(hasOLympicMath===-1) nextState.user.vips.push({mathematicalOlympiad:action.data});
            else nextState.user.vips[hasOLympicMath]={mathematicalOlympiad:action.data};
            return nextState;
            /*修改游戏vip状态*/
        case PROFILE.UPDATE_GAME_VIP:
            if(!nextState.user.vips) nextState.user.vips=[];
            let hasMlcg = -1;
            angular.forEach(nextState.user.vips,(v,k)=>{
                if(nextState.user.vips[k].hasOwnProperty("mlcg")) hasMlcg = k;
            });
            if(hasMlcg===-1) nextState.user.vips.push({mlcg:action.data});
            else nextState.user.vips[hasMlcg]={mlcg:action.data};
            return nextState;
        //诊断提分，考点特权数减1
        case COUNT_DOWN_VIP_INCREASE_SCORE_COUNTS:
            if (!nextState.user.vips) nextState.user.vips = [];
            let hasVip = -1;
            nextState.user.vips.forEach((v, k)=> {
                if (nextState.user.vips[k].hasOwnProperty("raiseScore2Key")) hasVip = k;
            });
            if (hasVip !== -1 && nextState.user.vips[hasVip]['raiseScore2Key']>0){
                nextState.user.vips[hasVip]['raiseScore2Key']--
            }

            return nextState;
        case PROFILE.MODIFY_VIPS_INFO:
            if(!nextState.user.vips){
                nextState.user.vips = action.data;
            }else {
                /*先清空vips中已经没有的 不然在零界点为1到0的时候后端不返回这个字段 导致更新不了到本地*/
                // let arr=[];
                // nextState.user.vips.forEach((x)=>{
                //     let key=Object.keys(x)[0];
                //     let index=action.data.findIndex((v)=>{return v.hasOwnProperty(key)});
                //     if(index!=-1){
                //         arr.push(x)
                //     }
                // });
                // nextState.user.vips=arr;
                action.data.forEach((item)=>{
                    let vipKey = Object.keys(item)[0];
                    let localVip = nextState.user.vips.find((vip)=>{return vip.hasOwnProperty(vipKey)});
                    if(localVip){
                        localVip[vipKey] = item[vipKey]
                    }
                    else {
                        let newVipOption = {};
                        newVipOption[vipKey] = item[vipKey];
                        nextState.user.vips.push(newVipOption)
                    }
                })
            }
            return nextState;


        case PROFILE.CHANGE_CHECKED_OLYMPIC_CHANGE_AD_FLAG:
            nextState.hasCheckedOlympicChangeAd = true;
            return nextState;
        default:
            return state

    }
};
export default profile_user_auth;
