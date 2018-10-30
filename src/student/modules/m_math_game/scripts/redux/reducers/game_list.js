/**
 * Created by qiyuexi on 2018/1/5.
 */
import * as types from '../action_types'
import * as default_states  from '../default_states';
import findIndex from 'lodash.findindex';
import _sortBy from 'lodash.sortby';
//先按照游戏发布的时间（天）排序，然后按照单元排序
function sortByTbAndDay(list){
    return _sortBy(list, [(item) => {
        var match = item.publishTime.match(/^\d{4}-\d{1,2}-\d{1,2}/);
        if(match){
            return -Date.parse(match[0]);
        }
        console.error('dayGameGroups function error');
    }, (item)=>{
        try{
            var arr = item.tb.textbookSeq.split('-');
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
    }])      //(item)=> item.tb.textbookSeq
}

export default (state = default_states.game_list, action = null)=>{
    let nextState = Object.assign({}, state);
    let imuState, payload;
    switch (action.type) {
        /*游戏列表改变班级*/
        case types.GAME_LIST.GAME_LIST_CHANGE_CLAZZ:
            nextState.selectedClazz = action.payload;
            return nextState;
        /*游戏列表选择游戏*/
        case types.GAME_LIST.GAME_LIST_SELECT_GAME:
            nextState.selectedGame = action.payload;
            return nextState;
        /*改变游戏列表的分页信息*/
        case types.GAME_LIST.CHANGE_GAME_LIST_PAGINATION_INFO:
            payload = action.payload;
            nextState.paginationInfo = {
                seq: payload.seq,
                needDataNum: payload.needDataNum
            };
            return nextState;
        /*游戏列表加载游戏数据*/
        case types.GAME_LIST.FETCH_GAME_LIST_START:
            nextState.isFetchGameListProcessing = true;
            return nextState;
        case types.GAME_LIST.FETCH_GAME_LIST_FAILED:
            nextState.error_getGameList = action.error_getGameList;
            nextState.isFetchGameListProcessing = false;
            return nextState;
        case types.GAME_LIST.FETCH_GAME_LIST_SUCCESS:
            let clzId = nextState.selectedClazz.id;//当前班级的班级号
            let clazzListWithGames = nextState.clazzListWithGames;
            let imGameList = clazzListWithGames[clzId] || [];
            let updateOrAppend = action.payload.updateOrAppend;
            updateOrAppend ?
                imGameList = action.payload.list :
                imGameList = imGameList.concat(action.payload.list);
            clazzListWithGames[clzId] = sortByTbAndDay(imGameList);
            nextState.clazzListWithGames = clazzListWithGames;
            nextState.isFetchGameListProcessing = false;
            return nextState;

        /*游戏关卡列表加载数据*/
        case types.GAME_LIST.FETCH_LEVEL_LIST_START:
            return Object.assign({}, state, {isFetchLevelListProcessing: true});
        case types.GAME_LIST.FETCH_LEVEL_LIST_SUCCESS:
            imuState = Immutable.fromJS(state);
            payload = action.payload;
            if (!payload || !payload.game) return state;
            let selectedClazzId = imuState.get('selectedClazz').get('id');
            let index = findIndex(imuState.get('clazzListWithGames').get(selectedClazzId).toList().toJS(), {cgceId: state.selectedGame.cgceId});
            nextState = imuState.updateIn(['clazzListWithGames', selectedClazzId, index.toString()], function (val) {
                return val.set('levelList', Immutable.fromJS(payload.game.levels).toMap());
            });
            return Object.assign({}, state, nextState.toJS(), {isFetchLevelListProcessing: false});
        case types.GAME_LIST.FETCH_LEVEL_LIST_FAIL:
            return Object.assign({}, state, {errorInfo: payload.data, isFetchLevelListProcessing: false});





        /*检查游戏是否可玩*/
        case types.GAME_LIST.CHECK_IS_GAME_CAN_PLAY_START:
            return Object.assign({}, state, {isCheckGameCanPlayProcessing: true});
        case types.GAME_LIST.CHECK_IS_GAME_CAN_PLAY_SUCCESS:
            return Object.assign({}, state, {isCheckGameCanPlayProcessing: false});

        case types.PROFILE.SET_LOCAL_STATE_FOR_USER:
            return action.payload.game_list;
        case types.PROFILE.SET_DEFAULT_STATE_FOR_USER:
            nextState.selectedClazz = {};
            nextState.selectedGame = null;
            nextState.clazzListWithGames = {};
            nextState.paginationInfo.seq = 0;
            nextState.errorInfo = null;
            return nextState;
        default:
            return state;
    }
}