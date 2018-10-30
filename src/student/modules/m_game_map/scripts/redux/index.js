/**
 * Created by Administrator on 2017/5/4.
 */
import game_map_level_info from './reducers/game_map_level_info';
import game_goods_list from './reducers/game_goods_list';
import fetch_goods_list_processing from './reducers/fetch_goods_list_processing';
import select_game_goods from './reducers/select_game_goods';
import game_map_scene_list from './reducers/game_map_scene_list';
import game_map_scene_list_processing from './reducers/game_map_scene_list_processing';
import game_map_atlas_info from './reducers/game_map_atlas_info';
import game_map_atlas_processing from './reducers/game_map_atlas_processing';
import fetch_game_goods_create_order_processing from './reducers/fetch_game_goods_create_order_processing';
import query_game_goods_order_processing from './reducers/query_game_goods_order_processing';
import game_goods_created_order_info from './reducers/game_goods_created_order_info';

let rootReducer = {
    game_map_level_info,
    game_goods_list,
    fetch_goods_list_processing,
    select_game_goods,
    game_map_scene_list,
    game_map_scene_list_processing,
    game_map_atlas_info,
    game_map_atlas_processing,
    fetch_game_goods_create_order_processing,
    query_game_goods_order_processing,
    game_goods_created_order_info
};
export default rootReducer;