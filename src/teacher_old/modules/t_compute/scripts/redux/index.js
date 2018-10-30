/**
 * Created by ZL on 2018/3/15.
 */
import clazz_with_fighter_rank_data from './reducers/clazz_with_fighter_rank_data';
import fetch_fighter_rank_data_processing from './reducers/fetch_fighter_rank_data_processing';

let rootReducer = {
    clazz_with_fighter_rank_data,
    fetch_fighter_rank_data_processing,
};

export default rootReducer;