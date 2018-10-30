/**
 * Created by 彭建伦 on 2016/4/18.
 */
import {PET_INFO} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
import _findIndex from 'lodash.findindex';

export default (state = defaultStates.pet_info, action = null)=> {
    let nextState = Object.assign({}, state);
    let foodIndex;
    switch (action.type) {
        case PET_INFO.FETCH_PET_INFO_SUCCESS:
            if(action.payload.foodArr) nextState.foodArr = action.payload.foodArr;
            if(action.payload.petArr) nextState.petArr = action.payload.petArr;
            return nextState;

        case PET_INFO.HATCH_FIRST_PET:
            nextState.hasHatchEggs = !action.payload;
            return nextState;

        case PET_INFO.HATCH_PET_SUCCESS:
            let eggIndex = _findIndex(nextState.petArr,{type:action.payload.eggGroup});
            if(eggIndex != -1){
                if(action.payload.isFirstEgg){
                    nextState.petArr.splice(eggIndex,1);
                    nextState.petArr.unshift(action.payload.pet);
                }
                else {
                    nextState.petArr.splice(eggIndex,1,action.payload.pet);
                }
            }
            return nextState;

        case PET_INFO.BUY_PET_FOOD_SUCCESS:
        case PET_INFO.GET_PET_GOODS_SUCCESS:
            if(!action.payload.ids.length){
                nextState.foodArr.forEach((food)=>{
                    food.count++;
                });
            }else {
                action.payload.ids.forEach((foodId)=>{
                    foodIndex = _findIndex(nextState.foodArr,{id:foodId});
                    if(foodIndex != -1){
                        nextState.foodArr[foodIndex].count++;
                    }

                });
            }
            return nextState;

        case PET_INFO.FEED_PET_SUCCESS:
            let petIndex = _findIndex(nextState.petArr,{id:action.payload.petId});
            foodIndex = _findIndex(nextState.foodArr,{id:action.payload.foodId});
            if(petIndex != -1){
                nextState.petArr[petIndex].growthValue = action.payload.pet.growthValue;
                nextState.petArr[petIndex].growthLimit = action.payload.pet.growthLimit;
                nextState.petArr[petIndex].phase = action.payload.pet.phase;
                nextState.petArr[petIndex].process = action.payload.pet.process;
                nextState.petArr[petIndex].text = action.payload.pet.text;
            }
            if(foodIndex != -1){
                nextState.foodArr[foodIndex].count--;
            }
            return nextState;
        case PET_INFO.CHANGE_SHOW_AD_AUTO_FLAG:
                nextState.showAdAuto = !nextState.showAdAuto;
            return nextState;
        case PET_INFO.CHANGE_PET_FIRST_GUIDE_FLAG:
                nextState.firstGuide = !nextState.firstGuide;
            return nextState;
        case PET_INFO.CHANGE_CAN_GET_REWARD_FLAG:
                nextState.canGetReward = !nextState.canGetReward;
        case PET_INFO.CHANGE_SHARE_SUCCESS_FLAG:
                nextState.sharePetSuccess = true;
            return nextState;
        default:
            return state;

    }
};
