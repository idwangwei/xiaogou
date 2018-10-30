/**
 * Created by qiyuexi on 2017/12/7.
 */

import select_course from './reducers/select_course'
import select_my_course from './reducers/select_my_course'
import live_goods_created_order_info from './reducers/live_goods_created_order_info'
import alert_watch_video_flag from './reducers/alert_watch_video_flag'
import refresh_current_course_flag from './reducers/refresh_current_course_flag'

let rootReducer = {
    select_course,
    select_my_course,
    live_goods_created_order_info,
    alert_watch_video_flag,
    refresh_current_course_flag
};
export default rootReducer;