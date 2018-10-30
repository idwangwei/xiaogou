/**
 * Created by ZL on 2018/3/22.
 */
import select_book_info from './reducers/select_book_info';
import select_ques_info from './reducers/select_ques_info';
import edit_ques_info from './reducers/edit_ques_info';
import temp_make_paper from './reducers/temp_make_paper';

let rootReducer = {
    select_book_info,
    select_ques_info,
    edit_ques_info,
    temp_make_paper
};

export default rootReducer;