/**
 * Created by liangqinli on 2016/9/19.
 */
import {GAMES_LIST_SUCCESS , DEL_GAME_SUCCESS, MOVE_GAME_SUCCESS} from '../../action_typs';
import {game_list} from "./../../default_states/index";
import _sortBy from 'lodash.sortby';
/**
 *  {
 *     ['clzId']:{
 *        gameList: [],
 *        moreFlag: true
 *     }
 *  }
 */
//先按照游戏发布的时间（天）排序，然后按照单元排序
function sortByTbAndDay(list){
    return _sortBy(list, [(item) => {
        try{
            var match = item.createdTime.match(/^\d{4}-\d{1,2}-\d{1,2}/);
            if(match){
                return -Date.parse(match[0]);
            }
            console.error('dayGameGroups function error');
        }catch(e){
            console.log(e);
            return 'data error';
        }

    }, (item)=> {
        try{
            var arr = item.games[0].tb.textbookSeq.split('-');
            var weights = 6;
            if(arr.length !== 0 ){
                return  arr.reduce((previousValue, currentValue) => {
                    var num =  previousValue + currentValue*Math.pow(10, weights);
                    weights -= 2;
                    return num;
                }, 0)
            }
        }catch(e){
            console.error(e);
            return ''
        }

    }])
}

function findKeyName(state, clzId){
    return Object.keys(state).find((key) => key == clzId);
}
function mergeGameList(state, action){
    let _obj = {},
        clzId = action.clzId,
        gameList = action.gameList;
    _obj[clzId] = {};
    if(findKeyName(state, clzId) && !action.refreshFlag){
        _obj[clzId].gameList = sortByTbAndDay(state[clzId].gameList.concat(gameList));
    }else{
        _obj[clzId].gameList = sortByTbAndDay(gameList);
    }
    _obj[clzId].moreFlag = action.moreFlag;
    return _obj;
}
function delGame(state, action){
    let _obj = {},
        clzId = action.clzId,
        gameId = action.gameId;
    _obj[clzId] = {};
    _obj[clzId].gameList = state[clzId].gameList.filter((game) => game.id !== gameId);
    _obj[clzId].moreFlag = state[clzId].moreFlag;
    return _obj;
}
function moveGame(state, action){
    let _obj = {},
        clzId = action.clzId;
    _obj[clzId] = {};
    _obj[clzId].gameList = state[clzId].gameList.slice();
    _obj[clzId].gameList.splice(action.fromIndex, 1);
    _obj[clzId].gameList.splice(action.toIndex, 0, action.game);
    _obj[clzId].moreFlag = state[clzId].moreFlag;
    return _obj;
}

export default function(state = game_list, action){
    switch(action.type){
        case GAMES_LIST_SUCCESS:
            return Object.assign({}, state, mergeGameList(state, action));
        case DEL_GAME_SUCCESS:
            return Object.assign({}, state, delGame(state, action));
        case MOVE_GAME_SUCCESS:
            return Object.assign({}, state, moveGame(state, action));
        default: return state;
    }
}