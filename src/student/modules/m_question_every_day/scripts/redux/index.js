/**
 * Created by ww on 2018/1/5.
 */
import fetch_question_every_day_list_processing from './reducers/fetch_question_every_day_list_processing';
import question_every_day_list_with_clazz from './reducers/question_every_day_list_with_clazz';
import question_every_day_selected_work from './reducers/question_every_day_selected_work';
let rootReducer={
    fetch_question_every_day_list_processing,
    question_every_day_list_with_clazz,
    question_every_day_selected_work
};
export default rootReducer;